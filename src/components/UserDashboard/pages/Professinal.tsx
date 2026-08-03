import {
  Building2,
  Edit,
  Eye,
  MapPin,
  Plus,
  Search,
  Users,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/context";
import { toast } from "react-toastify";
import ListingLimitBanner from "../components/common/ListingLimitBanner";
import { PROFESSIONAL_API, AUTH_API, LAMBDA } from '../../../lib/apiConfig';

const PROFILE_API = AUTH_API ? `${AUTH_API}/profile` : `${LAMBDA.profile}/profile`;

function getProfessionalLimit(earned: number) {
  if (earned >= 8000) return Infinity;
  if (earned >= 2000) return 15;
  if (earned >= 500) return 5;
  return 2;
}

interface User {
  userId: string;
  userData: {
    email: string;
  };
}

interface IProfessional {
  professionalId: string;
  userId: string;
  submissionId: string;
  professionalName: string;
  fullName: string;
  professionalDescription: string;
  location: string;
  categories: string[];
  skillsCount: number;
  servicesCount: number;
  reviewStatus: string;
  templateSelection: string;
  status: boolean;
  lastModified: string;
  createdAt: string;
  publishedDate: string;
  urlSlug: string;
  previewImage: string;
  heroImage: string;
  adminNotes: string;
  version: number;
  hasEdits: boolean;
  completionPercentage: number;
  hasCustomImages: boolean;
  lastActivity: string;
  canEdit: boolean;
  canResubmit: boolean;
  isVisible: boolean;
  isApproved: boolean;
  dashboardType: string;
  cleanUrl: string;
}

interface IProfessionalApiResponse {
  success: boolean;
  viewType: string;
  userId: string;
  totalCount: number;
  hasTemplates: boolean;
  message: string;
  cards: IProfessional[];
  cardsByStatus: object;
  statusCounts: object;
  metadata: object;
}

interface ProfessinalCardProps {
  professional: IProfessional;
  onEdit: (professionalId: string, templateSelection: string) => Promise<void>;
  onPreview: (
    professionalId: string,
    templateSelection: string
  ) => Promise<void>;
}

// =================== Professinal card ==============================
const Card: React.FC<ProfessinalCardProps> = ({
  onEdit,
  professional,
}) => {
  const placeholderImg =
    professional.previewImage || professional?.fullName?.charAt(0) || "P";
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
          label: "Under Review",
        };
      case "approved":
        return {
          bg: "bg-status-success/15",
          text: "text-status-success",
          label: "Published",
        };
      case "rejected":
        return {
          bg: "bg-status-error/15",
          text: "text-status-error",
          label: "Rejected",
        };
      default:
        return {
          bg: "bg-brand-yellow-soft",
          text: "text-brand-gold",
          label: "Published",
        };
    }
  };

  const statusStyle = getStatusBadge(professional?.reviewStatus || "default");

  return (
    <div className="overflow-hidden w-full h-full bg-surface-card rounded-2xl border border-brand-yellow-soft shadow-lg transition-all duration-300 hover:shadow-xl hover:border-brand-yellow group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Company Image */}
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md bg-surface-main p-2 flex items-center justify-center group-hover:shadow-lg group-hover:bg-brand-yellow-soft transition-all duration-300 group-hover:scale-110">
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-brand-gold">
                {professional.previewImage ? (
                  <img
                    src={placeholderImg}
                    alt={professional.fullName}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  placeholderImg
                )}
              </div>
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-ink line-clamp-2">
                {professional?.fullName || "Unnamed Company"}
              </h3>
              <div className="flex items-center text-ink-paragraph mt-1">
                <MapPin className="w-4 h-4 mr-1 text-brand-gold" />
                <span className="text-sm">
                  {professional?.location || "Location not specified"}
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

        {/* Sectors */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {(professional?.categories && professional?.categories.length > 0
              ? professional.categories
              : ["General"]
            ).map((sector, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-brand-yellow-soft text-brand-gold text-xs font-medium rounded-full border border-brand-yellow-soft"
              >
                {sector}
              </span>
            ))}
          </div>
        </div>

        {/* Date and Actions */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 bg-surface-main rounded-lg px-4 py-2 border border-brand-yellow-soft">
            <span className="font-semibold text-brand-gold text-sm">
              {professional?.publishedDate
                ? formatDate(professional?.publishedDate)
                : "Date not available"}
            </span>
            <span className="text-xs text-brand-gold">Published</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (
                  professional?.professionalId &&
                  professional.templateSelection
                )
                  onEdit(
                    professional.professionalId,
                    professional.templateSelection
                  );
              }}
              className="flex-1 px-3 py-2 bg-brand-yellow text-brand-gold rounded-lg hover:bg-brand-gold transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-brand-gold"
            >
              <Edit className="w-4 h-4" />
              Edit
              |
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>

          <button
            onClick={() =>
              navigate(
                `/user-professional/leads/${encodeURIComponent(
                  professional?.fullName || "Professional"
                )}/${professional.professionalId}`
              )
            }
            className="flex-1 px-3 py-2 bg-status-success/15 text-status-success rounded-lg hover:bg-status-success/25 transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-status-success"
          >
            <Users className="w-4 h-4" />
            Leads
          </button>
           {/* <button
            onClick={() =>
              navigate(
                `/professional/form/${professional.userId}/${professional.professionalId}`
              )
            }
            className="flex-1 px-3 py-2 bg-brand-yellow-soft text-brand-gold rounded-lg hover:bg-brand-yellow-soft transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-brand-yellow"
          >
            <Edit className="w-4 h-4" />
            Edit form
          </button> */}

          <button
            onClick={() =>
              navigate(
                `/professional/form/${professional.userId}/${professional.professionalId}`
              )
            }
            className="flex-1 px-3 py-2 bg-brand-yellow-soft text-brand-gold rounded-lg hover:bg-brand-yellow-soft transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-brand-yellow"
          >
            <Edit className="w-4 h-4" />
            Edit Form
          </button>
        </div>

        {/* Published ID */}
        {/* <div className="mt-4 pt-4 border-t border-brand-yellow-soft">
          <div className="text-xs text-ink-caption">
            ID: {professional?.professionalId || "No ID"}
          </div>
        </div> */}
      </div>
    </div>
  );
};

// =================== Professinal page ==============================
const Professinal: React.FC = () => {
  const { user }: { user: User | null } = useUserAuth();
  const [professionals, setProfessionals] =
    useState<IProfessionalApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalTokensEarned, setTotalTokensEarned] = useState<number>(0);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const navigate = useNavigate();

  const fetchProfessionals = useCallback(async (): Promise<void> => {
    try {
      if (!user) {
        toast.error(
          "User not authenticated. Please log in to view your profiles."
        );
        throw new Error(
          "User not authenticated. Please log in to view your profiles."
        );
      }

      if (!user.userData.email || user.userData.email.trim() === "") {
        toast.error("User ID is missing. Please log in again.");
        throw new Error("User ID is missing. Please log in again.");
      }

      setLoading(true);

      const res = await fetch(
        PROFESSIONAL_API ? `${PROFESSIONAL_API}/professional-dashboard-cards?viewType=user&userId=${user.userData.email}` : `${LAMBDA.professional}/professional-dashboard-cards?viewType=user&userId=${user.userData.email}`
      );

      if (!res.ok) throw new Error("Failed to fetch companies");

      const data: IProfessionalApiResponse = await res.json();
      setProfessionals(data);
    } catch (err: unknown) {
      console.error("Error in fetchProfiles:", err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong!...");
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleEdit = async (
    professionalId: string,
    templateSelection: string
  ) => {
    try {
      if (!user?.userData?.email) {
        throw new Error("User not authenticated");
      }

      if (templateSelection === "template-1") {
        navigate(
          `/user/professionals/edit/1/${professionalId}/${user.userData.email}`
        );
      } else if (templateSelection === "template-2") {
        navigate(
          `/user/professionals/edit/2/${professionalId}/${user.userData.email}`
        );
      }
    } catch (error) {
      console.error("Error loading template for editing:", error);
      toast.error("Failed to load template for editing. Please try again.");
    }
  };

  const handlePreview = async (
    professionalId: string,
    templateSelection: string
  ) => {
    try {
      if (!user?.userData?.email) {
        throw new Error("User not authenticated");
      }

      if (templateSelection === "template-1") {
        navigate(
          `/user/professionals/preview/1/${professionalId}/${user.userData.email}`
        );
      } else if (templateSelection === "template-2") {
        navigate(
          `/user/professionals/preview/2/${professionalId}/${user.userData.email}`
        );
      }
    } catch (error) {
      console.error("Error loading template for preview:", error);
      alert("Failed to load template for preview. Please try again.");
    }
  };

  useEffect(() => {
    const userId = user?.userData?.email || "";
    if (!userId) return;
    fetchProfessionals();
    fetch(`${PROFILE_API}?userId=${userId}`)
      .then(r => r.json())
      .then(d => {
        const p = d?.profile ?? {};
        setTotalTokensEarned(p.totalTokensEarned ?? p.tokenBalance ?? 0);
      })
      .catch(() => {})
      .finally(() => setProfileLoaded(true));
  }, [user, fetchProfessionals]);

  const filteredProfessionals = useMemo(() => {
    return professionals?.cards.filter(
      (p) =>
        p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categories.some((c) =>
          c.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [professionals, searchTerm]);

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

      {/* Sectors */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <div className="h-6 bg-brand-yellow-soft rounded-full w-20" />
          <div className="h-6 bg-brand-yellow-soft rounded-full w-16" />
          <div className="h-6 bg-brand-yellow-soft rounded-full w-24" />
        </div>
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

      {/* Published ID */}
      <div className="mt-4 pt-4 border-t border-brand-yellow-soft">
        <div className="h-3 bg-brand-yellow-soft rounded w-1/3" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-main p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-ink mb-1 flex items-center gap-2">
            <Users className="w-6 h-6 shrink-0" />
            Professional Directory
          </h1>
          <p className="text-ink-paragraph mb-2">
            Browse and manage professional submissions
          </p>
          <ListingLimitBanner count={professionals?.cards?.length ?? 0} type="professional" label="Professionals" />
        </div>

        {(() => {
          const limit = getProfessionalLimit(totalTokensEarned);
          const atLimit = profileLoaded && isFinite(limit) && (professionals?.cards?.length ?? 0) >= limit;
          return atLimit ? (
            <button
              onClick={() => navigate("/user-recharge")}
              className="bg-ink-light text-sm font-medium text-ink-caption flex items-center gap-2 px-4 py-3 rounded-lg shrink-0 border border-ink-light cursor-not-allowed self-start sm:self-auto"
              title={`Plan limit reached. Upgrade to add more.`}
            >
              <Plus className="w-5 h-5" />
              Limit Reached — Upgrade
            </button>
          ) : (
            <button
              onClick={() => {
                try { localStorage.removeItem("professionalFormDraft"); } catch { /* ignore */ }
                navigate("/professional/select");
              }}
              className="bg-brand-gold text-sm font-medium text-white flex items-center gap-2 px-4 py-3 rounded-lg shrink-0 hover:bg-brand-gold hover:scale-110 transition-all duration-200 self-start sm:self-auto"
            >
              <Plus className="w-5 h-5" />
              Add New Professional
            </button>
          );
        })()}
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
          <Search className="h-5 w-5 text-brand-gold" />
        </div>
        <input
          type="text"
          placeholder="Search by professional name, location, or sector..."
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
      ) : filteredProfessionals && filteredProfessionals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map((professional) => (
            <Card
              key={professional.professionalId}
              professional={professional}
              onPreview={handlePreview}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-ink-caption">
          <Search className="w-16 h-16 text-brand-yellow-soft mx-auto mb-4" />
          {searchTerm
            ? `No professionals found matching “${searchTerm}”`
            : 'No professional profiles found. Click Add New Professional to create one.'
          }
        </div>
      )}
    </div>
  );
};

export default Professinal;