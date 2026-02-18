import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Calendar,
  MessageSquare,
  Settings,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/requirements', label: 'Requirements', icon: ClipboardList },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/ai-chat', label: 'AI Assistant', icon: MessageSquare },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Navbar() {
  return (
    <nav className="bg-burgundy-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-3">
            <img
              src="/IH White Logo.png"
              alt="Iron Horse Midstream"
              className="h-10 w-auto drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold leading-tight">
                Iron Horse Midstream
              </h1>
              <p className="text-xs text-burgundy-200 leading-tight">
                Title V Permit Tracker
              </p>
            </div>
          </NavLink>

          <div className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/15 text-gold-400'
                      : 'text-white/80 hover:bg-white/10 hover:text-gold-400'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
