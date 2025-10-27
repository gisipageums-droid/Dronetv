import React from 'react';
import { FormInput } from '../FormInput';
import { Phone } from 'lucide-react';

export default function AlternativeContact({
    setShowAltContactModal,
    openEditAltContactModal,
    hiddenAltContactFields,
    editingAltContactLabels,
    editingAltContactPlaceholders,
    updateFormData,
    formData,
    setHiddenAltContactFields,
    altContactCustomFields,
    updateAltContactCustomFieldValue,
    removeAltContactCustomField,
    deleteAltContactCoreField,
    showAltContactModal,
    newAltContactFieldLabel,
    setNewAltContactFieldLabel,
    newAltContactFieldPlaceholder,
    setNewAltContactFieldPlaceholder,
    newAltContactFieldRequired,
    setNewAltContactFieldRequired,
    addAltContactCustomField,
    showEditAltContactModal,
    setShowEditAltContactModal,
    setEditingAltContactLabels,
    setEditingAltContactPlaceholders,
    saveAltContactChanges,
    editingAltContactCustomFields,
    setEditingAltContactCustomFields,
    updateEditingAltContactCustomFieldLabel,
    updateEditingAltContactCustomFieldPlaceholder,
    removeEditingAltContactCustomField
}: any) {

    return (
        <>
            <div className="p-3 bg-amber-100 rounded-lg border border-amber-200">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="flex items-center text-sm font-bold text-amber-900">
                        <Phone className="mr-2 w-5 h-5" />
                        Alternative Contact
                    </h3>
                    <div className="flex space-x-2">
                        <button onClick={() => setShowAltContactModal(true)} className="p-1 rounded hover:bg-amber-200" title="Add New Field">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                        <button onClick={openEditAltContactModal} className="p-1 rounded hover:bg-amber-200" title="Edit Alternative Contact">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {Array.from(new Set([
                        ...Object.keys(editingAltContactLabels || {}),
                        ...Object.keys(editingAltContactPlaceholders || {})
                    ]))
                        .filter((key) => !hiddenAltContactFields.has(key))
                        .map((key) => {
                            const labelVal: any = (editingAltContactLabels as any)?.[key];
                            const labelText = typeof labelVal === 'string' ? labelVal : (labelVal?.label ?? key);
                            const phVal: any = (editingAltContactPlaceholders as any)?.[key];
                            const placeholderText = typeof phVal === 'string' ? phVal : (phVal?.placeholder ?? '');
                            return (
                                <div key={key} className={`relative ${key === 'contactEmail' || key === 'altContactEmail' ? 'md:col-span-2' : ''}`}>
                                    <FormInput
                                        label={labelText}
                                        value={String((formData as any)[key] ?? '')}
                                        onChange={(value) => updateFormData({ [key]: value })}
                                        placeholder={placeholderText}
                                    />
                                    <button
                                        onClick={() => deleteAltContactCoreField(key)}
                                        className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                                        title="Remove field"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            );
                        })}
                </div>
                {altContactCustomFields.length > 0 && (
                    <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            {altContactCustomFields.map((field: any) => (
                                <div key={field.id} className="relative">
                                    <FormInput
                                        label={field.label}
                                        required={field.required}
                                        value={field.value}
                                        onChange={(value) => updateAltContactCustomFieldValue(field.id, value)}
                                        placeholder={field.placeholder}
                                    />
                                    <div className="flex absolute top-0 right-0 space-x-1">
                                        <button
                                            onClick={() => removeAltContactCustomField(field.id)}
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

            {showAltContactModal && (
                <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
                    <div className="p-6 mx-4 w-full max-w-md max-h-[300px] overflow-auto bg-white rounded-lg shadow-xl">
                        <h3 className="mb-4 text-lg font-bold text-gray-900">Add Alternative Contact Field</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={newAltContactFieldLabel}
                                    onChange={(e) => setNewAltContactFieldLabel(e.target.value)}
                                    placeholder="e.g., Department"
                                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Placeholder Text
                                </label>
                                <input
                                    type="text"
                                    value={newAltContactFieldPlaceholder}
                                    onChange={(e) => setNewAltContactFieldPlaceholder(e.target.value)}
                                    placeholder="e.g., Enter department name"
                                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="newAltContactFieldRequired"
                                    checked={newAltContactFieldRequired}
                                    onChange={(e) => setNewAltContactFieldRequired(e.target.checked)}
                                    className="w-4 h-4 text-amber-600 bg-gray-100 rounded border-gray-300 focus:ring-amber-500 focus:ring-2"
                                />
                                <label htmlFor="newAltContactFieldRequired" className="ml-2 text-sm font-medium text-gray-700">
                                    Required Field
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                onClick={() => setShowAltContactModal(false)}
                                className="px-4 py-2 text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addAltContactCustomField}
                                className="px-4 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600"
                            >
                                Add Field
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditAltContactModal && (
                <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
                    <div className="p-6 mx-4 w-full max-w-2xl max-h-[300px] overflow-auto bg-white rounded-lg shadow-xl">
                        <h3 className="mb-4 text-lg font-bold text-gray-900">Edit Alternative Contact</h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {Array.from(new Set([
                                    ...Object.keys(editingAltContactLabels || {}),
                                    ...Object.keys(editingAltContactPlaceholders || {})
                                ])).map((key) => (
                                    <div key={key} className={`${key === 'contactEmail' || key === 'altContactEmail' ? 'md:col-span-2' : ''}`}>
                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={String((editingAltContactLabels as any)[key] ?? '')}
                                            onChange={(e) => setEditingAltContactLabels((prev: any) => ({ ...prev, [key]: e.target.value }))}
                                            placeholder={`e.g., ${key}`}
                                            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                        <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                                            Placeholder Text
                                        </label>
                                        <input
                                            type="text"
                                            value={String((editingAltContactPlaceholders as any)[key] ?? '')}
                                            onChange={(e) => setEditingAltContactPlaceholders((prev: any) => ({ ...prev, [key]: e.target.value }))}
                                            placeholder=""
                                            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                ))}
                            </div>
                            {editingAltContactCustomFields.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="mb-3 text-sm font-semibold text-gray-700">Custom Fields</h4>
                                    <div className="space-y-4">
                                        {editingAltContactCustomFields.map((field: any) => (
                                            <div key={field.id} className="p-3 rounded-lg border border-gray-200">
                                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                    <div>
                                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                                            Field Label
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={field.label}
                                                            onChange={(e) => updateEditingAltContactCustomFieldLabel(field.id, e.target.value)}
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
                                                            onChange={(e) => updateEditingAltContactCustomFieldPlaceholder(field.id, e.target.value)}
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
                                                                setEditingAltContactCustomFields(editingAltContactCustomFields.map((f: any) =>
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
                                                        onClick={() => removeEditingAltContactCustomField(field.id)}
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
                                onClick={() => setShowEditAltContactModal(false)}
                                className="px-4 py-2 text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveAltContactChanges}
                                className="px-4 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}


