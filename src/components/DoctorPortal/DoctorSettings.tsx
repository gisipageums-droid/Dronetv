import React, { useEffect, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BookingSettings, WEEKDAYS } from '../../lib/bookingApi';
import { portalSaveSettings, portalSettings } from '../../lib/doctorPortalApi';
import type { PortalContext } from './DoctorPortalLayout';
import { Card, ErrorBox, Spinner, btnGhost, btnPrimary, inputCls } from './ui';
import { useLoad } from './useLoad';

const lbl = 'mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600';

const DoctorSettings: React.FC = () => {
  const { me } = useOutletContext<PortalContext>();
  const load = useLoad(portalSettings, []);
  const [s, setS] = useState<BookingSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [newDate, setNewDate] = useState('');
  useEffect(() => { if (load.data) setS(load.data); }, [load.data]);
  const set = <K extends keyof BookingSettings>(k: K, v: BookingSettings[K]) => setS(cur => (cur ? { ...cur, [k]: v } : cur));

  const setWin = (day: string, i: number, pos: 0 | 1, v: string) => {
    if (!s) return;
    const wins = (s.weeklyHours[day] || []).map(w => [...w]);
    wins[i][pos] = v;
    set('weeklyHours', { ...s.weeklyHours, [day]: wins });
  };
  const save = async () => {
    if (!s) return;
    setSaving(true);
    try {
      const saved = await portalSaveSettings(s);
      setS(saved);
      toast.success('Settings saved');
      if ((saved as { blockedConflicts?: unknown[] }).blockedConflicts?.length) toast.warn('Some existing appointments fall in a blocked day; they were kept.', { autoClose: 8000 });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div><h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">Profile Settings</h1><p className="text-sm text-slate-500">Your details, notification email and the hours clients can book you.</p></div>
      {load.error ? <ErrorBox message={load.error} onRetry={load.reload} /> : !s ? <Spinner /> : (
        <>
          <Card className="p-4 sm:p-5">
            <h2 className="mb-3 text-lg font-extrabold text-slate-900">Profile</h2>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className={lbl}>Name shown to clients</dt><dd className="font-semibold text-slate-800">{me.doctorName}</dd></div>
              <div><dt className={lbl}>Title</dt><dd className="font-semibold text-slate-800">{me.doctorTitle}</dd></div>
              <div><dt className={lbl}>Login email</dt><dd className="font-semibold text-slate-800">{me.email}</dd></div>
              <div><dt className={lbl}>Time zone</dt><dd className="font-semibold text-slate-800">{s.timezone}</dd></div>
            </dl>
            <p className="mt-3 text-xs text-slate-500">To change your name or photo, contact the DroneTV team.</p>
          </Card>

          <Card className="p-4 sm:p-5">
            <h2 className="mb-3 text-lg font-extrabold text-slate-900">Joining and alerts</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><label className={lbl} htmlFor="st-meet">Google Meet link</label><input id="st-meet" className={inputCls} value={s.meetLink} onChange={e => set('meetLink', e.target.value)} placeholder="https://meet.google.com/..." /></div>
              <div className="sm:col-span-2"><label className={lbl} htmlFor="st-notify">Send new-booking alerts to</label><input id="st-notify" type="email" className={inputCls} value={s.notifyEmail} onChange={e => set('notifyEmail', e.target.value)} placeholder="you@example.com" /></div>
            </div>
          </Card>

          <Card className="p-4 sm:p-5">
            <h2 className="mb-3 text-lg font-extrabold text-slate-900">Availability</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div><label className={lbl} htmlFor="st-len">Session length</label><select id="st-len" className={inputCls} value={s.slotMinutes} onChange={e => set('slotMinutes', Number(e.target.value))}>{[15, 20, 30, 45, 60, 90].map(n => <option key={n} value={n}>{n} minutes</option>)}</select></div>
              <div><label className={lbl} htmlFor="st-buf">Gap between sessions (min)</label><input id="st-buf" type="number" min={0} max={120} className={inputCls} value={s.bufferMinutes} onChange={e => set('bufferMinutes', Number(e.target.value))} /></div>
              <div><label className={lbl} htmlFor="st-win">Bookable days ahead</label><input id="st-win" type="number" min={1} max={180} className={inputCls} value={s.windowDays} onChange={e => set('windowDays', Number(e.target.value))} /></div>
              <div><label className={lbl} htmlFor="st-notice">Minimum notice (hours)</label><input id="st-notice" type="number" min={0} max={720} className={inputCls} value={s.minNoticeHours} onChange={e => set('minNoticeHours', Number(e.target.value))} /></div>
            </div>
            <h3 className="mb-2 mt-5 text-sm font-extrabold text-slate-900">Weekly hours ({s.timezone})</h3>
            <div className="space-y-2">
              {WEEKDAYS.map(d => {
                const wins = s.weeklyHours[d.key] || [];
                return (
                  <div key={d.key} className="flex flex-col gap-2 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center">
                    <div className="w-28 text-sm font-bold text-slate-800">{d.label}</div>
                    <div className="flex flex-1 flex-wrap items-center gap-2">
                      {wins.length === 0 && <span className="text-sm text-slate-400">Closed</span>}
                      {wins.map((w, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <input aria-label={`${d.label} from`} type="time" value={w[0]} onChange={e => setWin(d.key, i, 0, e.target.value)} className={`${inputCls} !w-auto`} /><span className="text-slate-400">to</span>
                          <input aria-label={`${d.label} to`} type="time" value={w[1]} onChange={e => setWin(d.key, i, 1, e.target.value)} className={`${inputCls} !w-auto`} />
                          <button type="button" aria-label={`Remove ${d.label} hours`} onClick={() => set('weeklyHours', { ...s.weeklyHours, [d.key]: wins.filter((_, j) => j !== i) })} className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="size-4" /></button>
                        </span>
                      ))}
                    </div>
                    <button type="button" onClick={() => set('weeklyHours', { ...s.weeklyHours, [d.key]: [...wins, ['10:00', '17:00']] })} className={btnGhost}><Plus className="size-4" />Add hours</button>
                  </div>
                );
              })}
            </div>
            <h3 className="mb-2 mt-5 text-sm font-extrabold text-slate-900">Days off</h3>
            <div className="flex flex-wrap items-end gap-2">
              <div><label className={lbl} htmlFor="st-off">Block a whole day</label><input id="st-off" type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className={`${inputCls} !w-auto`} /></div>
              <button type="button" disabled={!newDate || s.blockedDates.includes(newDate)} onClick={() => { set('blockedDates', [...s.blockedDates, newDate].sort()); setNewDate(''); }} className={btnGhost}><Plus className="size-4" />Add day off</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {s.blockedDates.length === 0 ? <span className="text-sm text-slate-400">No days off added.</span> : s.blockedDates.map(d => (
                <span key={d} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-700">{d}<button type="button" aria-label={`Remove ${d}`} onClick={() => set('blockedDates', s.blockedDates.filter(x => x !== d))} className="rounded p-0.5 hover:bg-slate-200"><Trash2 className="size-3.5" /></button></span>
              ))}
            </div>
          </Card>
          <div className="sticky bottom-3 flex justify-end"><button type="button" onClick={save} disabled={saving} className={`${btnPrimary} shadow-lg`}>{saving && <Loader2 className="size-4 animate-spin" />}Save settings</button></div>
        </>
      )}
    </div>
  );
};

export default DoctorSettings;
