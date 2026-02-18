import { X, Calendar, FileText, Tag, Clock, CheckCircle2, AlertTriangle, Check } from 'lucide-react';
import { useStore } from '../../lib/store';
import { useDataStore } from '../../lib/dataStore';
import { getStatus } from '../../lib/utils/requirements';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const statusConfig = {
  completed: { label: 'Completed', color: 'bg-gold-100 text-gold-700 dark:bg-gold-600/20 dark:text-gold-400', icon: CheckCircle2 },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: AlertTriangle },
};

export function DetailDrawer() {
  const { selectedRequirement: r, detailOpen, closeDetail } = useStore();
  const toggleCompleted = useDataStore((s) => s.toggleCompleted);
  const [isAnimating, setIsAnimating] = useState(false);
  const [localCompleted, setLocalCompleted] = useState(false);
  
  useEffect(() => {
    setLocalCompleted(!!r?.completedDate);
  }, [r?.completedDate]);
  
  const handleToggle = () => {
    if (!r) return;
    setIsAnimating(true);
    setLocalCompleted(!localCompleted);
    toggleCompleted(r.id);
    setTimeout(() => setIsAnimating(false), 600);
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

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-lg bg-black/50 animate-fade-in"
        onClick={closeDetail}
      />
      <div className="relative w-full max-w-3xl max-h-[92vh] z-10">
        <div className="bg-white dark:bg-dark-card shadow-2xl rounded-3xl border border-gray-200 dark:border-dark-border overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-burgundy-50 to-gold-50/30 dark:from-burgundy-950/40 dark:to-gold-950/20 px-8 py-5 border-b border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between gap-4">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm ${cfg.color}`}>
              <StatusIcon className="w-4 h-4" />
              {cfg.label}
            </span>
            <button
              onClick={closeDetail}
              className="p-2.5 hover:bg-white dark:hover:bg-dark-surface rounded-xl transition-all hover:scale-105 active:scale-95 group"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8 max-h-[calc(92vh-140px)] overflow-y-auto">
          <button
            onClick={handleToggle}
            className={`relative overflow-hidden flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.97] ${
              localCompleted
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-2 border-green-400/50'
                : 'bg-gradient-to-r from-gold-500 to-gold-600 text-white hover:from-gold-600 hover:to-gold-700 border-2 border-gold-400/50'
            }`}
          >
            {isAnimating && !r.completedDate && (
              <div className="absolute inset-0 bg-green-500 animate-pulse" />
            )}
            <Check className={`w-4 h-4 relative z-10 transition-all duration-300 ${isAnimating && !r.completedDate ? 'scale-150 rotate-12' : ''}`} />
            <span className="relative z-10">
              {localCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
            </span>
          </button>

          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-burgundy-50 to-burgundy-100/50 dark:from-burgundy-900/40 dark:to-burgundy-900/20 text-burgundy-800 dark:text-burgundy-200 rounded-xl text-sm font-semibold shadow-sm border border-burgundy-200 dark:border-burgundy-800">
              <Tag className="w-4 h-4" />
              {r.typeOfAction}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/40 dark:to-purple-900/20 text-purple-800 dark:text-purple-200 rounded-xl text-sm font-semibold shadow-sm border border-purple-200 dark:border-purple-800">
              {r.equipmentType}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-dark-surface dark:to-dark-surface/80 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-semibold shadow-sm border border-gray-200 dark:border-dark-border">
              <Clock className="w-4 h-4" />
              {r.recurrence}
            </span>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-dark-surface/50 dark:to-dark-surface/30 rounded-2xl p-6 border border-gray-200 dark:border-dark-border shadow-sm">
            <h3 className="text-xs font-bold text-burgundy-600 dark:text-burgundy-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-burgundy-500 rounded-full"></div>
              Action Required
            </h3>
            <p className="text-base text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
              {r.action}
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-dark-surface/50 dark:to-dark-surface/30 rounded-2xl p-6 border border-gray-200 dark:border-dark-border shadow-sm">
            <h3 className="text-xs font-bold text-burgundy-600 dark:text-burgundy-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-burgundy-500 rounded-full"></div>
              Requirements Covered
            </h3>
            <p className="text-base text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
              {r.requirementsCovered}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 rounded-2xl p-5 border border-blue-200 dark:border-blue-900 shadow-sm">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Due Date</span>
              </div>
              <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                {r.neededBy || 'No due date'}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 rounded-2xl p-5 border border-green-200 dark:border-green-900 shadow-sm">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300 mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
              </div>
              <p className="text-lg font-semibold text-green-900 dark:text-green-100">
                {r.completedDate || 'Not yet'}
              </p>
            </div>
          </div>

          {r.fileUploaded && (
            <div className="bg-gradient-to-br from-gold-50 to-gold-100/50 dark:from-gold-950/30 dark:to-gold-900/20 rounded-2xl p-5 border border-gold-200 dark:border-gold-900 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gold-100 dark:bg-gold-900/50 rounded-xl">
                  <FileText className="w-6 h-6 text-gold-700 dark:text-gold-300" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gold-900 dark:text-gold-100 mb-1">Attached File</p>
                  <p className="text-sm text-gold-700 dark:text-gold-300 font-medium">{r.fileUploaded}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
