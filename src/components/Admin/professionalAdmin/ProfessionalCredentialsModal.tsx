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
  XCircle
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
  loading?: boolean; // optional external loading control
  professional?: Professional | null; // optional immediate data from parent
  onPreview: (professionalId: string) => void;
  onApprove: (professionalId: string) => void;
  onReject: (professionalId: string) => void;
}

const mapProfessionalToFormData = (p: Professional | null) => {
  if (!p) return null;
  return {
    professionalInfo: {
      fullName: p.fullName || p.professionalName || '',
      email: p.userId || '',
      phone: '',
      address: p.location || '',
      address2: '',
      city: '',
      state: '',
      pincode: '',
      emergencyContact: ''
    },
    serviceDetails: {
      categories: p.categories || [],
      subcategories: [],
      skills: [], // no raw skills on `Professional` type — leave empty
      services: [],
      projects: [],
      freeformSkills: []
    },
    mediaInfo: {
      uploadedMedia: [],
      mediaLinks: {}
    },
    templateInfo: {
      templateSelection: p.templateSelection ?? undefined,
      processingMethod: undefined,
      version: p.version ? String(p.version) : undefined
    },
    submissionMetadata: {
      userId: p.userId || '',
      submissionId: p.submissionId || '',
      draftId: p.submissionId || '',
      status: p.reviewStatus || '',
      lastUpdated: p.lastModified ? Date.parse(p.lastModified) : undefined,
      processingMethod: undefined
    },
    publishedMetadata: {
      publishedId: p.professionalId,
      userId: p.userId,
      currentStatus: p.reviewStatus,
      createdAt: p.createdAt,
      lastModified: p.lastModified,
      urlSlug: p.cleanUrl || p.urlSlug,
      templateUsed: p.templateSelection,
      isVisible: p.isVisible,
      adminNotes: p.adminNotes || ''
    },
    completionMetrics: {
      completionPercentage: p.completionPercentage ?? 0,
      completedFields: 0,
      totalKeyFields: 0,
      qualityScore: 0
    }
  };
};

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

  // If parent passed a professional object, show it immediately (mapped shape)
  useEffect(() => {
    if (professional) {
      const mapped = mapProfessionalToFormData(professional);
      setData(mapped);
      setNotes(mapped?.publishedMetadata?.adminNotes || '');
    }
  }, [professional]);

  // Fetch latest data from backend whenever modal opens or professionalId changes
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
        // The API returns { formData: { ... } } — prefer formData, fallback to whole body
        const fetched = json.formData ?? json;
        if (!cancelled) {
          setData(fetched);
          setNotes(fetched?.publishedMetadata?.adminNotes || fetched?.publishedMetadata?.adminNotes || '');
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

  // Reset when modal closes (only if parent didn't pass professional)
  useEffect(() => {
    if (!isOpen) {
      if (!professional) setData(null);
      setError(null);
      setInternalLoading(false);
    }
  }, [isOpen, professional]);

  const isLoading = externalLoading ?? internalLoading;

  if (!isOpen) return null;

  const InfoSection: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode; bgColor?: string }> = ({
    title,
    children,
    icon,
    bgColor = 'bg-gray-50'
  }) => (
    <div className={`${bgColor} p-6 rounded-xl border border-gray-200`}>
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h4 className="font-semibold text-lg text-gray-900">{title}</h4>
      </div>
      {children}
    </div>
  );

  const InfoField: React.FC<{ label: string; value: React.ReactNode; span?: number }> = ({ label, value, span = 1 }) => (
    <div className={`col-span-1 md:col-span-${span}`}>
      <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
      <p className="text-gray-900">{value ?? 'Not provided'}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Professional Details</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Loading / Error */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading professional details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500 font-medium">{error}</div>
          ) : data ? (
            <>
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={() => professionalId && onPreview(professionalId)}
                  className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center gap-2 justify-center"
                >
                  <Eye className="w-4 h-4" /> Preview Profile
                </button>
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

              {/* Content sections (keeps same layout as before) */}
              <div className="space-y-6">
                <InfoSection title="Basic Information" icon={<User className="w-5 h-5 text-blue-600" />} bgColor="bg-blue-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoField label="Full Name" value={data.professionalInfo?.fullName} />
                    <InfoField label="Email" value={data.professionalInfo?.email} />
                    <InfoField label="City" value={data.professionalInfo?.city || data.professionalInfo?.address || ''} />
                    <InfoField label="Address" value={data.professionalInfo?.address} span={3} />
                  </div>
                </InfoSection>

                <InfoSection title="Categories & Skills" icon={<Briefcase className="w-5 h-5 text-green-600" />} bgColor="bg-green-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Categories</p>
                      <div className="flex flex-wrap gap-2">
                        {data.serviceDetails?.categories?.map((cat: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {data.serviceDetails?.skills?.map((skill: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </InfoSection>

                <InfoSection title="Template & Status" icon={<FileText className="w-5 h-5 text-orange-600" />} bgColor="bg-orange-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <InfoField label="Template" value={data.templateInfo?.templateSelection} />
                    <InfoField label="Version" value={data.templateInfo?.version} />
                    <InfoField label="Status" value={data.publishedMetadata?.currentStatus} />
                    <InfoField label="Visibility" value={data.publishedMetadata?.isVisible ? 'Visible' : 'Hidden'} />
                  </div>
                </InfoSection>

                <InfoSection title="Admin Notes" icon={<FileText className="w-5 h-5 text-gray-600" />}>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add admin notes here..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={4}
                  />
                </InfoSection>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                    Close
                  </button>
                  <button
                    onClick={() => {
                      // Implement real save logic here (call API) or use parent's handler
                      console.log('Notes saved (local):', notes);
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