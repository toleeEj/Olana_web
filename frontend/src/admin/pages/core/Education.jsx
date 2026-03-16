import { useState, useCallback } from 'react';
import adminApi from '../../services/adminApi';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Plus, GraduationCap } from 'lucide-react';

export default function Education() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    start_year: '',
    end_year: '',
    description: '',
  });

  const handleOpenCreate = useCallback(() => {
    setEditingItem(null);
    setFormData({
      institution: '',
      degree: '',
      start_year: '',
      end_year: '',
      description: '',
    });
    setModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((item) => {
    setEditingItem(item);
    setFormData({
      institution: item.institution || '',
      degree: item.degree || '',
      start_year: item.start_year || '',
      end_year: item.end_year || '',
      description: item.description || '',
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
      await adminApi.delete(`/core/educations/${itemToDelete}/`);
    } catch (err) {
      console.error(err);
      alert('Failed to delete education entry');
    } finally {
      setConfirmOpen(false);
      setItemToDelete(null);
    }
  }, [itemToDelete]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!formData.institution?.trim() || !formData.degree?.trim() || !formData.start_year) {
      alert('Institution, Degree, and Start Year are required');
      return;
    }

    const payload = {
      institution: formData.institution.trim(),
      degree: formData.degree.trim(),
      start_year: parseInt(formData.start_year, 10),
      end_year: formData.end_year ? parseInt(formData.end_year, 10) : null,
      description: formData.description?.trim() || null,
    };

    try {
      if (editingItem) {
        await adminApi.patch(`/core/educations/${editingItem.id}/`, payload);
      } else {
        await adminApi.post('/core/educations/', payload);
      }

      setModalOpen(false);
      setEditingItem(null);
      setFormData({
        institution: '',
        degree: '',
        start_year: '',
        end_year: '',
        description: '',
      });
    } catch (err) {
      console.error(err);
      alert('Failed to save education entry');
    }
  }, [editingItem, formData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const columns = [
    { key: 'degree', label: 'Degree' },
    { key: 'institution', label: 'Institution' },
    {
      key: 'years',
      label: 'Years',
      render: (item) => (
        <span>
          {item.start_year}
          {item.end_year ? ` – ${item.end_year}` : ' – Present'}
        </span>
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
          <GraduationCap size={32} className="text-blue-600" />
          Education
        </h1>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B4D3E] text-white rounded-lg hover:bg-[#2E6B52] transition-colors"
        >
          <Plus size={18} /> Add Education
        </button>
      </div>

      <DataTable
        endpoint="/core/educations"
        columns={columns}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteClick}
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Education' : 'Add Education'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Institution <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Harvard University"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Degree <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Doctor of Medicine (MD)"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="start_year"
                value={formData.start_year}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 2010"
                min="1900"
                max={new Date().getFullYear() + 5}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Year (optional)
              </label>
              <input
                type="number"
                name="end_year"
                value={formData.end_year}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 2016 or leave blank"
                min={formData.start_year || 1900}
                max={new Date().getFullYear() + 5}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Specialized in Internal Medicine with focus on global health..."
            />
          </div>
        </div>
      </FormModal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Education Entry?"
        message="Are you sure? This cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}