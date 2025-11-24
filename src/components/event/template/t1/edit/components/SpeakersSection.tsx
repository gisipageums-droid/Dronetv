import React, { useState, useEffect, useCallback, memo } from 'react';
import { Edit2, Save, X, Plus, Trash2, Edit } from 'lucide-react';

interface Speaker {
  name: string;
  company: string;
  id: number;
  avatar: string;
  title: string;
}

interface SpeakerDay {
  day: string;
  speakers: Speaker[];
}

interface SpeakersHeaderContent {
  sectionTitle: string;
  eventTitle: string;
  subtitle: string;
}

interface SpeakersDataContent {
  speakers: SpeakerDay[];
  headerContent: SpeakersHeaderContent;
}

interface SpeakersSectionProps {
  speakersData?: SpeakersDataContent;
  onStateChange?: (data: SpeakersDataContent) => void;
}

/** Default data structure */
const defaultSpeakersData: SpeakersDataContent = {
  speakers: [
    {
      "day": "Day 1 (Date)",
      "speakers": [
        {
          "name": "Speaker Name",
          "company": "Organization",
          "id": 1,
          "avatar": "Initials",
          "title": "Designation"
        }
      ]
    },
    {
      "day": "Day 2 (Date)",
      "speakers": []
    },
    {
      "day": "Day 3 (Date)",
      "speakers": []
    }
  ],
  "headerContent": {
    "sectionTitle": "Speakers",
    "eventTitle": "Professional Event",
    "subtitle": "Meet our distinguished speakers who will share their expertise and insights"
  }
};

/* Utility functions */
const getColorForAvatar = (name = '') => {
  const colors = [
    'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-cyan-500'
  ];
  const code = name.length ? name.charCodeAt(0) : 65;
  return colors[code % colors.length];
};

const getInitials = (name = '') => {
  if (!name) return 'NA';
  const parts = name.trim().split(/\s+/);
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].substring(0, 2).toUpperCase();
};

/* Speaker Card Component */
const SpeakerCard = memo(
  ({
    speaker, dayIndex, speakerIndex,
    isEditing, editForm, isEditMode,
    onEdit, onSave, onCancel, onDelete, onFormChange
  }: any) => {
    if (isEditing) {
      return (
        <div className="bg-white rounded-xl shadow-xl p-6">
          <div className="space-y-4">
            <div>
              <input
                value={editForm.name || ''}
                onChange={(e) => onFormChange({ ...editForm, name: e.target.value })}
                maxLength={50}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Speaker Name"
              />
              <div className="text-xs text-gray-500 text-right mt-1">
                {(editForm.name || '').length}/50
              </div>
            </div>
            <div>
              <input
                value={editForm.title || ''}
                onChange={(e) => onFormChange({ ...editForm, title: e.target.value })}
                maxLength={100}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Title"
              />
              <div className="text-xs text-gray-500 text-right mt-1">
                {(editForm.title || '').length}/100
              </div>
            </div>
            <div>
              <input
                value={editForm.company || ''}
                onChange={(e) => onFormChange({ ...editForm, company: e.target.value })}
                maxLength={100}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Company"
              />
              <div className="text-xs text-gray-500 text-right mt-1">
                {(editForm.company || '').length}/100
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={onSave} className="px-3 py-1 bg-green-600 text-white rounded-lg">
                <Save size={14} /> Done
              </button>
              <button onClick={onCancel} className="px-3 py-1 bg-gray-500 text-white rounded-lg">
                <X size={14} /> Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="group bg-white rounded-xl shadow-lg p-6 relative">
        {isEditMode && (
          <div className="absolute top-3 right-3 flex gap-1">
            <button onClick={onEdit} className="p-1 bg-blue-500 text-white rounded">
              <Edit2 size={14} />
            </button>
            <button onClick={onDelete} className="p-1 bg-red-500 text-white rounded">
              <Trash2 size={14} />
            </button>
          </div>
        )}

        <div className={`w-16 h-16 mx-auto rounded-xl ${getColorForAvatar(speaker.name)} text-white flex items-center justify-center text-xl font-bold`}>
          {speaker.avatar || getInitials(speaker.name)}
        </div>

        <h4 className="text-center font-bold mt-4">{speaker.name}</h4>
        {speaker.title && <p className="text-justify text-sm">{speaker.title}</p>}
        {speaker.company && <p className="text-justify text-sm text-gray-600">{speaker.company}</p>}
      </div>
    );
  }
);

const SpeakersSection: React.FC<SpeakersSectionProps> = ({ speakersData, onStateChange }) => {
  /* --------------------------
      MAIN STATE WITH DYNAMIC DATA
     -------------------------- */
  const [localSpeakersData, setLocalSpeakersData] = useState<SpeakersDataContent>(defaultSpeakersData);
  const [backupData, setBackupData] = useState<SpeakersDataContent>(defaultSpeakersData);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  /* --------------------------
      OTHER STATES
     -------------------------- */
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Speaker>>({});
  const [activeDay, setActiveDay] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

  // Auto-save timeout reference
  const autoSaveTimeoutRef = React.useRef<NodeJS.Timeout>();

  const { speakers, headerContent } = localSpeakersData;

  /* --------------------------
      Update local state when prop data changes
     -------------------------- */
  useEffect(() => {
    if (speakersData) {
      setLocalSpeakersData(speakersData);
      setBackupData(speakersData);
    }
  }, [speakersData]);

  /* --------------------------
      Auto-save function
     -------------------------- */
  const autoSave = useCallback(async () => {
    if (!onStateChange || !isEditMode) return;

    setIsSaving(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onStateChange(localSpeakersData);
    setLastSaved(new Date());
    setIsSaving(false);
  }, [localSpeakersData, isEditMode, onStateChange]);

  /* --------------------------
      Debounced auto-save effect
     -------------------------- */
  useEffect(() => {
    if (isEditMode && onStateChange) {
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
  }, [localSpeakersData, isEditMode, autoSave, onStateChange]);

  /* --------------------------
        Header Editing
     -------------------------- */
  const startHeaderEdit = () => {
    setBackupData(localSpeakersData);
    setIsEditMode(true);
  };

  const saveHeaderEdit = () => {
    setEditingCard(null);
    setEditForm({});
    setIsEditMode(false);
  };

  const cancelHeaderEdit = () => {
    setLocalSpeakersData(backupData);
    if (onStateChange) {
      onStateChange(backupData); // Sync with parent
    }
    setIsEditMode(false);
  };

  /* --------------------------
        Update Header Text
     -------------------------- */
  const updateHeaderField = (field: keyof SpeakersHeaderContent, value: string) => {
    const updatedData = {
      ...localSpeakersData,
      headerContent: { ...localSpeakersData.headerContent, [field]: value }
    };
    setLocalSpeakersData(updatedData);
  };

  /* --------------------------
        Update Speakers
     -------------------------- */
  const handleEdit = (dayIndex: number, speakerIndex: number, speaker: Speaker) => {
    setEditingCard(`${dayIndex}-${speakerIndex}`);
    setEditForm(speaker);
  };

  const handleSave = (dayIndex: number, speakerIndex: number) => {
    const updatedSpeakers = speakers.map((day, dIndex) =>
      dIndex === dayIndex
        ? {
            ...day,
            speakers: day.speakers.map((sp, sIndex) =>
              sIndex === speakerIndex
                ? { ...editForm, avatar: getInitials(editForm.name) } as Speaker
                : sp
            )
          }
        : day
    );

    const updatedData = {
      ...localSpeakersData,
      speakers: updatedSpeakers
    };

    setLocalSpeakersData(updatedData);
    setEditingCard(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingCard(null);
  };

  const handleDelete = (dayIndex: number, speakerIndex: number) => {
    const updatedSpeakers = speakers.map((day, dIndex) =>
      dIndex === dayIndex
        ? {
            ...day,
            speakers: day.speakers.filter((_, sIndex) => sIndex !== speakerIndex)
          }
        : day
    );

    const updatedData = {
      ...localSpeakersData,
      speakers: updatedSpeakers
    };

    setLocalSpeakersData(updatedData);
  };

  const handleAddSpeaker = (dayIndex: number) => {
    const newSpeaker: Speaker = {
      id: Date.now(),
      name: "New Speaker",
      title: "",
      company: "",
      avatar: "NS"
    };

    const updatedSpeakers = speakers.map((day, dIndex) =>
      dIndex === dayIndex
        ? { ...day, speakers: [...day.speakers, newSpeaker] }
        : day
    );

    const updatedData = {
      ...localSpeakersData,
      speakers: updatedSpeakers
    };

    setLocalSpeakersData(updatedData);

    const newIndex = speakers[dayIndex].speakers.length;
    setEditingCard(`${dayIndex}-${newIndex}`);
    setEditForm(newSpeaker);
  };

  /* --------------------------
          Day Editing
     -------------------------- */
  const handleDayEdit = (dayIndex: number, newValue: string) => {
    const updatedSpeakers = speakers.map((day, dIndex) =>
      dIndex === dayIndex
        ? { ...day, day: newValue }
        : day
    );

    const updatedData = {
      ...localSpeakersData,
      speakers: updatedSpeakers
    };

    setLocalSpeakersData(updatedData);
  };

  const handleAddDay = () => {
    const newDay: SpeakerDay = {
      day: `Day ${speakers.length + 1} (New Date)`,
      speakers: []
    };

    const updatedData = {
      ...localSpeakersData,
      speakers: [...speakers, newDay]
    };

    setLocalSpeakersData(updatedData);
    setActiveDay(speakers.length);
  };

  const handleRemoveDay = (dayIndex: number) => {
    if (speakers.length <= 1) return;

    const updatedSpeakers = speakers.filter((_, index) => index !== dayIndex);

    const updatedData = {
      ...localSpeakersData,
      speakers: updatedSpeakers
    };

    setLocalSpeakersData(updatedData);
    setActiveDay(Math.max(0, dayIndex - 1));
  };

  /* --------------------------
            Render UI
     -------------------------- */
  return (
    <section id="speakers" className="py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl relative">
        
        {/* Header */}
        <div className="text-center mb-16">
          {isEditMode ? (
            <div className="max-w-3xl mx-auto space-y-4">
              <div>
                <input
                  type="text"
                  value={headerContent.eventTitle}
                  onChange={(e) => updateHeaderField("eventTitle", e.target.value)}
                  maxLength={100}
                  className="w-full text-4xl font-bold px-4 py-3 border rounded-xl"
                />
                <div className="text-sm text-gray-500 text-right mt-1">
                  {headerContent.eventTitle.length}/100
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={headerContent.sectionTitle}
                  onChange={(e) => updateHeaderField("sectionTitle", e.target.value)}
                  maxLength={100}
                  className="w-full text-2xl font-bold px-4 py-3 border rounded-xl"
                />
                <div className="text-sm text-gray-500 text-right mt-1">
                  {headerContent.sectionTitle.length}/100
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={headerContent.subtitle}
                  onChange={(e) => updateHeaderField("subtitle", e.target.value)}
                  maxLength={200}
                  className="w-full text-lg px-4 py-3 border rounded-xl"
                />
                <div className="text-sm text-gray-500 text-right mt-1">
                  {headerContent.subtitle.length}/200
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-5xl font-bold">
                <span className="text-yellow-500">{headerContent.eventTitle}</span>
                <span className="block text-3xl text-gray-800">{headerContent.sectionTitle}</span>
              </h2>
              <p className="text-gray-600 mt-4 text-justify">{headerContent.subtitle}</p>
            </>
          )}

          {/* Edit Buttons */}
          <div className="absolute top-0 right-0 flex gap-2 items-center">
            {/* Auto-save status */}
            {isEditMode && onStateChange && (
              <div className="text-sm text-gray-600 mr-2 bg-white/80 px-3 py-1 rounded-lg hidden sm:block">
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
            
            {isEditMode ? (
              <>
                <button onClick={saveHeaderEdit} className="px-6 py-3 bg-blue-600 text-white rounded-xl">
                  <Save size={18} /> Done
                </button>
                <button onClick={cancelHeaderEdit} className="px-6 py-3 bg-red-500 text-white rounded-xl">
                  <X size={18} /> Cancel
                </button>
              </>
            ) : (
              <button onClick={startHeaderEdit} className="px-6 py-3 bg-green-500 text-white rounded-xl">
                <Edit size={18} /> Edit
              </button>
            )}
          </div>
        </div>

        {/* Day Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white shadow-lg p-2 rounded-2xl flex gap-2">
            {speakers.map((day, index) => (
              <div key={index} className="relative">
                {isEditMode ? (
                  <div>
                    <input
                      value={day.day}
                      onChange={(e) => handleDayEdit(index, e.target.value)}
                      onClick={() => setActiveDay(index)}
                      maxLength={50}
                      className={`px-6 py-3 rounded-xl border ${
                        activeDay === index ? 'bg-yellow-500 text-white' : ''
                      }`}
                    />
                    <div className="text-xs text-gray-500 text-right mt-1">
                      {day.day.length}/50
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveDay(index)}
                    className={`px-6 py-3 rounded-xl ${
                      activeDay === index ? 'bg-yellow-500 text-white' : ''
                    }`}
                  >
                    {day.day}
                  </button>
                )}

                {isEditMode && speakers.length > 1 && (
                  <button
                    onClick={() => handleRemoveDay(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {isEditMode && (
            <button
              onClick={handleAddDay}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-full"
            >
              <Plus size={16} /> Add Day
            </button>
          )}
        </div>

        {/* Speakers Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold">{speakers[activeDay]?.day}</h3>

            {isEditMode && (
              <button
                onClick={() => handleAddSpeaker(activeDay)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                <Plus size={16} /> Add Speaker
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {speakers[activeDay]?.speakers.map((speaker, index) => (
              <SpeakerCard
                key={speaker.id}
                speaker={speaker}
                dayIndex={activeDay}
                speakerIndex={index}
                isEditing={editingCard === `${activeDay}-${index}`}
                editForm={editForm}
                isEditMode={isEditMode}
                onEdit={() => handleEdit(activeDay, index, speaker)}
                onSave={() => handleSave(activeDay, index)}
                onCancel={handleCancel}
                onDelete={() => handleDelete(activeDay, index)}
                onFormChange={(data) => setEditForm(data)}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default SpeakersSection;