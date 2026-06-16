import React, { useState, useEffect } from "react";
import { FormStep } from "../FormStep";
import { FormInput } from "../FormInput";
import { StepProps } from "../../types/form";
import { Plus, Minus, Package, Wrench, X, Grid } from "lucide-react";

interface SectionItem {
  title: string;
  description?: string;
  placeholder?: string;
  descriptionLabel?: string;
  descriptionPlaceholder?: string;
}

interface CustomSection {
  id: string;
  heading?: string;
  title: string;
  icon?: string; // store serializable icon key, not React element
  label?: string;
  placeholder?: string;
  items: SectionItem[];
}

const SERVICES_API_BASE = "https://rlexs1v7m8.execute-api.ap-south-1.amazonaws.com/Products_and_Services/Services";
const PRODUCTS_API_BASE = "https://rlexs1v7m8.execute-api.ap-south-1.amazonaws.com/Products_and_Services/Products";
const CUSTOM_API_BASE = "https://rlexs1v7m8.execute-api.ap-south-1.amazonaws.com/Products_and_Services/custom";

const Step5ProductsServices: React.FC<StepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isValid,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [isServicesTitleModalOpen, setIsServicesTitleModalOpen] = useState(false);
  const [servicesHeadingDraft, setServicesHeadingDraft] = useState<string>("");
  const [servicesLabelDraft, setServicesLabelDraft] = useState<string>("");
  const [servicesPlaceholderDraft, setServicesPlaceholderDraft] = useState<string>("");
  const [isCustomSectionModalOpen, setIsCustomSectionModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [customSectionHeadingDraft, setCustomSectionHeadingDraft] = useState<string>("");
  const [customSectionLabelDraft, setCustomSectionLabelDraft] = useState<string>("");
  const [customSectionPlaceholderDraft, setCustomSectionPlaceholderDraft] = useState<string>("");
  const [isProductsTitleModalOpen, setIsProductsTitleModalOpen] = useState(false);
  const [productsHeadingDraft, setProductsHeadingDraft] = useState<string>("");
  const [productsLabelDraft, setProductsLabelDraft] = useState<string>("");
  const [productsPlaceholderDraft, setProductsPlaceholderDraft] = useState<string>("");
  const [isServiceItemModalOpen, setIsServiceItemModalOpen] = useState(false);
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [servicePlaceholderDraft, setServicePlaceholderDraft] = useState<string>("");
  const [serviceDescLabelDraft, setServiceDescLabelDraft] = useState<string>("");
  const [serviceDescPlaceholderDraft, setServiceDescPlaceholderDraft] = useState<string>("");
  const [isProductItemModalOpen, setIsProductItemModalOpen] = useState(false);
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null);
  const [productPlaceholderDraft, setProductPlaceholderDraft] = useState<string>("");
  const [productDescLabelDraft, setProductDescLabelDraft] = useState<string>("");
  const [productDescPlaceholderDraft, setProductDescPlaceholderDraft] = useState<string>("");
  const [isItemEditModalOpen, setIsItemEditModalOpen] = useState(false);
  const [editingItemSectionId, setEditingItemSectionId] = useState<string | null>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [itemDescDraft, setItemDescDraft] = useState<string>("");
  const [itemPlaceholderDraft, setItemPlaceholderDraft] = useState<string>("");
  const [itemDescLabelDraft, setItemDescLabelDraft] = useState<string>("");
  const [isSavingProductsSection, setIsSavingProductsSection] = useState<boolean>(false);
  const [isSavingProductItem, setIsSavingProductItem] = useState<boolean>(false);
  const [isSavingServiceItem, setIsSavingServiceItem] = useState<boolean>(false);
  const [isSavingCustomSection, setIsSavingCustomSection] = useState<boolean>(false);
  const [customSectionUpdateError, setCustomSectionUpdateError] = useState<string | null>(null);
  const [isSavingCustomItem, setIsSavingCustomItem] = useState<boolean>(false);

  // One-time cleanup: remove any old localStorage entries for this step
  useEffect(() => {
    try {
      localStorage.removeItem('servicesData');
      localStorage.removeItem('productsData');
      localStorage.removeItem('customSectionsData');
    } catch { }
  }, []);

  // Removed localStorage persistence for customSections
  useEffect(() => {
    // no-op
  }, [customSections]);

  // Save customSections to localStorage whenever it changes
  useEffect(() => {
    if (customSections.length > 0) {
      // no localStorage persistence
    } else {
      // Remove from localStorage if no sections
      // no localStorage persistence
    }
  }, [customSections]);

  // Removed localStorage services/products hydration
  useEffect(() => {
    // no-op
  }, []);

  // Update customSections when formData changes (but only if formData has sections)
  useEffect(() => {
    if (formData.sections && formData.sections.length > 0) {
      // Coerce any legacy ReactNode icon to string key
      const normalized = formData.sections.map((s: any) => ({
        id: s.id,
        heading: s.heading || s.title || '',
        title: s.title || '',
        icon: typeof s.icon === 'string' ? s.icon : 'grid',
        label: s.label || '',
        placeholder: s.placeholder || '',
        items: (s.items || []).map((it: any) => ({
          title: it.title || '',
          description: it.description || '',
          placeholder: it.placeholder || '',
          descriptionLabel: it.descriptionLabel || '',
          descriptionPlaceholder: it.descriptionPlaceholder || '',
        })),
      }));
      setCustomSections(normalized);
    }
  }, [formData.sections]);

  // Fetch services meta (heading/labels/placeholders) from API view and hydrate heading section
  useEffect(() => {
    const controller = new AbortController();
    const fetchMeta = async () => {
      try {
        const res = await fetch(`${SERVICES_API_BASE}/view`, { method: 'GET', signal: controller.signal });
        if (!res.ok) return;
        const json = await res.json();
        const record = Array.isArray(json) ? json[0] : (json && Array.isArray(json.data) ? json.data[0] : json);
        if (!record) return;

        // Prepare services list from API to hydrate placeholders if we don't have any yet
        const servicesFromApi = Array.isArray(record.services)
          ? record.services.map((s: any) => ({
            icon: s?.icon ?? 'service',
            title: '',
            placeholder: s?.placeholder ?? '',
            descriptionLabel: s?.descriptionLabel ?? '',
            descriptionPlaceholder: s?.descriptionPlaceholder ?? '',
          }))
          : [];

        const updates: any = {
          servicesHeading: record.servicesHeading || formData.servicesHeading || '',
          servicesLabel: record.servicesLabel || formData.servicesLabel || '',
          servicesPlaceholder: record.servicesPlaceholder || formData.servicesPlaceholder || '',
        };
        // If we already have services, only fill missing meta from API; don't override user input
        if (servicesFromApi.length > 0) {
          const existing = Array.isArray(formData.services) ? formData.services : [];
          if (existing.length === 0) {
            updates.services = servicesFromApi;
          } else {
            const merged = existing.map((svc: any, i: number) => {
              const apiSvc = servicesFromApi[i];
              return {
                ...svc,
                placeholder: (svc?.placeholder && svc.placeholder.trim() !== '') ? svc.placeholder : (apiSvc?.placeholder ?? ''),
                descriptionLabel: (svc?.descriptionLabel && svc.descriptionLabel.trim() !== '') ? svc.descriptionLabel : (apiSvc?.descriptionLabel ?? ''),
                descriptionPlaceholder: (svc?.descriptionPlaceholder && svc.descriptionPlaceholder.trim() !== '') ? svc.descriptionPlaceholder : (apiSvc?.descriptionPlaceholder ?? ''),
              };
            });
            // If API had more items than existing, append the remaining with API placeholders
            if (servicesFromApi.length > existing.length) {
              merged.push(
                ...servicesFromApi.slice(existing.length)
              );
            }
            updates.services = merged;
          }
        }
        updateFormData(updates);
      } catch { }
    };
    fetchMeta();
    return () => controller.abort();
  }, []);

  // Fetch products meta (heading/labels/placeholders) from Products view API and hydrate
  useEffect(() => {
    const controller = new AbortController();
    const fetchProductsMeta = async () => {
      try {
        const res = await fetch(`${PRODUCTS_API_BASE}/view`, { method: 'GET', signal: controller.signal });
        if (!res.ok) return;
        const json = await res.json();
        const record = Array.isArray(json) ? json[0] : (json && Array.isArray(json.data) ? json.data[0] : json);
        if (!record) return;
        const productsFromApi = Array.isArray(record.products)
          ? record.products.map((p: any) => ({
            icon: p?.icon ?? 'product',
            title: '',
            placeholder: p?.placeholder ?? '',
            descriptionLabel: p?.descriptionLabel ?? '',
            descriptionPlaceholder: p?.descriptionPlaceholder ?? '',
          }))
          : [];

        const updates: any = {
          productsHeading: record.productsHeading ?? formData.productsHeading ?? '',
          productsLabel: record.productsLabel ?? formData.productsLabel ?? '',
          productsPlaceholder: record.productsPlaceholder ?? formData.productsPlaceholder ?? '',
        };

        if (productsFromApi.length > 0) {
          const existing = Array.isArray(formData.products) ? formData.products : [];
          if (existing.length === 0) {
            updates.products = productsFromApi;
          } else {
            const merged = existing.map((prod: any, i: number) => {
              const apiProd = productsFromApi[i];
              return {
                ...prod,
                placeholder: (prod?.placeholder && prod.placeholder.trim() !== '') ? prod.placeholder : (apiProd?.placeholder ?? ''),
                descriptionLabel: (prod?.descriptionLabel && prod.descriptionLabel.trim() !== '') ? prod.descriptionLabel : (apiProd?.descriptionLabel ?? ''),
                descriptionPlaceholder: (prod?.descriptionPlaceholder && prod.descriptionPlaceholder.trim() !== '') ? prod.descriptionPlaceholder : (apiProd?.descriptionPlaceholder ?? ''),
              };
            });
            if (productsFromApi.length > existing.length) {
              merged.push(...productsFromApi.slice(existing.length));
            }
            updates.products = merged;
          }
        }

        updateFormData(updates);
      } catch { }
    };
    fetchProductsMeta();
    return () => controller.abort();
  }, []);

  // Fetch all custom sections from API and hydrate list so multiple entries show
  useEffect(() => {
    const controller = new AbortController();
    const fetchCustomSections = async () => {
      try {
        const res = await fetch(`${CUSTOM_API_BASE}/view`, { method: 'GET', signal: controller.signal });
        if (!res.ok) return;
        const json = await res.json();
        const list = Array.isArray(json) ? json : (json && Array.isArray(json.data) ? json.data : []);
        const mapped: CustomSection[] = (list || []).map((r: any) => ({
          id: r?.id || `${Date.now()}-${Math.random()}`,
          heading: r?.customHeading || '',
          title: r?.customHeading || '',
          icon: 'grid',
          label: r?.customLabel || '',
          placeholder: r?.customPlaceholder || '',
          items: Array.isArray(r?.custom)
            ? r.custom.map((it: any) => ({
              title: it?.title || '',
              placeholder: it?.placeholder || '',
              description: '',
              descriptionLabel: it?.descriptionLabel || '',
              descriptionPlaceholder: it?.descriptionPlaceholder || '',
            }))
            : [],
        }));
        setCustomSections(mapped);
        updateFormData({ sections: mapped });
      } catch { }
    };
    fetchCustomSections();
    return () => controller.abort();
  }, []);

  // Removed server update function after removing Update action
  // const updateServicesOnServer = async () => {};

  // --- Product / Service handlers ---
  const openServicesTitleModal = () => {
    setServicesHeadingDraft(formData.servicesHeading || "");
    setServicesLabelDraft(formData.servicesLabel || "");
    setServicesPlaceholderDraft(formData.servicesPlaceholder || "");
    setIsServicesTitleModalOpen(true);
  };

  const saveServicesMeta = () => {
    const heading = (servicesHeadingDraft || "").trim();
    const label = (servicesLabelDraft || "").trim();
    const placeholder = (servicesPlaceholderDraft || "").trim();

    updateFormData({
      servicesHeading: heading,
      servicesLabel: label,
      servicesPlaceholder: placeholder,
    });

    const servicesData: any = {
      services: formData.services,
      servicesHeading: heading,
      servicesLabel: label,
      servicesPlaceholder: placeholder,
    };
    if (formData.servicesTitle && formData.servicesTitle.trim() !== '') {
      servicesData.servicesTitle = formData.servicesTitle;
    }
    // no localStorage persistence

    setIsServicesTitleModalOpen(false);
  };

  const deleteServicesSection = () => {
    // Hide the entire Services block and clear its data
    updateFormData({
      showServicesSection: false,
      services: [],
      servicesTitle: '',
      servicesHeading: '',
      servicesLabel: '',
      servicesPlaceholder: '',
    });
  };

  const cancelServicesTitleEdit = () => {
    setServicesHeadingDraft("");
    setServicesLabelDraft("");
    setServicesPlaceholderDraft("");
    setIsServicesTitleModalOpen(false);
  };

  const focusField = (fieldId: string) => {
    try {
      const el = document.getElementById(fieldId) as HTMLInputElement | HTMLTextAreaElement | null;
      el?.focus();
    } catch { }
  };

  const [isSavingServicesSection, setIsSavingServicesSection] = useState<boolean>(false);
  const updateServicesSectionOnServer = async (payload: {
    servicesHeading?: string;
    servicesLabel?: string;
    servicesPlaceholder?: string;
  }) => {
    setIsSavingServicesSection(true);
    try {
      const body = {
        servicesHeading: payload.servicesHeading ?? formData.servicesHeading ?? '',
        servicesLabel: payload.servicesLabel ?? formData.servicesLabel ?? '',
        servicesPlaceholder: payload.servicesPlaceholder ?? formData.servicesPlaceholder ?? '',
      };
      const res = await fetch(`${SERVICES_API_BASE}/update-section`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify(body),
      });
    } catch { } finally {
      setIsSavingServicesSection(false);
    }
  };

  const updateProductsSectionOnServer = async (payload: {
    productsHeading?: string;
    productsLabel?: string;
    productsPlaceholder?: string;
  }) => {
    setIsSavingProductsSection(true);
    try {
      const body = {
        productsHeading: payload.productsHeading ?? formData.productsHeading ?? '',
        productsLabel: payload.productsLabel ?? formData.productsLabel ?? '',
        productsPlaceholder: payload.productsPlaceholder ?? formData.productsPlaceholder ?? '',
      };
      const res = await fetch(`${PRODUCTS_API_BASE}/update-section`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify(body),
      });
    } catch { } finally {
      setIsSavingProductsSection(false);
    }
  };

  const openCustomSectionEditModal = (sectionId: string) => {
    const target = customSections.find((s) => s.id === sectionId);
    setEditingSectionId(sectionId);
    setCustomSectionHeadingDraft((target?.heading || ""));
    setCustomSectionLabelDraft(target?.label || "");
    setCustomSectionPlaceholderDraft(target?.placeholder || "");
    setIsCustomSectionModalOpen(true);
  };

  const saveCustomSectionHeading = () => {
    if (!editingSectionId) return;
    const newTitle = (customSectionHeadingDraft || "").trim();
    const newLabel = (customSectionLabelDraft || "").trim();
    const newPlaceholder = (customSectionPlaceholderDraft || "").trim();
    const updated = customSections.map((s) =>
      s.id === editingSectionId ? { ...s, heading: newTitle, label: newLabel, placeholder: newPlaceholder } : s
    );
    setCustomSections(updated);
    updateFormData({ sections: updated });
    setIsCustomSectionModalOpen(false);
    setEditingSectionId(null);
  };

  const deleteCustomSectionHeading = () => {
    if (!editingSectionId) return;
    const updated = customSections.map((s) =>
      s.id === editingSectionId ? { ...s, heading: "", label: "", placeholder: "" } : s
    );
    setCustomSections(updated);
    updateFormData({ sections: updated });
    setIsCustomSectionModalOpen(false);
    setEditingSectionId(null);
    setCustomSectionHeadingDraft("");
    setCustomSectionLabelDraft("");
    setCustomSectionPlaceholderDraft("");
  };

  const cancelCustomSectionEdit = () => {
    setIsCustomSectionModalOpen(false);
    setEditingSectionId(null);
    setCustomSectionHeadingDraft("");
    setCustomSectionLabelDraft("");
    setCustomSectionPlaceholderDraft("");
  };

  const openServiceItemModal = (index: number) => {
    const s = formData.services[index];
    setEditingServiceIndex(index);
    setServicePlaceholderDraft(s?.placeholder ?? "");
    setServiceDescLabelDraft(s?.descriptionLabel ?? "");
    setServiceDescPlaceholderDraft(s?.descriptionPlaceholder ?? "");
    setIsServiceItemModalOpen(true);
  };

  const saveServiceItemMeta = () => {
    if (editingServiceIndex === null) return;
    const updated = [...formData.services];
    updated[editingServiceIndex] = {
      ...updated[editingServiceIndex],
      placeholder: servicePlaceholderDraft,
      descriptionLabel: serviceDescLabelDraft,
      descriptionPlaceholder: serviceDescPlaceholderDraft,
    };
    updateFormData({ services: updated });
    setIsServiceItemModalOpen(false);
    setEditingServiceIndex(null);
  };

  const updateServiceItemOnServer = async () => {
    if (editingServiceIndex === null) return;
    setIsSavingServiceItem(true);
    try {
      const payload = {
        id: 'services',
        index: editingServiceIndex,
        item: {
          icon: 'service',
          placeholder: servicePlaceholderDraft ?? '',
          descriptionLabel: serviceDescLabelDraft ?? '',
          descriptionPlaceholder: serviceDescPlaceholderDraft ?? '',
        },
      };
      const res = await fetch(`${SERVICES_API_BASE}/update-item`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) {
};

export default Step5ProductsServices;
