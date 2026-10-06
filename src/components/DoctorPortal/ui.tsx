import React, { useEffect } from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import type { ApptStatus } from '../../lib/doctorPortalApi';

export const STATUS_META: Record<ApptStatus, { label: string; cls: string }> = {
  upcoming: { label: 'Upcoming', cls: 'bg-amber-100 text-amber-800 border-amber-200' },
  needs_update: { label: 'Needs update', cls: 'bg-orange-100 text-orange-800 border-orange-200' },
  completed: { label: 'Completed', cls: 'bg-green-100 text-green-800 border-green-200' },
  followup: { label: 'Follow-up', cls: 'bg-blue-100 text-blue-800 border-blue-200' },
  no_show: { label: 'No-show', cls: 'bg-slate-200 text-slate-700 border-slate-300' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-700 border-red-200' },
  payment_review: { label: 'Payment review', cls: 'bg-purple-100 text-purple-800 border-purple-200' },
};

export const StatusBadge: React.FC<{ status: ApptStatus }> = ({ status }) => {
  const m = STATUS_META[status] || STATUS_META.upcoming;
  return <span className={`inline-block whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-bold ${m.cls}`}>{m.label}</span>;
};

export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</section>
);

export const Spinner: React.FC<{ label?: string }> = ({ label = 'Loading...' }) => (
  <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500" role="status"><Loader2 className="size-4 animate-spin" />{label}</div>
);

export const ErrorBox: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
    <div>{message}{onRetry && <> <button type="button" onClick={onRetry} className="font-semibold underline">Try again</button></>}</div>
  </div>
);

export const Empty: React.FC<{ icon?: React.ReactNode; title: string; hint?: string }> = ({ icon, title, hint }) => (
  <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
    {icon && <div className="text-slate-300">{icon}</div>}
    <div className="font-bold text-slate-700">{title}</div>
    {hint && <div className="max-w-sm text-sm text-slate-500">{hint}</div>}
  </div>
);

export const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || '?';

export const inputCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500';
export const btnPrimary = 'inline-flex items-center justify-center gap-2 rounded-lg bg-[#0b1f4d] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#12307a] disabled:opacity-50';
export const btnGhost = 'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50';

// Right-hand panel on large screens, full-screen sheet on phones.
export const Drawer: React.FC<{ open: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ open, onClose, title, children }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100000000] flex justify-end bg-slate-900/50" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label={title} className="flex h-full w-full flex-col bg-white shadow-2xl sm:max-w-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
          <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="size-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">{children}</div>
      </div>
    </div>
  );
};

export const waLink = (phone: string) => {
  const d = phone.replace(/\D/g, '');
  return d ? `https://wa.me/${d.length === 10 ? '91' + d : d}` : '';
};
