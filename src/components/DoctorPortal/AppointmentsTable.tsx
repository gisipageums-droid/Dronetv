import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Link2, Video } from 'lucide-react';
import type { Appt } from '../../lib/doctorPortalApi';
import { StatusBadge } from './ui';

const live = (a: Appt) => a.status === 'upcoming' || a.status === 'needs_update';

// Meeting column: Join for sessions still to happen, Add link when no Meet link is set yet,
// View for finished ones (opens the details), nothing for cancelled.
const MeetingCell: React.FC<{ a: Appt; onOpen: (id: string) => void }> = ({ a, onOpen }) => {
  if (live(a)) {
    return a.meetLink
      ? <a href={a.meetLink} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"><Video className="size-3.5" />Join</a>
      : <Link to="/doctor-portal/meeting-links" onClick={e => e.stopPropagation()} className="inline-flex items-center gap-1 rounded-lg border border-amber-400 bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100"><Link2 className="size-3.5" />Add link</Link>;
  }
  if (a.status === 'cancelled') return <span className="text-slate-400">-</span>;
  return <button type="button" onClick={e => { e.stopPropagation(); onOpen(a.id); }} className="inline-flex items-center gap-1.5 rounded-lg border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100"><FileText className="size-3.5" />View</button>;
};

const AppointmentsTable: React.FC<{ rows: Appt[]; onOpen: (id: string) => void; startIndex?: number }> = ({ rows, onOpen, startIndex = 0 }) => (
  <>
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[640px] text-left text-[13px]">
        <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wide text-slate-500">
          <tr>{['#', 'Date & Time (IST)', 'Client Name', 'Consultation Topic', 'Status', 'Meeting Link', 'Follow-up', 'Action'].map(h => <th key={h} scope="col" className="px-2 py-3 first:pl-4 last:pr-4">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((a, i) => (
            <tr key={a.id} onClick={() => onOpen(a.id)} className="cursor-pointer hover:bg-amber-50/40">
              <td className="py-3 pl-4 pr-1 text-slate-400">{startIndex + i + 1}</td>
              <td className="whitespace-nowrap px-2 py-3 font-semibold text-slate-800">{a.dateLabel}<div className="text-xs font-normal text-slate-500">{a.timeLabel}</div></td>
              <td className="px-2 py-3"><div className="font-bold leading-tight text-slate-800">{a.name}</div><div className="text-xs leading-tight text-slate-500">{a.company || '-'}</div></td>
              <td className="max-w-[170px] px-2 py-3 leading-tight text-slate-700">{a.topicLabel}</td>
              <td className="px-2 py-3"><StatusBadge status={a.status} /></td>
              <td className="px-2 py-3"><MeetingCell a={a} onOpen={onOpen} /></td>
              <td className="px-2 py-3 leading-tight text-slate-600">{a.nextFollowUp || '-'}</td>
              <td className="py-3 pl-2 pr-4"><button type="button" onClick={e => { e.stopPropagation(); onOpen(a.id); }} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <ul className="divide-y divide-slate-100 md:hidden">
      {rows.map(a => (
        <li key={a.id}>
          <button type="button" onClick={() => onOpen(a.id)} className="flex w-full flex-col gap-2 px-4 py-3 text-left hover:bg-amber-50/40">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0"><div className="truncate font-bold text-slate-800">{a.name}</div><div className="truncate text-xs text-slate-500">{a.company || '-'}</div></div>
              <StatusBadge status={a.status} />
            </div>
            <div className="text-sm text-slate-700">{a.topicLabel}</div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{a.dateLabel}, {a.timeLabel}</span>
              {a.nextFollowUp && <span>Follow-up {a.nextFollowUp}</span>}
            </div>
          </button>
          <div className="px-4 pb-3"><MeetingCell a={a} onOpen={onOpen} /></div>
        </li>
      ))}
    </ul>
  </>
);

export default AppointmentsTable;
