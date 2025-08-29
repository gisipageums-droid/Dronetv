import React, { useState } from 'react';
import { StepProps } from '../../types/form';
import { Building2, User, Phone, Globe, Edit, X } from 'lucide-react';
import { FormInput, Select } from '../FormInput';
import { countries, indianStates } from '../../data/countries';
import { FormStep } from '../FormStep';

export default function Step1CompanyCategory({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isValid,
}: StepProps) {
  const categoryOptions = [
    { value: 'Drone', description: 'UAV manufacturing, services, and training' },
    { value: 'AI', description: 'Artificial intelligence solutions and products' },
    { value: 'GIS', description: 'Geographic Information Systems and GNSS/GPS/DGPS' },
  ];

  const handleCategoryChange = (selected: string[]) => {
    updateFormData({ companyCategory: selected });
  };



  const [customFields, setCustomFields] = useState<Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>>([])
  const [showAddFieldModal, setShowAddFieldModal] = useState(false)
  const [newFieldLabel, setNewFieldLabel] = useState('')
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('')
  const [newFieldRequired, setNewFieldRequired] = useState(false)

  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false)


  // State for editing company information
  const [editingCompanyData, setEditingCompanyData] = useState({
    companyName: '',
    yearEstablished: '',
    websiteUrl: '',
    promoCode: ''
  })
  const [editingCompanyLabels, setEditingCompanyLabels] = useState({
    companyName: '',
    yearEstablished: '',
    websiteUrl: '',
    promoCode: ''
  })
  const [editingCompanyPlaceholders, setEditingCompanyPlaceholders] = useState({
    companyName: '',
    yearEstablished: '',
    websiteUrl: '',
    promoCode: ''
  })

  // Load placeholders and labels from localStorage on component mount
  React.useEffect(() => {
    // Load company placeholders
    const savedPlaceholders = localStorage.getItem('companyPlaceholders');
    if (savedPlaceholders) {
      try {
        const parsed = JSON.parse(savedPlaceholders);
        setEditingCompanyPlaceholders(parsed);
      } catch (error) {
        console.error('Error parsing saved placeholders:', error);
      }
    }

    // Load company labels
    const savedCompanyLabels = localStorage.getItem('companyLabels');
    if (savedCompanyLabels) {
      try {
        const parsed = JSON.parse(savedCompanyLabels);
        setCompanyFieldLabels(parsed);
      } catch (error) {
        console.error('Error parsing saved company labels:', error);
      }
    }

    // Load legal placeholders
    const savedLegalPlaceholders = localStorage.getItem('legalPlaceholders');
    if (savedLegalPlaceholders) {
      try {
        const parsed = JSON.parse(savedLegalPlaceholders);
        setEditingLegalPlaceholders(parsed);
      } catch (error) {
        console.error('Error parsing saved legal placeholders:', error);
      }
    }

    // Load legal labels
    const savedLegalLabels = localStorage.getItem('legalLabels');
    if (savedLegalLabels) {
      try {
        const parsed = JSON.parse(savedLegalLabels);
        setEditingLegalLabels(parsed);
      } catch (error) {
        console.error('Error parsing saved legal labels:', error);
      }
    }

    // Load director placeholders
    const savedDirectorPlaceholders = localStorage.getItem('directorPlaceholders');
    if (savedDirectorPlaceholders) {
      try {
        const parsed = JSON.parse(savedDirectorPlaceholders);
        setEditingDirectorPlaceholders(parsed);
      } catch (error) {
        console.error('Error parsing saved director placeholders:', error);
      }
    }

    // Load director labels
    const savedDirectorLabels = localStorage.getItem('directorLabels');
    if (savedDirectorLabels) {
      try {
        const parsed = JSON.parse(savedDirectorLabels);
        setEditingDirectorLabels(parsed);
      } catch (error) {
        console.error('Error parsing saved director labels:', error);
      }
    }

    // Load alt contact placeholders
    const savedAltContactPlaceholders = localStorage.getItem('altContactPlaceholders');
    if (savedAltContactPlaceholders) {
      try {
        const parsed = JSON.parse(savedAltContactPlaceholders);
        setEditingAltContactPlaceholders(parsed);
      } catch (error) {
        console.error('Error parsing saved alt contact placeholders:', error);
      }
    }

    // Load alt contact labels
    const savedAltContactLabels = localStorage.getItem('altContactLabels');
    if (savedAltContactLabels) {
      try {
        const parsed = JSON.parse(savedAltContactLabels);
        setEditingAltContactLabels(parsed);
      } catch (error) {
        console.error('Error parsing saved alt contact labels:', error);
      }
    }

    // Load address placeholders
    const savedAddressPlaceholders = localStorage.getItem('addressPlaceholders');
    if (savedAddressPlaceholders) {
      try {
        const parsed = JSON.parse(savedAddressPlaceholders);
        setEditingAddressPlaceholders(parsed);
      } catch (error) {
        console.error('Error parsing saved address placeholders:', error);
      }
    }

    // Load address labels
    const savedAddressLabels = localStorage.getItem('addressLabels');
    if (savedAddressLabels) {
      try {
        const parsed = JSON.parse(savedAddressLabels);
        setEditingAddressLabels(parsed);
      } catch (error) {
        console.error('Error parsing saved address labels:', error);
      }
    }

    // Load social media placeholders
    const savedSocialMediaPlaceholders = localStorage.getItem('socialMediaPlaceholders');
    if (savedSocialMediaPlaceholders) {
      try {
        const parsed = JSON.parse(savedSocialMediaPlaceholders);
        setEditingSocialMediaPlaceholders(parsed);
      } catch (error) {
        console.error('Error parsing saved social media placeholders:', error);
      }
    }

    // Load social media labels
    const savedSocialMediaLabels = localStorage.getItem('socialMediaLabels');
    if (savedSocialMediaLabels) {
      try {
        const parsed = JSON.parse(savedSocialMediaLabels);
        setEditingSocialMediaLabels(parsed);
      } catch (error) {
        console.error('Error parsing saved social media labels:', error);
      }
    }
  }, []);

  // State for editable companyNames
  const [companyFieldLabels, setCompanyFieldLabels] = useState({
    companyName: 'Company Name',
    yearEstablished: 'Date of Incorporation',
    websiteUrl: 'Website URL',
    promoCode: 'Promotional Code'
  })

  const [legalCustomFields, setLegalCustomFields] = useState<Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>>([])
  const [showLegalModal, setShowLegalModal] = useState(false)
  const [newLegalFieldLabel, setNewLegalFieldLabel] = useState('')
  const [newLegalFieldPlaceholder, setNewLegalFieldPlaceholder] = useState('')
  const [newLegalFieldRequired, setNewLegalFieldRequired] = useState(false)

  const [directorCustomFields, setDirectorCustomFields] = useState<Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>>([])
  const [showDirectorModal, setShowDirectorModal] = useState(false)
  const [newDirectorFieldLabel, setNewDirectorFieldLabel] = useState('')
  const [newDirectorFieldPlaceholder, setNewDirectorFieldPlaceholder] = useState('')
  const [newDirectorFieldRequired, setNewDirectorFieldRequired] = useState(false)

  const [altContactCustomFields, setAltContactCustomFields] = useState<Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>>([])
  const [showAltContactModal, setShowAltContactModal] = useState(false)
  const [newAltContactFieldLabel, setNewAltContactFieldLabel] = useState('')
  const [newAltContactFieldPlaceholder, setNewAltContactFieldPlaceholder] = useState('')
  const [newAltContactFieldRequired, setNewAltContactFieldRequired] = useState(false)

  const [addressCustomFields, setAddressCustomFields] = useState<Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>>([])
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [newAddressFieldLabel, setNewAddressFieldLabel] = useState('')
  const [newAddressFieldPlaceholder, setNewAddressFieldPlaceholder] = useState('')
  const [newAddressFieldRequired, setNewAddressFieldRequired] = useState(false)

  const [socialMediaCustomFields, setSocialMediaCustomFields] = useState<Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>>([])
  const [showSocialMediaModal, setShowSocialMediaModal] = useState(false)
  const [newSocialMediaFieldLabel, setNewSocialMediaFieldLabel] = useState('')
  const [newSocialMediaFieldPlaceholder, setNewSocialMediaFieldPlaceholder] = useState('')
  const [newSocialMediaFieldRequired, setNewSocialMediaFieldRequired] = useState(false)

  // State for editing legal information
  const [showEditLegalModal, setShowEditLegalModal] = useState(false)
  const [editingLegalData, setEditingLegalData] = useState({
    legalName: '',
    gstin: '',
    operatingHours: '',
    cin: '',
    udyam: '',
    pan: ''
  })
  const [editingLegalLabels, setEditingLegalLabels] = useState({
    legalName: 'Legal Company Name',
    gstin: 'GSTIN',
    operatingHours: 'Operating Hours',
    cin: 'CIN',
    udyam: 'UDYAM',
    pan: 'PAN'
  })
  const [editingLegalPlaceholders, setEditingLegalPlaceholders] = useState({
    legalName: 'If different from brand name',
    gstin: 'GST number',
    operatingHours: 'Mon-Sat 10:00-18:00',
    cin: 'Corporate Identity Number',
    udyam: 'UDYAM Registration Number',
    pan: 'PAN Number'
  })

  // State for editing director information
  const [showEditDirectorModal, setShowEditDirectorModal] = useState(false)
  const [editingDirectorData, setEditingDirectorData] = useState({
    directorName: '',
    directorPhone: '',
    directorEmail: ''
  })
  const [editingDirectorLabels, setEditingDirectorLabels] = useState({
    directorName: 'Director Name',
    directorPhone: 'Director Phone',
    directorEmail: 'Director Email'
  })
  const [editingDirectorPlaceholders, setEditingDirectorPlaceholders] = useState({
    directorName: 'Full name',
    directorPhone: '+91XXXXXXXXXX',
    directorEmail: 'director@company.com'
  })

  // State for editing alternative contact information
  const [showEditAltContactModal, setShowEditAltContactModal] = useState(false)
  const [editingAltContactData, setEditingAltContactData] = useState({
    altContactName: '',
    altContactPhone: '',
    altContactEmail: ''
  })
  const [editingAltContactLabels, setEditingAltContactLabels] = useState({
    altContactName: 'Contact Person Name',
    altContactPhone: 'Contact Phone',
    altContactEmail: 'Contact Email'
  })
  const [editingAltContactPlaceholders, setEditingAltContactPlaceholders] = useState({
    altContactName: 'Full name',
    altContactPhone: '+91XXXXXXXXXX',
    altContactEmail: 'contact@company.com'
  })

  // State for editing address information
  const [showEditAddressModal, setShowEditAddressModal] = useState(false)
  const [editingAddressData, setEditingAddressData] = useState({
    officeAddress: '',
    country: '',
    state: '',
    city: '',
    postalCode: ''
  })
  const [editingAddressLabels, setEditingAddressLabels] = useState({
    officeAddress: 'Office Address',
    country: 'Country',
    state: 'State',
    city: 'City',
    postalCode: 'Postal Code'
  })
  const [editingAddressPlaceholders, setEditingAddressPlaceholders] = useState({
    officeAddress: 'Complete office address',
    country: 'Select Country',
    state: 'Select State',
    city: 'City',
    postalCode: 'PIN Code'
  })

  // State for editing social media information
  const [showEditSocialMediaModal, setShowEditSocialMediaModal] = useState(false)
  const [editingSocialMediaData, setEditingSocialMediaData] = useState({
    linkedin: '',
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    supportEmail: '',
    supportContactNumber: '',
    whatsappNumber: ''
  })
  const [editingSocialMediaLabels, setEditingSocialMediaLabels] = useState({
    linkedin: 'LinkedIn Profile',
    facebook: 'Facebook Page',
    instagram: 'Instagram Profile',
    twitter: 'Twitter/X Profile',
    youtube: 'YouTube Channel',
    supportEmail: 'Support Email',
    supportContactNumber: 'Support Contact Number',
    whatsappNumber: 'WhatsApp Number'
  })
  const [editingSocialMediaPlaceholders, setEditingSocialMediaPlaceholders] = useState({
    linkedin: 'https://linkedin.com/company/yourcompany',
    facebook: 'https://facebook.com/yourcompany',
    instagram: 'https://instagram.com/yourcompany',
    twitter: 'https://twitter.com/yourcompany',
    youtube: 'https://youtube.com/@yourcompany',
    supportEmail: 'support@company.com',
    supportContactNumber: '+919876543210',
    whatsappNumber: '+91XXXXXXXXXX'
  })

  // State for managing hidden default fields
  const [hiddenCompanyFields, setHiddenCompanyFields] = useState<Set<string>>(new Set())
  const [hiddenLegalFields, setHiddenLegalFields] = useState<Set<string>>(new Set())
  const [hiddenDirectorFields, setHiddenDirectorFields] = useState<Set<string>>(new Set())
  const [hiddenAltContactFields, setHiddenAltContactFields] = useState<Set<string>>(new Set())
  const [hiddenAddressFields, setHiddenAddressFields] = useState<Set<string>>(new Set())
  const [hiddenSocialMediaFields, setHiddenSocialMediaFields] = useState<Set<string>>(new Set())

  const addCustomField = () => {
    if (newFieldLabel.trim() && newFieldPlaceholder.trim()) {
      const newField = {
        id: Date.now().toString(),
        label: newFieldLabel.trim(),
        placeholder: newFieldPlaceholder.trim(),
        value: '',
        required: newFieldRequired
      };
      setCustomFields([...customFields, newField]);
      setNewFieldLabel('');
      setNewFieldPlaceholder('');
      setNewFieldRequired(false);
      setShowAddFieldModal(false);
    }
  };



  const updateCustomFieldValue = (id: string, value: string) => {
    setCustomFields(customFields.map(field =>
      field.id === id ? { ...field, value } : field
    ));
  };







  const openEditCompanyModal = () => {
    setEditingCompanyData({
      companyName: formData.companyName,
      yearEstablished: formData.yearEstablished,
      websiteUrl: formData.websiteUrl,
      promoCode: formData.promoCode
    });
    // Load saved labels from localStorage instead of resetting to defaults
    const savedCompanyLabels = localStorage.getItem('companyLabels');
    if (savedCompanyLabels) {
      try {
        const parsed = JSON.parse(savedCompanyLabels);
        setEditingCompanyLabels(parsed);
      } catch (error) {
        console.error('Error parsing saved company labels:', error);
        // Fallback to defaults if parsing fails
        setEditingCompanyLabels({
          companyName: companyFieldLabels.companyName,
          yearEstablished: companyFieldLabels.yearEstablished,
          websiteUrl: companyFieldLabels.websiteUrl,
          promoCode: companyFieldLabels.promoCode
        });
      }
    } else {
      // Only set defaults if no saved labels exist
      setEditingCompanyLabels({
        companyName: companyFieldLabels.companyName,
        yearEstablished: companyFieldLabels.yearEstablished,
        websiteUrl: companyFieldLabels.websiteUrl,
        promoCode: companyFieldLabels.promoCode
      });
    }
    // Load saved placeholders from localStorage instead of resetting to defaults
    const savedPlaceholders = localStorage.getItem('companyPlaceholders');
    if (savedPlaceholders) {
      try {
        const parsed = JSON.parse(savedPlaceholders);
        setEditingCompanyPlaceholders(parsed);
      } catch (error) {
        console.error('Error parsing saved placeholders:', error);
        // Fallback to defaults if parsing fails
        setEditingCompanyPlaceholders({
          companyName: 'Enter your company name',
          yearEstablished: 'dd-mm-yyyy',
          websiteUrl: 'https://www.yourcompany.com',
          promoCode: 'Enter promotional code'
        });
      }
    } else {
      // Only set defaults if no saved placeholders exist
      setEditingCompanyPlaceholders({
        companyName: 'Enter your company name',
        yearEstablished: 'dd-mm-yyyy',
        websiteUrl: 'https://www.yourcompany.com',
        promoCode: 'Enter promotional code'
      });
    }
    setShowEditCompanyModal(true);
  };

  const saveCompanyChanges = () => {
    // Update form data
    updateFormData({
      companyName: editingCompanyData.companyName,
      yearEstablished: editingCompanyData.yearEstablished,
      websiteUrl: editingCompanyData.websiteUrl,
      promoCode: editingCompanyData.promoCode
    });

    // Update field labels
    setCompanyFieldLabels({
      companyName: editingCompanyLabels.companyName,
      yearEstablished: editingCompanyLabels.yearEstablished,
      websiteUrl: editingCompanyLabels.websiteUrl,
      promoCode: editingCompanyLabels.promoCode
    });

    // Store company labels in localStorage
    localStorage.setItem('companyLabels', JSON.stringify(editingCompanyLabels));
    // Store placeholders in localStorage for persistence
    localStorage.setItem('companyPlaceholders', JSON.stringify(editingCompanyPlaceholders));

    setShowEditCompanyModal(false);
  };

  const openEditLegalModal = () => {
    setEditingLegalData({
      legalName: formData.legalName || '',
      gstin: formData.gstin || '',
      operatingHours: formData.operatingHours || '',
      cin: formData.socialLinks?.cin || '',
      udyam: formData.socialLinks?.udyam || '',
      pan: formData.socialLinks?.pan || ''
    });
    // Load saved labels from localStorage instead of resetting to defaults
    const savedLegalLabels = localStorage.getItem('legalLabels');
    if (savedLegalLabels) {
      try {
        const parsed = JSON.parse(savedLegalLabels);
        setEditingLegalLabels(parsed);
      } catch (error) {
        console.error('Error parsing saved legal labels:', error);
        // Fallback to defaults if parsing fails
        setEditingLegalLabels({
          legalName: 'Legal Company Name',
          gstin: 'GSTIN',
          operatingHours: 'Operating Hours',
          cin: 'CIN',
          udyam: 'UDYAM',
          pan: 'PAN'
        });
      }
    } else {
      // Only set defaults if no saved labels exist
      setEditingLegalLabels({
        legalName: 'Legal Company Name',
        gstin: 'GSTIN',
        operatingHours: 'Operating Hours',
        cin: 'CIN',
        udyam: 'UDYAM',
        pan: 'PAN'
      });
    }
    // Load saved placeholders from localStorage instead of resetting to defaults
    const savedLegalPlaceholders = localStorage.getItem('legalPlaceholders');
    if (savedLegalPlaceholders) {
      try {
        const parsed = JSON.parse(savedLegalPlaceholders);
        setEditingLegalPlaceholders(parsed);
      } catch (error) {
        console.error('Error parsing saved legal placeholders:', error);
        // Fallback to defaults if parsing fails
        setEditingLegalPlaceholders({
          legalName: 'If different from brand name',
          gstin: 'GST number',
          operatingHours: 'Mon-Sat 10:00-18:00',
          cin: 'Corporate Identity Number',
          udyam: 'UDYAM Registration Number',
          pan: 'PAN Number'
        });
      }
    } else {
      // Only set defaults if no saved placeholders exist
      setEditingLegalPlaceholders({
        legalName: 'If different from brand name',
        gstin: 'GST number',
        operatingHours: 'Mon-Sat 10:00-18:00',
        cin: 'Corporate Identity Number',
        udyam: 'UDYAM Registration Number',
        pan: 'PAN Number'
      });
    }

    const savedDirectorPlaceholders = localStorage.getItem('directorPlaceholders');
    if (savedDirectorPlaceholders) {
      try {
        const parsed = JSON.parse(savedDirectorPlaceholders);
        setEditingDirectorPlaceholders(parsed);
      } catch (error) {
        console.error('Error parsing saved director placeholders:', error);
        // Fallback to defaults if parsing fails
        setEditingDirectorPlaceholders({
          directorName: 'Full name',
          directorPhone: '+91XXXXXXXXXX',
          directorEmail: 'director@company.com'
        });
      }
    } else {
      // Only set defaults if no saved placeholders exist
      setEditingDirectorPlaceholders({
        directorName: 'Full name',
        directorPhone: '+91XXXXXXXXXX',
        directorEmail: 'director@company.com'
      });
    }
    setShowEditLegalModal(true);
  };

  const saveLegalChanges = () => {
    updateFormData({
      legalName: editingLegalData.legalName,
      gstin: editingLegalData.gstin,
      operatingHours: editingLegalData.operatingHours,
      socialLinks: {
        ...formData.socialLinks,
        cin: editingLegalData.cin,
        udyam: editingLegalData.udyam,
        pan: editingLegalData.pan
      }
    });
    setEditingLegalLabels({
      legalName: editingLegalLabels.legalName,
      gstin: editingLegalLabels.gstin,
      operatingHours: editingLegalLabels.operatingHours,
      cin: editingLegalLabels.cin,
      udyam: editingLegalLabels.udyam,
      pan: editingLegalLabels.pan
    });
    // Store legal labels in localStorage
    localStorage.setItem('legalLabels', JSON.stringify(editingLegalLabels));
    // Store legal placeholders in localStorage
    localStorage.setItem('legalPlaceholders', JSON.stringify(editingLegalPlaceholders));
    setShowEditLegalModal(false);
  };

  const openEditDirectorModal = () => {
    setEditingDirectorData({
      directorName: formData.directorName || '',
      directorPhone: formData.directorPhone || '',
      directorEmail: formData.directorEmail || ''
    });
    // Load saved labels from localStorage instead of resetting to defaults
    const savedDirectorLabels = localStorage.getItem('directorLabels');
    if (savedDirectorLabels) {
      try {
        const parsed = JSON.parse(savedDirectorLabels);
        setEditingDirectorLabels(parsed);
      } catch (error) {
        console.error('Error parsing saved director labels:', error);
        // Fallback to defaults if parsing fails
        setEditingDirectorLabels({
          directorName: 'Director Name',
          directorPhone: 'Director Phone',
          directorEmail: 'Director Email'
        });
      }
    } else {
      // Only set defaults if no saved labels exist
      setEditingDirectorLabels({
        directorName: 'Director Name',
        directorPhone: 'Director Phone',
        directorEmail: 'Director Email'
      });
    }
    // Load saved placeholders from localStorage instead of resetting to defaults
    const savedDirectorPlaceholders = localStorage.getItem('directorPlaceholders');
    if (savedDirectorPlaceholders) {
      try {
        const parsed = JSON.parse(savedDirectorPlaceholders);
        setEditingDirectorPlaceholders(parsed);
      } catch (error) {
        console.error('Error parsing saved director placeholders:', error);
        // Fallback to defaults if parsing fails
        setEditingDirectorPlaceholders({
          directorName: 'Full name',
          directorPhone: '+91XXXXXXXXXX',
          directorEmail: 'director@company.com'
        });
      }
    } else {
      // Only set defaults if no saved placeholders exist
      setEditingDirectorPlaceholders({
        directorName: 'Full name',
        directorPhone: '+91XXXXXXXXXX',
        directorEmail: 'director@company.com'
      });
    }
    setShowEditDirectorModal(true);
  };

  const saveDirectorChanges = () => {
    updateFormData({
      directorName: editingDirectorData.directorName,
      directorPhone: editingDirectorData.directorPhone,
      directorEmail: editingDirectorData.directorEmail
    });
    setEditingDirectorLabels({
      directorName: editingDirectorLabels.directorName,
      directorPhone: editingDirectorLabels.directorPhone,
      directorEmail: editingDirectorLabels.directorEmail
    });
    // Store director labels in localStorage
    localStorage.setItem('directorLabels', JSON.stringify(editingDirectorLabels));
    // Store director placeholders in localStorage
    localStorage.setItem('directorPlaceholders', JSON.stringify(editingDirectorPlaceholders));
    setShowEditDirectorModal(false);
  };

  const openEditAltContactModal = () => {
    setEditingAltContactData({
      altContactName: formData.altContactName || '',
      altContactPhone: formData.altContactPhone || '',
      altContactEmail: formData.altContactEmail || ''
    });
    // Load saved labels from localStorage instead of resetting to defaults
    const savedAltContactLabels = localStorage.getItem('altContactLabels');
    if (savedAltContactLabels) {
      try {
        const parsed = JSON.parse(savedAltContactLabels);
        setEditingAltContactLabels(parsed);
      } catch (error) {
        console.error('Error parsing saved alt contact labels:', error);
        // Fallback to defaults if parsing fails
        setEditingAltContactLabels({
          altContactName: 'Contact Person Name',
          altContactPhone: 'Contact Phone',
          altContactEmail: 'Contact Email'
        });
      }
    } else {
      // Only set defaults if no saved labels exist
      setEditingAltContactLabels({
        altContactName: 'Contact Person Name',
        altContactPhone: 'Contact Phone',
        altContactEmail: 'Contact Email'
      });
    }
    // Load saved placeholders from localStorage instead of resetting to defaults
    const savedAltContactPlaceholders = localStorage.getItem('altContactPlaceholders');
    if (savedAltContactPlaceholders) {
      try {
        const parsed = JSON.parse(savedAltContactPlaceholders);
        setEditingAltContactPlaceholders(parsed);
      } catch (error) {
        console.error('Error parsing saved alt contact placeholders:', error);
        // Fallback to defaults if parsing fails
        setEditingAltContactPlaceholders({
          altContactName: 'Full name',
          altContactPhone: '+91XXXXXXXXXX',
          altContactEmail: 'contact@company.com'
        });
      }
    } else {
      // Only set defaults if no saved placeholders exist
      setEditingAltContactPlaceholders({
        altContactName: 'Full name',
        altContactPhone: '+91XXXXXXXXXX',
        altContactEmail: 'contact@company.com'
      });
    }

    const savedSocialMediaPlaceholders = localStorage.getItem('socialMediaPlaceholders');
    if (savedSocialMediaPlaceholders) {
      try {
        const parsed = JSON.parse(savedSocialMediaPlaceholders);
        setEditingSocialMediaPlaceholders(parsed);
      } catch (error) {
        console.error('Error parsing saved social media placeholders:', error);
        // Fallback to defaults if parsing fails
        setEditingSocialMediaPlaceholders({
          linkedin: 'https://linkedin.com/company/yourcompany',
          facebook: 'https://facebook.com/yourcompany',
          instagram: 'https://instagram.com/yourcompany',
          twitter: 'https://twitter.com/yourcompany',
          youtube: 'https://youtube.com/@yourcompany',
          supportEmail: 'support@company.com',
          supportContactNumber: '+919876543210',
          whatsappNumber: '+91XXXXXXXXXX'
        });
      }
    } else {
      // Only set defaults if no saved placeholders exist
      setEditingSocialMediaPlaceholders({
        linkedin: 'https://linkedin.com/company/yourcompany',
        facebook: 'https://facebook.com/yourcompany',
        instagram: 'https://instagram.com/yourcompany',
        twitter: 'https://twitter.com/yourcompany',
        youtube: 'https://youtube.com/@yourcompany',
        supportEmail: 'support@company.com',
        supportContactNumber: '+919876543210',
        whatsappNumber: '+91XXXXXXXXXX'
      });
    }

    const savedAddressPlaceholders = localStorage.getItem('addressPlaceholders');
    if (savedAddressPlaceholders) {
      try {
        const parsed = JSON.parse(savedAddressPlaceholders);
        setEditingAddressPlaceholders(parsed);
      } catch (error) {
        console.error('Error parsing saved address placeholders:', error);
        // Fallback to defaults if parsing fails
        setEditingAddressPlaceholders({
          officeAddress: 'Complete office address',
          country: 'Select Country',
          state: 'Select State',
          city: 'City',
          postalCode: 'PIN Code'
        });
      }
    } else {
      // Only set defaults if no saved placeholders exist
      setEditingAddressPlaceholders({
        officeAddress: 'Complete office address',
        country: 'Select Country',
        state: 'Select State',
        city: 'City',
        postalCode: 'PIN Code'
      });
    }
    setShowEditAltContactModal(true);
  };

  const saveAltContactChanges = () => {
    updateFormData({
      altContactName: editingAltContactData.altContactName,
      altContactPhone: editingAltContactData.altContactPhone,
      altContactEmail: editingAltContactData.altContactEmail
    });
    setEditingAltContactLabels({
      altContactName: editingAltContactLabels.altContactName,
      altContactPhone: editingAltContactLabels.altContactPhone,
      altContactEmail: editingAltContactLabels.altContactEmail
    });
    // Store alt contact labels in localStorage
    localStorage.setItem('altContactLabels', JSON.stringify(editingAltContactLabels));
    // Store alt contact placeholders in localStorage
    localStorage.setItem('altContactPlaceholders', JSON.stringify(editingAltContactPlaceholders));
    setShowEditAltContactModal(false);
  };

  const openEditAddressModal = () => {
    setEditingAddressData({
      officeAddress: formData.officeAddress || '',
      country: formData.country || '',
      state: formData.state || '',
      city: formData.city || '',
      postalCode: formData.postalCode || ''
    });
    // Load saved labels from localStorage instead of resetting to defaults
    const savedAddressLabels = localStorage.getItem('addressLabels');
    if (savedAddressLabels) {
      try {
        const parsed = JSON.parse(savedAddressLabels);
        setEditingAddressLabels(parsed);
      } catch (error) {
        console.error('Error parsing saved address labels:', error);
        // Fallback to defaults if parsing fails
        setEditingAddressLabels({
          officeAddress: 'Office Address',
          country: 'Country',
          state: 'State',
          city: 'City',
          postalCode: 'Postal Code'
        });
      }
    } else {
      // Only set defaults if no saved labels exist
      setEditingAddressLabels({
        officeAddress: 'Office Address',
        country: 'Country',
        state: 'State',
        city: 'City',
        postalCode: 'Postal Code'
      });
    }
    // Load saved placeholders from localStorage instead of resetting to defaults
    const savedAddressPlaceholders = localStorage.getItem('addressPlaceholders');
    if (savedAddressPlaceholders) {
      try {
        const parsed = JSON.parse(savedAddressPlaceholders);
        setEditingAddressPlaceholders(parsed);
      } catch (error) {
        console.error('Error parsing saved address placeholders:', error);
        // Fallback to defaults if parsing fails
        setEditingAddressPlaceholders({
          officeAddress: 'Complete office address',
          country: 'Select Country',
          state: 'Select State',
          city: 'City',
          postalCode: 'PIN Code'
        });
      }
    } else {
      // Only set defaults if no saved placeholders exist
      setEditingAddressPlaceholders({
        officeAddress: 'Complete office address',
        country: 'Select Country',
        state: 'Select State',
        city: 'City',
        postalCode: 'PIN Code'
      });
    }
    setShowEditAddressModal(true);
  };

  const saveAddressChanges = () => {
    updateFormData({
      officeAddress: editingAddressData.officeAddress,
      country: editingAddressData.country,
      state: editingAddressData.state,
      city: editingAddressData.city,
      postalCode: editingAddressData.postalCode
    });
    setEditingAddressLabels({
      officeAddress: editingAddressLabels.officeAddress,
      country: editingAddressLabels.country,
      state: editingAddressLabels.state,
      city: editingAddressLabels.city,
      postalCode: editingAddressLabels.postalCode
    });
    // Store address labels in localStorage
    localStorage.setItem('addressLabels', JSON.stringify(editingAddressLabels));
    // Store address placeholders in localStorage
    localStorage.setItem('addressPlaceholders', JSON.stringify(editingAddressPlaceholders));
    setShowEditAddressModal(false);
  };

  const openEditSocialMediaModal = () => {
    setEditingSocialMediaData({
      linkedin: formData.socialLinks?.linkedin || '',
      facebook: formData.socialLinks?.facebook || '',
      instagram: formData.socialLinks?.instagram || '',
      twitter: formData.socialLinks?.twitter || '',
      youtube: formData.socialLinks?.youtube || '',
      supportEmail: formData.supportEmail || '',
      supportContactNumber: formData.supportContactNumber || '',
      whatsappNumber: formData.whatsappNumber || ''
    });
    // Load saved labels from localStorage instead of resetting to defaults
    const savedSocialMediaLabels = localStorage.getItem('socialMediaLabels');
    if (savedSocialMediaLabels) {
      try {
        const parsed = JSON.parse(savedSocialMediaLabels);
        setEditingSocialMediaLabels(parsed);
      } catch (error) {
        console.error('Error parsing saved social media labels:', error);
        // Fallback to defaults if parsing fails
        setEditingSocialMediaLabels({
          linkedin: 'LinkedIn Profile',
          facebook: 'Facebook Page',
          instagram: 'Instagram Profile',
          twitter: 'Twitter/X Profile',
          youtube: 'YouTube Channel',
          supportEmail: 'Support Email',
          supportContactNumber: 'Support Contact Number',
          whatsappNumber: 'WhatsApp Number'
        });
      }
    } else {
      // Only set defaults if no saved labels exist
      setEditingSocialMediaLabels({
        linkedin: 'LinkedIn Profile',
        facebook: 'Facebook Page',
        instagram: 'Instagram Profile',
        twitter: 'Twitter/X Profile',
        youtube: 'YouTube Channel',
        supportEmail: 'Support Email',
        supportContactNumber: 'Support Contact Number',
        whatsappNumber: 'WhatsApp Number'
      });
    }
    // Load saved placeholders from localStorage instead of resetting to defaults
    const savedSocialMediaPlaceholders = localStorage.getItem('socialMediaPlaceholders');
    if (savedSocialMediaPlaceholders) {
      try {
        const parsed = JSON.parse(savedSocialMediaPlaceholders);
        setEditingSocialMediaPlaceholders(parsed);
      } catch (error) {
        console.error('Error parsing saved social media placeholders:', error);
        // Fallback to defaults if parsing fails
        setEditingSocialMediaPlaceholders({
          linkedin: 'https://linkedin.com/company/yourcompany',
          facebook: 'https://facebook.com/yourcompany',
          instagram: 'https://instagram.com/yourcompany',
          twitter: 'https://twitter.com/yourcompany',
          youtube: 'https://youtube.com/@yourcompany',
          supportEmail: 'support@company.com',
          supportContactNumber: '+919876543210',
          whatsappNumber: '+91XXXXXXXXXX'
        });
      }
    } else {
      // Only set defaults if no saved placeholders exist
      setEditingSocialMediaPlaceholders({
        linkedin: 'https://linkedin.com/company/yourcompany',
        facebook: 'https://facebook.com/yourcompany',
        instagram: 'https://instagram.com/yourcompany',
        twitter: 'https://twitter.com/yourcompany',
        youtube: 'https://youtube.com/@yourcompany',
        supportEmail: 'support@company.com',
        supportContactNumber: '+919876543210',
        whatsappNumber: '+91XXXXXXXXXX'
      });
    }
    setShowEditSocialMediaModal(true);
  };

  const saveSocialMediaChanges = () => {
    updateFormData({
      socialLinks: {
        ...formData.socialLinks,
        linkedin: editingSocialMediaData.linkedin,
        facebook: editingSocialMediaData.facebook,
        instagram: editingSocialMediaData.instagram,
        twitter: editingSocialMediaData.twitter,
        youtube: editingSocialMediaData.youtube
      },
      supportEmail: editingSocialMediaData.supportEmail,
      supportContactNumber: editingSocialMediaData.supportContactNumber,
      whatsappNumber: editingSocialMediaData.whatsappNumber
    });
    setEditingSocialMediaLabels({
      linkedin: editingSocialMediaLabels.linkedin,
      facebook: editingSocialMediaLabels.facebook,
      instagram: editingSocialMediaLabels.instagram,
      twitter: editingSocialMediaLabels.twitter,
      youtube: editingSocialMediaLabels.youtube,
      supportEmail: editingSocialMediaLabels.supportEmail,
      supportContactNumber: editingSocialMediaLabels.supportContactNumber,
      whatsappNumber: editingSocialMediaLabels.whatsappNumber
    });
    // Store social media labels in localStorage
    localStorage.setItem('socialMediaLabels', JSON.stringify(editingSocialMediaLabels));
    // Store social media placeholders in localStorage
    localStorage.setItem('socialMediaPlaceholders', JSON.stringify(editingSocialMediaPlaceholders));
    setShowEditSocialMediaModal(false);
  };


  const addLegalCustomField = () => {
    if (newLegalFieldLabel.trim() && newLegalFieldPlaceholder.trim()) {
      const newField = {
        id: Date.now().toString(),
        label: newLegalFieldLabel.trim(),
        placeholder: newLegalFieldPlaceholder.trim(),
        value: '',
        required: newLegalFieldRequired
      };
      setLegalCustomFields([...legalCustomFields, newField]);
      setNewLegalFieldLabel('');
      setNewLegalFieldPlaceholder('');
      setNewLegalFieldRequired(false);
      setShowLegalModal(false);
    }
  };

  const removeLegalCustomField = (id: string) => {
    setLegalCustomFields(legalCustomFields.filter(field => field.id !== id));
  };

  const updateLegalCustomFieldValue = (id: string, value: string) => {
    setLegalCustomFields(legalCustomFields.map(field =>
      field.id === id ? { ...field, value } : field
    ));
  };



  const addDirectorCustomField = () => {
    if (newDirectorFieldLabel.trim() && newDirectorFieldPlaceholder.trim()) {
      const newField = {
        id: Date.now().toString(),
        label: newDirectorFieldLabel.trim(),
        placeholder: newDirectorFieldPlaceholder.trim(),
        value: '',
        required: newDirectorFieldRequired
      };
      setDirectorCustomFields([...directorCustomFields, newField]);
      setNewDirectorFieldLabel('');
      setNewDirectorFieldPlaceholder('');
      setNewDirectorFieldRequired(false);
      setShowDirectorModal(false);
    }
  };

  const removeDirectorCustomField = (id: string) => {
    setDirectorCustomFields(directorCustomFields.filter(field => field.id !== id));
  };

  const updateDirectorCustomFieldValue = (id: string, value: string) => {
    setDirectorCustomFields(directorCustomFields.map(field =>
      field.id === id ? { ...field, value } : field
    ));
  };


  const addAltContactCustomField = () => {
    if (newAltContactFieldLabel.trim() && newAltContactFieldPlaceholder.trim()) {
      const newField = {
        id: Date.now().toString(),
        label: newAltContactFieldLabel.trim(),
        placeholder: newAltContactFieldPlaceholder.trim(),
        value: '',
        required: newAltContactFieldRequired
      };
      setAltContactCustomFields([...altContactCustomFields, newField]);
      setNewAltContactFieldLabel('');
      setNewAltContactFieldPlaceholder('');
      setNewAltContactFieldRequired(false);
      setShowAltContactModal(false);
    }
  };

  const removeAltContactCustomField = (id: string) => {
    setAltContactCustomFields(altContactCustomFields.filter(field => field.id !== id));
  };

  const updateAltContactCustomFieldValue = (id: string, value: string) => {
    setAltContactCustomFields(altContactCustomFields.map(field =>
      field.id === id ? { ...field, value } : field
    ));
  };


  const addAddressCustomField = () => {
    if (newAddressFieldLabel.trim() && newAddressFieldPlaceholder.trim()) {
      const newField = {
        id: Date.now().toString(),
        label: newAddressFieldLabel.trim(),
        placeholder: newAddressFieldPlaceholder.trim(),
        value: '',
        required: newAddressFieldRequired
      };
      setAddressCustomFields([...addressCustomFields, newField]);
      setNewAddressFieldLabel('');
      setNewAddressFieldPlaceholder('');
      setNewAddressFieldRequired(false);
      setShowAddressModal(false);
    }
  };

  const removeAddressCustomField = (id: string) => {
    setAddressCustomFields(addressCustomFields.filter(field => field.id !== id));
  };

  const updateAddressCustomFieldValue = (id: string, value: string) => {
    setAddressCustomFields(addressCustomFields.map(field =>
      field.id === id ? { ...field, value } : field
    ));
  };

  const removeSocialMediaCustomField = (id: string) => {
    setSocialMediaCustomFields(socialMediaCustomFields.filter(field => field.id !== id));
  };

  const updateSocialMediaCustomFieldValue = (id: string, value: string) => {
    setSocialMediaCustomFields(socialMediaCustomFields.map(field =>
      field.id === id ? { ...field, value } : field
    ));
  };

  return (
    <FormStep
      title="Company Information"
      description="Select your company category and provide basic details"
      onNext={onNext}
      onPrev={onPrev}
      isValid={isValid}
      isFirstStep={true}
      currentStep={1}
      totalSteps={7}
    >
      <div className="space-y-6">
        {/* Company Category */}
        <div>
          <h2 className="mb-2 text-lg font-bold text-slate-900">Company Category</h2>
          <p className="mb-4 text-sm text-slate-600">Select your company's main business category (you can select multiple)</p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {categoryOptions.map(({ value, description }) => (
              <label
                key={value}
                className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${formData.companyCategory.includes(value)
                  ? 'border-amber-500 bg-yellow-50 shadow-md'
                  : 'border-amber-300 hover:border-amber-400'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={formData.companyCategory.includes(value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleCategoryChange([...formData.companyCategory, value]);
                    } else {
                      handleCategoryChange(formData.companyCategory.filter(cat => cat !== value));
                    }
                  }}
                  className="sr-only"
                />
                <h3 className={`text-lg font-bold mb-2 ${formData.companyCategory.includes(value) ? 'text-amber-900' : 'text-gray-700'
                  }`}>
                  {value}
                </h3>
                <p className={`text-xs text-center ${formData.companyCategory.includes(value) ? 'text-amber-700' : 'text-gray-500'
                  }`}>
                  {description}
                </p>
              </label>
            ))}
          </div>

          {formData.companyCategory.length === 0 && (
            <div className="py-4 text-center">
              <p className="text-gray-500">Please select at least one category to continue</p>
            </div>
          )}
        </div>


        {/* Company Basic Details */}
        <div>
          <h2 className="mb-2 text-lg font-bold text-slate-900">Company Basic Details</h2>
          <p className="mb-4 text-sm text-slate-600">Tell us about your company's basic information</p>

          <div className="space-y-4">
            {/* Company Information */}
            <CompanyInformation
              setShowAddFieldModal={setShowAddFieldModal}
              openEditCompanyModal={openEditCompanyModal}
              hiddenCompanyFields={hiddenCompanyFields}
              companyFieldLabels={companyFieldLabels}
              editingCompanyPlaceholders={editingCompanyPlaceholders}
              editingCompanyLabels={editingCompanyLabels}
              updateFormData={updateFormData}
              formData={formData}
              setHiddenCompanyFields={setHiddenCompanyFields}
              customFields={customFields}
              updateCustomFieldValue={updateCustomFieldValue}
              showEditCompanyModal={showEditCompanyModal}
              setShowEditCompanyModal={setShowEditCompanyModal}
              setEditingCompanyLabels={setEditingCompanyLabels}
              setEditingCompanyPlaceholders={setEditingCompanyPlaceholders}
              saveCompanyChanges={saveCompanyChanges}
              showAddFieldModal={showAddFieldModal}
              newFieldLabel={newFieldLabel}
              setNewFieldLabel={setNewFieldLabel}
              newFieldPlaceholder={newFieldPlaceholder}
              setNewFieldPlaceholder={setNewFieldPlaceholder}
              newFieldRequired={newFieldRequired}
              setNewFieldRequired={setNewFieldRequired}
              addCustomField={addCustomField}
            />

            {/* Legal Information */}
            <LegalInformation
              setShowLegalModal={setShowLegalModal}
              openEditLegalModal={openEditLegalModal}
              hiddenLegalFields={hiddenLegalFields}
              editingLegalLabels={editingLegalLabels}
              editingLegalPlaceholders={editingLegalPlaceholders}
              updateFormData={updateFormData}
              formData={formData}
              setHiddenLegalFields={setHiddenLegalFields}
              legalCustomFields={legalCustomFields}
              updateLegalCustomFieldValue={updateLegalCustomFieldValue}

              removeLegalCustomField={removeLegalCustomField}
              showLegalModal={showLegalModal}
              newLegalFieldLabel={newLegalFieldLabel}
              setNewLegalFieldLabel={setNewLegalFieldLabel}
              newLegalFieldPlaceholder={newLegalFieldPlaceholder}
              setNewLegalFieldPlaceholder={setNewLegalFieldPlaceholder}
              newLegalFieldRequired={newLegalFieldRequired}
              setNewLegalFieldRequired={setNewLegalFieldRequired}
              addLegalCustomField={addLegalCustomField}
              showEditLegalModal={showEditLegalModal}
              setShowEditLegalModal={setShowEditLegalModal}
              setEditingLegalLabels={setEditingLegalLabels}
              setEditingLegalPlaceholders={setEditingLegalPlaceholders}
              saveLegalChanges={saveLegalChanges}
            />

            {/* Director Information */}
            <DirectorInformation
              setShowDirectorModal={setShowDirectorModal}
              openEditDirectorModal={openEditDirectorModal}
              hiddenDirectorFields={hiddenDirectorFields}
              editingDirectorLabels={editingDirectorLabels}
              editingDirectorPlaceholders={editingDirectorPlaceholders}
              updateFormData={updateFormData}
              formData={formData}
              setHiddenDirectorFields={setHiddenDirectorFields}
              directorCustomFields={directorCustomFields}
              updateDirectorCustomFieldValue={updateDirectorCustomFieldValue}

              removeDirectorCustomField={removeDirectorCustomField}
              showDirectorModal={showDirectorModal}
              newDirectorFieldLabel={newDirectorFieldLabel}
              setNewDirectorFieldLabel={setNewDirectorFieldLabel}
              newDirectorFieldPlaceholder={newDirectorFieldPlaceholder}
              setNewDirectorFieldPlaceholder={setNewDirectorFieldPlaceholder}
              newDirectorFieldRequired={newDirectorFieldRequired}
              setNewDirectorFieldRequired={setNewDirectorFieldRequired}
              addDirectorCustomField={addDirectorCustomField}
              showEditDirectorModal={showEditDirectorModal}
              setShowEditDirectorModal={setShowEditDirectorModal}
              setEditingDirectorLabels={setEditingDirectorLabels}
              setEditingDirectorPlaceholders={setEditingDirectorPlaceholders}
              saveDirectorChanges={saveDirectorChanges}
            />


            {/* Alternative Contact */}
            <AlternativeContact
              setShowAltContactModal={setShowAltContactModal}
              openEditAltContactModal={openEditAltContactModal}
              hiddenAltContactFields={hiddenAltContactFields}
              editingAltContactLabels={editingAltContactLabels}
              editingAltContactPlaceholders={editingAltContactPlaceholders}
              updateFormData={updateFormData}
              formData={formData}
              setHiddenAltContactFields={setHiddenAltContactFields}
              altContactCustomFields={altContactCustomFields}
              updateAltContactCustomFieldValue={updateAltContactCustomFieldValue}

              removeAltContactCustomField={removeAltContactCustomField}
              showAltContactModal={showAltContactModal}
              newAltContactFieldLabel={newAltContactFieldLabel}
              setNewAltContactFieldLabel={setNewAltContactFieldLabel}
              newAltContactFieldPlaceholder={newAltContactFieldPlaceholder}
              setNewAltContactFieldPlaceholder={setNewAltContactFieldPlaceholder}
              newAltContactFieldRequired={newAltContactFieldRequired}
              setNewAltContactFieldRequired={setNewAltContactFieldRequired}
              addAltContactCustomField={addAltContactCustomField}
              showEditAltContactModal={showEditAltContactModal}
              setShowEditAltContactModal={setShowEditAltContactModal}
              setEditingAltContactLabels={setEditingAltContactLabels}
              setEditingAltContactPlaceholders={setEditingAltContactPlaceholders}
              saveAltContactChanges={saveAltContactChanges}
            />

            {/* Address Information */}
            <AddressInformation
              setShowAddressModal={setShowAddressModal}
              openEditAddressModal={openEditAddressModal}
              hiddenAddressFields={hiddenAddressFields}
              editingAddressLabels={editingAddressLabels}
              editingAddressPlaceholders={editingAddressPlaceholders}
              updateFormData={updateFormData}
              formData={formData}
              setHiddenAddressFields={setHiddenAddressFields}
              addressCustomFields={addressCustomFields}
              updateAddressCustomFieldValue={updateAddressCustomFieldValue}

              removeAddressCustomField={removeAddressCustomField}
              showEditAddressModal={showEditAddressModal}
              setShowEditAddressModal={setShowEditAddressModal}
              setEditingAddressLabels={setEditingAddressLabels}
              setEditingAddressPlaceholders={setEditingAddressPlaceholders}
              saveAddressChanges={saveAddressChanges}
              showAddressModal={showAddressModal}
              newAddressFieldLabel={newAddressFieldLabel}
              setNewAddressFieldLabel={setNewAddressFieldLabel}
              newAddressFieldPlaceholder={newAddressFieldPlaceholder}
              setNewAddressFieldPlaceholder={setNewAddressFieldPlaceholder}
              newAddressFieldRequired={newAddressFieldRequired}
              setNewAddressFieldRequired={setNewAddressFieldRequired}
              addAddressCustomField={addAddressCustomField}
            />

            {/* Social Media Links */}
            <SocialMediaInformation
              setShowSocialMediaModal={setShowSocialMediaModal}
              openEditSocialMediaModal={openEditSocialMediaModal}
              hiddenSocialMediaFields={hiddenSocialMediaFields}
              editingSocialMediaLabels={editingSocialMediaLabels}
              editingSocialMediaPlaceholders={editingSocialMediaPlaceholders}
              updateFormData={updateFormData}
              formData={formData}
              setHiddenSocialMediaFields={setHiddenSocialMediaFields}
              socialMediaCustomFields={socialMediaCustomFields}
              updateSocialMediaCustomFieldValue={updateSocialMediaCustomFieldValue}

              removeSocialMediaCustomField={removeSocialMediaCustomField}
              showEditSocialMediaModal={showEditSocialMediaModal}
              setShowEditSocialMediaModal={setShowEditSocialMediaModal}
              setEditingSocialMediaLabels={setEditingSocialMediaLabels}
              setEditingSocialMediaPlaceholders={setEditingSocialMediaPlaceholders}
              saveSocialMediaChanges={saveSocialMediaChanges}
            />


          </div>
        </div>
      </div>



    </FormStep >
  );
}

function CompanyInformation({
  setShowAddFieldModal,
  openEditCompanyModal,
  hiddenCompanyFields,
  companyFieldLabels,
  editingCompanyPlaceholders,
  editingCompanyLabels,
  updateFormData,
  formData,
  setHiddenCompanyFields,
  customFields,
  updateCustomFieldValue,

  showEditCompanyModal,
  setShowEditCompanyModal,
  setEditingCompanyLabels,
  setEditingCompanyPlaceholders,
  saveCompanyChanges,
  showAddFieldModal,
  newFieldLabel,
  setNewFieldLabel,
  newFieldPlaceholder,
  setNewFieldPlaceholder,
  newFieldRequired,
  setNewFieldRequired,
  addCustomField
}: {
  setShowAddFieldModal: React.Dispatch<React.SetStateAction<boolean>>;
  openEditCompanyModal: () => void;
  hiddenCompanyFields: Set<string>;
  companyFieldLabels: any;
  editingCompanyPlaceholders: any;
  editingCompanyLabels: any;
  updateFormData: any;
  formData: any;
  setHiddenCompanyFields: (setter: (prev: Set<string>) => Set<string>) => void;
  customFields: Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>;
  updateCustomFieldValue: (id: string, value: string) => void;

  showEditCompanyModal: boolean;
  setShowEditCompanyModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingCompanyLabels: React.Dispatch<React.SetStateAction<any>>;
  setEditingCompanyPlaceholders: React.Dispatch<React.SetStateAction<any>>;
  saveCompanyChanges: () => void;
  showAddFieldModal: boolean;
  newFieldLabel: string;
  setNewFieldLabel: React.Dispatch<React.SetStateAction<string>>;
  newFieldPlaceholder: string;
  setNewFieldPlaceholder: React.Dispatch<React.SetStateAction<string>>;
  newFieldRequired: boolean;
  setNewFieldRequired: React.Dispatch<React.SetStateAction<boolean>>;
  addCustomField: () => void;
}) {

  const hideCompanyField = (fieldName: string) => {
    setHiddenCompanyFields((prev: Set<string>) => new Set([...prev, fieldName]))
  }


  return (
    <>
      <div className="p-3 bg-yellow-50 rounded-lg border border-amber-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="flex items-center text-sm font-bold text-amber-900">
            <Building2 className="mr-2 w-5 h-5" />
            Company Information
          </h3>
          <div className="flex space-x-2">
            <button onClick={() => setShowAddFieldModal(true)} className="p-1 rounded hover:bg-amber-100" title="Add New Field">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button onClick={openEditCompanyModal} className="p-1 rounded hover:bg-amber-100" title="Edit Company Information">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {!hiddenCompanyFields.has('companyName') && (
            <div className="relative">
              <FormInput
                label={editingCompanyLabels.companyName || companyFieldLabels.companyName}
                value={formData.companyName}
                onChange={(value) => updateFormData({ companyName: value })}
                required
                placeholder={editingCompanyPlaceholders.companyName || "Enter your company name"}
              />
              <div className="flex absolute top-0 right-0 space-x-1">
                <button
                  onClick={() => hideCompanyField('companyName')}
                  className="p-1 text-red-500 rounded hover:text-red-700 hover:bg-red-50"
                  title="Delete field"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          {!hiddenCompanyFields.has('yearEstablished') && (
            <div className="relative">
              <FormInput
                label={editingCompanyLabels.yearEstablished || companyFieldLabels.yearEstablished}
                type="date"
                value={formData.yearEstablished}
                onChange={(value) => updateFormData({ yearEstablished: value })}
                required
                placeholder={editingCompanyPlaceholders.yearEstablished || "dd-mm-yyyy"}
              />
              <div className="flex absolute inset-y-0 right-8 items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex absolute top-0 right-0 space-x-1">
                <button
                  onClick={() => hideCompanyField('yearEstablished')}
                  className="p-1 text-red-500 rounded hover:text-red-700 hover:bg-red-50"
                  title="Delete field"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          {!hiddenCompanyFields.has('websiteUrl') && (
            <div className="relative">
              <FormInput
                label={companyFieldLabels.websiteUrl}
                type="url"
                value={formData.websiteUrl}
                onChange={(value) => updateFormData({ websiteUrl: value })}
                placeholder={editingCompanyPlaceholders.websiteUrl || "https://www.yourcompany.com"}
              />
              <div className="flex absolute top-0 right-0 space-x-1">
                <button
                  onClick={() => hideCompanyField('websiteUrl')}
                  className="p-1 text-red-500 rounded hover:text-red-700 hover:bg-red-50"
                  title="Delete field"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          {!hiddenCompanyFields.has('promoCode') && (
            <div className="relative">
              <FormInput
                label={companyFieldLabels.promoCode}
                value={formData.promoCode}
                onChange={(value) => updateFormData({ promoCode: value })}
                required
                placeholder={editingCompanyPlaceholders.promoCode || "Enter promotional code"}
              />
              <div className="flex absolute top-0 right-0 space-x-1">
                <button
                  onClick={() => hideCompanyField('promoCode')}
                  className="p-1 text-red-500 rounded hover:text-red-700 hover:bg-red-50"
                  title="Delete field"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Custom Fields */}
        {customFields.length > 0 && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {customFields.map((field) => (
                <div key={field.id} className="relative">
                  <FormInput
                    label={field.label}
                    required={field.required}
                    value={field.value}
                    onChange={(value) => updateCustomFieldValue(field.id, value)}
                    placeholder={field.placeholder}
                  />

                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Company Information Modal */}
      {showEditCompanyModal && (
        <div className="flex overflow-auto fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
          <div className="p-6 mx-4 w-full max-w-2xl max-h-[300px] overflow-auto bg-white rounded-lg shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Edit Company Information</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingCompanyLabels.companyName}
                    onChange={(e) => setEditingCompanyLabels((prev: any) => ({ ...prev, companyName: e.target.value }))}
                    placeholder="e.g., Company Name"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingCompanyPlaceholders.companyName}
                    onChange={(e) => setEditingCompanyPlaceholders((prev: any) => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Enter your company name"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingCompanyLabels.yearEstablished}
                    onChange={(e) => setEditingCompanyLabels((prev: any) => ({ ...prev, yearEstablished: e.target.value }))}
                    placeholder="e.g., Date of Incorporation"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingCompanyPlaceholders.yearEstablished}
                    onChange={(e) => setEditingCompanyPlaceholders((prev: any) => ({ ...prev, yearEstablished: e.target.value }))}
                    placeholder="dd-mm-yyyy"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingCompanyLabels.websiteUrl}
                    onChange={(e) => setEditingCompanyLabels(prev => ({ ...prev, websiteUrl: e.target.value }))}
                    placeholder="e.g., Website URL"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingCompanyPlaceholders.websiteUrl}
                    onChange={(e) => setEditingCompanyPlaceholders(prev => ({ ...prev, websiteUrl: e.target.value }))}
                    placeholder="https://www.yourcompany.com"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingCompanyLabels.promoCode}
                    onChange={(e) => setEditingCompanyLabels(prev => ({ ...prev, promoCode: e.target.value }))}
                    placeholder="e.g., Promotional Code"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingCompanyPlaceholders.promoCode}
                    onChange={(e) => setEditingCompanyPlaceholders(prev => ({ ...prev, promoCode: e.target.value }))}
                    placeholder="Enter promotional code"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
              {/* Custom Fields in Edit Modal */}
              {customFields.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-3 text-sm font-semibold text-gray-700">Custom Fields</h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {customFields.map((field) => (
                      <div key={field.id}>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          {field.label} {field.required && '*'}
                        </label>
                        <input
                          type="text"
                          value={field.placeholder}
                          onChange={(e) => updateCustomFieldValue(field.id, e.target.value)}
                          placeholder="Enter placeholder text"
                          className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowEditCompanyModal(false)}
                className="px-4 py-2 text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveCompanyChanges}
                className="px-4 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Field Modal */}
      {showAddFieldModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
          <div className="p-6 mx-4 w-full max-w-md max-h-[300px] overflow-auto bg-white rounded-lg shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Add New Field</h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  placeholder="e.g., Company Location"
                  className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Placeholder Text
                </label>
                <input
                  type="text"
                  value={newFieldPlaceholder}
                  onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                  placeholder="e.g., Enter company location"
                  className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newFieldRequired"
                  checked={newFieldRequired}
                  onChange={(e) => setNewFieldRequired(e.target.checked)}
                  className="w-4 h-4 text-amber-600 bg-gray-100 rounded border-gray-300 focus:ring-amber-500 focus:ring-2"
                />
                <label htmlFor="newFieldRequired" className="ml-2 text-sm font-medium text-gray-700">
                  Required Field
                </label>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowAddFieldModal(false)}
                className="px-4 py-2 text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addCustomField}
                className="px-4 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600"
              >
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function LegalInformation({
  setShowLegalModal,
  openEditLegalModal,
  hiddenLegalFields,
  editingLegalLabels,
  editingLegalPlaceholders,
  updateFormData,
  formData,
  setHiddenLegalFields,
  legalCustomFields,
  updateLegalCustomFieldValue,

  removeLegalCustomField,
  showLegalModal,
  newLegalFieldLabel,
  setNewLegalFieldLabel,
  newLegalFieldPlaceholder,
  setNewLegalFieldPlaceholder,
  newLegalFieldRequired,
  setNewLegalFieldRequired,
  addLegalCustomField,
  showEditLegalModal,
  setShowEditLegalModal,
  setEditingLegalLabels,
  setEditingLegalPlaceholders,
  saveLegalChanges
}: {
  setShowLegalModal: (show: boolean) => void;
  openEditLegalModal: () => void;
  hiddenLegalFields: Set<string>;
  editingLegalLabels: any;
  editingLegalPlaceholders: any;
  updateFormData: any;
  formData: any;
  setHiddenLegalFields: (setter: (prev: Set<string>) => Set<string>) => void;
  legalCustomFields: Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>;
  updateLegalCustomFieldValue: (id: string, value: string) => void;

  removeLegalCustomField: (id: string) => void;
  showLegalModal: boolean;
  newLegalFieldLabel: string;
  setNewLegalFieldLabel: React.Dispatch<React.SetStateAction<string>>;
  newLegalFieldPlaceholder: string;
  setNewLegalFieldPlaceholder: React.Dispatch<React.SetStateAction<string>>;
  newLegalFieldRequired: boolean;
  setNewLegalFieldRequired: React.Dispatch<React.SetStateAction<boolean>>;
  addLegalCustomField: () => void;
  showEditLegalModal: boolean;
  setShowEditLegalModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingLegalLabels: React.Dispatch<React.SetStateAction<any>>;
  setEditingLegalPlaceholders: React.Dispatch<React.SetStateAction<any>>;
  saveLegalChanges: () => void;
}) {

  const hideLegalField = (fieldName: string) => {
    setHiddenLegalFields((prev: Set<string>) => new Set([...prev, fieldName]))
  }


  return (
    <>
      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-bold text-amber-900">Legal Information (Optional)</h3>
          <div className="flex space-x-2">
            <button onClick={() => setShowLegalModal(true)} className="p-1 rounded hover:bg-amber-100" title="Add New Field">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button onClick={openEditLegalModal} className="p-1 rounded hover:bg-amber-100" title="Edit Legal Information">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {!hiddenLegalFields.has('legalName') && (
            <div className="relative">
              <FormInput
                label={editingLegalLabels.legalName}
                value={formData.legalName || ''}
                onChange={(value) => updateFormData({ legalName: value })}
                placeholder={editingLegalPlaceholders.legalName || "If different from brand name"}
              />
              <button
                onClick={() => hideLegalField('legalName')}
                className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                title="Remove field"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {!hiddenLegalFields.has('gstin') && (
            <div className="relative">
              <FormInput
                label={editingLegalLabels.gstin || ''}
                value={formData.gstin || ''}
                onChange={(value) => updateFormData({ gstin: value })}
                placeholder={editingLegalPlaceholders.gstin || "GST number"}
              />
              <button
                onClick={() => hideLegalField('gstin')}
                className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                title="Remove field"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {!hiddenLegalFields.has('operatingHours') && (
            <div className="relative">
              <FormInput
                label={editingLegalLabels.operatingHours || ''}
                value={formData.operatingHours || ''}
                onChange={(value) => updateFormData({ operatingHours: value })}
                placeholder={editingLegalPlaceholders.operatingHours || "Mon-Sat 10:00-18:00"}
              />
              <button
                onClick={() => hideLegalField('operatingHours')}
                className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                title="Remove field"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {!hiddenLegalFields.has('cin') && (
            <div className="relative">
              <FormInput
                label={editingLegalLabels.cin || ''}
                value={formData.socialLinks?.cin || ''}
                onChange={(value) => updateFormData({
                  socialLinks: { ...formData.socialLinks, cin: value }
                })}
                placeholder={editingLegalPlaceholders.cin || "Corporate Identity Number"}
              />
              <button
                onClick={() => hideLegalField('cin')}
                className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                title="Remove field"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {!hiddenLegalFields.has('udyam') && (
            <div className="relative">
              <FormInput
                label={editingLegalLabels.udyam || ''}
                value={formData.socialLinks?.udyam || ''}
                onChange={(value) => updateFormData({
                  socialLinks: { ...formData.socialLinks, udyam: value }
                })}
                placeholder={editingLegalPlaceholders.udyam || "UDYAM Registration Number"}
              />
              <button
                onClick={() => hideLegalField('udyam')}
                className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                title="Remove field"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {!hiddenLegalFields.has('pan') && (
            <div className="relative">
              <FormInput
                label={editingLegalLabels.pan || ''}
                value={formData.socialLinks?.pan || ''}
                onChange={(value) => updateFormData({
                  socialLinks: { ...formData.socialLinks, pan: value }
                })}
                placeholder={editingLegalPlaceholders.pan || "PAN Number"}
              />
              <button
                onClick={() => hideLegalField('pan')}
                className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                title="Remove field"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
        {/* Legal Custom Fields */}
        {legalCustomFields.length > 0 && (
          <div className="mt-4 space-y-3">
            {/* <h4 className="text-sm font-semibold text-amber-800">Custom Legal Fields</h4> */}
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {legalCustomFields.map((field) => (
                <div key={field.id} className="relative">
                  <FormInput
                    label={field.label}
                    required={field.required}
                    value={field.value}
                    onChange={(value) => updateLegalCustomFieldValue(field.id, value)}
                    placeholder={field.placeholder}
                  />
                  <div className="flex absolute top-0 right-0 space-x-1">

                    <button
                      onClick={() => removeLegalCustomField(field.id)}
                      className="p-1 text-red-500 rounded hover:text-red-700 hover:bg-red-50"
                      title="Delete Field"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Legal Information Modal */}
      {showEditLegalModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
          <div className="p-4 mx-4 w-full max-w-lg max-h-[300px] overflow-auto bg-white rounded-lg shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Edit Legal Information</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingLegalLabels.legalName}
                    onChange={(e) => setEditingLegalLabels(prev => ({ ...prev, legalName: e.target.value }))}
                    placeholder="e.g., Legal Company Name"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingLegalPlaceholders.legalName}
                    onChange={(e) => setEditingLegalPlaceholders(prev => ({ ...prev, legalName: e.target.value }))}
                    placeholder="If different from brand name"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingLegalLabels.gstin}
                    onChange={(e) => setEditingLegalLabels(prev => ({ ...prev, gstin: e.target.value }))}
                    placeholder="e.g., GSTIN"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingLegalPlaceholders.gstin}
                    onChange={(e) => setEditingLegalPlaceholders(prev => ({ ...prev, gstin: e.target.value }))}
                    placeholder="GST number"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingLegalLabels.operatingHours}
                    onChange={(e) => setEditingLegalLabels(prev => ({ ...prev, operatingHours: e.target.value }))}
                    placeholder="e.g., Operating Hours"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingLegalPlaceholders.operatingHours}
                    onChange={(e) => setEditingLegalPlaceholders(prev => ({ ...prev, operatingHours: e.target.value }))}
                    placeholder="Mon-Sat 10:00-18:00"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingLegalLabels.cin}
                    onChange={(e) => setEditingLegalLabels(prev => ({ ...prev, cin: e.target.value }))}
                    placeholder="e.g., CIN"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingLegalPlaceholders.cin}
                    onChange={(e) => setEditingLegalPlaceholders(prev => ({ ...prev, cin: e.target.value }))}
                    placeholder="Corporate Identity Number"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingLegalLabels.udyam}
                    onChange={(e) => setEditingLegalLabels(prev => ({ ...prev, udyam: e.target.value }))}
                    placeholder="e.g., UDYAM"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingLegalPlaceholders.udyam}
                    onChange={(e) => setEditingLegalPlaceholders(prev => ({ ...prev, udyam: e.target.value }))}
                    placeholder="UDYAM Registration Number"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingLegalLabels.pan}
                    onChange={(e) => setEditingLegalLabels(prev => ({ ...prev, pan: e.target.value }))}
                    placeholder="e.g., PAN"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingLegalPlaceholders.pan}
                    onChange={(e) => setEditingLegalPlaceholders(prev => ({ ...prev, pan: e.target.value }))}
                    placeholder="PAN Number"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowEditLegalModal(false)}
                className="px-4 py-2 text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveLegalChanges}
                className="px-4 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Legal Information Field Modal */}
      {showLegalModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
          <div className="p-6 mx-4 w-full max-w-md max-h-[300px] overflow-auto bg-white rounded-lg shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Add Legal Information Field</h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={newLegalFieldLabel}
                  onChange={(e) => setNewLegalFieldLabel(e.target.value)}
                  placeholder="e.g., Legal Entity Type"
                  className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Placeholder Text
                </label>
                <input
                  type="text"
                  value={newLegalFieldPlaceholder}
                  onChange={(e) => setNewLegalFieldPlaceholder(e.target.value)}
                  placeholder="e.g., Enter legal entity type"
                  className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newLegalFieldRequired"
                  checked={newLegalFieldRequired}
                  onChange={(e) => setNewLegalFieldRequired(e.target.checked)}
                  className="w-4 h-4 text-amber-600 bg-gray-100 rounded border-gray-300 focus:ring-amber-500 focus:ring-2"
                />
                <label htmlFor="newLegalFieldRequired" className="ml-2 text-sm font-medium text-gray-700">
                  Required Field
                </label>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowLegalModal(false)}
                className="px-4 py-2 text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addLegalCustomField}
                className="px-4 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600"
              >
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
function DirectorInformation({
  setShowDirectorModal,
  openEditDirectorModal,
  hiddenDirectorFields,
  editingDirectorLabels,
  editingDirectorPlaceholders,
  updateFormData,
  formData,
  setHiddenDirectorFields,
  directorCustomFields,
  updateDirectorCustomFieldValue,

  removeDirectorCustomField,
  showDirectorModal,
  newDirectorFieldLabel,
  setNewDirectorFieldLabel,
  newDirectorFieldPlaceholder,
  setNewDirectorFieldPlaceholder,
  newDirectorFieldRequired,
  setNewDirectorFieldRequired,
  addDirectorCustomField,
  showEditDirectorModal,
  setShowEditDirectorModal,
  setEditingDirectorLabels,
  setEditingDirectorPlaceholders,
  saveDirectorChanges
}: {
  setShowDirectorModal: React.Dispatch<React.SetStateAction<boolean>>;
  openEditDirectorModal: () => void;
  hiddenDirectorFields: Set<string>;
  editingDirectorLabels: any;
  editingDirectorPlaceholders: any;
  updateFormData: any;
  formData: any;
  setHiddenDirectorFields: (setter: (prev: Set<string>) => Set<string>) => void;
  directorCustomFields: Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>;
  updateDirectorCustomFieldValue: (id: string, value: string) => void;

  removeDirectorCustomField: (id: string) => void;
  showDirectorModal: boolean;
  newDirectorFieldLabel: string;
  setNewDirectorFieldLabel: React.Dispatch<React.SetStateAction<string>>;
  newDirectorFieldPlaceholder: string;
  setNewDirectorFieldPlaceholder: React.Dispatch<React.SetStateAction<string>>;
  newDirectorFieldRequired: boolean;
  setNewDirectorFieldRequired: React.Dispatch<React.SetStateAction<boolean>>;
  addDirectorCustomField: () => void;
  showEditDirectorModal: boolean;
  setShowEditDirectorModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingDirectorLabels: React.Dispatch<React.SetStateAction<any>>;
  setEditingDirectorPlaceholders: React.Dispatch<React.SetStateAction<any>>;
  saveDirectorChanges: () => void;
}) {

  const hideDirectorField = (fieldName: string) => {
    setHiddenDirectorFields((prev: Set<string>) => new Set([...prev, fieldName]))
  }

  return (
    <div className="p-3 bg-yellow-100 rounded-lg border border-amber-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="flex items-center text-sm font-bold text-amber-900">
          <User className="mr-2 w-5 h-5" />
          Director/MD Information
        </h3>
        <div className="flex space-x-2">
          <button onClick={() => setShowDirectorModal(true)} className="p-1 rounded hover:bg-yellow-200" title="Add New Field">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button onClick={openEditDirectorModal} className="p-1 rounded hover:bg-yellow-200" title="Edit Director Information">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {!hiddenDirectorFields.has('directorName') && (
          <div className="relative">
            <FormInput
              label={editingDirectorLabels.directorName}
              value={formData.directorName}
              onChange={(value) => updateFormData({ directorName: value })}
              required
              placeholder={editingDirectorPlaceholders.directorName || "Full name"}
            />
            <button
              onClick={() => hideDirectorField('directorName')}
              className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
              title="Remove field"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {!hiddenDirectorFields.has('directorPhone') && (
          <div className="relative">
            <FormInput
              label={editingDirectorLabels.directorPhone}
              type="tel"
              value={formData.directorPhone}
              onChange={(value) => updateFormData({ directorPhone: value })}
              required
              placeholder={editingDirectorPlaceholders.directorPhone || "+91XXXXXXXXXX"}
            />
            <button
              onClick={() => hideDirectorField('directorPhone')}
              className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
              title="Remove field"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {!hiddenDirectorFields.has('directorEmail') && (
          <div className="relative md:col-span-2">
            <FormInput
              label={editingDirectorLabels.directorEmail}
              type="email"
              value={formData.directorEmail}
              onChange={(value) => updateFormData({ directorEmail: value })}
              required
              placeholder={editingDirectorPlaceholders.directorEmail || "director@company.com"}
            />
            <button
              onClick={() => hideDirectorField('directorEmail')}
              className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
              title="Remove field"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
      {/* Director Custom Fields */}
      {directorCustomFields.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {directorCustomFields.map((field) => (
              <div key={field.id} className="relative">
                <FormInput
                  label={field.label}
                  required={field.required}
                  value={field.value}
                  onChange={(value) => updateDirectorCustomFieldValue(field.id, value)}
                  placeholder={field.placeholder}
                />
                <div className="flex absolute top-0 right-0 space-x-1">

                  <button
                    onClick={() => removeDirectorCustomField(field.id)}
                    className="p-1 text-red-500 rounded hover:text-red-700 hover:bg-amber-50"
                    title="Delete Field"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Director Information Field Modal */}
      {showDirectorModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
          <div className="p-6 mx-4 w-full max-w-md max-h-[300px] overflow-auto bg-white rounded-lg shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Add Director Information Field</h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={newDirectorFieldLabel}
                  onChange={(e) => setNewDirectorFieldLabel(e.target.value)}
                  placeholder="e.g., Director Designation"
                  className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Placeholder Text
                </label>
                <input
                  type="text"
                  value={newDirectorFieldPlaceholder}
                  onChange={(e) => setNewDirectorFieldPlaceholder(e.target.value)}
                  placeholder="e.g., Enter director designation"
                  className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newDirectorFieldRequired"
                  checked={newDirectorFieldRequired}
                  onChange={(e) => setNewDirectorFieldRequired(e.target.checked)}
                  className="w-4 h-4 text-amber-600 bg-gray-100 rounded border-gray-300 focus:ring-amber-500 focus:ring-2"
                />
                <label htmlFor="newDirectorFieldRequired" className="ml-2 text-sm font-medium text-gray-700">
                  Required Field
                </label>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowDirectorModal(false)}
                className="px-4 py-2 text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addDirectorCustomField}
                className="px-4 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600"
              >
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Director Information Modal */}
      {showEditDirectorModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
          <div className="p-4 mx-4 w-full max-w-lg max-h-[300px] overflow-auto bg-white rounded-lg shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Edit Director Information</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingDirectorLabels.directorName}
                    onChange={(e) => setEditingDirectorLabels(prev => ({ ...prev, directorName: e.target.value }))}
                    placeholder="e.g., Director Name"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingDirectorPlaceholders.directorName}
                    onChange={(e) => setEditingDirectorPlaceholders(prev => ({ ...prev, directorName: e.target.value }))}
                    placeholder="Full name"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingDirectorLabels.directorPhone}
                    onChange={(e) => setEditingDirectorLabels(prev => ({ ...prev, directorPhone: e.target.value }))}
                    placeholder="e.g., Director Phone"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingDirectorPlaceholders.directorPhone}
                    onChange={(e) => setEditingDirectorPlaceholders(prev => ({ ...prev, directorPhone: e.target.value }))}
                    placeholder="+91XXXXXXXXXX"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingDirectorLabels.directorEmail}
                    onChange={(e) => setEditingDirectorLabels(prev => ({ ...prev, directorEmail: e.target.value }))}
                    placeholder="e.g., Director Email"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingDirectorPlaceholders.directorEmail}
                    onChange={(e) => setEditingDirectorPlaceholders(prev => ({ ...prev, directorEmail: e.target.value }))}
                    placeholder="director@company.com"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowEditDirectorModal(false)}
                className="px-4 py-2 text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveDirectorChanges}
                className="px-4 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
function AlternativeContact({
  setShowAltContactModal,
  openEditAltContactModal,
  hiddenAltContactFields,
  editingAltContactLabels,
  editingAltContactPlaceholders,
  updateFormData,
  formData,
  setHiddenAltContactFields,
  altContactCustomFields,
  updateAltContactCustomFieldValue,

  removeAltContactCustomField,
  showAltContactModal,
  newAltContactFieldLabel,
  setNewAltContactFieldLabel,
  newAltContactFieldPlaceholder,
  setNewAltContactFieldPlaceholder,
  newAltContactFieldRequired,
  setNewAltContactFieldRequired,
  addAltContactCustomField,
  showEditAltContactModal,
  setShowEditAltContactModal,
  setEditingAltContactLabels,
  setEditingAltContactPlaceholders,
  saveAltContactChanges
}: {
  setShowAltContactModal: React.Dispatch<React.SetStateAction<boolean>>;
  openEditAltContactModal: () => void;
  hiddenAltContactFields: Set<string>;
  editingAltContactLabels: any;
  editingAltContactPlaceholders: any;
  updateFormData: any;
  formData: any;
  setHiddenAltContactFields: (setter: (prev: Set<string>) => Set<string>) => void;
  altContactCustomFields: Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>;
  updateAltContactCustomFieldValue: (id: string, value: string) => void;

  removeAltContactCustomField: (id: string) => void;
  showAltContactModal: boolean;
  newAltContactFieldLabel: string;
  setNewAltContactFieldLabel: React.Dispatch<React.SetStateAction<string>>;
  newAltContactFieldPlaceholder: string;
  setNewAltContactFieldPlaceholder: React.Dispatch<React.SetStateAction<string>>;
  newAltContactFieldRequired: boolean;
  setNewAltContactFieldRequired: React.Dispatch<React.SetStateAction<boolean>>;
  addAltContactCustomField: () => void;
  showEditAltContactModal: boolean;
  setShowEditAltContactModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingAltContactLabels: React.Dispatch<React.SetStateAction<any>>;
  setEditingAltContactPlaceholders: React.Dispatch<React.SetStateAction<any>>;
  saveAltContactChanges: () => void;
}) {

  const hideAltContactField = (fieldName: string) => {
    setHiddenAltContactFields((prev: Set<string>) => new Set([...prev, fieldName]))
  }

  return (
    <>
      <div className="p-3 bg-amber-100 rounded-lg border border-amber-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="flex items-center text-sm font-bold text-amber-900">
            <Phone className="mr-2 w-5 h-5" />
            Alternative Contact
          </h3>
          <div className="flex space-x-2">
            <button onClick={() => setShowAltContactModal(true)} className="p-1 rounded hover:bg-amber-200" title="Add New Field">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button onClick={openEditAltContactModal} className="p-1 rounded hover:bg-amber-200" title="Edit Alternative Contact">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {!hiddenAltContactFields.has('altContactName') && (
            <div className="relative">
              <FormInput
                label={editingAltContactLabels.altContactName}
                value={formData.altContactName}
                onChange={(value) => updateFormData({ altContactName: value })}
                required
                placeholder={editingAltContactPlaceholders.altContactName || "Full name"}
              />
              <button
                onClick={() => hideAltContactField('altContactName')}
                className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                title="Remove field"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {!hiddenAltContactFields.has('altContactPhone') && (
            <div className="relative">
              <FormInput
                label={editingAltContactLabels.altContactPhone}
                type="tel"
                value={formData.altContactPhone}
                onChange={(value) => updateFormData({ altContactPhone: value })}
                required
                placeholder={editingAltContactPlaceholders.altContactPhone || "+91XXXXXXXXXX"}
              />
              <button
                onClick={() => hideAltContactField('altContactPhone')}
                className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                title="Remove field"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          {!hiddenAltContactFields.has('altContactEmail') && (
            <div className="relative md:col-span-2">
              <FormInput
                label={editingAltContactLabels.altContactEmail}
                type="email"
                value={formData.altContactEmail}
                onChange={(value) => updateFormData({ altContactEmail: value })}
                required
                placeholder={editingAltContactPlaceholders.altContactEmail || "contact@company.com"}
              />
              <button
                onClick={() => hideAltContactField('altContactEmail')}
                className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                title="Remove field"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
        {/* Alternative Contact Custom Fields */}
        {altContactCustomFields.length > 0 && (
          <div className="mt-4 space-y-3">
            {/* <h4 className="text-sm font-semibold text-amber-800">Custom Contact Fields</h4> */}
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {altContactCustomFields.map((field) => (
                <div key={field.id} className="relative">
                  <FormInput
                    label={field.label}
                    required={field.required}
                    value={field.value}
                    onChange={(value) => updateAltContactCustomFieldValue(field.id, value)}
                    placeholder={field.placeholder}
                  />
                  <div className="flex absolute top-0 right-0 space-x-1">

                    <button
                      onClick={() => removeAltContactCustomField(field.id)}
                      className="p-1 text-red-500 rounded hover:text-red-700 hover:bg-red-50"
                      title="Delete Field"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Alternative Contact Field Modal */}
      {showAltContactModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
          <div className="p-6 mx-4 w-full max-w-md max-h-[300px] overflow-auto bg-white rounded-lg shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Add Alternative Contact Field</h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={newAltContactFieldLabel}
                  onChange={(e) => setNewAltContactFieldLabel(e.target.value)}
                  placeholder="e.g., Department"
                  className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Placeholder Text
                </label>
                <input
                  type="text"
                  value={newAltContactFieldPlaceholder}
                  onChange={(e) => setNewAltContactFieldPlaceholder(e.target.value)}
                  placeholder="e.g., Enter department name"
                  className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newAltContactFieldRequired"
                  checked={newAltContactFieldRequired}
                  onChange={(e) => setNewAltContactFieldRequired(e.target.checked)}
                  className="w-4 h-4 text-amber-600 bg-gray-100 rounded border-gray-300 focus:ring-amber-500 focus:ring-2"
                />
                <label htmlFor="newAltContactFieldRequired" className="ml-2 text-sm font-medium text-gray-700">
                  Required Field
                </label>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowAltContactModal(false)}
                className="px-4 py-2 text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addAltContactCustomField}
                className="px-4 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600"
              >
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Alternative Contact Modal */}
      {showEditAltContactModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
          <div className="p-6 mx-4 w-full max-w-2xl max-h-[300px] overflow-auto bg-white rounded-lg shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Edit Alternative Contact</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingAltContactLabels.altContactName}
                    onChange={(e) => setEditingAltContactLabels(prev => ({ ...prev, altContactName: e.target.value }))}
                    placeholder="e.g., Contact Person Name"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingAltContactPlaceholders.altContactName}
                    onChange={(e) => setEditingAltContactPlaceholders(prev => ({ ...prev, altContactName: e.target.value }))}
                    placeholder="Full name"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingAltContactLabels.altContactPhone}
                    onChange={(e) => setEditingAltContactLabels(prev => ({ ...prev, altContactPhone: e.target.value }))}
                    placeholder="e.g., Contact Phone"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingAltContactPlaceholders.altContactPhone}
                    onChange={(e) => setEditingAltContactPlaceholders(prev => ({ ...prev, altContactPhone: e.target.value }))}
                    placeholder="+91XXXXXXXXXX"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingAltContactLabels.altContactEmail}
                    onChange={(e) => setEditingAltContactLabels(prev => ({ ...prev, altContactEmail: e.target.value }))}
                    placeholder="e.g., Contact Email"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingAltContactPlaceholders.altContactEmail}
                    onChange={(e) => setEditingAltContactPlaceholders(prev => ({ ...prev, altContactEmail: e.target.value }))}
                    placeholder="contact@company.com"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowEditAltContactModal(false)}
                className="px-4 py-2 text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveAltContactChanges}
                className="px-4 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function AddressInformation({
  setShowAddressModal,
  openEditAddressModal,
  hiddenAddressFields,
  editingAddressLabels,
  editingAddressPlaceholders,
  updateFormData,
  formData,
  setHiddenAddressFields,
  addressCustomFields,
  updateAddressCustomFieldValue,

  removeAddressCustomField,
  showEditAddressModal,
  setShowEditAddressModal,
  setEditingAddressLabels,
  setEditingAddressPlaceholders,
  saveAddressChanges,
  showAddressModal,
  newAddressFieldLabel,
  setNewAddressFieldLabel,
  newAddressFieldPlaceholder,
  setNewAddressFieldPlaceholder,
  newAddressFieldRequired,
  setNewAddressFieldRequired,
  addAddressCustomField
}: {
  setShowAddressModal: React.Dispatch<React.SetStateAction<boolean>>;
  openEditAddressModal: () => void;
  hiddenAddressFields: Set<string>;
  editingAddressLabels: any;
  editingAddressPlaceholders: any;
  updateFormData: any;
  formData: any;
  setHiddenAddressFields: (setter: (prev: Set<string>) => Set<string>) => void;
  addressCustomFields: Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>;
  updateAddressCustomFieldValue: (id: string, value: string) => void;

  removeAddressCustomField: (id: string) => void;
  showEditAddressModal: boolean;
  setShowEditAddressModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingAddressLabels: React.Dispatch<React.SetStateAction<any>>;
  setEditingAddressPlaceholders: React.Dispatch<React.SetStateAction<any>>;
  saveAddressChanges: () => void;
  showAddressModal: boolean;
  newAddressFieldLabel: string;
  setNewAddressFieldLabel: React.Dispatch<React.SetStateAction<string>>;
  newAddressFieldPlaceholder: string;
  setNewAddressFieldPlaceholder: React.Dispatch<React.SetStateAction<string>>;
  newAddressFieldRequired: boolean;
  setNewAddressFieldRequired: React.Dispatch<React.SetStateAction<boolean>>;
  addAddressCustomField: () => void;
}) {

  const hideAddressField = (fieldName: string) => {
    setHiddenAddressFields((prev: Set<string>) => new Set([...prev, fieldName]))
  }

  return (
    <>
      <div className="p-3 bg-yellow-200 rounded-lg border border-amber-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="flex items-center text-sm font-bold text-amber-900">
            <Globe className="mr-2 w-5 h-5" />
            Address Information
          </h3>
          <div className="flex space-x-2">
            <button onClick={() => setShowAddressModal(true)} className="p-1 rounded hover:bg-yellow-300" title="Add New Field">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button onClick={openEditAddressModal} className="p-1 rounded hover:bg-yellow-300" title="Edit Address Information">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {!hiddenAddressFields.has('officeAddress') && (
            <div className="relative">
              <FormInput
                label={editingAddressLabels.officeAddress}
                type="textarea"
                value={formData.officeAddress}
                onChange={(value) => updateFormData({ officeAddress: value })}
                required
                placeholder={editingAddressPlaceholders.officeAddress || "Complete office address"}
                rows={2}
              />
              <button
                onClick={() => hideAddressField('officeAddress')}
                className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                title="Remove field"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
            {!hiddenAddressFields.has('country') && (
              <div className="relative">
                <Select
                  label={editingAddressLabels.country}
                  options={countries}
                  value={formData.country}
                  onChange={(value) => updateFormData({ country: value })}
                  required
                  placeholder={editingAddressPlaceholders.country || "Select Country"}
                />
                <button
                  onClick={() => hideAddressField('country')}
                  className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                  title="Remove field"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            {!hiddenAddressFields.has('state') && (
              <div className="relative">
                <Select
                  label={editingAddressLabels.state}
                  options={indianStates}
                  value={formData.state}
                  onChange={(value) => updateFormData({ state: value })}
                  required
                  placeholder={editingAddressPlaceholders.state || "Select State"}
                />
                <button
                  onClick={() => hideAddressField('state')}
                  className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                  title="Remove field"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            {!hiddenAddressFields.has('city') && (
              <div className="relative">
                <FormInput
                  label={editingAddressLabels.city}
                  value={formData.city}
                  onChange={(value) => updateFormData({ city: value })}
                  required
                  placeholder={editingAddressPlaceholders.city || "City"}
                />
                <button
                  onClick={() => hideAddressField('city')}
                  className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                  title="Remove field"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            {!hiddenAddressFields.has('postalCode') && (
              <div className="relative">
                <FormInput
                  label={editingAddressLabels.postalCode}
                  value={formData.postalCode}
                  onChange={(value) => updateFormData({ postalCode: value })}
                  required
                  placeholder={editingAddressPlaceholders.postalCode || "PIN Code"}
                />
                <button
                  onClick={() => hideAddressField('postalCode')}
                  className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                  title="Remove field"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Address Custom Fields */}
        {
          addressCustomFields.length > 0 && (
            <div className="mt-4 space-y-3">
              {/* <h4 className="text-sm font-semibold text-amber-800">Custom Address Fields</h4> */}
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {addressCustomFields.map((field) => (
                  <div key={field.id} className="relative">
                    <FormInput
                      label={field.label}
                      required={field.required}
                      value={field.value}
                      onChange={(value) => updateAddressCustomFieldValue(field.id, value)}
                      placeholder={field.placeholder}
                    />
                    <div className="flex absolute top-0 right-0 space-x-1">

                      <button
                        onClick={() => removeAddressCustomField(field.id)}
                        className="p-1 text-red-500 rounded hover:text-red-700 hover:bg-red-50"
                        title="Delete Field"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      </div>

      {/* Edit Address Information Modal */}
      {showEditAddressModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
          <div className="p-6 mx-4 w-full max-w-2xl max-h-[300px] overflow-auto bg-white rounded-lg shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Edit Address Information</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingAddressLabels.officeAddress}
                    onChange={(e) => setEditingAddressLabels(prev => ({ ...prev, officeAddress: e.target.value }))}
                    placeholder="e.g., Office Address"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingAddressPlaceholders.officeAddress}
                    onChange={(e) => setEditingAddressPlaceholders(prev => ({ ...prev, officeAddress: e.target.value }))}
                    placeholder="Complete office address"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingAddressLabels.country}
                    onChange={(e) => setEditingAddressLabels(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="e.g., Country"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingAddressPlaceholders.country}
                    onChange={(e) => setEditingAddressPlaceholders(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="Select Country"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingAddressLabels.state}
                    onChange={(e) => setEditingAddressLabels(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="e.g., State"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingAddressPlaceholders.state}
                    onChange={(e) => setEditingAddressPlaceholders(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="Select State"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingAddressLabels.city}
                    onChange={(e) => setEditingAddressLabels(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="e.g., City"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingAddressPlaceholders.city}
                    onChange={(e) => setEditingAddressPlaceholders(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="City"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingAddressLabels.postalCode}
                    onChange={(e) => setEditingAddressLabels(prev => ({ ...prev, postalCode: e.target.value }))}
                    placeholder="e.g., Postal Code"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingAddressPlaceholders.postalCode}
                    onChange={(e) => setEditingAddressPlaceholders(prev => ({ ...prev, postalCode: e.target.value }))}
                    placeholder="PIN Code"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowEditAddressModal(false)}
                className="px-4 py-2 text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveAddressChanges}
                className="px-4 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Information Field Modal */}
      {showAddressModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
          <div className="p-6 mx-4 w-full max-w-md max-h-[300px] overflow-auto bg-white rounded-lg shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Add Address Information Field</h3>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={newAddressFieldLabel}
                  onChange={(e) => setNewAddressFieldLabel(e.target.value)}
                  placeholder="e.g., Landmark"
                  className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Placeholder Text
                </label>
                <input
                  type="text"
                  value={newAddressFieldPlaceholder}
                  onChange={(e) => setNewAddressFieldPlaceholder(e.target.value)}
                  placeholder="e.g., Enter nearby landmark"
                  className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newAddressFieldRequired"
                  checked={newAddressFieldRequired}
                  onChange={(e) => setNewAddressFieldRequired(e.target.checked)}
                  className="w-4 h-4 text-amber-600 bg-gray-100 rounded border-gray-300 focus:ring-amber-500 focus:ring-2"
                />
                <label htmlFor="newAddressFieldRequired" className="ml-2 text-sm font-medium text-gray-700">
                  Required Field
                </label>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-4 py-2 text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addAddressCustomField}
                className="px-4 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600"
              >
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function SocialMediaInformation({
  setShowSocialMediaModal,
  openEditSocialMediaModal,
  hiddenSocialMediaFields,
  editingSocialMediaLabels,
  editingSocialMediaPlaceholders,
  updateFormData,
  formData,
  setHiddenSocialMediaFields,
  socialMediaCustomFields,
  updateSocialMediaCustomFieldValue,

  removeSocialMediaCustomField,
  showEditSocialMediaModal,
  setShowEditSocialMediaModal,
  setEditingSocialMediaLabels,
  setEditingSocialMediaPlaceholders,
  saveSocialMediaChanges
}: {
  setShowSocialMediaModal: React.Dispatch<React.SetStateAction<boolean>>;
  openEditSocialMediaModal: () => void;
  hiddenSocialMediaFields: Set<string>;
  editingSocialMediaLabels: any;
  editingSocialMediaPlaceholders: any;
  updateFormData: any;
  formData: any;
  setHiddenSocialMediaFields: (setter: (prev: Set<string>) => Set<string>) => void;
  socialMediaCustomFields: Array<{ id: string, label: string, placeholder: string, value: string, required: boolean }>;
  updateSocialMediaCustomFieldValue: (id: string, value: string) => void;

  removeSocialMediaCustomField: (id: string) => void;
  showEditSocialMediaModal: boolean;
  setShowEditSocialMediaModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingSocialMediaLabels: React.Dispatch<React.SetStateAction<any>>;
  setEditingSocialMediaPlaceholders: React.Dispatch<React.SetStateAction<any>>;
  saveSocialMediaChanges: () => void;
}) {

  const hideSocialMediaField = (fieldName: string) => {
    setHiddenSocialMediaFields((prev: Set<string>) => new Set([...prev, fieldName]))
  }

  return (
    <>
      <div className="p-3 bg-amber-200 rounded-lg border border-amber-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="flex items-center text-sm font-bold text-amber-900">
            <Globe className="mr-2 w-5 h-5" />
            Social Media Links (Optional)
          </h3>
          <div className="flex space-x-2">
            <button onClick={() => setShowSocialMediaModal(true)} className="p-1 rounded hover:bg-amber-300" title="Add New Field">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button onClick={openEditSocialMediaModal} className="p-1 rounded hover:bg-amber-300" title="Edit Social Media Information">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.586a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {!hiddenSocialMediaFields.has('linkedin') && (
              <div className="relative">
                <FormInput
                  label={editingSocialMediaLabels.linkedin}
                  type="url"
                  value={formData.socialLinks?.linkedin || ''}
                  onChange={(value) => updateFormData({
                    socialLinks: { ...formData.socialLinks, linkedin: value }
                  })}
                  placeholder={editingSocialMediaPlaceholders.linkedin || "https://linkedin.com/company/yourcompany"}
                />
                <button
                  onClick={() => hideSocialMediaField('linkedin')}
                  className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                  title="Remove field"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            {!hiddenSocialMediaFields.has('facebook') && (
              <div className="relative">
                <FormInput
                  label={editingSocialMediaLabels.facebook}
                  type="url"
                  value={formData.socialLinks?.facebook || ''}
                  onChange={(value) => updateFormData({
                    socialLinks: { ...formData.socialLinks, facebook: value }
                  })}
                  placeholder={editingSocialMediaPlaceholders.facebook || "https://facebook.com/yourcompany"}
                />
                <button
                  onClick={() => hideSocialMediaField('facebook')}
                  className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                  title="Remove field"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {!hiddenSocialMediaFields.has('instagram') && (
              <div className="relative">
                <FormInput
                  label={editingSocialMediaLabels.instagram}
                  type="url"
                  value={formData.socialLinks?.instagram || ''}
                  onChange={(value) => updateFormData({
                    socialLinks: { ...formData.socialLinks, instagram: value }
                  })}
                  placeholder={editingSocialMediaPlaceholders.instagram || "https://instagram.com/yourcompany"}
                />
                <button
                  onClick={() => hideSocialMediaField('instagram')}
                  className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                  title="Remove field"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            {!hiddenSocialMediaFields.has('twitter') && (
              <div className="relative">
                <FormInput
                  label={editingSocialMediaLabels.twitter}
                  type="url"
                  value={formData.socialLinks?.twitter || ''}
                  onChange={(value) => updateFormData({
                    socialLinks: { ...formData.socialLinks, twitter: value }
                  })}
                  placeholder={editingSocialMediaPlaceholders.twitter || "https://twitter.com/yourcompany"}
                />
                <button
                  onClick={() => hideSocialMediaField('twitter')}
                  className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                  title="Remove field"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {!hiddenSocialMediaFields.has('youtube') && (
              <div className="relative">
                <FormInput
                  label={editingSocialMediaLabels.youtube}
                  type="url"
                  value={formData.socialLinks?.youtube || ''}
                  onChange={(value) => updateFormData({
                    socialLinks: { ...formData.socialLinks, youtube: value }
                  })}
                  placeholder={editingSocialMediaPlaceholders.youtube || "https://youtube.com/@yourcompany"}
                />
                <button
                  onClick={() => hideSocialMediaField('youtube')}
                  className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                  title="Remove field"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            {!hiddenSocialMediaFields.has('supportEmail') && (
              <div className="relative">
                <FormInput
                  label={editingSocialMediaLabels.supportEmail}
                  type="email"
                  value={formData.supportEmail || ''}
                  onChange={(value) => updateFormData({ supportEmail: value })}
                  placeholder={editingSocialMediaPlaceholders.supportEmail || "support@company.com"}
                />
                <button
                  onClick={() => hideSocialMediaField('supportEmail')}
                  className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                  title="Remove field"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {!hiddenSocialMediaFields.has('supportContactNumber') && (
              <div className="relative">
                <FormInput
                  label={editingSocialMediaLabels.supportContactNumber}
                  type="tel"
                  value={formData.supportContactNumber || ''}
                  onChange={(value) => updateFormData({ supportContactNumber: value })}
                  placeholder={editingSocialMediaPlaceholders.supportContactNumber || "+919876543210"}
                />
                <button
                  onClick={() => hideSocialMediaField('supportContactNumber')}
                  className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                  title="Remove field"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            {!hiddenSocialMediaFields.has('whatsappNumber') && (
              <div className="relative">
                <FormInput
                  label={editingSocialMediaLabels.whatsappNumber}
                  type="tel"
                  value={formData.whatsappNumber || ''}
                  onChange={(value) => updateFormData({ whatsappNumber: value })}
                  placeholder={editingSocialMediaPlaceholders.whatsappNumber || "+91XXXXXXXXXX"}
                />
                <button
                  onClick={() => hideSocialMediaField('whatsappNumber')}
                  className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700"
                  title="Remove field"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Social Media Custom Fields */}
        {
          socialMediaCustomFields.length > 0 && (
            <div className="mt-4 space-y-3">
              {/* <h4 className="text-sm font-semibold text-amber-800">Custom Social Media Fields</h4> */}
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {socialMediaCustomFields.map((field) => (
                  <div key={field.id} className="relative">
                    <FormInput
                      label={field.label}
                      required={field.required}
                      value={field.value}
                      onChange={(value) => updateSocialMediaCustomFieldValue(field.id, value)}
                      placeholder={field.placeholder}
                    />
                    <div className="flex absolute top-0 right-0 space-x-1">

                      <button
                        onClick={() => removeSocialMediaCustomField(field.id)}
                        className="p-1 text-red-500 rounded hover:text-red-700 hover:bg-red-50"
                        title="Delete Field"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      </div>

      {/* Edit Social Media Information Modal */}
      {showEditSocialMediaModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
          <div className="p-6 mx-4 w-full max-w-4xl max-h-[300px] overflow-auto bg-white rounded-lg shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Edit Social Media Information</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingSocialMediaLabels.linkedin}
                    onChange={(e) => setEditingSocialMediaLabels(prev => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="e.g., LinkedIn Profile"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingSocialMediaPlaceholders.linkedin}
                    onChange={(e) => setEditingSocialMediaPlaceholders(prev => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="https://linkedin.com/company/yourcompany"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingSocialMediaLabels.facebook}
                    onChange={(e) => setEditingSocialMediaLabels(prev => ({ ...prev, facebook: e.target.value }))}
                    placeholder="e.g., Facebook Page"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingSocialMediaPlaceholders.facebook}
                    onChange={(e) => setEditingSocialMediaPlaceholders(prev => ({ ...prev, facebook: e.target.value }))}
                    placeholder="https://facebook.com/yourcompany"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingSocialMediaLabels.instagram}
                    onChange={(e) => setEditingSocialMediaLabels(prev => ({ ...prev, instagram: e.target.value }))}
                    placeholder="e.g., Instagram Profile"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingSocialMediaPlaceholders.instagram}
                    onChange={(e) => setEditingSocialMediaPlaceholders(prev => ({ ...prev, instagram: e.target.value }))}
                    placeholder="https://instagram.com/yourcompany"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingSocialMediaLabels.twitter}
                    onChange={(e) => setEditingSocialMediaLabels(prev => ({ ...prev, twitter: e.target.value }))}
                    placeholder="e.g., Twitter/X Profile"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingSocialMediaPlaceholders.twitter}
                    onChange={(e) => setEditingSocialMediaPlaceholders(prev => ({ ...prev, twitter: e.target.value }))}
                    placeholder="https://twitter.com/yourcompany"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingSocialMediaLabels.youtube}
                    onChange={(e) => setEditingSocialMediaLabels(prev => ({ ...prev, youtube: e.target.value }))}
                    placeholder="e.g., YouTube Channel"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingSocialMediaPlaceholders.youtube}
                    onChange={(e) => setEditingSocialMediaPlaceholders(prev => ({ ...prev, youtube: e.target.value }))}
                    placeholder="https://youtube.com/@yourcompany"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingSocialMediaLabels.supportEmail}
                    onChange={(e) => setEditingSocialMediaLabels(prev => ({ ...prev, supportEmail: e.target.value }))}
                    placeholder="e.g., Support Email"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingSocialMediaPlaceholders.supportEmail}
                    onChange={(e) => setEditingSocialMediaPlaceholders(prev => ({ ...prev, supportEmail: e.target.value }))}
                    placeholder="support@company.com"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingSocialMediaLabels.supportContactNumber}
                    onChange={(e) => setEditingSocialMediaLabels(prev => ({ ...prev, supportContactNumber: e.target.value }))}
                    placeholder="e.g., Support Contact Number"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingSocialMediaPlaceholders.supportContactNumber}
                    onChange={(e) => setEditingSocialMediaPlaceholders(prev => ({ ...prev, supportContactNumber: e.target.value }))}
                    placeholder="+919876543210"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingSocialMediaLabels.whatsappNumber}
                    onChange={(e) => setEditingSocialMediaLabels(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                    placeholder="e.g., WhatsApp Number"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <label className="block mt-2 mb-1 text-sm font-medium text-gray-700">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingSocialMediaPlaceholders.whatsappNumber}
                    onChange={(e) => setEditingSocialMediaPlaceholders(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                    placeholder="+91XXXXXXXXXX"
                    className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowEditSocialMediaModal(false)}
                className="px-4 py-2 text-gray-600 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveSocialMediaChanges}
                className="px-4 py-2 text-white bg-amber-500 rounded-md hover:bg-amber-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}