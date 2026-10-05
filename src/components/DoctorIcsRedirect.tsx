import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doctorIcsUrl } from '../lib/doctorApi';

const DoctorIcsRedirect = () => {
  const [params] = useSearchParams();
  const id = params.get('id') || '';
  const token = params.get('token') || '';
  useEffect(() => {
    if (id && token) window.location.replace(doctorIcsUrl(id, token));
  }, [id, token]);
  return <div className="pt-[140px] min-h-screen text-center text-ink-paragraph">{id && token ? 'Preparing your calendar file...' : 'This link is incomplete.'}</div>;
};

export default DoctorIcsRedirect;
