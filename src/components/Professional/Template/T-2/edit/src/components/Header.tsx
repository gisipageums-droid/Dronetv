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
import { useEffect, useRef, useState, useCallback } from 'react';
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
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  
  const [data, setData] = useState<HeaderData>(defaultHeaderData);
  const [tempData, setTempData] = useState<HeaderData>(defaultHeaderData);

  // Auto-save timeout ref
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(data);
    }
  }, [data, onStateChange]);

  // Fake API fetch
  const fetchHeaderData = async () => {
    setIsLoading(true);
    try {
      const response = await new Promise<HeaderData>((resolve) =>
        setTimeout(() => resolve(headerData || defaultHeaderData), 1200)
      );
      setData(response);
      setTempData(response);
      setDataLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!dataLoaded && !isLoading) {
      fetchHeaderData();
    }
  }, [dataLoaded, isLoading, headerData]);

  // Auto-save function
  const performAutoSave = useCallback(async () => {
    if (!hasUnsavedChanges || !isMountedRef.current) return;

    try {
      setIsAutoSaving(true);
      
      // Simulate API call for auto-save
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      if (isMountedRef.current) {
        setData(tempData);
        setHasUnsavedChanges(false);
        toast.success('Changes auto-saved successfully');
      }
    } catch (error) {
      console.error('Error auto-saving header section:', error);
      if (isMountedRef.current) {
        toast.error('Auto-save failed. Changes not saved.');
      }
    } finally {
      if (isMountedRef.current) {
        setIsAutoSaving(false);
      }
    }
  }, [hasUnsavedChanges, tempData]);

  // Schedule auto-save with debounce
  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      performAutoSave();
    }, 2000); // 2-second delay after user stops typing
  }, [performAutoSave]);

  // Handle logo text change with auto-save
  const updateLogoText = useCallback((value: string) => {
    setTempData(prev => ({
      ...prev,
      logoText: value
    }));
    setHasUnsavedChanges(true);
    scheduleAutoSave();
  }, [scheduleAutoSave]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    setHasUnsavedChanges(false);
    
    // Clear any pending auto-save when entering edit mode
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
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
      setHasUnsavedChanges(false);
      setIsEditing(false);
      setIsMenuOpen(false);
      toast.success('Header section saved successfully');

    } catch (error) {
      console.error('Error saving header section:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...data });
    setHasUnsavedChanges(false);
    setIsEditing(false);
    
    // Clear any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
  };

  // Get first character in uppercase for avatar
  const getAvatarLetter = (text: string) => {
    return text.charAt(0).toUpperCase();
  };

  // Auto-upload image function (for future image upload functionality)
  const uploadImageToS3 = useCallback(async (croppedImageBlob: Blob): Promise<string> => {
    // This would be implemented when you add image upload functionality
    // For now, it returns a placeholder
    return new Promise((resolve, reject) => {
      // Simulate upload process
      setTimeout(() => {
        // In real implementation, you would:
        // 1. Get pre-signed URL from your backend
        // 2. Upload the blob to S3 using the pre-signed URL
        // 3. Return the S3 URL
        resolve('https://example.com/uploaded-image.jpg');
      }, 1500);
    });
  }, []);

  // Example of how auto image upload would be integrated
  const handleImageCropComplete = useCallback(async (croppedImageBlob: Blob) => {
    try {
      // Show upload progress in UI
      toast.info('Uploading image...');
      
      // Auto-upload to S3
      const s3Url = await uploadImageToS3(croppedImageBlob);
      
      // Update state with new S3 URL
      // This would be implemented when you have image state management
      toast.success('Image uploaded successfully');
      
      return s3Url;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      throw error;
    }
  }, [uploadImageToS3]);

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
                      {/* Auto-save indicator */}
                      {isAutoSaving && (
                        <div className="flex items-center gap-1 text-xs text-yellow-600">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Auto-saving...
                        </div>
                      )}
                    </div>
                    
                    {/* Logo Text Input - Now positioned to the right of avatar */}
                    <div className="flex flex-col gap-1">
                      <div className="relative">
                        <input
                          type="text"
                          value={displayData.logoText}
                          onChange={(e) => updateLogoText(e.target.value)}
                          className="px-3 py-2 text-base bg-white/80 border border-dashed border-yellow-300 rounded focus:border-yellow-500 focus:outline-none w-48"
                          placeholder="Enter your name"
                        />
                        {/* Unsaved changes indicator */}
                        {hasUnsavedChanges && !isAutoSaving && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">First letter will be shown in avatar</p>
                      <p className="text-xs text-gray-400">Changes auto-save after 2 seconds</p>
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
                <div className='flex gap-2'>
                  <Button
                    onClick={handleSave}
                    size='sm'
                    className='bg-green-600 hover:bg-green-700 text-white shadow-md'
                    disabled={isSaving || isAutoSaving}
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
                    disabled={isSaving || isAutoSaving}
                  >
                    <X className='w-4 h-4 mr-2' />
                    Cancel
                  </Button>
                  
                  {/* Auto-save status indicator */}
                  {(isAutoSaving || hasUnsavedChanges) && (
                    <div className="flex items-center gap-2 px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-md border border-yellow-300">
                      {isAutoSaving ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Auto-saving...
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                          Unsaved changes
                        </>
                      )}
                    </div>
                  )}
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