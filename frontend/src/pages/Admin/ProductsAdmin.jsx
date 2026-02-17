import { useState, useEffect } from 'react';
import {
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  LinkIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    available: true,
    link: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/works/products/');
      setProducts(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description,
        price: item.price || '',
        available: item.available,
        link: item.link || '',
      });
      setImageFile(null);
      setPreviewImage(item.image ? `http://127.0.0.1:8000${item.image}` : null);
      setEditingId(item.id);
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        available: true,
        link: '',
      });
      setImageFile(null);
      setPreviewImage(null);
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (formData.price) data.append('price', formData.price);
    data.append('available', formData.available);
    data.append('link', formData.link);
    if (imageFile) data.append('image', imageFile);

    try {
      if (editingId) {
        await api.put(`/works/products/${editingId}/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/works/products/', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      fetchProducts();
      setShowModal(false);
    } catch (err) {
      console.error('Product save error:', err.response?.data || err);
      alert('Failed to save product/service. Check console.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product/service?')) {
      try {
        await api.delete(`/works/products/${id}/`);
        fetchProducts();
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-emerald-600 text-lg">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ShoppingBagIcon className="w-8 h-8 mr-3 text-emerald-600" />
            Products & Services
          </h1>
          <p className="text-gray-600 mt-1">Manage your offerings and booking options</p>
        </div>
        <button
          onClick={() => openModal()}
          className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md"
        >
          <PlusIcon className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
          Add New Product/Service
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-shadow bg-white/50 backdrop-blur-sm"
        />
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShoppingBagIcon className="w-6 h-6 text-emerald-600" />
            <span className="text-gray-700 font-medium">Total Products/Services:</span>
          </div>
          <span className="text-2xl font-bold text-emerald-600">{filteredProducts.length}</span>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {products.filter(p => p.available).length} available for booking
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Availability</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-emerald-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <ShoppingBagIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No products/services yet. Click "Add New Product/Service" to create one.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-emerald-50/50 transition-colors group"
                    style={{ animation: `fadeIn 0.5s ease-out ${index * 0.05}s both` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mr-3 mt-0.5">
                          <ShoppingBagIcon className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.title}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500 mt-1 line-clamp-1">{item.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.price ? (
                        <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">
                          <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                          {item.price}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.available ? (
                        <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          <CheckCircleIcon className="w-3 h-3 mr-1" />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          <XCircleIcon className="w-3 h-3 mr-1" />
                          Unavailable
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.image ? (
                        <div className="relative group/image">
                          <img
                            src={`http://127.0.0.1:8000${item.image}`}
                            alt={item.title}
                            className="h-12 w-12 object-cover rounded-lg shadow-md group-hover/image:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 rounded-lg transition-colors"></div>
                        </div>
                      ) : (
                        <div className="h-12 w-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                          <PhotoIcon className="w-6 h-6 text-emerald-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openModal(item)}
                        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium mr-4 transition-colors group/edit"
                      >
                        <PencilIcon className="w-4 h-4 mr-1 group-hover/edit:scale-110 transition-transform" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center text-red-600 hover:text-red-700 font-medium transition-colors group/delete"
                      >
                        <TrashIcon className="w-4 h-4 mr-1 group-hover/delete:scale-110 transition-transform" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-modal-slide-up">
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-5 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center">
                {editingId ? (
                  <>
                    <PencilIcon className="w-6 h-6 mr-3" />
                    Edit Product/Service
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-6 h-6 mr-3" />
                    Add New Product/Service
                  </>
                )}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8">
              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                    placeholder="e.g., Clinical Mentorship Program"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                    placeholder="Describe your product or service..."
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price <span className="text-gray-500 text-xs">(optional)</span>
                  </label>
                  <div className="relative">
                    <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="150.00"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Booking / Info Link <span className="text-gray-500 text-xs">(optional)</span>
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      placeholder="https://calendly.com/..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Availability Checkbox */}
                <div className="flex items-center p-4 bg-emerald-50 rounded-xl">
                  <input
                    type="checkbox"
                    name="available"
                    id="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                  />
                  <label htmlFor="available" className="ml-3 text-sm font-medium text-gray-700">
                    Available for booking
                  </label>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image <span className="text-gray-500 text-xs">(optional)</span>
                  </label>
                  <div className="flex flex-col space-y-4">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                      />
                    </div>
                    {previewImage && (
                      <div className="relative group/preview">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="h-32 object-cover rounded-xl border-2 border-emerald-100"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setPreviewImage(null);
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  {editingId ? 'Update Product/Service' : 'Create Product/Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-modal-slide-up {
          animation: modalSlideUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}