import { Link } from 'react-router-dom';
import { EnvelopeIcon, MapPinIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { FaLinkedin } from 'react-icons/fa'; // optional: install react-icons or use heroicons/linkedin

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-emerald-900 via-teal-900 to-gray-900 text-white overflow-hidden">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          className="relative block w-full h-8 md:h-12"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-emerald-800/30"
          ></path>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand Section */}
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30 flex items-center justify-center">
                <span className="text-white font-bold text-xl">O</span>
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur opacity-40"></div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">
                Dr. Olana
              </h3>
            </div>
            <p className="text-emerald-100/80 leading-relaxed">
              MD, MSc | Lecturer & General Practitioner
              <br />
              <span className="text-emerald-200/70">
                Passionate about global health equity and medical education.
              </span>
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://linkedin.com/in/olana-wakoya-gichile"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-emerald-500 hover:scale-110 transition-all duration-300 group"
              >
                <FaLinkedin className="w-5 h-5 text-white/80 group-hover:text-white" />
              </a>
              <a
                href="mailto:example@dr-olana.com"
                className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-emerald-500 hover:scale-110 transition-all duration-300 group"
              >
                <EnvelopeIcon className="w-5 h-5 text-white/80 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-semibold text-emerald-200 flex items-center">
              <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full mr-3"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'About Me', path: '/about' },
                { label: 'Works', path: '/works' },
                { label: 'Blogs', path: '/blog' },
                { label: 'Contact', path: '/contact' },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="group inline-flex items-center text-emerald-100/80 hover:text-white transition-colors"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-xl font-semibold text-emerald-200 flex items-center">
              <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full mr-3"></span>
              Connect
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <EnvelopeIcon className="w-5 h-5 text-emerald-300 mt-0.5 group-hover:scale-110 transition-transform" />
                <a
                  href="mailto:example@dr-olana.com"
                  className="text-emerald-100/80 hover:text-white transition-colors"
                >
                  example@dr-olana.com
                </a>
              </div>
              <div className="flex items-start space-x-3 group">
                <FaLinkedin className="w-5 h-5 text-emerald-300 mt-0.5 group-hover:scale-110 transition-transform" />
                <a
                  href="https://linkedin.com/in/olana-wakoya-gichile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-100/80 hover:text-white transition-colors"
                >
                  LinkedIn Profile
                </a>
              </div>
              <div className="flex items-start space-x-3 group">
                <MapPinIcon className="w-5 h-5 text-emerald-300 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-emerald-100/80">
                  Addis Ababa / Rwanda
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative mt-12 pt-6 border-t border-emerald-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-emerald-200/60">
            <p className="order-2 md:order-1 mt-4 md:mt-0">
              © {currentYear} Dr. Olana Wakoya Gichile. All rights reserved.
            </p>
            <div className="order-1 md:order-2 flex space-x-6">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
          {/* Decorative glowing dot */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
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
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </footer>
  );
}