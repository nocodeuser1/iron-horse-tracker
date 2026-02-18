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
    <div className="space-y-4">
      <DetailDrawer />
      
      {/* Compact Header with Stats */}
      <div className="bg-gradient-to-br from-burgundy-500 to-burgundy-700 dark:from-burgundy-900 dark:to-burgundy-950 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <CalendarDays className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Calendar View</h1>
              <p className="text-burgundy-100 text-sm mt-0.5 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {totalEvents} event{totalEvents !== 1 ? 's' : ''} • {MONTHS[current.month]} {current.year}
              </p>
            </div>
          </div>
          
          {/* Filter + Legend Compact */}
          <div className="flex items-center gap-3">
            {/* Legend Pills */}
            <div className="hidden xl:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
              {Object.entries(typeColor).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5 text-xs font-medium">
                  <div className={`w-2.5 h-2.5 rounded-full ${color} shadow-sm`} />
                  <span className="hidden 2xl:inline">{type.split(' ')[0]}</span>
                </div>
              ))}
            </div>
            
            {/* Filter Dropdown */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl ${
                  selectedTypes.length > 0
                    ? 'bg-gold-500 hover:bg-gold-600 text-white'
                    : 'bg-white/15 hover:bg-white/20 text-white backdrop-blur-sm'
                }`}
              >
                <FilterIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
                {selectedTypes.length > 0 && (
                  <span className="px-2 py-0.5 bg-white/25 rounded-full text-xs font-bold">
                    {selectedTypes.length}
                  </span>
                )}
              </button>
              
              {filterOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-card rounded-xl shadow-2xl border-2 border-gray-200 dark:border-dark-border p-4 z-50 animate-scale-in">
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Filter by Type</h3>
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
                        <div className={`w-3 h-3 rounded-full ${color} shadow-sm`} />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{type}</span>
                      </label>
                    ))}
                  </div>
                  {selectedTypes.length > 0 && (
                    <button
                      onClick={() => setSelectedTypes([])}
                      className="w-full mt-3 px-3 py-2 text-xs font-semibold text-burgundy-600 dark:text-burgundy-400 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 rounded-lg transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Card - Optimized for Screen Fit */}
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-border overflow-hidden">
        {/* Compact Month Navigation */}
        <div className="bg-gradient-to-r from-gray-50 to-white dark:from-dark-surface dark:to-dark-card px-6 py-3 border-b border-gray-200 dark:border-dark-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="p-2 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 rounded-lg transition-all group"
              title="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-burgundy-600 dark:text-burgundy-400 group-hover:scale-110 transition-transform" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white min-w-[180px] text-center">
              {MONTHS[current.month]} {current.year}
            </h2>
            <button
              onClick={next}
              className="p-2 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 rounded-lg transition-all group"
              title="Next month"
            >
              <ChevronRight className="w-5 h-5 text-burgundy-600 dark:text-burgundy-400 group-hover:scale-110 transition-transform" />
            </button>
          </div>
          <button
            onClick={goToday}
            className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all shadow-sm hover:shadow active:scale-95"
          >
            Today
          </button>
        </div>

        {/* Compact Day Headers */}
        <div className="grid grid-cols-7 bg-gradient-to-br from-burgundy-50/50 to-gold-50/30 dark:from-burgundy-950/20 dark:to-gold-950/10 border-b border-gray-200 dark:border-dark-border">
          {DAYS.map((d) => (
            <div key={d} className="py-2.5 text-center text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              {d}
            </div>
          ))}
        </div>

        {/* Optimized Calendar Grid - Fits on Screen */}
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const events = day ? eventsByDate[day] || [] : [];
            const hasOverdue = events.some(r => getStatus(r) === 'overdue');
            const hasCompleted = events.some(r => getStatus(r) === 'completed');
            
            return (
              <div
                key={i}
                className={`min-h-[85px] md:min-h-[95px] lg:min-h-[100px] border-b border-r border-gray-200 dark:border-dark-border p-1.5 md:p-2 transition-all ${
                  !day 
                    ? 'bg-gray-50/50 dark:bg-dark-surface/30' 
                    : 'hover:bg-gradient-to-br hover:from-burgundy-50/40 hover:to-gold-50/30 dark:hover:from-burgundy-950/30 dark:hover:to-gold-950/20 cursor-pointer'
                } ${i % 7 === 0 ? 'border-l-0' : ''}`}
              >
                {day && (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <div
                        className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-lg transition-all ${
                          isToday(day)
                            ? 'bg-gradient-to-br from-burgundy-500 to-burgundy-600 text-white shadow-md scale-105'
                            : hasOverdue
                            ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-extrabold'
                            : events.length > 0
                            ? 'bg-burgundy-50 dark:bg-burgundy-900/30 text-burgundy-700 dark:text-burgundy-300'
                            : 'text-gray-500 dark:text-gray-500'
                        }`}
                      >
                        {day}
                      </div>
                      {events.length > 0 && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          hasOverdue 
                            ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
                            : hasCompleted
                            ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
                            : 'bg-burgundy-100 dark:bg-burgundy-900/40 text-burgundy-700 dark:text-burgundy-300'
                        }`}>
                          {events.length}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      {events.slice(0, 2).map((r) => {
                        const status = getStatus(r);
                        return (
                          <button
                            key={r.id}
                            onClick={() => openDetail(r)}
                            className={`hidden md:block w-full text-left text-[10px] lg:text-xs font-semibold text-white px-1.5 py-1 rounded-md shadow-sm hover:shadow transition-all hover:-translate-y-0.5 ${
                              typeColor[r.typeOfAction] || 'bg-gray-500'
                            } ${status === 'overdue' ? 'ring-1 ring-red-400 ring-offset-1' : ''}`}
                            title={r.action.slice(0, 100)}
                          >
                            <div className="truncate leading-tight">{r.typeOfAction.split(' ')[0]}</div>
                            {status === 'completed' && (
                              <div className="text-[9px] opacity-90">✓</div>
                            )}
                          </button>
                        );
                      })}
                      {events.length > 2 && (
                        <p className="hidden md:block text-[9px] font-bold text-burgundy-600 dark:text-burgundy-400 px-1">
                          +{events.length - 2}
                        </p>
                      )}
                      {/* Mobile dots */}
                      {events.length > 0 && (
                        <div className="flex gap-0.5 md:hidden flex-wrap">
                          {events.slice(0, 5).map((r) => (
                            <button
                              key={r.id}
                              onClick={() => openDetail(r)}
                              className={`w-2 h-2 rounded-full ${typeDot[r.typeOfAction] || 'bg-gray-400'}`}
                              title={r.typeOfAction}
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

      {/* Mobile event list - Compact */}
      <div className="md:hidden space-y-3 max-h-[400px] overflow-y-auto">
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 sticky top-0 bg-gray-50 dark:bg-dark-bg py-2 z-10">
          <Clock className="w-4 h-4 text-burgundy-500" />
          Events ({totalEvents})
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
                  className="w-full text-left bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border p-3 hover:shadow-md hover:border-burgundy-300 dark:hover:border-burgundy-700 active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-3 h-3 rounded-full ${typeColor[r.typeOfAction] || 'bg-gray-400'} shadow-sm`} />
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                      {MONTHS[current.month]} {day}
                    </span>
                    <span
                      className={`ml-auto text-[10px] font-bold capitalize px-2 py-0.5 rounded-md ${
                        status === 'completed'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : status === 'overdue'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-200 line-clamp-1">
                    {r.action}
                  </p>
                </button>
              );
            })
          )}
        {Object.keys(eventsByDate).length === 0 && (
          <div className="text-center py-8 bg-gray-50 dark:bg-dark-surface rounded-xl">
            <CalendarDays className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-400 dark:text-gray-500">No events</p>
          </div>
        )}
      </div>
    </div>
  );
}
