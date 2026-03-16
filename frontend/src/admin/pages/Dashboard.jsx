import { useState, useEffect } from 'react';
import adminApi from '../services/adminApi';
import {
  Users, FileText, BookOpen, MessageSquare,
  Calendar, TrendingUp, ChevronRight, PlusCircle,
  Inbox, FileCheck, Clock, ArrowUpRight,
  Sparkles, Activity, Shield, Target,
  Users2
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    profiles: 0,
    portfolios: 0,
    products: 0,
    blogPosts: 0,
    unreadMessages: 0,
  });

  const [recentPosts, setRecentPosts] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [profileRes, portfolioRes, productRes, blogRes, messageRes] = await Promise.all([
        adminApi.get('/core/profiles/'),
        adminApi.get('/works/portfolios/'),
        adminApi.get('/works/products/'),
        adminApi.get('/blog/posts/'),
        adminApi.get('/contact/messages/'),
      ]);

      setStats({
        profiles: profileRes.data.count || profileRes.data.results?.length || 0,
        portfolios: portfolioRes.data.count || 0,
        products: productRes.data.count || 0,
        blogPosts: blogRes.data.count || 0,
        unreadMessages: messageRes.data.results?.filter(m => !m.is_read)?.length || 0,
      });

      setRecentPosts(blogRes.data.results?.slice(0, 5) || []);
      setRecentMessages(
        messageRes.data.results
          ?.filter(m => !m.is_read)
          ?.slice(0, 5) || []
      );

    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#1B4D3E] border-t-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#1B4D3E] to-[#7ABF8E] opacity-20"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-[#8B3D3D] to-[#B64A4A] bg-opacity-10 border border-[#8B3D3D] text-[#8B3D3D] px-6 py-4 rounded-xl flex items-center justify-between shadow-lg">
        <span className="font-medium">{error}</span>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-[#8B3D3D] text-white rounded-lg hover:bg-[#6E3131] transition-all shadow-md hover:shadow-lg text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-gradient-to-br from-[#F8FAF5] to-[#F0F5EB]">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B4D3E]/5 to-[#7ABF8E]/5 rounded-3xl"></div>
        <div className="relative px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1B4D3E] to-[#2E6B52] bg-clip-text text-transparent font-['Inter']">
                Dashboard
              </h1>
              <p className="text-[#5B6E6B] mt-2 text-lg flex items-center gap-2">
                <Sparkles size={18} className="text-[#7ABF8E]" />
                Welcome back, here's your overview
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Stats Grid with Enhanced Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          icon={<Users size={22} />}
          title="Total Profiles"
          value={stats.profiles}
          color="darkGreen"

        />
        <StatCard
          icon={<FileText size={22} />}
          title="Portfolio Items"
          value={stats.portfolios}
          color="lightGreen"

        />
        <StatCard
          icon={<BookOpen size={22} />}
          title="Blog Posts"
          value={stats.blogPosts}
          color="teal"

        />
        <StatCard
          icon={<FileCheck size={22} />}
          title="Products"
          value={stats.products}
          color="sage"

        />
        <StatCard
          icon={<Inbox size={22} />}
          title="Unread Messages"
          value={stats.unreadMessages}
          color={stats.unreadMessages > 0 ? "coral" : "gray"}
          alert={stats.unreadMessages > 0}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blog Posts Card */}
        <div className="group bg-white rounded-2xl shadow-lg border border-[#1B4D3E]/10 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="px-6 py-5 bg-gradient-to-r from-[#1B4D3E] to-[#2E6B52] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2.5">
              <Calendar size={20} className="text-[#D4EDDA]" />
              Recent Blog Posts
            </h2>
            <a href="/admin/blog/posts" className="text-sm text-[#D4EDDA] hover:text-white flex items-center gap-1 transition-colors group">
              View all <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
          <div className="divide-y divide-[#1B4D3E]/10">
            {recentPosts.length === 0 ? (
              <div className="px-6 py-12 text-center bg-gradient-to-br from-white to-[#F8FAF5]">
                <BookOpen size={40} className="mx-auto text-[#7ABF8E] mb-3 opacity-50" />
                <p className="text-[#5B6E6B]">No blog posts yet</p>
                <button className="mt-3 px-4 py-2 text-sm bg-[#1B4D3E] text-white rounded-lg hover:bg-[#2E6B52] transition-colors">
                  Create First Post
                </button>
              </div>
            ) : (
              recentPosts.map((post,) => (
                <div key={post.id} className="px-6 py-4 hover:bg-[#F8FAF5] transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1B4D3E] mb-1.5 hover:text-[#2E6B52] transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-[#5B6E6B] flex items-center gap-1.5">
                          <Clock size={14} className="text-[#7ABF8E]" />
                          {new Date(post.published_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${post.is_published
                          ? 'bg-[#7ABF8E] bg-opacity-20 text-[#1B4D3E] border border-[#7ABF8E]'
                          : 'bg-[#E8D5B5] bg-opacity-30 text-[#8B7355] border border-[#E8D5B5]'
                          }`}>
                          {post.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 w-1 h-10 bg-gradient-to-b from-[#7ABF8E] to-[#1B4D3E] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Messages Card */}
        <div className="group bg-white rounded-2xl shadow-lg border border-[#1B4D3E]/10 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="px-6 py-5 bg-gradient-to-r from-[#7ABF8E] to-[#9CD4A8] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#1B4D3E] flex items-center gap-2.5">
              <MessageSquare size={20} className="text-[#1B4D3E]" />
              Recent Messages
            </h2>
            <a href="/admin/contact/messages" className="text-sm text-[#1B4D3E] hover:text-[#2E6B52] flex items-center gap-1 transition-colors group">
              View all <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
          <div className="divide-y divide-[#1B4D3E]/10">
            {recentMessages.length === 0 ? (
              <div className="px-6 py-12 text-center bg-gradient-to-br from-white to-[#F8FAF5]">
                <Inbox size={40} className="mx-auto text-[#7ABF8E] mb-3 opacity-50" />
                <p className="text-[#5B6E6B]">No unread messages</p>
                <p className="text-sm text-[#7ABF8E] mt-1">All caught up!</p>
              </div>
            ) : (
              recentMessages.map((msg, index) => (
                <div key={msg.id} className="px-6 py-4 hover:bg-[#F8FAF5] transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-2 h-2 mt-2 rounded-full bg-[#1B4D3E]"></div>
                      {index < recentMessages.length - 1 && (
                        <div className="absolute top-3 left-1 w-0.5 h-12 bg-gradient-to-b from-[#1B4D3E] to-[#7ABF8E]"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-[#1B4D3E]">{msg.name}</h3>
                        <span className="text-xs text-[#7ABF8E] bg-[#7ABF8E]/10 px-2 py-1 rounded-full">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-[#5B6E6B] mb-1.5 line-clamp-1 font-medium">{msg.subject || 'No subject'}</p>
                      <p className="text-xs text-[#7ABF8E] line-clamp-1">{msg.email}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Card with Enhanced Design */}
      <div className="bg-white rounded-2xl shadow-lg border border-[#1B4D3E]/10 p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#1B4D3E] flex items-center gap-2">
            <Target size={20} className="text-[#7ABF8E]" />
            Quick Actions
          </h2>
          <span className="text-xs text-[#7ABF8E] bg-[#7ABF8E]/10 px-3 py-1 rounded-full">
            <Sparkles size={12} className="inline mr-1" />
            Recommended
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            to="/admin/blog/posts"
            label="New Blog Post"
            icon={<BookOpen size={18} />}
            color="darkGreen"
          />
          <QuickActionButton
            to="/admin/works/portfolio"
            label="Add Portfolio Item"
            icon={<FileText size={18} />}
            color="lightGreen"
          />
          <QuickActionButton
            to="/admin/contact/messages"
            label="View Messages"
            icon={<MessageSquare size={18} />}
            color="teal"
          />
          <QuickActionButton
            to="/admin/core/profiles"
            label="Edit Profile"
            icon={<Users size={18} />}
            color="sage"
          />
        </div>
      </div>
    </div>
  );
}

// Enhanced Helper Components
function StatCard({ icon, title, value, color, alert }) {
  const colorClasses = {
    darkGreen: 'bg-gradient-to-br from-[#1B4D3E] to-[#2E6B52] text-white',
    lightGreen: 'bg-gradient-to-br from-[#7ABF8E] to-[#9CD4A8] text-[#1B4D3E]',
    teal: 'bg-gradient-to-br from-[#4A7C6F] to-[#6B9E8E] text-white',
    sage: 'bg-gradient-to-br from-[#B8D9C6] to-[#D4EDDA] text-[#1B4D3E]',
    coral: 'bg-gradient-to-br from-[#E8A87A] to-[#F2BA8C] text-[#4A2C1A]',
    gray: 'bg-gradient-to-br from-[#E5E9E8] to-[#F0F4F3] text-[#5B6E6B]'
  };

  return (
    <div className={`relative p-6 rounded-2xl shadow-lg ${colorClasses[color]} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white"></div>
        <div className="absolute -left-4 -bottom-4 w-32 h-32 rounded-full bg-white"></div>
      </div>

      <div className="relative">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-sm font-medium opacity-90 mb-1 flex items-center gap-1">
              {title}
              {alert && (
                <span className="w-2 h-2 rounded-full bg-[#E8A87A] animate-pulse"></span>
              )}
            </p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-white bg-opacity-20 backdrop-blur-sm group-hover:scale-110 transition-transform">
            {icon}
          </div>
        </div>
        {/* {trend && (
          <div className="flex items-center gap-1 mt-2 text-xs font-medium opacity-80">
            <TrendingUp size={14} />
            <span>{trend} from last month</span>
          </div>
        )} */}
      </div>
    </div>
  );
}

function QuickActionButton({ to, label, icon, color }) {
  const colorClasses = {
    darkGreen: 'from-[#1B4D3E] to-[#2E6B52] text-white hover:from-[#2E6B52] hover:to-[#1B4D3E]',
    lightGreen: 'from-[#7ABF8E] to-[#9CD4A8] text-[#1B4D3E] hover:from-[#9CD4A8] hover:to-[#7ABF8E]',
    teal: 'from-[#4A7C6F] to-[#6B9E8E] text-white hover:from-[#6B9E8E] hover:to-[#4A7C6F]',
    sage: 'from-[#B8D9C6] to-[#D4EDDA] text-[#1B4D3E] hover:from-[#D4EDDA] hover:to-[#B8D9C6]'
  };

  return (
    <a
      href={to}
      className={`flex items-center justify-center gap-2.5 px-4 py-4 bg-gradient-to-r ${colorClasses[color]} rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium text-sm group relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
      <span className="relative z-10 flex items-center gap-2.5">
        <span className="group-hover:scale-110 transition-transform">{icon}</span>
        {label}
      </span>
    </a>
  );
}