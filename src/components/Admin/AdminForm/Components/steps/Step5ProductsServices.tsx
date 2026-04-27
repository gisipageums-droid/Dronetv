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
      console.log('[services] PUT /update-section →', body);
      const res = await fetch(`${SERVICES_API_BASE}/update-section`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify(body),
      });
      console.log('[services] PUT /update-section status:', res.status);
      try { const j = await res.clone().json(); console.log('[services] response json:', j); } catch { }
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
      console.log('[products] PUT /update-section →', body);
      const res = await fetch(`${PRODUCTS_API_BASE}/update-section`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify(body),
      });
      console.log('[products] PUT /update-section status:', res.status);
      try { const j = await res.clone().json(); console.log('[products] response json:', j); } catch { }
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
      console.log('[services] PUT update-item →', payload);
      const res = await fetch(`${SERVICES_API_BASE}/update-item`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('[services] update-item status:', res.status);
    } catch (e) {
      console.warn('Failed to call update-item API', e);
    } finally {
      setIsSavingServiceItem(false);
      // Persist to local state
      saveServiceItemMeta();
    }
  };

  const cancelServiceItemModal = () => {
    setIsServiceItemModalOpen(false);
    setEditingServiceIndex(null);
  };

  const openItemEditModal = (sectionId: string, index: number) => {
    const section = customSections.find((s) => s.id === sectionId);
    const item = section?.items[index];
    setEditingItemSectionId(sectionId);
    setEditingItemIndex(index);
    setItemDescDraft(item?.description || "");
    setItemPlaceholderDraft(item?.placeholder || "");
    setItemDescLabelDraft(item?.descriptionLabel || "");
    setIsItemEditModalOpen(true);

    // Hydrate from API details for this custom section id
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${CUSTOM_API_BASE}/details/${encodeURIComponent(sectionId)}`, {
          method: 'GET',
          signal: controller.signal,
        });
        if (!res.ok) return;
        const json = await res.json();
        const record = Array.isArray(json) ? json[0] : json?.data ? (Array.isArray(json.data) ? json.data[0] : json.data) : json;
        const arr = Array.isArray(record?.custom) ? record.custom : [];
        const apiItem = arr[index];
        if (!apiItem) return;
        setItemPlaceholderDraft(apiItem.placeholder ?? "");
        setItemDescLabelDraft(apiItem.descriptionLabel ?? "");
        setItemDescDraft(apiItem.descriptionPlaceholder ?? "");
      } catch { }
    })();
  };

  const saveItemEdit = () => {
    if (!editingItemSectionId || editingItemIndex === null) return;
    const updated = customSections.map((s) =>
      s.id === editingItemSectionId
        ? {
          ...s,
          items: s.items.map((it, i) =>
            i === editingItemIndex
              ? {
                ...it,
                // do not modify actual description here
                placeholder: itemPlaceholderDraft,
                descriptionLabel: itemDescLabelDraft,
                descriptionPlaceholder: itemDescDraft,
              }
              : it
          ),
        }
        : s
    );
    setCustomSections(updated);
    updateFormData({ sections: updated });
    setIsItemEditModalOpen(false);
    setEditingItemSectionId(null);
    setEditingItemIndex(null);
  };

  const cancelItemEdit = () => {
    setIsItemEditModalOpen(false);
    setEditingItemSectionId(null);
    setEditingItemIndex(null);
    setItemPlaceholderDraft("");
    setItemDescLabelDraft("");
  };
  const addService = async () => {
    const newItem = { icon: 'service', title: '', placeholder: '', descriptionLabel: '', descriptionPlaceholder: '' };
    try {
      const payload = { id: 'services', item: newItem } as const;
      console.log('[services] PUT add-item →', payload);
      const res = await fetch(`${SERVICES_API_BASE}/add-item`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('[services] add-item status:', res.status);
    } catch (e) {
      console.warn('Failed to call add-item API', e);
    } finally {
      const updatedServices = [...formData.services, newItem];
      updateFormData({ services: updatedServices });
    }
  };
  const updateService = (index: number, value: string) => {
    const newServices = [...formData.services];
    newServices[index].title = value;
    updateFormData({ services: newServices });
  };
  const updateServiceDescription = (index: number, value: string) => {
    const newServices = [...formData.services];
    newServices[index].description = value;
    updateFormData({ services: newServices });
  };

  const deleteServiceItem = async (index: number) => {
    try {
      const payload = { id: 'services', index } as const;
      console.log('[services] DELETE item →', payload);
      const res = await fetch(`${SERVICES_API_BASE}/delete-item`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('[services] delete-item status:', res.status);
    } catch (e) {
      console.warn('Failed to call delete-item API', e);
    } finally {
      const newServices = formData.services.filter((_, i) => i !== index);
      updateFormData({ services: newServices });
    }
  };

  const addProduct = async () => {
    const newItem = {
      title: '',
      icon: 'product',
      placeholder: 'New product',
      descriptionLabel: 'Product Description',
      descriptionPlaceholder: 'Short description...',
    };
    try {
      const payload = {
        id: 'products', appendProducts: {
          icon: 'product',
          placeholder: 'New product',
          descriptionPlaceholder: 'Short description...',
          descriptionLabel: 'Product Description',
        }
      } as const;
      console.log('[products] add-item →', payload);
      const res = await fetch(`${PRODUCTS_API_BASE}/add-item`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('[products] add-item status:', res.status);
    } catch (e) {
      console.warn('Failed to call products add-item API', e);
    } finally {
      updateFormData({ products: [...formData.products, newItem] });
    }
  };
  const removeProduct = async (index: number) => {
    try {
      const payload = { id: 'products', index } as const;
      console.log('[products] DELETE item →', payload);
      const res = await fetch(`${PRODUCTS_API_BASE}/delete-item`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('[products] delete-item status:', res.status);
    } catch (e) {
      console.warn('Failed to call products delete-item API', e);
    } finally {
      const newProducts = formData.products.filter((_, i) => i !== index);
      updateFormData({ products: newProducts });
    }
  };
  const updateProduct = (index: number, value: string) => {
    const newProducts = [...formData.products];
    newProducts[index].title = value;
    updateFormData({ products: newProducts });
  };
  const updateProductDescription = (index: number, value: string) => {
    const newProducts = [...formData.products];
    newProducts[index].description = value;
    updateFormData({ products: newProducts });
  };

  // --- Custom Section handlers ---
  const addCustomSection = (title?: string) => {
    const heading = (title || "").trim() || "";
    const slug = heading
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    const apiId = slug ? `custom-${slug}` : `custom-${Date.now()}`;

    const newSection = {
      id: apiId,
      title: heading,
      icon: "grid",
      label: "",
      placeholder: "e.g., Our custom",
      items: [
        { title: "", description: "", placeholder: "", descriptionLabel: "" },
      ],
    };

    const callApi = async () => {
      try {
        const payload = {
          customLabel: "",
          customHeading: heading,
          customPlaceholder: "e.g., Our custom",
          id: apiId,
          custom: [
            {
              icon: "",
              placeholder: "",
              title: "",
              descriptionPlaceholder: "",
              descriptionLabel: "",
            },
          ],
        } as const;
        console.log('[custom] POST /custom/add →', payload);
        await fetch('https://rlexs1v7m8.execute-api.ap-south-1.amazonaws.com/Products_and_Services/custom/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (e) {
        console.warn('Failed to call custom add API', e);
      } finally {
        const updatedSections = [...customSections, newSection];
        setCustomSections(updatedSections);
        updateFormData({ sections: updatedSections });
      }
    };
    void callApi();
  };

  const handleAddNewSection = () => {
    if (newSectionTitle.trim()) {
      addCustomSection(newSectionTitle.trim());
      setNewSectionTitle("");
    }
  };

  const removeCustomSection = async (id: string) => {
    // Find the section so we can resolve the API id
    const section = customSections.find((s) => s.id === id);
    const headingForSlug = (section?.title || (section as any)?.heading || '').toString();
    const slug = headingForSlug
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    const apiId = id.startsWith('custom-') ? id : (slug ? `custom-${slug}` : id);

    try {
      console.log('[custom] DELETE /custom/delete/id →', apiId);
      await fetch(`${CUSTOM_API_BASE}/delete/${encodeURIComponent(apiId)}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Failed to call custom delete API', e);
    } finally {
      const updatedSections = customSections.filter((s) => s.id !== id);
      setCustomSections(updatedSections);
      updateFormData({ sections: updatedSections });
    }
  };

  const updateCustomSectionTitle = (id: string, value: string) => {
    setCustomSections(
      customSections.map((s) => (s.id === id ? { ...s, title: value } : s))
    );
  };

  const addCustomItem = (id: string) => {
    setCustomSections(
      customSections.map((s) =>
        s.id === id
          ? { ...s, items: [...s.items, { title: "", description: "", placeholder: "" }] }
          : s
      )
    );
  };

  const removeCustomItem = (sectionId: string, index: number) => {
    setCustomSections(
      customSections.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.filter((_, i) => i !== index) }
          : s
      )
    );
  };

  const updateCustomItem = (
    sectionId: string,
    index: number,
    field: "title" | "description" | "placeholder",
    value: string
  ) => {
    setCustomSections(
      customSections.map((s) =>
        s.id === sectionId
          ? {
            ...s,
            items: s.items.map((item, i) =>
              i === index ? { ...item, [field]: value } : item
            ),
          }
          : s
      )
    );
  };

  const handleSaveModal = () => {
    updateFormData({ sections: customSections });

    // no localStorage persistence

    setIsModalOpen(false);
  };

  // Function to clear all localStorage data for this step
  // (Removed) clearAllData helper was unused

  const saveProductsMeta = () => {
    updateFormData({
      productsHeading: (productsHeadingDraft || '').trim(),
      productsLabel: (productsLabelDraft || '').trim(),
      productsPlaceholder: (productsPlaceholderDraft || '').trim(),
    });
    setIsProductsTitleModalOpen(false);
  };

  const saveProductItemMeta = () => {
    if (editingProductIndex === null) return;
    const updated = [...formData.products];
    updated[editingProductIndex] = {
      ...updated[editingProductIndex],
      placeholder: productPlaceholderDraft,
      descriptionLabel: productDescLabelDraft,
      descriptionPlaceholder: productDescPlaceholderDraft,
    };
    updateFormData({ products: updated });
    setIsProductItemModalOpen(false);
    setEditingProductIndex(null);
  };

  const updateProductItemOnServer = async () => {
    if (editingProductIndex === null) return;
    setIsSavingProductItem(true);
    try {
      const payload = {
        id: 'products',
        index: editingProductIndex,
        item: {
          icon: 'product',
          placeholder: productPlaceholderDraft ?? '',
          descriptionLabel: productDescLabelDraft ?? '',
          descriptionPlaceholder: productDescPlaceholderDraft ?? '',
        },
      };
      console.log('[products] PUT update-item →', payload);
      const res = await fetch(`${PRODUCTS_API_BASE}/update-item`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('[products] update-item status:', res.status);
    } catch (e) {
      console.warn('Failed to call products update-item API', e);
    } finally {
      setIsSavingProductItem(false);
      saveProductItemMeta();
    }
  };

  const updateCustomSectionOnServer = async () => {
    if (!editingSectionId) return;
    setIsSavingCustomSection(true);
    setCustomSectionUpdateError(null);
    try {
      const payload = {
        id: editingSectionId,
        customHeading: (customSectionHeadingDraft || '').trim(),
        customLabel: (customSectionLabelDraft || '').trim(),
        customPlaceholder: (customSectionPlaceholderDraft || '').trim(),
      };
      console.log('[custom] PUT /update-section →', payload);
      const res = await fetch(`${CUSTOM_API_BASE}/update-section`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify(payload),
      });
      console.log('[custom] update-section status:', res.status);
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Update failed (${res.status})`);
      }
    } catch (e: any) {
      console.warn('Failed to call custom update-section API', e);
      setCustomSectionUpdateError(e?.message || 'Failed to update custom section');
    } finally {
      setIsSavingCustomSection(false);
      if (!customSectionUpdateError) {
        // persist locally on success
        saveCustomSectionHeading();
      }
    }
  };

  const updateCustomItemOnServer = async () => {
    if (!editingItemSectionId || editingItemIndex === null) return;
    setIsSavingCustomItem(true);
    try {
      const payload = {
        id: editingItemSectionId,
        listKey: 'custom',
        index: editingItemIndex,
        item: {
          icon: '',
          placeholder: itemPlaceholderDraft ?? '',
          title: '',
          descriptionPlaceholder: itemDescDraft ?? '',
          descriptionLabel: itemDescLabelDraft ?? '',
        },
      };
      console.log('[custom] PUT update-item →', payload);
      const res = await fetch(`${CUSTOM_API_BASE}/update-item`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('[custom] update-item status:', res.status);
    } catch (e) {
      console.warn('Failed to call custom update-item API', e);
    } finally {
      setIsSavingCustomItem(false);
      saveItemEdit();
    }
  };

  return (
    <>
      <FormStep
        title="Products & Services"
        description="List your main services and products in simple terms"
        onNext={onNext}
        onPrev={onPrev}
        isValid={isValid}
        currentStep={4}
        totalSteps={6}
      >
        {/* Removed global Edit Sections button as requested */}
        <div className="relative space-y-6">
          {/* Services Section */}
          {formData.showServicesSection !== false && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="flex items-center mb-2 text-sm font-bold text-blue-900">
                  <Wrench className="mr-2 w-5 h-5" />
                  {(formData.servicesHeading || 'Services').trim() || 'Services'}
                </h3>
                <div className="flex gap-2 items-center">
                  <button
                    type="button"
                    onClick={openServicesTitleModal}
                    className="inline-flex gap-1 items-center px-2 py-1 text-xs rounded-lg border hover:bg-white"
                  >
                    Edit me
                  </button>
                  <button
                    type="button"
                    onClick={deleteServicesSection}
                    className="p-1 text-red-600 rounded-md border hover:bg-red-50"
                    title="Delete services section"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mb-2">
                <FormInput
                  label={(formData.servicesLabel || 'What do you call your services section?').trim() || 'What do you call your services section?'}
                  value={formData.servicesTitle}
                  onChange={(val) => {
                    updateFormData({ servicesTitle: val });
                  }}
                  required
                  placeholder={(formData.servicesPlaceholder || 'e.g., Our Services').trim() || 'e.g., Our Services'}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-semibold text-blue-800">
                    List your main services:
                  </h4>
                  <button
                    type="button"
                    onClick={addService}
                    className="flex items-center px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    <Plus className="mr-2 w-4 h-4" /> Add Service
                  </button>
                </div>
                {formData.services.map((service, index) => (
                  <div key={index} className="p-2 bg-white rounded-md border">
                    <div className="flex gap-2 items-center mb-2">
                      <div className="flex-1">
                        <FormInput
                          label=""
                          value={service.title}
                          onChange={(value) => updateService(index, value)}
                          placeholder={service.placeholder || "e.g., Drone Photography, AI Consulting"}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => openServiceItemModal(index)}
                        className="px-2 py-1 text-xs rounded-md border hover:bg-slate-50"
                        title="Edit item"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteServiceItem(index)}
                        className="p-1 text-red-600 rounded-md hover:bg-red-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                    <FormInput
                      label={service.descriptionLabel || "Service Description (max 200 characters)"}
                      type="textarea"
                      value={service.description || ""}
                      onChange={(value) => {
                        if (value.length <= 200)
                          updateServiceDescription(index, value);
                      }}
                      placeholder={service.descriptionPlaceholder || "Brief description of this service..."}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products Section */}
          {formData.showProductsSection !== false && (
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="flex items-center mb-2 text-sm font-bold text-green-900">
                  <Package className="mr-2 w-5 h-5" />
                  {(formData.productsHeading || 'Products').trim() || 'Products'}
                </h3>
                <div className="flex gap-2 items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setProductsHeadingDraft(formData.productsHeading || "");
                      setProductsLabelDraft(formData.productsLabel || "");
                      setProductsPlaceholderDraft(formData.productsPlaceholder || "");
                      setIsProductsTitleModalOpen(true);
                    }}
                    className="inline-flex gap-1 items-center px-2 py-1 text-xs rounded-lg border hover:bg-white"
                  >
                    Edit me
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateFormData({
                        showProductsSection: false,
                        products: [],
                        productsTitle: '',
                        productsHeading: '',
                        productsLabel: '',
                        productsPlaceholder: '',
                      });
                    }}
                    className="p-1 text-red-600 rounded-md border hover:bg-red-50"
                    title="Delete products section"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mb-2">
                <FormInput
                  label={(formData.productsLabel || 'What do you call your products section?').trim() || 'What do you call your products section?'}
                  value={formData.productsTitle}
                  onChange={(value) => updateFormData({ productsTitle: value })}
                  required
                  placeholder={(formData.productsPlaceholder || 'e.g., Our Products').trim() || 'e.g., Our Products'}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-semibold text-green-800">
                    List your main products:
                  </h4>
                  <button
                    type="button"
                    onClick={addProduct}
                    className="flex items-center px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    <Plus className="mr-2 w-4 h-4" /> Add Product
                  </button>
                </div>
                {formData.products.map((product, index) => (
                  <div key={index} className="p-2 bg-white rounded-md border">
                    <div className="flex gap-2 items-center mb-2">
                      <div className="flex-1">
                        <FormInput
                          label=""
                          value={product.title}
                          onChange={(value) => updateProduct(index, value)}
                          placeholder={product.placeholder || "e.g., Professional Drone X1"}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProductIndex(index);
                          const p = formData.products[index];
                          setProductPlaceholderDraft(p?.placeholder || '');
                          setProductDescLabelDraft(p?.descriptionLabel || 'Product Description (max 200 characters)');
                          setProductDescPlaceholderDraft(p?.descriptionPlaceholder || 'Brief description of this product...');
                          setIsProductItemModalOpen(true);
                        }}
                        className="px-2 py-1 text-xs rounded-md border hover:bg-slate-50"
                        title="Edit item"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeProduct(index)}
                        className="p-1 text-red-600 rounded-md hover:bg-red-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                    <FormInput
                      label={product.descriptionLabel || "Product Description (max 200 characters)"}
                      type="textarea"
                      value={product.description || ""}
                      onChange={(value) => {
                        if (value.length <= 200)
                          updateProductDescription(index, value);
                      }}
                      placeholder={product.descriptionPlaceholder || "Brief description of this product..."}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Custom Section */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">Add New Custom Section</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <FormInput
                    label="Section Title"
                    value={newSectionTitle}
                    onChange={(value) => setNewSectionTitle(value)}
                    placeholder="Enter section title"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddNewSection}
                  disabled={!newSectionTitle.trim()}
                  className="flex items-center px-4 py-2 mt-6 text-sm text-white bg-purple-600 rounded-md transition-colors hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Plus className="mr-1 w-4 h-4" /> Add Section
                </button>
              </div>
            </div>
          </div>

          {/* Custom Sections Display removed as requested */}

          {/* Custom Sections */}
          {customSections.map((section) => (
            <div
              key={section.id}
              className="p-3 space-y-3 bg-purple-50 rounded-lg border border-purple-200"
            >
              {/* Header: Title + Edit button */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="flex gap-2 items-center text-sm font-bold text-purple-900">
                  {section.icon === 'grid' ? (
                    <Grid className="w-5 h-5 text-purple-600" />
                  ) : (
                    <span className="w-5 h-5 bg-purple-300 rounded-full" />
                  )}
                  {(section.heading || 'Custom Section')}
                </h3>
                <div className="flex gap-2 items-center">
                  <button
                    type="button"
                    onClick={() => openCustomSectionEditModal(section.id)}
                    className="inline-flex gap-1 items-center px-2 py-1 text-xs rounded-lg border hover:bg-white"
                  >
                    Edit me
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCustomSection(section.id)}
                    className="p-1 text-red-600 rounded-md border hover:bg-red-50"
                    title="Remove section"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Section Name Input */}
              <div className="mb-2">
                <FormInput
                  label={(section.label || `What do you call your ${section.heading || "custom"} section?`)}
                  value={section.title}
                  onChange={(value) => {
                    setCustomSections(
                      customSections.map((s) => (s.id === section.id ? { ...s, title: value } : s))
                    );
                  }}
                  placeholder={(section.placeholder || `e.g., ${section.heading || "Custom Section"}`)}
                  required
                />
              </div>

              {/* List heading + Add Item button (right-aligned) */}
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-semibold text-purple-800">
                  List your main {section.heading || "custom"} section:
                </h4>
                <button
                  type="button"
                  onClick={() => addCustomItem(section.id)}
                  className="flex items-center px-3 py-1 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700"
                >
                  <Plus className="mr-2 w-4 h-4" /> Add Item
                </button>
              </div>

              {/* Section Items */}
              <div className="space-y-2">
                {section.items.map((item, idx) => {
                  const inputId = `custom-item-${section.id}-${idx}`;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col gap-2 p-2 bg-white rounded-md border"
                    >
                      <div className="flex gap-2 items-center">
                        {/* Item Title */}
                        <div className="flex-1">
                          <FormInput
                            id={inputId}
                            label=""
                            value={item.title}
                            onChange={(value) =>
                              updateCustomItem(section.id, idx, "title", value)
                            }
                            placeholder={item.placeholder || `e.g., ${section.heading || "Custom Item"}`}
                          />
                        </div>
                        {/* Edit Item Button */}
                        <button
                          type="button"
                          onClick={() => openItemEditModal(section.id, idx)}
                          className="px-2 py-1 text-xs rounded-md border hover:bg-slate-50"
                          title="Edit item"
                        >
                          Edit
                        </button>
                        {/* Remove Item Button */}
                        <button
                          type="button"
                          onClick={() => removeCustomItem(section.id, idx)}
                          className="p-1 text-red-600 rounded-md hover:bg-red-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                      {/* Item Description */}
                      <FormInput
                        label={item.descriptionLabel || `Item Description (max 200 characters)`}
                        type="textarea"
                        value={item.description || ""}
                        onChange={(value) =>
                          updateCustomItem(section.id, idx, "description", value)
                        }
                        rows={2}
                        placeholder={item.descriptionPlaceholder || "Brief description of this item..."}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Add Item Button moved to header above */}
            </div>
          ))}
        </div>
      </FormStep>

      {/* Modal */}
      {isModalOpen && (
        <div className="flex overflow-auto fixed inset-0 z-50 justify-center items-start p-4 bg-purple-900 bg-opacity-30 backdrop-blur-sm">
          <div className="p-5 mt-8 w-full max-w-3xl bg-white rounded-lg border border-purple-100 shadow-lg animate-fade-in">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-purple-800">Custom Sections</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              {customSections.map((section) => (
                <div
                  key={section.id}
                  className="p-4 bg-purple-50 rounded-md border border-purple-200"
                >
                  <div className="flex gap-2 justify-between items-start mb-3">
                    <div className="flex-grow">
                      <FormInput
                        label="Section Title"
                        value={section.title}
                        onChange={(value) =>
                          updateCustomSectionTitle(section.id, value)
                        }
                        placeholder="Section title"
                      />
                    </div>
                    <button
                      onClick={() => removeCustomSection(section.id)}
                      className="p-1.5 text-purple-500 hover:text-purple-700 hover:bg-purple-100 rounded-md transition-colors mt-1"
                      title="Remove section"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mb-3 space-y-2">
                    {section.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white rounded-md border border-purple-100"
                      >
                        <div className="flex gap-2 mb-2">
                          <div className="flex-grow">
                            <FormInput
                              label="Item Title"
                              value={item.title}
                              onChange={(value) =>
                                updateCustomItem(section.id, idx, "title", value)
                              }
                              placeholder="Item title"
                            />
                          </div>
                          <button
                            onClick={() => removeCustomItem(section.id, idx)}
                            className="p-1.5 text-purple-500 hover:text-purple-700 hover:bg-purple-100 rounded-md transition-colors self-start"
                            title="Remove item"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                        <FormInput
                          label="Description"
                          type="textarea"
                          value={item.description || ""}
                          onChange={(value) =>
                            updateCustomItem(
                              section.id,
                              idx,
                              "description",
                              value
                            )
                          }
                          placeholder="Description..."
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => addCustomItem(section.id)}
                    className="flex items-center px-3 py-1.5 text-sm text-purple-700 hover:text-purple-900 hover:bg-purple-100 rounded-md transition-colors border border-purple-200"
                  >
                    <Plus className="w-4 h-4 mr-1.5" /> Add Item
                  </button>
                </div>
              ))}

              <button
                onClick={() => addCustomSection()}
                className="flex items-center justify-center w-full px-4 py-2.5 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Add New Section
              </button>
            </div>

            <div className="flex gap-2 justify-end pt-4 mt-6 border-t border-purple-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm text-purple-700 rounded-md border border-purple-200 transition-colors hover:text-purple-900 hover:bg-purple-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="px-4 py-2 text-sm text-white bg-purple-600 rounded-md shadow-sm transition-colors hover:bg-purple-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Item Edit Modal */}
      {isServiceItemModalOpen && (
        <div className="flex overflow-auto fixed inset-0 z-50 justify-center items-start p-4 backdrop-blur-sm bg-black/30">
          <div className="p-5 mt-12 w-full max-w-xl bg-white rounded-lg border border-blue-100 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="flex items-center text-lg font-semibold text-blue-800">Edit service item</h2>
              <button
                onClick={cancelServiceItemModal}
                className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                aria-label="Close service item modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-3">
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <FormInput
                    label="Input placeholder"
                    value={servicePlaceholderDraft}
                    onChange={setServicePlaceholderDraft}
                    placeholder="e.g., Drone Photography, AI Consulting"
                  />
                </div>
                <div className="flex gap-1 mt-6">
                  <button
                    type="button"
                    onClick={() => { }}
                    className="px-2 py-1 text-xs rounded-md border hover:bg-slate-50"
                    title="Edit placeholder"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={updateServiceItemOnServer}
                    disabled={isSavingServiceItem}
                    className={`px-2 py-1 text-xs rounded-md ${isSavingServiceItem ? 'text-white bg-blue-300 cursor-not-allowed' : 'text-white bg-blue-600 hover:bg-blue-700'}`}
                    title="Save placeholder"
                  >
                    {isSavingServiceItem ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <FormInput
                    label="Description label"
                    value={serviceDescLabelDraft}
                    onChange={setServiceDescLabelDraft}
                    placeholder="e.g., Service Description (max 200 characters)"
                  />
                </div>
                <div className="flex gap-1 mt-6">
                  <button
                    type="button"
                    onClick={() => { }}
                    className="px-2 py-1 text-xs rounded-md border hover:bg-slate-50"
                    title="Edit description label"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={updateServiceItemOnServer}
                    disabled={isSavingServiceItem}
                    className={`px-2 py-1 text-xs rounded-md ${isSavingServiceItem ? 'text-white bg-blue-300 cursor-not-allowed' : 'text-white bg-blue-600 hover:bg-blue-700'}`}
                    title="Save description label"
                  >
                    {isSavingServiceItem ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <FormInput
                    label="Description placeholder"
                    value={serviceDescPlaceholderDraft}
                    onChange={setServiceDescPlaceholderDraft}
                    placeholder="Brief description of this service..."
                  />
                </div>
                <div className="flex gap-1 mt-6">
                  <button
                    type="button"
                    onClick={() => { }}
                    className="px-2 py-1 text-xs rounded-md border hover:bg-slate-50"
                    title="Edit description placeholder"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={updateServiceItemOnServer}
                    disabled={isSavingServiceItem}
                    className={`px-2 py-1 text-xs rounded-md ${isSavingServiceItem ? 'text-white bg-blue-300 cursor-not-allowed' : 'text-white bg-blue-600 hover:bg-blue-700'}`}
                    title="Save description placeholder"
                  >
                    {isSavingServiceItem ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-blue-100">
              <button
                type="button"
                onClick={cancelServiceItemModal}
                className="px-4 py-2 text-sm text-blue-700 rounded-md border border-blue-200 hover:bg-blue-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={updateServiceItemOnServer}
                disabled={isSavingServiceItem}
                className={`px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700`}
              >
                {isSavingServiceItem ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Services Title Edit Modal */}
      {isServicesTitleModalOpen && (
        <div className="flex overflow-auto fixed inset-0 z-50 justify-center items-start p-4 backdrop-blur-sm bg-black/30">
          <div className="p-5 mt-12 w-full max-w-xl bg-white rounded-lg border border-blue-100 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="flex items-center text-lg font-semibold text-blue-800">
                <Wrench className="mr-2 w-5 h-5" /> Edit services section
              </h2>
              <button
                onClick={cancelServicesTitleEdit}
                className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                aria-label="Close services title modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="flex items-center mb-2 text-sm font-bold text-blue-900">
              <Wrench className="mr-2 w-5 h-5" />
              {(formData.servicesHeading || 'Services').trim() || 'Services'}
            </h3>

            <div className="mb-3">
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <FormInput
                    id="services-heading-input"
                    label="Section heading"
                    value={servicesHeadingDraft}
                    onChange={setServicesHeadingDraft}
                    placeholder="e.g., Services"
                  />
                </div>
                <div className="flex gap-1 mt-6">
                  <button
                    type="button"
                    onClick={() => focusField('services-heading-input')}
                    className="px-2 py-1 text-xs rounded-md border hover:bg-slate-50"
                    title="Edit heading"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await updateServicesSectionOnServer({ servicesHeading: (servicesHeadingDraft || '').trim() });
                      saveServicesMeta();
                    }}
                    disabled={isSavingServicesSection}
                    className={`px-2 py-1 text-xs rounded-md ${isSavingServicesSection ? 'text-white bg-blue-300 cursor-not-allowed' : 'text-white bg-blue-600 hover:bg-blue-700'}`}
                    title="Save heading"
                  >
                    {isSavingServicesSection ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <FormInput
                    id="services-label-input"
                    label="Field label (shown above the input)"
                    value={servicesLabelDraft}
                    onChange={setServicesLabelDraft}
                    placeholder="e.g., What do you call your services section?"
                  />
                </div>
                <div className="flex gap-1 mt-6">
                  <button
                    type="button"
                    onClick={() => focusField('services-label-input')}
                    className="px-2 py-1 text-xs rounded-md border hover:bg-slate-50"
                    title="Edit label"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await updateServicesSectionOnServer({ servicesLabel: (servicesLabelDraft || '').trim() });
                      saveServicesMeta();
                    }}
                    disabled={isSavingServicesSection}
                    className={`px-2 py-1 text-xs rounded-md ${isSavingServicesSection ? 'text-white bg-blue-300 cursor-not-allowed' : 'text-white bg-blue-600 hover:bg-blue-700'}`}
                    title="Save label"
                  >
                    {isSavingServicesSection ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <FormInput
                    id="services-placeholder-input"
                    label="Input placeholder"
                    value={servicesPlaceholderDraft}
                    onChange={setServicesPlaceholderDraft}
                    placeholder="e.g., Our Services"
                  />
                </div>
                <div className="flex gap-1 mt-6">
                  <button
                    type="button"
                    onClick={() => focusField('services-placeholder-input')}
                    className="px-2 py-1 text-xs rounded-md border hover:bg-slate-50"
                    title="Edit placeholder"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await updateServicesSectionOnServer({ servicesPlaceholder: (servicesPlaceholderDraft || '').trim() });
                      saveServicesMeta();
                    }}
                    disabled={isSavingServicesSection}
                    className={`px-2 py-1 text-xs rounded-md ${isSavingServicesSection ? 'text-white bg-blue-300 cursor-not-allowed' : 'text-white bg-blue-600 hover:bg-blue-700'}`}
                    title="Save placeholder"
                  >
                    {isSavingServicesSection ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-blue-100">
              <button
                type="button"
                onClick={cancelServicesTitleEdit}
                className="px-4 py-2 text-sm text-blue-700 rounded-md border border-blue-200 hover:bg-blue-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await updateServicesSectionOnServer({
                    servicesHeading: (servicesHeadingDraft || '').trim(),
                    servicesLabel: (servicesLabelDraft || '').trim(),
                    servicesPlaceholder: (servicesPlaceholderDraft || '').trim(),
                  });
                  saveServicesMeta();
                }}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Title Edit Modal */}
      {isProductsTitleModalOpen && (
        <div className="flex overflow-auto fixed inset-0 z-50 justify-center items-start p-4 backdrop-blur-sm bg-black/30">
          <div className="p-5 mt-12 w-full max-w-xl bg-white rounded-lg border border-green-100 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="flex items-center text-lg font-semibold text-green-800">
                <Package className="mr-2 w-5 h-5" /> Edit products section
              </h2>
              <button
                onClick={() => setIsProductsTitleModalOpen(false)}
                className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-full"
                aria-label="Close products title modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="flex items-center mb-2 text-sm font-bold text-green-900">
              <Package className="mr-2 w-5 h-5" />
              {(formData.productsHeading || 'Products').trim() || 'Products'}
            </h3>

            <div className="mb-3">
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <FormInput
                    id="products-heading-input"
                    label="Section heading"
                    value={productsHeadingDraft}
                    onChange={setProductsHeadingDraft}
                    placeholder="e.g., Products"
                  />
                </div>
                <div className="flex gap-1 mt-6">
                  <button
                    type="button"
                    onClick={() => focusField('products-heading-input')}
                    className="px-2 py-1 text-xs rounded-md border hover:bg-slate-50"
                    title="Edit heading"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await updateProductsSectionOnServer({ productsHeading: (productsHeadingDraft || '').trim() });
                      saveProductsMeta();
                    }}
                    disabled={isSavingProductsSection}
                    className={`px-2 py-1 text-xs rounded-md ${isSavingProductsSection ? 'text-white bg-green-300 cursor-not-allowed' : 'text-white bg-green-600 hover:bg-green-700'}`}
                    title="Save heading"
                  >
                    {isSavingProductsSection ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <FormInput
                    id="products-label-input"
                    label="Field label (shown above the input)"
                    value={productsLabelDraft}
                    onChange={setProductsLabelDraft}
                    placeholder="e.g., What do you call your products section?"
                  />
                </div>
                <div className="flex gap-1 mt-6">
                  <button
                    type="button"
                    onClick={() => focusField('products-label-input')}
                    className="px-2 py-1 text-xs rounded-md border hover:bg-slate-50"
                    title="Edit label"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await updateProductsSectionOnServer({ productsLabel: (productsLabelDraft || '').trim() });
                      saveProductsMeta();
                    }}
                    disabled={isSavingProductsSection}
                    className={`px-2 py-1 text-xs rounded-md ${isSavingProductsSection ? 'text-white bg-green-300 cursor-not-allowed' : 'text-white bg-green-600 hover:bg-green-700'}`}
                    title="Save label"
                  >
                    {isSavingProductsSection ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <FormInput
                    id="products-placeholder-input"
                    label="Input placeholder"
                    value={productsPlaceholderDraft}
                    onChange={setProductsPlaceholderDraft}
                    placeholder="e.g., Our Products"
                  />
                </div>
                <div className="flex gap-1 mt-6">
                  <button
                    type="button"
                    onClick={() => focusField('products-placeholder-input')}
                    className="px-2 py-1 text-xs rounded-md border hover:bg-slate-50"
                    title="Edit placeholder"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await updateProductsSectionOnServer({ productsPlaceholder: (productsPlaceholderDraft || '').trim() });
                      saveProductsMeta();
                    }}
                    disabled={isSavingProductsSection}
                    className={`px-2 py-1 text-xs rounded-md ${isSavingProductsSection ? 'text-white bg-green-300 cursor-not-allowed' : 'text-white bg-green-600 hover:bg-green-700'}`}
                    title="Save placeholder"
                  >
                    {isSavingProductsSection ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-green-100">
              <button
                type="button"
                onClick={() => setIsProductsTitleModalOpen(false)}
                className="px-4 py-2 text-sm text-green-700 rounded-md border border-green-200 hover:bg-green-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await updateProductsSectionOnServer({
                    productsHeading: (productsHeadingDraft || '').trim(),
                    productsLabel: (productsLabelDraft || '').trim(),
                    productsPlaceholder: (productsPlaceholderDraft || '').trim(),
                  });
                  saveProductsMeta();
                }}
                disabled={isSavingProductsSection}
                className={`px-4 py-2 text-sm rounded-md ${isSavingProductsSection ? 'text-white bg-green-300 cursor-not-allowed' : 'text-white bg-green-600 hover:bg-green-700'}`}
              >
                {isSavingProductsSection ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Item Edit Modal */}
      {isProductItemModalOpen && (
        <div className="flex overflow-auto fixed inset-0 z-50 justify-center items-start p-4 backdrop-blur-sm bg-black/30">
          <div className="p-5 mt-12 w-full max-w-xl bg-white rounded-lg border border-green-100 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="flex items-center text-lg font-semibold text-green-800">Edit product item</h2>
              <button
                onClick={() => setIsProductItemModalOpen(false)}
                className="p-1.5 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-full"
                aria-label="Close product item modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-3">
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <FormInput
                    label="Input placeholder"
                    value={productPlaceholderDraft}
                    onChange={setProductPlaceholderDraft}
                    placeholder="e.g., Professional Drone X1"
                  />
                </div>
                <div className="flex gap-1 mt-6">
                  <button
                    type="button"
                    onClick={() => { }}
                    className="px-2 py-1 text-xs rounded-md border hover:bg-slate-50"
                    title="Edit placeholder"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={updateProductItemOnServer}
                    disabled={isSavingProductItem}
                    className={`px-2 py-1 text-xs rounded-md ${isSavingProductItem ? 'text-white bg-green-300 cursor-not-allowed' : 'text-white bg-green-600 hover:bg-green-700'}`}
                    title="Save placeholder"
                  >
                    {isSavingProductItem ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <FormInput
                    label="Description label"
                    value={productDescLabelDraft}
                    onChange={setProductDescLabelDraft}
                    placeholder="e.g., Product Description (max 200 characters)"
                  />
                </div>
                <div className="flex gap-1 mt-6">
                  <button
                    type="button"
                    onClick={() => { }}
                    className="px-2 py-1 text-xs rounded-md border hover:bg-slate-50"
                    title="Edit description label"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={updateProductItemOnServer}
                    disabled={isSavingProductItem}
                    className={`px-2 py-1 text-xs rounded-md ${isSavingProductItem ? 'text-white bg-green-300 cursor-not-allowed' : 'text-white bg-green-600 hover:bg-green-700'}`}
                    title="Save description label"
                  >
                    {isSavingProductItem ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <FormInput
                    label="Description placeholder"
                    value={productDescPlaceholderDraft}
                    onChange={setProductDescPlaceholderDraft}
                    placeholder="Brief description of this product..."
                  />
                </div>
                <div className="flex gap-1 mt-6">
                  <button
                    type="button"
                    onClick={() => { }}
                    className="px-2 py-1 text-xs rounded-md border hover:bg-slate-50"
                    title="Edit description placeholder"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={updateProductItemOnServer}
                    disabled={isSavingProductItem}
                    className={`px-2 py-1 text-xs rounded-md ${isSavingProductItem ? 'text-white bg-green-300 cursor-not-allowed' : 'text-white bg-green-600 hover:bg-green-700'}`}
                    title="Save description placeholder"
                  >
                    {isSavingProductItem ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-green-100">
              <button
                type="button"
                onClick={() => setIsProductItemModalOpen(false)}
                className="px-4 py-2 text-sm text-green-700 rounded-md border border-green-200 hover:bg-green-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={updateProductItemOnServer}
                disabled={isSavingProductItem}
                className={`px-4 py-2 text-sm rounded-md ${isSavingProductItem ? 'text-white bg-green-300 cursor-not-allowed' : 'text-white bg-green-600 hover:bg-green-700'}`}
              >
                {isSavingProductItem ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Section Heading Edit Modal */}
      {isCustomSectionModalOpen && (
        <div className="flex overflow-auto fixed inset-0 z-50 justify-center items-start p-4 backdrop-blur-sm bg-black/30">
          <div className="p-5 mt-12 w-full max-w-xl bg-white rounded-lg border border-purple-100 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="flex items-center text-lg font-semibold text-purple-800">
                <Grid className="mr-2 w-5 h-5" /> Edit custom section
              </h2>
              <button
                onClick={cancelCustomSectionEdit}
                className="p-1.5 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-full"
                aria-label="Close custom section modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-3">
              <FormInput
                id="custom-heading-input"
                label="Section heading"
                value={customSectionHeadingDraft}
                onChange={setCustomSectionHeadingDraft}
                placeholder="e.g., Capabilities"
              />
            </div>

            <div className="mb-3">
              <FormInput
                id="custom-label-input"
                label="Field label (shown above the input)"
                value={customSectionLabelDraft}
                onChange={setCustomSectionLabelDraft}
                placeholder="e.g., What do you call your section?"
              />
            </div>

            <div className="mb-3">
              <FormInput
                id="custom-placeholder-input"
                label="Input placeholder"
                value={customSectionPlaceholderDraft}
                onChange={setCustomSectionPlaceholderDraft}
                placeholder="e.g., Our Capabilities"
              />
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-purple-100">
              <button
                type="button"
                onClick={cancelCustomSectionEdit}
                className="px-4 py-2 text-sm text-purple-700 rounded-md border border-purple-200 hover:bg-purple-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={updateCustomSectionOnServer}
                disabled={isSavingCustomSection}
                className={`px-4 py-2 text-sm rounded-md ${isSavingCustomSection ? 'text-white bg-purple-300 cursor-not-allowed' : 'text-white bg-purple-600 hover:bg-purple-700'}`}
              >
                {isSavingCustomSection ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
            {customSectionUpdateError && (
              <div className="mt-2 text-xs text-red-600">{customSectionUpdateError}</div>
            )}
          </div>
        </div>
      )}

      {/* Item Edit Modal */}
      {isItemEditModalOpen && (
        <div className="flex overflow-auto fixed inset-0 z-50 justify-center items-start p-4 backdrop-blur-sm bg-black/30">
          <div className="p-5 mt-12 w-full max-w-xl bg-white rounded-lg border border-purple-100 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="flex items-center text-lg font-semibold text-purple-800">
                Edit item
              </h2>
              <button
                onClick={cancelItemEdit}
                className="p-1.5 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-full"
                aria-label="Close item modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Item title field removed per request */}
            <div className="mb-3">
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <FormInput
                    label="Input placeholder"
                    value={itemPlaceholderDraft}
                    onChange={setItemPlaceholderDraft}
                    placeholder="e.g., Custom Item"
                  />
                </div>
                <div className="flex gap-1 mt-6">
                  <button
                    type="button"
                    onClick={() => { }}
                    className="px-2 py-1 text-xs rounded-md border hover:bg-slate-50"
                    title="Edit placeholder"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={updateCustomItemOnServer}
                    disabled={isSavingCustomItem}
                    className={`px-2 py-1 text-xs text-white bg-purple-600 rounded-md hover:bg-purple-700`}
                    title="Save placeholder"
                  >
                    {isSavingCustomItem ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <FormInput
                    label="Description label"
                    value={itemDescLabelDraft}
                    onChange={setItemDescLabelDraft}
                    placeholder="e.g., Item Description (max 200 characters)"
                  />
                </div>
                <div className="flex gap-1 mt-6">
                  <button
                    type="button"
                    onClick={() => { }}
                    className="px-2 py-1 text-xs rounded-md border hover:bg-slate-50"
                    title="Edit description label"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={updateCustomItemOnServer}
                    disabled={isSavingCustomItem}
                    className={`px-2 py-1 text-xs text-white bg-purple-600 rounded-md hover:bg-purple-700`}
                    title="Save description label"
                  >
                    {isSavingCustomItem ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <FormInput
                    label="Description"
                    value={itemDescDraft}
                    onChange={setItemDescDraft}
                    placeholder="Brief description of this product..."
                  />
                </div>
                <div className="flex gap-1 mt-6">
                  <button
                    type="button"
                    onClick={() => { }}
                    className="px-2 py-1 text-xs rounded-md border hover:bg-slate-50"
                    title="Edit description placeholder"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={updateCustomItemOnServer}
                    disabled={isSavingCustomItem}
                    className={`px-2 py-1 text-xs text-white bg-purple-600 rounded-md hover:bg-purple-700`}
                    title="Save description placeholder"
                  >
                    {isSavingCustomItem ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-purple-100">
              <button
                type="button"
                onClick={cancelItemEdit}
                className="px-4 py-2 text-sm text-purple-700 rounded-md border border-purple-200 hover:bg-purple-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={updateCustomItemOnServer}
                disabled={isSavingCustomItem}
                className={`px-4 py-2 text-sm rounded-md ${isSavingCustomItem ? 'text-white bg-purple-300 cursor-not-allowed' : 'text-white bg-purple-600 hover:bg-purple-700'}`}
              >
                {isSavingCustomItem ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Step5ProductsServices;
