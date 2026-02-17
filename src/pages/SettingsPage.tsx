import { Settings } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">
          Configure your permit tracker preferences
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <Settings className="w-16 h-16 text-gray-300 mx-auto" />
        <h2 className="text-xl font-semibold text-gray-900 mt-4">
          Settings Coming Soon
        </h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Permit management, notification preferences, data import/export,
          and theme customization will be available in Phase 3.
        </p>
      </div>
    </div>
  );
}
