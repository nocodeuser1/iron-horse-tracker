// This file contains the tab content sections for SuperAdmin
// Will be integrated into SuperAdmin.tsx

{/* USER MANAGEMENT TAB */}
{activeTab === 'users' && (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold text-white">User Management</h3>
      <button
        onClick={handleAddUser}
        className="bg-gradient-to-r from-[#F5A623] to-[#F7B84D] hover:from-[#F7B84D] hover:to-[#F5A623] text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-[#F5A623]/50 flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add User
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
              <td className="px-6 py-4 text-white font-medium">{u.name}</td>
              <td className="px-6 py-4 text-gray-300">{u.email}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    u.role === 'super_admin'
                      ? 'bg-purple-500/10 text-purple-400'
                      : u.role === 'company_admin'
                      ? 'bg-[#F5A623]/10 text-[#F5A623]'
                      : 'bg-gray-500/10 text-gray-400'
                  }`}
                >
                  {u.role === 'super_admin' ? 'Super Admin' : u.role === 'company_admin' ? 'Company Admin' : 'User'}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-300">{u.companyName || '—'}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleEditUser(u)}
                    className="p-2 text-[#F5A623] hover:text-[#F7B84D] hover:bg-[#F5A623]/10 rounded-lg transition-all"
                    title="Edit user"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
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
  </div>
)}

{/* SETTINGS TAB */}
{activeTab === 'settings' && (
  <div>
    <h3 className="text-xl font-bold text-white mb-6">Global Settings & AI Configuration</h3>

    <div className="space-y-8">
      {/* AI API Keys Section */}
      <div className="bg-[#1a1118] rounded-xl border border-[#A43850]/20 p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#F5A623]" />
          AI API Configuration
        </h4>
        <p className="text-sm text-gray-400 mb-6">
          Configure AI providers for system-wide AI features (permit extraction, AI assistant, etc.)
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              value={aiSettings.openaiKey}
              onChange={(e) => setAiSettings({ ...aiSettings, openaiKey: e.target.value })}
              placeholder="sk-..."
              className="w-full px-4 py-2.5 bg-[#241a1f] border border-[#A43850]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">For GPT-4o, Whisper, etc.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Anthropic API Key
            </label>
            <input
              type="password"
              value={aiSettings.anthropicKey}
              onChange={(e) => setAiSettings({ ...aiSettings, anthropicKey: e.target.value })}
              placeholder="sk-ant-..."
              className="w-full px-4 py-2.5 bg-[#241a1f] border border-[#A43850]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">For Claude Opus/Sonnet</p>
          </div>
        </div>
      </div>

      {/* Database Configuration Section */}
      <div className="bg-[#1a1118] rounded-xl border border-[#A43850]/20 p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#F5A623]" />
          Database Configuration (Supabase)
        </h4>
        <p className="text-sm text-gray-400 mb-6">
          Database credentials for AI assistant and system operations
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Supabase Project URL
            </label>
            <input
              type="text"
              value={aiSettings.supabaseUrl}
              onChange={(e) => setAiSettings({ ...aiSettings, supabaseUrl: e.target.value })}
              placeholder="https://your-project.supabase.co"
              className="w-full px-4 py-2.5 bg-[#241a1f] border border-[#A43850]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Supabase Anon Key (Public)
              </label>
              <input
                type="password"
                value={aiSettings.supabaseAnonKey}
                onChange={(e) => setAiSettings({ ...aiSettings, supabaseAnonKey: e.target.value })}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-4 py-2.5 bg-[#241a1f] border border-[#A43850]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Supabase Service Role Key (Secret)
              </label>
              <input
                type="password"
                value={aiSettings.supabaseServiceKey}
                onChange={(e) => setAiSettings({ ...aiSettings, supabaseServiceKey: e.target.value })}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-4 py-2.5 bg-[#241a1f] border border-[#A43850]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Configuration Section */}
      <div className="bg-[#1a1118] rounded-xl border border-[#A43850]/20 p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#F5A623]" />
          GitHub Repository Configuration
        </h4>
        <p className="text-sm text-gray-400 mb-6">
          Repository information for AI assistant to help with system updates
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              GitHub Repository URL
            </label>
            <input
              type="text"
              value={aiSettings.githubRepo}
              onChange={(e) => setAiSettings({ ...aiSettings, githubRepo: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#241a1f] border border-[#A43850]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] transition-all"
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">Current app repository</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              GitHub Personal Access Token
            </label>
            <input
              type="password"
              value={aiSettings.githubToken}
              onChange={(e) => setAiSettings({ ...aiSettings, githubToken: e.target.value })}
              placeholder="ghp_..."
              className="w-full px-4 py-2.5 bg-[#241a1f] border border-[#A43850]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">For AI assistant to read repo structure</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="bg-gradient-to-r from-[#A43850] to-[#8b2f43] hover:from-[#8b2f43] hover:to-[#A43850] text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-[#A43850]/50 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  </div>
)}

{/* AI ASSISTANT TAB */}
{activeTab === 'ai-assistant' && (
  <div>
    <h3 className="text-xl font-bold text-white mb-6">AI Assistant</h3>
    
    <div className="bg-[#1a1118] border border-[#F5A623]/30 rounded-xl p-4 mb-6">
      <p className="text-sm text-gray-300">
        <strong className="text-[#F5A623]">AI Assistant:</strong> Chat with an AI that has access to your database schema, GitHub repository, and system configuration.
        Upload client permit PDFs to automatically extract requirements and update company accounts.
      </p>
    </div>

    {/* File Upload Section */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-3">
        Upload Client Permit (PDF)
      </label>
      <div className="flex items-center gap-4">
        <label className="flex-1 cursor-pointer">
          <div className="border-2 border-dashed border-[#A43850]/40 hover:border-[#F5A623] rounded-xl p-6 text-center transition-all">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF files only</p>
          </div>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
        {uploadedFile && (
          <div className="bg-[#241a1f] border border-[#A43850]/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
              <span className="text-red-400 font-semibold text-sm">PDF</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{uploadedFile.name}</p>
              <p className="text-xs text-gray-400">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={() => setUploadedFile(null)}
              className="p-1 hover:bg-red-500/10 rounded transition-colors"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        )}
      </div>
    </div>

    {/* Chat Interface */}
    <div className="bg-[#1a1118] rounded-xl border border-[#A43850]/20 flex flex-col h-[500px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {aiMessages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No messages yet</p>
            <p className="text-sm text-gray-500">
              Ask about database schemas, system updates, or upload a permit PDF
            </p>
          </div>
        ) : (
          aiMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#A43850] to-[#8b2f43] text-white'
                    : 'bg-[#241a1f] text-gray-300 border border-[#A43850]/20'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="border-t border-[#A43850]/20 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about database, GitHub, or describe what you need..."
            className="flex-1 px-4 py-3 bg-[#241a1f] border border-[#A43850]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] transition-all"
          />
          <button
            onClick={handleSendMessage}
            disabled={!aiInput.trim()}
            className="bg-gradient-to-r from-[#F5A623] to-[#F7B84D] hover:from-[#F7B84D] hover:to-[#F5A623] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-[#F5A623]/50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
)}
