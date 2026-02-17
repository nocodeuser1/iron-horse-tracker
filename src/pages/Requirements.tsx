import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import sampleData from '../lib/data/sample-requirements.json';
import type { PermitRequirement } from '../types';
import { getStatus } from '../lib/utils/requirements';

const requirements = sampleData as PermitRequirement[];

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  overdue: 'bg-red-100 text-red-800',
};

export function Requirements() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filtered = useMemo(() => {
    return requirements.filter((r) => {
      const matchesSearch =
        !search ||
        r.action.toLowerCase().includes(search.toLowerCase()) ||
        r.requirementsCovered.toLowerCase().includes(search.toLowerCase());
      const matchesType = !typeFilter || r.typeOfAction === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  const types = [...new Set(requirements.map((r) => r.typeOfAction))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Permit Requirements
        </h1>
        <p className="text-gray-500 mt-1">
          Track and manage all Title V permit requirements
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search requirements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500">
        Showing {filtered.length} of {requirements.length} requirements
      </p>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Action</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Recurrence</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Equipment</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Due Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((r) => {
                const status = getStatus(r);
                return (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                        {r.typeOfAction}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-md">
                      <p className="text-gray-900 line-clamp-2">
                        {r.action.slice(0, 120)}
                        {r.action.length > 120 ? '…' : ''}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.recurrence}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.equipmentType}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.neededBy || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium capitalize ${statusColors[status]}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
