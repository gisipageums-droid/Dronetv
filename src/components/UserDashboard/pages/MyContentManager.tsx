import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Eye, EyeOff, Trash2, Edit, Search, X, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchAdminContent, updateContent, deleteContent, MediaItem, ContentType } from '../../../lib/mediaApi';
import { FIELD_CONFIG, FIELD_LABELS, FIELD_PLACEHOLDER, FIELD_TYPE, FieldKey } from '../../../lib/contentFieldConfig';
import { useUserAuth } from '../../context/context';
import PostContentCTA from '../../common/PostContentCTA';

const TYPE_LABELS: Record<string, string> = {
  job: 'Job Listing', certification: 'Certification', training: 'Training Program',
  networking: 'Networking Post', community: 'Community Post',
  news: 'News Article', magazine: 'Magazine Feature', video: 'Video', gallery: 'Photo',
  'impact-story': 'Impact Story', 'market-intelligence': 'Market Report', 'tech-trends': 'Tech Trend',
  'press-release': 'Press Release', 'industry-report': 'Industry Report',
  competition: 'Competition', webinar: 'Webinar', meetup: 'Meetup',
  manufacturer: 'Manufacturer Listing', 'ai-company': 'AI/Tech Company Listing',
  'event-organizer': 'Event Organizer Listing', 'education-partner': 'Education Partner Listing',
  'industry-player': 'Industry Player Listing',
};

const DEFAULT_LABEL: Record<FieldKey, string> = {
  category: 'Category', source: 'Source', author: 'Author', date: 'Date', readTime: 'Read Time',
  videoUrl: 'Video URL', company: 'Company', location: 'Location', price: 'Price', salary: 'Salary',
  platform: 'Platform', zone: 'Zone', targetPages: 'Target Pages', startDate: 'Start Date',
  endDate: 'End Date', packageType: 'Package Type',
};

interface EditForm {
  title: string;
  description: string;
  imageUrl: string;
  externalLink: string;
  isPublished: boolean;
  [key: string]: any;
}

export default function MyContentManager() {
  const { type } = useParams<{ type: string }>();
  const contentType = (type || 'news') as ContentType;
  const typeLabel = TYPE_LABELS[contentType] || contentType;
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || '';
  const extraFields = FIELD_CONFIG[contentType] || [];

  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [editItem, setEditItem] = useState<MediaItem | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    fetchAdminContent(undefined, contentType)
      .then(all => setItems(all.filter(i => i.author === userId || i.userId === userId)))
      .catch(() => toast.error('Failed to load your posts'))
      .finally(() => setLoading(false));
  }, [contentType, userId]);

  useEffect(() => { load(); }, [load]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(i =>
      i.title.toLowerCase().includes(q) ||
      (i.source || '').toLowerCase().includes(q) ||
      (i.company || '').toLowerCase().includes(q)
    );
  }, [items, search]);

  const togglePublish = async (item: MediaItem) => {
    try {
      await updateContent({ contentType: item.contentType, contentId: item.contentId, isPublished: !item.isPublished });
      toast.success(item.isPublished ? 'Unpublished' : 'Published');
      load();
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (item: MediaItem) => {
    try {
      await deleteContent(item.contentType as ContentType, item.contentId);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const fieldLabel = (key: FieldKey) => FIELD_LABELS[contentType]?.[key] || DEFAULT_LABEL[key];

  const openEdit = (item: MediaItem) => {
    setEditItem(item);
    const form: EditForm = {
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl || '',
      externalLink: item.externalLink || '',
      isPublished: item.isPublished,
    };
    extraFields.forEach(key => { form[key] = (item as any)[key] || ''; });
    setEditForm(form);
  };

  const closeEdit = () => { setEditItem(null); setEditForm(null); };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem || !editForm) return;
    if (!editForm.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const payload: any = {
        contentType: editItem.contentType,
        contentId: editItem.contentId,
        title: editForm.title,
        description: editForm.description,
        imageUrl: editForm.imageUrl,
        externalLink: editForm.externalLink,
        isPublished: editForm.isPublished,
      };
      extraFields.forEach(key => { payload[key] = editForm[key] || ''; });
      await updateContent(payload);
      toast.success('Updated');
      closeEdit();
      load();
    } catch (err: any) {
      toast.error(err?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] p-4 md:p-6">
      <div className="mb-5 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">My {typeLabel}s</h1>
          <p className="text-sm text-gray-500 mt-0.5">{items.length} items · Manage what you've posted — create new, edit, publish, or remove.</p>
        </div>
        <PostContentCTA contentType={contentType} typeLabel={typeLabel} onSuccess={load} variant="button" />
      </div>

      {!loading && items.length > 0 && (
        <div className="relative w-full max-w-xs mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search content..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400" />
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm text-center py-16 text-gray-400">Loading...</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm text-center py-16 text-gray-400">
          No content yet. Click "Add Content" to create your first item.
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm text-center py-16 text-gray-400">
          No content found matching "{search}"
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs uppercase tracking-wide">Source</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map(item => (
                <tr key={item.contentId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.imageUrl && <img src={item.imageUrl} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />}
                      <span className="font-medium text-gray-900 line-clamp-1">{item.title}</span>
                    </div>
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
                      <button onClick={() => openEdit(item)} title="Edit"
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item)} title="Delete"
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors">
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

      {editItem && editForm && (
        <div className="fixed inset-0 z-[10000000] flex items-start justify-center bg-black/60 overflow-y-auto py-8">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 my-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Edit {typeLabel}</h2>
              <button onClick={closeEdit} className="p-1.5 rounded hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Title *</label>
                  <input value={editForm.title} onChange={e => setEditForm(f => f && ({ ...f, title: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:border-yellow-400"
                    placeholder="Content title" required />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Description</label>
                  <textarea value={editForm.description} onChange={e => setEditForm(f => f && ({ ...f, description: e.target.value }))}
                    rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:border-yellow-400 resize-none"
                    placeholder="Short description or summary" />
                </div>

                {extraFields.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {extraFields.filter(k => k !== 'targetPages').map(key => (
                      <div key={key}>
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">{fieldLabel(key)}</label>
                        <input
                          type={FIELD_TYPE[key] === 'date' ? 'date' : 'text'}
                          value={editForm[key] || ''}
                          onChange={e => setEditForm(f => f && ({ ...f, [key]: e.target.value }))}
                          placeholder={FIELD_PLACEHOLDER[key]}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:border-yellow-400" />
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">Image URL</label>
                  <input value={editForm.imageUrl} onChange={e => setEditForm(f => f && ({ ...f, imageUrl: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:border-yellow-400"
                    placeholder="https://..." />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">External Link</label>
                  <input value={editForm.externalLink} onChange={e => setEditForm(f => f && ({ ...f, externalLink: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:border-yellow-400"
                    placeholder="https://..." />
                </div>

                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setEditForm(f => f && ({ ...f, isPublished: !f.isPublished }))}
                    className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 ${editForm.isPublished ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${editForm.isPublished ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                  <span className="text-sm font-medium text-gray-700">{editForm.isPublished ? 'Published (visible on site)' : 'Draft (hidden from public)'}</span>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button type="button" onClick={closeEdit} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 bg-yellow-400 text-black font-bold rounded-lg text-sm hover:bg-yellow-300 transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : <><Check className="w-4 h-4" /> Update</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
