import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../lib/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect based on role
  if (isAuthenticated) {
    const { user } = useAuthStore.getState();
    if (user?.role === 'super_admin') {
      return <Navigate to="/admin-baber" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = login(email, password);

    if (success) {
      // Get the user after login to check role
      const { user } = useAuthStore.getState();
      
      // Redirect based on role
      if (user?.role === 'super_admin') {
        navigate('/admin-baber', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0a0d] via-[#1a1118] to-[#0f0a0d] flex items-center justify-center p-4 page-transition">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6 cursor-pointer hover:opacity-90 transition-opacity">
            <img
              src="/visualpermit-logo-new.png"
              alt="VisualPermit.com"
              className="h-32 mx-auto"
            />
          </Link>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#241a1f]/80 backdrop-blur-sm border border-[#A43850]/20 rounded-xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-[#1a1118] border border-[#A43850]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A43850] focus:border-transparent transition-all disabled:opacity-50"
                placeholder="your.email@company.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-[#1a1118] border border-[#A43850]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A43850] focus:border-transparent transition-all disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#A43850] to-[#8b2f43] hover:from-[#8b2f43] hover:to-[#A43850] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-[#A43850]/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-[#A43850]/20">
            <p className="text-xs text-gray-500 text-center">
              Need help? Contact support@visualpermit.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
