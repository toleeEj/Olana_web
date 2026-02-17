import { useState, useEffect } from 'react';
import {
  BriefcaseIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

export default function ExperienceAdmin() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    organization: '',
    position: '',
    start_date: '',
    end_date: '',
    description: '',
    is_current: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await api.get('/core/experiences/');
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.results)
          ? res.data.results
          : [];
      setExperiences(data);
    } catch (err) {
      console.error('Failed to fetch experiences:', err);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredExperiences = experiences.filter(exp =>
    exp.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const openModal = (exp = null) => {
    if (exp) {
      setFormData({
        organization: exp.organization,
        position: exp.position,
        start_date: exp.start_date,
        end_date: exp.end_date || '',
        description: exp.description || '',
        is_current: exp.is_current,
      });
      setEditingId(exp.id);
    } else {
      setFormData({
        organization: '',
        position: '',
        start_date: '',
        end_date: '',
        description: '',
        is_current: false,
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/core/experiences/${editingId}/`, formData);
      } else {
        await api.post('/core/experiences/', formData);
      }
      fetchExperiences();
      setShowModal(false);
    } catch (err) {
      console.error('Experience save error:', err.response?.data || err);
      alert('Failed to save experience entry. Check console.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this experience entry?')) {
      try {
        await api.delete(`/core/experiences/${id}/`);
        fetchExperiences();
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-emerald-600 text-lg">Loading experience entries...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BriefcaseIcon className="w-8 h-8 mr-3 text-emerald-600" />
            Professional Experience
          </h1>
          <p className="text-gray-600 mt-1">Manage your work history and professional roles</p>
        </div>
        <button
          onClick={() => openModal()}
          className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md"
        >
          <PlusIcon className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
          Add New Experience
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by organization or position..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-shadow bg-white/50 backdrop-blur-sm"
        />
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BriefcaseIcon className="w-6 h-6 text-emerald-600" />
            <span className="text-gray-700 font-medium">Total Experience Entries:</span>
          </div>
          <span className="text-2xl font-bold text-emerald-600">{filteredExperiences.length}</span>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {experiences.filter(e => e.is_current).length} current positions
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Position</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Period</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-emerald-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100">
              {filteredExperiences.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <BriefcaseIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No experience entries yet. Click "Add New Experience" to create one.</p>
                  </td>
                </tr>
              ) : (
                filteredExperiences.map((exp, index) => (
                  <tr 
                    key={exp.id} 
                    className="hover:bg-emerald-50/50 transition-colors group"
                    style={{ animation: `fadeIn 0.5s ease-out ${index * 0.05}s both` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mr-3">
                          <BriefcaseIcon className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{exp.position}</div>
                          {exp.description && (
                            <div className="text-xs text-gray-500 mt-1 line-clamp-1">{exp.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-700">{exp.organization}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date || 'Unknown'}
                        </span>
                        {exp.is_current && (
                          <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            <CheckCircleIcon className="w-3 h-3 mr-1" />
                            Current
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openModal(exp)}
                        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium mr-4 transition-colors group/edit"
                      >
                        <PencilIcon className="w-4 h-4 mr-1 group-hover/edit:scale-110 transition-transform" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
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
                    Edit Experience
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-6 h-6 mr-3" />
                    Add New Experience
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
                {/* Organization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <BuildingOfficeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                      placeholder="e.g., Ministry of Health"
                    />
                  </div>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <BriefcaseIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                      placeholder="e.g., Senior Medical Officer"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date <span className="text-gray-500 text-xs">(optional)</span>
                    </label>
                    <div className="relative">
                      <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        disabled={formData.is_current}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent ${
                          formData.is_current ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Current Position Checkbox */}
                <div className="flex items-center p-4 bg-emerald-50 rounded-xl">
                  <input
                    type="checkbox"
                    name="is_current"
                    id="is_current"
                    checked={formData.is_current}
                    onChange={(e) => {
                      handleChange(e);
                      if (e.target.checked) {
                        setFormData(prev => ({ ...prev, end_date: '' }));
                      }
                    }}
                    className="h-5 w-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                  />
                  <label htmlFor="is_current" className="ml-3 text-sm font-medium text-gray-700">
                    This is my current position (ongoing)
                  </label>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-gray-500 text-xs">(optional)</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                    placeholder="Key responsibilities, achievements, impact, etc."
                  />
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
                  {editingId ? 'Update Experience' : 'Create Experience'}
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