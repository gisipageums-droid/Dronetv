
import { useState, useEffect } from "react";
import { useForm } from "../../context/FormContext";
import { Plus, Minus, Trash2, Globe, Mail, Phone, MapPin, Share2, Calendar, Upload, Eye, X, RefreshCw, FileText, Image as ImageIcon, Video } from "lucide-react";
import { PhoneInput } from "../common/PhoneInput";

interface ExhibitorInterview {
  videoTitle: string;
  videoUrl: string;
}

interface MediaGalleryItem {
  mediaUrl: string;
  mediaType: string;
  fileName?: string;
  file?: File;
  uploaded?: boolean;
  uploading?: boolean;
  error?: string;
}

interface HeroBanner {
  mediaUrl: string;
  mediaType: string;
  fileName?: string;
  file?: File;
  uploaded?: boolean;
  uploading?: boolean;
  error?: string;
}

interface ContactInfo {
  phone: { phoneNumber: string }[];
  email: string;
  address: string;
}

interface InternationalContact {
  name: string;
  phone: string;
  email: string;
  organization: string;
}

interface SocialLinks {
  facebook: string;
  linkedin: string;
  instagram: string;
}

// Updated API response interface to match your Lambda response
interface UploadResponse {
  success: boolean;
  imageUrl: string;
  s3Url?: string;
  fileName?: string;
  contentType?: string;
  sizeBytes?: number;
  sizeMB?: string;
  uploadedAt?: string;
  fieldName?: string;
  uploadType?: string;
  metadata?: {
    userId: string;
    originalFileName: string;
    s3Key: string;
    uploadType: string;
  };
  error?: string;
}

export const Step5 = ({ step, setStepValid }: { step: any; setStepValid?: (valid: boolean) => void }) => {
  const { data, addArrayItem, removeArrayItem, updateField } = useForm();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Initialize data if not present - FIXED: Proper initialization for contactInfo
  const exhibitorInterviews = data.exhibitorInterviews || [];
  const mediaGallery = data.mediaGallery || [];
  const heroBanner = data.heroBanner || { 
    mediaUrl: "", 
    mediaType: "image", 
    fileName: "", 
    uploaded: false, 
    uploading: false, 
    error: "" 
  };
  const contactInfo = data.contactInfo || { phone: [{ phoneNumber: "" }], email: "", address: "" };
  const internationalContacts = data.internationalContacts || [];
  const socialLinks = data.socialLinks || { facebook: "", linkedin: "", instagram: "" };
  const tags = data.tags || [];
  const published = data.published || false;
  const lastModified = data.lastModified || "";
  const backgroundVideoUrl = data.backgroundVideoUrl || "";

  // Get userId from your form data or context - make sure this is an email
  const userId = "event-user@example.com"; // Use a default email for events

  // State for full view modal
  const [fullViewUrl, setFullViewUrl] = useState<string | null>(null);
  const [fullViewType, setFullViewType] = useState<string | null>(null);
  const [fullViewFileName, setFullViewFileName] = useState<string | null>(null);

  const baseInputClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full";
  const baseTextareaClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full min-h-[80px] resize-vertical";

  // Initialize media gallery with 3 image slots and 3 document slots
  useEffect(() => {
    if (!data.mediaGallery || data.mediaGallery.length === 0) {
      const initialSlots = Array(6).fill(null).map((_, index) => ({ 
        mediaUrl: "", 
        mediaType: index < 3 ? "image" : "document",
        fileName: "",
        uploaded: false,
        uploading: false,
        error: ""
      }));
      updateField("mediaGallery", initialSlots);
    }
  }, [data.mediaGallery, updateField]);

  // Clean up blob URLs on unmount
  useEffect(() => {
    return () => {
      mediaGallery.forEach((media) => {
        if (media.mediaUrl && media.mediaUrl.startsWith('blob:')) {
          URL.revokeObjectURL(media.mediaUrl);
        }
      });
      // Clean up hero banner blob URL
      if (heroBanner.mediaUrl && heroBanner.mediaUrl.startsWith('blob:')) {
        URL.revokeObjectURL(heroBanner.mediaUrl);
      }
    };
  }, []);

  // FIXED: Better file type detection function
  const getFileType = (file: File | string): string => {
    if (typeof file === 'string') {
      // If it's a URL string
      const lower = file.toLowerCase();
      if (lower.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/) || file.startsWith('data:image')) {
        return 'image';
      } else if (lower.endsWith(".pdf")) {
        return 'pdf';
      } else if (lower.match(/\.(doc|docx)$/)) {
        return 'word';
      } else if (lower.match(/\.(xls|xlsx)$/)) {
        return 'excel';
      } else if (lower.match(/\.(ppt|pptx)$/)) {
        return 'powerpoint';
      } else if (lower.match(/\.(txt)$/)) {
        return 'text';
      } else {
        return 'document';
      }
    } else {
      // If it's a File object
      if (file.type.startsWith('image/')) {
        return 'image';
      } else if (file.type === 'application/pdf') {
        return 'pdf';
      } else if (file.type.includes('word') || file.name.match(/\.(doc|docx)$/)) {
        return 'word';
      } else if (file.type.includes('excel') || file.type.includes('spreadsheet') || file.name.match(/\.(xls|xlsx)$/)) {
        return 'excel';
      } else if (file.type.includes('powerpoint') || file.type.includes('presentation') || file.name.match(/\.(ppt|pptx)$/)) {
        return 'powerpoint';
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        return 'text';
      } else {
        return 'document';
      }
    }
  };

  // FIXED: Get appropriate icon for file type
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <ImageIcon className="w-6 h-6 text-blue-500" />;
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'word':
        return <FileText className="w-6 h-6 text-blue-600" />;
      case 'excel':
        return <FileText className="w-6 h-6 text-green-600" />;
      case 'powerpoint':
        return <FileText className="w-6 h-6 text-orange-500" />;
      case 'text':
        return <FileText className="w-6 h-6 text-gray-600" />;
      default:
        return <FileText className="w-6 h-6 text-gray-500" />;
    }
  };

  // FIXED: Get display name for file type
  const getFileTypeDisplayName = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return 'Image';
      case 'pdf':
        return 'PDF Document';
      case 'word':
        return 'Word Document';
      case 'excel':
        return 'Excel Spreadsheet';
      case 'powerpoint':
        return 'PowerPoint Presentation';
      case 'text':
        return 'Text File';
      default:
        return 'Document';
    }
  };

  // const uploadToBucket = async (file: File, index: number): Promise<string> => {
  //   const formData = new FormData();
    
  //   if (!userId) {
  //     throw new Error('userId is not defined');
  //   }

  //   // Use the exact field names the API expects
  //   formData.append('file', file); // ACTUAL FILE - not 'files'
  //   formData.append('userId', userId); // USER ID (email)
  //   formData.append('fieldName', file.name); // FILE NAME - not 'originalFileName'

  //   try {
  //     console.log('Starting upload for file:', file.name, 'size:', file.size, 'type:', file.type);
  //     console.log('Form data fields:', {
  //       userId: userId,
  //       fieldName: file.name,
  //       file: file
  //     });

  //     // DEBUG: Log what's actually in formData
  //     console.log('Actual FormData entries:');
  //     for (let [key, value] of formData.entries()) {
  //       console.log(`  ${key}:`, value);
  //     }
      
  //     const response = await fetch('https://v96xyrv321.execute-api.ap-south-1.amazonaws.com/prod/upload/events', {
  //       method: 'POST',
  //       body: formData,
  //       // Don't set Content-Type header - let browser set it with boundary
  //     });

  //     console.log('Upload response status:', response.status);
      
  //     if (!response.ok) {
  //       let errorText = 'Unknown error';
  //       try {
  //         errorText = await response.text();
  //       } catch (e) {
  //         console.error('Could not read error response:', e);
  //       }
  //       console.error('Upload failed with response:', errorText);
  //       throw new Error(`Upload failed with status: ${response.status}. ${errorText}`);
  //     }

  //     const responseData: UploadResponse = await response.json();
  //     console.log('Upload API response:', responseData);
      
  //     if (!responseData.success) {
  //       throw new Error(responseData.error || 'Upload failed on server');
  //     }

  //     if (!responseData.imageUrl) {
  //       throw new Error('No URL returned from upload API');
  //     }

  //     return responseData.imageUrl;
  //   } catch (error) {
  //     console.error('Upload error:', error);
  //     throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  //   }
  // };

  const uploadToBucket = async (file: File, index: number): Promise<string> => {
  const formData = new FormData();
  
  if (!userId) {
    throw new Error('userId is not defined');
  }

  // Use the exact field names the API expects
  formData.append('file', file); // ACTUAL FILE - not 'files'
  formData.append('userId', userId); // USER ID (email)
  formData.append('fieldName', file.name); // FILE NAME - not 'originalFileName'

  try {
    console.log('Starting upload for file:', file.name, 'size:', file.size, 'type:', file.type);
    console.log('Form data fields:', {
      userId: userId,
      fieldName: file.name,
      file: file
    });

    // DEBUG: Log what's actually in formData
    console.log('Actual FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }
    
    const response = await fetch('https://v96xyrv321.execute-api.ap-south-1.amazonaws.com/prod/upload/events', {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - let browser set it with boundary
    });

    console.log('Upload response status:', response.status);
    
    if (!response.ok) {
      let errorText = 'Unknown error';
      try {
        errorText = await response.text();
      } catch (e) {
        console.error('Could not read error response:', e);
      }
      console.error('Upload failed with response:', errorText);
      throw new Error(`Upload failed with status: ${response.status}. ${errorText}`);
    }

    const responseData: UploadResponse = await response.json();
    console.log('Upload API response:', responseData);
    
    if (!responseData.success) {
      throw new Error(responseData.error || 'Upload failed on server');
    }

    // ✅ CHANGED: Use s3Url instead of imageUrl
    if (!responseData.s3Url) {
      throw new Error('No s3Url returned from upload API');
    }

    return responseData.s3Url;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

  // FIXED: Enhanced full view function with better file type detection
  const openFullView = (url: string, fileName: string, mediaType?: string) => {
    let fileType = mediaType || getFileType(url);
    
    setFullViewUrl(url);
    setFullViewType(fileType);
    setFullViewFileName(fileName);
  };

  // Function to close full view
  const closeFullView = () => {
    setFullViewUrl(null);
    setFullViewType(null);
    setFullViewFileName(null);
  };

  // Render full view modal (similar to professionals version)
  const renderFullViewModal = () => {
    if (!fullViewUrl || !fullViewType) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl max-h-[80vh] w-full flex flex-col mt-12">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {fullViewFileName}
            </h3>
            <button
              onClick={closeFullView}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4">
            {fullViewType === 'image' ? (
              <div className="flex justify-center">
                <img
                  src={fullViewUrl}
                  alt="Full view"
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>
            ) : fullViewType === 'pdf' ? (
              <div className="w-full h-[70vh]">
                <iframe
                  src={fullViewUrl}
                  className="w-full h-full border-0"
                  title="PDF Document"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="text-center p-6">
                  {getFileIcon(fullViewType)}
                  <p className="text-lg font-medium text-gray-700 mb-2 mt-4">
                    {getFileTypeDisplayName(fullViewType)}
                  </p>
                  <p className="text-gray-500 mb-4">
                    This document type cannot be previewed in the browser.
                  </p>
                  <a
                    href={fullViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={closeFullView}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Download & Open
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-4 border-t bg-gray-50 rounded-b-xl">
            <span className="text-sm text-gray-600 capitalize">
              {getFileTypeDisplayName(fullViewType)}
            </span>
            <div className="flex gap-2">
              <a
                href={fullViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={closeFullView}
              >
                Open in New Tab
              </a>
              <a
                href={fullViewUrl}
                download={fullViewFileName}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                onClick={closeFullView}
              >
                Download
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Handle file upload with better error handling
  const handleFileUpload = async (index: number, file: File) => {
    // Create a local URL for preview
    const objectUrl = URL.createObjectURL(file);
    const fileType = getFileType(file);
    
    const newMedia = [...mediaGallery];
    newMedia[index] = { 
      ...newMedia[index], 
      mediaUrl: objectUrl, // Temporary local URL for preview
      mediaType: fileType,
      file: file,
      fileName: file.name,
      uploading: true,
      uploaded: false,
      error: ""
    };
    updateField("mediaGallery", newMedia);

    try {
      console.log(`Uploading file ${index}:`, file.name);
      
      // Upload to bucket API
      const uploadedUrl = await uploadToBucket(file, index);
      
      console.log(`Upload successful for file ${index}:`, uploadedUrl);
      
      // IMPORTANT: Get the latest mediaGallery state to avoid stale closure
      const currentMediaGallery = data.mediaGallery || mediaGallery;
      const updatedMedia = [...currentMediaGallery];
      updatedMedia[index] = { 
        ...updatedMedia[index], 
        mediaUrl: uploadedUrl, // This should be the actual S3 URL
        mediaType: fileType,
        file: undefined, // Remove file object to avoid serialization issues
        uploading: false,
        uploaded: true,
        error: ""
      };
      
      // Update the form context with the actual S3 URL
      updateField("mediaGallery", updatedMedia);
      
      // Clean up the local object URL after updating with S3 URL
      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 1000);
      
    } catch (error) {
      console.error(`Upload failed for file ${index}:`, error);
      
      // Get current state to avoid stale closure
      const currentMediaGallery = data.mediaGallery || mediaGallery;
      const errorMedia = [...currentMediaGallery];
      errorMedia[index] = { 
        ...errorMedia[index], 
        uploading: false,
        uploaded: false,
        error: error instanceof Error ? error.message : 'Upload failed. Please try again.'
      };
      updateField("mediaGallery", errorMedia);
    }
  };

  const handleRemoveFile = (index: number) => {
    const currentMediaGallery = data.mediaGallery || mediaGallery;
    const newMedia = [...currentMediaGallery];
    const currentMedia = newMedia[index];
    
    // Revoke object URL if it's a local blob URL
    if (currentMedia.mediaUrl && currentMedia.mediaUrl.startsWith('blob:')) {
      URL.revokeObjectURL(currentMedia.mediaUrl);
    }
    
    newMedia[index] = { 
      mediaUrl: "", 
      mediaType: index < 3 ? "image" : "document",
      fileName: "",
      uploaded: false,
      uploading: false,
      error: ""
    };
    updateField("mediaGallery", newMedia);
  };

  const handleRetryUpload = async (index: number) => {
    const currentMediaGallery = data.mediaGallery || mediaGallery;
    const media = currentMediaGallery[index];
    if (media.file) {
      await handleFileUpload(index, media.file);
    } else {
      console.error('No file found to retry upload');
    }
  };

  // Hero Banner Section
  const renderHeroBanner = () => {
    const handleHeroBannerUpload = async (file: File) => {
      // Create a local URL for preview
      const objectUrl = URL.createObjectURL(file);
      const fileType = getFileType(file);
      
      const newHeroBanner = { 
        mediaUrl: objectUrl,
        mediaType: fileType,
        file: file,
        fileName: file.name,
        uploading: true,
        uploaded: false,
        error: ""
      };
      updateField("heroBanner", newHeroBanner);

      try {
        console.log('Uploading hero banner:', file.name);
        
        // Upload to bucket API
        const uploadedUrl = await uploadToBucket(file, -1); // Using -1 as index for hero banner
        
        console.log('Hero banner upload successful:', uploadedUrl);
        
        // Update with the actual uploaded URL
        const updatedHeroBanner = { 
          ...newHeroBanner,
          mediaUrl: uploadedUrl,
          file: undefined, // Remove file object to avoid serialization issues
          uploading: false,
          uploaded: true,
          error: ""
        };
        updateField("heroBanner", updatedHeroBanner);
        
        // Clean up the local object URL
        setTimeout(() => {
          URL.revokeObjectURL(objectUrl);
        }, 1000);
        
      } catch (error) {
        console.error('Hero banner upload failed:', error);
        const errorHeroBanner = { 
          ...heroBanner,
          uploading: false,
          uploaded: false,
          error: error instanceof Error ? error.message : 'Upload failed. Please try again.'
        };
        updateField("heroBanner", errorHeroBanner);
      }
    };

    const handleRemoveHeroBanner = () => {
      // Revoke object URL if it's a local blob URL
      if (heroBanner.mediaUrl && heroBanner.mediaUrl.startsWith('blob:')) {
        URL.revokeObjectURL(heroBanner.mediaUrl);
      }
      
      const emptyHeroBanner = { 
        mediaUrl: "", 
        mediaType: "image",
        fileName: "",
        uploaded: false,
        uploading: false,
        error: ""
      };
      updateField("heroBanner", emptyHeroBanner);
    };

    const handleRetryHeroBannerUpload = async () => {
      if (heroBanner.file) {
        await handleHeroBannerUpload(heroBanner.file);
      } else {
        console.error('No file found to retry hero banner upload');
      }
    };

    return (
      <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-500" />
            Hero Banner
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Upload a hero banner image for your event (Recommended: 1920x600px, JPG/PNG, max 5MB)
          </p>
        </div>

        <div className="p-4 bg-white rounded-lg border border-amber-200 space-y-4 relative">
          {/* Loading Overlay */}
          {heroBanner.uploading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 rounded-lg flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
                <p className="text-sm text-slate-600">Uploading Hero Banner...</p>
              </div>
            </div>
          )}

          {!heroBanner.mediaUrl ? (
            <div className="border-2 border-dashed border-amber-300 rounded-lg p-6 text-center hover:bg-amber-50 transition cursor-pointer">
              <input
                type="file"
                id="hero-banner-upload"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Check file size (max 5MB for hero banner)
                    if (file.size > 5 * 1024 * 1024) {
                      alert('File size too large. Please select an image smaller than 5MB.');
                      return;
                    }
                    
                    // Validate file type
                    if (!file.type.startsWith('image/')) {
                      alert('Please select an image file for the hero banner.');
                      return;
                    }
                    
                    handleHeroBannerUpload(file);
                  }
                }}
                className="hidden"
              />
              <label 
                htmlFor="hero-banner-upload"
                className="cursor-pointer block"
              >
                <div className="w-16 h-16 mx-auto mb-3 bg-amber-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-amber-600" />
                </div>
                <p className="text-lg font-medium text-slate-700 mb-2">
                  Upload Hero Banner
                </p>
                <p className="text-sm text-slate-500">
                  Click to browse or drag and drop
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Recommended: 1920x600px • JPG, PNG, WebP • Max 5MB
                </p>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Upload Status */}
              {heroBanner.uploaded && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 text-sm font-medium flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Hero banner uploaded successfully
                  </p>
                </div>
              )}
              
              {heroBanner.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm font-medium mb-2">
                    Upload failed: {heroBanner.error}
                  </p>
                  <button
                    onClick={handleRetryHeroBannerUpload}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded transition flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry Upload
                  </button>
                </div>
              )}

              {/* Hero Banner Preview */}
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="font-medium text-slate-800 text-sm">
                    Hero Banner Preview:
                  </label>
                  <button
                    onClick={handleRemoveHeroBanner}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>

                {/* Preview Image */}
                <div className="relative group">
                  <div className="w-full aspect-[1920/600] bg-slate-200 rounded-lg overflow-hidden border">
                    <img 
                      src={heroBanner.mediaUrl} 
                      alt="Hero Banner Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Hero banner image failed to load:', heroBanner.mediaUrl);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  
                  {/* View Full Button */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openFullView(heroBanner.mediaUrl, heroBanner.fileName || 'Hero Banner', 'image')}
                      className="p-2 bg-black bg-opacity-50 text-white rounded-lg flex items-center gap-2 text-sm"
                      title="View full size"
                    >
                      <Eye className="w-4 h-4" />
                      View Full
                    </button>
                  </div>
                </div>

                {/* File Info */}
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-slate-600">
                  <div>
                    <span className="font-medium">File Name:</span>
                    <p className="truncate">{heroBanner.fileName}</p>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <p className={`font-medium ${
                      heroBanner.uploaded ? 'text-green-600' : 
                      heroBanner.uploading ? 'text-amber-600' : 
                      'text-blue-600'
                    }`}>
                      {heroBanner.uploaded ? 'Uploaded to Cloud' : 
                       heroBanner.uploading ? 'Uploading...' : 'Local Preview'}
                    </p>
                  </div>
                </div>

                {/* Replace Button */}
                <div className="mt-4">
                  <input
                    type="file"
                    id="hero-banner-replace"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Check file size (max 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                          alert('File size too large. Please select an image smaller than 5MB.');
                          return;
                        }
                        
                        // Validate file type
                        if (!file.type.startsWith('image/')) {
                          alert('Please select an image file for the hero banner.');
                          return;
                        }
                        
                        handleHeroBannerUpload(file);
                      }
                    }}
                    className="hidden"
                  />
                  <label 
                    htmlFor="hero-banner-replace"
                    className="cursor-pointer block"
                  >
                    <div className="w-full bg-amber-500 hover:bg-amber-600 text-white text-center py-3 px-4 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Replace Hero Banner
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upload Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2 text-sm">Hero Banner Guidelines</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Recommended dimensions: 1920x600 pixels (16:5 aspect ratio)</li>
            <li>• File formats: JPG, PNG, WebP</li>
            <li>• Maximum file size: 5MB</li>
            <li>• Use high-quality, visually appealing images that represent your event</li>
            <li>• Avoid text-heavy images as they may not be readable on all devices</li>
          </ul>
        </div>
      </div>
    );
  };

  // Background Video Section
  const renderBackgroundVideo = () => {
    return (
      <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-500" />
            Background Video
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Add a background video URL for your event (YouTube, Vimeo, or direct video link)
          </p>
        </div>

        <div>
          <label className="block mb-2 font-medium text-slate-700 text-sm">
            Background Video URL
          </label>
          <input
            type="url"
            value={backgroundVideoUrl}
            onChange={(e) => updateField("backgroundVideoUrl", e.target.value)}
            className={baseInputClasses}
            placeholder="https://example.com/video.mp4 or https://youtube.com/embed/..."
          />
          <p className="text-xs text-slate-500 mt-2">
            Supported: MP4, WebM, Ogg files or YouTube/Vimeo embed URLs
          </p>
        </div>

        {/* Video Preview */}
        {backgroundVideoUrl && (
          <div className="mt-4">
            <label className="block mb-2 font-medium text-slate-700 text-sm">
              Video Preview
            </label>
            <div className="aspect-video bg-slate-200 rounded-lg overflow-hidden">
              <video 
                src={backgroundVideoUrl} 
                controls 
                className="w-full h-full object-contain"
                onError={(e) => {
                  // If direct video fails, try embedding as iframe for YouTube/Vimeo
                  const videoElement = e.currentTarget;
                  const parent = videoElement.parentElement;
                  
                  // Check if it's a YouTube or Vimeo URL
                  if (backgroundVideoUrl.includes('youtube') || backgroundVideoUrl.includes('youtu.be') || backgroundVideoUrl.includes('vimeo')) {
                    videoElement.style.display = 'none';
                    
                    let embedUrl = backgroundVideoUrl;
                    if (backgroundVideoUrl.includes('youtube.com/watch?v=')) {
                      embedUrl = backgroundVideoUrl.replace('youtube.com/watch?v=', 'youtube.com/embed/');
                    } else if (backgroundVideoUrl.includes('youtu.be/')) {
                      embedUrl = backgroundVideoUrl.replace('youtu.be/', 'youtube.com/embed/');
                    } else if (backgroundVideoUrl.includes('vimeo.com/')) {
                      embedUrl = backgroundVideoUrl.replace('vimeo.com/', 'player.vimeo.com/video/');
                    }
                    
                    const iframe = document.createElement('iframe');
                    iframe.src = embedUrl;
                    iframe.className = 'w-full h-full';
                    iframe.allowFullscreen = true;
                    
                    if (parent) {
                      parent.appendChild(iframe);
                    }
                  }
                }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Exhibitor Interviews Section
  const renderExhibitorInterviews = () => {
    return (
      <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Exhibitor Interviews</h3>
          <p className="text-sm text-slate-600 mt-1">
            Add video interviews with exhibitors (YouTube or Vimeo links)
          </p>
        </div>

        {exhibitorInterviews.map((interview: ExhibitorInterview, index: number) => (
          <div key={index} className="p-4 bg-white rounded-lg border border-amber-200 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-slate-800">Interview {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeArrayItem("exhibitorInterviews", index)}
                className="text-red-500 hover:text-red-700 text-sm font-medium transition flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium text-slate-700 text-sm">
                  Video Title
                </label>
                <input
                  type="text"
                  value={interview.videoTitle}
                  onChange={(e) => {
                    const newInterviews = [...exhibitorInterviews];
                    newInterviews[index].videoTitle = e.target.value;
                    updateField("exhibitorInterviews", newInterviews);
                  }}
                  className={baseInputClasses}
                  placeholder="Enter video title"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium text-slate-700 text-sm">
                  Video URL
                </label>
                <input
                  type="url"
                  value={interview.videoUrl}
                  onChange={(e) => {
                    const newInterviews = [...exhibitorInterviews];
                    newInterviews[index].videoUrl = e.target.value;
                    updateField("exhibitorInterviews", newInterviews);
                  }}
                  className={baseInputClasses}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => addArrayItem("exhibitorInterviews", { videoTitle: "", videoUrl: "" })}
          className="w-full py-3 border-2 border-dashed border-amber-300 rounded-lg text-amber-600 hover:bg-amber-50 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Another Interview
        </button>
      </div>
    );
  };

  // Media Gallery Section with File Upload - UPDATED: 3 for images, 3 for documents
  const renderMediaGallery = () => {
    // Split media gallery into images (first 3) and documents (last 3)
    const imageSlots = mediaGallery.slice(0, 3);
    const documentSlots = mediaGallery.slice(3, 6);

    // FIXED: Enhanced file type detection that works for uploaded files
    const detectFileType = (mediaItem: MediaGalleryItem): string => {
      // If we have a file object, use its type property (during upload)
      if (mediaItem.file) {
        if (mediaItem.file.type.startsWith('image/')) {
          return 'image';
        } else if (mediaItem.file.type === 'application/pdf') {
          return 'pdf';
        } else if (mediaItem.file.type.includes('word') || mediaItem.file.name?.match(/\.(doc|docx)$/)) {
          return 'word';
        } else if (mediaItem.file.type.includes('excel') || mediaItem.file.type.includes('spreadsheet') || mediaItem.file.name?.match(/\.(xls|xlsx)$/)) {
          return 'excel';
        } else if (mediaItem.file.type.includes('powerpoint') || mediaItem.file.type.includes('presentation') || mediaItem.file.name?.match(/\.(ppt|pptx)$/)) {
          return 'powerpoint';
        } else if (mediaItem.file.type === 'text/plain' || mediaItem.file.name?.endsWith('.txt')) {
          return 'text';
        } else {
          return 'document';
        }
      }
      
      // If we have a mediaUrl, check multiple patterns for images
      if (mediaItem.mediaUrl) {
        const lowerUrl = mediaItem.mediaUrl.toLowerCase();
        const lowerFileName = mediaItem.fileName?.toLowerCase() || '';
        
        console.log('File type detection:', {
          url: lowerUrl,
          fileName: lowerFileName,
          mediaType: mediaItem.mediaType
        });
        
        // Check for image file extensions in URL or filename
        const isImage = 
          // File extensions in URL
          lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)($|\?)/) ||
          // File extensions in filename
          lowerFileName.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/) ||
          // Data URLs
          lowerUrl.startsWith('data:image/') ||
          // Content type hints in URL
          lowerUrl.includes('image') ||
          lowerUrl.includes('jpg') ||
          lowerUrl.includes('jpeg') ||
          lowerUrl.includes('png') ||
          // Check if the API response indicated it's an image
          mediaItem.mediaType === 'image';
        
        if (isImage) {
          console.log('Detected as image');
          return 'image';
        }
        // Check for PDF
        else if (lowerUrl.endsWith('.pdf') || lowerFileName.endsWith('.pdf') || mediaItem.mediaType === 'pdf') {
          return 'pdf';
        }
        // Check for Word documents
        else if (lowerUrl.match(/\.(doc|docx)($|\?)/) || lowerFileName.match(/\.(doc|docx)$/) || mediaItem.mediaType === 'word') {
          return 'word';
        }
        // Check for Excel
        else if (lowerUrl.match(/\.(xls|xlsx)($|\?)/) || lowerFileName.match(/\.(xls|xlsx)$/) || mediaItem.mediaType === 'excel') {
          return 'excel';
        }
        // Check for PowerPoint
        else if (lowerUrl.match(/\.(ppt|pptx)($|\?)/) || lowerFileName.match(/\.(ppt|pptx)$/) || mediaItem.mediaType === 'powerpoint') {
          return 'powerpoint';
        }
        // Check for text files
        else if (lowerUrl.endsWith('.txt') || lowerFileName.endsWith('.txt') || mediaItem.mediaType === 'text') {
          return 'text';
        }
      }
      
      // Fallback to mediaType if provided
      if (mediaItem.mediaType) {
        return mediaItem.mediaType;
      }
      
      return 'document';
    };

    // FIXED: Get appropriate icon
    const getFilePreviewIcon = (fileType: string) => {
      switch (fileType) {
        case 'image':
          return <ImageIcon className="w-8 h-8 text-blue-500" />;
        case 'pdf':
          return <FileText className="w-8 h-8 text-red-500" />;
        case 'word':
          return <FileText className="w-8 h-8 text-blue-600" />;
        case 'excel':
          return <FileText className="w-8 h-8 text-green-600" />;
        case 'powerpoint':
          return <FileText className="w-8 h-8 text-orange-500" />;
        case 'text':
          return <FileText className="w-8 h-8 text-gray-600" />;
        default:
          return <FileText className="w-8 h-8 text-gray-500" />;
      }
    };

    // FIXED: Get display name for file type
    const getFileTypeName = (fileType: string) => {
      switch (fileType) {
        case 'image':
          return 'Image';
        case 'pdf':
          return 'PDF Document';
        case 'word':
          return 'Word Document';
        case 'excel':
          return 'Excel Spreadsheet';
        case 'powerpoint':
          return 'PowerPoint';
        case 'text':
          return 'Text File';
        default:
          return 'Document';
      }
    };

    // Render individual media slot
    const renderMediaSlot = (media: MediaGalleryItem, index: number, isImageSlot: boolean) => {
      const actualFileType = detectFileType(media);
      
      return (
        <div key={index} className="p-4 bg-white rounded-lg border border-amber-200 space-y-4 relative">
          {/* Loading Overlay */}
          {media.uploading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 rounded-lg flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
                <p className="text-sm text-slate-600">Uploading...</p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-slate-800">
              {isImageSlot ? `Image ${index + 1}` : `Document ${index - 2}`}
            </h4>
            {media.mediaUrl && !media.uploading && (
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="text-red-500 hover:text-red-700 text-sm font-medium transition flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove
              </button>
            )}
          </div>
          
          {/* File Upload Area */}
          <div className="space-y-3">
            {!media.mediaUrl ? (
              <div className="border-2 border-dashed border-amber-300 rounded-lg p-4 text-center hover:bg-amber-50 transition cursor-pointer">
                <input
                  type="file"
                  id={`media-upload-${index}`}
                  accept={isImageSlot ? "image/*" : ".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Check file size (max 10MB)
                      if (file.size > 10 * 1024 * 1024) {
                        alert('File size too large. Please select a file smaller than 10MB.');
                        return;
                      }
                      
                      // Validate file type for image slots
                      if (isImageSlot && !file.type.startsWith('image/')) {
                        alert('Please select an image file for this slot.');
                        return;
                      }
                      
                      handleFileUpload(index, file);
                    }
                  }}
                  className="hidden"
                />
                <label 
                  htmlFor={`media-upload-${index}`}
                  className="cursor-pointer block"
                >
                  <div className="w-12 h-12 mx-auto mb-2 bg-amber-100 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-amber-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    Upload {isImageSlot ? 'Image' : 'Document'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {isImageSlot ? 'JPG, PNG, GIF, etc.' : 'PDF, DOC, XLS, etc.'} (max 10MB)
                  </p>
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Upload Status */}
                {media.uploaded && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                    <p className="text-green-700 text-xs font-medium flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Uploaded successfully
                    </p>
                  </div>
                )}
                
                {media.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                    <p className="text-red-700 text-xs font-medium mb-2">
                      Upload failed: {media.error}
                    </p>
                    <button
                      onClick={() => handleRetryUpload(index)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition"
                    >
                      Retry Upload
                    </button>
                  </div>
                )}

                {/* FIXED: Preview with proper file type detection */}
                <div className="bg-slate-50 rounded-lg p-3">
                  <label className="block mb-2 font-medium text-slate-800 text-sm">
                    Preview:
                  </label>
                  
                  {/* Debug info - remove in production */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="text-xs bg-yellow-100 p-2 rounded mb-2">
                      <strong>Debug:</strong> Type: {actualFileType}, File: {media.fileName}
                    </div>
                  )}
                  
                  {/* Mini Preview */}
                  <div className="mb-3 p-2 bg-white rounded border">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {getFilePreviewIcon(actualFileType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-slate-800 truncate">
                          {media.fileName || `File ${index + 1}`}
                        </div>
                        <div className="text-xs text-slate-500">
                          {getFileTypeName(actualFileType)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Preview */}
                  {actualFileType === 'image' ? (
                    <div className="relative group">
                      <div className="w-full aspect-video bg-slate-200 rounded-lg overflow-hidden">
                        <img 
                          src={media.mediaUrl} 
                          alt={`Uploaded media ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // If image fails to load, show document preview instead
                            console.error('Image failed to load:', media.mediaUrl);
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.parentElement?.querySelector('.fallback-preview') as HTMLElement;
                            if (fallback) {
                              fallback.classList.remove('hidden');
                            }
                          }}
                        />
                        {/* Fallback preview in case image fails to load */}
                        <div className="fallback-preview hidden w-full h-full flex items-center justify-center bg-gray-100">
                          <div className="text-center">
                            {getFilePreviewIcon('image')}
                            <p className="text-xs text-gray-600 mt-1">Image Preview</p>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openFullView(media.mediaUrl, media.fileName || `Media ${index + 1}`, actualFileType)}
                          className="p-1 bg-black bg-opacity-50 text-white rounded"
                          title="View full size"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 bg-white">
                      <div className="flex flex-col items-center justify-center text-center">
                        {getFilePreviewIcon(actualFileType)}
                        <p className="font-medium text-slate-800 mt-2 text-sm">
                          {getFileTypeName(actualFileType)}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {media.fileName}
                        </p>
                        <button
                          onClick={() => openFullView(media.mediaUrl, media.fileName || `Document ${index + 1}`, actualFileType)}
                          className="mt-3 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View Document
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium capitalize">{getFileTypeName(actualFileType)}</span>
                  </div>
                  {media.fileName && (
                    <div className="flex justify-between">
                      <span>File:</span>
                      <span className="font-medium truncate ml-2 max-w-[120px]">{media.fileName}</span>
                    </div>
                  )}
                  {media.mediaUrl && (
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`font-medium ${
                        media.uploaded ? 'text-green-600' : 
                        media.uploading ? 'text-amber-600' : 
                        'text-blue-600'
                      }`}>
                        {media.uploaded ? 'Uploaded to Cloud' : 
                         media.uploading ? 'Uploading...' : 'Local Preview'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Replace File Button */}
                <div className="flex gap-2">
                  <input
                    type="file"
                    id={`media-replace-${index}`}
                    accept={isImageSlot ? "image/*" : ".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Check file size (max 10MB)
                        if (file.size > 10 * 1024 * 1024) {
                          alert('File size too large. Please select a file smaller than 10MB.');
                          return;
                        }
                        
                        // Validate file type
                        if (isImageSlot && !file.type.startsWith('image/')) {
                          alert('Please select an image file for this slot.');
                          return;
                        }
                        
                        handleFileUpload(index, file);
                      }
                    }}
                    className="hidden"
                  />
                  <label 
                    htmlFor={`media-replace-${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="w-full bg-amber-500 hover:bg-amber-600 text-white text-center py-2 px-3 rounded-lg text-sm font-medium transition">
                      Replace File
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-8 p-6 bg-yellow-50 rounded-xl shadow-md">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Media Gallery</h3>
          <p className="text-sm text-slate-600 mt-1">
            Upload images and documents for your event (3 images and 3 documents maximum)
          </p>
        </div>

        {/* Image Gallery Section */}
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-slate-800 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-500" />
            Images Upload Section
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageSlots.map((media: MediaGalleryItem, index: number) => 
              renderMediaSlot(media, index, true)
            )}
          </div>
        </div>

        {/* Document Gallery Section */}
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-500" />
            Documents Upload Section
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentSlots.map((media: MediaGalleryItem, index: number) => 
              renderMediaSlot(media, index + 3, false) // Add 3 to index for correct position
            )}
          </div>
        </div>

        {/* Upload Progress/Status */}
        <div className="p-4 bg-amber-100 rounded-lg border border-amber-200">
          <h4 className="font-medium text-amber-800 mb-2">Upload Status</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {mediaGallery.slice(0, 3).map((media: MediaGalleryItem, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  media.uploaded 
                    ? 'bg-green-500' 
                    : media.uploading 
                    ? 'bg-amber-500 animate-pulse' 
                    : media.error
                    ? 'bg-red-500'
                    : 'bg-slate-300'
                }`} />
                <span className="text-slate-700">
                  Image {index + 1}: {
                    media.uploaded 
                      ? 'Uploaded' 
                      : media.uploading 
                      ? 'Uploading...' 
                      : media.error
                      ? 'Failed'
                      : 'Empty'
                  }
                </span>
              </div>
            ))}
            {mediaGallery.slice(3, 6).map((media: MediaGalleryItem, index: number) => (
              <div key={index + 3} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  media.uploaded 
                    ? 'bg-green-500' 
                    : media.uploading 
                    ? 'bg-amber-500 animate-pulse' 
                    : media.error
                    ? 'bg-red-500'
                    : 'bg-slate-300'
                }`} />
                <span className="text-slate-700">
                  Document {index + 1}: {
                    media.uploaded 
                      ? 'Uploaded' 
                      : media.uploading 
                      ? 'Uploading...' 
                      : media.error
                      ? 'Failed'
                      : 'Empty'
                  }
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Contact Information Section - UPDATED: Using PhoneInput component
  const renderContactInfo = () => {
    // FIXED: Ensure phone array always exists and has at least one entry
    const phoneNumbers = contactInfo.phone || [{ phoneNumber: "" }];

    return (
      <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Contact Information</h3>
          <p className="text-sm text-slate-600 mt-1">
            Primary contact details for the event
          </p>
        </div>

        {/* Phone Numbers - UPDATED: Using PhoneInput component */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-slate-800 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Numbers
            </h4>
            <button
              type="button"
              onClick={() => {
                // FIXED: Properly add new phone number to array
                const newPhones = [...phoneNumbers, { phoneNumber: "" }];
                updateField("contactInfo", { ...contactInfo, phone: newPhones });
              }}
              className="text-amber-600 hover:text-amber-700 text-sm font-medium transition flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Phone
            </button>
          </div>

          {phoneNumbers.map((phone: { phoneNumber: string }, index: number) => (
            <div key={index} className="flex gap-2 items-start">
              {/* UPDATED: Using PhoneInput instead of regular input */}
              <div className="flex-1">
                <PhoneInput
                  value={phone.phoneNumber}
                  onChange={(value) => {
                    // FIXED: Properly update specific phone number
                    const newPhones = [...phoneNumbers];
                    newPhones[index] = { phoneNumber: value || "" };
                    updateField("contactInfo", { ...contactInfo, phone: newPhones });
                  }}
                  placeholder="Enter phone number"
                  className="w-full"
                  // Add any additional props you need for the PhoneInput
                />
              </div>
              {phoneNumbers.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    // FIXED: Properly remove phone number from array
                    const newPhones = phoneNumbers.filter((_, i) => i !== index);
                    updateField("contactInfo", { ...contactInfo, phone: newPhones });
                  }}
                  className="p-2 text-red-500 hover:text-red-700 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 font-medium text-slate-700 text-sm flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address
          </label>
          <input
            type="email"
            value={contactInfo.email || ""}
            onChange={(e) => updateField("contactInfo", { ...contactInfo, email: e.target.value })}
            className={baseInputClasses}
            placeholder="contact@event.com"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block mb-2 font-medium text-slate-700 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Address
          </label>
          <textarea
            value={contactInfo.address || ""}
            onChange={(e) => updateField("contactInfo", { ...contactInfo, address: e.target.value })}
            className={baseTextareaClasses}
            placeholder="Enter full address"
            rows={3}
          />
        </div>
      </div>
    );
  };

  // International Contacts Section
  const renderInternationalContacts = () => {
    return (
      <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">International Contacts</h3>
          <p className="text-sm text-slate-600 mt-1">
            Add international representatives or contacts
          </p>
        </div>

        {internationalContacts.map((contact: InternationalContact, index: number) => (
          <div key={index} className="p-4 bg-white rounded-lg border border-amber-200 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                International Contact {index + 1}
              </h4>
              <button
                type="button"
                onClick={() => removeArrayItem("internationalContacts", index)}
                className="text-red-500 hover:text-red-700 text-sm font-medium transition flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium text-slate-700 text-sm">
                  Full Name
                </label>
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => {
                    const newContacts = [...internationalContacts];
                    newContacts[index].name = e.target.value;
                    updateField("internationalContacts", newContacts);
                  }}
                  className={baseInputClasses}
                  placeholder="John Smith"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium text-slate-700 text-sm">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => {
                    const newContacts = [...internationalContacts];
                    newContacts[index].phone = e.target.value;
                    updateField("internationalContacts", newContacts);
                  }}
                  className={baseInputClasses}
                  placeholder="+44 20 1234 5678"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium text-slate-700 text-sm">
                  Email Address
                </label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => {
                    const newContacts = [...internationalContacts];
                    newContacts[index].email = e.target.value;
                    updateField("internationalContacts", newContacts);
                  }}
                  className={baseInputClasses}
                  placeholder="john@organization.com"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium text-slate-700 text-sm">
                  Organization
                </label>
                <input
                  type="text"
                  value={contact.organization}
                  onChange={(e) => {
                    const newContacts = [...internationalContacts];
                    newContacts[index].organization = e.target.value;
                    updateField("internationalContacts", newContacts);
                  }}
                  className={baseInputClasses}
                  placeholder="Organization name"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => addArrayItem("internationalContacts", { 
            name: "", 
            phone: "", 
            email: "", 
            organization: "" 
          })}
          className="w-full py-3 border-2 border-dashed border-amber-300 rounded-lg text-amber-600 hover:bg-amber-50 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add International Contact
        </button>
      </div>
    );
  };

  // Social Links Section
  const renderSocialLinks = () => {
    return (
      <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Social Media Links</h3>
          <p className="text-sm text-slate-600 mt-1">
            Add your event's social media profiles
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block mb-2 font-medium text-slate-700 text-sm flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Facebook URL
            </label>
            <input
              type="url"
              value={socialLinks.facebook}
              onChange={(e) => updateField("socialLinks", { ...socialLinks, facebook: e.target.value })}
              className={baseInputClasses}
              placeholder="https://facebook.com/yourevent"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium text-slate-700 text-sm flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              LinkedIn URL
            </label>
            <input
              type="url"
              value={socialLinks.linkedin}
              onChange={(e) => updateField("socialLinks", { ...socialLinks, linkedin: e.target.value })}
              className={baseInputClasses}
              placeholder="https://linkedin.com/company/yourevent"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium text-slate-700 text-sm flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Instagram URL
            </label>
            <input
              type="url"
              value={socialLinks.instagram}
              onChange={(e) => updateField("socialLinks", { ...socialLinks, instagram: e.target.value })}
              className={baseInputClasses}
              placeholder="https://instagram.com/yourevent"
            />
          </div>
        </div>
      </div>
    );
  };

  // Tags Section
  const renderTags = () => {
    const [newTag, setNewTag] = useState("");

    const addTag = () => {
      if (newTag.trim() && !tags.includes(newTag.trim())) {
        const newTags = [...tags, newTag.trim()];
        updateField("tags", newTags);
        setNewTag("");
      }
    };

    const removeTag = (index: number) => {
      const newTags = tags.filter((_, i) => i !== index);
      updateField("tags", newTags);
    };

    return (
      <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Event Tags</h3>
          <p className="text-sm text-slate-600 mt-1">
            Add relevant tags to help people discover your event
          </p>
        </div>

        <div className="space-y-4">
          {/* Add Tag Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className={baseInputClasses}
              placeholder="Enter a tag (e.g., technology, business, art)"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {/* Tags Display */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="text-amber-600 hover:text-amber-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {tags.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">
              No tags added yet. Add some tags to help categorize your event.
            </p>
          )}
        </div>
      </div>
    );
  };

  // Publishing Section
  const renderPublishing = () => {
    return (
      <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Publishing</h3>
          <p className="text-sm text-slate-600 mt-1">
            Control the visibility and publication status of your event
          </p>
        </div>

        <div className="space-y-4">
          {/* Published Status */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-amber-200">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${published ? 'bg-green-500' : 'bg-slate-300'}`} />
              <div>
                <p className="font-medium text-slate-800">
                  {published ? 'Published' : 'Draft'}
                </p>
                <p className="text-sm text-slate-600">
                  {published 
                    ? 'Your event is visible to the public' 
                    : 'Your event is in draft mode and not visible to the public'
                  }
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateField("published", !published)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                published 
                  ? 'bg-slate-500 hover:bg-slate-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {published ? 'Unpublish' : 'Publish'}
            </button>
          </div>

          {/* Last Modified */}
          {lastModified && (
            <div className="flex items-center gap-2 text-sm text-slate-600 p-3 bg-amber-100 rounded-lg">
              <Calendar className="w-4 h-4" />
              <span>Last modified: {new Date(lastModified).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Full View Modal */}
      {renderFullViewModal()}

      <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
        {step.title}
      </h2>

      {renderHeroBanner()}
      {renderBackgroundVideo()}
      {renderExhibitorInterviews()}
      {renderMediaGallery()}
      {renderContactInfo()}
      {renderInternationalContacts()}
      {renderSocialLinks()}
      {renderTags()}
      {renderPublishing()}

      {/* Summary Preview */}
      <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
        <h3 className="font-semibold text-amber-900 mb-4">Event Media & Contacts Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-amber-800 mb-2">Media</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Hero Banner:</span>
                <span className="font-medium">
                  {heroBanner.mediaUrl ? 'Uploaded' : 'Not Added'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Background Video:</span>
                <span className="font-medium">
                  {backgroundVideoUrl ? 'Added' : 'Not Added'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Interviews:</span>
                <span className="font-medium">{exhibitorInterviews.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Images Uploaded:</span>
                <span className="font-medium">
                  {mediaGallery.slice(0, 3).filter((m: MediaGalleryItem) => m.uploaded).length}/3
                </span>
              </div>
              <div className="flex justify-between">
                <span>Documents Uploaded:</span>
                <span className="font-medium">
                  {mediaGallery.slice(3, 6).filter((m: MediaGalleryItem) => m.uploaded).length}/3
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-amber-800 mb-2">Contacts</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Phone Numbers:</span>
                <span className="font-medium">{contactInfo.phone?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>International:</span>
                <span className="font-medium">{internationalContacts.length}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-amber-800 mb-2">Social & Tags</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Social Links:</span>
                <span className="font-medium">
                  {[socialLinks.facebook, socialLinks.linkedin, socialLinks.instagram].filter(Boolean).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tags:</span>
                <span className="font-medium">{tags.length}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white rounded-lg border border-amber-100">
          <div className="flex justify-between items-center">
            <span className="font-medium text-slate-800">Publication Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              published 
                ? 'bg-green-100 text-green-800' 
                : 'bg-slate-100 text-slate-600'
            }`}>
              {published ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};