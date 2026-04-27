import axios from "axios";

export const fetchFormStructure = async () => {
  const res = await axios.get('https://vfr3e0umwc.execute-api.ap-south-1.amazonaws.com/dev/');
  // const res = await axios.get('https://qemducz8gc.execute-api.ap-south-1.amazonaws.com/formstructure');
  return res.data;
};

export const uploadFile = async (userId: string, fieldName: string, file: File) => {
  const formData = new FormData();
  formData.append("userId", userId);
  formData.append("fieldName", fieldName);
  formData.append("file", file);
  const res = await axios.post(
    // 'https://v96xyrv321.execute-api.ap-south-1.amazonaws.com/prod/upload',
    'https://v96xyrv321.execute-api.ap-south-1.amazonaws.com/prod/upload/events',
    formData
  );
  return res.data;
};

export const submitForm = async (payload: any) => {
  // const res = await axios.post('https://9zhkqwucj5.execute-api.ap-south-1.amazonaws.com/dev/', payload);
  const res = await axios.post('https://9fszydao5h.execute-api.ap-south-1.amazonaws.com/prod/events/save-draft', payload);
  return res.data;
};


export const updateForm = async (userId: string, professionalId: string, payload: any) => {
  const res = await axios.put(`https://tvlifa6840.execute-api.ap-south-1.amazonaws.com/prod/${userId}/${professionalId}`, payload);
  return res.data;
};