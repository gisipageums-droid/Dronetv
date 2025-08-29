import React, { useMemo, useState, useEffect, useRef } from "react";
import { FormStep } from "../FormStep";
import { MultiSelect, FormInput } from "../FormInput";
import { StepProps } from "../../types/form";

const EditModal: React.FC<{
  title: string;
  items: string[];
  onClose: () => void;
  onSave: (newItems: string[]) => void;
  onLiveChange?: (newItems: string[]) => void;
  onOpenChild?: (selectedItem: string) => void;
  childLevelLabel?: string;
  initialSelected?: string | null;
  showBack?: boolean;
  onBack?: () => void;
}> = ({
  title,
  items,
  onClose,
  onSave,
  onLiveChange,
  onOpenChild,
  childLevelLabel,
  initialSelected = null,
  showBack = false,
  onBack,
}) => {
    const [localItems, setLocalItems] = useState<string[]>(items);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});
    const listScrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      setLocalItems(items);
      inputRefs.current = {};
      if (initialSelected) {
        const idx = items.findIndex((x) => x === initialSelected);
        setSelectedIdx(idx >= 0 ? idx : null);
      } else {
        setSelectedIdx(null);
      }
    }, [items, initialSelected]);

    const sanitize = (arr: string[]) =>
      Array.from(new Set(arr.map((s) => s.trim()).filter(Boolean)));

    // Add unlimited rows; focus + auto-scroll to the new row
    const addRow = () => {
      setLocalItems((s) => {
        const newIndex = s.length;
        const next = [...s, ""];
        setSelectedIdx(newIndex);
        setTimeout(() => {
          const el = inputRefs.current[newIndex];
          if (el) el.focus();
          if (el && typeof el.scrollIntoView === "function") {
            el.scrollIntoView({ behavior: "smooth", block: "nearest" });
          } else if (listScrollRef.current) {
            listScrollRef.current.scrollTop = listScrollRef.current.scrollHeight;
          }
        }, 0);
        return next;
      });
    };

    const updateRow = (idx: number, value: string) => {
      setLocalItems((s) => {
        const next = s.map((v, i) => (i === idx ? value : v));
        if (onLiveChange) onLiveChange(sanitize(next));
        return next;
      });
      setSelectedIdx(idx);
    };

    const removeRow = (idx: number) => {
      setLocalItems((s) => {
        const next = s.filter((_, i) => i !== idx);
        if (onLiveChange) onLiveChange(sanitize(next));
        return next;
      });
      setSelectedIdx((prev) => {
        if (prev === null) return null;
        if (prev === idx) return null;
        if (prev > idx) return prev - 1;
        return prev;
      });
      delete inputRefs.current[idx];
    };

    const handleSave = () => {
      const cleaned = sanitize(localItems);
      onSave(cleaned);
      if (onLiveChange) onLiveChange(cleaned);
      onClose();
    };

    const selectedItem =
      selectedIdx !== null &&
        localItems[selectedIdx] &&
        localItems[selectedIdx].trim()
        ? localItems[selectedIdx].trim()
        : "";

    return (
      <div className="flex fixed inset-0 z-50 justify-center items-center bg-black/50">
        <div className="bg-white w-[560px] max-w-[95vw] rounded-2xl shadow-xl p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">{title}</h2>
            <div className="flex gap-2 items-center">
              {showBack && onBack && (
                <button
                  onClick={onBack}
                  className="px-3 py-1 text-sm rounded-lg border hover:bg-slate-50"
                >
                  ← Back
                </button>
              )}
              <button
                className="inline-flex justify-center items-center w-8 h-8 rounded-lg border hover:bg-slate-50"
                onClick={onClose}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-3 mb-3 text-xs rounded-lg border bg-slate-50 text-slate-600">
            <ul className="space-y-1 list-disc list-inside">
              <li>
                Add, rename, or remove items below — changes update live on the
                page.
              </li>
              {onOpenChild && (
                <li>
                  Select one row (radio) and click <strong>Next →</strong> to edit
                  its {childLevelLabel}.
                </li>
              )}
            </ul>
          </div>

          <div
            ref={listScrollRef}
            className="overflow-auto pr-1 space-y-2 max-h-72"
          >
            {localItems.length === 0 && (
              <p className="text-sm text-slate-500">
                No options yet. Use “Add option”.
              </p>
            )}
            {localItems.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                {onOpenChild ? (
                  <input
                    type="radio"
                    className="mt-1"
                    checked={selectedIdx === idx}
                    onChange={() => setSelectedIdx(idx)}
                  />
                ) : (
                  <div className="w-3" />
                )}

                <input
                  ref={(el) => (inputRefs.current[idx] = el)}
                  value={item}
                  onChange={(e) => updateRow(idx, e.target.value)}
                  placeholder="Type option…"
                  className="flex-1 px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label={`Option input ${idx + 1}`}
                />

                <button
                  className="px-2 py-1 text-xs bg-white rounded-lg border hover:bg-red-50"
                  onClick={() => removeRow(idx)}
                  aria-label="Remove"
                  title="Remove"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 items-center mt-3">
            <button
              className="px-3 py-1.5 rounded-lg border hover:bg-slate-50"
              onClick={addRow}
            >
              + Add option
            </button>
            <div className="ml-2 text-xs text-slate-500">
              Changes update live (type to push updates)
            </div>
          </div>

          <div className="flex gap-2 justify-between mt-4">
            {onOpenChild ? (
              <button
                className="px-3 py-1.5 rounded-lg border hover:bg-slate-50"
                onClick={() => selectedItem && onOpenChild(selectedItem)}
                disabled={!selectedItem}
                title={
                  selectedItem
                    ? `Edit ${childLevelLabel} for "${selectedItem}"`
                    : "Select an item first"
                }
              >
                Next → Edit {childLevelLabel}
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg border" onClick={onClose}>
                Cancel
              </button>
              <button
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

/* ----------------- Step4BusinessCategories component ----------------- */
const Step4BusinessCategories: React.FC<StepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isValid,
}) => {
  // UI state for selection/expansion
  const [expandedMainCategory, setExpandedMainCategory] = useState<string>("");
  const [selectedMainCategories, setSelectedMainCategories] = useState<
    string[]
  >([]);
  // selectedSubcategories keyed by main category
  const [selectedSubcategories, setSelectedSubcategories] = useState<{
    [key: string]: string[];
  }>({});
  const [expandedSubcategory, setExpandedSubcategory] = useState<string>("");
  // selectedSubSubcategories keyed by sub category
  const [selectedSubSubcategories, setSelectedSubSubcategories] = useState<{
    [key: string]: string[];
  }>({});

  // === Editable data stores (seeded with your original full lists) ===
  const [mainCategories, setMainCategories] = useState<string[]>([
    "Drone Manufacturing",
    "Drone Services",
    "Drone Training/RPTO",
    "Aerial Photography & Videography",
    "Drone Software Development",
    "AI Consulting",
    "AI Development",
    "AI Products",
    "Machine Learning Services",
    "Computer Vision",
    "Natural Language Processing",
    "AI Training & Education",
    "GIS Services",
    "GNSS/GPS Solutions",
    "DGPS Services",
    "Land Surveying",
    "Geospatial Analytics",
    "GIS Software Development",
  ]);

  const [subcategories, setSubcategories] = useState<Record<string, string[]>>({
    "Drone Manufacturing": [
      "Fixed-Wing UAVs",
      "Multi-Rotor Drones",
      "Hybrid UAVs",
      "Heavy-Lift Drones",
      "Long-Range Drones",
      "Customized Manufacturing",
    ],
    "Drone Services": [
      "Agricultural Services",
      "Mapping & Surveying",
      "Infrastructure Inspection",
      "Construction Services",
      "Environmental Monitoring",
      "Security & Surveillance",
    ],
    "Drone Training/RPTO": [
      "RPTO Small Category",
      "RPTO Medium Category",
      "Train the Trainer (TTT)",
      "MICRO Category Training",
      "FPV Training",
      "BVLOS Training",
    ],
    "Aerial Photography & Videography": [
      "Real Estate Photography",
      "Event Photography",
      "Cinematography",
      "Industrial Photography",
      "Wildlife Photography",
      "Sports Photography",
    ],
    "Drone Software Development": [
      "Flight Control Software",
      "Data Analytics Platforms",
      "Fleet Management Systems",
      "Mapping Software",
      "AI Integration",
      "Mobile Applications",
    ],
    "AI Consulting": [
      "AI Strategy Consulting",
      "Digital Transformation",
      "AI Readiness Assessment",
      "Implementation Consulting",
      "ROI Analysis",
      "Technology Assessment",
    ],
    "AI Development": [
      "Custom ML Models",
      "Deep Learning Solutions",
      "AI Applications",
      "Algorithm Development",
      "Neural Networks",
      "Reinforcement Learning",
    ],
    "AI Products": [
      "AI Software Products",
      "AI Platforms",
      "AI Tools",
      "Pre-built Solutions",
      "AI SaaS",
      "AI APIs",
    ],
    "Machine Learning Services": [
      "Predictive Analytics",
      "Classification Models",
      "Regression Analysis",
      "Clustering Solutions",
      "Time Series Analysis",
      "Anomaly Detection",
    ],
    "Computer Vision": [
      "Image Recognition",
      "Object Detection",
      "Facial Recognition",
      "Medical Imaging",
      "Video Analytics",
      "OCR Solutions",
      "Quality Inspection",
    ],
    "Natural Language Processing": [
      "Text Analytics",
      "Chatbots",
      "Language Translation",
      "Sentiment Analysis",
      "Document Processing",
      "Voice Recognition",
      "Content Generation",
    ],
    "AI Training & Education": [
      "AI Workshops",
      "Corporate Training",
      "AI Certification",
      "Educational Content",
      "Online Courses",
      "AI Bootcamps",
      "Consulting Training",
    ],
    "GIS Services": [
      "GIS Analysis",
      "Spatial Planning",
      "Data Management",
      "System Integration",
      "Cartographic Services",
      "Remote Sensing",
      "Geodatabase Design",
    ],
    "GNSS/GPS Solutions": [
      "Precision Positioning",
      "Navigation Systems",
      "Timing Solutions",
      "Survey Equipment",
      "RTK Systems",
      "Base Stations",
      "Mobile Mapping",
    ],
    "DGPS Services": [
      "Differential Correction",
      "Real-time Positioning",
      "Survey Services",
      "Navigation Support",
      "Correction Services",
      "Reference Stations",
    ],
    "Land Surveying": [
      "Boundary Surveys",
      "Topographic Mapping",
      "Cadastral Surveys",
      "Engineering Surveys",
      "Hydrographic Surveys",
      "Aerial Surveys",
      "Construction Surveys",
    ],
    "Geospatial Analytics": [
      "Spatial Analysis",
      "Location Intelligence",
      "Spatial Statistics",
      "Predictive Modeling",
      "Network Analysis",
      "Terrain Analysis",
      "Environmental Modeling",
    ],
    "GIS Software Development": [
      "Custom GIS Applications",
      "Web Mapping Solutions",
      "Mobile GIS Apps",
      "Desktop GIS Solutions",
      "GIS API Development",
      "Plugin Development",
      "Cloud GIS Solutions",
    ],
  });

  const [subSubcategories, setSubSubcategories] = useState<
    Record<string, string[]>
  >({
    // Drone Manufacturing Sub-subcategories
    "Fixed-Wing UAVs": [
      "VTOL Aircraft",
      "Traditional Fixed-Wing",
      "Gliders",
      "High-Altitude UAVs",
      "Long-Endurance UAVs",
    ],
    "Multi-Rotor Drones": [
      "Quadcopter",
      "Hexacopter",
      "Octocopter",
      "Coaxial Drones",
      "Tricopter",
    ],
    "Hybrid UAVs": [
      "VTOL Fixed-Wing",
      "Tiltrotor",
      "Tiltwing",
      "Compound Helicopters",
      "Convertible Aircraft",
    ],
    "Heavy-Lift Drones": [
      "Cargo Drones",
      "Industrial Lift",
      "Agricultural Sprayers",
      "Construction Drones",
      "Emergency Supply",
    ],
    "Long-Range Drones": [
      "Beyond Visual Line of Sight",
      "Satellite Communication",
      "Extended Battery",
      "Fuel Cell Powered",
      "Solar Powered",
    ],
    "Customized Manufacturing": [
      "Bespoke Design",
      "Prototype Development",
      "Small Batch Production",
      "Specialized Components",
      "Custom Integration",
    ],

    // Drone Services Sub-subcategories
    "Agricultural Services": [
      "Crop Monitoring",
      "Precision Spraying",
      "Livestock Monitoring",
      "Soil Analysis",
      "Irrigation Management",
      "Yield Estimation",
    ],
    "Mapping & Surveying": [
      "Photogrammetry",
      "LiDAR Mapping",
      "Topographic Surveys",
      "3D Modeling",
      "Volume Calculations",
      "Progress Monitoring",
    ],
    "Infrastructure Inspection": [
      "Power Line Inspection",
      "Pipeline Monitoring",
      "Bridge Inspection",
      "Tower Inspection",
      "Solar Panel Inspection",
      "Wind Turbine Inspection",
    ],
    "Construction Services": [
      "Site Surveying",
      "Progress Monitoring",
      "Safety Inspections",
      "Volumetric Analysis",
      "Thermal Imaging",
      "Quality Control",
    ],
    "Environmental Monitoring": [
      "Wildlife Tracking",
      "Forest Monitoring",
      "Water Quality",
      "Air Quality",
      "Disaster Assessment",
      "Conservation",
    ],
    "Security & Surveillance": [
      "Perimeter Security",
      "Event Monitoring",
      "Search & Rescue",
      "Border Patrol",
      "Crowd Control",
      "Asset Protection",
    ],

    // AI Categories Sub-subcategories
    "Image Recognition": [
      "Product Recognition",
      "Brand Detection",
      "Scene Understanding",
      "Content Moderation",
      "Visual Search",
      "Image Classification",
    ],
    "Object Detection": [
      "Real-time Detection",
      "Multi-object Tracking",
      "Defect Detection",
      "Security Monitoring",
      "Autonomous Navigation",
      "Quality Control",
    ],
    "Facial Recognition": [
      "Identity Verification",
      "Access Control",
      "Attendance Systems",
      "Security Applications",
      "Emotion Recognition",
      "Age Estimation",
    ],
    "Medical Imaging": [
      "X-ray Analysis",
      "MRI Processing",
      "CT Scan Analysis",
      "Pathology Detection",
      "Radiology AI",
      "Diagnostic Imaging",
    ],

    // GIS Categories Sub-subcategories
    "Boundary Surveys": [
      "Property Boundaries",
      "Legal Descriptions",
      "Easement Surveys",
      "Right-of-Way",
      "Encroachment Analysis",
      "Title Surveys",
    ],
    "Topographic Mapping": [
      "Contour Mapping",
      "Digital Elevation Models",
      "Terrain Analysis",
      "Slope Analysis",
      "Watershed Mapping",
      "Relief Mapping",
    ],
    "Engineering Surveys": [
      "Construction Layout",
      "As-Built Surveys",
      "Monitoring Surveys",
      "Utility Mapping",
      "Route Surveys",
      "Deformation Monitoring",
    ],
    "Aerial Surveys": [
      "Photogrammetry",
      "LiDAR Surveys",
      "Thermal Imaging",
      "Multispectral Imaging",
      "Hyperspectral Imaging",
      "UAV Surveys",
    ],
  });

  // === NEW: Infinite-deep children map (works for ANY node name) ===
  // key = parent node name (can be a sub, sub-sub, or any deeper node)
  // value = array of child names
  const [extraChildren, setExtraChildren] = useState<Record<string, string[]>>(
    {}
  );

  // Selections for deeper levels (parentName -> selected child names)
  const [selectedDeep, setSelectedDeep] = useState<Record<string, string[]>>(
    {}
  );

  // === NEW: modal to view/select a sub-sub hierarchy ===
  const [hierarchyModal, setHierarchyModal] = useState<{
    root: string; // sub-sub item clicked
    parentSub: string; // its subcategory parent
  } | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    // Load main categories
    const savedMainCategories = localStorage.getItem('businessMainCategories');
    if (savedMainCategories) {
      try {
        const parsed = JSON.parse(savedMainCategories);
        setMainCategories(parsed);
      } catch (error) {
        console.error('Error parsing saved main categories:', error);
      }
    }

    // Load subcategories
    const savedSubcategories = localStorage.getItem('businessSubcategories');
    if (savedSubcategories) {
      try {
        const parsed = JSON.parse(savedSubcategories);
        setSubcategories(parsed);
      } catch (error) {
        console.error('Error parsing saved subcategories:', error);
      }
    }

    // Load sub-subcategories
    const savedSubSubcategories = localStorage.getItem('businessSubSubcategories');
    if (savedSubSubcategories) {
      try {
        const parsed = JSON.parse(savedSubSubcategories);
        setSubSubcategories(parsed);
      } catch (error) {
        console.error('Error parsing saved sub-subcategories:', error);
      }
    }

    // Load extra children
    const savedExtraChildren = localStorage.getItem('businessExtraChildren');
    if (savedExtraChildren) {
      try {
        const parsed = JSON.parse(savedExtraChildren);
        setExtraChildren(parsed);
      } catch (error) {
        console.error('Error parsing saved extra children:', error);
      }
    }

    // Load geography options
    const savedGeographyOptions = localStorage.getItem('businessGeographyOptions');
    if (savedGeographyOptions) {
      try {
        const parsed = JSON.parse(savedGeographyOptions);
        setGeographyOptions(parsed);
      } catch (error) {
        console.error('Error parsing saved geography options:', error);
      }
    }

    // Load selected main categories
    const savedSelectedMainCategories = localStorage.getItem('selectedBusinessMainCategories');
    if (savedSelectedMainCategories) {
      try {
        const parsed = JSON.parse(savedSelectedMainCategories);
        setSelectedMainCategories(parsed);
      } catch (error) {
        console.error('Error parsing saved selected main categories:', error);
      }
    }

    // Load selected subcategories
    const savedSelectedSubcategories = localStorage.getItem('selectedBusinessSubcategories');
    if (savedSelectedSubcategories) {
      try {
        const parsed = JSON.parse(savedSelectedSubcategories);
        setSelectedSubcategories(parsed);
      } catch (error) {
        console.error('Error parsing saved selected subcategories:', error);
      }
    }

    // Load selected sub-subcategories
    const savedSelectedSubSubcategories = localStorage.getItem('selectedBusinessSubSubcategories');
    if (savedSelectedSubSubcategories) {
      try {
        const parsed = JSON.parse(savedSelectedSubSubcategories);
        setSelectedSubSubcategories(parsed);
      } catch (error) {
        console.error('Error parsing saved selected sub-subcategories:', error);
      }
    }

    // Load selected deep items
    const savedSelectedDeep = localStorage.getItem('selectedBusinessDeep');
    if (savedSelectedDeep) {
      try {
        const parsed = JSON.parse(savedSelectedDeep);
        setSelectedDeep(parsed);
      } catch (error) {
        console.error('Error parsing saved selected deep items:', error);
      }
    }

    // Load form data from localStorage
    const savedFormData = localStorage.getItem('businessFormData');
    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData);
        // Update form data for business-related fields
        if (parsed.otherMainCategories) {
          updateFormData({ otherMainCategories: parsed.otherMainCategories });
        }
        if (parsed.coverageType) {
          updateFormData({ coverageType: parsed.coverageType });
        }
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const formDataToSave = {
      otherMainCategories: formData.otherMainCategories,
      coverageType: formData.coverageType,
      geographyOfOperations: formData.geographyOfOperations,
    };
    localStorage.setItem('businessFormData', JSON.stringify(formDataToSave));
  }, [formData.otherMainCategories, formData.coverageType, formData.geographyOfOperations]);

  // state
  const [expandedDeepParent, setExpandedDeepParent] = useState<string | null>(null);

  // function
  const toggleDeepExpand = (key: string) => {
    setExpandedDeepParent((prev) => (prev === key ? null : key));
  };


  // NEW: Geography options become editable
  const [geographyOptions, setGeographyOptions] = useState<string[]>([
    "Local (City/District)",
    "State/Regional",
    "National",
    "International",
    "Pan-India",
    "Asia-Pacific",
    "Global",
  ]);

  // NEW: modal toggle for geography
  const [editingGeography, setEditingGeography] = useState(false);

  // Live-change handler to keep selections valid (geography)
  const handleLiveGeographyChange = (newItems: string[]) => {
    setGeographyOptions(newItems);
    // Save to localStorage
    localStorage.setItem('businessGeographyOptions', JSON.stringify(newItems));

    const newGeographyOfOperations = (formData.geographyOfOperations || []).filter(
      (g: string) => newItems.includes(g)
    );
    updateFormData({
      geographyOfOperations: newGeographyOfOperations,
    });
    // Save to localStorage
    localStorage.setItem('sectorsServed', JSON.stringify(newGeographyOfOperations));
  };

  // === Edit modal state ===
  const [editingEntity, setEditingEntity] = useState<{
    level: "main" | "sub";
    key: string; // for 'sub' -> mainCategory name, for 'main' -> '__ALL__'
  } | null>(null);

  // childEntity is the modal opened when Next → is clicked from parent modal.
  const [childEntity, setChildEntity] = useState<{
    level: "sub" | "subsub" | "deep";
    key: string; // parent key whose children we edit
    parentModalWas: "main" | "sub" | "deep" | null;
  } | null>(null);

  // computed modal items for editingEntity
  const modalItems = useMemo(() => {
    if (!editingEntity) return [];
    if (editingEntity.level === "main") return mainCategories;
    return subcategories[editingEntity.key] || [];
  }, [editingEntity, mainCategories, subcategories]);

  // computed items for child modal
  const childModalItems = useMemo(() => {
    if (!childEntity) return [];
    if (childEntity.level === "sub")
      return subcategories[childEntity.key] || [];
    if (childEntity.level === "subsub")
      return subSubcategories[childEntity.key] || [];
    return extraChildren[childEntity.key] || [];
  }, [childEntity, subcategories, subSubcategories, extraChildren]);

  // helper to derive color accents (unchanged)
  const getCategoryColor = (category: string) => {
    if (category.toLowerCase().includes("drone")) {
      return {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-900",
        selected: "bg-blue-100 border-blue-500 text-blue-900",
        completed: "bg-green-100 border-green-500 text-green-900",
      } as const;
    } else if (
      category.toLowerCase().includes("ai") ||
      category.toLowerCase().includes("ml") ||
      category.toLowerCase().includes("computer vision") ||
      category.toLowerCase().includes("nlp") ||
      category.toLowerCase().includes("natural language") ||
      category.toLowerCase().includes("machine learning")
    ) {
      return {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-900",
        selected: "bg-purple-100 border-purple-500 text-purple-900",
        completed: "bg-green-100 border-green-500 text-green-900",
      } as const;
    }
    return {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-900",
      selected: "bg-green-100 border-green-500 text-green-900",
      completed: "bg-green-100 border-green-500 text-green-900",
    } as const;
  };

  const getCategoryStatus = (category: string) => {
    const isSelected = selectedMainCategories.includes(category);
    const isExpanded = expandedMainCategory === category;
    if (!isSelected) return "unselected" as const;
    const hasSubcategories = (selectedSubcategories[category] || []).length > 0;
    return hasSubcategories
      ? "completed"
      : isExpanded
        ? "expanded"
        : "incomplete";
  };

  const getSubCategoryStatus = (mainCategory: string, subCategory: string) => {
    const isSelected = (selectedSubcategories[mainCategory] || []).includes(
      subCategory
    );
    const isExpanded = expandedSubcategory === subCategory;
    if (!isSelected) return "unselected" as const;
    const hasSubSubcategories =
      (selectedSubSubcategories[subCategory] || []).length > 0;
    return hasSubSubcategories
      ? "completed"
      : isExpanded
        ? "expanded"
        : "incomplete";
  };

  // toggles (UPDATED to allow deselect on click)
  const handleMainCategoryToggle = (category: string) => {
    const isSelected = selectedMainCategories.includes(category);
    const isExpanded = expandedMainCategory === category;

    let newSelectedMainCategories;
    if (isSelected && isExpanded) {
      // clicking again on expanded selected -> deselect and collapse
      newSelectedMainCategories = selectedMainCategories.filter((c) => c !== category);
      setSelectedMainCategories(newSelectedMainCategories);
      setExpandedMainCategory("");
      setExpandedSubcategory("");
    } else {
      // select (if not yet) and expand
      newSelectedMainCategories = selectedMainCategories.includes(category)
        ? selectedMainCategories
        : [...selectedMainCategories, category];
      setSelectedMainCategories(newSelectedMainCategories);
      setExpandedMainCategory(category);
      setExpandedSubcategory("");
    }

    // Save to localStorage
    localStorage.setItem('selectedBusinessMainCategories', JSON.stringify(newSelectedMainCategories));
  };

  const handleSubCategoryToggle = (
    mainCategory: string,
    subCategory: string
  ) => {
    const current = selectedSubcategories[mainCategory] || [];
    const isSelected = current.includes(subCategory);
    const isExpanded = expandedSubcategory === subCategory;

    let newSelectedSubcategories;
    if (isSelected && isExpanded) {
      // deselect and collapse
      newSelectedSubcategories = {
        ...selectedSubcategories,
        [mainCategory]: selectedSubcategories[mainCategory].filter((s) => s !== subCategory),
      };
      setSelectedSubcategories(newSelectedSubcategories);
      setExpandedSubcategory("");
      // also clear deep UI states tied to this branch
      setExpandedDeepParent("");
    } else {
      // ensure selected & expand it
      newSelectedSubcategories = {
        ...selectedSubcategories,
        [mainCategory]: selectedSubcategories[mainCategory]?.includes(subCategory)
          ? selectedSubcategories[mainCategory]
          : [...(selectedSubcategories[mainCategory] || []), subCategory],
      };
      setSelectedSubcategories(newSelectedSubcategories);
      setExpandedSubcategory(subCategory);
    }

    // Save to localStorage
    localStorage.setItem('selectedBusinessSubcategories', JSON.stringify(newSelectedSubcategories));
  };


  // ====== Infinite levels (beyond sub-sub) ======

  // Deep selection toggle under a given parent (works for any depth)
  const toggleDeepItem = (parentKey: string, item: string) => {
    setSelectedDeep((prev) => {
      const cur = prev[parentKey] || [];
      const next = cur.includes(item)
        ? cur.filter((x) => x !== item)
        : [...cur, item];
      const newSelectedDeep = { ...prev, [parentKey]: next };

      // Save to localStorage
      localStorage.setItem('selectedBusinessDeep', JSON.stringify(newSelectedDeep));

      return newSelectedDeep;
    });
  };


  const handleLiveDeepChange = (parentKey: string, newItems: string[]) => {
    const newExtraChildren = { ...extraChildren, [parentKey]: newItems };

    // Ensure every new child has an entry
    newItems.forEach((item) => {
      if (!(item in newExtraChildren)) {
        newExtraChildren[item] = [];
      }
    });

    setExtraChildren(newExtraChildren);
    // Save to localStorage
    localStorage.setItem('businessExtraChildren', JSON.stringify(newExtraChildren));

    const newSelectedDeep = {
      ...selectedDeep,
      [parentKey]: (selectedDeep[parentKey] || []).filter((s) => newItems.includes(s)),
    };
    setSelectedDeep(newSelectedDeep);
    // Save to localStorage
    localStorage.setItem('selectedBusinessDeep', JSON.stringify(newSelectedDeep));

    if (newItems.length > 0) {
      // Expand parent itself
      setExpandedDeepParent(parentKey);

      // 🔥 Also auto-expand the *last added child*
      const lastItem = newItems[newItems.length - 1];
      if (lastItem) {
        setExpandedDeepParent(lastItem);
      }
    }
  };


  // === NEW: open hierarchy viewer for a sub-sub item
  const openHierarchyForSubSub = (subSub: string, parentSub: string) => {
    // make sure the deep map has an entry for this root (so DeepBranch can render)
    setExtraChildren((prev) =>
      subSub in prev ? prev : { ...prev, [subSub]: [] }
    );
    setHierarchyModal({ root: subSub, parentSub });
    // expand this root by default inside the shared deep UI
    setExpandedDeepParent(subSub);
  };

  // OPEN modals (existing)
  const openEditMain = () =>
    setEditingEntity({ level: "main", key: "__ALL__" });


  // Open child modal used by modal Next → or header edits
  const openChildModal = (
    level: "sub" | "subsub" | "deep",
    key: string,
    parentModalWas: "main" | "sub" | "deep" | null = null
  ) => {
    setChildEntity({ level, key, parentModalWas });
  };

  // Live-change handlers for immediate updates while modal is open
  const handleLiveMainChange = (newItems: string[]) => {
    setMainCategories(newItems);
    // Save to localStorage
    localStorage.setItem('businessMainCategories', JSON.stringify(newItems));

    const newSelectedMainCategories = newItems.filter((c) =>
      selectedMainCategories.includes(c)
    );
    setSelectedMainCategories(newSelectedMainCategories);
    // Save to localStorage
    localStorage.setItem('selectedBusinessMainCategories', JSON.stringify(newSelectedMainCategories));

    const newSelectedSubcategories: Record<string, string[]> = {};
    newItems.forEach((c) => {
      if (selectedSubcategories[c]) newSelectedSubcategories[c] = selectedSubcategories[c];
    });
    setSelectedSubcategories(newSelectedSubcategories);
    // Save to localStorage
    localStorage.setItem('selectedBusinessSubcategories', JSON.stringify(newSelectedSubcategories));

    setExpandedMainCategory((prev) =>
      prev && newItems.includes(prev) ? prev : ""
    );
  };

  const handleLiveSubChange = (mainKey: string, newItems: string[]) => {
    const newSubcategories = { ...subcategories, [mainKey]: newItems };
    setSubcategories(newSubcategories);
    // Save to localStorage
    localStorage.setItem('businessSubcategories', JSON.stringify(newSubcategories));

    const newSelectedSubcategories = {
      ...selectedSubcategories,
      [mainKey]: (selectedSubcategories[mainKey] || []).filter((s) => newItems.includes(s)),
    };
    setSelectedSubcategories(newSelectedSubcategories);
    // Save to localStorage
    localStorage.setItem('selectedBusinessSubcategories', JSON.stringify(newSelectedSubcategories));

    setExpandedSubcategory((prev) =>
      prev && newItems.includes(prev) ? prev : ""
    );
  };

  const handleLiveSubSubChange = (subKey: string, newItems: string[]) => {
    const newSubSubcategories = { ...subSubcategories, [subKey]: newItems };
    setSubSubcategories(newSubSubcategories);
    // Save to localStorage
    localStorage.setItem('businessSubSubcategories', JSON.stringify(newSubSubcategories));

    const newSelectedSubSubcategories = {
      ...selectedSubSubcategories,
      [subKey]: (selectedSubSubcategories[subKey] || []).filter((s) => newItems.includes(s)),
    };
    setSelectedSubSubcategories(newSelectedSubSubcategories);
    // Save to localStorage
    localStorage.setItem('selectedBusinessSubSubcategories', JSON.stringify(newSelectedSubSubcategories));
  };

  const DeepBranch: React.FC<{ parent: string; level?: number; forceExpand?: boolean }> = ({
    parent,
    level = 1,
    forceExpand = false,
  }) => {
    const children = extraChildren[parent] || [];
    if (children.length === 0) return null;

    // Prevent runaway recursion
    if (level > 10) {
      return (
        <div className="ml-6 text-xs text-red-500">
          (Max depth reached – possible circular reference)
        </div>
      );
    }

    return (
      <div className={`relative ${level > 1 ? 'mt-1' : ''}`}>
        {/* Vertical connector line for all levels except root */}
        {level > 1 && (
          <div
            className="absolute top-0 left-2 w-px h-full -translate-x-1/2 bg-slate-300"
            style={{ height: 'calc(100% - 0.5rem)' }}
          />
        )}

        <div className="flex flex-col">
          {children.map((child, index) => {
            const isChecked = (selectedDeep[parent] || []).includes(child);
            const hasGrand = (extraChildren[child] || []).length > 0;
            const isExpanded = forceExpand || expandedDeepParent === child;
            const isLast = index === children.length - 1;

            return (
              <div key={`${parent}::${child}`} className="flex relative flex-col">
                {/* Horizontal connector line */}
                <div className="absolute left-2 top-3 w-2 h-px -translate-x-1/2 bg-slate-300" />

                <div className="flex gap-2 items-start pl-4">
                  {/* Tree node connector */}
                  <div className="relative flex-shrink-0 mt-2.5">
                    {/* Vertical line continuation for non-last items */}
                    {!isLast && (
                      <div className="absolute top-3 left-1/2 w-px h-6 -translate-x-1/2 bg-slate-300" />
                    )}

                    {/* Circular node indicator */}
                    <div className="relative z-10 w-2 h-2 rounded-full border bg-slate-400 border-slate-600" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-2 items-center">
                      {/* Checkbox */}
                      <label
                        className={`inline-flex items-center px-2 py-1 rounded border cursor-pointer transition-all hover:shadow-sm ${isChecked
                          ? "text-green-800 bg-green-50 border-green-300"
                          : "bg-white hover:bg-slate-50 border-slate-300"
                          }`}
                        onClick={(e) => {
                          if (e.target === e.currentTarget) {
                            toggleDeepItem(parent, child);
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleDeepItem(parent, child)}
                          className="sr-only"
                        />
                        <div
                          className={`w-3 h-3 rounded border mr-1.5 flex items-center justify-center ${isChecked ? "border-green-500 bg-green-500" : "border-slate-400"
                            }`}
                        >
                          {isChecked && (
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="text-xs text-slate-700">{child}</span>
                      </label>


                    </div>

                    {/* Recursion */}
                    {isExpanded && (
                      <div className="mt-1">
                        <DeepBranch parent={child} level={level + 1} forceExpand={forceExpand} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // === NEW: Hierarchy modal for a sub-sub item ===
  // === UPDATED: Hierarchy modal for a sub-sub item (no auto-save on typing) ===
  const HierarchyModal: React.FC<{
    root: string;
    parentSub: string;
    onClose: () => void;
  }> = ({ root, parentSub, onClose }) => {
    const isSelected = (selectedSubSubcategories[parentSub] || []).includes(root);

    const toggleRootSelection = () => {
      setSelectedSubSubcategories((prev) => {
        const cur = prev[parentSub] || [];
        return cur.includes(root)
          ? { ...prev, [parentSub]: cur.filter((x) => x !== root) }
          : { ...prev, [parentSub]: [...cur, root] };
      });
    };

    const [editingDeep, setEditingDeep] = useState(false);

    return (
      <div className="flex fixed inset-0 z-50 justify-center items-center bg-black/50">
        <div className="bg-white w-[720px] max-w-[95vw] rounded-2xl shadow-xl p-5">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-lg font-semibold">Hierarchy: “{root}”</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Path: <span className="font-mono">{parentSub} → {root}</span>
              </p>
            </div>
            <button
              className="inline-flex justify-center items-center w-8 h-8 rounded-lg border hover:bg-slate-50"
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="p-3 mb-3 text-xs rounded-lg border bg-slate-50 text-slate-600">
            <ul className="space-y-1 list-disc list-inside">
              <li>Select the root option and/or its deeper details below.</li>
              <li>
                Use <strong>Edit details</strong> to add/rename/remove deeper items,
                then click <strong>Save</strong> to apply changes.
              </li>
            </ul>
          </div>

          {!editingDeep ? (
            <>
              {/* Root selector */}
              <div className="mb-3">
                <label
                  className={`inline-flex items-center px-3 py-2 rounded border cursor-pointer transition-all hover:shadow-sm ${isSelected ? "text-green-800 bg-green-50 border-green-300" : "bg-white hover:bg-slate-50 border-slate-300"
                    }`}
                  onClick={toggleRootSelection}
                  title={isSelected ? "Click to deselect" : "Click to select"}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isSelected}
                    onChange={toggleRootSelection}
                  />
                  <div
                    className={`w-4 h-4 rounded border mr-2 flex items-center justify-center ${isSelected ? "bg-green-500 border-green-500" : "border-slate-400"
                      }`}
                  >
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm">{root}</span>
                </label>
              </div>

              {/* Deep children under this root */}
              <div className="p-3 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-semibold text-slate-800">
                    {root} — deeper details
                  </h4>

                  {/* Enter edit mode (opens the EditModal inside this modal) */}
                  <button
                    onClick={() => setEditingDeep(true)}
                    className="inline-flex gap-1 items-center px-2 py-1 text-xs rounded-lg border hover:bg-white"
                  >
                    ✏️ Edit & Save
                  </button>
                </div>

                <div className="max-h-[50vh] overflow-auto pr-1">
                  {/* show the live tree for reference — NOT editable until you click Edit */}
                  <DeepBranch parent={root} level={1} forceExpand />
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-4">
                <button className="px-3 py-1.5 rounded-lg border" onClick={onClose}>
                  Close
                </button>
              </div>
            </>
          ) : (
            // EDIT MODE: show the EditModal. IMPORTANT: do NOT pass onLiveChange here
            <EditModal
              title={`Edit deeper details for "${root}"`}
              items={extraChildren[root] || []}
              onClose={() => setEditingDeep(false)}
              onSave={(newItems) => {
                handleLiveDeepChange(root, newItems);
                // 🔥 make sure the root expands so its children are visible
                if (newItems.length > 0) {
                  setExpandedDeepParent(root);
                }
                setEditingDeep(false);
              }}
              onOpenChild={(selected) => openChildModal("deep", selected, "deep")}
              childLevelLabel="deeper details"
              showBack={false}
            />

          )}
        </div>
      </div>
    );
  };

  /* ---------------- UI render ---------------- */
  return (
    <FormStep
      title="Business Categories & Coverage"
      description="Select your main business categories and specific areas of operation"
      onNext={onNext}
      onPrev={onPrev}
      isValid={isValid}
      currentStep={3}
      totalSteps={7}
    >
      <div className="space-y-6">
        {/* Main Business Categories */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Main Business Categories
              </h3>
              <p className="text-sm text-slate-600">
                Select your primary business categories (multiple selection
                allowed)
              </p>
            </div>

            <button
              onClick={openEditMain}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border hover:bg-slate-50"
              title="Edit main categories and jump to subcategories via Next →"
            >
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-start">
              {mainCategories.map((category) => {
                const colors = getCategoryColor(category);
                const status = getCategoryStatus(category);
                const isSelected = selectedMainCategories.includes(category);
                const isExpanded = expandedMainCategory === category;

                let categoryStyle = "";
                let textStyle = "";
                let showCheckbox = false;

                if (status === "completed") {
                  if (isExpanded) {
                    categoryStyle =
                      "bg-blue-100 border-blue-500 shadow-sm ring-2 ring-blue-300";
                    textStyle = "text-blue-800";
                  } else {
                    categoryStyle = "bg-green-100 border-green-500 shadow-sm";
                    textStyle = "text-green-800";
                  }
                  showCheckbox = true;
                } else if (status === "expanded") {
                  categoryStyle =
                    "bg-blue-100 border-blue-500 shadow-sm ring-2 ring-blue-300";
                  textStyle = "text-blue-800";
                } else if (isSelected) {
                  categoryStyle = "bg-yellow-100 border-yellow-500 shadow-sm";
                  textStyle = "text-yellow-800";
                } else {
                  categoryStyle =
                    "bg-white border-slate-200 hover:border-slate-300";
                  textStyle = "text-slate-700";
                }

                return (
                  <div
                    key={category}
                    className="inline-flex items-center mr-1 mb-1"
                  >
                    <button
                      onClick={() => handleMainCategoryToggle(category)}
                      className={`inline-block px-2 py-1 text-left whitespace-nowrap rounded border-2 transition-all hover:shadow-sm ${categoryStyle}`}
                      title={
                        isSelected && isExpanded
                          ? "Click to deselect & collapse"
                          : "Click to select & expand"
                      }
                    >
                      <div className="flex items-start">
                        {showCheckbox && (
                          <div className="w-2.5 h-2.5 rounded border border-green-500 bg-green-500 flex items-center justify-center mr-1 mt-0.5 flex-shrink-0">
                            <svg
                              className="w-1.5 h-1.5 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                        <div
                          className={`text-xs font-medium leading-none ${textStyle}`}
                        >
                          {category}
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Subcategories for expanded main */}
            {expandedMainCategory && (
              <div
                className={`rounded-lg border p-4 ${getCategoryColor(expandedMainCategory).bg
                  } ${getCategoryColor(expandedMainCategory).border}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4
                    className={`font-semibold text-sm ${getCategoryColor(expandedMainCategory).text
                      }`}
                  >
                    {expandedMainCategory} - Subcategories
                  </h4>

                  <button
                    onClick={() =>
                      openChildModal("sub", expandedMainCategory, "main")
                    }
                    className="inline-flex gap-1 items-center px-2 py-1 text-xs rounded-lg border hover:bg-white"
                    title="Edit subcategories for this main category"
                  >
                    ✏️ Edit list
                  </button>
                </div>

                <div className="flex flex-wrap items-start mb-3">
                  {(subcategories[expandedMainCategory] || []).map(
                    (subCategory) => {
                      const subStatus = getSubCategoryStatus(
                        expandedMainCategory,
                        subCategory
                      );
                      const isSubSelected = (
                        selectedSubcategories[expandedMainCategory] || []
                      ).includes(subCategory);
                      const isSubExpanded = expandedSubcategory === subCategory;

                      let subCategoryStyle = "";
                      let subTextStyle = "";
                      let showSubCheckbox = false;

                      if (subStatus === "completed") {
                        if (isSubExpanded) {
                          subCategoryStyle =
                            "bg-blue-100 border-blue-500 shadow-sm ring-2 ring-blue-300";
                          subTextStyle = "text-blue-800";
                        } else {
                          subCategoryStyle =
                            "bg-green-100 border-green-500 shadow-sm";
                          subTextStyle = "text-green-800";
                        }
                        showSubCheckbox = true;
                      } else if (subStatus === "expanded") {
                        subCategoryStyle =
                          "bg-blue-100 border-blue-500 shadow-sm ring-2 ring-blue-300";
                        subTextStyle = "text-blue-800";
                      } else if (isSubSelected) {
                        subCategoryStyle =
                          "bg-orange-100 border-orange-500 shadow-sm";
                        subTextStyle = "text-orange-800";
                      } else {
                        subCategoryStyle =
                          "bg-white hover:bg-slate-50 border border-slate-200";
                        subTextStyle = "text-slate-700";
                      }

                      return (
                        <div
                          key={subCategory}
                          className="inline-flex items-center mr-1 mb-1"
                        >
                          <button
                            onClick={() =>
                              handleSubCategoryToggle(
                                expandedMainCategory,
                                subCategory
                              )
                            }
                            className={`inline-block px-2 py-1 text-left whitespace-nowrap rounded border transition-all hover:shadow-sm ${subCategoryStyle}`}
                            title={
                              isSubSelected && isSubExpanded
                                ? "Click to deselect & collapse"
                                : "Click to select & expand"
                            }
                          >
                            <div className="flex items-start">
                              {showSubCheckbox && (
                                <div className="w-2 h-2 rounded border border-green-500 bg-green-500 flex items-center justify-center mr-1 mt-0.5 flex-shrink-0">
                                  <svg
                                    className="w-1 h-1 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              )}
                              <div
                                className={`text-xs font-medium leading-none ${subTextStyle}`}
                              >
                                {subCategory}
                              </div>
                            </div>
                          </button>
                        </div>
                      );
                    }
                  )}
                </div>

                {/* Sub-subcategories shown inline when a subcategory is expanded (checkbox list) */}
                {expandedSubcategory &&
                  (subSubcategories[expandedSubcategory] || []).length > 0 && (
                    <div className="p-3 mb-2 bg-white rounded-md border border-slate-200">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-xs font-medium text-slate-800">
                          {expandedSubcategory} - Details
                        </h5>

                        {/* SUB-SUB SECTION editor */}
                        <button
                          onClick={() =>
                            openChildModal("subsub", expandedSubcategory, "sub")
                          }
                          className="inline-flex gap-1 items-center px-2 py-1 text-xs rounded-lg border border-slate-300 hover:bg-slate-50"
                        >
                          ✏️ Edit details
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1 items-start">
                        {(subSubcategories[expandedSubcategory] || []).map(
                          (subSub) => {
                            const isChecked = (
                              selectedSubSubcategories[expandedSubcategory] ||
                              []
                            ).includes(subSub);
                            const hasDeepChildren =
                              (extraChildren[subSub] || []).length > 0;
                            const isDeepExpanded =
                              expandedDeepParent === subSub;

                            return (
                              <div key={subSub} className="flex flex-col">
                                <div className="flex items-center">
                                  <label
                                    className={`inline-flex items-center px-2 py-1 rounded border cursor-pointer transition-all hover:shadow-sm ${isChecked
                                      ? "text-green-800 bg-green-50 border-green-300"
                                      : "bg-white hover:bg-slate-50 border-slate-300"
                                      }`}
                                    title="Click to view hierarchy & select"
                                    onClick={() =>
                                      openHierarchyForSubSub(
                                        subSub,
                                        expandedSubcategory
                                      )
                                    }
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() =>
                                        openHierarchyForSubSub(
                                          subSub,
                                          expandedSubcategory
                                        )
                                      }
                                      className="sr-only"
                                    />
                                    <div
                                      className={`w-3 h-3 rounded border mr-1.5 flex items-center justify-center ${isChecked
                                        ? "border-green-500 bg-green-500"
                                        : "border-slate-400"
                                        }`}
                                    >
                                      {isChecked && (
                                        <svg
                                          className="w-2 h-2 text-white"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      )}
                                    </div>
                                    <span className="text-xs text-slate-700">
                                      {subSub}
                                    </span>
                                  </label>


                                </div>

                                {/* Recursive deep branch under this sub-sub */}
                                {isDeepExpanded && (
                                  <div className="mt-2">
                                    <DeepBranch parent={subSub} level={1} />
                                  </div>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}

                {/* Other input for current category */}
                <div className="mt-2">
                  <FormInput
                    label={`Other ${expandedMainCategory} (comma-separated)`}
                    value={formData.otherMainCategories || ""}
                    onChange={(value) => {
                      updateFormData({ otherMainCategories: value });
                      // Save to localStorage
                      const formDataToSave = {
                        otherMainCategories: value,
                        coverageType: formData.coverageType,
                        geographyOfOperations: formData.geographyOfOperations,
                      };
                      localStorage.setItem('businessFormData', JSON.stringify(formDataToSave));
                    }}
                    placeholder="Enter other categories..."
                  />

                  {formData.otherMainCategories &&
                    formData.otherMainCategories.trim() && (
                      <div className="mt-2">
                        <h5 className="mb-2 text-xs font-semibold text-slate-700">
                          Added Items:
                        </h5>
                        <div className="flex flex-wrap">
                          {formData.otherMainCategories
                            .split(",")
                            .map((raw, idx) => {
                              const item = raw.trim();
                              if (!item) return null;
                              return (
                                <span
                                  key={`${item}-${idx}`}
                                  className="inline-block px-2 py-0.5 mr-1 mb-1 bg-blue-100 text-blue-800 rounded border border-blue-200 text-xs font-medium"
                                >
                                  {item}
                                </span>
                              );
                            })}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Geography of Operations */}
        <div className="p-3 rounded-lg bg-slate-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-bold text-slate-900">
              Geography of Operations
            </h3>
            <button
              className="inline-flex gap-1 items-center px-2 py-1 text-xs rounded-lg border hover:bg-white"
              onClick={() => setEditingGeography(true)}
              title="Edit coverage options"
            >
              ✏️ Edit coverage list
            </button>
          </div>

          <MultiSelect
            label="Select your operational coverage areas"
            options={geographyOptions}
            selected={formData.geographyOfOperations}
            onChange={(selected) => {
              updateFormData({ geographyOfOperations: selected });
              // Save to localStorage
              localStorage.setItem('sectorsServed', JSON.stringify(selected));
            }}
          />

          {editingGeography && (
            <EditModal
              title="Edit coverage options"
              items={geographyOptions}
              onClose={() => setEditingGeography(false)}
              onSave={(newItems) => {
                setGeographyOptions(newItems);
                updateFormData({
                  geographyOfOperations: (
                    formData.geographyOfOperations || []
                  ).filter((g: string) => newItems.includes(g)),
                });
                setEditingGeography(false);
              }}
              onLiveChange={handleLiveGeographyChange}
            />
          )}

          <div className="mt-3">
            <FormInput
              label="Coverage Type Details"
              value={formData.coverageType || ""}
              onChange={(value) => {
                updateFormData({ coverageType: value });
                // Save to localStorage
                const formDataToSave = {
                  otherMainCategories: formData.otherMainCategories,
                  coverageType: value,
                  geographyOfOperations: formData.geographyOfOperations,
                };
                localStorage.setItem('businessFormData', JSON.stringify(formDataToSave));
              }}
              placeholder="Describe your service coverage area in detail..."
              type="textarea"
              rows={2}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="p-3 rounded-lg bg-slate-100">
          <h4 className="mb-2 text-sm font-semibold text-slate-800">
            Selection Summary
          </h4>
          <div className="space-y-1 text-sm text-slate-600">
            <p>
              <strong>Selected Main Categories:</strong>{" "}
              {selectedMainCategories.length}
            </p>
            <p>
              <strong>Total Subcategories:</strong>{" "}
              {Object.values(selectedSubcategories).flat().length}
            </p>
            <p>
              <strong>Total Sub-subcategories:</strong>{" "}
              {Object.values(selectedSubSubcategories).flat().length}
            </p>
            <p>
              <strong>Deep Levels Selected:</strong>{" "}
              {Object.values(selectedDeep).reduce((a, b) => a + b.length, 0)}
            </p>
            <p>
              <strong>Geographic Coverage:</strong>{" "}
              {formData.geographyOfOperations.length} areas selected
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-300">
            <h5 className="mb-2 text-sm font-semibold text-slate-700">
              Status Legend:
            </h5>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center">
                <div className="flex justify-center items-center mr-2 w-3 h-3 bg-green-100 rounded border border-green-500">
                  <svg
                    className="w-2 h-2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-xs">Complete</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 w-3 h-3 bg-yellow-100 rounded border border-yellow-500"></div>
                <span className="text-xs">Selected</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 w-3 h-3 bg-blue-100 rounded border border-blue-500"></div>
                <span className="text-xs">Expanded</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 w-3 h-3 bg-white rounded border border-slate-300"></div>
                <span className="text-xs">Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editing main or sub list modal (single entry point) */}
      {editingEntity && (
        <EditModal
          title={
            editingEntity.level === "main"
              ? "Edit main categories"
              : `Edit subcategories for "${editingEntity.key}"`
          }
          items={modalItems}
          onClose={() => setEditingEntity(null)}
          onSave={(newItems) => {
            if (editingEntity.level === "main") {
              setMainCategories(newItems);
              setSelectedMainCategories((prev) =>
                prev.filter((c) => newItems.includes(c))
              );
              setSelectedSubcategories((prev) => {
                const next: Record<string, string[]> = {};
                newItems.forEach((c) => {
                  if (prev[c]) next[c] = prev[c];
                });
                return next;
              });
              setExpandedMainCategory((prev) =>
                prev && newItems.includes(prev) ? prev : ""
              );
            } else {
              setSubcategories((prev) => ({
                ...prev,
                [editingEntity.key]: newItems,
              }));
              setSelectedSubcategories((prev) => ({
                ...prev,
                [editingEntity.key]: (prev[editingEntity.key] || []).filter(
                  (s) => newItems.includes(s)
                ),
              }));
              setExpandedSubcategory((prev) =>
                prev && newItems.includes(prev) ? prev : ""
              );
            }
            setEditingEntity(null);
          }}
          onLiveChange={
            editingEntity.level === "main"
              ? (newItems) => handleLiveMainChange(newItems)
              : (newItems) => handleLiveSubChange(editingEntity.key, newItems)
          }
          onOpenChild={
            editingEntity.level === "main"
              ? (selected) => {
                openChildModal("sub", selected, "main");
                setEditingEntity(null);
              }
              : (selected) => {
                // from sub modal, go to sub-sub modal for the selected sub
                openChildModal("subsub", selected, "sub");
                setEditingEntity(null);
              }
          }
          childLevelLabel={
            editingEntity.level === "main" ? "subcategories" : "details"
          }
        />
      )}
      {/* NEW: Sub-sub hierarchy modal */}
      {hierarchyModal && (
        <HierarchyModal
          root={hierarchyModal.root}
          parentSub={hierarchyModal.parentSub}
          onClose={() => setHierarchyModal(null)}
        />
      )}

      {/* Child modal opened from Next → in parent modal or header edits */}
      {childEntity && (
        <EditModal
          title={
            childEntity.level === "sub"
              ? `Edit subcategories for "${childEntity.key}"`
              : childEntity.level === "subsub"
                ? `Edit details for "${childEntity.key}"`
                : `Edit deeper details for "${childEntity.key}"`
          }
          items={childModalItems}
          onClose={() => setChildEntity(null)}
          onSave={(newItems) => {
            if (childEntity.level === "sub") {
              setSubcategories((prev) => ({
                ...prev,
                [childEntity.key]: newItems,
              }));
              setSelectedSubcategories((prev) => ({
                ...prev,
                [childEntity.key]: (prev[childEntity.key] || []).filter((s) =>
                  newItems.includes(s)
                ),
              }));
            } else if (childEntity.level === "subsub") {
              setSubSubcategories((prev) => ({
                ...prev,
                [childEntity.key]: newItems,
              }));
              setSelectedSubSubcategories((prev) => ({
                ...prev,
                [childEntity.key]: (prev[childEntity.key] || []).filter((s) =>
                  newItems.includes(s)
                ),
              }));
            } else {
              // deep level (infinite)
              setExtraChildren((prev) => {
                const next = { ...prev, [childEntity.key]: newItems };
                // 👇 ensure each newly added deep node has its own (possibly empty) children array
                newItems.forEach((item) => {
                  if (!(item in next)) {
                    next[item] = [];
                  }
                });
                return next;
              });
              setSelectedDeep((prev) => ({
                ...prev,
                [childEntity.key]: (prev[childEntity.key] || []).filter((s) =>
                  newItems.includes(s)
                ),
              }));
            }

            setChildEntity(null);
          }}
          onLiveChange={
            childEntity.level === "sub"
              ? (newItems) => handleLiveSubChange(childEntity.key, newItems)
              : childEntity.level === "subsub"
                ? (newItems) => handleLiveSubSubChange(childEntity.key, newItems)
                : (newItems) => handleLiveDeepChange(childEntity.key, newItems)
          }
          onOpenChild={
            childEntity.level === "sub"
              ? (selected) => {
                // from sub -> go to subsub for selected sub
                setChildEntity(null);
                openChildModal("subsub", selected, "sub");
              }
              : (selected) => {
                // from subsub or deep -> go deeper
                setChildEntity(null);
                openChildModal("deep", selected, "deep");
              }
          }
          childLevelLabel={
            childEntity.level === "sub" ? "details" : "deeper details"
          }
          showBack={true}
          onBack={() => {
            if (!childEntity) return;
            if (childEntity.parentModalWas === "main") {
              setChildEntity(null);
              setEditingEntity({ level: "main", key: "__ALL__" });
            } else if (childEntity.parentModalWas === "sub") {
              // find the parent main that contains this sub
              const subKey = childEntity.key;
              const parentMain = Object.keys(subcategories).find((m) =>
                (subcategories[m] || []).includes(subKey)
              );
              setChildEntity(null);
              if (parentMain) {
                setEditingEntity({ level: "sub", key: parentMain });
              } else {
                setEditingEntity({ level: "main", key: "__ALL__" });
              }
            } else if (childEntity.parentModalWas === "deep") {
              // try to find a parent that points to this key in deep map
              const parentOfDeep = Object.keys(extraChildren).find((p) =>
                (extraChildren[p] || []).includes(childEntity.key)
              );
              setChildEntity(null);
              if (parentOfDeep) {
                openChildModal("deep", parentOfDeep, "deep");
              } else {
                // fallback to sub-sub if any
                const parentSubSub = Object.keys(subSubcategories).find((p) =>
                  (subSubcategories[p] || []).includes(childEntity!.key)
                );
                if (parentSubSub) {
                  openChildModal("subsub", parentSubSub, "sub");
                }
              }
            } else {
              setChildEntity(null);
            }
          }}
        />
      )}


    </FormStep>
  );
};

export default Step4BusinessCategories;
