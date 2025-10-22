import React, { useState, useMemo } from "react";
import { Search, MapPin, Building2, Edit, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Company {
  publishedId: string;
  userId: string;
  draftId: string;
  companyName: string;
  location: string;
  sectors: string[];
  publishedDate?: string;
  previewImage?: string;
  reviewStatus?: string;
}

const Card: React.FC<{
  company: Company;
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
}> = ({ company, onEdit, onPreview }) => {
  const placeholderImg = company?.companyName?.charAt(0) || "C";
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Company Image */}
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md bg-yellow-50 p-2 flex items-center justify-center group-hover:shadow-lg group-hover:bg-yellow-100 transition-all duration-300 group-hover:scale-110">
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-yellow-600">
                {placeholderImg}
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
              {company?.publishedDate
                ? formatDate(company?.publishedDate)
                : "Date not available"}
            </span>
            <span className="text-xs text-yellow-600">Published</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-between">
            <button
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
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (company?.publishedId) onPreview(company.publishedId);
              }}
              className="flex-1 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-yellow-300"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (company?.publishedId) onEdit(company.publishedId);
              }}
              className="flex-1 px-3 py-2 bg-yellow-400 text-yellow-900 rounded-lg hover:bg-yellow-500 transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-yellow-500"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>

          <button
            onClick={() => navigate(`/user-company/leads`)}
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

const CompanyPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const companies: Company[] = useMemo(
    () => [
      {
        publishedId: "1",
        userId: "user1",
        draftId: "draft1",
        companyName: "TechVision Inc",
        location: "San Francisco, CA",
        sectors: ["Technology", "Software"],
        publishedDate: "2024-10-15",
        reviewStatus: "approved",
      },
      {
        publishedId: "2",
        userId: "user2",
        draftId: "draft2",
        companyName: "GreenEnerge Solutions",
        location: "Austin, TX",
        sectors: ["Energy", "Renewable"],
        publishedDate: "2024-10-10",
        reviewStatus: "active",
      },
      {
        publishedId: "3",
        userId: "user3",
        draftId: "draft3",
        companyName: "HealthPlus Medical",
        location: "Boston, MA",
        sectors: ["Healthcare", "Medical"],
        publishedDate: "2024-09-20",
        reviewStatus: "approved",
      },
      {
        publishedId: "4",
        userId: "user4",
        draftId: "draft4",
        companyName: "FinanceFlow Bank",
        location: "New York, NY",
        sectors: ["Finance", "Banking"],
        publishedDate: "2024-10-05",
        reviewStatus: "rejected",
      },
      {
        publishedId: "5",
        userId: "user5",
        draftId: "draft5",
        companyName: "CloudSync Services",
        location: "Seattle, WA",
        sectors: ["Cloud Computing", "SaaS"],
        publishedDate: "2024-10-12",
        reviewStatus: "approved",
      },
      {
        publishedId: "6",
        userId: "user6",
        draftId: "draft6",
        companyName: "EcoDesign Studios",
        location: "Los Angeles, CA",
        sectors: ["Design", "Creative"],
        publishedDate: "2024-10-18",
        reviewStatus: "active",
      },
    ],
    []
  );

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

  const handlePreview = (id: string) => {
    console.log("Preview company:", id);
  };

  const handleEdit = (id: string) => {
    console.log("Edit company:", id);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-yellow-50 to-amber-50 p-8">
      <div className="">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Company Directory
          </h1>
          <p className="text-gray-600">Browse and manage company submissions</p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by company name, location, or sector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-white border-2 border-yellow-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <Card
                key={company.publishedId}
                company={company}
                onPreview={handlePreview}
                onEdit={handleEdit}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <Search className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No companies found matching "{searchTerm}"
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>
            Showing {filteredCompanies.length} of {companies.length} companies
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
