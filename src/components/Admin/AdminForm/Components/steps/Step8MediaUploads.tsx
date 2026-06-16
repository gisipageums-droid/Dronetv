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
};

export default Step8MediaUploads;