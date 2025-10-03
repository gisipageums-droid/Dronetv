import { Award, Briefcase, CheckCircle, Eye, FileText, Mail, MapPin, Star, User, Users, X, XCircle } from 'lucide-react';
import React, { useState } from 'react';

interface Professional {
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
    needsAdminAction: boolean;
    cleanUrl: string;
}

interface CredentialsModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    loading: boolean;
    onPreview: (professionalId: string) => void;
    onApprove: (professionalId: string) => void;
    onReject: (professionalId: string) => void;
    professional: Professional | null;
}

const ProfessionalCredentialsModal: React.FC<CredentialsModalProps> = ({
    isOpen,
    onClose,
    data,
    loading,
    onPreview,
    onApprove,
    onReject,
    professional
}) => {
    const [notes, setNotes] = useState(data?.adminNotes || '');

    if (!isOpen) return null;

    const InfoSection: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode; bgColor?: string }> = ({
        title,
        children,
        icon,
        bgColor = "bg-gray-50"
    }) => (
        <div className={`${bgColor} p-6 rounded-xl border border-gray-200`}>
            <div className="flex items-center gap-3 mb-4">
                {icon}
                <h4 className="font-semibold text-lg text-gray-900">{title}</h4>
            </div>
            {children}
        </div>
    );

    const InfoField: React.FC<{ label: string; value: React.ReactNode; span?: number }> = ({
        label,
        value,
        span = 1
    }) => (
        <div className={`col-span-1 md:col-span-${span}`}>
            <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
            <p className="text-gray-900">{value || 'Not provided'}</p>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">Professional Details</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Action Buttons */}
                    {professional && (
                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                            <button
                                onClick={() => onPreview(professional.professionalId)}
                                className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center gap-2 justify-center"
                            >
                                <Eye className="w-4 h-4" />
                                Preview Profile
                            </button>

                            <button
                                onClick={() => onApprove(professional.professionalId)}
                                className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium flex items-center gap-2 justify-center"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                            </button>
                            <button
                                onClick={() => onReject(professional.professionalId)}
                                className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex items-center gap-2 justify-center"
                            >
                                <XCircle className="w-4 h-4" />
                                Reject
                            </button>
                        </div>
                    )}

                    {data ? (
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <InfoSection
                                title="Basic Information"
                                icon={<User className="w-5 h-5 text-blue-600" />}
                                bgColor="bg-blue-50"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <InfoField label="Professional Name" value={data.professionalName} />
                                    <InfoField label="Full Name" value={data.fullName} />
                                    <InfoField label="Location" value={data.location} />
                                    <InfoField label="Professional Description" value={data.professionalDescription} span={3} />
                                </div>
                            </InfoSection>

                            {/* Categories & Skills */}
                            <InfoSection
                                title="Categories & Skills"
                                icon={<Briefcase className="w-5 h-5 text-green-600" />}
                                bgColor="bg-green-50"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-2">Categories</p>
                                        <div className="flex flex-wrap gap-2">
                                            {data.categories?.map((category: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                                                >
                                                    {category}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-2">Skills & Services</p>
                                        <div className="flex gap-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Award className="w-4 h-4 text-blue-600" />
                                                <span>{data.skillsCount || 0} Skills</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4 text-purple-600" />
                                                <span>{data.servicesCount || 0} Services</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </InfoSection>

                            {/* Contact & Account Information */}
                            <InfoSection
                                title="Contact & Account"
                                icon={<Mail className="w-5 h-5 text-purple-600" />}
                                bgColor="bg-purple-50"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <InfoField label="User ID" value={data.userId} />
                                    <InfoField label="Email" value={data.userId} />
                                    <InfoField label="Submission ID" value={data.submissionId} />
                                    <InfoField label="Professional ID" value={data.professionalId} />
                                </div>
                            </InfoSection>

                            {/* Template & Status Information */}
                            <InfoSection
                                title="Template & Status"
                                icon={<FileText className="w-5 h-5 text-orange-600" />}
                                bgColor="bg-orange-50"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <InfoField label="Template" value={data.templateSelection} />
                                    <InfoField label="Review Status" value={data.reviewStatus} />
                                    <InfoField label="Completion" value={`${data.completionPercentage}%`} />
                                    <InfoField label="Version" value={`v${data.version}`} />
                                </div>
                            </InfoSection>

                            {/* Dates & Activity */}
                            <InfoSection
                                title="Dates & Activity"
                                icon={<Star className="w-5 h-5 text-yellow-600" />}
                                bgColor="bg-yellow-50"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <InfoField label="Created" value={new Date(data.createdAt).toLocaleDateString()} />
                                    <InfoField label="Last Modified" value={new Date(data.lastModified).toLocaleDateString()} />
                                    <InfoField label="Published" value={data.publishedDate ? new Date(data.publishedDate).toLocaleDateString() : 'Not published'} />
                                    <InfoField label="Last Activity" value={new Date(data.lastActivity).toLocaleDateString()} />
                                </div>
                            </InfoSection>

                            {/* URLs & Visibility */}
                            <InfoSection
                                title="URLs & Visibility"
                                icon={<MapPin className="w-5 h-5 text-red-600" />}
                                bgColor="bg-red-50"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoField
                                        label="Clean URL"
                                        value={
                                            data.cleanUrl ? (
                                                <a
                                                    href={data.cleanUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {data.cleanUrl}
                                                </a>
                                            ) : (
                                                'Not available'
                                            )
                                        }
                                    />
                                    <InfoField label="URL Slug" value={data.urlSlug || 'Not set'} />
                                    <InfoField label="Visibility" value={data.isVisible ? 'Visible' : 'Hidden'} />
                                    <InfoField label="Approval Status" value={data.isApproved ? 'Approved' : 'Not Approved'} />
                                </div>
                            </InfoSection>

                            {/* Admin Notes */}
                            <InfoSection
                                title="Admin Notes"
                                icon={<FileText className="w-5 h-5 text-gray-600" />}
                            >
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add admin notes here..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    rows={4}
                                />
                            </InfoSection>

                            {/* Modal Actions */}
                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        // Save notes logic here
                                        toast.success("Notes saved successfully");
                                        onClose();
                                    }}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Save Notes
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
                            <p className="text-gray-600">Loading professional details...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfessionalCredentialsModal;