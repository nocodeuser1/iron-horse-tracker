import {
  ClipboardCheck,
  AlertTriangle,
  CalendarClock,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useRequirements } from '../lib/hooks/useRequirements';
import { getMetrics, getStatus } from '../lib/utils/requirements';
import { useMemo } from 'react';
import { useDarkMode } from '../lib/darkMode';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { usePermitTypeStore } from '../lib/permitTypeStore';

const PIE_COLORS = ['#A43850', '#F5A623', '#8B3346', '#F7B84D', '#C4546E', '#D4901E'];
const BAR_COLOR = '#A43850';

// Calculate monthly cost based on permit count
const calculateMonthlyCost = (permitCount: number): number => {
  const baseCost = 50;
  const additionalPermits = Math.max(0, permitCount - 1);
  return baseCost + (additionalPermits * 10);
};

export function Dashboard() {
  const { all: requirements } = useRequirements();
  const metrics = useMemo(() => getMetrics(requirements), [requirements]);
  const { dark } = useDarkMode();
  const navigate = useNavigate();
  const { setFilters, resetFilters } = useStore();
  const activePermit = usePermitTypeStore((s) => s.getActivePermit());
  
  // Track permit count (for now, 1 permit = Iron Horse Title V)
  // In multi-tenant version, this would come from user's company data
  const permitCount = 1;
  const monthlyCost = calculateMonthlyCost(permitCount);

  const handleCardClick = (cardLabel: string) => {
    resetFilters(); // Clear existing filters first
    
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    switch (cardLabel) {
      case 'Total Requirements':
        // Show all - no filters
        break;
      case 'Due This Month':
        // Filter by date range for this month
        setFilters({
          dateRange: {
            start: firstOfMonth.toISOString().split('T')[0],
            end: lastOfMonth.toISOString().split('T')[0],
          },
          statuses: ['pending'],
        });
        break;
      case 'Overdue':
        // Filter by overdue status
        setFilters({ statuses: ['overdue'] });
        break;
      case 'Compliance Score':
        // Show completed items
        setFilters({ statuses: ['completed'] });
        break;
    }
    
    navigate('/requirements');
  };

  const byType = useMemo(() => {
    const map: Record<string, number> = {};
    requirements.forEach((r) => {
      map[r.typeOfAction] = (map[r.typeOfAction] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [requirements]);

  const byRecurrence = useMemo(() => {
    const map: Record<string, number> = {};
    requirements.forEach((r) => {
      map[r.recurrence] = (map[r.recurrence] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [requirements]);

  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    return requirements
      .filter((r) => r.neededBy && !r.completedDate && new Date(r.neededBy) >= now)
      .sort((a, b) => a.neededBy!.localeCompare(b.neededBy!))
      .slice(0, 8);
  }, [requirements]);

  const recentActivity = useMemo(
    () =>
      requirements
        .filter((r) => r.completedDate)
        .sort((a, b) => b.completedDate!.localeCompare(a.completedDate!))
        .slice(0, 5),
    [requirements]
  );

  const cards = [
    {
      label: 'Total Requirements',
      value: metrics.totalRequirements,
      icon: ClipboardCheck,
      color: 'bg-burgundy-500',
      bg: 'bg-burgundy-50 dark:bg-burgundy-900/30',
    },
    {
      label: 'Due This Month',
      value: metrics.dueThisMonth,
      icon: CalendarClock,
      color: 'bg-gold-500',
      bg: 'bg-gold-50 dark:bg-gold-600/10',
    },
    {
      label: 'Overdue',
      value: metrics.overdue,
      icon: AlertTriangle,
      color: metrics.overdue > 0 ? 'bg-red-500' : 'bg-gold-500',
      bg: metrics.overdue > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gold-50 dark:bg-gold-600/10',
    },
    {
      label: 'Compliance Score',
      value: `${metrics.complianceScore}%`,
      icon: TrendingUp,
      color: metrics.complianceScore >= 80 ? 'bg-gold-500' : 'bg-orange-500',
      bg: metrics.complianceScore >= 80 ? 'bg-gold-50 dark:bg-gold-600/10' : 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      label: 'Monthly Cost',
      value: `$${monthlyCost}`,
      subtitle: `${permitCount} permit${permitCount > 1 ? 's' : ''}`,
      icon: DollarSign,
      color: 'bg-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
  ];

  const tooltipStyle = {
    borderRadius: '8px',
    border: dark ? '1px solid #3d2a33' : '1px solid #e5e7eb',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    backgroundColor: dark ? '#241a1f' : '#fff',
    color: dark ? '#e5e7eb' : '#111',
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#8B3346] via-[#A43850] to-[#C4546E] dark:from-[#3D1620] dark:via-[#5A2130] dark:to-[#72293A] rounded-2xl p-8 text-white relative overflow-hidden animate-slide-up">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02LTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2em0wIDMwYzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02LTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative">
          <h1 className="text-3xl font-bold tracking-tight">
            {activePermit?.name || 'Title V'} Permit Tracker
          </h1>
          <p className="text-gray-300 mt-1">
            Real-time compliance monitoring for Iron Horse Midstream
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <button
            key={card.label}
            onClick={() => handleCardClick(card.label)}
            className={`${card.bg} rounded-xl border border-gray-100 dark:border-dark-border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 animate-slide-up stagger-${i + 1} cursor-pointer text-left w-full`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{card.label}</p>
                <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">
                  {card.value}
                </p>
                {(card as any).subtitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {(card as any).subtitle}
                  </p>
                )}
              </div>
              <div className={`${card.color} p-3 rounded-xl shadow-sm transition-transform group-hover:scale-110`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Requirements by Type
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byType}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }: any) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {byType.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {byType.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                {item.name} ({item.value})
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Requirements by Recurrence
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byRecurrence} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#3d2a33' : '#f3f4f6'} />
                <XAxis type="number" tick={{ fontSize: 12, fill: dark ? '#9ca3af' : undefined }} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11, fill: dark ? '#9ca3af' : undefined }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill={BAR_COLOR} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Upcoming Deadlines
          </h2>
          <div className="space-y-3">
            {upcomingDeadlines.length === 0 && (
              <div className="text-center py-8">
                <CalendarClock className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto" />
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">No upcoming deadlines</p>
              </div>
            )}
            {upcomingDeadlines.map((r) => {
              const days = Math.ceil(
                (new Date(r.neededBy!).getTime() - Date.now()) / 86400000
              );
              const urgency =
                days <= 7 ? 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400' :
                days <= 30 ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400' :
                'text-burgundy-600 bg-burgundy-50 dark:bg-burgundy-900/30 dark:text-burgundy-300';
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-3 py-2 border-b border-gray-50 dark:border-dark-border last:border-0 hover:bg-gray-50/50 dark:hover:bg-dark-surface/50 rounded-lg px-2 -mx-2 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900 dark:text-gray-200 font-medium truncate">
                      {r.action.slice(0, 70)}…
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {r.typeOfAction} · {r.equipmentType}
                    </p>
                  </div>
                  <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${urgency}`}>
                    {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days}d`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((r) => {
              const status = getStatus(r);
              const onTime =
                r.completedDate && r.neededBy
                  ? new Date(r.completedDate) <= new Date(r.neededBy)
                  : true;
              return (
                <div
                  key={r.id}
                  className="flex items-start gap-3 pb-3 border-b border-gray-50 dark:border-dark-border last:border-0"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                      status === 'completed'
                        ? onTime ? 'bg-green-500' : 'bg-amber-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-200 font-medium truncate">
                      {r.action.slice(0, 80)}
                      {r.action.length > 80 ? '…' : ''}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Completed {r.completedDate} · {r.typeOfAction}
                      {!onTime && <span className="text-amber-600 dark:text-amber-400 ml-1">(late)</span>}
                    </p>
                  </div>
                </div>
              );
            })}
            {recentActivity.length === 0 && (
              <div className="text-center py-8">
                <ClipboardCheck className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto" />
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
