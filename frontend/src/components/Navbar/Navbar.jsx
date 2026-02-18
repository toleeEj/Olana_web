import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [username, setUsername] = useState('Visitor');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/core/profiles/');
        const profile = res.data[0];
        if (profile?.full_name) {
          setUsername(profile.full_name.split(' ')[0]);
        }
      } catch (err) {
        console.error("Couldn't fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

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
        fixed w-full z-50 top-0 transition-all duration-500
        ${scrolled
          ? 'bg-emerald-950/75 backdrop-blur-xl border-b border-emerald-800/40 shadow-lg'
          : 'bg-emerald-950/40 backdrop-blur-md'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md">
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                OW
              </span>
            </div>
            <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Dr. Olana
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative text-sm font-bold tracking-wide
                  transition-all duration-300 ease-out
                  hover:-translate-y-0.5
                  hover:drop-shadow-[0_2px_8px_rgba(16,185,129,0.45)]
                  ${isActive(item.path)
                    ? 'text-white'
                    : 'text-emerald-100 hover:text-white'
                  }
                  group
                `}
              >
                {item.label}

                {/* Animated Underline */}
                <span
                  className={`
                    absolute left-0 -bottom-1 h-[2px] w-full
                    bg-emerald-400
                    transform scale-x-0 origin-left
                    transition-transform duration-300 ease-out
                    group-hover:scale-x-100
                    ${isActive(item.path) ? 'scale-x-100' : ''}
                  `}
                />
              </Link>
            ))}
          </div>

          {/* Mobile button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`
                p-2.5 rounded-xl transition-all duration-300
                ${mobileMenuOpen
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-emerald-900/40 text-emerald-200 hover:bg-emerald-800/40'
                }
              `}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden absolute w-full transition-all duration-500 transform origin-top
          ${mobileMenuOpen
            ? 'opacity-100 translate-y-0 scale-y-100 visible'
            : 'opacity-0 -translate-y-4 scale-y-95 invisible pointer-events-none'
          }
        `}
      >
        <div className="bg-emerald-950/95 backdrop-blur-xl border border-emerald-800/40 shadow-xl mt-2 mx-4 rounded-2xl overflow-hidden">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  block px-5 py-4 rounded-xl text-base font-bold tracking-wide
                  transition-all duration-300 ease-out
                  transform
                  ${isActive(item.path)
                    ? 'text-white bg-emerald-800/50'
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-800/30 hover:translate-x-2'
                  }
                `}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
