import axios from "axios";
import { ADMIN_API, MEDIA_API, PROFESSIONAL_API, LAMBDA } from '../../../../../lib/apiConfig';

export const fetchFormStructure = async () => {
  const res = await axios.get(ADMIN_API ? `${ADMIN_API}/form/structure` : `${LAMBDA.formStructure}`);
  return res.data;
};

// Presigned-upload — matches the company form's fix for the same problem:
// posting the raw file multipart through a Lambda/gateway has a hard ~29s
// integration timeout, so on a slow connection the upload button just spun
// on "Uploading..." forever with no error ever surfacing. A presigned PUT
// straight to S3/MinIO has no such cap.
export const uploadFile = async (userId: string, fieldName: string, file: File) => {
  if (PROFESSIONAL_API) {
    const presignRes = await axios.post(
      `${PROFESSIONAL_API}/upload-file`,
      { userId, fieldName, filename: file.name, contentType: file.type || "application/octet-stream" },
      { headers: { "Content-Type": "application/json" }, timeout: 30000 }
    );
    if (!presignRes.data.success) {
      throw new Error(presignRes.data.error || "Failed to get upload URL");
    }
    const { uploadUrl, imageUrl } = presignRes.data;
    await axios.put(uploadUrl, file, {
      headers: { "Content-Type": file.type || "application/octet-stream" },
      timeout: 300000,
    });
    return { url: imageUrl, s3Url: imageUrl };
  }

  const formData = new FormData();
  formData.append("userId", userId);
  formData.append("fieldName", fieldName);
  formData.append("file", file);
  const res = await axios.post(
    MEDIA_API ? `${MEDIA_API}/upload` : `${LAMBDA.eventsImageUpload}/upload`,
    formData,
    { timeout: 60000 }
  );
  return res.data;
};

export const submitForm = async (payload: any) => {
  const res = await axios.post(PROFESSIONAL_API ? `${PROFESSIONAL_API}/submit` : `${LAMBDA.profForm}/`, payload);
  return res.data;
};


export const updateForm = async (userId: string, professionalId: string, payload: any) => {
  const res = await axios.put(PROFESSIONAL_API ? `${PROFESSIONAL_API}/${userId}/${professionalId}` : `${LAMBDA.profUpdate}/${userId}/${professionalId}`, payload);
  return res.data;
};