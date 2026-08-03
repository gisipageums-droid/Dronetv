import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, Eye, EyeOff, Search, X, Check, AlertTriangle, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchAdminContent, createContent, updateContent, deleteContent, MediaItem, ContentType } from '../../../lib/mediaApi';
import { ADMIN_API, LAMBDA } from '../../../lib/apiConfig';
import { uploadImageToS3 } from '../../webbuilder/src/pages/create-company/src/utils/s3Upload';
import AdminJobBoardDashboard from '../jobBoardAdmin/AdminJobBoardDashboard';

interface AppSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: string;
}

const MEDIA_TYPES: { value: ContentType; label: string }[] = [
  { value: 'news', label: 'News' },
  { value: 'magazine', label: 'Magazine' },
  { value: 'video', label: 'Video Spotlight' },
  { value: 'gallery', label: 'Gallery' },
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
  { value: 'networking', label: 'Networking' },
  { value: 'community', label: 'Community' },
];

const PARTNERSHIPS_TYPES: { value: ContentType; label: string }[] = [
  { value: 'manufacturer', label: 'Manufacturer' },
  { value: 'ai-company', label: 'AI Tech Company' },
  { value: 'event-organizer', label: 'Event Organizer' },
  { value: 'education-partner', label: 'Education Partner' },
  { value: 'industry-player', label: 'Industry Player' },
];

const ADS_TYPES: { value: ContentType; label: string }[] = [
  { value: 'ad', label: 'Advertisement' },
];

// Real site screens that carry ad zones, grouped exactly like the public nav —
// used to build the Target Pages checklist so admins pick a screen instead of
// typing a raw URL path.
const SITE_PAGES: { section: string; pages: { path: string; label: string }[] }[] = [
  {
    section: 'Events',
    pages: [
      { path: '/events', label: 'Events Hub' },
      { path: '/events/calendar', label: 'Event Calendar' },
      { path: '/events/expos', label: 'Expos' },
      { path: '/events/conferences', label: 'Conferences' },
      { path: '/events/workshops', label: 'Workshops' },
      { path: '/events/webinars', label: 'Webinars' },
      { path: '/events/meetups', label: 'Meetups' },
    ],
  },
  {
    section: 'Media',
    pages: [
      { path: '/media', label: 'Media Hub' },
      { path: '/media/news-pulse', label: 'News Pulse' },
      { path: '/media/magazine', label: 'Magazine' },
      { path: '/media/video-spotlight', label: 'Video Spotlight' },
      { path: '/media/gallery', label: 'Gallery' },
      { path: '/media/impact-stories', label: 'Impact Stories' },
      { path: '/media/market-intelligence', label: 'Market Intelligence' },
      { path: '/media/tech-trends', label: 'Tech Trends' },
      { path: '/media/press-releases', label: 'Press Releases' },
      { path: '/media/industry-reports', label: 'Industry Reports' },
    ],
  },
  {
    section: 'Partnerships',
    pages: [
      { path: '/partnerships', label: 'Partnerships Hub' },
      { path: '/partnerships/drone-manufacturers', label: 'Drone Manufacturers' },
      { path: '/partnerships/ai-tech', label: 'AI & Tech Companies' },
      { path: '/partnerships/event-organizers', label: 'Event Organizers' },
      { path: '/partnerships/education-partners', label: 'Education Partners' },
      { path: '/partnerships/industry-players', label: 'Industry Players' },
    ],
  },
  {
    section: 'Professionals',
    pages: [
      { path: '/professionals', label: 'Professionals Hub' },
      { path: '/professionals/job-board', label: 'Job Board' },
      { path: '/professionals/pilot-directory', label: 'Pilot Directory' },
      { path: '/professionals/certifications', label: 'Certifications' },
      { path: '/professionals/training', label: 'Training' },
      { path: '/professionals/networking', label: 'Networking' },
      { path: '/professionals/community', label: 'Community' },
      { path: '/professionals/career-path', label: 'Career Path' },
    ],
  },
  {
    section: 'Companies & Marketplace',
    pages: [
      { path: '/listed-companies', label: 'Listed Companies' },
      { path: '/products', label: 'Products' },
      { path: '/services', label: 'Services' },
    ],
  },
];

const ALL_TYPE_DEFS = [...MEDIA_TYPES, ...EVENTS_TYPES, ...PROFESSIONALS_TYPES, ...PARTNERSHIPS_TYPES, ...ADS_TYPES];

// Recommended creative dimensions per zone — shown as a hint on the ad form.
// The public site renders images with object-contain (never cropped), so a
// wrong-shaped upload just shows letterbox padding instead of looking broken,
// but matching these sizes gives the cleanest result.
const ZONE_IMAGE_HINT: Record<string, string> = {
  sidebar: '300×250px (or 300×600px for a tall creative)',
  inline: '1200×100px (wide thin banner)',
  sticky: '1200×64px (wide thin banner)',
  'detail-banner': '1200×90px (wide thin banner)',
};

const EVENTS_VALS = new Set(EVENTS_TYPES.map(t => t.value));
const PROFESSIONALS_VALS = new Set(PROFESSIONALS_TYPES.map(t => t.value));
const PARTNERSHIPS_VALS = new Set([...PARTNERSHIPS_TYPES.map(t => t.value), 'applications' as ContentType]);
const ADS_VALS = new Set(ADS_TYPES.map(t => t.value));

type SectionMode = 'media' | 'events' | 'professionals' | 'partnerships' | 'ads';

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
  ads: {
    title: 'Ads Manager',
    subtitle: 'Post and manage paid ad placements across site zones and pages',
    types: ADS_TYPES,
    sectionParam: 'ads-cms',
  },
};

function getMode(urlType: string | null, urlSection: string): SectionMode {
  if (urlType && ADS_VALS.has(urlType as ContentType)) return 'ads';
  if (urlType && PARTNERSHIPS_VALS.has(urlType as ContentType)) return 'partnerships';
  if (urlType && EVENTS_VALS.has(urlType as ContentType)) return 'events';
  if (urlType && PROFESSIONALS_VALS.has(urlType as ContentType)) return 'professionals';
  if (urlSection === 'ads-cms') return 'ads';
  if (urlSection === 'partnerships') return 'partnerships';
  if (urlSection === 'events-cms') return 'events';
  if (urlSection === 'professionals-cms') return 'professionals';
  return 'media';
}

type FieldKey = 'category' | 'source' | 'author' | 'date' | 'readTime' | 'videoUrl'
  | 'company' | 'location' | 'price' | 'salary' | 'platform'
  | 'zone' | 'targetPages' | 'startDate' | 'endDate' | 'packageType';

const FIELD_CONFIG: Record<ContentType, FieldKey[]> = {
  'news':                ['category', 'source', 'date', 'readTime'],
  'magazine':            ['category', 'source', 'author', 'date', 'readTime'],
  'video':               ['videoUrl', 'source', 'date'],
  'gallery':             ['category', 'location', 'date'],
  'impact-story':        ['category', 'source', 'author', 'date', 'readTime'],
  'market-intelligence': ['category', 'source', 'author', 'date', 'readTime'],
  'tech-trends':         ['category', 'source', 'author', 'date', 'readTime'],
  'press-release':       ['company', 'source', 'date'],
  'industry-report':     ['category', 'source', 'author', 'date', 'readTime'],
  'competition':         ['company', 'location', 'date', 'price', 'category'],
  'webinar':             ['source', 'company', 'platform', 'location', 'date', 'price', 'videoUrl'],
  'meetup':              ['company', 'location', 'date', 'price'],
  'job':                 ['company', 'source', 'location', 'salary', 'category', 'date'],
  'training':            ['company', 'location', 'price', 'category', 'date'],
  'certification':       ['company', 'location', 'price', 'category', 'date'],
  'networking':          ['category', 'location', 'company', 'date'],
  'community':           ['company', 'location', 'category'],
  'manufacturer':        ['company', 'location', 'category'],
  'ai-company':          ['company', 'location', 'category'],
  'event-organizer':     ['company', 'location', 'category'],
  'education-partner':   ['company', 'location', 'category'],
  'industry-player':     ['company', 'location', 'category'],
  'applications':        ['company', 'location', 'category'],
  'ad':                  ['zone', 'targetPages', 'startDate', 'endDate', 'packageType', 'company'],
};

const FIELD_LABELS: Partial<Record<ContentType, Partial<Record<FieldKey, string>>>> = {
  'webinar':          { source: 'Speaker', company: 'Organizer' },
  'competition':      { company: 'Organizer' },
  'meetup':           { company: 'Organizer' },
};

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
  zone: '',
  targetPages: [] as string[],
  startDate: '',
  endDate: '',
  packageType: '',
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
  const [uploadingImage, setUploadingImage] = useState(false);

  // Applications received to DroneTv.in (webinar registrations, job applications, contact-us, partner sign-ups)
  const [appSubmissions, setAppSubmissions] = useState<AppSubmission[]>([]);
  const [appLoading, setAppLoading] = useState(false);
  const [appError, setAppError] = useState(false);
  const [appSearch, setAppSearch] = useState('');

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
      // Exclude legacy "[Application] ..." job entries — leftover junk from
      // before the real Job Board ATS existed, not real job listings. They
      // shouldn't count toward the Job Listing tab or the All total.
      setItems(data.filter(i => !(i.contentType === 'job' && i.title.startsWith('[Application]'))));
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

  useEffect(() => {
    if (activeType !== 'applications') return;
    const controller = new AbortController();
    setAppLoading(true);
    setAppError(false);
    const url = ADMIN_API ? `${ADMIN_API}/contact` : `${LAMBDA.contact}/contact`;
    fetch(url, { signal: controller.signal })
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then(data => setAppSubmissions(data.items || []))
      .catch(err => { if (err.name !== 'AbortError') setAppError(true); })
      .finally(() => setAppLoading(false));
    return () => controller.abort();
  }, [activeType]);

  const filteredAppSubmissions = appSubmissions.filter(sub => {
    const q = appSearch.trim().toLowerCase();
    if (!q) return true;
    return (sub.name || '').toLowerCase().includes(q) ||
      (sub.email || '').toLowerCase().includes(q) ||
      (sub.message || '').toLowerCase().includes(q);
  });

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
      zone: item.zone || '',
      targetPages: item.targetPages || [],
      startDate: item.startDate || '',
      endDate: item.endDate || '',
      packageType: item.packageType || '',
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
    } catch (err: any) {
      toast.error(err?.message || 'Save failed');
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
          <h1 className="text-xl font-extrabold text-ink">
            {activeType === 'applications' ? 'Partner Applications' : config.title}
          </h1>
          <p className="text-sm text-ink-caption mt-0.5">
            {activeType === 'applications'
              ? `${appSubmissions.length} applications received`
              : `${sectionItems.length} items · ${config.subtitle}`}
          </p>
        </div>
        {activeType !== 'applications' && (
          <button onClick={openCreate} className="flex items-center gap-2 bg-brand-yellow text-ink font-bold px-4 py-2 rounded-lg hover:bg-brand-yellow-soft transition-colors text-sm">
            <Plus className="w-4 h-4" /> Add Content
          </button>
        )}
      </div>

      <div className="py-1">
        <div className="flex gap-0 bg-ink rounded-t-lg mb-4 overflow-x-auto">
          <button onClick={() => setActiveTypeAndSync('all')}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-[3px] transition-all ${activeType === 'all' ? 'text-white border-brand-yellow' : 'text-ink-caption border-transparent hover:text-white'}`}>
            All ({sectionItems.length})
          </button>
          {config.types.map(t => {
            const count = items.filter(i => i.contentType === t.value).length;
            return (
              <button key={t.value} onClick={() => setActiveTypeAndSync(t.value)}
                className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-[3px] transition-all ${activeType === t.value ? 'text-white border-brand-yellow' : 'text-ink-caption border-transparent hover:text-white'}`}>
                {t.label}{count > 0 ? ` (${count})` : ''}
              </button>
            );
          })}
          {mode === 'professionals' && (
            <button onClick={() => navigate('/admin/professional/dashboard')}
              className="px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-[3px] border-transparent text-ink-caption hover:text-white transition-all">
              Pilot Directory
            </button>
          )}
        </div>

        {activeType !== 'job' && (
          <div className="relative w-full max-w-xs mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-caption" />
            <input type="text" placeholder={activeType === 'applications' ? 'Search applications...' : 'Search content...'}
              value={activeType === 'applications' ? appSearch : search}
              onChange={e => activeType === 'applications' ? setAppSearch(e.target.value) : setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-ink-light rounded-lg text-sm focus:outline-none focus:border-brand-yellow" />
          </div>
        )}

        {activeType === 'job' ? (
          <AdminJobBoardDashboard />
        ) : activeType === 'applications' ? (
          appLoading ? (
            <div className="text-center py-16 text-ink-caption">Loading...</div>
          ) : appError ? (
            <div className="text-center py-16 text-status-error">Failed to load applications.</div>
          ) : filteredAppSubmissions.length === 0 ? (
            <div className="text-center py-16 text-ink-caption">No applications received yet.</div>
          ) : (
            <div className="bg-surface-card rounded-xl border border-ink-light shadow-sm overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead className="bg-ink-offwhite border-b border-ink-light">
                  <tr>
                    <th className="text-left px-4 py-3 font-bold text-ink-paragraph text-xs uppercase tracking-wide">Name</th>
                    <th className="text-left px-4 py-3 font-bold text-ink-paragraph text-xs uppercase tracking-wide">Contact</th>
                    <th className="text-left px-4 py-3 font-bold text-ink-paragraph text-xs uppercase tracking-wide">Message</th>
                    <th className="text-left px-4 py-3 font-bold text-ink-paragraph text-xs uppercase tracking-wide whitespace-nowrap">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-light">
                  {filteredAppSubmissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-ink-offwhite transition-colors">
                      <td className="px-4 py-3 font-medium text-ink align-top whitespace-nowrap">{sub.name}</td>
                      <td className="px-4 py-3 text-ink-caption text-xs align-top whitespace-nowrap">
                        <div>{sub.email}</div>
                        <div>{sub.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-ink-paragraph text-xs align-top max-w-md">{sub.message}</td>
                      <td className="px-4 py-3 text-ink-caption text-xs align-top whitespace-nowrap">
                        {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString('en-IN') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : loading ? (
          <div className="text-center py-16 text-ink-caption">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-ink-caption">No content yet. Click "Add Content" to create your first item.</div>
        ) : (
          <div className="bg-surface-card rounded-xl border border-ink-light shadow-sm overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="bg-ink-offwhite border-b border-ink-light">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-ink-paragraph text-xs uppercase tracking-wide">Title</th>
                  <th className="text-left px-4 py-3 font-bold text-ink-paragraph text-xs uppercase tracking-wide">Type</th>
                  <th className="text-left px-4 py-3 font-bold text-ink-paragraph text-xs uppercase tracking-wide">Source</th>
                  <th className="text-left px-4 py-3 font-bold text-ink-paragraph text-xs uppercase tracking-wide">Date</th>
                  <th className="text-left px-4 py-3 font-bold text-ink-paragraph text-xs uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 font-bold text-ink-paragraph text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-light">
                {filtered.map(item => {
                  const isApplication = item.title.startsWith('[Application]');
                  const displayTitle = isApplication ? item.title.replace('[Application] ', '') : item.title;
                  return (
                  <tr key={item.contentId} className={`hover:bg-ink-offwhite transition-colors ${isApplication ? 'bg-status-info/40' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.imageUrl && <img src={item.imageUrl} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />}
                        <div>
                          {isApplication && (
                            <span className="inline-block bg-status-info/15 text-status-info text-[10px] font-bold px-1.5 py-0.5 rounded mb-0.5 uppercase tracking-wide">Application</span>
                          )}
                          <span className="font-medium text-ink line-clamp-1 block">{displayTitle}</span>
                          {isApplication && item.company && (
                            <span className="text-xs text-ink-caption block">{item.company} · {item.source} · {item.author}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded capitalize ${isApplication ? 'bg-status-info/15 text-status-info' : 'bg-ink-light text-ink-paragraph'}`}>
                        {isApplication ? 'Job Application' : (ALL_TYPE_DEFS.find(t => t.value === item.contentType)?.label || item.contentType)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-caption text-xs">{isApplication ? (item.source || '—') : (item.source || item.company || '—')}</td>
                    <td className="px-4 py-3 text-ink-caption text-xs">{item.date || new Date(item.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.isPublished ? 'bg-status-success/15 text-status-success' : 'bg-ink-light text-ink-caption'}`}>
                        {item.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => togglePublish(item)} title={item.isPublished ? 'Unpublish' : 'Publish'}
                          className="p-1.5 rounded hover:bg-ink-light text-ink-caption hover:text-status-success transition-colors">
                          {item.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded hover:bg-ink-light text-ink-caption hover:text-status-info transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item)} className="p-1.5 rounded hover:bg-ink-light text-ink-caption hover:text-status-error transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[10000000] flex items-start justify-center bg-ink/60 overflow-y-auto py-8">
          <div className="bg-surface-card rounded-xl shadow-2xl w-full max-w-2xl mx-4 my-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink-light">
              <h2 className="text-lg font-bold text-ink">{editItem ? 'Edit Content' : 'Add New Content'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded hover:bg-ink-light">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div className="px-6 py-5 space-y-4">
              {/* Content type selector — top row */}
              <div>
                <label className="text-xs font-bold text-ink-paragraph uppercase tracking-wide block mb-1">Content Type *</label>
                <select value={form.contentType} onChange={e => setForm(f => ({ ...f, contentType: e.target.value as ContentType }))}
                  className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm text-ink bg-surface-card focus:outline-none focus:border-brand-yellow"
                  disabled={!!editItem}>
                  {config.types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              {/* Title — always required */}
              <div>
                <label className="text-xs font-bold text-ink-paragraph uppercase tracking-wide block mb-1">Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm text-ink bg-surface-card focus:outline-none focus:border-brand-yellow"
                  placeholder="Content title" required />
              </div>

              {/* Description — always shown */}
              <div>
                <label className="text-xs font-bold text-ink-paragraph uppercase tracking-wide block mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm text-ink bg-surface-card focus:outline-none focus:border-brand-yellow resize-none"
                  placeholder="Short description or summary" />
              </div>

              {/* Type-specific fields rendered in logical pairs */}
              {(() => {
                const fields = FIELD_CONFIG[form.contentType] ?? [];
                const has = (k: FieldKey) => fields.includes(k);
                const label = (k: FieldKey, fallback: string) =>
                  FIELD_LABELS[form.contentType]?.[k] ?? fallback;
                const inp = 'w-full border border-ink-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-yellow';
                const lbl = 'text-xs font-bold text-ink-paragraph uppercase tracking-wide block mb-1';

                const rows: React.ReactNode[] = [];

                // Category
                if (has('category')) {
                  rows.push(
                    <div key="category">
                      <label className={lbl}>Category</label>
                      <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                        className={inp} placeholder="e.g. Defence, Agriculture" />
                    </div>
                  );
                }

                // Source + Author (paired if both exist, else full-width)
                if (has('source') && has('author')) {
                  rows.push(
                    <div key="source-author" className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={lbl}>{label('source', 'Source')}</label>
                        <input value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                          className={inp} placeholder="e.g. Reuters, IBEF" />
                      </div>
                      <div>
                        <label className={lbl}>Author</label>
                        <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                          className={inp} placeholder="Author name" />
                      </div>
                    </div>
                  );
                } else if (has('source')) {
                  rows.push(
                    <div key="source">
                      <label className={lbl}>{label('source', 'Source')}</label>
                      <input value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                        className={inp} placeholder="e.g. Reuters, IBEF" />
                    </div>
                  );
                }

                // Company + Location (paired)
                if (has('company') && has('location')) {
                  rows.push(
                    <div key="company-location" className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={lbl}>{label('company', 'Company')}</label>
                        <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                          className={inp} placeholder="Company or organizer name" />
                      </div>
                      <div>
                        <label className={lbl}>Location</label>
                        <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                          className={inp} placeholder="City or Online" />
                      </div>
                    </div>
                  );
                } else if (has('company')) {
                  rows.push(
                    <div key="company">
                      <label className={lbl}>{label('company', 'Company')}</label>
                      <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                        className={inp} placeholder="Company or organizer name" />
                    </div>
                  );
                }

                // Platform + Date (paired)
                const hasPlatform = has('platform');
                const hasDate = has('date');
                if (hasPlatform && hasDate) {
                  rows.push(
                    <div key="platform-date" className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={lbl}>Platform</label>
                        <input value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                          className={inp} placeholder="Zoom / YouTube" />
                      </div>
                      <div>
                        <label className={lbl}>Date</label>
                        <input value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                          className={inp} placeholder="e.g. Jun 15, 2026" />
                      </div>
                    </div>
                  );
                } else if (hasPlatform) {
                  rows.push(
                    <div key="platform">
                      <label className={lbl}>Platform</label>
                      <input value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                        className={inp} placeholder="Zoom / YouTube" />
                    </div>
                  );
                } else if (hasDate) {
                  rows.push(
                    <div key="date">
                      <label className={lbl}>Date</label>
                      <input value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                        className={inp} placeholder="e.g. Jun 15, 2026" />
                    </div>
                  );
                }

                // Price + Salary (paired if both; otherwise single)
                if (has('price') && has('salary')) {
                  rows.push(
                    <div key="price-salary" className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={lbl}>Price</label>
                        <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                          className={inp} placeholder="Free / Rs.500" />
                      </div>
                      <div>
                        <label className={lbl}>Salary</label>
                        <input value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))}
                          className={inp} placeholder="Rs.40K–60K" />
                      </div>
                    </div>
                  );
                } else if (has('price')) {
                  rows.push(
                    <div key="price">
                      <label className={lbl}>Price</label>
                      <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                        className={inp} placeholder="Free / Rs.500" />
                    </div>
                  );
                } else if (has('salary')) {
                  rows.push(
                    <div key="salary">
                      <label className={lbl}>Salary</label>
                      <input value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))}
                        className={inp} placeholder="Rs.40K–60K" />
                    </div>
                  );
                }

                // Read Time (articles only)
                if (has('readTime')) {
                  rows.push(
                    <div key="readTime">
                      <label className={lbl}>Read Time</label>
                      <input value={form.readTime} onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))}
                        className={inp} placeholder="5 min read" />
                    </div>
                  );
                }

                // Zone + Package Tier (paired) — ads only
                if (has('zone') && has('packageType')) {
                  rows.push(
                    <div key="zone-packageType" className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={lbl}>Ad Zone</label>
                        <select value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))} className={inp}>
                          <option value="">Select zone...</option>
                          <option value="sidebar">Sidebar Rail (300×250 / 300×600)</option>
                          <option value="inline">Inline Feed Ad (1200×100)</option>
                          <option value="sticky">Bottom Sticky Strip (1200×64)</option>
                          <option value="detail-banner">Detail Banner (1200×90)</option>
                          <option value="sponsor-badge">Sponsor Badge (no image)</option>
                        </select>
                        {form.zone && ZONE_IMAGE_HINT[form.zone] && (
                          <p className="text-[11px] text-ink-caption mt-1">Upload an image close to {ZONE_IMAGE_HINT[form.zone]} — the full image is shown (not cropped), so a mismatched shape leaves visible padding.</p>
                        )}
                      </div>
                      <div>
                        <label className={lbl}>Package Tier</label>
                        <select value={form.packageType} onChange={e => setForm(f => ({ ...f, packageType: e.target.value }))} className={inp}>
                          <option value="">Select tier...</option>
                          <option value="reach">Reach</option>
                          <option value="scale">Scale</option>
                          <option value="brand">Brand</option>
                        </select>
                      </div>
                    </div>
                  );
                }

                // Target Pages — ads only. A checklist of real screens instead of
                // free-typed URL paths, grouped the same way as the public nav.
                if (has('targetPages')) {
                  const isAllPages = form.targetPages.includes('all');
                  const togglePage = (path: string) => {
                    setForm(f => ({
                      ...f,
                      targetPages: f.targetPages.includes(path)
                        ? f.targetPages.filter(p => p !== path)
                        : [...f.targetPages, path],
                    }));
                  };
                  rows.push(
                    <div key="targetPages">
                      <div className="flex items-center justify-between mb-1">
                        <label className={lbl}>Target Pages</label>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-ink-paragraph cursor-pointer">
                          <input type="checkbox" checked={isAllPages}
                            onChange={e => setForm(f => ({ ...f, targetPages: e.target.checked ? ['all'] : [] }))} />
                          All Pages
                        </label>
                      </div>
                      <div className={`border border-ink-light rounded-lg max-h-56 overflow-y-auto p-3 space-y-3 ${isAllPages ? 'opacity-50 pointer-events-none bg-ink-offwhite' : 'bg-surface-card'}`}>
                        {SITE_PAGES.map(group => (
                          <div key={group.section}>
                            <p className="text-[10px] font-bold text-ink-caption uppercase tracking-wide mb-1">{group.section}</p>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                              {group.pages.map(p => (
                                <label key={p.path} className="flex items-center gap-1.5 text-xs text-ink-paragraph cursor-pointer">
                                  <input type="checkbox" checked={form.targetPages.includes(p.path)}
                                    onChange={() => togglePage(p.path)} disabled={isAllPages} />
                                  {p.label}
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      {!isAllPages && (
                        <p className="text-[11px] text-ink-caption mt-1">{form.targetPages.length} page(s) selected</p>
                      )}
                    </div>
                  );
                }

                // Start Date + End Date (paired) — ads only
                if (has('startDate') && has('endDate')) {
                  rows.push(
                    <div key="startDate-endDate" className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={lbl}>Start Date</label>
                        <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                          className={inp} />
                      </div>
                      <div>
                        <label className={lbl}>End Date</label>
                        <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                          className={inp} />
                      </div>
                    </div>
                  );
                }

                return rows;
              })()}

              {/* Image — real upload for ads, plain URL for every other content type */}
              {form.contentType === 'ad' ? (
                <div>
                  <label className="text-xs font-bold text-ink-paragraph uppercase tracking-wide block mb-1">Ad Creative Image</label>
                  {form.imageUrl && (
                    <img src={form.imageUrl} alt="Ad creative preview" className="w-full max-h-40 object-contain rounded-lg border border-ink-light mb-2 bg-ink-offwhite" />
                  )}
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-ink-light rounded-lg py-3 cursor-pointer hover:border-brand-yellow transition-colors text-sm font-semibold text-ink-caption">
                    <Upload className="w-4 h-4" />
                    {uploadingImage ? 'Uploading...' : form.imageUrl ? 'Replace Image' : 'Upload Image'}
                    <input type="file" accept="image/*" className="hidden" disabled={uploadingImage}
                      onChange={async e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingImage(true);
                        try {
                          const url = await uploadImageToS3(file);
                          setForm(f => ({ ...f, imageUrl: url }));
                        } catch {
                          toast.error('Image upload failed');
                        } finally {
                          setUploadingImage(false);
                        }
                      }} />
                  </label>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-ink-paragraph uppercase tracking-wide block mb-1">Image URL</label>
                  <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                    className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm text-ink bg-surface-card focus:outline-none focus:border-brand-yellow"
                    placeholder="https://..." />
                </div>
              )}

              {/* External Link + Video URL (video URL only for types that need it) */}
              {(FIELD_CONFIG[form.contentType] ?? []).includes('videoUrl') ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-ink-paragraph uppercase tracking-wide block mb-1">External Link</label>
                    <input value={form.externalLink} onChange={e => setForm(f => ({ ...f, externalLink: e.target.value }))}
                      className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm text-ink bg-surface-card focus:outline-none focus:border-brand-yellow"
                      placeholder="https://..." />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink-paragraph uppercase tracking-wide block mb-1">Video URL</label>
                    <input value={form.videoUrl} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
                      className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm text-ink bg-surface-card focus:outline-none focus:border-brand-yellow"
                      placeholder="YouTube URL" />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-ink-paragraph uppercase tracking-wide block mb-1">External Link</label>
                  <input value={form.externalLink} onChange={e => setForm(f => ({ ...f, externalLink: e.target.value }))}
                    className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm text-ink bg-surface-card focus:outline-none focus:border-brand-yellow"
                    placeholder="https://..." />
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="text-xs font-bold text-ink-paragraph uppercase tracking-wide block mb-1">Tags</label>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    className="flex-1 border border-ink-light rounded-lg px-3 py-2 text-sm text-ink bg-surface-card focus:outline-none focus:border-brand-yellow"
                    placeholder="Type tag + Enter" />
                  <button onClick={addTag} className="px-3 py-2 bg-ink-light rounded-lg text-sm font-medium hover:bg-ink-light">Add</button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 bg-ink-light text-ink-paragraph text-xs font-semibold px-2 py-0.5 rounded-full">
                        {tag}
                        <button onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Publish toggle */}
              <div className="flex items-center gap-2">
                <button onClick={() => setForm(f => ({ ...f, isPublished: !f.isPublished }))}
                  className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 ${form.isPublished ? 'bg-status-success' : 'bg-ink-light'}`}>
                  <div className={`w-4 h-4 bg-surface-card rounded-full mx-1 transition-transform ${form.isPublished ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
                <span className="text-sm font-medium text-ink-paragraph">{form.isPublished ? 'Published (visible on site)' : 'Draft (hidden from public)'}</span>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-ink-light flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-ink-light rounded-lg text-sm font-medium text-ink-paragraph hover:bg-ink-offwhite">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-brand-yellow text-ink font-bold rounded-lg text-sm hover:bg-brand-yellow-soft transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : <><Check className="w-4 h-4" /> {editItem ? 'Update' : 'Create'}</>}
              </button>
            </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-ink/60 z-[10000000] flex items-center justify-center p-4">
          <div className="bg-surface-card rounded-xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-6 h-6 text-status-error flex-shrink-0" />
              <h3 className="text-lg font-bold text-ink">Delete Content</h3>
            </div>
            <p className="text-sm text-ink-paragraph mb-5">
              Delete <span className="font-semibold">"{deleteConfirm.title}"</span>? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border border-ink-light rounded-lg text-sm font-medium text-ink-paragraph hover:bg-ink-offwhite">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={deleting}
                className="px-4 py-2 bg-status-error text-white font-bold rounded-lg text-sm hover:bg-status-error disabled:opacity-50">
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
