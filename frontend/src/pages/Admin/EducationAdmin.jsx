import { useState, useEffect } from 'react';
import {
  AcademicCapIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  BuildingLibraryIcon,
  CalendarIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

export default function EducationAdmin() {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    start_year: '',
    end_year: '',
    description: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      const res = await api.get('/core/educations/');
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.results)
          ? res.data.results
          : [];
      setEducations(data);
    } catch (err) {
      console.error('Failed to fetch education entries:', err);
      setEducations([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEducations = educations.filter(edu =>
    edu.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
    edu.degree.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (edu = null) => {
    if (edu) {
      setFormData({
        institution: edu.institution,
        degree: edu.degree,
        start_year: edu.start_year,
        end_year: edu.end_year || '',
        description: edu.description || '',
      });
      setEditingId(edu.id);
    } else {
      setFormData({
        institution: '',
        degree: '',
        start_year: '',
        end_year: '',
        description: '',
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/core/educations/${editingId}/`, formData);
      } else {
        await api.post('/core/educations/', formData);
      }
      fetchEducations();
      setShowModal(false);
    } catch (err) {
      console.error('Education save error:', err.response?.data || err);
      alert('Failed to save education entry. Check console.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this education entry?')) {
      try {
        await api.delete(`/core/educations/${id}/`);
        fetchEducations();
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-emerald-600 text-lg">Loading education entries...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <AcademicCapIcon className="w-8 h-8 mr-3 text-emerald-600" />
            Education
          </h1>
          <p className="text-gray-600 mt-1">Manage your academic qualifications and degrees</p>
        </div>
        <button
          onClick={() => openModal()}
          className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md"
        >
          <PlusIcon className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
          Add New Education
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by institution or degree..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-shadow bg-white/50 backdrop-blur-sm"
        />
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BuildingLibraryIcon className="w-6 h-6 text-emerald-600" />
            <span className="text-gray-700 font-medium">Total Education Entries:</span>
          </div>
          <span className="text-2xl font-bold text-emerald-600">{filteredEducations.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Degree</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Institution</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Years</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-emerald-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100">
              {filteredEducations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <AcademicCapIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No education entries yet. Click "Add New Education" to create one.</p>
                  </td>
                </tr>
              ) : (
                filteredEducations.map((edu, index) => (
                  <tr 
                    key={edu.id} 
                    className="hover:bg-emerald-50/50 transition-colors group"
                    style={{ animation: `fadeIn 0.5s ease-out ${index * 0.05}s both` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <BookOpenIcon className="w-5 h-5 mr-3 text-emerald-500" />
                        <div>
                          <div className="font-medium text-gray-900">{edu.degree}</div>
                          {edu.description && (
                            <div className="text-xs text-gray-500 mt-1 line-clamp-1">{edu.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">{edu.institution}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        {edu.start_year} — {edu.end_year || 'Present'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openModal(edu)}
                        className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium mr-4 transition-colors group/edit"
                      >
                        <PencilIcon className="w-4 h-4 mr-1 group-hover/edit:scale-110 transition-transform" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(edu.id)}
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
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-modal-slide-up"
          >
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-5 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center">
                {editingId ? (
                  <>
                    <PencilIcon className="w-6 h-6 mr-3" />
                    Edit Education Entry
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-6 h-6 mr-3" />
                    Add New Education
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
                {/* Institution */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <BuildingLibraryIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                      placeholder="e.g., University of Nairobi"
                    />
                  </div>
                </div>

                {/* Degree */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Degree <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <BookOpenIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                      placeholder="e.g., Master of Public Health"
                    />
                  </div>
                </div>

                {/* Years */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Year <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="start_year"
                        value={formData.start_year}
                        onChange={handleChange}
                        min="1900"
                        max="2100"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                        placeholder="2020"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Year <span className="text-gray-500 text-xs">(optional)</span>
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="end_year"
                        value={formData.end_year}
                        onChange={handleChange}
                        min="1900"
                        max="2100"
                        placeholder="2024"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                      />
                    </div>
                  </div>
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
                    placeholder="Key achievements, focus areas, thesis title, etc."
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
                  {editingId ? 'Update Education' : 'Create Education'}
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