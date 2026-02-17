import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DocumentTextIcon,
  BriefcaseIcon,
  ShoppingBagIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  CpuChipIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowRightIcon,
  SparklesIcon,
  BookOpenIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    profiles: 0,
    skills: 0,
    educations: 0,
    experiences: 0,
    portfolios: 0,
    products: 0,
    blog_posts: 0,
    contact_messages: 0,
    unread_messages: 0,
  });
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        profilesRes, skillsRes, eduRes, expRes,
        portfoliosRes, productsRes, blogsRes, messagesRes,
      ] = await Promise.all([
        api.get('/core/profiles/'),
        api.get('/core/skills/'),
        api.get('/core/educations/'),
        api.get('/core/experiences/'),
        api.get('/works/portfolios/'),
        api.get('/works/products/'),
        api.get('/blog/posts/'),
        api.get('/contact/messages/'),
      ]);

      const safeCount = (res) => (res.data.results?.length ?? res.data.length ?? 0);

      setStats({
        profiles: safeCount(profilesRes),
        skills: safeCount(skillsRes),
        educations: safeCount(eduRes),
        experiences: safeCount(expRes),
        portfolios: safeCount(portfoliosRes),
        products: safeCount(productsRes),
        blog_posts: safeCount(blogsRes),
        contact_messages: safeCount(messagesRes),
        unread_messages: messagesRes.data.filter?.(m => !m.is_read)?.length ?? 0,
      });

      setRecentBlogs(
        (blogsRes.data.results || blogsRes.data || []).slice(0, 5)
      );

      setRecentMessages(
        (messagesRes.data.results || messagesRes.data || [])
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)
      );
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-emerald-600 text-lg">Loading dashboard...</div>
      </div>
    );
  }

  const statCards = [
    { 
      title: 'Blog Posts', 
      count: stats.blog_posts, 
      link: '/admin/blog-posts', 
      icon: DocumentTextIcon,
      gradient: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      title: 'Portfolios', 
      count: stats.portfolios, 
      link: '/admin/portfolios', 
      icon: BriefcaseIcon,
      gradient: 'from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    { 
      title: 'Products/Services', 
      count: stats.products, 
      link: '/admin/products', 
      icon: ShoppingBagIcon,
      gradient: 'from-green-500 to-green-600',
      lightBg: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      title: 'Unread Messages', 
      count: stats.unread_messages, 
      link: '/admin/contact-messages', 
      icon: EnvelopeIcon,
      gradient: 'from-red-500 to-red-600',
      lightBg: 'bg-red-50',
      textColor: 'text-red-600'
    },
  ];

  const quickActions = [
    { to: '/admin/blog-posts', label: 'New Blog Post', icon: DocumentTextIcon, gradient: 'from-blue-600 to-blue-700' },
    { to: '/admin/portfolios', label: 'New Portfolio', icon: BriefcaseIcon, gradient: 'from-purple-600 to-purple-700' },
    { to: '/admin/products', label: 'New Product', icon: ShoppingBagIcon, gradient: 'from-green-600 to-green-700' },
    { to: '/admin/contact-messages', label: 'View Messages', icon: EnvelopeIcon, gradient: 'from-emerald-600 to-teal-600' },
  ];

  const additionalStats = [
    { label: 'Skills', count: stats.skills, icon: CpuChipIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Education', count: stats.educations, icon: AcademicCapIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Experience', count: stats.experiences, icon: UserGroupIcon, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Total Messages', count: stats.contact_messages, icon: ChatBubbleLeftIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl shadow-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <SparklesIcon className="w-8 h-8 text-yellow-300" />
            <h1 className="text-3xl md:text-4xl font-bold">Welcome to Admin Dashboard</h1>
          </div>
          <p className="text-emerald-100 text-lg max-w-2xl">
            Manage all content for Dr. Olana Wakoya Gichile's portfolio website
          </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link
            key={stat.title}
            to={stat.link}
            className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.lightBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <span className="text-3xl font-bold text-gray-800">{stat.count}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{stat.title}</h3>
              <div className="flex items-center text-sm text-emerald-600 font-medium group-hover:text-emerald-700">
                View details
                <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {additionalStats.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 flex items-center space-x-3 border border-gray-100"
            style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
          >
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800">{stat.count}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-emerald-100/50">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full mr-3"></span>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={action.label}
              to={action.to}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r text-white p-[1px] hover:shadow-xl transition-all duration-500 hover:scale-105"
              style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-100`}></div>
              <div className="relative flex items-center justify-center px-6 py-4 bg-gradient-to-r from-white/10 to-transparent rounded-xl">
                <action.icon className="w-5 h-5 mr-2" />
                <span className="font-medium">{action.label}</span>
                <ArrowRightIcon className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Blog Posts */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-emerald-100/50">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <BookOpenIcon className="w-5 h-5 mr-2 text-emerald-600" />
            Recent Blog Posts
          </h2>
          {recentBlogs.length === 0 ? (
            <div className="text-center py-8">
              <DocumentTextIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No recent posts</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {recentBlogs.map((post, index) => (
                <li 
                  key={post.id} 
                  className="group border-b border-emerald-100 pb-4 last:border-0 last:pb-0"
                  style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
                >
                  <Link to={`/admin/blog-posts`} className="block group-hover:translate-x-1 transition-transform">
                    <div className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {post.title}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {new Date(post.published_date).toLocaleDateString()}
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        post.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {post.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-emerald-100/50">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <EnvelopeIcon className="w-5 h-5 mr-2 text-emerald-600" />
            Recent Messages
          </h2>
          {recentMessages.length === 0 ? (
            <div className="text-center py-8">
              <ChatBubbleLeftIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No recent messages</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {recentMessages.map((msg, index) => (
                <li 
                  key={msg.id} 
                  className="group border-b border-emerald-100 pb-4 last:border-0 last:pb-0"
                  style={{ animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` }}
                >
                  <Link to={`/admin/contact-messages`} className="block group-hover:translate-x-1 transition-transform">
                    <div className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {msg.name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1 line-clamp-1">
                      {msg.subject || <span className="italic text-gray-400">No subject</span>}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <ClockIcon className="w-3 h-3 mr-1" />
                      {new Date(msg.created_at).toLocaleString()}
                      <span className={`ml-2 px-2 py-0.5 rounded-full ${
                        msg.is_read ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {msg.is_read ? 'Read' : 'Unread'}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}