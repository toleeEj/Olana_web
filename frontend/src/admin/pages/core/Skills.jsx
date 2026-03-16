import { useState, useCallback } from 'react';
import DataTable from '../../components/DataTable';
import FormModal from '../../components/FormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Plus, Loader } from 'lucide-react';
import adminApi from '../../services/adminApi';

export default function Skills() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'clinical',
    proficiency: '',
  });

  const resetForm = useCallback(() => {
    setFormData({ name: '', category: 'clinical', proficiency: '' });
    setEditingSkill(null);
  }, []);

  const handleOpenCreate = useCallback(() => {
    resetForm();
    setModalOpen(true);
  }, [resetForm]);

  const handleOpenEdit = useCallback((skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || '',
      category: skill.category || 'clinical',
      proficiency: skill.proficiency || '',
    });
    setModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((id) => {
    setSkillToDelete(id);
    setConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!skillToDelete) return;
    try {
      await adminApi.delete(`/core/skills/${skillToDelete}/`);
    } catch (err) {
      alert('Delete failed');
    } finally {
      setConfirmOpen(false);
      setSkillToDelete(null);
    }
  }, [skillToDelete]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert('Skill name is required');
      return;
    }

    setSubmitting(true);
    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      proficiency: formData.proficiency?.trim() || null,
    };

    try {
      if (editingSkill) {
        await adminApi.patch(`/core/skills/${editingSkill.id}/`, payload);
      } else {
        await adminApi.post('/core/skills/', payload);
      }
      setModalOpen(false);
      resetForm();
    } catch (err) {
      alert('Save failed');
    } finally {
      setSubmitting(false);
    }
  }, [editingSkill, formData, resetForm]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const categoryColors = {
    clinical: 'bg-[#E6F3EB] text-[#1B4D3E]',
    technical: 'bg-[#E0F2FE] text-[#0369A1]',
    soft: 'bg-[#F3E8FF] text-[#6B21A8]',
    language: 'bg-[#FEF9C3] text-[#854D0E]',
  };

  const columns = [
    { key: 'name', label: 'Skill Name' },
    {
      key: 'category',
      label: 'Category',
      render: item => (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${categoryColors[item.category] || 'bg-gray-100 text-gray-800'}`}>
          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
        </span>
      )
    },
    { key: 'proficiency', label: 'Proficiency' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1B4D3E]">Skills</h1>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B4D3E] text-white rounded-lg hover:bg-[#2E6B52] transition-colors"
        >
          <Plus size={18} /> Add Skill
        </button>
      </div>

      <DataTable
        endpoint="/core/skills"
        columns={columns}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteClick}
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={editingSkill ? "Edit Skill" : "Add New Skill"}
        onSubmit={handleSubmit}
        isSubmitting={submitting}
        submitText={editingSkill ? "Update" : "Save"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1B4D3E] mb-1">
              Skill Name <span className="text-[#E8A87A]">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2.5 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#7ABF8E] focus:border-transparent"
              placeholder="e.g., Patient Assessment"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1B4D3E] mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2.5 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#7ABF8E] bg-white"
            >
              <option value="clinical">Clinical Skills</option>
              <option value="technical">Technical Skills</option>
              <option value="soft">Soft Skills</option>
              <option value="language">Languages</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1B4D3E] mb-1">Proficiency</label>
            <input
              type="text"
              name="proficiency"
              value={formData.proficiency}
              onChange={handleChange}
              className="w-full p-2.5 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#7ABF8E]"
              placeholder="e.g., Expert, Advanced"
            />
          </div>
        </div>
      </FormModal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Skill"
        message="Are you sure you want to delete this skill? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}