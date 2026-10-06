import React, { useEffect, useRef, useState } from 'react';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { inputCls } from './ui';

export interface DateRange { preset: string; start: string; end: string }

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmt = (s: string) => { const [y, m, d] = s.split('-').map(Number); return `${String(d).padStart(2, '0')} ${MON[m - 1]} ${y}`; };

export function presetRange(preset: string): DateRange {
  const now = new Date();
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (preset === 'today') return { preset, start: iso(day), end: iso(day) };
  if (preset === 'week') {
    const mon = new Date(day); mon.setDate(day.getDate() - ((day.getDay() + 6) % 7));
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
    return { preset, start: iso(mon), end: iso(sun) };
  }
  if (preset === 'last30') { const s = new Date(day); s.setDate(day.getDate() - 29); return { preset, start: iso(s), end: iso(day) }; }
  if (preset === 'all') return { preset, start: '', end: '' };
  return { preset: 'month', start: iso(new Date(day.getFullYear(), day.getMonth(), 1)), end: iso(new Date(day.getFullYear(), day.getMonth() + 1, 0)) };
}

const PRESETS = [
  { id: 'today', label: 'Today' }, { id: 'week', label: 'This week' }, { id: 'month', label: 'This month' },
  { id: 'last30', label: 'Last 30 days' }, { id: 'all', label: 'All dates' },
];

const DateRangeMenu: React.FC<{ value: DateRange; onChange: (r: DateRange) => void }> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(value.start);
  const [to, setTo] = useState(value.end);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  const label = value.start && value.end ? (value.start === value.end ? fmt(value.start) : `${fmt(value.start)} - ${fmt(value.end)}`) : 'All dates';
  return (
    <div ref={box} className="relative">
      <button type="button" onClick={() => { setFrom(value.start); setTo(value.end); setOpen(v => !v); }} aria-expanded={open} aria-label="Choose date range" className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
        <CalendarDays className="size-4 text-slate-600" />{label}<ChevronDown className="size-4 text-slate-500" />
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          {PRESETS.map(p => (
            <button key={p.id} type="button" onClick={() => { onChange(presetRange(p.id)); setOpen(false); }} className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-slate-50 ${value.preset === p.id ? 'bg-amber-50 text-[#0b1f4d]' : 'text-slate-700'}`}>{p.label}</button>
          ))}
          <div className="mt-1 border-t border-slate-100 p-2">
            <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">Custom range</div>
            <div className="flex items-center gap-2">
              <input type="date" aria-label="From date" value={from} max={to || undefined} onChange={e => setFrom(e.target.value)} className={`${inputCls} !px-2`} />
              <span className="text-xs text-slate-400">to</span>
              <input type="date" aria-label="To date" value={to} min={from || undefined} onChange={e => setTo(e.target.value)} className={`${inputCls} !px-2`} />
            </div>
            <button type="button" disabled={!from || !to} onClick={() => { onChange({ preset: 'custom', start: from, end: to }); setOpen(false); }} className="mt-2 w-full rounded-lg bg-[#0b1f4d] py-2 text-sm font-bold text-white disabled:opacity-50">Apply</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeMenu;
