import React, { useEffect, useState } from "react";
import { X, Eye, Key, Copy, Check, Lock, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { AUTH_API, LAMBDA } from "../../../../lib/apiConfig";

const SET_PASSWORD_API = AUTH_API ? `${AUTH_API}/admin/set-password` : `${LAMBDA.auth}/admin/set-password`;

function genPassword(): string {
  const sets = ["ABCDEFGHJKLMNPQRSTUVWXYZ", "abcdefghijkmnpqrstuvwxyz", "23456789", "!@#$%*"];
  return Array.from({ length: 12 }, (_, i) => {
    const s = sets[i % sets.length];
    return s[Math.floor(Math.random() * s.length)];
  }).sort(() => Math.random() - 0.5).join("");
}

function AccountAccess({ email, gstin, cin }: { email?: string; gstin?: string; cin?: string }) {
  const [pw, setPw] = useState("");
  const [notify, setNotify] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (v: string, k: string) => {
    navigator.clipboard.writeText(v);
    setCopied(k);
    setTimeout(() => setCopied(null), 1500);
  };

  const save = async () => {
    if (!email) { toast.error("No login email on this listing"); return; }
    if (pw.trim().length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setSaving(true);
    try {
      const res = await fetch(SET_PASSWORD_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        body: JSON.stringify({ email, newPassword: pw.trim(), notify }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.detail || `Failed (${res.status})`);
      toast.success(notify ? "Password updated — new password emailed to the user" : "Password updated");
      setPw("");
    } catch (e: any) {
      toast.error(e.message || "Could not update password");
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, value, k }: { label: string; value?: string; k: string }) => (
    <div>
      <p className="text-sm text-ink-paragraph">{label}</p>
      <div className="flex items-center gap-2">
        <p className="font-medium font-mono text-sm break-all">{value || "Not provided"}</p>
        {value && (
          <button onClick={() => copy(value, k)} className="text-ink-caption hover:text-ink-paragraph flex-shrink-0">
            {copied === k ? <Check className="w-4 h-4 text-status-success" /> : <Copy className="w-3 h-3" />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-ink-offwhite p-4 rounded-lg">
      <h4 className="font-semibold text-lg text-ink-charcoal mb-3 flex items-center gap-2">
        <Lock className="w-4 h-4" /> Account &amp; Access
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Field label="Login Email" value={email} k="login" />
        <Field label="GSTIN" value={gstin} k="gstin" />
        <Field label="CIN" value={cin} k="cin" />
      </div>

      <div className="p-3 bg-surface-card rounded-lg border border-ink-light">
        <h5 className="font-medium text-ink-paragraph mb-2 text-sm">Reset this company's password</h5>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            type="text"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="New password (min 6 chars)"
            className="flex-1 px-3 py-2 border border-ink-light rounded-lg text-sm font-mono focus:outline-none focus:border-brand-yellow"
          />
          <button
            type="button"
            onClick={() => setPw(genPassword())}
            className="px-3 py-2 text-xs font-medium text-ink-paragraph bg-ink-light rounded-lg hover:bg-ink-light flex items-center gap-1.5 justify-center"
          >
            <RefreshCw className="w-3 h-3" /> Generate
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving || pw.trim().length < 6}
            className="px-4 py-2 text-xs font-semibold text-ink bg-brand-yellow rounded-lg hover:bg-brand-gold disabled:opacity-50"
          >
            {saving ? "Saving…" : "Update Password"}
          </button>
        </div>
        <label className="flex items-center gap-2 mt-2.5 text-xs text-ink-paragraph cursor-pointer">
          <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
          Email the new password to <span className="font-medium">{email || "the user"}</span>
        </label>
      </div>
    </div>
  );
}

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
  company: Company | null;
}

const CredentialsModal: React.FC<CredentialsModalProps> = ({
  isOpen,
  onClose,
  data,
  loading,
  onPreview,
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

  useEffect(() => {}, [data]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-ink bg-opacity-50 flex items-center justify-center z-[99999999] p-4">
      <div className="bg-surface-card rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Company Form Details </h3>
            <button
              onClick={onClose}
              className="text-ink-caption hover:text-ink-paragraph"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Action Buttons */}
          {company && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => onPreview(company.publishedId)}
                className="px-3 w-full py-2 bg-status-info/15 text-status-info rounded-lg hover:bg-status-info/25 transition-colors text-xs md:text-sm font-medium flex items-center gap-2 justify-center"
              >
                <Eye className="w-3 h-3 md:w-4 md:h-4" />
                Preview
              </button>
            </div>
          )}

          <div className="space-y-6">
            <AccountAccess
              email={company?.userId || data?.userId}
              gstin={data?.formData?.rawData?.gstin}
              cin={data?.formData?.rawData?.cin || data?.formData?.rawData?.cinOrUdyamOrPan}
            />

            {loading && !data ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-status-info mx-auto mb-3"></div>
                <p className="text-ink-paragraph text-sm">Loading company details…</p>
              </div>
            ) : !data ? (
              <p className="text-sm text-ink-caption py-2">
                Detailed form data isn't available for this listing. Login email and password reset above still work.
              </p>
            ) : (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-ink-offwhite p-4 rounded-lg">
                <h4 className="font-semibold text-lg text-ink-charcoal mb-3">
                  Company Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-ink-paragraph">Company Name</p>
                    <p className="font-medium">
                      {data.formData.rawData.companyName || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-ink-paragraph">Industry</p>
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
                    <p className="text-sm text-ink-paragraph">Established Year</p>
                    <p className="font-medium">
                      {data.formData.rawData.yearEstablished
                        ? new Date(
                          data.formData.rawData.yearEstablished
                        ).getFullYear()
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-ink-paragraph">Website</p>
                    <p className="font-medium">
                      {data.formData.rawData.websiteUrl || "None"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-ink-paragraph">Legal Name</p>
                    <p className="font-medium">
                      {data.formData.rawData.legalName ||
                        data.formData.rawData.companyName ||
                        "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-ink-paragraph">Nature of Business</p>
                    <p className="font-medium">
                      {data.formData.rawData.natureOfBusiness || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Identity & Tax Information */}
              <div className="bg-brand-gold/10 p-4 rounded-lg">
                <h4 className="font-semibold text-lg text-ink-charcoal mb-3">
                  Identity & Tax Information
                </h4>

                {/* PAN Details */}
                <div className="mb-6 p-3 bg-surface-card rounded-lg border border-ink-light">
                  <h5 className="font-medium text-ink-paragraph mb-3 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    PAN Details
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                      <p className="text-sm text-ink-paragraph">PAN Number</p>
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
                            className="text-ink-caption hover:text-ink-paragraph"
                          >
                            {copiedField === "pan" ? (
                              <Check className="w-4 h-4 text-status-success" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-ink-paragraph">Business Field</p>
                      <p className="font-medium">
                        {data.formData.rawData.businessField || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-ink-paragraph">CIN Number</p>
                      <p className="font-medium">
                        {data.formData.rawData.cin || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-ink-paragraph">Udyam Registration</p>
                      <p className="font-medium">
                        {data.formData.rawData.udyamRegistrationNumber ||
                          "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* GST Details */}
                <div className="p-3 bg-surface-card rounded-lg border border-ink-light">
                  <h5 className="font-medium text-ink-paragraph mb-3 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    GST Details
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                      <p className="text-sm text-ink-paragraph">GSTIN</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium font-mono uppercase">
                          {data.formData.rawData.gstin || "Not provided"}
                        </p>
                        {data.formData.rawData.gstin && (
                          <button
                            onClick={() =>
                              handleCopy(data.formData.rawData.gstin, "gstin")
                            }
                            className="text-ink-caption hover:text-ink-paragraph"
                          >
                            {copiedField === "gstin" ? (
                              <Check className="w-4 h-4 text-status-success" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-ink-paragraph">GST Address</p>
                      <p className="font-medium">
                        {data.formData.rawData.gstAddress ||
                          data.formData.rawData.communicationAddress ||
                          "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-ink-paragraph">Billing GST Details</p>
                      <p className="font-medium">
                        {data.formData.rawData.billingGstDetails ||
                          "Same as above"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-ink-paragraph">Billing Address</p>
                      <p className="font-medium">
                        {data.formData.rawData.billingAddress ||
                          "Same as registered address"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-status-info/10 p-4 rounded-lg">
                <h4 className="font-semibold text-lg text-ink-charcoal mb-3">
                  Contact Information
                </h4>

                {/* Primary Contact */}
                <div className="mb-4">
                  <h5 className="font-medium text-ink-paragraph mb-2">
                    Primary Contact
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-ink-paragraph">Name</p>
                      <p className="font-medium">
                        {data.formData.rawData.directorName || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-ink-paragraph">Email</p>
                      <p className="font-medium">
                        {data.formData.rawData.directorEmail || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-ink-paragraph">Phone</p>
                      <p className="font-medium">
                        {data.formData.rawData.directorPhone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-ink-paragraph">Designation</p>
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
                  <h5 className="font-medium text-ink-paragraph mb-2">
                    Alternative Contact
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-ink-paragraph">Name</p>
                      <p className="font-medium">
                        {data.formData.rawData.altContactName || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-ink-paragraph">Email</p>
                      <p className="font-medium">
                        {data.formData.rawData.altContactEmail || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-ink-paragraph">Phone</p>
                      <p className="font-medium">
                        {data.formData.rawData.altContactPhone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-ink-paragraph">WhatsApp</p>
                      <p className="font-medium">
                        {data.formData.rawData.whatsappNumber || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Address */}
                <div className="mb-4">
                  <h5 className="font-medium text-ink-paragraph mb-2">
                    Business Address
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <p className="text-sm text-ink-paragraph">Street</p>
                      <p className="font-medium">
                        {data.formData.rawData.officeAddress ||
                          data.formData.rawData.directorAddress ||
                          "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-ink-paragraph">City</p>
                      <p className="font-medium">
                        {data.formData.rawData.city || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-ink-paragraph">State</p>
                      <p className="font-medium">
                        {data.formData.rawData.state || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-ink-paragraph">Pincode</p>
                      <p className="font-medium">
                        {data.formData.rawData.postalCode ||
                          data.formData.rawData.pinCode ||
                          "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-ink-paragraph">Country</p>
                      <p className="font-medium">
                        {data.formData.rawData.country || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Communication Address */}
                {data.formData.rawData.communicationAddress && (
                  <div className="mb-4">
                    <h5 className="font-medium text-ink-paragraph mb-2">
                      Communication Address
                    </h5>
                    <p className="font-medium">
                      {data.formData.rawData.communicationAddress}
                    </p>
                  </div>
                )}

                {/* Social Links */}
                <div>
                  <h5 className="font-medium text-ink-paragraph mb-2">
                    Social Links
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <p className="text-sm text-ink-paragraph">Website</p>
                      {data.formData?.rawData?.websiteUrl ? (
                        <a
                          href={data.formData.rawData.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-status-info hover:underline"
                        >
                          Open Link
                        </a>
                      ) : (
                        <p className="font-medium">Not provided</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-ink-paragraph">LinkedIn</p>
                      {data.formData?.rawData?.socialLinks?.linkedin ? (
                        <a
                          href={data.formData.rawData.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-status-info hover:underline"
                        >
                          Open Link
                        </a>
                      ) : (
                        <p className="font-medium">Not provided</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-ink-paragraph">Facebook</p>
                      {data.formData?.rawData?.socialLinks?.facebook ? (
                        <a
                          href={data.formData.rawData.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-status-info hover:underline"
                        >
                          Open Link
                        </a>
                      ) : (
                        <p className="font-medium">Not provided</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-ink-paragraph">Instagram</p>
                      {data.formData?.rawData?.socialLinks?.instagram ? (
                        <a
                          href={data.formData.rawData.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-status-info hover:underline"
                        >
                          Open Link
                        </a>
                      ) : (
                        <p className="font-medium">Not provided</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-ink-paragraph">YouTube</p>
                      {data.formData?.rawData?.socialLinks?.youtube ? (
                        <a
                          href={data.formData.rawData.socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-status-info hover:underline"
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
              <div className="bg-status-success/10 p-4 rounded-lg">
                <h4 className="font-semibold text-lg text-ink-charcoal mb-3">
                  Business Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-ink-paragraph">Primary Services</p>
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
                    <p className="text-sm text-ink-paragraph">Products</p>
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
                    <p className="text-sm text-ink-paragraph">Sectors Served</p>
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
                    <p className="text-sm text-ink-paragraph">Specializations</p>
                    <p className="font-medium">
                      {Array.isArray(data.formData?.rawData?.mainCategories)
                        ? data.formData.rawData.mainCategories.join(", ")
                        : Array.isArray(data.formData?.rawData?.companyCategory)
                          ? data.formData.rawData.companyCategory.join(", ")
                          : "None specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-ink-paragraph">Geography of Operations</p>
                    <p className="font-medium">
                      {Array.isArray(data.formData?.rawData?.geographyOfOperations)
                        ? data.formData.rawData.geographyOfOperations.join(", ")
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-ink-paragraph">Promotion Formats</p>
                    <p className="font-medium">
                      {Array.isArray(data.formData?.rawData?.promoFormats)
                        ? data.formData.rawData.promoFormats.join(", ")
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical Information */}
              <div className="bg-ink-offwhite p-4 rounded-lg border border-ink-light">
                <h4 className="font-semibold text-lg text-ink-charcoal mb-3">
                  Technical Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-ink-paragraph">DGCA Certificate</p>
                    {data.formData?.rawData?.dgcaTypeCertificateUrl ? (
                      <a
                        href={data.formData?.rawData?.dgcaTypeCertificateUrl}
                        className="text-status-info hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Document
                      </a>
                    ) : (
                      <p className="text-ink-caption">Not provided</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-ink-paragraph">RPTO Certificate</p>
                    {data.formData?.rawData?.rptoAuthorisationCertificateUrl ? (
                      <a
                        href={data.formData?.rawData?.rptoAuthorisationCertificateUrl}
                        className="text-status-info hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Document
                      </a>
                    ) : (
                      <p className="text-ink-caption">Not provided</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents & Links */}
              <div className="bg-ink-offwhite p-4 rounded-lg border border-ink-light">
                <h4 className="font-semibold text-lg text-ink-charcoal mb-3">
                  Documents & Links
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-ink-paragraph">Company Logo</p>
                    {data.formData?.rawData?.companyLogoUrl ? (
                      <a
                        href={data.formData.rawData.companyLogoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-status-info hover:underline"
                      >
                        View Logo
                      </a>
                    ) : (
                      <p className="text-ink-caption">Not provided</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-ink-paragraph">Brochure PDF</p>
                    {data.formData?.rawData?.brochurePdfUrl ? (
                      <a
                        href={data.formData.rawData.brochurePdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-status-info hover:underline"
                      >
                        View Brochure
                      </a>
                    ) : (
                      <p className="text-ink-caption">Not provided</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-ink-paragraph">Catalogue PDF</p>
                    {data.formData?.rawData?.cataloguePdfUrl ? (
                      <a
                        href={data.formData.rawData.cataloguePdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-status-info hover:underline"
                      >
                        View Catalogue
                      </a>
                    ) : (
                      <p className="text-ink-caption">Not provided</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-ink-paragraph">Brand Guidelines</p>
                    {data.formData?.rawData?.brandGuidelinesUrl ? (
                      <a
                        href={data.formData.rawData.brandGuidelinesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-status-info hover:underline"
                      >
                        View Guidelines
                      </a>
                    ) : (
                      <p className="text-ink-caption">Not provided</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-ink-paragraph">Promo Video (1 min)</p>
                    {data.formData?.rawData?.promoVideoOneMinUrl ? (
                      <a
                        href={data.formData.rawData.promoVideoOneMinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-status-info hover:underline"
                      >
                        Watch Video
                      </a>
                    ) : (
                      <p className="text-ink-caption">Not provided</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-ink-paragraph">Promo Video (5 min)</p>
                    {data.formData?.rawData?.promoVideoFiveMinUrl ? (
                      <a
                        href={data.formData.rawData.promoVideoFiveMinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-status-info hover:underline"
                      >
                        Watch Video
                      </a>
                    ) : (
                      <p className="text-ink-caption">Not provided</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-ink-light p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-ink-paragraph">Published ID</p>
                    <p className="font-medium font-mono text-xs">
                      {data.publishedId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-ink-paragraph">Draft ID</p>
                    <p className="font-medium font-mono text-xs">
                      {data.draftId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-ink-paragraph">Template Used</p>
                    <p className="font-medium">
                      {data.metadata?.templateUsed || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-ink-paragraph">Submitted At</p>
                    <p className="font-medium">
                      {data.metadata?.originalSubmittedAt
                        ? new Date(
                          parseInt(data.metadata.originalSubmittedAt)
                        ).toLocaleString()
                        : "Not available"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-ink-paragraph">Data Source</p>
                    <p className="font-medium">
                      {data.metadata?.dataSource || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-ink-paragraph">Published Status</p>
                    <p className="font-medium">
                      {data.metadata?.publishedStatus || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Complete submitted data — every field on file, nothing hidden */}
              {data?.formData?.rawData && Object.keys(data.formData.rawData).length > 0 && (
                <details className="bg-ink-offwhite rounded-lg overflow-hidden" open>
                  <summary className="cursor-pointer select-none px-4 py-3 font-semibold text-ink-charcoal text-sm">
                    Complete Submitted Data ({Object.keys(data.formData.rawData).length} fields)
                  </summary>
                  <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                    {Object.entries(data.formData.rawData)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([k, v]) => {
                        let text: string;
                        if (v == null || v === "") text = "—";
                        else if (Array.isArray(v))
                          text = v.length
                            ? v.map((x) => (x && typeof x === "object" ? JSON.stringify(x) : String(x))).join(", ")
                            : "—";
                        else if (typeof v === "object") text = JSON.stringify(v);
                        else text = String(v);
                        return (
                          <div key={k} className="flex flex-col border-b border-ink-light/60 py-1 min-w-0">
                            <span className="text-[11px] text-ink-caption uppercase tracking-wide break-words">{k}</span>
                            <span className="text-sm text-ink break-words">{text}</span>
                          </div>
                        );
                      })}
                  </div>
                </details>
              )}

            </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-ink-light rounded-lg text-ink-paragraph hover:bg-ink-offwhite transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CredentialsModal;