import { useState, useCallback } from 'react';
import adminApi from '../../services/adminApi';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Plus, Briefcase } from 'lucide-react';

export default function Experience() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [formData, setFormData] = useState({
    organization: '',
    position: '',
    start_date: '',
    end_date: '',
    description: '',
    is_current: false,
  });

  const handleOpenCreate = useCallback(() => {
    setEditingItem(null);
    setFormData({
      organization: '',
      position: '',
      start_date: '',
      end_date: '',
      description: '',
      is_current: false,
    });
    setModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((item) => {
    setEditingItem(item);
    setFormData({
      organization: item.organization || '',
      position: item.position || '',
      start_date: item.start_date || '',
      end_date: item.end_date || '',
      description: item.description || '',
      is_current: item.is_current || false,
    });
    setModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((id) => {
    setItemToDelete(id);
    setConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!itemToDelete) return;
    try {
      await adminApi.delete(`/core/experiences/${itemToDelete}/`);
    } catch (err) {
      console.error(err);
      alert('Failed to delete experience entry');
    } finally {
      setConfirmOpen(false);
      setItemToDelete(null);
    }
  }, [itemToDelete]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!formData.organization?.trim() || !formData.position?.trim() || !formData.start_date) {
      alert('Organization, Position, and Start Date are required');
      return;
    }

    const payload = {
      organization: formData.organization.trim(),
      position: formData.position.trim(),
      start_date: formData.start_date,
      end_date: formData.end_date || null,
      description: formData.description?.trim() || null,
      is_current: formData.is_current,
    };

    try {
      if (editingItem) {
        await adminApi.patch(`/core/experiences/${editingItem.id}/`, payload);
      } else {
        await adminApi.post('/core/experiences/', payload);
      }

      setModalOpen(false);
      setEditingItem(null);
      setFormData({
        organization: '',
        position: '',
        start_date: '',
        end_date: '',
        description: '',
        is_current: false,
      });
    } catch (err) {
      console.error(err);
      alert('Failed to save experience entry. Check console.');
    }
  }, [editingItem, formData]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const columns = [
    { key: 'position', label: 'Position' },
    { key: 'organization', label: 'Organization' },
    {
      key: 'date_range',
      label: 'Date Range',
      render: (item) => (
        <span>
          {new Date(item.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
          {' – '}
          {item.is_current
            ? 'Present'
            : item.end_date
            ? new Date(item.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
            : '—'}
        </span>
      ),
    },
    {
      key: 'is_current',
      label: 'Current',
      render: (item) => (
        item.is_current ? (
          <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Current
          </span>
        ) : (
          '—'
        )
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (item) => (
        <div className="max-w-xs truncate" title={item.description || ''}>
          {item.description || '—'}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Briefcase size={32} className="text-blue-600" />
          Professional Experience
        </h1>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B4D3E] text-white rounded-lg hover:bg-[#2E6B52] transition-colors"
        >
          <Plus size={18} /> Add Experience
        </button>
      </div>

      <DataTable
        endpoint="/core/experiences"
        columns={columns}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteClick}
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Experience' : 'Add Experience'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Ministry of Health, Rwanda"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. General Practitioner & Lecturer"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date (optional if current)
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={formData.is_current}
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_current"
              checked={formData.is_current}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 block text-sm text-gray-700">
              This is my current position
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Key responsibilities, achievements, etc..."
            />
          </div>
        </div>
      </FormModal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Experience Entry?"
        message="Are you sure? This cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}