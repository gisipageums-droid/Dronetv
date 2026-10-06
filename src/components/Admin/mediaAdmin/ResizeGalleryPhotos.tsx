import { useRef, useState } from 'react';
import { X, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import { updateContent, type MediaItem } from '../../../lib/mediaApi';
import { optimizePhoto, formatBytes, DEFAULT_PHOTO_OPTIONS, type PhotoOptions } from '../../../lib/imageOptimize';
import { refreshShareCard } from '../../../lib/shareCard';
import type { GalleryEvent } from '../../../lib/galleryEvent';
import PhotoSizePicker from './PhotoSizePicker';

interface Props {
  photos: MediaItem[];
  events: GalleryEvent[];
  uploadImage: (file: File) => Promise<string>;
  onClose: () => void;
  onDone: () => void;
}

type Result = { state: 'wait' | 'working' | 'ok' | 'fail'; note?: string };

// Re-makes the website copy of photos that are already in the gallery. The best source is used: the
// untouched original when one was kept, otherwise the current website copy (which is never enlarged).
export default function ResizeGalleryPhotos({ photos, events, uploadImage, onClose, onDone }: Props) {
  const [opts, setOpts] = useState<PhotoOptions>(DEFAULT_PHOTO_OPTIONS);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState<Record<string, Result>>({});
  const stop = useRef(false);

  const set = (id: string, r: Result) => setResults(prev => ({ ...prev, [id]: r }));

  const resizeOne = async (photo: MediaItem) => {
    set(photo.contentId, { state: 'working' });
    try {
      const source = photo.videoUrl || photo.imageUrl;
      if (!source) throw new Error('no image');
      const res = await fetch(source, { cache: 'no-store' });
      if (!res.ok) throw new Error('download');
      const blob = await res.blob();
      const name = decodeURIComponent((source.split('?')[0].split('/').pop() || 'photo')).replace(/[^\w.\- ]+/g, '_');
      const file = new File([blob], name, { type: blob.type || 'image/jpeg' });
      const opt = await optimizePhoto(file, opts);
      const imageUrl = opt.master === file ? source : await uploadImage(opt.master);
      const thumbUrl = await uploadImage(opt.thumb).catch(() => photo.externalLink);
      await updateContent({
        contentType: 'gallery', contentId: photo.contentId, imageUrl, externalLink: thumbUrl,
        // keep the untouched original reachable even for photos saved before originals were stored
        videoUrl: photo.videoUrl || photo.imageUrl,
      });
      const ev = events.find(e => e.id === photo.platform) || null;
      await refreshShareCard({ ...photo, imageUrl }, ev, uploadImage).catch(() => false);
      set(photo.contentId, { state: 'ok', note: `${formatBytes(file.size)} → ${formatBytes(opt.master.size)}` });
      return true;
    } catch {
      set(photo.contentId, { state: 'fail', note: 'Could not resize this one' });
      return false;
    }
  };

  const run = async () => {
    stop.current = false;
    setRunning(true);
    setFinished(false);
    setResults(Object.fromEntries(photos.map(p => [p.contentId, { state: 'wait' } as Result])));
    let ok = 0;
    const queue = [...photos];
    await Promise.all(Array.from({ length: Math.min(3, queue.length) }, async () => {
      for (let p = queue.shift(); p && !stop.current; p = queue.shift()) if (await resizeOne(p)) ok++;
    }));
    setRunning(false);
    setFinished(true);
    toast.success(`Resized ${ok} of ${photos.length} photo${photos.length === 1 ? '' : 's'}`);
    onDone();
  };

  const doneCount = Object.values(results).filter(r => r.state === 'ok' || r.state === 'fail').length;

  return (
    <div className="fixed inset-0 z-[100000] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4" role="dialog" aria-modal="true" aria-label="Resize photos">
      <div className="w-full sm:max-w-2xl max-h-[92vh] flex flex-col rounded-t-2xl sm:rounded-2xl bg-surface-card shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-light">
          <h2 className="text-lg font-extrabold text-ink">Resize {photos.length} photo{photos.length === 1 ? '' : 's'}</h2>
          <button type="button" onClick={onClose} disabled={running} aria-label="Close" className="p-1.5 rounded hover:bg-ink-light disabled:opacity-50"><X className="w-4 h-4" /></button>
        </div>
        <div className="overflow-y-auto px-5 py-4 space-y-4">
          <PhotoSizePicker idPrefix="resize" value={opts} onChange={setOpts} />
          <p className="text-[11px] text-ink-caption">Each photo is re-made from its untouched original when one was kept. The title, caption, tags, event and the photo's link stay the same, and the share picture is rebuilt.</p>
          {Object.keys(results).length > 0 && (
            <ul className="divide-y divide-ink-light rounded-lg border border-ink-light text-sm">
              {photos.map(p => {
                const r = results[p.contentId];
                return (
                  <li key={p.contentId} className="flex items-center gap-3 px-3 py-2">
                    <img src={p.externalLink || p.imageUrl} alt="" className="w-10 h-10 rounded object-cover bg-ink-offwhite shrink-0" />
                    <span className="flex-1 min-w-0 truncate">{p.title}</span>
                    <span className="flex items-center gap-1 text-xs text-ink-caption shrink-0">
                      {r?.state === 'working' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      {r?.state === 'ok' && <><CheckCircle2 className="w-3.5 h-3.5 text-green-600" />{r.note}</>}
                      {r?.state === 'fail' && <><AlertTriangle className="w-3.5 h-3.5 text-status-error" />{r.note}</>}
                      {r?.state === 'wait' && 'Waiting'}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 px-5 py-4 border-t border-ink-light">
          <span className="text-xs text-ink-caption">{running ? `Working ${doneCount}/${photos.length}...` : finished ? `Finished ${doneCount}/${photos.length}` : 'Nothing changes until you press Resize.'}</span>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} disabled={running} className="px-4 py-2 rounded-lg text-sm font-medium bg-ink-light disabled:opacity-50">{finished ? 'Close' : 'Cancel'}</button>
            <button type="button" onClick={run} disabled={running || photos.length === 0} className="px-4 py-2 rounded-lg text-sm font-bold bg-brand-yellow text-ink disabled:opacity-50 flex items-center gap-2">
              {running && <Loader2 className="w-4 h-4 animate-spin" />}{finished ? 'Resize again' : 'Resize'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
