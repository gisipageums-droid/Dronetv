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
            <input
              value={editForm.name || ''}
              onChange={(e) => onFormChange({ ...editForm, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Speaker Name"
            />
            <input
              value={editForm.title || ''}
              onChange={(e) => onFormChange({ ...editForm, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Title"
            />
            <input
              value={editForm.company || ''}
              onChange={(e) => onFormChange({ ...editForm, company: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Company"
            />
            <div className="flex gap-2">
              <button onClick={onSave} className="px-3 py-1 bg-green-600 text-white rounded-lg">
                <Save size={14} /> Save
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
        {speaker.title && <p className="text-center text-sm">{speaker.title}</p>}
        {speaker.company && <p className="text-center text-sm text-gray-600">{speaker.company}</p>}
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

  /* --------------------------
      OTHER STATES
     -------------------------- */
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Speaker>>({});
  const [activeDay, setActiveDay] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

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
      Notify parent of state changes
     -------------------------- */
  const notifyParent = useCallback((data: SpeakersDataContent) => {
    if (onStateChange) {
      onStateChange(data);
    }
  }, [onStateChange]);

  /* --------------------------
        Header Editing
     -------------------------- */
  const startHeaderEdit = () => {
    setBackupData(localSpeakersData);
    setIsEditMode(true);
  };

  const saveHeaderEdit = () => {
    notifyParent(localSpeakersData);
    setEditingCard(null);
    setEditForm({});
    setIsEditMode(false);
  };

  const cancelHeaderEdit = () => {
    setLocalSpeakersData(backupData);
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
    notifyParent(updatedData);
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
    notifyParent(updatedData);
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
    notifyParent(updatedData);

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
    notifyParent(updatedData);
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
    notifyParent(updatedData);
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
    notifyParent(updatedData);
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
              
              <input
                type="text"
                value={headerContent.eventTitle}
                onChange={(e) => updateHeaderField("eventTitle", e.target.value)}
                className="w-full text-4xl font-bold px-4 py-3 border rounded-xl"
              />

              <input
                type="text"
                value={headerContent.sectionTitle}
                onChange={(e) => updateHeaderField("sectionTitle", e.target.value)}
                className="w-full text-2xl font-bold px-4 py-3 border rounded-xl"
              />

              <input
                type="text"
                value={headerContent.subtitle}
                onChange={(e) => updateHeaderField("subtitle", e.target.value)}
                className="w-full text-lg px-4 py-3 border rounded-xl"
              />

            </div>
          ) : (
            <>
              <h2 className="text-5xl font-bold">
                <span className="text-yellow-500">{headerContent.eventTitle}</span>
                <span className="block text-3xl text-gray-800">{headerContent.sectionTitle}</span>
              </h2>
              <p className="text-gray-600 mt-4">{headerContent.subtitle}</p>
            </>
          )}

          {/* Edit Buttons */}
          <div className="absolute top-0 right-0 flex gap-2">
            {isEditMode ? (
              <>
                <button onClick={saveHeaderEdit} className="px-6 py-3 bg-blue-600 text-white rounded-xl">
                  <Save size={18} />
                </button>
                <button onClick={cancelHeaderEdit} className="px-6 py-3 bg-red-500 text-white rounded-xl">
                  <X size={18} />
                </button>
              </>
            ) : (
              <button onClick={startHeaderEdit} className="px-6 py-3 bg-green-500 text-white rounded-xl">
                <Edit size={18} />
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
                  <input
                    value={day.day}
                    onChange={(e) => handleDayEdit(index, e.target.value)}
                    onClick={() => setActiveDay(index)}
                    className={`px-6 py-3 rounded-xl border ${
                      activeDay === index ? 'bg-yellow-500 text-white' : ''
                    }`}
                  />
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