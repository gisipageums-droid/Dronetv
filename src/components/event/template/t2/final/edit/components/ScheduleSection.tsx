import { useState, useCallback, useEffect } from 'react';
import { Clock, MapPin, User, Edit2, Loader2, Save, X, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';

// Text limits
const TEXT_LIMITS = {
  SUBTITLE: 100,
  HEADING: 60,
  DESCRIPTION: 300,
  SCHEDULE_TIME: 30,
  SCHEDULE_TITLE: 100,
  SCHEDULE_LOCATION: 60,
  SCHEDULE_SPEAKER: 60,
  DAY_LABEL: 20,
  DAY_DATE: 30,
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
interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  location: string;
  speaker: string;
  type: string;
  description?: string;
}

interface DayData {
  label: string;
  date: string;
  items: ScheduleItem[];
}

interface ScheduleData {
  subtitle: string;
  heading: string;
  description: string;
  days: {
    [key: number]: DayData;
  };
}

interface ScheduleProps {
  scheduleData?: any;
  onStateChange?: (data: ScheduleData) => void;
  userId?: string;
  eventId?: string;
  templateSelection?: string;
}

// Helper function to convert array-based days to object-based days
const convertDaysArrayToObject = (daysArray: any[]): { [key: number]: DayData } => {
  const daysObject: { [key: number]: DayData } = {};
  
  daysArray.forEach((day, index) => {
    const dayNumber = index + 1;
    daysObject[dayNumber] = {
      label: day.label || `Day ${dayNumber}`,
      date: day.date?.includes(' - ') ? day.date.split(' - ')[1] : day.date || `March ${15 + dayNumber}, 2024`,
      items: (day.sessions || []).map((session: any) => ({
        id: session.id || `${dayNumber}-${Date.now()}-${Math.random()}`,
        time: session.time || '9:00 AM - 10:00 AM',
        title: session.title || 'New Session',
        location: session.location || 'Main Hall',
        speaker: session.speaker || 'Speaker Name',
        type: session.type || 'session',
        description: session.description || ''
      }))
    };
  });
  
  return daysObject;
};

// Helper function to create default data from the provided structure
const createDefaultData = (): ScheduleData => {
  const providedData = {
    subtitle: "event schedule",
    heading: "Event Schedule",
    description: "Comprehensive day-wise agenda and sessions",
    days: [
      {
        date: "Day 89- March 15, 2024",
        sessions: [
          {
            speaker: "Dr. Emily Watson",
            description: "Explore the latest trends and applications of AI in various industries.",
            location: "Main Hall",
            id: "1",
            time: "9:00 AM - 10:00 AM",
            title: "Innovations in Artificial Intelligence",
            type: "keynote"
          },
          {
            speaker: "Alex Johnson",
            description: "Get hands-on experience with AI tools and techniques.",
            location: "Workshop Room A",
            id: "2",
            time: "10:30 AM - 12:00 PM",
            title: "Hands-on AI Workshop",
            type: "workshop"
          },
          {
            speaker: "",
            description: "Enjoy a networking lunch with peers and experts.",
            location: "Grand Ballroom",
            id: "3",
            time: "12:00 PM - 1:00 PM",
            title: "Networking Lunch",
            type: "break"
          }
        ],
        id: "day1",
        label: "Day 1"
      }
    ]
  };

  return {
    subtitle: providedData.subtitle,
    heading: providedData.heading,
    description: providedData.description,
    days: convertDaysArrayToObject(providedData.days)
  };
};

// Default data from provided structure
const defaultData: ScheduleData = createDefaultData();

// Type options with colors
const typeOptions = [
  { value: 'keynote', label: 'Keynote', color: 'bg-amber-500' },
  { value: 'workshop', label: 'Workshop', color: 'bg-yellow-500' },
  { value: 'panel', label: 'Panel', color: 'bg-orange-500' },
  { value: 'session', label: 'Session', color: 'bg-amber-400' },
  { value: 'networking', label: 'Networking', color: 'bg-yellow-400' },
  { value: 'break', label: 'Break', color: 'bg-gray-400' },
  { value: 'registration', label: 'Registration', color: 'bg-gray-400' },
  { value: 'closing', label: 'Closing', color: 'bg-amber-600' },
];

// Editable Text Component - FIXED VERSION
const EditableText = ({ 
  value = '', 
  onChange, 
  multiline = false, 
  className = "", 
  placeholder = "", 
  charLimit, 
  rows = 3 
}: {
  value?: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  charLimit?: number;
  rows?: number;
}) => {
  const safeValue = value || '';
  
  return (
    <div className="relative">
      {multiline ? (
        <div className="relative">
          <textarea
            value={safeValue}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full bg-white/80 backdrop-blur-sm border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 ${className}`}
            placeholder={placeholder}
            rows={rows}
            maxLength={charLimit}
          />
          {charLimit && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {safeValue.length}/{charLimit}
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={safeValue}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full bg-white/80 backdrop-blur-sm border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 ${className}`}
            placeholder={placeholder}
            maxLength={charLimit}
          />
          {charLimit && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
              {safeValue.length}/{charLimit}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export function ScheduleSection({ scheduleData, onStateChange}: ScheduleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState<ScheduleData>(defaultData);
  const [tempData, setTempData] = useState<ScheduleData>(defaultData);
  const [activeDay, setActiveDay] = useState(1);

  // Initialize data from props
  useEffect(() => {
    if (scheduleData && !dataLoaded) {
      let convertedData: ScheduleData;
      
      if (scheduleData.days && Array.isArray(scheduleData.days)) {
        // Convert array-based days to object-based days
        convertedData = {
          subtitle: scheduleData.subtitle || defaultData.subtitle,
          heading: scheduleData.heading || defaultData.heading,
          description: scheduleData.description || defaultData.description,
          days: convertDaysArrayToObject(scheduleData.days)
        };
      } else {
        // Use as-is if already in correct format
        convertedData = {
          subtitle: scheduleData.subtitle || defaultData.subtitle,
          heading: scheduleData.heading || defaultData.heading,
          description: scheduleData.description || defaultData.description,
          days: scheduleData.days || defaultData.days
        };
      }
      
      setData(convertedData);
      setTempData(convertedData);
      setDataLoaded(true);
    } else if (!dataLoaded) {
      // Use default data if no scheduleData provided
      setData(defaultData);
      setTempData(defaultData);
      setDataLoaded(true);
    }
  }, [scheduleData, dataLoaded]);

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
      toast.success('Schedule saved successfully');
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...data });
    setIsEditing(false);
  };

  // Schedule management functions
  const addScheduleItem = useCallback((day: number) => {
    const newItem: ScheduleItem = {
      id: `${day}-${Date.now()}-${Math.random()}`,
      time: '9:00 AM - 10:00 AM',
      title: 'New Session',
      location: 'Main Hall',
      speaker: 'Speaker Name',
      type: 'session'
    };
    
    const updatedDays = {
      ...tempData.days,
      [day]: {
        ...tempData.days[day],
        items: [...(tempData.days[day]?.items || []), newItem]
      }
    };
    
    setTempData(prev => ({ ...prev, days: updatedDays }));
  }, [tempData.days]);

  const removeScheduleItem = useCallback((day: number, itemId: string) => {
    const updatedDays = {
      ...tempData.days,
      [day]: {
        ...tempData.days[day],
        items: (tempData.days[day]?.items || []).filter(item => item.id !== itemId)
      }
    };
    
    setTempData(prev => ({ ...prev, days: updatedDays }));
  }, [tempData.days]);

  const updateScheduleItem = useCallback((day: number, itemId: string, field: keyof ScheduleItem, value: string) => {
    const updatedDays = {
      ...tempData.days,
      [day]: {
        ...tempData.days[day],
        items: (tempData.days[day]?.items || []).map(item =>
          item.id === itemId ? { ...item, [field]: value } : item
        )
      }
    };
    
    setTempData(prev => ({ ...prev, days: updatedDays }));
  }, [tempData.days]);

  const moveScheduleItem = useCallback((day: number, itemId: string, direction: 'up' | 'down') => {
    const items = [...(tempData.days[day]?.items || [])];
    const currentIndex = items.findIndex(item => item.id === itemId);
    
    if (direction === 'up' && currentIndex > 0) {
      [items[currentIndex], items[currentIndex - 1]] = [items[currentIndex - 1], items[currentIndex]];
    } else if (direction === 'down' && currentIndex < items.length - 1) {
      [items[currentIndex], items[currentIndex + 1]] = [items[currentIndex + 1], items[currentIndex]];
    }
    
    const updatedDays = {
      ...tempData.days,
      [day]: {
        ...tempData.days[day],
        items: items
      }
    };
    
    setTempData(prev => ({ ...prev, days: updatedDays }));
  }, [tempData.days]);

  const addDay = useCallback(() => {
    const dayNumbers = Object.keys(tempData.days).map(Number);
    const newDayNumber = dayNumbers.length > 0 ? Math.max(...dayNumbers) + 1 : 1;
    
    const updatedDays = {
      ...tempData.days,
      [newDayNumber]: {
        label: `Day ${newDayNumber}`,
        date: `March ${15 + newDayNumber}, 2024`,
        items: []
      }
    };
    
    setTempData(prev => ({ ...prev, days: updatedDays }));
    setActiveDay(newDayNumber);
  }, [tempData.days]);

  const removeDay = useCallback((day: number) => {
    const updatedDays = { ...tempData.days };
    delete updatedDays[day];
    
    setTempData(prev => ({ ...prev, days: updatedDays }));
    
    // Switch to another day if available
    const remainingDays = Object.keys(updatedDays).map(Number);
    if (remainingDays.length > 0 && day === activeDay) {
      setActiveDay(remainingDays[0]);
    }
  }, [tempData.days, activeDay]);

  const updateDayField = useCallback((day: number, field: keyof DayData, value: string) => {
    const updatedDays = {
      ...tempData.days,
      [day]: {
        ...tempData.days[day],
        [field]: value
      }
    };
    
    setTempData(prev => ({ ...prev, days: updatedDays }));
  }, [tempData.days]);

  const updateField = useCallback((field: keyof ScheduleData, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  }, []);

  const displayData = isEditing ? tempData : data;

  // Helper function to get type color
  const getTypeColor = (type: string) => {
    const typeOption = typeOptions.find(option => option.value === type);
    return typeOption ? typeOption.color : 'bg-gray-400';
  };

  // Safe access to day data
  const getDayData = (day: number) => {
    return displayData.days[day] || { label: `Day ${day}`, date: '', items: [] };
  };

  return (
    <section id="schedule" className="py-16 sm:py-20 md:py-24 bg-yellow-100">
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
                Edit Schedule
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
                  onClick={addDay}
                  variant="outline"
                  size="sm"
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Day
                </CustomButton>
              </div>
            )}
          </div>

          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            {isEditing ? (
              <>
                <div className="inline-block mb-4 px-4 py-2 bg-white rounded-full shadow-sm border border-amber-200">
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
                <div className="inline-block mb-4 px-4 py-2 bg-white rounded-full shadow-sm border border-amber-200">
                  <span className="text-red-700 text-xl font-semibold">{displayData.subtitle}</span>
                </div>
                <h2 className="text-gray-900 mb-4 text-3xl sm:text-4xl md:text-5xl">{displayData.heading}</h2>
                <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
                  {displayData.description}
                </p>
              </>
            )}
          </div>

          {/* Day Tabs */}
          <div className="flex justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 flex-wrap px-4">
            {Object.keys(displayData.days).map(dayNumber => {
              const day = parseInt(dayNumber);
              const dayData = getDayData(day);
              
              return (
                <div key={day} className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveDay(day)}
                      className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300 text-sm sm:text-base min-w-[120px] ${
                        activeDay === day
                          ? 'bg-yellow-400 text-gray-900 shadow-lg scale-105'
                          : 'bg-white text-gray-600 hover:bg-yellow-50 border border-gray-200'
                      }`}
                    >
                      {isEditing ? (
                        <div className="text-center">
                          <EditableText
                            value={dayData.label}
                            onChange={(value) => updateDayField(day, 'label', value)}
                            className="text-sm sm:text-base font-semibold text-center"
                            placeholder="Day label"
                            charLimit={TEXT_LIMITS.DAY_LABEL}
                          />
                          <EditableText
                            value={dayData.date}
                            onChange={(value) => updateDayField(day, 'date', value)}
                            className="text-xs sm:text-sm mt-1 text-center"
                            placeholder="Date"
                            charLimit={TEXT_LIMITS.DAY_DATE}
                          />
                        </div>
                      ) : (
                        <>
                          <div className="font-semibold">{dayData.label}</div>
                          <div className="text-xs sm:text-sm mt-1">{dayData.date}</div>
                        </>
                      )}
                    </button>
                    
                    {/* Edit Day Controls */}
                    {isEditing && Object.keys(displayData.days).length > 1 && (
                      <CustomButton
                        onClick={() => removeDay(day)}
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white p-2"
                      >
                        <Trash2 className="w-3 h-3" />
                      </CustomButton>
                    )}
                  </div>
                  
                  {/* Schedule item count badge */}
                  {isEditing && (
                    <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
                      {dayData.items.length} items
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Add Day Button (edit mode) */}
            {isEditing && (
              <button
                onClick={addDay}
                className="px-4 py-3 bg-white text-gray-600 hover:bg-yellow-50 border border-dashed border-gray-300 rounded-xl transition-all duration-300 h-[84px] flex items-center justify-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Schedule Items */}
          <div className="space-y-4 sm:space-y-6">
            {getDayData(activeDay).items.map((item, index) => (
              <div
                key={item.id}
                className="group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-transparent hover:border-amber-500 relative"
              >
                {/* Edit Controls Overlay */}
                {isEditing && (
                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <CustomButton
                      onClick={() => moveScheduleItem(activeDay, item.id, 'up')}
                      size="sm"
                      className="bg-gray-500 hover:bg-gray-600 text-white p-1"
                      disabled={index === 0}
                    >
                      <ChevronUp className="w-3 h-3" />
                    </CustomButton>
                    <CustomButton
                      onClick={() => moveScheduleItem(activeDay, item.id, 'down')}
                      size="sm"
                      className="bg-gray-500 hover:bg-gray-600 text-white p-1"
                      disabled={index === getDayData(activeDay).items.length - 1}
                    >
                      <ChevronDown className="w-3 h-3" />
                    </CustomButton>
                    <CustomButton
                      onClick={() => removeScheduleItem(activeDay, item.id)}
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </CustomButton>
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center gap-4 sm:gap-6">
                  <div className="lg:w-44 flex-shrink-0">
                    {isEditing ? (
                      <EditableText
                        value={item.time}
                        onChange={(value) => updateScheduleItem(activeDay, item.id, 'time', value)}
                        className="text-gray-900 text-sm sm:text-base"
                        placeholder="Time slot"
                        charLimit={TEXT_LIMITS.SCHEDULE_TIME}
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-900 text-sm sm:text-base">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" />
                        <span>{item.time}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      {isEditing ? (
                        <select
                          value={item.type}
                          onChange={(e) => updateScheduleItem(activeDay, item.id, 'type', e.target.value)}
                          className={`px-2 sm:px-3 py-1 text-white rounded-full text-xs capitalize ${getTypeColor(item.type)} border-2 border-dashed border-blue-300`}
                        >
                          {typeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={`px-2 sm:px-3 py-1 ${getTypeColor(item.type)} text-white rounded-full text-xs capitalize`}>
                          {item.type}
                        </span>
                      )}
                    </div>
                    
                    {isEditing ? (
                      <div className="space-y-3">
                        <EditableText
                          value={item.title}
                          onChange={(value) => updateScheduleItem(activeDay, item.id, 'title', value)}
                          className="text-gray-900 text-base sm:text-lg md:text-xl font-semibold"
                          placeholder="Session title"
                          charLimit={TEXT_LIMITS.SCHEDULE_TITLE}
                        />
                        
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                          <div className="flex items-center gap-2 flex-1">
                            <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
                            <EditableText
                              value={item.location}
                              onChange={(value) => updateScheduleItem(activeDay, item.id, 'location', value)}
                              className="text-gray-600 text-sm sm:text-base"
                              placeholder="Location"
                              charLimit={TEXT_LIMITS.SCHEDULE_LOCATION}
                            />
                          </div>
                          
                          <div className="flex items-center gap-2 flex-1">
                            <User className="w-4 h-4 text-amber-600 flex-shrink-0" />
                            <EditableText
                              value={item.speaker}
                              onChange={(value) => updateScheduleItem(activeDay, item.id, 'speaker', value)}
                              className="text-gray-600 text-sm sm:text-base"
                              placeholder="Speaker"
                              charLimit={TEXT_LIMITS.SCHEDULE_SPEAKER}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-gray-900 mb-3 group-hover:text-amber-600 transition-colors text-base sm:text-lg md:text-xl">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                        )}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-gray-600 text-sm sm:text-base">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
                            <span>{item.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-amber-600 flex-shrink-0" />
                            <span>{item.speaker}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add Schedule Item (edit mode) */}
            {isEditing && (
              <div
                className="group bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-all duration-300"
                onClick={() => addScheduleItem(activeDay)}
              >
                <div className="text-center">
                  <Plus className="w-6 h-6 text-gray-400 group-hover:text-blue-400 mx-auto mb-2" />
                  <p className="text-gray-500 group-hover:text-blue-400 font-semibold">Add Schedule Item</p>
                  <p className="text-gray-400 text-sm">Click to add a new session</p>
                </div>
              </div>
            )}
          </div>

          {/* Empty State */}
          {(getDayData(activeDay).items.length === 0) && !isEditing && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Schedule Items</h4>
                <p className="text-gray-600 mb-6">Add schedule items to showcase your event agenda.</p>
                <CustomButton
                  onClick={handleEdit}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Schedule
                </CustomButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}