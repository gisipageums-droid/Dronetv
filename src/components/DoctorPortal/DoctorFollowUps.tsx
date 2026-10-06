import React, { useState } from 'react';
import { ClipboardCheck, Mail, MessageCircle, Phone } from 'lucide-react';
import { toast } from 'react-toastify';
import { portalFollowUps, portalPatchFollowUp } from '../../lib/doctorPortalApi';
import AppointmentDrawer from './AppointmentDrawer';
import { Card, Empty, ErrorBox, Spinner, btnGhost, waLink } from './ui';
import { useLoad } from './useLoad';
import { useOutletContext } from 'react-router-dom';
import type { PortalContext } from './DoctorPortalLayout';

const DoctorFollowUps: React.FC = () => {
  const { refreshAttention } = useOutletContext<PortalContext>();
  const [status, setStatus] = useState<'open' | 'done'>('open');
  const [openId, setOpenId] = useState<string | null>(null);
  const list = useLoad(() => portalFollowUps(status), [status]);
  const rows = list.data?.followUps || [];
  const toggle = async (id: string, to: 'open' | 'done') => {
    try { await portalPatchFollowUp(id, { status: to }); toast.success(to === 'done' ? 'Follow-up done' : 'Follow-up reopened'); list.reload(); refreshAttention(); } catch (e) { toast.error((e as Error).message); }
  };
  return (
    <div className="space-y-4">
      <div><h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">Follow-ups</h1><p className="text-sm text-slate-500">Reminders to get back to clients. Add one from any appointment.</p></div>
      <Card>
        <div role="tablist" aria-label="Follow-up filter" className="flex gap-1 border-b border-slate-100 px-3 sm:px-4">
          {(['open', 'done'] as const).map(t => <button key={t} role="tab" aria-selected={status === t} type="button" onClick={() => setStatus(t)} className={`border-b-[3px] px-3 py-2.5 text-sm font-semibold ${status === t ? 'border-[#0b1f4d] text-[#0b1f4d]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>{t === 'open' ? 'Open' : 'Done'}</button>)}
        </div>
        {list.error ? <div className="p-4"><ErrorBox message={list.error} onRetry={list.reload} /></div> : list.loading && !list.data ? <Spinner /> : rows.length === 0 ? <Empty icon={<ClipboardCheck className="size-10" />} title={status === 'open' ? 'No open follow-ups' : 'Nothing marked done yet'} hint={status === 'open' ? 'You are all caught up.' : undefined} /> : (
          <ul className="divide-y divide-slate-100">
            {rows.map(f => (
              <li key={f.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <button type="button" onClick={() => setOpenId(f.bookingId)} className="min-w-0 flex-1 text-left">
                  <div className="flex flex-wrap items-center gap-2"><span className="font-bold text-slate-800">{f.client}</span>{f.overdue && <span className="rounded-md bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">Due</span>}</div>
                  <div className="text-xs text-slate-500">{f.company || f.topicLabel} - {f.ref}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-700">{f.dueLabel}</div>
                  {f.note && <div className="text-sm text-slate-600">{f.note}</div>}
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  {f.phone && <a href={`tel:${f.phone}`} aria-label={`Call ${f.client}`} className={btnGhost}><Phone className="size-4" /></a>}
                  {f.phone && waLink(f.phone) && <a href={waLink(f.phone)} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${f.client}`} className={btnGhost}><MessageCircle className="size-4" /></a>}
                  <a href={`mailto:${f.email}`} aria-label={`Email ${f.client}`} className={btnGhost}><Mail className="size-4" /></a>
                  <button type="button" onClick={() => toggle(f.id, f.status === 'open' ? 'done' : 'open')} className={btnGhost}>{f.status === 'open' ? 'Mark done' : 'Reopen'}</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <AppointmentDrawer id={openId} onClose={() => setOpenId(null)} onChanged={() => { list.reload(); refreshAttention(); }} />
    </div>
  );
};

export default DoctorFollowUps;
