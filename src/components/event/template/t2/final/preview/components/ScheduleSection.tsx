import { useState, useEffect } from 'react';
import { Clock, MapPin, User } from 'lucide-react';

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
}

const convertDaysArrayToObject = (daysArray: any[]): { [key: number]: DayData } => {
  const daysObject: { [key: number]: DayData } = {};
  
  daysArray.forEach((day, index) => {
    const dayNumber = index + 1;
    daysObject[dayNumber] = {
      label: day.label,
      date: day.date.includes(' - ') ? day.date.split(' - ')[1] : day.date,
      items: day.sessions.map((session: any) => ({
        id: session.id,
        time: session.time,
        title: session.title,
        location: session.location,
        speaker: session.speaker,
        type: session.type,
        description: session.description
      }))
    };
  });
  
  return daysObject;
};

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

const defaultData: ScheduleData = createDefaultData();

const typeOptions = [
  { value: 'keynote', label: 'Keynote', color: 'bg-brand-gold' },
  { value: 'workshop', label: 'Workshop', color: 'bg-brand-gold' },
  { value: 'panel', label: 'Panel', color: 'bg-status-warning' },
  { value: 'session', label: 'Session', color: 'bg-brand-yellow' },
  { value: 'networking', label: 'Networking', color: 'bg-brand-yellow' },
  { value: 'break', label: 'Break', color: 'bg-ink-caption' },
  { value: 'registration', label: 'Registration', color: 'bg-ink-caption' },
  { value: 'closing', label: 'Closing', color: 'bg-brand-gold' },
];

export function ScheduleSection({ scheduleData }: ScheduleProps) {
  const [data, setData] = useState<ScheduleData>(defaultData);
  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    if (scheduleData) {
      let convertedData: ScheduleData;
      
      if (scheduleData.days && Array.isArray(scheduleData.days)) {
        convertedData = {
          subtitle: scheduleData.subtitle || defaultData.subtitle,
          heading: scheduleData.heading || defaultData.heading,
          description: scheduleData.description || defaultData.description,
          days: convertDaysArrayToObject(scheduleData.days)
        };
      } else {
        convertedData = scheduleData;
      }
      
      setData(convertedData);
    }
  }, [scheduleData]);

  const displayData = data;

  // Helper function to get type color
  const getTypeColor = (type: string) => {
    const typeOption = typeOptions.find(option => option.value === type);
    return typeOption ? typeOption.color : 'bg-ink-caption';
  };

  return (
    <section id="schedule" className="py-16 sm:py-20 md:py-24 bg-brand-yellow-soft">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-surface-card rounded-full shadow-sm border border-brand-yellow-soft">
              <span className="text-status-error text-xl font-semibold">{displayData.subtitle}</span>
            </div>
            <h2 className="text-ink mb-4 text-3xl sm:text-4xl md:text-5xl">{displayData.heading}</h2>
            <p className="text-ink-paragraph text-base sm:text-lg max-w-2xl mx-auto px-4">
              {displayData.description}
            </p>
          </div>

          {/* Day Tabs */}
          <div className="flex justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 flex-wrap px-4">
            {Object.keys(displayData.days).map(dayNumber => {
              const day = parseInt(dayNumber);
              const dayData = displayData.days[day];
              
              return (
                <div key={day} className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveDay(day)}
                      className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300 text-sm sm:text-base min-w-[120px] ${
                        activeDay === day
                          ? 'bg-brand-yellow text-ink shadow-lg scale-105'
                          : 'bg-surface-card text-ink-paragraph hover:bg-surface-main border border-ink-light'
                      }`}
                    >
                      <div className="font-semibold">{dayData.label}</div>
                      <div className="text-xs sm:text-sm mt-1">{dayData.date}</div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Schedule Items */}
          <div className="space-y-4 sm:space-y-6">
            {displayData.days[activeDay]?.items.map((item, index) => (
              <div
                key={item.id}
                className="group bg-surface-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-transparent hover:border-brand-gold"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 sm:gap-6">
                  <div className="lg:w-44 flex-shrink-0">
                    <div className="flex items-center gap-2 text-ink text-sm sm:text-base">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold flex-shrink-0" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 sm:px-3 py-1 ${getTypeColor(item.type)} text-white rounded-full text-xs capitalize`}>
                        {item.type}
                      </span>
                    </div>
                    
                    <h3 className="text-ink mb-3 group-hover:text-brand-yellow transition-colors text-base sm:text-lg md:text-xl">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-ink-paragraph text-sm mb-3">{item.description}</p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-ink-paragraph text-sm sm:text-base">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-gold flex-shrink-0" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-brand-gold flex-shrink-0" />
                        <span>{item.speaker}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {(!displayData.days[activeDay]?.items || displayData.days[activeDay].items.length === 0) && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-ink-light rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-ink-caption" />
                </div>
                <h4 className="text-lg font-semibold text-ink mb-2">No Schedule Items</h4>
                <p className="text-ink-paragraph">Add schedule items to showcase your event agenda.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}