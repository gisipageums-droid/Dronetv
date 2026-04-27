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
            console.error('Delete social media core field failed:', e);
            setHiddenSocialMediaFields((prev: Set<string>) => new Set([...prev, fieldName]));
        }
    }

    return (
        <>
            <div className="p-3 border rounded-lg bg-amber-200 border-amber-200">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="flex items-center text-sm font-bold text-amber-900">
                        <Globe className="w-5 h-5 mr-2" />
                        Social Media Links (Optional)
                    </h3>
                    <div className="flex space-x-2">
                        <button onClick={() => setShowSocialMediaModal(true)} className="p-1 rounded hover:bg-amber-300" title="Add New Field">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                        <button onClick={openEditSocialMediaModal} className="p-1 rounded hover:bg-amber-300" title="Edit Social Media Information">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {!hiddenSocialMediaFields.has('linkedin') && (
                            <div className="relative">
                                <FormInput
                                    label={getLabel('linkedin')}
                                    type="url"
                                    value={formData.socialLinks?.linkedin || ''}
                                    onChange={(value: any) => updateFormData({
                                        socialLinks: { ...formData.socialLinks, linkedin: value }
                                    })}
                                    placeholder={getPlaceholder('linkedin')}
                                />
                                <button
                                    onClick={() => hideSocialMediaField('linkedin')}
                                    className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                                    title="Remove field"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        {!hiddenSocialMediaFields.has('facebook') && (
                            <div className="relative">
                                <FormInput
                                    label={getLabel('facebook')}
                                    type="url"
                                    value={formData.socialLinks?.facebook || ''}
                                    onChange={(value: any) => updateFormData({
                                        socialLinks: { ...formData.socialLinks, facebook: value }
                                    })}
                                    placeholder={getPlaceholder('facebook')}
                                />
                                <button
                                    onClick={() => hideSocialMediaField('facebook')}
                                    className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                                    title="Remove field"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {!hiddenSocialMediaFields.has('instagram') && (
                            <div className="relative">
                                <FormInput
                                    label={getLabel('instagram')}
                                    type="url"
                                    value={formData.socialLinks?.instagram || ''}
                                    onChange={(value: any) => updateFormData({
                                        socialLinks: { ...formData.socialLinks, instagram: value }
                                    })}
                                    placeholder={getPlaceholder('instagram')}
                                />
                                <button
                                    onClick={() => hideSocialMediaField('instagram')}
                                    className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                                    title="Remove field"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        {!hiddenSocialMediaFields.has('twitter') && (
                            <div className="relative">
                                <FormInput
                                    label={getLabel('twitter')}
                                    type="url"
                                    value={formData.socialLinks?.twitter || ''}
                                    onChange={(value: any) => updateFormData({
                                        socialLinks: { ...formData.socialLinks, twitter: value }
                                    })}
                                    placeholder={getPlaceholder('twitter')}
                                />
                                <button
                                    onClick={() => hideSocialMediaField('twitter')}
                                    className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                                    title="Remove field"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {!hiddenSocialMediaFields.has('youtube') && (
                            <div className="relative">
                                <FormInput
                                    label={getLabel('youtube')}
                                    type="url"
                                    value={formData.socialLinks?.youtube || ''}
                                    onChange={(value: any) => updateFormData({
                                        socialLinks: { ...formData.socialLinks, youtube: value }
                                    })}
                                    placeholder={getPlaceholder('youtube')}
                                />
                                <button
                                    onClick={() => hideSocialMediaField('youtube')}
                                    className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                                    title="Remove field"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        {!hiddenSocialMediaFields.has('supportEmail') && (
                            <div className="relative">
                                <FormInput
                                    label={getLabel('supportEmail')}
                                    type="email"
                                    value={formData.supportEmail || ''}
                                    onChange={(value: any) => updateFormData({ supportEmail: value })}
                                    placeholder={getPlaceholder('supportEmail')}
                                />
                                <button
                                    onClick={() => hideSocialMediaField('supportEmail')}
                                    className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                                    title="Remove field"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {!hiddenSocialMediaFields.has('supportContactNumber') && (
                            <div className="relative">
                                <FormInput
                                    label={getLabel('supportContactNumber')}
                                    type="tel"
                                    value={formData.supportContactNumber || ''}
                                    onChange={(value: any) => updateFormData({ supportContactNumber: value })}
                                    placeholder={getPlaceholder('supportContactNumber')}
                                />
                                <button
                                    onClick={() => hideSocialMediaField('supportContactNumber')}
                                    className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                                    title="Remove field"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        {!hiddenSocialMediaFields.has('whatsappNumber') && (
                            <div className="relative">
                                <FormInput
                                    label={getLabel('whatsappNumber')}
                                    type="tel"
                                    value={formData.whatsappNumber || ''}
                                    onChange={(value: any) => updateFormData({ whatsappNumber: value })}
                                    placeholder={getPlaceholder('whatsappNumber')}
                                />
                                <button
                                    onClick={() => hideSocialMediaField('whatsappNumber')}
                                    className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                                    title="Remove field"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {socialMediaCustomFields.length > 0 && (
                    <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            {socialMediaCustomFields.map((field: any) => (
                                <div key={field.id} className="relative">
                                    <FormInput
                                        label={field.label}
                                        required={field.required}
                                        value={field.value}
                                        onChange={(value: any) => updateSocialMediaCustomFieldValue(field.id, value)}
                                        placeholder={field.placeholder}
                                    />
                                    <div className="absolute top-0 right-0 flex space-x-1">
                                        <button
                                            onClick={() => removeSocialMediaCustomField(field.id)}
                                            className="p-1 text-red-500 rounded hover:text-red-700 hover:bg-red-50"
                                            title="Delete Field"
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
            </div>

            {/* Rest of the modal code remains the same */}
            {showEditSocialMediaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="p-6 mx-4 w-full max-w-4xl max-h-[80vh] overflow-auto bg-white rounded-lg shadow-xl">
                        <h3 className="mb-4 text-lg font-bold text-gray-900">Edit Social Media Information</h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {Array.from(new Set([
                                    ...Object.keys(editingSocialMediaLabels || {}),
                                    ...Object.keys(editingSocialMediaPlaceholders || {})
                                ])).map((key) => (
                                    <div key={key} className={`${key === 'supportEmail' || key === 'supportContactNumber' || key === 'whatsappNumber' ? 'md:col-span-2' : ''}`}>
                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                            Field Label
                                        </label>
                                        <input
                                            type="text"
                                            value={String((editingSocialMediaLabels as any)[key] ?? '')}
                                            onChange={(e) => setEditingSocialMediaLabels((prev: any) => ({ ...prev, [key]: e.target.value }))}
                                            placeholder={`e.g., ${key}`}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                        <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                                            Placeholder Text
                                        </label>
                                        <input
                                            type="text"
                                            value={String((editingSocialMediaPlaceholders as any)[key] ?? '')}
                                            onChange={(e) => setEditingSocialMediaPlaceholders((prev: any) => ({ ...prev, [key]: e.target.value }))}
                                            placeholder=""
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {editingSocialMediaCustomFields.length > 0 && (
                            <div className="mt-4">
                                <h4 className="mb-3 text-sm font-semibold text-gray-700">Custom Fields</h4>
                                <div className="space-y-4">
                                    {editingSocialMediaCustomFields.map((field: any) => (
                                        <div key={field.id} className="p-3 border border-gray-200 rounded-lg">
                                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                                        Field Label
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={field.label}
                                                        onChange={(e) => updateEditingSocialMediaCustomFieldLabel(field.id, e.target.value)}
                                                        placeholder="Enter field label"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                                        Placeholder Text
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={field.placeholder}
                                                        onChange={(e) => updateEditingSocialMediaCustomFieldPlaceholder(field.id, e.target.value)}
                                                        placeholder="Enter placeholder text"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={field.required}
                                                        onChange={(e) => {
                                                            setEditingSocialMediaCustomFields(editingSocialMediaCustomFields.map((f: any) =>
                                                                f.id === field.id ? { ...f, required: e.target.checked } : f
                                                            ));
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