import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchAdminContent, updateContent, deleteContent, MediaItem, ContentType } from '../../../lib/mediaApi';
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

export default function MyContentManager() {
  const { type } = useParams<{ type: string }>();
  const contentType = (type || 'news') as ContentType;
  const typeLabel = TYPE_LABELS[contentType] || contentType;
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || '';

  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    fetchAdminContent(undefined, contentType)
      .then(all => setItems(all.filter(i => i.author === userId || i.userId === userId)))
      .catch(() => toast.error('Failed to load your posts'))
      .finally(() => setLoading(false));
  }, [contentType, userId]);

  useEffect(() => { load(); }, [load]);

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

  return (
    <div className="min-h-screen bg-[#F4F5F7] p-4 md:p-6">
      <div className="mb-5 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">My {typeLabel}s</h1>
          <p className="text-sm text-gray-500 mt-0.5">{items.length} items · Manage what you've posted — create new, publish, or remove.</p>
        </div>
        <PostContentCTA contentType={contentType} typeLabel={typeLabel} onSuccess={load} variant="button" />
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm text-center py-16 text-gray-400">Loading...</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm text-center py-16 text-gray-400">
          No content yet. Click "Add Content" to create your first item.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item.contentId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.imageUrl && <img src={item.imageUrl} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />}
                      <span className="font-medium text-gray-900 line-clamp-1">{item.title}</span>
                    </div>
                  </td>
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
    </div>
  );
}
