import React, { useEffect, useState } from 'react';
import { AlertTriangle, Copy, ExternalLink, Loader2, Video } from 'lucide-react';
import { toast } from 'react-toastify';
import { portalAppointments, portalSaveSettings, portalSettings } from '../../lib/doctorPortalApi';
import AppointmentDrawer from './AppointmentDrawer';
import { Card, Empty, ErrorBox, Spinner, StatusBadge, btnGhost, btnPrimary, inputCls } from './ui';
import { useLoad } from './useLoad';

const DoctorMeetingLinks: React.FC = () => {
  const settings = useLoad(portalSettings, []);
  const upcoming = useLoad(() => portalAppointments({ tab: 'upcoming' }), []);
  const [link, setLink] = useState('');
  const [saving, setSaving] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  useEffect(() => { if (settings.data) setLink(settings.data.meetLink || ''); }, [settings.data]);

  const valid = link === '' || /^https:\/\/\S+$/.test(link.trim());
  const changed = settings.data ? link.trim() !== (settings.data.meetLink || '') : false;
  const save = async () => {
    if (!settings.data || !valid) return;
    setSaving(true);
    try {
      await portalSaveSettings({ ...settings.data, meetLink: link.trim() });
      toast.success('Meeting link saved for all upcoming consultations');
      settings.reload();
      upcoming.reload();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };
  const copy = (t: string) => navigator.clipboard?.writeText(t).then(() => toast.info('Copied')).catch(() => undefined);
  const rows = upcoming.data?.appointments || [];

  return (
    <div className="space-y-5">
      <div><h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">Meeting Links</h1><p className="text-sm text-slate-500">One Google Meet link is shared with every client in their confirmation and reminder emails.</p></div>
      <Card className="p-4 sm:p-5">
        {settings.error ? <ErrorBox message={settings.error} onRetry={settings.reload} /> : !settings.data ? <Spinner /> : (
          <div className="space-y-3">
            {!settings.data.meetLink && (
              <div role="alert" className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900"><AlertTriangle className="mt-0.5 size-4 shrink-0" /><span><b>No meeting link yet.</b> Clients are told the link will follow by email. Paste your Google Meet link below.</span></div>
            )}
            <label htmlFor="ml-link" className="block text-sm font-bold text-slate-800">Your Google Meet link</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input id="ml-link" value={link} onChange={e => setLink(e.target.value)} placeholder="https://meet.google.com/abc-defg-hij" className={`${inputCls} flex-1`} aria-invalid={!valid} />
              <button type="button" onClick={save} disabled={saving || !valid || !changed} className={btnPrimary}>{saving && <Loader2 className="size-4 animate-spin" />}Save link</button>
            </div>
            {!valid && <p className="text-xs text-red-600">The link must start with https://</p>}
            <p className="text-xs text-slate-500">Saving also updates the link on every upcoming appointment, so clients never get an old one.</p>
            {settings.data.meetLink && (
              <div className="flex flex-wrap gap-2 pt-1">
                <a href={settings.data.meetLink} target="_blank" rel="noreferrer" className={btnGhost}><ExternalLink className="size-4" />Open link</a>
                <button type="button" onClick={() => copy(settings.data!.meetLink)} className={btnGhost}><Copy className="size-4" />Copy link</button>
              </div>
            )}
          </div>
        )}
      </Card>
      <Card>
        <div className="border-b border-slate-100 px-4 py-3 sm:px-5"><h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900"><Video className="size-5" />Upcoming sessions</h2></div>
        {upcoming.error ? <div className="p-4"><ErrorBox message={upcoming.error} onRetry={upcoming.reload} /></div> : upcoming.loading && !upcoming.data ? <Spinner /> : rows.length === 0 ? <Empty icon={<Video className="size-10" />} title="No upcoming sessions" /> : (
          <ul className="divide-y divide-slate-100">
            {rows.slice().reverse().map(a => (
              <li key={a.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center">
                <button type="button" onClick={() => setOpenId(a.id)} className="min-w-0 flex-1 text-left"><div className="flex flex-wrap items-center gap-2"><span className="font-bold text-slate-800">{a.name}</span><StatusBadge status={a.status} /></div><div className="text-sm text-slate-600">{a.dateLabel}, {a.timeRangeLabel}</div><div className="truncate text-xs text-slate-500">{a.topicLabel}</div></button>
                <div className="flex gap-2">
                  {a.meetLink ? <><a href={a.meetLink} target="_blank" rel="noreferrer" className={`${btnPrimary} !bg-blue-600 hover:!bg-blue-700`}><Video className="size-4" />Join</a><button type="button" onClick={() => copy(a.meetLink)} className={btnGhost} aria-label="Copy link"><Copy className="size-4" /></button></> : <span className="text-xs text-slate-400">No link set</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <AppointmentDrawer id={openId} onClose={() => setOpenId(null)} onChanged={upcoming.reload} />
    </div>
  );
};

export default DoctorMeetingLinks;
