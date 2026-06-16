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
}