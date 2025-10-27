import React, { useState } from "react";
import axios from "axios";
import { FormStep } from "../FormStep";
import { FormInput } from "../FormInput";
import { StepProps } from "../../types/form";
import {
  Upload,
  FileText,
  Image,
  Video,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useTemplate } from "../../../../../../../context/context";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useUserAuth } from "../../../../../../../context/context";

// ✅ Updated File Upload API URL (your actual endpoint)
const FILE_UPLOAD_API_URL = "https://1i8zpm4qu4.execute-api.ap-south-1.amazonaws.com/prod/upload-file";

// ✅ Form Submission API URL (unchanged)
const FORM_SUBMIT_API_URL = "https://14exr8c8g0.execute-api.ap-south-1.amazonaws.com/prod/drafts";

// ✅ Helper function to upload individual file
const uploadSingleFile = async (file: File, fieldName: string, userId: string): Promise<any> => {
  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('fieldName', fieldName);
  formData.append('file', file);

  try {
    const response = await axios.post(FILE_UPLOAD_API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // 2 minutes timeout per file
    });

    if (response.data.success) {
      return {
        fileName: response.data.fileName || response.data.metadata?.fileName,
        contentType: response.data.contentType || response.data.metadata?.contentType,
        imageUrl: response.data.imageUrl, // Primary URL from upload lambda
        s3Url: response.data.s3Url || response.data.imageUrl, // Fallback compatibility
        fileSize: response.data.sizeBytes || response.data.metadata?.sizeBytes,
        sizeMB: response.data.sizeMB || response.data.metadata?.sizeMB,
        uploadedAt: response.data.uploadedAt || response.data.metadata?.uploadedAt,
        fieldName: fieldName,
        metadata: response.data.metadata || {},
      };
    } else {
      throw new Error(response.data.error || 'Upload failed');
    }
  } catch (error: any) {
    console.error(`File upload failed for ${fieldName}:`, error);
    
    if (error.response) {
      const errorMsg = error.response.data?.error || error.response.data?.message || `HTTP ${error.response.status}`;
      throw new Error(`Upload failed: ${errorMsg}`);
    } else if (error.request) {
      throw new Error('Upload failed: No response from server. Please check your connection.');
    } else {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }
};

// ✅ Retry mechanism for form submission
const retryRequest = async (
  url: string,
  payload: any,
  retries = 3,
  timeout = 60000
): Promise<any> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout,
      });
      return response;
    } catch (error: any) {
      console.warn(`Attempt ${i + 1}/${retries} failed:`, error.message);

      if (i === retries - 1) {
        throw error; // Final attempt failed
      }

      // Exponential backoff: wait 1s, 2s, 4s...
      const waitTime = Math.pow(2, i) * 1000;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
};

const Step8MediaUploads: React.FC<StepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isValid,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [fileProcessingStatus, setFileProcessingStatus] = useState<{
    [key: string]: "pending" | "uploading" | "completed" | "error";
  }>({});
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: any}>({});
  const { setDraftDetails } = useTemplate();
  
  // ✅ Move useUserAuth to component level (FIXED: was inside handleSubmit)
  const { user, isLogin, accountEmail } = useUserAuth();
  
  const location = useLocation();
  
  // Extract URL parts
  const pathParts = location.pathname.split("/").filter(Boolean);
  // Example pathParts for /form/publicId/userId/draftId => ['form', 'publicId', 'userId', 'draftId']
  const isDraftLink = pathParts.length === 4; 
  const publicId = isDraftLink ? pathParts[1] : null;
  const userIdFromUrl = isDraftLink ? pathParts[2] : null;
  const draftId = isDraftLink ? pathParts[3] : null;
  const useremail = user?.userData?.email;
  
  // ✅ Handle individual file upload (immediate upload on file selection)
  const handleFileUpload = async (file: File, fieldName: string) => {
    const userId = isLogin ? useremail : accountEmail || formData.directorEmail || 'temp-user';
    
    setFileProcessingStatus(prev => ({
      ...prev,
      [fieldName]: "uploading"
    }));

    try {
      const uploadResult = await uploadSingleFile(file, fieldName, userId);
      
      // ✅ Store uploaded file info
      setUploadedFiles(prev => ({
        ...prev,
        [fieldName]: uploadResult
      }));

      // ✅ Update form data with the file URL (simplified - just store the URL)
      updateFormData({
        [fieldName]: uploadResult.imageUrl || uploadResult.s3Url
      });

      setFileProcessingStatus(prev => ({
        ...prev,
        [fieldName]: "completed"
      }));

      toast.success(`${fieldName} uploaded successfully!`);
      console.log(`✅ File uploaded: ${fieldName}`, uploadResult);

    } catch (error: any) {
      setFileProcessingStatus(prev => ({
        ...prev,
        [fieldName]: "error"
      }));
      
      toast.error(`Failed to upload ${fieldName}: ${error.message}`);
      console.error(`❌ File upload failed: ${fieldName}`, error);
    }
  };

  // ✅ Enhanced Form Submit Handler
  const handleSubmit = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus("Preparing form submission...");

    try {
      // ✅ Prepare form data with file URLs already populated
      const formDataWithFileRefs = { ...formData };
      
      // ✅ Ensure all uploaded file URLs are in formData
      Object.keys(uploadedFiles).forEach(fieldName => {
        const fileInfo = uploadedFiles[fieldName];
        if (fileInfo?.imageUrl || fileInfo?.s3Url) {
          // Store the URL directly in formData
          formDataWithFileRefs[fieldName] = fileInfo.imageUrl || fileInfo.s3Url;
        }
      });

      setUploadStatus("Submitting form data...");
      setUploadProgress(50);

      // ✅ Use user and isLogin from component level (FIXED)

      // ✅ Updated payload structure
      const payload = {
        userId: isLogin ? useremail : accountEmail || formData.directorEmail,
        directorEmail: formData.directorEmail,
        templateSelection: formData?.templateSelection || formData?.selectedTemplate?.value || "",
        templateDetails: {
          id: formData?.selectedTemplate?.id || null,
          name: formData?.selectedTemplate?.name || "",
          value: formData?.selectedTemplate?.value || "",
        },
        formData: formDataWithFileRefs, // Contains file URLs
        uploadedFiles: uploadedFiles, // Contains file metadata
        batchInfo: {
          isLastBatch: true,
          timestamp: Date.now(),
          processingMethod: "separate_file_upload"
        }
      };

      console.log("📤 Submitting form with payload:", {
        ...payload,
        uploadedFiles: Object.keys(uploadedFiles),
        formDataFileFields: Object.keys(formDataWithFileRefs).filter(key => 
          typeof formDataWithFileRefs[key] === 'string' && formDataWithFileRefs[key].startsWith('http')
        )
      });

      setUploadProgress(75);
      
      let response;

      if (isDraftLink && userIdFromUrl && draftId) {
        // ✅ PUT request for draft link
        const draftApiUrl = `https://c2x3twl1q8.execute-api.ap-south-1.amazonaws.com/dev/${userIdFromUrl}/${draftId}`;
        setUploadStatus("Updating draft...");
        setUploadProgress(60);

        response = await axios.put(draftApiUrl, payload, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 60000,
        });
      } else {
        // ✅ POST request for new form
        setUploadStatus("Submitting form data...");
        setUploadProgress(60);

        response = await retryRequest(FORM_SUBMIT_API_URL, payload, 3, 60000);
      }

      console.log("✅ Form submitted successfully:", response.data);
      
      // setDraftDetails(response.data);
      setDraftDetails({
        userId: isLogin ? useremail : accountEmail || formData.directorEmail,
        directorEmail: formData.directorEmail,
        draftId: draftId || response.data?.draftId,
        templateSelection:
          formData?.templateSelection ||
          formData?.selectedTemplate?.value ||
          response.data?.templateSelection,
        ...(response.data || {}),
      });
      setUploadStatus("Form submitted successfully!");
      setUploadProgress(100);

      setTimeout(() => {
        toast.success("Form submitted successfully! AI is generating your website...");
        onNext();
      }, 1500);

    } catch (error: any) {
      console.error("❌ Form submission failed:", error);

      setUploadStatus("Form submission failed");
      setUploadProgress(0);

      let errorMessage = "Form submission failed. ";

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        console.error("Response status:", status);
        console.error("Response data:", data);

        if (data?.error?.includes("DynamoDB")) {
          errorMessage += `Database Error: ${data.error}`;
        } else {
          errorMessage += `Server error (${status}): ${
            data?.message || data?.error || "Unknown error"
          }`;
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        errorMessage += "No response from server. Please check your internet connection and try again.";
      } else {
        errorMessage += error.message || "Unknown error occurred.";
      }

      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const FileUploadSection = ({
    title,
    icon: Icon,
    children,
    bgColor = "bg-slate-50",
  }: {
    title: string;
    icon: any;
    children: React.ReactNode;
    bgColor?: string;
  }) => (
    <div className={`${bgColor} rounded-lg p-6`}>
      <h3 className='text-lg font-bold text-slate-900 mb-4 flex items-center'>
        <Icon className='w-6 h-6 mr-3 text-slate-600' />
        {title}
      </h3>
      {children}
    </div>
  );

  const FileUploadBox = ({
    label,
    accept,
    value,
    onChange,
    required = false,
    description,
    fieldName,
  }: {
    label: string;
    accept: string;
    value: any;
    onChange: (value: any) => void;
    required?: boolean;
    description?: string;
    fieldName?: string;
  }) => {
    const status = fieldName ? fileProcessingStatus[fieldName] : undefined;
    const uploadedFile = fieldName ? uploadedFiles[fieldName] : null;

    const getStatusIcon = () => {
      switch (status) {
        case "uploading":
          return <Loader2 className='w-4 h-4 animate-spin text-blue-500' />;
        case "completed":
          return <CheckCircle className='w-4 h-4 text-green-500' />;
        case "error":
          return <AlertCircle className='w-4 h-4 text-red-500' />;
        default:
          return null;
      }
    };

    const getStatusColor = () => {
      switch (status) {
        case "uploading":
          return "border-blue-300 bg-blue-50";
        case "completed":
          return "border-green-300 bg-green-50";
        case "error":
          return "border-red-300 bg-red-50";
        default:
          return "border-slate-300";
      }
    };

    const isUploaded = status === "completed" && uploadedFile;
    const fileUrl = uploadedFile?.imageUrl || uploadedFile?.s3Url || (typeof value === 'string' && value.startsWith('http') ? value : null);

    return (
      <div className='mb-4'>
        <label className='block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
          {getStatusIcon()}
        </label>
        {description && (
          <p className='text-sm text-slate-600 mb-2'>{description}</p>
        )}
        
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-slate-400 transition-colors ${getStatusColor()}`}
        >
          <Upload className='w-8 h-8 text-slate-400 mx-auto mb-2' />
          <p className='text-slate-600 mb-2'>
            {isUploaded
              ? `File uploaded: ${uploadedFile.fileName} (${uploadedFile.sizeMB}MB)`
              : "Click to upload or drag and drop"}
          </p>
          <p className='text-xs text-slate-500 mb-3'>{accept}</p>
          
          {/* Show file URL for uploaded files */}
          {fileUrl && (
            <div className='mb-3'>
              <a 
                href={fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className='text-blue-600 hover:text-blue-800 text-sm underline'
              >
                View uploaded file
              </a>
            </div>
          )}

          <input
            type='file'
            accept={accept}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size > 50 * 1024 * 1024) { // 50MB limit
                  toast.warn("File size must be less than 50MB");
                  return;
                }

                // ✅ Immediately upload the file when selected
                if (fieldName) {
                  await handleFileUpload(file, fieldName);
                }
              }
            }}
            className='hidden'
            id={`upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
            disabled={isUploading || status === "uploading"}
          />
          <label
            htmlFor={`upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
            className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              isUploading || status === "uploading"
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : isUploaded
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {status === "uploading" 
              ? "Uploading..." 
              : isUploaded 
              ? "Re-upload File" 
              : "Choose File"}
          </label>
        </div>
      </div>
    );
  };

  return (
    <FormStep
      title='Media Uploads'
      description='Upload your company logo, certificates, and other media assets.'
      onNext={handleSubmit}
      onPrev={onPrev}
      isValid={isValid && !isUploading}
      currentStep={6}
      totalSteps={6}
      isLastStep={true} // Add this line
    >
      <div className='space-y-8'>
        {/* Upload Progress */}
        {isUploading && (
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
            <div className='flex items-center mb-2'>
              <Loader2 className='w-5 h-5 animate-spin text-blue-600 mr-2' />
              <h3 className='text-lg font-semibold text-blue-800'>
                Processing Submission...
              </h3>
            </div>
            <p className='text-blue-700 mb-3'>{uploadStatus}</p>
            <div className='w-full bg-blue-200 rounded-full h-3'>
              <div
                className='bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out'
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className='text-sm text-blue-600 mt-2'>
              {uploadProgress}% complete
            </p>
          </div>
        )}

        {/* Brand & Site Images */}
        <FileUploadSection
          title='Brand & Site Images'
          icon={Image}
          bgColor='bg-blue-50'
        >
          <div className='space-y-6'>
            <FileUploadBox
              label='Company Logo'
              accept='.png,.svg,.jpg,.jpeg'
              value={formData?.companyLogoUrl}
              onChange={(val) => updateFormData({ companyLogoUrl: val })}
              description='PNG/SVG preferred, minimum 1000×1000px, max 5MB. If no logo is uploaded, a default logo will be used.'
              fieldName='companyLogoUrl'
            />
          </div>
          <p className='text-sm text-blue-700 mt-4'>
            <strong>Note:</strong> Files are uploaded immediately when selected. AI will generate additional images and design elements for your website automatically.
          </p>
        </FileUploadSection>

        {/* Documents & Certificates */}
        <FileUploadSection
          title='Documents & Certificates'
          icon={FileText}
          bgColor='bg-green-50'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FileUploadBox
              label='DGCA Type Certificate'
              accept='.pdf,.jpg,.jpeg,.png'
              value={formData?.dgcaTypeCertificateUrl}
              onChange={(val) =>
                updateFormData({ dgcaTypeCertificateUrl: val })
              }
              description='DGCA certification document, max 5MB'
              fieldName='dgcaTypeCertificateUrl'
            />

            <FileUploadBox
              label='RPTO Authorisation Certificate'
              accept='.pdf,.jpg,.jpeg,.png'
              value={formData?.rptoAuthorisationCertificateUrl}
              onChange={(val) =>
                updateFormData({ rptoAuthorisationCertificateUrl: val })
              }
              description='RPTO certification document, max 5MB'
              fieldName='rptoAuthorisationCertificateUrl'
            />

            <FileUploadBox
              label='Company Brochure'
              accept='.pdf'
              value={formData?.brochurePdfUrl}
              onChange={(val) => updateFormData({ brochurePdfUrl: val })}
              description='Company brochure PDF, max 5MB'
              fieldName='brochurePdfUrl'
            />

            <FileUploadBox
              label='Product Catalogue'
              accept='.pdf'
              value={formData?.cataloguePdfUrl}
              onChange={(val) => updateFormData({ cataloguePdfUrl: val })}
              description='Product catalogue PDF, max 5MB'
              fieldName='cataloguePdfUrl'
            />

            <FileUploadBox
              label='Case Studies'
              accept='.pdf,.doc,.docx'
              value={formData?.caseStudiesUrl}
              onChange={(val) => updateFormData({ caseStudiesUrl: val })}
              description='Case studies document, max 5MB'
              fieldName='caseStudiesUrl'
            />

            <FileUploadBox
              label='Brand Guidelines'
              accept='.pdf'
              value={formData?.brandGuidelinesUrl}
              onChange={(val) => updateFormData({ brandGuidelinesUrl: val })}
              description='Brand guidelines PDF, max 5MB'
              fieldName='brandGuidelinesUrl'
            />
          </div>
        </FileUploadSection>

        {/* Videos & Links */}
        <FileUploadSection
          title='Videos & Promotional Content'
          icon={Video}
          bgColor='bg-purple-50'
        >
          <div className='space-y-4'>
            <FormInput
              label='Promotional Video (5 minutes)'
              type='url'
              value={formData?.promoVideoFiveMinUrl || ""}
              onChange={(value) =>
                updateFormData({ promoVideoFiveMinUrl: value })
              }
              placeholder='https://youtube.com/watch?v=...'
              disabled={isUploading}
            />

            <FormInput
              label='Promotional Video (1 minute)'
              type='url'
              value={formData?.promoVideoOneMinUrl || ""}
              onChange={(value) =>
                updateFormData({ promoVideoOneMinUrl: value })
              }
              placeholder='https://youtube.com/watch?v=...'
              disabled={isUploading}
            />

            <FormInput
              label='Company Profile Link'
              type='url'
              value={formData?.companyProfileLink || ""}
              onChange={(value) =>
                updateFormData({ companyProfileLink: value })
              }
              placeholder='https://drive.google.com/...'
              disabled={isUploading}
            />
          </div>

          <div className='mt-6 p-4 bg-purple-100 rounded-lg'>
            <h4 className='font-semibold text-purple-900 mb-2'>
              Video Guidelines:
            </h4>
            <ul className='text-purple-800 text-sm space-y-1'>
              <li>• Videos should be 1080p or higher resolution</li>
              <li>• YouTube, Vimeo, or Google Drive links are preferred</li>
              <li>
                • Ensure videos are publicly accessible or properly shared
              </li>
              <li>• 5-minute video: Comprehensive company overview</li>
              <li>• 1-minute video: Quick highlights for social media</li>
            </ul>
          </div>
        </FileUploadSection>

        {/* Upload Summary */}
        <div className='bg-slate-100 rounded-lg p-6'>
          <h3 className='text-lg font-bold text-slate-900 mb-4'>
            Upload Summary
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <h4 className='font-semibold text-slate-800 mb-2'>
                Files Status:
              </h4>
              <ul className='space-y-1 text-sm'>
                {Object.keys(uploadedFiles).length === 0 ? (
                  <li className='text-slate-600'>No files uploaded yet</li>
                ) : (
                  Object.keys(uploadedFiles).map((fieldName) => (
                    <li key={fieldName} className='flex items-center text-green-600'>
                      <span className='w-2 h-2 rounded-full mr-2 bg-current'></span>
                      {fieldName} ✓ Uploaded ({uploadedFiles[fieldName].sizeMB}MB)
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div>
              <h4 className='font-semibold text-slate-800 mb-2'>
                Upload Method:
              </h4>
              <ul className='space-y-1 text-sm text-slate-600'>
                <li>• Files upload immediately when selected</li>
                <li>• Improved performance and reliability</li>
                <li>• All files are securely stored in AWS S3</li>
                <li>• Click "View uploaded file" to verify uploads</li>
              </ul>
            </div>
          </div>

          <div className='mt-6 p-4 bg-green-50 rounded-lg border border-green-200'>
            <h4 className='font-semibold text-green-800 mb-2'>
              🎉 Ready to Generate Your Website!
            </h4>
            <p className='text-green-700 text-sm'>
              Files are uploaded individually for better performance. Once you click "Submit Form", 
              our AI will create a professional website with all your information, generate additional 
              content, optimize for SEO, and create a beautiful design that matches your industry.
            </p>
          </div>
        </div>
      </div>
    </FormStep>
  );
};

export default Step8MediaUploads;