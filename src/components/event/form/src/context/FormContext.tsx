// import { createContext, ReactNode, useContext, useState, useEffect } from 'react';


// interface SubCategory {
//   parent: string;
//   name: string;
// }


// interface FormStore {
//   basicInfo: Record<string, any>;
//   addressInformation: Record<string, any>;
//   alternateContact: Record<string, any>;  
//   socialMediaLinks: Record<string, any>;
//   categories: string[];
//   // subcategories: string[];
//   subcategories: SubCategory[];
//   skills: string[];
//   freeformSkills: string[];
//   projects: any[];
//   services: any[];
//   media: any[];
//   // resume: string | null;
//   resume: any[]; // array of documents
//    templateSelection: string | number; // <-- add this
//   //  templateSelection: string // <-- add this

  
// }



// interface FormContextType {
//   data: FormStore;

//    setData: React.Dispatch<React.SetStateAction<FormStore>>;
  
//    updateField: (key: keyof FormStore, value: any) => void;
//   addArrayItem: (key: 'projects' | 'services', item: any) => void;
//   removeArrayItem: (key: 'projects' | 'services', index: number) => void;

//   // resetForm: () => void; 
// }

// const FormContext = createContext<FormContextType | undefined>(undefined);


// const initialFormData: FormStore = {
//   basicInfo: {},
//   addressInformation: {},
//   alternateContact: {},   
//   socialMediaLinks: {},   
//   categories: [],
//   subcategories: [],
//   skills: [],
//   freeformSkills: [],
//   projects: [],
//   services: [],
//   media: [],
//   resume: [],
//   templateSelection: ""
// };

// export const FormProvider = ({ children }: { children: ReactNode }) => {
//   // Initialize from localStorage synchronously so values are present on first render
//   const [data, setData] = useState<FormStore>(() => {
//     try {
//       const saved = localStorage.getItem("professionalFormDraft");
//       if (saved) {
//         const parsed = JSON.parse(saved);
//         if (parsed?.formData && typeof parsed.formData === "object") {
//           return { ...initialFormData, ...parsed.formData };
//         }
//       }
//     } catch (e) {
//       console.error("Failed to read formData from localStorage on init", e);
//     }
//     return initialFormData;
//   });


//   const updateField = (key: keyof FormStore, value: any) => {
//     setData(prev => ({ ...prev, [key]: value }));
//   };

//   const addArrayItem = (key: 'projects' | 'services', item: any) => {
//     setData(prev => ({ ...prev, [key]: [...prev[key], item] }));
//   };

//   const removeArrayItem = (key: 'projects' | 'services', index: number) => {
//     setData(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
//   };

//   // Persist form data to localStorage whenever data changes
//   useEffect(() => {
//     try {
//       const payload = JSON.stringify({ formData: data });
//       localStorage.setItem("professionalFormDraft", payload);
//     } catch (e) {
//       console.error("Failed to save draft to localStorage", e);
//     }
//   }, [data]);

//   // const resetForm = () => setData(initialFormData); // 👈 resets all fields

//   console.log("Form Data:", data);
 

//   return (
//     <FormContext.Provider value={{ data,setData, updateField, addArrayItem, removeArrayItem }}>
//       {children}
//     </FormContext.Provider>
//   );
// };

// export const useForm = () => {
//   const ctx = useContext(FormContext);
//   if (!ctx) throw new Error("useForm must be used within FormProvider");
//   return ctx;
// };





// import { createContext, ReactNode, useContext, useState, useEffect } from 'react';

// // Event Form Interfaces
// interface Highlight {
//   highlightText: string;
// }

// interface CTAButton {
//   label: string;
//   link: string;
// }

// interface Section {
//   title: string;
//   description: string;
// }

// interface Zone {
//   zoneTitle: string;
//   description: string;
// }

// interface Speaker {
//   name: string;
//   designation: string;
//   organization: string;
//   day: string;
//   sequence: number;
// }

// interface Theme {
//   day: string;
//   themeTitle: string;
//   details: string;
// }

// interface Partner {
//   partnerName: string;
// }

// interface ExhibitorInterview {
//   videoTitle: string;
//   videoUrl: string;
// }

// interface MediaGalleryItem {
//   mediaUrl: string;
//   mediaType: string;
// }

// interface ContactInfo {
//   phone: { phoneNumber: string }[];
//   email: string;
//   address: string;
// }

// interface InternationalContact {
//   name: string;
//   phone: string;
//   email: string;
//   organization: string;
// }

// interface SocialLinks {
//   facebook: string;
//   linkedin: string;
//   instagram: string;
// }

// // Main Form Store Interface
// interface FormStore {
//   // Step 1: Basic Event Information
//   eventTitle: string;
//   eventTagline: string;
//   startDate: string;
//   endDate: string;
//   timeStart: string;
//   timeEnd: string;
//   venueName: string;
//   venueAddress: string;
//   organizer: string;
//   eventDescription: string;
//   countdownEnabled: boolean;
//   countdownTargetDate: string;

//   // Step 2: Highlights & CTAs
//   highlights: Highlight[];
//   ctaButtons: CTAButton[];

//   // Step 3: Sections & Specialized Zones
//   sections: Section[];
//   zones: Zone[];

//   // Step 4: Speakers, Themes & Partners
//   speakers: Speaker[];
//   themes: Theme[];
//   partners: Partner[];

//   // Step 5: Media, Contacts & Publishing
//   exhibitorInterviews: ExhibitorInterview[];
//   mediaGallery: MediaGalleryItem[];
//   contactInfo: ContactInfo;
//   internationalContacts: InternationalContact[];
//   socialLinks: SocialLinks;
//   tags: string[];
//   published: boolean;
//   lastModified: string;
// }

// interface FormContextType {
//   data: FormStore;
//   setData: React.Dispatch<React.SetStateAction<FormStore>>;
//   updateField: (key: keyof FormStore, value: any) => void;
//   addArrayItem: (key: 
//     'highlights' | 
//     'ctaButtons' | 
//     'sections' | 
//     'zones' | 
//     'speakers' | 
//     'themes' | 
//     'partners' | 
//     'exhibitorInterviews' | 
//     'mediaGallery' | 
//     'internationalContacts' | 
//     'tags', 
//     item: any
//   ) => void;
//   removeArrayItem: (key: 
//     'highlights' | 
//     'ctaButtons' | 
//     'sections' | 
//     'zones' | 
//     'speakers' | 
//     'themes' | 
//     'partners' | 
//     'exhibitorInterviews' | 
//     'mediaGallery' | 
//     'internationalContacts' | 
//     'tags', 
//     index: number
//   ) => void;
//   updateArrayItem: (
//     key: 
//       'highlights' | 
//       'ctaButtons' | 
//       'sections' | 
//       'zones' | 
//       'speakers' | 
//       'themes' | 
//       'partners' | 
//       'exhibitorInterviews' | 
//       'mediaGallery' | 
//       'internationalContacts',
//     index: number,
//     field: string,
//     value: any
//   ) => void;
// }

// const FormContext = createContext<FormContextType | undefined>(undefined);

// // Initial Form Data
// const initialFormData: FormStore = {
//   // Step 1
//   eventTitle: '',
//   eventTagline: '',
//   startDate: '',
//   endDate: '',
//   timeStart: '',
//   timeEnd: '',
//   venueName: '',
//   venueAddress: '',
//   organizer: '',
//   eventDescription: '',
//   countdownEnabled: false,
//   countdownTargetDate: '',

//   // Step 2
//   highlights: [],
//   ctaButtons: [],

//   // Step 3
//   sections: [],
//   zones: [],

//   // Step 4
//   speakers: [],
//   themes: [],
//   partners: [],

//   // Step 5
//   exhibitorInterviews: [],
//   mediaGallery: [],
//   contactInfo: {
//     phone: [],
//     email: '',
//     address: ''
//   },
//   internationalContacts: [],
//   socialLinks: {
//     facebook: '',
//     linkedin: '',
//     instagram: ''
//   },
//   tags: [],
//   published: false,
//   lastModified: ''
// };

// export const FormProvider = ({ children }: { children: ReactNode }) => {
//   // Initialize from localStorage synchronously so values are present on first render
//   const [data, setData] = useState<FormStore>(() => {
//     try {
//       const saved = localStorage.getItem("eventFormDraft");
//       if (saved) {
//         const parsed = JSON.parse(saved);
//         if (parsed?.formData && typeof parsed.formData === "object") {
//           return { ...initialFormData, ...parsed.formData };
//         }
//       }
//     } catch (e) {
//       console.error("Failed to read formData from localStorage on init", e);
//     }
//     return initialFormData;
//   });

//   // Update a specific field
//   const updateField = (key: keyof FormStore, value: any) => {
//     setData(prev => ({ ...prev, [key]: value }));
//   };

//   // Add item to array fields
//   const addArrayItem = (
//     key: 
//       'highlights' | 
//       'ctaButtons' | 
//       'sections' | 
//       'zones' | 
//       'speakers' | 
//       'themes' | 
//       'partners' | 
//       'exhibitorInterviews' | 
//       'mediaGallery' | 
//       'internationalContacts' | 
//       'tags', 
//     item: any
//   ) => {
//     setData(prev => ({ 
//       ...prev, 
//       [key]: [...prev[key], item] 
//     }));
//   };

//   // Remove item from array fields
//   const removeArrayItem = (
//     key: 
//       'highlights' | 
//       'ctaButtons' | 
//       'sections' | 
//       'zones' | 
//       'speakers' | 
//       'themes' | 
//       'partners' | 
//       'exhibitorInterviews' | 
//       'mediaGallery' | 
//       'internationalContacts' | 
//       'tags', 
//     index: number
//   ) => {
//     setData(prev => ({ 
//       ...prev, 
//       [key]: prev[key].filter((_, i) => i !== index) 
//     }));
//   };

//   // Update specific field in array item
//   const updateArrayItem = (
//     key: 
//       'highlights' | 
//       'ctaButtons' | 
//       'sections' | 
//       'zones' | 
//       'speakers' | 
//       'themes' | 
//       'partners' | 
//       'exhibitorInterviews' | 
//       'mediaGallery' | 
//       'internationalContacts',
//     index: number,
//     field: string,
//     value: any
//   ) => {
//     setData(prev => {
//       const newArray = [...prev[key]];
//       newArray[index] = { ...newArray[index], [field]: value };
//       return { ...prev, [key]: newArray };
//     });
//   };

//   // Persist form data to localStorage whenever data changes
//   useEffect(() => {
//     try {
//       const payload = JSON.stringify({ formData: data });
//       localStorage.setItem("eventFormDraft", payload);
//     } catch (e) {
//       console.error("Failed to save draft to localStorage", e);
//     }
//   }, [data]);

//   console.log("Form Data:", data);

//   return (
//     <FormContext.Provider value={{ 
//       data, 
//       setData, 
//       updateField, 
//       addArrayItem, 
//       removeArrayItem,
//       updateArrayItem 
//     }}>
//       {children}
//     </FormContext.Provider>
//   );
// };

// export const useForm = () => {
//   const ctx = useContext(FormContext);
//   if (!ctx) throw new Error("useForm must be used within FormProvider");
//   return ctx;
// };




import { createContext, ReactNode, useContext, useState, useEffect } from 'react';

// Event Form Interfaces
interface Highlight {
  highlightText: string;
}

interface CTAButton {
  label: string;
  link: string;
}

interface Section {
  title: string;
  description: string;
}

interface Zone {
  zoneTitle: string;
  description: string;
}

interface Speaker {
  name: string;
  designation: string;
  organization: string;
  day: string;
  sequence: number;
}

interface Theme {
  day: string;
  themeTitle: string;
  details: string;
}

interface Partner {
  partnerName: string;
}

interface ExhibitorInterview {
  videoTitle: string;
  videoUrl: string;
}

interface MediaGalleryItem {
  mediaUrl: string;
  mediaType: string;
}

interface ContactInfo {
  phone: { phoneNumber: string }[];
  email: string;
  address: string;
}

interface InternationalContact {
  name: string;
  phone: string;
  email: string;
  organization: string;
}

interface SocialLinks {
  facebook: string;
  linkedin: string;
  instagram: string;
}

// Main Form Store Interface
interface FormStore {
  // Step 1: Basic Event Information
  eventTitle: string;
  eventTagline: string;
  startDate: string;
  endDate: string;
  timeStart: string;
  timeEnd: string;
  venueName: string;
  venueAddress: string;
  organizer: string;
  eventDescription: string;
  countdownEnabled: boolean;
  countdownTargetDate: string;

  // Step 2: Highlights & CTAs
  highlights: Highlight[];
  ctaButtons: CTAButton[];

  // Step 3: Sections & Specialized Zones
  sections: Section[];
  zones: Zone[];

  // Step 4: Speakers, Themes & Partners
  speakers: Speaker[];
  themes: Theme[];
  partners: Partner[];

  // Step 5: Media, Contacts & Publishing
  exhibitorInterviews: ExhibitorInterview[];
  mediaGallery: MediaGalleryItem[];
  contactInfo: ContactInfo;
  internationalContacts: InternationalContact[];
  socialLinks: SocialLinks;
  tags: string[];
  published: boolean;
  lastModified: string;

  // Step 6: Documents
  resume: any[];
}

interface FormContextType {
  data: FormStore;
  setData: React.Dispatch<React.SetStateAction<FormStore>>;
  updateField: (key: keyof FormStore, value: any) => void;
  addArrayItem: (key: 
    'highlights' | 
    'ctaButtons' | 
    'sections' | 
    'zones' | 
    'speakers' | 
    'themes' | 
    'partners' | 
    'exhibitorInterviews' | 
    'mediaGallery' | 
    'internationalContacts' | 
    'tags' |
    'resume', 
    item: any
  ) => void;
  removeArrayItem: (key: 
    'highlights' | 
    'ctaButtons' | 
    'sections' | 
    'zones' | 
    'speakers' | 
    'themes' | 
    'partners' | 
    'exhibitorInterviews' | 
    'mediaGallery' | 
    'internationalContacts' | 
    'tags' |
    'resume', 
    index: number
  ) => void;
  updateArrayItem: (
    key: 
      'highlights' | 
      'ctaButtons' | 
      'sections' | 
      'zones' | 
      'speakers' | 
      'themes' | 
      'partners' | 
      'exhibitorInterviews' | 
      'mediaGallery' | 
      'internationalContacts' |
      'resume',
    index: number,
    field: string,
    value: any
  ) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

// Initial Form Data
const initialFormData: FormStore = {
  // Step 1
  eventTitle: '',
  eventTagline: '',
  startDate: '',
  endDate: '',
  timeStart: '',
  timeEnd: '',
  venueName: '',
  venueAddress: '',
  organizer: '',
  eventDescription: '',
  countdownEnabled: false,
  countdownTargetDate: '',

  // Step 2
  highlights: [],
  ctaButtons: [],

  // Step 3
  sections: [],
  zones: [],

  // Step 4
  speakers: [],
  themes: [],
  partners: [],

  // Step 5
  exhibitorInterviews: [],
  mediaGallery: [],
  contactInfo: {
    phone: [],
    email: '',
    address: ''
  },
  internationalContacts: [],
  socialLinks: {
    facebook: '',
    linkedin: '',
    instagram: ''
  },
  tags: [],
  published: false,
  lastModified: '',

  // Step 6
  resume: []
};

export const FormProvider = ({ children }: { children: ReactNode }) => {
  // Initialize from localStorage synchronously so values are present on first render
  const [data, setData] = useState<FormStore>(() => {
    try {
      const saved = localStorage.getItem("eventFormDraft");
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

  // Update a specific field
  const updateField = (key: keyof FormStore, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  // Add item to array fields
  const addArrayItem = (
    key: 
      'highlights' | 
      'ctaButtons' | 
      'sections' | 
      'zones' | 
      'speakers' | 
      'themes' | 
      'partners' | 
      'exhibitorInterviews' | 
      'mediaGallery' | 
      'internationalContacts' | 
      'tags' |
      'resume', 
    item: any
  ) => {
    setData(prev => ({ 
      ...prev, 
      [key]: [...prev[key], item] 
    }));
  };

  // Remove item from array fields
  const removeArrayItem = (
    key: 
      'highlights' | 
      'ctaButtons' | 
      'sections' | 
      'zones' | 
      'speakers' | 
      'themes' | 
      'partners' | 
      'exhibitorInterviews' | 
      'mediaGallery' | 
      'internationalContacts' | 
      'tags' |
      'resume', 
    index: number
  ) => {
    setData(prev => ({ 
      ...prev, 
      [key]: prev[key].filter((_, i) => i !== index) 
    }));
  };

  // Update specific field in array item
  const updateArrayItem = (
    key: 
      'highlights' | 
      'ctaButtons' | 
      'sections' | 
      'zones' | 
      'speakers' | 
      'themes' | 
      'partners' | 
      'exhibitorInterviews' | 
      'mediaGallery' | 
      'internationalContacts' |
      'resume',
    index: number,
    field: string,
    value: any
  ) => {
    setData(prev => {
      const newArray = [...prev[key]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [key]: newArray };
    });
  };

  // Persist form data to localStorage whenever data changes
  useEffect(() => {
    try {
      const payload = JSON.stringify({ formData: data });
      localStorage.setItem("eventFormDraft", payload);
    } catch (e) {
      console.error("Failed to save draft to localStorage", e);
    }
  }, [data]);

  // REMOVE THIS - it causes infinite logging
  // console.log("Form Data:", data);

  return (
    <FormContext.Provider value={{ 
      data, 
      setData, 
      updateField, 
      addArrayItem, 
      removeArrayItem,
      updateArrayItem 
    }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useForm must be used within FormProvider");
  return ctx;
};