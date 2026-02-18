import { useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  Download,
  Upload,
  Plus,
  X,
  Info,
  Database,
  CheckCircle2,
  Moon,
  Sun,
  FileText,
} from 'lucide-react';
import { useDarkMode } from '../lib/darkMode';
import { usePermitTypeStore } from '../lib/permitTypeStore';

type Tab = 'permitTypes' | 'actionTypes' | 'notifications' | 'data' | 'about';

const DEFAULT_ACTION_TYPES = [
  'Event Actions',
  'Inspections',
  'Samples',
  'Tests',
  'Throughput Reports',
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('permitTypes');
  
  // Action Types (within a permit)
  const [actionTypes, setActionTypes] = useState(DEFAULT_ACTION_TYPES);
  const [newActionType, setNewActionType] = useState('');
  
  // Permit Types (global modes)
  const { permitTypes, removePermitType } = usePermitTypeStore();
  
  const [saved, setSaved] = useState(false);
  const { dark, toggle } = useDarkMode();
  
  // Permit upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Notification prefs
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [dashAlerts, setDashAlerts] = useState(true);
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [leadDays, setLeadDays] = useState('7');

  const handleAddActionType = () => {
    const trimmed = newActionType.trim();
    if (trimmed && !actionTypes.includes(trimmed)) {
      setActionTypes([...actionTypes, trimmed]);
      setNewActionType('');
    }
  };

  const handleRemoveActionType = (t: string) => {
    setActionTypes(actionTypes.filter((p) => p !== t));
  };

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file: File | undefined) => {
    setUploadError('');
    setUploadSuccess(false);

    if (!file) return;

    // Validate file type (PDF only)
    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are accepted');
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
  };

  const handleSubmitPermit = () => {
    if (!uploadedFile) {
      setUploadError('Please select a PDF file first');
      return;
    }

    // Store permit request in localStorage for super admin to see
    const requests = JSON.parse(localStorage.getItem('permitRequests') || '[]');
    const newRequest = {
      id: Date.now().toString(),
      fileName: uploadedFile.name,
      fileSize: uploadedFile.size,
      companyName: 'Iron Horse Midstream', // Will be dynamic in multi-tenant version
      requestedBy: 'Company Admin',
      requestedAt: new Date().toISOString(),
      status: 'pending',
    };
    requests.push(newRequest);
    localStorage.setItem('permitRequests', JSON.stringify(requests));

    // Show success message
    setUploadSuccess(true);
    setUploadedFile(null);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setUploadSuccess(false);
    }, 3000);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadError('');
  };

  const tabs: { id: Tab; label: string; icon: typeof Settings }[] = [
    { id: 'permitTypes', label: 'Permit Types', icon: FileText },
    { id: 'actionTypes', label: 'Action Types', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Import / Export', icon: Database },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Configure your permit tracker
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Saved!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border p-2 space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-burgundy-50 dark:bg-burgundy-900/40 text-burgundy-700 dark:text-burgundy-200'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}

            {/* Dark mode toggle in sidebar */}
            <div className="border-t border-gray-100 dark:border-dark-border pt-2 mt-2">
              <button
                onClick={toggle}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface transition-all"
              >
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {dark ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border p-6 animate-fade-in" key={activeTab}>

            {/* Permit Types - Global Mode Switcher */}
            {activeTab === 'permitTypes' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Permit Types
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Manage different permit programs. Switching permit type changes the entire app mode.
                  </p>
                </div>

                <div className="space-y-3">
                  {permitTypes.map((permit) => (
                    <div
                      key={permit.id}
                      className="px-4 py-4 bg-gray-50 dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border group hover:border-burgundy-300 dark:hover:border-burgundy-600 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                              {permit.name}
                            </h3>
                            {permit.id === 'title-v' && (
                              <span className="px-2 py-0.5 bg-burgundy-100 dark:bg-burgundy-900/40 text-burgundy-700 dark:text-burgundy-300 text-xs font-medium rounded-md">
                                Active Sample Data
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {permit.description}
                          </p>
                        </div>
                        {!['title-v', 'pbr'].includes(permit.id) && (
                          <button
                            onClick={() => removePermitType(permit.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-all ml-2"
                            aria-label={`Remove ${permit.name}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upload New Permit Section */}
                <div className="bg-gradient-to-br from-burgundy-50 to-gold-50 dark:from-burgundy-900/20 dark:to-gold-900/20 border-2 border-dashed border-burgundy-200 dark:border-burgundy-700/30 rounded-2xl p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Upload className="w-6 h-6 text-burgundy-600 dark:text-burgundy-400 shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-burgundy-900 dark:text-burgundy-100 mb-1">
                        Request New Permit Type
                      </h3>
                      <p className="text-sm text-burgundy-700 dark:text-burgundy-300">
                        Upload your permit PDF and we'll set up tracking for you.
                      </p>
                      <p className="text-xs text-burgundy-600 dark:text-burgundy-400 mt-1">
                        Accepts PDF only • Max 10MB
                      </p>
                    </div>
                  </div>

                  {/* Upload Area */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                      uploadedFile
                        ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-surface hover:border-burgundy-400 dark:hover:border-burgundy-500'
                    }`}
                  >
                    {!uploadedFile ? (
                      <>
                        <Upload className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Drag and drop your permit PDF here
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                          or click to browse
                        </p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="permit-upload"
                        />
                        <label
                          htmlFor="permit-upload"
                          className="inline-block px-4 py-2 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-lg text-sm font-medium cursor-pointer transition-all hover:shadow-lg active:scale-95"
                        >
                          Choose PDF File
                        </label>
                      </>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                            <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {uploadedFile.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={removeFile}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500 transition-all"
                          title="Remove file"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Error Message */}
                  {uploadError && (
                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/30 rounded-lg flex items-start gap-2">
                      <Info className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700 dark:text-red-300">{uploadError}</p>
                    </div>
                  )}

                  {/* Success Message */}
                  {uploadSuccess && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/30 rounded-lg flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                          Request submitted successfully!
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                          Your VisualPermit.com contact will review and set up tracking for this permit.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmitPermit}
                    disabled={!uploadedFile || uploadSuccess}
                    className={`mt-4 w-full px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                      uploadedFile && !uploadSuccess
                        ? 'bg-gradient-to-r from-burgundy-500 to-burgundy-600 hover:from-burgundy-600 hover:to-burgundy-700 text-white shadow-lg hover:shadow-xl active:scale-95'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {uploadSuccess ? 'Request Sent' : 'Submit Permit Request'}
                  </button>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/30 rounded-xl p-6 text-center">
                  <Info className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Custom Permit Types
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    New permit types available upon request.
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    Contact your administrator to add NESHAP, PSD, or other permit programs.
                  </p>
                </div>
              </div>
            )}

            {/* Action Types - Types of Activities Within a Permit */}
            {activeTab === 'actionTypes' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Action Types
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Manage the types of compliance actions tracked within the current permit.
                  </p>
                </div>

                <div className="space-y-2">
                  {actionTypes.map((t) => (
                    <div
                      key={t}
                      className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-dark-surface rounded-xl group hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 transition-colors"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        {t}
                      </span>
                      <button
                        onClick={() => handleRemoveActionType(t)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-all"
                        aria-label={`Remove ${t}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newActionType}
                    onChange={(e) => setNewActionType(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddActionType()}
                    placeholder="Add new action type..."
                    className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-dark-border rounded-xl text-sm bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-burgundy-500/30 focus:border-burgundy-500 outline-none transition-all"
                  />
                  <button
                    onClick={handleAddActionType}
                    className="px-4 py-2.5 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                <button
                  onClick={showSaved}
                  className="px-5 py-2.5 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notification Preferences
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Configure how you receive compliance alerts.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      label: 'Email Notifications',
                      desc: 'Receive email alerts for upcoming deadlines',
                      checked: emailNotifs,
                      onChange: setEmailNotifs,
                    },
                    {
                      label: 'Dashboard Alerts',
                      desc: 'Show alert badges on the dashboard',
                      checked: dashAlerts,
                      onChange: setDashAlerts,
                    },
                    {
                      label: 'Overdue Items Only',
                      desc: 'Only notify for items past their deadline',
                      checked: overdueOnly,
                      onChange: setOverdueOnly,
                    },
                  ].map(({ label, desc, checked, onChange }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between px-4 py-4 bg-gray-50 dark:bg-dark-surface rounded-xl"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {desc}
                        </p>
                      </div>
                      <button
                        onClick={() => onChange(!checked)}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                          checked ? 'bg-burgundy-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            checked ? 'translate-x-5.5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="px-4 py-4 bg-gray-50 dark:bg-dark-surface rounded-xl">
                  <label className="text-sm font-medium text-gray-900 dark:text-white block mb-2">
                    Advance Notice (days)
                  </label>
                  <select
                    value={leadDays}
                    onChange={(e) => setLeadDays(e.target.value)}
                    className="px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-card text-gray-900 dark:text-white"
                  >
                    {['3', '7', '14', '30'].map((d) => (
                      <option key={d} value={d}>
                        {d} days before deadline
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={showSaved}
                  className="px-5 py-2.5 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg active:scale-95"
                >
                  Save Preferences
                </button>
              </div>
            )}

            {/* Data Import/Export */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Data Management
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Import and export your permit data.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-gray-200 dark:border-dark-border rounded-2xl p-6 text-center hover:border-burgundy-300 dark:hover:border-burgundy-600 transition-colors cursor-pointer group">
                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-burgundy-500 mx-auto transition-colors" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-3">
                      Import Data
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Upload CSV or Excel file
                    </p>
                    <button className="mt-3 px-4 py-2 bg-gray-100 dark:bg-dark-surface hover:bg-burgundy-50 dark:hover:bg-burgundy-900/30 rounded-lg text-sm text-gray-600 dark:text-gray-300 transition-colors">
                      Choose File
                    </button>
                  </div>

                  <div className="border-2 border-dashed border-gray-200 dark:border-dark-border rounded-2xl p-6 text-center hover:border-gold-300 dark:hover:border-gold-600 transition-colors cursor-pointer group">
                    <Download className="w-8 h-8 text-gray-400 group-hover:text-gold-500 mx-auto transition-colors" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-3">
                      Export Data
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Download as CSV or JSON
                    </p>
                    <div className="mt-3 flex gap-2 justify-center">
                      <button className="px-3 py-2 bg-gray-100 dark:bg-dark-surface hover:bg-gold-50 dark:hover:bg-gold-900/20 rounded-lg text-sm text-gray-600 dark:text-gray-300 transition-colors">
                        CSV
                      </button>
                      <button className="px-3 py-2 bg-gray-100 dark:bg-dark-surface hover:bg-gold-50 dark:hover:bg-gold-900/20 rounded-lg text-sm text-gray-600 dark:text-gray-300 transition-colors">
                        JSON
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-xl p-4 flex gap-3">
                  <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Data stored locally
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                      All data is stored in your browser's localStorage. Exporting regularly is recommended as a backup.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* About */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    About
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Application information and version details.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-burgundy-50 to-gold-50 dark:from-burgundy-900/30 dark:to-dark-surface rounded-2xl p-6 border border-burgundy-100 dark:border-dark-border">
                  <div className="flex items-center gap-4">
                    <img
                      src="/IH Logo.png"
                      alt="Iron Horse"
                      className="h-16 w-auto"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div>
                      <h3 className="text-xl font-bold text-burgundy-900 dark:text-burgundy-100">
                        Iron Horse Midstream
                      </h3>
                      <p className="text-sm text-burgundy-600 dark:text-burgundy-300">
                        Title V Permit Tracker
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Version', value: '1.0.0' },
                    { label: 'Build', value: '2025.02' },
                    { label: 'Framework', value: 'React 18 + Vite' },
                    { label: 'License', value: 'Proprietary' },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="px-4 py-3 bg-gray-50 dark:bg-dark-surface rounded-xl"
                    >
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {label}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white font-semibold mt-0.5">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-dark-border">
                  <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-4">
                    Powered by
                  </p>
                  <div className="flex justify-center">
                    <img
                      src="/visualpermit-logo.png"
                      alt="VisualPermit.com"
                      className="h-24 w-auto"
                    />
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
                    Environmental Compliance Management Platform
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
