import React, { useState } from 'react';
import { FileText, Search, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { portalDeleteNote, portalNotes } from '../../lib/doctorPortalApi';
import AppointmentDrawer from './AppointmentDrawer';
import { Card, Empty, ErrorBox, Spinner, inputCls } from './ui';
import { useDebounced, useLoad } from './useLoad';

const DoctorNotes: React.FC = () => {
  const [q, setQ] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const dq = useDebounced(q);
  const list = useLoad(() => portalNotes(dq), [dq]);
  const notes = list.data?.notes || [];
  const remove = async (id: string) => {
    if (!window.confirm('Delete this note?')) return;
    try { await portalDeleteNote(id); toast.success('Note deleted'); list.reload(); } catch (e) { toast.error((e as Error).message); }
  };
  return (
    <div className="space-y-4">
      <div><h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">Consultation Notes</h1><p className="text-sm text-slate-500">Your private notes from every session. Add new notes from an appointment.</p></div>
      <Card>
        <div className="border-b border-slate-100 p-3 sm:p-4"><label className="relative block max-w-md"><span className="sr-only">Search notes</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search in notes, client or company" className={`${inputCls} !pl-9`} /></label></div>
        {list.error ? <div className="p-4"><ErrorBox message={list.error} onRetry={list.reload} /></div> : list.loading && !list.data ? <Spinner /> : notes.length === 0 ? <Empty icon={<FileText className="size-10" />} title="No notes yet" hint="Open an appointment and save a note after your session." /> : (
          <ul className="grid gap-3 p-3 sm:p-4 lg:grid-cols-2">
            {notes.map(n => (
              <li key={n.id} className="rounded-xl border border-slate-200 bg-amber-50/50 p-4">
                <div className="flex items-start justify-between gap-2">
                  <button type="button" onClick={() => setOpenId(n.bookingId)} className="min-w-0 text-left"><div className="truncate font-bold text-slate-800 hover:underline">{n.client}</div><div className="truncate text-xs text-slate-500">{n.company || n.topicLabel} - {n.ref}</div></button>
                  <button type="button" aria-label="Delete note" onClick={() => remove(n.id)} className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="size-4" /></button>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{n.body}</p>
                <div className="mt-2 text-xs text-slate-400">{n.createdLabel}</div>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <AppointmentDrawer id={openId} onClose={() => setOpenId(null)} onChanged={list.reload} />
    </div>
  );
};

export default DoctorNotes;
