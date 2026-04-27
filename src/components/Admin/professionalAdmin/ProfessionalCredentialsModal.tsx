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
  onPreview: (professionalId: string) => void;
  onApprove: (professionalId: string) => void;
  onReject: (professionalId: string) => void;
}

const ProfessionalCredentialsModal: React.FC<ProfessionalCredentialsModalProps> = ({
  isOpen,
  onClose,
  professionalId,
  loading: externalLoading,
  professional,
  onPreview,
  onApprove,
  onReject
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
          `https://dfdooqn9k1.execute-api.ap-south-1.amazonaws.com/dev/professionals/${professionalId}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (!cancelled) {
          setData(json);
          setNotes(json?.metadata?.adminNotes || '');
        }
      } catch (err: any) {
        console.error('Error fetching professional:', err);
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
  }> = ({ title, children, icon, bgColor = 'bg-gray-50' }) => (
    <div className={`${bgColor} p-6 rounded-xl border border-gray-200`}>
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h4 className="font-semibold text-lg text-gray-900">{title}</h4>
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
      <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
      <p className="text-gray-900 break-words">{value || 'Not provided'}</p>
    </div>
  );

  const formData = data?.formData || {};

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999999] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Professional Details</h3>
              {data?.professionalId && (
                <p className="text-sm text-gray-500 mt-1">ID: {data.professionalId}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading professional details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500 font-medium">{error}</div>
          ) : data ? (
            <>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {/* <button
                  onClick={() => professionalId && onPreview(professionalId)}
                  className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center gap-2 justify-center"
                >
                  <Eye className="w-4 h-4" /> Preview Profile
                </button> */}
                <button
                  onClick={() => professionalId && onApprove(professionalId)}
                  className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium flex items-center gap-2 justify-center"
                >
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button
                  onClick={() => professionalId && onReject(professionalId)}
                  className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex items-center gap-2 justify-center"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>

              <div className="space-y-6">
                {formData.userImage && (
                  <InfoSection
                    title="Profile Image"
                    icon={<Image className="w-5 h-5 text-purple-600" />}
                    bgColor="bg-purple-50"
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
                  icon={<User className="w-5 h-5 text-blue-600" />}
                  bgColor="bg-blue-50"
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
                  icon={<Mail className="w-5 h-5 text-green-600" />}
                  bgColor="bg-green-50"
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
                  icon={<MapPin className="w-5 h-5 text-red-600" />}
                  bgColor="bg-red-50"
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
                  icon={<Briefcase className="w-5 h-5 text-indigo-600" />}
                  bgColor="bg-indigo-50"
                >
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Categories</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.categories?.map((cat: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Subcategories</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.subcategories?.map((sub: any, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
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
                  icon={<Code className="w-5 h-5 text-yellow-600" />}
                  bgColor="bg-yellow-50"
                >
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Skills with Proficiency</p>
                      <div className="space-y-3">
                        {formData.formattedSkills?.map((skill: any, i: number) => (
                          <div key={i} className="bg-white p-3 rounded-lg border border-yellow-200">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-900">{skill.name}</span>
                              <span className="text-sm text-gray-600">{skill.proficiency.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-500 h-2 rounded-full transition-all"
                                style={{ width: `${skill.proficiency}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Raw Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.rawSkills?.map((skill: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full"
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
                    icon={<Briefcase className="w-5 h-5 text-teal-600" />}
                    bgColor="bg-teal-50"
                  >
                    <div className="space-y-3">
                      {formData.services.map((service: any, i: number) => (
                        <div key={i} className="bg-white p-4 rounded-lg border border-teal-200">
                          <h5 className="font-semibold text-gray-900 mb-2">{service.serviceName}</h5>
                          <p className="text-sm text-gray-600">{service.serviceDetails}</p>
                        </div>
                      ))}
                    </div>
                  </InfoSection>
                )}

                {formData.projects && formData.projects.length > 0 && (
                  <InfoSection
                    title="Projects"
                    icon={<Award className="w-5 h-5 text-orange-600" />}
                    bgColor="bg-orange-50"
                  >
                    <div className="space-y-3">
                      {formData.projects.map((project: any, i: number) => (
                        <div key={i} className="bg-white p-4 rounded-lg border border-orange-200">
                          <h5 className="font-semibold text-gray-900 mb-2">{project.title}</h5>
                          <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                          {project.project_url && (
                            <a
                              href={project.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              View Project →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </InfoSection>
                )}

                <InfoSection
                  title="Submission Metadata"
                  icon={<FileText className="w-5 h-5 text-gray-600" />}
                  bgColor="bg-gray-50"
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

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      console.log('Notes saved:', notes);
                      onClose();
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600 py-8">No data found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCredentialsModal;
