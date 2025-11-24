import React, { useState, useEffect, useCallback } from "react";
import { Edit, Save, X } from "lucide-react";

interface AboutSectionProps {
  aboutData?: {
    heading: string;
    subText: string;
    features: {
      title: string;
      description: string;
    }[];
    zonesTitle: string;
    zonesTitleHighlight: string;
    zonesSubtitle: string;
    zones: {
      title: string;
      description: string;
    }[];
  };
  onStateChange?: (data: any) => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({ aboutData, onStateChange }) => {
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save timeout reference
  const autoSaveTimeoutRef = React.useRef<NodeJS.Timeout>();

  // Default data structure
  const defaultAboutContent = {
    heading: "demo Event",
    subText: "Create 2-3 sentence event description",
    features: [
      {
        title: "Feature 1",
        description: "Feature description"
      }
    ],
    zonesTitle: "Special",
    zonesTitleHighlight: "Zones",
    zonesSubtitle: "Discover specialized areas designed for different aspects of the event.",
    zones: [
      {
        title: "Zone Title",
        description: "Zone description"
      }
    ]
  };

  const [aboutContent, setAboutContent] = useState(defaultAboutContent);
  const [backupContent, setBackupContent] = useState(defaultAboutContent);

  // Update local state when prop data changes
  useEffect(() => {
    if (aboutData) {
      setAboutContent(aboutData);
      setBackupContent(aboutData);
    }
  }, [aboutData]);

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (!onStateChange || !editMode) return;

    setIsSaving(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onStateChange(aboutContent);
    setLastSaved(new Date());
    setIsSaving(false);
  }, [aboutContent, editMode, onStateChange]);

  // Debounced auto-save effect
  useEffect(() => {
    if (editMode && onStateChange) {
      // Clear existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Set new timeout for auto-save (1 second debounce)
      autoSaveTimeoutRef.current = setTimeout(() => {
        autoSave();
      }, 1000);

      // Cleanup timeout on unmount or when dependencies change
      return () => {
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
        }
      };
    }
  }, [aboutContent, editMode, autoSave, onStateChange]);

  const handleEditToggle = () => {
    if (!editMode) {
      setBackupContent(aboutContent); // store before edit
    }
    setEditMode(!editMode);
  };

  const handleCancel = () => {
    setAboutContent(backupContent); // restore backup
    if (onStateChange) {
      onStateChange(backupContent); // Sync with parent
    }
    setEditMode(false);
  };

  // Function to add a new feature
  const addFeature = () => {
    const newFeatures = [...aboutContent.features, { title: "New Feature", description: "Feature description" }];
    setAboutContent({ ...aboutContent, features: newFeatures });
  };

  // Function to remove a feature
  const removeFeature = (index: number) => {
    const newFeatures = aboutContent.features.filter((_, i) => i !== index);
    setAboutContent({ ...aboutContent, features: newFeatures });
  };

  // Function to add a new zone
  const addZone = () => {
    const newZones = [...aboutContent.zones, { title: "New Zone", description: "Zone description" }];
    setAboutContent({ ...aboutContent, zones: newZones });
  };

  // Function to remove a zone
  const removeZone = (index: number) => {
    const newZones = aboutContent.zones.filter((_, i) => i !== index);
    setAboutContent({ ...aboutContent, zones: newZones });
  };

  // Helper function to update feature
  const updateFeature = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...aboutContent.features];
    updated[index][field] = value;
    setAboutContent({ ...aboutContent, features: updated });
  };

  // Helper function to update zone
  const updateZone = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...aboutContent.zones];
    updated[index][field] = value;
    setAboutContent({ ...aboutContent, zones: updated });
  };

  return (
    <section id="about" className="py-20 bg-white text-justify">
      <div className="relative container max-w-7xl mx-auto px-4">
        {/* Edit / Save / Cancel */}
        <div className="absolute top-0 right-2 z-30 flex gap-3 items-center">
          {/* Auto-save status */}
          {editMode && onStateChange && (
            <div className="text-sm text-gray-600 mr-2 bg-gray-100 px-3 py-1 rounded-lg hidden sm:block">
              {isSaving ? (
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  Saving...
                </span>
              ) : lastSaved ? (
                <span>Auto-saved {lastSaved.toLocaleTimeString()}</span>
              ) : null}
            </div>
          )}
          
          {editMode ? (
            <>
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                <Save size={18} /> Done
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                <X size={18} /> Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEditToggle}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg border border-white/30 hover:bg-green-600 transition"
            >
              <Edit size={18} /> Edit
            </button>
          )}
        </div>

        {/* Heading */}
        <div className="text-center mb-16">
          {editMode ? (
            <div className="mb-4">
              <input
                type="text"
                value={aboutContent.heading}
                onChange={(e) =>
                  setAboutContent({ ...aboutContent, heading: e.target.value })
                }
                maxLength={100}
                className="text-4xl md:text-5xl font-bold text-black px-3 py-2 rounded-md w-full max-w-4xl mx-auto border border-gray-300"
              />
              <div className="text-sm text-gray-500 text-right max-w-4xl mx-auto mt-1">
                {aboutContent.heading.length}/100
              </div>
            </div>
          ) : (
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              {aboutContent.heading}
            </h2>
          )}
          <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-6"></div>

          {editMode ? (
            <div className="max-w-4xl mx-auto">
              <textarea
                value={aboutContent.subText}
                onChange={(e) =>
                  setAboutContent({ ...aboutContent, subText: e.target.value })
                }
                maxLength={500}
                className="text-gray-600 text-lg leading-relaxed w-full border border-gray-300 px-3 py-2 rounded-md resize-y"
                rows={3}
              />
              <div className="text-sm text-gray-500 text-right mt-1">
                {aboutContent.subText.length}/500
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-lg max-w-4xl mx-auto leading-relaxed text-justify">
              {aboutContent.subText}
            </p>
          )}
        </div>

        {/* Features Section */}
        <div className="mb-12">
          {editMode && (
            <div className="text-center mb-6">
              <button
                onClick={addFeature}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                + Add Feature
              </button>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
            {aboutContent.features.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl border-[solid] border-[black] border-[1px] shadow-md hover:bg-[#FFD400] hover:text-black transition-all duration-300 relative"
              >
                {editMode && (
                  <button
                    onClick={() => removeFeature(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                )}
                
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FF0000] text-white mb-4 text-xl font-bold">
                  {item.title.charAt(0).toUpperCase()}
                </div>
                
                {editMode ? (
                  <div className="mb-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateFeature(index, 'title', e.target.value)}
                      maxLength={100}
                      className="text-xl font-semibold px-2 py-1 rounded-md w-full border border-gray-300"
                    />
                    <div className="text-xs text-gray-500 text-right mt-1">
                      {item.title.length}/100
                    </div>
                  </div>
                ) : (
                  <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                )}
                
                {editMode ? (
                  <div>
                    <textarea
                      value={item.description}
                      onChange={(e) => updateFeature(index, 'description', e.target.value)}
                      maxLength={200}
                      className="text-gray-600 w-full px-2 py-1 rounded-md border border-gray-300 resize-y"
                      rows={3}
                    />
                    <div className="text-xs text-gray-500 text-right mt-1">
                      {item.description.length}/200
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Zones Section */}
        <div className="text-center mb-16">
          {editMode ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div>
                  <input
                    type="text"
                    value={aboutContent.zonesTitle}
                    onChange={(e) => setAboutContent({ ...aboutContent, zonesTitle: e.target.value })}
                    maxLength={50}
                    className="text-3xl font-bold text-[#FFD400] bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none text-center"
                  />
                  <div className="text-xs text-gray-500 text-right mt-1">
                    {aboutContent.zonesTitle.length}/50
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={aboutContent.zonesTitleHighlight}
                    onChange={(e) => setAboutContent({ ...aboutContent, zonesTitleHighlight: e.target.value })}
                    maxLength={50}
                    className="text-3xl font-bold text-black bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none text-center"
                  />
                  <div className="text-xs text-gray-500 text-right mt-1">
                    {aboutContent.zonesTitleHighlight.length}/50
                  </div>
                </div>
              </div>

              <div className="max-w-3xl mx-auto text-justify">
                <textarea
                  value={aboutContent.zonesSubtitle}
                  onChange={(e) => setAboutContent({ ...aboutContent, zonesSubtitle: e.target.value })}
                  maxLength={200}
                  className="text-gray-600 text-lg bg-transparent border-2 border-gray-300 focus:border-blue-500 outline-none p-2 rounded-md w-full resize-none"
                  rows={2}
                />
                <div className="text-sm text-gray-600 mt-1">
                  {aboutContent.zonesSubtitle.length}/200
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-3xl font-bold text-black mb-4">
                <span className="text-[#FFD400]">{aboutContent.zonesTitle}</span> {aboutContent.zonesTitleHighlight}
              </h3>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto text-justify">
                {aboutContent.zonesSubtitle}
              </p>
            </>
          )}
        </div>

        <div className="mb-12">
          {editMode && (
            <div className="text-center mb-6">
              <button
                onClick={addZone}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                + Add Zone
              </button>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-10">
            {aboutContent.zones.map((zone, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md border-[solid] border-[1px] border-yellow-400 hover:shadow-xl transition-all relative"
              >
                {editMode && (
                  <button
                    onClick={() => removeZone(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                )}
                
                {editMode ? (
                  <div className="mb-2">
                    <input
                      type="text"
                      value={zone.title}
                      onChange={(e) => updateZone(index, 'title', e.target.value)}
                      maxLength={100}
                      className="text-xl font-semibold text-[#FF0000] px-2 py-1 rounded-md w-full border border-gray-300"
                    />
                    <div className="text-xs text-gray-500 text-right mt-1">
                      {zone.title.length}/100
                    </div>
                  </div>
                ) : (
                  <h4 className="text-xl font-semibold text-[#FF0000] mb-2">
                    {zone.title}
                  </h4>
                )}
                
                {editMode ? (
                  <div>
                    <textarea
                      value={zone.description}
                      onChange={(e) => updateZone(index, 'description', e.target.value)}
                      maxLength={200}
                      className="text-gray-700 w-full px-2 py-1 rounded-md border border-gray-300 resize-y"
                      rows={3}
                    />
                    <div className="text-xs text-gray-500 text-right mt-1">
                      {zone.description.length}/200
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed">{zone.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;