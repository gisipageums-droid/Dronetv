import { createContext, ReactNode, useContext, useState, useEffect } from 'react';


interface SubCategory {
  parent: string;
  name: string;
}


interface FormStore {
  basicInfo: Record<string, any>;
  addressInformation: Record<string, any>;
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

const updateField = (section: string, value: any) => {
  setData((prevData) => {
    // Create a copy of the previous data
    const newData = { ...prevData };

    // MERGE logic: Keep existing fields in that section, add the new ones
    newData[section] = {
      ...(newData[section] || {}), // Keep name, email, etc.
      ...value,                    // Overwrite ONLY country/state
    };

    return newData;
  });
};

  const addArrayItem = (key: 'projects' | 'services', item: any) => {
    setData(prev => ({ ...prev, [key]: [...prev[key], item] }));
  };

  const removeArrayItem = (key: 'projects' | 'services', index: number) => {
    setData(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
  };

  // Persist form data to localStorage whenever data changes
  useEffect(() => {
    try {
      const payload = JSON.stringify({ formData: data });
      localStorage.setItem("professionalFormDraft", payload);
    } catch (e) {
      console.error("Failed to save draft to localStorage", e);
    }
  }, [data]);

 

  return (
    <FormContext.Provider value={{ data,setData, updateField, addArrayItem, removeArrayItem }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useForm must be used within FormProvider");
  return ctx;
};
