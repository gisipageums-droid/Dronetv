import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Upload, Plus, Trash2, Star, Calendar, Clock, MapPin } from 'lucide-react';

interface FormData {
  // Template Selection
  selectedTemplate: string;
  
  // Event Header
  eventName: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  eventLogo: string;
  heroImage: string;
  primaryCTA: { text: string; link: string };
  secondaryCTA: { text: string; link: string };
  showCountdown: boolean;
  
  // About Section
  aboutTitle: string;
  description: string;
  videoEmbedUrl: string;
  objectives: Array<string>;
  
  // Speakers/Guests
  speakers: Array<{
    name: string;
    role: string;
    topic: string;
    photo: string;
    featured: boolean;
  }>;
  
  // Agenda
  agenda: Array<{
    day: number;
    time: string;
    title: string;
    speaker: string;
    location: string;
    type: string;
    duration: string;
  }>;
  
  // Event Highlights (Template 2 only)
  highlights: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  
  // Sponsors/Partners
  sponsors: Array<{
    name: string;
    logo: string;
    website: string;
    tier: string;
  }>;
  
  // Gallery
  galleryItems: Array<{
    type: string;
    src: string;
    title: string;
    category: string;
  }>;
  
  // Registration/Contact
  email: string;
  phone: string;
  mapEmbedUrl: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  contactFormMessage: string;
  
  // Footer
  footerLogo: string;
  footerNavLinks: Array<{ label: string; link: string }>;
}

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState<FormData>({
    selectedTemplate: '',
    
    // Event Header
    eventName: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    eventLogo: '',
    heroImage: '',
    primaryCTA: { text: 'Register Now', link: '#contact' },
    secondaryCTA: { text: 'View Agenda', link: '#agenda' },
    showCountdown: true,
    
    // About
    aboutTitle: 'About the Event',
    description: '',
    videoEmbedUrl: '',
    objectives: [],
    
    // Speakers
    speakers: [],
    
    // Agenda
    agenda: [],
    
    // Highlights
    highlights: [],
    
    // Sponsors
    sponsors: [],
    
    // Gallery
    galleryItems: [],
    
    // Contact
    email: '',
    phone: '',
    mapEmbedUrl: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: ''
    },
    contactFormMessage: 'Ready to join us? Register now or get in touch for more information.',
    
    // Footer
    footerLogo: '',
    footerNavLinks: []
  });

  const steps = [
    'Select Template',
    'Event Header',
    'About Section',
    'Speakers/Guests',
    'Agenda',
    'Event Highlights',
    'Sponsors/Partners',
    'Gallery',
    'Registration/Contact',
    'Footer'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof FormData],
        [field]: value
      }
    }));
  };

  const addArrayItem = (field: string, item: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof FormData] as any[]), item]
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof FormData] as any[]).filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: string, index: number, updatedItem: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof FormData] as any[]).map((item, i) => 
        i === index ? updatedItem : item
      )
    }));
  };

  const handleSubmit = () => {
    localStorage.setItem('eventFormData', JSON.stringify(formData));
    navigate(`/preview/event-template-${formData.selectedTemplate}`);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Template Selection
        return (
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-black mb-8 text-center">Choose Your Event Template</h3>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div 
                onClick={() => handleInputChange('selectedTemplate', '1')}
                className={`cursor-pointer rounded-2xl overflow-hidden border-4 transition-all duration-300 ${
                  formData.selectedTemplate === '1' 
                    ? 'border-[#FF0000] shadow-2xl transform scale-105' 
                    : 'border-gray-200 hover:border-[#FFD400]'
                }`}
              >
                <div className="bg-white p-6">
                  <div className="h-48 bg-gradient-to-br from-white to-gray-100 rounded-lg mb-4 flex items-center justify-center border">
                    <span className="text-2xl font-bold text-black">Template 1</span>
                  </div>
                  <h4 className="text-xl font-bold text-black mb-2">Professional Conference</h4>
                  <p className="text-gray-600 mb-4">Clean, professional design perfect for conferences, summits, and corporate events</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div>• Hero with countdown timer</div>
                    <div>• Speaker carousel</div>
                    <div>• Timeline agenda</div>
                    <div>• Sponsor tiers</div>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => handleInputChange('selectedTemplate', '2')}
                className={`cursor-pointer rounded-2xl overflow-hidden border-4 transition-all duration-300 ${
                  formData.selectedTemplate === '2' 
                    ? 'border-[#FF0000] shadow-2xl transform scale-105' 
                    : 'border-gray-200 hover:border-[#FFD400]'
                }`}
              >
                <div className="bg-white p-6">
                  <div className="h-48 bg-black rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[#FFD400]">Template 2</span>
                  </div>
                  <h4 className="text-xl font-bold text-black mb-2">Creative Expo Style</h4>
                  <p className="text-gray-600 mb-4">Vibrant, animated design ideal for expos, fairs, and creative events</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div>• Animated hero section</div>
                    <div>• Event highlights cards</div>
                    <div>• Tabbed schedule</div>
                    <div>• Masonry gallery</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Event Header
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-black mb-6">Event Header & Hero Section</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
              <input
                type="text"
                value={formData.eventName}
                onChange={(e) => handleInputChange('eventName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                placeholder="Drone Innovation Summit 2025"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => handleInputChange('eventDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Time</label>
                <input
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) => handleInputChange('eventTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.showCountdown}
                    onChange={(e) => handleInputChange('showCountdown', e.target.checked)}
                    className="mr-2"
                  />
                  Show Countdown Timer
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => handleInputChange('venue', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                placeholder="Tech Convention Center, San Francisco"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Logo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Upload your event logo</p>
                <input type="file" className="hidden" accept="image/*" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Background Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Upload hero background image</p>
                <input type="file" className="hidden" accept="image/*" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary CTA Text</label>
                <input
                  type="text"
                  value={formData.primaryCTA.text}
                  onChange={(e) => handleNestedInputChange('primaryCTA', 'text', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary CTA Link</label>
                <input
                  type="text"
                  value={formData.primaryCTA.link}
                  onChange={(e) => handleNestedInputChange('primaryCTA', 'link', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary CTA Text</label>
                <input
                  type="text"
                  value={formData.secondaryCTA.text}
                  onChange={(e) => handleNestedInputChange('secondaryCTA', 'text', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary CTA Link</label>
                <input
                  type="text"
                  value={formData.secondaryCTA.link}
                  onChange={(e) => handleNestedInputChange('secondaryCTA', 'link', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 3: // About Section
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-black mb-6">About Section</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={formData.aboutTitle}
                onChange={(e) => handleInputChange('aboutTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                placeholder="Describe your event, its purpose, and what attendees can expect..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video Embed URL (Optional)</label>
              <input
                type="url"
                value={formData.videoEmbedUrl}
                onChange={(e) => handleInputChange('videoEmbedUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                placeholder="https://youtube.com/embed/..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">Key Objectives</label>
                <button
                  onClick={() => addArrayItem('objectives', '')}
                  className="bg-[#FF0000] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#FF0000]/90"
                >
                  <Plus size={16} />
                  Add Objective
                </button>
              </div>

              <div className="space-y-3">
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => updateArrayItem('objectives', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                      placeholder="Event objective"
                    />
                    <button
                      onClick={() => removeArrayItem('objectives', index)}
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4: // Speakers/Guests
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-black">Speakers & Guests</h3>
              <button
                onClick={() => addArrayItem('speakers', { name: '', role: '', topic: '', photo: '', featured: false })}
                className="bg-[#FF0000] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#FF0000]/90"
              >
                <Plus size={16} />
                Add Speaker
              </button>
            </div>

            <div className="space-y-6">
              {formData.speakers.map((speaker, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Speaker Photo</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500 text-sm">Upload speaker photo</p>
                        <input type="file" className="hidden" accept="image/*" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          value={speaker.name}
                          onChange={(e) => updateArrayItem('speakers', index, { ...speaker, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                          placeholder="Dr. Jane Smith"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role & Company</label>
                        <input
                          type="text"
                          value={speaker.role}
                          onChange={(e) => updateArrayItem('speakers', index, { ...speaker, role: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                          placeholder="CEO, TechCorp"
                        />
                      </div>
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={speaker.featured}
                            onChange={(e) => updateArrayItem('speakers', index, { ...speaker, featured: e.target.checked })}
                            className="mr-2"
                          />
                          Featured/Keynote Speaker
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Speaking Topic</label>
                    <input
                      type="text"
                      value={speaker.topic}
                      onChange={(e) => updateArrayItem('speakers', index, { ...speaker, topic: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                      placeholder="The Future of AI Technology"
                    />
                  </div>
                  <button
                    onClick={() => removeArrayItem('speakers', index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                    Remove Speaker
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 5: // Agenda
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-black">Event Agenda</h3>
              <button
                onClick={() => addArrayItem('agenda', { day: 1, time: '', title: '', speaker: '', location: '', type: 'session', duration: '1 hour' })}
                className="bg-[#FF0000] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#FF0000]/90"
              >
                <Plus size={16} />
                Add Session
              </button>
            </div>

            <div className="space-y-4">
              {formData.agenda.map((session, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid md:grid-cols-6 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                      <select
                        value={session.day}
                        onChange={(e) => updateArrayItem('agenda', index, { ...session, day: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                      >
                        <option value={1}>Day 1</option>
                        <option value={2}>Day 2</option>
                        <option value={3}>Day 3</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <input
                        type="time"
                        value={session.time}
                        onChange={(e) => updateArrayItem('agenda', index, { ...session, time: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={session.title}
                        onChange={(e) => updateArrayItem('agenda', index, { ...session, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                        placeholder="Session title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Speaker</label>
                      <input
                        type="text"
                        value={session.speaker}
                        onChange={(e) => updateArrayItem('agenda', index, { ...session, speaker: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                        placeholder="Speaker name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={session.location}
                        onChange={(e) => updateArrayItem('agenda', index, { ...session, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                        placeholder="Room/Location"
                      />
                    </div>
                    <button
                      onClick={() => removeArrayItem('agenda', index)}
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <select
                        value={session.type}
                        onChange={(e) => updateArrayItem('agenda', index, { ...session, type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                      >
                        <option value="keynote">Keynote</option>
                        <option value="panel">Panel</option>
                        <option value="workshop">Workshop</option>
                        <option value="demo">Demo</option>
                        <option value="networking">Networking</option>
                        <option value="break">Break</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                      <input
                        type="text"
                        value={session.duration}
                        onChange={(e) => updateArrayItem('agenda', index, { ...session, duration: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                        placeholder="1 hour"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 6: // Event Highlights (Template 2 only)
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-black">Event Highlights</h3>
              <div className="text-sm text-gray-500">
                {formData.selectedTemplate === '2' ? 'Template 2 Feature' : 'Not used in Template 1'}
              </div>
              {formData.selectedTemplate === '2' && (
                <button
                  onClick={() => addArrayItem('highlights', { icon: 'zap', title: '', description: '' })}
                  className="bg-[#FF0000] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#FF0000]/90"
                >
                  <Plus size={16} />
                  Add Highlight
                </button>
              )}
            </div>

            {formData.selectedTemplate === '2' ? (
              <div className="space-y-4">
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid md:grid-cols-4 gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                        <select
                          value={highlight.icon}
                          onChange={(e) => updateArrayItem('highlights', index, { ...highlight, icon: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                        >
                          <option value="zap">Zap</option>
                          <option value="trophy">Trophy</option>
                          <option value="users">Users</option>
                          <option value="rocket">Rocket</option>
                          <option value="star">Star</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          value={highlight.title}
                          onChange={(e) => updateArrayItem('highlights', index, { ...highlight, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                          placeholder="Highlight title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={highlight.description}
                          onChange={(e) => updateArrayItem('highlights', index, { ...highlight, description: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                          placeholder="Brief description"
                        />
                      </div>
                      <button
                        onClick={() => removeArrayItem('highlights', index)}
                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Event Highlights are only available in Template 2 (Creative Expo Style)</p>
                <p className="text-sm mt-2">This section will be skipped for Template 1</p>
              </div>
            )}
          </div>
        );

      case 7: // Sponsors/Partners
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-black">Sponsors & Partners</h3>
              <button
                onClick={() => addArrayItem('sponsors', { name: '', logo: '', website: '', tier: 'silver' })}
                className="bg-[#FF0000] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#FF0000]/90"
              >
                <Plus size={16} />
                Add Sponsor
              </button>
            </div>

            <div className="space-y-6">
              {formData.sponsors.map((sponsor, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sponsor Logo</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500 text-sm">Upload sponsor logo</p>
                        <input type="file" className="hidden" accept="image/*" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                        <input
                          type="text"
                          value={sponsor.name}
                          onChange={(e) => updateArrayItem('sponsors', index, { ...sponsor, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                          placeholder="Company Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                        <input
                          type="url"
                          value={sponsor.website}
                          onChange={(e) => updateArrayItem('sponsors', index, { ...sponsor, website: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                          placeholder="https://company.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sponsor Tier</label>
                        <select
                          value={sponsor.tier}
                          onChange={(e) => updateArrayItem('sponsors', index, { ...sponsor, tier: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                        >
                          <option value="platinum">Platinum</option>
                          <option value="gold">Gold</option>
                          <option value="silver">Silver</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeArrayItem('sponsors', index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                    Remove Sponsor
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 8: // Gallery
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-black">Event Gallery</h3>
              <button
                onClick={() => addArrayItem('galleryItems', { type: 'image', src: '', title: '', category: 'Event' })}
                className="bg-[#FF0000] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#FF0000]/90"
              >
                <Plus size={16} />
                Add Media
              </button>
            </div>

            <div className="space-y-6">
              {formData.galleryItems.map((item, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Media File</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500 text-sm">Upload image or video</p>
                        <input type="file" className="hidden" accept="image/*,video/*" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateArrayItem('galleryItems', index, { ...item, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                          placeholder="Media title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => updateArrayItem('galleryItems', index, { ...item, category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                          placeholder="Category"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select
                          value={item.type}
                          onChange={(e) => updateArrayItem('galleryItems', index, { ...item, type: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeArrayItem('galleryItems', index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                    Remove Media
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 9: // Registration/Contact
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-black mb-6">Registration & Contact</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                  placeholder="info@event.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Embed URL</label>
              <input
                type="url"
                value={formData.mapEmbedUrl}
                onChange={(e) => handleInputChange('mapEmbedUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                placeholder="https://maps.google.com/embed?..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Form Message</label>
              <textarea
                value={formData.contactFormMessage}
                onChange={(e) => handleInputChange('contactFormMessage', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Social Media Links</label>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Facebook</label>
                  <input
                    type="url"
                    value={formData.socialLinks.facebook}
                    onChange={(e) => handleNestedInputChange('socialLinks', 'facebook', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Twitter</label>
                  <input
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => handleNestedInputChange('socialLinks', 'twitter', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Instagram</label>
                  <input
                    type="url"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => handleNestedInputChange('socialLinks', 'instagram', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">LinkedIn</label>
                  <input
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleNestedInputChange('socialLinks', 'linkedin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                    placeholder="https://linkedin.com/..."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 10: // Footer
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-black mb-6">Footer Section</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Footer Logo (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Upload footer logo or leave empty to use header logo</p>
                <input type="file" className="hidden" accept="image/*" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">Footer Navigation Links</label>
                <button
                  onClick={() => addArrayItem('footerNavLinks', { label: '', link: '' })}
                  className="bg-[#FF0000] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#FF0000]/90"
                >
                  <Plus size={16} />
                  Add Link
                </button>
              </div>

              <div className="space-y-3">
                {formData.footerNavLinks.map((link, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateArrayItem('footerNavLinks', index, { ...link, label: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                      placeholder="Link label"
                    />
                    <input
                      type="text"
                      value={link.link}
                      onChange={(e) => updateArrayItem('footerNavLinks', index, { ...link, link: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                      placeholder="Link URL"
                    />
                    <button
                      onClick={() => removeArrayItem('footerNavLinks', index)}
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              Drone<span className="text-[#FFD400]">TV</span>
            </div>
            <nav>
              <span className="text-white">Event Form Builder</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round((currentStep / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#FF0000] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Step Navigation */}
            <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
              <div className="flex flex-wrap gap-2 mb-6">
                {steps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index + 1)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      currentStep === index + 1
                        ? 'bg-[#FF0000] text-white'
                        : currentStep > index + 1
                        ? 'bg-[#FFD400] text-black'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-600 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
              >
                <ArrowLeft size={20} />
                Previous
              </button>

              {currentStep < steps.length ? (
                <button
                  onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                  disabled={currentStep === 1 && !formData.selectedTemplate}
                  className="flex items-center gap-2 px-6 py-3 bg-[#FF0000] text-white rounded-lg font-semibold hover:bg-[#FF0000]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight size={20} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-8 py-3 bg-[#FFD400] text-black rounded-lg font-semibold hover:bg-[#FFD400]/90 transition-colors"
                >
                  <Save size={20} />
                  Create Event Page
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;