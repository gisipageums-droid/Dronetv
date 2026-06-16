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


