import { LogOut, Menu } from 'lucide-react';

export default function Topbar({ onMenuClick }) {
  const logout = () => {
    localStorage.clear();
    window.location.href = '/admin/login';
  };

  return (
    <header className="bg-[#1B4D3E] border-b border-[#2E6B52] px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
      {/* Hamburger button - visible only on mobile/tablet */}
      <button
        className="lg:hidden p-2 rounded-md text-white hover:bg-[#2E6B52]/80 focus:outline-none focus:ring-2 focus:ring-[#E8A87A] focus:ring-offset-2 focus:ring-offset-[#1B4D3E]"
        onClick={onMenuClick}
        aria-label="Toggle sidebar menu"
      >
        <Menu size={24} />
      </button>

      {/* Title - centered on small screens, left-aligned on desktop */}
      <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-wide flex-1 text-center lg:text-left">
        Admin Panel
      </h1>

      {/* Logout button - always visible, text hidden on very small screens */}
      <button
        onClick={logout}
        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-[#E8A87A] text-[#1B4D3E] rounded-lg hover:bg-[#F2BA8C] transition-all font-medium shadow-sm whitespace-nowrap min-w-[40px] sm:min-w-auto"
      >
        <LogOut size={18} />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </header>
  );
}