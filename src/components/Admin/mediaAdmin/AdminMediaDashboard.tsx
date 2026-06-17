import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, Eye, EyeOff, Search, X, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchAdminContent, createContent, updateContent, deleteContent, MediaItem, ContentType } from '../../../lib/mediaApi';

const MEDIA_TYPES: { value: ContentType; label: string }[] = [
  { value: 'news', label: 'News' },
  { value: 'magazine', label: 'Magazine' },
  { value: 'video', label: 'Video Spotlight' },
  { value: 'impact-story', label: 'Impact Story' },
  { value: 'market-intelligence', label: 'Market Intelligence' },
  { value: 'tech-trends', label: 'Tech Trends' },
  { value: 'press-release', label: 'Press Release' },
  { value: 'industry-report', label: 'Industry Report' },
];

const EVENTS_TYPES: { value: ContentType; label: string }[] = [
  { value: 'competition', label: 'Competition' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'meetup', label: 'Meetup' },
];

const PROFESSIONALS_TYPES: { value: ContentType; label: string }[] = [
  { value: 'job', label: 'Job Listing' },
  { value: 'training', label: 'Training Program' },
  { value: 'certification', label: 'Certification' },
];

const PARTNERSHIPS_TYPES: { value: ContentType; label: string }[] = [
  { value: 'applications', label: 'Applications' },
  { value: 'manufacturer', label: 'Manufacturer' },
  { value: 'ai-company', label: 'AI Tech Company' },
  { value: 'event-organizer', label: 'Event Organizer' },
  { value: 'education-partner', label: 'Education Partner' },
  { value: 'industry-player', label: 'Industry Player' },
];

const ALL_TYPE_DEFS = [...MEDIA_TYPES, ...EVENTS_TYPES, ...PROFESSIONALS_TYPES, ...PARTNERSHIPS_TYPES];

const EVENTS_VALS = new Set(EVENTS_TYPES.map(t => t.value));
const PROFESSIONALS_VALS = new Set(PROFESSIONALS_TYPES.map(t => t.value));
const PARTNERSHIPS_VALS = new Set(PARTNERSHIPS_TYPES.map(t => t.value));

type SectionMode = 'media' | 'events' | 'professionals' | 'partnerships';

const MODE_CONFIG: Record<SectionMode, { title: string; subtitle: string; types: { value: ContentType; label: string }[]; sectionParam: string }> = {
  media: {
    title: 'Media Content Manager',
    subtitle: 'Manage news, articles, videos and media content',
    types: MEDIA_TYPES,
    sectionParam: '',
  },
  events: {
    title: 'Events Content Manager',
    subtitle: 'Manage competitions, webinars and meetup listings',
    types: EVENTS_TYPES,
    sectionParam: 'events-cms',
  },
  professionals: {
    title: 'Professionals Content Manager',
    subtitle: 'Manage job listings, training programs and certifications',
    types: PROFESSIONALS_TYPES,
    sectionParam: 'professionals-cms',
  },
  partnerships: {
    title: 'Partnerships Content Manager',
    subtitle: 'Manage partner applications and partner directory listings',
    types: PARTNERSHIPS_TYPES,
    sectionParam: 'partnerships',
  },
};

function getMode(urlType: string | null, urlSection: string): SectionMode {
  if (urlType && PARTNERSHIPS_VALS.has(urlType as ContentType)) return 'partnerships';
  if (urlType && EVENTS_VALS.has(urlType as ContentType)) return 'events';
  if (urlType && PROFESSIONALS_VALS.has(urlType as ContentType)) return 'professionals';
  if (urlSection === 'partnerships') return 'partnerships';
  if (urlSection === 'events-cms') return 'events';
  if (urlSection === 'professionals-cms') return 'professionals';
  return 'media';
}

const EMPTY_FORM = {
  contentType: 'news' as ContentType,
  title: '',
  description: '',
  imageUrl: '',
  externalLink: '',
  videoUrl: '',
  source: '',
  author: '',
  category: '',
  location: '',
  date: '',
  price: '',
  salary: '',
  company: '',
  platform: '',
  readTime: '',
  tags: [] as string[],
  isPublished: false,
};

export default function AdminMediaDashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const urlType = searchParams.get('type') as ContentType | null;
  const urlSection = searchParams.get('section') ?? '';
  const mode = useMemo(() => getMode(urlType, urlSection), [urlType, urlSection]);
  const config = MODE_CONFIG[mode];

  const [activeType, setActiveType] = useState<ContentType | 'all'>(urlType ?? 'all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MediaItem | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setActiveType(urlType ?? 'all');
  }, [urlType]);

  const setActiveTypeAndSync = (type: ContentType | 'all') => {
    setActiveType(type);
    if (type === 'all') {
      const path = config.sectionParam
        ? `/admin/media/dashboard?section=${config.sectionParam}`
        : '/admin/media/dashboard';
      navigate(path, { replace: true });
    } else {
      navigate(`/admin/media/dashboard?type=${type}`, { replace: true });
    }
  };

  const loadItems = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await fetchAdminContent(signal);
      setItems(data);
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadItems(controller.signal);
    return () => controller.abort();
  }, []);

  const sectionItems = items.filter(i => config.types.some(t => t.value === i.contentType));

  const filtered = items.filter(item => {
    const inSection = config.types.some(t => t.value === item.contentType);
    const matchType = activeType === 'all' ? inSection : item.contentType === activeType;
    const matchSearch = !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.source || '').toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const openCreate = () => {
    setEditItem(null);
    const defaultType = activeType === 'all' ? config.types[0].value : activeType;
    setForm({ ...EMPTY_FORM, contentType: defaultType });
    setTagInput('');
    setShowForm(true);
  };

  const openEdit = (item: MediaItem) => {
    setEditItem(item);
    setForm({
      contentType: item.contentType as ContentType,
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl || '',
      externalLink: item.externalLink || '',
      videoUrl: item.videoUrl || '',
      source: item.source || '',
      author: item.author || '',
      category: item.category || '',
      location: item.location || '',
      date: item.date || '',
      price: item.price || '',
      salary: item.salary || '',
      company: item.company || '',
      platform: item.platform || '',
      readTime: item.readTime || '',
      tags: item.tags || [],
      isPublished: item.isPublished,
    });
    setTagInput('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      if (editItem) {
        await updateContent({ ...form, contentId: editItem.contentId });
        toast.success('Updated');
      } else {
        await createContent(form);
        toast.success('Created');
      }
      setShowForm(false);
      const controller = new AbortController();
      await loadItems(controller.signal);
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (item: MediaItem) => setDeleteConfirm(item);

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await deleteContent(deleteConfirm.contentType, deleteConfirm.contentId);
      toast.success('Deleted');
      setDeleteConfirm(null);
      const controller = new AbortController();
      await loadItems(controller.signal);
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const togglePublish = async (item: MediaItem) => {
    try {
      await updateContent({ contentType: item.contentType, contentId: item.contentId, isPublished: !item.isPublished });
      toast.success(item.isPublished ? 'Unpublished' : 'Published');
      const controller = new AbortController();
      await loadItems(controller.signal);
    } catch {
      toast.error('Failed');
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput('');
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <div className="mb-5 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">{config.title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{sectionItems.length} items · {config.subtitle}</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-yellow-400 text-black font-bold px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors text-sm">
          <Plus className="w-4 h-4" /> Add Content
        </button>
      </div>

      <div className="py-1">
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => setActiveTypeAndSync('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${activeType === 'all' ? 'bg-yellow-400 border-yellow-400 text-black' : 'border-gray-300 text-gray-600 hover:border-yellow-400'}`}>
            All ({sectionItems.length})
          </button>
          {config.types.map(t => {
            const count = items.filter(i => i.contentType === t.value).length;
            return (
              <button key={t.value} onClick={() => setActiveTypeAndSync(t.value)}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${activeType === t.value ? 'bg-yellow-400 border-yellow-400 text-black' : 'border-gray-300 text-gray-600 hover:border-yellow-400'}`}>
                {t.label}{count > 0 ? ` (${count})` : ''}
              </button>
            );
          })}
        </div>

        <div className="relative w-full max-w-xs mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search content..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400" />
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No content yet. Click "Add Content" to create your first item.</div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs uppercase tracking-wide">Title</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs uppercase tracking-wide">Type</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs uppercase tracking-wide">Source</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs uppercase tracking-wide">Date</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(item => (
                  <tr key={item.contentId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.imageUrl && <img src={item.imageUrl} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />}
                        <span className="font-medium text-gray-900 line-clamp-1">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-0.5 rounded capitalize">
                        {ALL_TYPE_DEFS.find(t => t.value === item.contentType)?.label || item.contentType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{item.source || item.company || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{item.date || new Date(item.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {item.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => togglePublish(item)} title={item.isPublished ? 'Unpublish' : 'Publish'}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-green-600 transition-colors">
                          {item.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 overflow-y-auto py-8">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 my-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">{editItem ? 'Edit Content' : 'Add New Content'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Content Type *</label>
                  <select value={form.contentType} onChange={e => setForm(f => ({ ...f, contentType: e.target.value as ContentType }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                    disabled={!!editItem}>
                    {config.types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Category</label>
                  <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                    placeholder="e.g. Defence, Agriculture" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                  placeholder="Content title" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400 resize-none"
                  placeholder="Short description or summary" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Source / Author</label>
                  <input value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                    placeholder="e.g. Reuters, IBEF" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Date</label>
                  <input value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                    placeholder="e.g. Jun 15, 2026" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Company / Organizer</label>
                  <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                    placeholder="Company or organizer name" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Location</label>
                  <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                    placeholder="City or Online" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Price (events)</label>
                  <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                    placeholder="Free / Rs.500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Salary (jobs)</label>
                  <input value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                    placeholder="Rs.40K–60K" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Platform</label>
                  <input value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                    placeholder="Zoom / YouTube" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Read Time (articles)</label>
                  <input value={form.readTime} onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                    placeholder="5 min read" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Image URL</label>
                <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                  placeholder="https://..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">External Link</label>
                  <input value={form.externalLink} onChange={e => setForm(f => ({ ...f, externalLink: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                    placeholder="https://..." />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Video URL</label>
                  <input value={form.videoUrl} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                    placeholder="YouTube URL" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Tags</label>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                    placeholder="Type tag + Enter" />
                  <button onClick={addTag} className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200">Add</button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        {tag}
                        <button onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setForm(f => ({ ...f, isPublished: !f.isPublished }))}
                  className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 ${form.isPublished ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${form.isPublished ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
                <span className="text-sm font-medium text-gray-700">{form.isPublished ? 'Published (visible on site)' : 'Draft (hidden from public)'}</span>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-yellow-400 text-black font-bold rounded-lg text-sm hover:bg-yellow-300 transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : <><Check className="w-4 h-4" /> {editItem ? 'Update' : 'Create'}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <h3 className="text-lg font-bold text-gray-900">Delete Content</h3>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Delete <span className="font-semibold">"{deleteConfirm.title}"</span>? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg text-sm hover:bg-red-700 disabled:opacity-50">
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
