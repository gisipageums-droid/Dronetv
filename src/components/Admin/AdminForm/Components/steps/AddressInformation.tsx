import React from 'react';
import { FormInput, Select } from '../FormInput';
import { Globe } from 'lucide-react';
import { countries, indianStates } from '../../data/countries';

export default function AddressInformation({
    setShowAddressModal,
    openEditAddressModal,
    hiddenAddressFields,
    editingAddressLabels,
    editingAddressPlaceholders,
    updateFormData,
    formData,
    setHiddenAddressFields,
    addressCustomFields,
    updateAddressCustomFieldValue,
    removeAddressCustomField,
    showEditAddressModal,
    setShowEditAddressModal,
    setEditingAddressLabels,
    setEditingAddressPlaceholders,
    saveAddressChanges,
    showAddressModal,
    newAddressFieldLabel,
    setNewAddressFieldLabel,
    newAddressFieldPlaceholder,
    setNewAddressFieldPlaceholder,
    newAddressFieldRequired,
    setNewAddressFieldRequired,
    addAddressCustomField,
    editingAddressCustomFields,
    setEditingAddressCustomFields,
    updateEditingAddressCustomFieldLabel,
    updateEditingAddressCustomFieldPlaceholder,
    removeEditingAddressCustomField
}: any) {

    const hideAddressField = async (fieldName: string) => {
        try {
            const res = await fetch(`https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/delete-core-field/${fieldName}`, {
                method: 'DELETE', headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) {
                const txt = await res.text().catch(() => '');
                throw new Error(txt || 'Delete failed');
            }
            setHiddenAddressFields((prev: Set<string>) => new Set([...prev, fieldName]));
        } catch (e) {
            console.error('Delete address core field failed:', e);
            setHiddenAddressFields((prev: Set<string>) => new Set([...prev, fieldName]));
        }
    }

    return (
        <>
            <div className="p-3 bg-yellow-200 rounded-lg border border-amber-200">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="flex items-center text-sm font-bold text-amber-900">
                        <Globe className="mr-2 w-5 h-5" />
                        Address Information
                    </h3>
                    <div className="flex space-x-2">
                        <button onClick={() => setShowAddressModal(true)} className="p-1 rounded hover:bg-yellow-300" title="Add New Field">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                        <button onClick={openEditAddressModal} className="p-1 rounded hover:bg-yellow-300" title="Edit Address Information">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
                        {Array.from(new Set([
                            ...Object.keys(editingAddressLabels || {}),
                            ...Object.keys(editingAddressPlaceholders || {})
                        ])).map((key) => (
                            !hiddenAddressFields.has(key) && (
                                <div key={key} className="relative md:col-span-1">
                                    {key === 'country' ? (
                                        <Select
                                            label={typeof (editingAddressLabels as any)?.[key] === 'string' ? (editingAddressLabels as any)[key] : String((editingAddressLabels as any)?.[key] || key)}
                                            options={countries}
                                            value={(formData as any)[key]}
                                            onChange={(value: any) => updateFormData({ [key]: value } as any)}
                                            required
                                            placeholder={(editingAddressPlaceholders as any)?.[key] || 'Select Country'}
                                        />
                                    ) : key === 'state' ? (
                                        <Select
                                            label={typeof (editingAddressLabels as any)?.[key] === 'string' ? (editingAddressLabels as any)[key] : String((editingAddressLabels as any)?.[key] || key)}
                                            options={indianStates}
                                            value={(formData as any)[key]}
                                            onChange={(value: any) => updateFormData({ [key]: value } as any)}
                                            required
                                            placeholder={(editingAddressPlaceholders as any)?.[key] || 'Select State'}
                                        />
                                    ) : key === 'officeAddress' ? (
                                        <FormInput
                                            label={typeof (editingAddressLabels as any)?.[key] === 'string' ? (editingAddressLabels as any)[key] : String((editingAddressLabels as any)?.[key] || key)}
                                            type="textarea"
                                            rows={2}
                                            value={(formData as any)[key]}
                                            onChange={(value: any) => updateFormData({ [key]: value } as any)}
                                            required
                                            placeholder={(editingAddressPlaceholders as any)?.[key] || ''}
                                        />
                                    ) : (
                                        <FormInput
                                            label={typeof (editingAddressLabels as any)?.[key] === 'string' ? (editingAddressLabels as any)[key] : String((editingAddressLabels as any)?.[key] || key)}
                                            value={(formData as any)[key]}
                                            onChange={(value: any) => updateFormData({ [key]: value } as any)}
                                            required
                                            placeholder={(editingAddressPlaceholders as any)?.[key] || ''}
                                        />
                                    )}
                                    <button
                                        onClick={() => hideAddressField(key)}
                                        className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                                        title="Remove field"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )
                        ))}
                    </div>
                </div>
                {addressCustomFields.length > 0 && (
                    <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            {addressCustomFields.map((field: any) => (
                                <div key={field.id} className="relative">
                                    <FormInput
                                        label={field.label}
                                        required={field.required}
                                        value={field.value}
                                        onChange={(value: any) => updateAddressCustomFieldValue(field.id, value)}
                                        placeholder={field.placeholder}
                                    />
                                    <div className="flex absolute top-0 right-0 space-x-1">
                                        <button
                                            onClick={() => removeAddressCustomField(field.id)}
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

            {showEditAddressModal && (
                <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
                    <div className="p-6 mx-4 w-full max-w-2xl max-h-[300px] overflow-auto bg-white rounded-lg shadow-xl">
                        <h3 className="mb-4 text-lg font-bold text-gray-900">Edit Address Information</h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {editingAddressCustomFields && Array.from(new Set([
                                    ...Object.keys(editingAddressLabels || {}),
                                    ...Object.keys(editingAddressPlaceholders || {})
                                ])).map((key) => (
                                    <div key={key} className={`${key === 'officeAddress' ? 'md:col-span-2' : ''}`}>
                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={String((editingAddressLabels as any)[key] ?? '')}
                                            onChange={(e) => setEditingAddressLabels((prev: any) => ({ ...prev, [key]: e.target.value }))}
                                            placeholder={`e.g., ${key}`}
                                            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                        <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                                            Placeholder Text
                                        </label>
                                        <input
                                            type="text"
                                            value={String((editingAddressPlaceholders as any)[key] ?? '')}
                                            onChange={(e) => setEditingAddressPlaceholders((prev: any) => ({ ...prev, [key]: e.target.value }))}
                                            placeholder=""
                                            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {editingAddressCustomFields && editingAddressCustomFields.length > 0 && (
                            <div className="mt-4">
                                <h4 className="mb-3 text-sm font-semibold text-gray-700">Custom Fields</h4>
                                <div className="space-y-4">
                                    {editingAddressCustomFields.map((field: any) => (
                                        <div key={field.id} className="p-3 rounded-lg border border-gray-200">
                                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                                        Field Label
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={field.label}
                                                        onChange={(e) => updateEditingAddressCustomFieldLabel(field.id, e.target.value)}
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
                                                        value={field.placeholder}
                                                        onChange={(e) => updateEditingAddressCustomFieldPlaceholder(field.id, e.target.value)}
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
                                                            setEditingAddressCustomFields(editingAddressCustomFields.map((f: any) =>
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
                                                    onClick={() => removeEditingAddressCustomField(field.id)}
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
                                onClick={() => setShowEditAddressModal(false)}
                                className="px-4 py-2 text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveAddressChanges}
                                className="px-4 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddressModal && (
                <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
                    <div className="p-6 mx-4 w-full max-w-md max-h-[300px] overflow-auto bg-white rounded-lg shadow-xl">
                        <h3 className="mb-4 text-lg font-bold text-gray-900">Add Address Information Field</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={newAddressFieldLabel}
                                    onChange={(e) => setNewAddressFieldLabel(e.target.value)}
                                    placeholder="e.g., Landmark"
                                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Placeholder Text
                                </label>
                                <input
                                    type="text"
                                    value={newAddressFieldPlaceholder}
                                    onChange={(e) => setNewAddressFieldPlaceholder(e.target.value)}
                                    placeholder="e.g., Enter nearby landmark"
                                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="newAddressFieldRequired"
                                    checked={newAddressFieldRequired}
                                    onChange={(e) => setNewAddressFieldRequired(e.target.checked)}
                                    className="w-4 h-4 text-amber-600 bg-gray-100 rounded border-gray-300 focus:ring-amber-500 focus:ring-2"
                                />
                                <label htmlFor="newAddressFieldRequired" className="ml-2 text-sm font-medium text-gray-700">
                                    Required Field
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                onClick={() => setShowAddressModal(false)}
                                className="px-4 py-2 text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addAddressCustomField}
                                className="px-4 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600"
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


