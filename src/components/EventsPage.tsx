import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Countdown component for event cards
const EventCountdown = ({
  eventDate,
  eventTime,
}: {
  eventDate: string;
  eventTime: string;
}) => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEventStarted: false,
    isEventExpired: false,
  });

  useEffect(() => {
    const updateCountdown = () => {
      if (!eventDate || !eventTime) return;

      try {
        // Parse dates
        const eventDateParts = eventDate.split(" to ");
        const startDateStr = eventDateParts[0].trim();
        const endDateStr = eventDateParts[1]
          ? eventDateParts[1].trim()
          : startDateStr;

        // Parse times
        const eventTimeParts = eventTime.split(" - ");
        const startTimeStr = eventTimeParts[0].trim();
        const endTimeStr = eventTimeParts[1]
          ? eventTimeParts[1].trim()
          : startTimeStr;

        // Helper to convert time string to 24h format HH:mm
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

          return `${hoursInt.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`;
        };

        const startTime24 = convertTo24Hour(startTimeStr);
        const endTime24 = convertTo24Hour(endTimeStr);

        const startDateTime = new Date(
          `${startDateStr}T${startTime24}:00`
        ).getTime();
        let endDateTime = new Date(`${endDateStr}T${endTime24}:00`).getTime();

        // If endDateTime < startDateTime, it might be next day (e.g. 10 PM to 2 AM)
        if (endDateTime < startDateTime) {
          endDateTime += 24 * 60 * 60 * 1000;
        }

        // If start and end are same (single date, single time provided), assume 1 hour duration
        if (startDateTime === endDateTime) {
          endDateTime += 60 * 60 * 1000;
        }

        const now = new Date().getTime();

        if (now > endDateTime) {
          setCountdown((prev) => ({
            ...prev,
            isEventExpired: true,
            isEventStarted: false,
          }));
        } else if (now >= startDateTime && now <= endDateTime) {
          setCountdown((prev) => ({
            ...prev,
            isEventStarted: true,
            isEventExpired: false,
          }));
        } else {
          const distance = startDateTime - now;
          setCountdown({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            ),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
            isEventStarted: false,
            isEventExpired: false,
          });
        }
      } catch (e) {
        console.error("Error parsing date/time", e);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [eventDate, eventTime]);

  if (countdown.isEventExpired) {
    return (
      <div className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded flex items-center gap-1">
        Event Ended
      </div>
    );
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
      {countdown.days > 0 ? `${countdown.days}d ` : ""}
      {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
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
  const [error, setError] = useState(null);
  const eventsPerPage = 12;
  const navigate = useNavigate();

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://o9og9e2rik.execute-api.ap-south-1.amazonaws.com/prod/events-dashboard?viewType=main"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();

        if (data.success && data.cards) {
          // Transform API data to match our event structure
          const transformedEvents = data.cards.map((card) => ({
            id: card.eventId,
            name: card.eventName,
            description: card.shortDescription,
            date: card.eventDate,
            location: card.location,
            time: card.eventTime,
            attendees: "Not specified", // Default since API doesn't provide
            image:
              card.heroBannerImage ||
              card.previewImage ||
              "/images/default-event-image.png",
            type: card.category || "General",
            status: card.isApproved ? "upcoming" : "pending",
            price: "Free", // Default since API doesn't provide
            featured: false, // Default since API doesn't provide
            cleanUrl: card.cleanUrl,
            templateSelection: card.templateSelection,
            eventDate: card.eventDate, // Keep original for countdown
            eventTime: card.eventTime, // Keep original for countdown
          }));

          setAllEvents(transformedEvents);
        } else {
          setAllEvents([]);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleAddEventClick = () => {
    navigate("/event/select");
  };

  const handleCardClick = (event) => {
    if (event.templateSelection === "1") {
      navigate(`/event/${event.name}`);
    } else {
      navigate(`/events/${event.name}`);
    }
  };

  const eventTypes = [
    "All",
    "Expo",
    "Webinar",
    "Conference",
    "Workshop",
    "Summit",
    "Trade Show",
    "General",
  ];
  const sortOptions = [
    { value: "upcoming", label: "Sort by Upcoming" },
    { value: "past", label: "Sort by Past Events" },
    { value: "name", label: "Sort by Name" },
    { value: "date", label: "Sort by Date" },
  ];

  // Filter and sort events
  useEffect(() => {
    let filtered = allEvents;

    // Filter by event type
    if (selectedType !== "All") {
      filtered = filtered.filter((event) => event.type === selectedType);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "upcoming":
          if (a.status !== b.status) {
            return a.status === "upcoming" ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        case "past":
          if (a.status !== b.status) {
            return a.status === "past" ? -1 : 1;
          }
          return b.name.localeCompare(a.name);
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
    setCurrentPage(1);
  }, [selectedType, sortBy, searchQuery, allEvents]);

  const featuredEvents = allEvents.filter((event) => event.featured);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const getTypeColor = (type) => {
    switch (type) {
      case "Conference":
        return "bg-black";
      case "Summit":
        return "bg-gray-900";
      case "Workshop":
        return "bg-gray-800";
      case "Expo":
        return "bg-gray-700";
      case "Webinar":
        return "bg-gray-600";
      case "Trade Show":
        return "bg-black";
      case "General":
        return "bg-blue-500";
      default:
        return "bg-gray-800";
    }
  };

  const getPriceColor = (price) => {
    switch (price) {
      case "Free":
        return "bg-green-500";
      case "Paid":
        return "bg-blue-500";
      case "Premium":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status) => {
    return status === "upcoming" ? "bg-green-500" : "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-400 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-black text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-yellow-400 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-black mb-2">
              Error Loading Events
            </h3>
            <p className="text-black/60 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-black text-yellow-400 px-6 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-400 pt-16">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl overflow-hidden relative sm:px-6 lg:px-8 py-8 flex md:flex-row flex-col justify-between items-center md:items-start">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200/30 rounded-full animate-pulse blur-2xl"></div>
          <div
            className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-600/20 rounded-full animate-pulse blur-2xl"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-5xl font-black text-black mb-2 tracking-tight">
            Events Calendar
          </h1>
          <p className="mb-4 max-w-2xl mt-[15px] text-sm md:text-xl text-black/80">
            Discover amazing events from our community
          </p>
        </div>

        <button
          onClick={handleAddEventClick}
          className="px-6 h-12 text-sm font-semibold text-white bg-black rounded-lg transition duration-300 hover:bg-gray-800"
        >
          List your Event
        </button>
      </section>

      {/* Filter Section */}
      <section className="py-3 bg-yellow-400 sticky top-16 z-40 border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/60" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-yellow-400 bg-yellow-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40 text-black placeholder-black/60 text-sm transition-all duration-300"
              />
            </div>

            {/* Event Type Filter */}
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-48 appearance-none bg-yellow-200 backdrop-blur-sm border-2 border-yellow-400 rounded-lg px-3 py-2 text-black font-medium focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40 text-sm transition-all duration-300"
                >
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === "All" ? "All Event Types" : type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-yellow-60 pointer-events-none" />
              </div>

              {/* Sort Options */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-yellow-200 backdrop-blur-sm border-2 border-black/yellow-400 rounded-lg px-3 py-2 text-black font-medium focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40 text-sm transition-all duration-300 w-72"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/60 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedType !== "All" && (
              <span className="bg-black text-yellow-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                Type: {selectedType}
                <button
                  onClick={() => setSelectedType("All")}
                  className="hover:text-white transition-colors duration-200 text-sm"
                >
                  ×
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="bg-black text-yellow-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="hover:text-white transition-colors duration-200 text-sm"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Featured Events Section - Only show if there are featured events */}
      {featuredEvents.length > 0 && (
        <section className="py-4 bg-gradient-to-b from-yellow-400 to-yellow-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-black text-black mb-8 text-center">
              Featured Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredEvents.map((event, index) => (
                <div
                  key={event.id}
                  onClick={() => handleCardClick(event)}
                  className="group bg-[#f1ee8e] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105 hover:-rotate-1 border-2 border-black/20 hover:border-black/40"
                  style={{
                    animationDelay: `${index * 200}ms`,
                    animation: `fadeInUp 0.8s ease-out ${index * 200}ms both`,
                  }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-48 object-cover transition-all duration-700 group-hover:scale-110 border-b-2 border-black/10"
                    />

                    <div
                      className={`absolute top-4 right-4 ${getTypeColor(
                        event.type
                      )} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}
                    >
                      {event.type}
                    </div>

                    {/* Countdown Timer - Bottom Right */}
                    <div className="absolute bottom-4 right-4">
                      <EventCountdown
                        eventDate={event.eventDate}
                        eventTime={event.eventTime}
                      />
                    </div>

                    {event.featured && (
                      <div className="absolute top-4 left-4 bg-yellow-400 text-black px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        Featured
                      </div>
                    )}

                    <div
                      className={`absolute bottom-4 left-4 ${getPriceColor(
                        event.price
                      )} text-white px-2 py-1 rounded-lg text-xs font-medium`}
                    >
                      {event.price}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-800 transition-colors duration-300">
                      {event.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-yellow-600" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-yellow-600" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Users className="h-4 w-4 mr-2 text-yellow-600" />
                        {event.attendees}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Events Grid Section */}
      <section className="py-16 bg-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-black">
              All Events
            </h2>
            <div className="text-black/60">
              Page {currentPage} of {totalPages}
            </div>
          </div>

          {currentEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto">
                <Search className="h-16 w-16 text-black/40 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-black mb-2">
                  No events found
                </h3>
                <p className="text-black/60">
                  Try adjusting your filters or search terms
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentEvents.map((event, index) => (
                <div
                  key={event.id}
                  onClick={() => handleCardClick(event)}
                  className="group bg-[#f1ee8e] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105 border-2 border-black/20 hover:border-black/40"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: `fadeInUp 0.8s ease-out ${index * 100}ms both`,
                  }}
                >
                  <div className="p-3">
                    <div className="relative overflow-hidden rounded-2xl">
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-40 object-cover transition-all duration-700 group-hover:scale-110"
                      />

                      <div
                        className={`absolute top-3 right-3 ${getTypeColor(
                          event.type
                        )} text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg`}
                      >
                        {event.type}
                      </div>

                      <div
                        className={`absolute bottom-3 left-3 ${getPriceColor(
                          event.price
                        )} text-white px-2 py-1 rounded-lg text-xs font-medium`}
                      >
                        {event.price}
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-black mb-2 group-hover:text-gray-800 transition-colors duration-300 line-clamp-2">
                      {event.name}
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
                      {event.description}
                    </p>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-3 w-3 mr-1 text-yellow-600" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-3 w-3 mr-1 text-yellow-600" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-3 w-3 mr-1 text-yellow-600" />
                        {event.attendees}
                      </div>
                      {/* Countdown Timer - Bottom Right */}
                      <div className="absolute bottom-3 right-3">
                        <EventCountdown
                          eventDate={event.eventDate}
                          eventTime={event.eventTime}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-black/20 text-black font-medium hover:bg-white hover:border-black/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === currentPage ||
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                          page === currentPage
                            ? "bg-black text-yellow-400 border-2 border-black"
                            : "bg-white/80 backdrop-blur-sm border-2 border-black/20 text-black hover:bg-white hover:border-black/40"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-2 text-black/60">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-black/20 text-black font-medium hover:bg-white hover:border-black/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
