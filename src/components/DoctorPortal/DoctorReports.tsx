import React, { useState } from 'react';
import { BarChart3, Download, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { portalDownloadCsv, portalReport } from '../../lib/doctorPortalApi';
import { Card, ErrorBox, Spinner, btnGhost, btnPrimary, inputCls } from './ui';
import { useLoad } from './useLoad';

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const presets = () => {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastFirst = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const d30 = new Date(now.getTime() - 29 * 86400000);
  return [
    { id: 'month', label: 'This month', start: iso(first), end: iso(now) },
    { id: 'last30', label: 'Last 30 days', start: iso(d30), end: iso(now) },
    { id: 'lastmonth', label: 'Last month', start: iso(lastFirst), end: iso(lastEnd) },
  ];
};

const DoctorReports: React.FC = () => {
  const P = presets();
  const [start, setStart] = useState(P[0].start);
  const [end, setEnd] = useState(P[0].end);
  const [exporting, setExporting] = useState(false);
  const rep = useLoad(() => portalReport(start, end), [start, end]);
  const r = rep.data;
  const maxTopic = Math.max(1, ...(r?.byTopic.map(t => t.count) || [1]));
  const maxDay = Math.max(1, ...(r?.byDay.map(d => d.count) || [1]));

  const exportCsv = async () => {
    setExporting(true);
    try { await portalDownloadCsv(start, end); } catch (e) { toast.error((e as Error).message); } finally { setExporting(false); }
  };

  const tiles = r ? [
    ['Appointments', r.totals.appointments], ['Completed', r.totals.completed], ['Upcoming', r.totals.upcoming], ['Cancelled', r.totals.cancelled],
    ['No-show', r.totals.noShow], ['Unique clients', r.totals.clients], ['Revenue', r.totals.revenueLabel], ['Refunded', r.totals.refundedLabel],
  ] : [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">Reports</h1><p className="text-sm text-slate-500">Consultations, clients and fees for any period.</p></div>
        <button type="button" onClick={exportCsv} disabled={exporting} className={btnPrimary}>{exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}Export CSV</button>
      </div>
      <Card className="flex flex-wrap items-center gap-2 p-3 sm:p-4">
        {P.map(p => <button key={p.id} type="button" onClick={() => { setStart(p.start); setEnd(p.end); }} className={`${btnGhost} ${start === p.start && end === p.end ? '!border-[#0b1f4d] !bg-[#0b1f4d]/5' : ''}`}>{p.label}</button>)}
        <label className="sr-only" htmlFor="rp-from">From</label><input id="rp-from" type="date" value={start} max={end} onChange={e => setStart(e.target.value)} className={`${inputCls} !w-auto`} />
        <span className="text-xs text-slate-400">to</span>
        <label className="sr-only" htmlFor="rp-to">To</label><input id="rp-to" type="date" value={end} min={start} onChange={e => setEnd(e.target.value)} className={`${inputCls} !w-auto`} />
      </Card>
      {rep.error ? <ErrorBox message={rep.error} onRetry={rep.reload} /> : !r ? <Spinner /> : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {tiles.map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="text-2xl font-black text-slate-900 sm:text-3xl">{value}</div><div className="text-xs font-semibold text-slate-500">{label}</div></div>)}
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="p-4 sm:p-5">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-slate-900"><BarChart3 className="size-5" />By topic</h2>
              {r.byTopic.length === 0 ? <p className="text-sm text-slate-500">No consultations in this period.</p> : (
                <ul className="space-y-3">
                  {r.byTopic.map(t => (
                    <li key={t.topic}><div className="mb-1 flex justify-between gap-3 text-sm"><span className="font-semibold text-slate-700">{t.topic}</span><span className="font-bold text-slate-900">{t.count}</span></div><div className="h-2.5 rounded-full bg-slate-100"><div className="h-2.5 rounded-full bg-[#0b1f4d]" style={{ width: `${(t.count / maxTopic) * 100}%` }} /></div></li>
                  ))}
                </ul>
              )}
            </Card>
            <Card className="p-4 sm:p-5">
              <h2 className="mb-3 text-lg font-extrabold text-slate-900">By day</h2>
              {r.byDay.length === 0 ? <p className="text-sm text-slate-500">No consultations in this period.</p> : (
                <>
                  <div className="flex h-40 items-end gap-1 overflow-x-auto" role="img" aria-label="Consultations per day">
                    {r.byDay.map(d => <div key={d.date} title={`${d.date}: ${d.count}`} className="flex min-w-[14px] flex-1 flex-col items-center justify-end"><span className="mb-1 text-[10px] font-bold text-slate-600">{d.count}</span><div className="w-full rounded-t bg-amber-400" style={{ height: `${Math.max(8, (d.count / maxDay) * 100)}px` }} /></div>)}
                  </div>
                  <div className="mt-1 flex justify-between text-[11px] text-slate-500"><span>{r.byDay[0].date}</span><span>{r.byDay[r.byDay.length - 1].date}</span></div>
                </>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorReports;
