import { Edit2, Loader2, Menu, Save, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { DarkModeToggle } from './DarkModeToggle';
import { ImageWithFallback } from './figma/ImageWithFallback';

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

interface HeaderData {
  logoUrl: string;
  portfolioText: string;
}

const defaultHeaderData: HeaderData = {
  logoUrl: "/images/logo.png",
  portfolioText: "Portfolio",
};

interface HeaderProps {
  headerData?: HeaderData;
  onStateChange?: (data: HeaderData) => void;
  onDarkModeToggle: (isDark: boolean) => void;
  userId?: string;
  publishedId?: string;
  templateSelection?: string;
}

export function Header({ headerData, onStateChange, onDarkModeToggle, userId, publishedId, templateSelection }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Pending logo file for S3 upload
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);

  const [data, setData] = useState<HeaderData>(defaultHeaderData);
  const [tempData, setTempData] = useState<HeaderData>(defaultHeaderData);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(data);
    }
  }, [data]);

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

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    setPendingLogoFile(null);
  };

  // Save function with S3 upload
  const handleSave = async () => {
    try {
      setIsUploading(true);
      
      // Create a copy of tempData to update with S3 URL
      let updatedData = { ...tempData };

      // Upload logo if there's a pending file
      if (pendingLogoFile) {
        if (!userId || !publishedId || !templateSelection) {
          toast.error('Missing user information. Please refresh and try again.');
          return;
        }

        const formData = new FormData();
        formData.append('file', pendingLogoFile);
        formData.append('userId', userId);
        formData.append('fieldName', 'headerLogo');

        const uploadResponse = await fetch(`https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          updatedData.logoUrl = uploadData.s3Url;
          console.log('Header logo uploaded to S3:', uploadData.s3Url);
        } else {
          const errorData = await uploadResponse.json();
          toast.error(`Logo upload failed: ${errorData.message || 'Unknown error'}`);
          return;
        }
      }

      // Clear pending file
      setPendingLogoFile(null);

      // Save the updated data with S3 URL
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update both states with the new URL
      setData(updatedData);
      setTempData(updatedData);
      
      setIsEditing(false);
      setIsMenuOpen(false);
      toast.success('Header section saved successfully');

    } catch (error) {
      console.error('Error saving header section:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...data });
    setPendingLogoFile(null);
    setIsEditing(false);
  };

  // Logo upload handler with validation
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    setPendingLogoFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setTempData(prev => ({
        ...prev,
        logoUrl: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Update portfolio text
  const updatePortfolioText = (value: string) => {
    setTempData(prev => ({
      ...prev,
      portfolioText: value
    }));
  };

  const displayData = isEditing ? tempData : data;

  // Static navigation items
  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    {name:'services', href:'#services'},
    { name: 'Projects', href: '#projects' },
    { name: 'Clients', href: '#clients' },
    { name: 'Reviews', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  // Loading state
  if (isLoading) {
    return (
      <header ref={headerRef} className="fixed top-[4rem] left-0 right-0 z-40 bg-background border-b border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-yellow-500" />
        </div>
      </header>
    );
  }

  return (
    <header ref={headerRef} className="fixed top-[4rem] left-0 right-0 z-40 bg-background border-b border-border shadow-lg">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand - Editable */}
          <div className="text-2xl font-bold transition-transform duration-300 text-foreground hover:scale-105">
            <div className='flex items-center gap-4'>
              {isEditing ? (
                <>
                  {/* Logo Upload */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="sm"
                      variant="outline"
                      className="bg-white/90 backdrop-blur-sm shadow-md"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    {pendingLogoFile && (
                      <p className="text-xs text-orange-600 bg-white p-1 rounded">
                        Logo selected
                      </p>
                    )}
                  </div>
                  
                  {/* Logo Preview */}
                  <ImageWithFallback
                    src={displayData.logoUrl}
                    alt="Logo"
                    className="w-10 h-10 object-contain"
                  />
                  
                  {/* Portfolio Text Input */}
                  <input
                    type="text"
                    value={displayData.portfolioText}
                    onChange={(e) => updatePortfolioText(e.target.value)}
                    className="px-3 py-2 text-lg bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none"
                    placeholder="Portfolio Text"
                  />
                </>
              ) : (
                <>
                  {/* Display Mode */}
                  <ImageWithFallback
                    src={displayData.logoUrl}
                    alt="Logo"
                    className="w-10 h-10 object-contain"
                  />
                  <span>{displayData.portfolioText}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Desktop Navigation - Static */}
            <nav className="hidden space-x-8 md:flex">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="transition-all duration-300 text-muted-foreground hover:text-yellow-500 hover:scale-110"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Edit/Save Controls - Static */}
            <div className='flex items-center gap-2'>
              {!isEditing ? (
                <Button
                  onClick={handleEdit}
                  size='sm'
                  className='bg-red-500 hover:bg-red-600 shadow-md text-white'
                >
                  <Edit2 className='w-4 h-4 mr-2' />
                  Edit Header
                </Button>
              ) : (
                <div className='flex gap-2'>
                  <Button
                    onClick={handleSave}
                    size='sm'
                    className='bg-green-600 hover:bg-green-700 text-white shadow-md'
                    disabled={isSaving || isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    ) : isSaving ? (
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    ) : (
                      <Save className='w-4 h-4 mr-2' />
                    )}
                    {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    size='sm'
                    className='bg-red-500 hover:bg-red-600 shadow-md text-white'
                    disabled={isSaving || isUploading}
                  >
                    <X className='w-4 h-4 mr-2' />
                    Cancel
                  </Button>
                </div>
              )}

              {/* Dark Mode Toggle - Static */}
              <DarkModeToggle onToggle={onDarkModeToggle} />

              {/* Mobile menu button - Static */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="transition-all duration-300 md:hidden text-muted-foreground hover:text-yellow-500 hover:scale-110"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Static */}
        {isMenuOpen && (
          <nav className="pt-4 pb-4 mt-4 border-t md:hidden border-border">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 transition-colors duration-300 text-muted-foreground hover:text-yellow-500"
              >
                {item.name}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}