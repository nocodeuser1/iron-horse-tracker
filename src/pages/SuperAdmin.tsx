import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../lib/authStore';
import { Building2, Users, FileText, Settings, LogOut, Bell, CheckCircle2, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PermitRequest {
  id: string;
  fileName: string;
  fileSize: number;
  companyName: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function SuperAdmin() {
  const { user, isSuperAdmin, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'companies' | 'users' | 'permits' | 'requests'>('companies');
  const [permitRequests, setPermitRequests] = useState<PermitRequest[]>([]);

  // Only super admins can access this page
  if (!isSuperAdmin()) {
    return <Navigate to="/" replace />;
  }

  // Load permit requests from localStorage
  useEffect(() => {
    const loadRequests = () => {
      const requests = JSON.parse(localStorage.getItem('permitRequests') || '[]');
      setPermitRequests(requests);
    };
    
    loadRequests();
    
    // Poll for new requests every 5 seconds
    const interval = setInterval(loadRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const pendingRequestsCount = permitRequests.filter(r => r.status === 'pending').length;

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleApproveRequest = (id: string) => {
    const updated = permitRequests.map(r =>
      r.id === id ? { ...r, status: 'approved' as const } : r
    );
    setPermitRequests(updated);
    localStorage.setItem('permitRequests', JSON.stringify(updated));
  };

  const handleRejectRequest = (id: string) => {
    const updated = permitRequests.map(r =>
      r.id === id ? { ...r, status: 'rejected' as const } : r
    );
    setPermitRequests(updated);
    localStorage.setItem('permitRequests', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0a0d] via-[#1a1118] to-[#0f0a0d]">
      {/* Navbar */}
      <nav className="bg-[#241a1f]/80 backdrop-blur-sm border-b border-[#A43850]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black bg-gradient-to-r from-[#A43850] to-[#F5A623] bg-clip-text text-transparent">
                VisualPermit.com
              </h1>
              <div className="hidden sm:block pl-3 border-l border-white/20">
                <h2 className="text-lg font-bold text-white leading-tight">Super Admin Panel</h2>
                <p className="text-xs text-gray-400 leading-tight">Manage all companies & users</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications Badge */}
              {pendingRequestsCount > 0 && (
                <button
                  onClick={() => setActiveTab('requests')}
                  className="relative p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-[#F5A623] transition-all"
                  title={`${pendingRequestsCount} pending permit request${pendingRequestsCount > 1 ? 's' : ''}`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {pendingRequestsCount}
                  </span>
                </button>
              )}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Companies', value: '1', icon: Building2, color: '#A43850' },
            { label: 'Total Users', value: '1', icon: Users, color: '#F5A623' },
            { label: 'Active Permits', value: '30', icon: FileText, color: '#8b2f43' },
            { label: 'Pending Requests', value: pendingRequestsCount.toString(), icon: Bell, color: '#F5A623', highlight: pendingRequestsCount > 0 },
          ].map((stat) => {
            const isClickable = stat.label === 'Pending Requests' && pendingRequestsCount > 0;
            const CardWrapper = isClickable ? 'button' : 'div';
            
            return (
              <CardWrapper
                key={stat.label}
                onClick={isClickable ? () => setActiveTab('requests') : undefined}
                className={`bg-[#241a1f] border rounded-2xl p-6 transition-all w-full text-left ${
                  stat.highlight
                    ? 'border-[#F5A623] shadow-lg shadow-[#F5A623]/20 animate-pulse'
                    : 'border-[#A43850]/20 hover:border-[#A43850]/40'
                } ${isClickable ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}`}
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
              </CardWrapper>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-[#241a1f] border border-[#A43850]/20 rounded-2xl overflow-hidden">
          <div className="border-b border-[#A43850]/20 flex">
            {[
              { id: 'companies', label: 'Companies', icon: Building2 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'requests', label: 'Permit Requests', icon: Bell, badge: pendingRequestsCount },
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
                  {tab.badge && tab.badge > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                      {tab.badge}
                    </span>
                  )}
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

            {activeTab === 'requests' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">Permit Requests</h3>
                    <p className="text-sm text-gray-400 mt-1">Review and approve new permit upload requests</p>
                  </div>
                </div>

                {permitRequests.length === 0 ? (
                  <div className="bg-[#1a1118] rounded-xl border border-[#A43850]/20 p-12 text-center">
                    <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-white mb-2">No Permit Requests</h4>
                    <p className="text-gray-400 text-sm">Companies can submit new permit PDFs for setup from their Settings page.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {permitRequests.map((request) => (
                      <div
                        key={request.id}
                        className={`bg-[#1a1118] rounded-xl border p-6 transition-all ${
                          request.status === 'pending'
                            ? 'border-[#F5A623] shadow-lg shadow-[#F5A623]/10'
                            : request.status === 'approved'
                            ? 'border-green-500/30'
                            : 'border-red-500/30 opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`p-3 rounded-xl ${
                              request.status === 'pending'
                                ? 'bg-[#F5A623]/10'
                                : request.status === 'approved'
                                ? 'bg-green-500/10'
                                : 'bg-red-500/10'
                            }`}>
                              <FileText className={`w-6 h-6 ${
                                request.status === 'pending'
                                  ? 'text-[#F5A623]'
                                  : request.status === 'approved'
                                  ? 'text-green-400'
                                  : 'text-red-400'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-semibold text-white">{request.fileName}</h4>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  request.status === 'pending'
                                    ? 'bg-[#F5A623]/20 text-[#F5A623]'
                                    : request.status === 'approved'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {request.status === 'pending' && <Clock className="w-3 h-3 inline mr-1" />}
                                  {request.status === 'approved' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                                  {request.status.toUpperCase()}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Company</p>
                                  <p className="text-sm text-white font-semibold">{request.companyName}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">File Size</p>
                                  <p className="text-sm text-gray-300">{(request.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Requested By</p>
                                  <p className="text-sm text-gray-300">{request.requestedBy}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 font-medium">Requested At</p>
                                  <p className="text-sm text-gray-300">
                                    {new Date(request.requestedAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveRequest(request.id)}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-all hover:shadow-lg active:scale-95"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectRequest(request.id)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-all hover:shadow-lg active:scale-95"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
