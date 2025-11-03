import { createContext, ReactNode, useContext, useState } from 'react';


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


export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<FormStore>({
    basicInfo: {},
    //  basicInfo: { user_name: "" },
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
    templateSelection:""  //added now for prefill logic and in the formcontext too
    
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



    // const resetForm = () => setData(initialFormData); // 👈 resets all fields

 console.log("Form Data:", data);
 

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
