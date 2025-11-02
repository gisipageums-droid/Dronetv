import React, { useEffect, useState } from "react";
import { X, Eye, Key, CheckCircle, XCircle } from "lucide-react";

interface Company {
  publishedId: string;
  companyId: string;
  draftId: string;
  userId: string;
  companyName: string;
  location: string;
  sectors: string[];
  previewImage?: string;
  heroImage?: string;
  templateSelection: string;
  reviewStatus: string;
  adminNotes: string;
  status: string | null;
  publishedDate: string;
  lastModified: string;
  createdAt: string;
  submittedForReview: string;
  reviewedAt: string;
  version: number;
  hasEdits: boolean;
  sectionsEdited: string[];
  totalEdits: number;
  isTemplate2: boolean;
  completionPercentage: number;
  hasCustomImages: boolean;
  lastActivity: string;
  canEdit: boolean;
  canResubmit: boolean;
  isVisible: boolean;
  isApproved: boolean;
  dashboardType: string;
  needsAdminAction: boolean;
}

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  loading: boolean;
  onPreview: (publishedId: string) => void;
  onApprove: (publishedId: string) => void;
  onReject: (publishedId: string) => void;
  company: Company | null;
}

const CredentialsModal: React.FC<CredentialsModalProps> = ({
  isOpen,
  onClose,
  data,
  loading,
  onPreview,
  onApprove,
  onReject,
  company,
}) => {
  const [notes, setNotes] = useState(
    data?.formData?.publishedMetadata?.adminNotes || ""
  );

  if (!isOpen) return null;

    useEffect(() => {
    if (data) {
      console.log("🔍 Modal Data:", data.formData.rawData);
    }
  }, [data]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Company Form Details </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Action Buttons */}
          {company && (
            <div className="flex flex-row justify-between gap-2 mb-6">
              <button
                onClick={() => onPreview(company.publishedId)}
                className="px-3 w-full py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs md:text-sm font-medium flex items-center gap-2 justify-center"
              >
                <Eye className="w-3 h-3 md:w-4 md:h-4" />
                Preview
              </button>

              <button
                onClick={() => onApprove(company.publishedId)}
                className="px-3 py-2 w-full bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs md:text-sm font-medium flex items-center gap-2 justify-center"
              >
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                Approve
              </button>
              <button
                onClick={() => onReject(company.publishedId)}
                className="px-3 py-2 w-full bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs md:text-sm font-medium flex items-center gap-2 justify-center"
              >
                <XCircle className="w-3 h-3 md:w-4 md:h-4" />
                Reject
              </button>
            </div>
          )}

          {data ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg text-gray-800 mb-3">
                  Company Information 
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Company Name</p>
                    <p className="font-medium">
                      {data.formData.rawData.companyName ||
                        "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Industry</p>
                    <p className="font-medium">
                      {(
                        data.formData.rawData.mainCategories && Array.isArray(data.formData.rawData.mainCategories)
                          ? data.formData.rawData.mainCategories.join(", ")
                          : (data.formData.rawData.companyCategory && Array.isArray(data.formData.rawData.companyCategory)
                              ? data.formData.rawData.companyCategory.join(", ")
                              : "Not specified")
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Company Size</p>
                    <p className="font-medium">
                      {"Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Established Year</p>
                    <p className="font-medium">
                      {data.formData.rawData.yearEstablished
                        ? new Date(data.formData.rawData.yearEstablished).getFullYear()
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Website</p>
                    <p className="font-medium">
                      {data.formData.rawData.websiteUrl || "None"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Experience Years</p>
                    <p className="font-medium">
                      {typeof data.formData.rawData.aboutExperienceYears === "number"
                        ? data.formData.rawData.aboutExperienceYears
                        : 0}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-medium">
                    {data.formData.rawData.servicesDescription ||
                      "No description provided"}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg text-gray-800 mb-3">
                  Contact Information
                </h4>

                {/* Primary Contact */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">
                    Primary Contact
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">
                        {data.formData.rawData.directorName || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">
                        {data.formData.rawData.directorEmail || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">
                        {data.formData.rawData.directorPhone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Designation</p>
                      <p className="font-medium">
                        {data.formData.rawData.directorName ? "Director" : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Address */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">
                    Business Address
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Street</p>
                      <p className="font-medium">
                        {data.formData.rawData.officeAddress || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">City</p>
                      <p className="font-medium">
                        {data.formData.rawData.city || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">State</p>
                      <p className="font-medium">
                        {data.formData.rawData.state || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pincode</p>
                      <p className="font-medium">
                        {data.formData.rawData.postalCode || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Country</p>
                      <p className="font-medium">
                        {data.formData.rawData.country || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">
                    Social Links
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Website</p>
                      {data.formData?.rawData?.websiteUrl ? (
                        <a
                          href={data.formData.rawData.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Open Link
                        </a>
                      ) : (
                        <p className="font-medium">Not provided</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">LinkedIn</p>
                      {data.formData?.rawData?.socialLinks?.linkedin ? (
                        <a
                          href={data.formData.rawData.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Open Link
                        </a>
                      ) : (
                        <p className="font-medium">Not provided</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Facebook</p>
                      {data.formData?.rawData?.socialLinks?.facebook ? (
                        <a
                          href={data.formData.rawData.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Open Link
                        </a>
                      ) : (
                        <p className="font-medium">Not provided</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Instagram</p>
                      {data.formData?.rawData?.socialLinks?.instagram ? (
                        <a
                          href={data.formData.rawData.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Open Link
                        </a>
                      ) : (
                        <p className="font-medium">Not provided</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">YouTube</p>
                      {data.formData?.rawData?.socialLinks?.youtube ? (
                        <a
                          href={data.formData.rawData.socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Open Link
                        </a>
                      ) : (
                        <p className="font-medium">Not provided</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg text-gray-800 mb-3">
                  Business Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Primary Services</p>
                    <p className="font-medium">
                      {Array.isArray(data.formData?.rawData?.services)
                        ? data.formData.rawData.services
                            .map((s: any) => s?.title || "")
                            .filter(Boolean)
                            .join(", ")
                        : "None specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Products</p>
                    <p className="font-medium">
                      {Array.isArray(data.formData?.rawData?.products)
                        ? data.formData.rawData.products
                            .map((p: any) => p?.title || "")
                            .filter(Boolean)
                            .join(", ")
                        : "None specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sectors Served</p>
                    <p className="font-medium">
                      {data.formData?.rawData?.sectorsServed
                        ? Object.entries(data.formData.rawData.sectorsServed as Record<string, string[]>)
                            .map(([sector, arr]) =>
                              Array.isArray(arr) && arr.length > 0
                                ? `${sector}: ${arr.join(", ")}`
                                : sector
                            )
                            .join("; ")
                        : "None specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Specializations</p>
                    <p className="font-medium">
                      {Array.isArray(data.formData?.rawData?.mainCategories)
                        ? data.formData.rawData.mainCategories.join(", ")
                        : Array.isArray(data.formData?.rawData?.companyCategory)
                          ? data.formData.rawData.companyCategory.join(", ")
                          : "None specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical Information */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg text-gray-800 mb-3">
                  Technical Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">DGCA Certificate</p>
                    <a
                      href={data.formData?.rawData?.dgcaTypeCertificateUrl || "#"}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Document
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Insurance Details</p>
                    <p className="font-medium">
                      {"Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Certifications</p>
                    <p className="font-medium">
                      {"None specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Equipment Details</p>
                    <p className="font-medium">
                      {"Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Completion Metrics */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg text-gray-800 mb-3">
                  Completion Metrics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Completion Percentage
                    </p>
                    <p className="font-medium">
                      {data.formData?.completionMetrics?.completionPercentage ||
                        0}
                      %
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed Fields</p>
                    <p className="font-medium">
                      {data.formData?.completionMetrics?.completedFields || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Key Fields</p>
                    <p className="font-medium">
                      {data.formData?.completionMetrics?.totalKeyFields || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quality Score</p>
                    <p className="font-medium">
                      {data.formData?.completionMetrics?.qualityScore || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold text-lg text-gray-800 mb-3">
                  Metadata
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Published ID</p>
                    <p className="font-medium font-mono text-xs">
                      {data.publishedId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Draft ID</p>
                    <p className="font-medium font-mono text-xs">
                      {data.draftId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Template Used</p>
                    <p className="font-medium">
                      Template {data.metadata?.templateUsed}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Status</p>
                    <p className="font-medium capitalize">
                      {data.formData?.publishedMetadata?.currentStatus}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">User ID</p>
                    <p className="font-medium">
                      {data.formData?.submissionMetadata?.userId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Version</p>
                    <p className="font-medium">
                      {data.formData?.submissionMetadata?.version}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading company details...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CredentialsModal;
