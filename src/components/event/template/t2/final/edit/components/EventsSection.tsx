import { useState, useCallback, useEffect } from 'react';
import { Calendar, Clock, MapPin, ArrowRight, Edit2, Loader2, Save, X, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'react-toastify';

// Text limits
const TEXT_LIMITS = {
  SUBTITLE: 100,
  HEADING: 60,
  DESCRIPTION: 300,
  EVENT_TITLE: 80,
  EVENT_CATEGORY: 40,
  EVENT_DATE: 30,
  EVENT_TIME: 30,
  EVENT_LOCATION: 60,
  EVENT_DESCRIPTION: 200,
  BUTTON_TEXT: 30,
};

// Custom Button component
const CustomButton = ({
  children,
  onClick,
  variant,
  size,
  className,
  disabled,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'outline' | 'default';
  size?: 'sm' | 'default';
  className?: string;
  disabled?: boolean;
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
    default: "bg-blue-600 text-white hover:bg-blue-700",
  };
  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Data interfaces
interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  color: string;
  featured: boolean;
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
  professionalId?: string;
  templateSelection?: string;
}

// Default data
const defaultData: EventsData = {
  subtitle: "Featured Events",
  heading: "Unmissable Experiences",
  description: "From inspiring keynotes to hands-on workshops, every moment is designed to educate, inspire, and connect.",
  events: [
    {
      id: '1',
      title: 'Opening Keynote',
      category: 'Main Stage',
      date: 'March 15, 2025',
      time: '9:00 AM - 11:00 AM',
      location: 'Grand Hall A',
      description: 'Kick off the conference with inspiring talks from industry pioneers and thought leaders.',
      color: 'from-yellow-400 to-amber-500',
      featured: true
    },
    {
      id: '2',
      title: 'Innovation Workshop',
      category: 'Workshop',
      date: 'March 15, 2025',
      time: '2:00 PM - 5:00 PM',
      location: 'Innovation Lab',
      description: 'Hands-on sessions exploring the latest technologies and methodologies shaping our industry.',
      color: 'from-amber-400 to-orange-500',
      featured: false
    },
    {
      id: '3',
      title: 'Networking Gala',
      category: 'Networking',
      date: 'March 16, 2025',
      time: '7:00 PM - 10:00 PM',
      location: 'Rooftop Terrace',
      description: 'An elegant evening of connection, conversation, and celebration with fellow attendees.',
      color: 'from-yellow-300 to-amber-400',
      featured: false
    },
    {
      id: '4',
      title: 'Panel Discussion',
      category: 'Discussion',
      date: 'March 17, 2025',
      time: '10:00 AM - 12:00 PM',
      location: 'Conference Room B',
      description: 'Expert panel discussing future trends, challenges, and opportunities in the industry.',
      color: 'from-amber-500 to-yellow-600',
      featured: false
    },
  ]
};

// Color options for events
const colorOptions = [
  'from-yellow-400 to-amber-500',
  'from-amber-400 to-orange-500',
  'from-yellow-300 to-amber-400',
  'from-amber-500 to-yellow-600',
  'from-blue-400 to-blue-600',
  'from-green-400 to-green-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
];

// Category options
const categoryOptions = [
  'Main Stage',
  'Workshop',
  'Networking',
  'Discussion',
  'Keynote',
  'Panel',
  'Breakout Session',
  'Social Event',
  'Awards',
  'Closing'
];

// Editable Text Component
const EditableText = ({ 
  value, 
  onChange, 
  multiline = false, 
  className = "", 
  placeholder = "", 
  charLimit, 
  rows = 3 
}: {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  charLimit?: number;
  rows?: number;
}) => (
  <div className="relative">
    {multiline ? (
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-white/80 backdrop-blur-sm border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 ${className}`}
          placeholder={placeholder}
          rows={rows}
          maxLength={charLimit}
        />
        {charLimit && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            {value.length}/{charLimit}
          </div>
        )}
      </div>
    ) : (
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-white/80 backdrop-blur-sm border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 ${className}`}
          placeholder={placeholder}
          maxLength={charLimit}
        />
        {charLimit && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
            {value.length}/{charLimit}
          </div>
        )}
      </div>
    )}
  </div>
);

export function EventsSection({ eventsData, onStateChange, userId, professionalId, templateSelection }: EventsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState<EventsData>(defaultData);
  const [tempData, setTempData] = useState<EventsData>(defaultData);

  // Initialize data from props
  useEffect(() => {
    if (eventsData && !dataLoaded) {
      setData(eventsData);
      setTempData(eventsData);
      setDataLoaded(true);
    }
  }, [eventsData, dataLoaded]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange && dataLoaded) {
      onStateChange(data);
    }
  }, [data, dataLoaded]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      setData(tempData);
      setIsEditing(false);
      toast.success('Events section saved successfully');
    } catch (error) {
      console.error('Error saving events:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...data });
    setIsEditing(false);
  };

  // Event management functions
  const addEvent = useCallback(() => {
    const newEvent: Event = {
      id: Date.now().toString(),
      title: 'New Event',
      category: 'Workshop',
      date: 'March 15, 2025',
      time: '9:00 AM - 10:00 AM',
      location: 'Main Hall',
      description: 'Event description goes here.',
      color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
      featured: false
    };
    setTempData(prev => ({
      ...prev,
      events: [...prev.events, newEvent]
    }));
  }, []);

  const removeEvent = useCallback((eventId: string) => {
    const updatedEvents = tempData.events.filter(event => event.id !== eventId);
    setTempData(prev => ({ ...prev, events: updatedEvents }));
  }, [tempData.events]);

  const updateEvent = useCallback((eventId: string, field: keyof Event, value: string | boolean) => {
    const updatedEvents = tempData.events.map(event =>
      event.id === eventId ? { ...event, [field]: value } : event
    );
    setTempData(prev => ({ ...prev, events: updatedEvents }));
  }, [tempData.events]);

  const updateField = useCallback((field: keyof EventsData, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  }, []);

  const displayData = isEditing ? tempData : data;

  return (
    <section id="events" className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Edit Controls */}
          <div className="text-right mb-8">
            {!isEditing ? (
              <CustomButton
                onClick={handleEdit}
                size="sm"
                className="bg-red-500 hover:bg-red-600 shadow-md text-white"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Events
              </CustomButton>
            ) : (
              <div className="flex gap-2 justify-end">
                <CustomButton
                  onClick={handleSave}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white shadow-md"
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {isSaving ? "Saving..." : "Save"}
                </CustomButton>
                <CustomButton
                  onClick={handleCancel}
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white shadow-md"
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </CustomButton>
                <CustomButton
                  onClick={addEvent}
                  variant="outline"
                  size="sm"
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </CustomButton>
              </div>
            )}
          </div>

          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            {isEditing ? (
              <>
                <div className="inline-block mb-4 px-4 py-2 bg-yellow-100 rounded-full">
                  <EditableText
                    value={displayData.subtitle}
                    onChange={(value) => updateField('subtitle', value)}
                    className="text-red-700 text-xl font-semibold text-center"
                    placeholder="Section subtitle"
                    charLimit={TEXT_LIMITS.SUBTITLE}
                  />
                </div>
                <EditableText
                  value={displayData.heading}
                  onChange={(value) => updateField('heading', value)}
                  className="text-gray-900 mb-4 text-3xl sm:text-4xl md:text-5xl text-center"
                  placeholder="Section heading"
                  charLimit={TEXT_LIMITS.HEADING}
                />
                <EditableText
                  value={displayData.description}
                  onChange={(value) => updateField('description', value)}
                  multiline
                  className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4 text-center"
                  placeholder="Section description"
                  charLimit={TEXT_LIMITS.DESCRIPTION}
                  rows={2}
                />
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
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {displayData.events.map((event) => (
              <div
                key={event.id}
                className="group bg-yellow-50 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-amber-200 hover:border-amber-400 relative"
              >
                {/* Edit Controls Overlay */}
                {isEditing && (
                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <CustomButton
                      onClick={() => removeEvent(event.id)}
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </CustomButton>
                  </div>
                )}

                {/* Color Bar */}
                <div className={`h-2 ${event.color}`} />

                <div className="p-6 sm:p-8">
                  {isEditing ? (
                    <div className="space-y-4">
                      {/* Category and Featured */}
                      <div className="flex items-center gap-3 justify-between">
                        <select
                          value={event.category}
                          onChange={(e) => updateEvent(event.id, 'category', e.target.value)}
                          className="px-3 py-1 bg-yellow-400 text-white rounded-full text-sm border-2 border-dashed border-blue-300"
                        >
                          {categoryOptions.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <input
                            type="checkbox"
                            checked={event.featured}
                            onChange={(e) => updateEvent(event.id, 'featured', e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          Featured
                        </label>
                      </div>

                      {/* Title */}
                      <EditableText
                        value={event.title}
                        onChange={(value) => updateEvent(event.id, 'title', value)}
                        className="text-gray-900 text-xl sm:text-2xl font-semibold"
                        placeholder="Event title"
                        charLimit={TEXT_LIMITS.EVENT_TITLE}
                      />

                      {/* Description */}
                      <EditableText
                        value={event.description}
                        onChange={(value) => updateEvent(event.id, 'description', value)}
                        multiline
                        className="text-gray-600 text-sm sm:text-base"
                        placeholder="Event description"
                        charLimit={TEXT_LIMITS.EVENT_DESCRIPTION}
                        rows={3}
                      />

                      {/* Event Details */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-amber-600 flex-shrink-0" />
                          <EditableText
                            value={event.date}
                            onChange={(value) => updateEvent(event.id, 'date', value)}
                            className="text-gray-600 text-sm sm:text-base flex-1"
                            placeholder="Event date"
                            charLimit={TEXT_LIMITS.EVENT_DATE}
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                          <EditableText
                            value={event.time}
                            onChange={(value) => updateEvent(event.id, 'time', value)}
                            className="text-gray-600 text-sm sm:text-base flex-1"
                            placeholder="Event time"
                            charLimit={TEXT_LIMITS.EVENT_TIME}
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0" />
                          <EditableText
                            value={event.location}
                            onChange={(value) => updateEvent(event.id, 'location', value)}
                            className="text-gray-600 text-sm sm:text-base flex-1"
                            placeholder="Event location"
                            charLimit={TEXT_LIMITS.EVENT_LOCATION}
                          />
                        </div>
                      </div>

                      {/* Color Selection */}
                      <div className="pt-3 border-t border-gray-200">
                        <label className="block text-sm text-gray-600 mb-2">Color Theme:</label>
                        <select
                          value={event.color}
                          onChange={(e) => updateEvent(event.id, 'color', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                        >
                          {colorOptions.map((color, index) => (
                            <option key={index} value={color}>
                              Color {index + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* View Mode */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 bg-yellow-400 text-white rounded-full text-xs sm:text-sm ${event.featured ? 'ring-2 ring-amber-600' : ''}`}>
                          {event.category}
                        </span>
                        {event.featured && (
                          <span className="px-2 py-1 bg-amber-600 text-white rounded-full text-xs">Featured</span>
                        )}
                      </div>

                      <h3 className="text-gray-900 mb-4 group-hover:text-amber-600 transition-colors text-xl sm:text-2xl">
                        {event.title}
                      </h3>

                      <p className="text-gray-600 mb-6 text-sm sm:text-base">{event.description}</p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-600 text-sm sm:text-base">
                          <Calendar className="w-5 h-5 text-amber-600 flex-shrink-0" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 text-sm sm:text-base">
                          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 text-sm sm:text-base">
                          <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-0 h-auto group text-sm sm:text-base"
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
            
            {/* Add New Event Card (edit mode) */}
            {isEditing && (
              <div
                className="group bg-gray-50 rounded-2xl sm:rounded-3xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-all duration-300 min-h-[300px]"
                onClick={addEvent}
              >
                <div className="text-center p-6">
                  <Plus className="w-12 h-12 text-gray-400 group-hover:text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-500 group-hover:text-blue-400 font-semibold">Add New Event</p>
                  <p className="text-gray-400 text-sm mt-2">Click to add a new event</p>
                </div>
              </div>
            )}
          </div>

          {/* Empty State */}
          {displayData.events.length === 0 && !isEditing && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Events Added</h4>
                <p className="text-gray-600 mb-6">Add events to showcase your conference schedule.</p>
                <CustomButton
                  onClick={handleEdit}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Events
                </CustomButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}