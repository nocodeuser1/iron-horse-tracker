import { Link } from 'react-router-dom';
import { useAuthStore } from '../lib/authStore';

export default function LandingPage() {
  const { isAuthenticated, isSuperAdmin, isCompanyUser } = useAuthStore();

  // If authenticated, redirect them to their appropriate dashboard
  if (isAuthenticated) {
    if (isSuperAdmin()) {
      window.location.href = '/admin-baber';
      return null;
    } else if (isCompanyUser()) {
      window.location.href = '/dashboard';
      return null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0a0d] via-[#1a1118] to-[#0f0a0d]">
      {/* Simple navbar */}
      <nav className="glass sticky top-0 z-50 bg-[#241a1f]/80 backdrop-blur-sm border-b border-[#A43850]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/visualpermit-logo.png" alt="VisualPermit.com" className="h-10" />
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="bg-gradient-to-r from-[#A43850] to-[#8b2f43] hover:from-[#8b2f43] hover:to-[#A43850] text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-[#A43850]/50"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <img
                src="/visualpermit-logo.png"
                alt="VisualPermit.com"
                className="h-32 mx-auto mb-6"
              />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-white">
              Environmental Compliance
              <br />
              Made <span className="gradient-text">Visual</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Upload any permit PDF. We extract requirements, track deadlines, and ensure
              compliance—all in one beautiful, intelligent platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#F5A623] to-[#F7B84D] hover:from-[#F7B84D] hover:to-[#F5A623] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transition transform hover:scale-105"
              >
                Get Started
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  ></path>
                </svg>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-black text-[#F5A623]">100%</div>
                <div className="text-sm text-gray-400 mt-1">Automated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-[#F5A623]">Zero</div>
                <div className="text-sm text-gray-400 mt-1">Missed Deadlines</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-[#F5A623]">$79</div>
                <div className="text-sm text-gray-400 mt-1">Per Month</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-[#241a1f]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Smart Tracking',
                description: 'Never miss a deadline with intelligent requirement tracking',
                icon: '📊',
              },
              {
                title: 'Custom Branding',
                description: 'Upload your company logo and make it yours',
                icon: '🎨',
              },
              {
                title: 'Team Collaboration',
                description: 'Manage multiple users and roles effortlessly',
                icon: '👥',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-[#241a1f] border border-[#A43850]/20 rounded-2xl p-6 hover:border-[#A43850]/40 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#1a1118] border-t border-[#A43850]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 VisualPermit.com. Environmental Compliance Management Platform.
          </p>
        </div>
      </footer>

      <style>{`
        .gradient-text {
          background: linear-gradient(135deg, #F5A623 0%, #F7B84D 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .glass {
          background: rgba(36, 26, 31, 0.6);
          backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
}
