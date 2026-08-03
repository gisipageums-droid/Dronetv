import React, { useState } from "react";
import { FormStep } from "../FormStep";
import { MultiSelect, FormInput } from "../FormInput";
import { StepProps } from "../../types/form";

const Step4BusinessCategories: React.FC<StepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  onSkip,
  showSkip,
  onStepClick,
  isValid,
  embedded,
}) => {
  const [selectedMainCategories, setSelectedMainCategories] = useState<
    string[]
  >(formData.mainCategories || []);
  const [selectedSubcategories, setSelectedSubcategories] = useState<{
    [key: string]: string[];
  }>(formData.subCategories || {});
  const [selectedSubSubcategories, setSelectedSubSubcategories] = useState<{
    [key: string]: string[];
  }>(formData.subSubCategories || {});

  const [expandedMainCategories, setExpandedMainCategories] = useState<Set<string>>(
    new Set(formData.mainCategories || [])
  );
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(
    new Set(Object.keys(formData.subCategories || {}))
  );

  React.useEffect(() => {
    if (formData.mainCategories !== selectedMainCategories) {
      updateFormData({ mainCategories: selectedMainCategories });
    }
  }, [selectedMainCategories, formData.mainCategories, updateFormData]);

  React.useEffect(() => {
    if (
      JSON.stringify(formData.subCategories) !==
      JSON.stringify(selectedSubcategories)
    ) {
      updateFormData({ subCategories: selectedSubcategories });
    }
  }, [selectedSubcategories, formData.subCategories, updateFormData]);

  React.useEffect(() => {
    if (
      JSON.stringify(formData.subSubCategories) !==
      JSON.stringify(selectedSubSubcategories)
    ) {
      updateFormData({ subSubCategories: selectedSubSubcategories });
    }
  }, [selectedSubSubcategories, formData.subSubCategories, updateFormData]);

  // Pull persisted formData back into local UI state when formData changes (e.g., after reload)
  React.useEffect(() => {
    // Sync main categories
    if (
      Array.isArray(formData.mainCategories) &&
      JSON.stringify(formData.mainCategories) !== JSON.stringify(selectedMainCategories)
    ) {
      setSelectedMainCategories(formData.mainCategories);
    }
  }, [formData.mainCategories]);

  React.useEffect(() => {
    // Sync subcategories
    if (
      formData.subCategories &&
      JSON.stringify(formData.subCategories) !== JSON.stringify(selectedSubcategories)
    ) {
      setSelectedSubcategories(formData.subCategories);
    }
  }, [formData.subCategories]);

  React.useEffect(() => {
    // Sync sub-subcategories
    if (
      formData.subSubCategories &&
      JSON.stringify(formData.subSubCategories) !== JSON.stringify(selectedSubSubcategories)
    ) {
      setSelectedSubSubcategories(formData.subSubCategories);
    }
  }, [formData.subSubCategories]);

  // Main business categories
  const mainCategories = [
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
  ];

  // Subcategories for each main category
  const subcategories = {
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
  };

  // Sub-subcategories for detailed classification
  const subSubcategories = {
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
  };

  const handleMainCategoryToggle = (category: string) => {
    const isCurrentlySelected = selectedMainCategories.includes(category);
    const isCurrentlyExpanded = expandedMainCategories.has(category);

    // Toggle expand/collapse independently
    setExpandedMainCategories(prev => {
      const next = new Set(prev);
      if (isCurrentlyExpanded) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });

    // Toggle selection
    if (isCurrentlySelected) {
      setSelectedMainCategories(prev => prev.filter(c => c !== category));
      setExpandedMainCategories(prev => { const n = new Set(prev); n.delete(category); return n; });
      setSelectedSubcategories(prev => {
        const newSubs = { ...prev };
        delete newSubs[category];
        return newSubs;
      });
      setSelectedSubSubcategories(prev => {
        const newSubSubs = { ...prev };
        if (subcategories[category]) {
          subcategories[category].forEach(subCat => { delete newSubSubs[subCat]; });
        }
        return newSubSubs;
      });
      setExpandedSubcategories(prev => {
        const next = new Set(prev);
        if (subcategories[category]) {
          subcategories[category].forEach(sub => next.delete(sub));
        }
        return next;
      });
    } else {
      setSelectedMainCategories(prev => [...prev, category]);
    }
  };

  const handleSubCategoryToggle = (
    mainCategory: string,
    subCategory: string
  ) => {
    const isCurrentlyExpanded = expandedSubcategories.has(subCategory);
    const isCurrentlySelected = selectedSubcategories[mainCategory]?.includes(subCategory);

    // Toggle expand/collapse independently
    setExpandedSubcategories(prev => {
      const next = new Set(prev);
      if (isCurrentlyExpanded) {
        next.delete(subCategory);
      } else {
        next.add(subCategory);
      }
      return next;
    });

    if (isCurrentlySelected) {
      setSelectedSubcategories(prev => {
        const currentSubs = prev[mainCategory] || [];
        const newSubs = currentSubs.filter(s => s !== subCategory);
        if (newSubs.length === 0) {
          const { [mainCategory]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [mainCategory]: newSubs };
      });
      setSelectedSubSubcategories(prev => {
        const newSubSubs = { ...prev };
        delete newSubSubs[subCategory];
        return newSubSubs;
      });
      setExpandedSubcategories(prev => { const n = new Set(prev); n.delete(subCategory); return n; });
    } else {
      setSelectedSubcategories(prev => {
        const currentSubs = prev[mainCategory] || [];
        return { ...prev, [mainCategory]: [...currentSubs, subCategory] };
      });
    }
  };

  const handleSubSubCategoryToggle = (
    subCategory: string,
    subSubCategory: string
  ) => {
    setSelectedSubSubcategories((prev) => {
      const currentSubSubs = prev[subCategory] || [];
      if (currentSubSubs.includes(subSubCategory)) {
        // Remove sub-subcategory
        const newSubSubs = currentSubSubs.filter((s) => s !== subSubCategory);
        if (newSubSubs.length === 0) {
          const { [subCategory]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [subCategory]: newSubSubs };
      } else {
        // Add sub-subcategory
        return { ...prev, [subCategory]: [...currentSubSubs, subSubCategory] };
      }
    });
  };

  const getCategoryColor = (category: string) => {
    if (category.toLowerCase().includes("drone")) {
      return {
        bg: "bg-status-info/10",
        border: "border-status-info/25",
        text: "text-status-info",
        button: "bg-status-info/15 hover:bg-status-info/25 text-status-info",
        tag: "bg-status-info/15 text-status-info border-status-info/25",
        selected: "bg-status-info/15 border-status-info text-status-info",
        completed: "bg-status-success/15 border-status-success text-status-success",
        incomplete: "bg-status-error/15 border-status-error text-status-error",
      };
    } else if (
      category.toLowerCase().includes("ai") ||
      category.toLowerCase().includes("ml") ||
      category.toLowerCase().includes("computer vision") ||
      category.toLowerCase().includes("nlp") ||
      category.toLowerCase().includes("natural language") ||
      category.toLowerCase().includes("machine learning")
    ) {
      return {
        bg: "bg-brand-gold/10",
        border: "border-brand-gold/25",
        text: "text-brand-gold",
        button: "bg-brand-gold/15 hover:bg-brand-gold/25 text-brand-gold",
        tag: "bg-brand-gold/15 text-brand-gold border-brand-gold/25",
        selected: "bg-brand-gold/15 border-brand-gold text-brand-gold",
        completed: "bg-status-success/15 border-status-success text-status-success",
        incomplete: "bg-status-error/15 border-status-error text-status-error",
      };
    } else {
      return {
        bg: "bg-status-success/10",
        border: "border-status-success/25",
        text: "text-status-success",
        button: "bg-status-success/15 hover:bg-status-success/25 text-status-success",
        tag: "bg-status-success/15 text-status-success border-status-success/25",
        selected: "bg-status-success/15 border-status-success text-status-success",
        completed: "bg-status-success/15 border-status-success text-status-success",
        incomplete: "bg-status-error/15 border-status-error text-status-error",
      };
    }
  };

  const getCategoryStatus = (category: string) => {
    const isSelected = selectedMainCategories.includes(category);
    const isExpanded = expandedMainCategories.has(category);
    if (!isSelected) return "unselected";

    const hasSubcategories =
      selectedSubcategories[category] &&
      selectedSubcategories[category].length > 0;
    return hasSubcategories
      ? "completed"
      : isExpanded
      ? "expanded"
      : "incomplete";
  };

  const getSubCategoryStatus = (mainCategory: string, subCategory: string) => {
    const isSelected =
      selectedSubcategories[mainCategory]?.includes(subCategory);
    const isExpanded = expandedSubcategories.has(subCategory);
    if (!isSelected) return "unselected";

    const hasSubSubcategories =
      selectedSubSubcategories[subCategory] &&
      selectedSubSubcategories[subCategory].length > 0;
    return hasSubSubcategories
      ? "completed"
      : isExpanded
      ? "expanded"
      : "incomplete";
  };

  return (
    <FormStep
      title="Business Categories & Coverage"
      description="Select your main business categories and specific areas of operation"
      onNext={onNext}
      onPrev={onPrev}
      onSkip={onSkip}
      showSkip={showSkip}
      onStepClick={onStepClick}
      isValid={isValid}
      currentStep={2}
      totalSteps={5}
      embedded={embedded}
    >
      <div className="space-y-6">
        {/* Main Business Categories */}
        <div>
          <h3 className="text-lg font-bold text-ink mb-4">
            Main Business Categories
          </h3>
          <p className="text-sm text-ink-paragraph mb-4">
            Select your primary business categories (multiple selection allowed)
          </p>

          {/* Multi-row grid layout */}
          <div className="space-y-3">
            {/* Render categories in chunks of 4 with subcategories after each row */}
            {/* Single flowing layout */}
            <div className="space-y-2">
              {/* All categories in one flowing container */}
              <div className="flex flex-wrap items-start">
                {mainCategories.map((category) => {
                  const colors = getCategoryColor(category);
                  const status = getCategoryStatus(category);
                  const isSelected = selectedMainCategories.includes(category);
                  const isExpanded = expandedMainCategories.has(category);

                  let categoryStyle = "";
                  let textStyle = "";
                  let showCheckbox = false;

                  if (status === "completed") {
                    if (isExpanded) {
                      categoryStyle =
                        "bg-status-info/15 border-status-info shadow-sm ring-2 ring-status-info/40";
                      textStyle = "text-status-info";
                    } else {
                      categoryStyle = "bg-status-success/15 border-status-success shadow-sm";
                      textStyle = "text-status-success";
                    }
                    showCheckbox = true;
                  } else if (status === "expanded") {
                    categoryStyle =
                      "bg-status-info/15 border-status-info shadow-sm ring-2 ring-status-info/40";
                    textStyle = "text-status-info";
                  } else if (isSelected) {
                    categoryStyle = "bg-brand-yellow-soft border-brand-gold shadow-sm";
                    textStyle = "text-brand-gold";
                  } else {
                    categoryStyle =
                      "bg-surface-card border-ink-light hover:border-ink-light";
                    textStyle = "text-ink-paragraph";
                  }

                  return (
                    <button
                      key={category}
                      onClick={() => handleMainCategoryToggle(category)}
                      className={`inline-block px-2 py-1 mr-1 mb-1 rounded border-2 text-left transition-all hover:shadow-sm whitespace-nowrap ${categoryStyle}`}
                    >
                      <div className="flex items-start">
                        {showCheckbox && (
                          <div className="w-2.5 h-2.5 rounded border border-status-success bg-status-success flex items-center justify-center mr-1 mt-0.5 flex-shrink-0">
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
                          className={`font-medium text-xs leading-none ${textStyle}`}
                        >
                          {category}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Subcategories — one accordion panel per expanded category */}
              {selectedMainCategories.filter(cat => expandedMainCategories.has(cat)).map((expandedCat) => (
                <div
                  key={expandedCat}
                  className={`rounded-lg border mt-2 animate-step-slide-up ${
                    getCategoryColor(expandedCat).bg
                  } ${getCategoryColor(expandedCat).border}`}
                >
                  <div className={`flex items-center justify-between px-4 py-2 border-b ${getCategoryColor(expandedCat).border}`}>
                    <h4 className={`font-semibold text-sm ${getCategoryColor(expandedCat).text}`}>
                      {expandedCat} — Subcategories
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleMainCategoryToggle(expandedCat)}
                      className="text-xs text-ink-caption hover:text-ink-paragraph px-2 py-0.5 rounded hover:bg-white/50"
                    >
                      ▲ Collapse
                    </button>
                  </div>

                  <div className="p-4">
                  <div className="flex flex-wrap items-start mb-3">
                    {subcategories[expandedCat]?.map((subCategory) => {
                      const colors = getCategoryColor(expandedCat);
                      const subStatus = getSubCategoryStatus(
                        expandedCat,
                        subCategory
                      );
                      const isSubSelected =
                        selectedSubcategories[expandedCat]?.includes(
                          subCategory
                        );
                      const isSubExpanded = expandedSubcategories.has(subCategory);

                      let subCategoryStyle = "";
                      let subTextStyle = "";
                      let showSubCheckbox = false;

                      if (subStatus === "completed") {
                        if (isSubExpanded) {
                          subCategoryStyle =
                            "bg-status-info/15 border-status-info shadow-sm ring-2 ring-status-info/40";
                          subTextStyle = "text-status-info";
                        } else {
                          subCategoryStyle =
                            "bg-status-success/15 border-status-success shadow-sm";
                          subTextStyle = "text-status-success";
                        }
                        showSubCheckbox = true;
                      } else if (subStatus === "expanded") {
                        subCategoryStyle =
                          "bg-status-info/15 border-status-info shadow-sm ring-2 ring-status-info/40";
                        subTextStyle = "text-status-info";
                      } else if (isSubSelected) {
                        subCategoryStyle =
                          "bg-status-warning/15 border-status-warning shadow-sm";
                        subTextStyle = "text-status-warning";
                      } else {
                        subCategoryStyle =
                          "bg-surface-card hover:bg-ink-offwhite border border-ink-light";
                        subTextStyle = "text-ink-paragraph";
                      }

                      return (
                        <button
                          key={subCategory}
                          onClick={() =>
                            handleSubCategoryToggle(
                              expandedCat,
                              subCategory
                            )
                          }
                          className={`inline-block px-2 py-1 mr-1 mb-1 rounded border text-left transition-all hover:shadow-sm whitespace-nowrap ${subCategoryStyle}`}
                        >
                          <div className="flex items-start">
                            {showSubCheckbox && (
                              <div className="w-2 h-2 rounded border border-status-success bg-status-success flex items-center justify-center mr-1 mt-0.5 flex-shrink-0">
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
                              className={`font-medium text-xs leading-none ${subTextStyle}`}
                            >
                              {subCategory}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Sub-subcategories — one panel per expanded subcategory */}
                  {(selectedSubcategories[expandedCat] || [])
                    .filter(sub => expandedSubcategories.has(sub) && subSubcategories[sub])
                    .map((expandedSub) => (
                      <div key={expandedSub} className="bg-surface-card rounded-md border border-ink-light p-3 mb-2 animate-step-slide-up">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-xs text-ink-charcoal">{expandedSub} — Details</h5>
                          <button
                            type="button"
                            onClick={() => handleSubCategoryToggle(expandedCat, expandedSub)}
                            className="text-xs text-ink-caption hover:text-ink-paragraph px-1"
                          >▲</button>
                        </div>
                        <div className="flex flex-wrap items-start">
                          {subSubcategories[expandedSub].map((subSubCategory) => {
                            const isSubSubSelected = selectedSubSubcategories[expandedSub]?.includes(subSubCategory);
                            return (
                              <label
                                key={subSubCategory}
                                className={`inline-flex items-center px-1.5 py-0.5 mr-1 mb-1 rounded border cursor-pointer transition-all hover:shadow-sm whitespace-nowrap ${
                                  isSubSubSelected
                                    ? "bg-status-success/10 border-status-success/40 text-status-success"
                                    : "hover:bg-ink-offwhite border-ink-light text-ink-charcoal"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSubSubSelected}
                                  onChange={() => handleSubSubCategoryToggle(expandedSub, subSubCategory)}
                                  className="sr-only"
                                />
                                <div className={`w-2.5 h-2.5 rounded border mr-1.5 flex items-center justify-center ${
                                  isSubSubSelected ? "border-status-success bg-status-success" : "border-ink-light"
                                }`}>
                                  {isSubSubSelected && (
                                    <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                <span className="text-ink-paragraph text-xs leading-none">{subSubCategory}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  }

                  {/* Other input */}
                  <div className="mt-2">
                    <FormInput
                      label={`Other ${expandedCat} (comma-separated)`}
                      value={formData.otherMainCategories || ""}
                      onChange={(value) =>
                        updateFormData({ otherMainCategories: value })
                      }
                      placeholder="Enter other categories..."
                    />
                    {formData.otherMainCategories && formData.otherMainCategories.trim() && (
                      <div className="mt-2 flex flex-wrap">
                        {formData.otherMainCategories.split(",").map((item, index) => {
                          const trimmedItem = item.trim();
                          if (!trimmedItem) return null;
                          return (
                            <span key={index} className="inline-block px-2 py-0.5 mr-1 mb-1 bg-status-info/15 text-status-info rounded border border-status-info/25 text-xs font-medium">
                              {trimmedItem}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Geography of Operations */}
        <div className="bg-ink-offwhite rounded-lg p-3">
          <h3 className="text-base font-bold text-ink mb-3">
            Geography of Operations
          </h3>
          <MultiSelect
            label="Select your operational coverage areas"
            options={[
              "Local (City/District)",
              "State/Regional",
              "National",
              "International",
            ]}
            selected={formData.geographyOfOperations}
            onChange={(selected) =>
              updateFormData({ geographyOfOperations: selected })
            }
          />

          <div className="mt-3">
            <FormInput
              label="Coverage Type Details"
              value={formData.coverageType || ""}
              onChange={(value) => updateFormData({ coverageType: value })}
              placeholder="Describe your service coverage area in detail..."
              type="textarea"
              rows={2}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-ink-light rounded-lg p-3">
          <h4 className="text-sm font-semibold text-ink-charcoal mb-2">
            Selection Summary
          </h4>
          <div className="text-sm text-ink-paragraph space-y-1">
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
              <strong>Geographic Coverage:</strong>{" "}
              {formData.geographyOfOperations.length} areas selected
            </p>
          </div>

          {/* Status Legend */}
          <div className="mt-3 pt-3 border-t border-ink-light">
            <h5 className="text-sm font-semibold text-ink-paragraph mb-2">
              Status Legend:
            </h5>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-status-success/15 border border-status-success rounded mr-2 flex items-center justify-center">
                  <svg
                    className="w-2 h-2 text-status-success"
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
                <div className="w-3 h-3 bg-brand-yellow-soft border border-brand-gold rounded mr-2"></div>
                <span className="text-xs">Selected</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-status-info/15 border border-status-info rounded mr-2"></div>
                <span className="text-xs">Expanded</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-surface-card border border-ink-light rounded mr-2"></div>
                <span className="text-xs">Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormStep>
  );
};

export default Step4BusinessCategories;