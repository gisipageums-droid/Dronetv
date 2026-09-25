import React, { useState, useEffect, useMemo } from "react";
import { Search, ChevronDown, Filter, ChevronLeft, ChevronRight, Grid3x3, List, Heart, Eye, Send, Tag, Clock, MapPin, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./loadingscreen";
import { EVENTS_API, LAMBDA } from "../lib/apiConfig";
import { useUserAuth } from "./context/context";
import { withInlineAds } from "./common/adCreatives";

// Preview build at /events-v2 - same treatment as Products/Services/Job
// Board V2: real data from events-dashboard, nothing fabricated. The
// reference's per-event-type spec trio (Exhibitors/Visitors/B2B Meetings
// for expos, Speakers/Delegates/Networking for conferences, etc.) has zero
// structured backing - real events only carry category/eventDate/
// eventTime/location/shortDescription/image, no attendee or ticket-price
// counts at all (checked every key across all 7 real events). The 3-icon
// row here uses only real fields that exist on every event instead:
// Category, Time, and a live Status/Countdown (reusing the existing
// EventCountdown logic - itself real, computed from eventDate/eventTime).
// No tag-pill row either - no tags array exists on real events.

const PAGE_BG: React.CSSProperties = {
  backgroundColor: '#ffd84d',
  backgroundImage: 'radial-gradient(circle, rgba(174,139,24,0.2) 1.5px, transparent 2px)',
  backgroundSize: '56px 56px',
};
const BTN = 'rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold shadow-sm hover:border-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500';

interface EventItem {
  id: string;
  name: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  image: string;
  category: string;
  cleanUrl?: string;
  urlSlug?: string;
  templateSelection?: string;
  createdAt?: string;
}

const CAT_COLORS: Record<string, string> = {
  expo: '#dc2626', conference: '#0878e7', workshop: '#16a34a', webinar: '#7c3aed',
  competition: '#ea580c', meetup: '#be123c', summit: '#0369a1', general: '#475569',
};
function categoryColor(cat: string): string {
  return CAT_COLORS[cat.toLowerCase()] || '#475569';
}
const CAT_ICONS: Record<string, string> = {
  expo: '🏢', conference: '🎤', workshop: '🛠️', webinar: '💻',
  competition: '🏆', meetup: '🤝', summit: '🌐', general: '📅',
};
function catIcon(cat: string): string {
  return CAT_ICONS[cat.toLowerCase()] || '📅';
}

// Real eventDate is always "YYYY-MM-DD to YYYY-MM-DD" (or blank) - parses
// into the reference's white date-box (month + day-range + year), no
// fabricated fallback date when it's missing.
function parseDateBox(eventDate: string): { month: string; days: string; year: string } | null {
  if (!eventDate) return null;
  const parts = eventDate.split(' to ').map(s => s.trim()).filter(Boolean);
  const start = new Date(parts[0]);
  if (!Number.isFinite(start.getTime())) return null;
  const end = parts[1] ? new Date(parts[1]) : start;
  const month = start.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase();
  const days = Number.isFinite(end.getTime()) && end.getDate() !== start.getDate()
    ? `${start.getDate()}-${end.getDate()}`
    : `${start.getDate()}`;
  return { month, days, year: String(start.getFullYear()) };
}

function eventStatus(eventDate: string, eventTime: string): { label: string; tone: 'live' | 'upcoming' | 'ended' } | null {
  if (!eventDate) return null;
  try {
    const parts = eventDate.split(' to ').map(s => s.trim());
    const startStr = parts[0];
    const endStr = parts[1] || startStr;
    const timeParts = (eventTime || '').split(' - ').map(s => s.trim());
    const to24 = (t: string) => {
      if (!t) return '00:00';
      const clean = t.toUpperCase();
      const isPM = clean.includes('PM');
      let only = clean.replace('AM', '').replace('PM', '').trim();
      let [h, m] = only.split(':');
      if (!h) return '00:00';
      let hi = parseInt(h, 10);
      if (isPM && hi < 12) hi += 12;
      if (!isPM && hi === 12) hi = 0;
      return `${String(hi).padStart(2, '0')}:${(m || '00').padStart(2, '0')}`;
    };
    const start = new Date(`${startStr}T${to24(timeParts[0])}:00`).getTime();
    let end = new Date(`${endStr}T${to24(timeParts[1] || timeParts[0])}:00`).getTime();
    if (end < start) end += 24 * 60 * 60 * 1000;
    const now = Date.now();
    if (now > end) return { label: 'Ended', tone: 'ended' };
    if (now >= start && now <= end) return { label: 'Live Now', tone: 'live' };
    const days = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
    return { label: days > 0 ? `In ${days}d` : 'Today', tone: 'upcoming' };
  } catch {
    return null;
  }
}

const EventsPageV2: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('upcoming');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { isLogin } = useUserAuth();

  useEffect(() => {
    const controller = new AbortController();
    const url = EVENTS_API ? `${EVENTS_API}/events-dashboard?viewType=main` : `${LAMBDA.events}/events-dashboard?viewType=main`;
    fetch(url, { signal: controller.signal })
      .then(r => r.json())
      .then(data => {
        if (!data.success || !Array.isArray(data.cards)) { setAllEvents([]); return; }
        const seenIds = new Set<string>();
        const seenNames = new Set<string>();
        const events: EventItem[] = data.cards.filter((c: any) => {
          const id = (c.eventId || '').toLowerCase().trim();
          const name = (c.eventName || '').toLowerCase().trim();
          if (id && seenIds.has(id)) return false;
          if (name && seenNames.has(name)) return false;
          if (id) seenIds.add(id);
          if (name) seenNames.add(name);
          return true;
        }).map((c: any) => ({
          id: c.eventId,
          name: c.eventName,
          description: c.shortDescription || '',
          eventDate: c.eventDate || '',
          eventTime: c.eventTime || '',
          location: c.location || '',
          image: c.heroBannerImage || c.previewImage || c.thumbnailUrl || '',
          category: c.category || 'General',
          cleanUrl: c.cleanUrl,
          urlSlug: c.urlSlug,
          templateSelection: c.templateSelection,
          createdAt: c.createdAt,
        }));
        setAllEvents(events);
      })
      .catch(() => setAllEvents([]))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const categories = useMemo(() => Array.from(new Set(allEvents.map(e => e.category).filter(Boolean))), [allEvents]);

  const filtered = useMemo(() => {
    let list = allEvents;
    if (category !== 'All') list = list.filter(e => e.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.location.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      const da = new Date((a.eventDate || '').split(' to ')[0]).getTime();
      const db = new Date((b.eventDate || '').split(' to ')[0]).getTime();
      if (sortBy === 'past') return db - da;
      return (Number.isFinite(da) ? da : Infinity) - (Number.isFinite(db) ? db : Infinity);
    });
  }, [allEvents, category, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);
  const first = (page - 1) * perPage;
  const visible = filtered.slice(first, first + perPage);

  const resetFilters = () => { setCategory('All'); setSearch(''); setSortBy('upcoming'); setPage(1); };

  const goDetails = (e: EventItem) => {
    let slug = e.cleanUrl || e.name;
    if (slug && slug.startsWith('http')) slug = slug.split('/').pop() || e.name;
    if (e.templateSelection === '1') navigate(`/event/${slug}`);
    else navigate(`/events/${slug}`);
  };

  if (loading) return <LoadingScreen logoSrc="/images/logo.png" loadingText="Loading Events..." />;

  const upcomingCount = allEvents.filter(e => eventStatus(e.eventDate, e.eventTime)?.tone === 'upcoming').length;
  const liveCount = allEvents.filter(e => eventStatus(e.eventDate, e.eventTime)?.tone === 'live').length;

  const stats: [string, number, any][] = [
    ['Total Events', allEvents.length, CalendarDays],
    ['Categories', categories.length, Tag],
    ['Upcoming', upcomingCount, Clock],
    ['Live Now', liveCount, MapPin],
  ];

  return (
    <div style={PAGE_BG} className="min-h-screen">
      <div className="mt-[108px]" />

      <section aria-label="Event statistics" className="flex min-h-[77px] flex-wrap items-center gap-3 bg-[#07130f] px-3 py-2 text-white sm:px-6">
        {stats.map(([label, value, Icon]) => (
          <div key={label} className="flex w-[calc(50%-0.5rem)] shrink-0 items-center gap-2 border-r border-yellow-500/25 pr-2 sm:w-[calc(33.333%-0.7rem)] xl:w-auto xl:min-w-[130px] 2xl:min-w-[150px]">
            <Icon className="size-7 shrink-0 text-yellow-400" />
            <span className="flex flex-col"><small className="text-[10px] leading-tight">{label}</small><strong className="text-lg leading-tight text-yellow-300">{value.toLocaleString('en-IN')}</strong></span>
          </div>
        ))}
        <button type="button" onClick={() => navigate(isLogin ? "/event/select" : "/login")} className="flex h-9 shrink-0 items-center justify-center rounded-lg bg-[#ffdf00] px-4 text-sm font-extrabold text-black">+ List Your Event</button>
        <div className="ml-auto min-w-[200px] shrink-0 text-right">
          <strong className="block text-sm leading-tight text-yellow-300">India&rsquo;s #1 Drone Events Platform</strong>
          <span className="block text-[11px] text-sky-300">Expos | Conferences | Workshops</span>
        </div>
      </section>

      <section style={PAGE_BG} className="flex flex-wrap items-center gap-2 px-3 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
          <button type="button" onClick={() => setSidebarOpen(true)} className={`${BTN} flex shrink-0 items-center gap-1 text-xs lg:hidden`}>Filters <ChevronDown className="size-4" /></button>
          {['Event Type', 'Date'].map(label => (
            <button key={label} type="button" onClick={() => setSidebarOpen(true)} className={`${BTN} hidden shrink-0 items-center gap-4 text-xs lg:flex`}>{label} <ChevronDown className="size-4" /></button>
          ))}
        </div>
        <label className="flex h-10 w-full items-center overflow-hidden rounded-lg border border-slate-200 bg-white md:w-[min(100%,360px)]">
          <span className="sr-only">Search events</span>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search events — expos, conferences, workshops..." className="min-w-0 flex-1 px-3 text-sm outline-none" />
          <span className="flex h-full w-11 items-center justify-center bg-[#ffdf00]"><Search className="size-5" /></span>
        </label>
        <span className={`${BTN} hidden shrink-0 text-xs sm:block`}>Sort by</span>
        <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }} className={`${BTN} hidden shrink-0 items-center gap-4 text-xs sm:flex`}>
          <option value="upcoming">Upcoming first</option>
          <option value="past">Past first</option>
          <option value="name">A – Z</option>
        </select>
      </section>

      <main className="mx-auto grid max-w-[2100px] grid-cols-1 items-start gap-3 px-3 py-4 sm:px-6 lg:grid-cols-[255px_minmax(0,1fr)]">
        <aside className={`${sidebarOpen ? 'fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 lg:static lg:z-auto lg:bg-transparent lg:p-0' : 'hidden'} self-start lg:block`}>
          <div className={sidebarOpen ? 'mx-auto max-w-sm rounded-xl border border-yellow-300 bg-[#fffef0] p-4 shadow-sm lg:mx-0 lg:max-w-none' : 'rounded-xl border border-yellow-300 bg-[#fffef0] p-4 shadow-sm'}>
            <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <h2 className="flex items-center gap-2 text-lg font-extrabold"><Filter className="size-5 text-yellow-500" /> Filters</h2>
              <button type="button" onClick={() => { resetFilters(); setSidebarOpen(false); }} className="text-xs font-bold text-blue-800">Clear All</button>
            </div>

            <section className="mb-4 border-b border-slate-200 pb-3">
              <h3 className="mb-3 text-xs font-extrabold">EVENT TYPE</h3>
              <div className="flex flex-wrap gap-2">
                {['All', ...categories].map(cat => (
                  <button key={cat} type="button" onClick={() => { setCategory(cat); setPage(1); }} className={`rounded-full border px-3 py-1.5 text-[11px] capitalize ${category === cat ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:border-yellow-500'}`}>{cat}</button>
                ))}
              </div>
            </section>

            <button type="button" onClick={() => setSidebarOpen(false)} className="w-full rounded-lg bg-yellow-400 py-2 text-xs font-bold">Apply Filters</button>
            <button type="button" onClick={resetFilters} className="mt-2 w-full rounded-lg border bg-white py-2 text-xs font-bold">Reset Filters</button>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h1 className="text-base font-extrabold">{filtered.length} Drone, GIS &amp; AI Events</h1>
            <div className="flex gap-1">
              <button type="button" onClick={() => setView('grid')} aria-label="Grid view" className={`${view === 'grid' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><Grid3x3 className="size-4" /></button>
              <button type="button" onClick={() => setView('list')} aria-label="List view" className={`${view === 'list' ? 'bg-slate-900 text-white' : 'bg-white'} rounded border px-2 py-1`}><List className="size-4" /></button>
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="rounded-lg bg-white p-8 text-center">No events found.</p>
          ) : (
            <div className={`grid gap-3 ${view === 'list' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'}`}>
              {withInlineAds(visible, (e, i) => (
                <EventCardV2 key={`${e.id}-${i}`} event={e} onView={() => goDetails(e)} />
              ))}
            </div>
          )}

          <div className="mt-5 grid min-w-0 grid-cols-1 items-center gap-4 rounded-lg px-3 py-5 sm:px-5 lg:grid-cols-[1fr_auto_1fr]">
            <strong className="text-sm">Showing {filtered.length ? first + 1 : 0}–{Math.min(first + perPage, filtered.length)} of {filtered.length.toLocaleString('en-IN')} events</strong>
            <nav aria-label="events pagination" className="flex min-w-0 flex-wrap items-center justify-center gap-1.5">
              <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="grid h-9 min-w-9 place-items-center rounded-md border border-amber-300 bg-white text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="size-4" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1).reduce<(number | '...')[]>((acc, p, i, arr) => { if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('...'); acc.push(p); return acc; }, []).map((p, i) => p === '...' ? <span key={`e${i}`} className="px-1">…</span> : (
                <button key={p} type="button" onClick={() => setPage(p as number)} className={`grid h-9 min-w-9 place-items-center rounded-md border px-2 text-sm font-semibold shadow-sm ${page === p ? 'border-slate-900 bg-slate-900 text-white' : 'border-amber-300 bg-white text-slate-900 hover:bg-amber-50'}`}>{(p as number).toLocaleString('en-IN')}</button>
              ))}
              <button type="button" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="grid h-9 min-w-9 place-items-center rounded-md border border-amber-300 bg-white text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight className="size-4" /></button>
            </nav>
            <label className="flex items-center gap-1 text-sm lg:justify-self-end">Show
              <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }} className="ml-1 rounded-md border border-amber-300 bg-white px-2 py-1.5">
                {[6, 12, 24, 48].map(size => <option key={size} value={size}>{size} per page</option>)}
              </select>
            </label>
          </div>
        </section>
      </main>

      <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 bg-yellow-400 px-4 py-5 text-center text-sm font-semibold text-black lg:justify-between lg:px-6 lg:text-left">
        <strong>📣 Drone TV Expo 2026 - India&rsquo;s Biggest Drone Event</strong><span className="hidden lg:inline">│</span>
        <span>India&rsquo;s Drone Industry Platform</span><span className="hidden lg:inline">│</span>
        <span>Explore verified drone products &amp; services</span><span className="hidden lg:inline">│</span>
        <span>Connect │ Collaborate │ Grow</span>
      </footer>
    </div>
  );
};

// eventCard() - matches the reference's card anatomy (ribbon badge, heart,
// photo, date box, title, location, 3-stat row, buttons). No fabricated
// exhibitor/visitor/speaker/delegate counts or tag pills - see file-top
// note.
const EventCardV2: React.FC<{ event: EventItem; onView: () => void }> = ({ event, onView }) => {
  const icon = catIcon(event.category);
  const [imgErr, setImgErr] = useState(false);
  const [liked, setLiked] = useState(false);
  const showImg = event.image && !imgErr;
  const dateBox = parseDateBox(event.eventDate);
  const status = eventStatus(event.eventDate, event.eventTime);

  return (
    <article onClick={onView} className="flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative h-40 shrink-0 overflow-hidden bg-slate-100">
        {showImg ? (
          <img src={event.image} alt={event.name} loading="lazy" onError={() => setImgErr(true)} className="h-full w-full object-cover object-center" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">{icon}</div>
        )}
        <span className="absolute left-3 top-3 rounded px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white shadow" style={{ backgroundColor: categoryColor(event.category) }}>{event.category}</span>
        <button type="button" onClick={e => { e.stopPropagation(); setLiked(v => !v); }} aria-label={`Save ${event.name}`} aria-pressed={liked} className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white shadow ${liked ? 'text-red-600' : 'text-red-500'}`}>
          <Heart className="size-4" fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start gap-3">
          {dateBox && (
            <div className="flex shrink-0 flex-col items-center rounded-lg border border-slate-200 px-2.5 py-1.5 text-center leading-none">
              <span className="text-[10px] font-bold uppercase text-red-600">{dateBox.month}</span>
              <strong className="text-base font-extrabold text-slate-900">{dateBox.days}</strong>
              <span className="text-[9px] text-slate-500">{dateBox.year}</span>
            </div>
          )}
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-slate-900">{event.name}</h3>
            {event.location && <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500"><MapPin className="size-3 shrink-0" />{event.location}</p>}
          </div>
        </div>

        <p className="line-clamp-2 min-h-8 text-xs leading-[18px] text-slate-600">{event.description || 'No description available.'}</p>

        <div className="grid grid-cols-3 gap-1.5 border-y border-slate-100 py-2.5">
          <div className="flex min-w-0 items-center gap-1.5">
            <Tag className="size-4 shrink-0 text-slate-400" />
            <span className="min-w-0 leading-tight">
              <strong className="block truncate text-xs font-bold capitalize text-slate-900">{event.category}</strong>
              <small className="block truncate text-[10px] text-slate-500">Category</small>
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <Clock className="size-4 shrink-0 text-slate-400" />
            <span className="min-w-0 leading-tight">
              <strong className="block truncate text-xs font-bold text-slate-900">{event.eventTime || '—'}</strong>
              <small className="block truncate text-[10px] text-slate-500">Time</small>
            </span>
          </div>
          {status && (
            <div className="flex min-w-0 items-center gap-1.5">
              <CalendarDays className={`size-4 shrink-0 ${status.tone === 'live' ? 'text-red-500' : 'text-slate-400'}`} />
              <span className="min-w-0 leading-tight">
                <strong className={`block truncate text-xs font-bold ${status.tone === 'live' ? 'text-red-600' : 'text-slate-900'}`}>{status.label}</strong>
                <small className="block truncate text-[10px] text-slate-500">Status</small>
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2">
          <button type="button" onClick={e => { e.stopPropagation(); onView(); }} className="rounded-lg border border-slate-300 bg-white py-2 text-xs font-bold text-slate-900"><Eye className="mr-1 inline size-3.5" />View Details</button>
          <button type="button" onClick={e => { e.stopPropagation(); onView(); }} className="rounded-lg bg-red-600 py-2 text-xs font-bold text-white"><Send className="mr-1 inline size-3.5" />Register Now</button>
        </div>
      </div>
    </article>
  );
};

export default EventsPageV2;
