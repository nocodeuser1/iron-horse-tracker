import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useEffect } from 'react';

export function AppLayout() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div key={pathname} className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
