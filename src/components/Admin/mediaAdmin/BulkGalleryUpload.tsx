import { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, X, Loader2, AlertTriangle, Sparkles, Settings2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { createContent, fetchAdminContent } from '../../../lib/mediaApi';
import { eventFromItem, type GalleryEvent } from '../../../lib/galleryEvent';
import GalleryEventManager from './GalleryEventManager';
import { optimizePhoto, formatBytes } from '../../../lib/imageOptimize';
import { ADMIN_API } from '../../../lib/apiConfig';
import { authHeader } from '../../../lib/authService';

const CATEGORIES = ['Events', 'Collaborations', 'Conferences', 'Interviews', 'Product Launches', 'Team Photos'];
const MAX_FILES = 40;
const CONCURRENCY = 3;

type RowStatus = 'working' | 'ready' | 'error';

interface Row {
  id: string;
  file: File;
  preview: string;
  status: RowStatus;
  imageUrl: string;
  thumbUrl?: string;
  originalUrl?: string;
  sizeNote?: string;
  title: string;
  description: string;
  category: string;
  tags: string;
  aiFilled: boolean;
  aiPending: boolean;
  peopleCount?: number | null;
  error?: string;
}

interface Props {
  uploadImage: (file: File) => Promise<string>;
  onClose: () => void;
  onSaved: () => void;
}

function ordinalDate(d: Date): string {
  const day = d.getDate();
  const suffix = day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  return `${day}${suffix} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function titleFromFilename(name: string): string {
  const base = name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  return /^(img|dsc|image|photo|whatsapp)?\s*[\d\s]+$/i.test(base) ? '' : base;
}

// Sent to the AI only. A small copy (about 30 KB) is plenty to caption a photo
// and uploads quickly even on a slow connection. The original file is what gets
// stored and shown.
async function downscale(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 640 / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', 0.7));
    return blob || file;
  } catch {
    return file;
  }
}

interface CaptionContext { event?: string; venue?: string; avoid: string[] }

async function describePhoto(file: File, ctx: CaptionContext): Promise<{ title: string; description: string; category: string; tags: string[]; peopleCount?: number | null }> {
  const form = new FormData();
  form.append('file', await downscale(file), 'photo.jpg');
  if (ctx.event) form.append('event', ctx.event);
  if (ctx.venue) form.append('venue', ctx.venue);
  if (ctx.avoid.length) form.append('avoid', JSON.stringify(ctx.avoid.slice(0, 40)));
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 90000);
  try {
    const res = await fetch(`${ADMIN_API}/ai/describe-photo`, { method: 'POST', headers: authHeader(), body: form, signal: ctl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

const words = (t: string) => new Set(t.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2));
function similar(a: string, b: string): boolean {
  const A = words(a), B = words(b);
  if (A.size === 0 || B.size === 0) return false;
  let both = 0;
  A.forEach(w => { if (B.has(w)) both++; });
  return both / (A.size + B.size - both) >= 0.7;
}

async function uploadWithRetry(upload: (f: File) => Promise<string>, file: File): Promise<string> {
  try {
    return await upload(file);
  } catch {
    return upload(file);
  }
}

export default function BulkGalleryUpload({ uploadImage, onClose, onSaved }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [location, setLocation] = useState('');
  const [publish, setPublish] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [eventId, setEventId] = useState('');
  const [showManager, setShowManager] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const rowsRef = useRef<Row[]>([]);
  rowsRef.current = rows;
  const event = events.find(e => e.id === eventId) || null;
  const eventRef = useRef<GalleryEvent | null>(null);
  eventRef.current = event;

  const loadEvents = useCallback(async () => {
    try {
      const items = await fetchAdminContent(undefined, 'gallery-event');
      setEvents(items.map(eventFromItem));
    } catch {
      toast.error('Could not load events');
    }
  }, []);
  useEffect(() => { loadEvents(); }, [loadEvents]);

  const previews = useRef<string[]>([]);

  useEffect(() => () => previews.current.forEach(URL.revokeObjectURL), []);

  const patch = useCallback((id: string, p: Partial<Row>) => {
    setRows(rs => rs.map(r => (r.id === id ? { ...r, ...p } : r)));
  }, []);

  const processOne = useCallback(async (row: Row) => {
    let imageUrl: string;
    let thumbUrl: string | undefined;
    let originalUrl: string | undefined;
    let sizeNote: string | undefined;
    try {
      // Three files per photo: a small WebP copy for the website, a tiny grid preview, and the
      // untouched original (only used by "Download original photo").
      let display: File = row.file;
      let thumbFile: File | null = null;
      try {
        const opt = await optimizePhoto(row.file);
        display = opt.master;
        thumbFile = opt.thumb;
        sizeNote = `Original kept: ${formatBytes(opt.originalBytes)} · website copy: ${formatBytes(opt.master.size)}`;
      } catch { /* unreadable by the browser: upload the file as it is */ }
      imageUrl = await uploadWithRetry(uploadImage, display);
      if (thumbFile) thumbUrl = await uploadWithRetry(uploadImage, thumbFile).catch(() => undefined);
      originalUrl = display === row.file ? imageUrl : await uploadWithRetry(uploadImage, row.file);
    } catch {
      patch(row.id, { status: 'error', error: 'Upload failed - remove it and try again', aiPending: false });
      return;
    }
    patch(row.id, { status: 'ready', imageUrl, thumbUrl, originalUrl, sizeNote, aiPending: true });
    try {
      let ai: Awaited<ReturnType<typeof describePhoto>> | null = null;
      for (let attempt = 0; attempt < 3 && !ai; attempt++) {
        try {
          ai = await describePhoto(row.file, {
            event: eventRef.current?.name,
            venue: eventRef.current?.location,
            avoid: rowsRef.current.filter(r => r.id !== row.id && r.description.trim()).map(r => r.description),
          });
        } catch (err) {
          if (attempt === 2) throw err;
          await new Promise(res => setTimeout(res, 3000 * (attempt + 1)));
        }
      }
      if (!ai) throw new Error('no caption');
      const result = ai;
      setRows(rs => rs.map(r => {
        if (r.id !== row.id) return r;
        return {
          ...r,
          // Never overwrite something the admin has already typed.
          title: r.title.trim() ? r.title : result.title,
          description: r.description.trim() ? r.description : result.description,
          category: result.category && CATEGORIES.includes(result.category) ? result.category : r.category,
          tags: r.tags.trim() ? r.tags : (result.tags || []).join(', '),
          aiFilled: true,
          aiPending: false,
          peopleCount: result.peopleCount ?? null,
        };
      }));
    } catch {
      // Captions unavailable: fall back to a title from the file name so the row can still be saved.
      setRows(rs => rs.map(r => (r.id === row.id
        ? { ...r, aiPending: false, title: r.title.trim() ? r.title : titleFromFilename(row.file.name) }
        : r)));
    }
  }, [patch, uploadImage]);

  const addFiles = useCallback(async (list: FileList | File[]) => {
    const files = Array.from(list).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) { toast.error('Select image files'); return; }
    const room = MAX_FILES - rows.length;
    if (files.length > room) toast.info(`Only ${MAX_FILES} photos per batch - added the first ${Math.max(room, 0)}`);
    const accepted = files.slice(0, Math.max(room, 0));
    const newRows: Row[] = accepted.map((file, i) => {
      const preview = URL.createObjectURL(file);
      previews.current.push(preview);
      return {
        id: `${Date.now()}-${i}-${file.name}`,
        file, preview, status: 'working', imageUrl: '',
        title: '', description: '', category: 'Events', tags: '', aiFilled: false, aiPending: false,
      };
    });
    setRows(rs => [...rs, ...newRows]);
    const queue = [...newRows];
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
      for (let r = queue.shift(); r; r = queue.shift()) await processOne(r);
    }));
    await dedupeCaptions();
  }, [rows.length, processOne]);

  // Photos captioned at the same moment can end up with near-identical captions;
  // re-caption the later one asking the model to describe what is different.
  const dedupeCaptions = useCallback(async () => {
    const snapshot = rowsRef.current;
    const dups = snapshot.filter((r, i) => r.description.trim() && snapshot.slice(0, i).some(o => o.description.trim() && similar(o.description, r.description)));
    for (const row of dups) {
      patch(row.id, { aiPending: true });
      try {
        const others = rowsRef.current.filter(o => o.id !== row.id && o.description.trim()).map(o => o.description);
        const ai = await describePhoto(row.file, { event: eventRef.current?.name, venue: eventRef.current?.location, avoid: others });
        setRows(rs => rs.map(r => (r.id === row.id ? { ...r, description: ai.description || r.description, aiPending: false } : r)));
      } catch {
        patch(row.id, { aiPending: false });
      }
    }
  }, [patch]);

  const busy = rows.some(r => r.status === 'working' || r.aiPending);
  const ready = rows.filter(r => r.status === 'ready');

  const saveAll = async () => {
    const missing = ready.filter(r => !r.title.trim());
    if (missing.length) { toast.error('Every photo needs a title'); return; }
    setSaving(true);
    const date = ordinalDate(new Date());
    let saved = 0;
    for (const r of ready) {
      try {
        await createContent({
          contentType: 'gallery',
          title: r.title.trim(),
          description: r.description.trim(),
          imageUrl: r.imageUrl,
          // gallery photos keep their small grid preview in externalLink (unused for this type)
          externalLink: r.thumbUrl,
          // the untouched original file (gallery photos do not use videoUrl otherwise)
          videoUrl: r.originalUrl,
          category: r.category,
          location: (event?.location || location).trim(),
          date,
          // 'platform' carries the event id so the gallery can apply the event's logos and details.
          platform: event?.id,
          tags: [...r.tags.split(',').map(t => t.trim()).filter(Boolean), ...(event ? [event.name.toLowerCase()] : [])],
          isPublished: publish,
        });
        saved++;
        setRows(rs => rs.filter(x => x.id !== r.id));
      } catch {
        patch(r.id, { status: 'error', error: 'Save failed' });
      }
    }
    setSaving(false);
    if (saved > 0) { toast.success(`${saved} photo${saved > 1 ? 's' : ''} saved${publish ? ' and published' : ' as drafts'}`); onSaved(); }
  };

  const inp = 'w-full border border-ink-light rounded-lg px-2.5 py-1.5 text-sm text-ink bg-surface-card focus:outline-none focus:border-brand-yellow';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-6">
      {showManager && <GalleryEventManager uploadImage={uploadImage} onClose={() => setShowManager(false)} onChanged={loadEvents} />}
      <div className="bg-surface-card rounded-xl shadow-2xl w-full max-w-5xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-light">
          <div>
            <h2 className="text-lg font-bold text-ink">Bulk upload photos</h2>
            <p className="text-xs text-ink-caption flex items-center gap-1"><Sparkles className="w-3 h-3" /> Title, description, category and tags are filled automatically. Review, then save.</p>
          </div>
          <button onClick={onClose} disabled={saving} className="p-2 rounded hover:bg-ink-light"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-ink-paragraph uppercase tracking-wide block mb-1">Event (applies to all photos)</label>
              <div className="flex gap-2">
                <select value={eventId} onChange={e => setEventId(e.target.value)} className={inp}>
                  <option value="">No event</option>
                  {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
                </select>
                <button type="button" onClick={() => setShowManager(true)} className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-ink-light text-sm font-medium">
                  <Settings2 className="w-4 h-4" /> Events
                </button>
              </div>
              {event ? (
                <div className="mt-2 flex items-center gap-3 text-xs text-ink-caption">
                  {event.logo && <img src={event.logo} alt="" className="h-8 max-w-[90px] object-contain" />}
                  <span>{event.location || 'No venue set'} · {event.partners.length} partner logo{event.partners.length === 1 ? '' : 's'}</span>
                </div>
              ) : (
                <input value={location} onChange={e => setLocation(e.target.value)} className={`${inp} mt-2`} placeholder="Location (optional) e.g. Pragati Maidan, New Delhi" />
              )}
            </div>
            <label className="flex items-center gap-2 text-sm text-ink mt-5">
              <input type="checkbox" checked={publish} onChange={e => setPublish(e.target.checked)} className="accent-amber-500" />
              Publish to the gallery right away (uncheck to save as drafts)
            </label>
          </div>

          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl py-8 text-center cursor-pointer transition-colors ${dragging ? 'border-brand-yellow bg-brand-yellow/10' : 'border-ink-light hover:border-brand-yellow'}`}>
            <Upload className="w-6 h-6 mx-auto mb-2 text-ink-caption" />
            <p className="text-sm font-semibold text-ink">Drop photos here or click to select</p>
            <p className="text-xs text-ink-caption mt-1">Up to {MAX_FILES} images at a time</p>
            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
              onChange={e => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; }} />
          </div>

          {rows.length > 0 && (
            <>
              <div className="space-y-3">
                {rows.map(r => (
                  <div key={r.id} className="flex gap-3 border border-ink-light rounded-lg p-3">
                    <img src={r.preview} alt="" className="w-28 h-24 object-cover rounded-md shrink-0 bg-ink-offwhite" />
                    {r.status === 'working' ? (
                      <div className="flex items-center gap-2 text-sm text-ink-caption"><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</div>
                    ) : r.status === 'error' ? (
                      <div className="flex-1 flex items-center gap-2 text-sm text-status-error"><AlertTriangle className="w-4 h-4" /> {r.error}</div>
                    ) : (
                      <div className="flex-1 grid sm:grid-cols-2 gap-2">
                        <input value={r.title} onChange={e => patch(r.id, { title: e.target.value })} className={inp} placeholder="Title" />
                        <select value={r.category} onChange={e => patch(r.id, { category: e.target.value })} className={inp}>
                          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                        <textarea value={r.description} onChange={e => patch(r.id, { description: e.target.value })} rows={2} className={`${inp} sm:col-span-2 resize-none`} placeholder="Description" />
                        <input value={r.tags} onChange={e => patch(r.id, { tags: e.target.value })} className={`${inp} sm:col-span-2`} placeholder="Tags, comma separated (add people names here)" />
                        {r.sizeNote && <p className="text-[11px] text-ink-caption sm:col-span-2">{r.sizeNote}</p>}
                        {typeof r.peopleCount === 'number' && r.peopleCount > 0 && (
                          <p className="text-[11px] text-ink-caption sm:col-span-2">{r.peopleCount} {r.peopleCount === 1 ? 'face' : 'faces'} detected - add people names in tags if you want them searchable.</p>
                        )}
                        {r.aiPending && <p className="text-[11px] text-ink-caption sm:col-span-2 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Writing caption...</p>}
                        {!r.aiPending && !r.aiFilled && <p className="text-[11px] text-ink-caption sm:col-span-2">Automatic caption was not available for this photo - please fill the details.</p>}
                      </div>
                    )}
                    <button onClick={() => setRows(rs => rs.filter(x => x.id !== r.id))} disabled={saving} className="self-start p-1.5 rounded hover:bg-ink-light text-ink-caption"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-ink-light">
          <span className="text-xs text-ink-caption">{ready.length} ready{busy ? ' · still working...' : ''}</span>
          <div className="flex gap-2">
            <button onClick={onClose} disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium bg-ink-light hover:bg-ink-light">Cancel</button>
            <button onClick={saveAll} disabled={saving || busy || ready.length === 0}
              className="px-4 py-2 rounded-lg text-sm font-bold bg-brand-yellow text-ink disabled:opacity-50 flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save {ready.length || ''} photo{ready.length === 1 ? '' : 's'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
