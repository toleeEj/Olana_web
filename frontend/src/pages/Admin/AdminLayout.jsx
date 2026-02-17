import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  HomeIcon, 
  AcademicCapIcon, 
  BriefcaseIcon, 
  CpuChipIcon,
  BookOpenIcon,
  EnvelopeIcon,
  ArrowRightOnRectangleIcon,
  EyeIcon,
  UserCircleIcon,
  FolderIcon,
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete api.defaults.headers.common['Authorization'];
      navigate('/admin/login');
    }
  };

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
    { to: '/admin/skills', label: 'Skills', icon: CpuChipIcon },
    { to: '/admin/education', label: 'Education', icon: AcademicCapIcon },
    { to: '/admin/experience', label: 'Experience', icon: BriefcaseIcon },
    { to: '/admin/portfolios', label: 'Portfolios', icon: FolderIcon },
    { to: '/admin/products', label: 'Products / Services', icon: ShoppingBagIcon },
    { to: '/admin/blog-posts', label: 'Blog Posts', icon: BookOpenIcon },
    { to: '/admin/contact-messages', label: 'Contact Messages', icon: EnvelopeIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl shadow-lg border-b border-emerald-100/50 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side: brand + mobile menu button */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent hidden sm:inline">
                  Admin Panel
                </span>
              </div>
            </div>

            {/* Right side: actions (hidden on mobile, shown in mobile menu) */}
            <div className="hidden lg:flex items-center space-x-4">
              <NavLink
                to="/"
                className="group flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
              >
                <EyeIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline">View Public Site</span>
              </NavLink>
              
              <button
                onClick={handleLogout}
                className="group flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                <span className="hidden xl:inline">Logout</span>
              </button>

              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center border-2 border-emerald-200">
                <UserCircleIcon className="w-6 h-6 text-emerald-600" />
              </div>
            </div>

            {/* Mobile menu actions (icons only) */}
            <div className="flex lg:hidden items-center space-x-2">
              <NavLink
                to="/"
                className="p-2 text-gray-700 hover:text-emerald-600 transition-colors"
                title="View Public Site"
              >
                <EyeIcon className="w-5 h-5" />
              </NavLink>
              
              <button
                onClick={handleLogout}
                className="p-2 text-red-600 hover:text-red-700 transition-colors"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>

              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center border-2 border-emerald-200">
                <UserCircleIcon className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      <div
        className={`
          fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-xl shadow-lg border-b border-emerald-100/50 z-20 lg:hidden
          transition-all duration-300 transform
          ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}
        `}
      >
        <div className="px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-l-4 border-emerald-500' 
                    : 'text-gray-700 hover:bg-emerald-50/50 hover:text-emerald-600'
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
                {({ isActive }) => isActive && (
                  <span className="ml-auto w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Sidebar + Main Content */}
      <div className="flex pt-16">
        {/* Desktop Sidebar (hidden on mobile) */}
        <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-white/90 backdrop-blur-xl shadow-2xl border-r border-emerald-100/50 overflow-y-auto z-20">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full mr-3"></span>
              Content Management
            </h2>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `
                      group flex items-center px-4 py-3 rounded-xl transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 shadow-md border-l-4 border-emerald-500' 
                        : 'text-gray-700 hover:bg-emerald-50/50 hover:text-emerald-600'
                      }
                    `}
                  >
                    <Icon className={`
                      w-5 h-5 mr-3 transition-all duration-300
                      ${({ isActive }) => isActive ? 'text-emerald-600' : 'text-gray-500 group-hover:text-emerald-500'}
                    `} />
                    <span className="font-medium">{item.label}</span>
                    {({ isActive }) => isActive && (
                      <span className="ml-auto w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-emerald-50/50 to-transparent pointer-events-none"></div>
        </aside>

        {/* Main Content Area */}
        <main className={`
          flex-1 p-4 sm:p-6 lg:p-8 min-h-screen transition-all duration-300
          ${mobileMenuOpen ? 'lg:ml-64' : 'lg:ml-64'} ml-0
        `}>
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}