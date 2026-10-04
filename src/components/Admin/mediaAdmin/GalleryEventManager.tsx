import { useCallback, useEffect, useState } from 'react';
import { X, Plus, Trash2, Loader2, Upload, Pencil } from 'lucide-react';
import { toast } from 'react-toastify';
import { createContent, deleteContent, fetchAdminContent, updateContent } from '../../../lib/mediaApi';
import { DEFAULT_FOOTER, MAX_PARTNER_LOGOS, eventFromItem, eventToFields, type GalleryEvent } from '../../../lib/galleryEvent';
import { optimizeLogo } from '../../../lib/imageOptimize';
import { PARTNER_LOGO_SLUGS, partnerLogoPath, partnerName } from '../../../lib/partners';

interface Props {
  uploadImage: (file: File) => Promise<string>;
  onClose: () => void;
  onChanged: () => void;
}

type Draft = Omit<GalleryEvent, 'id'> & { id?: string };

const EMPTY: Draft = { name: '', logo: '', location: '', partners: [], ...DEFAULT_FOOTER };

const inp = 'w-full border border-ink-light rounded-lg px-2.5 py-1.5 text-sm text-ink bg-surface-card focus:outline-none focus:border-brand-yellow';
const lbl = 'text-xs font-bold text-ink-paragraph uppercase tracking-wide block mb-1';

export default function GalleryEventManager({ uploadImage, onClose, onChanged }: Props) {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const items = await fetchAdminContent(undefined, 'gallery-event');
      setEvents(items.map(eventFromItem));
    } catch {
      toast.error('Could not load events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const uploadLogos = async (files: FileList | null, apply: (urls: string[]) => void) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) {
        if (!f.type.startsWith('image/')) continue;
        urls.push(await uploadImage(await optimizeLogo(f)));
      }
      apply(urls);
    } catch {
      toast.error('Logo upload failed');
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!draft) return;
    if (!draft.name.trim()) { toast.error('Event name is required'); return; }
    setSaving(true);
    try {
      const fields = eventToFields(draft);
      if (draft.id) await updateContent({ ...fields, contentId: draft.id });
      else await createContent(fields);
      toast.success('Event saved');
      setDraft(null);
      await load();
      onChanged();
    } catch {
      toast.error('Could not save the event');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteContent('gallery-event', id);
      setConfirmDelete(null);
      await load();
      onChanged();
      toast.success('Event deleted (its photos stay in the gallery)');
    } catch {
      toast.error('Could not delete the event');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-start justify-center overflow-y-auto py-6">
      <div className="bg-surface-card rounded-xl shadow-2xl w-full max-w-3xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-light">
          <div>
            <h2 className="text-lg font-bold text-ink">Gallery events</h2>
            <p className="text-xs text-ink-caption">Enter the event details once. They are applied automatically to every photo of that event.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded hover:bg-ink-light"><X className="w-5 h-5" /></button>
        </div>

        {!draft ? (
          <div className="p-6 space-y-3">
            <button onClick={() => setDraft({ ...EMPTY })} className="flex items-center gap-2 bg-brand-yellow text-ink font-bold px-4 py-2 rounded-lg text-sm">
              <Plus className="w-4 h-4" /> New event
            </button>
            {loading ? (
              <div className="py-8 text-center text-sm text-ink-caption">Loading...</div>
            ) : events.length === 0 ? (
              <div className="py-8 text-center text-sm text-ink-caption">No events yet. Create one, then pick it when bulk-uploading photos.</div>
            ) : events.map(e => (
              <div key={e.id} className="flex items-center gap-3 border border-ink-light rounded-lg p-3">
                {e.logo ? <img src={e.logo} alt="" className="w-16 h-12 object-contain rounded bg-ink-offwhite" /> : <div className="w-16 h-12 rounded bg-ink-offwhite" />}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-ink truncate">{e.name}</div>
                  <div className="text-xs text-ink-caption truncate">{e.location || 'No venue'} · {e.partners.length} partner logo{e.partners.length === 1 ? '' : 's'}</div>
                </div>
                <button onClick={() => setDraft({ ...e })} className="p-2 rounded hover:bg-ink-light" title="Edit"><Pencil className="w-4 h-4" /></button>
                {confirmDelete === e.id ? (
                  <button onClick={() => remove(e.id)} className="px-2 py-1 rounded bg-status-error text-white text-xs font-bold">Confirm delete</button>
                ) : (
                  <button onClick={() => setConfirmDelete(e.id)} className="p-2 rounded hover:bg-ink-light text-status-error" title="Delete"><Trash2 className="w-4 h-4" /></button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Event name *</label>
                <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} className={inp} placeholder="e.g. Drone Expo 2026" />
              </div>
              <div>
                <label className={lbl}>Venue / location</label>
                <input value={draft.location} onChange={e => setDraft({ ...draft, location: e.target.value })} className={inp} placeholder="e.g. Yashobhoomi, New Delhi, India" />
              </div>
            </div>

            <div>
              <label className={lbl}>Event logo</label>
              <div className="flex items-center gap-3">
                {draft.logo ? <img src={draft.logo} alt="" className="h-14 max-w-[160px] object-contain rounded bg-ink-offwhite" /> : <div className="h-14 w-24 rounded bg-ink-offwhite" />}
                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-ink-light rounded-lg text-sm cursor-pointer hover:border-brand-yellow">
                  <Upload className="w-4 h-4" /> {draft.logo ? 'Replace logo' : 'Upload logo'}
                  <input type="file" accept="image/*" className="hidden" disabled={uploading}
                    onChange={e => { const files = e.target.files; uploadLogos(files, urls => setDraft(d => d && { ...d, logo: urls[0] || d.logo })); e.target.value = ''; }} />
                </label>
                {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
            </div>

            <div>
              <label className={lbl}>Industry partner logos ({draft.partners.length}/{MAX_PARTNER_LOGOS})</label>
              <div className="flex flex-wrap gap-2">
                {draft.partners.map((u, i) => (
                  <div key={u + i} className="relative w-20 h-14 border border-ink-light rounded-lg bg-white">
                    <img src={u} alt="" className="w-full h-full object-contain p-1" />
                    <button onClick={() => setDraft({ ...draft, partners: draft.partners.filter((_, j) => j !== i) })}
                      className="absolute -top-2 -right-2 bg-status-error text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>
                  </div>
                ))}
                {draft.partners.length < MAX_PARTNER_LOGOS && (
                  <label className="w-20 h-14 border border-dashed border-ink-light rounded-lg flex items-center justify-center cursor-pointer hover:border-brand-yellow">
                    <Plus className="w-5 h-5 text-ink-caption" />
                    <input type="file" accept="image/*" multiple className="hidden" disabled={uploading}
                      onChange={e => {
                        const files = e.target.files;
                        uploadLogos(files, urls => setDraft(d => d && { ...d, partners: [...d.partners, ...urls].slice(0, MAX_PARTNER_LOGOS) }));
                        e.target.value = '';
                      }} />
                  </label>
                )}
              </div>
            </div>

            <div>
              <button type="button" onClick={() => setShowPicker(v => !v)} className="text-sm font-semibold text-ink underline underline-offset-2">
                {showPicker ? 'Hide website partners' : 'Choose from website partners (no upload needed)'}
              </button>
              {showPicker && (
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-64 overflow-y-auto border border-ink-light rounded-lg p-3">
                  {PARTNER_LOGO_SLUGS.map(slug => {
                    const path = partnerLogoPath(slug);
                    const on = draft.partners.includes(path);
                    const full = !on && draft.partners.length >= MAX_PARTNER_LOGOS;
                    return (
                      <button key={slug} type="button" disabled={full} title={partnerName(slug)}
                        onClick={() => setDraft(d => d && { ...d, partners: on ? d.partners.filter(x => x !== path) : [...d.partners, path].slice(0, MAX_PARTNER_LOGOS) })}
                        className={`relative h-16 rounded-lg border bg-white p-1.5 transition-colors ${on ? 'border-brand-yellow ring-2 ring-brand-yellow' : 'border-ink-light hover:border-brand-yellow'} ${full ? 'opacity-40 cursor-not-allowed' : ''}`}>
                        <img src={path} alt={partnerName(slug)} loading="lazy" className="w-full h-full object-contain" />
                        {on && <span className="absolute -top-1.5 -right-1.5 bg-brand-yellow text-ink rounded-full text-[10px] font-bold w-4 h-4 flex items-center justify-center">&#10003;</span>}
                      </button>
                    );
                  })}
                </div>
              )}
              <p className="text-[11px] text-ink-caption mt-1">Picked logos are used straight from the website, so they take no extra storage.</p>
            </div>

            <div>
              <label className={lbl}>DroneTV footer details</label>
              <div className="grid sm:grid-cols-3 gap-3">
                <input value={draft.website} onChange={e => setDraft({ ...draft, website: e.target.value })} className={inp} placeholder="Website" />
                <input value={draft.tagline} onChange={e => setDraft({ ...draft, tagline: e.target.value })} className={inp} placeholder="Tagline" />
                <input value={draft.phone} onChange={e => setDraft({ ...draft, phone: e.target.value })} className={inp} placeholder="Phone" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setDraft(null)} disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium bg-ink-light">Back</button>
              <button onClick={save} disabled={saving || uploading} className="px-4 py-2 rounded-lg text-sm font-bold bg-brand-yellow text-ink disabled:opacity-50 flex items-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
