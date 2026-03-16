import { Link, useLocation } from 'react-router-dom';
import {
  Home, User, Award, BookOpen, Briefcase, FileText,
  MessageSquare, Users, X // ← added X for close button on mobile
} from 'lucide-react';

const menu = [
  { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: User, label: 'Profile', path: '/admin/core/profiles' },
  { icon: Award, label: 'Skills', path: '/admin/core/skills' },
  { icon: BookOpen, label: 'Education', path: '/admin/core/education' },
  { icon: Briefcase, label: 'Experience', path: '/admin/core/experience' },
  { icon: FileText, label: 'Resume', path: '/admin/core/resume' },
  { icon: Users, label: 'Portfolio', path: '/admin/works/portfolio' },
  { icon: Users, label: 'Products', path: '/admin/works/product' },
  { icon: BookOpen, label: 'Blog Posts', path: '/admin/blog/posts' },
  { icon: MessageSquare, label: 'Messages', path: '/admin/contact/messages' },
];

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Group menu items
  const dashboardItem = menu[0];
  const coreItems = menu.slice(1, 6);
  const worksItems = menu.slice(6, 8);
  const blogItems = menu.slice(8, 10);
  const messagesItem = menu[9];

  return (
    <div className="h-full bg-[#0B1120] border-r border-[#1E293B] flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-[#1E293B] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Dr. Olana</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">Admin Panel</p>
        </div>
        {/* Close button on mobile */}
        <button className="lg:hidden text-white hover:text-gray-300" aria-label="Close sidebar">
          <X size={24} />
        </button>
      </div>

      {/* Navigation - scrollable */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-[#334155] scrollbar-track-[#1E293B]">
        {/* Dashboard */}
        <Link
          to={dashboardItem.path}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 transition-all text-sm sm:text-base ${
            isActive(dashboardItem.path)
              ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-900/30'
              : 'text-[#E2E8F0] hover:bg-[#1E293B] hover:text-white'
          }`}
        >
          <dashboardItem.icon
            size={20}
            className={isActive(dashboardItem.path) ? 'text-white' : 'text-[#60A5FA]'}
          />
          <span className="font-medium">{dashboardItem.label}</span>
        </Link>

        {/* Core Section */}
        <div className="mt-6 mb-3">
          <p className="text-xs font-semibold text-[#60A5FA] uppercase tracking-wider px-4 mb-2">
            Core
          </p>
          {coreItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg mb-0.5 transition-all text-sm sm:text-base ${
                isActive(item.path)
                  ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-900/30'
                  : 'text-[#E2E8F0] hover:bg-[#1E293B] hover:text-white'
              }`}
            >
              <item.icon
                size={20}
                className={isActive(item.path) ? 'text-white' : 'text-[#60A5FA]'}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Works Section */}
        <div className="mt-6 mb-3">
          <p className="text-xs font-semibold text-[#60A5FA] uppercase tracking-wider px-4 mb-2">
            Works
          </p>
          {worksItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg mb-0.5 transition-all text-sm sm:text-base ${
                isActive(item.path)
                  ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-900/30'
                  : 'text-[#E2E8F0] hover:bg-[#1E293B] hover:text-white'
              }`}
            >
              <item.icon
                size={20}
                className={isActive(item.path) ? 'text-white' : 'text-[#60A5FA]'}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Blog Section */}
        <div className="mt-6 mb-3">
          <p className="text-xs font-semibold text-[#60A5FA] uppercase tracking-wider px-4 mb-2">
            Blog
          </p>
          {blogItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg mb-0.5 transition-all text-sm sm:text-base ${
                isActive(item.path)
                  ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-900/30'
                  : 'text-[#E2E8F0] hover:bg-[#1E293B] hover:text-white'
              }`}
            >
              <item.icon
                size={20}
                className={isActive(item.path) ? 'text-white' : 'text-[#60A5FA]'}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Messages */}
        <Link
          to={messagesItem.path}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg mt-6 transition-all text-sm sm:text-base ${
            isActive(messagesItem.path)
              ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-900/30'
              : 'text-[#E2E8F0] hover:bg-[#1E293B] hover:text-white'
          }`}
        >
          <messagesItem.icon
            size={20}
            className={isActive(messagesItem.path) ? 'text-white' : 'text-[#60A5FA]'}
          />
          <span className="font-medium">{messagesItem.label}</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1E40AF] flex items-center justify-center text-white text-sm font-medium shadow-lg shadow-blue-900/30">
            DO
          </div>
          <div>
            <p className="text-sm font-medium text-white">Admin</p>
            <p className="text-xs text-[#60A5FA]">dr.olana@admin</p>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #1E293B;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
}