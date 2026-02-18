import {
  Search,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  X,
  ClipboardList,
} from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import { useRequirements, exportToCSV } from '../lib/hooks/useRequirements';
import { useStore } from '../lib/store';
import { getStatus } from '../lib/utils/requirements';
import { FilterPanel } from '../components/requirements/FilterPanel';
import { DetailDrawer } from '../components/requirements/DetailDrawer';
import type { PermitRequirement } from '../types';

type SortKey = 'typeOfAction' | 'recurrence' | 'equipmentType' | 'neededBy' | 'status';
type SortDir = 'asc' | 'desc';

const statusColors: Record<string, string> = {
  completed: 'bg-gold-100 text-gold-700 dark:bg-gold-600/20 dark:text-gold-400',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const typeColors: Record<string, string> = {
  'Event Actions': 'bg-burgundy-100 text-burgundy-700 dark:bg-burgundy-900/40 dark:text-burgundy-200',
  Inspections: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Samples: 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  Tests: 'bg-gold-100 text-gold-700 dark:bg-gold-600/20 dark:text-gold-400',
  'Throughput Reports': 'bg-burgundy-50 text-burgundy-600 dark:bg-burgundy-900/30 dark:text-burgundy-300',
};

export function Requirements() {
  const { all, filtered } = useRequirements();
  const { setSearch, filters, openDetail } = useStore();
  const [sortKey, setSortKey] = useState<SortKey>('neededBy');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [showFilters, setShowFilters] = useState(false);

  const recurrenceOptions = useMemo(
    () => [...new Set(all.map((r) => r.recurrence))].sort(),
    [all]
  );

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let va: string, vb: string;
      if (sortKey === 'status') {
        va = getStatus(a);
        vb = getStatus(b);
      } else {
        va = (a[sortKey] as string) || '';
        vb = (b[sortKey] as string) || '';
      }
      const cmp = va.localeCompare(vb);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortKey(key);
        setSortDir('asc');
      }
    },
    [sortKey]
  );

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />;
    return sortDir === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-burgundy-500" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-burgundy-500" />
    );
  };

  const activeFilterCount =
    filters.actionTypes.length +
    filters.recurrencePatterns.length +
    filters.equipmentTypes.length +
    filters.statuses.length +
    (filters.dateRange.start ? 1 : 0) +
    (filters.dateRange.end ? 1 : 0);

  return (
    <div className="space-y-6">
      <DetailDrawer />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Permit Requirements
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track and manage all Title V permit requirements
          </p>
        </div>
        <button
          onClick={() => exportToCSV(sorted)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-burgundy-500 border border-burgundy-600 rounded-lg text-sm font-medium text-white hover:bg-burgundy-600 transition-all shadow-sm hover:shadow active:scale-95"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Search + Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search requirements, actions, equipment..."
            value={filters.searchQuery}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent shadow-sm"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors shadow-sm ${
            showFilters || activeFilterCount > 0
              ? 'bg-burgundy-50 dark:bg-burgundy-900/40 border-burgundy-200 dark:border-burgundy-700 text-burgundy-700 dark:text-burgundy-200'
              : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-burgundy-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-6">
        {showFilters && (
          <div className="w-64 shrink-0 hidden lg:block">
            <FilterPanel recurrenceOptions={recurrenceOptions} />
          </div>
        )}

        {showFilters && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-gray-50 dark:bg-dark-bg p-4 overflow-y-auto animate-slide-in-left">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <FilterPanel recurrenceOptions={recurrenceOptions} />
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Showing {sorted.length} of {all.length} requirements
          </p>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-dark-border bg-gray-50/80 dark:bg-dark-surface/80">
                    {([
                      ['typeOfAction', 'Type'],
                      ['neededBy', 'Action'],
                      ['recurrence', 'Recurrence'],
                      ['equipmentType', 'Equipment'],
                      ['neededBy', 'Due Date'],
                      ['status', 'Status'],
                    ] as [SortKey, string][]).map(([key, label], i) =>
                      i === 1 ? (
                        <th key="action" className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">
                          Action
                        </th>
                      ) : (
                        <th
                          key={key + i}
                          className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white select-none"
                          onClick={() => handleSort(key)}
                        >
                          <span className="inline-flex items-center gap-1">
                            {label}
                            <SortIcon col={key} />
                          </span>
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                  {sorted.map((r) => (
                    <RequirementRow key={r.id} r={r} onClick={() => openDetail(r)} />
                  ))}
                  {sorted.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center">
                        <ClipboardList className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-400 dark:text-gray-500">No requirements match your filters</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {sorted.map((r) => (
              <RequirementCard key={r.id} r={r} onClick={() => openDetail(r)} />
            ))}
            {sorted.length === 0 && (
              <div className="bg-white dark:bg-dark-card rounded-xl p-8 text-center shadow-sm border border-gray-100 dark:border-dark-border">
                <ClipboardList className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 dark:text-gray-500">No requirements match your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RequirementRow({ r, onClick }: { r: PermitRequirement; onClick: () => void }) {
  const status = getStatus(r);
  return (
    <tr
      onClick={onClick}
      className="hover:bg-burgundy-50/50 dark:hover:bg-burgundy-900/20 transition-colors cursor-pointer"
    >
      <td className="px-4 py-3">
        <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${typeColors[r.typeOfAction] || 'bg-gray-50 text-gray-700'}`}>
          {r.typeOfAction}
        </span>
      </td>
      <td className="px-4 py-3 max-w-sm">
        <p className="text-gray-900 dark:text-gray-200 line-clamp-2 text-sm">
          {r.action.slice(0, 120)}{r.action.length > 120 ? '…' : ''}
        </p>
      </td>
      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap text-sm">{r.recurrence}</td>
      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap text-sm">{r.equipmentType}</td>
      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap text-sm">{r.neededBy || '—'}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium capitalize ${statusColors[status]}`}>
          {status}
        </span>
      </td>
    </tr>
  );
}

function RequirementCard({ r, onClick }: { r: PermitRequirement; onClick: () => void }) {
  const status = getStatus(r);
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-4 hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${typeColors[r.typeOfAction] || 'bg-gray-50 text-gray-700'}`}>
          {r.typeOfAction}
        </span>
        <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium capitalize ${statusColors[status]}`}>
          {status}
        </span>
      </div>
      <p className="text-sm text-gray-900 dark:text-gray-200 line-clamp-2 mb-2">
        {r.action.slice(0, 150)}{r.action.length > 150 ? '…' : ''}
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
        <span>{r.equipmentType}</span>
        <span>{r.recurrence}</span>
        {r.neededBy && <span>Due: {r.neededBy}</span>}
      </div>
    </div>
  );
}
