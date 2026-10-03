import { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, X, Loader2, AlertTriangle, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import { createContent } from '../../../lib/mediaApi';
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
  title: string;
  description: string;
  category: string;
  tags: string;
  aiFilled: boolean;
  aiPending: boolean;
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

async function describePhoto(file: File): Promise<{ title: string; description: string; category: string; tags: string[] }> {
  const form = new FormData();
  form.append('file', await downscale(file), 'photo.jpg');
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
  const inputRef = useRef<HTMLInputElement>(null);
  const previews = useRef<string[]>([]);

  useEffect(() => () => previews.current.forEach(URL.revokeObjectURL), []);

  const patch = useCallback((id: string, p: Partial<Row>) => {
    setRows(rs => rs.map(r => (r.id === id ? { ...r, ...p } : r)));
  }, []);

  const processOne = useCallback(async (row: Row) => {
    let imageUrl: string;
    try {
      imageUrl = await uploadWithRetry(uploadImage, row.file);
    } catch {
      patch(row.id, { status: 'error', error: 'Upload failed - remove it and try again', aiPending: false });
      return;
    }
    patch(row.id, { status: 'ready', imageUrl, aiPending: true });
    try {
      const ai = await describePhoto(row.file);
      setRows(rs => rs.map(r => {
        if (r.id !== row.id) return r;
        return {
          ...r,
          // Never overwrite something the admin has already typed.
          title: r.title.trim() ? r.title : ai.title,
          description: r.description.trim() ? r.description : ai.description,
          category: ai.category && CATEGORIES.includes(ai.category) ? ai.category : r.category,
          tags: r.tags.trim() ? r.tags : (ai.tags || []).join(', '),
          aiFilled: true,
          aiPending: false,
        };
      }));
    } catch {
      patch(row.id, { aiPending: false });
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
        title: titleFromFilename(file.name), description: '', category: 'Events', tags: '', aiFilled: false, aiPending: false,
      };
    });
    setRows(rs => [...rs, ...newRows]);
    const queue = [...newRows];
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
      for (let r = queue.shift(); r; r = queue.shift()) await processOne(r);
    }));
  }, [rows.length, processOne]);

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
          category: r.category,
          location: location.trim(),
          date,
          tags: r.tags.split(',').map(t => t.trim()).filter(Boolean),
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
      <div className="bg-surface-card rounded-xl shadow-2xl w-full max-w-5xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-light">
          <div>
            <h2 className="text-lg font-bold text-ink">Bulk upload photos</h2>
            <p className="text-xs text-ink-caption flex items-center gap-1"><Sparkles className="w-3 h-3" /> Title, description, category and tags are filled automatically. Review, then save.</p>
          </div>
          <button onClick={onClose} disabled={saving} className="p-2 rounded hover:bg-ink-light"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-5">
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
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-ink-paragraph uppercase tracking-wide block mb-1">Location (applies to all, optional)</label>
                  <input value={location} onChange={e => setLocation(e.target.value)} className={inp} placeholder="e.g. Pragati Maidan, New Delhi" />
                </div>
                <label className="flex items-center gap-2 text-sm text-ink mt-5">
                  <input type="checkbox" checked={publish} onChange={e => setPublish(e.target.checked)} className="accent-amber-500" />
                  Publish to the gallery right away (uncheck to save as drafts)
                </label>
              </div>

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
