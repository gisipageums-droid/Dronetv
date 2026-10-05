import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRazorpay, RazorpayOrderOptions } from 'react-razorpay';
import {
  Banknote, BarChart3, Building2, CalendarClock, CalendarDays, Check, CheckCircle, ChevronLeft, ChevronRight, Clock, CreditCard, FileText, Globe,
  GraduationCap, Handshake, Landmark, Lock, Loader2, Lightbulb, Map as MapIcon, MessageCircle, Plane, Rocket, Settings, ShieldCheck, Smartphone,
  Users, Video, Wallet, Mail, Phone, ChevronRight as Arrow,
} from 'lucide-react';
import CompactHero from './common/CompactHero';
import { BookingApiError, Availability, Slot, ymd } from '../lib/bookingApi';
import {
  DoctorBookingInfo, DoctorConfig, DoctorTopic, confirmDoctorBooking, createDoctorBooking, fetchDoctorAvailability, fetchDoctorBooking, fetchDoctorConfig,
} from '../lib/doctorApi';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const STEPS = ['Fill Details', 'Select Slot', 'Make Payment', 'Confirmation'];
const PENDING_KEY = 'dd_pending_booking';

const TOPIC_ICONS: Record<string, { icon: React.ElementType; bg: string }> = {
  'business-startup': { icon: Rocket, bg: 'bg-red-500' },
  'technology-product': { icon: Settings, bg: 'bg-blue-600' },
  'operations-planning': { icon: Plane, bg: 'bg-green-600' },
  'survey-mapping-gis': { icon: MapIcon, bg: 'bg-orange-500' },
  'inspection-industrial': { icon: Building2, bg: 'bg-purple-600' },
  'training-career': { icon: GraduationCap, bg: 'bg-pink-600' },
  'regulations-compliance': { icon: FileText, bg: 'bg-sky-600' },
  'sales-marketing': { icon: BarChart3, bg: 'bg-emerald-600' },
  'funding-partnerships': { icon: Handshake, bg: 'bg-violet-600' },
  other: { icon: MessageCircle, bg: 'bg-slate-600' },
};

const METHODS = [
  { id: 'upi', label: 'UPI', sub: 'PhonePe, Google Pay, Paytm, etc.', icon: Smartphone },
  { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay', icon: CreditCard },
  { id: 'netbanking', label: 'Net Banking', sub: 'All major banks', icon: Landmark },
  { id: 'wallet', label: 'Wallet', sub: 'PhonePe, Paytm, Amazon Pay, etc.', icon: Wallet },
] as const;

const visitorTz = (): string => {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { return ''; }
};
const localTime = (iso: string): string => new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
const sameClock = (s: Slot): boolean => localTime(s.start).replace(/\s/g, '').toLowerCase() === s.label.replace(/\s/g, '').toLowerCase();

const inp = 'w-full px-4 py-2.5 rounded-lg border border-ink-light bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm text-ink';
const lbl = 'block text-xs font-bold text-ink mb-1';

const DroneDoctorConsultPage: React.FC = () => {
  const { Razorpay } = useRazorpay();
  const tz = useMemo(visitorTz, []);
  const today = useMemo(() => new Date(), []);
  const [config, setConfig] = useState<DoctorConfig | null>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', city: '', topic: '', message: '', confirmed: false, website: '' });
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [avail, setAvail] = useState<Availability | null>(null);
  const [days, setDays] = useState<Record<string, Slot[]>>({});
  const [loadingDays, setLoadingDays] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [slot, setSlot] = useState<Slot | null>(null);
  const [booking, setBooking] = useState<DoctorBookingInfo | null>(null);
  const [method, setMethod] = useState<(typeof METHODS)[number]['id']>('upi');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const paidRef = useRef(false);

  const topic: DoctorTopic | undefined = config?.topics.find(t => t.id === form.topic);
  const fee = config?.feeLabel || '₹500';

  useEffect(() => {
    fetchDoctorConfig().then(setConfig).catch(() => setLoadError('Could not load the consultation options. Please refresh the page.'));
  }, []);

  useEffect(() => {
    let raw: string | null = null;
    try { raw = sessionStorage.getItem(PENDING_KEY); } catch { raw = null; }
    if (!raw) return;
    try {
      const { id, token } = JSON.parse(raw) as { id: string; token: string };
      fetchDoctorBooking(id, token).then(b => {
        if (b.status === 'pending_payment' && b.holdUntil && new Date(b.holdUntil).getTime() > Date.now()) {
          setBooking({ ...b, token });
          setForm(f => ({ ...f, topic: b.topic, name: b.name, company: b.company, city: b.city, message: b.message, confirmed: true }));
          setStep(3);
        } else {
          try { sessionStorage.removeItem(PENDING_KEY); } catch { /* ignore */ }
        }
      }).catch(() => { try { sessionStorage.removeItem(PENDING_KEY); } catch { /* ignore */ } });
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (step !== 3) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [step]);

  const loadMonth = useCallback(async (m: Date) => {
    setLoadingDays(true);
    setLoadError('');
    try {
      const data = await fetchDoctorAvailability(ymd(new Date(m.getFullYear(), m.getMonth(), 1)), ymd(new Date(m.getFullYear(), m.getMonth() + 1, 0)));
      setAvail(data);
      setDays(prev => {
        const next = { ...prev };
        data.days.forEach(d => { next[d.date] = d.slots; });
        return next;
      });
    } catch (e) {
      setLoadError(e instanceof BookingApiError ? e.message : 'Could not load available times.');
    } finally {
      setLoadingDays(false);
    }
  }, []);

  useEffect(() => { if (step === 2) loadMonth(month); }, [step, month, loadMonth]);

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

  const goDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goPayment = async () => {
    if (!slot) return;
    setBusy(true);
    setError('');
    try {
      const b = await createDoctorBooking({ ...form, start: slot.start, tz });
      if (!b) { setError('We could not hold your slot. Please try again.'); return; }
      setBooking(b);
      try { sessionStorage.setItem(PENDING_KEY, JSON.stringify({ id: b.id, token: b.token })); } catch { /* ignore */ }
      paidRef.current = false;
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const message = err instanceof BookingApiError ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      if (err instanceof BookingApiError && err.status === 409) {
        setNotice(message);
        setSlot(null);
        await loadMonth(month);
      }
    } finally {
      setBusy(false);
    }
  };

  const holdLeft = booking?.holdUntil ? Math.max(0, Math.floor((new Date(booking.holdUntil).getTime() - now) / 1000)) : 0;
  const expired = step === 3 && !!booking && holdLeft === 0 && !paidRef.current;

  const finish = async (b: DoctorBookingInfo) => {
    setBusy(true);
    setError('');
    try {
      const done = await confirmDoctorBooking(b.id, b.token || '');
      paidRef.current = true;
      setBooking({ ...done, token: b.token });
      try { sessionStorage.removeItem(PENDING_KEY); } catch { /* ignore */ }
      setStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof BookingApiError ? err.message : 'We could not confirm your payment yet. If money was deducted, it will be confirmed shortly or refunded.');
    } finally {
      setBusy(false);
    }
  };

  const pay = () => {
    if (!booking?.payment || expired) return;
    setError('');
    const only = Object.fromEntries(METHODS.map(m => [m.id, m.id === method]));
    const options = {
      key: booking.payment.key,
      amount: booking.payment.amountPaise,
      currency: booking.payment.currency,
      name: 'DroneTv.in',
      description: `Drone Doctor Consultation - ${booking.topicLabel}`,
      order_id: booking.payment.orderId,
      handler: () => { void finish(booking); },
      prefill: { name: booking.name, email: form.email, contact: form.phone },
      notes: { bookingId: booking.ref },
      method: only,
      theme: { color: '#F8C400' },
      modal: { ondismiss: () => setBusy(false) },
    } as unknown as RazorpayOrderOptions;
    const rp = new Razorpay(options);
    rp.on('payment.failed', (r: { error?: { description?: string } }) => setError(r?.error?.description || 'Payment failed. Please try again.'));
    rp.open();
  };

  const mmss = `${String(Math.floor(holdLeft / 60)).padStart(2, '0')}:${String(holdLeft % 60).padStart(2, '0')}`;

  const stepper = (
    <ol className="flex items-center gap-1 sm:gap-2 mb-5 overflow-x-auto" aria-label="Progress">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const doneStep = step > n;
        const current = step === n;
        return (
          <React.Fragment key={label}>
            <li className="flex items-center gap-2 shrink-0" aria-current={current ? 'step' : undefined}>
              <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${doneStep ? 'bg-green-500 text-white' : current ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {doneStep ? <Check className="w-4 h-4" /> : n}
              </span>
              <span className={`text-xs sm:text-sm font-semibold ${current ? 'text-ink' : 'text-ink-caption'}`}>{label}</span>
            </li>
            {n < STEPS.length && <Arrow className="w-4 h-4 text-ink-caption shrink-0" aria-hidden="true" />}
          </React.Fragment>
        );
      })}
    </ol>
  );

  const summaryRows = (b: DoctorBookingInfo | null) => {
    const label = b?.topicLabel || topic?.label || '-';
    const rows: [string, React.ReactNode][] = [
      ['Consultation Type', label],
      ['Consultant', <>Dr. Pranay Kumar<br /><span className="font-normal text-ink-caption">(Drone Doctor)</span></>],
      ['Date', b ? b.dateLabel : slot ? new Date(slot.start).toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' }) : '-'],
      ['Time', b ? b.timeRangeLabel : slot ? `${slot.label} IST` : '-'],
      ['Duration', `${b?.durationMinutes || avail?.slotMinutes || 30} Minutes`],
      ['Mode', 'Online (Google Meet)'],
      ['Consultation Fee', <>{fee} <span className="font-normal text-ink-caption">(Inclusive of Taxes)</span></>],
    ];
    if (b) rows.push(['Booking ID', b.ref]);
    return (
      <dl className="text-sm divide-y divide-amber-100">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-5 gap-2 py-2"><dt className="col-span-2 text-ink-paragraph">{k}</dt><dd className="col-span-3 font-semibold text-ink break-words">{v}</dd></div>
        ))}
      </dl>
    );
  };

  return (
    <div className="pt-[104px] min-h-screen bg-surface-main">
      <CompactHero title={<>Drone <span>Doctor</span></>} stats={[{ n: fee, l: 'Per consultation' }, { n: `${avail?.slotMinutes || 30} min`, l: 'Google Meet' }]} />

      <section className="bg-gradient-to-r from-brand-yellow via-amber-200 to-sky-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-black leading-none text-[#0b1f4d]">Drone<br /><span className="text-red-600">Doctor</span></h1>
            <p className="mt-3 text-[#0b1f4d] text-lg max-w-md">Get expert guidance for your drone questions, challenges and business requirements.</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-[#0b1f4d]">
              <span className="px-3 py-1.5 rounded-full bg-white/80 flex items-center gap-1.5"><Users className="w-4 h-4" />One-on-One Expert Consultation</span>
              <span className="px-3 py-1.5 rounded-full bg-white/80 flex items-center gap-1.5"><Lightbulb className="w-4 h-4" />Practical Solutions</span>
              <span className="px-3 py-1.5 rounded-full bg-white/80 flex items-center gap-1.5"><Video className="w-4 h-4" />Online Consultation</span>
            </div>
          </div>
          <figure className="text-center">
            <img src="/images/drone-doctor/dr-pranay-kumar.jpg" alt="Dr. Pranay Kumar, Drone Doctor" width={200} height={200} className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover border-4 border-white shadow-lg mx-auto" />
            <figcaption className="mt-2 inline-block bg-[#0b1f4d] text-white rounded-lg px-4 py-2 text-sm"><b>Dr. Pranay Kumar</b><br /><span className="text-xs">Expert Consultant on Drones, GIS, AI and Related Technologies</span></figcaption>
          </figure>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {step !== 3 && step !== 4 && (
          <aside className="lg:col-span-5" aria-label="Areas the Drone Doctor can help with">
            <div className="bg-[#0b1f4d] text-white font-bold text-lg px-5 py-3 rounded-t-xl">Areas I Can Help You With</div>
            <ul className="bg-white border border-ink-light border-t-0 rounded-b-xl divide-y divide-ink-light/60">
              {(config?.topics || []).map(t => {
                const meta = TOPIC_ICONS[t.id] || TOPIC_ICONS.other;
                const Icon = meta.icon;
                return (
                  <li key={t.id}>
                    <button type="button" onClick={() => setForm(f => ({ ...f, topic: t.id }))} aria-pressed={form.topic === t.id}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 ${form.topic === t.id ? 'bg-amber-50' : 'hover:bg-slate-50'}`}>
                      <span className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0 ${meta.bg}`}><Icon className="w-5 h-5" /></span>
                      <span><span className="block text-sm font-bold text-ink">{t.label}</span><span className="block text-xs text-ink-caption">{t.description}</span></span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        )}

        <section className={step === 3 || step === 4 ? 'lg:col-span-12' : 'lg:col-span-7'}>
          <div className="bg-white rounded-xl border border-ink-light shadow-sm p-5 sm:p-6">
            {stepper}

            {step === 1 && (
              <form onSubmit={goDetails} className="space-y-4">
                <div>
                  <h2 className="text-xl font-extrabold text-ink flex items-center gap-2"><CalendarDays className="w-6 h-6" />Book Your Drone Doctor Consultation</h2>
                  <p className="text-sm text-ink-paragraph">Tell us your details and what you would like to discuss.</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label htmlFor="dd-name" className={lbl}>Full Name *</label><input id="dd-name" required minLength={2} maxLength={100} className={inp} placeholder="Enter your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                  <div><label htmlFor="dd-company" className={lbl}>Company / Organization</label><input id="dd-company" maxLength={150} className={inp} placeholder="Enter company name" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></div>
                  <div><label htmlFor="dd-email" className={lbl}>Email Address *</label><input id="dd-email" type="email" required className={inp} placeholder="Enter your email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                  <div><label htmlFor="dd-phone" className={lbl}>Mobile / WhatsApp Number *</label><input id="dd-phone" type="tel" required minLength={7} maxLength={25} className={inp} placeholder="Enter your mobile number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                </div>
                <div><label htmlFor="dd-city" className={lbl}>City / Country</label><input id="dd-city" maxLength={120} className={inp} placeholder="Enter your city / country" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
                <div>
                  <label htmlFor="dd-topic" className={lbl}>Select Consultation Topic *</label>
                  <select id="dd-topic" required className={inp} value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })}>
                    <option value="" disabled>Choose an option</option>
                    {(config?.topics || []).map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
                <div><label htmlFor="dd-message" className={lbl}>Briefly describe your question / requirement *</label><textarea id="dd-message" required minLength={3} maxLength={1500} rows={3} className={inp} placeholder="Please share your question, requirements or any specific details..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></div>
                <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', height: 0, overflow: 'hidden' }}>
                  <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} /></label>
                </div>
                <label className="flex items-start gap-2 text-sm text-ink"><input type="checkbox" required className="mt-1" checked={form.confirmed} onChange={e => setForm({ ...form, confirmed: e.target.checked })} />I confirm that the information provided above is correct. *</label>
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm flex items-start gap-3">
                  <Banknote className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div><b>Consultation Fee: {fee}</b><br /><span className="text-ink-paragraph text-xs">Payable after selecting your appointment slot. Your appointment is confirmed only after successful payment.</span></div>
                </div>
                {loadError && <div role="alert" className="text-sm text-status-error">{loadError}</div>}
                <button type="submit" disabled={!config} className="w-full px-5 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-sm disabled:opacity-60">Continue to Select Appointment Slot &rarr;</button>
              </form>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-extrabold text-ink flex items-center gap-2"><CalendarClock className="w-6 h-6" />Select Your Appointment Slot</h2>
                  <p className="text-sm text-ink-paragraph">Topic: <b>{topic?.label}</b>{tz && <> &middot; Times are shown in <b>{tz}</b>; IST is shown alongside.</>}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <button type="button" aria-label="Previous month" disabled={!canPrev} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="p-2 rounded-lg hover:bg-ink-offwhite disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
                      <h3 className="font-bold text-ink">{MONTHS[month.getMonth()]} {month.getFullYear()}</h3>
                      <button type="button" aria-label="Next month" disabled={!canNext} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="p-2 rounded-lg hover:bg-ink-offwhite disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink-caption mb-1">{WEEK.map(w => <div key={w} className="py-1">{w}</div>)}</div>
                    {loadError ? (
                      <div className="py-8 text-center text-sm text-status-error">{loadError} <button type="button" className="underline" onClick={() => loadMonth(month)}>Retry</button></div>
                    ) : (
                      <div className={`grid grid-cols-7 gap-1 ${loadingDays ? 'opacity-60' : ''}`}>
                        {cells.map((c, i) => {
                          if (!c) return <div key={i} />;
                          const n = (days[c] || []).length;
                          return (
                            <button key={c} type="button" disabled={n === 0} aria-label={`${c}, ${n} times available`}
                              onClick={() => { setSelectedDate(c); setSlot(null); setError(''); setNotice(''); }}
                              className={`aspect-square rounded-xl text-sm font-semibold ${c === selectedDate ? 'bg-brand-yellow text-ink ring-2 ring-ink' : n > 0 ? 'bg-ink-offwhite text-ink hover:bg-brand-yellow/40' : 'text-ink-caption/50 cursor-not-allowed'}`}>
                              {Number(c.slice(8))}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {loadingDays && <div className="mt-3 flex items-center gap-2 text-xs text-ink-caption"><Loader2 className="w-3.5 h-3.5 animate-spin" />Loading times...</div>}
                  </div>
                  <div>
                    {notice && <div role="alert" className="mb-3 rounded-xl border border-status-warning bg-status-warning/10 p-3 text-sm text-ink">{notice}</div>}
                    {!selectedDate ? <p className="text-sm text-ink-caption">Choose a highlighted day to see the available times.</p> : (
                      <>
                        <h3 className="font-bold text-ink mb-3">{new Date(selectedDate + 'T00:00:00').toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
                        <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                          {daySlots.map(sl => (
                            <button key={sl.start} type="button" aria-pressed={slot?.start === sl.start} onClick={() => { setSlot(sl); setError(''); setNotice(''); }}
                              className={`px-3 py-2.5 rounded-xl border text-sm font-semibold text-ink text-left ${slot?.start === sl.start ? 'border-brand-yellow bg-brand-yellow/30 ring-1 ring-brand-yellow' : 'border-ink-light hover:border-brand-yellow'}`}>
                              {localTime(sl.start)}{!sameClock(sl) && <span className="block text-[11px] font-normal text-ink-caption">{sl.label} IST</span>}
                            </button>
                          ))}
                          {daySlots.length === 0 && <p className="col-span-2 text-sm text-ink-caption">No times left on this day.</p>}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {error && <div role="alert" className="text-sm text-status-error">{error}</div>}
                <div className="flex gap-3">
                  <button type="button" onClick={() => { setStep(1); setError(''); }} className="px-5 py-3 rounded-lg border border-ink-light text-ink font-semibold text-sm hover:bg-ink-offwhite">Back</button>
                  <button type="button" disabled={!slot || busy} onClick={goPayment} className="flex-1 px-5 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                    {busy && <Loader2 className="w-4 h-4 animate-spin" />}{slot ? `Proceed to Payment (${fee}) →` : 'Select a date and time'}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && booking && (
              <div className="grid lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 space-y-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-ink flex items-center gap-2"><Lock className="w-6 h-6" />Secure Payment for Drone Doctor Consultation</h2>
                    <p className="text-sm text-ink-paragraph">Complete your payment of {fee} to confirm your appointment with Dr. Pranay Kumar.</p>
                  </div>
                  <div className={`rounded-lg p-3 text-sm font-semibold ${expired ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-800'}`} role="status">
                    {expired ? 'Your slot hold has expired. Please pick a slot again.' : `Your slot is held for ${mmss}. Complete the payment before it expires.`}
                  </div>
                  <fieldset className="rounded-xl border border-ink-light">
                    <legend className="px-2 ml-3 text-sm font-bold text-ink">Select Payment Method <span className="font-normal text-ink-caption">&middot; Secured by Razorpay</span></legend>
                    <div className="grid sm:grid-cols-2 gap-2 p-3">
                      {METHODS.map(m => {
                        const Icon = m.icon;
                        return (
                          <label key={m.id} className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer ${method === m.id ? 'border-blue-600 bg-blue-50' : 'border-ink-light'}`}>
                            <input type="radio" name="dd-method" className="sr-only" checked={method === m.id} onChange={() => setMethod(m.id)} />
                            <Icon className="w-6 h-6 text-blue-700 shrink-0" />
                            <span><span className="block text-sm font-bold text-ink">{m.label}</span><span className="block text-xs text-ink-caption">{m.sub}</span></span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                  {error && <div role="alert" className="text-sm text-status-error">{error}</div>}
                  <div className="flex gap-3">
                    <button type="button" onClick={() => { setStep(2); setBooking(null); setSlot(null); setError(''); try { sessionStorage.removeItem(PENDING_KEY); } catch { /* ignore */ } }} className="px-5 py-3 rounded-lg border border-ink-light text-ink font-semibold text-sm hover:bg-ink-offwhite">Change slot</button>
                    <button type="button" onClick={pay} disabled={busy || expired} className="flex-1 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}Pay {fee} Securely
                    </button>
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-4">
                  <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4"><h3 className="font-extrabold text-ink mb-1 flex items-center gap-2"><CalendarDays className="w-5 h-5" />Consultation Summary</h3>{summaryRows(booking)}</div>
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                    <h3 className="font-extrabold text-ink mb-2 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-600" />Why Book with Drone Doctor?</h3>
                    <ul className="space-y-1.5 text-sm text-ink">
                      {['Get expert guidance from Dr. Pranay Kumar', 'Discuss your specific drone-related challenges', 'Practical and actionable solutions', 'One-on-one online consultation', 'Secure and trusted payment via Razorpay'].map(x => <li key={x} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />{x}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && booking && (
              <div className="grid lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                  <div className="text-center lg:text-left">
                    <CheckCircle className="w-14 h-14 text-green-500 mx-auto lg:mx-0 mb-2" />
                    <h2 className="text-3xl font-black text-ink">Appointment <span className="text-red-600">Confirmed!</span></h2>
                    <p className="text-ink-paragraph mt-2">Hello {booking.name}, thank you for booking a consultation with <b>Drone Doctor</b> on <b>DroneTV</b>. Your appointment with Dr. Pranay Kumar has been successfully confirmed. A confirmation email with the meeting details is on its way.</p>
                  </div>
                  <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                    <h3 className="font-extrabold text-ink mb-1">Your Appointment Details</h3>
                    {summaryRows(booking)}
                    <div className="grid grid-cols-5 gap-2 py-2 text-sm border-t border-amber-100"><div className="col-span-2 text-ink-paragraph">Google Meet Link</div><div className="col-span-3 font-semibold break-words">{booking.meetLink ? <a href={booking.meetLink} target="_blank" rel="noreferrer" className="text-ink-link underline">{booking.meetLink}</a> : 'The link will be emailed to you before the call.'}</div></div>
                    <div className="grid grid-cols-5 gap-2 py-2 text-sm border-t border-amber-100"><div className="col-span-2 text-ink-paragraph">Payment</div><div className="col-span-3 font-semibold text-green-700">{booking.feeLabel} (Paid)</div></div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a href={booking.googleCalendarUrl} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-lg bg-brand-yellow text-ink font-bold text-sm">Add to Google Calendar</a>
                    {booking.manageUrl && <Link to={new URL(booking.manageUrl).pathname + new URL(booking.manageUrl).search} className="px-5 py-2.5 rounded-lg border border-ink-light text-ink font-semibold text-sm hover:bg-ink-offwhite">View booking</Link>}
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-4">
                  <div className="rounded-xl bg-amber-50 p-4"><h3 className="font-extrabold text-ink mb-2">What to Expect in This Session?</h3><ul className="space-y-1.5 text-sm text-ink">{['Discussion on your specific requirements', 'Expert advice from Dr. Pranay Kumar', 'Practical and actionable solutions', 'Guidance on next steps', 'One-on-one online consultation'].map(x => <li key={x} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />{x}</li>)}</ul></div>
                  <div className="rounded-xl bg-blue-50 p-4"><h3 className="font-extrabold text-ink mb-2">Important Notes</h3><ul className="list-disc pl-5 space-y-1 text-sm text-ink"><li>Please join <b>5 minutes before</b> the scheduled time.</li><li>This is a {booking.durationMinutes}-minute online consultation.</li><li>If you need to reschedule, please inform us at least 4 hours in advance.</li><li>For any issues joining the meeting, contact our support team.</li></ul></div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12" aria-label="How it works">
        <div className="bg-white rounded-xl border border-ink-light p-5">
          <h2 className="font-extrabold text-ink mb-3 flex items-center gap-2"><Settings className="w-5 h-5" />How It Works</h2>
          <ol className="grid sm:grid-cols-4 gap-4 text-sm">
            {[['Fill in Your Details', 'Select the topic and share your requirements.'], ['Select Appointment Slot', 'Choose a convenient date and time.'], [`Make Payment (${fee})`, 'Secure payment via Razorpay.'], ['Get Confirmation', 'Receive email with your meeting details.']].map(([t, d], i) => (
              <li key={t} className="flex items-start gap-3"><span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span><span><b className="block text-ink">{t}</b><span className="text-ink-caption text-xs">{d}</span></span></li>
            ))}
          </ol>
          <div className="mt-4 pt-3 border-t border-ink-light flex flex-wrap gap-x-6 gap-y-1 text-xs text-ink-paragraph">
            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" />www.dronetv.in</span>
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />support@dronetv.in</span>
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />+91 75201 23555</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Reschedule at least 4 hours in advance</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DroneDoctorConsultPage;
