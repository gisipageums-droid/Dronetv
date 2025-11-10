import { useState, useCallback, useEffect } from 'react';
import { Sparkles, Users, Award, Lightbulb, Heart, Zap, Edit2, Loader2, Save, X, Plus, Trash2, Calendar, MapPin, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';

// Text limits
const TEXT_LIMITS = {
  SUBTITLE: 100,
  HEADING: 60,
  DESCRIPTION: 300,
  HIGHLIGHT_NUMBER: 20,
  HIGHLIGHT_LABEL: 40,
  HIGHLIGHT_DESCRIPTION: 100,
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
interface Highlight {
  id: string;
  icon: string;
  number: string;
  label: string;
  description: string;
}

interface HighlightsData {
  subtitle: string;
  heading: string;
  description: string;
  highlights: Highlight[];
  cta: {
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
  };
}

interface HighlightsProps {
  highlightsData?: HighlightsData;
  onStateChange?: (data: HighlightsData) => void;
  userId?: string;
  professionalId?: string;
  templateSelection?: string;
}

// Default data
const defaultData: HighlightsData = {
  subtitle: "Event Highlights",
  heading: "The Numbers Speak",
  description: "Join thousands of professionals in an event that's breaking records and setting new standards.",
  highlights: [
    {
      id: '1',
      icon: 'Users',
      number: '2000+',
      label: 'Attendees',
      description: 'Industry professionals from around the globe',
    },
    {
      id: '2',
      icon: 'Award',
      number: '50+',
      label: 'Expert Speakers',
      description: 'Thought leaders and innovators',
    },
    {
      id: '3',
      icon: 'Lightbulb',
      number: '75+',
      label: 'Sessions',
      description: 'Workshops, panels, and keynotes',
    },
    {
      id: '4',
      icon: 'Heart',
      number: '30+',
      label: 'Partners',
      description: 'Leading companies and organizations',
    },
    {
      id: '5',
      icon: 'Zap',
      number: '100+',
      label: 'Exhibitors',
      description: 'Showcasing cutting-edge solutions',
    },
    {
      id: '6',
      icon: 'Sparkles',
      number: '3',
      label: 'Days',
      description: 'Of innovation and networking',
    },
  ],
  cta: {
    title: 'Early Bird Discount Available',
    description: 'Register before February 1st and save 30% on your ticket. Limited spots available!',
    primaryButton: 'Claim Your Discount',
    secondaryButton: 'View Pricing'
  }
};

// Icon options
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
];

// Helper function to get icon component
const getIconComponent = (iconName: string) => {
  const iconOption = iconOptions.find(option => option.value === iconName);
  return iconOption ? iconOption.icon : Users;
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

export function HighlightsSection({ highlightsData, onStateChange, userId, professionalId, templateSelection }: HighlightsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState<HighlightsData>(defaultData);
  const [tempData, setTempData] = useState<HighlightsData>(defaultData);

  // Initialize data from props
  useEffect(() => {
    if (highlightsData && !dataLoaded) {
      setData(highlightsData);
      setTempData(highlightsData);
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

  // Highlight management functions
  const addHighlight = useCallback(() => {
    const newHighlight: Highlight = {
      id: Date.now().toString(),
      icon: 'Users',
      number: '100+',
      label: 'New Highlight',
      description: 'Highlight description'
    };
    setTempData(prev => ({
      ...prev,
      highlights: [...prev.highlights, newHighlight]
    }));
  }, []);

  const removeHighlight = useCallback((highlightId: string) => {
    const updatedHighlights = tempData.highlights.filter(highlight => highlight.id !== highlightId);
    setTempData(prev => ({ ...prev, highlights: updatedHighlights }));
  }, [tempData.highlights]);

  const updateHighlight = useCallback((highlightId: string, field: keyof Highlight, value: string) => {
    const updatedHighlights = tempData.highlights.map(highlight =>
      highlight.id === highlightId ? { ...highlight, [field]: value } : highlight
    );
    setTempData(prev => ({ ...prev, highlights: updatedHighlights }));
  }, [tempData.highlights]);

  const updateCta = useCallback((field: keyof HighlightsData['cta'], value: string) => {
    setTempData(prev => ({
      ...prev,
      cta: { ...prev.cta, [field]: value }
    }));
  }, []);

  const updateField = useCallback((field: keyof HighlightsData, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  }, []);

  const displayData = isEditing ? tempData : data;

  return (
    <section id="highlights" className="py-16 sm:py-20 md:py-24 bg-amber-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-yellow-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-amber-300/30 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
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
                Edit Highlights
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
                  onClick={addHighlight}
                  variant="outline"
                  size="sm"
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Highlight
                </CustomButton>
              </div>
            )}
          </div>

          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            {isEditing ? (
              <>
                <div className="inline-block mb-4 px-4 py-2 bg-white rounded-full border border-amber-200 shadow-sm">
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
                <div className="inline-block mb-4 px-4 py-2 bg-white rounded-full border border-amber-200 shadow-sm">
                  <span className="text-red-700 text-xl font-semibold">{displayData.subtitle}</span>
                </div>
                <h2 className="text-gray-900 mb-4 text-3xl sm:text-4xl md:text-5xl">{displayData.heading}</h2>
                <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
                  {displayData.description}
                </p>
              </>
            )}
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {displayData.highlights.map((highlight) => {
              const IconComponent = getIconComponent(highlight.icon);
              
              return (
                <div
                  key={highlight.id}
                  className="group relative bg-white p-6 sm:p-8 rounded-2xl border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 overflow-hidden hover:shadow-xl"
                >
                  {/* Edit Controls Overlay */}
                  {isEditing && (
                    <div className="absolute top-2 right-2 z-10">
                      <CustomButton
                        onClick={() => removeHighlight(highlight.id)}
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white p-1"
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
                          <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <select
                            value={highlight.icon}
                            onChange={(e) => updateHighlight(highlight.id, 'icon', e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded text-sm"
                          >
                            {iconOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Number */}
                        <EditableText
                          value={highlight.number}
                          onChange={(value) => updateHighlight(highlight.id, 'number', value)}
                          className="text-amber-600 text-3xl sm:text-4xl font-bold"
                          placeholder="Highlight number"
                          charLimit={TEXT_LIMITS.HIGHLIGHT_NUMBER}
                        />

                        {/* Label */}
                        <EditableText
                          value={highlight.label}
                          onChange={(value) => updateHighlight(highlight.id, 'label', value)}
                          className="text-gray-900 text-lg sm:text-xl font-semibold"
                          placeholder="Highlight label"
                          charLimit={TEXT_LIMITS.HIGHLIGHT_LABEL}
                        />

                        {/* Description */}
                        <EditableText
                          value={highlight.description}
                          onChange={(value) => updateHighlight(highlight.id, 'description', value)}
                          multiline
                          className="text-gray-600 text-sm sm:text-base"
                          placeholder="Highlight description"
                          charLimit={TEXT_LIMITS.HIGHLIGHT_DESCRIPTION}
                          rows={2}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-amber-600 mb-2 text-3xl sm:text-4xl">{highlight.number}</div>
                        <h3 className="text-gray-900 mb-2 text-lg sm:text-xl">{highlight.label}</h3>
                        <p className="text-gray-600 text-sm sm:text-base">{highlight.description}</p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Add New Highlight Card (edit mode) */}
            {isEditing && (
              <div
                className="group relative bg-gray-50 p-6 sm:p-8 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-all duration-300 min-h-[200px]"
                onClick={addHighlight}
              >
                <div className="text-center">
                  <Plus className="w-8 h-8 text-gray-400 group-hover:text-blue-400 mx-auto mb-2" />
                  <p className="text-gray-500 group-hover:text-blue-400 font-semibold">Add Highlight</p>
                  <p className="text-gray-400 text-sm mt-1">Click to add a new highlight</p>
                </div>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="max-w-4xl mx-auto bg-yellow-400 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-xl">
            {isEditing ? (
              <div className="space-y-6">
                <EditableText
                  value={displayData.cta.title}
                  onChange={(value) => updateCta('title', value)}
                  className="text-gray-900 text-2xl sm:text-3xl md:text-4xl font-bold"
                  placeholder="CTA title"
                  charLimit={TEXT_LIMITS.CTA_TITLE}
                />
                <EditableText
                  value={displayData.cta.description}
                  onChange={(value) => updateCta('description', value)}
                  multiline
                  className="text-gray-800 text-base sm:text-lg max-w-2xl mx-auto"
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
                <h3 className="text-gray-900 mb-4 text-2xl sm:text-3xl md:text-4xl">{displayData.cta.title}</h3>
                <p className="text-gray-800 text-base sm:text-lg mb-6 max-w-2xl mx-auto">
                  {displayData.cta.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm sm:text-base">
                    {displayData.cta.primaryButton}
                  </button>
                  <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-colors text-sm sm:text-base">
                    {displayData.cta.secondaryButton}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Empty State */}
          {displayData.highlights.length === 0 && !isEditing && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Highlights Added</h4>
                <p className="text-gray-600 mb-6">Add highlights to showcase your event statistics.</p>
                <CustomButton
                  onClick={handleEdit}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Highlights
                </CustomButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}