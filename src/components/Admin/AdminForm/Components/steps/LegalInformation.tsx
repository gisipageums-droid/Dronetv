import React from 'react';
import { FormInput } from '../FormInput';

export default function LegalInformation({
    setShowLegalModal,
    openEditLegalModal,
    hiddenLegalFields,
    editingLegalLabels,
    editingLegalPlaceholders,
    updateFormData,
    formData,
    setHiddenLegalFields,
    legalCustomFields,
    updateLegalCustomFieldValue,
    removeLegalCustomField,
    deleteLegalCoreField,
    showLegalModal,
    newLegalFieldLabel,
    setNewLegalFieldLabel,
    newLegalFieldPlaceholder,
    setNewLegalFieldPlaceholder,
    newLegalFieldRequired,
    setNewLegalFieldRequired,
    addLegalCustomField,
    showEditLegalModal,
    setShowEditLegalModal,
    setEditingLegalLabels,
    setEditingLegalPlaceholders,
    saveLegalChanges,
    editingLegalCustomFields,
    setEditingLegalCustomFields,
    updateEditingLegalCustomFieldLabel,
    updateEditingLegalCustomFieldPlaceholder,
    removeEditingLegalCustomField
}: {
    setShowLegalModal: (show: boolean) => void;
    openEditLegalModal: () => void;
    hiddenLegalFields: Set<string>;
    editingLegalLabels: any;
    editingLegalPlaceholders: any;
    updateFormData: any;
    formData: any;
    setHiddenLegalFields: (setter: (prev: Set<string>) => Set<string>) => void;
    legalCustomFields: Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>;
    updateLegalCustomFieldValue: (id: string, value: string) => void;
    removeLegalCustomField: (id: string) => void;
    deleteLegalCoreField: (key: string) => void;
    showLegalModal: boolean;
    newLegalFieldLabel: string;
    setNewLegalFieldLabel: React.Dispatch<React.SetStateAction<string>>;
    newLegalFieldPlaceholder: string;
    setNewLegalFieldPlaceholder: React.Dispatch<React.SetStateAction<string>>;
    newLegalFieldRequired: boolean;
    setNewLegalFieldRequired: React.Dispatch<React.SetStateAction<boolean>>;
    addLegalCustomField: () => void;
    showEditLegalModal: boolean;
    setShowEditLegalModal: React.Dispatch<React.SetStateAction<boolean>>;
    setEditingLegalLabels: React.Dispatch<React.SetStateAction<any>>;
    setEditingLegalPlaceholders: React.Dispatch<React.SetStateAction<any>>;
    saveLegalChanges: () => void;
    editingLegalCustomFields: Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>;
    setEditingLegalCustomFields: React.Dispatch<React.SetStateAction<Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>>>;
    updateEditingLegalCustomFieldLabel: (id: string, label: string) => void;
    updateEditingLegalCustomFieldPlaceholder: (id: string, placeholder: string) => void;
    removeEditingLegalCustomField: (id: string) => void;
}) {

    const hideLegalField = (fieldName: string) => {
        setHiddenLegalFields((prev: Set<string>) => new Set([...prev, fieldName]))
    }

    return (
        <>
            <div className="p-3 bg-surface-main rounded-lg border border-brand-yellow-soft">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold text-brand-gold">Legal Information (Optional)</h3>
                    <div className="flex space-x-2">
                        <button onClick={() => setShowLegalModal(true)} className="p-1 rounded hover:bg-brand-yellow-soft" title="Add New Field">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                        <button onClick={openEditLegalModal} className="p-1 rounded hover:bg-brand-yellow-soft" title="Edit Legal Information">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="space-y-2">
                    {Object.keys(editingLegalPlaceholders || editingLegalLabels || {})
                        .filter((key) => !hiddenLegalFields.has(key))
                        .map((key) => {
                            const rawLabel: any = (editingLegalLabels as any)?.[key];
                            const labelText = typeof rawLabel === 'string' ? rawLabel : (rawLabel?.label ?? key);
                            const rawPh: any = (editingLegalPlaceholders as any)?.[key];
                            const placeholderText = typeof rawPh === 'string' ? rawPh : (rawPh?.placeholder ?? '');
                            const value = String((formData as any)[key] ?? '');
                            return (
                                <div key={key} className="relative">
                                    <FormInput
                                        label={labelText}
                                        value={value}
                                        onChange={(val) => updateFormData({ [key]: val })}
                                        placeholder={placeholderText}
                                    />
                                    <div className="flex absolute top-0 right-0 space-x-1">
                                        <button
                                            onClick={() => deleteLegalCoreField(key)}
                                            className="p-1 text-status-error rounded hover:text-status-error hover:bg-status-error/10"
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
                </div>
                {legalCustomFields.length > 0 && (
                    <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            {legalCustomFields.map((field) => (
                                <div key={field.id} className="relative">
                                    <FormInput
                                        label={field.label}
                                        required={field.required}
                                        value={field.value}
                                        onChange={(value) => updateLegalCustomFieldValue(field.id, value)}
                                        placeholder={field.placeholder}
                                    />
                                    <div className="flex absolute top-0 right-0 space-x-1">
                                        <button
                                            onClick={() => removeLegalCustomField(field.id)}
                                            className="p-1 text-status-error rounded hover:text-status-error hover:bg-status-error/10"
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

            {showEditLegalModal && (
                <div className="flex fixed inset-0 z-50 justify-center items-center bg-ink bg-opacity-50">
                    <div className="p-4 mx-4 w-full max-w-lg max-h-[300px] overflow-auto bg-surface-card rounded-lg shadow-xl">
                        <h3 className="mb-4 text-lg font-bold text-ink">Edit Legal Information</h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {Array.from(new Set([
                                    ...Object.keys(editingLegalLabels || {}),
                                    ...Object.keys(editingLegalPlaceholders || {}),
                                ]))
                                    .filter((key) => !hiddenLegalFields.has(key))
                                    .map((key) => {
                                        const labelVal: any = (editingLegalLabels as any)?.[key];
                                        const phVal: any = (editingLegalPlaceholders as any)?.[key];
                                        return (
                                            <div key={key}>
                                                <label className="block mb-1 text-sm font-medium text-ink-paragraph">Name</label>
                                                <input
                                                    type="text"
                                                    value={typeof labelVal === 'string' ? labelVal : (labelVal?.label ?? '')}
                                                    onChange={(e) => setEditingLegalLabels((prev: any) => ({ ...prev, [key]: e.target.value }))}
                                                    placeholder={key}
                                                    className="px-3 py-2 w-full rounded-md border border-ink-light focus:outline-none focus:ring-2 focus:ring-brand-gold"
                                                />
                                                <label className="block mt-2 mb-1 text-sm font-medium text-ink-paragraph">Placeholder Text</label>
                                                <input
                                                    type="text"
                                                    value={typeof phVal === 'string' ? phVal : (phVal?.placeholder ?? '')}
                                                    onChange={(e) => setEditingLegalPlaceholders((prev: any) => ({ ...prev, [key]: e.target.value }))}
                                                    placeholder={key}
                                                    className="px-3 py-2 w-full rounded-md border border-ink-light focus:outline-none focus:ring-2 focus:ring-brand-gold"
                                                />
                                            </div>
                                        );
                                    })}
                            </div>
                            {editingLegalCustomFields.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="mb-3 text-sm font-semibold text-ink-paragraph">Custom Fields</h4>
                                    <div className="space-y-4">
                                        {editingLegalCustomFields.map((field) => (
                                            <div key={field.id} className="p-3 rounded-lg border border-ink-light">
                                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                    <div>
                                                        <label className="block mb-1 text-sm font-medium text-ink-paragraph">
                                                            Field Label
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={field.label}
                                                            onChange={(e) => updateEditingLegalCustomFieldLabel(field.id, e.target.value)}
                                                            placeholder="Enter field label"
                                                            className="px-3 py-2 w-full rounded-md border border-ink-light focus:outline-none focus:ring-2 focus:ring-brand-gold"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block mb-1 text-sm font-medium text-ink-paragraph">
                                                            Placeholder Text
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={field.placeholder}
                                                            onChange={(e) => updateEditingLegalCustomFieldPlaceholder(field.id, e.target.value)}
                                                            placeholder="Enter placeholder text"
                                                            className="px-3 py-2 w-full rounded-md border border-ink-light focus:outline-none focus:ring-2 focus:ring-brand-gold"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center mt-2">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.required}
                                                            onChange={(e) => {
                                                                setEditingLegalCustomFields(editingLegalCustomFields.map(f =>
                                                                    f.id === field.id ? { ...f, required: e.target.checked } : f
                                                                ));
                                                            }}
                                                            className="w-4 h-4 text-brand-gold bg-ink-light rounded border-ink-light focus:ring-brand-gold focus:ring-2"
                                                        />
                                                        <label className="ml-2 text-sm font-medium text-ink-paragraph">
                                                            Required Field
                                                        </label>
                                                    </div>
                                                    <button
                                                        onClick={() => removeEditingLegalCustomField(field.id)}
                                                        className="p-1 text-status-error rounded hover:text-status-error hover:bg-status-error/10"
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
                                onClick={() => setShowEditLegalModal(false)}
                                className="px-4 py-2 text-ink-paragraph rounded-md border border-ink-light hover:bg-ink-offwhite"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveLegalChanges}
                                className="px-4 py-2 text-white bg-brand-gold rounded-md hover:bg-brand-gold"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showLegalModal && (
                <div className="flex fixed inset-0 z-50 justify-center items-center bg-ink bg-opacity-50">
                    <div className="p-6 mx-4 w-full max-w-md max-h-[300px] overflow-auto bg-surface-card rounded-lg shadow-xl">
                        <h3 className="mb-4 text-lg font-bold text-ink">Add Legal Information Field</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-ink-paragraph">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={newLegalFieldLabel}
                                    onChange={(e) => setNewLegalFieldLabel(e.target.value)}
                                    placeholder="e.g., Legal Entity Type"
                                    className="px-3 py-2 w-full rounded-md border border-ink-light focus:outline-none focus:ring-2 focus:ring-brand-gold"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-ink-paragraph">
                                    Placeholder Text
                                </label>
                                <input
                                    type="text"
                                    value={newLegalFieldPlaceholder}
                                    onChange={(e) => setNewLegalFieldPlaceholder(e.target.value)}
                                    placeholder="e.g., Enter legal entity type"
                                    className="px-3 py-2 w-full rounded-md border border-ink-light focus:outline-none focus:ring-2 focus:ring-brand-gold"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="newLegalFieldRequired"
                                    checked={newLegalFieldRequired}
                                    onChange={(e) => setNewLegalFieldRequired(e.target.checked)}
                                    className="w-4 h-4 text-brand-gold bg-ink-light rounded border-ink-light focus:ring-brand-gold focus:ring-2"
                                />
                                <label htmlFor="newLegalFieldRequired" className="ml-2 text-sm font-medium text-ink-paragraph">
                                    Required Field
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                onClick={() => setShowLegalModal(false)}
                                className="px-4 py-2 text-ink-paragraph rounded-md border border-ink-light hover:bg-ink-offwhite"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addLegalCustomField}
                                className="px-4 py-2 text-white bg-brand-gold rounded-md hover:bg-brand-gold"
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


