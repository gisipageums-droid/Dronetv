import { Edit2, Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

// Text limits
const TEXT_LIMITS = {
  SUBTITLE: 100, // characters
  HEADING: 60, // characters
  DESCRIPTION: 300, // characters
  CLIENT_NAME: 40, // characters
  CLIENT_INDUSTRY: 30, // characters
  STAT_VALUE: 10, // characters
  STAT_LABEL: 20, // characters
  CTA_TITLE: 60, // characters
  CTA_DESCRIPTION: 200, // characters
  CTA_BUTTON_TEXT: 30, // characters
};

// Custom Button component
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
  variant?: 'outline' | 'default';
  size?: 'sm' | 'default';
  className?: string;
  disabled?: boolean;
  [key: string]: any;
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

interface ClientsProps {
  clientsData?: ClientsData;
  onStateChange?: (data: ClientsData) => void;
  userId?: string;
  professionalId?: string;
  templateSelection?: string;
}

export function Clients({ clientsData, onStateChange, userId, professionalId, templateSelection }: ClientsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const clientsRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<ClientsData>(defaultData);
  const [tempData, setTempData] = useState<ClientsData>(defaultData);

  // Initialize data from props when component mounts or props change
  useEffect(() => {
    if (clientsData && !dataLoaded) {
      console.log('Initializing Clients data from props:', clientsData);
      const transformedData = transformBackendData(clientsData);
      setData(transformedData);
      setTempData(transformedData);
      setDataLoaded(true);
      
      // Notify parent of initial state
      if (onStateChange) {
        onStateChange(transformedData);
      }
    }
  }, [clientsData, dataLoaded]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange && dataLoaded) {
      onStateChange(data);
    }
  }, [data, dataLoaded]);

  // Intersection observer for lazy loading if no data from props
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
    
    console.log('Transforming backend data for Clients:', backendData);
    
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

  // Load default data if no data from props and component is visible
  useEffect(() => {
    const loadDataIfNeeded = async () => {
      if (isVisible && !dataLoaded && !clientsData && !isLoading) {
        setIsLoading(true);
        try {
          console.log('Loading default Clients data');
          // Use empty default data
          setData(defaultData);
          setTempData(defaultData);
          setDataLoaded(true);
          
          if (onStateChange) {
            onStateChange(defaultData);
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadDataIfNeeded();
  }, [isVisible, dataLoaded, clientsData, isLoading]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
  };

  // Save function
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save API call
      
      setData(tempData);
      setIsEditing(false);
      toast.success('Clients section saved successfully');
    } catch (error) {
      console.error('Error saving clients section:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...data });
    setIsEditing(false);
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
    const updatedClients = tempData.clients.filter((_, i) => i !== index);
    setTempData({ ...tempData, clients: updatedClients });
  }, [tempData]);

  const displayData = isEditing ? tempData : data;

  // FIXED: Improved hasData logic to properly check for any meaningful data
  const hasData = data.clients.length > 0 || 
                  data.subtitle || 
                  data.heading || 
                  data.description || 
                  Object.values(data.stats).some(value => value && value.trim() !== '') ||
                  Object.values(data.cta).some(value => value && value.trim() !== '');

  console.log('Clients component debug:', {
    dataLoaded,
    hasData,
    clientsDataFromProps: clientsData,
    componentData: data,
    isEditing,
    clientsCount: data.clients.length,
    hasSubtitle: !!data.subtitle,
    hasHeading: !!data.heading,
    hasDescription: !!data.description,
    hasStats: Object.values(data.stats).some(value => value && value.trim() !== ''),
    hasCta: Object.values(data.cta).some(value => value && value.trim() !== '')
  });

  // Loading state - only show when actually loading
  if (isLoading && !dataLoaded) {
    return (
      <section ref={clientsRef} className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
          <p className="text-muted-foreground mt-4">Loading clients data...</p>
        </div>
      </section>
    );
  }

  // No data state - show empty state with option to add data
  if (!isEditing && !hasData && !isLoading) {
    return (
      <section ref={clientsRef} className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Edit Controls */}
          <div className='text-right mb-8'>
            <Button
              onClick={handleEdit}
              size='sm'
              className='bg-red-500 hover:bg-red-600 shadow-md text-white'
            >
              <Edit2 className='w-4 h-4 mr-2' />
              Add Clients
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={clientsRef} className="py-20  bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Edit Controls */}
        <div className='text-right mb-8'>
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
            <div className='flex gap-2 justify-end'>
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
                className='bg-red-500 hover:bg-red-600 shadow-md text-white'
                disabled={isSaving}
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
              <div className="relative">
                <input
                  type="text"
                  value={displayData.subtitle}
                  onChange={(e) => updateHeading('subtitle', e.target.value)}
                  className="text-lg text-muted-foreground mb-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-2xl mx-auto"
                  placeholder="Subtitle (e.g., Trusted by amazing companies)"
                  maxLength={TEXT_LIMITS.SUBTITLE}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {displayData.subtitle?.length || 0}/{TEXT_LIMITS.SUBTITLE}
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={displayData.heading}
                  onChange={(e) => updateHeading('heading', e.target.value)}
                  className="text-3xl sm:text-4xl text-foreground mb-4 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-2xl mx-auto"
                  placeholder="Heading (e.g., Clients & Partners)"
                  maxLength={TEXT_LIMITS.HEADING}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {displayData.heading?.length || 0}/{TEXT_LIMITS.HEADING}
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={displayData.description}
                  onChange={(e) => updateHeading('description', e.target.value)}
                  className="text-lg text-muted-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center w-full max-w-2xl mx-auto"
                  rows="2"
                  placeholder="Description"
                  maxLength={TEXT_LIMITS.DESCRIPTION}
                />
                <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                  {displayData.description?.length || 0}/{TEXT_LIMITS.DESCRIPTION}
                </div>
              </div>
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

        {/* Stats - Show if editing OR if any stat has data */}
        {(isEditing || Object.values(displayData.stats).some(value => value && value.trim() !== '')) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { key: 'happyClients' as const, label: 'Happy Clients' },
              { key: 'projectsDelivered' as const, label: 'Projects Delivered' },
              { key: 'industriesServed' as const, label: 'Industries Served' },
              { key: 'successRate' as const, label: 'Success Rate' }
            ].map((stat) => (
              <div key={stat.key} className="text-center hover:scale-105 transition-transform duration-300">
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={displayData.stats[stat.key]}
                      onChange={(e) => updateStat(stat.key, e.target.value)}
                      className="w-20 text-3xl sm:text-4xl text-yellow-500 mb-2 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-center"
                      placeholder="50+"
                      maxLength={TEXT_LIMITS.STAT_VALUE}
                    />
                    <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                      {displayData.stats[stat.key]?.length || 0}/{TEXT_LIMITS.STAT_VALUE}
                    </div>
                  </div>
                ) : (
                  displayData.stats[stat.key] && (
                    <div className="text-3xl sm:text-4xl text-yellow-500 mb-2">{displayData.stats[stat.key]}</div>
                  )
                )}
                {isEditing ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={stat.label}
                      onChange={() => {}}
                      className="text-muted-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-center w-full"
                      disabled
                      maxLength={TEXT_LIMITS.STAT_LABEL}
                    />
                    <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                      {stat.label.length}/{TEXT_LIMITS.STAT_LABEL}
                    </div>
                  </div>
                ) : (
                  displayData.stats[stat.key] && (
                    <p className="text-muted-foreground">{stat.label}</p>
                  )
                )}
              </div>
            ))}
          </div>
        )}

        {/* Client Grid - Show if editing OR if there are clients */}
        {(isEditing || displayData.clients.length > 0) ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
            {displayData.clients.map((client, index) => (
              <div
                key={client.id}
                className="group bg-muted rounded-xl p-6 h-24 flex items-center justify-center hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 relative"
              >
                {isEditing && (
                  <Button
                    onClick={() => removeClient(index)}
                    size='sm'
                    variant='outline'
                    className='absolute -top-2 -right-2 bg-red-50 hover:bg-red-100 text-red-700 p-1'
                  >
                    <Trash2 className='w-3 h-3' />
                  </Button>
                )}
                <div className="text-center">
                  {isEditing ? (
                    <>
                      <div className="relative">
                        <input
                          type="text"
                          value={client.name}
                          onChange={(e) => updateClient(index, 'name', e.target.value)}
                          className="w-full text-lg text-foreground group-hover:text-yellow-600 transition-colors duration-300 mb-1 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-center"
                          placeholder="Client Name"
                          maxLength={TEXT_LIMITS.CLIENT_NAME}
                        />
                        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                          {client.name.length}/{TEXT_LIMITS.CLIENT_NAME}
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={client.industry}
                          onChange={(e) => updateClient(index, 'industry', e.target.value)}
                          className="w-full text-xs text-muted-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-center"
                          placeholder="Industry"
                          maxLength={TEXT_LIMITS.CLIENT_INDUSTRY}
                        />
                        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                          {client.industry.length}/{TEXT_LIMITS.CLIENT_INDUSTRY}
                        </div>
                      </div>
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
        ) : (
          // Show message when there are stats but no clients (only when not editing)
          !isEditing && hasData && data.clients.length === 0 && (
            <div className="text-center py-12 mb-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  No Clients Added
                </h4>
                <p className="text-muted-foreground mb-6">
                  You have content configured but no clients. Add clients to showcase your work.
                </p>
                <Button
                  onClick={handleEdit}
                  size='md'
                  className='bg-yellow-500 hover:bg-yellow-600 text-white'
                >
                  <Plus className='w-4 h-4 mr-2' />
                  Add Clients
                </Button>
              </div>
            </div>
          )
        )}

       
      </div>
    </section>
  );
}