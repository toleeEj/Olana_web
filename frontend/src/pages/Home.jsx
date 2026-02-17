import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BriefcaseIcon, 
  AcademicCapIcon, 
  MapPinIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';

function Home() {
  const [profile, setProfile] = useState(null);
  const [featuredPortfolios, setFeaturedPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [profileRes, portfoliosRes] = await Promise.all([
          api.get('/core/profiles/'),
          api.get('/works/portfolios/'),
        ]);

        setProfile(profileRes.data[0] || null);

        const portfoliosArray = Array.isArray(portfoliosRes.data)
          ? portfoliosRes.data
          : Array.isArray(portfoliosRes.data.results)
            ? portfoliosRes.data.results
            : [];

        setFeaturedPortfolios(
          portfoliosArray.filter(p => p.is_featured).slice(0, 4)
        );
      } catch (err) {
        console.error('Failed to fetch home data:', err);
        setError('Could not load content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-emerald-600 text-lg">Loading Dr. Olana's portfolio...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-red-500 bg-red-50 px-6 py-4 rounded-xl shadow-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="pt-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-teal-800 to-gray-900 text-white">
        {/* Simple overlay for texture (no inline SVG) */}
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="text-center md:text-left animate-fade-in-up">
              {profile?.profile_image && (
                <div className="relative inline-block mb-8 group">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-white/30 group-hover:ring-emerald-400 transition-all duration-500">
                    <img
                      src={profile.profile_image}
                      alt={profile.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <SparklesIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                {profile?.full_name || 'Dr. Olana Wakoya Gichile'}
              </h1>
              
              <p className="text-xl md:text-2xl text-emerald-200 mb-6 font-light">
                {profile?.title || 'MD, MSc | Lecturer & General Practitioner | Global Health Educator'}
              </p>
              
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto md:mx-0">
                {profile?.bio?.substring(0, 200) + '...' || 'Dedicated clinician-educator focused on global health equity, medical education, and community health development across Ethiopia and Rwanda.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/about/resume"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-800 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  View Resume
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-emerald-800 transition-all duration-300 hover:scale-105"
                >
                  Get in Touch
                </Link>
              </div>
            </div>

            {/* Right Column - decorative stats */}
            <div className="hidden md:grid grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <BriefcaseIcon className="w-8 h-8 text-emerald-300 mb-3" />
                <div className="text-3xl font-bold">{profile?.years_experience || 12}+</div>
                <div className="text-emerald-200">Years Experience</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <AcademicCapIcon className="w-8 h-8 text-emerald-300 mb-3" />
                <div className="text-3xl font-bold">Global</div>
                <div className="text-emerald-200">Health Focus</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 col-span-2">
                <MapPinIcon className="w-8 h-8 text-emerald-300 mb-3" />
                <div className="text-3xl font-bold">Ethiopia & Rwanda</div>
                <div className="text-emerald-200">Clinical & Academic</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Quick Highlights (mobile friendly) */}
      <section className="py-16 px-4 bg-gray-50 md:hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <BriefcaseIcon className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-700">{profile?.years_experience || 12}+</div>
            <div className="text-gray-600">Years Experience</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <AcademicCapIcon className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-700">Global Health</div>
            <div className="text-gray-600">Specialization</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <MapPinIcon className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-700">Ethiopia & Rwanda</div>
            <div className="text-gray-600">Focus Regions</div>
          </div>
        </div>
      </section>

      {/* Featured Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">A selection of impactful projects, research, and initiatives</p>
          </div>

          {featuredPortfolios.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No featured works yet. Mark some portfolios as featured in admin.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredPortfolios.map((portfolio, index) => (
                <div
                  key={portfolio.id}
                  className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                >
                  {/* Image with overlay */}
                  <div className="relative h-48 overflow-hidden">
                    {portfolio.image ? (
                      <img
                        src={portfolio.image}
                        alt={portfolio.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                        <BriefcaseIcon className="w-12 h-12 text-emerald-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {portfolio.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{portfolio.description}</p>

                    {portfolio.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {portfolio.tags.split(',').slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {portfolio.link && (
                      <a
                        href={portfolio.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                      >
                        View Details 
                        <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </a>
                    )}
                  </div>

                  {/* Featured badge */}
                  {portfolio.is_featured && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                      Featured
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 overflow-hidden">
        {/* Simple overlay for depth */}
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in-up">
            Ready to Collaborate or Consult?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Whether you're a student, institution, or organization interested in global health education, clinical mentorship, or consulting — let's connect.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center justify-center bg-white text-emerald-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            Send a Message Now
            <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

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
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Home;