import { useState } from "react";
import { uploadFile } from "../../api/formApi";

interface FileUploaderProps {
  userId: string;
  fieldName: string;
  maxSizeMB: number;
  onUploadSuccess: (uploadedFile: { fieldName: string; fileUrl: string; fileName: string }) => void;
  showReplaceMessage?: boolean;
}

export const FileUploader = ({ userId, fieldName, maxSizeMB, onUploadSuccess, showReplaceMessage }: FileUploaderProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size / 1024 / 1024 > maxSizeMB) {
      setError(`File exceeds ${maxSizeMB}MB`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await uploadFile(userId, fieldName, file);
      const fileUrl = res.url || res.s3Url;
      if (!fileUrl) throw new Error("Upload succeeded but no file URL was returned");
      onUploadSuccess({ fieldName, fileUrl, fileName: file.name });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Upload failed - please try again");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-xs">
        {showReplaceMessage ? "Click Below To Replace" : "Click Below To Upload"}
      </p>
      <label className="flex items-center justify-center px-4 py-2 bg-brand-gold text-white rounded-md shadow cursor-pointer hover:bg-brand-gold w-fit">
        {loading ? "Uploading..." : "Choose File"}
        <input
          type="file"
          onChange={handleUpload}
          className="hidden"
          disabled={loading}
        />
      </label>

      {error && <p className="text-sm text-status-error">{error}</p>}
    </div>
  );
};
