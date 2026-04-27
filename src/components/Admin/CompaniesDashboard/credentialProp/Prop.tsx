import React, { useEffect, useState } from "react";
import { X, Eye, Key, CheckCircle, XCircle, Copy, Check } from "lucide-react";

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
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!isOpen) return null;

  useEffect(() => {
    if (data) {
      console.log("🔍 Modal Data:", data.formData.rawData);
    }
  }, [data]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999999] p-4">
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
                      {data.formData.rawData.companyName || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Industry</p>
                    <p className="font-medium">
                      {data.formData.rawData.mainCategories &&
                        Array.isArray(data.formData.rawData.mainCategories)
                        ? data.formData.rawData.mainCategories.join(", ")
                        : data.formData.rawData.companyCategory &&
                          Array.isArray(data.formData.rawData.companyCategory)
                          ? data.formData.rawData.companyCategory.join(", ")
                          : "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Established Year</p>
                    <p className="font-medium">
                      {data.formData.rawData.yearEstablished
                        ? new Date(
                          data.formData.rawData.yearEstablished
                        ).getFullYear()
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
                    <p className="text-sm text-gray-600">Legal Name</p>
                    <p className="font-medium">
                      {data.formData.rawData.legalName ||
                        data.formData.rawData.companyName ||
                        "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nature of Business</p>
                    <p className="font-medium">
                      {data.formData.rawData.natureOfBusiness || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Identity & Tax Information */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg text-gray-800 mb-3">
                  Identity & Tax Information
                </h4>

                {/* Aadhaar Details */}
                <div className="mb-6 p-3 bg-white rounded-lg border border-gray-200">
                  <h5 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Aadhaar Details
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                      <p className="text-sm text-gray-600">Aadhaar Number</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium font-mono">
                          {data.formData.rawData.aadharNumber || "Not provided"}
                        </p>
                        {data.formData.rawData.aadharNumber && (
                          <button
                            onClick={() =>
                              handleCopy(
                                data.formData.rawData.aadharNumber,
                                "aadhar"
                              )
                            }
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {copiedField === "aadhar" ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Verification Status</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${data.formData.rawData.aadharVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {data.formData.rawData.aadharVerified
                          ? "✓ Verified"
                          : "✗ Not Verified"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Consent Accepted</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${data.formData.rawData.aadharConsentAccepted
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {data.formData.rawData.aadharConsentAccepted
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date of Birth</p>
                      <p className="font-medium">
                        {data.formData.rawData.dateOfBirth
                          ? new Date(
                            data.formData.rawData.dateOfBirth
                          ).toLocaleDateString()
                          : "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* PAN Details */}
                <div className="mb-6 p-3 bg-white rounded-lg border border-gray-200">
                  <h5 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    PAN Details
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                      <p className="text-sm text-gray-600">PAN Number</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium font-mono uppercase">
                          {data.formData.rawData.panNumber || "Not provided"}
                        </p>
                        {data.formData.rawData.panNumber && (
                          <button
                            onClick={() =>
                              handleCopy(
                                data.formData.rawData.panNumber,
                                "pan"
                              )
                            }
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {copiedField === "pan" ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Business Field</p>
                      <p className="font-medium">
                        {data.formData.rawData.businessField || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CIN Number</p>
                      <p className="font-medium">
                        {data.formData.rawData.cin || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Udyam Registration</p>
                      <p className="font-medium">
                        {data.formData.rawData.udyamRegistrationNumber ||
                          "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* GST Details */}
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <h5 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    GST Details
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                      <p className="text-sm text-gray-600">GSTIN</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium font-mono uppercase">
                          {data.formData.rawData.gstin || "Not provided"}
                        </p>
                        {data.formData.rawData.gstin && (
                          <button
                            onClick={() =>
                              handleCopy(data.formData.rawData.gstin, "gstin")
                            }
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {copiedField === "gstin" ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">GST Address</p>
                      <p className="font-medium">
                        {data.formData.rawData.gstAddress ||
                          data.formData.rawData.communicationAddress ||
                          "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Billing GST Details</p>
                      <p className="font-medium">
                        {data.formData.rawData.billingGstDetails ||
                          "Same as above"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Billing Address</p>
                      <p className="font-medium">
                        {data.formData.rawData.billingAddress ||
                          "Same as registered address"}
                      </p>
                    </div>
                  </div>
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
                        {data.formData.rawData.directorName
                          ? "Director"
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Alternative Contact */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">
                    Alternative Contact
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">
                        {data.formData.rawData.altContactName || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">
                        {data.formData.rawData.altContactEmail || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">
                        {data.formData.rawData.altContactPhone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">WhatsApp</p>
                      <p className="font-medium">
                        {data.formData.rawData.whatsappNumber || "Not provided"}
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
                        {data.formData.rawData.officeAddress ||
                          data.formData.rawData.directorAddress ||
                          "Not provided"}
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
                        {data.formData.rawData.postalCode ||
                          data.formData.rawData.pinCode ||
                          "Not provided"}
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

                {/* Communication Address */}
                {data.formData.rawData.communicationAddress && (
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-700 mb-2">
                      Communication Address
                    </h5>
                    <p className="font-medium">
                      {data.formData.rawData.communicationAddress}
                    </p>
                  </div>
                )}

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
                        ? Object.entries(
                          data.formData.rawData
                            .sectorsServed as Record<string, string[]>
                        )
                          .map(
                            ([sector, arr]) =>
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
                  <div>
                    <p className="text-sm text-gray-600">Geography of Operations</p>
                    <p className="font-medium">
                      {Array.isArray(data.formData?.rawData?.geographyOfOperations)
                        ? data.formData.rawData.geographyOfOperations.join(", ")
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Promotion Formats</p>
                    <p className="font-medium">
                      {Array.isArray(data.formData?.rawData?.promoFormats)
                        ? data.formData.rawData.promoFormats.join(", ")
                        : "Not specified"}
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
                    {data.formData?.rawData?.dgcaTypeCertificateUrl ? (
                      <a
                        href={data.formData?.rawData?.dgcaTypeCertificateUrl}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Document
                      </a>
                    ) : (
                      <p className="text-gray-500">Not provided</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">RPTO Certificate</p>
                    {data.formData?.rawData?.rptoAuthorisationCertificateUrl ? (
                      <a
                        href={data.formData?.rawData?.rptoAuthorisationCertificateUrl}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Document
                      </a>
                    ) : (
                      <p className="text-gray-500">Not provided</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents & Links */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg text-gray-800 mb-3">
                  Documents & Links
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Company Logo</p>
                    {data.formData?.rawData?.companyLogoUrl ? (
                      <a
                        href={data.formData.rawData.companyLogoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Logo
                      </a>
                    ) : (
                      <p className="text-gray-500">Not provided</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Brochure PDF</p>
                    {data.formData?.rawData?.brochurePdfUrl ? (
                      <a
                        href={data.formData.rawData.brochurePdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Brochure
                      </a>
                    ) : (
                      <p className="text-gray-500">Not provided</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Catalogue PDF</p>
                    {data.formData?.rawData?.cataloguePdfUrl ? (
                      <a
                        href={data.formData.rawData.cataloguePdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Catalogue
                      </a>
                    ) : (
                      <p className="text-gray-500">Not provided</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Brand Guidelines</p>
                    {data.formData?.rawData?.brandGuidelinesUrl ? (
                      <a
                        href={data.formData.rawData.brandGuidelinesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Guidelines
                      </a>
                    ) : (
                      <p className="text-gray-500">Not provided</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Promo Video (1 min)</p>
                    {data.formData?.rawData?.promoVideoOneMinUrl ? (
                      <a
                        href={data.formData.rawData.promoVideoOneMinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Watch Video
                      </a>
                    ) : (
                      <p className="text-gray-500">Not provided</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Promo Video (5 min)</p>
                    {data.formData?.rawData?.promoVideoFiveMinUrl ? (
                      <a
                        href={data.formData.rawData.promoVideoFiveMinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Watch Video
                      </a>
                    ) : (
                      <p className="text-gray-500">Not provided</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-gray-100 p-4 rounded-lg">
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
                      {data.metadata?.templateUsed || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted At</p>
                    <p className="font-medium">
                      {data.metadata?.originalSubmittedAt
                        ? new Date(
                          parseInt(data.metadata.originalSubmittedAt)
                        ).toLocaleString()
                        : "Not available"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Data Source</p>
                    <p className="font-medium">
                      {data.metadata?.dataSource || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Published Status</p>
                    <p className="font-medium">
                      {data.metadata?.publishedStatus || "Unknown"}
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