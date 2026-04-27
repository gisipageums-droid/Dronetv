import React from 'react';
import { Building2 } from 'lucide-react';

export default function CompanyInformation({
    setShowAddFieldModal,
    showAddFieldModal,
    openEditCompanyModal,
    hiddenCompanyFields,
    editingCompanyPlaceholders,
    editingCompanyLabels,
    setEditingCompanyLabels,
    setEditingCompanyPlaceholders,
    updateFormData,
    formData,
    setHiddenCompanyFields,
    apiCompanyKeys,
    customFields,
    showEditCompanyModal,
    setShowEditCompanyModal,
    updateCustomFieldValue,
    newFieldLabel,
    setNewFieldLabel,
    newFieldPlaceholder,
    setNewFieldPlaceholder,
    newFieldRequired,
    setNewFieldRequired,
    addCustomField,
    removeCustomField,
    editingCustomFields,
    setEditingCustomFields,
    updateEditingCustomFieldLabel,
    updateEditingCustomFieldPlaceholder,
    removeEditingCustomField,
    isAddingField,
    isLoadingCompanyDetails,
    isSavingCompanyChanges,
    saveCompanyChanges,
    deleteCoreField
}: {
    setShowAddFieldModal: React.Dispatch<React.SetStateAction<boolean>>;
    showAddFieldModal: boolean;
    openEditCompanyModal: () => Promise<void>;
    hiddenCompanyFields: Set<string>;
    editingCompanyPlaceholders: any;
    editingCompanyLabels: any;
    setEditingCompanyLabels: React.Dispatch<React.SetStateAction<any>>;
    setEditingCompanyPlaceholders: React.Dispatch<React.SetStateAction<any>>;
    updateFormData: any;
    formData: any;
    setHiddenCompanyFields: (setter: (prev: Set<string>) => Set<string>) => void;
    apiCompanyKeys: Set<string>;
    customFields: Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>;
    showEditCompanyModal: boolean;
    setShowEditCompanyModal: React.Dispatch<React.SetStateAction<boolean>>;
    updateCustomFieldValue: (id: string, value: string) => void;
    newFieldLabel: string;
    setNewFieldLabel: React.Dispatch<React.SetStateAction<string>>;
    newFieldPlaceholder: string;
    setNewFieldPlaceholder: React.Dispatch<React.SetStateAction<string>>;
    newFieldRequired: boolean;
    setNewFieldRequired: React.Dispatch<React.SetStateAction<boolean>>;
    addCustomField: () => Promise<void>;
    removeCustomField: (id: string) => void;
    editingCustomFields: Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>;
    setEditingCustomFields: React.Dispatch<React.SetStateAction<Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>>>;
    updateEditingCustomFieldLabel: (id: string, label: string) => void;
    updateEditingCustomFieldPlaceholder: (id: string, placeholder: string) => void;
    removeEditingCustomField: (id: string) => void;
    isAddingField: boolean;
    isLoadingCompanyDetails: boolean;
    isSavingCompanyChanges: boolean;
    saveCompanyChanges: () => Promise<void>;
    deleteCoreField: (key: 'companyName' | 'yearEstablished' | 'websiteUrl' | 'promoCode') => void;
}) {

    const hideCompanyField = (fieldName: string) => {
        setHiddenCompanyFields((prev: Set<string>) => new Set([...prev, fieldName]))
    }


    return (
        <>
            <div className="p-3 bg-yellow-50 rounded-lg border border-amber-200">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="flex items-center text-sm font-bold text-amber-900">
                        <Building2 className="mr-2 w-5 h-5" />
                        Company Information
                    </h3>
                    <div className="flex space-x-2">
                        <button onClick={() => setShowAddFieldModal(true)} className="p-1 rounded hover:bg-amber-100" title="Add New Field">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                        <button
                            onClick={openEditCompanyModal}
                            disabled={isLoadingCompanyDetails}
                            className="p-1 rounded hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Edit Company Information"
                        >
                            {isLoadingCompanyDetails ? (
                                <svg className="w-5 h-5 text-amber-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {(Object.keys(editingCompanyLabels).length > 0
                    || Object.keys(editingCompanyPlaceholders || {}).length > 0
                    || (formData && (formData.companyName || formData.websiteUrl || formData.promoCode || formData.yearEstablished))
                    || isLoadingCompanyDetails) && (
                        <div className="mt-4 space-y-3">
                            {isLoadingCompanyDetails ? (
                                <div className="flex justify-center items-center py-4">
                                    <div className="w-8 h-8 rounded-full border-b-2 border-amber-500 animate-spin"></div>
                                    <span className="ml-2 text-sm text-gray-600">Loading company data...</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                    {Array.from(apiCompanyKeys)
                                        .filter((key) => !hiddenCompanyFields.has(key))
                                        .map((key) => {
                                            const labelVal: any = (editingCompanyLabels as any)?.[key];
                                            const labelText = typeof labelVal === 'string' ? labelVal : (labelVal?.label ?? '');
                                            const phVal: any = (editingCompanyPlaceholders as any)?.[key];
                                            const placeholderText = typeof phVal === 'string' ? phVal : (phVal?.placeholder ?? '');
                                            return (
                                                <div key={key} className="relative">
                                                    <div className="mb-2">
                                                        <label className="block mb-1 text-xs font-semibold text-gray-700">
                                                            {labelText}
                                                            {(key === 'companyName' || key === 'promoCode') && <span className="ml-1 text-red-500">*</span>}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder={placeholderText}
                                                            className="px-3 py-2 w-full text-sm bg-white rounded-md border border-amber-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-amber-400"
                                                            value={String((formData as any)[key] ?? '')}
                                                            onChange={(e) => updateFormData({ [key]: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="flex absolute top-0 right-0 space-x-1">
                                                        <button
                                                            onClick={() => deleteCoreField(key as any)}
                                                            className="p-1 text-red-500 rounded hover:text-red-700 hover:bg-red-50"
                                                            title="Delete field"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    {customFields.length > 0 && customFields.map((field) => (
                                        <div key={field.id} className="relative">
                                            <div className="mb-2">
                                                <label className="block mb-1 text-xs font-semibold text-gray-700">
                                                    {field.label}
                                                    {field.required && <span className="ml-1 text-red-500">*</span>}
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder={field.placeholder}
                                                    className="px-3 py-2 w-full text-sm bg-white rounded-md border border-amber-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-amber-400"
                                                    value={String(field.value ?? '')}
                                                    onChange={(e) => updateCustomFieldValue(field.id, e.target.value)}
                                                />
                                            </div>
                                            <div className="flex absolute top-0 right-0 space-x-1">
                                                <button
                                                    onClick={() => removeCustomField(field.id)}
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
                            )}
                        </div>
                    )}
            </div>

            {showEditCompanyModal && (
                <div className="flex overflow-auto fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
                    <div className="p-6 mx-4 w-full max-w-2xl max-h-[300px] overflow-auto bg-white rounded-lg shadow-xl">
                        <h3 className="mb-4 text-lg font-bold text-gray-900">Edit Company Information</h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {Array.from(new Set([
                                    ...Object.keys(editingCompanyLabels || {}),
                                    ...Object.keys(editingCompanyPlaceholders || {}),
                                ]))
                                    .filter((key) => !hiddenCompanyFields.has(key))
                                    .map((key) => {
                                        const labelVal: any = (editingCompanyLabels as any)?.[key];
                                        const phVal: any = (editingCompanyPlaceholders as any)?.[key];
                                        return (
                                            <div key={key}>
                                                <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
                                                <input
                                                    type="text"
                                                    value={typeof labelVal === 'string' ? labelVal : (labelVal?.label ?? '')}
                                                    onChange={(e) => setEditingCompanyLabels((prev: any) => ({ ...prev, [key]: e.target.value }))}
                                                    placeholder={key}
                                                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                />
                                                <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">Placeholder Text</label>
                                                <input
                                                    type="text"
                                                    value={typeof phVal === 'string' ? phVal : (phVal?.placeholder ?? '')}
                                                    onChange={(e) => setEditingCompanyPlaceholders((prev: any) => ({ ...prev, [key]: e.target.value }))}
                                                    placeholder={key}
                                                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                />
                                            </div>
                                        );
                                    })}
                            </div>
                            {editingCustomFields.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="mb-3 text-sm font-semibold text-gray-700">Custom Fields</h4>
                                    <div className="space-y-4">
                                        {editingCustomFields.map((field) => (
                                            <div key={field.id} className="p-3 rounded-lg border border-gray-200">
                                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                    <div>
                                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                                            Field Label
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={typeof field.label === 'string' ? field.label : String(field.label || '')}
                                                            onChange={(e) => updateEditingCustomFieldLabel(field.id, e.target.value)}
                                                            placeholder="Enter field label"
                                                            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                                            Placeholder Text
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={typeof field.placeholder === 'string' ? field.placeholder : String(field.placeholder || '')}
                                                            onChange={(e) => updateEditingCustomFieldPlaceholder(field.id, e.target.value)}
                                                            placeholder="Enter placeholder text"
                                                            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center mt-2">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.required}
                                                            onChange={(e) => {
                                                                setEditingCustomFields(editingCustomFields.map(f =>
                                                                    f.id === field.id ? { ...f, required: e.target.checked } : f
                                                                ));
                                                            }}
                                                            className="w-4 h-4 text-amber-600 bg-gray-100 rounded border-gray-300 focus:ring-amber-500 focus:ring-2"
                                                        />
                                                        <label className="ml-2 text-sm font-medium text-gray-700">
                                                            Required Field
                                                        </label>
                                                    </div>
                                                    <button
                                                        onClick={() => removeEditingCustomField(field.id)}
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
                        </div>

                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                onClick={() => setShowEditCompanyModal(false)}
                                className="px-4 py-2 text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveCompanyChanges}
                                disabled={isSavingCompanyChanges}
                                className="flex items-center px-4 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSavingCompanyChanges ? (
                                    <>
                                        <svg className="mr-3 -ml-1 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddFieldModal && (
                <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
                    <div className="p-6 mx-4 w-full max-w-md max-h-[300px] overflow-auto bg-white rounded-lg shadow-xl">
                        <h3 className="mb-4 text-lg font-bold text-gray-900">Add New Field</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={newFieldLabel}
                                    onChange={(e) => setNewFieldLabel(e.target.value)}
                                    placeholder="e.g., Company Location"
                                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Placeholder Text
                                </label>
                                <input
                                    type="text"
                                    value={newFieldPlaceholder}
                                    onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                                    placeholder="e.g., Enter company location"
                                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="newFieldRequired"
                                    checked={newFieldRequired}
                                    onChange={(e) => setNewFieldRequired(e.target.checked)}
                                    className="w-4 h-4 text-amber-600 bg-gray-100 rounded border-gray-300 focus:ring-amber-500 focus:ring-2"
                                />
                                <label htmlFor="newFieldRequired" className="ml-2 text-sm font-medium text-gray-700">
                                    Required Field
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                onClick={() => setShowAddFieldModal(false)}
                                className="px-4 py-2 text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addCustomField}
                                disabled={isAddingField}
                                className="flex items-center px-4 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAddingField ? (
                                    <>
                                        <svg className="mr-3 -ml-1 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Adding...
                                    </>
                                ) : (
                                    'Add Field'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}


