import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { X, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Services() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load More state
  const [visibleCount, setVisibleCount] = useState(3);

  // Editable services array
  const [services, setServices] = useState([
    {
      title: "Strategy Consulting",
      category: "Business Strategy",
      image:
        "https://images.unsplash.com/photo-1565688527174-775059ac429c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHN0cmF0ZWd5JTIwY29uc3VsdGluZyUyMG1lZXRpbmd8ZW58MXx8fHwxNzU1Njc3NjA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description:
        "Comprehensive business strategy development to drive growth and competitive advantage.",
      features: ["Market Analysis", "Strategic Planning", "Risk Assessment"],

      detailedDescription:
        "Our strategy consulting service helps businesses navigate complex challenges and opportunities. We provide in-depth market analysis, develop comprehensive strategic plans, and conduct thorough risk assessments to ensure your business is positioned for success in today's competitive landscape.",
      benefits: [
        "Increased market share",
        "Improved competitive positioning",
        "Enhanced operational efficiency",
        "Better risk management",
      ],
      process: [
        "Initial consultation & assessment",
        "Market research & analysis",
        "Strategy development",
        "Implementation planning",
        "Ongoing support & optimization",
      ],
      pricing: "Custom quotes based on project scope",
      timeline: "4-12 weeks depending on complexity",
    },
    {
      title: "Team Development",
      category: "Human Resources",
      image:
        "https://images.unsplash.com/photo-1646579886135-068c73800308?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwZGV2ZWxvcG1lbnQlMjB0cmFpbmluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc1NTYwNzA3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description:
        "Expert training programs and leadership development for high-performing teams.",
      features: ["Leadership Training", "Skills Development", "Team Building"],
      detailedDescription:
        "Transform your team into a high-performing unit with our comprehensive development programs. We focus on leadership training, skill enhancement, and team building activities that foster collaboration and drive results.",
      benefits: [
        "Enhanced team collaboration",
        "Improved leadership skills",
        "Increased employee engagement",
        "Higher productivity levels",
      ],
      process: [
        "Skills gap analysis",
        "Customized training program design",
        "Interactive workshop delivery",
        "Progress tracking & assessment",
        "Continuous improvement plans",
      ],
      pricing: "From $2,500 per team",
      timeline: "2-8 weeks program duration",
    },
    {
      title: "Digital Transformation",
      category: "Technology",
      image:
        "https://images.unsplash.com/photo-1623578240928-9473b76272ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwdHJhbnNmb3JtYXRpb24lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1NTYxNDMxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description:
        "Modernize operations with cutting-edge technology and automation solutions.",
      features: ["Process Automation", "Cloud Migration", "Digital Strategy"],
      detailedDescription:
        "Embrace the future with our digital transformation services. We help businesses modernize their operations through process automation, cloud migration, and comprehensive digital strategy development.",
      benefits: [
        "Reduced operational costs",
        "Improved efficiency through automation",
        "Enhanced scalability with cloud solutions",
        "Future-proof technology infrastructure",
      ],
      process: [
        "Digital maturity assessment",
        "Technology stack evaluation",
        "Implementation roadmap creation",
        "System integration & migration",
        "Training & ongoing support",
      ],
      pricing: "Project-based pricing starting at $15,000",
      timeline: "8-24 weeks implementation",
    },
    {
      title: "Performance Optimization",
      category: "Analytics",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJmb3JtYW5jZSUyMGFuYWx5dGljcyUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NTU2Nzc2MDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description:
        "Data-driven insights and KPI tracking to maximize business performance.",
      features: ["Analytics Setup", "KPI Tracking", "ROI Optimization"],
      detailedDescription:
        "Leverage data to drive business decisions with our performance optimization services. We set up comprehensive analytics systems, implement KPI tracking, and optimize ROI across all business functions.",
      benefits: [
        "Data-driven decision making",
        "Improved ROI on marketing spend",
        "Enhanced operational visibility",
        "Proactive performance management",
      ],
      process: [
        "Current performance assessment",
        "KPI framework development",
        "Analytics system implementation",
        "Dashboard creation & training",
        "Ongoing optimization & reporting",
      ],
      pricing: "Monthly packages from $1,500",
      timeline: "4-8 weeks initial setup",
    },
  ]);

  // Categories
  const [categories, setCategories] = useState([
    "All",
    ...new Set(services.map((s) => s.category)),
  ]);

  const filteredServices =
    activeCategory === "All"
      ? services
      : services.filter((s) => s.category === activeCategory);

  const visibleServices = filteredServices.slice(0, visibleCount);

  // Handlers
  const updateServiceField = (index: number, field: string, value: any) => {
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
    if (field === "category" && !categories.includes(value)) {
      setCategories((prev) => [...prev, value]);
    }
  };

  const updateServiceList = (
    index: number,
    field: "features" | "benefits" | "process",
    listIndex: number,
    value: string
  ) => {
    setServices((prev) =>
      prev.map((s, i) =>
        i === index
          ? {
              ...s,
              [field]: s[field].map((item: string, li: number) =>
                li === listIndex ? value : item
              ),
            }
          : s
      )
    );
  };

  const addToList = (
    index: number,
    field: "features" | "benefits" | "process"
  ) => {
    setServices((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, [field]: [...s[field], "New Item"] } : s
      )
    );
  };

  const removeFromList = (
    index: number,
    field: "features" | "benefits" | "process",
    listIndex: number
  ) => {
    setServices((prev) =>
      prev.map((s, i) =>
        i === index
          ? {
              ...s,
              [field]: s[field].filter(
                (_: string, li: number) => li !== listIndex
              ),
            }
          : s
      )
    );
  };

  const handleImageUpload = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateServiceField(index, "image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addService = () => {
    const newService = {
      title: "New Service",
      category: "New Category",
      image: "https://via.placeholder.com/600x400?text=New+Service",
      description: "Service description goes here...",
      features: ["New Feature"],
      detailedDescription: "Detailed description for the new service...",
      benefits: ["New Benefit"],
      process: ["New Step"],
      pricing: "Custom pricing",
      timeline: "TBD",
    };
    setServices((prev) => [...prev, newService]);
    if (!categories.includes("New Category")) {
      setCategories((prev) => [...prev, "New Category"]);
    }
  };

  const removeService = (index: number) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const addCategory = () => {
    const newCategory = `New Category ${categories.length}`;
    if (!categories.includes(newCategory)) {
      setCategories((prev) => [...prev, newCategory]);
    }
  };

  const removeCategory = (cat: string) => {
    if (cat !== "All") {
      setCategories((prev) => prev.filter((c) => c !== cat));
      setServices((prev) =>
        prev.map((s) =>
          s.category === cat ? { ...s, category: "Uncategorized" } : s
        )
      );
    }
  };

  const openModal = (service: any) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  return (
    <motion.section
      id='services'
      className='py-20 bg-background theme-transition'
    >
      <div className='max-w-7xl mx-auto px-4'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold'>Our Services</h2>
          <p className='text-muted-foreground'>
            Comprehensive Solutions for Your Business
          </p>
        </div>

        {/* Filter */}
        <div className='flex flex-wrap justify-center gap-3 mb-6'>
          {categories.map((cat, i) => (
            <div key={i} className='flex items-center gap-2'>
              {isEditing ? (
                <input
                  value={cat}
                  onChange={(e) =>
                    setCategories((prev) =>
                      prev.map((c, idx) => (idx === i ? e.target.value : c))
                    )
                  }
                  className='border-b px-2'
                />
              ) : (
                <Button
                  onClick={() => {
                    setActiveCategory(cat);
                    setVisibleCount(6); // reset load more
                  }}
                  className={
                    activeCategory === cat
                      ? "bg-primary text-white"
                      : "bg-card text-card-foreground"
                  }
                >
                  {cat}
                </Button>
              )}
              {isEditing && cat !== "All" && (
                <button
                  onClick={() => removeCategory(cat)}
                  className='text-red-500 text-xs'
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <button
              onClick={addCategory}
              className='text-green-600 text-sm font-medium'
            >
              + Add Category
            </button>
          )}
        </div>

        {/* Services Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {visibleServices.map((service, index) => (
            <Card key={index} className='relative border-2 shadow-lg hover:shadow-xl  shadow-gray-500' >
              <div className='h-40 overflow-hidden relative'>
                <img
                  src={service.image}
                  alt={service.title}
                  className='w-full h-full object-cover'
                />
                {isEditing && (
                  <input
                    type='file'
                    accept='image/*'
                    className='absolute bottom-2 left-2 text-xs'
                    onChange={(e) => handleImageUpload(index, e)}
                  />
                )}
              </div>
              <CardHeader>
                {isEditing ? (
                  <input
                    value={service.title}
                    onChange={(e) =>
                      updateServiceField(index, "title", e.target.value)
                    }
                    className='border-b w-full'
                  />
                ) : (
                  <CardTitle>{service.title}</CardTitle>
                )}
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <>
                    <textarea
                      value={service.description}
                      onChange={(e) =>
                        updateServiceField(index, "description", e.target.value)
                      }
                      className='border-b w-full'
                    />
                    <input
                      value={service.category}
                      onChange={(e) =>
                        updateServiceField(index, "category", e.target.value)
                      }
                      className='border-b w-full mt-2'
                    />
                  </>
                ) : (
                  <>
                    <p className='text-sm text-muted-foreground'>
                      {service.description}
                    </p>
                    <p className='text-xs mt-1 italic text-gray-500'>
                      Category: {service.category}
                    </p>
                  </>
                )}

                <div className='mt-4 flex gap-2'>
                  <Button size='sm' onClick={() => openModal(service)}>
                    View Details
                  </Button>
                  {isEditing && (
                    <Button
                      size='sm'
                      variant='destructive'
                      onClick={() => removeService(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {isEditing && (
            <Card className='flex items-center justify-center border-dashed'>
              <Button onClick={addService} className='text-green-600'>
                + Add Service
              </Button>
            </Card>
          )}
        </div>

        {/* Load More & Show Less */}
        <div className='flex justify-center mt-6'>
          {visibleCount < filteredServices.length && (
            <Button onClick={() => setVisibleCount((prev) => prev + 6)}>
              Load More
            </Button>
          )}
          {visibleCount >= filteredServices.length &&
            filteredServices.length > 3 && (
              <Button
                onClick={() => setVisibleCount(3)}
                variant='secondary'
                className='ml-4'
              >
                Show Less
              </Button>
            )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedService && (
          <motion.div
            className='fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <div
              className='bg-card rounded-xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]'
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className='absolute top-4 right-4 bg-white rounded-full p-2'
              >
                <X className='w-5 h-5' />
              </button>

              {isEditing ? (
                <input
                  value={selectedService.title}
                  onChange={(e) =>
                    updateServiceField(
                      services.findIndex(
                        (s) => s.title === selectedService.title
                      ),
                      "title",
                      e.target.value
                    )
                  }
                  className='border-b w-full text-2xl font-bold mb-4'
                />
              ) : (
                <h2 className='text-2xl font-bold mb-4'>
                  {selectedService.title}
                </h2>
              )}

              {isEditing ? (
                <textarea
                  value={selectedService.detailedDescription}
                  onChange={(e) =>
                    updateServiceField(
                      services.findIndex(
                        (s) => s.title === selectedService.title
                      ),
                      "detailedDescription",
                      e.target.value
                    )
                  }
                  className='border-b w-full mb-4'
                />
              ) : (
                <p className='text-muted-foreground mb-4'>
                  {selectedService.detailedDescription}
                </p>
              )}

              {/* Benefits */}
              <h3 className='font-semibold mb-2'>Key Benefits</h3>
              <ul className='space-y-2 mb-4'>
                {selectedService.benefits.map((b: string, bi: number) => (
                  <li key={bi} className='flex gap-2'>
                    <CheckCircle className='w-4 h-4 text-green-500 mt-1' />
                    {isEditing ? (
                      <div className='flex flex-col gap-1 w-full'>
                        <input
                          value={b}
                          onChange={(e) =>
                            updateServiceList(
                              services.findIndex(
                                (s) => s.title === selectedService.title
                              ),
                              "benefits",
                              bi,
                              e.target.value
                            )
                          }
                          className='border-b w-full'
                        />
                        <button
                          onClick={() =>
                            removeFromList(
                              services.findIndex(
                                (s) => s.title === selectedService.title
                              ),
                              "benefits",
                              bi
                            )
                          }
                          className='text-xs text-red-500'
                        >
                          ✕ Remove
                        </button>
                      </div>
                    ) : (
                      <span>{b}</span>
                    )}
                  </li>
                ))}
              </ul>
              {isEditing && (
                <button
                  onClick={() =>
                    addToList(
                      services.findIndex(
                        (s) => s.title === selectedService.title
                      ),
                      "benefits"
                    )
                  }
                  className='text-xs text-green-600 mb-4'
                >
                  + Add Benefit
                </button>
              )}

              {/* Process */}
              <h3 className='font-semibold mb-2'>Our Process</h3>
              <ol className='space-y-2 mb-4'>
                {selectedService.process.map((p: string, pi: number) => (
                  <li key={pi}>
                    {isEditing ? (
                      <div className='flex flex-col gap-1 w-full'>
                        <input
                          value={p}
                          onChange={(e) =>
                            updateServiceList(
                              services.findIndex(
                                (s) => s.title === selectedService.title
                              ),
                              "process",
                              pi,
                              e.target.value
                            )
                          }
                          className='border-b w-full'
                        />
                        <button
                          onClick={() =>
                            removeFromList(
                              services.findIndex(
                                (s) => s.title === selectedService.title
                              ),
                              "process",
                              pi
                            )
                          }
                          className='text-xs text-red-500'
                        >
                          ✕ Remove
                        </button>
                      </div>
                    ) : (
                      <span>{p}</span>
                    )}
                  </li>
                ))}
              </ol>
              {isEditing && (
                <button
                  onClick={() =>
                    addToList(
                      services.findIndex(
                        (s) => s.title === selectedService.title
                      ),
                      "process"
                    )
                  }
                  className='text-xs text-green-600 mb-4'
                >
                  + Add Step
                </button>
              )}

              {/* Pricing & Timeline */}
              <div className='grid grid-cols-2 gap-6'>
                <div>
                  <h3 className='font-semibold mb-2'>Pricing</h3>
                  {isEditing ? (
                    <input
                      value={selectedService.pricing}
                      onChange={(e) =>
                        updateServiceField(
                          services.findIndex(
                            (s) => s.title === selectedService.title
                          ),
                          "pricing",
                          e.target.value
                        )
                      }
                      className='border-b w-full'
                    />
                  ) : (
                    <p>{selectedService.pricing}</p>
                  )}
                </div>
                <div>
                  <h3 className='font-semibold mb-2'>Timeline</h3>
                  {isEditing ? (
                    <input
                      value={selectedService.timeline}
                      onChange={(e) =>
                        updateServiceField(
                          services.findIndex(
                            (s) => s.title === selectedService.title
                          ),
                          "timeline",
                          e.target.value
                        )
                      }
                      className='border-b w-full'
                    />
                  ) : (
                    <p>{selectedService.timeline}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
