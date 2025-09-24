import { Edit2, Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
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
  clients: Client[];
  stats: Stats;
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
}

const defaultData: ClientsData = {
  clients: [
    { id: '1', name: 'TechCorp', industry: 'Technology' },
    { id: '2', name: 'StartupCo', industry: 'E-commerce' },
    { id: '3', name: 'InnovateLabs', industry: 'FinTech' },
    { id: '4', name: 'DigitalFirst', industry: 'Healthcare' },
    { id: '5', name: 'CloudVentures', industry: 'SaaS' },
    { id: '6', name: 'NextGen Solutions', industry: 'Enterprise' }
  ],
  stats: {
    happyClients: '50+',
    projectsDelivered: '100+',
    industriesServed: '15+',
    successRate: '99%'
  },
  cta: {
    title: 'Ready to join these successful companies?',
    description: 'Let\'s discuss how I can help transform your ideas into powerful digital solutions that drive growth and innovation.',
    buttonText: 'Start Your Project'
  }
};

export function Clients({ clientsData, onStateChange, userId, publishedId, templateSelection }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<ClientsData>(defaultData);
  const [tempData, setTempData] = useState<ClientsData>(defaultData);

  // Load data from backend or props
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        if (clientsData) {
          setData(clientsData);
          setTempData(clientsData);
        } else {
          // Fetch from backend API
          const response = await fetch(`/api/clients/${userId}/${publishedId}`);
          if (response.ok) {
            const backendData = await response.json();
            setData(backendData);
            setTempData(backendData);
          } else {
            // Use default data if fetch fails
            setData(defaultData);
            setTempData(defaultData);
          }
        }
      } catch (error) {
        console.error('Error loading clients data:', error);
        setData(defaultData);
        setTempData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [clientsData, userId, publishedId]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...data });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Save to backend API
      const response = await fetch(`/api/clients/${userId}/${publishedId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: tempData,
          templateSelection
        })
      });

      if (response.ok) {
        const savedData = await response.json();
        setData(savedData);
        if (onStateChange) {
          onStateChange(savedData);
        }
        setIsEditing(false);
        toast.success('Clients section saved successfully');
      } else {
        throw new Error('Failed to save data');
      }
    } catch (error) {
      console.error('Error saving clients data:', error);
      toast.error('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...data });
    setIsEditing(false);
  };

  const updateClient = (index: number, field: string, value: string) => {
    const updatedClients = [...tempData.clients];
    updatedClients[index] = { ...updatedClients[index], [field]: value };
    setTempData({ ...tempData, clients: updatedClients });
  };

  const addClient = () => {
    const newClient: Client = {
      id: Date.now().toString(),
      name: 'New Client',
      industry: 'Industry'
    };
    setTempData({
      ...tempData,
      clients: [...tempData.clients, newClient]
    });
  };

  const removeClient = (index: number) => {
    if (tempData.clients.length <= 1) {
      toast.error("You must have at least one client");
      return;
    }
    
    const updatedClients = tempData.clients.filter((_, i) => i !== index);
    setTempData({ ...tempData, clients: updatedClients });
  };

  const updateStat = (field: keyof Stats, value: string) => {
    setTempData({
      ...tempData,
      stats: { ...tempData.stats, [field]: value }
    });
  };

  const updateCta = (field: keyof ClientsData['cta'], value: string) => {
    setTempData({
      ...tempData,
      cta: { ...tempData.cta, [field]: value }
    });
  };

  const displayData = isEditing ? tempData : data;

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-yellow-500" />
          <p className="text-muted-foreground mt-4">Loading clients data...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
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
                className='bg-red-500 hover:bg-red-600 shadow-md'
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
          <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
            Trusted by <span className="text-yellow-500">Leading Companies</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            I've had the privilege of working with amazing companies across various 
            industries, delivering innovative solutions that drive real business results.
          </p>
        </div>

        {/* Stats */}
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
                />
              ) : (
                <div className="text-3xl sm:text-4xl text-yellow-500 mb-2">{displayData.stats[stat.key]}</div>
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
                <p className="text-muted-foreground">{stat.label}</p>
              )}
            </div>
          ))}
        </div>

        {/* Client Grid */}
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
                    <input
                      type="text"
                      value={client.name}
                      onChange={(e) => updateClient(index, 'name', e.target.value)}
                      className="w-full text-lg text-foreground group-hover:text-yellow-600 transition-colors duration-300 mb-1 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-center"
                    />
                    <input
                      type="text"
                      value={client.industry}
                      onChange={(e) => updateClient(index, 'industry', e.target.value)}
                      className="w-full text-xs text-muted-foreground bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-1 text-center"
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
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-yellow-50 to-card dark:from-yellow-900/20 dark:to-card rounded-2xl p-8">
          {isEditing ? (
            <>
              <input
                type="text"
                value={displayData.cta.title}
                onChange={(e) => updateCta('title', e.target.value)}
                className="w-full text-2xl text-foreground mb-4 bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2 text-center"
              />
              <textarea
                value={displayData.cta.description}
                onChange={(e) => updateCta('description', e.target.value)}
                className="w-full text-muted-foreground mb-6 max-w-xl mx-auto bg-white/80 border-2 border-dashed border-blue-300 rounded focus:border-blue-500 focus:outline-none p-2"
                rows="3"
              />
              <input
                type="text"
                value={displayData.cta.buttonText}
                onChange={(e) => updateCta('buttonText', e.target.value)}
                className="w-40 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 px-4 py-2 bg-white/80 border-2 border-dashed border-blue-300 focus:border-blue-500 focus:outline-none text-center"
              />
            </>
          ) : (
            <>
              <h3 className="text-2xl text-foreground mb-4">
                {displayData.cta.title}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                {displayData.cta.description}
              </p>
              <a
                href="#contact"
                className="inline-flex items-center px-8 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {displayData.cta.buttonText}
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  );
}