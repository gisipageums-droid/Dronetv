import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Edit2, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

// Text limits
const TEXT_LIMITS = {
  LOGO_TEXT: 30,
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
  const baseClasses =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
    default: 'bg-blue-600 text-white hover:bg-blue-700',
  };
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    default: 'h-10 px-4',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className || ''
        }`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Data interfaces
interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

interface NavigationData {
  logoText: string;
  navItems: NavigationItem[];
}

interface NavigationProps {
  activeSection: string;
  navigationData?: NavigationData;
  onStateChange?: (data: NavigationData) => void;
}

// Static navigation data - cannot be edited
const staticNavItems: NavigationItem[] = [
  { id: '1', label: 'Home', href: '#home' },
  { id: '2', label: 'Events', href: '#events' },
  { id: '3', label: 'Highlights', href: '#highlights' },
  { id: '4', label: 'Speakers', href: '#speakers' },
  { id: '5', label: 'Schedule', href: '#schedule' },
  { id: '6', label: 'Exhibitors', href: '#exhibitors' },
  { id: '7', label: 'Gallery', href: '#gallery' },
  { id: '8', label: 'Contact', href: '#contact' },
];

// Default data
const defaultData: NavigationData = {
  logoText: 'EventPro',
  navItems: staticNavItems,
};

// Editable Text Component
const EditableText = ({
  value,
  onChange,
  className = '',
  placeholder = '',
  charLimit,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  charLimit: number;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className={`bg-white/80 backdrop-blur-sm border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 w-full ${className}`}
        placeholder={placeholder}
        maxLength={charLimit}
      />
      {charLimit && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
          {value.length}/{charLimit}
        </div>
      )}
    </div>
  );
};

export function Navigation({ activeSection, navigationData, onStateChange }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState<NavigationData>(defaultData);
  const [tempData, setTempData] = useState<NavigationData>(defaultData);

  // Initialize data from props
  useEffect(() => {
    if (navigationData && !dataLoaded) {
      setData(navigationData);
      setTempData(navigationData);
      setDataLoaded(true);
    }
  }, [navigationData, dataLoaded]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange && dataLoaded) {
      onStateChange(data);
    }
  }, [data, dataLoaded, onStateChange]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      setData(tempData);
      setIsEditing(false);
      toast.success('Navigation saved successfully');
    } catch (error) {
      console.error('Error saving navigation:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...data });
    setIsEditing(false);
  };

  const updateField = useCallback((field: keyof NavigationData, value: string) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const scrollToSection = (id: string) => {
    if (isEditing) return; // Disable scrolling in edit mode

    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
    setIsMobileMenuOpen(false);
  };

  const displayData = isEditing ? tempData : data;

  // Get first letter of logo text for logo display
  const getLogoLetter = () => {
    return displayData.logoText.charAt(0).toUpperCase() || 'E';
  };

  return (
    <>
      <nav
        className={`fixed top-[4rem] left-0 right-0 z-[50] transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 backdrop-blur-md py-4'
          }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Container: left = logo, right = nav items + controls */}
          <div className="flex items-center justify-between">
            {/* LEFT: Logo only */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">{getLogoLetter()}</span>
              </div>
              {isEditing ? (
                <EditableText
                  value={displayData.logoText}
                  onChange={(value) => updateField('logoText', value)}
                  className="text-gray-900 text-lg"
                  placeholder="Logo text"
                  charLimit={TEXT_LIMITS.LOGO_TEXT}
                />
              ) : (
                <span className="text-gray-900 text-lg">{displayData.logoText}</span>
              )}
            </div>

            {/* RIGHT: Nav items + Edit Controls */}
            <div className="flex items-center gap-4">
              {/* Nav items (desktop) */}
              <div className="hidden lg:flex items-center gap-6 mr-2">
                {staticNavItems.map((item) => (
                  <div key={item.id} className="relative group">
                    <button
                      onClick={() => scrollToSection(item.href.substring(1))}
                      className={`transition-colors duration-200 relative group text-sm ${activeSection === item.href.substring(1)
                        ? 'text-amber-600'
                        : 'text-gray-600 hover:text-amber-600'
                        }`}
                    >
                      {item.label}
                      <span
                        className={`absolute -bottom-1 left-0 w-full h-0.5 bg-amber-500 transition-transform duration-200 ${activeSection === item.href.substring(1) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              {/* Edit Controls - only shown on sm+ (desktop/tablet) */}
              <div className="hidden sm:flex">
                {!isEditing ? (
                  <CustomButton onClick={handleEdit} size="sm" className="bg-red-500 hover:bg-red-600 shadow-md text-white">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
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
                      {isSaving ? 'Saving...' : 'Save'}
                    </CustomButton>
                    <CustomButton onClick={handleCancel} size="sm" className="bg-red-500 hover:bg-red-600 text-white shadow-md" disabled={isSaving}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </CustomButton>
                  </div>
                )}
              </div>

              {/* MOBILE: small icon controls (visible only on mobile) */}
              <div className="flex items-center lg:hidden">
                {!isEditing ? (
                  <button
                    onClick={() => {
                      handleEdit();
                    }}
                    className="p-2 text-gray-900 mr-1"
                    aria-label="Edit"
                  >
                    <Edit2 size={20} />
                  </button>
                ) : (
                  <div className="flex items-center gap-1 mr-1">
                    <button
                      onClick={handleSave}
                      className="p-2 text-gray-900"
                      aria-label="Save"
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader2 size={18} /> : <Save size={18} />}
                    </button>
                    <button onClick={handleCancel} className="p-2 text-gray-900" aria-label="Cancel">
                      <X size={18} />
                    </button>
                  </div>
                )}

                {/* Mobile menu button */}
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-900" aria-label="Open menu">
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`fixed right-0 top-0 bottom-0 w-full h-screen bg-white shadow-xl transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6 text-gray-900">
              <X size={24} />
            </button>

            {/* Mobile: Place Edit Controls at top for quick access (icons visible) */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between gap-2">
              {isEditing ? (
                <div className="flex gap-2">
                  <CustomButton onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs flex items-center" disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    <span className="text-[11px]">{isSaving ? 'Saving' : 'Save'}</span>
                  </CustomButton>
                  <CustomButton onClick={handleCancel} size="sm" className="bg-red-500 hover:bg-red-600 text-white text-xs flex items-center" disabled={isSaving}>
                    <X className="w-4 h-4 mr-2" />
                    <span className="text-[11px]">Cancel</span>
                  </CustomButton>
                </div>
              ) : (
                <CustomButton onClick={handleEdit} size="sm" className="bg-red-500 hover:bg-red-600 text-white text-xs flex items-center">
                  <Edit2 className="w-4 h-4 mr-2" />
                  <span className="text-[11px]">Edit</span>
                </CustomButton>
              )}
            </div>

            <div className="mt-12 flex flex-col gap-3">
              {staticNavItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <button
                    onClick={() => scrollToSection(item.href.substring(1))}
                    className={`text-left py-2 transition-colors duration-200 text-sm w-full ${activeSection === item.href.substring(1) ? 'text-amber-600' : 'text-gray-600 hover:text-amber-600'
                      }`}
                  >
                    {item.label}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
