import React, { useState, useEffect, useRef } from 'react';
import { FormStep } from '../FormStep';
import { FormInput } from '../FormInput';
import { StepProps } from '../../types/form';
import { Upload, FileText, Image, Video, Edit3, Plus, Trash2 } from 'lucide-react';

interface UploadField {
  id: string;
  label: string;
  accept: string;
  description: string;
  required: boolean;
  type: 'file' | 'url';
  value: string;
  section: string;
  isPredefined: boolean;
}

const Step8MediaUploads: React.FC<StepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isValid,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditingSection, setCurrentEditingSection] = useState<string | null>(null);
  const [uploadFields, setUploadFields] = useState<UploadField[]>([]);
  const [workingFields, setWorkingFields] = useState<UploadField[]>([]); // Fields being edited in modal
  const [newField, setNewField] = useState({
    label: '',
    accept: '.pdf,.jpg,.jpeg,.png',
    description: '',
    required: false,
    type: 'file' as 'file' | 'url'
  });

  const isInitialLoad = useRef(true);

  // Load data from localStorage on component mount
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;

      // Load custom upload fields
      const savedCustomFields = localStorage.getItem('mediaUploadsCustomFields');
      if (savedCustomFields) {
        try {
          const parsed = JSON.parse(savedCustomFields);
          // This will be merged with predefined fields in the main useEffect
        } catch (error) {
          console.error('Error parsing saved custom fields:', error);
        }
      }

      // Load custom upload values
      const savedCustomValues = localStorage.getItem('mediaUploadsCustomValues');
      if (savedCustomValues) {
        try {
          const parsed = JSON.parse(savedCustomValues);
          if (parsed && Object.keys(parsed).length > 0) {
            updateFormData({ customUploads: parsed });
          }
        } catch (error) {
          console.error('Error parsing saved custom values:', error);
        }
      }

      // Load section-specific data
      const savedBrandImages = localStorage.getItem('mediaUploadsBrandImages');
      const savedDocuments = localStorage.getItem('mediaUploadsDocuments');

      if (savedBrandImages) {
        try {
          const parsed = JSON.parse(savedBrandImages);
          // This will be used to restore brand images section state
        } catch (error) {
          console.error('Error parsing saved brand images:', error);
        }
      }

      if (savedDocuments) {
        try {
          const parsed = JSON.parse(savedDocuments);
          // This will be used to restore documents section state
        } catch (error) {
          console.error('Error parsing saved documents:', error);
        }
      }
    }
  }, []);

  // Initialize upload fields from formData
  useEffect(() => {
    // Load custom fields from localStorage
    let customFields: UploadField[] = [];
    const savedCustomFields = localStorage.getItem('mediaUploadsCustomFields');
    if (savedCustomFields) {
      try {
        customFields = JSON.parse(savedCustomFields);
      } catch (error) {
        console.error('Error parsing saved custom fields:', error);
      }
    }

    // Load predefined field values from localStorage
    const savedPredefinedValues = localStorage.getItem('mediaUploadsPredefined');
    let predefinedValues: Record<string, string> = {};
    if (savedPredefinedValues) {
      try {
        predefinedValues = JSON.parse(savedPredefinedValues);
      } catch (error) {
        console.error('Error parsing saved predefined values:', error);
      }
    }

    // Load section-specific data from localStorage
    let savedBrandImages: UploadField[] = [];
    let savedDocuments: UploadField[] = [];

    const savedBrandImagesData = localStorage.getItem('mediaUploadsBrandImages');
    if (savedBrandImagesData) {
      try {
        const parsed = JSON.parse(savedBrandImagesData);
        if (parsed.fields) {
          savedBrandImages = parsed.fields;
        }
      } catch (error) {
        console.error('Error parsing saved brand images:', error);
      }
    }

    const savedDocumentsData = localStorage.getItem('mediaUploadsDocuments');
    if (savedDocumentsData) {
      try {
        const parsed = JSON.parse(savedDocumentsData);
        if (parsed.fields) {
          savedDocuments = parsed.fields;
        }
      } catch (error) {
        console.error('Error parsing saved documents:', error);
      }
    }

    // Load Documents & Certificates backup data
    const documentsBackup = localStorage.getItem('documentsSectionBackup');
    if (documentsBackup) {
      try {
        const parsed = JSON.parse(documentsBackup);
        if (parsed.fields && parsed.fields.length > 0) {
          // Use backup data if available
          savedDocuments = parsed.fields;
        }
      } catch (error) {
        console.error('Error parsing documents backup:', error);
      }
    }

    // Load individual document field data
    const documentFieldKeys = ['company-brochure', 'product-catalogue', 'case-studies', 'brand-guidelines'];
    documentFieldKeys.forEach(fieldId => {
      const fieldKey = `document_${fieldId}`;
      const fieldData = localStorage.getItem(fieldKey);
      if (fieldData) {
        try {
          const parsed = JSON.parse(fieldData);
          // Update the savedDocuments array with individual field data
          const existingFieldIndex = savedDocuments.findIndex(f => f.id === fieldId);
          if (existingFieldIndex >= 0) {
            savedDocuments[existingFieldIndex] = { ...savedDocuments[existingFieldIndex], ...parsed };
          }
        } catch (error) {
          console.error(`Error parsing document field ${fieldId}:`, error);
        }
      }
    });

    // Load file upload state from localStorage
    const savedFileUploadState = localStorage.getItem('mediaUploadsFileState');
    let fileUploadState: Record<string, any> = {};
    if (savedFileUploadState) {
      try {
        fileUploadState = JSON.parse(savedFileUploadState);
      } catch (error) {
        console.error('Error parsing saved file upload state:', error);
      }
    }

    // Load complete state from localStorage
    const savedCompleteState = localStorage.getItem('mediaUploadsCompleteState');
    let completeState: any = null;
    if (savedCompleteState) {
      try {
        completeState = JSON.parse(savedCompleteState);
      } catch (error) {
        console.error('Error parsing saved complete state:', error);
      }
    }

    const initialFields: UploadField[] = [
      // Brand & Site Images
      {
        id: 'company-logo',
        label: 'Company Logo',
        accept: '.png,.svg,.jpg,.jpeg',
        description: 'PNG/SVG preferred, minimum 1000×1000px, max 5MB',
        required: true,
        type: 'file',
        value: (savedBrandImages.find(f => f.id === 'company-logo')?.value) || predefinedValues.companyLogoUrl || formData.companyLogoUrl || '',
        section: 'brand-images',
        isPredefined: true
      },

      // Documents & Certificates
      ...(formData.dgcaTypeCertificateUrl ? [{
        id: 'dgca-certificate',
        label: 'DGCA Type Certificate',
        accept: '.pdf,.jpg,.jpeg,.png',
        description: 'DGCA certification document, max 20MB',
        required: false,
        type: 'file' as const,
        value: (savedDocuments.find(f => f.id === 'dgca-certificate')?.value) || predefinedValues.dgcaTypeCertificateUrl || formData.dgcaTypeCertificateUrl || '',
        section: 'documents',
        isPredefined: true
      }] : []),

      ...(formData.rptoAuthorisationCertificateUrl ? [{
        id: 'rpto-certificate',
        label: 'RPTO Authorisation Certificate',
        accept: '.pdf,.jpg,.jpeg,.png',
        description: 'RPTO certification document, max 20MB',
        required: false,
        type: 'file' as const,
        value: (savedDocuments.find(f => f.id === 'rpto-certificate')?.value) || predefinedValues.rptoAuthorisationCertificateUrl || formData.rptoAuthorisationCertificateUrl || '',
        section: 'documents',
        isPredefined: true
      }] : []),

      {
        id: 'company-brochure',
        label: 'Company Brochure',
        accept: '.pdf',
        description: 'Company brochure PDF, max 20MB',
        required: false,
        type: 'file' as const,
        value: (savedDocuments.find(f => f.id === 'company-brochure')?.value) || predefinedValues.brochurePdfUrl || formData.brochurePdfUrl || '',
        section: 'documents',
        isPredefined: true
      },

      {
        id: 'product-catalogue',
        label: 'Product Catalogue',
        accept: '.pdf',
        description: 'Product catalogue PDF, max 20MB',
        required: false,
        type: 'file' as const,
        value: (savedDocuments.find(f => f.id === 'product-catalogue')?.value) || predefinedValues.cataloguePdfUrl || formData.cataloguePdfUrl || '',
        section: 'documents',
        isPredefined: true
      },

      {
        id: 'case-studies',
        label: 'Case Studies',
        accept: '.pdf,.doc,.docx',
        description: 'Case studies document, max 20MB',
        required: false,
        type: 'file' as const,
        value: (savedDocuments.find(f => f.id === 'case-studies')?.value) || predefinedValues.caseStudiesUrl || formData.caseStudiesUrl || '',
        section: 'documents',
        isPredefined: true
      },

      {
        id: 'brand-guidelines',
        label: 'Brand Guidelines',
        accept: '.pdf',
        description: 'Brand guidelines PDF, max 20MB',
        required: false,
        type: 'file' as const,
        value: (savedDocuments.find(f => f.id === 'brand-guidelines')?.value) || predefinedValues.brandGuidelinesUrl || formData.brandGuidelinesUrl || '',
        section: 'documents',
        isPredefined: true
      },

      // Videos & Links
      {
        id: 'promo-video-5min',
        label: 'Promotional Video (5 minutes)',
        accept: 'video/*',
        description: '5-minute comprehensive company overview',
        required: false,
        type: 'url' as const,
        value: predefinedValues.promoVideoFiveMinUrl || formData.promoVideoFiveMinUrl || '',
        section: 'videos',
        isPredefined: true
      },

      {
        id: 'promo-video-1min',
        label: 'Promotional Video (1 minute)',
        accept: 'video/*',
        description: '1-minute quick highlights for social media',
        required: false,
        type: 'url' as const,
        value: predefinedValues.promoVideoOneMinUrl || formData.promoVideoOneMinUrl || '',
        section: 'videos',
        isPredefined: true
      },

      {
        id: 'company-profile',
        label: 'Company Profile Link',
        accept: 'url',
        description: 'Link to company profile or drive folder',
        required: false,
        type: 'url' as const,
        value: predefinedValues.companyProfileLink || formData.companyProfileLink || '',
        section: 'videos',
        isPredefined: true
      },

      // Add custom fields from localStorage
      ...customFields
    ];

    setUploadFields(initialFields);

    // Save initial section states to localStorage
    const brandImagesFields = initialFields.filter(field => field.section === 'brand-images');
    const documentsFields = initialFields.filter(field => field.section === 'documents');
    const videosFields = initialFields.filter(field => field.section === 'videos');

    saveSectionToLocalStorage('brand-images', brandImagesFields);
    saveSectionToLocalStorage('documents', documentsFields);
    saveSectionToLocalStorage('videos', videosFields);
  }, [formData]);

  // Save complete form state to localStorage when component unmounts or on significant changes
  useEffect(() => {
    const saveCompleteState = () => {
      const completeState = {
        uploadFields: uploadFields,
        customFields: uploadFields.filter(field => !field.isPredefined),
        predefinedValues: {
          companyLogoUrl: formData.companyLogoUrl,
          dgcaTypeCertificateUrl: formData.dgcaTypeCertificateUrl,
          rptoAuthorisationCertificateUrl: formData.rptoAuthorisationCertificateUrl,
          brochurePdfUrl: formData.brochurePdfUrl,
          cataloguePdfUrl: formData.cataloguePdfUrl,
          caseStudiesUrl: formData.caseStudiesUrl,
          brandGuidelinesUrl: formData.brandGuidelinesUrl,
          promoVideoFiveMinUrl: formData.promoVideoFiveMinUrl,
          promoVideoOneMinUrl: formData.promoVideoOneMinUrl,
          companyProfileLink: formData.companyProfileLink
        },
        customUploads: formData.customUploads,
        lastSaved: new Date().toISOString()
      };

      localStorage.setItem('mediaUploadsCompleteState', JSON.stringify(completeState));
    };

    // Save state when uploadFields change significantly
    if (uploadFields.length > 0) {
      saveCompleteState();
    }

    // Save state when formData changes
    if (Object.keys(formData).length > 0) {
      saveCompleteState();
    }
  }, [uploadFields, formData]);

  const updateFieldValue = (id: string, value: string) => {
    setUploadFields(prev => {
      const updatedFields = prev.map(field =>
        field.id === id ? { ...field, value } : field
      );

      // Save section data to localStorage after updating
      const updatedField = updatedFields.find(field => field.id === id);
      if (updatedField) {
        const sectionFields = updatedFields.filter(field => field.section === updatedField.section);
        saveSectionToLocalStorage(updatedField.section, sectionFields);

        // Special handling for Documents & Certificates section
        if (updatedField.section === 'documents') {
          // Save individual document field
          const fieldKey = `document_${id}`;
          const fieldData = {
            id: id,
            label: updatedField.label,
            value: value,
            accept: updatedField.accept,
            required: updatedField.required,
            description: updatedField.description,
            lastUpdated: new Date().toISOString()
          };
          localStorage.setItem(fieldKey, JSON.stringify(fieldData));

          // Also update the documents backup
          localStorage.setItem('documentsSectionBackup', JSON.stringify({
            section: 'documents',
            fields: sectionFields,
            lastSaved: new Date().toISOString(),
            totalFields: sectionFields.length,
            requiredFields: sectionFields.filter(f => f.required).length,
            optionalFields: sectionFields.filter(f => !f.required).length,
            customFields: sectionFields.filter(f => !f.isPredefined).length
          }));
        }
      }

      return updatedFields;
    });

    // Update formData based on field ID
    const fieldConfig: Record<string, keyof typeof formData> = {
      'company-logo': 'companyLogoUrl',
      'dgca-certificate': 'dgcaTypeCertificateUrl',
      'rpto-certificate': 'rptoAuthorisationCertificateUrl',
      'company-brochure': 'brochurePdfUrl',
      'product-catalogue': 'cataloguePdfUrl',
      'case-studies': 'caseStudiesUrl',
      'brand-guidelines': 'brandGuidelinesUrl',
      'promo-video-5min': 'promoVideoFiveMinUrl',
      'promo-video-1min': 'promoVideoOneMinUrl',
      'company-profile': 'companyProfileLink'
    };

    if (fieldConfig[id]) {
      updateFormData({ [fieldConfig[id]]: value });
      // Save to localStorage for predefined fields
      const fieldKey = fieldConfig[id];
      if (fieldKey) {
        const savedData = localStorage.getItem('mediaUploadsPredefined') || '{}';
        try {
          const parsed = JSON.parse(savedData);
          parsed[fieldKey] = value;
          localStorage.setItem('mediaUploadsPredefined', JSON.stringify(parsed));
        } catch (error) {
          console.error('Error saving predefined field to localStorage:', error);
        }
      }
    } else if (id.startsWith('custom-')) {
      // Handle custom fields
      const newCustomUploads = {
        ...formData.customUploads,
        [id]: value
      };
      updateFormData({ customUploads: newCustomUploads });

      // Save custom uploads to localStorage
      localStorage.setItem('mediaUploadsCustomValues', JSON.stringify(newCustomUploads));
    }
  };

  const FileUploadSection = ({
    title,
    icon: Icon,
    bgColor = 'bg-slate-50',
    sectionKey,
    children
  }: {
    title: string;
    icon: any;
    bgColor?: string;
    sectionKey: string;
    children: React.ReactNode;
  }) => (
    <div className={`relative p-6 rounded-lg ${bgColor}`}>
      <button
        type="button"
        onClick={() => openEditModal(sectionKey)}
        className="absolute top-4 right-4 p-1 text-slate-500 hover:text-slate-700"
        title={`Edit ${title} options`}
      >
        <Edit3 size={16} />
      </button>
      <h3 className="flex items-center mb-4 text-lg font-bold text-slate-900">
        <Icon className="mr-3 w-6 h-6 text-slate-600" />
        {title}
      </h3>
      {children}
    </div>
  );

  const FileUploadBox = ({
    field,
    showRemove = false,
    onRemove
  }: {
    field: UploadField;
    showRemove?: boolean;
    onRemove?: () => void;
  }) => (
    <div className="relative mb-4">
      {showRemove && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-2 -right-2 p-1 text-white bg-red-500 rounded-full hover:bg-red-600"
          title="Remove this field"
        >
          <Trash2 size={12} />
        </button>
      )}
      <label className="block mb-2 text-sm font-semibold text-slate-700">
        {field.label}
        {field.required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {field.description && (
        <p className="mb-2 text-sm text-slate-600">{field.description}</p>
      )}

      {field.type === 'file' ? (
        <div className="p-6 text-center rounded-lg border-2 border-dashed transition-colors border-slate-300 hover:border-slate-400">
          <Upload className="mx-auto mb-2 w-8 h-8 text-slate-400" />
          <p className="mb-2 text-slate-600">
            {field.value ? `Selected: ${field.value}` : 'Click to upload or drag and drop'}
          </p>
          <p className="mb-3 text-xs text-slate-500">{field.accept}</p>
          <input
            type="file"
            accept={field.accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                updateFieldValue(field.id, file.name);
                // Save file upload state to localStorage
                saveFileUploadState(field.id, file.name, file.type);
              }
            }}
            className="hidden"
            id={`upload-${field.id}`}
          />
          <label
            htmlFor={`upload-${field.id}`}
            className="inline-block px-4 py-2 text-white bg-blue-600 rounded-lg transition-colors cursor-pointer hover:bg-blue-700"
          >
            Choose File
          </label>
        </div>
      ) : (
        <FormInput
          label=""
          type="url"
          value={field.value}
          onChange={(value) => updateFieldValue(field.id, value)}
          placeholder={`Enter ${field.label.toLowerCase()} URL`}
        />
      )}
    </div>
  );

  const openEditModal = (section: string) => {
    setCurrentEditingSection(section);
    // Set working fields to current upload fields for this section
    setWorkingFields(uploadFields.filter(field => field.section === section));
    setNewField({
      label: '',
      accept: '.pdf,.jpg,.jpeg,.png',
      description: '',
      required: false,
      type: 'file'
    });
    setIsEditModalOpen(true);
  };

  const handleAddField = () => {
    if (!newField.label.trim()) return;

    const newCustomField: UploadField = {
      id: `custom-${Date.now()}`,
      ...newField,
      value: '',
      section: currentEditingSection || '',
      isPredefined: false
    };

    setWorkingFields([...workingFields, newCustomField]);
    setNewField({
      label: '',
      accept: '.pdf,.jpg,.jpeg,.png',
      description: '',
      required: false,
      type: 'file'
    });
  };

  const handleRemoveField = (id: string) => {
    setWorkingFields(workingFields.filter(field => field.id !== id));
  };

  const handleSaveFields = () => {
    // Update the main upload fields with the working fields
    const otherSectionsFields = uploadFields.filter(field => field.section !== currentEditingSection);
    const newUploadFields = [...otherSectionsFields, ...workingFields];
    setUploadFields(newUploadFields);

    // Save custom fields configuration to localStorage
    const customFields = newUploadFields.filter(field => !field.isPredefined);
    if (customFields.length > 0) {
      localStorage.setItem('mediaUploadsCustomFields', JSON.stringify(customFields));
    }

    // Save section-specific data to localStorage
    if (currentEditingSection) {
      const sectionFields = newUploadFields.filter(field => field.section === currentEditingSection);
      saveSectionToLocalStorage(currentEditingSection, sectionFields);
    }

    setIsEditModalOpen(false);
  };

  const getFieldsBySection = (section: string) => {
    return uploadFields.filter(field => field.section === section);
  };

  // Save section-specific data to localStorage
  const saveSectionToLocalStorage = (section: string, fields: UploadField[]) => {
    const sectionData = {
      fields: fields,
      timestamp: Date.now(),
      lastModified: new Date().toISOString()
    };

    switch (section) {
      case 'brand-images':
        localStorage.setItem('mediaUploadsBrandImages', JSON.stringify(sectionData));
        break;
      case 'documents':
        // Enhanced saving for Documents & Certificates section
        const documentsData = {
          ...sectionData,
          sectionType: 'documents',
          fieldCount: fields.length,
          requiredFields: fields.filter(f => f.required).map(f => f.id),
          optionalFields: fields.filter(f => !f.required).map(f => f.id),
          customFields: fields.filter(f => !f.isPredefined).map(f => f.id)
        };
        localStorage.setItem('mediaUploadsDocuments', JSON.stringify(documentsData));

        // Also save individual document field states
        fields.forEach(field => {
          const fieldKey = `document_${field.id}`;
          const fieldData = {
            id: field.id,
            label: field.label,
            value: field.value,
            accept: field.accept,
            required: field.required,
            description: field.description,
            lastUpdated: new Date().toISOString()
          };
          localStorage.setItem(fieldKey, JSON.stringify(fieldData));
        });
        break;
      case 'videos':
        localStorage.setItem('mediaUploadsVideos', JSON.stringify(sectionData));
        break;
      default:
        break;
    }
  };

  // Save file upload state to localStorage
  const saveFileUploadState = (fieldId: string, fileName: string, fileType: string) => {
    const uploadState = {
      fileName: fileName,
      fileType: fileType,
      uploadTime: new Date().toISOString(),
      fieldId: fieldId
    };

    const existingUploads = localStorage.getItem('mediaUploadsFileState') || '{}';
    try {
      const parsed = JSON.parse(existingUploads);
      parsed[fieldId] = uploadState;
      localStorage.setItem('mediaUploadsFileState', JSON.stringify(parsed));
    } catch (error) {
      console.error('Error saving file upload state:', error);
    }
  };

  // Clear all localStorage data for this component
  const clearLocalStorageData = () => {
    localStorage.removeItem('mediaUploadsBrandImages');
    localStorage.removeItem('mediaUploadsDocuments');
    localStorage.removeItem('mediaUploadsVideos');
    localStorage.removeItem('mediaUploadsPredefined');
    localStorage.removeItem('mediaUploadsCustomFields');
    localStorage.removeItem('mediaUploadsCustomValues');
    localStorage.removeItem('mediaUploadsFileState');
    localStorage.removeItem('mediaUploadsCompleteState');
  };

  // Export localStorage data for backup
  const exportLocalStorageData = () => {
    const exportData = {
      brandImages: localStorage.getItem('mediaUploadsBrandImages'),
      documents: localStorage.getItem('mediaUploadsDocuments'),
      videos: localStorage.getItem('mediaUploadsVideos'),
      predefined: localStorage.getItem('mediaUploadsPredefined'),
      customFields: localStorage.getItem('mediaUploadsCustomFields'),
      customValues: localStorage.getItem('mediaUploadsCustomValues'),
      fileState: localStorage.getItem('mediaUploadsFileState'),
      completeState: localStorage.getItem('mediaUploadsCompleteState'),
      exportTime: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mediaUploads_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Load Documents & Certificates data from localStorage
  const loadDocumentsFromLocalStorage = () => {
    const documentsData = localStorage.getItem('mediaUploadsDocuments');
    if (!documentsData) return null;

    try {
      const parsed = JSON.parse(documentsData);
      return parsed;
    } catch (error) {
      console.error('Error parsing Documents & Certificates data:', error);
      return null;
    }
  };

  // Save Documents & Certificates section specifically
  const saveDocumentsSection = () => {
    const documentsFields = uploadFields.filter(field => field.section === 'documents');
    saveSectionToLocalStorage('documents', documentsFields);

    // Also save to a specific documents backup key
    const documentsBackup = {
      section: 'documents',
      fields: documentsFields,
      lastSaved: new Date().toISOString(),
      totalFields: documentsFields.length,
      requiredFields: documentsFields.filter(f => f.required).length,
      optionalFields: documentsFields.filter(f => !f.required).length,
      customFields: documentsFields.filter(f => !f.isPredefined).length
    };

    localStorage.setItem('documentsSectionBackup', JSON.stringify(documentsBackup));
  };

  // Get Documents & Certificates section status
  const getDocumentsSectionStatus = () => {
    const documentsData = loadDocumentsFromLocalStorage();
    if (!documentsData) return { saved: false, lastModified: null, fieldCount: 0 };

    return {
      saved: true,
      lastModified: documentsData.lastModified,
      fieldCount: documentsData.fieldCount || 0,
      requiredFields: documentsData.requiredFields || [],
      optionalFields: documentsData.optionalFields || [],
      customFields: documentsData.customFields || []
    };
  };

  return (
    <FormStep
      title="Media Uploads"
      description="Upload your company logo, certificates, and other media assets."
      onNext={onNext}
      onPrev={onPrev}
      isValid={isValid}
      currentStep={7}
      totalSteps={6}
    >
      <div className="space-y-8">
        {/* Brand & Site Images */}
        <FileUploadSection
          title="Brand & Site Images"
          icon={Image}
          bgColor="bg-blue-50"
          sectionKey="brand-images"
        >
          <div className="space-y-6">
            {getFieldsBySection('brand-images').map(field => (
              <FileUploadBox key={field.id} field={field} />
            ))}
          </div>
          <p className="mt-4 text-sm text-blue-700">
            <strong>Note:</strong> AI will generate additional images and design elements for your website automatically.
          </p>
        </FileUploadSection>

        {/* Documents & Certificates */}
        <FileUploadSection
          title="Documents & Certificates"
          icon={FileText}
          bgColor="bg-green-50"
          sectionKey="documents"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {getFieldsBySection('documents').map(field => (
              <FileUploadBox key={field.id} field={field} />
            ))}
          </div>

          {/* Documents Section Status */}
          <div className="p-3 mt-4 bg-green-100 rounded-lg border border-green-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-green-800">
                <span className="font-semibold">Documents Status:</span>
                {getDocumentsSectionStatus().saved ? (
                  <span className="ml-2">✅ All changes saved to localStorage</span>
                ) : (
                  <span className="ml-2">⚠️ Not saved yet</span>
                )}
              </div>
              <button
                type="button"
                onClick={saveDocumentsSection}
                className="px-3 py-1 text-xs text-green-700 bg-green-200 rounded transition-colors hover:bg-green-300"
              >
                💾 Save Now
              </button>
            </div>
            {getDocumentsSectionStatus().saved && (
              <div className="mt-2 text-xs text-green-700">
                Last saved: {new Date(getDocumentsSectionStatus().lastModified || '').toLocaleString()}
              </div>
            )}
          </div>
        </FileUploadSection>

        {/* Videos & Links */}
        <FileUploadSection
          title="Videos & Promotional Content"
          icon={Video}
          bgColor="bg-purple-50"
          sectionKey="videos"
        >
          <div className="space-y-4">
            {getFieldsBySection('videos').map(field => (
              <FileUploadBox key={field.id} field={field} />
            ))}
          </div>

          <div className="p-4 mt-6 bg-purple-100 rounded-lg">
            <h4 className="mb-2 font-semibold text-purple-900">Video Guidelines:</h4>
            <ul className="space-y-1 text-sm text-purple-800">
              <li>• Videos should be 1080p or higher resolution</li>
              <li>• YouTube, Vimeo, or Google Drive links are preferred</li>
              <li>• Ensure videos are publicly accessible or properly shared</li>
              <li>• 5-minute video: Comprehensive company overview</li>
              <li>• 1-minute video: Quick highlights for social media</li>
            </ul>
          </div>
        </FileUploadSection>

        {/* Upload Summary */}
        <div className="p-6 rounded-lg bg-slate-100">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Upload Summary</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-semibold text-slate-800">Required Files:</h4>
              <ul className="space-y-1 text-sm">
                <li className={`flex items-center ${formData.companyLogoUrl ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="mr-2 w-2 h-2 bg-current rounded-full"></span>
                  Company Logo {formData.companyLogoUrl ? '✓' : '(Required)'}
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-slate-800">File Limits:</h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• Images: Maximum 5MB each</li>
                <li>• PDFs: Maximum 20MB each</li>
                <li>• All URLs must use HTTPS</li>
                <li>• Supported formats: JPG, PNG, SVG, PDF</li>
              </ul>
            </div>
          </div>

          <div className="p-4 mt-6 bg-green-50 rounded-lg border border-green-200">
            <h4 className="mb-2 font-semibold text-green-800">🎉 Ready to Generate Your Website!</h4>
            <p className="text-sm text-green-700">
              Once you click "Submit Form", our AI will create a professional website with all your information,
              generate additional content, optimize for SEO, and create a beautiful design that matches your industry.
            </p>
          </div>
        </div>

        {/* localStorage Management Section */}
        <div className="p-4 mt-6 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="mb-3 font-semibold text-gray-800">💾 Data Persistence Status</h4>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="text-sm text-gray-600">
              <p><strong>Brand & Site Images:</strong> {localStorage.getItem('mediaUploadsBrandImages') ? '✅ Saved' : '❌ Not Saved'}</p>
              <p><strong>Documents & Certificates:</strong> {getDocumentsSectionStatus().saved ? '✅ Saved' : '❌ Not Saved'}</p>
              <p><strong>Videos & Content:</strong> {localStorage.getItem('mediaUploadsVideos') ? '✅ Saved' : '❌ Not Saved'}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={exportLocalStorageData}
                className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded transition-colors hover:bg-blue-200"
              >
                📥 Export Data
              </button>
              <button
                type="button"
                onClick={clearLocalStorageData}
                className="px-3 py-1 text-xs text-red-600 bg-red-100 rounded transition-colors hover:bg-red-200"
              >
                🗑️ Clear Data
              </button>
            </div>
          </div>

          {/* Documents Section Detailed Status */}
          {getDocumentsSectionStatus().saved && (
            <div className="p-3 mt-3 bg-green-50 rounded border border-green-200">
              <h5 className="mb-2 font-semibold text-green-800">📄 Documents & Certificates Details:</h5>
              <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
                <p>Total Fields: {getDocumentsSectionStatus().fieldCount}</p>
                <p>Required Fields: {getDocumentsSectionStatus().requiredFields.length}</p>
                <p>Optional Fields: {getDocumentsSectionStatus().optionalFields.length}</p>
                <p>Custom Fields: {getDocumentsSectionStatus().customFields.length}</p>
              </div>
              <p className="mt-2 text-xs text-green-600">
                Last Modified: {new Date(getDocumentsSectionStatus().lastModified || '').toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal for managing upload fields */}
      {isEditModalOpen && (
        <div className="flex fixed inset-0 z-50 justify-center items-center backdrop-blur-sm bg-black/60">
          <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="flex gap-2 items-center text-xl font-bold text-gray-900">
                ✏️ Manage {currentEditingSection} Fields
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Add, remove, or modify upload fields for the {currentEditingSection} section
              </p>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-6">
              {/* Current Fields */}
              <div className="mb-8">
                <h4 className="mb-4 font-medium text-gray-700">Current Fields</h4>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {workingFields.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {workingFields.map((field) => (
                        <div
                          key={field.id}
                          className="flex justify-between items-center px-4 py-3 bg-white rounded-lg border border-gray-200"
                        >
                          <div className="flex-1">
                            <div className="flex gap-2 items-center">
                              <span className="text-sm font-medium">{field.label}</span>
                              {field.isPredefined && (
                                <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded">
                                  Predefined
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">{field.accept}</p>
                            {field.required && (
                              <span className="text-xs text-red-500">Required</span>
                            )}
                          </div>
                          <button
                            type="button"
                            className="ml-2 text-red-500 transition-colors hover:text-red-700"
                            onClick={() => handleRemoveField(field.id)}
                            disabled={field.id === 'company-logo'} // Don't allow removing company logo
                            title={field.id === 'company-logo' ? 'Company Logo cannot be removed' : 'Remove this field'}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-4 text-sm text-center text-gray-500">No fields added yet</p>
                  )}
                </div>
              </div>

              {/* Add New Field */}
              <div className="p-6 mb-6 bg-blue-50 rounded-lg">
                <h4 className="mb-4 font-medium text-blue-900">Add New Field</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Field Label *</label>
                    <input
                      type="text"
                      placeholder="e.g., Safety Certificate, Insurance Document, etc."
                      className="px-3 py-2 w-full rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={newField.label}
                      onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Field Type</label>
                    <select
                      className="px-3 py-2 w-full rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={newField.type}
                      onChange={(e) => setNewField({ ...newField, type: e.target.value as 'file' | 'url' })}
                    >
                      <option value="file">File Upload</option>
                      <option value="url">URL Input</option>
                    </select>
                  </div>

                  {newField.type === 'file' && (
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Accepted File Types</label>
                      <select
                        className="px-3 py-2 w-full rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={newField.accept}
                        onChange={(e) => setNewField({ ...newField, accept: e.target.value })}
                      >
                        <option value=".pdf,.jpg,.jpeg,.png">Documents & Images (PDF, JPG, PNG)</option>
                        <option value=".pdf">PDF Only</option>
                        <option value=".jpg,.jpeg,.png">Images Only (JPG, PNG)</option>
                        <option value=".png,.svg">Logos (PNG, SVG)</option>
                        <option value=".doc,.docx,.pdf">Documents (DOC, PDF)</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                    <input
                      type="text"
                      placeholder="e.g., Upload your safety certification document"
                      className="px-3 py-2 w-full rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={newField.description}
                      onChange={(e) => setNewField({ ...newField, description: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="required-field"
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      checked={newField.required}
                      onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                    />
                    <label htmlFor="required-field" className="block ml-2 text-sm text-gray-900">
                      Required field
                    </label>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      className="flex gap-2 items-center px-4 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
                      onClick={handleAddField}
                      disabled={!newField.label.trim()}
                    >
                      <Plus size={16} />
                      Add Field
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 justify-end p-6 bg-gray-50 border-t border-gray-200">
              <button
                type="button"
                className="px-4 py-2 font-medium text-gray-700 rounded-lg transition-colors hover:text-gray-900"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex gap-1 items-center px-4 py-2 font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
                onClick={handleSaveFields}
              >
                ✅ Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </FormStep>
  );
};

export default Step8MediaUploads;