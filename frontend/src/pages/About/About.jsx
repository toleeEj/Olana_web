import { useState, useEffect } from 'react';
import { 
  AcademicCapIcon, 
  BriefcaseIcon, 
  CpuChipIcon, 
  UserIcon,
  DocumentTextIcon,
  CalendarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

function About() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [educations, setEducations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [profileRes, skillsRes, eduRes, expRes, resumeRes] = await Promise.all([
          api.get('/core/profiles/'),
          api.get('/core/skills/'),
          api.get('/core/educations/'),
          api.get('/core/experiences/'),
          api.get('/core/resumes/'),
        ]);

        setSkills(Array.isArray(skillsRes.data.results) ? skillsRes.data.results : []);
        setEducations(Array.isArray(eduRes.data.results) ? eduRes.data.results : []);
        setExperiences(Array.isArray(expRes.data.results) ? expRes.data.results : []);
        setProfile(profileRes.data.results?.[0] || profileRes.data[0] || null);
        setResume(resumeRes.data.results?.[0] || resumeRes.data[0] || null);
      } catch (err) {
        console.error("Error fetching About data:", err);
        setSkills([]);
        setEducations([]);
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-emerald-600 text-lg">Loading profile details...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: UserIcon },
    { id: 'skills', label: 'Skills', icon: CpuChipIcon },
    { id: 'education', label: 'Education', icon: AcademicCapIcon },
    { id: 'experience', label: 'Experience', icon: BriefcaseIcon },
    { id: 'resume', label: 'Resume', icon: DocumentTextIcon },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Me</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn more about my journey, expertise, and philosophy in global health and medical education.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  inline-flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200 scale-105'
                    : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 shadow-md'
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Card with Animation */}
        <div 
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 border border-emerald-100/50"
          style={{
            animation: 'fadeInUp 0.6s ease-out',
          }}
        >
          {/* OVERVIEW */}
          {activeTab === 'overview' && profile && (
            <div className="text-center animate-fade-in">
              {profile.profile_image ? (
                <div className="relative inline-block mb-8 group">
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden ring-4 ring-emerald-100 group-hover:ring-emerald-300 transition-all duration-500">
                    <img
                      src={`${profile.profile_image}`}
                      alt={profile.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
              ) : (
                <div className="w-40 h-40 md:w-48 md:h-48 mx-auto rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-8">
                  <UserIcon className="w-20 h-20 text-emerald-400" />
                </div>
              )}
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{profile.full_name}</h2>
              <p className="text-xl text-emerald-600 mb-6">{profile.title}</p>
              <p className="text-gray-700 leading-relaxed text-lg max-w-3xl mx-auto">
                {profile.bio || "Professional summary coming soon..."}
              </p>
            </div>
          )}

          {/* SKILLS */}
          {activeTab === 'skills' && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
                <CpuChipIcon className="w-7 h-7 mr-3 text-emerald-600" />
                Skills & Expertise
              </h3>
              {skills.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {skills.map((skill, index) => (
                    <div
                      key={skill.id}
                      className="group bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both` }}
                    >
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full mb-3">
                        {skill.category}
                      </span>
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">{skill.name}</h4>
                      {skill.proficiency && (
                        <p className="text-gray-500 text-sm flex items-center">
                          <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                          {skill.proficiency}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-10 bg-gray-50 rounded-xl">
                  No skills added yet. Add some in Django Admin.
                </p>
              )}
            </div>
          )}

          {/* EDUCATION */}
          {activeTab === 'education' && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
                <AcademicCapIcon className="w-7 h-7 mr-3 text-emerald-600" />
                Education
              </h3>
              {educations.length > 0 ? (
                <div className="space-y-8">
                  {educations.map((edu, index) => (
                    <div
                      key={edu.id}
                      className="relative pl-8 border-l-4 border-emerald-200 hover:border-emerald-500 transition-colors group"
                      style={{ animation: `fadeInRight 0.5s ease-out ${index * 0.1}s both` }}
                    >
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-emerald-500 rounded-full group-hover:scale-125 transition-transform"></div>
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                        <div>
                          <h4 className="font-semibold text-xl text-gray-900">{edu.degree}</h4>
                          <p className="text-emerald-600 font-medium">{edu.institution}</p>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {edu.start_year} — {edu.end_year || 'Present'}
                        </div>
                      </div>
                      {edu.description && (
                        <p className="mt-3 text-gray-600">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-10 bg-gray-50 rounded-xl">
                  Education entries will appear here.
                </p>
              )}
            </div>
          )}

          {/* EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
                <BriefcaseIcon className="w-7 h-7 mr-3 text-emerald-600" />
                Professional Experience
              </h3>
              {experiences.length > 0 ? (
                <div className="space-y-8">
                  {experiences.map((exp, index) => (
                    <div
                      key={exp.id}
                      className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                      style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both` }}
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                        <div>
                          <h4 className="font-semibold text-xl text-gray-900">{exp.position}</h4>
                          <p className="text-emerald-600">{exp.organization}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}
                          </span>
                          {exp.is_current && (
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
                              Current
                            </span>
                          )}
                        </div>
                      </div>
                      {exp.description && (
                        <p className="mt-4 text-gray-600">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-10 bg-gray-50 rounded-xl">
                  Experience entries coming soon.
                </p>
              )}
            </div>
          )}

          {/* RESUME */}
          {activeTab === 'resume' && (
            <div className="text-center py-10 animate-fade-in">
              <DocumentTextIcon className="w-20 h-20 mx-auto text-emerald-500 mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Curriculum Vitae</h3>
              {resume?.pdf_file ? (
                <a
                  href={`http://127.0.0.1:8000${resume.pdf_file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <DocumentTextIcon className="w-5 h-5" />
                  Download Full CV (PDF)
                </a>
              ) : resume?.external_url ? (
                <a
                  href={resume.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-lg font-medium hover:underline"
                >
                  View Resume Online →
                </a>
              ) : (
                <p className="text-gray-500 bg-gray-50 p-8 rounded-xl max-w-md mx-auto">
                  No resume uploaded yet. You can add it in the Django admin panel.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default About;