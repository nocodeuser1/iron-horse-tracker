import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Calendar,
  MessageSquare,
  Settings,
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  FileText,
} from 'lucide-react';
import { useDarkMode } from '../../lib/darkMode';
import { usePermitTypeStore } from '../../lib/permitTypeStore';
import { useState } from 'react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/requirements', label: 'Requirements', icon: ClipboardList },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/ai-chat', label: 'AI Assistant', icon: MessageSquare },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Navbar() {
  const { dark, toggle } = useDarkMode();
  const { permitTypes, activePermitId, setActivePermit, getActivePermit } = usePermitTypeStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [permitMenuOpen, setPermitMenuOpen] = useState(false);
  
  const activePermit = getActivePermit();

  return (
    <nav className="bg-burgundy-500 dark:bg-burgundy-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-3 group">
            <img
              src="/IH White Logo.png"
              alt="Iron Horse Midstream"
              className="h-10 w-auto drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)] group-hover:scale-105 transition-transform"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold leading-tight">
                Iron Horse Midstream
              </h1>
              <p className="text-xs text-burgundy-200 leading-tight">
                {activePermit?.name || 'Title V'} Permit Tracker
              </p>
            </div>
          </NavLink>

          {/* Permit Type Selector */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setPermitMenuOpen(!permitMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/15 rounded-lg transition-all text-sm font-medium"
            >
              <FileText className="w-4 h-4" />
              <span>{activePermit?.name || 'Title V'}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            
            {permitMenuOpen && (
              <div className="absolute top-full mt-2 left-0 bg-white dark:bg-dark-card shadow-xl rounded-lg border border-gray-200 dark:border-dark-border py-2 min-w-[200px] animate-fade-in z-50">
                <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Switch Permit Type
                </div>
                {permitTypes.map((permit) => (
                  <button
                    key={permit.id}
                    onClick={() => {
                      setActivePermit(permit.id);
                      setPermitMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors ${
                      permit.id === activePermitId
                        ? 'bg-burgundy-50 dark:bg-burgundy-900/30 text-burgundy-700 dark:text-burgundy-300 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="font-medium">{permit.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                      {permit.description}
                    </div>
                  </button>
                ))}
                <div className="border-t border-gray-200 dark:border-dark-border mt-1 pt-1 px-3">
                  <NavLink
                    to="/settings"
                    onClick={() => setPermitMenuOpen(false)}
                    className="block px-2 py-1.5 text-xs text-burgundy-600 dark:text-burgundy-400 hover:text-burgundy-700 dark:hover:text-burgundy-300 font-medium"
                  >
                    + Manage Permit Types
                  </NavLink>
                </div>
              </div>
            )}
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/15 text-gold-400 shadow-inner'
                      : 'text-white/80 hover:bg-white/10 hover:text-gold-400'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{label}</span>
              </NavLink>
            ))}
            <button
              onClick={toggle}
              className="ml-2 p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-gold-400 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/15 text-gold-400'
                      : 'text-white/80 hover:bg-white/10'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
