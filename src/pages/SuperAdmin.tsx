import { Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../lib/authStore';
import { Building2, Users, FileText, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function SuperAdmin() {
  const { user, isSuperAdmin, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'companies' | 'users' | 'permits'>('companies');

  // Only super admins can access this page
  if (!isSuperAdmin()) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0a0d] via-[#1a1118] to-[#0f0a0d] page-transition">
      {/* Navbar */}
      <nav className="bg-[#241a1f]/80 backdrop-blur-sm border-b border-[#A43850]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <img src="/visualpermit-logo.png" alt="VisualPermit.com" className="h-10" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-white leading-tight">Super Admin Panel</h1>
                <p className="text-xs text-gray-400 leading-tight">Manage all companies & users</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-red-400 transition-all"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name}</h2>
          <p className="text-gray-400">Manage companies, users, and system settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Companies', value: '1', icon: Building2, color: '#A43850' },
            { label: 'Total Users', value: '1', icon: Users, color: '#F5A623' },
            { label: 'Active Permits', value: '30', icon: FileText, color: '#8b2f43' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#241a1f] border border-[#A43850]/20 rounded-2xl p-6 hover:border-[#A43850]/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}30` }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-[#241a1f] border border-[#A43850]/20 rounded-2xl overflow-hidden">
          <div className="border-b border-[#A43850]/20 flex">
            {[
              { id: 'companies', label: 'Companies', icon: Building2 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'permits', label: 'System Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 px-6 py-4 font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#A43850]/20 text-[#F5A623] border-b-2 border-[#F5A623]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </div>
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'companies' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Manage Companies</h3>
                  <button className="bg-gradient-to-r from-[#A43850] to-[#8b2f43] hover:from-[#8b2f43] hover:to-[#A43850] text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-[#A43850]/50">
                    + Add Company
                  </button>
                </div>

                {/* Companies Table */}
                <div className="bg-[#1a1118] rounded-xl border border-[#A43850]/20 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#241a1f] border-b border-[#A43850]/20">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Company Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Users</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Permits</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#A43850]/10 hover:bg-[#241a1f]/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src="/IH White Logo.png"
                              alt="Iron Horse"
                              className="h-8 w-auto"
                            />
                            <div>
                              <p className="font-medium text-white">Iron Horse Midstream</p>
                              <p className="text-sm text-gray-400">iron-horse-1</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">1</td>
                        <td className="px-6 py-4 text-gray-300">30</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-medium">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-[#F5A623] hover:text-[#F7B84D] font-medium text-sm transition-colors">
                            Manage →
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">User Management</h3>
                <p className="text-gray-400">View and manage all users across all companies.</p>
              </div>
            )}

            {activeTab === 'permits' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">System Settings</h3>
                <p className="text-gray-400">Configure global settings and preferences.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
