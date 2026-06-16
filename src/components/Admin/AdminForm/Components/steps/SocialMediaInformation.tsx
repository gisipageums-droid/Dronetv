// SocialMediaInformation.tsx
import React from 'react';
import { FormInput } from '../FormInput';
import { Globe } from 'lucide-react';

export default function SocialMediaInformation({
    setShowSocialMediaModal,
    openEditSocialMediaModal,
    hiddenSocialMediaFields,
    editingSocialMediaLabels,
    editingSocialMediaPlaceholders,
    updateFormData,
    formData,
    setHiddenSocialMediaFields,
    socialMediaCustomFields,
    updateSocialMediaCustomFieldValue,
    removeSocialMediaCustomField,
    showEditSocialMediaModal,
    setShowEditSocialMediaModal,
    setEditingSocialMediaLabels,
    setEditingSocialMediaPlaceholders,
    saveSocialMediaChanges,
    showSocialMediaModal,
    newSocialMediaFieldLabel,
    setNewSocialMediaFieldLabel,
    newSocialMediaFieldPlaceholder,
    setNewSocialMediaFieldPlaceholder,
    newSocialMediaFieldRequired,
    setNewSocialMediaFieldRequired,
    addSocialMediaCustomField,
    editingSocialMediaCustomFields,
    setEditingSocialMediaCustomFields,
    updateEditingSocialMediaCustomFieldLabel,
    updateEditingSocialMediaCustomFieldPlaceholder,
    removeEditingSocialMediaCustomField,
    socialMediaData // Add this new prop for API data
}: any) {

    // Helper function to get label from API data or fallback
    const getLabel = (fieldName: string) => {
        if (editingSocialMediaLabels && editingSocialMediaLabels[fieldName]) {
            return String(editingSocialMediaLabels[fieldName]);
        }
        
        if (socialMediaData?.socialMediaLabels?.[fieldName]?.label) {
            return socialMediaData.socialMediaLabels[fieldName].label;
        }
        
        // Fallback to default labels
        const defaultLabels: { [key: string]: string } = {
            linkedin: 'LinkedIn',
            facebook: 'Facebook',
            instagram: 'Instagram',
            twitter: 'Twitter',
            youtube: 'YouTube',
            supportEmail: 'Support Email',
            supportContactNumber: 'Support Contact Number',
            whatsappNumber: 'WhatsApp Number'
        };
        
        return defaultLabels[fieldName] || fieldName;
    };

    // Helper function to get placeholder from API data or fallback
    const getPlaceholder = (fieldName: string) => {
        if (editingSocialMediaPlaceholders && editingSocialMediaPlaceholders[fieldName]) {
            return String(editingSocialMediaPlaceholders[fieldName]);
        }
        
        if (socialMediaData?.socialMediaPlaceholders?.[fieldName]?.placeholder) {
            return socialMediaData.socialMediaPlaceholders[fieldName].placeholder;
        }
        
        // Fallback to default placeholders
        const defaultPlaceholders: { [key: string]: string } = {
            linkedin: "https://linkedin.com/company/yourcompany",
            facebook: "https://facebook.com/yourcompany",
            instagram: "https://instagram.com/yourcompany",
            twitter: "https://twitter.com/yourcompany",
            youtube: "https://youtube.com/@yourcompany",
            supportEmail: "support@company.com",
            supportContactNumber: "+919876543210",
            whatsappNumber: "+91XXXXXXXXXX"
        };
        
        return defaultPlaceholders[fieldName] || "";
    };

    const hideSocialMediaField = async (fieldName: string) => {
        try {
            const res = await fetch(`https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/delete-core-field/${fieldName}`, {
                method: 'DELETE', 
                headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) {
                const txt = await res.text().catch(() => '');
                throw new Error(txt || 'Delete failed');
            }
            setHiddenSocialMediaFields((prev: Set<string>) => new Set([...prev, fieldName]));
        } catch (e) {
                                                        }}
                                                        className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-amber-600 focus:ring-amber-500 focus:ring-2"
                                                    />
                                                    <label className="ml-2 text-sm font-medium text-gray-700">
                                                        Required Field
                                                    </label>
                                                </div>
                                                <button
                                                    onClick={() => removeEditingSocialMediaCustomField(field.id)}
                                                    className="p-1 text-red-500 rounded hover:text-red-700 hover:bg-red-50"
                                                    title="Delete field"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                onClick={() => setShowEditSocialMediaModal(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveSocialMediaChanges}
                                className="px-4 py-2 text-white rounded-md bg-amber-500 hover:bg-amber-600"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSocialMediaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="p-6 mx-4 w-full max-w-md max-h-[300px] overflow-auto bg-white rounded-lg shadow-xl">
                        <h3 className="mb-4 text-lg font-bold text-gray-900">Add Social Media Field</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={newSocialMediaFieldLabel}
                                    onChange={(e) => setNewSocialMediaFieldLabel(e.target.value)}
                                    placeholder="e.g., TikTok"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Placeholder Text
                                </label>
                                <input
                                    type="text"
                                    value={newSocialMediaFieldPlaceholder}
                                    onChange={(e) => setNewSocialMediaFieldPlaceholder(e.target.value)}
                                    placeholder="e.g., https://tiktok.com/@yourcompany"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="newSocialMediaFieldRequired"
                                    checked={newSocialMediaFieldRequired}
                                    onChange={(e) => setNewSocialMediaFieldRequired(e.target.checked)}
                                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-amber-600 focus:ring-amber-500 focus:ring-2"
                                />
                                <label htmlFor="newSocialMediaFieldRequired" className="ml-2 text-sm font-medium text-gray-700">
                                    Required Field
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                onClick={() => setShowSocialMediaModal(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addSocialMediaCustomField}
                                className="px-4 py-2 text-white rounded-md bg-amber-500 hover:bg-amber-600"
                            >
                                Add Field
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}