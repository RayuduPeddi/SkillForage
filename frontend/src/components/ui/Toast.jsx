import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Toast({
  id,
  type = 'info', // 'success' | 'warning' | 'error' | 'info'
  title,
  message,
  onClose,
}) {
  const icons = {
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info,
  };

  const Icon = icons[type] || Info;

  const typeStyles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    error: 'bg-rose-50 border-rose-200 text-rose-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
  };

  const iconStyles = {
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    error: 'text-rose-600',
    info: 'text-blue-600',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3.5 rounded-xl border shadow-lg max-w-sm w-full animate-in slide-in-from-top-2 duration-150',
        typeStyles[type]
      )}
    >
      <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', iconStyles[type])} />
      <div className="flex-1 space-y-0.5 text-left">
        {title && <h4 className="text-xs font-semibold">{title}</h4>}
        {message && <p className="text-xs opacity-90 leading-relaxed">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={() => onClose(id)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export function ToastContainer({ toasts = [], onClose }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-auto">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}
