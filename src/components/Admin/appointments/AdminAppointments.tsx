import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AlertTriangle, CalendarClock, Copy, Loader2, Plus, Trash2, X } from 'lucide-react';
import {
  AdminBooking, BookingSettings, WEEKDAYS, adminCancelBooking, adminGetSettings, adminListBookings, adminSaveSettings,
} from '../../../lib/bookingApi';

const inp = 'w-full border border-ink-light rounded-lg px-3 py-2 text-sm text-ink bg-surface-card focus:outline-none focus:border-brand-yellow';
const lbl = 'text-xs font-bold text-ink-paragraph uppercase tracking-wide block mb-1';
const TIMEZONES = ['Asia/Kolkata', 'Asia/Dubai', 'Asia/Singapore', 'Europe/London', 'America/New_York', 'America/Los_Angeles', 'Australia/Sydney', 'UTC'];

const emailSummary = (b: AdminBooking): string => {
  if (b.emails.length === 0) return '-';
  const count = (s: string) => b.emails.filter(e => e.status === s).length;
  return [count('sent') && `${count('sent')} sent`, count('skipped') && `${count('skipped')} skipped`, count('failed') && `${count('failed')} failed`].filter(Boolean).join(', ');
};

const AdminAppointments: React.FC = () => {
  const [tab, setTab] = useState<'bookings' | 'settings'>('bookings');
  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [newBlocked, setNewBlocked] = useState('');
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ when: 'upcoming', status: 'all', q: '' });
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminGetSettings().then(setSettings).catch(e => setError((e as Error).message));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setBookings((await adminListBookings(filters)).bookings);
      setError('');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      setSettings(await adminSaveSettings(settings));
      toast.success('Booking settings saved');
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const cancel = async (id: string) => {
    try {
      await adminCancelBooking(id, true);
      toast.success('Booking cancelled and the visitor was emailed');
      setConfirmId(null);
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const set = <K extends keyof BookingSettings>(k: K, v: BookingSettings[K]) => setSettings(s => (s ? { ...s, [k]: v } : s));
  const setWindow = (day: string, i: number, pos: 0 | 1, v: string) => {
    if (!settings) return;
    const wins = (settings.weeklyHours[day] || []).map(w => [...w]);
    wins[i][pos] = v;
    set('weeklyHours', { ...settings.weeklyHours, [day]: wins });
  };
  const addWindow = (day: string) => settings && set('weeklyHours', { ...settings.weeklyHours, [day]: [...(settings.weeklyHours[day] || []), ['10:00', '18:00']] });
  const removeWindow = (day: string, i: number) => settings && set('weeklyHours', { ...settings.weeklyHours, [day]: (settings.weeklyHours[day] || []).filter((_, j) => j !== i) });

  const bookingPage = `${window.location.origin}/book-a-call`;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-ink flex items-center gap-2"><CalendarClock className="w-5 h-5" />Appointments</h1>
          <p className="text-sm text-ink-caption">Visitors pick a free slot on <a className="underline" href={bookingPage} target="_blank" rel="noreferrer">{bookingPage}</a></p>
        </div>
        <button type="button" onClick={() => { navigator.clipboard?.writeText(bookingPage); toast.info('Booking link copied'); }} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ink-light text-sm font-semibold"><Copy className="w-4 h-4" />Copy booking link</button>
      </div>

      {settings && !settings.meetLink && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-status-warning bg-status-warning/10 p-4 text-sm text-ink">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <b>The Google Meet link is not set.</b> Bookings still work, but confirmation emails will say the link will follow.
            Paste your Meet link in <button type="button" className="underline font-semibold" onClick={() => setTab('settings')}>Settings</button>.
          </div>
        </div>
      )}

      <div className="flex gap-1 border-b border-ink-light">
        {(['bookings', 'settings'] as const).map(t => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-semibold border-b-[3px] -mb-px ${tab === t ? 'border-brand-yellow text-ink' : 'border-transparent text-ink-caption'}`}>{t === 'bookings' ? 'Bookings' : 'Settings'}</button>
        ))}
      </div>

      {error && <div role="alert" className="text-sm text-status-error">{error}</div>}

      {tab === 'bookings' && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <select aria-label="When" value={filters.when} onChange={e => setFilters({ ...filters, when: e.target.value })} className={`${inp} w-auto`}>
              <option value="upcoming">Upcoming</option><option value="past">Past</option><option value="all">All dates</option>
            </select>
            <select aria-label="Status" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} className={`${inp} w-auto`}>
              <option value="all">All statuses</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option>
            </select>
            <input aria-label="Search" value={filters.q} onChange={e => setFilters({ ...filters, q: e.target.value })} placeholder="Search name, email, phone" className={`${inp} w-64`} />
          </div>
          <div className="bg-surface-card rounded-xl border border-ink-light shadow-sm overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-ink-offwhite border-b border-ink-light">
                <tr>{['When (IST)', 'Visitor', 'Contact', 'Topic', 'Status', 'Emails', ''].map(h => <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wide font-bold text-ink-paragraph">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-ink-light">
                {loading ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-ink-caption"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading...</td></tr>
                ) : bookings.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-ink-caption">No bookings match these filters.</td></tr>
                ) : bookings.map(b => (
                  <tr key={b.id} className="hover:bg-ink-offwhite">
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-ink">{b.whenLabel}</td>
                    <td className="px-4 py-3 text-ink">{b.name}</td>
                    <td className="px-4 py-3 text-ink-paragraph text-xs">{b.email}<br />{b.phone}</td>
                    <td className="px-4 py-3 text-ink-paragraph text-xs max-w-[220px] truncate" title={b.topic}>{b.topic || '-'}</td>
                    <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded ${b.status === 'confirmed' ? 'bg-status-success/15 text-status-success' : 'bg-ink-light text-ink-caption'}`}>{b.status === 'cancelled' ? `Cancelled${b.cancelledBy ? ` (${b.cancelledBy})` : ''}` : 'Confirmed'}</span></td>
                    <td className="px-4 py-3 text-xs text-ink-caption" title={b.emails.map(e => `${e.kind}: ${e.status}${e.error ? ` - ${e.error}` : ''}`).join('\n')}>{emailSummary(b)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {b.status === 'confirmed' && (confirmId === b.id ? (
                        <span className="flex items-center gap-1">
                          <button type="button" onClick={() => cancel(b.id)} className="px-2 py-1 rounded bg-status-error text-white text-xs font-bold">Confirm cancel</button>
                          <button type="button" aria-label="Keep booking" onClick={() => setConfirmId(null)} className="p-1 rounded hover:bg-ink-light"><X className="w-4 h-4" /></button>
                        </span>
                      ) : (
                        <button type="button" onClick={() => setConfirmId(b.id)} className="px-2 py-1 rounded border border-status-error text-status-error text-xs font-semibold hover:bg-status-error/10">Cancel</button>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'settings' && (settings ? (
        <div className="bg-surface-card rounded-xl border border-ink-light shadow-sm p-5 sm:p-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={lbl} htmlFor="ap-meet">Google Meet link</label>
              <input id="ap-meet" className={inp} value={settings.meetLink} onChange={e => set('meetLink', e.target.value)} placeholder="https://meet.google.com/..." />
              <p className="text-xs text-ink-caption mt-1">Shown to visitors and in every confirmation and reminder email. Must start with https://</p>
            </div>
            <div><label className={lbl} htmlFor="ap-host">Host name</label><input id="ap-host" className={inp} value={settings.hostName} onChange={e => set('hostName', e.target.value)} /></div>
            <div><label className={lbl} htmlFor="ap-notify">Send new-booking alerts to</label><input id="ap-notify" type="email" className={inp} value={settings.notifyEmail} onChange={e => set('notifyEmail', e.target.value)} placeholder="team@yourdomain.in" /></div>
            <div><label className={lbl} htmlFor="ap-tz">Time zone</label>
              <select id="ap-tz" className={inp} value={settings.timezone} onChange={e => set('timezone', e.target.value)}>
                {(TIMEZONES.includes(settings.timezone) ? TIMEZONES : [settings.timezone, ...TIMEZONES]).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div><label className={lbl} htmlFor="ap-len">Call length</label>
              <select id="ap-len" className={inp} value={settings.slotMinutes} onChange={e => set('slotMinutes', Number(e.target.value))}>
                {[15, 20, 30, 45, 60, 90].map(n => <option key={n} value={n}>{n} minutes</option>)}
              </select>
            </div>
            <div><label className={lbl} htmlFor="ap-buf">Gap between calls (minutes)</label><input id="ap-buf" type="number" min={0} max={120} className={inp} value={settings.bufferMinutes} onChange={e => set('bufferMinutes', Number(e.target.value))} /></div>
            <div><label className={lbl} htmlFor="ap-win">Bookable days ahead</label><input id="ap-win" type="number" min={1} max={180} className={inp} value={settings.windowDays} onChange={e => set('windowDays', Number(e.target.value))} /></div>
            <div><label className={lbl} htmlFor="ap-notice">Minimum notice (hours)</label><input id="ap-notice" type="number" min={0} max={720} className={inp} value={settings.minNoticeHours} onChange={e => set('minNoticeHours', Number(e.target.value))} /></div>
          </div>

          <div>
            <h3 className="font-bold text-ink mb-2">Weekly hours <span className="text-xs font-normal text-ink-caption">({settings.timezone})</span></h3>
            <div className="space-y-2">
              {WEEKDAYS.map(d => {
                const wins = settings.weeklyHours[d.key] || [];
                return (
                  <div key={d.key} className="flex flex-wrap items-center gap-3">
                    <label className="w-28 flex items-center gap-2 text-sm font-semibold text-ink">
                      <input type="checkbox" className="accent-amber-500" checked={wins.length > 0} onChange={e => (e.target.checked ? addWindow(d.key) : set('weeklyHours', { ...settings.weeklyHours, [d.key]: [] }))} />
                      {d.label}
                    </label>
                    {wins.length === 0 && <span className="text-xs text-ink-caption">Closed</span>}
                    {wins.map((w, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <input aria-label={`${d.label} start`} type="time" className={`${inp} w-32`} value={w[0]} onChange={e => setWindow(d.key, i, 0, e.target.value)} />
                        <span className="text-ink-caption">to</span>
                        <input aria-label={`${d.label} end`} type="time" className={`${inp} w-32`} value={w[1]} onChange={e => setWindow(d.key, i, 1, e.target.value)} />
                        <button type="button" aria-label={`Remove ${d.label} hours`} onClick={() => removeWindow(d.key, i)} className="p-1.5 rounded hover:bg-ink-light"><Trash2 className="w-4 h-4" /></button>
                      </span>
                    ))}
                    {wins.length > 0 && <button type="button" onClick={() => addWindow(d.key)} className="text-xs underline text-ink-link flex items-center gap-1"><Plus className="w-3 h-3" />Add hours</button>}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-ink mb-2">Blocked dates (holidays, leave)</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {settings.blockedDates.length === 0 && <span className="text-xs text-ink-caption">No blocked dates.</span>}
              {settings.blockedDates.map(d => (
                <span key={d} className="flex items-center gap-1 bg-ink-offwhite border border-ink-light rounded-full pl-3 pr-1 py-1 text-xs font-semibold text-ink">
                  {d}<button type="button" aria-label={`Unblock ${d}`} onClick={() => set('blockedDates', settings.blockedDates.filter(x => x !== d))} className="p-0.5 rounded-full hover:bg-ink-light"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input aria-label="Date to block" type="date" className={`${inp} w-48`} value={newBlocked} onChange={e => setNewBlocked(e.target.value)} />
              <button type="button" disabled={!newBlocked} onClick={() => { if (!settings.blockedDates.includes(newBlocked)) set('blockedDates', [...settings.blockedDates, newBlocked].sort()); setNewBlocked(''); }} className="px-3 py-2 rounded-lg bg-ink-light text-sm font-semibold disabled:opacity-50">Block date</button>
            </div>
          </div>

          <div>
            <label className={lbl} htmlFor="ap-site">Website address used in email links (optional)</label>
            <input id="ap-site" className={`${inp} max-w-md`} value={settings.siteUrl} onChange={e => set('siteUrl', e.target.value)} placeholder="https://www.dronetv.in" />
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={save} disabled={saving} className="px-5 py-2.5 rounded-lg bg-brand-yellow text-ink font-bold text-sm disabled:opacity-60 flex items-center gap-2">{saving && <Loader2 className="w-4 h-4 animate-spin" />}Save settings</button>
          </div>
        </div>
      ) : <div className="text-sm text-ink-caption"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading settings...</div>)}
    </div>
  );
};

export default AdminAppointments;
