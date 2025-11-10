import { useState, useCallback, useEffect } from 'react';
import { Calendar, MapPin, Users, Edit2, Loader2, Save, X } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { toast } from 'react-toastify';

// Text limits
const TEXT_LIMITS = {
  SUBTITLE: 100,
  TITLE_PART1: 60,
  TITLE_PART2: 60,
  DESCRIPTION: 300,
  BUTTON_PRIMARY: 30,
  BUTTON_SECONDARY: 30,
  EVENT_DATE: 50,
  EVENT_LOCATION: 50,
  EVENT_ATTENDEES: 50,
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
interface HeroData {
  subtitle: string;
  titlePart1: string;
  titlePart2: string;
  description: string;
  primaryButton: string;
  secondaryButton: string;
  eventInfo: {
    date: string;
    location: string;
    attendees: string;
  };
}

interface HeroProps {
  heroData?: HeroData;
  onStateChange?: (data: HeroData) => void;
  userId?: string;
  professionalId?: string;
  templateSelection?: string;
}

// Default data
const defaultData: HeroData = {
  subtitle: "Annual Conference 2025",
  titlePart1: "Transform",
  titlePart2: "The Future",
  description: "Join industry leaders, innovators, and visionaries for three days of inspiration, networking, and breakthrough ideas",
  primaryButton: "Get Your Tickets",
  secondaryButton: "View Schedule",
  eventInfo: {
    date: "March 15-17, 2025",
    location: "New York, USA",
    attendees: "2000+ Expected"
  }
};

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

export function HeroSection({ heroData, onStateChange, userId, professionalId, templateSelection }: HeroProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState<HeroData>(defaultData);
  const [tempData, setTempData] = useState<HeroData>(defaultData);

  // Initialize data from props
  useEffect(() => {
    if (heroData && !dataLoaded) {
      setData(heroData);
      setTempData(heroData);
      setDataLoaded(true);
    }
  }, [heroData, dataLoaded]);

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
      toast.success('Hero section saved successfully');
    } catch (error) {
      console.error('Error saving hero section:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...data });
    setIsEditing(false);
  };

  const updateField = useCallback((field: keyof HeroData, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateEventInfo = useCallback((field: keyof HeroData['eventInfo'], value: string) => {
    setTempData(prev => ({
      ...prev,
      eventInfo: { ...prev.eventInfo, [field]: value }
    }));
  }, []);

  const displayData = isEditing ? tempData : data;

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-yellow-50 pt-32">
      {/* Edit Controls */}
      <div className="absolute top-[9rem] right-8 z-50">
        {!isEditing ? (
          <CustomButton
            onClick={handleEdit}
            size="sm"
            className="bg-red-500 hover:bg-red-600 shadow-md text-white"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Hero
          </CustomButton>
        ) : (
          <div className="flex gap-2">
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
          </div>
        )}
      </div>

      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-10 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-20 left-1/2 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-60"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-amber-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-6 px-6 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-amber-200 shadow-sm"
          >
            {isEditing ? (
              <EditableText
                value={displayData.subtitle}
                onChange={(value) => updateField('subtitle', value)}
                className="text-amber-700 text-center"
                placeholder="Section subtitle"
                charLimit={TEXT_LIMITS.SUBTITLE}
              />
            ) : (
              <span className="text-amber-700">{displayData.subtitle}</span>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-900 mb-6 leading-tight"
          >
            {isEditing ? (
              <div className="space-y-4">
                <EditableText
                  value={displayData.titlePart1}
                  onChange={(value) => updateField('titlePart1', value)}
                  className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-center"
                  placeholder="First part of title"
                  charLimit={TEXT_LIMITS.TITLE_PART1}
                />
                <EditableText
                  value={displayData.titlePart2}
                  onChange={(value) => updateField('titlePart2', value)}
                  className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-center text-amber-600 bg-clip-text"
                  placeholder="Second part of title"
                  charLimit={TEXT_LIMITS.TITLE_PART2}
                />
              </div>
            ) : (
              <>
                <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl">{displayData.titlePart1}</span>
                <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl mt-2 bg-amber-600 bg-clip-text text-transparent">
                  {displayData.titlePart2}
                </span>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto px-4"
          >
            {isEditing ? (
              <EditableText
                value={displayData.description}
                onChange={(value) => updateField('description', value)}
                multiline
                className="text-center"
                placeholder="Hero description"
                charLimit={TEXT_LIMITS.DESCRIPTION}
                rows={3}
              />
            ) : (
              displayData.description
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 px-4"
          >
            {isEditing ? (
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
                <EditableText
                  value={displayData.primaryButton}
                  onChange={(value) => updateField('primaryButton', value)}
                  className="text-center"
                  placeholder="Primary button text"
                  charLimit={TEXT_LIMITS.BUTTON_PRIMARY}
                />
                <EditableText
                  value={displayData.secondaryButton}
                  onChange={(value) => updateField('secondaryButton', value)}
                  className="text-center"
                  placeholder="Secondary button text"
                  charLimit={TEXT_LIMITS.BUTTON_SECONDARY}
                />
              </div>
            ) : (
              <>
                <Button
                  size="lg"
                  className="bg-yellow-400 hover:from-yellow-500 hover:to-amber-600 text-gray-900 px-8 py-6 text-base sm:text-lg shadow-lg"
                >
                  {displayData.primaryButton}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-6 text-base sm:text-lg bg-white/70 backdrop-blur-sm"
                >
                  {displayData.secondaryButton}
                </Button>
              </>
            )}
          </motion.div>

          {/* Event Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4 mb-4"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-amber-200 hover:scale-105 transition-transform duration-300">
              <Calendar className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <p className="text-gray-600 mb-1 text-sm">Date</p>
              {isEditing ? (
                <EditableText
                  value={displayData.eventInfo.date}
                  onChange={(value) => updateEventInfo('date', value)}
                  className="text-gray-900 text-center"
                  placeholder="Event date"
                  charLimit={TEXT_LIMITS.EVENT_DATE}
                />
              ) : (
                <p className="text-gray-900">{displayData.eventInfo.date}</p>
              )}
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-amber-200 hover:scale-105 transition-transform duration-300">
              <MapPin className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <p className="text-gray-600 mb-1 text-sm">Location</p>
              {isEditing ? (
                <EditableText
                  value={displayData.eventInfo.location}
                  onChange={(value) => updateEventInfo('location', value)}
                  className="text-gray-900 text-center"
                  placeholder="Event location"
                  charLimit={TEXT_LIMITS.EVENT_LOCATION}
                />
              ) : (
                <p className="text-gray-900">{displayData.eventInfo.location}</p>
              )}
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-amber-200 hover:scale-105 transition-transform duration-300 sm:col-span-2 md:col-span-1">
              <Users className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <p className="text-gray-600 mb-1 text-sm">Attendees</p>
              {isEditing ? (
                <EditableText
                  value={displayData.eventInfo.attendees}
                  onChange={(value) => updateEventInfo('attendees', value)}
                  className="text-gray-900 text-center"
                  placeholder="Attendee count"
                  charLimit={TEXT_LIMITS.EVENT_ATTENDEES}
                />
              ) : (
                <p className="text-gray-900">{displayData.eventInfo.attendees}</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-gray-900 rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-3 bg-gray-900 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}