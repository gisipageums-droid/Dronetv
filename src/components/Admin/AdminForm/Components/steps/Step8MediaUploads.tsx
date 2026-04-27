import React, { useState, useEffect, useRef } from 'react';
import { FormStep } from '../FormStep';
import { FormInput } from '../FormInput';
import { StepProps } from '../../types/form';
import { Upload, FileText, Image, Video, Edit3, Plus, Trash2, Check, X, Loader2 } from 'lucide-react';

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

interface BrandImageField {
  id: string;
  label: string;
  description: string;
  entityType: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentField {
  id: string;
  label: string;
  description: string;
  entityType: string;
  documentType: string;
  createdAt: string;
  updatedAt: string;
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

  // API state for brand-images
  const [isLoadingBrandImages, setIsLoadingBrandImages] = useState(false);
  const [brandImagesError, setBrandImagesError] = useState<string | null>(null);
  const [isUpdatingBrandImage, setIsUpdatingBrandImage] = useState(false);
  const [isAddingBrandImage, setIsAddingBrandImage] = useState(false);
  const [isDeletingBrandImage, setIsDeletingBrandImage] = useState(false);

  // API state for documents
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [isUpdatingDocument, setIsUpdatingDocument] = useState(false);
  const [isDeletingDocument, setIsDeletingDocument] = useState(false);
  const [isAddingDocument, setIsAddingDocument] = useState(false);

  // Inline edit state for fields inside the modal
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<Partial<UploadField>>({});

  const isInitialLoad = useRef(true);

  // API function to fetch brand-images data
  const fetchBrandImages = async () => {
    setIsLoadingBrandImages(true);
    setBrandImagesError(null);

    try {
      const response = await fetch('https://wnznublu2f.execute-api.ap-south-1.amazonaws.com/media-uploads/brand-images/view', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Brand images API response:', data);

      if (data.items && Array.isArray(data.items)) {
        // Update working fields with API data
        const apiFields: UploadField[] = data.items.map((field: BrandImageField) => ({
          id: field.id,
          label: field.label,
          description: field.description,
          accept: '.png,.svg,.jpg,.jpeg',
          required: true,
          type: 'file' as const,
          value: '',
          section: 'brand-images',
          isPredefined: false
        }));

        setWorkingFields(apiFields);

        // Also update the main upload fields to show in the main form
        setUploadFields(prevFields => {
          // Remove existing brand-images fields and add new ones
          const otherFields = prevFields.filter(field => field.section !== 'brand-images');
          return [...otherFields, ...apiFields];
        });
      } else {
        setBrandImagesError('Invalid data format received from API');
      }
    } catch (error) {
      console.error('Error fetching brand images:', error);
      setBrandImagesError(error instanceof Error ? error.message : 'Failed to fetch brand images');
    } finally {
      setIsLoadingBrandImages(false);
    }
  };

  // API function to fetch documents data
  const fetchDocuments = async () => {
    setIsLoadingDocuments(true);
    setDocumentsError(null);

    try {
      const response = await fetch('https://wnznublu2f.execute-api.ap-south-1.amazonaws.com/media-uploads/Documents-Certificates/view', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Documents API response:', data);

      if (data.items && Array.isArray(data.items)) {
        // Update working fields with API data
        const apiFields: UploadField[] = data.items.map((field: DocumentField) => ({
          id: field.id,
          label: field.label,
          description: field.description,
          accept: '.pdf,.jpg,.jpeg,.png',
          required: false,
          type: 'file' as const,
          value: '',
          section: 'documents',
          isPredefined: false
        }));

        setWorkingFields(apiFields);

        // Also update the main upload fields to show in the main form
        setUploadFields(prevFields => {
          // Remove existing documents fields and add new ones
          const otherFields = prevFields.filter(field => field.section !== 'documents');
          return [...otherFields, ...apiFields];
        });
      } else {
        setDocumentsError('Invalid data format received from API');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocumentsError(error instanceof Error ? error.message : 'Failed to fetch documents');
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  // API function to update document field
  const updateDocumentField = async (fieldId: string, label: string, description: string, documentType: string) => {
    setIsUpdatingDocument(true);

    try {
      const response = await fetch(`https://wnznublu2f.execute-api.ap-south-1.amazonaws.com/media-uploads/Documents-Certificates/update/${fieldId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label: label,
          description: description,
          documentType: documentType
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Document update response:', data);

      // Refresh the data after successful update
      await fetchDocuments();

      return { success: true, data };
    } catch (error) {
      console.error('Error updating document:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update document' };
    } finally {
      setIsUpdatingDocument(false);
    }
  };

  // API function to delete document field
  const deleteDocumentField = async (fieldId: string) => {
    setIsDeletingDocument(true);

    try {
      const response = await fetch(`https://wnznublu2f.execute-api.ap-south-1.amazonaws.com/media-uploads/Documents-Certificates/delete/${fieldId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Document delete response:', data);

      // Refresh the data after successful delete
      await fetchDocuments();

      return { success: true, data };
    } catch (error) {
      console.error('Error deleting document:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to delete document' };
    } finally {
      setIsDeletingDocument(false);
    }
  };

  // API function to add new document field
  const addDocumentField = async (label: string, description: string, documentType: string) => {
    setIsAddingDocument(true);

    try {
      const response = await fetch('https://wnznublu2f.execute-api.ap-south-1.amazonaws.com/media-uploads/Documents-Certificates/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label: label,
          description: description,
          documentType: documentType
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Document add response:', data);

      // Refresh the data after successful add
      await fetchDocuments();

      return { success: true, data };
    } catch (error) {
      console.error('Error adding document:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to add document' };
    } finally {
      setIsAddingDocument(false);
    }
  };

  // API function to update brand-image field
  const updateBrandImageField = async (fieldId: string, label: string, description: string) => {
    setIsUpdatingBrandImage(true);

    try {
      const response = await fetch(`https://wnznublu2f.execute-api.ap-south-1.amazonaws.com/media-uploads/brand-images/update/${fieldId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label: label,
          description: description
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Brand image update response:', data);

      // Refresh the data after successful update
      await fetchBrandImages();

      return { success: true, data };
    } catch (error) {
      console.error('Error updating brand image:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update brand image' };
    } finally {
      setIsUpdatingBrandImage(false);
    }
  };

  // API function to add new brand-image field
  const addBrandImageField = async (label: string, description: string) => {
    setIsAddingBrandImage(true);

    try {
      const response = await fetch('https://wnznublu2f.execute-api.ap-south-1.amazonaws.com/media-uploads/brand-images/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label: label,
          description: description
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Brand image add response:', data);

      // Refresh the data after successful add
      await fetchBrandImages();

      return { success: true, data };
    } catch (error) {
      console.error('Error adding brand image:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to add brand image' };
    } finally {
      setIsAddingBrandImage(false);
    }
  };

  // API function to delete brand-image field
  const deleteBrandImageField = async (fieldId: string) => {
    setIsDeletingBrandImage(true);

    try {
      const response = await fetch(`https://wnznublu2f.execute-api.ap-south-1.amazonaws.com/media-uploads/brand-images/delete/${fieldId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Brand image delete response:', data);

      // Refresh the data after successful delete
      await fetchBrandImages();

      return { success: true, data };
    } catch (error) {
      console.error('Error deleting brand image:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to delete brand image' };
    } finally {
      setIsDeletingBrandImage(false);
    }
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      // Load brand-images data on component mount
      fetchBrandImages();
      // Load documents data on component mount
      fetchDocuments();
    }
  }, []);

  // Initialize upload fields from formData
  useEffect(() => {
    // Initialize with empty arrays and values
    let customFields: UploadField[] = [];
    let predefinedValues: Record<string, string> = {};
    let savedBrandImages: UploadField[] = [];
    let savedDocuments: UploadField[] = [];
    let deletedDocumentFields: string[] = [];

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

      // Only include predefined document fields if they haven't been deleted
      ...(deletedDocumentFields.includes('company-brochure') ? [] : [{
        id: 'company-brochure',
        label: 'Company Brochure',
        accept: '.pdf',
        description: 'Company brochure PDF, max 20MB',
        required: false,
        type: 'file' as const,
        value: (savedDocuments.find(f => f.id === 'company-brochure')?.value) || predefinedValues.brochurePdfUrl || formData.brochurePdfUrl || '',
        section: 'documents',
        isPredefined: true
      }]),

      ...(deletedDocumentFields.includes('product-catalogue') ? [] : [{
        id: 'product-catalogue',
        label: 'Product Catalogue',
        accept: '.pdf',
        description: 'Product catalogue PDF, max 20MB',
        required: false,
        type: 'file' as const,
        value: (savedDocuments.find(f => f.id === 'product-catalogue')?.value) || predefinedValues.cataloguePdfUrl || formData.cataloguePdfUrl || '',
        section: 'documents',
        isPredefined: true
      }]),

      ...(deletedDocumentFields.includes('case-studies') ? [] : [{
        id: 'case-studies',
        label: 'Case Studies',
        accept: '.pdf,.doc,.docx',
        description: 'Case studies document, max 20MB',
        required: false,
        type: 'file' as const,
        value: (savedDocuments.find(f => f.id === 'case-studies')?.value) || predefinedValues.caseStudiesUrl || formData.caseStudiesUrl || '',
        section: 'documents',
        isPredefined: true
      }]),

      ...(deletedDocumentFields.includes('brand-guidelines') ? [] : [{
        id: 'brand-guidelines',
        label: 'Brand Guidelines',
        accept: '.pdf',
        description: 'Brand guidelines PDF, max 20MB',
        required: false,
        type: 'file' as const,
        value: (savedDocuments.find(f => f.id === 'brand-guidelines')?.value) || predefinedValues.brandGuidelinesUrl || formData.brandGuidelinesUrl || '',
        section: 'documents',
        isPredefined: true
      }]),

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
    saveSectionToLocalStorage('brand-images');
    saveSectionToLocalStorage('documents');
    saveSectionToLocalStorage('videos');
  }, [formData]);


  const updateFieldValue = (id: string, value: string) => {
    setUploadFields(prev => {
      const updatedFields = prev.map(field =>
        field.id === id ? { ...field, value } : field
      );

      // Save section data to localStorage after updating
      const updatedField = updatedFields.find(field => field.id === id);
      if (updatedField) {
        saveSectionToLocalStorage(updatedField.section);

        // Special handling for Documents & Certificates section
        if (updatedField.section === 'documents') {
          // Individual document field handled
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
    } else if (id.startsWith('custom-')) {
      // Handle custom fields
      const newCustomUploads = {
        ...formData.customUploads,
        [id]: value
      };
      updateFormData({ customUploads: newCustomUploads });

      // Save custom uploads to localStorage
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
      <div className="flex absolute top-4 right-4 gap-2">
        {sectionKey === 'brand-images' && (
          <button
            type="button"
            onClick={fetchBrandImages}
            disabled={isLoadingBrandImages}
            className="p-1 text-slate-500 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh brand images data"
          >
            <Loader2 className={`w-4 h-4 ${isLoadingBrandImages ? 'animate-spin' : ''}`} />
          </button>
        )}
        {sectionKey === 'documents' && (
          <button
            type="button"
            onClick={fetchDocuments}
            disabled={isLoadingDocuments}
            className="p-1 text-slate-500 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh documents data"
          >
            <Loader2 className={`w-4 h-4 ${isLoadingDocuments ? 'animate-spin' : ''}`} />
          </button>
        )}
        <button
          type="button"
          onClick={() => openEditModal(sectionKey)}
          className="p-1 text-slate-500 hover:text-slate-700"
          title={`Edit ${title} options`}
        >
          <Edit3 size={16} />
        </button>
      </div>
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
                saveFileUploadState();
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

    // Fetch brand-images data when opening brand-images modal
    if (section === 'brand-images') {
      fetchBrandImages();
    }

    // Fetch documents data when opening documents modal
    if (section === 'documents') {
      fetchDocuments();
    }

    setIsEditModalOpen(true);
  };

  const handleAddField = async () => {
    if (!newField.label.trim()) return;

    // If this is a brand-image field, call the add API
    if (currentEditingSection === 'brand-images') {
      const result = await addBrandImageField(newField.label, newField.description);
      if (!result.success) {
        console.error('Failed to add brand image:', result.error);
        return;
      }
      // API call will refresh the data automatically
    } else if (currentEditingSection === 'documents') {
      // If this is a documents field, call the add API
      const documentType = 'COMPANY_BROCHURE'; // Default document type
      const result = await addDocumentField(newField.label, newField.description, documentType);
      if (!result.success) {
        console.error('Failed to add document:', result.error);
        return;
      }
      // API call will refresh the data automatically
    } else {
      // For other sections, add locally
      const newCustomField: UploadField = {
        id: `custom-${Date.now()}`,
        ...newField,
        value: '',
        section: currentEditingSection || '',
        isPredefined: false
      };

      setWorkingFields([...workingFields, newCustomField]);
    }

    setNewField({
      label: '',
      accept: '.pdf,.jpg,.jpeg,.png',
      description: '',
      required: false,
      type: 'file'
    });
  };

  const handleRemoveField = async (id: string) => {
    // If this is a brand-image field, call the delete API
    if (currentEditingSection === 'brand-images') {
      const result = await deleteBrandImageField(id);
      if (!result.success) {
        console.error('Failed to delete brand image:', result.error);
        return;
      }
      // API call will refresh the data automatically
    } else if (currentEditingSection === 'documents') {
      // If this is a documents field, call the delete API
      const result = await deleteDocumentField(id);
      if (!result.success) {
        console.error('Failed to delete document:', result.error);
        return;
      }
      // API call will refresh the data automatically
    } else {
      // For other sections, remove locally
      setWorkingFields(workingFields.filter(field => field.id !== id));

      // For predefined fields, handle deletion
      if (currentEditingSection === 'documents') {
        // Field removed successfully
      }
    }
  };

  const handleStartEditField = (field: UploadField) => {
    setEditingFieldId(field.id);
    setEditingDraft({ ...field });
  };

  const handleCancelEditField = () => {
    setEditingFieldId(null);
    setEditingDraft({});
  };

  const handleSaveEditField = async () => {
    if (!editingFieldId) return;

    const updatedField = workingFields.find(f => f.id === editingFieldId);
    if (!updatedField) return;

    const newLabel = (editingDraft.label ?? updatedField.label) as string;
    const newDescription = (editingDraft.description ?? updatedField.description) as string;

    // If this is a brand-image field, call the update API
    if (currentEditingSection === 'brand-images') {
      const result = await updateBrandImageField(updatedField.id, newLabel, newDescription);
      if (!result.success) {
        console.error('Failed to update brand image:', result.error);
        return;
      }
    }

    // If this is a documents field, call the update API
    if (currentEditingSection === 'documents') {
      // For documents, we need to determine the documentType
      // We can use a mapping or default to COMPANY_BROCHURE
      const documentType = 'COMPANY_BROCHURE'; // Default document type
      const result = await updateDocumentField(updatedField.id, newLabel, newDescription, documentType);
      if (!result.success) {
        console.error('Failed to update document:', result.error);
        return;
      }
    }

    const updated = workingFields.map(f =>
      f.id === editingFieldId
        ? {
          ...f,
          label: newLabel,
          description: newDescription,
          accept: (editingDraft.accept ?? f.accept) as string,
          required: (editingDraft.required ?? f.required) as boolean,
          type: (editingDraft.type ?? f.type) as 'file' | 'url',
        }
        : f
    );
    setWorkingFields(updated);
    setEditingFieldId(null);
    setEditingDraft({});
  };

  const handleSaveFields = () => {
    // Update the main upload fields with the working fields
    const otherSectionsFields = uploadFields.filter(field => field.section !== currentEditingSection);
    const newUploadFields = [...otherSectionsFields, ...workingFields];
    setUploadFields(newUploadFields);

    // Save custom fields configuration to localStorage
    const customFields = newUploadFields.filter(field => !field.isPredefined);
    if (customFields.length > 0) {
    }

    // Save section-specific data to localStorage
    if (currentEditingSection) {
      saveSectionToLocalStorage(currentEditingSection);
    }

    setIsEditModalOpen(false);
  };

  const getFieldsBySection = (section: string) => {
    return uploadFields.filter(field => field.section === section);
  };

  // Save section-specific data to localStorage
  const saveSectionToLocalStorage = (section: string) => {
    switch (section) {
      case 'brand-images':
        break;
      case 'documents':
        // Enhanced saving for Documents & Certificates section
        // Individual document field states handled
        break;
      case 'videos':
        break;
      default:
        break;
    }
  };

  // Save file upload state
  const saveFileUploadState = () => {
    // File upload state saved
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
                  {/* Loading state for brand-images */}
                  {currentEditingSection === 'brand-images' && isLoadingBrandImages && (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                      <span className="ml-2 text-blue-600">Loading brand images data...</span>
                    </div>
                  )}

                  {/* Loading state for documents */}
                  {currentEditingSection === 'documents' && isLoadingDocuments && (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                      <span className="ml-2 text-blue-600">Loading documents data...</span>
                    </div>
                  )}

                  {/* Error state for brand-images */}
                  {currentEditingSection === 'brand-images' && brandImagesError && (
                    <div className="p-4 mb-4 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-red-600">Error: {brandImagesError}</p>
                      <button
                        type="button"
                        onClick={fetchBrandImages}
                        className="px-3 py-1 mt-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {/* Error state for documents */}
                  {currentEditingSection === 'documents' && documentsError && (
                    <div className="p-4 mb-4 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-red-600">Error: {documentsError}</p>
                      <button
                        type="button"
                        onClick={fetchDocuments}
                        className="px-3 py-1 mt-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {workingFields.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {workingFields.map((field) => (
                        <div
                          key={field.id}
                          className="px-4 py-3 bg-white rounded-lg border border-gray-200"
                        >
                          {editingFieldId === field.id ? (
                            <div className="space-y-2">
                              <div className="grid grid-cols-1 gap-2">
                                <div>
                                  <label className="block mb-1 text-xs font-medium text-gray-700">Label</label>
                                  <input
                                    type="text"
                                    className="px-2 py-1 w-full text-sm rounded border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={(editingDraft.label as string) ?? field.label}
                                    onChange={(e) => setEditingDraft(d => ({ ...d, label: e.target.value }))}
                                  />
                                </div>
                                <div>
                                  <label className="block mb-1 text-xs font-medium text-gray-700">Description</label>
                                  <input
                                    type="text"
                                    className="px-2 py-1 w-full text-sm rounded border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={(editingDraft.description as string) ?? field.description}
                                    onChange={(e) => setEditingDraft(d => ({ ...d, description: e.target.value }))}
                                  />
                                </div>
                                <div>
                                  <label className="block mb-1 text-xs font-medium text-gray-700">Type</label>
                                  <select
                                    className="px-2 py-1 w-full text-sm rounded border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={(editingDraft.type as 'file' | 'url') ?? field.type}
                                    onChange={(e) => setEditingDraft(d => ({ ...d, type: e.target.value as 'file' | 'url' }))}
                                  >
                                    <option value="file">File Upload</option>
                                    <option value="url">URL Input</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block mb-1 text-xs font-medium text-gray-700">Accepted Types</label>
                                  <input
                                    type="text"
                                    className="px-2 py-1 w-full text-sm rounded border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={(editingDraft.accept as string) ?? field.accept}
                                    onChange={(e) => setEditingDraft(d => ({ ...d, accept: e.target.value }))}
                                    placeholder="e.g., .pdf,.jpg,.jpeg,.png"
                                  />
                                </div>
                                <label className="inline-flex gap-2 items-center text-xs text-gray-700">
                                  <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    checked={(editingDraft.required as boolean) ?? field.required}
                                    onChange={(e) => setEditingDraft(d => ({ ...d, required: e.target.checked }))}
                                  />
                                  Required
                                </label>
                              </div>
                              <div className="flex gap-2 justify-end">
                                <button
                                  type="button"
                                  className="inline-flex gap-1 items-center px-2 py-1 text-xs text-gray-700 rounded border border-gray-300 hover:bg-gray-50"
                                  onClick={handleCancelEditField}
                                  title="Cancel"
                                >
                                  <X size={14} />
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  className="inline-flex gap-1 items-center px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                  onClick={handleSaveEditField}
                                  disabled={isUpdatingBrandImage || isUpdatingDocument}
                                  title="Save"
                                >
                                  {(isUpdatingBrandImage || isUpdatingDocument) ? (
                                    <>
                                      <Loader2 size={14} className="animate-spin" />
                                      Updating...
                                    </>
                                  ) : (
                                    <>
                                      <Check size={14} />
                                      Save
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center">
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
                              <div className="flex gap-2 items-center ml-2">
                                <button
                                  type="button"
                                  className="text-yellow-600 hover:text-yellow-700"
                                  title="Edit this field"
                                  onClick={() => handleStartEditField(field)}
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button
                                  type="button"
                                  className="text-red-500 transition-colors hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                  onClick={() => handleRemoveField(field.id)}
                                  disabled={field.id === 'company-logo' || isDeletingBrandImage || isDeletingDocument}
                                  title={field.id === 'company-logo' ? 'Company Logo cannot be removed' : 'Remove this field'}
                                >
                                  {(isDeletingBrandImage || isDeletingDocument) ? (
                                    <Loader2 size={16} className="animate-spin" />
                                  ) : (
                                    <Trash2 size={16} />
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
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
                      className="flex gap-2 items-center px-4 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleAddField}
                      disabled={!newField.label.trim() || isAddingBrandImage || isAddingDocument}
                    >
                      {(isAddingBrandImage || isAddingDocument) ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus size={16} />
                          Add Field
                        </>
                      )}
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