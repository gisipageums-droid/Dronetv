import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ExternalLink, Loader2, Plus, Trash2, UserPlus, X } from 'lucide-react';
import { adminGetDoctors, adminManualBooking, adminSetDoctors } from '../../../lib/doctorPortalApi';
import { fetchDoctorConfig, type DoctorTopic } from '../../../lib/doctorApi';

const inp = 'w-full border border-ink-light rounded-lg px-3 py-2 text-sm text-ink bg-surface-card focus:outline-none focus:border-brand-yellow';
const lbl = 'text-xs font-bold text-ink-paragraph uppercase tracking-wide block mb-1';

// Who may open /doctor-portal: the email each doctor uses to log in to the website.
export const DoctorAccessPanel: React.FC = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { adminGetDoctors().then(r => { setEmails(r.emails); setLoaded(true); }).catch(e => toast.error((e as Error).message)); }, []);

  const save = async (next: string[]) => {
    setSaving(true);
    try { const r = await adminSetDoctors(next); setEmails(r.emails); toast.success('Doctor access saved'); } catch (e) { toast.error((e as Error).message); } finally { setSaving(false); }
  };
  const add = () => {
    const e = value.trim().toLowerCase();
    if (!e) return;
    if (emails.includes(e)) { toast.info('Already on the list'); return; }
    setValue('');
    save([...emails, e]);
  };

  return (
    <div className="bg-surface-card rounded-xl border border-ink-light shadow-sm p-5 sm:p-6 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-ink">Doctor portal access</h3>
          <p className="text-xs text-ink-caption">These logins can open the Drone Doctor dashboard. The person must have a normal DroneTV account with the same email.</p>
        </div>
        <a href="/doctor-portal" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-semibold underline"><ExternalLink className="w-4 h-4" />Open portal</a>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="doc-email">Doctor login email</label>
        <input id="doc-email" type="email" value={value} onChange={e => setValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }} placeholder="doctor@example.com" className={inp} />
        <button type="button" onClick={add} disabled={saving || !value.trim()} className="px-4 py-2 rounded-lg bg-brand-yellow text-ink font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}Add</button>
      </div>
      {!loaded ? <p className="text-sm text-ink-caption">Loading...</p> : emails.length === 0 ? <p className="text-sm text-ink-caption">No doctor logins yet. Admins can always open the portal.</p> : (
        <ul className="divide-y divide-ink-light rounded-lg border border-ink-light">
          {emails.map(e => (
            <li key={e} className="flex items-center justify-between gap-3 px-3 py-2 text-sm"><span className="truncate font-medium text-ink">{e}</span><button type="button" aria-label={`Remove ${e}`} disabled={saving} onClick={() => { if (window.confirm(`Remove portal access for ${e}?`)) save(emails.filter(x => x !== e)); }} className="p-1.5 rounded hover:bg-ink-light text-status-error"><Trash2 className="w-4 h-4" /></button></li>
          ))}
        </ul>
      )}
    </div>
  );
};

const localNowInput = () => { const d = new Date(Date.now() + 3600e3); d.setMinutes(0, 0, 0); const p = (n: number) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; };

// A booking the team makes for a client who paid offline, or a complimentary session.
export const ManualBookingButton: React.FC<{ onCreated: () => void }> = ({ onCreated }) => {
  const [open, setOpen] = useState(false);
  const [topics, setTopics] = useState<DoctorTopic[]>([]);
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({ name: '', email: '', phone: '', company: '', city: '', topic: 'other', message: '', start: localNowInput(), paid: true, notify: true });
  useEffect(() => { if (open && topics.length === 0) fetchDoctorConfig().then(c => setTopics(c.topics)).catch(() => undefined); }, [open, topics.length]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await adminManualBooking({ ...f, start: new Date(f.start).toISOString() });
      toast.success(`Booking ${r.ref} created`);
      setOpen(false);
      setF(cur => ({ ...cur, name: '', email: '', phone: '', company: '', city: '', message: '' }));
      onCreated();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-yellow text-ink text-sm font-bold"><UserPlus className="w-4 h-4" />Add booking manually</button>
      {open && (
        <div className="fixed inset-0 z-[100000000] bg-black/50 flex items-start justify-center overflow-y-auto p-3 sm:py-8" onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false); }}>
          <form onSubmit={submit} role="dialog" aria-modal="true" aria-label="Add booking manually" className="bg-surface-card rounded-xl shadow-2xl w-full max-w-lg p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between"><h3 className="text-lg font-bold text-ink">Add booking manually</h3><button type="button" aria-label="Close" onClick={() => setOpen(false)} className="p-1.5 rounded hover:bg-ink-light"><X className="w-5 h-5" /></button></div>
            <p className="text-xs text-ink-caption">For a client who paid offline or a complimentary session. Any date and time can be used; it must not overlap another consultation.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className={lbl} htmlFor="mb-name">Client name *</label><input id="mb-name" required minLength={2} className={inp} value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></div>
              <div><label className={lbl} htmlFor="mb-email">Email *</label><input id="mb-email" required type="email" className={inp} value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></div>
              <div><label className={lbl} htmlFor="mb-phone">Phone</label><input id="mb-phone" className={inp} value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} /></div>
              <div><label className={lbl} htmlFor="mb-company">Company</label><input id="mb-company" className={inp} value={f.company} onChange={e => setF({ ...f, company: e.target.value })} /></div>
              <div><label className={lbl} htmlFor="mb-city">City / Country</label><input id="mb-city" className={inp} value={f.city} onChange={e => setF({ ...f, city: e.target.value })} /></div>
              <div><label className={lbl} htmlFor="mb-start">Date and time (your device time) *</label><input id="mb-start" required type="datetime-local" className={inp} value={f.start} onChange={e => setF({ ...f, start: e.target.value })} /></div>
              <div className="sm:col-span-2"><label className={lbl} htmlFor="mb-topic">Topic</label><select id="mb-topic" className={inp} value={f.topic} onChange={e => setF({ ...f, topic: e.target.value })}>{topics.length === 0 && <option value="other">Other Drone-Related Consultation</option>}{topics.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}</select></div>
              <div className="sm:col-span-2"><label className={lbl} htmlFor="mb-msg">Requirement</label><textarea id="mb-msg" rows={2} className={inp} value={f.message} onChange={e => setF({ ...f, message: e.target.value })} /></div>
            </div>
            <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={f.paid} onChange={e => setF({ ...f, paid: e.target.checked })} />Fee collected offline (counts as Rs 500 revenue). Untick for a complimentary session.</label>
            <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={f.notify} onChange={e => setF({ ...f, notify: e.target.checked })} />Email the confirmation to the client</label>
            <div className="flex justify-end gap-2 pt-1"><button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg bg-ink-light text-sm font-medium">Cancel</button><button type="submit" disabled={busy} className="px-4 py-2 rounded-lg bg-brand-yellow text-ink font-bold text-sm disabled:opacity-60 flex items-center gap-2">{busy && <Loader2 className="w-4 h-4 animate-spin" />}Create booking</button></div>
          </form>
        </div>
      )}
    </>
  );
};
