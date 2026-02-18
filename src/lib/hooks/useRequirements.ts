import { useMemo } from 'react';
import sampleData from '../data/sample-requirements.json';
import type { PermitRequirement, FilterState } from '../../types';
import { getStatus } from '../utils/requirements';
import { useStore } from '../store';

const allRequirements = sampleData as PermitRequirement[];

export function useRequirements() {
  const filters = useStore((s) => s.filters);
  const filtered = useMemo(() => applyFilters(allRequirements, filters), [filters]);
  return { all: allRequirements, filtered };
}

export function applyFilters(
  data: PermitRequirement[],
  f: FilterState
): PermitRequirement[] {
  return data.filter((r) => {
    if (f.actionTypes.length && !f.actionTypes.includes(r.typeOfAction)) return false;
    if (f.recurrencePatterns.length && !f.recurrencePatterns.includes(r.recurrence))
      return false;
    if (f.equipmentTypes.length && !f.equipmentTypes.includes(r.equipmentType))
      return false;
    if (f.statuses.length && !f.statuses.includes(getStatus(r))) return false;
    if (f.searchQuery) {
      const q = f.searchQuery.toLowerCase();
      const hay = `${r.action} ${r.requirementsCovered} ${r.typeOfAction} ${r.equipmentType} ${r.recurrence}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (f.dateRange.start && r.neededBy && r.neededBy < f.dateRange.start) return false;
    if (f.dateRange.end && r.neededBy && r.neededBy > f.dateRange.end) return false;
    return true;
  });
}

export function exportToCSV(data: PermitRequirement[]) {
  const headers = [
    'Type of Action',
    'Recurrence',
    'Action',
    'Requirements Covered',
    'Needed By',
    'Completed Date',
    'Equipment Type',
    'Status',
  ];
  const escape = (s: string) => `"${(s || '').replace(/"/g, '""')}"`;
  const rows = data.map((r) =>
    [
      r.typeOfAction,
      r.recurrence,
      r.action.replace(/\n/g, ' '),
      r.requirementsCovered.replace(/\n/g, ' '),
      r.neededBy || '',
      r.completedDate || '',
      r.equipmentType,
      getStatus(r),
    ]
      .map(escape)
      .join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'permit-requirements.csv';
  a.click();
  URL.revokeObjectURL(url);
}
