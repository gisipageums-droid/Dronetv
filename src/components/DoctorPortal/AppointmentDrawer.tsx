import React, { useCallback, useEffect, useState } from 'react';
import { CalendarClock, Check, Copy, Mail, MessageCircle, Phone, Trash2, Video } from 'lucide-react';
import { toast } from 'react-toastify';
import { ApptDetail, portalAddFollowUp, portalAddNote, portalAppointment, portalDeleteNote, portalPatchFollowUp, portalSetSession } from '../../lib/doctorPortalApi';
import { Drawer, ErrorBox, Spinner, StatusBadge, btnGhost, btnPrimary, inputCls, waLink } from './ui';

interface Props { id: string | null; onClose: () => void; onChanged: () => void }

const todayISO = () => new Date().toISOString().slice(0, 10);

const AppointmentDrawer: React.FC<Props> = ({ id, onClose, onChanged }) => {
  const [d, setD] = useState<ApptDetail | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const [fuDate, setFuDate] = useState('');
  const [fuTime, setFuTime] = useState('10:00');
  const [fuNote, setFuNote] = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    setError('');
    try { setD(await portalAppointment(id)); } catch (e) { setError((e as Error).message); }
  }, [id]);

  useEffect(() => { setD(null); setNote(''); setFuDate(''); setFuNote(''); if (id) load(); }, [id, load]);

  const run = async (fn: () => Promise<ApptDetail | { message: string }>, ok: string) => {
    setBusy(true);
    try {
      const r = await fn();
      if ('id' in r) setD(r as ApptDetail); else await load();
      toast.success(ok);
      onChanged();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const started = d ? new Date(d.start).getTime() <= Date.now() : false;
  const confirmed = d?.bookingStatus === 'confirmed';
  const copy = (t: string) => { navigator.clipboard?.writeText(t).then(() => toast.info('Copied')).catch(() => undefined); };

  return (
    <Drawer open={!!id} onClose={onClose} title={d ? d.name : 'Appointment'}>
      {error ? <ErrorBox message={error} onRetry={load} /> : !d ? <Spinner /> : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={d.status} />
            <span className="text-xs font-semibold text-slate-500">{d.ref}</span>
            {d.paymentMethod === 'offline' && <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">Paid offline</span>}
            {d.paymentMethod === 'complimentary' && <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">Complimentary</span>}
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl bg-slate-50 p-4 text-sm">
            <div className="col-span-2"><dt className="text-xs font-bold uppercase text-slate-500">Topic</dt><dd className="font-semibold text-slate-800">{d.topicLabel}</dd></div>
            <div><dt className="text-xs font-bold uppercase text-slate-500">Date</dt><dd className="font-semibold text-slate-800">{d.dateLabel}</dd></div>
            <div><dt className="text-xs font-bold uppercase text-slate-500">Time (IST)</dt><dd className="font-semibold text-slate-800">{d.timeRangeLabel.replace(/ \(IST\)$/, '')}</dd></div>
            <div><dt className="text-xs font-bold uppercase text-slate-500">Client</dt><dd className="font-semibold text-slate-800">{d.name}</dd></div>
            <div><dt className="text-xs font-bold uppercase text-slate-500">Company</dt><dd className="font-semibold text-slate-800">{d.company || '-'}</dd></div>
            <div><dt className="text-xs font-bold uppercase text-slate-500">City / Country</dt><dd className="font-semibold text-slate-800">{d.city || '-'}</dd></div>
            <div><dt className="text-xs font-bold uppercase text-slate-500">Fee</dt><dd className="font-semibold text-slate-800">{d.feeLabel}{d.refunded ? ' (refunded)' : ''}</dd></div>
          </dl>

          <div className="flex flex-wrap gap-2">
            {d.phone && <a href={`tel:${d.phone}`} className={btnGhost}><Phone className="size-4" />Call</a>}
            {d.phone && waLink(d.phone) && <a href={waLink(d.phone)} target="_blank" rel="noreferrer" className={btnGhost}><MessageCircle className="size-4" />WhatsApp</a>}
            <a href={`mailto:${d.email}`} className={btnGhost}><Mail className="size-4" />Email</a>
            {d.meetLink && confirmed && d.status !== 'completed' && d.status !== 'followup' && <a href={d.meetLink} target="_blank" rel="noreferrer" className={`${btnPrimary} !bg-blue-600 hover:!bg-blue-700`}><Video className="size-4" />Join meeting</a>}
            {d.meetLink && <button type="button" onClick={() => copy(d.meetLink)} className={btnGhost}><Copy className="size-4" />Copy link</button>}
          </div>

          <div>
            <h3 className="mb-1 text-sm font-extrabold text-slate-900">What the client wants to discuss</h3>
            <p className="whitespace-pre-wrap rounded-xl border border-slate-200 p-3 text-sm text-slate-700">{d.message || 'Nothing written.'}</p>
          </div>

          {confirmed && (
            <div>
              <h3 className="mb-2 text-sm font-extrabold text-slate-900">Session outcome</h3>
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={busy || !started || d.sessionStatus === 'completed'} onClick={() => run(() => portalSetSession(d.id, 'completed'), 'Marked as completed')} className={`${btnPrimary} !bg-green-600 hover:!bg-green-700`}><Check className="size-4" />Mark completed</button>
                <button type="button" disabled={busy || !started || d.sessionStatus === 'no_show'} onClick={() => run(() => portalSetSession(d.id, 'no_show'), 'Marked as no-show')} className={btnGhost}>Client did not join</button>
                {d.sessionStatus !== 'scheduled' && <button type="button" disabled={busy} onClick={() => run(() => portalSetSession(d.id, 'scheduled'), 'Outcome cleared')} className={btnGhost}>Clear</button>}
              </div>
              {!started && <p className="mt-2 text-xs text-slate-500">Outcome buttons unlock when the session starts.</p>}
            </div>
          )}

          <div>
            <h3 className="mb-2 text-sm font-extrabold text-slate-900">Consultation notes ({d.notes.length})</h3>
            <form onSubmit={e => { e.preventDefault(); if (note.trim()) run(() => portalAddNote(d.id, note.trim()), 'Note saved').then(() => setNote('')); }} className="space-y-2">
              <label htmlFor="dp-note" className="sr-only">Add a note</label>
              <textarea id="dp-note" rows={3} maxLength={5000} value={note} onChange={e => setNote(e.target.value)} placeholder="Write what you discussed, advice given, documents promised..." className={inputCls} />
              <button type="submit" disabled={busy || !note.trim()} className={btnPrimary}>Save note</button>
            </form>
            <ul className="mt-3 space-y-2">
              {d.notes.map(n => (
                <li key={n.id} className="rounded-xl border border-slate-200 bg-amber-50/50 p-3 text-sm">
                  <p className="whitespace-pre-wrap text-slate-800">{n.body}</p>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                    <span>{n.createdLabel}</span>
                    <button type="button" aria-label="Delete note" disabled={busy} onClick={() => { if (window.confirm('Delete this note?')) run(() => portalDeleteNote(n.id), 'Note deleted'); }} className="rounded p-1 hover:bg-red-50 hover:text-red-600"><Trash2 className="size-4" /></button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-extrabold text-slate-900"><CalendarClock className="size-4" />Follow-ups ({d.followUps.length})</h3>
            <form onSubmit={e => { e.preventDefault(); if (fuDate) run(() => portalAddFollowUp(d.id, fuDate, fuTime, fuNote), 'Follow-up added').then(() => { setFuNote(''); setFuDate(''); }); }} className="grid gap-2 sm:grid-cols-[1fr_120px]">
              <div><label htmlFor="dp-fu-date" className="mb-1 block text-xs font-bold text-slate-600">Date</label><input id="dp-fu-date" type="date" min={todayISO()} value={fuDate} onChange={e => setFuDate(e.target.value)} className={inputCls} required /></div>
              <div><label htmlFor="dp-fu-time" className="mb-1 block text-xs font-bold text-slate-600">Time</label><input id="dp-fu-time" type="time" value={fuTime} onChange={e => setFuTime(e.target.value)} className={inputCls} /></div>
              <div className="sm:col-span-2"><label htmlFor="dp-fu-note" className="mb-1 block text-xs font-bold text-slate-600">Reminder note</label><input id="dp-fu-note" maxLength={1000} value={fuNote} onChange={e => setFuNote(e.target.value)} placeholder="e.g. Share the survey quotation" className={inputCls} /></div>
              <div className="sm:col-span-2"><button type="submit" disabled={busy || !fuDate} className={btnPrimary}>Add follow-up</button></div>
            </form>
            <ul className="mt-3 space-y-2">
              {d.followUps.map(f => (
                <li key={f.id} className={`flex items-start justify-between gap-3 rounded-xl border p-3 text-sm ${f.status === 'done' ? 'border-slate-200 bg-slate-50 text-slate-500' : 'border-blue-200 bg-blue-50/60'}`}>
                  <div><div className="font-semibold">{f.dueLabel}</div>{f.note && <div className="text-slate-600">{f.note}</div>}</div>
                  <button type="button" disabled={busy} onClick={() => run(() => portalPatchFollowUp(f.id, { status: f.status === 'done' ? 'open' : 'done' }), f.status === 'done' ? 'Follow-up reopened' : 'Follow-up done')} className={btnGhost}>{f.status === 'done' ? 'Reopen' : 'Mark done'}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default AppointmentDrawer;
