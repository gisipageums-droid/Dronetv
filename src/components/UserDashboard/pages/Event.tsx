import axios from "axios";
import {
  Building2,
  Edit,
  Eye,
  Image,
  MapPin,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTemplate, useUserAuth } from "../../context/context";
import ListingLimitBanner from "../components/common/ListingLimitBanner";
import { EVENTS_API, AUTH_API, LAMBDA } from "../../../lib/apiConfig";
import { authHeader } from "../../../lib/authService";

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;
const DEFAULT_EVENT_IMAGE_PATHS = new Set(["/assets/default-event-image.png", "/images/default-event-image.png"]);
const isCustomImageUrl = (url: string | undefined) => !!url && !DEFAULT_EVENT_IMAGE_PATHS.has(url);

// Same category tabs as the admin event dashboard (EventAdminDashboard.tsx) — sidebar
// "Expos"/"Conferences"/"Workshops" links deep-link here via ?view=, and the sidebar
// "Event Calendar" link and "My Listings > Events" both land on the unfiltered "all" view.
const VIEW_TABS = [
  { id: "all", label: "All Events" },
  { id: "expos", label: "Expos" },
  { id: "conferences", label: "Conferences" },
  { id: "workshops", label: "Workshops" },
];

function matchesView(event: EventCard, view: string): boolean {
  if (view === "all") return true;
  const cat = (event.category || "").toLowerCase();
  if (view === "expos") return cat.includes("expo");
  if (view === "conferences") return cat.includes("conference");
  if (view === "workshops") return cat.includes("workshop");
  return true;
}

function getEventLimit(earned: number) {
  if (earned >= 8000) return Infinity;
  if (earned >= 2000) return 10;
  if (earned >= 500) return 3;
  return 2;
}

interface EventCard {
  heroBannerImage: string | undefined;
  eventId: string;
  userId: string;
  submissionId: string;
  eventName: string;
  shortDescription: string;
  eventDate: string;
  eventTime: string;
  location: string;
  category: string;
  reviewStatus: "under_review" | "approved" | "rejected";
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
  cleanUrl: string;
}

interface CardsByStatus {
  under_review: EventCard[];
  approved: EventCard[];
  rejected: EventCard[];
}

interface StatusCounts {
  underReview: number;
  approved: number;
  rejected: number;
}

interface Metadata {
  dashboardType: string;
  requestedUserId: string;
  totalRecordsScanned: number;
  validEventsFound: number;
  requiresUserId: boolean;
}

interface EventResponse {
  success: boolean;
  viewType: string;
  userId: string;
  cards: EventCard[];
  cardsByStatus: CardsByStatus;
  totalCount: number;
  statusCounts: StatusCounts;
  hasEvents: boolean;
  message: string;
  metadata: Metadata;
}

interface EventCardProps {
  event: EventCard;
  onEdit: (eventId: string, templateSelection: string) => Promise<void>;
  onPreview: (eventId: string, templateSelection: string) => Promise<void>;
  onDelete: (event: EventCard) => void;
}

// =================== Event card ==============================
const EventCard: React.FC<EventCardProps> = ({
  onEdit,
  onDelete,
  event,
}) => {
  const placeholderImg = event?.eventName?.charAt(0) || "E";
  const [thumbModal, setThumbModal] = useState(false);
  const [thumbUrl, setThumbUrl] = useState('');
  const [thumbSaving, setThumbSaving] = useState(false);
  const [titleModal, setTitleModal] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const [titleSaving, setTitleSaving] = useState(false);

  const handleSaveThumbnail = useCallback(async () => {
    if (!thumbUrl.trim()) return;
    setThumbSaving(true);
    try {
      if (EVENTS_API) {
        await fetch(`${EVENTS_API}/event/${event.eventId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...authHeader() },
          body: JSON.stringify({ thumbnailUrl: thumbUrl.trim() }),
        });
      } else {
        await fetch(`${LAMBDA.eventsAdmin}/event/${event.eventId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId: event.eventId, action: 'update', userId: event.userId, thumbnailUrl: thumbUrl.trim() }),
        });
      }
      event.thumbnailUrl = thumbUrl.trim();
      setThumbModal(false);
    } catch { /* best effort */ }
    finally { setThumbSaving(false); }
  }, [thumbUrl, event]);

  const handleSaveTitle = useCallback(async () => {
    if (!titleValue.trim()) return;
    setTitleSaving(true);
    try {
      if (EVENTS_API) {
        await fetch(`${EVENTS_API}/event/${event.eventId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...authHeader() },
          body: JSON.stringify({ eventName: titleValue.trim() }),
        });
      } else {
        await fetch(`${LAMBDA.eventsAdmin}/event/${event.eventId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId: event.eventId, action: 'update', userId: event.userId, eventName: titleValue.trim() }),
        });
      }
      event.eventName = titleValue.trim();
      setTitleModal(false);
    } catch { /* best effort */ }
    finally { setTitleSaving(false); }
  }, [titleValue, event]);
  const navigate = useNavigate();

  const formatDate = (dateString: string): string => {
    if (!dateString) return "Date not available";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Date not available";
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase();

    switch (statusLower) {
      case "active":
        return {
          bg: "bg-brand-yellow-soft",
          text: "text-brand-gold",
          label: "Upcoming",
        };
      case "approved":
        return {
          bg: "bg-status-success/15",
          text: "text-status-success",
          label: "Live",
        };
      case "rejected":
        return {
          bg: "bg-status-error/15",
          text: "text-status-error",
          label: "Cancelled",
        };
      default:
        return {
          bg: "bg-brand-yellow-soft",
          text: "text-brand-gold",
          label: "Scheduled",
        };
    }
  };

  const statusStyle = getStatusBadge(event?.reviewStatus || "default");
  const isLive = event?.reviewStatus?.toLowerCase() === "approved";

  return (
    <div className="overflow-hidden w-full h-full bg-surface-card rounded-2xl border border-brand-yellow-soft shadow-lg transition-all duration-300 hover:shadow-xl hover:border-brand-yellow group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Event Image */}
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-md bg-surface-main flex items-center justify-center group-hover:shadow-lg group-hover:bg-brand-yellow-soft transition-all duration-300 group-hover:scale-110 cursor-pointer" onClick={() => { setThumbUrl(isCustomImageUrl(event.thumbnailUrl) ? event.thumbnailUrl! : ''); setThumbModal(true); }}>
              {(isCustomImageUrl(event.thumbnailUrl) || isCustomImageUrl(event.previewImage) || isCustomImageUrl(event.heroBannerImage)) ? (
                <img
                  src={event.thumbnailUrl || event.previewImage || event.heroBannerImage}
                  alt={event.eventName}
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <span className="text-2xl font-bold text-brand-gold">{placeholderImg}</span>
              )}
              <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Image className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Event Info */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-ink line-clamp-2 flex items-center gap-2">
                <span>{event?.eventName || "Unnamed Event"}</span>
                <button
                  type="button"
                  onClick={() => { setTitleValue(event.eventName || ''); setTitleModal(true); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-ink-caption hover:text-brand-yellow flex-shrink-0"
                  title="Edit event title"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </h3>
              <div className="flex items-center text-ink-paragraph mt-1">
                <MapPin className="w-4 h-4 mr-1 text-brand-gold" />
                <span className="text-sm">
                  {event?.location || "Venue not specified"}
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            <div
              className={`inline-flex items-center gap-2 ${statusStyle.bg} ${statusStyle.text} px-3 py-1 rounded-full text-xs font-semibold`}
            >
              <Building2 className="w-3 h-3" />
              {statusStyle.label}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {
              event.category || "General"
            }
          </div>
        </div>

        {/* Stats */}
        {/* <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-1 text-sm text-ink-paragraph">
            <Users className="w-4 h-4 text-brand-gold" />
            <span>{event.attendeesCount || 0} attendees</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-ink-paragraph">
            <Building2 className="w-4 h-4 text-brand-gold" />
            <span>{event.sessionsCount || 0} sessions</span>
          </div>
        </div> */}

        {/* Date and Actions */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 bg-surface-main rounded-lg px-4 py-2 border border-brand-yellow-soft">
            <span className="font-semibold text-brand-gold text-sm">
              {event?.createdAt
                ? formatDate(event?.createdAt)
                : "Date not available"}
            </span>
            <span className="text-xs text-brand-gold">Created Date</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (event?.eventId && event.templateSelection)
                  onEdit(event.submissionId || event.eventId, event.templateSelection);
              }}
              className="flex-1 px-3 py-2 bg-brand-yellow text-ink rounded-lg hover:bg-brand-gold transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-brand-gold"
            >
              <Edit className="w-4 h-4" />
              Edit
              |
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>

          {/* <button
            onClick={() =>
              navigate(
                `/event/form/${event.userId}/${event.eventId}`
              )
            }
            className="flex-1 px-3 py-2 bg-brand-yellow-soft text-brand-gold rounded-lg hover:bg-brand-yellow-soft transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-brand-yellow"
          >
            <Edit className="w-4 h-4" />
            Edit form
          </button> */}

          <div className="flex gap-2">
            <button
              onClick={() =>
                navigate(
                  `/event/leads/${event.eventName}/${event.eventId}`
                )
              }
              className="flex-1 px-3 py-2 bg-brand-yellow-soft text-brand-gold rounded-lg hover:bg-brand-yellow-soft transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-brand-yellow"
            >
              <Eye className="w-4 h-4" />
              View leads
            </button>
            {!isLive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(event);
                }}
                title="Delete this draft"
                className="px-3 py-2 bg-status-error/10 text-status-error rounded-lg hover:bg-status-error/20 transition-colors text-sm font-semibold flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Thumbnail update modal */}
      {thumbModal && (
        <div className="fixed inset-0 z-[10000000] flex items-center justify-center p-4 bg-ink/60" onClick={() => setThumbModal(false)}>
          <div className="bg-surface-card rounded-xl shadow-xl max-w-sm w-full p-5" onClick={e => e.stopPropagation()}>
            <p className="text-sm font-bold text-ink mb-3 flex items-center gap-2"><Image className="w-4 h-4 text-brand-gold" /> Update Event Thumbnail</p>
            <input
              type="url"
              value={thumbUrl}
              onChange={e => setThumbUrl(e.target.value)}
              placeholder="https://... (image URL)"
              className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm text-ink bg-surface-card focus:outline-none focus:ring-2 focus:ring-brand-yellow mb-3"
            />
            {thumbUrl && <img src={thumbUrl} alt="preview" className="w-full h-32 object-cover rounded-lg mb-3" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
            <div className="flex gap-2 justify-end">
              <button onClick={() => setThumbModal(false)} className="px-3 py-1.5 text-sm text-ink-paragraph border border-ink-light rounded-lg hover:bg-ink-offwhite">Cancel</button>
              <button onClick={handleSaveThumbnail} disabled={thumbSaving || !thumbUrl.trim()} className="px-4 py-1.5 text-sm bg-brand-yellow hover:bg-brand-gold text-white font-semibold rounded-lg disabled:opacity-60">
                {thumbSaving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Title update modal */}
      {titleModal && (
        <div className="fixed inset-0 z-[10000000] flex items-center justify-center p-4 bg-ink/60" onClick={() => setTitleModal(false)}>
          <div className="bg-surface-card rounded-xl shadow-xl max-w-sm w-full p-5" onClick={e => e.stopPropagation()}>
            <p className="text-sm font-bold text-ink mb-3 flex items-center gap-2"><Edit className="w-4 h-4 text-brand-gold" /> Edit Event Title</p>
            <input
              type="text"
              value={titleValue}
              onChange={e => setTitleValue(e.target.value)}
              placeholder="Event title"
              className="w-full border border-ink-light rounded-lg px-3 py-2 text-sm text-ink bg-surface-card focus:outline-none focus:ring-2 focus:ring-brand-yellow mb-3"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setTitleModal(false)} className="px-3 py-1.5 text-sm text-ink-paragraph border border-ink-light rounded-lg hover:bg-ink-offwhite">Cancel</button>
              <button onClick={handleSaveTitle} disabled={titleSaving || !titleValue.trim()} className="px-4 py-1.5 text-sm bg-brand-yellow hover:bg-brand-gold text-white font-semibold rounded-lg disabled:opacity-60">
                {titleSaving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =================== Events page ==============================
const Events: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const viewFilter = searchParams.get("view") ?? "all";

  const { user } = useUserAuth();
  const [events, setEvents] = useState<EventCard[]>([]);
  // Plan limits and the "X / Y" banner should only count events that are
  // actually live, not every scheduled/incomplete draft.
  const publishedEvents = useMemo(
    () => events.filter(e => e.reviewStatus?.toLowerCase() === "approved"),
    [events]
  );
  const [loading, setloading] = useState(true);
  const [totalTokensEarned, setTotalTokensEarned] = useState<number>(0);
  // Tracks whether the plan/token profile fetch has resolved. Until it has,
  // totalTokensEarned still holds its 0 default — using it to gate the
  // "Create New Event" button before then falsely triggers the plan-limit
  // block (and misroutes to /user-recharge) for users who already have events.
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    const userId = user?.userData?.email;
    if (!userId) return;
    setloading(true);
    axios.get<EventResponse>(EVENTS_API ? `${EVENTS_API}/events-dashboard?viewType=user&userId=${userId}` : `https://o9og9e2rik.execute-api.ap-south-1.amazonaws.com/prod/events-dashboard?viewType=user&userId=${userId}`).then((response) => {
      setEvents(response.data.cards);
    }).catch(() => {
    }).finally(() => {
      setloading(false);
    });
    fetch(`${PROFILE_API}?userId=${userId}`, { headers: authHeader() })
      .then(r => r.json())
      .then(d => {
        const p = d?.profile ?? {};
        setTotalTokensEarned(p.totalTokensEarned ?? p.tokenBalance ?? 0);
      })
      .catch(() => {})
      .finally(() => setProfileLoaded(true));
  }, [user?.userData?.email]);

  const handleEdit = async (eventId: string, templateSelection: string) => {
    try {
      if (templateSelection === "1") {
        navigate(`/edit/event/t1/final/${eventId}/${user?.userData?.email}`);
      } else if (templateSelection === "2") {
        navigate(`/edit/event/t2/final/${eventId}/${user?.userData?.email}`);
      }
    } catch (error) {
      alert("Failed to load template for editing. Please try again.");
    }
  };

  const handlePreview = async (eventId: string, templateSelection: string) => {
    try {
      if (templateSelection === "1") {
        navigate(`/user/events/preview/1/${eventId}/user123`);
      } else if (templateSelection === "2") {
        navigate(`/user/events/preview/2/${eventId}/user123`);
      }
    } catch (error) {
      alert("Failed to load template for preview. Please try again.");
    }
  };

  const handleDeleteEvent = async (event: EventCard) => {
    if (!window.confirm(`Delete "${event.eventName || "this event"}"? This draft will be permanently removed and cannot be recovered.`)) return;
    try {
      await axios.post(
        EVENTS_API ? `${EVENTS_API}/delete-event` : `${LAMBDA.eventsDelete}/delete-event`,
        { eventId: event.eventId },
        { headers: { 'Content-Type': 'application/json', ...(EVENTS_API ? authHeader() : {}) } }
      );
      toast.success('Draft deleted');
      setEvents(prev => prev.filter(e => e.eventId !== event.eventId));
    } catch {
      toast.error('Failed to delete. Please try again.');
    }
  };
  const filteredEvents = useMemo(() => {
    return events
      ?.filter((event) => matchesView(event, viewFilter))
      .filter(
        (event) =>
          event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm, events, viewFilter]);

  const viewLabel = viewFilter === "expos" ? "Expos" : viewFilter === "conferences" ? "Conferences" : viewFilter === "workshops" ? "Workshops" : "Events Directory";

  // Skeleton Loading
  const SkeletonCard: React.FC = () => (
    <div className="overflow-hidden w-full h-full bg-surface-card rounded-2xl border border-brand-yellow-soft shadow-lg transition-all duration-300 group animate-pulse p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-brand-yellow-soft p-2 flex items-center justify-center" />
          <div className="flex-1">
            <div className="h-5 bg-brand-yellow-soft rounded w-3/4 mb-2" />
            <div className="h-3 bg-brand-yellow-soft rounded w-1/2" />
          </div>
        </div>

        <div className="w-24 h-7 bg-brand-yellow-soft rounded-full" />
      </div>

      {/* Categories */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <div className="h-6 bg-brand-yellow-soft rounded-full w-20" />
          <div className="h-6 bg-brand-yellow-soft rounded-full w-16" />
          <div className="h-6 bg-brand-yellow-soft rounded-full w-24" />
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-4">
        <div className="h-4 bg-brand-yellow-soft rounded w-20" />
        <div className="h-4 bg-brand-yellow-soft rounded w-16" />
      </div>

      {/* Date and Actions */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 bg-surface-main rounded-lg px-4 py-2 border border-brand-yellow-soft">
          <div className="h-4 bg-brand-yellow-soft rounded w-32" />
          <div className="h-3 bg-brand-yellow-soft rounded w-16 ml-auto" />
        </div>

        <div className="flex gap-2 justify-between">
          <div className="flex-1 h-10 bg-brand-yellow-soft rounded-lg" />
          <div className="flex-1 h-10 bg-brand-yellow-soft rounded-lg" />
          <div className="flex-1 h-10 bg-brand-yellow-soft rounded-lg" />
        </div>

        <div className="h-10 bg-brand-yellow-soft rounded-lg mt-2" />
      </div>

      {/* Event ID */}
      <div className="mt-4 pt-4 border-t border-brand-yellow-soft">
        <div className="h-3 bg-brand-yellow-soft rounded w-1/3" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-main p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-1 sm:mb-2 flex items-center gap-2">
            <Users className="w-6 h-6 flex-shrink-0" />
            {viewLabel}
          </h1>
          <p className="text-ink-paragraph mb-2">
            Browse and manage your events and registrations
          </p>
          <ListingLimitBanner count={publishedEvents.length} type="event" label="Events" />
        </div>

        {(() => {
          const limit = getEventLimit(totalTokensEarned);
          const atLimit = profileLoaded && isFinite(limit) && publishedEvents.length >= limit;
          return atLimit ? (
            <button
              onClick={() => navigate("/user-recharge")}
              className="bg-ink-light text-sm font-medium text-ink-caption flex items-center gap-2 px-4 py-2.5 sm:py-4 rounded-lg self-start sm:self-auto border border-ink-light cursor-not-allowed whitespace-nowrap"
              title="Plan limit reached. Upgrade to add more."
            >
              <Plus className="w-5 h-5" />
              Limit Reached — Upgrade
            </button>
          ) : (
            <button
              onClick={() => navigate("/event/select", viewFilter !== "all" ? { state: { eventType: viewFilter.slice(0, -1) } } : undefined)}
              className="bg-brand-gold text-sm font-medium text-white flex items-center gap-2 px-4 py-2.5 sm:py-4 rounded-lg self-start sm:self-auto hover:bg-brand-gold hover:scale-110 transition-all duration-200 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              {viewFilter === "expos" ? "Add New Expo" : viewFilter === "conferences" ? "Add New Conference" : viewFilter === "workshops" ? "Add New Workshop" : "Create New Event"}
            </button>
          );
        })()}
      </div>

      {/* View tabs — same categories as the admin event dashboard */}
      <div className="flex gap-0 border-b-2 border-brand-yellow-soft mb-4 overflow-x-auto">
        {VIEW_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSearchParams(prev => {
              if (tab.id === "all") prev.delete("view");
              else prev.set("view", tab.id);
              return prev;
            }, { replace: true })}
            className={`px-4 py-2 text-sm font-semibold whitespace-nowrap border-b-[3px] -mb-[2px] transition-all ${viewFilter === tab.id ? "text-ink border-brand-gold" : "text-ink-caption border-transparent hover:text-ink-paragraph"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-8 relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
          <Search className="h-5 w-5 text-brand-gold" />
        </div>
        <input
          type="text"
          placeholder="Search by event name, location, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-3 bg-surface-card border-2 border-brand-yellow-soft rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      ) : filteredEvents && filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.eventId}
              event={event}
              onPreview={handlePreview}
              onEdit={handleEdit}
              onDelete={handleDeleteEvent}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-ink-caption">
          <Search className="w-16 h-16 text-brand-yellow-soft mx-auto mb-4" />
          {searchTerm
            ? `No events found matching "${searchTerm}"`
            : viewFilter !== "all"
              ? `No ${viewLabel.toLowerCase()} yet. Click "Add New ${viewLabel.slice(0, -1)}" to add one.`
              : "No events yet. Click Create New Event to add one."}
        </div>
      )}
    </div>
  );
};

export default Events;