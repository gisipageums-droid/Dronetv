import axios from "axios";

export const fetchFormStructure = async () => {
  const res = await axios.get('https://qemducz8gc.execute-api.ap-south-1.amazonaws.com/formstructure');
  return res.data;
};

export const uploadFile = async (userId: string, fieldName: string, file: File) => {
  const formData = new FormData();
  formData.append("userId", userId);
  formData.append("fieldName", fieldName);
  formData.append("file", file);
  const res = await axios.post(
    'https://v96xyrv321.execute-api.ap-south-1.amazonaws.com/prod/upload',
    formData
  );
  return res.data;
};

export const submitForm = async (payload: any) => {
  const res = await axios.post('https://9zhkqwucj5.execute-api.ap-south-1.amazonaws.com/dev/', payload);
  return res.data;
};
