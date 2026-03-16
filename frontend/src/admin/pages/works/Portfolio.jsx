import { useState, useCallback } from 'react';
import adminApi from '../../services/adminApi';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import ImageUpload from '../../components/ImageUpload';
import { Plus, Image as ImageIcon, Star } from 'lucide-react';

export default function Portfolio() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    date: '',
    tags: '',
    is_featured: false,
  });

  const [imageFile, setImageFile] = useState(null); // File object for upload

  const handleOpenCreate = useCallback(() => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      link: '',
      date: '',
      tags: '',
      is_featured: false,
    });
    setImageFile(null);
    setModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      link: item.link || '',
      date: item.date || '',
      tags: item.tags || '',
      is_featured: item.is_featured || false,
    });
    setImageFile(null); // Reset file – only change if user uploads new one
    setModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((id) => {
    setItemToDelete(id);
    setConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!itemToDelete) return;
    try {
      await adminApi.delete(`/works/portfolios/${itemToDelete}/`);
    } catch (err) {
      console.error(err);
      alert('Failed to delete portfolio item');
    } finally {
      setConfirmOpen(false);
      setItemToDelete(null);
    }
  }, [itemToDelete]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!formData.title?.trim() || !formData.description?.trim()) {
      alert('Title and Description are required');
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title.trim());
    payload.append('description', formData.description.trim());
    payload.append('link', formData.link?.trim() || '');
    payload.append('date', formData.date || new Date().toISOString().split('T')[0]);
    payload.append('tags', formData.tags?.trim() || '');
    payload.append('is_featured', formData.is_featured);

    // Add image only if a new one was selected
    if (imageFile) {
      payload.append('image', imageFile);
    }

    try {
      if (editingItem) {
        // PATCH for update
        await adminApi.patch(`/works/portfolios/${editingItem.id}/`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // POST for create
        await adminApi.post('/works/portfolios/', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setModalOpen(false);
      setEditingItem(null);
      setImageFile(null);
      setFormData({
        title: '',
        description: '',
        link: '',
        date: '',
        tags: '',
        is_featured: false,
      });
    } catch (err) {
      console.error('Portfolio save error:', err);
      alert('Failed to save portfolio item. Check console for details.');
    }
  }, [editingItem, formData, imageFile]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleImageReady = useCallback((file) => {
    setImageFile(file);
  }, []);

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (item) => (
        item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-16 h-12 object-cover rounded shadow-sm"
          />
        ) : (
          <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
            No image
          </div>
        )
      ),
    },
    { key: 'title', label: 'Title' },
    {
      key: 'date',
      label: 'Date',
      render: (item) => new Date(item.date).toLocaleDateString(),
    },
    {
      key: 'is_featured',
      label: 'Featured',
      render: (item) =>
        item.is_featured ? (
          <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <Star size={12} fill="currentColor" /> Featured
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'tags',
      label: 'Tags',
      render: (item) => (
        <div className="max-w-xs truncate" title={item.tags || ''}>
          {item.tags || '—'}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <ImageIcon size={32} className="text-blue-600" />
          Portfolio
        </h1>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B4D3E] text-white rounded-lg hover:bg-[#2E6B52] transition-colors"
        >
          <Plus size={18} /> Add Portfolio Item
        </button>
      </div>

      <DataTable
        endpoint="/works/portfolios"
        columns={columns}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteClick}
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Research on Maternal Health in East Africa"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Brief summary of the work, outcomes, and impact..."
              required
            />
          </div>

          <ImageUpload
            label="Featured Image (optional)"
            existingImage={editingItem?.image}
            onUploadComplete={handleImageReady}
            accept="image/*"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">External Link (optional)</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/publication"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="research, global-health, presentation, rwanda"
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: global-health, medical-education, case-study
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Feature this item on the homepage
            </label>
          </div>
        </div>
      </FormModal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Portfolio Item?"
        message="Are you sure? This cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}