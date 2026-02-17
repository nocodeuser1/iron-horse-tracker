import { ClipboardCheck, AlertTriangle, CalendarClock, TrendingUp } from 'lucide-react';
import sampleData from '../lib/data/sample-requirements.json';
import type { PermitRequirement } from '../types';
import { getMetrics } from '../lib/utils/requirements';

const requirements = sampleData as PermitRequirement[];
const metrics = getMetrics(requirements);

const cards = [
  {
    label: 'Total Requirements',
    value: metrics.totalRequirements,
    icon: ClipboardCheck,
    color: 'bg-blue-500',
  },
  {
    label: 'Due This Month',
    value: metrics.dueThisMonth,
    icon: CalendarClock,
    color: 'bg-amber-500',
  },
  {
    label: 'Overdue',
    value: metrics.overdue,
    icon: AlertTriangle,
    color: metrics.overdue > 0 ? 'bg-red-500' : 'bg-green-500',
  },
  {
    label: 'Compliance Score',
    value: `${metrics.complianceScore}%`,
    icon: TrendingUp,
    color: metrics.complianceScore >= 80 ? 'bg-green-500' : 'bg-orange-500',
  },
];

export function Dashboard() {
  const byType = requirements.reduce<Record<string, number>>((acc, r) => {
    acc[r.typeOfAction] = (acc[r.typeOfAction] || 0) + 1;
    return acc;
  }, {});

  const recentActivity = requirements
    .filter((r) => r.completedDate)
    .sort((a, b) => (b.completedDate! > a.completedDate! ? 1 : -1))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1a2332] to-[#2a3a52] rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4">
          <img src="/IH_Logo.png" alt="" className="h-16 w-auto" />
          <div>
            <h1 className="text-3xl font-bold">Title V Permit Tracker</h1>
            <p className="text-gray-300 mt-1">
              Real-time compliance monitoring for Iron Horse Midstream
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                <p className="text-3xl font-bold mt-1 text-gray-900">
                  {card.value}
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-xl`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requirements by Type */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Requirements by Type
          </h2>
          <div className="space-y-3">
            {Object.entries(byType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{type}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{
                        width: `${(count / requirements.length) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-6 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((r) => (
              <div
                key={r.id}
                className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-900 font-medium truncate">
                    {r.action.slice(0, 80)}
                    {r.action.length > 80 ? '…' : ''}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Completed {r.completedDate} · {r.typeOfAction}
                  </p>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <p className="text-sm text-gray-400">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
