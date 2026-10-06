import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock, FileText, Video, XCircle, ClipboardCheck } from 'lucide-react';
import { Tab, portalAppointments, portalSummary } from '../../lib/doctorPortalApi';
import type { PortalContext } from './DoctorPortalLayout';
import AppointmentsTable from './AppointmentsTable';
import AppointmentDrawer from './AppointmentDrawer';
import { Card, Empty, ErrorBox, Spinner, StatusBadge, btnGhost, inputCls } from './ui';
import { useLoad } from './useLoad';

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All' }, { id: 'upcoming', label: 'Upcoming' }, { id: 'completed', label: 'Completed' }, { id: 'followup', label: 'Follow-up' }, { id: 'cancelled', label: 'Cancelled' },
];

const shiftMonth = (m: string, by: number) => {
  const [y, mo] = m.split('-').map(Number);
  const d = new Date(Date.UTC(y, mo - 1 + by, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
};

const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };

const DoctorDashboard: React.FC = () => {
  const { me, refreshAttention } = useOutletContext<PortalContext>();
  const [month, setMonth] = useState<string | undefined>(undefined);
  const [tab, setTab] = useState<Tab>('all');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const summary = useLoad(() => portalSummary(month), [month]);
  const list = useLoad(() => portalAppointments({ tab, start, end }), [tab, start, end]);
  const s = summary.data;
  const reloadAll = () => { summary.reload(); list.reload(); refreshAttention(); };

  const cards = s ? [
    { label: 'Total Appointments', sub: s.monthLabel, value: s.stats.total, icon: CalendarDays, box: 'bg-blue-50 border-blue-100', ic: 'bg-blue-100 text-blue-600' },
    { label: 'Completed Consultations', sub: s.stats.noShow ? `${s.stats.noShow} no-show` : 'This month', value: s.stats.completed, icon: CheckCircle2, box: 'bg-green-50 border-green-100', ic: 'bg-green-100 text-green-600' },
    { label: 'Upcoming Consultations', sub: s.stats.needsUpdate ? `${s.stats.needsUpdate} need an update` : 'This month', value: s.stats.upcoming, icon: Clock, box: 'bg-amber-50 border-amber-100', ic: 'bg-amber-100 text-amber-600' },
    { label: 'Cancelled Appointments', sub: 'This month', value: s.stats.cancelled, icon: XCircle, box: 'bg-red-50 border-red-100', ic: 'bg-red-100 text-red-600' },
  ] : [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">{greeting()}, {me.doctorName}</h1>
          <p className="text-sm text-slate-500">{s ? s.todayLabel : 'Here is your consultation overview.'}</p>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
          <button type="button" aria-label="Previous month" onClick={() => setMonth(shiftMonth(s?.month || new Date().toISOString().slice(0, 7), -1))} className="rounded-lg p-2 hover:bg-slate-100"><ChevronLeft className="size-4" /></button>
          <span className="min-w-[8.5rem] text-center text-sm font-bold text-slate-800">{s?.monthLabel || '...'}</span>
          <button type="button" aria-label="Next month" onClick={() => setMonth(shiftMonth(s?.month || new Date().toISOString().slice(0, 7), 1))} className="rounded-lg p-2 hover:bg-slate-100"><ChevronRight className="size-4" /></button>
        </div>
      </div>

      {summary.error && <ErrorBox message={summary.error} onRetry={summary.reload} />}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {summary.loading && !s ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200/70" />) : cards.map(c => (
          <div key={c.label} className={`flex items-center gap-3 rounded-2xl border p-3 sm:p-4 ${c.box}`}>
            <span className={`flex size-10 shrink-0 items-center justify-center rounded-full sm:size-12 ${c.ic}`}><c.icon className="size-5 sm:size-6" /></span>
            <div className="min-w-0"><div className="text-2xl font-black text-slate-900 sm:text-3xl">{c.value}</div><div className="text-xs font-semibold leading-tight text-slate-700 sm:text-sm">{c.label}</div><div className="text-[11px] text-slate-500">{c.sub}</div></div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 pt-4 sm:px-5">
            <h2 className="flex items-center gap-2 pb-2 text-lg font-extrabold text-slate-900"><CalendarDays className="size-5" />My Appointments</h2>
            <div className="flex flex-wrap items-center gap-2 pb-3">
              <label className="sr-only" htmlFor="dash-from">From</label><input id="dash-from" type="date" value={start} max={end || undefined} onChange={e => setStart(e.target.value)} className={`${inputCls} !w-auto`} />
              <span className="text-xs text-slate-400">to</span>
              <label className="sr-only" htmlFor="dash-to">To</label><input id="dash-to" type="date" value={end} min={start || undefined} onChange={e => setEnd(e.target.value)} className={`${inputCls} !w-auto`} />
              {(start || end) && <button type="button" onClick={() => { setStart(''); setEnd(''); }} className="text-xs font-semibold text-blue-600 underline">Clear</button>}
            </div>
          </div>
          <div role="tablist" aria-label="Appointment filter" className="flex gap-1 overflow-x-auto border-b border-slate-100 px-3 sm:px-4">
            {TABS.map(t => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} type="button" onClick={() => setTab(t.id)} className={`whitespace-nowrap border-b-[3px] px-3 py-2.5 text-sm font-semibold ${tab === t.id ? 'border-[#0b1f4d] text-[#0b1f4d]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                {t.label}{list.data ? ` (${list.data.counts[t.id]})` : ''}
              </button>
            ))}
          </div>
          {list.error ? <div className="p-4"><ErrorBox message={list.error} onRetry={list.reload} /></div> : list.loading && !list.data ? <Spinner /> : list.data && list.data.appointments.length === 0 ? (
            <Empty icon={<CalendarDays className="size-10" />} title="No appointments here" hint="Paid consultations appear automatically when a client books and pays." />
          ) : list.data && (
            <>
              <AppointmentsTable rows={list.data.appointments.slice(0, 10)} onOpen={setOpenId} />
              {list.data.appointments.length > 10 && <div className="border-t border-slate-100 p-3 text-center"><Link to="/doctor-portal/appointments" className="text-sm font-bold text-blue-700 hover:underline">View all {list.data.appointments.length} appointments</Link></div>}
            </>
          )}
        </Card>

        <div className="space-y-5">
          <Card className="p-4 sm:p-5">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900"><CalendarDays className="size-5" />Today's Schedule</h2>
            <p className="mb-3 text-xs text-slate-500">{s?.todayLabel}</p>
            {!s ? <Spinner /> : s.today.length === 0 ? <p className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">No consultations today.</p> : (
              <ul className="space-y-2">
                {s.today.map(a => (
                  <li key={a.id}><button type="button" onClick={() => setOpenId(a.id)} className="flex w-full items-center gap-3 rounded-xl border-l-4 border-amber-400 bg-slate-50 px-3 py-2 text-left hover:bg-amber-50">
                    <span className="w-16 shrink-0 text-xs font-bold text-slate-700">{a.timeLabel}</span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-slate-800">{a.name}</span><span className="block truncate text-xs text-slate-500">{a.company || a.topicLabel}</span></span>
                    <StatusBadge status={a.status} />
                  </button></li>
                ))}
              </ul>
            )}
            <Link to="/doctor-portal/appointments" className="mt-3 block rounded-xl bg-blue-600 py-2.5 text-center text-sm font-bold text-white hover:bg-blue-700">View all appointments</Link>
          </Card>

          <Card className="p-4 sm:p-5">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="text-lg font-extrabold text-slate-900">Next Appointment</h2>
              {s?.next && s.next.minutesUntil !== undefined && <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">{s.next.minutesUntil <= 0 ? 'Now' : s.next.minutesUntil < 60 ? `In ${s.next.minutesUntil} min` : s.next.minutesUntil < 1440 ? `In ${Math.round(s.next.minutesUntil / 60)} h` : `In ${Math.round(s.next.minutesUntil / 1440)} d`}</span>}
            </div>
            {!s ? <Spinner /> : !s.next ? <p className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">No upcoming consultations.</p> : (
              <div className="space-y-2 text-sm">
                <div className="font-bold text-slate-800">{s.next.dateLabel}, {s.next.timeRangeLabel.replace(/ \(IST\)$/, '')} (IST)</div>
                <div><span className="font-bold">{s.next.name}</span><span className="block text-slate-500">{s.next.company}</span></div>
                <div className="text-slate-700">{s.next.topicLabel}</div>
                <div className="flex gap-2 pt-1">
                  {s.next.meetLink ? <a href={s.next.meetLink} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 py-2.5 font-bold text-white hover:bg-green-700"><Video className="size-4" />Join Meeting</a> : <span className="flex-1 rounded-xl bg-slate-100 py-2.5 text-center text-xs font-semibold text-slate-500">Set your Meet link in Meeting Links</span>}
                  <button type="button" onClick={() => setOpenId(s.next!.id)} className={`${btnGhost} flex-1`}>View Details</button>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-4 sm:p-5">
            <div className="mb-2 flex items-center justify-between"><h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900"><FileText className="size-5" />Recent Notes / Follow-ups</h2><Link to="/doctor-portal/notes" className="text-xs font-bold text-blue-700 hover:underline">View all</Link></div>
            {!s ? <Spinner /> : s.recentNotes.length === 0 && s.followUps.length === 0 ? <p className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">Notes and follow-ups you add will show here.</p> : (
              <ul className="space-y-2">
                {s.followUps.map(f => (
                  <li key={f.id}><button type="button" onClick={() => setOpenId(f.bookingId)} className="flex w-full items-start gap-2 rounded-xl bg-blue-50 px-3 py-2 text-left hover:bg-blue-100">
                    <ClipboardCheck className="mt-0.5 size-4 shrink-0 text-blue-600" />
                    <span className="min-w-0 flex-1 text-xs"><b className="text-slate-800">{f.client}</b> - follow-up {f.dueLabel}{f.overdue && <span className="ml-1 font-bold text-red-600">(due)</span>}<span className="block truncate text-slate-500">{f.note}</span></span>
                  </button></li>
                ))}
                {s.recentNotes.map(n => (
                  <li key={n.id}><button type="button" onClick={() => setOpenId(n.bookingId)} className="flex w-full items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-left hover:bg-amber-100">
                    <FileText className="mt-0.5 size-4 shrink-0 text-amber-600" />
                    <span className="min-w-0 flex-1 text-xs"><b className="text-slate-800">{n.client}</b> <span className="text-slate-400">{n.dateLabel}</span><span className="line-clamp-2 text-slate-600">{n.body}</span></span>
                  </button></li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
      <AppointmentDrawer id={openId} onClose={() => setOpenId(null)} onChanged={reloadAll} />
    </div>
  );
};

export default DoctorDashboard;
