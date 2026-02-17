import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/blog/posts/');
        const data = Array.isArray(response.data.results)
          ? response.data.results
          : response.data;
        setPosts(data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-emerald-600 text-lg">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Health & Medical <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Insights</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Articles, research commentary, and health education from Dr. Olana
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12 relative group animate-fade-in-up">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Search articles by title or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm"
          />
        </div>

        {/* Blog Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <article
                key={post.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
                style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  {post.featured_image ? (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                      <span className="text-emerald-500 font-medium">No image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Meta: category + date */}
                  <div className="flex items-center justify-between mb-4">
                    {post.category ? (
                      <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">
                        {post.category.name}
                      </span>
                    ) : (
                      <span></span>
                    )}
                    <span className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {new Date(post.published_date).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                    {post.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                  </p>

                  {/* Tags */}
                  {post.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.split(',').map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          <TagIcon className="w-3 h-3 mr-1" />
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <a
                    href={`/blog/${post.slug}`}
                    className="mt-auto inline-flex items-center text-emerald-600 font-medium hover:text-emerald-700 transition-colors group/link"
                  >
                    Read Full Article
                    <span className="ml-2 transform group-hover/link:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 max-w-md mx-auto">
              <p className="text-gray-500 text-lg">
                {searchTerm
                  ? "No articles match your search."
                  : "No published articles yet. Add some in Django Admin → Blog → Blog Posts."}
              </p>
            </div>
          </div>
        )}
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
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Blog;