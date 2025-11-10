// // import { useLocation } from "react-router-dom";
// // import { useForm } from "../../context/FormContext";
// // import { FileUploader } from "../common/FileUploader";
// // import { Trash2, RefreshCw } from "lucide-react";

// // export const Step5 = ({ step }: { step: any }) => {
// //   const { data, updateField } = useForm();
// //   const email = data.basicInfo?.email || "unknown@example.com";

// //   const location = useLocation();
  
// //   // ✅ Get template from BOTH sources: form context (for prefill) OR URL state (for new forms)
// //   const templateSelection = data.templateSelection || location.state?.templateId;

// //   // Function to handle file replacement
// //   const handleFileReplace = (fieldName: string, newFileData: any) => {
// //     const updatedMedia = data.media.map((item: any) => 
// //       item.fieldName === fieldName ? newFileData : item
// //     );
// //     updateField('media', updatedMedia);
// //   };

// //   // Function to handle file deletion
// //   const handleFileDelete = (fieldName: string) => {
// //     const updatedMedia = data.media.filter((item: any) => item.fieldName !== fieldName);
// //     updateField('media', updatedMedia);
// //   };

// //   // Function to check if a field already has a file
// //   const getExistingFile = (fieldName: string) => {
// //     return data.media.find((item: any) => item.fieldName === fieldName);
// //   };

// //   // Helper: detect file type from URL/extension
// //   const renderPreview = (url: string, fieldName: string) => {
// //     if (!url) return null;

// //     const lower = url.toLowerCase();

// //     if (lower.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
// //       // image
// //       return (
// //         <div className="relative group">
// //           <a href={url} target="_blank" rel="noopener noreferrer">
// //             <img
// //               src={url}
// //               alt="Uploaded preview"
// //               className="w-40 h-40 object-cover rounded-xl shadow hover:scale-105 transition-transform"
// //             />
// //           </a>
// //           {/* Hover overlay with actions */}
// //           <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
// //             <button
// //               onClick={() => handleFileDelete(fieldName)}
// //               className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
// //               title="Delete image"
// //             >
// //               <Trash2 className="w-4 h-4" />
// //             </button>
// //             <a
// //               href={url}
// //               target="_blank"
// //               rel="noopener noreferrer"
// //               className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
// //               title="View full size"
// //             >
// //               <RefreshCw className="w-4 h-4" />
// //             </a>
// //           </div>
// //         </div>
// //       );
// //     } else if (lower.endsWith(".pdf")) {
// //       // pdf
// //       return (
// //         <div className="relative group">
// //           <iframe
// //             src={url}
// //             className="w-60 h-40 border rounded-lg shadow"
// //             title="PDF Preview"
// //           />
// //           <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
// //             <button
// //               onClick={() => handleFileDelete(fieldName)}
// //               className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
// //               title="Delete document"
// //             >
// //               <Trash2 className="w-3 h-3" />
// //             </button>
// //           </div>
// //         </div>
// //       );
// //     } else {
// //       // any other doc — show download
// //       return (
// //         <div className="flex items-center gap-2">
// //           <a
// //             href={url}
// //             target="_blank"
// //             rel="noopener noreferrer"
// //             className="inline-block px-3 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-sm rounded-lg shadow hover:opacity-90"
// //           >
// //             View / Download
// //           </a>
// //           <button
// //             onClick={() => handleFileDelete(fieldName)}
// //             className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
// //             title="Delete document"
// //           >
// //             <Trash2 className="w-3 h-3" />
// //           </button>
// //         </div>
// //       );
// //     }
// //   };

// //   return (
// //     <div className="space-y-6">
// //       {/* Template Selection Summary */}
// //       <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6'>
// //         <h3 className='text-lg font-semibold text-yellow-800 mb-2'>
// //           📋 Selected Template
// //         </h3>
// //         <div className='text-yellow-700'>
// //           {templateSelection ? (
// //             <>
// //               <p>
// //                 <strong>Template:</strong>{" "}
// //                 {templateSelection === 1
// //                   ? "Modern template"
// //                   : templateSelection === 2
// //                     ? "Professional template"
// //                     : `Template ${templateSelection}`}
// //               </p>
// //               <p>
// //                 <strong>Template ID:</strong>{" "}
// //                 {templateSelection}
// //               </p>
// //               <p className="text-sm text-green-600 mt-1">
// //                 ✅ {data.templateSelection ? "From saved data" : "From URL selection"}
// //               </p>
// //             </>
// //           ) : (
// //             <p className='text-red-600'>
// //               ⚠️ No template selected. Please go back and select a template.
// //             </p>
// //           )}
// //         </div>
// //       </div>

// //       <div className="bg-blue-50 px-10 py-5">
// //         <h2 className="text-2xl font-bold text-xl">{step.title}</h2>

// //         {/* Upload fields */}
// //         <div className="grid gap-6 py-8">
// //           {step.media?.fields?.map((f: any) => {
// //             const existingFile = getExistingFile(f.id);
            
// //             return (
// //               <div
// //                 key={f.id}
// //                 className="p-5 bg-green-50 rounded-2xl shadow-lg border-2 border-dashed border-green-400 space-y-3"
// //               >
// //                 <div className="flex justify-between items-center">
// //                   <label className="block text-lg font-medium text-gray-700">
// //                     {f.label}
// //                   </label>
// //                   {existingFile && (
// //                     <div className="flex items-center gap-2 text-sm text-green-600">
// //                       <div className="w-2 h-2 bg-green-500 rounded-full"></div>
// //                       File uploaded
// //                     </div>
// //                   )}
// //                 </div>

// //                 {existingFile && (
// //                   <div className="bg-white p-3 rounded-lg border border-green-200">
// //                     <div className="flex justify-between items-center mb-2">
// //                       <span className="text-sm font-medium text-gray-700">
// //                         Current file:
// //                       </span>
// //                       <button
// //                         onClick={() => handleFileDelete(f.id)}
// //                         className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
// //                         title="Delete current file"
// //                       >
// //                         <Trash2 className="w-4 h-4" />
// //                       </button>
// //                     </div>
// //                     <div className="flex justify-center">
// //                       {renderPreview(existingFile.fileUrl, f.id)}
// //                     </div>
// //                     <p className="text-xs text-gray-500 text-center mt-2">
// //                       Upload a new file to replace this one
// //                     </p>
// //                   </div>
// //                 )}

// //                 <FileUploader
// //                   userId={email}
// //                   fieldName={f.id}
// //                   maxSizeMB={step.media.maxSizeMB}
// //                   onUploadSuccess={(uploadedFile) => handleFileReplace(f.id, uploadedFile)}
// //                   showReplaceMessage={!!existingFile}
// //                 />
// //               </div>
// //             );
// //           })}
// //         </div>

// //         <p className='text-sm text-blue-700 mt-4'>
// //           <strong>Note:</strong> Files are uploaded immediately when selected. Uploading a new file will replace the existing one. AI will generate additional images and design elements for your website automatically.
// //         </p>
// //       </div>

// //       {/* Uploaded Files Summary */}
// //       <div className="p-6 bg-blue-50 rounded-2xl shadow-inner space-y-4">
// //         <h3 className="text-xl font-semibold">
// //           Uploaded Files Summary
// //         </h3>
// //         {data.media.length === 0 ? (
// //           <p className="text-gray-500">No files uploaded yet.</p>
// //         ) : (
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             {data.media.map((m: any) => (
// //               <div
// //                 key={m.fieldName}
// //                 className="p-4 bg-white border border-green-300 rounded-xl shadow-sm space-y-3"
// //               >
// //                 <div className="flex justify-between items-center">
// //                   <p className="text-sm font-medium text-gray-700 capitalize">
// //                     {m.fieldName.replace(/([A-Z])/g, ' $1').trim()}
// //                   </p>
// //                   <button
// //                     onClick={() => handleFileDelete(m.fieldName)}
// //                     className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
// //                     title={`Delete ${m.fieldName}`}
// //                   >
// //                     <Trash2 className="w-4 h-4" />
// //                   </button>
// //                 </div>
// //                 <div className="flex justify-center">
// //                   {renderPreview(m.fileUrl, m.fieldName)}
// //                 </div>
// //                 <div className="text-xs text-gray-500 text-center">
// //                   <p>File: {m.fileName}</p>
// //                   <p>Type: {m.contentType}</p>
// //                   {m.uploadedAt && (
// //                     <p>Uploaded: {new Date(m.uploadedAt).toLocaleDateString()}</p>
// //                   )}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>

// //       {/* Upload Summary */}
// //       <div className='bg-slate-100 rounded-lg p-6'>
// //         <h3 className='text-lg font-bold text-slate-900 mb-4'>
// //           Upload Summary
// //         </h3>
// //         <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
// //           <div>
// //             <h4 className='font-semibold text-slate-800 mb-2'>
// //               Files Status:
// //             </h4>
// //             <ul className='space-y-1 text-sm'>
// //               {data.media.length === 0 ? (
// //                 <li className='text-slate-600'>No files uploaded yet</li>
// //               ) : (
// //                 data.media.map((m: any) => (
// //                   <li
// //                     key={m.fieldName}
// //                     className='flex items-center justify-between text-green-600'
// //                   >
// //                     <div className="flex items-center">
// //                       <span className='w-2 h-2 rounded-full mr-2 bg-current'></span>
// //                       {m.fieldName} ✓ Uploaded
// //                     </div>
// //                     <button
// //                       onClick={() => handleFileDelete(m.fieldName)}
// //                       className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
// //                       title={`Delete ${m.fieldName}`}
// //                     >
// //                       <Trash2 className="w-3 h-3" />
// //                     </button>
// //                   </li>
// //                 ))
// //               )}
// //             </ul>
// //           </div>

// //           <div>
// //             <h4 className='font-semibold text-slate-800 mb-2'>
// //               Upload Features:
// //             </h4>
// //             <ul className='space-y-1 text-sm text-slate-600'>
// //               <li>• Replace existing files by uploading new ones</li>
// //               <li>• Delete files individually with the trash icon</li>
// //               <li>• Files upload immediately when selected</li>
// //               <li>• All files are securely stored in AWS S3</li>
// //             </ul>
// //           </div>
// //         </div>

// //         <div className='mt-6 p-4 bg-green-50 rounded-lg border border-green-200'>
// //           <h4 className='font-semibold text-green-800 mb-2'>
// //             🎉 Ready to Generate Your Website!
// //           </h4>
// //           <p className='text-green-700 text-sm'>
// //             {data.media.length > 0 
// //               ? `You have ${data.media.length} file${data.media.length > 1 ? 's' : ''} uploaded. `
// //               : "Upload your files to get started. "}
// //             Once you click "Submit Form", our AI will create a professional website with all your information, 
// //             generate additional content, optimize for SEO, and create a beautiful design that matches your industry.
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };


// import { useState } from "react";
// import { useForm } from "../../context/FormContext";
// import { Plus, Minus, Trash2, Globe, Mail, Phone, MapPin, Share2, Calendar } from "lucide-react";

// interface ExhibitorInterview {
//   videoTitle: string;
//   videoUrl: string;
// }

// interface MediaGalleryItem {
//   mediaUrl: string;
//   mediaType: string;
// }

// interface ContactInfo {
//   phone: { phoneNumber: string }[];
//   email: string;
//   address: string;
// }

// interface InternationalContact {
//   name: string;
//   phone: string;
//   email: string;
//   organization: string;
// }

// interface SocialLinks {
//   facebook: string;
//   linkedin: string;
//   instagram: string;
// }

// export const Step5 = ({ step, setStepValid }: { step: any; setStepValid?: (valid: boolean) => void }) => {
//   const { data, addArrayItem, removeArrayItem, updateField } = useForm();
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   // Initialize data if not present
//   const exhibitorInterviews = data.exhibitorInterviews || [];
//   const mediaGallery = data.mediaGallery || [];
//   const contactInfo = data.contactInfo || { phone: [], email: "", address: "" };
//   const internationalContacts = data.internationalContacts || [];
//   const socialLinks = data.socialLinks || { facebook: "", linkedin: "", instagram: "" };
//   const tags = data.tags || [];
//   const published = data.published || false;
//   const lastModified = data.lastModified || "";

//   const baseInputClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full";
//   const baseTextareaClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full min-h-[80px] resize-vertical";

//   // Exhibitor Interviews Section
//   const renderExhibitorInterviews = () => {
//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-lg font-semibold text-slate-900">Exhibitor Interviews</h3>
//             <p className="text-sm text-slate-600 mt-1">
//               Add video interviews with exhibitors or partners
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={() => addArrayItem("exhibitorInterviews", { videoTitle: "", videoUrl: "" })}
//             className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Add Interview
//           </button>
//         </div>

//         {exhibitorInterviews.length === 0 ? (
//           <div className="text-center py-8 text-slate-500 bg-white rounded-lg border-2 border-dashed border-amber-200">
//             <div className="w-12 h-12 mx-auto mb-3 bg-slate-200 rounded-full flex items-center justify-center">
//               <Share2 className="w-6 h-6 text-slate-400" />
//             </div>
//             <p className="font-medium">No interviews added yet</p>
//             <p className="text-sm mt-1">Add video interviews to showcase exhibitors</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {exhibitorInterviews.map((interview: ExhibitorInterview, index: number) => (
//               <div key={index} className="p-6 bg-white rounded-lg border border-amber-200 space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h4 className="font-semibold text-slate-800">
//                     Interview {index + 1}
//                   </h4>
//                   <button
//                     type="button"
//                     onClick={() => removeArrayItem("exhibitorInterviews", index)}
//                     className="text-red-500 hover:text-red-700 text-sm font-medium transition flex items-center"
//                   >
//                     <Minus className="w-4 h-4 mr-1" />
//                     Remove
//                   </button>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Video Title
//                     </label>
//                     <input
//                       type="text"
//                       value={interview.videoTitle || ""}
//                       onChange={(e) => {
//                         const newInterviews = [...exhibitorInterviews];
//                         newInterviews[index] = { ...newInterviews[index], videoTitle: e.target.value };
//                         updateField("exhibitorInterviews", newInterviews);
//                       }}
//                       placeholder="Interview with [Exhibitor Name]"
//                       className={baseInputClasses}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Video URL
//                     </label>
//                     <input
//                       type="url"
//                       value={interview.videoUrl || ""}
//                       onChange={(e) => {
//                         const newInterviews = [...exhibitorInterviews];
//                         newInterviews[index] = { ...newInterviews[index], videoUrl: e.target.value };
//                         updateField("exhibitorInterviews", newInterviews);
//                       }}
//                       placeholder="https://youtube.com/embed/..."
//                       className={baseInputClasses}
//                     />
//                   </div>
//                 </div>

//                 {interview.videoUrl && (
//                   <div className="mt-4 p-3 bg-slate-50 rounded-lg">
//                     <label className="block mb-2 font-medium text-slate-800 text-sm">Preview:</label>
//                     <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center">
//                       <div className="text-center text-slate-600">
//                         <div className="w-12 h-12 mx-auto mb-2 bg-slate-300 rounded-full flex items-center justify-center">
//                           <Share2 className="w-6 h-6 text-slate-500" />
//                         </div>
//                         <p className="text-sm">Video: {interview.videoTitle || "Untitled"}</p>
//                         <p className="text-xs mt-1">{interview.videoUrl}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Media Gallery Section
//   const renderMediaGallery = () => {
//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-lg font-semibold text-slate-900">Media Gallery</h3>
//             <p className="text-sm text-slate-600 mt-1">
//               Add images, videos, and other media for your event
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={() => addArrayItem("mediaGallery", { mediaUrl: "", mediaType: "" })}
//             className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Add Media
//           </button>
//         </div>

//         {mediaGallery.length === 0 ? (
//           <div className="text-center py-8 text-slate-500 bg-white rounded-lg border-2 border-dashed border-amber-200">
//             <div className="w-12 h-12 mx-auto mb-3 bg-slate-200 rounded-full flex items-center justify-center">
//               <Globe className="w-6 h-6 text-slate-400" />
//             </div>
//             <p className="font-medium">No media added yet</p>
//             <p className="text-sm mt-1">Add photos, videos, and other media assets</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {mediaGallery.map((media: MediaGalleryItem, index: number) => (
//               <div key={index} className="p-6 bg-white rounded-lg border border-amber-200 space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h4 className="font-semibold text-slate-800">
//                     Media {index + 1}
//                   </h4>
//                   <button
//                     type="button"
//                     onClick={() => removeArrayItem("mediaGallery", index)}
//                     className="text-red-500 hover:text-red-700 text-sm font-medium transition flex items-center"
//                   >
//                     <Minus className="w-4 h-4 mr-1" />
//                     Remove
//                   </button>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Media URL
//                     </label>
//                     <input
//                       type="url"
//                       value={media.mediaUrl || ""}
//                       onChange={(e) => {
//                         const newMedia = [...mediaGallery];
//                         newMedia[index] = { ...newMedia[index], mediaUrl: e.target.value };
//                         updateField("mediaGallery", newMedia);
//                       }}
//                       placeholder="https://example.com/image.jpg"
//                       className={baseInputClasses}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Media Type
//                     </label>
//                     <select
//                       value={media.mediaType || ""}
//                       onChange={(e) => {
//                         const newMedia = [...mediaGallery];
//                         newMedia[index] = { ...newMedia[index], mediaType: e.target.value };
//                         updateField("mediaGallery", newMedia);
//                       }}
//                       className={baseInputClasses}
//                     >
//                       <option value="">Select type</option>
//                       <option value="image">Image</option>
//                       <option value="video">Video</option>
//                       <option value="document">Document</option>
//                       <option value="audio">Audio</option>
//                     </select>
//                   </div>
//                 </div>

//                 {media.mediaUrl && (
//                   <div className="mt-4 p-3 bg-slate-50 rounded-lg">
//                     <label className="block mb-2 font-medium text-slate-800 text-sm">Preview:</label>
//                     <div className="flex items-center gap-3 text-sm text-slate-600">
//                       <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
//                         {media.mediaType === 'image' && '🖼️'}
//                         {media.mediaType === 'video' && '🎥'}
//                         {media.mediaType === 'document' && '📄'}
//                         {media.mediaType === 'audio' && '🎵'}
//                         {!media.mediaType && '📎'}
//                       </div>
//                       <div>
//                         <div className="font-medium">{media.mediaType || 'Unknown'} Media</div>
//                         <div className="text-xs truncate max-w-xs">{media.mediaUrl}</div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Contact Information Section
//   const renderContactInfo = () => {
//     const handlePhoneChange = (index: number, value: string) => {
//       const newPhones = [...contactInfo.phone];
//       newPhones[index] = { phoneNumber: value };
//       updateField("contactInfo", { ...contactInfo, phone: newPhones });
//     };

//     const addPhone = () => {
//       updateField("contactInfo", { 
//         ...contactInfo, 
//         phone: [...contactInfo.phone, { phoneNumber: "" }] 
//       });
//     };

//     const removePhone = (index: number) => {
//       const newPhones = contactInfo.phone.filter((_, i) => i !== index);
//       updateField("contactInfo", { ...contactInfo, phone: newPhones });
//     };

//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-lg font-semibold text-slate-900 flex items-center">
//               <Phone className="w-5 h-5 mr-2" />
//               Contact Information
//             </h3>
//             <p className="text-sm text-slate-600 mt-1">
//               Primary contact details for your event
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Phone Numbers */}
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <label className="font-medium text-slate-800 text-sm">Phone Numbers</label>
//               <button
//                 type="button"
//                 onClick={addPhone}
//                 className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center"
//               >
//                 <Plus className="w-4 h-4 mr-1" />
//                 Add Phone
//               </button>
//             </div>
            
//             {contactInfo.phone.length === 0 ? (
//               <div className="text-center py-4 text-slate-500 bg-white rounded-lg border border-amber-200">
//                 <p className="text-sm">No phone numbers added</p>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 {contactInfo.phone.map((phone: { phoneNumber: string }, index: number) => (
//                   <div key={index} className="flex items-center gap-2">
//                     <input
//                       type="tel"
//                       value={phone.phoneNumber || ""}
//                       onChange={(e) => handlePhoneChange(index, e.target.value)}
//                       placeholder="+1 (555) 123-4567"
//                       className={`${baseInputClasses} flex-1`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removePhone(index)}
//                       className="text-red-500 hover:text-red-700 p-2 transition"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Email and Address */}
//           <div className="space-y-4">
//             <div>
//               <label className="block mb-1 font-medium text-slate-800 text-sm">Email Address</label>
//               <input
//                 type="email"
//                 value={contactInfo.email || ""}
//                 onChange={(e) => updateField("contactInfo", { ...contactInfo, email: e.target.value })}
//                 placeholder="contact@event.com"
//                 className={baseInputClasses}
//               />
//             </div>
            
//             <div>
//               <label className="block mb-1 font-medium text-slate-800 text-sm">Address</label>
//               <textarea
//                 value={contactInfo.address || ""}
//                 onChange={(e) => updateField("contactInfo", { ...contactInfo, address: e.target.value })}
//                 placeholder="Event venue address"
//                 className={baseTextareaClasses}
//                 rows={3}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // International Contacts Section
//   const renderInternationalContacts = () => {
//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-lg font-semibold text-slate-900">International Contacts</h3>
//             <p className="text-sm text-slate-600 mt-1">
//               Contact persons for international attendees
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={() => addArrayItem("internationalContacts", { 
//               name: "", phone: "", email: "", organization: "" 
//             })}
//             className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Add Contact
//           </button>
//         </div>

//         {internationalContacts.length === 0 ? (
//           <div className="text-center py-8 text-slate-500 bg-white rounded-lg border-2 border-dashed border-amber-200">
//             <div className="w-12 h-12 mx-auto mb-3 bg-slate-200 rounded-full flex items-center justify-center">
//               <Globe className="w-6 h-6 text-slate-400" />
//             </div>
//             <p className="font-medium">No international contacts added yet</p>
//             <p className="text-sm mt-1">Add contacts for international attendees</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {internationalContacts.map((contact: InternationalContact, index: number) => (
//               <div key={index} className="p-6 bg-white rounded-lg border border-amber-200 space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h4 className="font-semibold text-slate-800">
//                     Contact {index + 1}
//                   </h4>
//                   <button
//                     type="button"
//                     onClick={() => removeArrayItem("internationalContacts", index)}
//                     className="text-red-500 hover:text-red-700 text-sm font-medium transition flex items-center"
//                   >
//                     <Minus className="w-4 h-4 mr-1" />
//                     Remove
//                   </button>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Name
//                     </label>
//                     <input
//                       type="text"
//                       value={contact.name || ""}
//                       onChange={(e) => {
//                         const newContacts = [...internationalContacts];
//                         newContacts[index] = { ...newContacts[index], name: e.target.value };
//                         updateField("internationalContacts", newContacts);
//                       }}
//                       placeholder="Full name"
//                       className={baseInputClasses}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Organization
//                     </label>
//                     <input
//                       type="text"
//                       value={contact.organization || ""}
//                       onChange={(e) => {
//                         const newContacts = [...internationalContacts];
//                         newContacts[index] = { ...newContacts[index], organization: e.target.value };
//                         updateField("internationalContacts", newContacts);
//                       }}
//                       placeholder="Company or institution"
//                       className={baseInputClasses}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Phone
//                     </label>
//                     <input
//                       type="tel"
//                       value={contact.phone || ""}
//                       onChange={(e) => {
//                         const newContacts = [...internationalContacts];
//                         newContacts[index] = { ...newContacts[index], phone: e.target.value };
//                         updateField("internationalContacts", newContacts);
//                       }}
//                       placeholder="International format"
//                       className={baseInputClasses}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       value={contact.email || ""}
//                       onChange={(e) => {
//                         const newContacts = [...internationalContacts];
//                         newContacts[index] = { ...newContacts[index], email: e.target.value };
//                         updateField("internationalContacts", newContacts);
//                       }}
//                       placeholder="email@organization.com"
//                       className={baseInputClasses}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Social Links Section
//   const renderSocialLinks = () => {
//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <h3 className="text-lg font-semibold text-slate-900 flex items-center">
//           <Share2 className="w-5 h-5 mr-2" />
//           Social Media Links
//         </h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block mb-1 font-medium text-slate-800 text-sm">Facebook</label>
//             <input
//               type="url"
//               value={socialLinks.facebook || ""}
//               onChange={(e) => updateField("socialLinks", { ...socialLinks, facebook: e.target.value })}
//               placeholder="https://facebook.com/yourevent"
//               className={baseInputClasses}
//             />
//           </div>
          
//           <div>
//             <label className="block mb-1 font-medium text-slate-800 text-sm">LinkedIn</label>
//             <input
//               type="url"
//               value={socialLinks.linkedin || ""}
//               onChange={(e) => updateField("socialLinks", { ...socialLinks, linkedin: e.target.value })}
//               placeholder="https://linkedin.com/company/yourevent"
//               className={baseInputClasses}
//             />
//           </div>
          
//           <div>
//             <label className="block mb-1 font-medium text-slate-800 text-sm">Instagram</label>
//             <input
//               type="url"
//               value={socialLinks.instagram || ""}
//               onChange={(e) => updateField("socialLinks", { ...socialLinks, instagram: e.target.value })}
//               placeholder="https://instagram.com/yourevent"
//               className={baseInputClasses}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Tags Section
//   const renderTags = () => {
//     const [newTag, setNewTag] = useState("");

//     const addTag = () => {
//       if (newTag.trim() && !tags.includes(newTag.trim())) {
//         updateField("tags", [...tags, newTag.trim()]);
//         setNewTag("");
//       }
//     };

//     const removeTag = (index: number) => {
//       updateField("tags", tags.filter((_, i) => i !== index));
//     };

//     const handleKeyDown = (e: React.KeyboardEvent) => {
//       if (e.key === 'Enter') {
//         e.preventDefault();
//         addTag();
//       }
//     };

//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <h3 className="text-lg font-semibold text-slate-900">Event Tags</h3>
        
//         <div className="space-y-4">
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={newTag}
//               onChange={(e) => setNewTag(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Add tags (e.g., technology, conference, networking)"
//               className={`${baseInputClasses} flex-1`}
//             />
//             <button
//               type="button"
//               onClick={addTag}
//               className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
//             >
//               Add Tag
//             </button>
//           </div>
          
//           {tags.length > 0 && (
//             <div className="flex flex-wrap gap-2">
//               {tags.map((tag: string, index: number) => (
//                 <span
//                   key={index}
//                   className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-1"
//                 >
//                   {tag}
//                   <button
//                     type="button"
//                     onClick={() => removeTag(index)}
//                     className="text-amber-600 hover:text-amber-800"
//                   >
//                     <Trash2 className="w-3 h-3" />
//                   </button>
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Publishing Section
//   const renderPublishing = () => {
//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <h3 className="text-lg font-semibold text-slate-900 flex items-center">
//           <Calendar className="w-5 h-5 mr-2" />
//           Publishing Settings
//         </h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="published"
//               checked={published}
//               onChange={(e) => updateField("published", e.target.checked)}
//               className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
//             />
//             <label htmlFor="published" className="ml-2 text-sm font-medium text-slate-800">
//               Publish this event
//             </label>
//           </div>
          
//           <div>
//             <label className="block mb-1 font-medium text-slate-800 text-sm">
//               Last Modified
//             </label>
//             <input
//               type="datetime-local"
//               value={lastModified}
//               onChange={(e) => updateField("lastModified", e.target.value)}
//               className={baseInputClasses}
//             />
//           </div>
//         </div>
        
//         <div className="p-4 bg-amber-100 rounded-lg border border-amber-200">
//           <p className="text-sm text-amber-800">
//             <strong>Note:</strong> When published, your event will be visible to the public. 
//             The last modified date helps track when changes were made.
//           </p>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-8">
//       <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
//         {step.title}
//       </h2>

//       {renderExhibitorInterviews()}
//       {renderMediaGallery()}
//       {renderContactInfo()}
//       {renderInternationalContacts()}
//       {renderSocialLinks()}
//       {renderTags()}
//       {renderPublishing()}

//       {/* Summary Preview */}
//       <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
//         <h3 className="font-semibold text-amber-900 mb-4">Event Media & Contacts Summary</h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
//           <div>
//             <h4 className="font-medium text-amber-800 mb-2">Media</h4>
//             <div className="space-y-1">
//               <div className="flex justify-between">
//                 <span>Interviews:</span>
//                 <span className="font-medium">{exhibitorInterviews.length}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Gallery Items:</span>
//                 <span className="font-medium">{mediaGallery.length}</span>
//               </div>
//             </div>
//           </div>
          
//           <div>
//             <h4 className="font-medium text-amber-800 mb-2">Contacts</h4>
//             <div className="space-y-1">
//               <div className="flex justify-between">
//                 <span>Phone Numbers:</span>
//                 <span className="font-medium">{contactInfo.phone?.length || 0}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>International:</span>
//                 <span className="font-medium">{internationalContacts.length}</span>
//               </div>
//             </div>
//           </div>
          
//           <div>
//             <h4 className="font-medium text-amber-800 mb-2">Social & Tags</h4>
//             <div className="space-y-1">
//               <div className="flex justify-between">
//                 <span>Social Links:</span>
//                 <span className="font-medium">
//                   {[socialLinks.facebook, socialLinks.linkedin, socialLinks.instagram].filter(Boolean).length}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Tags:</span>
//                 <span className="font-medium">{tags.length}</span>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className="mt-4 p-3 bg-white rounded-lg border border-amber-100">
//           <div className="flex justify-between items-center">
//             <span className="font-medium text-slate-800">Publication Status:</span>
//             <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//               published 
//                 ? 'bg-green-100 text-green-800' 
//                 : 'bg-slate-100 text-slate-600'
//             }`}>
//               {published ? 'Published' : 'Draft'}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };






// import { useState } from "react";
// import { useForm } from "../../context/FormContext";
// import { Plus, Minus, Trash2, Globe, Mail, Phone, MapPin, Share2, Calendar } from "lucide-react";

// interface ExhibitorInterview {
//   videoTitle: string;
//   videoUrl: string;
// }

// interface MediaGalleryItem {
//   mediaUrl: string;
//   mediaType: string;
// }

// interface ContactInfo {
//   phone: { phoneNumber: string }[];
//   email: string;
//   address: string;
// }

// interface InternationalContact {
//   name: string;
//   phone: string;
//   email: string;
//   organization: string;
// }

// interface SocialLinks {
//   facebook: string;
//   linkedin: string;
//   instagram: string;
// }

// export const Step5 = ({ step, setStepValid }: { step: any; setStepValid?: (valid: boolean) => void }) => {
//   const { data, addArrayItem, removeArrayItem, updateField } = useForm();
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   // Initialize data if not present
//   const exhibitorInterviews = data.exhibitorInterviews || [];
//   const mediaGallery = data.mediaGallery || [];
//   const contactInfo = data.contactInfo || { phone: [], email: "", address: "" };
//   const internationalContacts = data.internationalContacts || [];
//   const socialLinks = data.socialLinks || { facebook: "", linkedin: "", instagram: "" };
//   const tags = data.tags || [];
//   const published = data.published || false;
//   const lastModified = data.lastModified || "";

//   const baseInputClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full";
//   const baseTextareaClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full min-h-[80px] resize-vertical";

//   // Exhibitor Interviews Section
//   const renderExhibitorInterviews = () => {
//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <div>
//           <h3 className="text-lg font-semibold text-slate-900">Exhibitor Interviews</h3>
//           <p className="text-sm text-slate-600 mt-1">
//             Add video interviews with exhibitors or partners
//           </p>
//         </div>

//         {exhibitorInterviews.length === 0 ? (
//           <div className="text-center py-8 text-slate-500 bg-white rounded-lg border-2 border-dashed border-amber-200">
//             <div className="w-12 h-12 mx-auto mb-3 bg-slate-200 rounded-full flex items-center justify-center">
//               <Share2 className="w-6 h-6 text-slate-400" />
//             </div>
//             <p className="font-medium">No interviews added yet</p>
//             <p className="text-sm mt-1">Add video interviews to showcase exhibitors</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {exhibitorInterviews.map((interview: ExhibitorInterview, index: number) => (
//               <div key={index} className="p-6 bg-white rounded-lg border border-amber-200 space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h4 className="font-semibold text-slate-800">
//                     Interview {index + 1}
//                   </h4>
//                   <button
//                     type="button"
//                     onClick={() => removeArrayItem("exhibitorInterviews", index)}
//                     className="text-red-500 hover:text-red-700 text-sm font-medium transition flex items-center"
//                   >
//                     <Minus className="w-4 h-4 mr-1" />
//                     Remove
//                   </button>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Video Title
//                     </label>
//                     <input
//                       type="text"
//                       value={interview.videoTitle || ""}
//                       onChange={(e) => {
//                         const newInterviews = [...exhibitorInterviews];
//                         newInterviews[index] = { ...newInterviews[index], videoTitle: e.target.value };
//                         updateField("exhibitorInterviews", newInterviews);
//                       }}
//                       placeholder="Interview with [Exhibitor Name]"
//                       className={baseInputClasses}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Video URL
//                     </label>
//                     <input
//                       type="url"
//                       value={interview.videoUrl || ""}
//                       onChange={(e) => {
//                         const newInterviews = [...exhibitorInterviews];
//                         newInterviews[index] = { ...newInterviews[index], videoUrl: e.target.value };
//                         updateField("exhibitorInterviews", newInterviews);
//                       }}
//                       placeholder="https://youtube.com/embed/..."
//                       className={baseInputClasses}
//                     />
//                   </div>
//                 </div>

//                 {interview.videoUrl && (
//                   <div className="mt-4 p-3 bg-slate-50 rounded-lg">
//                     <label className="block mb-2 font-medium text-slate-800 text-sm">Preview:</label>
//                     <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center">
//                       <div className="text-center text-slate-600">
//                         <div className="w-12 h-12 mx-auto mb-2 bg-slate-300 rounded-full flex items-center justify-center">
//                           <Share2 className="w-6 h-6 text-slate-500" />
//                         </div>
//                         <p className="text-sm">Video: {interview.videoTitle || "Untitled"}</p>
//                         <p className="text-xs mt-1">{interview.videoUrl}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Add Interview Button at Bottom Right */}
//         <div className="flex justify-end pt-2">
//           <button
//             type="button"
//             onClick={() => addArrayItem("exhibitorInterviews", { videoTitle: "", videoUrl: "" })}
//             className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition flex items-center gap-2"
//           >
//             <Plus className="w-4 h-4" />
//             Add Interview
//           </button>
//         </div>
//       </div>
//     );
//   };

//   // Media Gallery Section
//   const renderMediaGallery = () => {
//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <div>
//           <h3 className="text-lg font-semibold text-slate-900">Media Gallery</h3>
//           <p className="text-sm text-slate-600 mt-1">
//             Add images, videos, and other media for your event
//           </p>
//         </div>

//         {mediaGallery.length === 0 ? (
//           <div className="text-center py-8 text-slate-500 bg-white rounded-lg border-2 border-dashed border-amber-200">
//             <div className="w-12 h-12 mx-auto mb-3 bg-slate-200 rounded-full flex items-center justify-center">
//               <Globe className="w-6 h-6 text-slate-400" />
//             </div>
//             <p className="font-medium">No media added yet</p>
//             <p className="text-sm mt-1">Add photos, videos, and other media assets</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {mediaGallery.map((media: MediaGalleryItem, index: number) => (
//               <div key={index} className="p-6 bg-white rounded-lg border border-amber-200 space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h4 className="font-semibold text-slate-800">
//                     Media {index + 1}
//                   </h4>
//                   <button
//                     type="button"
//                     onClick={() => removeArrayItem("mediaGallery", index)}
//                     className="text-red-500 hover:text-red-700 text-sm font-medium transition flex items-center"
//                   >
//                     <Minus className="w-4 h-4 mr-1" />
//                     Remove
//                   </button>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Media URL
//                     </label>
//                     <input
//                       type="url"
//                       value={media.mediaUrl || ""}
//                       onChange={(e) => {
//                         const newMedia = [...mediaGallery];
//                         newMedia[index] = { ...newMedia[index], mediaUrl: e.target.value };
//                         updateField("mediaGallery", newMedia);
//                       }}
//                       placeholder="https://example.com/image.jpg"
//                       className={baseInputClasses}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Media Type
//                     </label>
//                     <select
//                       value={media.mediaType || ""}
//                       onChange={(e) => {
//                         const newMedia = [...mediaGallery];
//                         newMedia[index] = { ...newMedia[index], mediaType: e.target.value };
//                         updateField("mediaGallery", newMedia);
//                       }}
//                       className={baseInputClasses}
//                     >
//                       <option value="">Select type</option>
//                       <option value="image">Image</option>
//                       <option value="video">Video</option>
//                       <option value="document">Document</option>
//                       <option value="audio">Audio</option>
//                     </select>
//                   </div>
//                 </div>

//                 {media.mediaUrl && (
//                   <div className="mt-4 p-3 bg-slate-50 rounded-lg">
//                     <label className="block mb-2 font-medium text-slate-800 text-sm">Preview:</label>
//                     <div className="flex items-center gap-3 text-sm text-slate-600">
//                       <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
//                         {media.mediaType === 'image' && '🖼️'}
//                         {media.mediaType === 'video' && '🎥'}
//                         {media.mediaType === 'document' && '📄'}
//                         {media.mediaType === 'audio' && '🎵'}
//                         {!media.mediaType && '📎'}
//                       </div>
//                       <div>
//                         <div className="font-medium">{media.mediaType || 'Unknown'} Media</div>
//                         <div className="text-xs truncate max-w-xs">{media.mediaUrl}</div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Add Media Button at Bottom Right */}
//         <div className="flex justify-end pt-2">
//           <button
//             type="button"
//             onClick={() => addArrayItem("mediaGallery", { mediaUrl: "", mediaType: "" })}
//             className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition flex items-center gap-2"
//           >
//             <Plus className="w-4 h-4" />
//             Add Media
//           </button>
//         </div>
//       </div>
//     );
//   };

//   // Contact Information Section
//   const renderContactInfo = () => {
//     const handlePhoneChange = (index: number, value: string) => {
//       const newPhones = [...contactInfo.phone];
//       newPhones[index] = { phoneNumber: value };
//       updateField("contactInfo", { ...contactInfo, phone: newPhones });
//     };

//     const addPhone = () => {
//       updateField("contactInfo", { 
//         ...contactInfo, 
//         phone: [...contactInfo.phone, { phoneNumber: "" }] 
//       });
//     };

//     const removePhone = (index: number) => {
//       const newPhones = contactInfo.phone.filter((_, i) => i !== index);
//       updateField("contactInfo", { ...contactInfo, phone: newPhones });
//     };

//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <div>
//           <h3 className="text-lg font-semibold text-slate-900 flex items-center">
//             <Phone className="w-5 h-5 mr-2" />
//             Contact Information
//           </h3>
//           <p className="text-sm text-slate-600 mt-1">
//             Primary contact details for your event
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Phone Numbers */}
//           <div className="space-y-4">
//             <div>
//               <label className="font-medium text-slate-800 text-sm">Phone Numbers</label>
//             </div>
            
//             {contactInfo.phone.length === 0 ? (
//               <div className="text-center py-4 text-slate-500 bg-white rounded-lg border border-amber-200">
//                 <p className="text-sm">No phone numbers added</p>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 {contactInfo.phone.map((phone: { phoneNumber: string }, index: number) => (
//                   <div key={index} className="flex items-center gap-2">
//                     <input
//                       type="tel"
//                       value={phone.phoneNumber || ""}
//                       onChange={(e) => handlePhoneChange(index, e.target.value)}
//                       placeholder="+1 (555) 123-4567"
//                       className={`${baseInputClasses} flex-1`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removePhone(index)}
//                       className="text-red-500 hover:text-red-700 p-2 transition"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Add Phone Button at Bottom Right */}
//             <div className="flex justify-end pt-2">
//               <button
//                 type="button"
//                 onClick={addPhone}
//                 className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition flex items-center gap-2"
//               >
//                 <Plus className="w-4 h-4" />
//                 Add Phone
//               </button>
//             </div>
//           </div>

//           {/* Email and Address */}
//           <div className="space-y-4">
//             <div>
//               <label className="block mb-1 font-medium text-slate-800 text-sm">Email Address</label>
//               <input
//                 type="email"
//                 value={contactInfo.email || ""}
//                 onChange={(e) => updateField("contactInfo", { ...contactInfo, email: e.target.value })}
//                 placeholder="contact@event.com"
//                 className={baseInputClasses}
//               />
//             </div>
            
//             <div>
//               <label className="block mb-1 font-medium text-slate-800 text-sm">Address</label>
//               <textarea
//                 value={contactInfo.address || ""}
//                 onChange={(e) => updateField("contactInfo", { ...contactInfo, address: e.target.value })}
//                 placeholder="Event venue address"
//                 className={baseTextareaClasses}
//                 rows={3}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // International Contacts Section
//   const renderInternationalContacts = () => {
//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <div>
//           <h3 className="text-lg font-semibold text-slate-900">International Contacts</h3>
//           <p className="text-sm text-slate-600 mt-1">
//             Contact persons for international attendees
//           </p>
//         </div>

//         {internationalContacts.length === 0 ? (
//           <div className="text-center py-8 text-slate-500 bg-white rounded-lg border-2 border-dashed border-amber-200">
//             <div className="w-12 h-12 mx-auto mb-3 bg-slate-200 rounded-full flex items-center justify-center">
//               <Globe className="w-6 h-6 text-slate-400" />
//             </div>
//             <p className="font-medium">No international contacts added yet</p>
//             <p className="text-sm mt-1">Add contacts for international attendees</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {internationalContacts.map((contact: InternationalContact, index: number) => (
//               <div key={index} className="p-6 bg-white rounded-lg border border-amber-200 space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h4 className="font-semibold text-slate-800">
//                     Contact {index + 1}
//                   </h4>
//                   <button
//                     type="button"
//                     onClick={() => removeArrayItem("internationalContacts", index)}
//                     className="text-red-500 hover:text-red-700 text-sm font-medium transition flex items-center"
//                   >
//                     <Minus className="w-4 h-4 mr-1" />
//                     Remove
//                   </button>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Name
//                     </label>
//                     <input
//                       type="text"
//                       value={contact.name || ""}
//                       onChange={(e) => {
//                         const newContacts = [...internationalContacts];
//                         newContacts[index] = { ...newContacts[index], name: e.target.value };
//                         updateField("internationalContacts", newContacts);
//                       }}
//                       placeholder="Full name"
//                       className={baseInputClasses}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Organization
//                     </label>
//                     <input
//                       type="text"
//                       value={contact.organization || ""}
//                       onChange={(e) => {
//                         const newContacts = [...internationalContacts];
//                         newContacts[index] = { ...newContacts[index], organization: e.target.value };
//                         updateField("internationalContacts", newContacts);
//                       }}
//                       placeholder="Company or institution"
//                       className={baseInputClasses}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Phone
//                     </label>
//                     <input
//                       type="tel"
//                       value={contact.phone || ""}
//                       onChange={(e) => {
//                         const newContacts = [...internationalContacts];
//                         newContacts[index] = { ...newContacts[index], phone: e.target.value };
//                         updateField("internationalContacts", newContacts);
//                       }}
//                       placeholder="International format"
//                       className={baseInputClasses}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       value={contact.email || ""}
//                       onChange={(e) => {
//                         const newContacts = [...internationalContacts];
//                         newContacts[index] = { ...newContacts[index], email: e.target.value };
//                         updateField("internationalContacts", newContacts);
//                       }}
//                       placeholder="email@organization.com"
//                       className={baseInputClasses}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Add Contact Button at Bottom Right */}
//         <div className="flex justify-end pt-2">
//           <button
//             type="button"
//             onClick={() => addArrayItem("internationalContacts", { 
//               name: "", phone: "", email: "", organization: "" 
//             })}
//             className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition flex items-center gap-2"
//           >
//             <Plus className="w-4 h-4" />
//             Add Contact
//           </button>
//         </div>
//       </div>
//     );
//   };

//   // Social Links Section
//   const renderSocialLinks = () => {
//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <h3 className="text-lg font-semibold text-slate-900 flex items-center">
//           <Share2 className="w-5 h-5 mr-2" />
//           Social Media Links
//         </h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block mb-1 font-medium text-slate-800 text-sm">Facebook</label>
//             <input
//               type="url"
//               value={socialLinks.facebook || ""}
//               onChange={(e) => updateField("socialLinks", { ...socialLinks, facebook: e.target.value })}
//               placeholder="https://facebook.com/yourevent"
//               className={baseInputClasses}
//             />
//           </div>
          
//           <div>
//             <label className="block mb-1 font-medium text-slate-800 text-sm">LinkedIn</label>
//             <input
//               type="url"
//               value={socialLinks.linkedin || ""}
//               onChange={(e) => updateField("socialLinks", { ...socialLinks, linkedin: e.target.value })}
//               placeholder="https://linkedin.com/company/yourevent"
//               className={baseInputClasses}
//             />
//           </div>
          
//           <div>
//             <label className="block mb-1 font-medium text-slate-800 text-sm">Instagram</label>
//             <input
//               type="url"
//               value={socialLinks.instagram || ""}
//               onChange={(e) => updateField("socialLinks", { ...socialLinks, instagram: e.target.value })}
//               placeholder="https://instagram.com/yourevent"
//               className={baseInputClasses}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Tags Section
//   const renderTags = () => {
//     const [newTag, setNewTag] = useState("");

//     const addTag = () => {
//       if (newTag.trim() && !tags.includes(newTag.trim())) {
//         updateField("tags", [...tags, newTag.trim()]);
//         setNewTag("");
//       }
//     };

//     const removeTag = (index: number) => {
//       updateField("tags", tags.filter((_, i) => i !== index));
//     };

//     const handleKeyDown = (e: React.KeyboardEvent) => {
//       if (e.key === 'Enter') {
//         e.preventDefault();
//         addTag();
//       }
//     };

//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <h3 className="text-lg font-semibold text-slate-900">Event Tags</h3>
        
//         <div className="space-y-4">
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={newTag}
//               onChange={(e) => setNewTag(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Add tags (e.g., technology, conference, networking)"
//               className={`${baseInputClasses} flex-1`}
//             />
//             <button
//               type="button"
//               onClick={addTag}
//               className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
//             >
//               Add Tag
//             </button>
//           </div>
          
//           {tags.length > 0 && (
//             <div className="flex flex-wrap gap-2">
//               {tags.map((tag: string, index: number) => (
//                 <span
//                   key={index}
//                   className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-1"
//                 >
//                   {tag}
//                   <button
//                     type="button"
//                     onClick={() => removeTag(index)}
//                     className="text-amber-600 hover:text-amber-800"
//                   >
//                     <Trash2 className="w-3 h-3" />
//                   </button>
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Publishing Section
//   const renderPublishing = () => {
//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <h3 className="text-lg font-semibold text-slate-900 flex items-center">
//           <Calendar className="w-5 h-5 mr-2" />
//           Publishing Settings
//         </h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="published"
//               checked={published}
//               onChange={(e) => updateField("published", e.target.checked)}
//               className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
//             />
//             <label htmlFor="published" className="ml-2 text-sm font-medium text-slate-800">
//               Publish this event
//             </label>
//           </div>
          
//           <div>
//             <label className="block mb-1 font-medium text-slate-800 text-sm">
//               Last Modified
//             </label>
//             <input
//               type="datetime-local"
//               value={lastModified}
//               onChange={(e) => updateField("lastModified", e.target.value)}
//               className={baseInputClasses}
//             />
//           </div>
//         </div>
        
//         <div className="p-4 bg-amber-100 rounded-lg border border-amber-200">
//           <p className="text-sm text-amber-800">
//             <strong>Note:</strong> When published, your event will be visible to the public. 
//             The last modified date helps track when changes were made.
//           </p>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-8">
//       <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
//         {step.title}
//       </h2>

//       {renderExhibitorInterviews()}
//       {renderMediaGallery()}
//       {renderContactInfo()}
//       {renderInternationalContacts()}
//       {renderSocialLinks()}
//       {renderTags()}
//       {renderPublishing()}

//       {/* Summary Preview */}
//       <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
//         <h3 className="font-semibold text-amber-900 mb-4">Event Media & Contacts Summary</h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
//           <div>
//             <h4 className="font-medium text-amber-800 mb-2">Media</h4>
//             <div className="space-y-1">
//               <div className="flex justify-between">
//                 <span>Interviews:</span>
//                 <span className="font-medium">{exhibitorInterviews.length}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Gallery Items:</span>
//                 <span className="font-medium">{mediaGallery.length}</span>
//               </div>
//             </div>
//           </div>
          
//           <div>
//             <h4 className="font-medium text-amber-800 mb-2">Contacts</h4>
//             <div className="space-y-1">
//               <div className="flex justify-between">
//                 <span>Phone Numbers:</span>
//                 <span className="font-medium">{contactInfo.phone?.length || 0}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>International:</span>
//                 <span className="font-medium">{internationalContacts.length}</span>
//               </div>
//             </div>
//           </div>
          
//           <div>
//             <h4 className="font-medium text-amber-800 mb-2">Social & Tags</h4>
//             <div className="space-y-1">
//               <div className="flex justify-between">
//                 <span>Social Links:</span>
//                 <span className="font-medium">
//                   {[socialLinks.facebook, socialLinks.linkedin, socialLinks.instagram].filter(Boolean).length}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Tags:</span>
//                 <span className="font-medium">{tags.length}</span>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className="mt-4 p-3 bg-white rounded-lg border border-amber-100">
//           <div className="flex justify-between items-center">
//             <span className="font-medium text-slate-800">Publication Status:</span>
//             <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//               published 
//                 ? 'bg-green-100 text-green-800' 
//                 : 'bg-slate-100 text-slate-600'
//             }`}>
//               {published ? 'Published' : 'Draft'}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



// import { useState, useEffect } from "react";
// import { useForm } from "../../context/FormContext";
// import { Plus, Minus, Trash2, Globe, Mail, Phone, MapPin, Share2, Calendar, Upload } from "lucide-react";

// interface ExhibitorInterview {
//   videoTitle: string;
//   videoUrl: string;
// }

// interface MediaGalleryItem {
//   mediaUrl: string;
//   mediaType: string;
//   fileName?: string;
//   file?: File;
// }

// interface ContactInfo {
//   phone: { phoneNumber: string }[];
//   email: string;
//   address: string;
// }

// interface InternationalContact {
//   name: string;
//   phone: string;
//   email: string;
//   organization: string;
// }

// interface SocialLinks {
//   facebook: string;
//   linkedin: string;
//   instagram: string;
// }

// export const Step5 = ({ step, setStepValid }: { step: any; setStepValid?: (valid: boolean) => void }) => {
//   const { data, addArrayItem, removeArrayItem, updateField } = useForm();
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   // Initialize data if not present
//   const exhibitorInterviews = data.exhibitorInterviews || [];
//   const mediaGallery = data.mediaGallery || [];
//   const contactInfo = data.contactInfo || { phone: [], email: "", address: "" };
//   const internationalContacts = data.internationalContacts || [];
//   const socialLinks = data.socialLinks || { facebook: "", linkedin: "", instagram: "" };
//   const tags = data.tags || [];
//   const published = data.published || false;
//   const lastModified = data.lastModified || "";

//   const baseInputClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full";
//   const baseTextareaClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full min-h-[80px] resize-vertical";

//   // Initialize media gallery with 6 slots
//   useEffect(() => {
//     if (mediaGallery.length === 0) {
//       const initialSlots = Array(6).fill(null).map(() => ({ 
//         mediaUrl: "", 
//         mediaType: "", 
//         fileName: "" 
//       }));
//       updateField("mediaGallery", initialSlots);
//     }
//   }, []);

//   // Exhibitor Interviews Section
//   const renderExhibitorInterviews = () => {
//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <div>
//           <h3 className="text-lg font-semibold text-slate-900">Exhibitor Interviews</h3>
//           <p className="text-sm text-slate-600 mt-1">
//             Add video interviews with exhibitors or partners
//           </p>
//         </div>

//         {exhibitorInterviews.length === 0 ? (
//           <div className="text-center py-8 text-slate-500 bg-white rounded-lg border-2 border-dashed border-amber-200">
//             <div className="w-12 h-12 mx-auto mb-3 bg-slate-200 rounded-full flex items-center justify-center">
//               <Share2 className="w-6 h-6 text-slate-400" />
//             </div>
//             <p className="font-medium">No interviews added yet</p>
//             <p className="text-sm mt-1">Add video interviews to showcase exhibitors</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {exhibitorInterviews.map((interview: ExhibitorInterview, index: number) => (
//               <div key={index} className="p-6 bg-white rounded-lg border border-amber-200 space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h4 className="font-semibold text-slate-800">
//                     Interview {index + 1}
//                   </h4>
//                   <button
//                     type="button"
//                     onClick={() => removeArrayItem("exhibitorInterviews", index)}
//                     className="text-red-500 hover:text-red-700 text-sm font-medium transition flex items-center"
//                   >
//                     <Minus className="w-4 h-4 mr-1" />
//                     Remove
//                   </button>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Video Title
//                     </label>
//                     <input
//                       type="text"
//                       value={interview.videoTitle || ""}
//                       onChange={(e) => {
//                         const newInterviews = [...exhibitorInterviews];
//                         newInterviews[index] = { ...newInterviews[index], videoTitle: e.target.value };
//                         updateField("exhibitorInterviews", newInterviews);
//                       }}
//                       placeholder="Interview with [Exhibitor Name]"
//                       className={baseInputClasses}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Video URL
//                     </label>
//                     <input
//                       type="url"
//                       value={interview.videoUrl || ""}
//                       onChange={(e) => {
//                         const newInterviews = [...exhibitorInterviews];
//                         newInterviews[index] = { ...newInterviews[index], videoUrl: e.target.value };
//                         updateField("exhibitorInterviews", newInterviews);
//                       }}
//                       placeholder="https://youtube.com/embed/..."
//                       className={baseInputClasses}
//                     />
//                   </div>
//                 </div>

//                 {interview.videoUrl && (
//                   <div className="mt-4 p-3 bg-slate-50 rounded-lg">
//                     <label className="block mb-2 font-medium text-slate-800 text-sm">Preview:</label>
//                     <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center">
//                       <div className="text-center text-slate-600">
//                         <div className="w-12 h-12 mx-auto mb-2 bg-slate-300 rounded-full flex items-center justify-center">
//                           <Share2 className="w-6 h-6 text-slate-500" />
//                         </div>
//                         <p className="text-sm">Video: {interview.videoTitle || "Untitled"}</p>
//                         <p className="text-xs mt-1">{interview.videoUrl}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Add Interview Button at Bottom Right */}
//         <div className="flex justify-end pt-2">
//           <button
//             type="button"
//             onClick={() => addArrayItem("exhibitorInterviews", { videoTitle: "", videoUrl: "" })}
//             className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition flex items-center gap-2"
//           >
//             <Plus className="w-4 h-4" />
//             Add Interview
//           </button>
//         </div>
//       </div>
//     );
//   };

//   // Media Gallery Section with File Upload
//   const renderMediaGallery = () => {
//     const handleFileUpload = async (index: number, file: File) => {
//       // Create a local URL for preview
//       const objectUrl = URL.createObjectURL(file);
      
//       const newMedia = [...mediaGallery];
//       newMedia[index] = { 
//         ...newMedia[index], 
//         mediaUrl: objectUrl,
//         mediaType: file.type.startsWith('image/') ? 'image' : 'document',
//         file: file,
//         fileName: file.name
//       };
//       updateField("mediaGallery", newMedia);

//       // TODO: Implement actual upload to your bucket here
//       console.log(`Uploading file to bucket: ${file.name}`);
//       // await uploadToBucket(file, `media-gallery/image-${index + 1}`);
//     };

//     const handleRemoveFile = (index: number) => {
//       const newMedia = [...mediaGallery];
//       newMedia[index] = { mediaUrl: "", mediaType: "", fileName: "" };
//       updateField("mediaGallery", newMedia);
//     };

//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <div>
//           <h3 className="text-lg font-semibold text-slate-900">Media Gallery</h3>
//           <p className="text-sm text-slate-600 mt-1">
//             Upload up to 6 images or documents for your event
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {mediaGallery.slice(0, 6).map((media: MediaGalleryItem, index: number) => (
//             <div key={index} className="p-4 bg-white rounded-lg border border-amber-200 space-y-4">
//               <div className="flex justify-between items-center">
//                 <h4 className="font-semibold text-slate-800">
//                   Image {index + 1}
//                 </h4>
//                 {media.mediaUrl && (
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveFile(index)}
//                     className="text-red-500 hover:text-red-700 text-sm font-medium transition flex items-center"
//                   >
//                     <Trash2 className="w-4 h-4 mr-1" />
//                     Remove
//                   </button>
//                 )}
//               </div>
              
//               {/* File Upload Area */}
//               <div className="space-y-3">
//                 {!media.mediaUrl ? (
//                   <div className="border-2 border-dashed border-amber-300 rounded-lg p-4 text-center hover:bg-amber-50 transition cursor-pointer">
//                     <input
//                       type="file"
//                       id={`media-upload-${index}`}
//                       accept="image/*,.pdf,.doc,.docx,.txt"
//                       onChange={(e) => {
//                         const file = e.target.files?.[0];
//                         if (file) {
//                           handleFileUpload(index, file);
//                         }
//                       }}
//                       className="hidden"
//                     />
//                     <label 
//                       htmlFor={`media-upload-${index}`}
//                       className="cursor-pointer block"
//                     >
//                       <div className="w-12 h-12 mx-auto mb-2 bg-amber-100 rounded-full flex items-center justify-center">
//                         <Upload className="w-6 h-6 text-amber-600" />
//                       </div>
//                       <p className="text-sm font-medium text-slate-700">Upload File</p>
//                       <p className="text-xs text-slate-500 mt-1">
//                         Image or Document
//                       </p>
//                     </label>
//                   </div>
//                 ) : (
//                   <div className="space-y-3">
//                     {/* Preview */}
//                     <div className="bg-slate-50 rounded-lg p-3">
//                       <label className="block mb-2 font-medium text-slate-800 text-sm">
//                         Preview:
//                       </label>
//                       {media.mediaType === 'image' ? (
//                         <div className="aspect-video bg-slate-200 rounded-lg overflow-hidden">
//                           <img 
//                             src={media.mediaUrl} 
//                             alt={`Uploaded image ${index + 1}`}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                       ) : (
//                         <div className="flex items-center gap-3 p-3 bg-white rounded border">
//                           <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
//                             📄
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <div className="font-medium text-sm text-slate-800 truncate">
//                               {media.fileName}
//                             </div>
//                             <div className="text-xs text-slate-500">
//                               Document
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     {/* File Info */}
//                     <div className="text-xs text-slate-600 space-y-1">
//                       <div className="flex justify-between">
//                         <span>Type:</span>
//                         <span className="font-medium capitalize">{media.mediaType}</span>
//                       </div>
//                       {media.fileName && (
//                         <div className="flex justify-between">
//                           <span>File:</span>
//                           <span className="font-medium truncate ml-2">{media.fileName}</span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Replace File Button */}
//                     <div className="flex gap-2">
//                       <input
//                         type="file"
//                         id={`media-replace-${index}`}
//                         accept="image/*,.pdf,.doc,.docx,.txt"
//                         onChange={(e) => {
//                           const file = e.target.files?.[0];
//                           if (file) {
//                             handleFileUpload(index, file);
//                           }
//                         }}
//                         className="hidden"
//                       />
//                       <label 
//                         htmlFor={`media-replace-${index}`}
//                         className="flex-1 cursor-pointer"
//                       >
//                         <div className="w-full bg-amber-500 hover:bg-amber-600 text-white text-center py-2 px-3 rounded-lg text-sm font-medium transition">
//                           Replace File
//                         </div>
//                       </label>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Upload Progress/Status */}
//         <div className="p-4 bg-amber-100 rounded-lg border border-amber-200">
//           <h4 className="font-medium text-amber-800 mb-2">Upload Status</h4>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
//             {mediaGallery.slice(0, 6).map((media: MediaGalleryItem, index: number) => (
//               <div key={index} className="flex items-center gap-2">
//                 <div className={`w-3 h-3 rounded-full ${
//                   media.mediaUrl ? 'bg-green-500' : 'bg-slate-300'
//                 }`} />
//                 <span className="text-slate-700">
//                   Image {index + 1}: {media.mediaUrl ? 'Uploaded' : 'Empty'}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Contact Information Section
//   const renderContactInfo = () => {
//     const handlePhoneChange = (index: number, value: string) => {
//       const newPhones = [...contactInfo.phone];
//       newPhones[index] = { phoneNumber: value };
//       updateField("contactInfo", { ...contactInfo, phone: newPhones });
//     };

//     const addPhone = () => {
//       updateField("contactInfo", { 
//         ...contactInfo, 
//         phone: [...contactInfo.phone, { phoneNumber: "" }] 
//       });
//     };

//     const removePhone = (index: number) => {
//       const newPhones = contactInfo.phone.filter((_, i) => i !== index);
//       updateField("contactInfo", { ...contactInfo, phone: newPhones });
//     };

//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <div>
//           <h3 className="text-lg font-semibold text-slate-900 flex items-center">
//             <Phone className="w-5 h-5 mr-2" />
//             Contact Information
//           </h3>
//           <p className="text-sm text-slate-600 mt-1">
//             Primary contact details for your event
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Phone Numbers */}
//           <div className="space-y-4">
//             <div>
//               <label className="font-medium text-slate-800 text-sm">Phone Numbers</label>
//             </div>
            
//             {contactInfo.phone.length === 0 ? (
//               <div className="text-center py-4 text-slate-500 bg-white rounded-lg border border-amber-200">
//                 <p className="text-sm">No phone numbers added</p>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 {contactInfo.phone.map((phone: { phoneNumber: string }, index: number) => (
//                   <div key={index} className="flex items-center gap-2">
//                     <input
//                       type="tel"
//                       value={phone.phoneNumber || ""}
//                       onChange={(e) => handlePhoneChange(index, e.target.value)}
//                       placeholder="+1 (555) 123-4567"
//                       className={`${baseInputClasses} flex-1`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removePhone(index)}
//                       className="text-red-500 hover:text-red-700 p-2 transition"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Add Phone Button at Bottom Right */}
//             <div className="flex justify-end pt-2">
//               <button
//                 type="button"
//                 onClick={addPhone}
//                 className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition flex items-center gap-2"
//               >
//                 <Plus className="w-4 h-4" />
//                 Add Phone
//               </button>
//             </div>
//           </div>

//           {/* Email and Address */}
//           <div className="space-y-4">
//             <div>
//               <label className="block mb-1 font-medium text-slate-800 text-sm">Email Address</label>
//               <input
//                 type="email"
//                 value={contactInfo.email || ""}
//                 onChange={(e) => updateField("contactInfo", { ...contactInfo, email: e.target.value })}
//                 placeholder="contact@event.com"
//                 className={baseInputClasses}
//               />
//             </div>
            
//             <div>
//               <label className="block mb-1 font-medium text-slate-800 text-sm">Address</label>
//               <textarea
//                 value={contactInfo.address || ""}
//                 onChange={(e) => updateField("contactInfo", { ...contactInfo, address: e.target.value })}
//                 placeholder="Event venue address"
//                 className={baseTextareaClasses}
//                 rows={3}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // International Contacts Section
//   const renderInternationalContacts = () => {
//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <div>
//           <h3 className="text-lg font-semibold text-slate-900">International Contacts</h3>
//           <p className="text-sm text-slate-600 mt-1">
//             Contact persons for international attendees
//           </p>
//         </div>

//         {internationalContacts.length === 0 ? (
//           <div className="text-center py-8 text-slate-500 bg-white rounded-lg border-2 border-dashed border-amber-200">
//             <div className="w-12 h-12 mx-auto mb-3 bg-slate-200 rounded-full flex items-center justify-center">
//               <Globe className="w-6 h-6 text-slate-400" />
//             </div>
//             <p className="font-medium">No international contacts added yet</p>
//             <p className="text-sm mt-1">Add contacts for international attendees</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {internationalContacts.map((contact: InternationalContact, index: number) => (
//               <div key={index} className="p-6 bg-white rounded-lg border border-amber-200 space-y-4">
//                 <div className="flex justify-between items-center">
//                   <h4 className="font-semibold text-slate-800">
//                     Contact {index + 1}
//                   </h4>
//                   <button
//                     type="button"
//                     onClick={() => removeArrayItem("internationalContacts", index)}
//                     className="text-red-500 hover:text-red-700 text-sm font-medium transition flex items-center"
//                   >
//                     <Minus className="w-4 h-4 mr-1" />
//                     Remove
//                   </button>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Name
//                     </label>
//                     <input
//                       type="text"
//                       value={contact.name || ""}
//                       onChange={(e) => {
//                         const newContacts = [...internationalContacts];
//                         newContacts[index] = { ...newContacts[index], name: e.target.value };
//                         updateField("internationalContacts", newContacts);
//                       }}
//                       placeholder="Full name"
//                       className={baseInputClasses}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Organization
//                     </label>
//                     <input
//                       type="text"
//                       value={contact.organization || ""}
//                       onChange={(e) => {
//                         const newContacts = [...internationalContacts];
//                         newContacts[index] = { ...newContacts[index], organization: e.target.value };
//                         updateField("internationalContacts", newContacts);
//                       }}
//                       placeholder="Company or institution"
//                       className={baseInputClasses}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Phone
//                     </label>
//                     <input
//                       type="tel"
//                       value={contact.phone || ""}
//                       onChange={(e) => {
//                         const newContacts = [...internationalContacts];
//                         newContacts[index] = { ...newContacts[index], phone: e.target.value };
//                         updateField("internationalContacts", newContacts);
//                       }}
//                       placeholder="International format"
//                       className={baseInputClasses}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 font-medium text-slate-800 text-sm">
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       value={contact.email || ""}
//                       onChange={(e) => {
//                         const newContacts = [...internationalContacts];
//                         newContacts[index] = { ...newContacts[index], email: e.target.value };
//                         updateField("internationalContacts", newContacts);
//                       }}
//                       placeholder="email@organization.com"
//                       className={baseInputClasses}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Add Contact Button at Bottom Right */}
//         <div className="flex justify-end pt-2">
//           <button
//             type="button"
//             onClick={() => addArrayItem("internationalContacts", { 
//               name: "", phone: "", email: "", organization: "" 
//             })}
//             className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition flex items-center gap-2"
//           >
//             <Plus className="w-4 h-4" />
//             Add Contact
//           </button>
//         </div>
//       </div>
//     );
//   };

//   // Social Links Section
//   const renderSocialLinks = () => {
//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <h3 className="text-lg font-semibold text-slate-900 flex items-center">
//           <Share2 className="w-5 h-5 mr-2" />
//           Social Media Links
//         </h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block mb-1 font-medium text-slate-800 text-sm">Facebook</label>
//             <input
//               type="url"
//               value={socialLinks.facebook || ""}
//               onChange={(e) => updateField("socialLinks", { ...socialLinks, facebook: e.target.value })}
//               placeholder="https://facebook.com/yourevent"
//               className={baseInputClasses}
//             />
//           </div>
          
//           <div>
//             <label className="block mb-1 font-medium text-slate-800 text-sm">LinkedIn</label>
//             <input
//               type="url"
//               value={socialLinks.linkedin || ""}
//               onChange={(e) => updateField("socialLinks", { ...socialLinks, linkedin: e.target.value })}
//               placeholder="https://linkedin.com/company/yourevent"
//               className={baseInputClasses}
//             />
//           </div>
          
//           <div>
//             <label className="block mb-1 font-medium text-slate-800 text-sm">Instagram</label>
//             <input
//               type="url"
//               value={socialLinks.instagram || ""}
//               onChange={(e) => updateField("socialLinks", { ...socialLinks, instagram: e.target.value })}
//               placeholder="https://instagram.com/yourevent"
//               className={baseInputClasses}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Tags Section
//   const renderTags = () => {
//     const [newTag, setNewTag] = useState("");

//     const addTag = () => {
//       if (newTag.trim() && !tags.includes(newTag.trim())) {
//         updateField("tags", [...tags, newTag.trim()]);
//         setNewTag("");
//       }
//     };

//     const removeTag = (index: number) => {
//       updateField("tags", tags.filter((_, i) => i !== index));
//     };

//     const handleKeyDown = (e: React.KeyboardEvent) => {
//       if (e.key === 'Enter') {
//         e.preventDefault();
//         addTag();
//       }
//     };

//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <h3 className="text-lg font-semibold text-slate-900">Event Tags</h3>
        
//         <div className="space-y-4">
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={newTag}
//               onChange={(e) => setNewTag(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Add tags (e.g., technology, conference, networking)"
//               className={`${baseInputClasses} flex-1`}
//             />
//             <button
//               type="button"
//               onClick={addTag}
//               className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
//             >
//               Add Tag
//             </button>
//           </div>
          
//           {tags.length > 0 && (
//             <div className="flex flex-wrap gap-2">
//               {tags.map((tag: string, index: number) => (
//                 <span
//                   key={index}
//                   className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-1"
//                 >
//                   {tag}
//                   <button
//                     type="button"
//                     onClick={() => removeTag(index)}
//                     className="text-amber-600 hover:text-amber-800"
//                   >
//                     <Trash2 className="w-3 h-3" />
//                   </button>
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Publishing Section
//   const renderPublishing = () => {
//     return (
//       <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
//         <h3 className="text-lg font-semibold text-slate-900 flex items-center">
//           <Calendar className="w-5 h-5 mr-2" />
//           Publishing Settings
//         </h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="published"
//               checked={published}
//               onChange={(e) => updateField("published", e.target.checked)}
//               className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
//             />
//             <label htmlFor="published" className="ml-2 text-sm font-medium text-slate-800">
//               Publish this event
//             </label>
//           </div>
          
//           <div>
//             <label className="block mb-1 font-medium text-slate-800 text-sm">
//               Last Modified
//             </label>
//             <input
//               type="datetime-local"
//               value={lastModified}
//               onChange={(e) => updateField("lastModified", e.target.value)}
//               className={baseInputClasses}
//             />
//           </div>
//         </div>
        
//         <div className="p-4 bg-amber-100 rounded-lg border border-amber-200">
//           <p className="text-sm text-amber-800">
//             <strong>Note:</strong> When published, your event will be visible to the public. 
//             The last modified date helps track when changes were made.
//           </p>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-8">
//       <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
//         {step.title}
//       </h2>

//       {renderExhibitorInterviews()}
//       {renderMediaGallery()}
//       {renderContactInfo()}
//       {renderInternationalContacts()}
//       {renderSocialLinks()}
//       {renderTags()}
//       {renderPublishing()}

//       {/* Summary Preview */}
//       <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
//         <h3 className="font-semibold text-amber-900 mb-4">Event Media & Contacts Summary</h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
//           <div>
//             <h4 className="font-medium text-amber-800 mb-2">Media</h4>
//             <div className="space-y-1">
//               <div className="flex justify-between">
//                 <span>Interviews:</span>
//                 <span className="font-medium">{exhibitorInterviews.length}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Gallery Items:</span>
//                 <span className="font-medium">{mediaGallery.filter((m: MediaGalleryItem) => m.mediaUrl).length}/6</span>
//               </div>
//             </div>
//           </div>
          
//           <div>
//             <h4 className="font-medium text-amber-800 mb-2">Contacts</h4>
//             <div className="space-y-1">
//               <div className="flex justify-between">
//                 <span>Phone Numbers:</span>
//                 <span className="font-medium">{contactInfo.phone?.length || 0}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>International:</span>
//                 <span className="font-medium">{internationalContacts.length}</span>
//               </div>
//             </div>
//           </div>
          
//           <div>
//             <h4 className="font-medium text-amber-800 mb-2">Social & Tags</h4>
//             <div className="space-y-1">
//               <div className="flex justify-between">
//                 <span>Social Links:</span>
//                 <span className="font-medium">
//                   {[socialLinks.facebook, socialLinks.linkedin, socialLinks.instagram].filter(Boolean).length}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Tags:</span>
//                 <span className="font-medium">{tags.length}</span>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className="mt-4 p-3 bg-white rounded-lg border border-amber-100">
//           <div className="flex justify-between items-center">
//             <span className="font-medium text-slate-800">Publication Status:</span>
//             <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//               published 
//                 ? 'bg-green-100 text-green-800' 
//                 : 'bg-slate-100 text-slate-600'
//             }`}>
//               {published ? 'Published' : 'Draft'}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


import { useState, useEffect } from "react";
import { useForm } from "../../context/FormContext";
import { Plus, Minus, Trash2, Globe, Mail, Phone, MapPin, Share2, Calendar, Upload } from "lucide-react";

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

// API response interface
interface UploadResponse {
  url: string;
  key: string;
  message?: string;
}

export const Step5 = ({ step, setStepValid }: { step: any; setStepValid?: (valid: boolean) => void }) => {
  const { data, addArrayItem, removeArrayItem, updateField } = useForm();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Initialize data if not present
  const exhibitorInterviews = data.exhibitorInterviews || [];
  const mediaGallery = data.mediaGallery || [];
  const contactInfo = data.contactInfo || { phone: [], email: "", address: "" };
  const internationalContacts = data.internationalContacts || [];
  const socialLinks = data.socialLinks || { facebook: "", linkedin: "", instagram: "" };
  const tags = data.tags || [];
  const published = data.published || false;
  const lastModified = data.lastModified || "";

  const baseInputClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full";
  const baseTextareaClasses = "border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-sm w-full min-h-[80px] resize-vertical";

  // Initialize media gallery with 6 slots
  useEffect(() => {
    if (mediaGallery.length === 0) {
      const initialSlots = Array(6).fill(null).map(() => ({ 
        mediaUrl: "", 
        mediaType: "", 
        fileName: "",
        uploaded: false,
        uploading: false,
        error: ""
      }));
      updateField("mediaGallery", initialSlots);
    }
  }, []);

  // File upload function using the bucket API
  const uploadToBucket = async (file: File, index: number): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Generate a unique filename with timestamp
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `event-media-${timestamp}-${index}.${fileExtension}`;
    formData.append('fileName', fileName);

    try {
      const response = await fetch('https://v96xyrv321.execute-api.ap-south-1.amazonaws.com/prod/upload/events', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data: UploadResponse = await response.json();
      
      if (!data.url) {
        throw new Error('No URL returned from upload API');
      }

      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Exhibitor Interviews Section
  const renderExhibitorInterviews = () => {
    return (
      <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Exhibitor Interviews</h3>
          <p className="text-sm text-slate-600 mt-1">
            Add video interviews with exhibitors or partners
          </p>
        </div>

        {exhibitorInterviews.length === 0 ? (
          <div className="text-center py-8 text-slate-500 bg-white rounded-lg border-2 border-dashed border-amber-200">
            <div className="w-12 h-12 mx-auto mb-3 bg-slate-200 rounded-full flex items-center justify-center">
              <Share2 className="w-6 h-6 text-slate-400" />
            </div>
            <p className="font-medium">No interviews added yet</p>
            <p className="text-sm mt-1">Add video interviews to showcase exhibitors</p>
          </div>
        ) : (
          <div className="space-y-4">
            {exhibitorInterviews.map((interview: ExhibitorInterview, index: number) => (
              <div key={index} className="p-6 bg-white rounded-lg border border-amber-200 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-slate-800">
                    Interview {index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeArrayItem("exhibitorInterviews", index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition flex items-center"
                  >
                    <Minus className="w-4 h-4 mr-1" />
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-slate-800 text-sm">
                      Video Title
                    </label>
                    <input
                      type="text"
                      value={interview.videoTitle || ""}
                      onChange={(e) => {
                        const newInterviews = [...exhibitorInterviews];
                        newInterviews[index] = { ...newInterviews[index], videoTitle: e.target.value };
                        updateField("exhibitorInterviews", newInterviews);
                      }}
                      placeholder="Interview with [Exhibitor Name]"
                      className={baseInputClasses}
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 font-medium text-slate-800 text-sm">
                      Video URL
                    </label>
                    <input
                      type="url"
                      value={interview.videoUrl || ""}
                      onChange={(e) => {
                        const newInterviews = [...exhibitorInterviews];
                        newInterviews[index] = { ...newInterviews[index], videoUrl: e.target.value };
                        updateField("exhibitorInterviews", newInterviews);
                      }}
                      placeholder="https://youtube.com/embed/..."
                      className={baseInputClasses}
                    />
                  </div>
                </div>

                {interview.videoUrl && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                    <label className="block mb-2 font-medium text-slate-800 text-sm">Preview:</label>
                    <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center">
                      <div className="text-center text-slate-600">
                        <div className="w-12 h-12 mx-auto mb-2 bg-slate-300 rounded-full flex items-center justify-center">
                          <Share2 className="w-6 h-6 text-slate-500" />
                        </div>
                        <p className="text-sm">Video: {interview.videoTitle || "Untitled"}</p>
                        <p className="text-xs mt-1">{interview.videoUrl}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Interview Button at Bottom Right */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => addArrayItem("exhibitorInterviews", { videoTitle: "", videoUrl: "" })}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Interview
          </button>
        </div>
      </div>
    );
  };

  // Media Gallery Section with File Upload
  const renderMediaGallery = () => {
    const handleFileUpload = async (index: number, file: File) => {
      // Create a local URL for preview
      const objectUrl = URL.createObjectURL(file);
      
      const newMedia = [...mediaGallery];
      newMedia[index] = { 
        ...newMedia[index], 
        mediaUrl: objectUrl,
        mediaType: file.type.startsWith('image/') ? 'image' : 'document',
        file: file,
        fileName: file.name,
        uploading: true,
        uploaded: false,
        error: ""
      };
      updateField("mediaGallery", newMedia);

      try {
        // Upload to bucket API
        const uploadedUrl = await uploadToBucket(file, index);
        
        // Update with the actual uploaded URL
        const updatedMedia = [...mediaGallery];
        updatedMedia[index] = { 
          ...updatedMedia[index], 
          mediaUrl: uploadedUrl,
          uploading: false,
          uploaded: true
        };
        updateField("mediaGallery", updatedMedia);
        
        // Clean up the local object URL
        URL.revokeObjectURL(objectUrl);
        
      } catch (error) {
        const errorMedia = [...mediaGallery];
        errorMedia[index] = { 
          ...errorMedia[index], 
          uploading: false,
          error: error instanceof Error ? error.message : 'Upload failed'
        };
        updateField("mediaGallery", errorMedia);
      }
    };

    const handleRemoveFile = (index: number) => {
      const newMedia = [...mediaGallery];
      const currentMedia = newMedia[index];
      
      // Revoke object URL if it's a local blob URL
      if (currentMedia.mediaUrl && currentMedia.mediaUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentMedia.mediaUrl);
      }
      
      newMedia[index] = { 
        mediaUrl: "", 
        mediaType: "", 
        fileName: "",
        uploaded: false,
        uploading: false,
        error: ""
      };
      updateField("mediaGallery", newMedia);
    };

    const handleRetryUpload = async (index: number) => {
      const media = mediaGallery[index];
      if (media.file) {
        await handleFileUpload(index, media.file);
      }
    };

    return (
      <div className="space-y-6 p-6 bg-yellow-50 rounded-xl shadow-md">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Media Gallery</h3>
          <p className="text-sm text-slate-600 mt-1">
            Upload up to 6 images or documents for your event
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaGallery.slice(0, 6).map((media: MediaGalleryItem, index: number) => (
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
                  Image {index + 1}
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
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
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
                      <p className="text-sm font-medium text-slate-700">Upload File</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Image or Document
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

                    {/* Preview */}
                    <div className="bg-slate-50 rounded-lg p-3">
                      <label className="block mb-2 font-medium text-slate-800 text-sm">
                        Preview:
                      </label>
                      {media.mediaType === 'image' ? (
                        <div className="aspect-video bg-slate-200 rounded-lg overflow-hidden">
                          <img 
                            src={media.mediaUrl} 
                            alt={`Uploaded image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-white rounded border">
                          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            📄
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-slate-800 truncate">
                              {media.fileName}
                            </div>
                            <div className="text-xs text-slate-500">
                              Document
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="text-xs text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium capitalize">{media.mediaType}</span>
                      </div>
                      {media.fileName && (
                        <div className="flex justify-between">
                          <span>File:</span>
                          <span className="font-medium truncate ml-2">{media.fileName}</span>
                        </div>
                      )}
                      {media.mediaUrl && media.mediaUrl.startsWith('http') && (
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className={`font-medium ${
                            media.uploaded ? 'text-green-600' : 'text-amber-600'
                          }`}>
                            {media.uploaded ? 'Uploaded to Cloud' : 'Local Preview'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Replace File Button */}
                    <div className="flex gap-2">
                      <input
                        type="file"
                        id={`media-replace-${index}`}
                        accept="image/*,.pdf,.doc,.docx,.txt"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
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
          ))}
        </div>

        {/* Upload Progress/Status */}
        <div className="p-4 bg-amber-100 rounded-lg border border-amber-200">
          <h4 className="font-medium text-amber-800 mb-2">Upload Status</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {mediaGallery.slice(0, 6).map((media: MediaGalleryItem, index: number) => (
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
          </div>
        </div>
      </div>
    );
  };

  // ... (rest of the code remains the same for other sections: ContactInfo, InternationalContacts, SocialLinks, Tags, Publishing)

  // Contact Information Section
  const renderContactInfo = () => {
    // ... (existing contact info code)
  };

  // International Contacts Section
  const renderInternationalContacts = () => {
    // ... (existing international contacts code)
  };

  // Social Links Section
  const renderSocialLinks = () => {
    // ... (existing social links code)
  };

  // Tags Section
  const renderTags = () => {
    // ... (existing tags code)
  };

  // Publishing Section
  const renderPublishing = () => {
    // ... (existing publishing code)
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-amber-900 border-b border-amber-300 pb-2 mb-6">
        {step.title}
      </h2>

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
                <span>Interviews:</span>
                <span className="font-medium">{exhibitorInterviews.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Gallery Items:</span>
                <span className="font-medium">
                  {mediaGallery.filter((m: MediaGalleryItem) => m.uploaded).length}/6 Uploaded
                </span>
              </div>
              <div className="flex justify-between">
                <span>Pending Uploads:</span>
                <span className="font-medium text-amber-600">
                  {mediaGallery.filter((m: MediaGalleryItem) => m.mediaUrl && !m.uploaded && !m.uploading).length}
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