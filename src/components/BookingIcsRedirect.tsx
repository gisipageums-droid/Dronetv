import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { icsUrl } from '../lib/bookingApi';

// The calendar-file link in emails points at the website; this hands it over to the API download.
const BookingIcsRedirect = () => {
  const [params] = useSearchParams();
  const id = params.get('id') || '';
  const token = params.get('token') || '';
  useEffect(() => {
    if (id && token) window.location.replace(icsUrl(id, token));
  }, [id, token]);
  return <div className="pt-[140px] min-h-screen text-center text-ink-paragraph">{id && token ? 'Preparing your calendar file...' : 'This link is incomplete.'}</div>;
};

export default BookingIcsRedirect;
