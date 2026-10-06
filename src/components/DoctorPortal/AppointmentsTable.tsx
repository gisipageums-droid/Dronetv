import React from 'react';
import { Video } from 'lucide-react';
import type { Appt } from '../../lib/doctorPortalApi';
import { StatusBadge, btnGhost } from './ui';

const canJoin = (a: Appt) => !!a.meetLink && (a.status === 'upcoming' || a.status === 'needs_update');

const JoinBtn: React.FC<{ a: Appt }> = ({ a }) =>
  canJoin(a)
    ? <a href={a.meetLink} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"><Video className="size-3.5" />Join</a>
    : <span className="text-slate-400">-</span>;

const AppointmentsTable: React.FC<{ rows: Appt[]; onOpen: (id: string) => void; startIndex?: number }> = ({ rows, onOpen, startIndex = 0 }) => (
  <>
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
          <tr>{['#', 'Date & Time (IST)', 'Client', 'Consultation Topic', 'Status', 'Meeting', 'Follow-up', ''].map(h => <th key={h} scope="col" className="px-3 py-3">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((a, i) => (
            <tr key={a.id} onClick={() => onOpen(a.id)} className="cursor-pointer hover:bg-amber-50/40">
              <td className="px-3 py-3 text-slate-400">{startIndex + i + 1}</td>
              <td className="whitespace-nowrap px-3 py-3 font-semibold text-slate-800">{a.dateLabel}<div className="text-xs font-normal text-slate-500">{a.timeLabel}</div></td>
              <td className="px-3 py-3"><div className="font-bold text-slate-800">{a.name}</div><div className="text-xs text-slate-500">{a.company || '-'}</div></td>
              <td className="max-w-[220px] px-3 py-3 text-slate-700">{a.topicLabel}</td>
              <td className="px-3 py-3"><StatusBadge status={a.status} /></td>
              <td className="px-3 py-3"><JoinBtn a={a} /></td>
              <td className="whitespace-nowrap px-3 py-3 text-slate-600">{a.nextFollowUp || '-'}</td>
              <td className="px-3 py-3 text-right"><button type="button" onClick={e => { e.stopPropagation(); onOpen(a.id); }} className={btnGhost}>View</button></td>
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
          {canJoin(a) && <div className="px-4 pb-3"><JoinBtn a={a} /></div>}
        </li>
      ))}
    </ul>
  </>
);

export default AppointmentsTable;
