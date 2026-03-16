import { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import ImageUpload from '../../components/ImageUpload';
import { User, Save, X, Edit2, AlertCircle, Loader } from 'lucide-react';

export default function Profiles() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/core/profiles/');
      if (res.data.results?.length > 0) {
        const mainProfile = res.data.results[0];
        setProfile(mainProfile);
        setFormData(mainProfile);
      } else {
        setError("No profile found");
      }
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile?.id) return;
    
    setSubmitting(true);
    const submitData = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key !== 'profile_image' && formData[key] != null) {
        submitData.append(key, formData[key]);
      }
    });
    
    if (imageFile) submitData.append('profile_image', imageFile);

    try {
      const res = await adminApi.patch(`/core/profiles/${profile.id}/`, submitData);
      setProfile(res.data);
      setFormData(res.data);
      setIsEditing(false);
      setImageFile(null);
    } catch (err) {
      alert("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData(profile);
    setImageFile(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size={32} className="animate-spin text-[#1B4D3E]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FEF2F2] border border-[#E8A87A] text-[#1B4D3E] p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle size={20} className="text-[#E8A87A]" />
          <p>{error}</p>
        </div>
        <button onClick={fetchProfile} className="px-4 py-2 bg-[#1B4D3E] text-white rounded-lg">
          Try Again
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-[#E2E8F0]">
        <User size={48} className="mx-auto mb-3 text-[#7ABF8E]" />
        <p className="text-[#1B4D3E] font-medium">No profile found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B4D3E]">Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1B4D3E] text-white rounded-lg hover:bg-[#2E6B52] transition-colors"
          >
            <Edit2 size={16} /> Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1B4D3E] mb-1">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name || ''}
                onChange={handleChange}
                className="w-full p-2.5 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#7ABF8E] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1B4D3E] mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                className="w-full p-2.5 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#7ABF8E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1B4D3E] mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={handleChange}
              rows={5}
              className="w-full p-2.5 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#7ABF8E]"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1B4D3E] mb-1">Experience (years)</label>
              <input
                type="number"
                name="years_experience"
                value={formData.years_experience || ''}
                onChange={handleChange}
                className="w-full p-2.5 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#7ABF8E]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1B4D3E] mb-1">Specialization</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization || ''}
                onChange={handleChange}
                className="w-full p-2.5 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#7ABF8E]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1B4D3E] mb-1">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin_url"
                value={formData.linkedin_url || ''}
                onChange={handleChange}
                className="w-full p-2.5 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#7ABF8E]"
              />
            </div>
          </div>

          <ImageUpload
            label="Profile Image"
            existingImage={formData.profile_image}
            onUploadComplete={setImageFile}
          />

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={cancelEdit} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-[#1B4D3E] text-white rounded-lg hover:bg-[#2E6B52] disabled:opacity-50 flex items-center gap-2">
              {submitting && <Loader size={14} className="animate-spin" />}
              <Save size={14} /> Save
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          <div className="p-6 border-b bg-[#F8FAF5]">
            <div className="flex gap-6">
              {profile.profile_image ? (
                <img src={profile.profile_image} alt={profile.full_name} className="w-32 h-32 object-cover rounded-lg border-2 border-white shadow-sm" />
              ) : (
                <div className="w-32 h-32 bg-[#7ABF8E] bg-opacity-20 rounded-lg flex items-center justify-center text-[#1B4D3E]">
                  <User size={32} />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-[#1B4D3E]">{profile.full_name}</h2>
                <p className="text-[#7ABF8E] mt-1">{profile.title}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><span className="text-[#5B6E6B]">Experience:</span> <span className="font-medium text-[#1B4D3E]">{profile.years_experience || '—'} years</span></div>
              <div><span className="text-[#5B6E6B]">Specialization:</span> <span className="font-medium text-[#1B4D3E]">{profile.specialization || '—'}</span></div>
              {profile.linkedin_url && (
                <div><span className="text-[#5B6E6B]">LinkedIn:</span> <a href={profile.linkedin_url} target="_blank" rel="noopener" className="text-[#7ABF8E] hover:underline">Profile</a></div>
              )}
            </div>
            
            <div>
              <h3 className="font-medium text-[#1B4D3E] mb-2">Biography</h3>
              <p className="text-[#5B6E6B] text-sm leading-relaxed">{profile.bio || 'No biography added'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}