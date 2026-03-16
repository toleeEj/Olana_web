import { useState, useCallback } from 'react';
import adminApi from '../../services/adminApi';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import ImageUpload from '../../components/ImageUpload';
import { Plus, Package, DollarSign } from 'lucide-react';

export default function Product() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    link: '',
    available: true,
  });

  const [imageFile, setImageFile] = useState(null);

  const handleOpenCreate = useCallback(() => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      link: '',
      available: true,
    });
    setImageFile(null);
    setModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      price: item.price || '',
      link: item.link || '',
      available: item.available !== false, // default true
    });
    setImageFile(null);
    setModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((id) => {
    setItemToDelete(id);
    setConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!itemToDelete) return;
    try {
      await adminApi.delete(`/works/products/${itemToDelete}/`);
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
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
    payload.append('price', formData.price || '');
    payload.append('link', formData.link?.trim() || '');
    payload.append('available', formData.available);

    if (imageFile) {
      payload.append('image', imageFile);
    }

    try {
      if (editingItem) {
        await adminApi.patch(`/works/products/${editingItem.id}/`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await adminApi.post('/works/products/', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setModalOpen(false);
      setEditingItem(null);
      setImageFile(null);
      setFormData({
        title: '',
        description: '',
        price: '',
        link: '',
        available: true,
      });
    } catch (err) {
      console.error('Product save error:', err);
      alert('Failed to save product. Check console.');
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
      render: (item) =>
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
        ),
    },
    { key: 'title', label: 'Title' },
    {
      key: 'price',
      label: 'Price',
      render: (item) =>
        item.price ? (
          <span className="font-medium">
            ${parseFloat(item.price).toFixed(2)}
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'available',
      label: 'Status',
      render: (item) =>
        item.available ? (
          <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Available
          </span>
        ) : (
          <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">
            Unavailable
          </span>
        ),
    },
    {
      key: 'link',
      label: 'Booking Link',
      render: (item) =>
        item.link ? (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            Link
          </a>
        ) : (
          '—'
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Package size={32} className="text-blue-600" />
          Products / Services
        </h1>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B4D3E] text-white rounded-lg hover:bg-[#2E6B52] transition-colors"
        >
          <Plus size={18} /> Add Product/Service
        </button>
      </div>

      <DataTable
        endpoint="/works/products"
        columns={columns}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteClick}
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Product/Service' : 'Add Product/Service'}
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
              placeholder="e.g. Online Global Health Course"
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
              placeholder="What the service/program offers, who it's for, benefits..."
              required
            />
          </div>

          <ImageUpload
            label="Product/Service Image (optional)"
            existingImage={editingItem?.image}
            onUploadComplete={handleImageReady}
            accept="image/*"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (optional)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Booking/Registration Link (optional)
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/register"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Available for booking/purchase
            </label>
          </div>
        </div>
      </FormModal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Product/Service?"
        message="Are you sure? This cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}