import { Link } from 'react-router-dom';
import { useAuthStore } from '../lib/authStore';
import { Upload, Calendar, BarChart3, Filter, CheckCircle, Building2, Bell, Palette, Shield } from 'lucide-react';

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

  const features = [
    {
      icon: Upload,
      title: 'Permit Upload & Setup',
      description: 'Upload any permit PDF (Title V, PBR, NSR, etc.) and our team will extract requirements, deadlines, and facility data for you.',
      gradient: 'from-[#A43850] to-[#8b2f43]',
    },
    {
      icon: Calendar,
      title: 'Smart Calendar',
      description: 'Beautiful calendar view with color-coded events. Overdue alerts, automatic reminders, and deadline tracking keep you compliant.',
      gradient: 'from-[#F5A623] to-[#F7B84D]',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Dashboard',
      description: 'Live metrics, overdue tracking, compliance scores. Beautiful charts give instant insights into your operations.',
      gradient: 'from-[#A43850] to-[#8b2f43]',
    },
    {
      icon: Filter,
      title: 'Advanced Filtering',
      description: 'Filter by action type, equipment, frequency, or status. Powerful search finds exactly what you need instantly.',
      gradient: 'from-[#F5A623] to-[#F7B84D]',
    },
    {
      icon: CheckCircle,
      title: 'Completion Tracking',
      description: 'Mark complete with date logging and file uploads. Perfect audit trail for inspections and compliance reviews.',
      gradient: 'from-[#A43850] to-[#8b2f43]',
    },
    {
      icon: Building2,
      title: 'Multi-Facility',
      description: 'Manage multiple facilities with custom branding. Switch between sites seamlessly in one platform.',
      gradient: 'from-[#F5A623] to-[#F7B84D]',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'In-app notifications keep you updated on permit status, upcoming deadlines, and team activity. Never miss important updates.',
      gradient: 'from-[#A43850] to-[#8b2f43]',
    },
    {
      icon: Palette,
      title: 'Custom Branding',
      description: 'Upload your company logo and colors. Each facility gets its own branded environment with your identity.',
      gradient: 'from-[#F5A623] to-[#F7B84D]',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Role-based access, audit trails, and secure file storage. Your permit data is protected with enterprise-grade security.',
      gradient: 'from-[#A43850] to-[#8b2f43]',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0a0d] via-[#1a1118] to-[#0f0a0d] page-transition">
      {/* Navigation */}
      <nav className="glass sticky top-0 z-50 bg-[#241a1f]/80 backdrop-blur-sm border-b border-[#A43850]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <Link to="/" className="flex items-center -ml-2 transition-opacity hover:opacity-90">
              <img src="/visualpermit-logo.png" alt="VisualPermit.com" className="h-20" />
            </Link>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="bg-gradient-to-r from-[#A43850] to-[#8b2f43] hover:from-[#8b2f43] hover:to-[#A43850] text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-[#A43850]/50 transform hover:scale-105"
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
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text Content */}
            <div className="text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-white animate-fade-in">
                Environmental Compliance
                <br />
                Made <span className="gradient-text">Visual</span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed animate-fade-in-delay">
                Upload any permit PDF. We extract requirements, track deadlines, and ensure
                compliance—all in one beautiful, intelligent platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-2">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#F5A623] to-[#F7B84D] hover:from-[#F7B84D] hover:to-[#F5A623] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
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
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 glass text-white px-8 py-4 rounded-xl font-bold text-lg border border-[#A43850]/50 hover:border-[#A43850] transition-all duration-300"
                >
                  Learn More
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
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

            {/* Right: Animated Dashboard Mockup */}
            <div className="relative animate-scale-in">
              {/* Floating Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#A43850]/20 to-[#F5A623]/20 rounded-3xl blur-3xl"></div>
              
              {/* Dashboard Preview */}
              <div className="relative bg-gradient-to-br from-[#241a1f] to-[#2d1f26] border border-[#3d2a33] rounded-2xl p-5 shadow-2xl">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">Dashboard</div>
                </div>
                
                {/* Metric Cards */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-gradient-to-br from-[#A43850]/40 to-[#72293A]/40 border border-[#A43850]/50 rounded-xl p-3">
                    <div className="text-xs text-gray-400 mb-1">Total</div>
                    <div className="text-2xl font-bold text-white">156</div>
                    <div className="text-xs text-[#F5A623] mt-1">Requirements</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#F5A623]/30 to-[#F7B84D]/30 border border-[#F5A623]/40 rounded-xl p-3">
                    <div className="text-xs text-gray-400 mb-1">Due Soon</div>
                    <div className="text-2xl font-bold text-white">23</div>
                    <div className="text-xs text-[#F5A623] mt-1">This Month</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-900/30 to-green-950/30 border border-green-800/40 rounded-xl p-3">
                    <div className="text-xs text-gray-400 mb-1">Score</div>
                    <div className="text-2xl font-bold text-white">94%</div>
                    <div className="text-xs text-green-400 mt-1">Compliant</div>
                  </div>
                </div>
                
                {/* Charts Row */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Pie Chart Placeholder */}
                  <div className="bg-gradient-to-br from-[#241a1f] to-[#2d1f26] border border-[#3d2a33] rounded-xl p-4">
                    <div className="text-xs text-gray-400 mb-3">By Type</div>
                    <div className="aspect-square bg-gradient-to-br from-[#A43850]/20 to-[#F5A623]/20 rounded-full"></div>
                  </div>
                  
                  {/* Line Chart Placeholder */}
                  <div className="bg-gradient-to-br from-[#241a1f] to-[#2d1f26] border border-[#3d2a33] rounded-xl p-4">
                    <div className="text-xs text-gray-400 mb-3">Trend</div>
                    <div className="h-20 bg-gradient-to-t from-[#F5A623]/40 to-transparent rounded"></div>
                  </div>
                </div>
                
                {/* Bar Chart */}
                <div className="bg-gradient-to-br from-[#241a1f] to-[#2d1f26] border border-[#3d2a33] rounded-xl p-4 mb-4">
                  <div className="text-xs text-gray-400 mb-3">Monthly Activity</div>
                  <div className="flex items-end gap-1.5 h-20">
                    <div className="flex-1 bg-gradient-to-t from-[#A43850] to-[#8B3346] rounded-t" style={{height: '45%'}}></div>
                    <div className="flex-1 bg-gradient-to-t from-[#A43850] to-[#8B3346] rounded-t" style={{height: '60%'}}></div>
                    <div className="flex-1 bg-gradient-to-t from-[#A43850] to-[#8B3346] rounded-t" style={{height: '35%'}}></div>
                    <div className="flex-1 bg-gradient-to-t from-[#F5A623] to-[#F7B84D] rounded-t shadow-lg" style={{height: '90%'}}></div>
                    <div className="flex-1 bg-gradient-to-t from-[#A43850] to-[#8B3346] rounded-t" style={{height: '72%'}}></div>
                    <div className="flex-1 bg-gradient-to-t from-[#A43850] to-[#8B3346] rounded-t" style={{height: '80%'}}></div>
                  </div>
                </div>
                
                {/* Upcoming Deadlines */}
                <div className="bg-gradient-to-br from-[#241a1f] to-[#2d1f26] border border-[#3d2a33] rounded-xl p-4">
                  <div className="text-xs text-gray-400 mb-3">Upcoming Deadlines</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-red-900/20 border border-red-800/30 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-xs text-gray-300 flex-1">Quarterly Air Emissions</span>
                      <span className="text-xs text-red-400 font-medium">2 days</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-[#F5A623]/20 border border-[#F5A623]/30 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-[#F5A623]"></div>
                      <span className="text-xs text-gray-300 flex-1">Pipeline Inspection</span>
                      <span className="text-xs text-[#F5A623] font-medium">Mar 15</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-[#A43850]/20 border border-[#A43850]/30 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-[#A43850]"></div>
                      <span className="text-xs text-gray-300 flex-1">Water Quality Testing</span>
                      <span className="text-xs text-gray-400">Mar 22</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-[#241a1f]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need for Compliance
            </h2>
            <p className="text-xl text-gray-400">
              Powerful features that make environmental compliance effortless
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-[#241a1f] border border-[#A43850]/20 rounded-2xl p-8 hover:border-[#A43850]/60 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#A43850]/20 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-400">
              One plan. Full features. No hidden fees.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="bg-gradient-to-br from-[#A43850] to-[#8b2f43] rounded-3xl p-8 border-2 border-[#F5A623] shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise Tier</h3>
                <p className="text-white/80">Full-featured compliance management</p>
              </div>
              <div className="text-center mb-8">
                <span className="text-6xl font-black text-white">$79</span>
                <span className="text-2xl text-white/80">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  'Unlimited permits & requirements',
                  'Multi-facility support',
                  'Custom branding',
                  'Smart notifications',
                  'Advanced filtering',
                  'Priority support',
                  'Audit trail & compliance reporting',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white">
                    <CheckCircle className="w-5 h-5 text-[#F5A623] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/login"
                className="w-full block text-center bg-gradient-to-r from-[#F5A623] to-[#F7B84D] hover:from-[#F7B84D] hover:to-[#F5A623] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Get Started Today
              </Link>
            </div>
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

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fadeIn 0.8s ease-out 0.4s both;
        }

        .animate-slide-up {
          animation: slideUp 0.8s ease-out 0.6s both;
        }

        .animate-slide-up-delay {
          animation: slideUp 0.8s ease-out 0.7s both;
        }

        .animate-slide-up-delay-2 {
          animation: slideUp 0.8s ease-out 0.8s both;
        }

        * {
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
