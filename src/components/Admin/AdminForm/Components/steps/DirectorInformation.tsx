import React from 'react';
import { FormInput } from '../FormInput';
import { User } from 'lucide-react';

export default function DirectorInformation({
    setShowDirectorModal,
    openEditDirectorModal,
    hiddenDirectorFields,
    editingDirectorLabels,
    editingDirectorPlaceholders,
    updateFormData,
    formData,
    setHiddenDirectorFields,
    directorCustomFields,
    updateDirectorCustomFieldValue,
    removeDirectorCustomField,
    deleteDirectorCoreField,
    showDirectorModal,
    newDirectorFieldLabel,
    setNewDirectorFieldLabel,
    newDirectorFieldPlaceholder,
    setNewDirectorFieldPlaceholder,
    newDirectorFieldRequired,
    setNewDirectorFieldRequired,
    addDirectorCustomField,
    showEditDirectorModal,
    setShowEditDirectorModal,
    setEditingDirectorLabels,
    setEditingDirectorPlaceholders,
    saveDirectorChanges,
    editingDirectorCustomFields,
    setEditingDirectorCustomFields,
    updateEditingDirectorCustomFieldLabel,
    updateEditingDirectorCustomFieldPlaceholder,
    removeEditingDirectorCustomField
}: {
    setShowDirectorModal: React.Dispatch<React.SetStateAction<boolean>>;
    openEditDirectorModal: () => void;
    hiddenDirectorFields: Set<string>;
    editingDirectorLabels: any;
    editingDirectorPlaceholders: any;
    updateFormData: any;
    formData: any;
    setHiddenDirectorFields: (setter: (prev: Set<string>) => Set<string>) => void;
    directorCustomFields: Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>;
    updateDirectorCustomFieldValue: (id: string, value: string) => void;
    removeDirectorCustomField: (id: string) => void;
    deleteDirectorCoreField: (key: 'directorName' | 'directorPhone' | 'directorEmail') => Promise<void> | void;
    showDirectorModal: boolean;
    newDirectorFieldLabel: string;
    setNewDirectorFieldLabel: React.Dispatch<React.SetStateAction<string>>;
    newDirectorFieldPlaceholder: string;
    setNewDirectorFieldPlaceholder: React.Dispatch<React.SetStateAction<string>>;
    newDirectorFieldRequired: boolean;
    setNewDirectorFieldRequired: React.Dispatch<React.SetStateAction<boolean>>;
    addDirectorCustomField: () => void;
    showEditDirectorModal: boolean;
    setShowEditDirectorModal: React.Dispatch<React.SetStateAction<boolean>>;
    setEditingDirectorLabels: React.Dispatch<React.SetStateAction<any>>;
    setEditingDirectorPlaceholders: React.Dispatch<React.SetStateAction<any>>;
    saveDirectorChanges: () => void;
    editingDirectorCustomFields: Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>;
    setEditingDirectorCustomFields: React.Dispatch<React.SetStateAction<Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>>>;
    updateEditingDirectorCustomFieldLabel: (id: string, label: string) => void;
    updateEditingDirectorCustomFieldPlaceholder: (id: string, placeholder: string) => void;
    removeEditingDirectorCustomField: (id: string) => void;
}) {

    return (
        <div className="p-3 bg-yellow-100 rounded-lg border border-amber-200">
            <div className="flex justify-between items-center mb-2">
                <h3 className="flex items-center text-sm font-bold text-amber-900">
                    <User className="mr-2 w-5 h-5" />
                    Director/MD Information
                </h3>
                <div className="flex space-x-2">
                    <button onClick={() => setShowDirectorModal(true)} className="p-1 rounded hover:bg-yellow-200" title="Add New Field">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                    <button onClick={openEditDirectorModal} className="p-1 rounded hover:bg-yellow-200" title="Edit Director Information">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {Array.from(new Set([
                    ...Object.keys(editingDirectorLabels || {}),
                    ...Object.keys(editingDirectorPlaceholders || {})
                ]))
                    .filter((key) => !hiddenDirectorFields.has(key))
                    .map((key) => {
                        const labelVal: any = (editingDirectorLabels as any)?.[key];
                        const labelText = typeof labelVal === 'string' ? labelVal : (labelVal?.label ?? key);
                        const phVal: any = (editingDirectorPlaceholders as any)?.[key];
                        const placeholderText = typeof phVal === 'string' ? phVal : (phVal?.placeholder ?? '');
                        return (
                            <div key={key} className="relative">
                                <FormInput
                                    label={labelText}
                                    value={String((formData as any)[key] ?? '')}
                                    onChange={(value) => updateFormData({ [key]: value })}
                                    placeholder={placeholderText}
                                />
                                <button
                                    onClick={() => deleteDirectorCoreField(key as 'directorName' | 'directorPhone' | 'directorEmail')}
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
            {directorCustomFields.length > 0 && (
                <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {directorCustomFields.map((field) => (
                            <div key={field.id} className="relative">
                                <FormInput
                                    label={field.label}
                                    required={field.required}
                                    value={field.value}
                                    onChange={(value) => updateDirectorCustomFieldValue(field.id, value)}
                                    placeholder={field.placeholder}
                                />
                                <div className="flex absolute top-0 right-0 space-x-1">
                                    <button
                                        onClick={() => removeDirectorCustomField(field.id)}
                                        className="p-1 text-red-500 rounded hover:text-red-700 hover:bg-amber-50"
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

            {showDirectorModal && (
                <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
                    <div className="p-6 mx-4 w-full max-w-md max-h-[300px] overflow-auto bg-white rounded-lg shadow-xl">
                        <h3 className="mb-4 text-lg font-bold text-gray-900">Add Director Information Field</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={newDirectorFieldLabel}
                                    onChange={(e) => setNewDirectorFieldLabel(e.target.value)}
                                    placeholder="e.g., Director Designation"
                                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Placeholder Text
                                </label>
                                <input
                                    type="text"
                                    value={newDirectorFieldPlaceholder}
                                    onChange={(e) => setNewDirectorFieldPlaceholder(e.target.value)}
                                    placeholder="e.g., Enter director designation"
                                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="newDirectorFieldRequired"
                                    checked={newDirectorFieldRequired}
                                    onChange={(e) => setNewDirectorFieldRequired(e.target.checked)}
                                    className="w-4 h-4 text-amber-600 bg-gray-100 rounded border-gray-300 focus:ring-amber-500 focus:ring-2"
                                />
                                <label htmlFor="newDirectorFieldRequired" className="ml-2 text-sm font-medium text-gray-700">
                                    Required Field
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                onClick={() => setShowDirectorModal(false)}
                                className="px-4 py-2 text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addDirectorCustomField}
                                className="px-4 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600"
                            >
                                Add Field
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditDirectorModal && (
                <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
                    <div className="p-4 mx-4 w-full max-w-lg max-h-[300px] overflow-auto bg-white rounded-lg shadow-xl">
                        <h3 className="mb-4 text-lg font-bold text-gray-900">Edit Director Information</h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editingDirectorLabels.directorName}
                                        onChange={(e) => setEditingDirectorLabels((prev: any) => ({ ...prev, directorName: e.target.value }))}
                                        placeholder="e.g., Director Name"
                                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                    <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                                        Placeholder Text
                                    </label>
                                    <input
                                        type="text"
                                        value={editingDirectorPlaceholders.directorName}
                                        onChange={(e) => setEditingDirectorPlaceholders((prev: any) => ({ ...prev, directorName: e.target.value }))}
                                        placeholder="Full name"
                                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editingDirectorLabels.directorPhone}
                                        onChange={(e) => setEditingDirectorLabels((prev: any) => ({ ...prev, directorPhone: e.target.value }))}
                                        placeholder="e.g., Director Phone"
                                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                    <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                                        Placeholder Text
                                    </label>
                                    <input
                                        type="text"
                                        value={editingDirectorPlaceholders.directorPhone}
                                        onChange={(e) => setEditingDirectorPlaceholders((prev: any) => ({ ...prev, directorPhone: e.target.value }))}
                                        placeholder="+91XXXXXXXXXX"
                                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editingDirectorLabels.directorEmail}
                                        onChange={(e) => setEditingDirectorLabels((prev: any) => ({ ...prev, directorEmail: e.target.value }))}
                                        placeholder="e.g., Director Email"
                                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                    <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                                        Placeholder Text
                                    </label>
                                    <input
                                        type="text"
                                        value={editingDirectorPlaceholders.directorEmail}
                                        onChange={(e) => setEditingDirectorPlaceholders((prev: any) => ({ ...prev, directorEmail: e.target.value }))}
                                        placeholder="director@company.com"
                                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                            {editingDirectorCustomFields.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="mb-3 text-sm font-semibold text-gray-700">Custom Fields</h4>
                                    <div className="space-y-4">
                                        {editingDirectorCustomFields.map((field) => (
                                            <div key={field.id} className="p-3 rounded-lg border border-gray-200">
                                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                    <div>
                                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                                            Field Label
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={field.label}
                                                            onChange={(e) => updateEditingDirectorCustomFieldLabel(field.id, e.target.value)}
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
                                                            onChange={(e) => updateEditingDirectorCustomFieldPlaceholder(field.id, e.target.value)}
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
                                                                setEditingDirectorCustomFields(editingDirectorCustomFields.map(f =>
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
                                                        onClick={() => removeEditingDirectorCustomField(field.id)}
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
                                onClick={() => setShowEditDirectorModal(false)}
                                className="px-4 py-2 text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveDirectorChanges}
                                className="px-4 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


