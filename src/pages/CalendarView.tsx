import { Calendar } from 'lucide-react';

export function CalendarView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <p className="text-gray-500 mt-1">
          View upcoming requirements and deadlines
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto" />
        <h2 className="text-xl font-semibold text-gray-900 mt-4">
          Calendar View Coming Soon
        </h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          A full calendar view with color-coded events, filtering, and
          deadline tracking will be available in Phase 2.
        </p>
      </div>
    </div>
  );
}
