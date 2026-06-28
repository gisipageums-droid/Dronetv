import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Calendar, MapPin, Clock, Users, SlidersHorizontal, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EVENTS_API, LAMBDA } from '../lib/apiConfig';

const EventCountdown = ({ eventDate, eventTime }: { eventDate: string; eventTime: string }) => {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isEventStarted: false, isEventExpired: false });

  useEffect(() => {
    const updateCountdown = () => {
      if (!eventDate || !eventTime) return;
      try {
        const eventDateParts = eventDate.split(" to ");
        const startDateStr = eventDateParts[0].trim();
        const endDateStr = eventDateParts[1] ? eventDateParts[1].trim() : startDateStr;
        const eventTimeParts = eventTime.split(" - ");
        const startTimeStr = eventTimeParts[0].trim();
        const endTimeStr = eventTimeParts[1] ? eventTimeParts[1].trim() : startTimeStr;

        const convertTo24Hour = (timeStr: string) => {
          if (!timeStr) return "00:00";
          const cleanStr = timeStr.trim().toUpperCase();
          const isPM = cleanStr.includes("PM");
          const isAM = cleanStr.includes("AM");
          let timeOnly = cleanStr.replace("AM", "").replace("PM", "").trim();
          let [hours, minutes] = timeOnly.split(":");
          if (!hours) return "00:00";
          if (!minutes) minutes = "00";
          let hoursInt = parseInt(hours, 10);
          if (isPM && hoursInt < 12) hoursInt += 12;
          if (isAM && hoursInt === 12) hoursInt = 0;
          return `${hoursInt.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        };

        const startTime24 = convertTo24Hour(startTimeStr);
        const endTime24 = convertTo24Hour(endTimeStr);
        const startDateTime = new Date(`${startDateStr}T${startTime24}:00`).getTime();
        let endDateTime = new Date(`${endDateStr}T${endTime24}:00`).getTime();
        if (endDateTime < startDateTime) endDateTime += 24 * 60 * 60 * 1000;
        if (startDateTime === endDateTime) endDateTime += 60 * 60 * 1000;
        const now = new Date().getTime();

        if (now > endDateTime) {
          setCountdown(prev => ({ ...prev, isEventExpired: true, isEventStarted: false }));
        } else if (now >= startDateTime && now <= endDateTime) {
          setCountdown(prev => ({ ...prev, isEventStarted: true, isEventExpired: false }));
        } else {
          const distance = startDateTime - now;
          setCountdown({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
            isEventStarted: false,
            isEventExpired: false,
          });
        }
      } catch { /* ignore */ }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [eventDate, eventTime]);

  if (countdown.isEventExpired) {
    return <div className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">Event Ended</div>;
  }
  if (countdown.isEventStarted) {
    return (
      <div className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded flex items-center gap-1 animate-pulse">
        <div className="w-2 h-2 bg-green-600 rounded-full animate-ping" />
        Live Now
      </div>
    );
  }
  return (
    <div className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded flex items-center gap-1">
      <Clock className="h-3 w-3" />
      {countdown.days > 0 ? `${countdown.days}d ` : ""}{countdown.hours}h {countdown.minutes}m {countdown.seconds}s
    </div>
  );
};

const EventsPage = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const eventsPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(EVENTS_API ? `${EVENTS_API}/events-dashboard?viewType=main` : `${LAMBDA.events}/events-dashboard?viewType=main`);
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        if (data.success && data.cards) {
          const transformedEvents = data.cards.map((card) => ({
            id: card.eventId,
            name: card.eventName,
            description: card.shortDescription,
            date: card.eventDate,
            location: card.location,
            time: card.eventTime,
            attendees: "Not specified",
            image: card.heroBannerImage || card.previewImage || "/images/default-event-image.png",
            type: card.category || "General",
            status: card.isApproved ? "upcoming" : "pending",
            price: "Free",
            featured: false,
            cleanUrl: card.cleanUrl,
            templateSelection: card.templateSelection,
            eventDate: card.eventDate,
            eventTime: card.eventTime,
          }));
          const seenEIds = new Set<string>();
          const seenENames = new Set<string>();
          const uniqueEvents = transformedEvents.filter((e: any) => {
            const id = (e.id || '').toLowerCase().trim();
            const name = (e.name || '').toLowerCase().trim();
            if (id && seenEIds.has(id)) return false;
            if (name && seenENames.has(name)) return false;
            if (id) seenEIds.add(id);
            if (name) seenENames.add(name);
            return true;
          });
          setAllEvents(uniqueEvents);
        } else {
          setAllEvents([]);
        }
      } catch {
        setAllEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleCardClick = (event) => {
    let slug = event.cleanUrl || event.name;
    if (slug && slug.startsWith("http")) {
      slug = slug.split("/").pop() || event.name;
    }
    if (event.templateSelection === "1") {
      navigate(`/event/${slug}`);
    } else {
      navigate(`/events/${slug}`);
    }
  };

  const sortOptions = [
    { value: "upcoming", label: "Sort by Upcoming" },
    { value: "past", label: "Sort by Past Events" },
    { value: "name", label: "Sort by Name" },
    { value: "date", label: "Sort by Date" },
  ];

  useEffect(() => {
    let filtered = allEvents;
    if (selectedType !== "All") {
      filtered = filtered.filter((event) => event.type === selectedType);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "upcoming": return a.status !== b.status ? (a.status === "upcoming" ? -1 : 1) : a.name?.localeCompare(b.name);
        case "past": return a.status !== b.status ? (a.status === "past" ? -1 : 1) : b.name?.localeCompare(a.name);
        case "name": return a.name?.localeCompare(b.name);
        default: return 0;
      }
    });
    setFilteredEvents(filtered);
    setCurrentPage(1);
  }, [selectedType, sortBy, searchQuery, allEvents]);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const eventTypes = ['All', ...Array.from(new Set(allEvents.map((e: any) => e.type).filter(Boolean)))];

  const getTypeColor = (type) => {
    switch (type) {
      case "Conference": return "bg-black";
      case "Summit": return "bg-gray-900";
      case "Workshop": return "bg-gray-800";
      case "Expo": return "bg-gray-700";
      case "Webinar": return "bg-gray-600";
      default: return "bg-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="pt-[104px] min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mx-auto" />
          <p className="mt-4 text-gray-500 text-sm">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          <h1 className="text-base font-extrabold text-white m-0">Events <span className="text-yellow-400">Calendar</span> <span className="text-xs font-semibold text-white/50 ml-2">{allEvents.length || '0'} Events</span></h1>
          <button
            onClick={() => navigate("/event/select")}
            className="px-3 py-1.5 text-xs font-semibold text-black bg-yellow-400 rounded-lg hover:bg-yellow-300 transition flex-shrink-0"
          >
            List your Event
          </button>
        </div>
      </div>

      <style>{`
.ev-wrap{max-width:1280px;margin:0 auto;padding:20px 22px}
.ev-layout{display:grid;grid-template-columns:240px 1fr;gap:16px;align-items:start}
.ev-sidebar{background:#fff;border:1px solid #E5E5E5;border-radius:8px;padding:14px;box-shadow:0 2px 12px rgba(0,0,0,.06);position:sticky;top:120px}
.ev-sidebar-title{font-size:13px;font-weight:800;color:#0A0A0A;margin-bottom:14px;display:flex;align-items:center;gap:6px}
.ev-filter-grp{margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #F0F0F0}
.ev-filter-grp:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
.ev-fl-label{font-size:10px;font-weight:700;color:#777;text-transform:uppercase;letter-spacing:.5px;margin-bottom:7px}
.ev-chip{padding:4px 10px;border-radius:14px;font-size:11.5px;font-weight:600;cursor:pointer;transition:all .12s;white-space:nowrap;border:1.5px solid #E5E5E5;background:#fff;color:#333;font-family:inherit}
.ev-chip.active{background:#0A0A0A;color:#F5C518;border-color:#0A0A0A}
.ev-chips{display:flex;gap:5px;flex-wrap:wrap}
.ev-main{min-width:0}
.ev-search-bar{background:#fff;border:1px solid #E5E5E5;border-radius:8px;padding:10px 12px;box-shadow:0 1px 6px rgba(0,0,0,.06);margin-bottom:12px;display:flex;align-items:center;gap:8px}
.ev-search-bar input{border:none;background:none;font-size:13px;width:100%;outline:none;color:#1A1A1A;font-family:inherit}
.ev-resbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:7px}
.ev-sort{padding:6px 10px;border:1.5px solid #E5E5E5;border-radius:8px;font-size:12.5px;color:#444;background:#fff;cursor:pointer;font-family:inherit}
.ev-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:13px}
.ev-empty{padding:64px 0;text-align:center}
.ev-pages{display:flex;justify-content:center;margin-top:28px;gap:6px;flex-wrap:wrap}
.ev-page-btn{padding:7px 13px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid #E5E5E5;background:#fff;color:#444;font-family:inherit}
.ev-page-btn.active{background:#0A0A0A;color:#F5C518;border-color:#0A0A0A}
.ev-filter-toggle{display:none}
@media(max-width:960px){
  .ev-layout{grid-template-columns:1fr}
  .ev-sidebar{position:static;display:none}
  .ev-sidebar.open{display:block}
  .ev-filter-toggle{display:flex;align-items:center;gap:6px;padding:7px 12px;background:#0A0A0A;color:#F5C518;border:none;border-radius:8px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:10px}
}
@media(max-width:600px){
  .ev-wrap{padding:12px 14px}
  .ev-grid{grid-template-columns:1fr}
}
`}</style>

      {/* Main content with sidebar */}
      <div className="ev-wrap">
        <div className="ev-layout">
          {/* Sidebar */}
          <aside className={`ev-sidebar${sidebarOpen ? ' open' : ''}`}>
            <div className="ev-sidebar-title"><SlidersHorizontal size={14} /> Filters</div>

            {/* Search */}
            <div className="ev-filter-grp">
              <div className="ev-fl-label">Search</div>
              <div className="ev-search-bar">
                <Search size={14} color="#999" />
                <input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                />
                {searchQuery && <X size={13} color="#999" style={{cursor:'pointer',flexShrink:0}} onClick={() => setSearchQuery('')} />}
              </div>
            </div>

            {/* Event Type */}
            <div className="ev-filter-grp">
              <div className="ev-fl-label">Event Type</div>
              <div className="ev-chips">
                {eventTypes.map(t => (
                  <button key={t} className={`ev-chip${selectedType === t ? ' active' : ''}`} onClick={() => { setSelectedType(t); setCurrentPage(1); }}>
                    {t === 'All' ? 'All Types' : t}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="ev-filter-grp">
              <div className="ev-fl-label">Sort By</div>
              <div className="ev-chips">
                {sortOptions.map(opt => (
                  <button key={opt.value} className={`ev-chip${sortBy === opt.value ? ' active' : ''}`} onClick={() => { setSortBy(opt.value); setCurrentPage(1); }}>
                    {opt.label.replace('Sort by ', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear */}
            {(selectedType !== 'All' || searchQuery || sortBy !== 'upcoming') && (
              <button
                onClick={() => { setSelectedType('All'); setSearchQuery(''); setSortBy('upcoming'); setCurrentPage(1); }}
                style={{width:'100%',padding:'7px',borderRadius:'8px',fontSize:'12px',fontWeight:700,background:'#0A0A0A',color:'#F5C518',border:'none',cursor:'pointer',fontFamily:'inherit'}}
              >
                Clear All Filters
              </button>
            )}
          </aside>

          {/* Main */}
          <div className="ev-main">
            {/* Mobile filter toggle */}
            <button className="ev-filter-toggle" onClick={() => setSidebarOpen(o => !o)}>
              <SlidersHorizontal size={14} /> Filters {(selectedType !== 'All' || searchQuery) ? '(active)' : ''}
            </button>

            <div className="ev-resbar">
              <span style={{fontSize:'13px',color:'#666'}}>{filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}</span>
              {totalPages > 1 && <span style={{fontSize:'12px',color:'#999'}}>Page {currentPage} of {totalPages}</span>}
            </div>

            {currentEvents.length === 0 ? (
              <div className="ev-empty">
                <div style={{background:'#fff',border:'1px solid #E5E5E5',borderRadius:'12px',padding:'48px 32px',maxWidth:'360px',margin:'0 auto',textAlign:'center'}}>
                  <Search size={40} color="#ccc" style={{margin:'0 auto 12px'}} />
                  <p style={{fontWeight:700,color:'#333',marginBottom:4}}>No events found</p>
                  <p style={{fontSize:'13px',color:'#999'}}>Try adjusting your filters</p>
                </div>
              </div>
            ) : (
              <div className="ev-grid">
                {currentEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleCardClick(event)}
                    className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                  >
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img src={event.image} alt={event.name} className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className={`absolute top-3 right-3 ${getTypeColor(event.type)} text-white px-2 py-1 rounded-full text-xs font-bold`}>{event.type}</div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2 line-clamp-2">{event.name}</h3>
                      {event.description && <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{event.description}</p>}
                      <div className="space-y-1 text-xs text-gray-500">
                        {event.date && <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3 flex-shrink-0" />{event.date}</div>}
                        {event.location && <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3 flex-shrink-0" />{event.location}</div>}
                        {event.attendees && event.attendees !== "Not specified" && <div className="flex items-center gap-1.5"><Users className="h-3 w-3 flex-shrink-0" />{event.attendees}</div>}
                      </div>
                      {event.eventDate && event.eventTime && <div className="mt-3"><EventCountdown eventDate={event.eventDate} eventTime={event.eventTime} /></div>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="ev-pages">
                <button className="ev-page-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>← Prev</button>
                {[...Array(totalPages)].map((_, i) => {
                  const pg = i + 1;
                  if (pg === currentPage || pg === 1 || pg === totalPages || (pg >= currentPage - 1 && pg <= currentPage + 1)) {
                    return <button key={pg} className={`ev-page-btn${pg === currentPage ? ' active' : ''}`} onClick={() => setCurrentPage(pg)}>{pg}</button>;
                  } else if (pg === currentPage - 2 || pg === currentPage + 2) {
                    return <span key={pg} style={{alignSelf:'center',color:'#999'}}>…</span>;
                  }
                  return null;
                })}
                <button className="ev-page-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next →</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
