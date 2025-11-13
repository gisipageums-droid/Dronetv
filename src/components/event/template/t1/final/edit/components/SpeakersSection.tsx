import React, { useState, useCallback, memo } from 'react';
import { Edit2, Save, X, Plus, Trash2, Edit } from 'lucide-react';

/** initial data (you can move this to a JSON file or fetch from API) */
const initialSpeakers = [
  {
    day: "Day 1 (24th April'25)",
    speakers: [
      { id: 1, name: "Commodore Santosh", title: "Executive Director", company: "ECIL, Hyderabad", avatar: "CS" },
      { id: 2, name: "Dr. Nagendra Babu", title: "", company: "Zen Technologies", avatar: "NB" },
      { id: 3, name: "Dr. Samir V. Kamat", title: "Chairman", company: "DRDO", avatar: "SK" },
      { id: 4, name: "Lt. Gen. Manish Erry", title: "AVSM, SM", company: "DG Strategic Planning", avatar: "ME" },
      { id: 5, name: "Lt. Gen. Neeraj Varshney", title: "VSM", company: "Commandant MCEME", avatar: "NV" },
      { id: 6, name: "Lt. Gen. V.G. Khandare", title: "PVSM, AVSM, SM", company: "Principal Advisor (USG), Dept. of Defence", avatar: "VK" },
      { id: 7, name: "Maj Gen (Dr.) RK Raina", title: "Director", company: "SISDSS", avatar: "RR" },
      { id: 8, name: "Maj Gen MLN Sravan Kumar (Retd)", title: "", company: "", avatar: "SK" }
    ]
  },
  {
    day: "Day 2 (25th April'25)",
    speakers: [
      { id: 15, name: "Col Harison Verma (Retd.)", title: "COO", company: "Aerospace Services India Ltd", avatar: "HV" },
      { id: 16, name: "Dr. (Smt.) Chandrika Kaushik", title: "DG PC & SI", company: "DRDO", avatar: "CK" },
      { id: 17, name: "Dr. Girish Kant Pandey", title: "Principal", company: "Govt. KRD College", avatar: "GP" },
      { id: 18, name: "Dr. P. Rajalakshmi", title: "", company: "NMICPS TiHAN Foundation, IIT Hyderabad", avatar: "PR" },
      { id: 19, name: "Dr. Sangita Rao Achary Addanki", title: "", company: "DLIC, DRDO", avatar: "SA" },
      { id: 20, name: "Lt. Gen. Sanjay Verma", title: "PVSM, AVSM, VSM, Bar to VSM", company: "", avatar: "SV" }
    ]
  },
  {
    day: "Day 3 (26th April'25)",
    speakers: [
      { id: 28, name: "Dr Pranay Kumar", title: "", company: "", avatar: "PK" },
      { id: 29, name: "Dr. Sunil Khetarpal", title: "Director", company: "Association of Healthcare Providers India", avatar: "SK" },
      { id: 30, name: "Mr. Anuraag Tiwari", title: "Director", company: "GKD Tactix.ai", avatar: "AT" },
      { id: 31, name: "Mr. Arul Rajesh Gedala", title: "Race director", company: "FPV India", avatar: "AG" },
      { id: 32, name: "Mr. Sanjay Kumar", title: "Co-Founder", company: "EON Space Labs Pvt. Ltd.", avatar: "SK" },
      { id: 33, name: "Mr. Vishal Saurav", title: "CEO-founder", company: "XBOOM", avatar: "VS" }
    ]
  }
];

// Utility functions
const getColorForAvatar = (name = '') => {
  const colors = [
    'bg-purple-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-cyan-500'
  ];
  const code = name && name.length ? name.charCodeAt(0) : 65;
  const idx = code % colors.length;
  return colors[idx];
};

const getInitials = (name = '') => {
  if (!name) return 'NA';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

// Memoized SpeakerCard component to prevent unnecessary re-renders
const SpeakerCard = memo(({ 
  speaker, 
  dayIndex, 
  speakerIndex, 
  isEditing, 
  editForm,
  isEditMode,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onFormChange
}) => {
  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-400 transition-all duration-300">
        <div className="space-y-4">
          <input
            type="text"
            value={editForm.name || ''}
            onChange={(e) => onFormChange({ ...editForm, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
            placeholder="Speaker Name"
            autoFocus
          />
          <input
            type="text"
            value={editForm.title || ''}
            onChange={(e) => onFormChange({ ...editForm, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
            placeholder="Title"
          />
          <input
            type="text"
            value={editForm.company || ''}
            onChange={(e) => onFormChange({ ...editForm, company: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
            placeholder="Company"
          />
          <div className="flex gap-2">
            <button
              onClick={onSave}
              className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              <Save size={14} />
              Save
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 h-full border border-gray-100 hover:border-gray-200 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-100 rounded-full -translate-y-10 translate-x-10 opacity-50 group-hover:opacity-70 transition-opacity"></div>
      
      {/* Edit controls */}
      {isEditMode && (
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <button
            onClick={onEdit}
            className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
            title="Edit speaker"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
            title="Delete speaker"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}

      <div className="relative z-10">
        {/* Avatar */}
        <div className={`w-16 h-16 rounded-2xl ${getColorForAvatar(speaker.name)} text-white flex items-center justify-center mx-auto font-bold text-lg mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
          {speaker.avatar && speaker.avatar.length > 0
            ? speaker.avatar
            : getInitials(speaker.name)}
        </div>

        {/* Content */}
        <div className="text-center space-y-2">
          <h4 className="text-lg font-bold text-gray-800 leading-tight">{speaker.name}</h4>
          {speaker.title && (
            <p className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full inline-block">
              {speaker.title}
            </p>
          )}
          {speaker.company && (
            <p className="text-sm text-gray-600 leading-relaxed">{speaker.company}</p>
          )}
        </div>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-yellow-400 transition-all pointer-events-none"></div>
    </div>
  );
});

const SpeakersSection: React.FC = () => {
  const [speakersData, setSpeakersData] = useState(initialSpeakers);
  const [editingCard, setEditingCard] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [activeDay, setActiveDay] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [headerContent, setHeaderContent] = useState({
    eventTitle: 'Drone Expo 2025',
    sectionTitle: 'Speakers',
    subtitle: 'Meet our distinguished speakers who will share their expertise and insights'
  });
  const [headerBackup, setHeaderBackup] = useState(headerContent);
  
  const [statsContent, setStatsContent] = useState({
    totalSpeakersLabel: 'Total Speakers',
    totalSpeakersValue: null as number | null, // null means use computed value
    eventDaysLabel: 'Event Days',
    eventDaysValue: null as number | null, // null means use computed value
    speakersTodayLabel: 'Speakers Today',
    speakersTodayValue: null as number | null // null means use computed value
  });
  const [statsBackup, setStatsBackup] = useState(statsContent);

  // Memoized callback functions to prevent unnecessary re-renders
  const handleEdit = useCallback((dayIndex, speakerIndex, speaker) => {
    setEditingCard(`${dayIndex}-${speakerIndex}`);
    setEditForm({ ...speaker });
  }, []);

  const handleSave = useCallback((dayIndex, speakerIndex) => {
    const updatedSpeaker = {
      ...editForm,
      avatar: getInitials(editForm.name)
    };

    setSpeakersData(prev =>
      prev.map((d, di) =>
        di === dayIndex
          ? {
              ...d,
              speakers: d.speakers.map((s, si) =>
                si === speakerIndex ? updatedSpeaker : s
              )
            }
          : d
      )
    );

    setEditingCard(null);
    setEditForm({});
  }, [editForm]);

  const handleCancel = useCallback(() => {
    setEditingCard(null);
    setEditForm({});
  }, []);

  const handleDelete = useCallback((dayIndex, speakerIndex) => {
    setSpeakersData(prev =>
      prev.map((d, di) =>
        di === dayIndex
          ? { ...d, speakers: d.speakers.filter((_, si) => si !== speakerIndex) }
          : d
      )
    );
  }, []);

  const handleAddSpeaker = useCallback((dayIndex) => {
    const ids = speakersData.flatMap(d => d.speakers.map(s => s.id || 0));
    const maxId = ids.length ? Math.max(...ids) : 0;
    const newId = maxId + 1;
    const newSpeaker = {
      id: newId,
      name: "New Speaker",
      title: "",
      company: "",
      avatar: "NS"
    };

    setSpeakersData(prev =>
      prev.map((d, di) =>
        di === dayIndex ? { ...d, speakers: [...d.speakers, newSpeaker] } : d
      )
    );

    const newIndex = (speakersData[dayIndex]?.speakers.length ?? 0);
    setEditingCard(`${dayIndex}-${newIndex}`);
    setEditForm({ ...newSpeaker });
  }, [speakersData]);

  const handleFormChange = useCallback((newFormData) => {
    setEditForm(newFormData);
  }, []);

  const startHeaderEdit = useCallback(() => {
    setHeaderBackup(headerContent);
    setIsEditMode(true);
  }, [headerContent]);

  const saveHeaderEdit = useCallback(() => {
    setEditingCard(null);
    setEditForm({});
    setIsEditMode(false);
  }, []);

  const cancelHeaderEdit = useCallback(() => {
    setHeaderContent(headerBackup);
    setEditingCard(null);
    setEditForm({});
    setIsEditMode(false);
  }, [headerBackup]);

  // Computed stats
  const totalSpeakers = speakersData.reduce((acc, d) => acc + (d.speakers?.length || 0), 0);
  const eventDays = speakersData.length;
  const speakersToday = speakersData[activeDay]?.speakers?.length || 0;
  
  // Handle day name editing
  const handleDayEdit = (dayIndex: number, newDayName: string) => {
    setSpeakersData(prev => 
      prev.map((day, index) => 
        index === dayIndex ? { ...day, day: newDayName } : day
      )
    );
  };

  // Add new day
  const handleAddDay = () => {
    const newDayNumber = speakersData.length + 1;
    const newDay = {
      day: `Day ${newDayNumber} (New Date)`,
      speakers: []
    };
    
    setSpeakersData(prev => [...prev, newDay]);
    setActiveDay(speakersData.length); // Set to the new day index
  };

  // Remove day
  const handleRemoveDay = (dayIndex: number) => {
    if (speakersData.length <= 1) return; // Don't remove if it's the last day
    
    setSpeakersData(prev => prev.filter((_, index) => index !== dayIndex));
    
    // Adjust active day if necessary
    if (activeDay >= speakersData.length - 1) {
      setActiveDay(Math.max(0, speakersData.length - 2));
    } else if (activeDay > dayIndex) {
      setActiveDay(activeDay - 1);
    }
  };

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
                onChange={(e) => setHeaderContent({ ...headerContent, eventTitle: e.target.value })}
                className="w-full text-4xl md:text-5xl font-bold px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Event Title"
              />
              <input
                type="text"
                value={headerContent.sectionTitle}
                onChange={(e) => setHeaderContent({ ...headerContent, sectionTitle: e.target.value })}
                className="w-full text-2xl md:text-3xl font-bold px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Section Title"
              />
              <input
                type="text"
                value={headerContent.subtitle}
                onChange={(e) => setHeaderContent({ ...headerContent, subtitle: e.target.value })}
                className="w-full text-base md:text-lg px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Subtitle"
              />
            </div>
          ) : (
            <>
              <h2 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="text-yellow-500">
                  {headerContent.eventTitle}
                </span>
                <span className="block text-gray-800 text-3xl md:text-4xl mt-2">{headerContent.sectionTitle}</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-4">
                {headerContent.subtitle}
              </p>
            </>
          )}
          
          {/* Edit Actions */}
          <div className="absolute top-0 right-0 flex gap-2">
            {isEditMode ? (
              <>
                <button
                  onClick={saveHeaderEdit}
                  className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                >
                  <span className='flex items-center gap-2'>
                    <Save size={18} /> Save
                  </span>
                </button>
                <button
                  onClick={cancelHeaderEdit}
                  className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 bg-red-500 hover:bg-red-600 text-white shadow-lg"
                >
                  <span className='flex items-center gap-2'>
                    <X size={18} /> Cancel
                  </span>
                </button>
              </>
            ) : (
              <button
                onClick={startHeaderEdit}
                className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 bg-green-500 hover:bg-green-600 text-white shadow-lg"
              >
                <span className='flex items-center gap-2'>
                  <Edit size={18} /> Edit
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Day Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2">
              {speakersData.map((dayGroup, index) => (
                <div key={index} className="relative">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={dayGroup.day}
                      onChange={(e) => handleDayEdit(index, e.target.value)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 border-2 outline-none ${
                        activeDay === index
                          ? 'bg-yellow-500 text-white border-yellow-600'
                          : 'text-gray-600 border-gray-300 focus:border-yellow-400'
                      }`}
                      onClick={() => setActiveDay(index)}
                    />
                  ) : (
                    <button
                      onClick={() => setActiveDay(index)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        activeDay === index
                          ? 'bg-yellow-500 text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      {dayGroup.day}
                    </button>
                  )}
                  {isEditMode && speakersData.length > 1 && (
                    <button
                      onClick={() => handleRemoveDay(index)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors flex items-center justify-center"
                      title="Remove Day"
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
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md"
                title="Add New Day"
              >
                <Plus size={16} />
                Add Day
              </button>
            )}
          </div>
        </div>

        {/* Speakers Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-gray-800">
              {speakersData[activeDay]?.day}
            </h3>
            {isEditMode && (
              <button
                onClick={() => handleAddSpeaker(activeDay)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md"
              >
                <Plus size={16} />
                Add Speaker
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {speakersData[activeDay]?.speakers.map((speaker, speakerIndex) => (
              <SpeakerCard
                key={`${speaker.id}-${activeDay}-${speakerIndex}`}
                speaker={speaker}
                dayIndex={activeDay}
                speakerIndex={speakerIndex}
                isEditing={editingCard === `${activeDay}-${speakerIndex}`}
                editForm={editForm}
                isEditMode={isEditMode}
                onEdit={() => handleEdit(activeDay, speakerIndex, speaker)}
                onSave={() => handleSave(activeDay, speakerIndex)}
                onCancel={handleCancel}
                onDelete={() => handleDelete(activeDay, speakerIndex)}
                onFormChange={handleFormChange}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 bg-yellow-500 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              {isEditMode ? (
                <input
                  type="number"
                  value={statsContent.totalSpeakersValue || totalSpeakers}
                  onChange={(e) => setStatsContent({ ...statsContent, totalSpeakersValue: parseInt(e.target.value) || 0 })}
                  className="text-3xl font-bold mb-2 bg-transparent border-b-2 border-yellow-300 focus:border-white outline-none text-center text-white w-20 mx-auto"
                />
              ) : (
                <div className="text-3xl font-bold mb-2">{statsContent.totalSpeakersValue || totalSpeakers}</div>
              )}
              {isEditMode ? (
                <input
                  type="text"
                  value={statsContent.totalSpeakersLabel}
                  onChange={(e) => setStatsContent({ ...statsContent, totalSpeakersLabel: e.target.value })}
                  className="text-yellow-100 bg-transparent border-b border-yellow-300 focus:border-white outline-none text-center"
                />
              ) : (
                <div className="text-yellow-100">{statsContent.totalSpeakersLabel}</div>
              )}
            </div>
            <div>
              {isEditMode ? (
                <input
                  type="number"
                  value={statsContent.eventDaysValue || eventDays}
                  onChange={(e) => setStatsContent({ ...statsContent, eventDaysValue: parseInt(e.target.value) || 0 })}
                  className="text-3xl font-bold mb-2 bg-transparent border-b-2 border-yellow-300 focus:border-white outline-none text-center text-white w-20 mx-auto"
                />
              ) : (
                <div className="text-3xl font-bold mb-2">{statsContent.eventDaysValue || eventDays}</div>
              )}
              {isEditMode ? (
                <input
                  type="text"
                  value={statsContent.eventDaysLabel}
                  onChange={(e) => setStatsContent({ ...statsContent, eventDaysLabel: e.target.value })}
                  className="text-yellow-100 bg-transparent border-b border-yellow-300 focus:border-white outline-none text-center"
                />
              ) : (
                <div className="text-yellow-100">{statsContent.eventDaysLabel}</div>
              )}
            </div>
            <div>
              {isEditMode ? (
                <input
                  type="number"
                  value={statsContent.speakersTodayValue || speakersToday}
                  onChange={(e) => setStatsContent({ ...statsContent, speakersTodayValue: parseInt(e.target.value) || 0 })}
                  className="text-3xl font-bold mb-2 bg-transparent border-b-2 border-yellow-300 focus:border-white outline-none text-center text-white w-20 mx-auto"
                />
              ) : (
                <div className="text-3xl font-bold mb-2">{statsContent.speakersTodayValue || speakersToday}</div>
              )}
              {isEditMode ? (
                <input
                  type="text"
                  value={statsContent.speakersTodayLabel}
                  onChange={(e) => setStatsContent({ ...statsContent, speakersTodayLabel: e.target.value })}
                  className="text-yellow-100 bg-transparent border-b border-yellow-300 focus:border-white outline-none text-center"
                />
              ) : (
                <div className="text-yellow-100">{statsContent.speakersTodayLabel}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpeakersSection;