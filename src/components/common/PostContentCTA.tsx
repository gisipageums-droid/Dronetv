import { useState, useEffect } from 'react';
import { Plus, X, Coins } from 'lucide-react';
import { toast } from 'react-toastify';
import { createContent, ContentType } from '../../lib/mediaApi';
import { useUserAuth } from '../context/context';
import { AUTH_API, LAMBDA } from '../../lib/apiConfig';

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;

const TOKEN_COST_BY_TYPE: Partial<Record<ContentType, number>> = {
  job: 100,
};
const DEFAULT_POST_COST = 50;

interface PostForm {
  title: string;
  description: string;
  category: string;
  location: string;
  externalLink: string;
  imageUrl: string;
}
const EMPTY_FORM: PostForm = { title: '', description: '', category: '', location: '', externalLink: '', imageUrl: '' };

interface PostContentCTAProps {
  contentType: ContentType;
  typeLabel: string;
  ctaTitle?: string;
  ctaDescription?: string;
}

export default function PostContentCTA({ contentType, typeLabel, ctaTitle, ctaDescription }: PostContentCTAProps) {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || '';
  const cost = TOKEN_COST_BY_TYPE[contentType] ?? DEFAULT_POST_COST;

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<PostForm>(EMPTY_FORM);
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
    setForm(EMPTY_FORM);
    setSubmitted(false);
    setErrorMsg('');
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      await createContent({
        contentType,
        title: form.title,
        description: form.description,
        category: form.category,
        location: form.location,
        externalLink: form.externalLink,
        imageUrl: form.imageUrl,
        author: userId,
        source: userId,
        userId,
        isPublished: false,
      });
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Submission failed. Please try again.');
      toast.error(err?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-zinc-900 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-white text-base mb-1">Have a {typeLabel.toLowerCase()} to share?</h3>
          <p className="text-sm text-white/60 max-w-lg">
            {ctaDescription || `Post your ${typeLabel.toLowerCase()} on DroneTv.in and reach thousands of drone professionals.`}
          </p>
          <p className="text-xs text-yellow-400/80 mt-1 flex items-center gap-1">
            <Coins className="w-3 h-3" /> Costs {cost} tokens per submission &middot; reviewed before going live
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

      {open && (
        <div className="fixed inset-0 z-[10000000] flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg my-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-900">Post Your {typeLabel}</h2>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="px-6 py-5">
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
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                      <input type="text" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
                      <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400" />
                    </div>
                  </div>
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
                  <p className="text-sm text-gray-500 mb-4">{cost} tokens deducted. Your {typeLabel.toLowerCase()} is pending review and will appear once approved.</p>
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
