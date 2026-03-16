// src/admin/pages/blog/BlogPosts.jsx
import { useState, useCallback } from 'react';
import adminApi from '../../services/adminApi';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import ImageUpload from '../../components/ImageUpload';
import { Plus, FileText } from 'lucide-react';

export default function BlogPosts() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    published_date: '',
    is_published: true,
  });

  const [featuredImage, setFeaturedImage] = useState(null); // File object

  const handleOpenCreate = useCallback(() => {
    setEditingPost(null);
    setFormData({
      title: '',
      content: '',
      tags: '',
      published_date: new Date().toISOString().split('T')[0],
      is_published: true,
    });
    setFeaturedImage(null);
    setModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      content: post.content || '',
      tags: post.tags || '',
      published_date: post.published_date?.split('T')[0] || '',
      is_published: post.is_published !== false,
    });
    setFeaturedImage(null);
    setModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((id) => {
    setPostToDelete(id);
    setConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!postToDelete) return;
    try {
      await adminApi.delete(`/blog/posts/${postToDelete}/`);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete post');
    } finally {
      setConfirmOpen(false);
      setPostToDelete(null);
    }
  }, [postToDelete]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!formData.title?.trim() || !formData.content?.trim()) {
      alert('Title and Content are required');
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title.trim());
    payload.append('content', formData.content.trim());
    payload.append('tags', formData.tags?.trim() || '');
    payload.append('published_date', formData.published_date || '');
    payload.append('is_published', formData.is_published);

    if (featuredImage) {
      payload.append('featured_image', featuredImage);
    }

    // No category is sent → backend should set it to null or default

    try {
      let res;
      if (editingPost) {
        console.log('Updating post ID:', editingPost.id);
        res = await adminApi.patch(`/blog/posts/${editingPost.id}/`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        console.log('Creating new post');
        res = await adminApi.post('/blog/posts/', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      console.log('Save response:', res.data);

      setModalOpen(false);
      setEditingPost(null);
      setFeaturedImage(null);
      alert('Post saved successfully!');
    } catch (err) {
      console.error('Blog post save failed:', err);
      if (err.response?.data) {
        console.log('Server errors:', err.response.data);
        alert(`Error: ${JSON.stringify(err.response.data)}`);
      } else {
        alert('Failed to save blog post. Check console.');
      }
    }
  }, [editingPost, formData, featuredImage]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleImageReady = useCallback((file) => {
    setFeaturedImage(file);
  }, []);

  const columns = [
    {
      key: 'featured_image',
      label: 'Image',
      render: (item) =>
        item.featured_image ? (
          <img src={item.featured_image} alt="" className="w-16 h-10 object-cover rounded" />
        ) : (
          '—'
        ),
    },
    { key: 'title', label: 'Title' },
    {
      key: 'published_date',
      label: 'Published',
      render: (item) =>
        item.published_date ? new Date(item.published_date).toLocaleDateString() : '—',
    },
    {
      key: 'is_published',
      label: 'Status',
      render: (item) =>
        item.is_published ? (
          <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs">
            Published
          </span>
        ) : (
          <span className="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full text-xs">
            Draft
          </span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FileText size={32} className="text-blue-600" />
          Blog Posts
        </h1>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B4D3E] text-white rounded-lg hover:bg-[#2E6B52] transition-colors"
        >
          <Plus size={18} /> New Post
        </button>
      </div>

      <DataTable
        endpoint="/blog/posts"
        columns={columns}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteClick}
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPost ? 'Edit Post' : 'Create New Post'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={10}
              className="w-full p-3 border rounded-lg font-mono whitespace-pre-wrap"
              placeholder="Write your post here..."
              required
            />
          </div>

          <ImageUpload
            label="Featured Image"
            existingImage={editingPost?.featured_image}
            onUploadComplete={handleImageReady}
            accept="image/*"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                placeholder="global-health, rwanda, lecture"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Publish Date</label>
              <input
                type="date"
                name="published_date"
                value={formData.published_date}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center pt-4">
            <input
              type="checkbox"
              name="is_published"
              checked={formData.is_published}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              Publish immediately
            </label>
          </div>
        </div>
      </FormModal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Post?"
        message="This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}