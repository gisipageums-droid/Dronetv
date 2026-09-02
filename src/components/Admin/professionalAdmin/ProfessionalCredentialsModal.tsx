import {
  Award,
  Briefcase,
  CheckCircle,
  Eye,
  FileText,
  Mail,
  MapPin,
  Star,
  User,
  Users,
  X,
  XCircle,
  Phone,
  Calendar,
  Code,
  Image
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { PROFESSIONAL_API, LAMBDA } from '../../../lib/apiConfig';
import { PrettyValue, prettyLabel } from '../../../lib/prettyValue';

interface Professional {
  professionalId: string;
  userId: string;
  submissionId?: string;
  professionalName?: string;
  fullName?: string;
  professionalDescription?: string;
  location?: string;
  categories?: string[];
  skillsCount?: number;
  servicesCount?: number;
  reviewStatus?: string;
  templateSelection?: string | number;
  status?: boolean;
  lastModified?: string;
  createdAt?: string;
  publishedDate?: string;
  urlSlug?: string;
  previewImage?: string;
  heroImage?: string;
  adminNotes?: string;
  version?: number | string;
  hasEdits?: boolean;
  completionPercentage?: number;
  hasCustomImages?: boolean;
  lastActivity?: string;
  canEdit?: boolean;
  canResubmit?: boolean;
  isVisible?: boolean;
  isApproved?: boolean;
  dashboardType?: string;
  needsAdminAction?: boolean;
  cleanUrl?: string;
}

interface ProfessionalCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  professionalId: string | null;
  loading?: boolean;
  professional?: Professional | null;
}

const ProfessionalCredentialsModal: React.FC<ProfessionalCredentialsModalProps> = ({
  isOpen,
  onClose,
  professionalId,
  loading: externalLoading,
  professional,
}) => {
  const [data, setData] = useState<any | null>(null);
  const [notes, setNotes] = useState('');
  const [internalLoading, setInternalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !professionalId) return;

    let cancelled = false;
    const fetchData = async () => {
      setError(null);
      setInternalLoading(true);
      try {
        const res = await fetch(
          PROFESSIONAL_API ? `${PROFESSIONAL_API}/${professionalId}` : `${LAMBDA.profAdmin}/professionals/${professionalId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            },
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (!cancelled) {
          setData(json);
          setNotes(json?.adminNotes || json?.metadata?.adminNotes || '');
        }
      } catch (err: any) {
        if (!cancelled) setError('Failed to load professional data');
      } finally {
        if (!cancelled) setInternalLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [isOpen, professionalId]);

  useEffect(() => {
    if (!isOpen) {
      setData(null);
      setError(null);
      setInternalLoading(false);
      setNotes('');
    }
  }, [isOpen]);

  const isLoading = externalLoading ?? internalLoading;

  if (!isOpen) return null;

  const InfoSection: React.FC<{
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    bgColor?: string
  }> = ({ title, children, icon, bgColor = 'bg-ink-offwhite' }) => (
    <div className={`${bgColor} p-6 rounded-xl border border-ink-light`}>
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h4 className="font-semibold text-lg text-ink">{title}</h4>
      </div>
      {children}
    </div>
  );

  const InfoField: React.FC<{
    label: string;
    value: React.ReactNode;
    span?: number
  }> = ({ label, value, span = 1 }) => (
    <div className={span > 1 ? 'col-span-full' : 'col-span-1'}>
      <p className="text-sm font-medium text-ink-paragraph mb-1">{label}</p>
      <div className="text-ink break-words">{value || 'Not provided'}</div>
    </div>
  );

  const formData = data?.formData || {};

  const hasEntries = (obj: any) =>
    obj && typeof obj === 'object' && Object.keys(obj).length > 0;

  const KeyValueGrid: React.FC<{ obj: Record<string, any> }> = ({ obj }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(obj).map(([key, val]) => (
        <InfoField key={key} label={prettyLabel(key)} value={<PrettyValue value={val} />} />
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-[999999] p-4">
      <div className="bg-surface-card rounded-lg shadow-xl max-w-6xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-ink">Professional Details</h3>
              {data?.professionalId && (
                <p className="text-sm text-ink-caption mt-1">ID: {data.professionalId}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-ink-caption hover:text-ink-paragraph transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-status-info mx-auto mb-4"></div>
              <p className="text-ink-paragraph">Loading professional details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-status-error font-medium">{error}</div>
          ) : data ? (
            <>
              <div className="space-y-6">
                {formData.userImage && (
                  <InfoSection
                    title="Profile Image"
                    icon={<Image className="w-5 h-5 text-brand-gold" />}
                    bgColor="bg-brand-gold/10"
                  >
                    <img
                      src={formData.userImage}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  </InfoSection>
                )}

                <InfoSection
                  title="Basic Information"
                  icon={<User className="w-5 h-5 text-status-info" />}
                  bgColor="bg-status-info/10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoField label="Full Name" value={formData.basicInfo?.fullName} />
                    <InfoField label="Username" value={formData.username} />
                    <InfoField label="Gender" value={formData.basicInfo?.gender} />
                    <InfoField label="Date of Birth" value={formData.basicInfo?.date_of_birth} />
                    <InfoField label="Aadhar Number" value={formData.basicInfo?.aadhar_number} />
                    <InfoField label="Relationship" value={`${formData.basicInfo?.relationship_type || ''} ${formData.basicInfo?.relationship_name || ''}`} />
                  </div>
                </InfoSection>

                <InfoSection
                  title="Contact Information"
                  icon={<Mail className="w-5 h-5 text-status-success" />}
                  bgColor="bg-status-success/10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoField label="Email" value={formData.addressInformation?.email || formData.userId} />
                    <InfoField label="Phone" value={formData.addressInformation?.phoneNumber} />
                    <InfoField label="Nationality" value={formData.addressInformation?.nationality} />
                    <InfoField label="Designation" value={formData.addressInformation?.designation} />
                    <InfoField label="Tagline" value={formData.addressInformation?.tagline} span={2} />
                  </div>
                </InfoSection>

                <InfoSection
                  title="Address"
                  icon={<MapPin className="w-5 h-5 text-status-error" />}
                  bgColor="bg-status-error/10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoField label="Address" value={formData.basicInfo?.address} span={3} />
                    <InfoField label="City/District" value={formData.basicInfo?.city_district} />
                    <InfoField label="State" value={formData.basicInfo?.state} />
                    <InfoField label="Pincode" value={formData.basicInfo?.pincode} />
                    <InfoField label="Country" value={formData.basicInfo?.country} />
                  </div>
                </InfoSection>

                <InfoSection
                  title="Categories & Subcategories"
                  icon={<Briefcase className="w-5 h-5 text-status-info" />}
                  bgColor="bg-status-info/10"
                >
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-ink-paragraph mb-2">Categories</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.categories?.map((cat: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-status-info/15 text-status-info text-sm font-medium rounded-full"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-paragraph mb-2">Subcategories</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.subcategories?.map((sub: any, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-status-info/15 text-status-info text-sm font-medium rounded-full"
                          >
                            {sub.name} ({sub.parent})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </InfoSection>

                <InfoSection
                  title="Skills"
                  icon={<Code className="w-5 h-5 text-ink-paragraph" />}
                  bgColor="bg-ink-offwhite"
                >
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-ink-paragraph mb-2">Skills with Proficiency</p>
                      <div className="space-y-3">
                        {formData.formattedSkills?.map((skill: any, i: number) => (
                          <div key={i} className="bg-surface-card p-3 rounded-lg border border-ink-light">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-ink">{skill.name}</span>
                              <span className="text-sm text-ink-paragraph">{skill.proficiency.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-ink-light rounded-full h-2">
                              <div
                                className="bg-brand-yellow h-2 rounded-full transition-all"
                                style={{ width: `${skill.proficiency}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-paragraph mb-2">Raw Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.rawSkills?.map((skill: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-ink-light text-ink-paragraph text-sm font-medium rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </InfoSection>

                {formData.services && formData.services.length > 0 && (
                  <InfoSection
                    title="Services"
                    icon={<Briefcase className="w-5 h-5 text-status-info" />}
                    bgColor="bg-status-info/10"
                  >
                    <div className="space-y-3">
                      {formData.services.map((service: any, i: number) => (
                        <div key={i} className="bg-surface-card p-4 rounded-lg border border-status-info/25">
                          <h5 className="font-semibold text-ink mb-2">{service.serviceName}</h5>
                          <p className="text-sm text-ink-paragraph">{service.serviceDetails}</p>
                        </div>
                      ))}
                    </div>
                  </InfoSection>
                )}

                {formData.projects && formData.projects.length > 0 && (
                  <InfoSection
                    title="Projects"
                    icon={<Award className="w-5 h-5 text-ink-paragraph" />}
                    bgColor="bg-ink-offwhite"
                  >
                    <div className="space-y-3">
                      {formData.projects.map((project: any, i: number) => (
                        <div key={i} className="bg-surface-card p-4 rounded-lg border border-ink-light">
                          <h5 className="font-semibold text-ink mb-2">{project.title}</h5>
                          <p className="text-sm text-ink-paragraph mb-2">{project.description}</p>
                          {project.project_url && (
                            <a
                              href={project.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-status-info hover:underline"
                            >
                              View Project →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </InfoSection>
                )}

                {hasEntries(formData.communicationAddress) && (
                  <InfoSection
                    title="Communication Address"
                    icon={<MapPin className="w-5 h-5 text-status-info" />}
                    bgColor="bg-status-info/10"
                  >
                    <KeyValueGrid obj={formData.communicationAddress} />
                  </InfoSection>
                )}

                {hasEntries(formData.alternateContact) && (
                  <InfoSection
                    title="Alternate Contact"
                    icon={<Phone className="w-5 h-5 text-status-success" />}
                    bgColor="bg-status-success/10"
                  >
                    <KeyValueGrid obj={formData.alternateContact} />
                  </InfoSection>
                )}

                {hasEntries(formData.socialMediaLinks) && (
                  <InfoSection
                    title="Social Media Links"
                    icon={<Users className="w-5 h-5 text-brand-gold" />}
                    bgColor="bg-brand-gold/10"
                  >
                    <KeyValueGrid obj={formData.socialMediaLinks} />
                  </InfoSection>
                )}

                {Array.isArray(formData.freeformSkills) && formData.freeformSkills.length > 0 && (
                  <InfoSection
                    title="Additional Skills"
                    icon={<Star className="w-5 h-5 text-brand-gold" />}
                    bgColor="bg-brand-gold/10"
                  >
                    <div className="flex flex-wrap gap-2">
                      {formData.freeformSkills.map((skill: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-ink-light text-ink-paragraph text-sm font-medium rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </InfoSection>
                )}

                {((Array.isArray(formData.media) && formData.media.length > 0) ||
                  (Array.isArray(formData.resume) && formData.resume.length > 0)) && (
                  <InfoSection
                    title="Media & Documents"
                    icon={<Image className="w-5 h-5 text-ink-paragraph" />}
                    bgColor="bg-ink-offwhite"
                  >
                    <div className="space-y-4">
                      {Array.isArray(formData.media) && formData.media.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-ink-paragraph mb-2">Media</p>
                          <div className="flex flex-wrap gap-3">
                            {formData.media.map((m: any, i: number) => {
                              const url = typeof m === 'string' ? m : m?.url || m?.mediaUrl || m?.s3Url;
                              if (!url) return null;
                              return (
                                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block">
                                  <img src={url} alt={`media ${i + 1}`} className="w-24 h-24 object-cover rounded-lg border border-ink-light" />
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {Array.isArray(formData.resume) && formData.resume.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-ink-paragraph mb-2">Documents</p>
                          <div className="space-y-2">
                            {formData.resume.map((doc: any, i: number) => {
                              const url = typeof doc === 'string' ? doc : doc?.url || doc?.fileUrl || doc?.s3Url;
                              const name = (typeof doc === 'object' && (doc?.name || doc?.fileName)) || `Document ${i + 1}`;
                              return url ? (
                                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-status-info hover:underline">
                                  <FileText className="w-4 h-4" /> {name}
                                </a>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </InfoSection>
                )}

                <InfoSection
                  title="Submission Metadata"
                  icon={<FileText className="w-5 h-5 text-ink-paragraph" />}
                  bgColor="bg-ink-offwhite"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoField label="Status" value={formData.status} />
                    <InfoField label="Template" value={formData.templateSelection} />
                    <InfoField label="Version" value={formData.version} />
                    <InfoField label="Processing Method" value={formData.processingMethod} />
                    <InfoField label="Draft ID" value={formData.draftId} />
                    <InfoField label="Submission ID" value={formData.submissionId} />
                    <InfoField
                      label="Last Updated"
                      value={formData.updatedAt ? new Date(formData.updatedAt).toLocaleString() : 'N/A'}
                    />
                    <InfoField
                      label="Retrieved At"
                      value={data.metadata?.retrievedAt ? new Date(data.metadata.retrievedAt).toLocaleString() : 'N/A'}
                    />
                  </div>
                </InfoSection>

                {hasEntries(formData) && (
                  <details className="bg-ink-offwhite rounded-xl border border-ink-light">
                    <summary className="cursor-pointer select-none p-6 font-semibold text-lg text-ink flex items-center gap-3">
                      <FileText className="w-5 h-5 text-ink-paragraph" />
                      Complete Submitted Data ({Object.keys(formData).length} fields)
                    </summary>
                    <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                      {Object.entries(formData)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([k, v]) => (
                          <div key={k} className="flex flex-col border-b border-ink-light/60 py-1 min-w-0">
                            <span className="text-[11px] text-ink-caption uppercase tracking-wide break-words">{prettyLabel(k)}</span>
                            <span className="text-sm text-ink break-words"><PrettyValue value={v} /></span>
                          </div>
                        ))}
                    </div>
                  </details>
                )}

                {!hasEntries(formData) && hasEntries(data?.templateContent) && (
                  <div className="bg-ink-offwhite rounded-xl border border-ink-light p-6">
                    <div className="flex items-center gap-3 mb-1 font-semibold text-lg text-ink">
                      <FileText className="w-5 h-5 text-ink-paragraph" />
                      Generated Profile Content
                    </div>
                    <p className="text-xs text-ink-caption mb-4">
                      This is a legacy record — the original registration form data isn't stored for it.
                      Showing the published profile content instead.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                      {Object.entries(data.templateContent)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([k, v]) => (
                          <div key={k} className="flex flex-col border-b border-ink-light/60 py-1 min-w-0">
                            <span className="text-[11px] text-ink-caption uppercase tracking-wide break-words">{prettyLabel(k)}</span>
                            <span className="text-sm text-ink break-words"><PrettyValue value={v} /></span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-6 border-t border-ink-light">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 border border-ink-light rounded-lg text-ink-paragraph hover:bg-ink-offwhite transition-colors font-medium"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                    }}
                    className="px-6 py-2 bg-status-info text-white rounded-lg hover:bg-status-info transition-colors font-medium"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-ink-paragraph py-8">No data found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCredentialsModal;
