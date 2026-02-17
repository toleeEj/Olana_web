import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
  TagIcon,
  FolderIcon,
  EyeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

export default function BlogPostsAdmin() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    is_published: true,
    slug: '',
  });
  const [coverImage, setCoverImage] = useState(null);
  const [previewCover, setPreviewCover] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const normalizeArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    return [];
  };

  const fetchData = async () => {
    try {
      const [postsRes, catsRes] = await Promise.all([
        api.get('/blog/posts/'),
        api.get('/blog/categories/'),
      ]);

      setPosts(normalizeArray(postsRes.data));
      setCategories(normalizeArray(catsRes.data));
    } catch (err) {
      console.error('Failed to load blog data:', err);
      setPosts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = (posts || []).filter(post =>
    (post.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.tags || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewCover(URL.createObjectURL(file));
    }
  };

  const openModal = (post = null) => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        category: post.category?.id || '',
        tags: post.tags || '',
        is_published: post.is_published ?? true,
        slug: post.slug || '',
      });
      setPreviewCover(post.featured_image || null);
      setEditingId(post.id);
    } else {
      setFormData({
        title: '',
        content: '',
        category: '',
        tags: '',
        is_published: true,
        slug: '',
      });
      setPreviewCover(null);
      setEditingId(null);
    }
    setCoverImage(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('category', formData.category);
    data.append('tags', formData.tags);
    data.append('is_published', formData.is_published ? 'true' : 'false');

    if (formData.slug) {
      data.append('slug', formData.slug);
    }

    if (coverImage) {
      data.append('featured_image', coverImage);
    }

    try {
      if (editingId) {
        await api.put(`/blog/posts/${editingId}/`, data);
      } else {
        await api.post('/blog/posts/', data);
      }
      await fetchData();
      setShowModal(false);
    } catch (err) {
      console.error('Blog save error:', err.response?.data || err);
      alert('Failed to save blog post. Check console.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await api.delete(`/blog/posts/${id}/`);
      fetchData();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-emerald-600 text-lg">Loading blog posts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <DocumentTextIcon className="w-8 h-8 mr-3 text-emerald-600" />
            Blog Posts
          </h1>
          <p className="text-gray-600 mt-1">Manage your blog content and articles</p>
        </div>
        <button
          onClick={() => openModal()}
          className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md"
        >
          <PlusIcon className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
          New Blog Post
        </button>
      </div>

      {/* Search bar */}
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

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-emerald-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <DocumentTextIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No blog posts yet. Click "New Blog Post" to create one.</p>
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post, index) => (
                  <tr 
                    key={post.id} 
                    className="hover:bg-emerald-50/50 transition-colors group"
                    style={{ animation: `fadeIn 0.5s ease-out ${index * 0.05}s both` }}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{post.title}</div>
                      {post.slug && (
                        <div className="text-xs text-gray-500 mt-1">/{post.slug}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {post.category ? (
                        <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                          <FolderIcon className="w-3 h-3 mr-1" />
                          {post.category.name}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {post.is_published ? (
                        <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          <CheckCircleIcon className="w-3 h-3 mr-1" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                          <EyeIcon className="w-3 h-3 mr-1" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {post.featured_image ? (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="h-12 w-12 object-cover rounded-lg shadow-md"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                          <PhotoIcon className="w-6 h-6 text-emerald-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openModal(post)}
                        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium mr-4 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="inline-flex items-center text-red-600 hover:text-red-700 font-medium transition-colors"
                      >
                        <TrashIcon className="w-4 h-4 mr-1" />
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
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-modal-slide-up"
          >
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-5 flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center">
                {editingId ? (
                  <>
                    <PencilIcon className="w-6 h-6 mr-3" />
                    Edit Blog Post
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-6 h-6 mr-3" />
                    Create New Blog Post
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                    placeholder="Enter post title"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug <span className="text-gray-500 text-xs">(optional - auto-generated if empty)</span>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                    placeholder="my-first-article"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="relative">
                    <FolderIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="relative">
                    <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                      placeholder="global-health, medical-education"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                  <div className="flex items-start space-x-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                      />
                    </div>
                    {previewCover && (
                      <div className="relative group">
                        <img
                          src={previewCover}
                          alt="Preview"
                          className="h-16 w-16 object-cover rounded-lg shadow-md"
                        />
                        {coverImage && (
                          <button
                            type="button"
                            onClick={() => {
                              setCoverImage(null);
                              setPreviewCover(editingId ? post?.featured_image : null);
                            }}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                          >
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={10}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent font-mono text-sm"
                    placeholder="Write your article content here..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_published"
                      checked={formData.is_published}
                      onChange={handleChange}
                      className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Publish immediately</span>
                  </label>
                </div>
              </div>

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
                  {editingId ? 'Update Post' : 'Create Post'}
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