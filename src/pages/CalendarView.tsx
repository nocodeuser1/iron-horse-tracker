import { ChevronLeft, ChevronRight, CalendarDays, Clock, Filter as FilterIcon } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useRequirements } from '../lib/hooks/useRequirements';
import { useStore } from '../lib/store';
import { getStatus } from '../lib/utils/requirements';
import { DetailDrawer } from '../components/requirements/DetailDrawer';
import type { PermitRequirement } from '../types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const typeColor: Record<string, string> = {
  'Event Actions': 'bg-burgundy-500',
  Inspections: 'bg-purple-500',
  Samples: 'bg-teal-500',
  Tests: 'bg-gold-500',
  'Throughput Reports': 'bg-burgundy-700',
};

const typeDot: Record<string, string> = {
  'Event Actions': 'bg-burgundy-500',
  Inspections: 'bg-purple-400',
  Samples: 'bg-teal-400',
  Tests: 'bg-gold-400',
  'Throughput Reports': 'bg-burgundy-600',
};

export function CalendarView() {
  const [current, setCurrent] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);
  
  const { filtered } = useRequirements();
  const openDetail = useStore((s) => s.openDetail);
  
  // Auto-collapse filter dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    };
    
    if (filterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [filterOpen]);

  const prev = () =>
    setCurrent((c) =>
      c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 }
    );
  const next = () =>
    setCurrent((c) =>
      c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 }
    );
  const goToday = () => {
    const now = new Date();
    setCurrent({ year: now.getFullYear(), month: now.getMonth() });
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };
  
  const { days, eventsByDate, totalEvents } = useMemo(() => {
    const firstDay = new Date(current.year, current.month, 1);
    const lastDay = new Date(current.year, current.month + 1, 0);
    const startOffset = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);
    while (days.length % 7 !== 0) days.push(null);

    const eventsByDate: Record<number, PermitRequirement[]> = {};
    let totalEvents = 0;
    
    filtered.forEach((r) => {
      // Apply type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(r.typeOfAction)) {
        return;
      }
      
      if (!r.neededBy) return;
      const d = new Date(r.neededBy);
      if (d.getFullYear() === current.year && d.getMonth() === current.month) {
        const day = d.getDate();
        if (!eventsByDate[day]) eventsByDate[day] = [];
        eventsByDate[day].push(r);
        totalEvents++;
      }
    });

    return { days, eventsByDate, totalEvents };
  }, [current, filtered, selectedTypes]);

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === current.year &&
    today.getMonth() === current.month &&
    today.getDate() === day;

  return (
    <div className="space-y-6">
      <DetailDrawer />
      
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-burgundy-500" />
            Calendar
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {totalEvents} requirement{totalEvents !== 1 ? 's' : ''} this month
          </p>
        </div>
        
        {/* Filter Dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md hover:shadow-lg ${
              selectedTypes.length > 0
                ? 'bg-gradient-to-r from-burgundy-500 to-burgundy-600 text-white'
                : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-dark-border hover:border-burgundy-300 dark:hover:border-burgundy-700'
            }`}
          >
            <FilterIcon className="w-4 h-4" />
            Filter Types
            {selectedTypes.length > 0 && (
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                {selectedTypes.length}
              </span>
            )}
          </button>
          
          {filterOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-card rounded-xl shadow-2xl border border-gray-200 dark:border-dark-border p-4 z-50 animate-scale-in">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Action Types</h3>
              <div className="space-y-2">
                {Object.entries(typeColor).map(([type, color]) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleType(type)}
                      className="w-4 h-4 rounded border-gray-300 text-burgundy-500 focus:ring-burgundy-500"
                    />
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{type}</span>
                  </label>
                ))}
              </div>
              {selectedTypes.length > 0 && (
                <button
                  onClick={() => setSelectedTypes([])}
                  className="w-full mt-3 px-3 py-2 text-xs font-medium text-burgundy-600 dark:text-burgundy-400 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Calendar Card */}
      <div className="bg-white dark:bg-dark-card rounded-3xl shadow-xl border-2 border-gray-200 dark:border-dark-border overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-gradient-to-br from-burgundy-50 to-gold-50/30 dark:from-burgundy-950/40 dark:to-gold-950/20 px-8 py-6 border-b-2 border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={prev}
                className="p-3 hover:bg-white dark:hover:bg-dark-surface rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                <ChevronLeft className="w-6 h-6 text-burgundy-600 dark:text-burgundy-400" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white min-w-[220px] text-center">
                {MONTHS[current.month]} {current.year}
              </h2>
              <button
                onClick={next}
                className="p-3 hover:bg-white dark:hover:bg-dark-surface rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                <ChevronRight className="w-6 h-6 text-burgundy-600 dark:text-burgundy-400" />
              </button>
            </div>
            <button
              onClick={goToday}
              className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Today
            </button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-dark-surface/50 dark:to-dark-surface/30 border-b-2 border-gray-200 dark:border-dark-border">
          {DAYS.map((d) => (
            <div key={d} className="py-4 text-center text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const events = day ? eventsByDate[day] || [] : [];
            const hasOverdue = events.some(r => getStatus(r) === 'overdue');
            
            return (
              <div
                key={i}
                className={`min-h-[110px] md:min-h-[140px] border-b border-r border-gray-200 dark:border-dark-border p-2 md:p-3 transition-all ${
                  !day ? 'bg-gray-50/70 dark:bg-dark-surface/50' : 'hover:bg-gradient-to-br hover:from-burgundy-50/30 hover:to-gold-50/20 dark:hover:from-burgundy-950/20 dark:hover:to-gold-950/10 hover:shadow-inner'
                } ${i % 7 === 0 ? 'border-l-0' : ''}`}
              >
                {day && (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`text-base font-bold w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
                          isToday(day)
                            ? 'bg-gradient-to-br from-burgundy-500 to-burgundy-600 text-white shadow-lg scale-110'
                            : hasOverdue
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                            : events.length > 0
                            ? 'bg-gray-100 dark:bg-dark-surface text-gray-700 dark:text-gray-300'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {day}
                      </div>
                      {events.length > 0 && (
                        <span className="text-xs font-bold px-2 py-1 bg-burgundy-100 dark:bg-burgundy-900/40 text-burgundy-700 dark:text-burgundy-300 rounded-full">
                          {events.length}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      {events.slice(0, 3).map((r) => {
                        const status = getStatus(r);
                        return (
                          <button
                            key={r.id}
                            onClick={() => openDetail(r)}
                            className={`hidden md:block w-full text-left text-xs font-semibold text-white px-2.5 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95 ${
                              typeColor[r.typeOfAction] || 'bg-gray-500'
                            } ${status === 'overdue' ? 'ring-2 ring-red-400 animate-pulse-glow' : ''}`}
                            title={r.action.slice(0, 100)}
                          >
                            <div className="truncate">{r.typeOfAction}</div>
                            {status === 'completed' && (
                              <div className="text-[10px] opacity-80 mt-0.5">✓ Done</div>
                            )}
                          </button>
                        );
                      })}
                      {events.length > 3 && (
                        <p className="hidden md:block text-xs font-medium text-burgundy-600 dark:text-burgundy-400 px-2">
                          +{events.length - 3} more
                        </p>
                      )}
                      {events.length > 0 && (
                        <div className="flex gap-1 md:hidden flex-wrap">
                          {events.slice(0, 6).map((r) => (
                            <button
                              key={r.id}
                              onClick={() => openDetail(r)}
                              className={`w-2.5 h-2.5 rounded-full shadow-sm ${typeDot[r.typeOfAction] || 'bg-gray-400'}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile event list */}
      <div className="md:hidden space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Clock className="w-5 h-5 text-burgundy-500" />
          Events this month
        </h3>
        {Object.entries(eventsByDate)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([day, events]) =>
            events.map((r) => {
              const status = getStatus(r);
              return (
                <button
                  key={r.id}
                  onClick={() => openDetail(r)}
                  className="w-full text-left bg-white dark:bg-dark-card rounded-2xl shadow-md border-2 border-gray-200 dark:border-dark-border p-4 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-4 h-4 rounded-full ${typeColor[r.typeOfAction] || 'bg-gray-400'} shadow-md`} />
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                      {MONTHS[current.month]} {day}
                    </span>
                    <span
                      className={`ml-auto text-xs font-bold capitalize px-3 py-1 rounded-lg shadow-sm ${
                        status === 'completed'
                          ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 dark:from-green-900/30 dark:to-green-900/20 dark:text-green-400'
                          : status === 'overdue'
                          ? 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 dark:from-red-900/30 dark:to-red-900/20 dark:text-red-400'
                          : 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 dark:from-yellow-900/30 dark:to-yellow-900/20 dark:text-yellow-400'
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200 line-clamp-2">
                    {r.action}
                  </p>
                </button>
              );
            })
          )}
        {Object.keys(eventsByDate).length === 0 && (
          <div className="text-center py-12 bg-gray-50 dark:bg-dark-surface rounded-2xl">
            <CalendarDays className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-base font-medium text-gray-400 dark:text-gray-500">No events this month</p>
          </div>
        )}
      </div>
    </div>
  );
}
