import { Edit2, Loader2, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

// Custom Button component
const Button = ({
  children,
  onClick,
  variant,
  size,
  className,
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
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
      className={`${baseClasses} ${variants[variant] || variants.default} ${
        sizes[size] || sizes.default
      } ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

interface Client {
  id: string;
  name: string;
  industry: string;
  logo?: string;
}

interface Stats {
  happyClients: string;
  projectsDelivered: string;
  industriesServed: string;
  successRate: string;
}

interface ClientsData {
  subtitle: string;
  heading: string;
  description: string;
  clients: Client[];
  stats: Stats;
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
}

// Empty default data
const defaultData: ClientsData = {
  subtitle: "",
  heading: "",
  description: "",
  clients: [],
  stats: {
    happyClients: "",
    projectsDelivered: "",
    industriesServed: "",
    successRate: ""
  },
  cta: {
    title: "",
    description: "",
    buttonText: ""
  }
};

export function Clients({ clientsData, onStateChange, userId, publishedId, templateSelection }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const clientsRef = useRef<HTMLDivElement>(null);
  
  // Pending logo files for S3 upload
  const [pendingLogoFiles, setPendingLogoFiles] = useState<Record<string, File>>({});

  const [data, setData] = useState<ClientsData>(defaultData);
  const [tempData, setTempData] = useState<ClientsData>(defaultData);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(data);
    }
  }, [data]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (clientsRef.current) observer.observe(clientsRef.current);
    return () => {
      if (clientsRef.current) observer.unobserve(clientsRef.current);
    };
  }, []);

  // Transform backend data to match component structure
  const transformBackendData = (backendData: any): ClientsData => {
    if (!backendData) return defaultData;
    
    return {
      subtitle: backendData.subtitle || "",
      heading: backendData.heading || "",
      description: backendData.description || "",
      clients: backendData.clients || [],
      stats: backendData.stats || {
        happyClients: "",
        projectsDelivered: "",
        industriesServed: "",
        successRate: ""
      },
      cta: backendData.cta || {
        title: "",
        description: "",
        buttonText: ""
      }
    };
  };

  // Fetch clients data
  const fetchClientsData = async () => {
    setIsLoading(true);
    try {
      // If clientsData is provided as prop, use it directly
      if (clientsData) {
        const transformedData = transformBackendData(clientsData);
        setData(transformedData);
        setTempData(transformedData);
        setDataLoaded(true);
        return;
      }

      // Otherwise, use empty data
      const response = await new Promise<ClientsData>((resolve) =>
        setTimeout(() => resolve(defaultData), 1200)
      );
      setData(response);
      setTempData(response);
      setDataLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && !dataLoaded && !isLoading) {
      fetchClientsData();
    }
  }, [isVisible, dataLoaded, isLoading, clientsData]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
    setPendingLogoFiles({});
  };

  // Save function with S3 upload
  const handleSave = async () => {
    try {
      setIsUploading(true);
      
      // Create a copy of tempData to update with S3 URLs
      let updatedData = { ...tempData };

      // Upload logos for clients with pending files
      for (const [clientId, file] of Object.entries(pendingLogoFiles)) {
        if (!userId || !publishedId || !templateSelection) {
          toast.error('Missing user information. Please refresh and try again.');
          return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);
        formData.append('fieldName', `client_logo_${clientId}`);

        const uploadResponse = await fetch(`https://ow3v94b9gf.execute-api.ap-south-1.amazonaws.com/dev/`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          // Update the client logo with the S3 URL
          updatedData.clients = updatedData.clients.map(client =>
            client.id === clientId ? { ...client, logo: uploadData.s3Url } : client
          );
          console.log('Client logo uploaded to S3:', uploadData.s3Url);
        } else {
          const errorData = await uploadResponse.json();
          toast.error(`Logo upload failed: ${errorData.message || 'Unknown error'}`);
          return;
        }
      }

      // Clear pending files
      setPendingLogoFiles({});

      // Save the updated data with S3 URLs
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save API call
      
      // Update both states with the new URLs
      setData(updatedData);
      setTempData(updatedData);
      
      setIsEditing(false);
      toast.success('Clients section saved with S3 URLs ready for publish');
    } catch (error) {
      console.error('Error saving clients section:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...data });
    setPendingLogoFiles({});
    setIsEditing(false);
  };

  // Logo upload handler with validation
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>, clientId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }

    // Store the file for upload on Save
    setPendingLogoFiles(prev => ({ ...prev, [clientId]: file }));

    // Show immediate local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const updatedClients = tempData.clients.map(client =>
        client.id === clientId ? { ...client, logo: e.target?.result as string } : client
      );
      setTempData({ ...tempData, clients: updatedClients });
    };
    reader.readAsDataURL(file);
  };

  // Stable update functions with useCallback
  const updateClient = useCallback((index: number, field: string, value: string) => {
    const updatedClients = [...tempData.clients];
    updatedClients[index] = { ...updatedClients[index], [field]: value };
    setTempData({ ...tempData, clients: updatedClients });
  }, [tempData]);

  const updateStat = useCallback((field: keyof Stats, value: string) => {
    setTempData(prev => ({
      ...prev,
      stats: { ...prev.stats, [field]: value }
    }));
  }, []);

  const updateCta = useCallback((field: keyof ClientsData['cta'], value: string) => {
    setTempData(prev => ({
      ...prev,
      cta: { ...prev.cta, [field]: value }
    }));
  }, []);

  const updateHeading = useCallback((field: 'subtitle' | 'heading' | 'description', value: string) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Memoized functions
  const addClient = useCallback(() => {
    const newClient: Client = {
      id: Date.now().toString(),
      name: 'New Client',
      industry: 'Industry'
    };
    setTempData({
      ...tempData,
      clients: [...tempData.clients, newClient]
    });
  }, [tempData]);

  const removeClient = useCallback((index: number) => {
    if (tempData.clients.length <= 1) {
      toast.error("You must have at least one client");
      return;
    }
    
    const updatedClients = tempData.clients.filter((_, i) => i !== index);
    setTempData({ ...tempData, clients: updatedClients });
  }, [tempData]);

  const displayData = isEditing ? tempData : data;

  // Loading state
  if (isLoading || !displayData.clients || displayData.clients.length === 0) {
    return (
      <section ref={clientsRef} className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
          <p className="text-muted-foreground mt-4">Loading clients data...</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={clientsRef} className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Edit Controls */}
        <div className='text-right mb-8'>
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              size='sm'
              className='bg-red-500 hover:bg-red-600 shadow-md'
            >
              <Edit2 className='w-4 h-4 mr-2' />
              Edit
            </Button>
          ) : (
            <div className='flex gap-2 justify-end'>
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
                className='bg-red-500 hover:bg-red-600 shadow-md'
                disabled={isSaving || isUploading}
              >
                <X className='w-4 h-4 mr-2' />
                Cancel
              </Button>
              <Button
                onClick={addClient}
                variant='outline'
                size='sm'
                className='bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-md'
              >
                <Plus className='w-4 h-4 mr-2' />
                Add Client
              </Button>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          {isEditing ? (
            <>
              <input
                type="text"
                value={displayData.subtitle}
                onChange={(e) => updateHeading('subtitle', e.target.value)}
                className="text-lg text-muted-foreground mb-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-2xl mx-auto"
                placeholder="Subtitle (e.g., Trusted by amazing companies)"
              />
              <input
                type="text"
                value={displayData.heading}
                onChange={(e) => updateHeading('heading', e.target.value)}
                className="text-3xl sm:text-4xl text-foreground mb-4 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-2xl mx-auto"
                placeholder="Heading (e.g., Clients & Partners)"
              />
              <textarea
                value={displayData.description}
                onChange={(e) => updateHeading('description', e.target.value)}
                className="text-lg text-muted-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-2xl mx-auto"
                rows="2"
                placeholder="Description"
              />
            </>
          ) : (
            <>
              {displayData.subtitle && (
                <p className="text-lg text-muted-foreground mb-2">
                  {displayData.subtitle}
                </p>
              )}
              {displayData.heading && (
                <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
                  {displayData.heading}
                </h2>
              )}
              {displayData.description && (
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {displayData.description}
                </p>
              )}
            </>
          )}
        </div>

        {/* Stats */}
        {(displayData.stats.happyClients || displayData.stats.projectsDelivered || displayData.stats.industriesServed || displayData.stats.successRate || isEditing) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { key: 'happyClients' as const, label: 'Happy Clients' },
              { key: 'projectsDelivered' as const, label: 'Projects Delivered' },
              { key: 'industriesServed' as const, label: 'Industries Served' },
              { key: 'successRate' as const, label: 'Success Rate' }
            ].map((stat) => (
              <div key={stat.key} className="text-center hover:scale-105 transition-transform duration-300">
                {isEditing ? (
                  <input
                    type="text"
                    value={displayData.stats[stat.key]}
                    onChange={(e) => updateStat(stat.key, e.target.value)}
                    className="w-20 text-3xl sm:text-4xl text-yellow-500 mb-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-center"
                    placeholder="50+"
                  />
                ) : (
                  displayData.stats[stat.key] && (
                    <div className="text-3xl sm:text-4xl text-yellow-500 mb-2">{displayData.stats[stat.key]}</div>
                  )
                )}
                {isEditing ? (
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {}}
                    className="text-muted-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-center w-full"
                    disabled
                  />
                ) : (
                  displayData.stats[stat.key] && (
                    <p className="text-muted-foreground">{stat.label}</p>
                  )
                )}
              </div>
            ))}
          </div>
        )}

        {/* Client Grid */}
        {displayData.clients.length > 0 || isEditing ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
            {displayData.clients.map((client, index) => (
              <div
                key={client.id}
                className="group bg-muted rounded-xl p-6 h-24 flex items-center justify-center hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 relative"
              >
                {isEditing && (
                  <>
                    <Button
                      onClick={() => removeClient(index)}
                      size='sm'
                      variant='outline'
                      className='absolute -top-2 -right-2 bg-red-50 hover:bg-red-100 text-red-700 p-1'
                    >
                      <Trash2 className='w-3 h-3' />
                    </Button>
                    <Button
                      onClick={() => document.getElementById(`logo-upload-${client.id}`)?.click()}
                      size='sm'
                      variant='outline'
                      className='absolute -top-2 -left-2 bg-blue-50 hover:bg-blue-100 text-blue-700 p-1'
                    >
                      <Upload className='w-3 h-3' />
                    </Button>
                    <input
                      id={`logo-upload-${client.id}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload(e, client.id)}
                      className="hidden"
                    />
                    {pendingLogoFiles[client.id] && (
                      <p className='absolute -bottom-2 text-xs text-orange-600 bg-white p-1 rounded'>
                        Logo selected
                      </p>
                    )}
                  </>
                )}
                <div className="text-center">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={client.name}
                        onChange={(e) => updateClient(index, 'name', e.target.value)}
                        className="w-full text-lg text-foreground group-hover:text-yellow-600 transition-colors duration-300 mb-1 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-center"
                        placeholder="Client Name"
                      />
                      <input
                        type="text"
                        value={client.industry}
                        onChange={(e) => updateClient(index, 'industry', e.target.value)}
                        className="w-full text-xs text-muted-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-center"
                        placeholder="Industry"
                      />
                    </>
                  ) : (
                    <>
                      <div className="text-lg text-foreground group-hover:text-yellow-600 transition-colors duration-300 mb-1">
                        {client.name}
                      </div>
                      <div className="text-xs text-muted-foreground">{client.industry}</div>
                    </>
                  )}
                </div>
              </div>
            ))}
            {isEditing && displayData.clients.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground mb-4">No clients added yet</p>
                <Button
                  onClick={addClient}
                  variant='outline'
                  size='lg'
                  className='bg-blue-50 hover:bg-blue-100 text-blue-700'
                >
                  <Plus className='w-5 h-5 mr-2' />
                  Add Your First Client
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}