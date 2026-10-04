import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CalendarDays, Clock, Loader2, Video } from 'lucide-react';
import CompactHero from './common/CompactHero';
import { BookingApiError, BookingInfo, cancelBooking, fetchBooking, icsUrl } from '../lib/bookingApi';

const BookingManagePage: React.FC = () => {
  const [params] = useSearchParams();
  const id = params.get('id') || '';
  const token = params.get('token') || '';
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id || !token) { setError('This link is incomplete. Please use the link from your confirmation email.'); setLoading(false); return; }
    fetchBooking(id, token)
      .then(setBooking)
      .catch(e => setError(e instanceof BookingApiError && e.status === 404 ? 'We could not find this booking. The link may be wrong.' : (e as Error).message))
      .finally(() => setLoading(false));
  }, [id, token]);

  const doCancel = async () => {
    setCancelling(true);
    setError('');
    try {
      setBooking(await cancelBooking(id, token));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCancelling(false);
      setConfirming(false);
    }
  };

  const cancelled = booking?.status === 'cancelled';
  const past = booking ? new Date(booking.end).getTime() < Date.now() : false;

  return (
    <div className="pt-[104px] min-h-screen bg-surface-main">
      <CompactHero title={<>Your <span>Booking</span></>} />
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 pb-16">
        <div className="bg-surface-card rounded-xl border border-ink-light shadow-sm p-6 sm:p-8">
          {loading ? (
            <div className="flex items-center gap-2 text-ink-caption"><Loader2 className="w-4 h-4 animate-spin" />Loading your booking...</div>
          ) : !booking ? (
            <div role="alert" className="text-status-error text-sm">{error}</div>
          ) : (
            <>
              <div className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-4 ${cancelled ? 'bg-status-error/15 text-status-error' : 'bg-status-success/15 text-status-success'}`}>
                {cancelled ? 'Cancelled' : past ? 'Completed' : 'Confirmed'}
              </div>
              <h2 className="text-xl font-bold text-ink mb-4">Call with DroneTV</h2>
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex items-center gap-2 text-ink"><CalendarDays className="w-4 h-4" /><b>{booking.whenLabel} IST</b></div>
                <div className="flex items-center gap-2 text-ink-paragraph"><Clock className="w-4 h-4" />Your time: {new Date(booking.start).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</div>
                {!cancelled && (
                  <div className="flex items-center gap-2 text-ink-paragraph">
                    <Video className="w-4 h-4" />
                    {booking.meetLink ? <a href={booking.meetLink} target="_blank" rel="noreferrer" className="text-ink-link underline break-all">{booking.meetLink}</a> : 'The meeting link will be emailed before the call.'}
                  </div>
                )}
                {booking.topic && <p className="text-ink-paragraph pt-1"><span className="font-semibold">Topic:</span> {booking.topic}</p>}
              </div>
              {error && <div role="alert" className="text-sm text-status-error mb-3">{error}</div>}
              {cancelled ? (
                <Link to="/book-a-call" className="inline-block px-5 py-2.5 rounded-xl bg-brand-yellow text-ink font-bold text-sm">Book another time</Link>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <a href={booking.googleCalendarUrl} target="_blank" rel="noreferrer" className="px-4 py-2.5 rounded-xl bg-brand-yellow text-ink font-bold text-sm">Add to Google Calendar</a>
                  <a href={icsUrl(id, token)} className="px-4 py-2.5 rounded-xl border border-ink-light text-ink font-semibold text-sm hover:bg-ink-offwhite">Download calendar file</a>
                  {!past && (confirming ? (
                    <span className="flex items-center gap-2 text-sm">
                      Cancel this call?
                      <button type="button" onClick={doCancel} disabled={cancelling} className="px-3 py-2 rounded-lg bg-status-error text-white font-bold text-xs disabled:opacity-60">{cancelling ? 'Cancelling...' : 'Yes, cancel'}</button>
                      <button type="button" onClick={() => setConfirming(false)} className="px-3 py-2 rounded-lg bg-ink-light text-ink text-xs font-semibold">Keep it</button>
                    </span>
                  ) : (
                    <button type="button" onClick={() => setConfirming(true)} className="px-4 py-2.5 rounded-xl border border-status-error text-status-error font-semibold text-sm hover:bg-status-error/10">Cancel booking</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingManagePage;
