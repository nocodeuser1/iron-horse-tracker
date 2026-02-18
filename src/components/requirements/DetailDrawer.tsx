import { X, Calendar, FileText, Tag, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useStore } from '../../lib/store';
import { getStatus } from '../../lib/utils/requirements';
import { useEffect } from 'react';

const statusConfig = {
  completed: { label: 'Completed', color: 'bg-gold-100 text-gold-700', icon: CheckCircle2 },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
};

export function DetailDrawer() {
  const { selectedRequirement: r, detailOpen, closeDetail } = useStore();

  useEffect(() => {
    if (detailOpen) {
      document.body.style.overflow = 'hidden';
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeDetail();
      };
      window.addEventListener('keydown', handler);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handler);
      };
    }
  }, [detailOpen, closeDetail]);

  if (!r || !detailOpen) return null;

  const status = getStatus(r);
  const cfg = statusConfig[status];
  const StatusIcon = cfg.icon;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={closeDetail}
      />
      {/* Drawer */}
      <div className="relative w-full max-w-lg bg-white shadow-2xl animate-slide-in-right overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {cfg.label}
            </span>
            <span className="text-xs text-gray-400 font-mono">{r.id.slice(0, 8)}</span>
          </div>
          <button
            onClick={closeDetail}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Type & Equipment badges */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy-100 text-burgundy-700 rounded-lg text-sm font-medium">
              <Tag className="w-3.5 h-3.5" />
              {r.typeOfAction}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
              {r.equipmentType}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
              <Clock className="w-3.5 h-3.5" />
              {r.recurrence}
            </span>
          </div>

          {/* Action Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Action Required
            </h3>
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
              {r.action}
            </p>
          </div>

          {/* Requirements Covered */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Requirements Covered
            </h3>
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
              {r.requirementsCovered}
            </p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Due Date</span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {r.neededBy || 'No due date'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {r.completedDate || 'Not yet'}
              </p>
            </div>
          </div>

          {/* File */}
          {r.fileUploaded && (
            <div className="bg-gold-50 rounded-lg p-4 flex items-center gap-3">
              <FileText className="w-5 h-5 text-gold-600" />
              <div>
                <p className="text-sm font-medium text-gold-700">Attached File</p>
                <p className="text-xs text-gold-600">{r.fileUploaded}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
