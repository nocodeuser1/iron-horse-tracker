import { X, Calendar, FileText, Tag, Clock, CheckCircle2, AlertTriangle, Check } from 'lucide-react';
import { useStore } from '../../lib/store';
import { useDataStore } from '../../lib/dataStore';
import { getStatus } from '../../lib/utils/requirements';
import { useEffect } from 'react';

const statusConfig = {
  completed: { label: 'Completed', color: 'bg-gold-100 text-gold-700 dark:bg-gold-600/20 dark:text-gold-400', icon: CheckCircle2 },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: AlertTriangle },
};

export function DetailDrawer() {
  const { selectedRequirement: r, detailOpen, closeDetail, openDetail } = useStore();
  const toggleCompleted = useDataStore((s) => s.toggleCompleted);
  const requirements = useDataStore((s) => s.requirements);
  
  const handleToggle = () => {
    toggleCompleted(r!.id);
    const updated = requirements.find((req) => req.id === r!.id);
    if (updated) openDetail(updated);
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0">
      <div
        className="absolute inset-0 w-full h-full backdrop-blur-md bg-black/40 animate-fade-in"
        onClick={closeDetail}
      />
      <div className="relative w-full max-w-2xl max-h-[90vh] mx-4 bg-white/85 dark:bg-dark-card/85 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/30 dark:border-white/10 overflow-hidden animate-scale-in z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-white/50 to-transparent dark:from-dark-surface/50 dark:to-transparent border-b border-white/20 dark:border-white/10 px-6 py-4 flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {cfg.label}
            </span>
            <span className="text-xs text-gray-400 font-mono">{r.id.slice(0, 8)}</span>
          </div>
          <button
            onClick={closeDetail}
            className="p-2 hover:bg-white/60 dark:hover:bg-dark-surface/60 rounded-lg transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <button
            onClick={handleToggle}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all backdrop-blur-sm ${
              r.completedDate
                ? 'bg-white/60 dark:bg-dark-surface/60 text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-dark-surface/80 border border-white/30 dark:border-white/10'
                : 'bg-gold-500/90 text-white hover:bg-gold-600 shadow-lg hover:shadow-xl border border-gold-400/30'
            }`}
          >
            <Check className="w-5 h-5" />
            {r.completedDate ? 'Mark as Incomplete' : 'Mark as Complete'}
          </button>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy-500/20 dark:bg-burgundy-500/30 text-burgundy-800 dark:text-burgundy-200 rounded-lg text-sm font-medium backdrop-blur-sm border border-burgundy-300/30 dark:border-burgundy-400/20">
              <Tag className="w-3.5 h-3.5" />
              {r.typeOfAction}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 dark:bg-purple-500/30 text-purple-800 dark:text-purple-200 rounded-lg text-sm font-medium backdrop-blur-sm border border-purple-300/30 dark:border-purple-400/20">
              {r.equipmentType}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/60 dark:bg-dark-surface/60 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium backdrop-blur-sm border border-white/30 dark:border-white/10">
              <Clock className="w-3.5 h-3.5" />
              {r.recurrence}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Action Required
            </h3>
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
              {r.action}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Requirements Covered
            </h3>
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
              {r.requirementsCovered}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/60 dark:bg-dark-surface/60 rounded-xl p-4 backdrop-blur-sm border border-white/30 dark:border-white/10">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Due Date</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {r.neededBy || 'No due date'}
              </p>
            </div>
            <div className="bg-white/60 dark:bg-dark-surface/60 rounded-xl p-4 backdrop-blur-sm border border-white/30 dark:border-white/10">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {r.completedDate || 'Not yet'}
              </p>
            </div>
          </div>

          {r.fileUploaded && (
            <div className="bg-gold-500/20 dark:bg-gold-500/30 rounded-xl p-4 flex items-center gap-3 backdrop-blur-sm border border-gold-400/30 dark:border-gold-400/20">
              <FileText className="w-5 h-5 text-gold-700 dark:text-gold-300" />
              <div>
                <p className="text-sm font-medium text-gold-800 dark:text-gold-200">Attached File</p>
                <p className="text-xs text-gold-700 dark:text-gold-300">{r.fileUploaded}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
