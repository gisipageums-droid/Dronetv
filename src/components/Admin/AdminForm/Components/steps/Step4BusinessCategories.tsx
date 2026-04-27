import React, { useMemo, useState, useEffect, useRef } from "react";
import { FormStep } from "../FormStep";
import { MultiSelect, FormInput } from "../FormInput";
import { StepProps } from "../../types/form";
import { Edit3, Trash2 } from "lucide-react";
import { FaPencilAlt } from "react-icons/fa";

// Enhanced EditModal with better design and functionality
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
  onDelete?: (index: number) => void;
  onEdit?: (index: number, newValue: string) => void;
  onCreate?: (name: string, parentIdFromModal?: string | null) => Promise<void> | void; // new: backend hook for add
  onDeleteBackend?: (name: string) => Promise<void> | void; // new: backend hook for delete
  onUpdateBackend?: (oldName: string, newName: string) => Promise<void> | void; // new: backend hook for update
  parentId?: string | null; // new: pass resolved parent id into modal
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
  onDelete,
  onEdit,
  onCreate,
  onDeleteBackend,
  onUpdateBackend,
  parentId,
}) => {
    const [localItems, setLocalItems] = useState<string[]>(items);
    const [inheritedParentId, setInheritedParentId] = useState<string | null | undefined>(parentId);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [editingIdx, setEditingIdx] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>("");
    const activeEditRef = useRef<HTMLInputElement | null>(null);
    const listScrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      setLocalItems(items);
      if (initialSelected) {
        const idx = items.findIndex((x) => x === initialSelected);
        setSelectedIdx(idx >= 0 ? idx : null);
      } else {
        setSelectedIdx(null);
      }
    }, [items, initialSelected]);

    useEffect(() => {
      setInheritedParentId(parentId);
    }, [parentId]);

    const sanitize = (arr: string[]) =>
      Array.from(new Set(arr.map((s) => s.trim()).filter(Boolean)));

    // Add a new blank row inline and focus it (no prompt; backend called on Save)
    const addRow = async () => {
      setLocalItems((s) => {
        const newIndex = s.length;
        const next = [...s, ""];
        setSelectedIdx(newIndex);
        setEditingIdx(newIndex);
        setEditValue("");
        setTimeout(() => {
          if (activeEditRef.current) {
            activeEditRef.current.focus();
            if (typeof activeEditRef.current.scrollIntoView === "function") {
              activeEditRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
          } else if (listScrollRef.current) {
            listScrollRef.current.scrollTop = listScrollRef.current.scrollHeight;
          }
        }, 0);
        return next;
      });
    };

    // Editing only allowed when pencil is clicked → handled by startEdit/saveEdit.

    const removeRow = async (idx: number) => {
      const nameToDelete = (localItems[idx] || "").trim();
      if (nameToDelete && onDeleteBackend) {
        try {
          await onDeleteBackend(nameToDelete);
        } catch (e) {
          console.error("Backend delete failed:", e);
          alert(`Delete failed: ${e instanceof Error ? e.message : String(e)}`);
        }
      }
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

      // Call onDelete if provided
      if (onDelete) {
        onDelete(idx);
      }
    };

    const [originalValue, setOriginalValue] = useState<string>("");

    const startEdit = (idx: number) => {
      setEditingIdx(idx);
      const val = localItems[idx] || "";
      setEditValue(val);
      setOriginalValue(val);
    };

    const saveEdit = async () => {
      if (editingIdx !== null) {
        const wasEmpty = !localItems[editingIdx];
        const trimmed = editValue.trim();
        const newItems = [...localItems];
        newItems[editingIdx] = trimmed;
        setLocalItems(newItems);

        if (onEdit) {
          onEdit(editingIdx, trimmed);
        }

        // If this row was just created (previously empty) and there is a create hook, call it
        if (wasEmpty && trimmed && onCreate) {
          try {
            await onCreate(trimmed, inheritedParentId ?? null);
          } catch (e) {
            console.error("Create failed:", e);
            // keep UI change but surface error
            alert(`Create failed: ${e instanceof Error ? e.message : String(e)}`);
          }
        }

        // If editing an existing value and it changed, call update hook
        if (!wasEmpty && trimmed && originalValue && trimmed !== originalValue && onUpdateBackend) {
          try {
            await onUpdateBackend(originalValue, trimmed);
          } catch (e) {
            console.error("Update failed:", e);
            alert(`Update failed: ${e instanceof Error ? e.message : String(e)}`);
          }
        }

        if (onLiveChange) onLiveChange(sanitize(newItems));
      }
      setEditingIdx(null);
      setEditValue("");
    };

    const cancelEdit = () => {
      setEditingIdx(null);
      setEditValue("");
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

    // Allow Next to work even if user hasn't clicked an item: fallback to first non-empty
    const firstNonEmpty = Array.from(new Set(localItems.map((s) => (s || "").trim()).filter(Boolean)))[0] || "";
    const effectiveSelected = selectedItem || firstNonEmpty;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60">
        <div className="bg-white w-[600px] max-w-[95vw] rounded-2xl shadow-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <p className="mt-1 text-sm text-gray-600">Manage your business categories</p>
            </div>
            <div className="flex items-center gap-2">
              {showBack && onBack && (
                <button
                  onClick={onBack}
                  className="px-4 py-2 text-sm transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ← Back
                </button>
              )}
              <button
                className="inline-flex items-center justify-center w-8 h-8 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={onClose}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Info box removed as requested */}

          <div
            ref={listScrollRef}
            className="grid grid-cols-2 gap-2 pr-1 overflow-auto max-h-60"
          >
            {localItems.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm">No options yet. Use "Add option" to get started.</p>
              </div>
            )}
            {localItems.map((item, idx) => (
              <div
                key={idx}
                className={`flex gap-2 items-center p-2 rounded-md border transition-colors hover:border-gray-300 ${selectedIdx === idx ? 'border-blue-400 ring-1 ring-blue-300' : 'border-gray-200'}`}
                onClick={() => {
                  if (onOpenChild && editingIdx !== idx) setSelectedIdx(idx);
                }}
                role={onOpenChild ? 'button' : undefined}
                tabIndex={onOpenChild ? 0 : undefined}
              >

                {editingIdx === idx ? (
                  <div className="flex flex-1 gap-2">
                    <input
                      ref={activeEditRef}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder="Type option…"
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                    />
                    <button
                      className="px-2 py-1 text-xs text-white transition-colors bg-green-500 rounded-md hover:bg-green-600"
                      onClick={saveEdit}
                    >
                      Save
                    </button>
                    <button
                      className="px-2 py-1 text-xs text-white transition-colors bg-gray-500 rounded-md hover:bg-gray-600"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 text-sm border border-transparent rounded-lg">
                    {item && item.trim() ? (
                      <span>{item}</span>
                    ) : (
                      <span className="text-slate-400">(empty)</span>
                    )}
                  </div>
                )}

                {editingIdx !== idx && (
                  <div className="flex gap-1">
                    <button
                      className="p-1.5 text-white bg-blue-500 rounded-md transition-colors hover:bg-blue-600"
                      onClick={() => startEdit(idx)}
                      aria-label="Edit"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className="p-1.5 text-white bg-red-500 rounded-md transition-colors hover:bg-red-600"
                      onClick={() => removeRow(idx)}
                      aria-label="Remove"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-3">
            <button
              className="flex gap-1.5 items-center px-3 py-1.5 text-sm rounded-md border border-gray-300 transition-colors hover:bg-gray-50"
              onClick={addRow}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add option
            </button>
            <div className="ml-2 text-xs text-gray-500">
              Changes update live (type to push updates)
            </div>
          </div>

          <div className="flex justify-between gap-2 pt-3 mt-4 border-t border-gray-200">
            {onOpenChild && (
              <button
                className="flex gap-1.5 items-center px-3 py-1.5 text-sm rounded-md border border-gray-300 transition-colors hover:bg-gray-50"
                onClick={() => effectiveSelected && onOpenChild(effectiveSelected)}
                disabled={!effectiveSelected}
                title={
                  effectiveSelected
                    ? `Go to ${childLevelLabel} for "${effectiveSelected}"`
                    : "Select an item first"
                }
              >
                Next → {childLevelLabel}
              </button>
            )}

            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 text-sm rounded-md border border-gray-300 transition-colors hover:bg-gray-50"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700"
                onClick={handleSave}
              >
                Save Changes
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
  // Local storage removed
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
  // Map backend ids for main categories (name -> id)
  const [mainNameToId, setMainNameToId] = useState<Record<string, string>>({});
  // Map backend ids for subcategories by main name (main -> (subName -> id))
  const [subNameToIdByMain, setSubNameToIdByMain] = useState<Record<string, Record<string, string>>>({});
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

  // Map backend ids for sub-subcategories by sub name (sub -> (detailName -> id))
  const [subSubNameToIdBySub, setSubSubNameToIdBySub] = useState<Record<string, Record<string, string>>>({});

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

  // Local storage helpers removed

  // Removed local storage initialization

  // Removed local storage persistence for form data

  // Load parent categories from backend (/view) on mount
  const [loadingBackendParents, setLoadingBackendParents] = useState<boolean>(false);
  useEffect(() => {
    const loadParents = async () => {
      try {
        setLoadingBackendParents(true);
        const res = await fetch(
          "https://ic7x2avpej.execute-api.ap-south-1.amazonaws.com/Business_Categories_and_Coverage/view",
          { method: "GET" }
        );
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const names: string[] = Array.isArray(data?.items)
          ? Array.from(
            new Set<string>(
              (data.items as any[])
                .map((it) => (it && typeof it.name === "string" ? it.name.trim() : ""))
                .filter((s: string) => Boolean(s))
            )
          )
          : [];
        if (names.length > 0) {
          setMainCategories(names);
          // build name->id map (first seen wins)
          const map: Record<string, string> = {};
          for (const it of (data.items as any[])) {
            const n = it && typeof it.name === 'string' ? it.name.trim() : '';
            const id = it && typeof it.id === 'string' ? it.id : '';
            if (n && id && !map[n]) map[n] = id;
          }
          setMainNameToId(map);
        }
      } catch (e) {
        console.error("Failed to load parent categories from backend", e);
      } finally {
        setLoadingBackendParents(false);
      }
    };
    loadParents();
  }, []);

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

  // Load geography options from backend (/view) on mount so both section and modal show server data
  useEffect(() => {
    const loadGeography = async () => {
      try {
        const res = await fetch(
          "https://decjfhu8qk.execute-api.ap-south-1.amazonaws.com/geography-of-operations/view",
          { method: "GET" }
        );
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json().catch(() => ({} as any));
        const items = Array.isArray(data?.items) ? data.items : [];
        const first = items[0] || {};
        const options = Array.isArray(first?.options) ? first.options : [];
        const cleaned = Array.from(
          new Set(
            options
              .map((o: any) => (typeof o === "string" ? o.trim() : ""))
              .filter(Boolean)
          )
        );
        if (cleaned.length > 0) setGeographyOptions(cleaned);
      } catch (e) {
        console.error("Failed to load geography options from backend", e);
      }
    };
    loadGeography();
  }, []);

  // NEW: modal toggle for geography
  const [editingGeography, setEditingGeography] = useState(false);

  // Live-change handler to keep selections valid (geography)
  const handleLiveGeographyChange = (newItems: string[]) => {
    setGeographyOptions(newItems);

    const newGeographyOfOperations = (formData.geographyOfOperations || []).filter(
      (g: string) => newItems.includes(g)
    );
    updateFormData({
      geographyOfOperations: newGeographyOfOperations,
    });
    // local storage removed
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
    parentMain?: string | null; // for 'subsub', the main category name
    parentId?: string | null; // resolved parent id for 'subsub'
  } | null>(null);

  // Cache parent id for current child modal (useful for 'subsub')
  const [childEntityParentId, setChildEntityParentId] = useState<string | null>(null);

  // Resolve subcategory id when opening 'subsub' modal so parentId is ready
  useEffect(() => {
    const resolveForSubSub = async () => {
      if (!childEntity || childEntity.level !== 'subsub') {
        setChildEntityParentId(null);
        return;
      }
      const subKey = (childEntity.key || '').trim();
      const parentMainHint = (childEntity.parentMain || '').trim();
      if (!subKey) {
        setChildEntityParentId(null);
        return;
      }

      // 1) Try existing maps
      const parentMainForSub = Object.keys(subNameToIdByMain).find((m) =>
        Boolean((subNameToIdByMain[m] || {})[subKey])
      );
      if (parentMainForSub) {
        const id = (subNameToIdByMain[parentMainForSub] || {})[subKey] || null;
        if (id) { setChildEntityParentId(id); return; }
      }

      // 2) Derive main from current subcategories, then try map
      let derivedMain = parentMainHint || Object.keys(subcategories).find((m) =>
        (subcategories[m] || []).includes(subKey)
      ) || '';
      if (derivedMain) {
        const id = (subNameToIdByMain[derivedMain] || {})[subKey] || null;
        if (id) { setChildEntityParentId(id); return; }
      }

      // 3) Fetch /tree and rebuild map, then pick id
      try {
        const treeRes = await fetch(
          'https://ic7x2avpej.execute-api.ap-south-1.amazonaws.com/Business_Categories_and_Coverage/tree',
          { method: 'GET' }
        );
        if (treeRes.ok) {
          const data = await treeRes.json().catch(() => ({} as any));
          const tree = Array.isArray(data?.tree) ? (data.tree as any[]) : [];

          if (!derivedMain) {
            for (const node of tree) {
              const subs = Array.isArray(node?.children) ? node.children : [];
              const found = subs.find(
                (s: any) => s && typeof s.name === 'string' && s.name.trim() === subKey
              );
              if (found) {
                derivedMain = typeof node?.name === 'string' ? node.name.trim() : '';
                break;
              }
            }
          }

          if (derivedMain) {
            const mainNode = tree.find(
              (n: any) => n && typeof n.name === 'string' && n.name.trim() === derivedMain
            );
            if (mainNode) {
              const subs = Array.isArray(mainNode.children) ? mainNode.children : [];
              const map: Record<string, string> = {};
              for (const s of subs) {
                const n = s && typeof s.name === 'string' ? s.name.trim() : '';
                const id = s && typeof s.id === 'string' ? s.id : '';
                if (n && id && !map[n]) map[n] = id;
              }
              setSubNameToIdByMain((prev) => ({ ...prev, [derivedMain!]: map }));
              const id = map[subKey] || null;
              if (id) { setChildEntityParentId(id); return; }
            }
          }

          // 4) Absolute fallback: search entire tree by name
          const findIdByName = (nodes: any[], target: string): string | null => {
            for (const node of nodes) {
              const nodeName = typeof node?.name === 'string' ? node.name.trim() : '';
              if (nodeName === target) {
                return typeof node?.id === 'string' ? node.id : null;
              }
              const children = Array.isArray(node?.children) ? node.children : [];
              const found = findIdByName(children, target);
              if (found) return found;
            }
            return null;
          };
          const resolved = findIdByName(tree, subKey);
          setChildEntityParentId(resolved);
        }
      } catch (e) {
        console.error('Failed to resolve sub id for child modal', e);
      }
    };
    resolveForSubSub();
  }, [childEntity, subNameToIdByMain, subcategories]);

  // Auto-refresh subcategories when a main is expanded
  useEffect(() => {
    if (expandedMainCategory) {
      loadSubsFromTree(expandedMainCategory);
    }
  }, [expandedMainCategory]);

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

    // local storage removed
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

      // Ensure an entry exists so the section renders even if currently empty
      setSubSubcategories((prev) => (
        subCategory in prev ? prev : { ...prev, [subCategory]: [] }
      ));
      // Load latest details for this sub from backend
      loadSubSubFromTree(subCategory);

      // Also open the details modal directly so user can add new fields
      openSubSubModal(subCategory, "sub");
    }

    // local storage removed
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

      // local storage removed

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
    // local storage removed

    const newSelectedDeep = {
      ...selectedDeep,
      [parentKey]: (selectedDeep[parentKey] || []).filter((s) => newItems.includes(s)),
    };
    setSelectedDeep(newSelectedDeep);
    // local storage removed

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
    parentModalWas: "main" | "sub" | "deep" | null = null,
    parentMain: string | null = null,
    parentId: string | null = null
  ) => {
    setChildEntity({ level, key, parentModalWas, parentMain, parentId });
  };

  // Helper: resolve subcategory id by name, optionally using a parent main hint
  const resolveSubId = async (subKey: string, parentMainHint?: string | null): Promise<string | null> => {
    const trimmed = (subKey || '').trim();
    if (!trimmed) return null;

    // 1) Try map with explicit main
    if (parentMainHint) {
      const id = (subNameToIdByMain[parentMainHint] || {})[trimmed];
      if (id) return id;
    }

    // 2) Try any main in current maps
    const knownMain = Object.keys(subNameToIdByMain).find((m) => Boolean((subNameToIdByMain[m] || {})[trimmed]));
    if (knownMain) return (subNameToIdByMain[knownMain] || {})[trimmed] || null;

    // 3) Derive main from current subcategories list and then map
    const derivedMain = parentMainHint || Object.keys(subcategories).find((m) => (subcategories[m] || []).includes(trimmed)) || '';
    if (derivedMain) {
      const id = (subNameToIdByMain[derivedMain] || {})[trimmed];
      if (id) return id;
    }

    // 4) Fetch /tree to rebuild map and try again
    try {
      const treeRes = await fetch('https://ic7x2avpej.execute-api.ap-south-1.amazonaws.com/Business_Categories_and_Coverage/tree', { method: 'GET' });
      if (treeRes.ok) {
        const data = await treeRes.json().catch(() => ({} as any));
        const tree = Array.isArray(data?.tree) ? (data.tree as any[]) : [];

        // If main hint unknown, try to discover by scanning
        let mainToUse = derivedMain;
        if (!mainToUse) {
          for (const node of tree) {
            const subs = Array.isArray(node?.children) ? node.children : [];
            const found = subs.find((s: any) => s && typeof s.name === 'string' && s.name.trim() === trimmed);
            if (found) {
              mainToUse = typeof node?.name === 'string' ? node.name.trim() : '';
              break;
            }
          }
        }

        if (mainToUse) {
          const mainNode = tree.find((n: any) => n && typeof n.name === 'string' && n.name.trim() === mainToUse);
          if (mainNode) {
            const subs = Array.isArray(mainNode.children) ? mainNode.children : [];
            const map: Record<string, string> = {};
            for (const s of subs) {
              const n = s && typeof s.name === 'string' ? s.name.trim() : '';
              const id = s && typeof s.id === 'string' ? s.id : '';
              if (n && id && !map[n]) map[n] = id;
            }
            setSubNameToIdByMain((prev) => ({ ...prev, [mainToUse!]: map }));
            if (map[trimmed]) return map[trimmed];
          }
        }

        // Absolute fallback: global search by name
        const findIdByName = (nodes: any[], target: string): string | null => {
          for (const node of nodes) {
            const nodeName = typeof node?.name === 'string' ? node.name.trim() : '';
            if (nodeName === target) return typeof node?.id === 'string' ? node.id : null;
            const children = Array.isArray(node?.children) ? node.children : [];
            const found = findIdByName(children, target);
            if (found) return found;
          }
          return null;
        };
        return findIdByName(tree, trimmed);
      }
    } catch (e) {
      console.error('resolveSubId failed', e);
    }
    return null;
  };

  const openSubSubWithResolvedId = async (subKey: string, parentMain?: string | null) => {
    const id = await resolveSubId(subKey, parentMain || null);
    setChildEntity({ level: 'subsub', key: subKey, parentModalWas: 'sub', parentMain: parentMain || null, parentId: id });
  };

  // Load subcategories from /tree for a given main, then open sub modal
  const openSubModal = async (mainKey: string, parentModalWas: "main" | "sub" | "deep" | null = "main") => {
    try {
      const res = await fetch(
        "https://ic7x2avpej.execute-api.ap-south-1.amazonaws.com/Business_Categories_and_Coverage/tree",
        { method: "GET" }
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const tree = Array.isArray(data?.tree) ? (data.tree as any[]) : [];
      const mainNode = tree.find((n: any) => n && typeof n.name === 'string' && n.name.trim() === mainKey);
      if (mainNode) {
        const subs = Array.isArray(mainNode.children) ? mainNode.children : [];
        const names = subs.map((s: any) => (s && typeof s.name === 'string' ? s.name.trim() : '')).filter(Boolean);
        setSubcategories((prev) => ({ ...prev, [mainKey]: names }));
        const map: Record<string, string> = {};
        for (const s of subs) {
          const n = s && typeof s.name === 'string' ? s.name.trim() : '';
          const id = s && typeof s.id === 'string' ? s.id : '';
          if (n && id && !map[n]) map[n] = id;
        }
        setSubNameToIdByMain((prev) => ({ ...prev, [mainKey]: map }));
      }
    } catch (e) {
      console.error('Failed to load subcategories via /tree', e);
    }
    setChildEntity({ level: 'sub', key: mainKey, parentModalWas });
  };

  // Load latest subcategories for a given main without opening modal
  const loadSubsFromTree = async (mainKey: string) => {
    try {
      const res = await fetch(
        "https://ic7x2avpej.execute-api.ap-south-1.amazonaws.com/Business_Categories_and_Coverage/tree",
        { method: "GET" }
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const tree = Array.isArray(data?.tree) ? (data.tree as any[]) : [];
      const mainNode = tree.find((n: any) => n && typeof n.name === 'string' && n.name.trim() === mainKey);
      if (mainNode) {
        const subs = Array.isArray(mainNode.children) ? mainNode.children : [];
        const names = subs.map((s: any) => (s && typeof s.name === 'string' ? s.name.trim() : '')).filter(Boolean);
        setSubcategories((prev) => ({ ...prev, [mainKey]: names }));
        const map: Record<string, string> = {};
        for (const s of subs) {
          const n = s && typeof s.name === 'string' ? s.name.trim() : '';
          const id = s && typeof s.id === 'string' ? s.id : '';
          if (n && id && !map[n]) map[n] = id;
        }
        setSubNameToIdByMain((prev) => ({ ...prev, [mainKey]: map }));
      }
    } catch (e) {
      console.error('Failed to load subcategories via /tree (inline)', e);
    }
  };

  // Load sub-sub list for a given sub (by name) from /tree, then open subsub modal
  const openSubSubModal = async (subKey: string, parentModalWas: "sub" | "deep" | "main" | null = "sub") => {
    try {
      const res = await fetch(
        "https://ic7x2avpej.execute-api.ap-south-1.amazonaws.com/Business_Categories_and_Coverage/tree",
        { method: "GET" }
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const tree = Array.isArray(data?.tree) ? (data.tree as any[]) : [];

      // find the sub node anywhere in the tree
      let foundSub: any | null = null;
      for (const mainNode of tree) {
        const subs = Array.isArray(mainNode?.children) ? mainNode.children : [];
        const subNode = subs.find(
          (n: any) => n && typeof n.name === "string" && n.name.trim() === subKey
        );
        if (subNode) {
          foundSub = subNode;
          break;
        }
      }

      if (foundSub) {
        const details = Array.isArray(foundSub.children) ? foundSub.children : [];
        const names = details
          .map((c: any) => (c && typeof c.name === "string" ? c.name.trim() : ""))
          .filter(Boolean);
        setSubSubcategories((prev) => ({ ...prev, [subKey]: names }));
        const map: Record<string, string> = {};
        for (const d of details) {
          const n = d && typeof d.name === "string" ? d.name.trim() : "";
          const id = d && typeof d.id === "string" ? d.id : "";
          if (n && id && !map[n]) map[n] = id;
        }
        setSubSubNameToIdBySub((prev) => ({ ...prev, [subKey]: map }));
      }
    } catch (e) {
      console.error("Failed to load sub-sub via /tree", e);
    }
    setChildEntity({ level: "subsub", key: subKey, parentModalWas });
  };

  // Helper: load latest sub-sub list for a given sub without opening modal
  const loadSubSubFromTree = async (subKey: string) => {
    try {
      const res = await fetch(
        "https://ic7x2avpej.execute-api.ap-south-1.amazonaws.com/Business_Categories_and_Coverage/tree",
        { method: "GET" }
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const tree = Array.isArray(data?.tree) ? (data.tree as any[]) : [];
      let foundSub: any | null = null;
      for (const mainNode of tree) {
        const subs = Array.isArray(mainNode?.children) ? mainNode.children : [];
        const subNode = subs.find((n: any) => n && typeof n.name === 'string' && n.name.trim() === subKey);
        if (subNode) { foundSub = subNode; break; }
      }
      if (foundSub) {
        const details = Array.isArray(foundSub.children) ? foundSub.children : [];
        const names = details.map((c: any) => (c && typeof c.name === 'string' ? c.name.trim() : '')).filter(Boolean);
        setSubSubcategories((prev) => ({ ...prev, [subKey]: names }));
        const map: Record<string, string> = {};
        for (const d of details) {
          const n = d && typeof d.name === 'string' ? d.name.trim() : '';
          const id = d && typeof d.id === 'string' ? d.id : '';
          if (n && id && !map[n]) map[n] = id;
        }
        setSubSubNameToIdBySub((prev) => ({ ...prev, [subKey]: map }));
      }
    } catch (e) {
      console.error('loadSubSubFromTree failed', e);
    }
  };

  // Auto-refresh details list when a subcategory is expanded
  useEffect(() => {
    if (expandedSubcategory) {
      loadSubSubFromTree(expandedSubcategory);
    }
  }, [expandedSubcategory]);

  // Live-change handlers for immediate updates while modal is open
  const handleLiveMainChange = (newItems: string[]) => {
    setMainCategories(newItems);
    // local storage removed

    const newSelectedMainCategories = newItems.filter((c) =>
      selectedMainCategories.includes(c)
    );
    setSelectedMainCategories(newSelectedMainCategories);
    // local storage removed

    const newSelectedSubcategories: Record<string, string[]> = {};
    newItems.forEach((c) => {
      if (selectedSubcategories[c]) newSelectedSubcategories[c] = selectedSubcategories[c];
    });
    setSelectedSubcategories(newSelectedSubcategories);
    // local storage removed

    setExpandedMainCategory((prev) =>
      prev && newItems.includes(prev) ? prev : ""
    );
  };

  const handleLiveSubChange = (mainKey: string, newItems: string[]) => {
    const newSubcategories = { ...subcategories, [mainKey]: newItems };
    setSubcategories(newSubcategories);
    // local storage removed

    const newSelectedSubcategories = {
      ...selectedSubcategories,
      [mainKey]: (selectedSubcategories[mainKey] || []).filter((s) => newItems.includes(s)),
    };
    setSelectedSubcategories(newSelectedSubcategories);
    // local storage removed

    setExpandedSubcategory((prev) =>
      prev && newItems.includes(prev) ? prev : ""
    );
  };

  const handleLiveSubSubChange = (subKey: string, newItems: string[]) => {
    const newSubSubcategories = { ...subSubcategories, [subKey]: newItems };
    setSubSubcategories(newSubSubcategories);
    // local storage removed

    const newSelectedSubSubcategories = {
      ...selectedSubSubcategories,
      [subKey]: (selectedSubSubcategories[subKey] || []).filter((s) => newItems.includes(s)),
    };
    setSelectedSubSubcategories(newSelectedSubSubcategories);
    // local storage removed
  };

  // Enhanced CRUD operations with better error handling and user feedback
  const handleDeleteMainCategory = (categoryToDelete: string) => {
    // Remove from main categories
    const newMainCategories = mainCategories.filter(cat => cat !== categoryToDelete);
    setMainCategories(newMainCategories);

    // Remove from selected main categories
    const newSelectedMain = selectedMainCategories.filter(cat => cat !== categoryToDelete);
    setSelectedMainCategories(newSelectedMain);

    // Remove from subcategories
    const newSubcategories = { ...subcategories };
    delete newSubcategories[categoryToDelete];
    setSubcategories(newSubcategories);

    // Remove from selected subcategories
    const newSelectedSub = { ...selectedSubcategories };
    delete newSelectedSub[categoryToDelete];
    setSelectedSubcategories(newSelectedSub);

    // Clear expansion if this category was expanded
    if (expandedMainCategory === categoryToDelete) {
      setExpandedMainCategory("");
    }
  };

  const handleEditMainCategory = (oldCategory: string, newCategory: string) => {
    // Update main categories
    const newMainCategories = mainCategories.map(cat =>
      cat === oldCategory ? newCategory : cat
    );
    setMainCategories(newMainCategories);

    // Update selected main categories
    const newSelectedMain = selectedMainCategories.map(cat =>
      cat === oldCategory ? newCategory : cat
    );
    setSelectedMainCategories(newSelectedMain);

    // Update subcategories key
    const newSubcategories = { ...subcategories };
    if (newSubcategories[oldCategory]) {
      newSubcategories[newCategory] = newSubcategories[oldCategory];
      delete newSubcategories[oldCategory];
      setSubcategories(newSubcategories);
    }

    // Update selected subcategories key
    const newSelectedSub = { ...selectedSubcategories };
    if (newSelectedSub[oldCategory]) {
      newSelectedSub[newCategory] = newSelectedSub[oldCategory];
      delete newSelectedSub[oldCategory];
      setSelectedSubcategories(newSelectedSub);
    }

    // Update expansion if this category was expanded
    if (expandedMainCategory === oldCategory) {
      setExpandedMainCategory(newCategory);
    }
  };

  const handleDeleteSubCategory = (mainCategory: string, subCategoryToDelete: string) => {
    // Remove from subcategories
    const newSubcategories = { ...subcategories };
    if (newSubcategories[mainCategory]) {
      newSubcategories[mainCategory] = newSubcategories[mainCategory].filter(
        sub => sub !== subCategoryToDelete
      );
      setSubcategories(newSubcategories);
    }

    // Remove from selected subcategories
    const newSelectedSub = { ...selectedSubcategories };
    if (newSelectedSub[mainCategory]) {
      newSelectedSub[mainCategory] = newSelectedSub[mainCategory].filter(
        sub => sub !== subCategoryToDelete
      );
      setSelectedSubcategories(newSelectedSub);
    }

    // Remove from sub-subcategories
    const newSubSubcategories = { ...subSubcategories };
    delete newSubSubcategories[subCategoryToDelete];
    setSubSubcategories(newSubSubcategories);

    // Remove from selected sub-subcategories
    const newSelectedSubSub = { ...selectedSubSubcategories };
    delete newSelectedSubSub[subCategoryToDelete];
    setSelectedSubSubcategories(newSelectedSubSub);

    // Clear expansion if this subcategory was expanded
    if (expandedSubcategory === subCategoryToDelete) {
      setExpandedSubcategory("");
    }
  };

  const handleEditSubCategory = (mainCategory: string, oldSubCategory: string, newSubCategory: string) => {
    // Update subcategories
    const newSubcategories = { ...subcategories };
    if (newSubcategories[mainCategory]) {
      newSubcategories[mainCategory] = newSubcategories[mainCategory].map(sub =>
        sub === oldSubCategory ? newSubCategory : sub
      );
      setSubcategories(newSubcategories);
    }

    // Update selected subcategories
    const newSelectedSub = { ...selectedSubcategories };
    if (newSelectedSub[mainCategory]) {
      newSelectedSub[mainCategory] = newSelectedSub[mainCategory].map(sub =>
        sub === oldSubCategory ? newSubCategory : sub
      );
      setSelectedSubcategories(newSelectedSub);
    }

    // Update sub-subcategories key
    const newSubSubcategories = { ...subSubcategories };
    if (newSubSubcategories[oldSubCategory]) {
      newSubSubcategories[newSubCategory] = newSubSubcategories[oldSubCategory];
      delete newSubSubcategories[oldSubCategory];
      setSubSubcategories(newSubSubcategories);
    }

    // Update selected sub-subcategories key
    const newSelectedSubSub = { ...selectedSubSubcategories };
    if (newSelectedSubSub[oldSubCategory]) {
      newSelectedSubSub[newSubCategory] = newSelectedSubSub[oldSubCategory];
      delete newSelectedSubSub[oldSubCategory];
      setSelectedSubSubcategories(newSelectedSubSub);
    }

    // Update expansion if this subcategory was expanded
    if (expandedSubcategory === oldSubCategory) {
      setExpandedSubcategory(newSubCategory);
    }
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
            className="absolute top-0 w-px h-full -translate-x-1/2 left-2 bg-slate-300"
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
              <div key={`${parent}::${child}`} className="relative flex flex-col">
                {/* Horizontal connector line */}
                <div className="absolute w-2 h-px -translate-x-1/2 left-2 top-3 bg-slate-300" />

                <div className="flex items-start gap-2 pl-4">
                  {/* Tree node connector */}
                  <div className="relative flex-shrink-0 mt-2.5">
                    {/* Vertical line continuation for non-last items */}
                    {!isLast && (
                      <div className="absolute w-px h-6 -translate-x-1/2 top-3 left-1/2 bg-slate-300" />
                    )}

                    {/* Circular node indicator */}
                    <div className="relative z-10 w-2 h-2 border rounded-full bg-slate-400 border-slate-600" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
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
                        {/* removed checkbox indicator */}
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
    return (
      <EditModal
        title={`Edit details for "${root}"`}
        items={extraChildren[root] || []}
        onClose={onClose}
        showBack={true}
        onBack={onClose}
        onSave={(newItems) => {
          handleLiveDeepChange(root, newItems);
          if (newItems.length > 0) {
            setExpandedDeepParent(root);
          }
          onClose();
        }}
        onOpenChild={(selected) => openChildModal("deep", selected, "deep")}
        childLevelLabel="deeper details"
      />
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
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Main Business Categories 
                </h3>
                <div className="flex gap-1 sm:gap-2">
                  <button
                    onClick={openEditMain}
                    className="inline-flex items-center gap-1 text-xs border rounded-lg hover:bg-white"
                    style={{
                      padding: '3.5px 4px',
                      margin: '0px 2px 2px 0px',
                      height: '21px',
                      minWidth: 'fit-content'
                    }}
                    title="Edit main categories and jump to subcategories via Next →"
                  >

                    <FaPencilAlt className="" />
                    Edit Categories
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Select your primary business categories (multiple selection allowed).
                Click on a category to expand and see subcategories.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-start gap-1 sm:gap-2">
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
                    "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm";
                  textStyle = "text-gray-700";
                }

                return (
                  <div
                    key={category}
                    className="relative group"
                  >
                    <button
                      onClick={() => handleMainCategoryToggle(category)}
                      className={`inline-flex gap-1 items-center text-xs text-left whitespace-nowrap rounded-lg border-2 transition-all sm:gap-2 sm:text-sm hover:shadow-md ${categoryStyle}`}
                      style={{
                        padding: '3.5px 4px',
                        margin: '0px 2px 2px 0px',
                        height: '21px',
                        minWidth: 'fit-content',
                        maxWidth: '100%'
                      }}
                      title={
                        isSelected && isExpanded
                          ? "Click to deselect & collapse"
                          : "Click to select & expand"
                      }
                    >
                      {showCheckbox && (
                        <div className="flex items-center justify-center flex-shrink-0 w-4 h-4 bg-green-500 border-2 border-green-500 rounded">
                          <svg
                            className="w-2.5 h-2.5 text-white"
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
                      <span className={`text-sm font-medium ${textStyle}`}>
                        {category}
                      </span>
                      {isExpanded && (
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>

                    {/* Quick action buttons - visible on hover */}
                    <div className="absolute transition-opacity opacity-0 -top-1 -right-1 group-hover:opacity-100">
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add edit functionality here
                          }}
                          className="flex items-center justify-center w-6 h-6 text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600"
                          title="Edit category"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Are you sure you want to delete "${category}"? This will also remove all its subcategories.`)) {
                              handleDeleteMainCategory(category);
                            }
                          }}
                          className="flex items-center justify-center w-6 h-6 text-white transition-colors bg-red-500 rounded-full hover:bg-red-600"
                          title="Delete category"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {mainCategories.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm">No categories yet. Click "Edit Categories" to add your first category.</p>
              </div>
            )}
          </div>

          {/* Subcategories for expanded main */}
          {expandedMainCategory && (
            <div
              className={`rounded-lg border p-4 ${getCategoryColor(expandedMainCategory).bg
                } ${getCategoryColor(expandedMainCategory).border}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4
                  className={`font-semibold text-sm ${getCategoryColor(expandedMainCategory).text
                    }`}
                >
                  {expandedMainCategory} - Subcategories
                </h4>

                <button
                  onClick={() => openSubModal(expandedMainCategory, "main")}
                  className="inline-flex items-center gap-1 text-xs border rounded-lg hover:bg-white"
                  title="Edit subcategories for this main category"
                  style={{
                    padding: '3.5px 4px',
                    margin: '0px 2px 2px 0px',
                    height: '21px',
                    minWidth: 'fit-content'
                  }}
                >
                  ✏️ Edit list
                </button>
              </div>

              <div className="flex flex-wrap items-start gap-1 mb-3 sm:gap-2">
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
                        className="inline-flex items-center mb-1 mr-1"
                      >
                        <button
                          onClick={() =>
                            handleSubCategoryToggle(
                              expandedMainCategory,
                              subCategory
                            )
                          }
                          className={`inline-block text-xs text-left whitespace-nowrap rounded border transition-all hover:shadow-sm ${subCategoryStyle}`}
                          style={{
                            padding: '3.5px 4px',
                            margin: '0px 2px 2px 0px',
                            height: '21px',
                            minWidth: 'fit-content',
                            maxWidth: '100%'
                          }}
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
                  <div className="p-3 mb-2 bg-white border rounded-md border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-xs font-medium text-slate-800">
                        {expandedSubcategory} - Details
                      </h5>

                      {/* SUB-SUB SECTION editor */}
                      <button
                        onClick={async () => {
                          await openSubSubModal(expandedSubcategory, "sub");
                        }}
                        className="inline-flex items-center gap-1 text-xs border rounded-lg border-slate-300 hover:bg-slate-50"
                        style={{
                          padding: '3.5px 4px',
                          margin: '0px 2px 2px 0px',
                          height: '21px',
                          minWidth: 'fit-content'
                        }}
                      >
                        ✏️ Edit details
                      </button>
                    </div>

                    <div className="flex flex-wrap items-start gap-1">
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
                                  className={`inline-flex items-center rounded border cursor-pointer transition-all hover:shadow-sm text-xs ${isChecked
                                    ? "text-green-800 bg-green-50 border-green-300"
                                    : "bg-white hover:bg-slate-50 border-slate-300"
                                    }`}
                                  style={{
                                    padding: '3.5px 4px',
                                    margin: '0px 2px 2px 0px',
                                    height: '21px',
                                    minWidth: 'fit-content',
                                    maxWidth: '100%'
                                  }}
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
                                  {/* removed checkbox indicator */}
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
                    // local storage removed
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
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-900">
            Geography of Operations
          </h3>
          <button
            className="inline-flex items-center gap-1 text-xs border rounded-lg hover:bg-white"
            onClick={() => setEditingGeography(true)}
            title="Edit coverage options"
            style={{
              padding: '3.5px 4px',
              margin: '0px 2px 2px 0px',
              height: '21px',
              minWidth: 'fit-content'
            }}
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
            onCreate={async (name) => {
              try {
                console.log('[Geography] add request', { name });
                const res = await fetch(
                  'https://decjfhu8qk.execute-api.ap-south-1.amazonaws.com/geography-of-operations/add',
                  {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name }),
                  }
                );
                if (!res.ok) {
                  const txt = await res.text().catch(() => '');
                  console.error('[Geography] add failed response', txt);
                  throw new Error(txt || 'Add failed');
                }
                const json = await res.json().catch(() => ({} as any));
                console.log('[Geography] add success', json);
                if (Array.isArray(json?.data)) {
                  setGeographyOptions(json.data);
                }
              } catch (e) {
                console.error('Geography add failed', e);
                alert(`Add failed: ${e instanceof Error ? e.message : String(e)}`);
              }
            }}
            onUpdateBackend={async (oldOption, newOption) => {
              try {
                // debug: verify call and payload
                console.log('[Geography] update request', { oldOption, newOption });
                const res = await fetch(
                  'https://decjfhu8qk.execute-api.ap-south-1.amazonaws.com/geography-of-operations/update/Geography_of_Operations',
                  {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ oldOption, newOption }),
                  }
                );
                if (!res.ok) {
                  const txt = await res.text().catch(() => '');
                  console.error('[Geography] update failed response', txt);
                  throw new Error(txt || 'Update failed');
                }
                const json = await res.json().catch(() => ({} as any));
                console.log('[Geography] update success', json);
              } catch (e) {
                console.error('Geography update failed', e);
                alert(`Update failed: ${e instanceof Error ? e.message : String(e)}`);
              }
            }}
            onDeleteBackend={async (name) => {
              try {
                console.log('[Geography] remove request', { removeOption: name });
                const res = await fetch(
                  'https://decjfhu8qk.execute-api.ap-south-1.amazonaws.com/geography-of-operations/update/Geography_of_Operations',
                  {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ removeOption: name }),
                  }
                );
                if (!res.ok) {
                  const txt = await res.text().catch(() => '');
                  console.error('[Geography] remove failed response', txt);
                  throw new Error(txt || 'Remove failed');
                }
                const json = await res.json().catch(() => ({} as any));
                console.log('[Geography] remove success', json);
              } catch (e) {
                console.error('Geography remove failed', e);
                alert(`Delete failed: ${e instanceof Error ? e.message : String(e)}`);
              }
            }}
          />
        )}

        <div className="mt-3">
          <FormInput
            label="Coverage Type Details"
            value={formData.coverageType || ""}
            onChange={(value) => {
              updateFormData({ coverageType: value });
              // Save to localStorage
              // local storage removed
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
              <div className="flex items-center justify-center w-3 h-3 mr-2 bg-green-100 border border-green-500 rounded">
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
              <div className="w-3 h-3 mr-2 bg-yellow-100 border border-yellow-500 rounded"></div>
              <span className="text-xs">Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 mr-2 bg-blue-100 border border-blue-500 rounded"></div>
              <span className="text-xs">Expanded</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 mr-2 bg-white border rounded border-slate-300"></div>
              <span className="text-xs">Available</span>
            </div>
          </div>
        </div>
      </div>


      {/* Editing main or sub list modal (single entry point) */}
      {
        editingEntity && (
          <EditModal
            title={
              editingEntity.level === "main"
                ? "Edit main categories"
                : `Edit subcategories for "${editingEntity.key}"`
            }
            items={modalItems}
            onClose={() => setEditingEntity(null)}
            onSave={(newItems) => {
              if (editingEntity?.level === "main") {
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
              } else if (editingEntity) {
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
            onDeleteBackend={async (name) => {
              // use name->id mapping if present for main list
              const id = mainNameToId[name];
              if (!id) return; // if id unknown, skip backend delete
              const res = await fetch(`https://ic7x2avpej.execute-api.ap-south-1.amazonaws.com/Business_Categories_and_Coverage/delete/${id}`, { method: 'DELETE' });
              if (!res.ok) throw new Error(await res.text());
            }}
            onUpdateBackend={async (oldName, newName) => {
              const id = mainNameToId[oldName];
              if (!id) return; // skip if id not known (likely user-added unsynced item)
              const res = await fetch(`https://ic7x2avpej.execute-api.ap-south-1.amazonaws.com/Business_Categories_and_Coverage/update/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, slug: newName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') }),
              });
              if (!res.ok) throw new Error(await res.text());
              // update name->id map key if needed
              setMainNameToId((prev) => {
                if (!prev[oldName]) return prev;
                const next = { ...prev } as Record<string, string>;
                next[newName] = next[oldName];
                delete next[oldName];
                return next;
              });
            }}
            onCreate={async (name) => {
              const parentId =
                editingEntity?.level === 'main'
                  ? null
                  : (mainNameToId[editingEntity!.key] || null);

              const payload = { name, parentId } as any;
              const res = await fetch('https://ic7x2avpej.execute-api.ap-south-1.amazonaws.com/Business_Categories_and_Coverage/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              });
              if (!res.ok) throw new Error(await res.text());
              const json = await res.json().catch(() => ({} as any));
              const newId = json?.item?.id;

              // UI में दिखा दो (optimistic) और id map अपडेट करो
              if (editingEntity?.level === 'main') {
                setMainCategories((prev) => Array.from(new Set([...prev, name])));
                if (newId) {
                  setMainNameToId((prev) => ({ ...prev, [name]: newId }));
                }
              } else if (editingEntity) {
                setSubcategories((prev) => ({
                  ...prev,
                  [editingEntity.key]: Array.from(new Set([...(prev[editingEntity.key] || []), name]))
                }));
                if (newId) {
                  setSubNameToIdByMain((prev) => ({
                    ...prev,
                    [editingEntity.key]: { ...(prev[editingEntity.key] || {}), [name]: newId }
                  }));
                }
              }
            }}
            onLiveChange={
              editingEntity?.level === "main"
                ? (newItems) => handleLiveMainChange(newItems)
                : (newItems) => editingEntity && handleLiveSubChange(editingEntity.key, newItems)
            }
            onOpenChild={
              editingEntity?.level === "main"
                ? (selected) => {
                  openChildModal("sub", selected, "main");
                  setEditingEntity(null);
                }
                : async (selected) => {
                  // from sub modal, go to sub-sub modal for the selected sub
                  await openSubSubModal(selected, "sub");
                  setEditingEntity(null);
                }
            }
            childLevelLabel={
              editingEntity?.level === "main" ? "subcategories" : "details"
            }
          />
        )
      }
      {/* NEW: Sub-sub hierarchy modal */}
      {
        hierarchyModal && (
          <HierarchyModal
            root={hierarchyModal.root}
            parentSub={hierarchyModal.parentSub}
            onClose={() => setHierarchyModal(null)}
          />
        )
      }

      {/* Child modal opened from Next → in parent modal or header edits */}
      {
        childEntity && (
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
            onDeleteBackend={async (name) => {
              if (childEntity.level === 'sub') {
                const map = subNameToIdByMain[childEntity.key] || {};
                const id = map[name];
                if (!id) return;
                const res = await fetch(`https://ic7x2avpej.execute-api.ap-south-1.amazonaws.com/Business_Categories_and_Coverage/delete/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error(await res.text());
                return;
              }
              if (childEntity.level === 'subsub') {
                const map = subSubNameToIdBySub[childEntity.key] || {};
                const id = map[name];
                if (!id) return;
                const res = await fetch(`https://ic7x2avpej.execute-api.ap-south-1.amazonaws.com/Business_Categories_and_Coverage/delete/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error(await res.text());
                return;
              }
              // deep: currently not mapped; skip backend delete
            }}
            onUpdateBackend={async (oldName, newName) => {
              if (childEntity.level === 'sub') {
                const map = subNameToIdByMain[childEntity.key] || {};
                const id = map[oldName];
                if (!id) return;
                const res = await fetch(`https://ic7x2avpej.execute-api.ap-south-1.amazonaws.com/Business_Categories_and_Coverage/update/${id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: newName, slug: newName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') }),
                });
                if (!res.ok) throw new Error(await res.text());
                setSubNameToIdByMain((prev) => {
                  const cur = { ...(prev[childEntity.key] || {}) };
                  if (!cur[oldName]) return prev;
                  cur[newName] = cur[oldName];
                  delete cur[oldName];
                  return { ...prev, [childEntity.key]: cur };
                });
                return;
              }
              if (childEntity.level === 'subsub') {
                const map = subSubNameToIdBySub[childEntity.key] || {};
                const id = map[oldName];
                if (!id) return;
                const res = await fetch(`https://ic7x2avpej.execute-api.ap-south-1.amazonaws.com/Business_Categories_and_Coverage/update/${id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: newName, slug: newName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') }),
                });
                if (!res.ok) throw new Error(await res.text());
                setSubSubNameToIdBySub((prev) => {
                  const cur = { ...(prev[childEntity.key] || {}) };
                  if (!cur[oldName]) return prev;
                  cur[newName] = cur[oldName];
                  delete cur[oldName];
                  return { ...prev, [childEntity.key]: cur };
                });
                return;
              }
            }}
            onCreate={async (name) => {
              let parentId: string | null = null;
              if (childEntity.level === 'sub') {
                parentId = mainNameToId[childEntity.key] || null; // parent is main
              } else if (childEntity.level === 'subsub') {
                // parent is the subcategory → need its id
                // Prefer the resolved cached id
                if (childEntityParentId) {
                  parentId = childEntityParentId;
                }
                const subKey = childEntity.key;
                let derivedMain: string | null = (childEntity.parentMain || null);
                // Try existing maps first (only if not found yet)
                if (!parentId) {
                  const parentMainForSub = Object.keys(subNameToIdByMain).find((m) =>
                    Boolean((subNameToIdByMain[m] || {})[childEntity.key])
                  );
                  if (parentMainForSub) {
                    const possible = (subNameToIdByMain[parentMainForSub] || {})[subKey] || null;
                    if (possible) parentId = possible;
                    if (!derivedMain) derivedMain = parentMainForSub;
                  }
                }

                // If still missing, derive main from current subcategories
                if (!parentId) {
                  if (!derivedMain) {
                    derivedMain = Object.keys(subcategories).find((m) =>
                      (subcategories[m] || []).includes(subKey)
                    ) || null;
                  }
                  if (derivedMain) {
                    const possible = (subNameToIdByMain[derivedMain] || {})[subKey] || null;
                    if (possible) parentId = possible;
                  }
                }

                // As a final fallback, fetch /tree to resolve the sub id and update maps
                if (!parentId) {
                  try {
                    const treeRes = await fetch(
                      'https://ic7x2avpej.execute-api.ap-south-1.amazonaws.com/Business_Categories_and_Coverage/tree',
                      { method: 'GET' }
                    );
                    if (treeRes.ok) {
                      const data = await treeRes.json().catch(() => ({} as any));
                      const tree = Array.isArray(data?.tree) ? (data.tree as any[]) : [];

                      // If main not known, try to discover it from tree
                      if (!derivedMain) {
                        for (const node of tree) {
                          const subs = Array.isArray(node?.children) ? node.children : [];
                          const found = subs.find(
                            (s: any) => s && typeof s.name === 'string' && s.name.trim() === subKey
                          );
                          if (found) {
                            derivedMain = typeof node?.name === 'string' ? node.name.trim() : '';
                            break;
                          }
                        }
                      }

                      if (derivedMain) {
                        const mainNode = tree.find(
                          (n: any) => n && typeof n.name === 'string' && n.name.trim() === derivedMain
                        );
                        if (mainNode) {
                          const subs = Array.isArray(mainNode.children) ? mainNode.children : [];
                          const map: Record<string, string> = {};
                          for (const s of subs) {
                            const n = s && typeof s.name === 'string' ? s.name.trim() : '';
                            const id = s && typeof s.id === 'string' ? s.id : '';
                            if (n && id && !map[n]) map[n] = id;
                          }
                          // update id map for that main
                          if (derivedMain) {
                            setSubNameToIdByMain((prev) => ({ ...prev, [derivedMain!]: map }));
                            parentId = map[subKey] || null;
                          }
                        }
                      }

                      // Absolute fallback: search full tree for a node with this name and use its id
                      if (!parentId) {
                        const findIdByName = (nodes: any[], target: string): string | null => {
                          for (const node of nodes) {
                            const nodeName = typeof node?.name === 'string' ? node.name.trim() : '';
                            if (nodeName === target) {
                              return typeof node?.id === 'string' ? node.id : null;
                            }
                            const children = Array.isArray(node?.children) ? node.children : [];
                            const found = findIdByName(children, target);
                            if (found) return found;
                          }
                          return null;
                        };
                        const resolved = findIdByName(tree, subKey);
                        if (resolved) parentId = resolved;
                      }
                    }
                  } catch (e) {
                    console.error('Failed to resolve sub id from /tree', e);
                  }
                }
              } else {
                // deep level → parent is the sub-sub item (childEntity.key)
                // Try to resolve id via subSubNameToIdBySub
                const parentSub = Object.keys(subSubcategories).find((p) =>
                  (subSubcategories[p] || []).includes(childEntity.key)
                ) || null;
                if (parentSub) {
                  parentId = (subSubNameToIdBySub[parentSub] || {})[childEntity.key] || null;
                }
                // Fallback: scan /tree to find this node and use its id
                if (!parentId) {
                  try {
                    const treeRes = await fetch(
                      'https://ic7x2avpej.execute-api.ap-south-1.amazonaws.com/Business_Categories_and_Coverage/tree',
                      { method: 'GET' }
                    );
                    if (treeRes.ok) {
                      const data = await treeRes.json().catch(() => ({} as any));
                      const tree = Array.isArray(data?.tree) ? (data.tree as any[]) : [];
                      const findIdByName = (nodes: any[], target: string): string | null => {
                        for (const node of nodes) {
                          const nodeName = typeof node?.name === 'string' ? node.name.trim() : '';
                          if (nodeName === target) return typeof node?.id === 'string' ? node.id : null;
                          const children = Array.isArray(node?.children) ? node.children : [];
                          const found = findIdByName(children, target);
                          if (found) return found;
                        }
                        return null;
                      };
                      const resolved = findIdByName(tree, childEntity.key);
                      if (resolved) parentId = resolved;
                    }
                  } catch (e) {
                    console.error('Failed to resolve deep parent id from /tree', e);
                  }
                }
              }
              if (childEntity.level === 'subsub' && !parentId) {
                alert(`Couldn't resolve parent id for "${childEntity.key}". Please try again in a second or open via Edit subcategories → Next.`);
                return;
              }
              if (childEntity.level === 'deep' && !parentId) {
                alert(`Couldn't resolve parent id for "${childEntity.key}". Please try again.`);
                return;
              }
              const res = await fetch('https://ic7x2avpej.execute-api.ap-south-1.amazonaws.com/Business_Categories_and_Coverage/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, parentId }),
              });
              if (!res.ok) throw new Error(await res.text());
              const json = await res.json().catch(() => ({} as any));
              const newId = json?.item?.id;
              // reflect in current modal list
              if (childEntity.level === 'sub') {
                setSubcategories((prev) => ({
                  ...prev,
                  [childEntity.key]: Array.from(new Set([...(prev[childEntity.key] || []), name]))
                }));
                if (newId) {
                  setSubNameToIdByMain((prev) => ({
                    ...prev,
                    [childEntity.key]: { ...(prev[childEntity.key] || {}), [name]: newId }
                  }));
                }
              } else if (childEntity.level === 'subsub') {
                setSubSubcategories((prev) => ({
                  ...prev,
                  [childEntity.key]: Array.from(new Set([...(prev[childEntity.key] || []), name]))
                }));
                if (newId) {
                  setSubSubNameToIdBySub((prev) => ({
                    ...prev,
                    [childEntity.key]: { ...(prev[childEntity.key] || {}), [name]: newId }
                  }));
                }
              } else {
                setExtraChildren((prev) => ({
                  ...prev,
                  [childEntity.key]: Array.from(new Set([...(prev[childEntity.key] || []), name]))
                }));
              }
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
                  // from sub -> go to subsub for selected sub; pass parent main name
                  const parentMain = Object.keys(subcategories).find((m) =>
                    (subcategories[m] || []).includes(selected)
                  ) || null;
                  setChildEntity(null);
                  openChildModal("subsub", selected, "sub", parentMain);
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
        )
      }


    </FormStep >
  );
};

export default Step4BusinessCategories;
