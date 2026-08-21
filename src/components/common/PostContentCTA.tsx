import { useRef, useState, useEffect } from 'react';
import { Plus, X, Coins, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import { createContent, ContentType } from '../../lib/mediaApi';
import { FIELD_CONFIG, FIELD_LABELS, FIELD_PLACEHOLDER, FIELD_TYPE, FieldKey } from '../../lib/contentFieldConfig';
import { useUserAuth } from '../context/context';
import { AUTH_API, LAMBDA } from '../../lib/apiConfig';
import { uploadCompanyFile } from '../CompanyPortal/api';

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;

const TOKEN_COST_BY_TYPE: Partial<Record<ContentType, number>> = {
  job: 100,
};
const DEFAULT_POST_COST = 50;

const DEFAULT_LABEL: Record<FieldKey, string> = {
  category: 'Category', source: 'Source', author: 'Author', date: 'Date', readTime: 'Read Time',
  videoUrl: 'Video URL', company: 'Company', location: 'Location', price: 'Price', salary: 'Salary',
  platform: 'Platform', zone: 'Zone', targetPages: 'Target Pages', startDate: 'Start Date',
  endDate: 'End Date', packageType: 'Package Type',
};

interface PostForm {
  title: string;
  description: string;
  imageUrl: string;
  externalLink: string;
  isPublished: boolean;
  [key: string]: any;
}
const BASE_FORM: PostForm = { title: '', description: '', imageUrl: '', externalLink: '', isPublished: false };

interface PostContentCTAProps {
  contentType: ContentType;
  typeLabel: string;
  ctaTitle?: string;
  ctaDescription?: string;
  onSuccess?: () => void;
  /** 'cta' = big dark marketing card (public pages). 'button' = plain admin-style "+ Add Content" button (dashboard). */
  variant?: 'cta' | 'button';
}

export default function PostContentCTA({ contentType, typeLabel, ctaTitle, ctaDescription, onSuccess, variant = 'cta' }: PostContentCTAProps) {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || '';
  const cost = TOKEN_COST_BY_TYPE[contentType] ?? DEFAULT_POST_COST;
  const extraFields = FIELD_CONFIG[contentType] || [];

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<PostForm>(BASE_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || !userId) return;
    // /profile requires auth and returns tokenBalance at the top level, not
    // nested under "profile" - this was sending no Authorization header
    // (guaranteed 401) and reading the wrong field even when it did respond,
    // so the balance shown here was always the Number(undefined ?? 0) = 0
    // fallback regardless of the real wallet balance.
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    fetch(`${PROFILE_API}?userId=${userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then(r => r.json())
      .then(d => setBalance(Number(d?.tokenBalance ?? 0)))
      .catch(() => setBalance(null));
  }, [open, userId]);

  const openModal = () => {
    setForm(BASE_FORM);
    setSubmitted(false);
    setErrorMsg('');
    setOpen(true);
  };

  const fieldLabel = (key: FieldKey) => FIELD_LABELS[contentType]?.[key] || DEFAULT_LABEL[key];

  const handleImageUpload = async (file: File | null) => {
    if (!file || !userId) return;
    setUploadingImage(true);
    try {
      const url = await uploadCompanyFile(userId, contentType, file);
      setForm(f => ({ ...f, imageUrl: url }));
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      const payload: any = {
        contentType,
        title: form.title,
        description: form.description,
        imageUrl: form.imageUrl,
        externalLink: form.externalLink,
        author: userId,
        source: userId,
        userId,
        isPublished: form.isPublished,
      };
      extraFields.forEach(key => { payload[key] = form[key] || ''; });
      await createContent(payload);
      setSubmitted(true);
      onSuccess?.();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Submission failed. Please try again.');
      toast.error(err?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {variant === 'cta' ? (
        <div className="bg-surface-darksection rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-base mb-1">Have a {typeLabel.toLowerCase()} to share?</h3>
            <p className="text-sm text-white/60 max-w-lg">
              {ctaDescription || `Post your ${typeLabel.toLowerCase()} on DroneTv.in and reach thousands of drone professionals.`}
            </p>
            <p className="text-xs text-brand-yellow/80 mt-1 flex items-center gap-1">
              <Coins className="w-3 h-3" /> Costs {cost} tokens per submission
            </p>
          </div>
          <div className="flex-shrink-0">
            {userId ? (
              <button onClick={openModal}
                className="flex items-center gap-2 px-4 py-2 bg-brand-yellow text-ink text-sm font-bold rounded-lg hover:bg-brand-yellow-soft transition-colors">
                <Plus className="w-4 h-4" /> {ctaTitle || `Post Your ${typeLabel}`}
              </button>
            ) : (
              <a href="/login" className="px-4 py-2 bg-brand-yellow text-ink text-sm font-bold rounded-lg hover:bg-brand-yellow-soft transition-colors">
                Login to Post
              </a>
            )}
          </div>
        </div>
      ) : (
        userId ? (
          <button onClick={openModal}
            className="flex items-center gap-2 bg-brand-yellow text-ink font-bold px-4 py-2 rounded-lg hover:bg-brand-yellow-soft transition-colors text-sm">
            <Plus className="w-4 h-4" /> Add Content
          </button>
        ) : (
          <a href="/login" className="flex items-center gap-2 bg-brand-yellow text-ink font-bold px-4 py-2 rounded-lg hover:bg-brand-yellow-soft transition-colors text-sm">
            Login to Post
          </a>
        )
      )}

      {open && (
        <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-ink/60 p-4 overflow-y-auto">
          <div className="bg-surface-card rounded-xl shadow-2xl w-full max-w-lg my-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink-light">
              <h2 className="text-base font-bold text-ink">Post Your {typeLabel}</h2>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded hover:bg-ink-light"><X className="w-5 h-5 text-ink-caption" /></button>
            </div>
            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center justify-between bg-surface-main border border-brand-yellow-soft rounded-lg px-3 py-2">
                    <span className="text-xs font-semibold text-ink flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5" /> This post costs {cost} tokens
                    </span>
                    {balance !== null && (
                      <span className={`text-xs font-bold ${balance < cost ? 'text-status-error' : 'text-ink-dark'}`}>
                        Balance: {balance}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-paragraph mb-1">Title *</label>
                    <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      placeholder={`e.g. My ${typeLabel}`}
                      className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm text-ink placeholder-ink-caption focus:outline-none focus:border-brand-yellow" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-paragraph mb-1">Description</label>
                    <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Describe it..."
                      className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm text-ink placeholder-ink-caption focus:outline-none focus:border-brand-yellow resize-none" />
                  </div>

                  {extraFields.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {extraFields.filter(k => k !== 'targetPages').map(key => (
                        <div key={key}>
                          <label className="block text-xs font-semibold text-ink-paragraph mb-1">{fieldLabel(key)}</label>
                          <input
                            type={FIELD_TYPE[key] === 'date' ? 'date' : 'text'}
                            value={form[key] || ''}
                            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                            placeholder={FIELD_PLACEHOLDER[key]}
                            className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm text-ink placeholder-ink-caption focus:outline-none focus:border-brand-yellow" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-ink-paragraph mb-1">Image URL <span className="text-ink-caption font-normal">(optional)</span></label>
                    <div className="flex gap-2">
                      <input type="url" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 min-w-0 px-3 py-2.5 border border-ink-light rounded-lg text-sm text-ink placeholder-ink-caption focus:outline-none focus:border-brand-yellow" />
                      <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}
                        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 border border-ink-light rounded-lg text-sm font-semibold text-ink-paragraph hover:border-brand-yellow hover:text-ink disabled:opacity-50 transition-colors">
                        <Upload className="w-4 h-4" /> {uploadingImage ? 'Uploading...' : 'Upload'}
                      </button>
                      <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={e => handleImageUpload(e.target.files?.[0] || null)} />
                    </div>
                    {form.imageUrl && (
                      <img src={form.imageUrl} alt="Preview" className="mt-2 h-24 rounded-lg object-cover border border-ink-light" />
                    )}
                    <p className="text-[11px] text-ink-caption mt-1">Recommended size: 1200×675px (16:9) · JPG, PNG or WebP · max 5MB</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-paragraph mb-1">External Link <span className="text-ink-caption font-normal">(optional)</span></label>
                    <input type="url" value={form.externalLink} onChange={e => setForm(f => ({ ...f, externalLink: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-3 py-2.5 border border-ink-light rounded-lg text-sm text-ink placeholder-ink-caption focus:outline-none focus:border-brand-yellow" />
                  </div>

                  <label className="flex items-center gap-2 bg-ink-offwhite border border-ink-light rounded-lg px-3 py-2.5 cursor-pointer">
                    <input type="checkbox" checked={form.isPublished}
                      onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))}
                      className="w-4 h-4 accent-brand-yellow" />
                    <span className="text-sm font-semibold text-ink-paragraph">Publish immediately</span>
                    <span className="text-xs text-ink-caption">(leave unchecked to save as draft)</span>
                  </label>

                  {errorMsg && <p className="text-xs text-status-error font-medium">{errorMsg}</p>}
                  <button type="submit" disabled={submitting}
                    className="w-full bg-brand-yellow hover:bg-brand-gold text-ink font-bold text-sm py-3 rounded-lg transition-colors disabled:opacity-50">
                    {submitting ? 'Submitting...' : `Submit (${cost} tokens)`}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-status-success/15 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✓</span>
                  </div>
                  <h3 className="font-bold text-ink mb-2">Submitted!</h3>
                  <p className="text-sm text-ink-caption mb-4">
                    {cost} tokens deducted. {form.isPublished ? 'Your post is live now.' : `Saved as draft — publish it anytime from your dashboard.`}
                  </p>
                  <button onClick={() => setOpen(false)}
                    className="px-6 py-2 bg-brand-yellow text-ink font-bold rounded-lg text-sm hover:bg-brand-gold">
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
