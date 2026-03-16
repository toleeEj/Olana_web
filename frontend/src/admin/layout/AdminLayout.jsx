import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Menu } from 'lucide-react'; // ← already imported, good

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-dvh bg-gray-50 overflow-hidden">
      {/* Mobile overlay backdrop (darkens screen when sidebar open) */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar: fixed on mobile (slides in), static on desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r shadow-xl transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:w-64 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto`}
      >
        <Sidebar />
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Topbar receives the toggle function */}
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Main scrollable content area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Constrain max width for better readability on large screens */}
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}