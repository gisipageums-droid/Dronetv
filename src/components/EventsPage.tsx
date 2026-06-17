import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Calendar, MapPin, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const eventsPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://o9og9e2rik.execute-api.ap-south-1.amazonaws.com/prod/events-dashboard?viewType=main");
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
    const slug = event.cleanUrl || event.name;
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Events</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">Events <span className="text-yellow-400">Calendar</span></h1>
            <p className="text-sm text-white/60 max-w-lg">Discover amazing drone events from our community.</p>
          </div>
          <div className="flex flex-col items-end gap-4 flex-shrink-0">
            <div className="flex gap-8">
              <div>
                <span className="text-4xl font-extrabold text-yellow-400 block leading-none">{allEvents.length || '0'}</span>
                <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Events</span>
              </div>
            </div>
            <button
              onClick={() => navigate("/event/select")}
              className="px-5 py-2.5 text-sm font-semibold text-black bg-yellow-400 rounded-lg hover:bg-yellow-300 transition"
            >
              List your Event
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-[104px] z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center flex-wrap">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
            />
          </div>
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none w-full sm:w-auto pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-gray-700 sm:min-w-[150px]"
            >
              {eventTypes.map((t) => (
                <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative flex-1 sm:flex-none">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none w-full sm:w-auto pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 text-gray-700 sm:min-w-[160px]"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {searchQuery && (
            <span className="bg-black text-yellow-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              "{searchQuery}"
              <button onClick={() => setSearchQuery("")} className="hover:text-white text-sm ml-0.5">×</button>
            </span>
          )}
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">{filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}</p>
          {totalPages > 1 && <p className="text-sm text-gray-400">Page {currentPage} of {totalPages}</p>}
        </div>

        {currentEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white border border-gray-200 rounded-xl p-12 max-w-md mx-auto">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No events found</h3>
              <p className="text-sm text-gray-400">Try adjusting your filters or search terms</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {currentEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => handleCardClick(event)}
                className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
              >
                <div className="relative overflow-hidden rounded-t-xl">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className={`absolute top-3 right-3 ${getTypeColor(event.type)} text-white px-2 py-1 rounded-full text-xs font-bold`}>
                    {event.type}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2 line-clamp-2">{event.name}</h3>
                  {event.description && (
                    <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{event.description}</p>
                  )}
                  <div className="space-y-1 text-xs text-gray-500">
                    {event.date && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 flex-shrink-0" />{event.date}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 flex-shrink-0" />{event.location}
                      </div>
                    )}
                    {event.attendees && event.attendees !== "Not specified" && (
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3 w-3 flex-shrink-0" />{event.attendees}
                      </div>
                    )}
                  </div>
                  {event.eventDate && event.eventTime && (
                    <div className="mt-3">
                      <EventCountdown eventDate={event.eventDate} eventTime={event.eventTime} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              if (page === currentPage || page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${page === currentPage ? "bg-black text-yellow-400 border border-black" : "border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2 text-gray-400 self-center">...</span>;
              }
              return null;
            })}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
