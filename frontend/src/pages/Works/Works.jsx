import { useState, useEffect } from 'react';
import { 
  BriefcaseIcon, 
  BeakerIcon, 
  CalendarIcon,
  StarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

function Works() {
  const [portfolios, setPortfolios] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('portfolios');

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const [portfolioRes, productRes] = await Promise.all([
          api.get('/works/portfolios/'),
          api.get('/works/products/'),
        ]);

        setPortfolios(
          Array.isArray(portfolioRes.data.results)
            ? portfolioRes.data.results
            : portfolioRes.data
        );
        setProducts(
          Array.isArray(productRes.data.results)
            ? productRes.data.results
            : productRes.data
        );
      } catch (err) {
        console.error("Error fetching Works data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-emerald-600 text-lg">Loading works...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'portfolios', label: 'Portfolios & Research', icon: BriefcaseIcon },
    { id: 'products', label: 'Products & Services', icon: BeakerIcon },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Works & <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Contributions</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Research, case studies, presentations, services, and programs
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  inline-flex items-center px-8 py-4 rounded-full font-semibold transition-all duration-300
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200 scale-105'
                    : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 shadow-md border border-gray-200'
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTab === 'portfolios' ? (
            portfolios.length > 0 ? (
              portfolios.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
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
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>

                    {/* Tags */}
                    {item.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.tags.split(',').map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {new Date(item.date || item.created_at).toLocaleDateString()}
                      </span>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-emerald-600 font-medium hover:text-emerald-700 transition-colors group/link"
                        >
                          View
                          <span className="ml-1 transform group-hover/link:translate-x-1 transition-transform">→</span>
                        </a>
                      )}
                    </div>

                    {/* Featured Badge */}
                    {item.is_featured && (
                      <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full shadow-lg flex items-center">
                        <StarIcon className="w-3 h-3 mr-1" />
                        Featured
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12">
                No portfolios added yet. Add some in Django Admin → Works → Portfolios.
              </p>
            )
          ) : (
            products.length > 0 ? (
              products.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                        <BeakerIcon className="w-12 h-12 text-emerald-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>

                    {item.price && (
                      <p className="flex items-center text-lg font-semibold text-emerald-600 mb-4">
                        <CurrencyDollarIcon className="w-5 h-5 mr-1" />
                        {item.price}
                      </p>
                    )}

                    <div className="flex justify-between items-center">
                      <span className={`flex items-center text-sm font-medium ${item.available ? 'text-emerald-600' : 'text-red-600'}`}>
                        {item.available ? (
                          <>
                            <CheckCircleIcon className="w-4 h-4 mr-1" />
                            Available
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="w-4 h-4 mr-1" />
                            Unavailable
                          </>
                        )}
                      </span>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                          {item.price ? 'Book Now' : 'Learn More'}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12">
                No products/services added yet. Add some in Django Admin → Works → Products.
              </p>
            )
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
        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Works;