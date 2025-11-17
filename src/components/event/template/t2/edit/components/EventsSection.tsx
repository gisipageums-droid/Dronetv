import { useState, useCallback, useEffect, useRef } from 'react';
import { Calendar, Clock, MapPin, ArrowRight, Edit2, Loader2, Save, X, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'react-toastify';

// Text limits
const TEXT_LIMITS = {
  HEADER_TITLE: 60,
  HEADER_SUBTITLE: 100,
  HEADER_DESCRIPTION: 300,
  EVENT_TITLE: 80,
  EVENT_DESCRIPTION: 200,
  EVENT_TIME: 30,
  EVENT_LOCATION: 60,
};

// Data interfaces based on your API structure
interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;

}

interface EventsData {
  subtitle: string;
  heading: string;
  description: string;
  events: Event[];
}

interface EventsProps {
  eventsData?: EventsData;
  onStateChange?: (data: EventsData) => void;
  userId?: string;
  eventId?: string;
  templateSelection?: string;
}

// Default data based on your API structure
const defaultData: EventsData = {
  subtitle: "event highlights",
  heading: "What to Expect",
  description: "Experience overview",
  events: [
    {
      id: "1",
      title: "Opening Keynote",
      description: "Keynote session details",
      location: "Main Hall",
      time: "9:00 AM - 10:00 AM",
      
    },
    {
      id: "2",
      title: "Technical Workshops",
      description: "Hands-on workshop sessions",
      location: "Workshop Rooms",
      time: "10:30 AM - 12:30 PM",
      
    },
    {
      id: "3",
      title: "Networking Sessions",
      description: "Connect with industry professionals",
      location: "Networking Lounge",
      time: "2:00 PM - 3:00 PM",

    }
  ]
};

// Icon mapping based on your API data


export function EventsSection({ eventsData, onStateChange, userId, eventId, templateSelection }: EventsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const eventsRef = useRef<HTMLDivElement>(null);

  // Initialize with eventsData or default structure
  const [data, setData] = useState<EventsData>(() => 
    eventsData || defaultData
  );
  
  const [tempData, setTempData] = useState<EventsData>(() => 
    eventsData || defaultData
  );

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange && dataLoaded) {
      onStateChange(data);
    }
  }, [data, dataLoaded]);

  // Update data when eventsData prop changes
  useEffect(() => {
    if (eventsData) {
      setData(eventsData);
      setTempData(eventsData);
      setDataLoaded(true);
    }
  }, [eventsData]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (eventsRef.current) observer.observe(eventsRef.current);
    return () => {
      if (eventsRef.current) observer.unobserve(eventsRef.current);
    };
  }, []);

  // Data fetch function
  const fetchEventsData = async () => {
    if (eventsData) {
      setData(eventsData);
      setTempData(eventsData);
      setDataLoaded(true);
    } else {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setDataLoaded(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading) {
      fetchEventsData();
    }
  }, [isVisible, dataLoaded, isLoading, eventsData]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setData(tempData);
      setIsEditing(false);
      toast.success('Events section saved successfully');

    } catch (error) {
      console.error('Error saving events section:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...data });
    setIsEditing(false);
  };

  // Stable update functions with useCallback
  const updateEvent = useCallback((index: number, field: keyof Event, value: string) => {
    const updatedEvents = [...tempData.events];
    updatedEvents[index] = { ...updatedEvents[index], [field]: value };
    setTempData({ ...tempData, events: updatedEvents });
  }, [tempData]);

  const updateHeader = useCallback((field: keyof Omit<EventsData, 'events'>, value: string) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const addEvent = useCallback(() => {
    const newEvent: Event = {
      id: Date.now().toString(),
      title: "New Event",
      description: "Event description goes here.",
      location: "Main Hall",
      time: "9:00 AM - 10:00 AM",
      icon: "Mic"
    };
    setTempData({
      ...tempData,
      events: [...tempData.events, newEvent]
    });
  }, [tempData]);

  const removeEvent = useCallback((index: number) => {
    const updatedEvents = tempData.events.filter((_, i) => i !== index);
    setTempData({ ...tempData, events: updatedEvents });
  }, [tempData]);

  const displayData = isEditing ? tempData : data;

  // Loading state
  if ((isLoading && !dataLoaded) || (!dataLoaded && displayData.events.length === 0)) {
    return (
      <section ref={eventsRef} id="events" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
          <p className="text-gray-600 mt-4">Loading events data...</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={eventsRef} id="events" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Edit Controls */}
        <div className='text-right mb-8'>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="inline-flex items-center justify-center h-8 px-3 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-colors shadow-md"
            >
              <Edit2 className='w-4 h-4 mr-2' />
              Edit Events
            </button>
          ) : (
            <div className='flex gap-2 justify-end'>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center justify-center h-8 px-3 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors shadow-md disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                ) : (
                  <Save className='w-4 h-4 mr-2' />
                )}
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="inline-flex items-center justify-center h-8 px-3 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors shadow-md disabled:opacity-50"
              >
                <X className='w-4 h-4 mr-2' />
                Cancel
              </button>
              <button
                onClick={addEvent}
                className="inline-flex items-center justify-center h-8 px-3 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 border border-gray-300 rounded-md font-medium transition-colors shadow-md"
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Event
              </button>
            </div>
          )}
        </div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {isEditing ? (
            <>
              <div className="inline-block mb-4 px-4 py-2 bg-yellow-100 rounded-full">
                <div className="relative">
                  <input
                    type="text"
                    value={displayData.subtitle}
                    onChange={(e) => updateHeader('subtitle', e.target.value)}
                    className="text-red-700 text-xl font-semibold text-center bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full max-w-md"
                    maxLength={TEXT_LIMITS.HEADER_SUBTITLE}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                    {displayData.subtitle.length}/{TEXT_LIMITS.HEADER_SUBTITLE}
                  </div>
                </div>
              </div>
              <div className="relative mb-4">
                <input
                  type="text"
                  value={displayData.heading}
                  onChange={(e) => updateHeader('heading', e.target.value)}
                  className="text-gray-900 text-3xl sm:text-4xl md:text-5xl text-center bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full max-w-2xl mx-auto"
                  maxLength={TEXT_LIMITS.HEADER_TITLE}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {displayData.heading.length}/{TEXT_LIMITS.HEADER_TITLE}
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={displayData.description}
                  onChange={(e) => updateHeader('description', e.target.value)}
                  className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full"
                  rows={2}
                  maxLength={TEXT_LIMITS.HEADER_DESCRIPTION}
                />
                <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                  {displayData.description.length}/{TEXT_LIMITS.HEADER_DESCRIPTION}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="inline-block mb-4 px-4 py-2 bg-yellow-100 rounded-full">
                <span className="text-red-700 text-xl font-semibold">{displayData.subtitle}</span>
              </div>
              <h2 className="text-gray-900 mb-4 text-3xl sm:text-4xl md:text-5xl">{displayData.heading}</h2>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
                {displayData.description}
              </p>
            </>
          )}
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayData.events.map((event, index) => {
           
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group bg-yellow-50 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-amber-200 hover:border-amber-400 relative"
              >
                {/* Edit Controls Overlay */}
                {isEditing && (
                  <button
                    onClick={() => removeEvent(index)}
                    className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white p-1 rounded-md"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}

                <div className="p-6 sm:p-8">
                  {isEditing ? (
                    <div className="space-y-4">
                      {/* Icon and Title */}
                      <div className="flex items-center gap-4">

                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={event.title}
                            onChange={(e) => updateEvent(index, 'title', e.target.value)}
                            className="text-gray-900 text-xl sm:text-2xl font-semibold bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full"
                            maxLength={TEXT_LIMITS.EVENT_TITLE}
                          />
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                            {event.title.length}/{TEXT_LIMITS.EVENT_TITLE}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="relative">
                        <textarea
                          value={event.description}
                          onChange={(e) => updateEvent(index, 'description', e.target.value)}
                          className="text-gray-600 text-sm sm:text-base bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 w-full"
                          rows={3}
                          maxLength={TEXT_LIMITS.EVENT_DESCRIPTION}
                        />
                        <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                          {event.description.length}/{TEXT_LIMITS.EVENT_DESCRIPTION}
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={event.time}
                              onChange={(e) => updateEvent(index, 'time', e.target.value)}
                              className="text-gray-600 text-sm sm:text-base bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 w-full"
                              maxLength={TEXT_LIMITS.EVENT_TIME}
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                              {event.time.length}/{TEXT_LIMITS.EVENT_TIME}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0" />
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={event.location}
                              onChange={(e) => updateEvent(index, 'location', e.target.value)}
                              className="text-gray-600 text-sm sm:text-base bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 w-full"
                              maxLength={TEXT_LIMITS.EVENT_LOCATION}
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                              {event.location.length}/{TEXT_LIMITS.EVENT_LOCATION}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* View Mode */}
                      <div className="flex items-center gap-4 mb-4">

                        <h3 className="text-gray-900 group-hover:text-amber-600 transition-colors text-xl sm:text-2xl">
                          {event.title}
                        </h3>
                      </div>

                      <p className="text-gray-600 mb-6 text-sm sm:text-base">{event.description}</p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-600 text-sm sm:text-base">
                          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 text-sm sm:text-base">
                          <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
          
          {/* Add New Event Card (edit mode) */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="group bg-gray-50 rounded-2xl sm:rounded-3xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-all duration-300 min-h-[300px]"
              onClick={addEvent}
            >
              <div className="text-center p-6">
                <Plus className="w-12 h-12 text-gray-400 group-hover:text-blue-400 mx-auto mb-4" />
                <p className="text-gray-500 group-hover:text-blue-400 font-semibold">Add New Event</p>
                <p className="text-gray-400 text-sm mt-2">Click to add a new event</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Empty State */}
        {displayData.events.length === 0 && !isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Events Added</h4>
              <p className="text-gray-600 mb-6">Add events to showcase your conference schedule.</p>
              <button
                onClick={handleEdit}
                className="inline-flex items-center justify-center h-10 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md font-medium transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Events
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}