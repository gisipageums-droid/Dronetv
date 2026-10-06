import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users } from 'lucide-react';
import { portalClients } from '../../lib/doctorPortalApi';
import { Card, Empty, ErrorBox, Spinner, initials, inputCls } from './ui';
import { useDebounced, useLoad } from './useLoad';

const DoctorClients: React.FC = () => {
  const [q, setQ] = useState('');
  const dq = useDebounced(q);
  const list = useLoad(() => portalClients(dq), [dq]);
  const rows = list.data?.clients || [];
  return (
    <div className="space-y-4">
      <div><h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">Clients</h1><p className="text-sm text-slate-500">Everyone who has booked a consultation, grouped by email.</p></div>
      <Card>
        <div className="border-b border-slate-100 p-3 sm:p-4">
          <label className="relative block max-w-md"><span className="sr-only">Search clients</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, company, city or email" className={`${inputCls} !pl-9`} /></label>
        </div>
        {list.error ? <div className="p-4"><ErrorBox message={list.error} onRetry={list.reload} /></div> : list.loading && !list.data ? <Spinner /> : rows.length === 0 ? <Empty icon={<Users className="size-10" />} title="No clients yet" hint="Clients appear here after their first booking." /> : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500"><tr>{['Client', 'City', 'Consultations', 'Last session', 'Next session', 'Follow-ups', 'Paid', ''].map(h => <th key={h} scope="col" className="px-3 py-3">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map(c => (
                    <tr key={c.email} className="hover:bg-amber-50/40">
                      <td className="px-3 py-3"><div className="flex items-center gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0b1f4d] text-xs font-bold text-white">{initials(c.name)}</span><div className="min-w-0"><div className="font-bold text-slate-800">{c.name}</div><div className="truncate text-xs text-slate-500">{c.company || c.email}</div></div></div></td>
                      <td className="px-3 py-3 text-slate-600">{c.city || '-'}</td>
                      <td className="px-3 py-3 font-semibold">{c.consultations}<span className="ml-1 text-xs font-normal text-slate-500">({c.completed} done{c.cancelled ? `, ${c.cancelled} cancelled` : ''})</span></td>
                      <td className="whitespace-nowrap px-3 py-3 text-slate-600">{c.lastSession || '-'}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-slate-600">{c.nextSession || '-'}</td>
                      <td className="px-3 py-3">{c.openFollowUps ? <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">{c.openFollowUps} open</span> : '-'}</td>
                      <td className="px-3 py-3 text-slate-700">{c.paidLabel}</td>
                      <td className="px-3 py-3 text-right"><Link to={`/doctor-portal/appointments?q=${encodeURIComponent(c.email)}`} className="text-sm font-bold text-blue-700 hover:underline">Sessions</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="divide-y divide-slate-100 md:hidden">
              {rows.map(c => (
                <li key={c.email} className="p-4">
                  <div className="flex items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0b1f4d] text-sm font-bold text-white">{initials(c.name)}</span><div className="min-w-0"><div className="font-bold text-slate-800">{c.name}</div><div className="truncate text-xs text-slate-500">{c.company || c.email}</div></div></div>
                  <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-slate-600"><span>{c.consultations} consultation{c.consultations === 1 ? '' : 's'}</span><span>Paid {c.paidLabel}</span><span>Last {c.lastSession || '-'}</span><span>Next {c.nextSession || '-'}</span></div>
                  <Link to={`/doctor-portal/appointments?q=${encodeURIComponent(c.email)}`} className="mt-2 inline-block text-sm font-bold text-blue-700">View sessions</Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>
    </div>
  );
};

export default DoctorClients;
