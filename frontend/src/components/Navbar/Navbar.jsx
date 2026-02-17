import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: 'About Me', path: '/about' },
    { label: 'Works', path: '/works' },
    { label: 'Blogs', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`
        fixed w-full z-50 top-0 transition-all duration-700
        ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-2xl py-2 border-b border-emerald-100/50'
            : 'bg-transparent py-4'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo / Brand with enhanced animation */}
          <div className="flex items-center">
            <Link to="/" className="group relative flex items-center space-x-3">
              {/* Animated icon / initial */}
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-200/50 group-hover:scale-110 transition-transform duration-300">
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                  O
                </span>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
              </div>

              {/* Name with gradient and underline */}
              <div className="relative">
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                  Dr. Olana Wakoya Gichile
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500 group-hover:w-full"></span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu with glassmorphism and micro-interactions */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative px-5 py-2.5 text-sm font-medium rounded-xl
                  transition-all duration-300 ease-out
                  hover:scale-105 hover:shadow-xl hover:shadow-emerald-100/50
                  active:scale-95
                  ${
                    isActive(item.path)
                      ? 'text-emerald-700 bg-white shadow-lg shadow-emerald-200/50 border border-emerald-200'
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-white/70 backdrop-blur-sm'
                  }
                `}
                style={{
                  animation: `navItemFadeIn 0.6s cubic-bezier(0.2, 0.9, 0.3, 1) ${index * 0.1}s both`,
                }}
              >
                {item.label}
                {isActive(item.path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></span>
                )}
                {/* Hover glow effect */}
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-teal-400/0 opacity-0 hover:opacity-100 transition-opacity duration-500"></span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button with advanced animation */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`
                relative inline-flex items-center justify-center p-2.5 rounded-xl
                transition-all duration-500 ease-out
                ${
                  mobileMenuOpen
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white rotate-180 shadow-xl shadow-emerald-200'
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 shadow-md'
                }
                focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2
              `}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6 transition-transform duration-500 rotate-90" />
              ) : (
                <Bars3Icon className="h-6 w-6 transition-transform duration-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with glassmorphism and staggered animations */}
      <div
        className={`
          md:hidden absolute w-full transition-all duration-500 ease-in-out transform
          ${
            mobileMenuOpen
              ? 'opacity-100 translate-y-0 visible'
              : 'opacity-0 -translate-y-4 invisible pointer-events-none'
          }
        `}
      >
        <div className="bg-white/90 backdrop-blur-xl shadow-2xl border-t border-emerald-100/50 mt-2 mx-4 rounded-2xl overflow-hidden">
          <div className="px-4 pt-4 pb-6 space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  block px-5 py-4 rounded-xl text-base font-medium
                  transition-all duration-300 ease-out
                  transform hover:translate-x-2 hover:shadow-lg
                  ${
                    isActive(item.path)
                      ? 'text-emerald-700 bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-500'
                      : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50/50'
                  }
                `}
                style={{
                  animation: mobileMenuOpen
                    ? `slideInRight 0.5s cubic-bezier(0.2, 0.9, 0.3, 1) ${index * 0.1}s both`
                    : 'none',
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center">
                  {item.label}
                  {isActive(item.path) && (
                    <span className="ml-3 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  )}
                </span>
              </Link>
            ))}

            {/* Decorative animated dots */}
            <div className="flex justify-center space-x-3 pt-6 pb-2">
              <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0ms]"></div>
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:150ms]"></div>
              <div className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-bounce [animation-delay:300ms]"></div>
              <div className="w-2.5 h-2.5 bg-emerald-300 rounded-full animate-bounce [animation-delay:450ms]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes navItemFadeIn {
          0% {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </nav>
  );
}