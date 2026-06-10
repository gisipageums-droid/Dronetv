import { createContext, ReactNode, useContext, useState, useEffect } from 'react';


interface SubCategory {
  parent: string;
  name: string;
}


interface FormStore {
  basicInfo: Record<string, any>;
  addressInformation: Record<string, any>;
  communicationAddress: Record<string, any>; // Add this
  alternateContact: Record<string, any>;
  socialMediaLinks: Record<string, any>;
  categories: string[];
  // subcategories: string[];
  subcategories: SubCategory[];
  skills: string[];
  freeformSkills: string[];
  projects: any[];
  services: any[];
  media: any[];
  // resume: string | null;
  resume: any[]; // array of documents
  templateSelection: string | number; // <-- add this
  //  templateSelection: string // <-- add this


}



interface FormContextType {
  data: FormStore;

  setData: React.Dispatch<React.SetStateAction<FormStore>>;

  updateField: (key: keyof FormStore, value: any) => void;
  addArrayItem: (key: 'projects' | 'services', item: any) => void;
  removeArrayItem: (key: 'projects' | 'services', index: number) => void;

  // resetForm: () => void; 
}

const FormContext = createContext<FormContextType | undefined>(undefined);


const initialFormData: FormStore = {
  basicInfo: {},
  addressInformation: {},
  communicationAddress: {}, // Add this
  alternateContact: {},
  socialMediaLinks: {},
  categories: [],
  subcategories: [],
  skills: [],
  freeformSkills: [],
  projects: [],
  services: [],
  media: [],
  resume: [],
  templateSelection: ""
};

export const FormProvider = ({ children }: { children: ReactNode }) => {
  // Initialize from localStorage synchronously so values are present on first render
  const [data, setData] = useState<FormStore>(() => {
    try {
      const saved = localStorage.getItem("professionalFormDraft");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.formData && typeof parsed.formData === "object") {
          return { ...initialFormData, ...parsed.formData };
        }
      }
    } catch (e) {
      console.error("Failed to read formData from localStorage on init", e);
    }
    return initialFormData;
  });


  const updateField = (key: keyof FormStore, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const addArrayItem = (key: 'projects' | 'services', item: any) => {
    setData(prev => ({ ...prev, [key]: [...prev[key], item] }));
  };

  const removeArrayItem = (key: 'projects' | 'services', index: number) => {
    setData(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
  };

  // Persist form data to localStorage — merge with existing to preserve the step key
  useEffect(() => {
    try {
      const saved = localStorage.getItem("professionalFormDraft");
      const existing = saved ? JSON.parse(saved) : {};
      localStorage.setItem("professionalFormDraft", JSON.stringify({ ...existing, formData: data }));
    } catch (e) {
      console.error("Failed to save draft to localStorage", e);
    }
  }, [data]);


  return (
    <FormContext.Provider value={{ data, setData, updateField, addArrayItem, removeArrayItem }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useForm must be used within FormProvider");
  return ctx;
};
