import React, { useState } from 'react';
import { StepProps } from '../../types/form';
import { FormStep } from '../FormStep';
import CompanyInformationSection from './CompanyInformation';
import LegalInformationSection from './LegalInformation';
import DirectorInformationSection from './DirectorInformation';
import AlternativeContactSection from './AlternativeContact';
import AddressInformationSection from './AddressInformation';
import SocialMediaInformationSection from './SocialMediaInformation';

export default function Step1CompanyCategory({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isValid,
}: StepProps) {
  const categoryOptions = [
    { value: 'Drone', description: 'UAV manufacturing, services, and training' },
    { value: 'AI', description: 'Artificial intelligence solutions and products' },
    { value: 'GIS', description: 'Geographic Information Systems and GNSS/GPS/DGPS' },
  ];

  const handleCategoryChange = (selected: string[]) => {
    updateFormData({ companyCategory: selected });
  };

  const [customFields, setCustomFields] = useState<Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>>([])
  const [showAddFieldModal, setShowAddFieldModal] = useState(false)
  const [newFieldLabel, setNewFieldLabel] = useState('')
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('')
  const [newFieldRequired, setNewFieldRequired] = useState(false)
  const [isAddingField, setIsAddingField] = useState(false)
  const [isLoadingCompanyDetails, setIsLoadingCompanyDetails] = useState(false)
  const [isSavingCompanyChanges, setIsSavingCompanyChanges] = useState(false)

  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false)

  // State for editing company information (labels/placeholders only; values managed in formData)
  const [editingCompanyLabels, setEditingCompanyLabels] = useState<Record<string, string>>({
    companyName: '',
    yearEstablished: '',
    websiteUrl: '',
    promoCode: ''
  })
  const [editingCompanyPlaceholders, setEditingCompanyPlaceholders] = useState<Record<string, string>>({
    companyName: '',
    yearEstablished: '',
    websiteUrl: '',
    promoCode: ''
  })

  // State for editing custom fields
  const [editingCustomFields, setEditingCustomFields] = useState<Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>>([])

  // State for editing legal custom fields
  const [editingLegalCustomFields, setEditingLegalCustomFields] = useState<Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>>([])

  // State for editing director custom fields
  const [editingDirectorCustomFields, setEditingDirectorCustomFields] = useState<Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>>([])

  // State for editing alt contact custom fields
  const [editingAltContactCustomFields, setEditingAltContactCustomFields] = useState<Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>>([])

  // State for editing address custom fields
  const [editingAddressCustomFields, setEditingAddressCustomFields] = useState<Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>>([])

  // State for editing social media custom fields
  const [editingSocialMediaCustomFields, setEditingSocialMediaCustomFields] = useState<Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>>([])

  // Track which core company keys are present in API so we render only those
  const [apiCompanyKeys, setApiCompanyKeys] = useState<Set<string>>(new Set())

  // State for tracking social media API data
  const [socialMediaApiData, setSocialMediaApiData] = useState<any>(null)

  // Function to refresh data from API
  const refreshDataFromAPI = async () => {
    setIsLoadingCompanyDetails(true);

    try {
      // Load data from details API
      const response = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/details/123456789', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        // console.log('🔍 Refresh API Response:', data);

        if (data.success && data.item && data.item.data) {
          const apiData = data.item.data;
          // console.log('🔍 Refresh API Data:', apiData);
          const ci = Array.isArray(apiData.companyInfo) ? (apiData.companyInfo[0] || {}) : (apiData.companyInfo || {});
          if (Array.isArray(apiData.companyInfo)) {
            const labelsMap: any = {};
            if (ci.companyLabels && typeof ci.companyLabels === 'object') {
              Object.keys(ci.companyLabels).forEach((key) => {
                const v: any = (ci.companyLabels as any)[key];
                labelsMap[key] = typeof v === 'string' ? v : (v?.label ?? '');
              });
            }
            setEditingCompanyLabels(labelsMap);

            const placeholdersMap: any = {};
            if (ci.companyPlaceholders && typeof ci.companyPlaceholders === 'object') {
              Object.keys(ci.companyPlaceholders).forEach((key) => {
                const v: any = (ci.companyPlaceholders as any)[key];
                placeholdersMap[key] = typeof v === 'string' ? v : (v?.placeholder ?? '');
              });
            }
            setEditingCompanyPlaceholders(placeholdersMap);

            const present = new Set<string>([
              ...Object.keys(labelsMap || {}),
              ...Object.keys(placeholdersMap || {}),
            ]);
            if (present.size > 0) setApiCompanyKeys(present);

            if (Array.isArray(ci.hiddenFields)) {
              setHiddenCompanyFields(new Set(ci.hiddenFields));
            }

            if (Array.isArray(ci.customFields) && ci.customFields.length > 0 && typeof ci.customFields[0] === 'object') {
              const obj: any = ci.customFields[0] || {};
              const arr = Object.values(obj);
              if (Array.isArray(arr)) setCustomFields(arr as any);
            } else if (ci.customFields && typeof ci.customFields === 'object') {
              const arr = Object.values(ci.customFields);
              setCustomFields(arr as any);
            }
          }

          // ---- Parse Legal Information from API ----
          const li = Array.isArray(apiData.legalInfo) ? (apiData.legalInfo[0] || {}) : (apiData.legalInfo || {});
          if (li && typeof li === 'object') {
            // Flatten legal labels (support string or { label })
            if (li.legalLabels && typeof li.legalLabels === 'object') {
              const legalLabelsMap: any = {};
              Object.keys(li.legalLabels).forEach((key) => {
                const v: any = (li.legalLabels as any)[key];
                legalLabelsMap[key] = typeof v === 'string' ? v : (v?.label ?? '');
              });
              setEditingLegalLabels(legalLabelsMap);
            }
            // Flatten legal placeholders (support string or { placeholder })
            if (li.legalPlaceholders && typeof li.legalPlaceholders === 'object') {
              const legalPlaceholdersMap: any = {};
              Object.keys(li.legalPlaceholders).forEach((key) => {
                const v: any = (li.legalPlaceholders as any)[key];
                legalPlaceholdersMap[key] = typeof v === 'string' ? v : (v?.placeholder ?? '');
              });
              setEditingLegalPlaceholders(legalPlaceholdersMap);
            }
            // Hidden legal fields
            if (Array.isArray(li.hiddenFields)) {
              setHiddenLegalFields(new Set(li.hiddenFields));
            }
            // Custom fields
            if (Array.isArray(li.legalCustomFields) && li.legalCustomFields.length > 0 && typeof li.legalCustomFields[0] === 'object') {
              const obj: any = li.legalCustomFields[0] || {};
              const arr = Object.values(obj);
              if (Array.isArray(arr)) setLegalCustomFields(arr as any);
            } else if (li.legalCustomFields && typeof li.legalCustomFields === 'object') {
              const arr = Object.values(li.legalCustomFields);
              setLegalCustomFields(arr as any);
            }
          }

          // ---- Parse Director/MD Information from API ----
          const di = Array.isArray(apiData.directorInfo) ? (apiData.directorInfo[0] || {}) : (apiData.directorInfo || {});
          if (di && typeof di === 'object') {
            if (di.directorLabels && typeof di.directorLabels === 'object') {
              const map: any = {};
              Object.keys(di.directorLabels).forEach((key) => {
                const v: any = (di.directorLabels as any)[key];
                map[key] = typeof v === 'string' ? v : (v?.label ?? '');
              });
              setEditingDirectorLabels(map);
            }
            if (di.directorPlaceholders && typeof di.directorPlaceholders === 'object') {
              const map: any = {};
              Object.keys(di.directorPlaceholders).forEach((key) => {
                const v: any = (di.directorPlaceholders as any)[key];
                map[key] = typeof v === 'string' ? v : (v?.placeholder ?? '');
              });
              setEditingDirectorPlaceholders(map);
            }
            if (Array.isArray(di.directorCustomFields) && di.directorCustomFields.length > 0 && typeof di.directorCustomFields[0] === 'object') {
              const obj: any = di.directorCustomFields[0] || {};
              const arr = Object.values(obj);
              if (Array.isArray(arr)) setDirectorCustomFields(arr as any);
            } else if (di.directorCustomFields && typeof di.directorCustomFields === 'object') {
              const arr = Object.values(di.directorCustomFields);
              setDirectorCustomFields(arr as any);
            }
          }

          // ---- Parse Alternative Contact from API ----
          const ac = Array.isArray(apiData.altContact) ? (apiData.altContact[0] || {}) : (apiData.altContact || {});
          if (ac && typeof ac === 'object') {
            if (ac.altContactLabels && typeof ac.altContactLabels === 'object') {
              const map: any = {};
              Object.keys(ac.altContactLabels).forEach((key) => {
                const v: any = (ac.altContactLabels as any)[key];
                map[key] = typeof v === 'string' ? v : (v?.label ?? '');
              });
              setEditingAltContactLabels(map);
            }
            if (ac.altContactPlaceholders && typeof ac.altContactPlaceholders === 'object') {
              const map: any = {};
              Object.keys(ac.altContactPlaceholders).forEach((key) => {
                const v: any = (ac.altContactPlaceholders as any)[key];
                map[key] = typeof v === 'string' ? v : (v?.placeholder ?? '');
              });
              setEditingAltContactPlaceholders(map);
            }
            if (Array.isArray(ac.altContactCustomFields) && ac.altContactCustomFields.length > 0 && typeof ac.altContactCustomFields[0] === 'object') {
              const obj: any = ac.altContactCustomFields[0] || {};
              const arr = Object.values(obj);
              if (Array.isArray(arr)) setAltContactCustomFields(arr as any);
            } else if (ac.altContactCustomFields && typeof ac.altContactCustomFields === 'object') {
              const arr = Object.values(ac.altContactCustomFields);
              setAltContactCustomFields(arr as any);
            }
          }

          // ---- Parse Address Information from API ----
          const addr = Array.isArray(apiData.address) ? (apiData.address[0] || {}) : (apiData.address || {});
          if (addr && typeof addr === 'object') {
            if (addr.addressLabels && typeof addr.addressLabels === 'object') {
              const map: any = {};
              Object.keys(addr.addressLabels).forEach((key) => {
                const v: any = (addr.addressLabels as any)[key];
                map[key] = typeof v === 'string' ? v : (v?.label ?? '');
              });
              setEditingAddressLabels(map);
            }
            if (addr.addressPlaceholders && typeof addr.addressPlaceholders === 'object') {
              const map: any = {};
              Object.keys(addr.addressPlaceholders).forEach((key) => {
                const v: any = (addr.addressPlaceholders as any)[key];
                map[key] = typeof v === 'string' ? v : (v?.placeholder ?? '');
              });
              setEditingAddressPlaceholders(map);
            }
            if (Array.isArray(addr.addressCustomFields) && addr.addressCustomFields.length > 0 && typeof addr.addressCustomFields[0] === 'object') {
              const obj: any = addr.addressCustomFields[0] || {};
              const arr = Object.values(obj);
              if (Array.isArray(arr)) setAddressCustomFields(arr as any);
            } else if (addr.addressCustomFields && typeof addr.addressCustomFields === 'object') {
              const arr = Object.values(addr.addressCustomFields);
              setAddressCustomFields(arr as any);
            }
          }

          // ---- Parse Social Media from API ----
          const sm = Array.isArray(apiData.socialMedia) ? (apiData.socialMedia[0] || {}) : (apiData.socialMedia || {});
          if (sm && typeof sm === 'object') {
            // ✅ Store complete social media data for SocialMediaInformation component
            setSocialMediaApiData(sm);

            if (sm.socialMediaLabels && typeof sm.socialMediaLabels === 'object') {
              const map: any = {};
              Object.keys(sm.socialMediaLabels).forEach((key) => {
                const v: any = (sm.socialMediaLabels as any)[key];
                map[key] = typeof v === 'string' ? v : (v?.label ?? '');
              });
              setEditingSocialMediaLabels(map);
            }
            if (sm.socialMediaPlaceholders && typeof sm.socialMediaPlaceholders === 'object') {
              const map: any = {};
              Object.keys(sm.socialMediaPlaceholders).forEach((key) => {
                const v: any = (sm.socialMediaPlaceholders as any)[key];
                map[key] = typeof v === 'string' ? v : (v?.placeholder ?? '');
              });
              setEditingSocialMediaPlaceholders(map);
            }
            if (Array.isArray(sm.socialMediaCustomFields) && sm.socialMediaCustomFields.length > 0 && typeof sm.socialMediaCustomFields[0] === 'object') {
              const obj: any = sm.socialMediaCustomFields[0] || {};
              const arr = Object.values(obj);
              if (Array.isArray(arr)) setSocialMediaCustomFields(arr as any);
            } else if (sm.socialMediaCustomFields && typeof sm.socialMediaCustomFields === 'object') {
              const arr = Object.values(sm.socialMediaCustomFields);
              setSocialMediaCustomFields(arr as any);
            }
          }

          // Load core field values from details (top-level) and map to our formData
          const valuesUpdate: any = {};
          if (apiData.companyName !== undefined) valuesUpdate.companyName = String(apiData.companyName ?? '');
          if (apiData.websiteUrl !== undefined) valuesUpdate.websiteUrl = String(apiData.websiteUrl ?? '');
          if (apiData.promoCode !== undefined) valuesUpdate.promoCode = String(apiData.promoCode ?? '');
          if (apiData.dateOfIncorporation !== undefined) valuesUpdate.yearEstablished = String(apiData.dateOfIncorporation ?? '');
          if (apiData.yearEstablished !== undefined) valuesUpdate.yearEstablished = String(apiData.yearEstablished ?? '');
          if (apiData.altContactName !== undefined) valuesUpdate.altContactName = String(apiData.altContactName ?? '');
          if (apiData.altContactPhone !== undefined) valuesUpdate.altContactPhone = String(apiData.altContactPhone ?? '');
          if (apiData.altContactEmail !== undefined) valuesUpdate.altContactEmail = String(apiData.altContactEmail ?? '');
          if (Object.keys(valuesUpdate).length > 0) {
            updateFormData(valuesUpdate);
          }

          // Note: company labels/placeholders were already flattened above using ci; avoid overriding here

          // Also handle fieldData structure for custom fields
          if (apiData.fieldData) {
            console.log('🔍 FieldData found for custom field:', apiData.fieldData);
            // This is a custom field, add it to custom fields
            const customField = {
              id: apiData.fieldData.id || Date.now().toString(),
              label: apiData.fieldData.label || 'Custom Field',
              placeholder: apiData.fieldData.placeholder || 'Enter value',
              value: apiData.fieldData.value || '',
              required: apiData.fieldData.required || false
            };

            // Add to custom fields if not already present
            setCustomFields(prev => {
              const exists = prev.some(field => field.id === customField.id);
              if (!exists) {
                return [...prev, customField];
              }
              return prev;
            });
          }

          // console.log('✅ Form data refreshed from details API');
        } else {
          // console.log('⚠️ No item found in refresh API response');
        }
      } else {
        console.error('Failed to fetch refresh data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching refresh data:', error);
    } finally {
      setIsLoadingCompanyDetails(false);
    }
  };

  // Load placeholders and labels from localStorage on component mount
  React.useEffect(() => {
    // console.log('🔄 useEffect triggered, current formData:', formData);

    // Set loading state to true initially
    setIsLoadingCompanyDetails(true);
    // console.log('🔄 Loading state set to true');

    // Load data from view API
    const loadViewData = async () => {
      try {
        const response = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/view', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          // console.log('🔍 View API Response:', data);

          if (data.success && data.items && data.items.length > 0) {
            const item = data.items[0];
            // console.log('🔍 First Item:', item);

            // Check different possible data structures
            const companyInfo = item.data?.companyInfo;
            const fieldData = item.data?.fieldData;
            const companyName = item.data?.companyName;

            // console.log('🔍 Company Info:', companyInfo);
            // console.log('🔍 Field Data:', fieldData);
            // console.log('🔍 Company Name:', companyName);

            // Try to get labels from different structures
            let labels: Record<string, any> | null = null;

            if (companyInfo && companyInfo.companyLabels) {
              labels = companyInfo.companyLabels;
              // console.log('🔍 Labels from companyInfo:', labels);
            } else if (fieldData && fieldData.companyLabels) {
              labels = fieldData.companyLabels;
              // console.log('🔍 Labels from fieldData:', labels);
            } else if (companyName && companyName.companyLabels) {
              labels = companyName.companyLabels;
              // console.log('🔍 Labels from companyName:', labels);
            }

            if (labels) {
              // console.log('🔍 Company Labels Found:', labels);

              // Process labels to extract actual string values from nested objects
              const processedLabels: Record<string, string> = {};
              Object.keys(labels).forEach(key => {
                const labelValue = labels[key];
                if (typeof labelValue === 'string') {
                  processedLabels[key] = labelValue;
                } else if (labelValue && typeof labelValue === 'object' && labelValue.label) {
                  processedLabels[key] = labelValue.label;
                }
              });

              // Check if processed labels are not empty
              const hasValidLabels = Object.values(processedLabels).some(label => label && label.trim() !== '');

              if (hasValidLabels) {
                // Update company labels with processed API data
                setEditingCompanyLabels(processedLabels);
                console.log('✅ Company Labels loaded from API:', processedLabels);

                // Also update form data with existing values if available
                const formDataUpdate: Record<string, any> = {};
                if (companyInfo && companyInfo.companyCustomFields) {
                  Object.keys(processedLabels).forEach(key => {
                    if (companyInfo.companyCustomFields[key]) {
                      formDataUpdate[key] = companyInfo.companyCustomFields[key];
                    }
                  });
                }
                if (Object.keys(formDataUpdate).length > 0) {
                  updateFormData(formDataUpdate);
                }
              } else {
                console.log('⚠️ Company labels are empty, will use details API data');
              }
            } else {
              console.log('⚠️ No company labels found in API response');
              console.log('🔍 Available keys in item.data:', item.data ? Object.keys(item.data) : 'No data');
            }

            // Handle fieldData structure for custom fields
            if (fieldData && fieldData.id) {
              console.log('🔍 FieldData found for custom field:', fieldData);
              // This is a custom field, add it to custom fields
              const customField = {
                id: fieldData.id || Date.now().toString(),
                label: fieldData.label || 'Custom Field',
                placeholder: fieldData.placeholder || 'Enter value',
                value: fieldData.value || '',
                required: fieldData.required || false
              };

              // Add to custom fields if not already present
              setCustomFields(prev => {
                const exists = prev.some(field => field.id === customField.id);
                if (!exists) {
                  return [...prev, customField];
                }
                return prev;
              });
            }
          } else {
            // console.log('⚠️ No items found in API response');
          }
        } else {
          console.error('Failed to fetch view data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching view data:', error);
      }
    };

    // Call the view API
    loadViewData();

    // Load data from details API
    const loadDetailsData = async () => {
      try {
        const response = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/details/123456789', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          // console.log('🔍 Details API Response:', data);

          if (data.success && data.item && data.item.data) {
            const apiData = data.item.data;
            // console.log('🔍 Details API Data:', apiData);

            // Update labels and placeholders from companyInfo structure
            let labels = null;
            let placeholders = null;
            let formDataUpdate = {};

            if (apiData.companyInfo) {
              const ci0 = Array.isArray(apiData.companyInfo) ? (apiData.companyInfo[0] || {}) : apiData.companyInfo;
              if (ci0.companyLabels && typeof ci0.companyLabels === 'object') {
                const mapped: any = {};
                Object.keys(ci0.companyLabels).forEach((k) => {
                  const v: any = (ci0.companyLabels as any)[k];
                  mapped[k] = typeof v === 'string' ? v : (v?.label ?? '');
                });
                labels = mapped;
              }

              if (ci0.companyPlaceholders && typeof ci0.companyPlaceholders === 'object') {
                const mapped: any = {};
                Object.keys(ci0.companyPlaceholders).forEach((k) => {
                  const v: any = (ci0.companyPlaceholders as any)[k];
                  mapped[k] = typeof v === 'string' ? v : (v?.placeholder ?? '');
                });
                placeholders = mapped;
              }
            }

            // Update labels and placeholders if found
            if (labels) {
              setEditingCompanyLabels(labels);
              console.log('✅ Labels set:', labels);
            }

            if (placeholders) {
              setEditingCompanyPlaceholders(placeholders);
              console.log('✅ Placeholders set:', placeholders);
            }

            // Update form data if found
            if (Object.keys(formDataUpdate).length > 0) {
              updateFormData(formDataUpdate);
              console.log('✅ Form data updated:', formDataUpdate);
              console.log('🔍 Form data update completed');
            }

            console.log('✅ Form data loaded from details API on refresh');
          } else {
            // console.log('⚠️ No item found in details API response');
          }
        } else {
          console.error('Failed to fetch details data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching details data:', error);
      } finally {
        setIsLoadingCompanyDetails(false);
        // console.log('🔄 Loading state set to false');
        // console.log('✅ Data loading completed');
      }
    };

    // Call the details API
    loadDetailsData();

    // Ensure defaults exist so inputs render even if APIs didn't provide labels/placeholders
    if (!editingCompanyLabels || Object.keys(editingCompanyLabels).length === 0) {
      setEditingCompanyLabels({
        companyName: 'Company Name',
        yearEstablished: 'Date of Incorporation',
        websiteUrl: 'Website URL',
        promoCode: 'Promotional Code'
      });
    }
    if (!editingCompanyPlaceholders || Object.keys(editingCompanyPlaceholders).length === 0) {
      setEditingCompanyPlaceholders({
        companyName: 'Enter your company name',
        yearEstablished: 'dd-mm-yyyy',
        websiteUrl: 'https://www.yourcompany.com',
        promoCode: 'Enter promotional code'
      });
    }

    // after existing loadViewData() and loadDetailsData() calls inside useEffect
    // ensure we refresh from the details endpoint once more so core values / labels always populate
    (async () => {
      try {
        await refreshDataFromAPI(); // re-use existing function that sets editingCompanyLabels/placeholders and updateFormData
        console.log('✅ Initial refreshDataFromAPI completed on mount');
      } catch (e) {
        console.warn('Initial refresh failed', e);
      }
    })();

    // Load custom fields from localStorage on component mount
    // No localStorage for legal custom fields; rely on API

    // No localStorage for director custom fields; rely on API

    // No localStorage for alt contact custom fields; rely on API

    // No localStorage for address custom fields; rely on API

    // No localStorage for social media custom fields; rely on API

    // Do not use localStorage for any section; rely on API + sensible defaults handled in UI.
  }, []); // Run only on component mount to load fresh data from API

  // State for editable companyNames
  const [legalCustomFields, setLegalCustomFields] = useState<Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>>([])
  const [showLegalModal, setShowLegalModal] = useState(false)
  const [newLegalFieldLabel, setNewLegalFieldLabel] = useState('')
  const [newLegalFieldPlaceholder, setNewLegalFieldPlaceholder] = useState('')
  const [newLegalFieldRequired, setNewLegalFieldRequired] = useState(false)

  const [directorCustomFields, setDirectorCustomFields] = useState<Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>>([])
  const [showDirectorModal, setShowDirectorModal] = useState(false)
  const [newDirectorFieldLabel, setNewDirectorFieldLabel] = useState('')
  const [newDirectorFieldPlaceholder, setNewDirectorFieldPlaceholder] = useState('')
  const [newDirectorFieldRequired, setNewDirectorFieldRequired] = useState(false)

  const [altContactCustomFields, setAltContactCustomFields] = useState<Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>>([])
  const [showAltContactModal, setShowAltContactModal] = useState(false)
  const [newAltContactFieldLabel, setNewAltContactFieldLabel] = useState('')
  const [newAltContactFieldPlaceholder, setNewAltContactFieldPlaceholder] = useState('')
  const [newAltContactFieldRequired, setNewAltContactFieldRequired] = useState(false)

  const [addressCustomFields, setAddressCustomFields] = useState<Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>>([])
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [newAddressFieldLabel, setNewAddressFieldLabel] = useState('')
  const [newAddressFieldPlaceholder, setNewAddressFieldPlaceholder] = useState('')
  const [newAddressFieldRequired, setNewAddressFieldRequired] = useState(false)

  const [socialMediaCustomFields, setSocialMediaCustomFields] = useState<Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>>([])
  const [showSocialMediaModal, setShowSocialMediaModal] = useState(false)
  const [newSocialMediaFieldLabel, setNewSocialMediaFieldLabel] = useState('')
  const [newSocialMediaFieldPlaceholder, setNewSocialMediaFieldPlaceholder] = useState('')
  const [newSocialMediaFieldRequired, setNewSocialMediaFieldRequired] = useState(false)

  // State for editing legal information
  const [showEditLegalModal, setShowEditLegalModal] = useState(false)
  const [editingLegalLabels, setEditingLegalLabels] = useState({
    legalName: 'Legal Company Name',
    gstin: 'GSTIN',
    operatingHours: 'Operating Hours',
    cin: 'CIN',
    udyam: 'UDYAM',
    pan: 'PAN'
  })
  const [editingLegalPlaceholders, setEditingLegalPlaceholders] = useState({
    legalName: 'If different from brand name',
    gstin: 'GST number',
    operatingHours: 'Mon-Sat 10:00-18:00',
    cin: 'Corporate Identity Number',
    udyam: 'UDYAM Registration Number',
    pan: 'PAN Number'
  })

  // State for editing director information
  const [showEditDirectorModal, setShowEditDirectorModal] = useState(false)
  const [editingDirectorLabels, setEditingDirectorLabels] = useState({
    directorName: 'Director Name',
    directorPhone: 'Director Phone',
    directorEmail: 'Director Email'
  })
  const [editingDirectorPlaceholders, setEditingDirectorPlaceholders] = useState({
    directorName: 'Full name',
    directorPhone: '+91XXXXXXXXXX',
    directorEmail: 'director@company.com'
  })

  // State for editing alternative contact information
  const [showEditAltContactModal, setShowEditAltContactModal] = useState(false)
  const [editingAltContactLabels, setEditingAltContactLabels] = useState({
    altContactName: 'Contact Person Name',
    altContactPhone: 'Contact Phone',
    altContactEmail: 'Contact Email'
  })
  const [editingAltContactPlaceholders, setEditingAltContactPlaceholders] = useState({
    altContactName: 'Full name',
    altContactPhone: '+91XXXXXXXXXX',
    altContactEmail: 'contact@company.com'
  })

  // State for editing address information
  const [showEditAddressModal, setShowEditAddressModal] = useState(false)
  const [editingAddressLabels, setEditingAddressLabels] = useState({
    officeAddress: 'Office Address',
    country: 'Country',
    state: 'State',
    city: 'City',
    postalCode: 'Postal Code'
  })
  const [editingAddressPlaceholders, setEditingAddressPlaceholders] = useState({
    officeAddress: 'Complete office address',
    country: 'Select Country',
    state: 'Select State',
    city: 'City',
    postalCode: 'PIN Code'
  })

  // State for editing social media information
  const [showEditSocialMediaModal, setShowEditSocialMediaModal] = useState(false)
  const [editingSocialMediaLabels, setEditingSocialMediaLabels] = useState({
    linkedin: 'LinkedIn Profile',
    facebook: 'Facebook Page',
    instagram: 'Instagram Profile',
    twitter: 'Twitter/X Profile',
    youtube: 'YouTube Channel',
    supportEmail: 'Support Email',
    supportContactNumber: 'Support Contact Number',
    whatsappNumber: 'WhatsApp Number'
  })
  const [editingSocialMediaPlaceholders, setEditingSocialMediaPlaceholders] = useState({
    linkedin: 'https://linkedin.com/company/yourcompany',
    facebook: 'https://facebook.com/yourcompany',
    instagram: 'https://instagram.com/yourcompany',
    twitter: 'https://twitter.com/yourcompany',
    youtube: 'https://youtube.com/@yourcompany',
    supportEmail: 'support@company.com',
    supportContactNumber: '+919876543210',
    whatsappNumber: '+91XXXXXXXXXX'
  })

  // State for managing hidden default fields
  const [hiddenCompanyFields, setHiddenCompanyFields] = useState<Set<string>>(new Set())
  const [hiddenLegalFields, setHiddenLegalFields] = useState<Set<string>>(new Set())
  const [hiddenDirectorFields, setHiddenDirectorFields] = useState<Set<string>>(new Set())
  const [hiddenAltContactFields, setHiddenAltContactFields] = useState<Set<string>>(new Set())
  const [hiddenAddressFields, setHiddenAddressFields] = useState<Set<string>>(new Set())
  const [hiddenSocialMediaFields, setHiddenSocialMediaFields] = useState<Set<string>>(new Set())

  const addCustomField = async () => {
    if (newFieldLabel.trim() && newFieldPlaceholder.trim()) {
      setIsAddingField(true);

      const newField = {
        id: Date.now().toString(),
        label: newFieldLabel.trim(),
        placeholder: newFieldPlaceholder.trim(),
        value: '',
        required: newFieldRequired
      };

      try {
        // API call to save the new field using new endpoint
        const response = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/add-field', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sectionKey: 'companyInfo',
            customFieldsKey: 'customFields',
            newField: {
              ...newField,
              fieldType: 'custom'
            }
          })
        });

        if (response.ok) {
          // If API call is successful, refresh data from API
          await refreshDataFromAPI();

          // Clear form and close modal
          setNewFieldLabel('');
          setNewFieldPlaceholder('');
          setNewFieldRequired(false);
          setShowAddFieldModal(false);

          console.log('✅ Custom field added successfully');
        } else {
          console.error('Failed to save field:', response.statusText);
          alert('Failed to save field. Please try again.');
        }
      } catch (error) {
        console.error('Error saving field:', error);
        alert('Error saving field. Please try again.');
      } finally {
        setIsAddingField(false);
      }
    }
  };



  const updateCustomFieldValue = (id: string, value: string) => {
    const updatedFields = customFields.map(field =>
      field.id === id ? { ...field, value } : field
    );
    setCustomFields(updatedFields);
  };

  const removeCustomField = (id: string) => {
    // optimistic remove
    const previous = customFields;
    const optimistic = customFields.filter(field => field.id !== id);
    setCustomFields(optimistic);

    fetch(`https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(async (res) => {
        let data: any = null;
        try { data = await res.json(); } catch { }
        if (!res.ok || data?.success === false) {
          throw new Error((data && data.message) || res.statusText || 'Delete failed');
        }
        try { await refreshDataFromAPI(); } catch { }
      })
      .catch((err) => {
        console.error('Delete custom field failed:', err);
        setCustomFields(previous);
        alert('Failed to delete field');
      });
  };

  const deleteCoreField = async (key: 'companyName' | 'yearEstablished' | 'websiteUrl' | 'promoCode') => {
    try {
      const apiKey = key === 'yearEstablished' ? 'dateOfIncorporation' : key;
      const res = await fetch(`https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/delete-core-field/${apiKey}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      // if route missing, optimistically hide
      if (res.status === 404) {
        setHiddenCompanyFields(prev => new Set([...prev, key]));
        return;
      }
      let data: any = null;
      try { data = await res.json(); } catch { }
      if (!res.ok || data?.success === false) {
        throw new Error((data && data.message) || res.statusText || 'Delete failed');
      }
      setHiddenCompanyFields(prev => new Set([...prev, key]));
      try { await refreshDataFromAPI(); } catch { }
    } catch (e) {
      console.error('Delete core field failed:', e);
      // fallback: hide on UI so it's consistent
      setHiddenCompanyFields(prev => new Set([...prev, key]));
    }
  };

  // Delete a core Legal field by key using backend API; hide on UI as fallback
  const deleteLegalCoreField = async (key: string) => {
    try {
      const res = await fetch(`https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/delete-core-field/${key}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.status === 404) {
        setHiddenLegalFields(prev => new Set([...prev, key]));
        try { await refreshDataFromAPI(); } catch { }
        return;
      }
      let data: any = null;
      try { data = await res.json(); } catch { }
      if (!res.ok || data?.success === false) {
        throw new Error((data && data.message) || res.statusText || 'Delete failed');
      }
      setHiddenLegalFields(prev => new Set([...prev, key]));
      setEditingLegalLabels((prev: any) => {
        if (!prev) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setEditingLegalPlaceholders((prev: any) => {
        if (!prev) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
      try { await refreshDataFromAPI(); } catch { }
    } catch (e) {
      console.error('Delete legal core field failed:', e);
      setHiddenLegalFields(prev => new Set([...prev, key]));
    }
  };

  // Functions for editing custom fields in modal
  const updateEditingCustomFieldLabel = (id: string, label: string) => {
    setEditingCustomFields(editingCustomFields.map(field =>
      field.id === id ? { ...field, label } : field
    ));
  };

  const updateEditingCustomFieldPlaceholder = (id: string, placeholder: string) => {
    setEditingCustomFields(editingCustomFields.map(field =>
      field.id === id ? { ...field, placeholder } : field
    ));
  };

  const removeEditingCustomField = (id: string) => {
    // Optimistically remove from both modal editing list and main list
    const previousEditing = editingCustomFields;
    const previousMain = customFields;
    const optimisticEditing = editingCustomFields.filter(field => field.id !== id);
    const optimisticMain = customFields.filter(field => field.id !== id);
    setEditingCustomFields(optimisticEditing);
    setCustomFields(optimisticMain);

    fetch(`https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(async (res) => {
        let data: any = null;
        try { data = await res.json(); } catch { }
        if (!res.ok || data?.success === false) {
          throw new Error((data && data.message) || res.statusText || 'Delete failed');
        }
        try { await refreshDataFromAPI(); } catch { }
      })
      .catch((err) => {
        console.error('Delete custom field (modal) failed:', err);
        // Roll back
        setEditingCustomFields(previousEditing);
        setCustomFields(previousMain);
        alert('Failed to delete field');
      });
  };

  // Functions for editing legal custom fields in modal
  const updateEditingLegalCustomFieldLabel = (id: string, label: string) => {
    setEditingLegalCustomFields(editingLegalCustomFields.map(field =>
      field.id === id ? { ...field, label } : field
    ));
  };

  const updateEditingLegalCustomFieldPlaceholder = (id: string, placeholder: string) => {
    setEditingLegalCustomFields(editingLegalCustomFields.map(field =>
      field.id === id ? { ...field, placeholder } : field
    ));
  };

  const removeEditingLegalCustomField = (id: string) => {
    const prevEditing = editingLegalCustomFields;
    const prevMain = legalCustomFields;
    const optimisticEditing = editingLegalCustomFields.filter(field => field.id !== id);
    const optimisticMain = legalCustomFields.filter(field => field.id !== id);
    setEditingLegalCustomFields(optimisticEditing);
    setLegalCustomFields(optimisticMain);

    fetch(`https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(async (res) => {
        let data: any = null;
        try { data = await res.json(); } catch { }
        if (!res.ok || data?.success === false) {
          throw new Error((data && data.message) || res.statusText || 'Delete failed');
        }
        try { await refreshDataFromAPI(); } catch { }
      })
      .catch((err) => {
        console.error('Delete legal custom field (modal) failed:', err);
        setEditingLegalCustomFields(prevEditing);
        setLegalCustomFields(prevMain);
        alert('Failed to delete legal field');
      });
  };

  // Functions for editing director custom fields in modal
  const updateEditingDirectorCustomFieldLabel = (id: string, label: string) => {
    setEditingDirectorCustomFields(editingDirectorCustomFields.map(field =>
      field.id === id ? { ...field, label } : field
    ));
  };

  const updateEditingDirectorCustomFieldPlaceholder = (id: string, placeholder: string) => {
    setEditingDirectorCustomFields(editingDirectorCustomFields.map(field =>
      field.id === id ? { ...field, placeholder } : field
    ));
  };

  const removeEditingDirectorCustomField = (id: string) => {
    const prevEditing = editingDirectorCustomFields;
    const prevMain = directorCustomFields;
    const optimisticEditing = editingDirectorCustomFields.filter(field => field.id !== id);
    const optimisticMain = directorCustomFields.filter(field => field.id !== id);
    setEditingDirectorCustomFields(optimisticEditing);
    setDirectorCustomFields(optimisticMain);

    fetch(`https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(async (res) => {
        if (!res.ok) {
          await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fieldPath: `directorInfo.directorCustomFields.${id}`, label: null })
          }).catch(() => { });
        }
        try { await refreshDataFromAPI(); } catch { }
      })
      .catch((err) => {
        console.error('Delete director custom field (modal) failed:', err);
        setEditingDirectorCustomFields(prevEditing);
        setDirectorCustomFields(prevMain);
        alert('Failed to delete Director field');
      });
  };

  // Functions for editing alt contact custom fields in modal
  const updateEditingAltContactCustomFieldLabel = (id: string, label: string) => {
    setEditingAltContactCustomFields(editingAltContactCustomFields.map(field =>
      field.id === id ? { ...field, label } : field
    ));
  };

  const updateEditingAltContactCustomFieldPlaceholder = (id: string, placeholder: string) => {
    setEditingAltContactCustomFields(editingAltContactCustomFields.map(field =>
      field.id === id ? { ...field, placeholder } : field
    ));
  };

  const removeEditingAltContactCustomField = (id: string) => {
    const prevEditing = editingAltContactCustomFields;
    const prevMain = altContactCustomFields;
    const optimisticEditing = editingAltContactCustomFields.filter(field => field.id !== id);
    const optimisticMain = altContactCustomFields.filter(field => field.id !== id);
    setEditingAltContactCustomFields(optimisticEditing);
    setAltContactCustomFields(optimisticMain);

    fetch(`https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(async (res) => {
        if (!res.ok) {
          await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fieldPath: `altContact.altContactCustomFields.${id}`, label: null })
          }).catch(() => { });
        }
        try { await refreshDataFromAPI(); } catch { }
      })
      .catch((err) => {
        console.error('Delete alternative contact custom field (modal) failed:', err);
        setEditingAltContactCustomFields(prevEditing);
        setAltContactCustomFields(prevMain);
        alert('Failed to delete Alternative Contact field');
      });
  };

  // Functions for editing address custom fields in modal
  const updateEditingAddressCustomFieldLabel = (id: string, label: string) => {
    setEditingAddressCustomFields(editingAddressCustomFields.map(field =>
      field.id === id ? { ...field, label } : field
    ));
  };

  const updateEditingAddressCustomFieldPlaceholder = (id: string, placeholder: string) => {
    setEditingAddressCustomFields(editingAddressCustomFields.map(field =>
      field.id === id ? { ...field, placeholder } : field
    ));
  };

  const removeEditingAddressCustomField = (id: string) => {
    const prevEditing = editingAddressCustomFields;
    const prevMain = addressCustomFields;
    const optimisticEditing = editingAddressCustomFields.filter(field => field.id !== id);
    const optimisticMain = addressCustomFields.filter(field => field.id !== id);
    setEditingAddressCustomFields(optimisticEditing);
    setAddressCustomFields(optimisticMain);

    fetch(`https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(async (res) => {
        if (!res.ok) {
          await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fieldPath: `address.addressCustomFields.${id}`, label: null })
          }).catch(() => { });
        }
        try { await refreshDataFromAPI(); } catch { }
      })
      .catch((err) => {
        console.error('Delete address custom field (modal) failed:', err);
        setEditingAddressCustomFields(prevEditing);
        setAddressCustomFields(prevMain);
        alert('Failed to delete Address field');
      });
  };

  // Functions for editing social media custom fields in modal
  const updateEditingSocialMediaCustomFieldLabel = (id: string, label: string) => {
    setEditingSocialMediaCustomFields(editingSocialMediaCustomFields.map(field =>
      field.id === id ? { ...field, label } : field
    ));
  };

  const updateEditingSocialMediaCustomFieldPlaceholder = (id: string, placeholder: string) => {
    setEditingSocialMediaCustomFields(editingSocialMediaCustomFields.map(field =>
      field.id === id ? { ...field, placeholder } : field
    ));
  };

  const removeEditingSocialMediaCustomField = (id: string) => {
    const prevEditing = editingSocialMediaCustomFields;
    const prevMain = socialMediaCustomFields;
    const optimisticEditing = editingSocialMediaCustomFields.filter(field => field.id !== id);
    const optimisticMain = socialMediaCustomFields.filter(field => field.id !== id);
    setEditingSocialMediaCustomFields(optimisticEditing);
    setSocialMediaCustomFields(optimisticMain);

    fetch(`https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(async (res) => {
        if (!res.ok) {
          await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fieldPath: `socialMedia.socialMediaCustomFields.${id}`, label: null })
          }).catch(() => { });
        }
        try { await refreshDataFromAPI(); } catch { }
      })
      .catch((err) => {
        console.error('Delete social media custom field (modal) failed:', err);
        setEditingSocialMediaCustomFields(prevEditing);
        setSocialMediaCustomFields(prevMain);
        alert('Failed to delete Social Media field');
      });
  };







  const openEditCompanyModal = async () => {
    setIsLoadingCompanyDetails(true);

    try {
      // API call to get company details
      const response = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/details/123456789', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🔍 API Response for edit modal:', data);

        if (data.success && data.item && data.item.data) {
          const apiData = data.item.data;
          console.log('🔍 API Data structure:', apiData);

          // Set company data from API using companyInfo structure
          if (apiData.companyInfo) {
            const ci = Array.isArray(apiData.companyInfo) ? (apiData.companyInfo[0] || {}) : (apiData.companyInfo || {});
            // Flatten ALL company labels/placeholders dynamically so we don't drop keys
            if (ci.companyLabels && typeof ci.companyLabels === 'object') {
              const labelsMap: any = {};
              Object.keys(ci.companyLabels).forEach((rawKey) => {
                const key = rawKey === 'dateOfIncorporation' ? 'yearEstablished' : rawKey;
                const v: any = (ci.companyLabels as any)[rawKey];
                labelsMap[key] = typeof v === 'string' ? v : (v?.label ?? '');
              });
              setEditingCompanyLabels(labelsMap);
            }

            if (ci.companyPlaceholders && typeof ci.companyPlaceholders === 'object') {
              const placeholdersMap: any = {};
              Object.keys(ci.companyPlaceholders).forEach((rawKey) => {
                const key = rawKey === 'dateOfIncorporation' ? 'yearEstablished' : rawKey;
                const v: any = (ci.companyPlaceholders as any)[rawKey];
                placeholdersMap[key] = typeof v === 'string' ? v : (v?.placeholder ?? '');
              });
              setEditingCompanyPlaceholders(placeholdersMap);
            }

            // Do NOT mutate apiCompanyKeys here; keep whatever was set by refreshDataFromAPI

            if (Array.isArray(ci.hiddenFields)) {
              setHiddenCompanyFields(new Set(ci.hiddenFields));
            }

            // Load custom fields from ci.customFields
            if (Array.isArray(ci.customFields) && ci.customFields.length > 0 && typeof ci.customFields[0] === 'object') {
              const obj: any = ci.customFields[0] || {};
              const arr = Object.values(obj) as any[];
              setEditingCustomFields(arr as any);
            } else if (ci.customFields && typeof ci.customFields === 'object') {
              const arr = Object.values(ci.customFields) as any[];
              setEditingCustomFields(arr as any);
            }
          }

          // Populate core values for the modal from details
          const valuesUpdate: any = {};
          if (apiData.companyName !== undefined) valuesUpdate.companyName = String(apiData.companyName ?? '');
          if (apiData.websiteUrl !== undefined) valuesUpdate.websiteUrl = String(apiData.websiteUrl ?? '');
          if (apiData.promoCode !== undefined) valuesUpdate.promoCode = String(apiData.promoCode ?? '');
          if (apiData.dateOfIncorporation !== undefined) valuesUpdate.yearEstablished = String(apiData.dateOfIncorporation ?? '');
          if (apiData.yearEstablished !== undefined) valuesUpdate.yearEstablished = String(apiData.yearEstablished ?? '');
          if (Object.keys(valuesUpdate).length > 0) {
            updateFormData(valuesUpdate);
          }
        } else {
          console.log('No API data found, using default values');
        }
      } else {
        console.error('Failed to fetch company details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    } finally {
      setIsLoadingCompanyDetails(false);
    }

    // Do NOT override labels/placeholders or custom fields with defaults here; rely on API data
    setShowEditCompanyModal(true);
  };

  const saveCompanyChanges = async () => {
    setIsSavingCompanyChanges(true);
    try {
      // Simple approach: update each field individually
      const updates: Array<{ fieldPath: string; label?: string; placeholder?: string }> = [];

      const mapKeyForBackend = (key: string) => key === 'yearEstablished' ? 'dateOfIncorporation' : key;

      // company labels
      Object.keys(editingCompanyLabels || {}).forEach((key) => {
        const val = (editingCompanyLabels as any)[key];
        const text = typeof val === 'string' ? val : (val?.label ?? '');
        if (text !== undefined && String(text).trim() !== '') {
          const backendKey = mapKeyForBackend(key);
          updates.push({
            fieldPath: `companyInfo.companyLabels.${backendKey}`,
            label: String(text)
          });
        }
      });

      // company placeholders
      Object.keys(editingCompanyPlaceholders || {}).forEach((key) => {
        const val = (editingCompanyPlaceholders as any)[key];
        const text = typeof val === 'string' ? val : (val?.placeholder ?? '');
        if (text !== undefined && String(text).trim() !== '') {
          const backendKey = mapKeyForBackend(key);
          updates.push({
            fieldPath: `companyInfo.companyPlaceholders.${backendKey}`,
            placeholder: String(text)
          });
        }
      });

      // legal labels/placeholders (if present)
      Object.keys(editingLegalLabels || {}).forEach((key) => {
        const val = (editingLegalLabels as any)[key];
        const text = typeof val === 'string' ? val  : (val?.label ?? '');
        if (text !== undefined && String(text).trim() !== '') {
          updates.push({
            fieldPath: `legalInfo.legalLabels.${key}`,
            label: String(text)
          });
        }
      });
      Object.keys(editingLegalPlaceholders || {}).forEach((key) => {
        const val = (editingLegalPlaceholders as any)[key];
        const text = typeof val === 'string' ? val  : (val?.placeholder ?? '');
        if (text !== undefined && String(text).trim() !== '') {
          updates.push({
            fieldPath: `legalInfo.legalPlaceholders.${key}`,
            placeholder: String(text)
          });
        }
      });

      // Execute updates sequentially
      for (const update of updates) {
        const body: any = { fieldPath: update.fieldPath };
        if (update.label !== undefined) body.label = update.label;
        if (update.placeholder !== undefined) body.placeholder = update.placeholder;

        const res = await fetch("https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Update failed");
      }

      // Add/Update custom fields (labels/placeholders)
      if (Array.isArray(editingCustomFields)) {
        for (const f of editingCustomFields) {
          // label
          {
            const body: any = { fieldPath: `companyInfo.customFields.${f.id}`, label: f.label };
            const res = await fetch("https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Update failed");
          }
          // placeholder
          {
            const body: any = { fieldPath: `companyInfo.customFields.${f.id}`, placeholder: f.placeholder };
            const res = await fetch("https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Update failed");
          }
        }
      }

      await refreshDataFromAPI();
      setShowEditCompanyModal(false);
      alert("Changes saved successfully");
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving changes");
      await refreshDataFromAPI();
    } finally {
      setIsSavingCompanyChanges(false);
    }
  };



  const openEditLegalModal = () => {
    // Keep API-derived legal labels/placeholders; do not override from localStorage
    setEditingLegalCustomFields([...legalCustomFields]);
    setShowEditLegalModal(true);
  };

  const saveLegalChanges = async () => {
    try {
      const updates: Array<{ fieldPath: string; label?: string; placeholder?: string; value?: string; required?: boolean }> = [];

      // Labels
      Object.keys(editingLegalLabels || {}).forEach((key) => {
        const val = (editingLegalLabels as any)[key];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          updates.push({ fieldPath: `legalInfo.legalLabels.${key}`, label: String(val) });
        }
      });

      // Placeholders
      Object.keys(editingLegalPlaceholders || {}).forEach((key) => {
        const val = (editingLegalPlaceholders as any)[key];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          updates.push({ fieldPath: `legalInfo.legalPlaceholders.${key}`, placeholder: String(val) });
        }
      });

      // Execute updates sequentially
      for (const update of updates) {
        const body: any = { fieldPath: update.fieldPath };
        if (update.label !== undefined) body.label = update.label;
        if (update.placeholder !== undefined) body.placeholder = update.placeholder;
        if (update.value !== undefined) body.value = update.value;
        if (update.required !== undefined) body.required = update.required;

        const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || 'Update failed');
      }

      // Persist custom fields label/placeholder/required under legalInfo.legalCustomFields
      if (Array.isArray(editingLegalCustomFields)) {
        for (const f of editingLegalCustomFields) {
          // label
          {
            const body: any = { fieldPath: `legalInfo.legalCustomFields.${f.id}`, label: f.label };
            const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', {
              method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || 'Update failed');
          }
          // placeholder
          {
            const body: any = { fieldPath: `legalInfo.legalCustomFields.${f.id}`, placeholder: f.placeholder };
            const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', {
              method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || 'Update failed');
          }
          // required
          {
            const body: any = { fieldPath: `legalInfo.legalCustomFields.${f.id}`, required: !!f.required };
            const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', {
              method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || 'Update failed');
          }
        }
      }

      await refreshDataFromAPI();
      setShowEditLegalModal(false);
      alert('Legal changes saved');
    } catch (e) {
      console.error('Save legal changes failed:', e);
      alert('Failed to save legal changes');
      try { await refreshDataFromAPI(); } catch { }
    }
  };

  const openEditDirectorModal = () => {
    // Keep API-derived labels/placeholders; do not override from localStorage
    setEditingDirectorCustomFields([...directorCustomFields]);
    setShowEditDirectorModal(true);
  };

  const saveDirectorChanges = async () => {
    try {
      const updates: Array<{ fieldPath: string; label?: any; placeholder?: any; value?: any; required?: boolean }> = [];

      Object.keys(editingDirectorLabels || {}).forEach((key) => {
        const val = (editingDirectorLabels as any)[key];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          updates.push({ fieldPath: `directorInfo.directorLabels.${key}`, label: String(val) });
        }
      });

      Object.keys(editingDirectorPlaceholders || {}).forEach((key) => {
        const val = (editingDirectorPlaceholders as any)[key];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          updates.push({ fieldPath: `directorInfo.directorPlaceholders.${key}`, placeholder: String(val) });
        }
      });

      for (const update of updates) {
        const body: any = { fieldPath: update.fieldPath };
        if (update.label !== undefined) body.label = update.label;
        if (update.placeholder !== undefined) body.placeholder = update.placeholder;
        if (update.value !== undefined) body.value = update.value;
        if (update.required !== undefined) body.required = update.required;
        const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || 'Update failed');
      }

      if (Array.isArray(editingDirectorCustomFields)) {
        for (const f of editingDirectorCustomFields) {
          // label
          {
            const body: any = { fieldPath: `directorInfo.directorCustomFields.${f.id}`, label: f.label };
            const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || 'Update failed');
          }
          // placeholder
          {
            const body: any = { fieldPath: `directorInfo.directorCustomFields.${f.id}`, placeholder: f.placeholder };
            const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || 'Update failed');
          }
          // required
          {
            const body: any = { fieldPath: `directorInfo.directorCustomFields.${f.id}`, required: !!f.required };
            const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || 'Update failed');
          }
        }
      }

      await refreshDataFromAPI();
      setShowEditDirectorModal(false);
      alert('Director changes saved');
    } catch (e) {
      console.error('Save director changes failed:', e);
      alert('Failed to save director changes');
      try { await refreshDataFromAPI(); } catch { }
    }
  };

  const openEditAltContactModal = () => {
    // Use API-derived labels/placeholders already loaded via refreshDataFromAPI
    setEditingAltContactCustomFields([...altContactCustomFields]);
    setShowEditAltContactModal(true);
  };

  const saveAltContactChanges = async () => {
    try {
      const updates: Array<{ fieldPath: string; label?: string; placeholder?: string; required?: boolean }> = [];

      Object.keys(editingAltContactLabels || {}).forEach((key) => {
        const val = (editingAltContactLabels as any)[key];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          updates.push({ fieldPath: `altContact.altContactLabels.${key}`, label: String(val) });
        }
      });

      Object.keys(editingAltContactPlaceholders || {}).forEach((key) => {
        const val = (editingAltContactPlaceholders as any)[key];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          updates.push({ fieldPath: `altContact.altContactPlaceholders.${key}`, placeholder: String(val) });
        }
      });

      for (const update of updates) {
        const body: any = { fieldPath: update.fieldPath };
        if (update.label !== undefined) body.label = update.label;
        if (update.placeholder !== undefined) body.placeholder = update.placeholder;
        if (update.required !== undefined) body.required = update.required;
        const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || 'Update failed');
      }

      // Persist custom fields label/placeholder/required
      if (Array.isArray(editingAltContactCustomFields)) {
        for (const f of editingAltContactCustomFields) {
          // label
          {
            const body: any = { fieldPath: `altContact.altContactCustomFields.${f.id}`, label: f.label };
            const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', {
              method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || 'Update failed');
          }
          // placeholder
          {
            const body: any = { fieldPath: `altContact.altContactCustomFields.${f.id}`, placeholder: f.placeholder };
            const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', {
              method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || 'Update failed');
          }
          // required
          {
            const body: any = { fieldPath: `altContact.altContactCustomFields.${f.id}`, required: !!f.required };
            const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', {
              method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || 'Update failed');
          }
        }
      }

      await refreshDataFromAPI();
      setShowEditAltContactModal(false);
      alert('Alternative Contact changes saved');
    } catch (e) {
      console.error('Save alt contact changes failed:', e);
      alert('Failed to save Alternative Contact');
      try { await refreshDataFromAPI(); } catch { }
    }
  };

  const openEditAddressModal = () => {
    // Use API-derived labels/placeholders already loaded via refreshDataFromAPI
    setEditingAddressCustomFields([...addressCustomFields]);
    setShowEditAddressModal(true);
  };

  const saveAddressChanges = async () => {
    try {
      const updates: Array<{ fieldPath: string; label?: string; placeholder?: string; value?: string; required?: boolean }> = [];

      Object.keys(editingAddressLabels || {}).forEach((key) => {
        const val = (editingAddressLabels as any)[key];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          updates.push({ fieldPath: `address.addressLabels.${key}`, label: String(val) });
        }
      });

      Object.keys(editingAddressPlaceholders || {}).forEach((key) => {
        const val = (editingAddressPlaceholders as any)[key];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          updates.push({ fieldPath: `address.addressPlaceholders.${key}`, placeholder: String(val) });
        }
      });

      for (const update of updates) {
        const body: any = { fieldPath: update.fieldPath };
        if (update.label !== undefined) body.label = update.label;
        if (update.placeholder !== undefined) body.placeholder = update.placeholder;
        if (update.value !== undefined) body.value = update.value;
        if (update.required !== undefined) body.required = update.required;
        const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || 'Update failed');
      }

      if (Array.isArray(editingAddressCustomFields)) {
        for (const f of editingAddressCustomFields) {
          // label
          {
            const body: any = { fieldPath: `address.addressCustomFields.${f.id}`, label: f.label };
            const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || 'Update failed');
          }
          // placeholder
          {
            const body: any = { fieldPath: `address.addressCustomFields.${f.id}`, placeholder: f.placeholder };
            const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || 'Update failed');
          }
          // required
          {
            const body: any = { fieldPath: `address.addressCustomFields.${f.id}`, required: !!f.required };
            const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || 'Update failed');
          }
        }
      }

      await refreshDataFromAPI();
      setShowEditAddressModal(false);
      alert('Address changes saved');
    } catch (e) {
      console.error('Save address changes failed:', e);
      alert('Failed to save Address Information');
      try { await refreshDataFromAPI(); } catch { }
    }
  };

  const openEditSocialMediaModal = () => {
    // Use API-derived labels/placeholders; no localStorage
    setEditingSocialMediaCustomFields([...socialMediaCustomFields]);

    setShowEditSocialMediaModal(true);
  };

  const saveSocialMediaChanges = async () => {
    try {
      const updates: Array<{ fieldPath: string; label?: string; placeholder?: string; value?: string; required?: boolean }> = [];

      Object.keys(editingSocialMediaLabels || {}).forEach((key) => {
        const val = (editingSocialMediaLabels as any)[key];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          updates.push({ fieldPath: `socialMedia.socialMediaLabels.${key}`, label: String(val) });
        }
      });

      Object.keys(editingSocialMediaPlaceholders || {}).forEach((key) => {
        const val = (editingSocialMediaPlaceholders as any)[key];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          updates.push({ fieldPath: `socialMedia.socialMediaPlaceholders.${key}`, placeholder: String(val) });
        }
      });

      for (const update of updates) {
        const body: any = { fieldPath: update.fieldPath };
        if (update.label !== undefined) body.label = update.label;
        if (update.placeholder !== undefined) body.placeholder = update.placeholder;
        if (update.value !== undefined) body.value = update.value;
        if (update.required !== undefined) body.required = update.required;
        const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || 'Update failed');
      }

      if (Array.isArray(editingSocialMediaCustomFields)) {
        for (const f of editingSocialMediaCustomFields) {
          // label
          {
            const body: any = { fieldPath: `socialMedia.socialMediaCustomFields.${f.id}`, label: f.label };
            const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || 'Update failed');
          }
          // placeholder
          {
            const body: any = { fieldPath: `socialMedia.socialMediaCustomFields.${f.id}`, placeholder: f.placeholder };
            const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || 'Update failed');
          }
          // required
          {
            const body: any = { fieldPath: `socialMedia.socialMediaCustomFields.${f.id}`, required: !!f.required };
            const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || 'Update failed');
          }
        }
      }

      await refreshDataFromAPI();
      setShowEditSocialMediaModal(false);
      alert('Social Media changes saved');
    } catch (e) {
      console.error('Save social media changes failed:', e);
      alert('Failed to save Social Media');
      try { await refreshDataFromAPI(); } catch { }
    }
  };


  const addLegalCustomField = async () => {
    if (!newLegalFieldLabel.trim() || !newLegalFieldPlaceholder.trim()) return;
    const newField = {
      id: Date.now().toString(),
      label: newLegalFieldLabel.trim(),
      placeholder: newLegalFieldPlaceholder.trim(),
      value: '',
      required: newLegalFieldRequired,
      fieldType: 'custom'
    };

    // Optimistic UI
    const optimistic = [...legalCustomFields, newField];
    setLegalCustomFields(optimistic);

    try {
      const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/add-field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionKey: 'legalInfo',
          customFieldsKey: 'legalCustomFields',
          newField
        })
      });
      if (!res.ok) {
        throw new Error((await res.text()) || 'Add field failed');
      }
      try { await refreshDataFromAPI(); } catch { }
      setNewLegalFieldLabel('');
      setNewLegalFieldPlaceholder('');
      setNewLegalFieldRequired(false);
      setShowLegalModal(false);
    } catch (e) {
      console.error('Add legal field failed:', e);
      // rollback
      setLegalCustomFields(legalCustomFields);
      alert('Failed to add legal field');
    }
  };

  const removeLegalCustomField = (id: string) => {
    const previous = legalCustomFields;
    const optimistic = legalCustomFields.filter(field => field.id !== id);
    setLegalCustomFields(optimistic);

    fetch(`https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(async (res) => {
        let data: any = null;
        try { data = await res.json(); } catch { }
        if (!res.ok || data?.success === false) {
          throw new Error((data && data.message) || res.statusText || 'Delete failed');
        }
        try { await refreshDataFromAPI(); } catch { }
      })
      .catch((err) => {
        console.error('Delete legal custom field failed:', err);
        setLegalCustomFields(previous);
        alert('Failed to delete legal field');
      });
  };

  const updateLegalCustomFieldValue = (id: string, value: string) => {
    const updatedFields = legalCustomFields.map(field =>
      field.id === id ? { ...field, value } : field
    );
    setLegalCustomFields(updatedFields);
    // Save to localStorage
    localStorage.setItem('legalCustomFields', JSON.stringify(updatedFields));
  };



  const addDirectorCustomField = async () => {
    if (!newDirectorFieldLabel.trim() || !newDirectorFieldPlaceholder.trim()) return;
    const newField = {
      id: Date.now().toString(),
      label: newDirectorFieldLabel.trim(),
      placeholder: newDirectorFieldPlaceholder.trim(),
      value: '',
      required: newDirectorFieldRequired,
      fieldType: 'custom'
    };
    const optimistic = [...directorCustomFields, newField];
    setDirectorCustomFields(optimistic);
    try {
      const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/add-field', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
          sectionKey: 'directorInfo', customFieldsKey: 'directorCustomFields', newField
        })
      });
      if (!res.ok) throw new Error((await res.text()) || 'Add field failed');
      try { await refreshDataFromAPI(); } catch { }
      setNewDirectorFieldLabel('');
      setNewDirectorFieldPlaceholder('');
      setNewDirectorFieldRequired(false);
      setShowDirectorModal(false);
    } catch (e) {
      console.error('Add director field failed:', e);
      setDirectorCustomFields(directorCustomFields);
      alert('Failed to add director field');
    }
  };

  const removeDirectorCustomField = (id: string) => {
    const previous = directorCustomFields;
    const optimistic = directorCustomFields.filter(field => field.id !== id);
    setDirectorCustomFields(optimistic);
    fetch(`https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/delete/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } })
      .then(async (res) => {
        if (!res.ok) {
          // fallback: try to null-out path via update
          await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
              fieldPath: `directorInfo.directorCustomFields.${id}`, label: null
            })
          }).catch(() => { });
        }
        try { await refreshDataFromAPI(); } catch { }
      })
      .catch(async (err) => {
        console.error('Delete director custom field failed:', err);
        setDirectorCustomFields(previous);
        alert('Failed to delete director field');
      });
  };

  const deleteDirectorCoreField = async (key: 'directorName' | 'directorPhone' | 'directorEmail') => {
    try {
      const res = await fetch(`https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/delete-core-field/${key}`, {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || 'Delete failed');
      }
      setHiddenDirectorFields(prev => new Set([...prev, key]));
      try { await refreshDataFromAPI(); } catch { }
    } catch (e) {
      console.error('Delete director core field failed:', e);
      setHiddenDirectorFields(prev => new Set([...prev, key]));
    }
  };

  const updateDirectorCustomFieldValue = (id: string, value: string) => {
    const updatedFields = directorCustomFields.map(field =>
      field.id === id ? { ...field, value } : field
    );
    setDirectorCustomFields(updatedFields);
    // Save to localStorage
    localStorage.setItem('directorCustomFields', JSON.stringify(updatedFields));
  };


  const addAltContactCustomField = async () => {
    if (!newAltContactFieldLabel.trim() || !newAltContactFieldPlaceholder.trim()) return;
    const newField = {
      id: Date.now().toString(),
      label: newAltContactFieldLabel.trim(),
      placeholder: newAltContactFieldPlaceholder.trim(),
      value: '',
      required: newAltContactFieldRequired,
      fieldType: 'custom'
    };
    const optimistic = [...altContactCustomFields, newField];
    setAltContactCustomFields(optimistic);
    try {
      const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/add-field', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
          sectionKey: 'altContact', customFieldsKey: 'altContactCustomFields', newField
        })
      });
      if (!res.ok) throw new Error((await res.text()) || 'Add field failed');
      try { await refreshDataFromAPI(); } catch { }
      setNewAltContactFieldLabel('');
      setNewAltContactFieldPlaceholder('');
      setNewAltContactFieldRequired(false);
      setShowAltContactModal(false);
    } catch (e) {
      console.error('Add Alt Contact field failed:', e);
      setAltContactCustomFields(altContactCustomFields);
      alert('Failed to add Alternative Contact field');
    }
  };

  const removeAltContactCustomField = (id: string) => {
    const previous = altContactCustomFields;
    const optimistic = altContactCustomFields.filter(field => field.id !== id);
    setAltContactCustomFields(optimistic);
    fetch(`https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/delete/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } })
      .then(async (res) => {
        if (!res.ok) {
          // fallback: try to null via update
          await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fieldPath: `altContact.altContactCustomFields.${id}`, label: null })
          }).catch(() => { });
        }
        try { await refreshDataFromAPI(); } catch { }
      })
      .catch((err) => {
        console.error('Delete Alt Contact custom field failed:', err);
        setAltContactCustomFields(previous);
        alert('Failed to delete Alternative Contact field');
      });
  };

  const deleteAltContactCoreField = async (key: string) => {
    try {
      const res = await fetch(`https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/delete-core-field/${key}`, {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || 'Delete failed');
      }
      setHiddenAltContactFields(prev => new Set([...prev, key]));
      setEditingAltContactLabels((prev: any) => { const n = { ...prev }; delete n[key]; return n; });
      setEditingAltContactPlaceholders((prev: any) => { const n = { ...prev }; delete n[key]; return n; });
      try { await refreshDataFromAPI(); } catch { }
    } catch (e) {
      console.error('Delete alt contact core field failed:', e);
      setHiddenAltContactFields(prev => new Set([...prev, key]));
    }
  };

  const updateAltContactCustomFieldValue = (id: string, value: string) => {
    const updatedFields = altContactCustomFields.map(field =>
      field.id === id ? { ...field, value } : field
    );
    setAltContactCustomFields(updatedFields);
  };


  const addAddressCustomField = async () => {
    if (!newAddressFieldLabel.trim() || !newAddressFieldPlaceholder.trim()) return;
    const optimisticNew = {
      id: Date.now().toString(),
      label: newAddressFieldLabel.trim(),
      placeholder: newAddressFieldPlaceholder.trim(),
      value: '',
      required: newAddressFieldRequired,
      fieldType: 'custom'
    };
    const prev = addressCustomFields;
    setAddressCustomFields([...addressCustomFields, optimisticNew]);
    try {
      const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/add-field', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey: 'address', customFieldsKey: 'addressCustomFields', newField: { ...optimisticNew, id: optimisticNew.id } })
      });
      if (!res.ok) throw new Error(await res.text());
      try { await refreshDataFromAPI(); } catch { }
      setNewAddressFieldLabel('');
      setNewAddressFieldPlaceholder('');
      setNewAddressFieldRequired(false);
      setShowAddressModal(false);
    } catch (e) {
      console.error('Add Address field failed:', e);
      setAddressCustomFields(prev);
      alert('Failed to add Address field');
    }
  };

  const removeAddressCustomField = (id: string) => {
    const previous = addressCustomFields;
    const optimistic = addressCustomFields.filter(field => field.id !== id);
    setAddressCustomFields(optimistic);
    fetch(`https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/delete/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } })
      .then(async (res) => {
        if (!res.ok) {
          await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fieldPath: `address.addressCustomFields.${id}`, label: null })
          }).catch(() => { });
        }
        try { await refreshDataFromAPI(); } catch { }
      })
      .catch((err) => {
        console.error('Delete Address custom field failed:', err);
        setAddressCustomFields(previous);
        alert('Failed to delete Address field');
      });
  };

  const updateAddressCustomFieldValue = (id: string, value: string) => {
    const updatedFields = addressCustomFields.map(field =>
      field.id === id ? { ...field, value } : field
    );
    setAddressCustomFields(updatedFields);
  };

  const removeSocialMediaCustomField = (id: string) => {
    const previous = socialMediaCustomFields;
    const optimistic = socialMediaCustomFields.filter(field => field.id !== id);
    setSocialMediaCustomFields(optimistic);
    fetch(`https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/delete/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } })
      .then(async (res) => {
        if (!res.ok) {
          await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/update/123456789', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fieldPath: `socialMedia.socialMediaCustomFields.${id}`, label: null })
          }).catch(() => { });
        }
        try { await refreshDataFromAPI(); } catch { }
      })
      .catch((err) => {
        console.error('Delete Social Media custom field failed:', err);
        setSocialMediaCustomFields(previous);
        alert('Failed to delete Social Media field');
      });
  };

  const updateSocialMediaCustomFieldValue = (id: string, value: string) => {
    const updatedFields = socialMediaCustomFields.map(field =>
      field.id === id ? { ...field, value } : field
    );
    setSocialMediaCustomFields(updatedFields);
  };

  const addSocialMediaCustomField = async () => {
    if (!newSocialMediaFieldLabel.trim() || !newSocialMediaFieldPlaceholder.trim()) return;
    const optimisticNew = {
      id: Date.now().toString(),
      label: newSocialMediaFieldLabel.trim(),
      placeholder: newSocialMediaFieldPlaceholder.trim(),
      value: '',
      required: newSocialMediaFieldRequired,
      fieldType: 'custom'
    };
    const prev = socialMediaCustomFields;
    setSocialMediaCustomFields([...socialMediaCustomFields, optimisticNew]);
    try {
      const res = await fetch('https://8x088l5hce.execute-api.ap-south-1.amazonaws.com/admin-companyform-post/add-field', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey: 'socialMedia', customFieldsKey: 'socialMediaCustomFields', newField: { ...optimisticNew, id: optimisticNew.id } })
      });
      if (!res.ok) throw new Error(await res.text());
      try { await refreshDataFromAPI(); } catch { }
      setNewSocialMediaFieldLabel('');
      setNewSocialMediaFieldPlaceholder('');
      setNewSocialMediaFieldRequired(false);
      setShowSocialMediaModal(false);
    } catch (e) {
      console.error('Add Social Media field failed:', e);
      setSocialMediaCustomFields(prev);
      alert('Failed to add Social Media field');
    }
  };

  return (
    <FormStep
      title="Company Information"
      description="Select your company category and provide basic details"
      onNext={onNext}
      onPrev={onPrev}
      isValid={isValid}
      isFirstStep={true}
      currentStep={1}
      totalSteps={7}
    >
      <div className="space-y-6">
        {/* Company Category */}
        <div>
          <h2 className="mb-2 text-lg font-bold text-slate-900">Company Category</h2>
          <p className="mb-4 text-sm text-slate-600">Select your company's main business category (you can select multiple)</p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {categoryOptions.map(({ value, description }) => (
              <label
                key={value}
                className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${formData.companyCategory.includes(value)
                  ? 'border-amber-500 bg-yellow-50 shadow-md'
                  : 'border-amber-300 hover:border-amber-400'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={formData.companyCategory.includes(value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleCategoryChange([...formData.companyCategory, value]);
                    } else {
                      handleCategoryChange(formData.companyCategory.filter(cat => cat !== value));
                    }
                  }}
                  className="sr-only"
                />
                <h3 className={`text-lg font-bold mb-2 ${formData.companyCategory.includes(value) ? 'text-amber-900' : 'text-gray-700'
                  }`}>
                  {value}
                </h3>
                <p className={`text-xs text-center ${formData.companyCategory.includes(value) ? 'text-amber-700' : 'text-gray-500'
                  }`}>
                  {description}
                </p>
              </label>
            ))}
          </div>

          {formData.companyCategory.length === 0 && (
            <div className="py-4 text-center">
              <p className="text-gray-500">Please select at least one category to continue</p>
            </div>
          )}
        </div>


        {/* Company Basic Details */}
        <div>
          <h2 className="mb-2 text-lg font-bold text-slate-900">Company Basic Details</h2>
          <p className="mb-4 text-sm text-slate-600">Tell us about your company's basic information</p>

          <div className="space-y-4">
            {/* Company Information */}
            <CompanyInformationSection
              setShowAddFieldModal={setShowAddFieldModal}
              showAddFieldModal={showAddFieldModal}
              openEditCompanyModal={openEditCompanyModal}
              hiddenCompanyFields={hiddenCompanyFields}
              editingCompanyPlaceholders={editingCompanyPlaceholders}
              editingCompanyLabels={editingCompanyLabels}
              setEditingCompanyLabels={setEditingCompanyLabels}
              setEditingCompanyPlaceholders={setEditingCompanyPlaceholders}
              updateFormData={updateFormData}
              formData={formData}
              setHiddenCompanyFields={setHiddenCompanyFields}
              apiCompanyKeys={apiCompanyKeys}
              customFields={customFields}
              showEditCompanyModal={showEditCompanyModal}
              setShowEditCompanyModal={setShowEditCompanyModal}
              updateCustomFieldValue={updateCustomFieldValue}
              newFieldLabel={newFieldLabel}
              setNewFieldLabel={setNewFieldLabel}
              newFieldPlaceholder={newFieldPlaceholder}
              setNewFieldPlaceholder={setNewFieldPlaceholder}
              newFieldRequired={newFieldRequired}
              setNewFieldRequired={setNewFieldRequired}
              addCustomField={addCustomField}
              removeCustomField={removeCustomField}
              editingCustomFields={editingCustomFields}
              setEditingCustomFields={setEditingCustomFields}
              updateEditingCustomFieldLabel={updateEditingCustomFieldLabel}
              updateEditingCustomFieldPlaceholder={updateEditingCustomFieldPlaceholder}
              removeEditingCustomField={removeEditingCustomField}
              isAddingField={isAddingField}
              isLoadingCompanyDetails={isLoadingCompanyDetails}
              isSavingCompanyChanges={isSavingCompanyChanges}
              saveCompanyChanges={saveCompanyChanges}
              deleteCoreField={deleteCoreField}
            />

            {/* Legal Information */}
            <LegalInformationSection
              setShowLegalModal={setShowLegalModal}
              openEditLegalModal={openEditLegalModal}
              hiddenLegalFields={hiddenLegalFields}
              editingLegalLabels={editingLegalLabels}
              editingLegalPlaceholders={editingLegalPlaceholders}
              updateFormData={updateFormData}
              formData={formData}
              setHiddenLegalFields={setHiddenLegalFields}
              legalCustomFields={legalCustomFields}
              updateLegalCustomFieldValue={updateLegalCustomFieldValue}
              removeLegalCustomField={removeLegalCustomField}
              deleteLegalCoreField={deleteLegalCoreField}
              showLegalModal={showLegalModal}
              newLegalFieldLabel={newLegalFieldLabel}
              setNewLegalFieldLabel={setNewLegalFieldLabel}
              newLegalFieldPlaceholder={newLegalFieldPlaceholder}
              setNewLegalFieldPlaceholder={setNewLegalFieldPlaceholder}
              newLegalFieldRequired={newLegalFieldRequired}
              setNewLegalFieldRequired={setNewLegalFieldRequired}
              addLegalCustomField={addLegalCustomField}
              showEditLegalModal={showEditLegalModal}
              setShowEditLegalModal={setShowEditLegalModal}
              setEditingLegalLabels={setEditingLegalLabels}
              setEditingLegalPlaceholders={setEditingLegalPlaceholders}
              saveLegalChanges={saveLegalChanges}
              editingLegalCustomFields={editingLegalCustomFields}
              setEditingLegalCustomFields={setEditingLegalCustomFields}
              updateEditingLegalCustomFieldLabel={updateEditingLegalCustomFieldLabel}
              updateEditingLegalCustomFieldPlaceholder={updateEditingLegalCustomFieldPlaceholder}
              removeEditingLegalCustomField={removeEditingLegalCustomField}
            />

            {/* Director Information */}
            <DirectorInformationSection
              setShowDirectorModal={setShowDirectorModal}
              openEditDirectorModal={openEditDirectorModal}
              hiddenDirectorFields={hiddenDirectorFields}
              editingDirectorLabels={editingDirectorLabels}
              editingDirectorPlaceholders={editingDirectorPlaceholders}
              updateFormData={updateFormData}
              formData={formData}
              setHiddenDirectorFields={setHiddenDirectorFields}
              directorCustomFields={directorCustomFields}
              updateDirectorCustomFieldValue={updateDirectorCustomFieldValue}
              removeDirectorCustomField={removeDirectorCustomField}
              deleteDirectorCoreField={deleteDirectorCoreField}
              showDirectorModal={showDirectorModal}
              newDirectorFieldLabel={newDirectorFieldLabel}
              setNewDirectorFieldLabel={setNewDirectorFieldLabel}
              newDirectorFieldPlaceholder={newDirectorFieldPlaceholder}
              setNewDirectorFieldPlaceholder={setNewDirectorFieldPlaceholder}
              newDirectorFieldRequired={newDirectorFieldRequired}
              setNewDirectorFieldRequired={setNewDirectorFieldRequired}
              addDirectorCustomField={addDirectorCustomField}
              showEditDirectorModal={showEditDirectorModal}
              setShowEditDirectorModal={setShowEditDirectorModal}
              setEditingDirectorLabels={setEditingDirectorLabels}
              setEditingDirectorPlaceholders={setEditingDirectorPlaceholders}
              saveDirectorChanges={saveDirectorChanges}
              editingDirectorCustomFields={editingDirectorCustomFields}
              setEditingDirectorCustomFields={setEditingDirectorCustomFields}
              updateEditingDirectorCustomFieldLabel={updateEditingDirectorCustomFieldLabel}
              updateEditingDirectorCustomFieldPlaceholder={updateEditingDirectorCustomFieldPlaceholder}
              removeEditingDirectorCustomField={removeEditingDirectorCustomField}
            />

            {/* Alternative Contact */}
            <AlternativeContactSection
              setShowAltContactModal={setShowAltContactModal}
              openEditAltContactModal={openEditAltContactModal}
              hiddenAltContactFields={hiddenAltContactFields}
              editingAltContactLabels={editingAltContactLabels}
              editingAltContactPlaceholders={editingAltContactPlaceholders}
              updateFormData={updateFormData}
              formData={formData}
              setHiddenAltContactFields={setHiddenAltContactFields}
              altContactCustomFields={altContactCustomFields}
              updateAltContactCustomFieldValue={updateAltContactCustomFieldValue}
              removeAltContactCustomField={removeAltContactCustomField}
              deleteAltContactCoreField={deleteAltContactCoreField}
              showAltContactModal={showAltContactModal}
              newAltContactFieldLabel={newAltContactFieldLabel}
              setNewAltContactFieldLabel={setNewAltContactFieldLabel}
              newAltContactFieldPlaceholder={newAltContactFieldPlaceholder}
              setNewAltContactFieldPlaceholder={setNewAltContactFieldPlaceholder}
              newAltContactFieldRequired={newAltContactFieldRequired}
              setNewAltContactFieldRequired={setNewAltContactFieldRequired}
              addAltContactCustomField={addAltContactCustomField}
              showEditAltContactModal={showEditAltContactModal}
              setShowEditAltContactModal={setShowEditAltContactModal}
              setEditingAltContactLabels={setEditingAltContactLabels}
              setEditingAltContactPlaceholders={setEditingAltContactPlaceholders}
              saveAltContactChanges={saveAltContactChanges}
              editingAltContactCustomFields={editingAltContactCustomFields}
              setEditingAltContactCustomFields={setEditingAltContactCustomFields}
              updateEditingAltContactCustomFieldLabel={updateEditingAltContactCustomFieldLabel}
              updateEditingAltContactCustomFieldPlaceholder={updateEditingAltContactCustomFieldPlaceholder}
              removeEditingAltContactCustomField={removeEditingAltContactCustomField}
            />

            {/* Address Information */}
            <AddressInformationSection
              setShowAddressModal={setShowAddressModal}
              openEditAddressModal={openEditAddressModal}
              hiddenAddressFields={hiddenAddressFields}
              editingAddressLabels={editingAddressLabels}
              editingAddressPlaceholders={editingAddressPlaceholders}
              updateFormData={updateFormData}
              formData={formData}
              setHiddenAddressFields={setHiddenAddressFields}
              addressCustomFields={addressCustomFields}
              updateAddressCustomFieldValue={updateAddressCustomFieldValue}
              removeAddressCustomField={removeAddressCustomField}
              showEditAddressModal={showEditAddressModal}
              setShowEditAddressModal={setShowEditAddressModal}
              setEditingAddressLabels={setEditingAddressLabels}
              setEditingAddressPlaceholders={setEditingAddressPlaceholders}
              saveAddressChanges={saveAddressChanges}
              showAddressModal={showAddressModal}
              newAddressFieldLabel={newAddressFieldLabel}
              setNewAddressFieldLabel={setNewAddressFieldLabel}
              newAddressFieldPlaceholder={newAddressFieldPlaceholder}
              setNewAddressFieldPlaceholder={setNewAddressFieldPlaceholder}
              newAddressFieldRequired={newAddressFieldRequired}
              setNewAddressFieldRequired={setNewAddressFieldRequired}
              addAddressCustomField={addAddressCustomField}
              editingAddressCustomFields={editingAddressCustomFields}
              setEditingAddressCustomFields={setEditingAddressCustomFields}
              updateEditingAddressCustomFieldLabel={updateEditingAddressCustomFieldLabel}
              updateEditingAddressCustomFieldPlaceholder={updateEditingAddressCustomFieldPlaceholder}
              removeEditingAddressCustomField={removeEditingAddressCustomField}
            />

            {/* Social Media Links */}
            <SocialMediaInformationSection
              setShowSocialMediaModal={setShowSocialMediaModal}
              openEditSocialMediaModal={openEditSocialMediaModal}
              hiddenSocialMediaFields={hiddenSocialMediaFields}
              editingSocialMediaLabels={editingSocialMediaLabels}
              editingSocialMediaPlaceholders={editingSocialMediaPlaceholders}
              updateFormData={updateFormData}
              formData={formData}
              setHiddenSocialMediaFields={setHiddenSocialMediaFields}
              socialMediaCustomFields={socialMediaCustomFields}
              updateSocialMediaCustomFieldValue={updateSocialMediaCustomFieldValue}
              removeSocialMediaCustomField={removeSocialMediaCustomField}
              showEditSocialMediaModal={showEditSocialMediaModal}
              setShowEditSocialMediaModal={setShowEditSocialMediaModal}
              setEditingSocialMediaLabels={setEditingSocialMediaLabels}
              setEditingSocialMediaPlaceholders={setEditingSocialMediaPlaceholders}
              saveSocialMediaChanges={saveSocialMediaChanges}
              showSocialMediaModal={showSocialMediaModal}
              newSocialMediaFieldLabel={newSocialMediaFieldLabel}
              setNewSocialMediaFieldLabel={setNewSocialMediaFieldLabel}
              newSocialMediaFieldPlaceholder={newSocialMediaFieldPlaceholder}
              setNewSocialMediaFieldPlaceholder={setNewSocialMediaFieldPlaceholder}
              newSocialMediaFieldRequired={newSocialMediaFieldRequired}
              setNewSocialMediaFieldRequired={setNewSocialMediaFieldRequired}
              addSocialMediaCustomField={addSocialMediaCustomField}
              editingSocialMediaCustomFields={editingSocialMediaCustomFields}
              setEditingSocialMediaCustomFields={setEditingSocialMediaCustomFields}
              updateEditingSocialMediaCustomFieldLabel={updateEditingSocialMediaCustomFieldLabel}
              updateEditingSocialMediaCustomFieldPlaceholder={updateEditingSocialMediaCustomFieldPlaceholder}
              removeEditingSocialMediaCustomField={removeEditingSocialMediaCustomField}
              // ✅ NAYA PROP ADD KIA HAI:
              socialMediaData={socialMediaApiData}
            />
          </div>
        </div>
      </div>
    </FormStep>
  );
}