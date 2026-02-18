import { ChevronDown, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../../lib/store';
import type { ActionType, EquipmentType, RequirementStatus } from '../../types';

const ACTION_TYPES: ActionType[] = [
  'Event Actions',
  'Inspections',
  'Samples',
  'Tests',
  'Throughput Reports',
];

const EQUIPMENT_TYPES: EquipmentType[] = [
  'Compressor',
  'Storage Tank',
  'Flare',
  'Dehydrator',
  'Heater',
  'Thermal Oxidizer',
  'Amine Unit',
  'Engine',
  'Generator',
  'General',
];

const STATUSES: { value: RequirementStatus; label: string; color: string }[] = [
  { value: 'completed', label: 'Completed', color: 'text-green-600' },
  { value: 'pending', label: 'Pending', color: 'text-yellow-600' },
  { value: 'overdue', label: 'Overdue', color: 'text-red-600' },
];

function FilterSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3 text-sm font-semibold text-gray-700 hover:text-gray-900"
      >
        {title}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="pb-3 space-y-1.5">{children}</div>}
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
  colorClass,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  colorClass?: string;
}) {
  return (
    <label className="flex items-center gap-2.5 py-1 px-1 rounded hover:bg-gray-50 cursor-pointer text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="rounded border-gray-300 text-burgundy-500 focus:ring-burgundy-500 w-4 h-4"
      />
      <span className={colorClass || 'text-gray-700'}>{label}</span>
    </label>
  );
}

export function FilterPanel({ recurrenceOptions }: { recurrenceOptions: string[] }) {
  const {
    filters,
    toggleActionType,
    toggleRecurrence,
    toggleEquipmentType,
    toggleStatus,
    setDateRange,
    resetFilters,
  } = useStore();

  const hasFilters =
    filters.actionTypes.length > 0 ||
    filters.recurrencePatterns.length > 0 ||
    filters.equipmentTypes.length > 0 ||
    filters.statuses.length > 0 ||
    filters.dateRange.start ||
    filters.dateRange.end;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900 text-sm">Filters</h3>
        {hasFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-burgundy-500 hover:text-burgundy-700 font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      <FilterSection title="Action Type" defaultOpen>
        {ACTION_TYPES.map((t) => (
          <Checkbox
            key={t}
            checked={filters.actionTypes.includes(t)}
            onChange={() => toggleActionType(t)}
            label={t}
          />
        ))}
      </FilterSection>

      <FilterSection title="Status" defaultOpen>
        {STATUSES.map((s) => (
          <Checkbox
            key={s.value}
            checked={filters.statuses.includes(s.value)}
            onChange={() => toggleStatus(s.value)}
            label={s.label}
            colorClass={s.color}
          />
        ))}
      </FilterSection>

      <FilterSection title="Recurrence">
        {recurrenceOptions.map((r) => (
          <Checkbox
            key={r}
            checked={filters.recurrencePatterns.includes(r)}
            onChange={() => toggleRecurrence(r)}
            label={r}
          />
        ))}
      </FilterSection>

      <FilterSection title="Equipment Type">
        {EQUIPMENT_TYPES.map((e) => (
          <Checkbox
            key={e}
            checked={filters.equipmentTypes.includes(e)}
            onChange={() => toggleEquipmentType(e)}
            label={e}
          />
        ))}
      </FilterSection>

      <FilterSection title="Date Range">
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-500">From</label>
            <input
              type="date"
              value={filters.dateRange.start || ''}
              onChange={(e) =>
                setDateRange(e.target.value || null, filters.dateRange.end)
              }
              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">To</label>
            <input
              type="date"
              value={filters.dateRange.end || ''}
              onChange={(e) =>
                setDateRange(filters.dateRange.start, e.target.value || null)
              }
              className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500"
            />
          </div>
        </div>
      </FilterSection>
    </div>
  );
}
