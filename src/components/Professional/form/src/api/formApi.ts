import axios from "axios";
import { EVENTS_API, MEDIA_API, PROFESSIONAL_API, LAMBDA } from '../../../../../lib/apiConfig';

export const fetchFormStructure = async () => {
  const res = await axios.get(EVENTS_API ? `${EVENTS_API}` : `${LAMBDA.formStructure}`);
  return res.data;
};

export const uploadFile = async (userId: string, fieldName: string, file: File) => {
  const formData = new FormData();
  formData.append("userId", userId);
  formData.append("fieldName", fieldName);
  formData.append("file", file);
  const res = await axios.post(
    MEDIA_API ? `${MEDIA_API}/upload` : `${LAMBDA.eventsImageUpload}/upload`,
    formData
  );
  return res.data;
};

export const submitForm = async (payload: any) => {
  const res = await axios.post(PROFESSIONAL_API ? `${PROFESSIONAL_API}/` : `${LAMBDA.profForm}/`, payload);
  return res.data;
};


export const updateForm = async (userId: string, professionalId: string, payload: any) => {
  const res = await axios.put(PROFESSIONAL_API ? `${PROFESSIONAL_API}/${userId}/${professionalId}` : `${LAMBDA.profUpdate}/${userId}/${professionalId}`, payload);
  return res.data;
};