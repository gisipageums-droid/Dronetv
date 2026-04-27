export async function uploadImageToS3(file: File): Promise<string> {
  const response = await fetch(
    'https://oljot50ikk.execute-api.ap-south-1.amazonaws.com/presign-upload',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type
      })
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get presigned URL');
  }

  const { uploadURL, fileUrl } = await response.json();

  const s3Response = await fetch(uploadURL, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file
  });

  if (!s3Response.ok) {
    throw new Error('Failed to upload file to S3');
  }

  return fileUrl as string;
}
