import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, CheckCircle, ChevronLeft, ChevronRight, Clock, Loader2, Video } from 'lucide-react';
import CompactHero from './common/CompactHero';
import {
  Availability, BookingApiError, BookingInfo, Slot, createBooking, fetchAvailability, ymd,
} from '../lib/bookingApi';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const visitorTz = (): string => {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { return ''; }
};

const localTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

// True when the visitor's local clock time already equals the host's IST time (no need to show both).
const sameClock = (s: Slot): boolean => localTime(s.start).replace(/\s/g, '').toLowerCase() === s.label.replace(/\s/g, '').toLowerCase();

const inp = 'w-full px-4 py-3 rounded-xl border border-ink-light bg-ink-offwhite focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow text-sm text-ink';
const lbl = 'block text-sm font-semibold text-ink-paragraph mb-1.5';

const BookCallPage: React.FC = () => {
  const today = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [avail, setAvail] = useState<Availability | null>(null);
  const [days, setDays] = useState<Record<string, Slot[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [slot, setSlot] = useState<Slot | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', topic: '', website: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [done, setDone] = useState<BookingInfo | null>(null);
  const tz = useMemo(visitorTz, []);

  const loadMonth = useCallback(async (m: Date) => {
    setLoading(true);
    setLoadError('');
    try {
      const first = new Date(m.getFullYear(), m.getMonth(), 1);
      const last = new Date(m.getFullYear(), m.getMonth() + 1, 0);
      const data = await fetchAvailability(ymd(first), ymd(last));
      setAvail(data);
      setDays(prev => {
        const next = { ...prev };
        data.days.forEach(d => { next[d.date] = d.slots; });
        return next;
      });
    } catch (e) {
      setLoadError(e instanceof BookingApiError ? e.message : 'Could not load available times.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMonth(month); }, [month, loadMonth]);

  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const out: (string | null)[] = Array(first.getDay()).fill(null);
    for (let d = 1; d <= count; d++) out.push(ymd(new Date(month.getFullYear(), month.getMonth(), d)));
    return out;
  }, [month]);

  const minMonth = avail ? new Date(avail.minDate + 'T00:00:00') : today;
  const maxMonth = avail ? new Date(avail.maxDate + 'T00:00:00') : today;
  const canPrev = month > new Date(minMonth.getFullYear(), minMonth.getMonth(), 1);
  const canNext = month < new Date(maxMonth.getFullYear(), maxMonth.getMonth(), 1);
  const daySlots = selectedDate ? days[selectedDate] || [] : [];

  const refreshAfterConflict = async () => {
    setSlot(null);
    await loadMonth(month);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slot) return;
    setSubmitting(true);
    setFormError('');
    try {
      const booking = await createBooking({ ...form, start: slot.start, tz });
      if (booking) setDone(booking);
      else setFormError('We could not complete your booking. Please try again.');
    } catch (err) {
      const message = err instanceof BookingApiError ? err.message : 'Something went wrong. Please try again.';
      setFormError(message);
      if (err instanceof BookingApiError && err.status === 409) {
        setNotice(message);
        await refreshAfterConflict();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    const manage = done.manageUrl ? new URL(done.manageUrl).pathname + new URL(done.manageUrl).search : '';
    return (
      <div className="pt-[104px] min-h-screen bg-surface-main">
        <CompactHero title={<>Call <span>Booked</span></>} />
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 pb-16">
          <div className="bg-surface-card rounded-xl border border-ink-light shadow-sm p-8 text-center">
            <CheckCircle className="w-14 h-14 text-status-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-ink mb-1">You're booked, {done.name.split(' ')[0]}!</h2>
            <p className="text-ink-paragraph mb-5">We've emailed your confirmation.</p>
            <div className="rounded-xl bg-ink-offwhite border border-ink-light p-4 text-left space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-ink"><CalendarDays className="w-4 h-4" /><b>{done.whenLabel} IST</b></div>
              <div className="flex items-center gap-2 text-sm text-ink-paragraph"><Clock className="w-4 h-4" />Your time: {new Date(done.start).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}{tz ? ` (${tz})` : ''}</div>
              <div className="flex items-center gap-2 text-sm text-ink-paragraph">
                <Video className="w-4 h-4" />
                {done.meetLink ? <a href={done.meetLink} className="text-ink-link underline break-all" target="_blank" rel="noreferrer">{done.meetLink}</a> : 'The meeting link will be emailed to you before the call.'}
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={done.googleCalendarUrl} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-xl bg-brand-yellow text-ink font-bold text-sm">Add to Google Calendar</a>
              {manage && <Link to={manage} className="px-5 py-2.5 rounded-xl border border-ink-light text-ink font-semibold text-sm hover:bg-ink-offwhite">View or cancel booking</Link>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[104px] min-h-screen bg-surface-main">
      <CompactHero
        title={<>Book a <span>Call</span></>}
        stats={avail ? [{ n: `${avail.slotMinutes} min`, l: 'Video call' }, { n: 'Free', l: 'No charge' }] : undefined}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 pb-16">
        <p className="text-ink-paragraph mb-6 text-sm sm:text-base">
          Pick a day and time that suits you. You'll get a confirmation email with the meeting link.
          {tz && <> Times are shown in your time zone (<b>{tz}</b>); IST is shown alongside.</>}
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-surface-card rounded-xl border border-ink-light shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <button type="button" aria-label="Previous month" disabled={!canPrev} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="p-2 rounded-lg hover:bg-ink-offwhite disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
              <h2 className="text-lg font-bold text-ink">{MONTHS[month.getMonth()]} {month.getFullYear()}</h2>
              <button type="button" aria-label="Next month" disabled={!canNext} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="p-2 rounded-lg hover:bg-ink-offwhite disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink-caption mb-1">
              {WEEK.map(w => <div key={w} className="py-1">{w}</div>)}
            </div>
            {loadError ? (
              <div className="py-10 text-center text-sm text-status-error">{loadError} <button type="button" className="underline" onClick={() => loadMonth(month)}>Retry</button></div>
            ) : (
              <div className={`grid grid-cols-7 gap-1 ${loading ? 'opacity-60' : ''}`}>
                {cells.map((c, i) => {
                  if (!c) return <div key={i} />;
                  const n = (days[c] || []).length;
                  const selected = c === selectedDate;
                  return (
                    <button
                      key={c} type="button" disabled={n === 0}
                      onClick={() => { setSelectedDate(c); setSlot(null); setFormError(''); setNotice(''); }}
                      aria-label={`${c}, ${n} times available`}
                      className={`aspect-square rounded-xl text-sm font-semibold transition-colors ${selected ? 'bg-brand-yellow text-ink ring-2 ring-ink' : n > 0 ? 'bg-ink-offwhite text-ink hover:bg-brand-yellow/40' : 'text-ink-caption/50 cursor-not-allowed'}`}
                    >
                      {Number(c.slice(8))}
                    </button>
                  );
                })}
              </div>
            )}
            {loading && <div className="mt-3 flex items-center gap-2 text-xs text-ink-caption"><Loader2 className="w-3.5 h-3.5 animate-spin" />Loading times...</div>}
            {!loading && !loadError && Object.values(days).every(s => s.length === 0) && (
              <p className="mt-4 text-sm text-ink-caption">No times are open in this month. Try the next month.</p>
            )}
          </div>

          <div className="lg:col-span-2 bg-surface-card rounded-xl border border-ink-light shadow-sm p-5 sm:p-6">
            {!selectedDate ? (
              <p className="text-sm text-ink-caption">Choose a highlighted day to see the available times.</p>
            ) : !slot ? (
              <>
                {notice && <div role="alert" className="mb-3 rounded-xl border border-status-warning bg-status-warning/10 p-3 text-sm text-ink">{notice}</div>}
                <h3 className="font-bold text-ink mb-3">{new Date(selectedDate + 'T00:00:00').toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
                <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                  {daySlots.map(s => (
                    <button key={s.start} type="button" onClick={() => { setSlot(s); setFormError(''); setNotice(''); }} className="px-3 py-2.5 rounded-xl border border-ink-light text-sm font-semibold text-ink hover:border-brand-yellow hover:bg-brand-yellow/20 text-left">
                      {localTime(s.start)}
                      {!sameClock(s) && <span className="block text-[11px] font-normal text-ink-caption">{s.label} IST</span>}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="rounded-xl bg-ink-offwhite border border-ink-light p-3 text-sm">
                  <div className="font-bold text-ink">{new Date(slot.start).toLocaleString([], { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</div>
                  <div className="text-ink-caption text-xs">{sameClock(slot) ? 'IST' : `${slot.label} IST`} · {avail?.slotMinutes} min</div>
                  <button type="button" className="text-xs underline text-ink-link mt-1" onClick={() => setSlot(null)}>Change time</button>
                </div>
                <div><label htmlFor="bk-name" className={lbl}>Full name *</label><input id="bk-name" className={inp} required minLength={2} maxLength={100} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div><label htmlFor="bk-email" className={lbl}>Email *</label><input id="bk-email" type="email" className={inp} required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                <div><label htmlFor="bk-phone" className={lbl}>Phone *</label><input id="bk-phone" type="tel" className={inp} required minLength={7} maxLength={25} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                <div><label htmlFor="bk-topic" className={lbl}>What would you like to discuss?</label><textarea id="bk-topic" rows={3} maxLength={1000} className={inp} value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} /></div>
                <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', height: 0, overflow: 'hidden' }}>
                  <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} /></label>
                </div>
                {formError && <div role="alert" className="text-sm text-status-error">{formError}</div>}
                <button type="submit" disabled={submitting} className="w-full px-5 py-3 rounded-xl bg-brand-yellow text-ink font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}Confirm booking
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCallPage;
