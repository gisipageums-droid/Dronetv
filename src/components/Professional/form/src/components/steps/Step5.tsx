import { useLocation } from "react-router-dom";
import { useForm } from "../../context/FormContext";
import { FileUploader } from "../common/FileUploader";

export const Step5 = ({ step }: { step: any }) => {
  const { data } = useForm();
  const email = data.basicInfo?.email || "unknown@example.com";

  // const userId = email; 




  // enable this for template fetching
  const location = useLocation();
  const templateSelection = location.state?.templateId;

  // Helper: detect file type from URL/extension
  const renderPreview = (url: string) => {
    if (!url) return null;

    const lower = url.toLowerCase();

    if (lower.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      // image
      return (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img
            src={url}
            alt="Uploaded preview"
            className="w-40 h-40 object-cover rounded-xl shadow hover:scale-105 transition-transform"
          />
        </a>
      );
    } else if (lower.endsWith(".pdf")) {
      // pdf
      return (
        <iframe
          src={url}
          className="w-60 h-40 border rounded-lg shadow"
          title="PDF Preview"
        />
      );
    } else {
      // any other doc — show download
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-3 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-sm rounded-lg shadow hover:opacity-90"
        >
          View / Download
        </a>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}


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
                    : "not selected"}
              </p>
              <p>
                <strong>Template ID:</strong>{" "}
                {templateSelection}
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

        Upload fields
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
        <div className="grid gap-6 py-8">
          {step.media?.fields?.map((f: any) => (
            <div
              key={f.id}
              // className="p-5 bg-white rounded-2xl shadow-lg border border-style:dashed border-gray-200 space-y-3"
              className="p-5 bg-green-50 rounded-2xl shadow-lg border-2 border-dashed border-green-400 space-y-3 h-48 items-center justify-center flex flex-col "

            >
              <label className="block text-lg font-medium text-gray-700 ">
                {f.label}
              </label>

              <FileUploader
                userId={email}
                // userId={userId}
                fieldName={f.id}
                maxSizeMB={step.media.maxSizeMB}
              />
            </div>
          ))}
        </div>


        <p className='text-sm text-blue-700 mt-4'>
          <strong>Note:</strong> Files are uploaded immediately when selected. AI will generate additional images and design elements for your website automatically.
        </p>


      </div>



      {/* Uploaded Files */}
      <div className="p-6 bg-blue-50 rounded-2xl shadow-inner space-y-4">
        <h3 className="text-xl font-semibold ">
          Uploaded Files
        </h3>
        {data.media.length === 0 ? (
          <p className="text-gray-500">No files uploaded yet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6    p-6">
            {data.media.map((m) => (
              <li
                key={m.fieldName}
                className="p-4 bg-green-50 border-2 border-dashed  rounded-xl shadow border border-gray-400 space-y-3"
              >
                <p className="text-sm font-medium text-gray-600">
                  {m.fieldName}
                </p>
                <div className="flex justify-center">{renderPreview(m.fileUrl)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>




      {/* Upload Summary */}
      {/* <div className='bg-slate-100 rounded-lg p-6'>
          <h3 className='text-lg font-bold text-slate-900 mb-4'>
            Upload Summary
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <h4 className='font-semibold text-slate-800 mb-2'>
                Files Status:
              </h4>
              <ul className='space-y-1 text-sm'>
                {Object.keys(data.media.map).length === 0 ? (
                  <li className='text-slate-600'>No files uploaded yet</li>
                ) : (
                  Object.keys(data.media).map((fieldName) => (
                    <li key={fieldName} className='flex items-center text-green-600'>
                      <span className='w-2 h-2 rounded-full mr-2 bg-current'></span>
                      {fieldName} ✓ Uploaded ({[fieldName]})
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
        </div> */}

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
                data.media.map((m) => (
                  <li
                    key={m.fieldName}
                    className='flex items-center text-green-600'
                  >
                    <span className='w-2 h-2 rounded-full mr-2 bg-current'></span>
                    {m.fieldName} ✓ Uploaded
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
  );
};
