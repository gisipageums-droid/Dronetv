import { useState, useEffect } from 'react';
import { Plus, X, Coins } from 'lucide-react';
import { toast } from 'react-toastify';
import { createContent, ContentType } from '../../lib/mediaApi';
import { FIELD_CONFIG, FIELD_LABELS, FIELD_PLACEHOLDER, FIELD_TYPE, FieldKey } from '../../lib/contentFieldConfig';
import { useUserAuth } from '../context/context';
import { AUTH_API, LAMBDA } from '../../lib/apiConfig';

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

  useEffect(() => {
    if (!open || !userId) return;
    fetch(`${PROFILE_API}?userId=${userId}`)
      .then(r => r.json())
      .then(d => setBalance(Number(d?.profile?.tokenBalance ?? 0)))
      .catch(() => setBalance(null));
  }, [open, userId]);

  const openModal = () => {
    setForm(BASE_FORM);
    setSubmitted(false);
    setErrorMsg('');
    setOpen(true);
  };

  const fieldLabel = (key: FieldKey) => FIELD_LABELS[contentType]?.[key] || DEFAULT_LABEL[key];

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
        <div className="bg-zinc-900 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-base mb-1">Have a {typeLabel.toLowerCase()} to share?</h3>
            <p className="text-sm text-white/60 max-w-lg">
              {ctaDescription || `Post your ${typeLabel.toLowerCase()} on DroneTv.in and reach thousands of drone professionals.`}
            </p>
            <p className="text-xs text-yellow-400/80 mt-1 flex items-center gap-1">
              <Coins className="w-3 h-3" /> Costs {cost} tokens per submission
            </p>
          </div>
          <div className="flex-shrink-0">
            {userId ? (
              <button onClick={openModal}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">
                <Plus className="w-4 h-4" /> {ctaTitle || `Post Your ${typeLabel}`}
              </button>
            ) : (
              <a href="/login" className="px-4 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-colors">
                Login to Post
              </a>
            )}
          </div>
        </div>
      ) : (
        userId ? (
          <button onClick={openModal}
            className="flex items-center gap-2 bg-yellow-400 text-black font-bold px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors text-sm">
            <Plus className="w-4 h-4" /> Add Content
          </button>
        ) : (
          <a href="/login" className="flex items-center gap-2 bg-yellow-400 text-black font-bold px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors text-sm">
            Login to Post
          </a>
        )
      )}

      {open && (
        <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg my-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-900">Post Your {typeLabel}</h2>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                    <span className="text-xs font-semibold text-yellow-800 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5" /> This post costs {cost} tokens
                    </span>
                    {balance !== null && (
                      <span className={`text-xs font-bold ${balance < cost ? 'text-red-600' : 'text-gray-600'}`}>
                        Balance: {balance}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Title *</label>
                    <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      placeholder={`e.g. My ${typeLabel}`}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                    <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Describe it..."
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400 resize-none" />
                  </div>

                  {extraFields.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {extraFields.filter(k => k !== 'targetPages').map(key => (
                        <div key={key}>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">{fieldLabel(key)}</label>
                          <input
                            type={FIELD_TYPE[key] === 'date' ? 'date' : 'text'}
                            value={form[key] || ''}
                            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                            placeholder={FIELD_PLACEHOLDER[key]}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Image URL <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input type="url" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">External Link <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input type="url" value={form.externalLink} onChange={e => setForm(f => ({ ...f, externalLink: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400" />
                  </div>

                  <label className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 cursor-pointer">
                    <input type="checkbox" checked={form.isPublished}
                      onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))}
                      className="w-4 h-4 accent-yellow-400" />
                    <span className="text-sm font-semibold text-gray-700">Publish immediately</span>
                    <span className="text-xs text-gray-400">(leave unchecked to save as draft)</span>
                  </label>

                  {errorMsg && <p className="text-xs text-red-600 font-medium">{errorMsg}</p>}
                  <button type="submit" disabled={submitting}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm py-3 rounded-lg transition-colors disabled:opacity-50">
                    {submitting ? 'Submitting...' : `Submit (${cost} tokens)`}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✓</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Submitted!</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {cost} tokens deducted. {form.isPublished ? 'Your post is live now.' : `Saved as draft — publish it anytime from your dashboard.`}
                  </p>
                  <button onClick={() => setOpen(false)}
                    className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg text-sm hover:bg-yellow-500">
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
