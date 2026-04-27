// import { useState } from "react";
// import { uploadFile } from "../../api/formApi";
// import { useForm } from "../../context/FormContext";

// interface FileUploaderProps {
//   userId: string;
//   fieldName: string;
//   maxSizeMB: number;
// }

// export const FileUploader = ({ userId, fieldName, maxSizeMB }: FileUploaderProps) => {
//   const [loading, setLoading] = useState(false);
//   const { data, updateField } = useForm();

//   const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (file.size / 1024 / 1024 > maxSizeMB) {
//       alert(`File exceeds ${maxSizeMB}MB`);
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await uploadFile(userId, fieldName, file);
//       updateField('media', [...data.media, { fieldName , fileUrl: res.url || res.s3Url }]);
//     //   updateField('media', [...data.media, { fieldName, imageUrl: res.url || res.imageUrl }]);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div  >
      
//       <input  type="file"   onChange={handleUpload} />
//       {loading && <p>Uploading...</p>}
//     </div>
//   );
// };





import { useState } from "react";
import { uploadFile } from "../../api/formApi";
import { useForm } from "../../context/FormContext";

interface FileUploaderProps {
  userId: string;
  fieldName: string;
  maxSizeMB: number;
}

export const FileUploader = ({ userId, fieldName, maxSizeMB }: FileUploaderProps) => {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("No file chosen"); // ✅ default text
  const { data, updateField } = useForm();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size / 1024 / 1024 > maxSizeMB) {
      alert(`File exceeds ${maxSizeMB}MB`);
      return;
    }

    setLoading(true);
    try {
      const res = await uploadFile(userId, fieldName, file);
      updateField("media", [
        ...data.media,
        { fieldName, fileUrl: res.url || res.s3Url },
      ]);
      setFileName(file.name); // ✅ update to uploaded file name
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* Pretty upload button */}
      <p className=" text-xs">Click Below To Upload</p>
      <label className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md shadow cursor-pointer hover:bg-blue-700 w-fit">
        {loading ? "Uploading..." : "Choose File"}
        <input
          type="file"
          onChange={handleUpload}
          className="hidden"
        />
      </label>

      {/* File name / status text */}
      <p className="text-sm text-gray-600">{fileName}</p>
    </div>
  );
};
