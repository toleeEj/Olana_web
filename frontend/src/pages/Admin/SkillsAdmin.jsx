import { useState, useEffect } from 'react';
import {
  CpuChipIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  ChartBarIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

export default function SkillsAdmin() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: 'clinical',
    proficiency: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await api.get('/core/skills/');
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      setSkills(data);
    } catch (err) {
      console.error('Failed to fetch skills:', err);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = (skills || []).filter(skill =>
    (skill.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (skill.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (skill = null) => {
    if (skill) {
      setFormData({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency || '',
      });
      setEditingId(skill.id);
    } else {
      setFormData({ name: '', category: 'clinical', proficiency: '' });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/core/skills/${editingId}/`, formData);
      } else {
        await api.post('/core/skills/', formData);
      }
      fetchSkills();
      setShowModal(false);
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save skill.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await api.delete(`/core/skills/${id}/`);
        fetchSkills();
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete.');
      }
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      clinical: 'bg-blue-100 text-blue-700',
      technical: 'bg-purple-100 text-purple-700',
      soft: 'bg-green-100 text-green-700',
      language: 'bg-amber-100 text-amber-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-emerald-600 text-lg">Loading skills...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <CpuChipIcon className="w-8 h-8 mr-3 text-emerald-600" />
            Skills & Expertise
          </h1>
          <p className="text-gray-600 mt-1">Manage your professional skills and competencies</p>
        </div>
        <button
          onClick={() => openModal()}
          className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md"
        >
          <PlusIcon className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
          Add New Skill
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-shadow bg-white/50 backdrop-blur-sm"
        />
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CpuChipIcon className="w-6 h-6 text-emerald-600" />
            <span className="text-gray-700 font-medium">Total Skills:</span>
          </div>
          <span className="text-2xl font-bold text-emerald-600">{filteredSkills.length}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {['clinical', 'technical', 'soft', 'language'].map(cat => {
            const count = skills.filter(s => s.category === cat).length;
            if (count === 0) return null;
            return (
              <span key={cat} className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(cat)}`}>
                {cat}: {count}
              </span>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Skill Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Proficiency</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-emerald-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100">
              {filteredSkills.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <CpuChipIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No skills found. Click "Add New Skill" to create one.</p>
                  </td>
                </tr>
              ) : (
                filteredSkills.map((skill, index) => (
                  <tr 
                    key={skill.id} 
                    className="hover:bg-emerald-50/50 transition-colors group"
                    style={{ animation: `fadeIn 0.5s ease-out ${index * 0.05}s both` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mr-3">
                          <CpuChipIcon className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="font-medium text-gray-900">{skill.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(skill.category)}`}>
                        <TagIcon className="w-3 h-3 mr-1" />
                        {skill.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {skill.proficiency ? (
                        <div className="flex items-center">
                          <ChartBarIcon className="w-4 h-4 mr-2 text-emerald-500" />
                          <span className="text-sm text-gray-700">{skill.proficiency}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openModal(skill)}
                        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium mr-4 transition-colors group/edit"
                      >
                        <PencilIcon className="w-4 h-4 mr-1 group-hover/edit:scale-110 transition-transform" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-modal-slide-up">
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-5 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center">
                {editingId ? (
                  <>
                    <PencilIcon className="w-6 h-6 mr-3" />
                    Edit Skill
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-6 h-6 mr-3" />
                    Add New Skill
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
                {/* Skill Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <CpuChipIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                      placeholder="e.g., Clinical Research, Public Speaking"
                    />
                  </div>
                </div>

                {/* Category Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="clinical">Clinical</option>
                      <option value="technical">Technical</option>
                      <option value="soft">Soft Skills</option>
                      <option value="language">Language</option>
                    </select>
                  </div>
                </div>

                {/* Proficiency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proficiency <span className="text-gray-500 text-xs">(optional)</span>
                  </label>
                  <div className="relative">
                    <ChartBarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="proficiency"
                      value={formData.proficiency}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                      placeholder="e.g., Expert, Intermediate, Fluent"
                    />
                  </div>
                </div>

                {/* Example categories note */}
                <div className="bg-emerald-50 rounded-xl p-4">
                  <div className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-xs text-gray-600">
                      <p className="font-medium text-gray-700 mb-1">Category examples:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li><span className="font-medium">Clinical:</span> Patient Care, Diagnosis</li>
                        <li><span className="font-medium">Technical:</span> Data Analysis, Research</li>
                        <li><span className="font-medium">Soft:</span> Leadership, Communication</li>
                        <li><span className="font-medium">Language:</span> English, Amharic</li>
                      </ul>
                    </div>
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
                  {editingId ? 'Update Skill' : 'Create Skill'}
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