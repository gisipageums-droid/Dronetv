// import { useLocation } from "react-router-dom";
// import { useForm } from "../../context/FormContext";
// import { FileUploader } from "../common/FileUploader";
// import { Trash2, RefreshCw } from "lucide-react";

// export const Step5 = ({ step }: { step: any }) => {
//   const { data, updateField } = useForm();
//   const email = data.basicInfo?.email || "unknown@example.com";

//   const location = useLocation();
  
//   // ✅ Get template from BOTH sources: form context (for prefill) OR URL state (for new forms)
//   const templateSelection = data.templateSelection || location.state?.templateId;

//   // Function to handle file replacement
//   const handleFileReplace = (fieldName: string, newFileData: any) => {
//     const updatedMedia = data.media.map((item: any) => 
//       item.fieldName === fieldName ? newFileData : item
//     );
//     updateField('media', updatedMedia);
//   };

//   // Function to handle file deletion
//   const handleFileDelete = (fieldName: string) => {
//     const updatedMedia = data.media.filter((item: any) => item.fieldName !== fieldName);
//     updateField('media', updatedMedia);
//   };

//   // Function to check if a field already has a file
//   const getExistingFile = (fieldName: string) => {
//     return data.media.find((item: any) => item.fieldName === fieldName);
//   };

//   // Helper: detect file type from URL/extension
//   const renderPreview = (url: string, fieldName: string) => {
//     if (!url) return null;

//     const lower = url.toLowerCase();

//     if (lower.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
//       // image
//       return (
//         <div className="relative group">
//           <a href={url} target="_blank" rel="noopener noreferrer">
//             <img
//               src={url}
//               alt="Uploaded preview"
//               className="w-40 h-40 object-cover rounded-xl shadow hover:scale-105 transition-transform"
//             />
//           </a>
//           {/* Hover overlay with actions */}
//           <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
//             <button
//               onClick={() => handleFileDelete(fieldName)}
//               className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
//               title="Delete image"
//             >
//               <Trash2 className="w-4 h-4" />
//             </button>
//             <a
//               href={url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
//               title="View full size"
//             >
//               <RefreshCw className="w-4 h-4" />
//             </a>
//           </div>
//         </div>
//       );
//     } else if (lower.endsWith(".pdf")) {
//       // pdf
//       return (
//         <div className="relative group">
//           <iframe
//             src={url}
//             className="w-60 h-40 border rounded-lg shadow"
//             title="PDF Preview"
//           />
//           <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
//             <button
//               onClick={() => handleFileDelete(fieldName)}
//               className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
//               title="Delete document"
//             >
//               <Trash2 className="w-3 h-3" />
//             </button>
//           </div>
//         </div>
//       );
//     } else {
//       // any other doc — show download
//       return (
//         <div className="flex items-center gap-2">
//           <a
//             href={url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="inline-block px-3 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-sm rounded-lg shadow hover:opacity-90"
//           >
//             View / Download
//           </a>
//           <button
//             onClick={() => handleFileDelete(fieldName)}
//             className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
//             title="Delete document"
//           >
//             <Trash2 className="w-3 h-3" />
//           </button>
//         </div>
//       );
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Template Selection Summary */}
//       <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6'>
//         <h3 className='text-lg font-semibold text-yellow-800 mb-2'>
//           📋 Selected Template
//         </h3>
//         <div className='text-yellow-700'>
//           {templateSelection ? (
//             <>
//               <p>
//                 <strong>Template:</strong>{" "}
//                 {templateSelection === 1
//                   ? "Modern template"
//                   : templateSelection === 2
//                     ? "Professional template"
//                     : `Template ${templateSelection}`}
//               </p>
//               <p>
//                 <strong>Template ID:</strong>{" "}
//                 {templateSelection}
//               </p>
//               <p className="text-sm text-green-600 mt-1">
//                 ✅ {data.templateSelection ? "From saved data" : "From URL selection"}
//               </p>
//             </>
//           ) : (
//             <p className='text-red-600'>
//               ⚠️ No template selected. Please go back and select a template.
//             </p>
//           )}
//         </div>
//       </div>

//       <div className="bg-blue-50 px-10 py-5">
//         <h2 className="text-2xl font-bold text-xl">{step.title}</h2>

//         {/* Upload fields */}
//         <div className="grid gap-6 py-8">
//           {step.media?.fields?.map((f: any) => {
//             const existingFile = getExistingFile(f.id);
            
//             return (
//               <div
//                 key={f.id}
//                 className="p-5 bg-green-50 rounded-2xl shadow-lg border-2 border-dashed border-green-400 space-y-3"
//               >
//                 <div className="flex justify-between items-center">
//                   <label className="block text-lg font-medium text-gray-700">
//                     {f.label}
//                   </label>
//                   {existingFile && (
//                     <div className="flex items-center gap-2 text-sm text-green-600">
//                       <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                       File uploaded
//                     </div>
//                   )}
//                 </div>

//                 {existingFile && (
//                   <div className="bg-white p-3 rounded-lg border border-green-200">
//                     <div className="flex justify-between items-center mb-2">
//                       <span className="text-sm font-medium text-gray-700">
//                         Current file:
//                       </span>
//                       <button
//                         onClick={() => handleFileDelete(f.id)}
//                         className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
//                         title="Delete current file"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                     <div className="flex justify-center">
//                       {renderPreview(existingFile.fileUrl, f.id)}
//                     </div>
//                     <p className="text-xs text-gray-500 text-center mt-2">
//                       Upload a new file to replace this one
//                     </p>
//                   </div>
//                 )}

//                 <FileUploader
//                   userId={email}
//                   fieldName={f.id}
//                   maxSizeMB={step.media.maxSizeMB}
//                   onUploadSuccess={(uploadedFile) => handleFileReplace(f.id, uploadedFile)}
//                   showReplaceMessage={!!existingFile}
//                 />
//               </div>
//             );
//           })}
//         </div>

//         <p className='text-sm text-blue-700 mt-4'>
//           <strong>Note:</strong> Files are uploaded immediately when selected. Uploading a new file will replace the existing one. AI will generate additional images and design elements for your website automatically.
//         </p>
//       </div>

//       {/* Uploaded Files Summary */}
//       <div className="p-6 bg-blue-50 rounded-2xl shadow-inner space-y-4">
//         <h3 className="text-xl font-semibold">
//           Uploaded Files Summary
//         </h3>
//         {data.media.length === 0 ? (
//           <p className="text-gray-500">No files uploaded yet.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {data.media.map((m: any) => (
//               <div
//                 key={m.fieldName}
//                 className="p-4 bg-white border border-green-300 rounded-xl shadow-sm space-y-3"
//               >
//                 <div className="flex justify-between items-center">
//                   <p className="text-sm font-medium text-gray-700 capitalize">
//                     {m.fieldName.replace(/([A-Z])/g, ' $1').trim()}
//                   </p>
//                   <button
//                     onClick={() => handleFileDelete(m.fieldName)}
//                     className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
//                     title={`Delete ${m.fieldName}`}
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//                 <div className="flex justify-center">
//                   {renderPreview(m.fileUrl, m.fieldName)}
//                 </div>
//                 <div className="text-xs text-gray-500 text-center">
//                   <p>File: {m.fileName}</p>
//                   <p>Type: {m.contentType}</p>
//                   {m.uploadedAt && (
//                     <p>Uploaded: {new Date(m.uploadedAt).toLocaleDateString()}</p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Upload Summary */}
//       <div className='bg-slate-100 rounded-lg p-6'>
//         <h3 className='text-lg font-bold text-slate-900 mb-4'>
//           Upload Summary
//         </h3>
//         <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//           <div>
//             <h4 className='font-semibold text-slate-800 mb-2'>
//               Files Status:
//             </h4>
//             <ul className='space-y-1 text-sm'>
//               {data.media.length === 0 ? (
//                 <li className='text-slate-600'>No files uploaded yet</li>
//               ) : (
//                 data.media.map((m: any) => (
//                   <li
//                     key={m.fieldName}
//                     className='flex items-center justify-between text-green-600'
//                   >
//                     <div className="flex items-center">
//                       <span className='w-2 h-2 rounded-full mr-2 bg-current'></span>
//                       {m.fieldName} ✓ Uploaded
//                     </div>
//                     <button
//                       onClick={() => handleFileDelete(m.fieldName)}
//                       className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
//                       title={`Delete ${m.fieldName}`}
//                     >
//                       <Trash2 className="w-3 h-3" />
//                     </button>
//                   </li>
//                 ))
//               )}
//             </ul>
//           </div>

//           <div>
//             <h4 className='font-semibold text-slate-800 mb-2'>
//               Upload Features:
//             </h4>
//             <ul className='space-y-1 text-sm text-slate-600'>
//               <li>• Replace existing files by uploading new ones</li>
//               <li>• Delete files individually with the trash icon</li>
//               <li>• Files upload immediately when selected</li>
//               <li>• All files are securely stored in AWS S3</li>
//             </ul>
//           </div>
//         </div>

//         <div className='mt-6 p-4 bg-green-50 rounded-lg border border-green-200'>
//           <h4 className='font-semibold text-green-800 mb-2'>
//             🎉 Ready to Generate Your Website!
//           </h4>
//           <p className='text-green-700 text-sm'>
//             {data.media.length > 0 
//               ? `You have ${data.media.length} file${data.media.length > 1 ? 's' : ''} uploaded. `
//               : "Upload your files to get started. "}
//             Once you click "Submit Form", our AI will create a professional website with all your information, 
//             generate additional content, optimize for SEO, and create a beautiful design that matches your industry.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };



import { useLocation } from "react-router-dom";
import { useForm } from "../../context/FormContext";
import { FileUploader } from "../common/FileUploader";
import { Trash2, RefreshCw, Eye, X } from "lucide-react";
import { useState } from "react";

export const Step5 = ({ step }: { step: any }) => {
  const { data, updateField } = useForm();
  const email = data.basicInfo?.email || "unknown@example.com";
  const location = useLocation();
  
  // State for full view modal
  const [fullViewUrl, setFullViewUrl] = useState<string | null>(null);
  const [fullViewType, setFullViewType] = useState<string | null>(null);
  const [fullViewFileName, setFullViewFileName] = useState<string | null>(null);

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

  // Function to open full view
  const openFullView = (url: string, fileName: string) => {
    const lower = url.toLowerCase();
    let fileType = 'other';
    
    if (lower.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      fileType = 'image';
    } else if (lower.endsWith(".pdf")) {
      fileType = 'pdf';
    } else if (lower.match(/\.(doc|docx)$/)) {
      fileType = 'word';
    } else if (lower.match(/\.(xls|xlsx)$/)) {
      fileType = 'excel';
    } else if (lower.match(/\.(ppt|pptx)$/)) {
      fileType = 'powerpoint';
    } else if (lower.match(/\.(txt)$/)) {
      fileType = 'text';
    }
    
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

  // Render full view modal
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
                  <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Document Preview
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
              {fullViewType} document
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

  // Helper: detect file type from URL/extension
  const renderPreview = (url: string, fieldName: string, fileName: string) => {
    if (!url) return null;

    const lower = url.toLowerCase();

    if (lower.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      // image
      return (
        <div className="relative group">
          <button
            onClick={() => openFullView(url, fileName)}
            className="w-40 h-40 rounded-xl shadow hover:scale-105 transition-transform overflow-hidden"
          >
            <img
              src={url}
              alt="Uploaded preview"
              className="w-full h-full object-cover"
            />
          </button>
          {/* Hover overlay with actions */}
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openFullView(url, fileName);
              }}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              title="View full size"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFileDelete(fieldName);
              }}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Delete image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    } else if (lower.endsWith(".pdf")) {
      // pdf
      return (
        <div className="relative group">
          <button
            onClick={() => openFullView(url, fileName)}
            className="w-60 h-40 border rounded-lg shadow hover:border-blue-400 transition-colors flex flex-col items-center justify-center bg-white"
          >
            <div className="text-red-500 mb-2">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">PDF Document</span>
            <span className="text-xs text-gray-500 mt-1">Click to view</span>
          </button>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openFullView(url, fileName);
              }}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              title="View document"
            >
              <Eye className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFileDelete(fieldName);
              }}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Delete document"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      );
    } else {
      // any other doc — show download with view option
      const getFileIcon = (filename: string) => {
        const lower = filename.toLowerCase();
        if (lower.match(/\.(doc|docx)$/)) return "📄";
        if (lower.match(/\.(xls|xlsx)$/)) return "📊";
        if (lower.match(/\.(ppt|pptx)$/)) return "📽️";
        if (lower.match(/\.(txt)$/)) return "📝";
        return "📁";
      };

      return (
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
          <span className="text-2xl">{getFileIcon(fileName)}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">
              {fileName}
            </p>
            <p className="text-xs text-gray-500">
              Click to view or download
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => openFullView(url, fileName)}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
              title="View document"
            >
              <Eye className="w-3 h-3" />
              <span className="text-xs">View</span>
            </button>
            <button
              onClick={() => handleFileDelete(fieldName)}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              title="Delete document"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Full View Modal */}
      {renderFullViewModal()}

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
                      {renderPreview(existingFile.fileUrl, f.id, existingFile.fileName)}
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
                  {renderPreview(m.fileUrl, m.fieldName, m.fileName)}
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
              <li>• Click on any uploaded file to view it in full screen</li>
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