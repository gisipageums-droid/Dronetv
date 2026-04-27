import axios from "axios";
import {
  Building2,
  Edit,
  Eye,
  MapPin,
  Plus,
  Search,
  Users,
} from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTemplate, useUserAuth } from "../../context/context";

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
}

// =================== Event card ==============================
const EventCard: React.FC<EventCardProps> = ({
  onEdit,
  event,
}) => {
  const placeholderImg =
    event.previewImage || event?.eventName?.charAt(0) || "E";
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
          bg: "bg-yellow-200",
          text: "text-yellow-900",
          label: "Upcoming",
        };
      case "approved":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          label: "Live",
        };
      case "rejected":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          label: "Cancelled",
        };
      default:
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-900",
          label: "Scheduled",
        };
    }
  };

  const statusStyle = getStatusBadge(event?.reviewStatus || "default");

  return (
    <div className="overflow-hidden w-full h-full bg-white rounded-2xl border border-yellow-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-yellow-400 group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Event Image */}
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md bg-yellow-50 p-2 flex items-center justify-center group-hover:shadow-lg group-hover:bg-yellow-100 transition-all duration-300 group-hover:scale-110">
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-yellow-600">
                {event.previewImage ? (
                  <img
                    src={event.heroBannerImage} 
                    alt={event.eventName}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  placeholderImg
                )}
              </div>
            </div>

            {/* Event Info */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                {event?.eventName || "Unnamed Event"}
              </h3>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1 text-yellow-500" />
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
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users className="w-4 h-4 text-yellow-500" />
            <span>{event.attendeesCount || 0} attendees</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Building2 className="w-4 h-4 text-yellow-500" />
            <span>{event.sessionsCount || 0} sessions</span>
          </div>
        </div> */}

        {/* Date and Actions */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 bg-yellow-50 rounded-lg px-4 py-2 border border-yellow-200">
            <span className="font-semibold text-yellow-700 text-sm">
              {event?.createdAt
                ? formatDate(event?.createdAt)
                : "Date not available"}
            </span>
            <span className="text-xs text-yellow-600">Created Date</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (event?.eventId && event.templateSelection)
                  onEdit(event.eventId, event.templateSelection);
              }}
              className="flex-1 px-3 py-2 bg-yellow-400 text-yellow-900 rounded-lg hover:bg-yellow-500 transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-yellow-500"
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
            className="flex-1 px-3 py-2 bg-yellow-200 text-yellow-900 rounded-lg hover:bg-yellow-300 transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-yellow-400"
          >
            <Edit className="w-4 h-4" />
            Edit form
          </button> */}

          <button
            onClick={() =>
              navigate(
                `/event/leads/${event.eventName}/${event.eventId}`
              )
            }
            className="flex-1 px-3 py-2 bg-yellow-200 text-yellow-900 rounded-lg hover:bg-yellow-300 transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-yellow-400"
          >
            <Eye className="w-4 h-4" />
            View leads
          </button>
        </div>

        {/* Event ID */}
        {/* <div className="mt-4 pt-4 border-t border-yellow-200">
          <div className="text-xs text-gray-500">
            ID: {event?.eventId || "No ID"}
          </div>
        </div> */}
      </div>
    </div>
  );
};

// =================== Events page ==============================
const Events: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { user } = useUserAuth();
  console.log("user", user);
  const [events, setEvents] = useState<EventCard[]>([]);
  console.log("events", events)
  const [loading, setloading] = useState(true);

  //get data
  useEffect(() => {
    setloading(true);

    axios.get<EventResponse>(`https://o9og9e2rik.execute-api.ap-south-1.amazonaws.com/prod/events-dashboard?viewType=user&userId=${user?.userData?.email}`).then((response) => {
      console.log(response.data);
      setEvents(response.data.cards);
    }).catch((error) => {
      console.log(error);
    }).finally(() => {
      setloading(false);
    })
  }, []);

  const handleEdit = async (eventId: string, templateSelection: string) => {
    try {
      if (templateSelection === "1") {
        navigate(`/edit/event/t1/final/${eventId}/${user?.userData?.email}`);
      } else if (templateSelection === "2") {
        navigate(`/edit/event/t2/final/${eventId}/${user?.userData?.email}`);
      }
    } catch (error) {
      console.error("Error loading template for editing:", error);
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
      console.error("Error loading template for preview:", error);
      alert("Failed to load template for preview. Please try again.");
    }
  };
  console.log("events", events);

  const filteredEvents = useMemo(() => {
    return events?.filter(
      (event) =>
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, events]);

  // Skeleton Loading
  const SkeletonCard: React.FC = () => (
    <div className="overflow-hidden w-full h-full bg-white rounded-2xl border border-yellow-200 shadow-lg transition-all duration-300 group animate-pulse p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-yellow-100 p-2 flex items-center justify-center" />
          <div className="flex-1">
            <div className="h-5 bg-yellow-100 rounded w-3/4 mb-2" />
            <div className="h-3 bg-yellow-100 rounded w-1/2" />
          </div>
        </div>

        <div className="w-24 h-7 bg-yellow-100 rounded-full" />
      </div>

      {/* Categories */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <div className="h-6 bg-yellow-100 rounded-full w-20" />
          <div className="h-6 bg-yellow-100 rounded-full w-16" />
          <div className="h-6 bg-yellow-100 rounded-full w-24" />
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-4">
        <div className="h-4 bg-yellow-100 rounded w-20" />
        <div className="h-4 bg-yellow-100 rounded w-16" />
      </div>

      {/* Date and Actions */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 bg-yellow-50 rounded-lg px-4 py-2 border border-yellow-200">
          <div className="h-4 bg-yellow-100 rounded w-32" />
          <div className="h-3 bg-yellow-100 rounded w-16 ml-auto" />
        </div>

        <div className="flex gap-2 justify-between">
          <div className="flex-1 h-10 bg-yellow-100 rounded-lg" />
          <div className="flex-1 h-10 bg-yellow-100 rounded-lg" />
          <div className="flex-1 h-10 bg-yellow-100 rounded-lg" />
        </div>

        <div className="h-10 bg-yellow-100 rounded-lg mt-2" />
      </div>

      {/* Event ID */}
      <div className="mt-4 pt-4 border-t border-yellow-200">
        <div className="h-3 bg-yellow-100 rounded w-1/3" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-amber-50 p-8">
      <div className="flex items-center gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Events Directory
          </h1>
          <p className="text-gray-600 mb-8">
            Browse and manage your events and registrations
          </p>
        </div>

        <button
          onClick={() => navigate("/event/select")}
          className="bg-yellow-500 text-sm font-medium text-white flex items-center gap-2 px-4 py-4 rounded-lg align-top hover:bg-yellow-600 hover:scale-110 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Create New Event
        </button>
      </div>

      <div className="mb-8 relative">
        <Search className="absolute left-4 top-4 text-yellow-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by event name, location, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-3 bg-white border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
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
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <Search className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
          No events found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default Events;