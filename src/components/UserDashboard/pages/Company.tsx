import React, { useState, useMemo, useEffect } from "react";
import { Search, MapPin, Building2, Edit, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTemplate, useUserAuth } from "../../context/context";
import { toast } from "sonner";
//changes
interface Company {
  publishedId: string;
  userId: string;
  draftId: string;
  companyName: string;
  location: string;
  sectors: string[];
  publishedDate?: string;
  createdAt?: string;
  previewImage?: string;
  reviewStatus?: string;
}

interface CompanyCardProps {
  company: Company;
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
}

interface PublishedDetailsResponse {
  publishedId: string;
  templateSelection: string;
  websiteContent: {
    hero: {
      headline?: string;
      subheadline?: string;
      title?: string;
      subtitle?: string;
      description?: string;
      heroImage?: string;
      numberOfClients?: string;
      clientImages?: string[];
      primaryCta?: string;
      secondaryCta?: string;
      features?: string[];
      keyBenefits?: string[];
    };
    about: {
      companyName?: string;
      industry?: string;
      established?: string;
      headquarters?: string;
      description1?: string;
      description2?: string;
      story?: string;
      mission?: string;
      vision?: string;
      values?: Array<{ title: string; description: string }>;
      achievements?: string[];
      certifications?: string[];
      officeImage?: string;
      visionPillars?: string[];
      teamExperience?: string;
    };
    services: {
      headline?: string;
      description?: string;
      services?: any[];
      whyChooseUs?: string[];
    };
    products: {
      headline?: string;
      description?: string;
      products?: any[];
      advantages?: string[];
    };
    clients: {
      headline?: any;
      clients?: any[];
      stats?: any[];
    };
    testimonials: any[];
    blog: any;
    contact: any;
    faq: {
      headline?: string;
      description?: string;
      faqs?: Array<{ question: string; answer: string }>;
    };
    templateMetadata: any;
  };
  mediaAssets: {
    companyLogoUrl?: string;
    heroBackgroundUrl?: string;
    officeImageUrl?: string;
    contactBackgroundUrl?: string;
    dgcaCertificateUrl?: string;
  };
  companyInfo: {
    name: string;
    location: string;
    sectors: string[];
    yearEstablished: string;
  };
  contentSource: string;
  metadata: {
    lastModified: string;
    version: number;
    hasEdits: boolean;
    templateOptimized: boolean;
    ownerId: string;
  };
  editHistory?: {
    version: number;
    lastModified: string;
    editedSections?: string[];
  };
  publishedAt?: string;
  createdAt?: string;
}

// =================== Company card ==============================
const Card: React.FC<CompanyCardProps> = ({ company, onEdit, onPreview }) => {
  const placeholderImg =
    company.previewImage || company?.companyName?.charAt(0) || "C";
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

  const statusStyle = getStatusBadge(company?.reviewStatus || "default");

  return (
    <div className="overflow-hidden w-full h-full bg-white rounded-2xl border border-yellow-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-yellow-400 group">
      <div className="p-6">
        {/* Header */}
        <div className="grid grid-cols-1 items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Company Image */}
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md bg-yellow-50 p-2 flex items-center justify-center group-hover:shadow-lg group-hover:bg-yellow-100 transition-all duration-300 group-hover:scale-110">
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-yellow-600">
                {company.previewImage ? (
                  <img
                    src={placeholderImg}
                    alt={company.companyName}
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
                {company?.companyName || "Unnamed Company"}
              </h3>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1 text-yellow-500" />
                <span className="text-sm">
                  {company?.location || "Location not specified"}
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
            {(company?.sectors && company?.sectors.length > 0
              ? company.sectors
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
              {company?.createdAt
                ? formatDate(company?.createdAt)
                : "Date not available"}
            </span>
            <span className="text-xs text-yellow-600">Published</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-between">
            {/* <button
              onClick={(e) => {
                e.stopPropagation();
                const url = `${window.location.origin}/form/${
                  company?.publishedId || ""
                }/${company?.userId || ""}/${company?.draftId || ""}`;
                window.open(url, "_blank");
              }}
              className="flex-1 px-3 py-2 bg-yellow-200 text-yellow-900 rounded-lg hover:bg-yellow-300 transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-yellow-400"
            >
              <Edit className="w-4 h-4" />
              Edit Data
            </button> */}

            {/* <button
              onClick={(e) => {
                e.stopPropagation();
                if (company?.publishedId) onPreview(company.publishedId);
              }}
              className="flex-1 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-yellow-300"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button> */}

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (company?.publishedId) onEdit(company.publishedId);
              }}
              className="flex-1 px-3 py-2 bg-yellow-400 text-yellow-900 rounded-lg hover:bg-yellow-500 transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-yellow-500"
            >
              <Edit className="w-4 h-4" />
              Edit/Preview
            </button>
          </div>

          <button
            onClick={() =>
              navigate(`/user-company/leads/${company?.companyName}`, {
                state: { publishedId: company?.publishedId },
              })
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
            ID: {company?.publishedId || "No ID"}
          </div>
        </div>
      </div>
    </div>
  );
};

// =================== Company page ==============================
const CompanyPage: React.FC = () => {
  const { user } = useUserAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { setFinaleDataReview } = useTemplate();
  const navigate = useNavigate();

  const fetchCompanies = async (userId: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards?userId=${userId}`
      );

      if (!res.ok) throw new Error("Failed to fetch companies");

      const data = await res.json();

      setCompanies(
        (data.cards || []).map((c: any) => ({
          publishedId: c.publishedId || "",
          userId: c.userId || "",
          draftId: c.draftId || "",
          companyName: c.companyName || "Unnamed Company",
          location: c.location || "Location not specified",
          sectors: Array.isArray(c.sectors)
            ? c.sectors
            : c.sectors
              ? [c.sectors]
              : ["General"],
          publishedDate: c.publishedDate || "",
          createdAt: c.createdAt || "",
          reviewStatus: c.reviewStatus || "active",
          previewImage: c.previewImage || "",
        }))
      );
    } catch (err) {
      console.error("Error fetching companies:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPublishedCompanyDetails = async (
    publishedId: string,
    userId: string,
    setFinaleDataReview: (data: PublishedDetailsResponse) => void
  ) => {
    try {
      const res = await fetch(
        `https://v1lqhhm1ma.execute-api.ap-south-1.amazonaws.com/prod/dashboard-cards/published-details/${publishedId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": userId,
          },
        }
      );

      if (!res.ok) {
        const messages: Record<number, string> = {
          401: "User not authenticated.",
          403: "You don't have permission to access this template.",
          404: "Template not found.",
        };

        throw new Error(
          messages[res.status] || `Failed to fetch data (${res.status})`
        );
      }

      const data = await res.json();
      setFinaleDataReview(data);
      return data;
    } catch (err) {
      console.error("Error fetching published details:", err);
      throw new Error("Something went wrong while fetching company details.");
    }
  };

  const handleEdit = async (publishedId: string): Promise<void> => {
    try {
      if (user?.email || !user?.userData?.email) {
        throw new Error("User not authenticated");
      }

      // Fetch the published company details
      const details = await fetchPublishedCompanyDetails(
        publishedId,
        user.email || user.userData.email,
        setFinaleDataReview
      );

      // Navigate to edit page
      if (details.templateSelection === "template-1") {
        navigate(`/user/companies/edit/1/${publishedId}/${user.userData.email}`);
      } else if (details.templateSelection === "template-2") {
        navigate(`/user/companies/edit/2/${publishedId}/${user.userData.email}`);
      }
    } catch (error) {
      console.error("Error loading template for editing:", error);
      toast.error("Failed to load template for editing. Please try again.");
    }
  };

  const handlePreview = async (publishedId: string): Promise<void> => {
    try {
      if (user?.email || !user?.userData?.email) {
        throw new Error("User not authenticated");
      }

      // Fetch the published company details
      const details = await fetchPublishedCompanyDetails(
        publishedId,
        user.email || user.userData.email,
        setFinaleDataReview
      );

      // Navigate to preview page
      if (details.templateSelection === "template-1") {
        navigate(
          `/user/companies/preview/1/${publishedId}/${user.userData.email}`
        );
      } else if (details.templateSelection === "template-2") {
        navigate(
          `/user/companies/preview/2/${publishedId}/${user.userData.email}`
        );
      }
    } catch (error) {
      console.error("Error loading template for preview:", error);
      toast.error("Failed to load template for preview. Please try again.");
    }
  };

  useEffect(() => {
    if (user?.email || user?.userData?.email) {
      fetchCompanies(user?.email || user?.userData?.email || "");
    }
  }, [user]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(
      (company) =>
        company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.sectors.some((sector) =>
          sector.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [searchTerm, companies]);

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
            <Building2 w-6 h-6 />
            Company Directory
          </h1>
          <p className="text-gray-600 mb-8">
            Browse and manage company submissions
          </p>
        </div>

        <button
          onClick={() => navigate("/user/companies/template-selection")}
          className="bg-yellow-500 text-sm font-medium text-white flex items-center gap-2 px-4 py-4 rounded-lg align-top hover:bg-yellow-600 hover:scale-110 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Add New Company
        </button>
      </div>

      <div className="mb-8 relative">
        <Search className="absolute left-4 top-4 text-yellow-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by company name, location, or sector..."
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
      ) : filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Card
              key={company.publishedId}
              company={company}
              onPreview={handlePreview}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <Search className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
          No companies found matching “{searchTerm}”
        </div>
      )}
    </div>
  );
};

export default CompanyPage;
