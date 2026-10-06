import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CalendarDays, Search } from 'lucide-react';
import { Tab, portalAppointments } from '../../lib/doctorPortalApi';
import AppointmentsTable from './AppointmentsTable';
import AppointmentDrawer from './AppointmentDrawer';
import { Card, Empty, ErrorBox, Spinner, inputCls } from './ui';
import { useDebounced, useLoad } from './useLoad';
import { useOutletContext } from 'react-router-dom';
import type { PortalContext } from './DoctorPortalLayout';

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All' }, { id: 'upcoming', label: 'Upcoming' }, { id: 'completed', label: 'Completed' }, { id: 'followup', label: 'Follow-up' }, { id: 'cancelled', label: 'Cancelled' },
];

const DoctorAppointments: React.FC = () => {
  const { refreshAttention } = useOutletContext<PortalContext>();
  const [params] = useSearchParams();
  const [tab, setTab] = useState<Tab>('all');
  const [q, setQ] = useState(params.get('q') || '');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const dq = useDebounced(q);
  const list = useLoad(() => portalAppointments({ tab, q: dq, start, end }), [tab, dq, start, end]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">Appointments</h1>
        <p className="text-sm text-slate-500">Every paid consultation, newest first. Open one to add notes, follow-ups and mark how it went.</p>
      </div>
      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-3 sm:p-4">
          <label className="relative min-w-[220px] flex-1">
            <span className="sr-only">Search appointments</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, company, email, phone, booking ID" className={`${inputCls} !pl-9`} />
          </label>
          <label className="sr-only" htmlFor="ap-from">From</label><input id="ap-from" type="date" value={start} max={end || undefined} onChange={e => setStart(e.target.value)} className={`${inputCls} !w-auto`} />
          <span className="text-xs text-slate-400">to</span>
          <label className="sr-only" htmlFor="ap-to">To</label><input id="ap-to" type="date" value={end} min={start || undefined} onChange={e => setEnd(e.target.value)} className={`${inputCls} !w-auto`} />
          {(start || end || q) && <button type="button" onClick={() => { setStart(''); setEnd(''); setQ(''); }} className="text-xs font-semibold text-blue-600 underline">Clear filters</button>}
        </div>
        <div role="tablist" aria-label="Appointment filter" className="flex gap-1 overflow-x-auto border-b border-slate-100 px-3 sm:px-4">
          {TABS.map(t => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} type="button" onClick={() => setTab(t.id)} className={`whitespace-nowrap border-b-[3px] px-3 py-2.5 text-sm font-semibold ${tab === t.id ? 'border-[#0b1f4d] text-[#0b1f4d]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
              {t.label}{list.data ? ` (${list.data.counts[t.id]})` : ''}
            </button>
          ))}
        </div>
        {list.error ? <div className="p-4"><ErrorBox message={list.error} onRetry={list.reload} /></div> : list.loading && !list.data ? <Spinner /> : list.data && list.data.appointments.length === 0 ? (
          <Empty icon={<CalendarDays className="size-10" />} title="No appointments match" hint="Try another tab, a wider date range or a different search." />
        ) : list.data && <AppointmentsTable rows={list.data.appointments} onOpen={setOpenId} />}
      </Card>
      <AppointmentDrawer id={openId} onClose={() => setOpenId(null)} onChanged={() => { list.reload(); refreshAttention(); }} />
    </div>
  );
};

export default DoctorAppointments;
