import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  ArrowRight,
  Calendar,
  Menu,
  X,
  Eye,
  Key,
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  Pen,
  Edit,
  Plus,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "motion/react";
import { EVENTS_API, LAMBDA } from '../../../lib/apiConfig';

// -------------------- Types --------------------
interface Event {
  heroBannerImage: string | undefined;
  draftId: string;
  eventId: string;
  userId: string;
  submissionId: string;
  eventName: string;
  shortDescription: string;
  eventDate: string;
  eventTime: string;
  location: string;
  category: string;
  reviewStatus: string;
  status: boolean;
  version: number;
  hasEdits: boolean;
  lastModified: string;
  createdAt: string;
  publishedAt: string;
  urlSlug: string;
  thumbnailUrl: string;
  previewImage: string;
  templateSelection: string;
  adminNotes: string;
  isVisible: boolean;
  isApproved: boolean;
  canEdit: boolean;
  canResubmit: boolean;
  hasCustomImages: boolean;
  completionPercentage: number;
  dashboardType: string;
  needsAdminAction: boolean;
}

interface EventCredentialsData {
  success: boolean;
  submissionId: string;
  data: {
    basicEventInformation: {
      eventDetails: {
        eventTitle: string;
        eventTagline: string;
        eventDescription: string;
      };
      dateAndTime: {
        startDate: string;
        endDate: string;
        startTime: string;
        endTime: string;
      };
      venueInformation: {
        venueName: string;
        venueAddress: string;
      };
      organizer: string;
      countdownSettings: {
        countdownEnabled: boolean;
        countdownTargetDate: string;
      };
    };
    highlightsAndCTAs: {
      highlights: { highlightText: string }[];
      ctaButtons: any[];
    };
    sectionsAndZones: {
      sections: { title: string; description: string }[];
      zones: { description: string; zoneTitle: string }[];
    };
    speakersThemesAndPartners: {
      speakers: {
        name: string;
        sequence: number;
        designation: string;
        day: string;
        prefix: string;
        organization: string;
      }[];
      themes: {
        day: string;
        details: string;
        themeTitle: string;
      }[];
      partners: {
        partnerName: string;
        logo: string;
        organization: string;
      }[];
    };
    mediaContactsAndPublishing: {
      media: {
        heroBanner: {
          uploaded: boolean;
          mediaType: string;
          fileName: string;
          uploading: boolean;
          mediaUrl: string;
          error: string;
        };
        backgroundVideoUrl: string;
        mediaGallery: {
          uploaded: boolean;
          mediaType: string;
          fileName: string;
          uploading: boolean;
          mediaUrl: string;
          error: string;
        }[];
        exhibitorInterviews: {
          videoTitle: string;
          videoUrl: string;
        }[];
      };
      contacts: {
        email: string;
        phone: { phoneNumber: string }[];
        address: string;
        internationalContacts: any[];
      };
      socialLinks: {
        facebook: string;
        linkedin: string;
        instagram: string;
      };
      publishing: {
        published: boolean;
        tags: any[];
      };
    };
    metadata: {
      submissionId: string;
      draftId: string;
      userId: string;
      eventType: string;
      status: string;
      createdAt: string;
      updatedAt: string;
      version: string;
    };
  };
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}

interface SidebarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  isMobileSidebarOpen: boolean;
  onCloseMobileSidebar: () => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

interface EventCardProps {
  event: Event;
  onCredentials: (eventId: string) => void;
  onPreview: (eventId: string, userId: string) => void;
  onApprove: (eventId: string, userId: string) => void;
  onReject: (eventId: string, userId: string) => void;
  onDelete: (eventId: string) => void;
  disabled?: boolean;
}

// -------------------- Confirmation Modal Component --------------------
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmColor: string;
  icon: React.ReactNode;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmColor,
  icon,
  isLoading = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-0 left-0 right-0 bottom-0 z-[999999999] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-surface-card rounded-xl shadow-2xl max-w-md w-full p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {icon}
                <h3 className="text-xl font-semibold text-ink">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-ink-light transition-colors"
                disabled={isLoading}
              >
                <X size={20} className="text-ink-caption" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mb-6">
              <p className="text-ink-paragraph">{message}</p>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 justify-end">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-4 py-2 text-ink-paragraph font-medium rounded-lg border border-ink-light bg-surface-card hover:bg-ink-offwhite transition-colors"
                disabled={isLoading}
              >
                Cancel
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                className={`px-4 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-colors shadow-md ${confirmColor}`}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// -------------------- Credentials Modal --------------------
interface EventCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: EventCredentialsData | null;
}

const EventCredentialsModal: React.FC<EventCredentialsModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen || !data || !data.data) return null;

  const {
    basicEventInformation,
    highlightsAndCTAs,
    sectionsAndZones,
    speakersThemesAndPartners,
    mediaContactsAndPublishing,
    metadata,
  } = data.data;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-bold text-ink border-b border-ink-light pb-2 mb-4 mt-2">
      {children}
    </h3>
  );

  const InfoField = ({
    label,
    value,
    isLong = false,
  }: {
    label: string;
    value: string | number | undefined | null | boolean;
    isLong?: boolean;
  }) => (
    <div className={`mb-3 ${isLong ? "col-span-full" : ""}`}>
      <label className="block text-xs font-semibold text-ink-caption uppercase tracking-wider mb-1">
        {label}
      </label>
      <div className="text-sm text-ink bg-ink-offwhite p-2.5 rounded-lg border border-ink-light break-words">
        {value?.toString() || (
          <span className="text-ink-caption italic">Not provided</span>
        )}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-surface-card rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink-light bg-ink-offwhite/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-gold/15 rounded-lg">
                  <Key className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-ink">
                    Event Details & Credentials
                  </h2>
                  <p className="text-xs text-ink-caption mt-0.5">
                    Viewing details for {basicEventInformation.eventDetails.eventTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-ink-light/80 transition-colors text-ink-caption hover:text-ink-paragraph"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {/* 1. Basic Information */}
              <div className="mb-8">
                <SectionTitle>Basic Information</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoField
                    label="Event Title"
                    value={basicEventInformation.eventDetails.eventTitle}
                  />
                  <InfoField
                    label="Organizer"
                    value={basicEventInformation.organizer}
                  />
                  <InfoField
                    label="Submission ID"
                    value={data.submissionId}
                  />
                  <InfoField
                    label="Tagline"
                    value={basicEventInformation.eventDetails.eventTagline}
                    isLong
                  />
                  <InfoField
                    label="Description"
                    value={basicEventInformation.eventDetails.eventDescription}
                    isLong
                  />
                </div>
              </div>

              {/* 2. Date, Time & Venue */}
              <div className="mb-8">
                <SectionTitle>Date, Time & Venue</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InfoField
                    label="Start Date"
                    value={basicEventInformation.dateAndTime.startDate}
                  />
                  <InfoField
                    label="End Date"
                    value={basicEventInformation.dateAndTime.endDate}
                  />
                  <InfoField
                    label="Start Time"
                    value={basicEventInformation.dateAndTime.startTime}
                  />
                  <InfoField
                    label="End Time"
                    value={basicEventInformation.dateAndTime.endTime}
                  />
                  <InfoField
                    label="Venue Name"
                    value={basicEventInformation.venueInformation.venueName}
                  />
                  <InfoField
                    label="Venue Address"
                    value={basicEventInformation.venueInformation.venueAddress}
                    isLong
                  />
                  <InfoField
                    label="Countdown Target"
                    value={basicEventInformation.countdownSettings.countdownTargetDate?.replace("T", " ")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* 3. Sections */}
                <div>
                  <SectionTitle>Sections</SectionTitle>
                  <div className="space-y-3">
                    {sectionsAndZones.sections.map((section, idx) => (
                      <div key={idx} className="bg-ink-offwhite p-3 rounded-lg border border-ink-light">
                        <h4 className="font-semibold text-ink-charcoal text-sm">{section.title}</h4>
                        <p className="text-xs text-ink-paragraph mt-1 whitespace-pre-wrap">{section.description}</p>
                      </div>
                    ))}
                    {sectionsAndZones.sections.length === 0 && <p className="text-sm text-ink-caption italic">No sections added.</p>}
                  </div>
                </div>

                {/* 4. Zones */}
                <div>
                  <SectionTitle>Zones</SectionTitle>
                  <div className="space-y-3">
                    {sectionsAndZones.zones.map((zone, idx) => (
                      <div key={idx} className="bg-ink-offwhite p-3 rounded-lg border border-ink-light">
                        <h4 className="font-semibold text-ink-charcoal text-sm">{zone.zoneTitle}</h4>
                        <p className="text-xs text-ink-paragraph mt-1 whitespace-pre-wrap">{zone.description}</p>
                      </div>
                    ))}
                    {sectionsAndZones.zones.length === 0 && <p className="text-sm text-ink-caption italic">No zones added.</p>}
                  </div>
                </div>
              </div>

              {/* 5. Speakers & Themes */}
              <div className="mb-8">
                <SectionTitle>Speakers & Partners</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Speakers */}
                  <div>
                    <h4 className="text-sm font-semibold text-ink-paragraph uppercase mb-3">Speakers</h4>
                    <div className="space-y-3">
                      {speakersThemesAndPartners.speakers.map((speaker, idx) => (
                        <div key={idx} className="flex gap-3 bg-ink-offwhite p-3 rounded-lg border border-ink-light">
                          <div className="w-10 h-10 rounded-full bg-status-info/15 flex items-center justify-center text-status-info font-bold shrink-0">
                            {speaker.name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-ink">{speaker.prefix} {speaker.name}</p>
                            <p className="text-xs text-ink-paragraph">{speaker.designation} at {speaker.organization}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-ink-light text-ink-paragraph text-[10px] rounded-full">Day {speaker.day}</span>
                          </div>
                        </div>
                      ))}
                      {speakersThemesAndPartners.speakers.length === 0 && <p className="text-sm text-ink-caption italic">No speakers added.</p>}
                    </div>
                  </div>

                  {/* Partners */}
                  <div>
                    <h4 className="text-sm font-semibold text-ink-paragraph uppercase mb-3">Partners</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {speakersThemesAndPartners.partners.map((partner, idx) => (
                        <div key={idx} className="bg-ink-offwhite p-3 rounded-lg border border-ink-light flex flex-col items-center text-center">
                          {partner.logo && (
                            <img src={partner.logo} alt={partner.partnerName} className="w-12 h-12 object-contain mb-2 rounded-md" />
                          )}
                          <p className="text-sm font-bold text-ink">{partner.partnerName}</p>
                          <p className="text-xs text-ink-paragraph truncate w-full">{partner.organization}</p>
                        </div>
                      ))}
                      {speakersThemesAndPartners.partners.length === 0 && <p className="text-sm text-ink-caption italic">No partners added.</p>}
                    </div>
                  </div>
                </div>
              </div>


              {/* 6. Media & Contact */}
              <div className="mb-8">
                <SectionTitle>Media & Contact</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <InfoField
                      label="Contact Email"
                      value={mediaContactsAndPublishing.contacts.email}
                    />
                    <InfoField
                      label="Contact Address"
                      value={mediaContactsAndPublishing.contacts.address}
                      isLong
                    />
                    {mediaContactsAndPublishing.contacts.phone.map((p, i) => (
                      <InfoField key={i} label={`Phone ${i + 1}`} value={p.phoneNumber} />
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink-caption uppercase tracking-wider mb-2">
                        Hero Banner
                      </label>
                      {mediaContactsAndPublishing.media.heroBanner.mediaUrl ? (
                        <a href={mediaContactsAndPublishing.media.heroBanner.mediaUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-32 rounded-lg bg-ink-light overflow-hidden relative group">
                          <img src={mediaContactsAndPublishing.media.heroBanner.mediaUrl} alt="Hero Banner" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink-charcoal/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Eye className="text-white drop-shadow-md" />
                          </div>
                        </a>
                      ) : (
                        <div className="w-full h-24 bg-ink-offwhite border border-dashed border-ink-light rounded-lg flex items-center justify-center text-ink-caption text-sm">
                          No Hero Banner
                        </div>
                      )}
                    </div>
                    {/* Social Links */}
                    <div className="grid grid-cols-3 gap-2">
                      <InfoField label="Facebook" value={mediaContactsAndPublishing.socialLinks.facebook || "-"} />
                      <InfoField label="LinkedIn" value={mediaContactsAndPublishing.socialLinks.linkedin || "-"} />
                      <InfoField label="Instagram" value={mediaContactsAndPublishing.socialLinks.instagram || "-"} />
                    </div>
                  </div>
                </div>
              </div>


              {/* 7. Metadata */}
              <div className="mb-4">
                <SectionTitle>System Metadata</SectionTitle>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-ink-offwhite p-4 rounded-xl border border-ink-light">
                  <InfoField label="Posted By" value={metadata.userId} />
                  <InfoField label="Created At" value={formatDate(metadata.createdAt)} />
                  <InfoField label="Updated At" value={formatDate(metadata.updatedAt)} />
                  <InfoField label="Status" value={metadata.status} />
                  <InfoField label="Draft ID" value={metadata.draftId} />
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-ink-light bg-ink-offwhite flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-white bg-ink rounded-lg hover:bg-ink-charcoal transition-colors shadow-sm"
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// -------------------- Constants --------------------
const SORT_OPTIONS = [
  "Sort by Date",
  "Sort by Latest",
  "Sort by Location",
  "Sort by Category",
] as const;

// -------------------- Header --------------------
const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-ink px-6 py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs font-bold tracking-widest text-brand-yellow uppercase mb-1">Admin</p>
          <h1 className="text-xl font-extrabold text-white mb-0.5">Event Management</h1>
          <p className="text-sm text-ink-caption">Review and manage all event listings, credentials, and approvals</p>
        </div>
        <button
          onClick={() => navigate("/event/select")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-yellow hover:bg-brand-yellow-soft text-ink text-sm font-bold transition-all"
        >
          <Plus size={16} />
          Add New Event
        </button>
      </div>
    </div>
  );
};

// -------------------- Dropdown --------------------
const MinimalisticDropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
  options,
  placeholder,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center px-4 py-3 w-full text-sm text-ink-paragraph bg-ink-offwhite rounded-lg border border-ink-light transition-colors hover:bg-ink-light focus:outline-none focus:ring-1 focus:ring-ink-light"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className={value === options[0] ? "text-ink-caption" : "text-ink"}
        >
          {value || options[0] || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute z-10 mt-1 w-full bg-surface-card rounded-lg border border-ink-light shadow-sm"
          role="listbox"
        >
          {options.map((option: string, idx: number) => (
            <button
              key={idx}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${value === option
                ? "bg-ink-offwhite text-ink font-medium"
                : "text-ink-paragraph hover:bg-ink-offwhite"
                }`}
              role="option"
              aria-selected={value === option}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// -------------------- Sidebar --------------------
const Sidebar: React.FC<SidebarProps> = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  isMobileSidebarOpen,
  onCloseMobileSidebar,
  statusFilter,
  onStatusFilterChange,
}) => {
  const sortOptions: string[] = [
    "Sort by Date",
    ...SORT_OPTIONS.filter((s) => s !== "Sort by Date"),
  ];

  // Status filter options
  const statusOptions = [
    { value: "all", label: "All Events", color: "text-brand-gold" },
    { value: "under_review", label: "Under Review", color: "text-brand-gold" },
    { value: "approved", label: "Approved", color: "text-status-success" },
    { value: "rejected", label: "Rejected", color: "text-status-error" },
  ];

  return (
    <div
      className={`bg-surface-card border-r border-ink-light p-4 md:p-8 h-fit md:sticky md:top-0
      ${isMobileSidebarOpen
          ? "fixed top-16 left-0 right-0 z-50 w-full overflow-y-auto bg-surface-card"
          : "hidden md:block md:w-72"
        }`}
    >
      {isMobileSidebarOpen && (
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="text-base font-bold text-ink">Filters</h2>
          <button
            onClick={onCloseMobileSidebar}
            className="p-2 text-ink-caption"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="space-y-6 md:space-y-8">
        {/* Status Filter Section */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-ink-caption uppercase tracking-wide block">
            Filter by Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            {statusOptions.map((option) => (
              <motion.button
                key={option.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => onStatusFilterChange(option.value)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center justify-center gap-1 ${statusFilter === option.value
                  ? option.value === "under_review"
                    ? "bg-brand-yellow-soft border-brand-yellow-soft text-brand-gold"
                    : option.value === "approved"
                      ? "bg-status-success/15 border-status-success/40 text-status-success"
                      : option.value === "rejected"
                        ? "bg-status-error/15 border-status-error/40 text-status-error"
                        : "bg-ink-light border-ink-light text-ink-charcoal"
                  : "bg-surface-card border-ink-light hover:border-brand-yellow text-ink-paragraph"
                  }`}
              >
                {option.label === "Needs Review" && (
                  <Clock className="w-3 h-3" />
                )}
                {option.label === "Approved" && (
                  <CheckCircle className="w-3 h-3" />
                )}
                {option.label === "Rejected" && <XCircle className="w-3 h-3" />}
                {option.label === "All Events" && (
                  <Calendar className="w-3 h-3" />
                )}
                <span>{option.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Search Section */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-ink-caption uppercase tracking-wide block">
            Search Events
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-caption" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSearchChange(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-ink-light rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-yellow focus:border-brand-yellow bg-surface-card transition-colors placeholder-ink-caption text-ink"
              aria-label="Search events"
            />
          </div>
        </div>

        {/* Sort Filter */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-ink-caption uppercase tracking-wide block">
            Sort by
          </label>
          <MinimalisticDropdown
            key={`sort-${sortBy}`}
            value={sortBy}
            onChange={onSortChange}
            options={sortOptions}
            placeholder="Sort options"
          />
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => {
            onSearchChange("");
            onSortChange("Sort by Date");
            onStatusFilterChange("all");
          }}
          className="text-xs text-ink-caption hover:text-ink-paragraph transition-colors underline underline-offset-2"
        >
          Clear all filters
        </button>

        {/* Divider */}
        <div className="border-t border-ink-light"></div>

        {/* Navigation Links */}
        <div className="flex gap-2 flex-col">
          <p className="text-xs font-bold text-ink-caption uppercase tracking-wide">Other Sections</p>
          <motion.button
            whileTap={{ scale: [0.9, 1] }}
            className="text-sm text-ink-paragraph p-3 rounded-xl duration-200 flex items-center gap-3 border border-ink-light bg-surface-card hover:bg-ink-light"
          >
            <Link
              to={"/admin/professional/dashboard"}
              className="w-full text-left"
            >
              Professionals
            </Link>
          </motion.button>
          <motion.button
            whileTap={{ scale: [0.9, 1] }}
            className="text-sm text-ink-paragraph p-3 rounded-xl duration-200 flex items-center gap-3 border border-ink-light bg-surface-card hover:bg-ink-light"
          >
            <Link to={"/admin/company/dashboard"} className="w-full text-left">
              Companies
            </Link>
          </motion.button>
          <motion.button
            whileTap={{ scale: [0.9, 1] }}
            className="text-sm text-ink-paragraph p-3 rounded-xl duration-200 flex items-center gap-3 border border-ink-light bg-surface-card hover:bg-ink-light"
          >
            <Link to={"/admin/plans"} className="w-full text-left">
              Admin Plans
            </Link>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// -------------------- EventCard --------------------
const EventCard: React.FC<EventCardProps & { disabled?: boolean }> = ({
  event,
  onCredentials,
  onPreview,
  onApprove,
  onReject,
  onDelete,
  disabled = false,
}) => {
  const getEventImageUrl = (url?: string): string | null => {
    if (!url) return null;
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
    if (yt) return `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`;
    if (url.startsWith('http')) return url;
    return null;
  };
  const eventImageUrl = getEventImageUrl(event.previewImage);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Date not available";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Date not available";
    }
  };

  const getStatusBadge = (reviewStatus?: string) => {
    if (reviewStatus === "under_review")
      return {
        bg: "bg-brand-yellow-soft",
        text: "text-brand-gold",
        label: "Needs Review",
      };

    if (reviewStatus === "rejected")
      return { bg: "bg-status-error/15", text: "text-status-error", label: "Rejected" };
    if (reviewStatus === "approved")
      return { bg: "bg-status-success/15", text: "text-status-success", label: "Approved" };

    return { bg: "bg-ink-offwhite", text: "text-ink-paragraph", label: "Unknown" };
  };

  const statusStyle = getStatusBadge(event.reviewStatus);

  return (
    <div className="overflow-hidden w-full h-full rounded-xl border border-ink-light border-l-4 border-l-brand-yellow shadow-sm transition-all duration-200 hover:shadow-md bg-surface-card">
      <div className="p-4 md:p-5">
        <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
          <div className="flex gap-3 items-center min-w-0 flex-1">
            <div className="flex-shrink-0 flex overflow-hidden justify-center items-center p-1 w-10 h-10 bg-ink-light rounded-lg sm:w-12 sm:h-12">
              {eventImageUrl ? (
                <img
                  src={eventImageUrl}
                  alt={`${event.eventName} logo`}
                  className="w-full h-full object-cover rounded"
                  loading="lazy"
                />
              ) : (
                <Calendar className="w-5 h-5 text-ink-caption" />
              )}
            </div>

            <div className="max-w-[calc(100%-60px)] md:max-w-none">
              <h3 className="text-lg font-bold text-ink md:text-xl line-clamp-2">
                {event.eventName || "Unnamed Event"}
              </h3>
              <div className="flex items-center mt-1 text-ink-paragraph">
                <MapPin className="mr-1 w-3 h-3" />
                <span className="text-xs md:text-sm">
                  {event.location ? (event.location.length > 25 ? event.location.slice(0, 25) + "..." : event.location) : "Location not specified"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div
              className={`inline-flex items-center gap-1 ${statusStyle.bg} ${statusStyle.text} px-2 py-1 rounded-full text-xs font-medium`}
            >
              <Calendar className="w-3 h-3" />
              <span>{statusStyle.label}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-center md:gap-6">
            <div className="flex gap-2 items-center px-3 py-1 bg-ink-offwhite rounded-lg md:px-4 md:py-2">
              <span className="text-xs font-bold text-ink-paragraph md:text-sm">
                {formatDate(event.createdAt)}
              </span>
              <span className="hidden text-xs text-ink-paragraph md:block">
                Published
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onPreview(event.eventId, event.userId)}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-ink-paragraph bg-ink-light rounded-lg transition-colors hover:bg-ink-light md:text-sm disabled:opacity-50 disabled:pointer-events-none"
              aria-label={`Preview ${event.eventName}`}
              disabled={disabled}
            >
              <Pen className="w-3 h-3 md:w-4 md:h-4" /> Edit /{" "}
              <Eye className="w-3 h-3 md:w-4 md:h-4" /> Preview
            </button>

            <button
              onClick={() => onCredentials(event.draftId)}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-brand-gold bg-brand-gold/15 rounded-lg transition-colors hover:bg-brand-gold/25 md:text-sm disabled:opacity-50 disabled:pointer-events-none"
              aria-label={`Credentials ${event.eventName}`}
              disabled={disabled}
            >
              <Key className="w-3 h-3 md:w-4 md:h-4" />
              Credentials
            </button>

            <button
              onClick={() => onApprove(event.eventId, event.userId)}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-status-success bg-status-success/15 rounded-lg transition-colors hover:bg-status-success/25 md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Approve ${event.eventName}`}
              disabled={disabled || event.reviewStatus === "approved"}
            >
              <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
              Approve
            </button>

            <button
              onClick={() => onReject(event.eventId, event.userId)}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-status-error bg-status-error/15 rounded-lg transition-colors hover:bg-status-error/25 md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Reject ${event.eventName}`}
              disabled={disabled || event.reviewStatus === "rejected"}
            >
              <XCircle className="w-3 h-3 md:w-4 md:h-4" />
              Reject
            </button>

            <button
              onClick={() => onDelete(event.eventId)}
              className="flex col-span-2 gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-white bg-status-error rounded-lg transition-colors hover:bg-status-error md:text-sm disabled:opacity-50 disabled:pointer-events-none"
              aria-label={`Delete ${event.eventName}`}
              disabled={disabled}
            >
              <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------- Loading & Error --------------------
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-16">
    <div className="w-12 h-12 rounded-full border-b-2 border-brand-gold animate-spin" />
    <span className="ml-4 text-ink-paragraph">Loading events...</span>
  </div>
);

// -------------------- Recent Events Section --------------------
const RecentEventsSection: React.FC<{
  recentEvents: Event[];
  label: string;
  onCredentials: (publishedId: string) => void;
  onPreview: (publishedId: string, userId: string) => void;
  onApprove: (publishedId: string, userId: string) => void;
  onReject: (publishedId: string, userId: string) => void;
  onDelete: (publishedId: string) => void;
  disabled?: boolean;
}> = ({
  recentEvents,
  label,
  onCredentials,
  onPreview,
  onApprove,
  onReject,
  onDelete,
  disabled,
}) => {
    if (recentEvents.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex gap-3 items-center mb-6">
          <div className="flex gap-2 items-center">
            <Clock className="w-5 h-5 text-brand-gold" />
            <h2 className="text-base font-bold text-ink">
              {label}
            </h2>
          </div>
          <span className="px-2.5 py-1 text-xs font-bold text-ink-paragraph bg-ink-light rounded-full">
            Last 7 days
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {recentEvents.map((event) => (
            <div key={event.eventId} className="animate-fadeIn">
              <EventCard
                event={event}
                onCredentials={onCredentials}
                onPreview={onPreview}
                onApprove={onApprove}
                onReject={onReject}
                onDelete={onDelete}
                disabled={disabled}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-ink-light"></div>
      </div>
    );
  };

// -------------------- API Service --------------------
const eventApiService = {
  async fetchEventCredentials(eventId: string): Promise<EventCredentialsData> {
    try {
      const response = await fetch(
        EVENTS_API ? `${EVENTS_API}/event-formdetails-verification/${eventId}` : `${LAMBDA.eventsVerify}/event-formdetails-verification/${eventId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
};

// -------------------- Main Component --------------------
const VIEW_TABS = [
  { id: "all", label: "All Events" },
  { id: "expos", label: "Expos" },
  { id: "conferences", label: "Conferences" },
  { id: "workshops", label: "Workshops" },
];

function matchesView(event: Event, view: string): boolean {
  if (view === "all") return true;
  const cat = (event.category || "").toLowerCase();
  if (view === "expos") return cat.includes("expo");
  if (view === "conferences") return cat.includes("conference");
  if (view === "workshops") return cat.includes("workshop");
  return true;
}

const EventAdminDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("Sort by Date");
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") ?? "all");
  const [viewFilter, setViewFilter] = useState<string>(searchParams.get("view") ?? "all");

  React.useEffect(() => {
    const view = searchParams.get("view") ?? "all";
    const status = searchParams.get("status") ?? "all";
    setViewFilter(view);
    setStatusFilter(status);
  }, [searchParams]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(12);
  const [credentialsModal, setCredentialsModal] = useState<{
    isOpen: boolean;
    data: EventCredentialsData | null;
  }>({
    isOpen: false,
    data: null,
  });
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const navigate = useNavigate();

  // Confirmation modal state
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: "approve" | "reject" | "delete" | "edit" | null;
    eventId: string | null;
    userId: string | null;
    event: Event | null;
  }>({ isOpen: false, type: null, eventId: null, userId: null, event: null });

  // -------------------- Confirmation Modal Handlers --------------------
  const openConfirmationModal = (
    type: "approve" | "reject" | "delete" | "edit",
    eventId: string,
    userId?: string
  ) => {
    const event = events.find((e) => e.eventId === eventId);
    setConfirmationModal({
      isOpen: true,
      type,
      eventId,
      userId: userId || null,
      event: event || null,
    });
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({
      isOpen: false,
      type: null,
      eventId: null,
      userId: null,
      event: null,
    });
  };

  const handleConfirmAction = async () => {
    const { type, eventId, userId } = confirmationModal;
    if (!eventId) return;

    try {
      setIsMutating(true);

      switch (type) {
        case "edit":
          await handlePreviewAction(eventId, userId || "");
          break;

        case "approve":
          await handleApproveAction(eventId, userId || "");
          break;

        case "reject":
          await handleRejectAction(eventId, userId || "");
          break;

        case "delete":
          await handleDeleteAction(eventId);
          break;

        default:
          return;
      }
    } catch (err) {
      toast.error(`Failed to ${type} event`);
    } finally {
      setIsMutating(false);
      closeConfirmationModal();
    }
  };

  // -------------------- Action Handlers --------------------
  const handleCredentials = async (eventId: string) => {
    try {
      setIsMutating(true);
      const credentials = await eventApiService.fetchEventCredentials(eventId);
      setCredentialsModal({ isOpen: true, data: credentials });
    } catch {
      toast.error("Failed to fetch credentials");
    } finally {
      setIsMutating(false);
    }
  };

  const handlePreviewAction = (eventId: string, userId: string) => {
    const event = events.find((e) => e.eventId === eventId);
    if (!event) { toast.error("Event not found"); return; }

    if (event.templateSelection === "template-2" || event.templateSelection === "2") {
      navigate(`/edit/event/t2/admin/${eventId}/${userId}`);
    } else {
      navigate(`/edit/event/t1/admin/${eventId}/${userId}`);
    }
  };

  const fetchEvents = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const response = await fetch(
        EVENTS_API ? `${EVENTS_API}/events-dashboard?viewType=admin` : `${LAMBDA.events}/events-dashboard?viewType=admin`,
        { signal }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const fetchedEvents = data?.cards || [];
      setEvents(fetchedEvents);
    } catch (error: any) {
      if (error?.name === "AbortError") return;
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAction = async (eventId: string, userId: string) => {
    const response = await fetch(
      EVENTS_API ? `${EVENTS_API}/event/${eventId}` : `${LAMBDA.eventsAdmin}/event/${eventId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, action: "approve", userId }),
      }
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    toast.success("Event approved successfully");
    fetchEvents();
  };

  const handleRejectAction = async (eventId: string, userId: string) => {
    const response = await fetch(
      EVENTS_API ? `${EVENTS_API}/event/${eventId}` : `${LAMBDA.eventsAdmin}/event/${eventId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, action: "reject", userId }),
      }
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    toast.success("Event rejected");
    fetchEvents();
  };

  const handleDeleteAction = async (eventId: string) => {
    const response = await fetch(
      `${LAMBDA.eventsDelete}/delete-event`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, action: "delete" }),
      }
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    toast.success("Event deleted");
    fetchEvents();
  };

  // Wrapper functions for button clicks
  const handlePreview = (eventId: string, userId: string) => {
    openConfirmationModal("edit", eventId, userId);
  };

  const handleApprove = (eventId: string, userId: string) => {
    openConfirmationModal("approve", eventId, userId);
  };

  const handleReject = (eventId: string, userId: string) => {
    openConfirmationModal("reject", eventId, userId);
  };

  const handleDelete = (eventId: string) => {
    openConfirmationModal("delete", eventId);
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchEvents(controller.signal);
    return () => controller.abort();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, statusFilter]);

  // Filter and Sort Logic
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        !searchTerm ||
        (event.eventName &&
          event.eventName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.location &&
          event.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.category &&
          event.category.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "under_review" && event.reviewStatus === "under_review") ||
        (statusFilter === "approved" && event.reviewStatus === "approved") ||
        (statusFilter === "rejected" && event.reviewStatus === "rejected");

      return matchesSearch && matchesStatus && matchesView(event, viewFilter);
    });
  }, [events, searchTerm, statusFilter, viewFilter]);

  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      switch (sortBy) {
        case "Sort by Location":
          return (a.location || "").localeCompare(b.location || "");
        case "Sort by Date":
          const dateA = a.eventDate ? new Date(a.eventDate).getTime() : 0;
          const dateB = b.eventDate ? new Date(b.eventDate).getTime() : 0;
          return dateB - dateA;
        case "Sort by Category":
          return (a.category || "").localeCompare(b.category || "");
        case "Sort by Latest":
        default:
          const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return createdB - createdA;
      }
    });
  }, [filteredEvents, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedEvents.length / itemsPerPage));

  const paginatedEvents = useMemo(() => {
    return sortedEvents.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [sortedEvents, currentPage, itemsPerPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // -------------------- Modal Configuration --------------------
  const getModalConfig = () => {
    const { type, event } = confirmationModal;
    const eventName = event?.eventName || "this event";

    switch (type) {
      case "edit":
        return {
          title: "Confirm Edit",
          message: `Are you sure you want to edit "${eventName}"? You will be redirected to the edit page.`,
          confirmText: "Edit Event",
          confirmColor: "bg-ink-paragraph hover:bg-ink-paragraph",
          icon: <Edit className="text-ink-paragraph" size={24} />,
        };
      case "approve":
        return {
          title: "Confirm Approval",
          message: `Are you sure you want to approve "${eventName}"? This will make the event visible to users.`,
          confirmText: "Approve Event",
          confirmColor: "bg-status-success hover:bg-status-success",
          icon: <CheckCircle className="text-status-success" size={24} />,
        };
      case "reject":
        return {
          title: "Confirm Rejection",
          message: `Are you sure you want to reject "${eventName}"? This will mark the event as rejected.`,
          confirmText: "Reject Event",
          confirmColor: "bg-status-error hover:bg-status-error",
          icon: <XCircle className="text-status-error" size={24} />,
        };
      case "delete":
        return {
          title: "Confirm Deletion",
          message: `Are you sure you want to delete "${eventName}"? This action cannot be undone and all event data will be permanently removed.`,
          confirmText: "Delete Event",
          confirmColor: "bg-status-error hover:bg-status-error",
          icon: <Trash2 className="text-status-error" size={24} />,
        };
      default:
        return {
          title: "Confirm Action",
          message: "Are you sure you want to perform this action?",
          confirmText: "Confirm",
          confirmColor: "bg-status-info hover:bg-status-info",
          icon: <CheckCircle className="text-status-info" size={24} />,
        };
    }
  };

  const modalConfig = getModalConfig();
  const viewFilteredEvents = events.filter(e => matchesView(e, viewFilter));
  const recentViewFilteredEvents = [...viewFilteredEvents]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="w-full min-h-screen bg-[#F4F5F7]">

      {/* Universal Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmAction}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        confirmColor={modalConfig.confirmColor}
        icon={modalConfig.icon}
        isLoading={isMutating}
      />

      {/* Credentials Modal */}
      <EventCredentialsModal
        isOpen={credentialsModal.isOpen}
        onClose={() => setCredentialsModal({ isOpen: false, data: null })}
        data={credentialsModal.data}
      />

      {/* Page title */}
      <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-ink">Event Management</h1>
          <p className="text-sm text-ink-caption mt-0.5">Review and manage all event listings, credentials, and approvals.</p>
        </div>
        <button
          onClick={() => navigate("/event/select", viewFilter !== "all" ? { state: { eventType: viewFilter.slice(0, -1) } } : undefined)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-yellow hover:bg-brand-yellow-soft text-ink text-sm font-bold transition-all"
        >
          <Plus size={16} />
          {viewFilter === "expos" ? "Add New Expo" : viewFilter === "conferences" ? "Add New Conference" : viewFilter === "workshops" ? "Add New Workshop" : "Add New Event"}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total", value: viewFilteredEvents.length, color: "border-t-brand-yellow" },
          { label: "Pending Review", value: viewFilteredEvents.filter(e => e.reviewStatus === "under_review").length, color: "border-t-status-warning" },
          { label: "Approved", value: viewFilteredEvents.filter(e => e.reviewStatus === "approved").length, color: "border-t-status-success" },
          { label: "Rejected", value: viewFilteredEvents.filter(e => e.reviewStatus === "rejected").length, color: "border-t-status-error" },
        ].map(stat => (
          <div key={stat.label} className={`bg-surface-card rounded-lg border border-ink-light border-t-4 ${stat.color} p-4 shadow-sm`}>
            <div className="text-2xl font-black text-ink">{loading ? "—" : stat.value}</div>
            <div className="text-xs font-semibold text-ink-caption mt-1 uppercase tracking-wide">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* View tabs */}
      <div className="flex gap-0 border-b-2 border-ink-light mb-4 overflow-x-auto">
        {VIEW_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setViewFilter(tab.id);
              setSearchParams(prev => { if (tab.id === "all") { prev.delete("view"); } else { prev.set("view", tab.id); } return prev; }, { replace: true });
              setCurrentPage(1);
            }}
            className={`px-4 py-2 text-sm font-semibold whitespace-nowrap border-b-[3px] -mb-[2px] transition-all ${viewFilter === tab.id ? "text-ink border-brand-yellow" : "text-ink-caption border-transparent hover:text-ink-paragraph"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Horizontal toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex items-center gap-2 bg-surface-card border border-ink-light rounded-md px-3 py-1.5 flex-1 min-w-[180px] max-w-xs">
          <Search className="w-4 h-4 text-ink-caption flex-shrink-0" />
          <input
            type="text"
            placeholder="Search events…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border-none outline-none text-sm bg-transparent w-full text-ink-charcoal placeholder-ink-caption"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 border border-ink-light rounded-md text-sm bg-surface-card text-ink-charcoal focus:outline-none focus:border-brand-yellow cursor-pointer"
        >
          <option value="all">All Events</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-3 py-1.5 border border-ink-light rounded-md text-sm bg-surface-card text-ink-charcoal focus:outline-none focus:border-brand-yellow cursor-pointer"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="bg-[#F4F5F7]">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Recent Events Section - Updated condition to hide when status filter is not "all" */}
              {!searchTerm && statusFilter === "all" && (
                <RecentEventsSection
                  recentEvents={recentViewFilteredEvents}
                  label={viewFilter === "expos" ? "Recent Expos" : viewFilter === "conferences" ? "Recent Conferences" : viewFilter === "workshops" ? "Recent Workshops" : "Recent Events"}
                  onCredentials={handleCredentials}
                  onPreview={handlePreview}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onDelete={handleDelete}
                  disabled={isMutating}
                />
              )}

              {/* All Events Section */}
              <div className="flex gap-3 items-center mb-6">
                <div className="flex gap-2 items-center">
                  <Calendar className="w-5 h-5 text-brand-gold" />
                  <h2 className="text-base font-bold text-ink">
                    {statusFilter === "all" ? "All Events" : statusFilter === "under_review" ? "Under Review Events" : statusFilter === "approved" ? "Approved Events" : "Rejected Events"}
                  </h2>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold text-ink-paragraph bg-ink-light rounded-full">
                  {sortedEvents.length}{" "}
                  {sortedEvents.length === 1 ? "event" : "events"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
                {paginatedEvents.map((event) => (
                  <div key={event.eventId} className="animate-fadeIn">
                    <EventCard
                      event={event}
                      onCredentials={handleCredentials}
                      onPreview={handlePreview}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      onDelete={handleDelete}
                      disabled={isMutating}
                    />
                  </div>
                ))}
              </div>

              <div>
                {sortedEvents.length === 0 && (
                  <div className="flex flex-col gap-3 justify-center items-center mt-20 mb-44">
                    <Calendar className="w-24 h-24 text-ink-caption" />
                    <p className="text-sm font-semibold text-ink-caption">
                      Oops looks like there is not events!
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8">
                  <button
                    onClick={handlePrevPage}
                    className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-ink-paragraph bg-surface-card border border-ink-light rounded-lg transition-colors hover:bg-ink-offwhite disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage <= 1}
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Previous
                  </button>
                  <span className="mx-4 text-sm text-ink-paragraph">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-ink bg-brand-yellow rounded-lg transition-colors hover:bg-brand-yellow-soft disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage >= totalPages}
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
    </div>
  );
};

export default EventAdminDashboard;