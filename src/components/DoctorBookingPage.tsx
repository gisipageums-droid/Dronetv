import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CalendarDays, Clock, Loader2, Video } from 'lucide-react';
import CompactHero from './common/CompactHero';
import { DoctorBookingInfo, doctorIcsUrl, fetchDoctorBooking } from '../lib/doctorApi';

const DoctorBookingPage: React.FC = () => {
  const [params] = useSearchParams();
  const id = params.get('id') || '';
  const token = params.get('token') || '';
  const [b, setB] = useState<DoctorBookingInfo | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !token) { setError('This link is incomplete.'); setLoading(false); return; }
    fetchDoctorBooking(id, token).then(setB).catch(e => setError((e as Error).message)).finally(() => setLoading(false));
  }, [id, token]);

  const past = b ? new Date(b.end).getTime() < Date.now() : false;
  const label = b?.status === 'confirmed' ? (past ? 'Completed' : 'Confirmed') : b?.status === 'cancelled' ? 'Cancelled' : b?.status === 'payment_review' ? 'Payment under review' : 'Awaiting payment';
  const good = b?.status === 'confirmed';

  return (
    <div className="pt-[104px] min-h-screen bg-surface-main">
      <CompactHero title={<>Your Drone Doctor <span>Booking</span></>} />
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 pb-16">
        <div className="bg-surface-card rounded-xl border border-ink-light shadow-sm p-6 sm:p-8">
          {loading ? <div className="flex items-center gap-2 text-ink-caption"><Loader2 className="w-4 h-4 animate-spin" />Loading your booking...</div>
            : !b ? <div role="alert" className="text-status-error text-sm">{error}</div> : (
              <>
                <div className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3 ${good ? 'bg-status-success/15 text-status-success' : 'bg-status-warning/20 text-ink'}`}>{label}</div>
                <h2 className="text-xl font-bold text-ink">{b.topicLabel}</h2>
                <p className="text-xs text-ink-caption mb-4">{b.ref} &middot; Consultation with {b.consultant}</p>
                <div className="space-y-2 mb-5 text-sm">
                  <div className="flex items-center gap-2 text-ink"><CalendarDays className="w-4 h-4" /><b>{b.dateLabel}</b></div>
                  <div className="flex items-center gap-2 text-ink-paragraph"><Clock className="w-4 h-4" />{b.timeRangeLabel} &middot; {b.durationMinutes} minutes</div>
                  {good && <div className="flex items-center gap-2 text-ink-paragraph"><Video className="w-4 h-4" />{b.meetLink ? <a href={b.meetLink} target="_blank" rel="noreferrer" className="text-ink-link underline break-all">{b.meetLink}</a> : 'The meeting link will be emailed before the call.'}</div>}
                  <p className="text-ink-paragraph">Fee: {b.feeLabel} {b.paid ? '(Paid)' : '(Not paid)'}{b.refunded ? ' - refunded' : ''}</p>
                </div>
                {good && (
                  <div className="flex flex-wrap gap-3">
                    <a href={b.googleCalendarUrl} target="_blank" rel="noreferrer" className="px-4 py-2.5 rounded-xl bg-brand-yellow text-ink font-bold text-sm">Add to Google Calendar</a>
                    <a href={doctorIcsUrl(id, token)} className="px-4 py-2.5 rounded-xl border border-ink-light text-ink font-semibold text-sm hover:bg-ink-offwhite">Download calendar file</a>
                  </div>
                )}
                {good && !past && <p className="text-xs text-ink-caption mt-4">To reschedule or cancel, please contact support@dronetv.in or +91 75201 23555 at least 4 hours before the meeting.</p>}
                {b.status === 'payment_review' && <p className="text-sm text-ink-paragraph mt-2">Your payment was received but the slot was taken. Our team will contact you or refund it shortly.</p>}
                {(b.status === 'cancelled' || b.status === 'expired') && <Link to="/drone-doctor/consult" className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-brand-yellow text-ink font-bold text-sm">Book another time</Link>}
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default DoctorBookingPage;
