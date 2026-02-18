import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';
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
  const { filtered } = useRequirements();
  const openDetail = useStore((s) => s.openDetail);

  const prev = () =>
    setCurrent((c) =>
      c.month === 0
        ? { year: c.year - 1, month: 11 }
        : { ...c, month: c.month - 1 }
    );
  const next = () =>
    setCurrent((c) =>
      c.month === 11
        ? { year: c.year + 1, month: 0 }
        : { ...c, month: c.month + 1 }
    );
  const goToday = () => {
    const now = new Date();
    setCurrent({ year: now.getFullYear(), month: now.getMonth() });
  };

  // Build calendar grid
  const { days, eventsByDate } = useMemo(() => {
    const firstDay = new Date(current.year, current.month, 1);
    const lastDay = new Date(current.year, current.month + 1, 0);
    const startOffset = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);
    while (days.length % 7 !== 0) days.push(null);

    // Map events to dates
    const eventsByDate: Record<number, PermitRequirement[]> = {};
    filtered.forEach((r) => {
      if (!r.neededBy) return;
      const d = new Date(r.neededBy);
      if (d.getFullYear() === current.year && d.getMonth() === current.month) {
        const day = d.getDate();
        if (!eventsByDate[day]) eventsByDate[day] = [];
        eventsByDate[day].push(r);
      }
    });

    return { days, eventsByDate };
  }, [current, filtered]);

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === current.year &&
    today.getMonth() === current.month &&
    today.getDate() === day;

  return (
    <div className="space-y-6">
      <DetailDrawer />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <p className="text-gray-500 mt-1">
          View upcoming requirements and deadlines
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(typeColor).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-gray-600">
            <div className={`w-3 h-3 rounded-full ${color}`} />
            {type}
          </div>
        ))}
      </div>

      {/* Calendar Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 min-w-[180px] text-center">
              {MONTHS[current.month]} {current.year}
            </h2>
            <button
              onClick={next}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <button
            onClick={goToday}
            className="text-sm font-medium text-gold-500 hover:text-gold-600 px-3 py-1.5 rounded-lg hover:bg-burgundy-50 transition-colors"
          >
            Today
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {DAYS.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const events = day ? eventsByDate[day] || [] : [];
            return (
              <div
                key={i}
                className={`min-h-[100px] md:min-h-[120px] border-b border-r border-gray-50 p-1.5 ${
                  !day ? 'bg-gray-50/50' : 'hover:bg-burgundy-50/20'
                } ${i % 7 === 0 ? 'border-l-0' : ''}`}
              >
                {day && (
                  <>
                    <div
                      className={`text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full ${
                        isToday(day)
                          ? 'bg-burgundy-500 text-white'
                          : 'text-gray-700'
                      }`}
                    >
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {/* Desktop: show event pills */}
                      {events.slice(0, 3).map((r) => (
                        <button
                          key={r.id}
                          onClick={() => openDetail(r)}
                          className={`hidden md:block w-full text-left text-[11px] font-medium text-white px-1.5 py-0.5 rounded truncate ${
                            typeColor[r.typeOfAction] || 'bg-gray-500'
                          } hover:opacity-80 transition-opacity`}
                        >
                          {r.typeOfAction.slice(0, 12)}
                        </button>
                      ))}
                      {events.length > 3 && (
                        <p className="hidden md:block text-[10px] text-gray-500 px-1">
                          +{events.length - 3} more
                        </p>
                      )}
                      {/* Mobile: dots */}
                      {events.length > 0 && (
                        <div className="flex gap-0.5 md:hidden flex-wrap">
                          {events.slice(0, 4).map((r) => (
                            <button
                              key={r.id}
                              onClick={() => openDetail(r)}
                              className={`w-2 h-2 rounded-full ${
                                typeDot[r.typeOfAction] || 'bg-gray-400'
                              }`}
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

      {/* Events list for current month (mobile-friendly) */}
      <div className="md:hidden space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">
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
                  className="w-full text-left bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        typeColor[r.typeOfAction] || 'bg-gray-400'
                      }`}
                    />
                    <span className="text-xs font-medium text-gray-500">
                      {MONTHS[current.month]} {day}
                    </span>
                    <span
                      className={`ml-auto text-xs font-medium capitalize px-2 py-0.5 rounded ${
                        status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : status === 'overdue'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 line-clamp-1">
                    {r.action.slice(0, 100)}
                  </p>
                </button>
              );
            })
          )}
        {Object.keys(eventsByDate).length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            No events this month
          </p>
        )}
      </div>
    </div>
  );
}
