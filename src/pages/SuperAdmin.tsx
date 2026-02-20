import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../lib/authStore';
import { Building2, Users, FileText, Settings, LogOut, Bell, CheckCircle2, Clock, Upload, Trash2, Edit, Send, X, Info, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';

// Calculate monthly cost based on permit count
// Base: $50/month + $30/month per additional permit
const calculateMonthlyCost = (permitCount: number): number => {
  const baseCost = 50;
  const additionalPermits = Math.max(0, permitCount - 1);
  return baseCost + (additionalPermits * 30);
};

interface PermitRequest {
  id: string;
  fileName: string;
  fileSize: number;
  companyName: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'company_admin' | 'user';
  companyId?: string;
  companyName?: string;
}

interface AISettings {
  openaiKey: string;
  anthropicKey: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey: string;
  githubRepo: string;
  githubToken: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function SuperAdmin() {
  const { user, isSuperAdmin, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'companies' | 'users' | 'requests' | 'settings' | 'aiAssistant'>('companies');
  const [permitRequests, setPermitRequests] = useState<PermitRequest[]>([]);
  
  // User Management State
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Israel Hindman', email: 'israel@baberenvironmental.com', role: 'super_admin' },
    { id: '2', name: 'Scott', email: 'scott@baberenvironmental.com', role: 'company_admin', companyId: '1', companyName: 'Iron Horse Midstream' },
    { id: '3', name: 'Sheila', email: 'sheila@baberenvironmental.com', role: 'company_admin', companyId: '1', companyName: 'Iron Horse Midstream' },
  ]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'user' as User['role'], companyId: '' });
  
  // Settings State
  const [aiSettings, setAiSettings] = useState<AISettings>({
    openaiKey: '',
    anthropicKey: '',
    supabaseUrl: '',
    supabaseAnonKey: '',
    supabaseServiceKey: '',
    githubRepo: 'https://github.com/nocodeuser1/iron-horse-tracker',
    githubToken: '',
  });
  const [settingsSaved, setSettingsSaved] = useState(false);
  
  // AI Assistant State
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [uploadedPdf, setUploadedPdf] = useState<File | null>(null);

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

  // Load AI settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aiSettings');
    if (saved) {
      setAiSettings(JSON.parse(saved));
    }
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

  // User Management Handlers
  const handleAddUser = () => {
    setEditingUser(null);
    setUserForm({ name: '', email: '', password: '', role: 'user', companyId: '' });
    setShowUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({ name: user.name, email: user.email, password: '', role: user.role, companyId: user.companyId || '' });
    setShowUserModal(true);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userForm } : u));
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now().toString(),
        ...userForm,
        companyName: userForm.companyId === '1' ? 'Iron Horse Midstream' : undefined,
      };
      setUsers([...users, newUser]);
    }
    setShowUserModal(false);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  // Settings Handlers
  const handleSaveSettings = () => {
    localStorage.setItem('aiSettings', JSON.stringify(aiSettings));
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  // AI Assistant Handlers
  const handleSendMessage = () => {
    if (!aiInput.trim()) return;
    
    const userMessage: ChatMessage = { role: 'user', content: aiInput };
    setAiMessages([...aiMessages, userMessage]);
    setAiInput('');
    
    // Mock AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        role: 'assistant',
        content: 'AI Assistant is not yet connected. This is a placeholder response. Configure API keys in Settings to enable AI features.',
      };
      setAiMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) {
      setUploadedPdf(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0a0d] via-[#1a1118] to-[#0f0a0d]">
      {/* Navbar */}
      <nav className="bg-[#241a1f]/80 backdrop-blur-sm border-b border-[#A43850]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/visualpermit-logo-new.png" alt="VisualPermit.com" className="h-10 w-auto" />
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {[
            { label: 'Total Companies', value: '1', icon: Building2, color: '#A43850' },
            { label: 'Total Users', value: '3', icon: Users, color: '#F5A623' },
            { label: 'Active Permits', value: '1', icon: FileText, color: '#8b2f43' },
            { label: 'Monthly Revenue', value: `$${calculateMonthlyCost(1)}`, icon: FileText, color: '#10b981' },
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
          <div className="border-b border-[#A43850]/20 flex flex-wrap">
            {[
              { id: 'companies', label: 'Companies', icon: Building2 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'requests', label: 'Permit Requests', icon: Bell, badge: pendingRequestsCount },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'aiAssistant', label: 'AI Assistant', icon: Brain },
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
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Monthly Cost</th>
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
                        <td className="px-6 py-4 text-gray-300">2</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-white">1 permit</p>
                            <p className="text-xs text-gray-400">Title V</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-green-400">${calculateMonthlyCost(1)}/month</p>
                            <p className="text-xs text-gray-400">$50 base</p>
                          </div>
                        </td>
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
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">User Management</h3>
                  <button
                    onClick={handleAddUser}
                    className="bg-gradient-to-r from-[#A43850] to-[#8b2f43] hover:from-[#8b2f43] hover:to-[#A43850] text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-[#A43850]/50"
                  >
                    + Add User
                  </button>
                </div>

                {/* Users Table */}
                <div className="bg-[#1a1118] rounded-xl border border-[#A43850]/20 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#241a1f] border-b border-[#A43850]/20">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Company</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-[#A43850]/10 hover:bg-[#241a1f]/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-white">{u.name}</p>
                          </td>
                          <td className="px-6 py-4 text-gray-300">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                              u.role === 'super_admin'
                                ? 'bg-purple-500/20 text-purple-400'
                                : u.role === 'company_admin'
                                ? 'bg-gold-500/20 text-gold-400'
                                : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {u.role === 'super_admin' ? 'Super Admin' : u.role === 'company_admin' ? 'Company Admin' : 'User'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-300">{u.companyName || '—'}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditUser(u)}
                                className="p-2 hover:bg-[#F5A623]/20 rounded-lg text-[#F5A623] transition-all"
                                title="Edit user"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-all"
                                title="Delete user"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* User Modal */}
                {showUserModal && (
                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-[#241a1f] border border-[#A43850]/20 rounded-2xl p-8 max-w-md w-full mx-4">
                      <h3 className="text-2xl font-bold text-white mb-6">{editingUser ? 'Edit User' : 'Add User'}</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                          <input
                            type="text"
                            value={userForm.name}
                            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                            className="w-full px-4 py-2 bg-[#1a1118] border border-[#A43850]/30 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                          <input
                            type="email"
                            value={userForm.email}
                            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                            className="w-full px-4 py-2 bg-[#1a1118] border border-[#A43850]/30 rounded-lg text-white"
                          />
                        </div>
                        {!editingUser && (
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <input
                              type="password"
                              value={userForm.password}
                              onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                              className="w-full px-4 py-2 bg-[#1a1118] border border-[#A43850]/30 rounded-lg text-white"
                            />
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                          <select
                            value={userForm.role}
                            onChange={(e) => setUserForm({ ...userForm, role: e.target.value as User['role'] })}
                            className="w-full px-4 py-2 bg-[#1a1118] border border-[#A43850]/30 rounded-lg text-white"
                          >
                            <option value="user">User</option>
                            <option value="company_admin">Company Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                        </div>
                        {userForm.role !== 'super_admin' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                            <select
                              value={userForm.companyId}
                              onChange={(e) => setUserForm({ ...userForm, companyId: e.target.value })}
                              className="w-full px-4 py-2 bg-[#1a1118] border border-[#A43850]/30 rounded-lg text-white"
                            >
                              <option value="">Select company...</option>
                              <option value="1">Iron Horse Midstream</option>
                            </select>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={handleSaveUser}
                          className="flex-1 bg-gradient-to-r from-[#A43850] to-[#8b2f43] hover:from-[#8b2f43] hover:to-[#A43850] text-white px-6 py-2.5 rounded-xl font-semibold transition-all"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setShowUserModal(false)}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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

            {activeTab === 'settings' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">Global Settings</h3>
                  <p className="text-sm text-gray-400">Configure AI API keys, database credentials, and GitHub access</p>
                </div>

                <div className="space-y-6">
                  {/* AI API Configuration */}
                  <div className="bg-[#1a1118] rounded-xl border border-[#A43850]/20 p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-[#F5A623]" />
                      AI API Configuration
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">OpenAI API Key</label>
                        <input
                          type="password"
                          value={aiSettings.openaiKey}
                          onChange={(e) => setAiSettings({ ...aiSettings, openaiKey: e.target.value })}
                          placeholder="sk-..."
                          className="w-full px-4 py-2 bg-[#241a1f] border border-[#A43850]/30 rounded-lg text-white placeholder-gray-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">For GPT-4o, Whisper transcription</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Anthropic API Key</label>
                        <input
                          type="password"
                          value={aiSettings.anthropicKey}
                          onChange={(e) => setAiSettings({ ...aiSettings, anthropicKey: e.target.value })}
                          placeholder="sk-ant-..."
                          className="w-full px-4 py-2 bg-[#241a1f] border border-[#A43850]/30 rounded-lg text-white placeholder-gray-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">For Claude Opus/Sonnet</p>
                      </div>
                    </div>
                  </div>

                  {/* Database Configuration */}
                  <div className="bg-[#1a1118] rounded-xl border border-[#A43850]/20 p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#F5A623]" />
                      Database Configuration (Supabase)
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Project URL</label>
                        <input
                          type="text"
                          value={aiSettings.supabaseUrl}
                          onChange={(e) => setAiSettings({ ...aiSettings, supabaseUrl: e.target.value })}
                          placeholder="https://your-project.supabase.co"
                          className="w-full px-4 py-2 bg-[#241a1f] border border-[#A43850]/30 rounded-lg text-white placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Anon Key (Public)</label>
                        <input
                          type="password"
                          value={aiSettings.supabaseAnonKey}
                          onChange={(e) => setAiSettings({ ...aiSettings, supabaseAnonKey: e.target.value })}
                          placeholder="eyJhbGciOiJI..."
                          className="w-full px-4 py-2 bg-[#241a1f] border border-[#A43850]/30 rounded-lg text-white placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Service Role Key (Admin)</label>
                        <input
                          type="password"
                          value={aiSettings.supabaseServiceKey}
                          onChange={(e) => setAiSettings({ ...aiSettings, supabaseServiceKey: e.target.value })}
                          placeholder="eyJhbGciOiJI..."
                          className="w-full px-4 py-2 bg-[#241a1f] border border-[#A43850]/30 rounded-lg text-white placeholder-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* GitHub Configuration */}
                  <div className="bg-[#1a1118] rounded-xl border border-[#A43850]/20 p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-[#F5A623]" />
                      GitHub Repository
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Repository URL</label>
                        <input
                          type="text"
                          value={aiSettings.githubRepo}
                          readOnly
                          className="w-full px-4 py-2 bg-[#241a1f]/50 border border-[#A43850]/20 rounded-lg text-gray-400 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">Pre-configured repository</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Personal Access Token</label>
                        <input
                          type="password"
                          value={aiSettings.githubToken}
                          onChange={(e) => setAiSettings({ ...aiSettings, githubToken: e.target.value })}
                          placeholder="ghp_..."
                          className="w-full px-4 py-2 bg-[#241a1f] border border-[#A43850]/30 rounded-lg text-white placeholder-gray-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">For AI to read repo structure</p>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleSaveSettings}
                      className="bg-gradient-to-r from-[#A43850] to-[#8b2f43] hover:from-[#8b2f43] hover:to-[#A43850] text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-[#A43850]/50"
                    >
                      Save Settings
                    </button>
                    {settingsSaved && (
                      <span className="flex items-center gap-2 text-green-400 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        Saved successfully!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'aiAssistant' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">AI Assistant</h3>
                  <p className="text-sm text-gray-400">Chat with AI that has database and GitHub access, or upload permit PDFs for processing</p>
                </div>

                <div className="space-y-6">
                  {/* Info Banner */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-300 font-medium">AI Assistant Capabilities</p>
                      <p className="text-xs text-blue-400 mt-1">
                        This AI has access to your database schema, GitHub repository, and can extract permit requirements from uploaded PDFs.
                        Configure API keys in Settings to enable.
                      </p>
                    </div>
                  </div>

                  {/* PDF Upload */}
                  <div className="bg-[#1a1118] rounded-xl border border-[#A43850]/20 p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-[#F5A623]" />
                      Upload Permit PDF
                    </h4>
                    <div className="border-2 border-dashed border-[#A43850]/30 rounded-xl p-6 text-center">
                      {!uploadedPdf ? (
                        <>
                          <Upload className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                          <p className="text-sm text-gray-400 mb-3">Drag and drop or click to upload PDF</p>
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={handlePdfUpload}
                            className="hidden"
                            id="pdf-upload"
                          />
                          <label
                            htmlFor="pdf-upload"
                            className="inline-block px-4 py-2 bg-[#A43850] hover:bg-[#8b2f43] text-white rounded-lg cursor-pointer transition-all"
                          >
                            Choose PDF File
                          </label>
                        </>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-[#F5A623]" />
                            <div className="text-left">
                              <p className="text-sm font-semibold text-white">{uploadedPdf.name}</p>
                              <p className="text-xs text-gray-400">{(uploadedPdf.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setUploadedPdf(null)}
                            className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-all"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Chat Interface */}
                  <div className="bg-[#1a1118] rounded-xl border border-[#A43850]/20 p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-[#F5A623]" />
                      Chat with AI
                    </h4>
                    
                    {/* Messages */}
                    <div className="bg-[#241a1f] rounded-xl p-4 mb-4 h-96 overflow-y-auto">
                      {aiMessages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-center">
                          <div>
                            <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-sm">Start a conversation with the AI Assistant</p>
                            <p className="text-gray-500 text-xs mt-2">Ask about database schema, system updates, or permit processing</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {aiMessages.map((msg, i) => (
                            <div
                              key={i}
                              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] px-4 py-3 rounded-xl ${
                                  msg.role === 'user'
                                    ? 'bg-gradient-to-r from-[#A43850] to-[#8b2f43] text-white'
                                    : 'bg-[#1a1118] text-gray-300 border border-[#A43850]/20'
                                }`}
                              >
                                <p className="text-sm">{msg.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 bg-[#241a1f] border border-[#A43850]/30 rounded-lg text-white placeholder-gray-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="px-6 py-2 bg-gradient-to-r from-[#A43850] to-[#8b2f43] hover:from-[#8b2f43] hover:to-[#A43850] text-white rounded-lg transition-all flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
