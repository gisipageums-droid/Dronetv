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
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "motion/react";

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
          className="fixed top-0 left-0 right-0 bottom-0 z-[999999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {icon}
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                disabled={isLoading}
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mb-6">
              <p className="text-gray-600">{message}</p>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 justify-end">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-4 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
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
    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4 mt-2">
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
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </label>
      <div className="text-sm text-gray-900 bg-gray-50 p-2.5 rounded-lg border border-gray-200 break-words">
        {value?.toString() || (
          <span className="text-gray-400 italic">Not provided</span>
        )}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Key className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Event Details & Credentials
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Viewing details for {basicEventInformation.eventDetails.eventTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-200/80 transition-colors text-gray-500 hover:text-gray-700"
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
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <h4 className="font-semibold text-gray-800 text-sm">{section.title}</h4>
                        <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">{section.description}</p>
                      </div>
                    ))}
                    {sectionsAndZones.sections.length === 0 && <p className="text-sm text-gray-500 italic">No sections added.</p>}
                  </div>
                </div>

                {/* 4. Zones */}
                <div>
                  <SectionTitle>Zones</SectionTitle>
                  <div className="space-y-3">
                    {sectionsAndZones.zones.map((zone, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <h4 className="font-semibold text-gray-800 text-sm">{zone.zoneTitle}</h4>
                        <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">{zone.description}</p>
                      </div>
                    ))}
                    {sectionsAndZones.zones.length === 0 && <p className="text-sm text-gray-500 italic">No zones added.</p>}
                  </div>
                </div>
              </div>

              {/* 5. Speakers & Themes */}
              <div className="mb-8">
                <SectionTitle>Speakers & Partners</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Speakers */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 uppercase mb-3">Speakers</h4>
                    <div className="space-y-3">
                      {speakersThemesAndPartners.speakers.map((speaker, idx) => (
                        <div key={idx} className="flex gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                            {speaker.name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{speaker.prefix} {speaker.name}</p>
                            <p className="text-xs text-gray-600">{speaker.designation} at {speaker.organization}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-gray-200 text-gray-700 text-[10px] rounded-full">Day {speaker.day}</span>
                          </div>
                        </div>
                      ))}
                      {speakersThemesAndPartners.speakers.length === 0 && <p className="text-sm text-gray-500 italic">No speakers added.</p>}
                    </div>
                  </div>

                  {/* Partners */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 uppercase mb-3">Partners</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {speakersThemesAndPartners.partners.map((partner, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col items-center text-center">
                          {partner.logo && (
                            <img src={partner.logo} alt={partner.partnerName} className="w-12 h-12 object-contain mb-2 rounded-md" />
                          )}
                          <p className="text-sm font-bold text-gray-900">{partner.partnerName}</p>
                          <p className="text-xs text-gray-600 truncate w-full">{partner.organization}</p>
                        </div>
                      ))}
                      {speakersThemesAndPartners.partners.length === 0 && <p className="text-sm text-gray-500 italic">No partners added.</p>}
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
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Hero Banner
                      </label>
                      {mediaContactsAndPublishing.media.heroBanner.mediaUrl ? (
                        <a href={mediaContactsAndPublishing.media.heroBanner.mediaUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-32 rounded-lg bg-gray-100 overflow-hidden relative group">
                          <img src={mediaContactsAndPublishing.media.heroBanner.mediaUrl} alt="Hero Banner" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Eye className="text-white drop-shadow-md" />
                          </div>
                        </a>
                      ) : (
                        <div className="w-full h-24 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <InfoField label="Created At" value={formatDate(metadata.createdAt)} />
                  <InfoField label="Updated At" value={formatDate(metadata.updatedAt)} />
                  <InfoField label="Status" value={metadata.status} />
                  <InfoField label="Draft ID" value={metadata.draftId} />
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
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
  return (
    <div className="relative h-[40vh] bg-amber-50 flex items-center justify-center px-4 sm:px-6 overflow-hidden">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative w-full max-w-3xl text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-4 text-3xl font-extrabold text-yellow-900 md:text-5xl md:mb-6 tracking-tight">
            Admin Dashboard
            <span className="block mt-2 text-transparent bg-clip-text bg-amber-600 ">
              Event Management
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-base font-medium text-yellow-800/80 md:text-lg leading-relaxed">
            Review and manage all event listings, credentials, and approvals
            with ease.
          </p>
        </motion.div>
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
        className="flex justify-between items-center px-4 py-3 w-full text-sm text-gray-700 bg-gray-50 rounded-lg border border-gray-200 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-300"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className={value === options[0] ? "text-gray-500" : "text-gray-900"}
        >
          {value || options[0] || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute z-10 mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-sm"
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
                ? "bg-gray-50 text-gray-900 font-medium"
                : "text-gray-700 hover:bg-gray-50"
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
    { value: "all", label: "All Events", color: "text-yellow-900" },
    { value: "under_review", label: "Under Review", color: "text-yellow-600" },
    { value: "approved", label: "Approved", color: "text-green-600" },
    { value: "rejected", label: "Rejected", color: "text-red-600" },
  ];

  return (
    <div
      className={`bg-white/40 backdrop-blur-xl border-r border-yellow-200/50 p-4 md:p-8 h-fit md:sticky md:top-0 
      ${isMobileSidebarOpen
          ? "fixed top-11 left-0 right-0 z-50 w-full overflow-y-auto bg-orange-50"
          : "hidden md:block md:w-80"
        }`}
    >
      {isMobileSidebarOpen && (
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="text-xl font-bold text-yellow-900">Filters</h2>
          <button
            onClick={onCloseMobileSidebar}
            className="p-2 text-yellow-800"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="space-y-6 md:space-y-8">
        {/* Status Filter Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-yellow-900 block">
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
                    ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                    : option.value === "approved"
                      ? "bg-green-100 border-green-300 text-green-800"
                      : option.value === "rejected"
                        ? "bg-red-100 border-red-300 text-red-800"
                        : "bg-gray-100 border-gray-300 text-gray-800"
                  : "bg-white/50 border-yellow-200/50 hover:bg-gray-50 text-gray-700"
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
          <label className="text-sm font-medium text-yellow-900 block">
            Search Events
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-600" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSearchChange(e.target.value)
              }
              className="w-full pl-10 pr-4 py-3 text-sm border border-yellow-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 bg-white/50 transition-colors placeholder-yellow-700/50 text-yellow-900"
              aria-label="Search events"
            />
          </div>
        </div>

        {/* Sort Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-yellow-900 block">
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
          className="text-sm text-yellow-700 hover:text-yellow-900 transition-colors underline underline-offset-2"
        >
          Clear all filters
        </button>

        {/* Divider */}
        <div className="border-t border-yellow-200/50"></div>

        {/* Navigation Links */}
        <div className="flex gap-2 flex-col mt-6">
          <motion.button
            whileTap={{ scale: [0.9, 1] }}
            className="bg-yellow-400/30 text-yellow-900 p-3 rounded-xl shadow-sm hover:shadow-md hover:bg-yellow-400/50 duration-200 flex items-center gap-3 backdrop-blur-sm border border-yellow-200/50"
          >
            <Link
              to={"/admin/professional/dashboard"}
              className="w-full text-left"
            >
              Professionals{" "}
            </Link>
          </motion.button>
          <motion.button
            whileTap={{ scale: [0.9, 1] }}
            className="bg-yellow-400/30 text-yellow-900 p-3 rounded-xl shadow-sm hover:shadow-md hover:bg-yellow-400/50 duration-200 flex items-center gap-3 backdrop-blur-sm border border-yellow-200/50"
          >
            <Link to={"/admin/company/dashboard"} className="w-full text-left">
              Companies{" "}
            </Link>
          </motion.button>
          <motion.button
            whileTap={{ scale: [0.9, 1] }}
            className="bg-yellow-400/30 text-yellow-900 p-3 rounded-xl shadow-sm hover:shadow-md hover:bg-yellow-400/50 duration-200 flex items-center gap-3 backdrop-blur-sm border border-yellow-200/50"
          >
            <Link to={"/admin/plans"} className="w-full text-left">
              Admin Plans{" "}
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
  const placeholderImg = event.previewImage || event.eventName[0];

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
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Needs Review",
      };

    if (reviewStatus === "rejected")
      return { bg: "bg-red-100", text: "text-red-800", label: "Rejected" };
    if (reviewStatus === "approved")
      return { bg: "bg-green-100", text: "text-green-800", label: "Approved" };

    return { bg: "bg-gray-50", text: "text-gray-700", label: "Unknown" };
  };

  const statusStyle = getStatusBadge(event.reviewStatus);

  return (
    <div className="overflow-hidden w-full h-full rounded-2xl border-l-8 shadow-lg transition-all duration-300 hover:shadow-xl group border-gradient-to-b from-amber-500 to-yellow-600 bg-white">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div className="flex gap-3 items-center md:gap-4">
            <div className="flex overflow-hidden justify-center items-center p-1 w-12 h-12 bg-white rounded-xl shadow-md md:w-14 md:h-14 lg:w-16 lg:h-16 group-hover:shadow-lg group-hover:bg-gradient-to-br group-hover:from-amber-50 group-hover:to-yellow-50 transition-all duration-500 group-hover:rotate-3 group-hover:scale-110">
              {event.previewImage ? (
                <img
                  src={event.heroBannerImage}
                  alt={`${event.eventName} logo`}
                  className="w-full h-full object-cover rounded-lg transition-all duration-500 group-hover:rotate-[-3deg] group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <span className="text-4xl font-extrabold text-yellow-600">
                  {placeholderImg}
                </span>
              )}
            </div>

            <div className="max-w-[calc(100%-60px)] md:max-w-none">
              <h3 className="text-lg font-bold text-gray-900 md:text-xl line-clamp-2">
                {event.eventName || "Unnamed Event"}
              </h3>
              <div className="flex items-center mt-1 text-gray-600">
                <MapPin className="mr-1 w-3 h-3" />
                <span className="text-xs md:text-sm">
                  {event.location.slice(0, 25) + `${event.location.length > 25 ? "..." : ""}` || "Location not specified"}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden text-right sm:block">
            <div
              className={`inline-flex items-center gap-2 ${statusStyle.bg} ${statusStyle.text} px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium`}
            >
              <Calendar className="w-3 h-3" />
              {statusStyle.label}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-center md:gap-6">
            <div className="flex gap-2 items-center px-3 py-1 bg-gray-50 rounded-lg md:px-4 md:py-2">
              <span className="text-xs font-bold text-amber-600 md:text-sm">
                {formatDate(event.createdAt)}
              </span>
              <span className="hidden text-xs text-gray-600 md:block">
                Published
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onPreview(event.eventId, event.userId)}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-amber-700 bg-amber-100 rounded-lg transition-colors hover:bg-amber-200 md:text-sm disabled:opacity-50 disabled:pointer-events-none"
              aria-label={`Preview ${event.eventName}`}
              disabled={disabled}
            >
              <Pen className="w-3 h-3 md:w-4 md:h-4" /> Edit /{" "}
              <Eye className="w-3 h-3 md:w-4 md:h-4" /> Preview
            </button>

            <button
              onClick={() => onCredentials(event.draftId)}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-purple-700 bg-purple-100 rounded-lg transition-colors hover:bg-purple-200 md:text-sm disabled:opacity-50 disabled:pointer-events-none"
              aria-label={`Credentials ${event.eventName}`}
              disabled={disabled}
            >
              <Key className="w-3 h-3 md:w-4 md:h-4" />
              Credentials
            </button>

            <button
              onClick={() => onApprove(event.eventId, event.userId)}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-green-700 bg-green-100 rounded-lg transition-colors hover:bg-green-200 md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Approve ${event.eventName}`}
              disabled={disabled || event.reviewStatus === "approved"}
            >
              <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
              Approve
            </button>

            <button
              onClick={() => onReject(event.eventId, event.userId)}
              className="flex gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-red-700 bg-red-100 rounded-lg transition-colors hover:bg-red-200 md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Reject ${event.eventName}`}
              disabled={disabled || event.reviewStatus === "rejected"}
            >
              <XCircle className="w-3 h-3 md:w-4 md:h-4" />
              Reject
            </button>

            <button
              onClick={() => onDelete(event.eventId)}
              className="flex col-span-2 gap-2 justify-center items-center px-3 py-2 text-xs font-medium text-white bg-red-500 rounded-lg transition-colors hover:bg-red-600 md:text-sm disabled:opacity-50 disabled:pointer-events-none"
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
    <div className="w-12 h-12 rounded-full border-b-2 border-purple-600 animate-spin" />
    <span className="ml-4 text-gray-600">Loading events...</span>
  </div>
);

// -------------------- Recent Events Section --------------------
const RecentEventsSection: React.FC<{
  recentEvents: Event[];
  onCredentials: (publishedId: string) => void;
  onPreview: (publishedId: string, userId: string) => void;
  onApprove: (publishedId: string, userId: string) => void;
  onReject: (publishedId: string, userId: string) => void;
  onDelete: (publishedId: string) => void;
  disabled?: boolean;
}> = ({
  recentEvents,
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
            <Clock className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-bold text-yellow-900 md:text-2xl">
              Recent Events
            </h2>
          </div>
          <span className="px-3 py-1 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-full">
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

        <div className="mt-6 border-t border-yellow-200/50"></div>
      </div>
    );
  };

// -------------------- API Service --------------------
const eventApiService = {
  async fetchEventCredentials(eventId: string): Promise<EventCredentialsData> {
    try {
      const response = await fetch(
        `https://dmxs169e33.execute-api.ap-south-1.amazonaws.com/dev/event-formdetails-verification/${eventId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching event credentials:", error);
      throw error;
    }
  },
};

// -------------------- Main Component --------------------
const EventAdminDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("Sort by Date");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
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
      console.error(`Error performing ${type} action:`, err);
      toast.error(`Failed to ${type} event`);
    } finally {
      setIsMutating(false);
      closeConfirmationModal();
    }
  };

  // -------------------- Action Handlers --------------------
  const handleCredentials = async (eventId: string) => {
    try {
      setLoading(true);
      const credentials = await eventApiService.fetchEventCredentials(eventId);
      setCredentialsModal({ isOpen: true, data: credentials });
    } catch (error) {
      console.error("Error fetching credentials:", error);
      toast.error("Failed to fetch credentials");
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewAction = (eventId: string, userId: string) => {
    // Find the event to get its templateSelection
    const event = events.find((e) => e.eventId === eventId);
    if (!event) {
      toast.error("Event not found");
      return;
    }

    // Handle both template selection formats
    if (
      event.templateSelection === "template-1" ||
      event.templateSelection === "1"
    ) {
      navigate(`/edit/event/t1/admin/${eventId}/${userId}`);
    } else if (
      event.templateSelection === "template-2" ||
      event.templateSelection === "2"
    ) {
      navigate(`/edit/event/t2/admin/${eventId}/${userId}`);
    } else {
      // Default to template 1 if unknown
      console.warn(
        `Unknown template selection: ${event.templateSelection}, defaulting to template 1`
      );
      navigate(`/edit/event/t1/admin/${eventId}/${userId}`);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://o9og9e2rik.execute-api.ap-south-1.amazonaws.com/prod/events-dashboard?viewType=admin"
      );
      const data = await response.json();
      const fetchedEvents = data?.cards || [];
      setEvents(fetchedEvents);

      // Sort by creation date descending (latest first)
      const sortedByDate = [...fetchedEvents].sort((a: Event, b: Event) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setRecentEvents(sortedByDate.slice(0, 6));
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAction = async (eventId: string, userId: string) => {
    try {
      await fetch(
        `https://tl85vj590m.execute-api.ap-south-1.amazonaws.com/dev/event/${eventId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: eventId,
            action: "approve",
            adminNotes: "Looks good!",
            userId: userId,
          }),
        }
      );

      toast.success("Event approved successfully");
      fetchEvents();
    } catch (error) {
      console.error("Error approving event:", error);
      toast.error("Failed to approve event");
      throw error;
    }
  };

  const handleRejectAction = async (eventId: string, userId: string) => {
    try {
      await fetch(
        `https://tl85vj590m.execute-api.ap-south-1.amazonaws.com/dev/event/${eventId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: eventId,
            action: "reject",
            adminNotes: "Looks bad!",
            userId: userId,
          }),
        }
      );

      toast.success("Event rejected successfully");
      fetchEvents();
    } catch (error) {
      console.error("Error rejecting event:", error);
      toast.error("Failed to reject event");
      throw error;
    }
  };

  const handleDeleteAction = async (eventId: string) => {
    try {
      await fetch(
        "https://pjqm3sgpzf.execute-api.ap-south-1.amazonaws.com/dev/delete-event",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: eventId,
            action: "delete",
          }),
        }
      );

      toast.success("Event deleted successfully");
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
      throw error;
    }
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
    fetchEvents();
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

      // Status filter logic
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "under_review" && event.reviewStatus === "under_review") ||
        (statusFilter === "approved" && event.reviewStatus === "approved") ||
        (statusFilter === "rejected" && event.reviewStatus === "rejected");

      return matchesSearch && matchesStatus;
    });
  }, [events, searchTerm, statusFilter]);

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
          confirmColor: "bg-amber-600 hover:bg-amber-700",
          icon: <Edit className="text-amber-600" size={24} />,
        };
      case "approve":
        return {
          title: "Confirm Approval",
          message: `Are you sure you want to approve "${eventName}"? This will make the event visible to users.`,
          confirmText: "Approve Event",
          confirmColor: "bg-green-600 hover:bg-green-700",
          icon: <CheckCircle className="text-green-600" size={24} />,
        };
      case "reject":
        return {
          title: "Confirm Rejection",
          message: `Are you sure you want to reject "${eventName}"? This will mark the event as rejected.`,
          confirmText: "Reject Event",
          confirmColor: "bg-red-600 hover:bg-red-700",
          icon: <XCircle className="text-red-600" size={24} />,
        };
      case "delete":
        return {
          title: "Confirm Deletion",
          message: `Are you sure you want to delete "${eventName}"? This action cannot be undone and all event data will be permanently removed.`,
          confirmText: "Delete Event",
          confirmColor: "bg-red-600 hover:bg-red-700",
          icon: <Trash2 className="text-red-600" size={24} />,
        };
      default:
        return {
          title: "Confirm Action",
          message: "Are you sure you want to perform this action?",
          confirmText: "Confirm",
          confirmColor: "bg-blue-600 hover:bg-blue-700",
          icon: <CheckCircle className="text-blue-600" size={24} />,
        };
    }
  };

  const modalConfig = getModalConfig();

  return (
    <div className="w-full min-h-screen h-full bg-orange-50">
      <Header />

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

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        className="p-3 rounded-full border border-gray-200 bg-yellow-500 text-white relative left-5 hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-300 duration-200 md:hidden"
        aria-label="Open filters"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Main layout */}
      <div className="flex">
        <Sidebar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <div className="flex-1 p-4 md:p-8 bg-orange-50">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Recent Events Section - Updated condition to hide when status filter is not "all" */}
              {!searchTerm && statusFilter === "all" && (
                <RecentEventsSection
                  recentEvents={recentEvents}
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
                  <Calendar className="w-6 h-6 text-yellow-600" />
                  <h2 className="text-xl font-bold text-yellow-900 md:text-2xl">
                    {statusFilter === "all" ? "All Events" : statusFilter === "under_review" ? "Under Review Events" : statusFilter === "approved" ? "Approved Events" : "Rejected Events"}
                  </h2>
                </div>
                <span className="px-3 py-1 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-full">
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
                    <Calendar className="w-24 h-24 text-gray-400" />
                    <p className="text-sm font-semibold text-gray-400">
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
                    className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-lg transition-colors hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage <= 1}
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Previous
                  </button>
                  <span className="mx-4 text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg transition-colors hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};

export default EventAdminDashboard;