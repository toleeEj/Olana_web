import { useState, useEffect } from 'react';
import {
  FolderIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
  TagIcon,
  LinkIcon,
  CalendarIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

export default function PortfoliosAdmin() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    tags: '',
    is_featured: false,
    date: new Date().toISOString().split('T')[0],
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const res = await api.get('/works/portfolios/');
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.results || [];
      setPortfolios(data);
    } catch (err) {
      console.error('Failed to fetch portfolios:', err);
      setPortfolios([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPortfolios = (portfolios || []).filter(item =>
    (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.tags || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
        title: item.title || '',
        description: item.description || '',
        link: item.link || '',
        tags: item.tags || '',
        is_featured: item.is_featured || false,
        date: item.date || new Date().toISOString().split('T')[0],
      });
      setPreviewImage(item.image || null);
      setEditingId(item.id);
    } else {
      setFormData({
        title: '',
        description: '',
        link: '',
        tags: '',
        is_featured: false,
        date: new Date().toISOString().split('T')[0],
      });
      setPreviewImage(null);
      setEditingId(null);
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('link', formData.link);
    data.append('tags', formData.tags);
    data.append('is_featured', formData.is_featured ? 'true' : 'false');
    data.append('date', formData.date);

    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (editingId) {
        await api.put(`/works/portfolios/${editingId}/`, data);
      } else {
        await api.post('/works/portfolios/', data);
      }
      await fetchPortfolios();
      setShowModal(false);
    } catch (err) {
      console.error('Portfolio save error:', err.response?.data || err);
      alert('Failed to save portfolio. Check console.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this portfolio?')) return;
    try {
      await api.delete(`/works/portfolios/${id}/`);
      fetchPortfolios();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-emerald-600 text-lg">Loading portfolios...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FolderIcon className="w-8 h-8 mr-3 text-emerald-600" />
            Portfolios
          </h1>
          <p className="text-gray-600 mt-1">Manage your portfolio projects and case studies</p>
        </div>
        <button
          onClick={() => openModal()}
          className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md"
        >
          <PlusIcon className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
          Add New Portfolio
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by title or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-shadow bg-white/50 backdrop-blur-sm"
        />
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FolderIcon className="w-6 h-6 text-emerald-600" />
            <span className="text-gray-700 font-medium">Total Portfolio Items:</span>
          </div>
          <span className="text-2xl font-bold text-emerald-600">{filteredPortfolios.length}</span>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {portfolios.filter(p => p.is_featured).length} featured items
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-emerald-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100">
              {filteredPortfolios.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <FolderIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No portfolio items yet. Click "Add New Portfolio" to create one.</p>
                  </td>
                </tr>
              ) : (
                filteredPortfolios.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-emerald-50/50 transition-colors group"
                    style={{ animation: `fadeIn 0.5s ease-out ${index * 0.05}s both` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mr-3 mt-0.5">
                          <FolderIcon className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.title}</div>
                          {item.tags && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.tags.split(',').slice(0, 2).map((tag, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                                  {tag.trim()}
                                </span>
                              ))}
                              {item.tags.split(',').length > 2 && (
                                <span className="text-xs text-gray-500">+{item.tags.split(',').length - 2}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.image ? (
                        <div className="relative group/image">
                          <img
                            src={item.image}
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
                    <td className="px-6 py-4">
                      {item.is_featured ? (
                        <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                          <StarIcon className="w-3 h-3 mr-1" />
                          Featured
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">No</span>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-modal-slide-up">
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-5 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center">
                {editingId ? (
                  <>
                    <PencilIcon className="w-6 h-6 mr-3" />
                    Edit Portfolio
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-6 h-6 mr-3" />
                    Add New Portfolio
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title - Full width */}
                <div className="md:col-span-2">
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
                    placeholder="e.g., Global Health Initiative 2024"
                  />
                </div>

                {/* Description - Full width */}
                <div className="md:col-span-2">
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
                    placeholder="Describe your project, research, or case study..."
                  />
                </div>

                {/* Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Link
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="relative">
                    <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                      placeholder="research, case study, global health"
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Featured Checkbox */}
                <div className="flex items-center">
                  <div className="flex items-center p-4 bg-emerald-50 rounded-xl">
                    <input
                      type="checkbox"
                      name="is_featured"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                    />
                    <label htmlFor="is_featured" className="ml-3 text-sm font-medium text-gray-700">
                      <StarIcon className="w-4 h-4 inline mr-1 text-yellow-500" />
                      Featured item
                    </label>
                  </div>
                </div>

                {/* Image Upload - Full width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image
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
                          className="h-40 object-cover rounded-xl border-2 border-emerald-100"
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
                  {editingId ? 'Update Portfolio' : 'Create Portfolio'}
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