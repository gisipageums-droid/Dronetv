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
  onPreview,
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
          bg: "bg-yellow-200",
          text: "text-yellow-900",
          label: "Under Review",
        };
      case "approved":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          label: "Published",
        };
      case "rejected":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          label: "Rejected",
        };
      default:
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-900",
          label: "Published",
        };
    }
  };

  const statusStyle = getStatusBadge(professional?.reviewStatus || "default");

  return (
    <div className="overflow-hidden w-full h-full bg-white rounded-2xl border border-yellow-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-yellow-400 group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Company Image */}
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md bg-yellow-50 p-2 flex items-center justify-center group-hover:shadow-lg group-hover:bg-yellow-100 transition-all duration-300 group-hover:scale-110">
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-yellow-600">
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
              <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                {professional?.fullName || "Unnamed Company"}
              </h3>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1 text-yellow-500" />
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
                className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full border border-yellow-200"
              >
                {sector}
              </span>
            ))}
          </div>
        </div>

        {/* Date and Actions */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 bg-yellow-50 rounded-lg px-4 py-2 border border-yellow-200">
            <span className="font-semibold text-yellow-700 text-sm">
              {professional?.publishedDate
                ? formatDate(professional?.publishedDate)
                : "Date not available"}
            </span>
            <span className="text-xs text-yellow-600">Published</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-between">
            {/* <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                window.open(
                  `${window.location.origin}/form/${professional.professionalId}/${professional.userId}/${professional.submissionId}`,
                  "_blank"
                );
              }}
              className="flex-1 px-3 py-2 bg-yellow-200 text-yellow-900 rounded-lg hover:bg-yellow-300 transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-yellow-400"
            >
              <Edit className="w-3 h-3 md:w-4 md:h-4" />
              Edit Data
            </button> */}

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (
                  professional?.professionalId &&
                  professional.templateSelection
                )
                  onPreview(
                    professional.professionalId,
                    professional.templateSelection
                  );
              }}
              className="flex-1 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-yellow-300"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>

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
              className="flex-1 px-3 py-2 bg-yellow-400 text-yellow-900 rounded-lg hover:bg-yellow-500 transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-yellow-500"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>

          <button
            onClick={() =>
              navigate(
                `/user-professional/leads/${professional.professionalName}/${professional.professionalId}`
              )
            }
            className="flex-1 px-3 py-2 bg-yellow-200 text-yellow-900 rounded-lg hover:bg-yellow-300 transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-yellow-400"
          >
            <Eye className="w-4 h-4" />
            View leads
          </button>
        </div>

        {/* Published ID */}
        <div className="mt-4 pt-4 border-t border-yellow-200">
          <div className="text-xs text-gray-500">
            ID: {professional?.professionalId || "No ID"}
          </div>
        </div>
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
        `https://zgkue3u9cl.execute-api.ap-south-1.amazonaws.com/prod/professional-dashboard-cards?viewType=user&userId=${user.userData.email}`
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
    if (user?.userId || user?.userData?.email) {
      fetchProfessionals();
    }
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

      {/* Sectors */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <div className="h-6 bg-yellow-100 rounded-full w-20" />
          <div className="h-6 bg-yellow-100 rounded-full w-16" />
          <div className="h-6 bg-yellow-100 rounded-full w-24" />
        </div>
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

      {/* Published ID */}
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
            <Users w-6 h-6 />
            Professinal Directory
          </h1>
          <p className="text-gray-600 mb-8">
            Browse and manage professinal submissions
          </p>
        </div>

        <button
          onClick={() => navigate("/professional/select")}
          className="bg-yellow-500 text-sm font-medium text-white flex items-center gap-2 px-4 py-4 rounded-lg align-top hover:bg-yellow-600 hover:scale-110 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Add New Professinal
        </button>
      </div>

      <div className="mb-8 relative">
        <Search className="absolute left-4 top-4 text-yellow-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by professinal name, location, or sector..."
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
        <div className="text-center py-20 text-gray-500">
          <Search className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
          No professional found matching “{searchTerm}”
        </div>
      )}
    </div>
  );
};

export default Professinal;