import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, Calendar, MapPin, Clock, Users, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const EventsPage = () => {
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 12;
  const navigate = useNavigate();

  const handleAddEventClick = () => {
    navigate('/company'); // Navigate to the /add-event route
  };

  const eventTypes = ['All', 'Expo', 'Webinar', 'Conference', 'Workshop', 'Summit', 'Trade Show'];
  const sortOptions = [
    { value: 'upcoming', label: 'Sort by Upcoming' },
    { value: 'past', label: 'Sort by Past Events' },
    { value: 'name', label: 'Sort by Name' },
    { value: 'date', label: 'Sort by Date' }
  ];

  const allEvents = [
    {
      id: 1,
      name: "Drone Expo & Conference 2025",
      description: "Join us in Mumbai for the premier Drone Expo & Conference where innovation, networking, and industry insights converge. Meet key buyers, launch and showcase new products, understand market competition, and build brand awareness. Explore specialized zones, attend technical conferences, and engage with top speakers from defense, tech, and academia.",
      date: "September 25-27, 2025",
      location: "Mumbai, India",
      time: "9:00 AM - 6:00 PM",
      attendees: "5,000+",
      image: "/images/droneexpo_cover.jpg",
      type: "Expo & Conference",
      status: "upcoming",
      price: "Premium",
      featured: true
    },

    // {
    //   id: 2,
    //   name: "AI in Aviation Summit",
    //   description: "Exploring the future of artificial intelligence in aviation and autonomous flight systems.",
    //   date: "April 22-23, 2024",
    //   location: "Austin, TX",
    //   time: "10:00 AM - 5:00 PM",
    //   attendees: "1,200+",
    //   image: "https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=600",
    //   type: "Summit",
    //   status: "upcoming",
    //   price: "Free",
    //   featured: true
    // },
    // {
    //   id: 3,
    //   name: "GIS Mapping Workshop",
    //   description: "Hands-on workshop covering advanced GIS mapping techniques using drone technology.",
    //   date: "May 10, 2024",
    //   location: "Denver, CO",
    //   time: "1:00 PM - 4:00 PM",
    //   attendees: "150+",
    //   image: "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=600",
    //   type: "Workshop",
    //   status: "upcoming",
    //   price: "Paid",
    //   featured: true
    // },
    // {
    //   id: 4,
    //   name: "Commercial Drone Expo",
    //   description: "Showcase of the latest commercial drone technologies and applications across industries.",
    //   date: "June 5-7, 2024",
    //   location: "Chicago, IL",
    //   time: "9:00 AM - 7:00 PM",
    //   attendees: "3,000+",
    //   image: "https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=600",
    //   type: "Expo",
    //   status: "upcoming",
    //   price: "Premium"
    // },
    // {
    //   id: 5,
    //   name: "Drone Safety Webinar Series",
    //   description: "Online webinar series covering drone safety regulations and best practices.",
    //   date: "July 15, 2024",
    //   location: "Online",
    //   time: "2:00 PM - 3:30 PM",
    //   attendees: "500+",
    //   image: "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600",
    //   type: "Webinar",
    //   status: "upcoming",
    //   price: "Free"
    // },
    // {
    //   id: 6,
    //   name: "Autonomous Flight Systems Conference",
    //   description: "Technical conference focusing on autonomous flight systems and AI integration.",
    //   date: "August 20-22, 2024",
    //   location: "Seattle, WA",
    //   time: "9:00 AM - 6:00 PM",
    //   attendees: "1,800+",
    //   image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600",
    //   type: "Conference",
    //   status: "upcoming",
    //   price: "Premium"
    // },
    // {
    //   id: 7,
    //   name: "Drone Racing Championship",
    //   description: "International drone racing championship with live competitions and demonstrations.",
    //   date: "September 12-14, 2024",
    //   location: "Las Vegas, NV",
    //   time: "10:00 AM - 8:00 PM",
    //   attendees: "5,000+",
    //   image: "https://images.pexels.com/photos/724712/pexels-photo-724712.jpeg?auto=compress&cs=tinysrgb&w=600",
    //   type: "Trade Show",
    //   status: "upcoming",
    //   price: "Paid"
    // },
    // {
    //   id: 8,
    //   name: "Environmental Monitoring Workshop",
    //   description: "Workshop on using drones for environmental monitoring and conservation efforts.",
    //   date: "October 8, 2024",
    //   location: "Portland, OR",
    //   time: "1:00 PM - 5:00 PM",
    //   attendees: "200+",
    //   image: "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=600",
    //   type: "Workshop",
    //   status: "upcoming",
    //   price: "Paid"
    // },
    // {
    //   id: 9,
    //   name: "Drone Tech Innovation Summit 2023",
    //   description: "Past summit showcasing breakthrough innovations in drone technology.",
    //   date: "November 15-16, 2023",
    //   location: "Boston, MA",
    //   time: "9:00 AM - 6:00 PM",
    //   attendees: "1,500+",
    //   image: "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=600",
    //   type: "Summit",
    //   status: "past",
    //   price: "Premium"
    // },
    // {
    //   id: 10,
    //   name: "Agricultural Drones Conference 2023",
    //   description: "Past conference focused on drone applications in precision agriculture.",
    //   date: "October 20-21, 2023",
    //   location: "Phoenix, AZ",
    //   time: "8:00 AM - 5:00 PM",
    //   attendees: "800+",
    //   image: "https://images.pexels.com/photos/1034662/pexels-photo-1034662.jpeg?auto=compress&cs=tinysrgb&w=600",
    //   type: "Conference",
    //   status: "past",
    //   price: "Paid"
    // },
    // {
    //   id: 11,
    //   name: "Drone Delivery Systems Expo 2023",
    //   description: "Past expo showcasing the latest in drone delivery technology and logistics.",
    //   date: "September 8-10, 2023",
    //   location: "Miami, FL",
    //   time: "10:00 AM - 7:00 PM",
    //   attendees: "2,200+",
    //   image: "https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg?auto=compress&cs=tinysrgb&w=600",
    //   type: "Expo",
    //   status: "past",
    //   price: "Premium"
    // },
    // {
    //   id: 12,
    //   name: "Smart Cities Drone Integration Workshop 2023",
    //   description: "Past workshop on integrating drones into smart city infrastructure.",
    //   date: "August 25, 2023",
    //   location: "New York, NY",
    //   time: "2:00 PM - 6:00 PM",
    //   attendees: "300+",
    //   image: "https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=600",
    //   type: "Workshop",
    //   status: "past",
    //   price: "Paid"
    // }
  ];

  useEffect(() => {
    let filtered = allEvents;

    // Filter by event type
    if (selectedType !== 'All') {
      filtered = filtered.filter(event => event.type === selectedType);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'upcoming':
          if (a.status !== b.status) {
            return a.status === 'upcoming' ? -1 : 1;
          }
          return new Date(a.date) - new Date(b.date);
        case 'past':
          if (a.status !== b.status) {
            return a.status === 'past' ? -1 : 1;
          }
          return new Date(b.date) - new Date(a.date);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(a.date) - new Date(b.date);
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
    setCurrentPage(1);
  }, [selectedType, sortBy, searchQuery]);

  const featuredEvents = allEvents.filter(event => event.featured);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const getTypeColor = (type) => {
    switch (type) {
      case 'Conference': return 'bg-black';
      case 'Summit': return 'bg-gray-900';
      case 'Workshop': return 'bg-gray-800';
      case 'Expo': return 'bg-gray-700';
      case 'Webinar': return 'bg-gray-600';
      case 'Trade Show': return 'bg-black';
      default: return 'bg-gray-800';
    }
  };

  const getPriceColor = (price) => {
    switch (price) {
      case 'Free': return 'bg-green-500';
      case 'Paid': return 'bg-blue-500';
      case 'Premium': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    return status === 'upcoming' ? 'bg-green-500' : 'bg-gray-500';
  };


  const handleViewDetailsClick = () => {
    navigate('/event/droneexpo'); // Redirect to the specified URL
  };

  return (
    <div className="min-h-screen bg-yellow-400 pt-16">
      {/* Hero Section */}
      <section className="py-3 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200/30 rounded-full animate-pulse blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-600/20 rounded-full animate-pulse blur-2xl" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-2xl md:text-5xl font-black text-black mb-2 tracking-tight">
            Events Calendar
          </h1>
          <p className="text-xl text-black/80 max-w-2xl mx-auto mb-4">
            Highlights from our events and collaborations.
          </p>
          <div className="w-24 h-1 bg-black mx-auto rounded-full mb-6"></div>
        </div>

        {/* "List your Event" button positioned at the bottom-right corner */}
        <div className="absolute top-4 right-10 z-10 pointer-events-auto">
          <button
            onClick={handleAddEventClick}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-red-600 transition duration-300"
          >
            List your Event
          </button>
        </div>


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
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-48 appearance-none bg-yellow-200 backdrop-blur-sm border-2 border-yellow-400 rounded-lg px-3 py-2 text-black font-medium focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40 text-sm transition-all duration-300"
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'All' ? 'All Event Types' : type}
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

          {/* Active Filters Display */}
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedType !== 'All' && (
              <span className="bg-black text-yellow-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                Type: {selectedType}
                <button onClick={() => setSelectedType('All')} className="hover:text-white transition-colors duration-200 text-sm">
                  ×
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="bg-black text-yellow-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-white transition-colors duration-200 text-sm">
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-4 bg-gradient-to-b from-yellow-400 to-yellow-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredEvents.map((event, index) => (
              <div
                key={event.id}
                className="group bg-[#f1ee8e] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105 hover:-rotate-1 border-2 border-black/20 hover:border-black/40"
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: `fadeInUp 0.8s ease-out ${index * 200}ms both`
                }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.name}
                    className={`w-full ${event.id === 1 ? 'h-60 object-contain scale-90' : 'h-48 object-cover'} transition-all duration-700 group-hover:scale-100 border-b-2 border-black/10`}
                  />



                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div
                      onClick={handleViewDetailsClick}  // Attach the onClick handler here
                      className="bg-yellow-400 text-black px-6 py-3 rounded-full font-bold shadow-2xl transform scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-yellow-300 flex items-center gap-2"
                    >
                      <span>View Event Details</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>

                  <div className={`absolute top-4 right-4 ${getTypeColor(event.type)} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}>
                    {event.type}
                  </div>

                  <div className={`absolute bottom-4 right-4 ${getPriceColor(event.price)} text-white px-2 py-1 rounded-lg text-xs font-medium`}>
                    {event.price}
                  </div>

                  <div className="absolute top-4 left-4 bg-yellow-400 text-black px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </div>

                  <div className={`absolute bottom-4 left-4 ${getStatusColor(event.status)} text-white px-2 py-1 rounded-lg text-xs font-bold capitalize`}>
                    {event.status}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-800 transition-colors duration-300">
                    {event.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

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
                      {event.attendees} Expected
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="py-16 bg-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-black">
              All Events ({filteredEvents.length})
            </h2>
            <div className="text-black/60">
              Page {currentPage} of {totalPages}
            </div>
          </div>

          {currentEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto">
                <Search className="h-16 w-16 text-black/40 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-black mb-2">No events found</h3>
                <p className="text-black/60">Try adjusting your filters or search terms</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="group bg-[#f1ee8e] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105 border-2 border-black/20 hover:border-black/40"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: `fadeInUp 0.8s ease-out ${index * 100}ms both`
                  }}
                >
                  <div className="p-3">
                    <div className="relative overflow-hidden rounded-2xl">
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-40 object-cover transition-all duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div
                          onClick={() => navigate('/company/droneexpo')} // Use the navigate function directly for this button
                          className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold shadow-2xl transform scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-yellow-300 flex items-center gap-2"
                        >
                          <span>View Details</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>


                      <div className={`absolute top-3 right-3 ${getTypeColor(event.type)} text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg`}>
                        {event.type}
                      </div>

                      <div className={`absolute bottom-3 right-3 ${getPriceColor(event.price)} text-white px-2 py-1 rounded-lg text-xs font-medium`}>
                        {event.price}
                      </div>

                      <div className={`absolute bottom-3 left-3 ${getStatusColor(event.status)} text-white px-2 py-1 rounded-lg text-xs font-bold capitalize`}>
                        {event.status}
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-black mb-2 group-hover:text-gray-800 transition-colors duration-300 line-clamp-2">
                      {event.name}
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{event.description}</p>

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
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-black/20 text-black font-medium hover:bg-white hover:border-black/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${page === currentPage
                          ? 'bg-black text-yellow-400 border-2 border-black'
                          : 'bg-white/80 backdrop-blur-sm border-2 border-black/20 text-black hover:bg-white hover:border-black/40'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2 text-black/60">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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