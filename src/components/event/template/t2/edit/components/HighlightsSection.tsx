import { useState, useCallback, useEffect } from 'react';
import { Sparkles, Users, Award, Lightbulb, Heart, Zap, Edit2, Loader2, Save, X, Plus, Trash2, Calendar, MapPin, Clock, TrendingUp, Building2, Mic } from 'lucide-react';
import { toast } from 'react-toastify';

// Text limits
const TEXT_LIMITS = {
  SUBTITLE: 100,
  HEADING: 60,
  DESCRIPTION: 300,
  HIGHLIGHT_VALUE: 20,
  HIGHLIGHT_LABEL: 40,
  CTA_TITLE: 80,
  CTA_DESCRIPTION: 200,
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
    outline: "border border-ink-light bg-transparent hover:bg-ink-offwhite",
    default: "bg-status-info text-white hover:bg-status-info",
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
interface Stat {
  icon: string;
  value: string;
  label: string;
}

interface HighlightsContent {
  subtitle: string;
  heading: string;
  description: string;
  stats: Stat[];
}

interface CtaData {
  title: string;
  description: string;
  primaryButton: string;
  secondaryButton: string;
}

interface HighlightsData {
  highlightsContent: HighlightsContent;
  cta?: CtaData;
}

interface HighlightsProps {
  highlightsData?: any;
  onStateChange?: (data: HighlightsData) => void;
  userId?: string;
  eventId?: string;
  templateSelection?: string;
}

// Default data from AI - updated to match new structure
const defaultData: HighlightsData = {
  highlightsContent: {
    subtitle: "event highlights",
    heading: "Event by Numbers",
    description: "Impact and reach",
    stats: [
      {
        icon: 'Users',
        value: '1000+',
        label: 'Expected Attendees'
      },
      {
        icon: 'Mic',
        value: '20+',
        label: 'Expert Speakers'
      }
    ]
  },
  cta: {
    title: 'Early Bird Registration Open',
    description: 'Register before February 15th and save 25% on your ticket. Limited spots available for this premier tech event!',
    primaryButton: 'Claim Your Spot',
    secondaryButton: 'View Agenda'
  }
};

// Icon options - added Mic icon
const iconOptions = [
  { value: 'Users', label: 'Users', icon: Users },
  { value: 'Award', label: 'Award', icon: Award },
  { value: 'Lightbulb', label: 'Lightbulb', icon: Lightbulb },
  { value: 'Heart', label: 'Heart', icon: Heart },
  { value: 'Zap', label: 'Zap', icon: Zap },
  { value: 'Sparkles', label: 'Sparkles', icon: Sparkles },
  { value: 'Calendar', label: 'Calendar', icon: Calendar },
  { value: 'MapPin', label: 'Location', icon: MapPin },
  { value: 'Clock', label: 'Clock', icon: Clock },
  { value: 'TrendingUp', label: 'Trending Up', icon: TrendingUp },
  { value: 'Building', label: 'Building', icon: Building2 },
  { value: 'Mic', label: 'Mic', icon: Mic },
];

// Helper function to get icon component
const getIconComponent = (iconName: string) => {
  const iconOption = iconOptions.find(option => option.value === iconName);
  return iconOption ? iconOption.icon : Users;
};

// Transform API data to component format
const transformHighlightsData = (apiData: any): HighlightsData => {
  if (!apiData) return defaultData;

  return {
    highlightsContent: {
      subtitle: apiData.subtitle ,
      heading: apiData.heading ,
      description: apiData.description ,
      stats: apiData.stats 
    },
    cta: apiData.cta || defaultData.cta
  };
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
          className={`w-full bg-white/80 backdrop-blur-sm border-2 border-dashed border-status-info/40 rounded focus:border-status-info focus:outline-none p-2 ${className}`}
          placeholder={placeholder}
          rows={rows}
          maxLength={charLimit}
        />
        {charLimit && (
          <div className="absolute bottom-2 right-2 text-xs text-ink-caption">
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
          className={`w-full bg-white/80 backdrop-blur-sm border-2 border-dashed border-status-info/40 rounded focus:border-status-info focus:outline-none p-2 ${className}`}
          placeholder={placeholder}
          maxLength={charLimit}
        />
        {charLimit && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-ink-caption">
            {value.length}/{charLimit}
          </div>
        )}
      </div>
    )}
  </div>
);

export function HighlightsSection({ highlightsData, onStateChange, userId, eventId, templateSelection }: HighlightsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState<HighlightsData>(defaultData);
  const [tempData, setTempData] = useState<HighlightsData>(defaultData);

  // Initialize data from props
  useEffect(() => {
    if (highlightsData && !dataLoaded) {
      const transformedData = transformHighlightsData(highlightsData);
      setData(transformedData);
      setTempData(transformedData);
      setDataLoaded(true);
    }
  }, [highlightsData, dataLoaded]);

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
      toast.success('Highlights section saved successfully');
    } catch (error) {
      console.error('Error saving highlights:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...data });
    setIsEditing(false);
  };

  // Stat management functions - updated for new structure
  const addStat = useCallback(() => {
    const newStat: Stat = {
      icon: 'Users',
      value: '100+',
      label: 'New Stat'
    };
    setTempData(prev => ({
      ...prev,
      highlightsContent: {
        ...prev.highlightsContent,
        stats: [...prev.highlightsContent.stats, newStat]
      }
    }));
  }, []);

  const removeStat = useCallback((statIndex: number) => {
    const updatedStats = tempData.highlightsContent.stats.filter((_, index) => index !== statIndex);
    setTempData(prev => ({
      ...prev,
      highlightsContent: {
        ...prev.highlightsContent,
        stats: updatedStats
      }
    }));
  }, [tempData.highlightsContent.stats]);

  const updateStat = useCallback((statIndex: number, field: keyof Stat, value: string) => {
    const updatedStats = tempData.highlightsContent.stats.map((stat, index) =>
      index === statIndex ? { ...stat, [field]: value } : stat
    );
    setTempData(prev => ({
      ...prev,
      highlightsContent: {
        ...prev.highlightsContent,
        stats: updatedStats
      }
    }));
  }, [tempData.highlightsContent.stats]);

  const updateCta = useCallback((field: keyof CtaData, value: string) => {
    setTempData(prev => ({
      ...prev,
      cta: prev.cta ? { ...prev.cta, [field]: value } : defaultData.cta
    }));
  }, []);

  const updateHighlightsContent = useCallback((field: keyof HighlightsContent, value: string) => {
    setTempData(prev => ({
      ...prev,
      highlightsContent: {
        ...prev.highlightsContent,
        [field]: value
      }
    }));
  }, []);

  const displayData = isEditing ? tempData : data;

  return (
    <section id="highlights" className="py-16 sm:py-20 md:py-24 bg-surface-main relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-brand-yellow-soft/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-brand-yellow-soft/30 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Edit Controls */}
          <div className="text-right mb-8">
            {!isEditing ? (
              <CustomButton
                onClick={handleEdit}
                size="sm"
                className="bg-status-error hover:bg-status-error shadow-md text-white"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Highlights
              </CustomButton>
            ) : (
              <div className="flex gap-2 justify-end">
                <CustomButton
                  onClick={handleSave}
                  size="sm"
                  className="bg-status-success hover:bg-status-success text-white shadow-md"
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {isSaving ? "Saving..." : "Save"}
                </CustomButton>
                <CustomButton
                  onClick={handleCancel}
                  size="sm"
                  className="bg-status-error hover:bg-status-error text-white shadow-md"
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </CustomButton>
                <CustomButton
                  onClick={addStat}
                  variant="outline"
                  size="sm"
                  className="bg-status-info/10 hover:bg-status-info/15 text-status-info shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Stat
                </CustomButton>
              </div>
            )}
          </div>

          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            {isEditing ? (
              <>
                <div className="inline-block mb-4 px-4 py-2 bg-surface-card rounded-full border border-brand-yellow-soft shadow-sm">
                  <EditableText
                    value={displayData.highlightsContent.subtitle}
                    onChange={(value) => updateHighlightsContent('subtitle', value)}
                    className="text-status-error text-xl font-semibold text-center"
                    placeholder="Section subtitle"
                    charLimit={TEXT_LIMITS.SUBTITLE}
                  />
                </div>
                <EditableText
                  value={displayData.highlightsContent.heading}
                  onChange={(value) => updateHighlightsContent('heading', value)}
                  className="text-ink mb-4 text-3xl sm:text-4xl md:text-5xl text-center"
                  placeholder="Section heading"
                  charLimit={TEXT_LIMITS.HEADING}
                />
                <EditableText
                  value={displayData.highlightsContent.description}
                  onChange={(value) => updateHighlightsContent('description', value)}
                  multiline
                  className="text-ink-paragraph text-base sm:text-lg max-w-2xl mx-auto px-4 text-center"
                  placeholder="Section description"
                  charLimit={TEXT_LIMITS.DESCRIPTION}
                  rows={2}
                />
              </>
            ) : (
              <>
                <div className="inline-block mb-4 px-4 py-2 bg-surface-card rounded-full border border-brand-yellow-soft shadow-sm">
                  <span className="text-status-error text-xl font-semibold">{displayData.highlightsContent.subtitle}</span>
                </div>
                <h2 className="text-ink mb-4 text-3xl sm:text-4xl md:text-5xl">{displayData.highlightsContent.heading}</h2>
                <p className="text-ink-paragraph text-base sm:text-lg max-w-2xl mx-auto px-4">
                  {displayData.highlightsContent.description}
                </p>
              </>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {displayData.highlightsContent.stats.map((stat, index) => {
              const IconComponent = getIconComponent(stat.icon);
              
              return (
                <div
                  key={index}
                  className="group relative bg-surface-card p-6 sm:p-8 rounded-2xl border-2 border-brand-yellow-soft hover:border-brand-yellow transition-all duration-300 overflow-hidden hover:shadow-xl"
                >
                  {/* Edit Controls Overlay */}
                  {isEditing && (
                    <div className="absolute top-2 right-2 z-10">
                      <CustomButton
                        onClick={() => removeStat(index)}
                        size="sm"
                        className="bg-status-error hover:bg-status-error text-white p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </CustomButton>
                    </div>
                  )}

                  <div className="relative z-10">
                    {isEditing ? (
                      <div className="space-y-4">
                        {/* Icon Selection */}
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-brand-yellow rounded-xl flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <select
                            value={stat.icon}
                            onChange={(e) => updateStat(index, 'icon', e.target.value)}
                            className="flex-1 p-2 border border-ink-light rounded text-sm"
                          >
                            {iconOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Value */}
                        <EditableText
                          value={stat.value}
                          onChange={(value) => updateStat(index, 'value', value)}
                          className="text-brand-gold text-3xl sm:text-4xl font-bold"
                          placeholder="Stat value"
                          charLimit={TEXT_LIMITS.HIGHLIGHT_VALUE}
                        />

                        {/* Label */}
                        <EditableText
                          value={stat.label}
                          onChange={(value) => updateStat(index, 'label', value)}
                          className="text-ink text-lg sm:text-xl font-semibold"
                          placeholder="Stat label"
                          charLimit={TEXT_LIMITS.HIGHLIGHT_LABEL}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-brand-yellow rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-brand-gold mb-2 text-3xl sm:text-4xl">{stat.value}</div>
                        <h3 className="text-ink mb-2 text-lg sm:text-xl">{stat.label}</h3>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Add New Stat Card (edit mode) */}
            {isEditing && (
              <div
                className="group relative bg-ink-offwhite p-6 sm:p-8 rounded-2xl border-2 border-dashed border-ink-light flex flex-col items-center justify-center cursor-pointer hover:border-status-info transition-all duration-300 min-h-[200px]"
                onClick={addStat}
              >
                <div className="text-center">
                  <Plus className="w-8 h-8 text-ink-caption group-hover:text-status-info mx-auto mb-2" />
                  <p className="text-ink-caption group-hover:text-status-info font-semibold">Add Stat</p>
                  <p className="text-ink-caption text-sm mt-1">Click to add a new stat</p>
                </div>
              </div>
            )}
          </div>

          {/* CTA Section */}
          {/* {displayData.cta && (
            <div className="max-w-4xl mx-auto bg-brand-yellow rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-xl">
              {isEditing ? (
                <div className="space-y-6">
                  <EditableText
                    value={displayData.cta.title}
                    onChange={(value) => updateCta('title', value)}
                    className="text-ink text-2xl sm:text-3xl md:text-4xl font-bold"
                    placeholder="CTA title"
                    charLimit={TEXT_LIMITS.CTA_TITLE}
                  />
                  <EditableText
                    value={displayData.cta.description}
                    onChange={(value) => updateCta('description', value)}
                    multiline
                    className="text-ink-charcoal text-base sm:text-lg max-w-2xl mx-auto"
                    placeholder="CTA description"
                    charLimit={TEXT_LIMITS.CTA_DESCRIPTION}
                    rows={3}
                  />
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <EditableText
                      value={displayData.cta.primaryButton}
                      onChange={(value) => updateCta('primaryButton', value)}
                      className="text-center"
                      placeholder="Primary button text"
                      charLimit={TEXT_LIMITS.BUTTON_TEXT}
                    />
                    <EditableText
                      value={displayData.cta.secondaryButton}
                      onChange={(value) => updateCta('secondaryButton', value)}
                      className="text-center"
                      placeholder="Secondary button text"
                      charLimit={TEXT_LIMITS.BUTTON_TEXT}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-ink mb-4 text-2xl sm:text-3xl md:text-4xl">{displayData.cta.title}</h3>
                  <p className="text-ink-charcoal text-base sm:text-lg mb-6 max-w-2xl mx-auto">
                    {displayData.cta.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-6 sm:px-8 py-3 sm:py-4 bg-ink text-white rounded-xl hover:bg-ink-charcoal transition-colors text-sm sm:text-base">
                      {displayData.cta.primaryButton}
                    </button>
                    <button className="px-6 sm:px-8 py-3 sm:py-4 bg-surface-card text-ink rounded-xl hover:bg-ink-light transition-colors text-sm sm:text-base">
                      {displayData.cta.secondaryButton}
                    </button>
                  </div>
                </>
              )}
            </div>
          )} */}

          {/* Empty State */}
          {displayData.highlightsContent.stats.length === 0 && !isEditing && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-ink-light rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-ink-caption" />
                </div>
                <h4 className="text-lg font-semibold text-ink mb-2">No Stats Added</h4>
                <p className="text-ink-paragraph mb-6">Add stats to showcase your event highlights.</p>
                <CustomButton
                  onClick={handleEdit}
                  className="bg-brand-gold hover:bg-brand-gold text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Stats
                </CustomButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}