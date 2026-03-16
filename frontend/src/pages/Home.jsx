import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BriefcaseIcon,
  AcademicCapIcon,
  MapPinIcon,
  ArrowRightIcon,
  SparklesIcon,
  WrenchIcon,
  LightBulbIcon,
  BookOpenIcon
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
        const token = localStorage.getItem('access');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [profileRes, portfoliosRes] = await Promise.all([
          api.get('/core/profiles/', { headers }),
          api.get('/works/portfolios/', { headers }),
        ]);

        const profileArray = Array.isArray(profileRes.data)
          ? profileRes.data
          : Array.isArray(profileRes.data.results)
            ? profileRes.data.results
            : [];
        setProfile(profileArray[0] || null);

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
        <div className="animate-pulse text-emerald-600 text-lg">
          Loading portfolio...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-red-500 bg-red-50 px-6 py-4 rounded-xl shadow-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 overflow-hidden">
      {/* Hero Section – with background image */}
      <section
        className="relative min-h-screen flex items-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/hero-doctor.jpg')`
        }}
      >
        {/* Overlay gradient: clear/transparent top → dark green/emerald bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(6, 95, 70, 0.05) 0%, rgba(6, 95, 70, 0.65) 50%, rgba(6, 95, 70, 0.92) 85%, rgba(6, 95, 70, 0.98) 100%)',

          }}
        />

        {/* Your content layer – remains unchanged */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left – Intro */}
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

              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight text-white">
                {profile?.full_name || 'Anonymous Doctor'}
              </h1>

              <p className="text-xl md:text-2xl text-emerald-200 mb-6 font-light">
                {profile?.title || 'Medical Professional'}
              </p>

              <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto md:mx-0">
                {(profile?.bio?.substring(0, 220) || 'No bio available.') + '...'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/about/#resume/"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-900 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  More About Me
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-emerald-900 transition-all duration-300 hover:scale-105"
                >
                  Get in Touch
                </Link>
              </div>
            </div>

            {/* Right – Quick Stats */}
            <div className="hidden md:grid grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <BriefcaseIcon className="w-8 h-8 text-emerald-300 mb-3" />
                <div className="text-3xl font-bold text-white">{profile?.years_experience || 0}+</div>
                <div className="text-emerald-200">Years Experience</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <AcademicCapIcon className="w-8 h-8 text-emerald-300 mb-3" />
                <div className="text-3xl font-bold text-white">
                  {profile?.specialization?.split(',')[0] || '—'}
                </div>
                <div className="text-emerald-200">Specialization</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 col-span-2">
                <MapPinIcon className="w-8 h-8 text-emerald-300 mb-3" />
                <div className="text-3xl font-bold text-white">Ethiopia & Rwanda</div>
                <div className="text-emerald-200">Clinical & Academic</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Overview – Skills / Education / Experience */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {/* Skills */}
            <Link
              to="/about/#skills"
              className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
            >
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                <WrenchIcon className="w-7 h-7 text-emerald-600 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Skills</h3>
              <p className="text-gray-600 mb-4">
                Clinical expertise, research methods, teaching, leadership and more...
              </p>
              <span className="inline-flex items-center text-emerald-600 font-medium group-hover:text-emerald-700">
                Explore skills <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {/* Education */}
            <Link
              to="/about/#education"
              className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <BookOpenIcon className="w-7 h-7 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Education</h3>
              <p className="text-gray-600 mb-4">
                Degrees, certifications, fellowships and continuous professional development.
              </p>
              <span className="inline-flex items-center text-emerald-600 font-medium group-hover:text-emerald-700">
                View education <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {/* Experience */}
            <Link
              to="/about/#experience"
              className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
            >
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-600 transition-colors">
                <BriefcaseIcon className="w-7 h-7 text-amber-600 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Experience</h3>
              <p className="text-gray-600 mb-4">
                Clinical roles, academic positions, leadership and key responsibilities.
              </p>
              <span className="inline-flex items-center text-emerald-600 font-medium group-hover:text-emerald-700">
                See experience <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Selected projects, publications, research initiatives and clinical innovations
            </p>
          </div>

          {featuredPortfolios.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No featured works yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredPortfolios.map((portfolio, index) => (
                <div
                  key={portfolio.id}
                  className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                >
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

                  {portfolio.is_featured && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                      Featured
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/works/portfolio"
              className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all hover:shadow-lg"
            >
              View All Works
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Products / Solutions / Tools */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Products & Innovations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tools, protocols, educational resources and healthcare solutions I’ve developed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* You can later fetch real product data – for now placeholder cards */}
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100"
              >
                <div className="h-48 bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                  <LightBulbIcon className="w-20 h-20 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Clinical Decision Tool {item}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    Innovative solution aimed at improving diagnostic accuracy and patient outcomes in resource-limited settings.
                  </p>
                  <Link
                    to="/works/"
                    className="inline-flex items-center text-emerald-600 font-medium hover:text-emerald-700"
                  >
                    Learn more <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/works/"
              className="inline-flex items-center px-8 py-4 border-2 border-emerald-600 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-all"
            >
              Explore All Products
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}

export default Home;