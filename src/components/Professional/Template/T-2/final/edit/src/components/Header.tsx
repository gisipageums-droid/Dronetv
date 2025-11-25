// import { Edit2, Loader2, Menu, Save, Upload, X } from 'lucide-react';
// import { useEffect, useRef, useState } from 'react';
// import { toast } from 'sonner';
// import { DarkModeToggle } from './DarkModeToggle';

// // Custom Button component (consistent with other components)
// const Button = ({
//   children,
//   onClick,
//   variant,
//   size,
//   className,
//   disabled,
//   ...props
// }: {
//   children: React.ReactNode;
//   onClick?: () => void;
//   variant?: string;
//   size?: string;
//   className?: string;
//   disabled?: boolean;
// }) => {
//   const baseClasses =
//     "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
//   const variants: Record<string, string> = {
//     outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
//     default: "bg-blue-600 text-white hover:bg-blue-700",
//   };
//   const sizes: Record<string, string> = {
//     sm: "h-8 px-3 text-sm",
//     default: "h-10 px-4",
//   };

//   return (
//     <button
//       className={`${baseClasses} ${variants[variant || 'default']} ${
//         sizes[size || 'default']
//       } ${className || ""}`}
//       onClick={onClick}
//       disabled={disabled}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// interface NavLink {
//   href: string;
//   label: string;
// }

// interface HeaderData {
//   logoText: string;
//   navLinks: NavLink[];
// }

// const defaultHeaderData: HeaderData = {
//   logoText: "arijit",
//   navLinks: [
//     { href: '#home', label: 'Home' },
//     { href: '#about', label: 'About' },
//     { href: '#skills', label: 'Skills' },
//     { href: '#services', label: 'Services' },
//     { href: '#projects', label: 'Projects' },
//     { href: '#certification', label: 'Certification' },
//     { href: '#clients', label: 'clients' },
//     { href: '#testimonials', label: 'Testimonials' },
//     { href: '#contact', label: 'Contact' },
//   ]
// };

// interface HeaderProps {
//   headerData?: HeaderData;
//   onStateChange?: (data: HeaderData) => void;
//   onDarkModeToggle: (isDark: boolean) => void;
//   userId?: string;
//   professionalId?: string;
//   templateSelection?: string;
// }

// export function Header({ headerData, onStateChange, onDarkModeToggle}: HeaderProps) {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [dataLoaded, setDataLoaded] = useState(false);
//   const headerRef = useRef<HTMLDivElement>(null);
  
//   const [data, setData] = useState<HeaderData>(defaultHeaderData);
//   const [tempData, setTempData] = useState<HeaderData>(defaultHeaderData);

//   // Notify parent of state changes
//   useEffect(() => {
//     if (onStateChange) {
//       onStateChange(data);
//     }
//   }, [data]);

//   // Fake API fetch
//   const fetchHeaderData = async () => {
//     setIsLoading(true);
//     try {
//       const response = await new Promise<HeaderData>((resolve) =>
//         setTimeout(() => resolve(headerData || defaultHeaderData), 1200)
//       );
//       setData(response);
//       setTempData(response);
//       setDataLoaded(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!dataLoaded && !isLoading) {
//       fetchHeaderData();
//     }
//   }, [dataLoaded, isLoading, headerData]);

//   const handleEdit = () => {
//     setIsEditing(true);
//     setTempData({ ...data });
//   };

//   // Save function
//   const handleSave = async () => {
//     try {
//       setIsSaving(true);
//       await new Promise((resolve) => setTimeout(resolve, 1000));
      
//       setData(tempData);
//       setIsEditing(false);
//       setIsMenuOpen(false);
//       toast.success('Header section saved successfully');

//     } catch (error) {
//       console.error('Error saving header section:', error);
//       toast.error('Error saving changes. Please try again.');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     setTempData({ ...data });
//     setIsEditing(false);
//   };

//   // Update logo text
//   const updateLogoText = (value: string) => {
//     setTempData(prev => ({
//       ...prev,
//       logoText: value
//     }));
//   };

//   // Get first character in uppercase for avatar
//   const getAvatarLetter = (text: string) => {
//     return text.charAt(0).toUpperCase();
//   };

//   const displayData = isEditing ? tempData : data;

//   // Loading state
//   if (isLoading) {
//     return (
//       <header ref={headerRef} className="fixed top-[4rem] left-0 right-0 z-40 bg-background border-b border-border shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
//           <Loader2 className="w-6 h-6 animate-spin mx-auto text-yellow-400" />
//         </div>
//       </header>
//     );
//   }
  
//   return (
//     <header ref={headerRef} className="fixed top-[4rem] left-0 right-0 z-40 bg-background border-b border-border shadow-lg">
//       <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center py-4">
//           {/* Avatar and Brand */}
//           <div className="text-2xl font-bold transition-transform duration-300 text-foreground">
//             <div className='flex items-center gap-4'>
//               {isEditing ? (
//                 <>
//                   {/* Edit Mode */}
//                   <div className="flex items-center gap-4">
//                     {/* Avatar Display */}
//                     <div className="flex flex-col items-center gap-2">
//                       <div className="w-14 h-14 rounded-full bg-yellow-300 flex items-center justify-center text-black font-bold text-lg border-2 border-yellow-300 shadow-lg">
//                         {getAvatarLetter(displayData.logoText)}
//                       </div>
//                     </div>
                    
//                     {/* Logo Text Input - Now positioned to the right of avatar */}
//                     <div className="flex flex-col gap-1">
//                       <input
//                         type="text"
//                         value={displayData.logoText}
//                         onChange={(e) => updateLogoText(e.target.value)}
//                         className="px-3 py-2 text-base bg-white/80 border border-dashed border-yellow-300 rounded focus:border-yellow-500 focus:outline-none w-48"
//                         placeholder="Enter your name"
//                       />
//                       <p className="text-xs text-gray-500">First letter will be shown in avatar</p>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   {/* Display Mode - Avatar with Text on the right */}
//                   <div className="flex items-center gap-4">
//                     <div className="w-14 h-14 rounded-full bg-yellow-300 flex items-center justify-center text-black font-bold text-lg border-2 border-yellow-300 shadow-lg">
//                       {getAvatarLetter(displayData.logoText)}
//                     </div>
//                     {/* Logo Text displayed to the right of avatar */}
//                     <span className="text-xl font-semibold text-foreground">
//                       {displayData.logoText}
//                     </span>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           <div className="flex items-center space-x-6">
//             {/* Desktop Navigation - Static (Non-editable) */}
//             <nav className="hidden space-x-8 md:flex">
//               {data.navLinks.map((link, index) => (
//                 <a
//                   key={index}
//                   href={link.href}
//                   className="transition-all duration-300 text-muted-foreground hover:text-yellow-500 hover:scale-110"
//                 >
//                   {link.label}
//                 </a>
//               ))}
//             </nav>

//             {/* Edit/Save Controls */}
//             <div className='flex items-center gap-2'>
//               {!isEditing ? (
//                 <Button
//                   onClick={handleEdit}
//                   size='sm'
//                   className='bg-red-500 hover:bg-red-600 shadow-md text-white'
//                 >
//                   <Edit2 className='w-4 h-4 mr-2' />
//                   Edit
//                 </Button>
//               ) : (
//                 <div className='flex gap-2'>
//                   <Button
//                     onClick={handleSave}
//                     size='sm'
//                     className='bg-green-600 hover:bg-green-700 text-white shadow-md'
//                     disabled={isSaving}
//                   >
//                     {isSaving ? (
//                       <Loader2 className='w-4 h-4 mr-2 animate-spin' />
//                     ) : (
//                       <Save className='w-4 h-4 mr-2' />
//                     )}
//                     {isSaving ? "Saving..." : "Save"}
//                   </Button>
//                   <Button
//                     onClick={handleCancel}
//                     size='sm'
//                     className='bg-gray-500 hover:bg-gray-600 shadow-md text-white'
//                     disabled={isSaving}
//                   >
//                     <X className='w-4 h-4 mr-2' />
//                     Cancel
//                   </Button>
//                 </div>
//               )}

//               {/* Dark Mode Toggle */}
//               <DarkModeToggle onToggle={onDarkModeToggle} />

//               {/* Mobile menu button */}
//               <button
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 className="transition-all duration-300 md:hidden text-muted-foreground hover:text-yellow-500 hover:scale-110"
//               >
//                 {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Navigation - Static (Non-editable) */}
//         {isMenuOpen && (
//           <nav className="pt-4 pb-4 mt-4 border-t md:hidden border-border">
//             {defaultHeaderData.navLinks.map((link, index) => (
//               <a
//                 key={index}
//                 href={link.href}
//                 onClick={() => setIsMenuOpen(false)}
//                 className="block py-2 transition-colors duration-300 text-muted-foreground hover:text-yellow-500"
//               >
//                 {link.label}
//               </a>
//             ))}
//           </nav>
//         )}
//       </div>
//     </header>
//   )}

import { Edit2, Loader2, Menu, Save, Upload, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { DarkModeToggle } from './DarkModeToggle';

// Custom Button component (consistent with other components)
const Button = ({
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
  variant?: string;
  size?: string;
  className?: string;
  disabled?: boolean;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
    default: "bg-blue-600 text-white hover:bg-blue-700",
  };
  const sizes: Record<string, string> = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant || 'default']} ${
        sizes[size || 'default']
      } ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

interface NavLink {
  href: string;
  label: string;
}

interface HeaderData {
  logoText: string;
  navLinks: NavLink[];
}

const defaultHeaderData: HeaderData = {
  logoText: "arijit",
  navLinks: [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#services', label: 'Services' },
    { href: '#projects', label: 'Projects' },
    { href: '#certification', label: 'Certification' },
    { href: '#clients', label: 'clients' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#contact', label: 'Contact' },
  ]
};

interface HeaderProps {
  headerData?: HeaderData;
  onStateChange?: (data: HeaderData) => void;
  onDarkModeToggle: (isDark: boolean) => void;
  userId?: string;
  professionalId?: string;
  templateSelection?: string;
}

export function Header({ headerData, onStateChange, onDarkModeToggle}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  
  // Auto-save states
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedDataRef = useRef<HeaderData | null>(null);
  
  const [data, setData] = useState<HeaderData>(defaultHeaderData);
  const [tempData, setTempData] = useState<HeaderData>(defaultHeaderData);

  // Auto-save functionality
  const performAutoSave = useCallback(async (dataToSave: HeaderData) => {
    try {
      setIsAutoSaving(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (onStateChange) {
        onStateChange(dataToSave);
      }
      
      lastSavedDataRef.current = dataToSave;
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      console.log("Auto-save completed:", dataToSave);
    } catch (error) {
      console.error("Auto-save failed:", error);
      toast.error("Failed to auto-save changes");
    } finally {
      setIsAutoSaving(false);
    }
  }, [onStateChange]);

  const scheduleAutoSave = useCallback((updatedData: HeaderData) => {
    setHasUnsavedChanges(true);
    
    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    // Schedule new auto-save
    autoSaveTimeoutRef.current = setTimeout(() => {
      performAutoSave(updatedData);
    }, 2000); // 2 second delay
  }, [performAutoSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Initialize data from props
  useEffect(() => {
    if (headerData && !dataLoaded) {
      console.log('Initializing Header data from props:', headerData);
      setData(headerData);
      setTempData(headerData);
      lastSavedDataRef.current = headerData;
      setDataLoaded(true);
      
      if (onStateChange) {
        onStateChange(headerData);
      }
    }
  }, [headerData, dataLoaded, onStateChange]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange && dataLoaded) {
      onStateChange(data);
    }
  }, [data, dataLoaded, onStateChange]);

  // Load default data if no data from props
  useEffect(() => {
    if (!dataLoaded && !isLoading && !headerData) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setData(defaultHeaderData);
        setTempData(defaultHeaderData);
        lastSavedDataRef.current = defaultHeaderData;
        setDataLoaded(true);
        setIsLoading(false);
        
        if (onStateChange) {
          onStateChange(defaultHeaderData);
        }
      }, 1200);
      
      return () => clearTimeout(timer);
    }
  }, [dataLoaded, isLoading, headerData, onStateChange]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    setHasUnsavedChanges(false);
  };

  // Manual save function
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Clear any pending auto-save
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setData(tempData);
      lastSavedDataRef.current = tempData;
      setIsEditing(false);
      setIsMenuOpen(false);
      setHasUnsavedChanges(false);
      toast.success('Header section saved successfully');

    } catch (error) {
      console.error('Error saving header section:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Clear any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    setTempData(lastSavedDataRef.current || data);
    setHasUnsavedChanges(false);
    setIsEditing(false);
    toast.info('Changes discarded');
  };

  // Update logo text with auto-save
  const updateLogoText = (value: string) => {
    setTempData(prev => {
      const updated = {
        ...prev,
        logoText: value
      };
      scheduleAutoSave(updated);
      return updated;
    });
  };

  // Get first character in uppercase for avatar
  const getAvatarLetter = (text: string) => {
    return text.charAt(0).toUpperCase();
  };

  const displayData = isEditing ? tempData : data;

  // Loading state
  if (isLoading) {
    return (
      <header ref={headerRef} className="fixed top-[4rem] left-0 right-0 z-40 bg-background border-b border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-yellow-400" />
        </div>
      </header>
    );
  }
  
  return (
    <header ref={headerRef} className="fixed top-[4rem] left-0 right-0 z-40 bg-background border-b border-border shadow-lg">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Avatar and Brand */}
          <div className="text-2xl font-bold transition-transform duration-300 text-foreground">
            <div className='flex items-center gap-4'>
              {isEditing ? (
                <>
                  {/* Edit Mode */}
                  <div className="flex items-center gap-4">
                    {/* Avatar Display */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-14 h-14 rounded-full bg-yellow-300 flex items-center justify-center text-black font-bold text-lg border-2 border-yellow-300 shadow-lg">
                        {getAvatarLetter(displayData.logoText)}
                      </div>
                    </div>
                    
                    {/* Logo Text Input - Now positioned to the right of avatar */}
                    <div className="flex flex-col gap-1">
                      <input
                        type="text"
                        value={displayData.logoText}
                        onChange={(e) => updateLogoText(e.target.value)}
                        className="px-3 py-2 text-base bg-white/80 border border-dashed border-yellow-300 rounded focus:border-yellow-500 focus:outline-none w-48 dark:bg-gray-800 dark:text-white dark:border-yellow-400"
                        placeholder="Enter your name"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">First letter will be shown in avatar</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Display Mode - Avatar with Text on the right */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-yellow-300 flex items-center justify-center text-black font-bold text-lg border-2 border-yellow-300 shadow-lg">
                      {getAvatarLetter(displayData.logoText)}
                    </div>
                    {/* Logo Text displayed to the right of avatar */}
                    <span className="text-xl font-semibold text-foreground">
                      {displayData.logoText}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Desktop Navigation - Static (Non-editable) */}
            <nav className="hidden space-x-8 md:flex">
              {data.navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="transition-all duration-300 text-muted-foreground hover:text-yellow-500 hover:scale-110"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Edit/Save Controls */}
            <div className='flex items-center gap-2'>
              {!isEditing ? (
                <Button
                  onClick={handleEdit}
                  size='sm'
                  className='bg-red-500 hover:bg-red-600 shadow-md text-white'
                >
                  <Edit2 className='w-4 h-4 mr-2' />
                  Edit
                </Button>
              ) : (
                <div className='flex gap-2 items-center'>
                  {/* Auto-save indicator */}
                  <div className="flex items-center gap-2 mr-4 text-sm">
                    {isAutoSaving && (
                      <div className="flex items-center gap-1 text-blue-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Auto-saving...</span>
                      </div>
                    )}
                    {hasUnsavedChanges && !isAutoSaving && (
                      <div className="text-yellow-500">
                        ● Unsaved changes
                      </div>
                    )}
                    {lastSaved && !hasUnsavedChanges && !isAutoSaving && (
                      <div className="text-green-500">
                        ✓ Auto-saved {lastSaved.toLocaleTimeString()}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleSave}
                    size='sm'
                    className='bg-green-600 hover:bg-green-700 text-white shadow-md'
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    ) : (
                      <Save className='w-4 h-4 mr-2' />
                    )}
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    size='sm'
                    className='bg-gray-500 hover:bg-gray-600 shadow-md text-white'
                    disabled={isSaving}
                  >
                    <X className='w-4 h-4 mr-2' />
                    Cancel
                  </Button>
                </div>
              )}

              {/* Dark Mode Toggle */}
              <DarkModeToggle onToggle={onDarkModeToggle} />

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="transition-all duration-300 md:hidden text-muted-foreground hover:text-yellow-500 hover:scale-110"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Static (Non-editable) */}
        {isMenuOpen && (
          <nav className="pt-4 pb-4 mt-4 border-t md:hidden border-border">
            {defaultHeaderData.navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 transition-colors duration-300 text-muted-foreground hover:text-yellow-500"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}