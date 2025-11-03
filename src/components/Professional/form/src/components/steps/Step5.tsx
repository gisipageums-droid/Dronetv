import { useLocation } from "react-router-dom";
import { useForm } from "../../context/FormContext";
import { FileUploader } from "../common/FileUploader";
import { Trash2, RefreshCw } from "lucide-react";

export const Step5 = ({ step }: { step: any }) => {
  const { data, updateField } = useForm();
  const email = data.basicInfo?.email || "unknown@example.com";

  const location = useLocation();
  
  // ✅ Get template from BOTH sources: form context (for prefill) OR URL state (for new forms)
  const templateSelection = data.templateSelection || location.state?.templateId;

  // Function to handle file replacement
  const handleFileReplace = (fieldName: string, newFileData: any) => {
    const updatedMedia = data.media.map((item: any) => 
      item.fieldName === fieldName ? newFileData : item
    );
    updateField('media', updatedMedia);
  };

  // Function to handle file deletion
  const handleFileDelete = (fieldName: string) => {
    const updatedMedia = data.media.filter((item: any) => item.fieldName !== fieldName);
    updateField('media', updatedMedia);
  };

  // Function to check if a field already has a file
  const getExistingFile = (fieldName: string) => {
    return data.media.find((item: any) => item.fieldName === fieldName);
  };

  // Helper: detect file type from URL/extension
  const renderPreview = (url: string, fieldName: string) => {
    if (!url) return null;

    const lower = url.toLowerCase();

    if (lower.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      // image
      return (
        <div className="relative group">
          <a href={url} target="_blank" rel="noopener noreferrer">
            <img
              src={url}
              alt="Uploaded preview"
              className="w-40 h-40 object-cover rounded-xl shadow hover:scale-105 transition-transform"
            />
          </a>
          {/* Hover overlay with actions */}
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => handleFileDelete(fieldName)}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Delete image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              title="View full size"
            >
              <RefreshCw className="w-4 h-4" />
            </a>
          </div>
        </div>
      );
    } else if (lower.endsWith(".pdf")) {
      // pdf
      return (
        <div className="relative group">
          <iframe
            src={url}
            className="w-60 h-40 border rounded-lg shadow"
            title="PDF Preview"
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button
              onClick={() => handleFileDelete(fieldName)}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Delete document"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      );
    } else {
      // any other doc — show download
      return (
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-3 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-sm rounded-lg shadow hover:opacity-90"
          >
            View / Download
          </a>
          <button
            onClick={() => handleFileDelete(fieldName)}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            title="Delete document"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Selection Summary */}
      <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6'>
        <h3 className='text-lg font-semibold text-yellow-800 mb-2'>
          📋 Selected Template
        </h3>
        <div className='text-yellow-700'>
          {templateSelection ? (
            <>
              <p>
                <strong>Template:</strong>{" "}
                {templateSelection === 1
                  ? "Modern template"
                  : templateSelection === 2
                    ? "Professional template"
                    : `Template ${templateSelection}`}
              </p>
              <p>
                <strong>Template ID:</strong>{" "}
                {templateSelection}
              </p>
              <p className="text-sm text-green-600 mt-1">
                ✅ {data.templateSelection ? "From saved data" : "From URL selection"}
              </p>
            </>
          ) : (
            <p className='text-red-600'>
              ⚠️ No template selected. Please go back and select a template.
            </p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 px-10 py-5">
        <h2 className="text-2xl font-bold text-xl">{step.title}</h2>

        {/* Upload fields */}
        <div className="grid gap-6 py-8">
          {step.media?.fields?.map((f: any) => {
            const existingFile = getExistingFile(f.id);
            
            return (
              <div
                key={f.id}
                className="p-5 bg-green-50 rounded-2xl shadow-lg border-2 border-dashed border-green-400 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <label className="block text-lg font-medium text-gray-700">
                    {f.label}
                  </label>
                  {existingFile && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      File uploaded
                    </div>
                  )}
                </div>

                {existingFile && (
                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Current file:
                      </span>
                      <button
                        onClick={() => handleFileDelete(f.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Delete current file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex justify-center">
                      {renderPreview(existingFile.fileUrl, f.id)}
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Upload a new file to replace this one
                    </p>
                  </div>
                )}

                <FileUploader
                  userId={email}
                  fieldName={f.id}
                  maxSizeMB={step.media.maxSizeMB}
                  onUploadSuccess={(uploadedFile) => handleFileReplace(f.id, uploadedFile)}
                  showReplaceMessage={!!existingFile}
                />
              </div>
            );
          })}
        </div>

        <p className='text-sm text-blue-700 mt-4'>
          <strong>Note:</strong> Files are uploaded immediately when selected. Uploading a new file will replace the existing one. AI will generate additional images and design elements for your website automatically.
        </p>
      </div>

      {/* Uploaded Files Summary */}
      <div className="p-6 bg-blue-50 rounded-2xl shadow-inner space-y-4">
        <h3 className="text-xl font-semibold">
          Uploaded Files Summary
        </h3>
        {data.media.length === 0 ? (
          <p className="text-gray-500">No files uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.media.map((m: any) => (
              <div
                key={m.fieldName}
                className="p-4 bg-white border border-green-300 rounded-xl shadow-sm space-y-3"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-700 capitalize">
                    {m.fieldName.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <button
                    onClick={() => handleFileDelete(m.fieldName)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                    title={`Delete ${m.fieldName}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-center">
                  {renderPreview(m.fileUrl, m.fieldName)}
                </div>
                <div className="text-xs text-gray-500 text-center">
                  <p>File: {m.fileName}</p>
                  <p>Type: {m.contentType}</p>
                  {m.uploadedAt && (
                    <p>Uploaded: {new Date(m.uploadedAt).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
              {data.media.length === 0 ? (
                <li className='text-slate-600'>No files uploaded yet</li>
              ) : (
                data.media.map((m: any) => (
                  <li
                    key={m.fieldName}
                    className='flex items-center justify-between text-green-600'
                  >
                    <div className="flex items-center">
                      <span className='w-2 h-2 rounded-full mr-2 bg-current'></span>
                      {m.fieldName} ✓ Uploaded
                    </div>
                    <button
                      onClick={() => handleFileDelete(m.fieldName)}
                      className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                      title={`Delete ${m.fieldName}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div>
            <h4 className='font-semibold text-slate-800 mb-2'>
              Upload Features:
            </h4>
            <ul className='space-y-1 text-sm text-slate-600'>
              <li>• Replace existing files by uploading new ones</li>
              <li>• Delete files individually with the trash icon</li>
              <li>• Files upload immediately when selected</li>
              <li>• All files are securely stored in AWS S3</li>
            </ul>
          </div>
        </div>

        <div className='mt-6 p-4 bg-green-50 rounded-lg border border-green-200'>
          <h4 className='font-semibold text-green-800 mb-2'>
            🎉 Ready to Generate Your Website!
          </h4>
          <p className='text-green-700 text-sm'>
            {data.media.length > 0 
              ? `You have ${data.media.length} file${data.media.length > 1 ? 's' : ''} uploaded. `
              : "Upload your files to get started. "}
            Once you click "Submit Form", our AI will create a professional website with all your information, 
            generate additional content, optimize for SEO, and create a beautiful design that matches your industry.
          </p>
        </div>
      </div>
    </div>
  );
};