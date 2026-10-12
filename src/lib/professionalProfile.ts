import axios from "axios";
import { PROFESSIONAL_API } from "./apiConfig";
import { INDIA_STATES, type SectorKey } from "./professionalOptions";

export interface CertEntry {
  type: string;
  issuer: string;
  number: string;
  file_url: string;
  file_name: string;
}

export interface ProfileValues {
  sectors: SectorKey[];
  primary_sector: string;
  business_support_category: string;
  business_support_other: string;
  specialization: string;
  mobile: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  address: string;
  city: string;
  pin_code: string;
  country: string;
  state: string;
  user_name: string;
  email: string;
  nationality: string;
  job_title: string;
  tagline: string;
  professional_type: string;
  organisation: string;
  experience_level: string;
  availability: string;
  work_preference: string;
  preferred_location: string;
  skills: string[];
  certifications: CertEntry[];
  summary: string;
  portfolio: string;
  resume_url: string;
  photo_url: string;
  alt_contact_name: string;
  alt_contact_phone: string;
  alt_contact_email: string;
  linkedin: string;
  instagram: string;
  youtube: string;
  facebook: string;
  twitter: string;
  declaration_accuracy: boolean;
  consent_privacy: boolean;
  consent_contact: boolean;
  show_contact_public: boolean;
}

export const EMPTY_PROFILE: ProfileValues = {
  sectors: [], primary_sector: "", business_support_category: "", business_support_other: "", specialization: "",
  mobile: "", full_name: "", date_of_birth: "", gender: "", address: "", city: "", pin_code: "", country: "", state: "",
  user_name: "", email: "", nationality: "", job_title: "", tagline: "", professional_type: "", organisation: "",
  experience_level: "", availability: "", work_preference: "", preferred_location: "", skills: [], certifications: [],
  summary: "", portfolio: "", resume_url: "", photo_url: "", alt_contact_name: "", alt_contact_phone: "", alt_contact_email: "",
  linkedin: "", instagram: "", youtube: "", facebook: "", twitter: "",
  declaration_accuracy: false, consent_privacy: false, consent_contact: false, show_contact_public: false,
};

const LEGACY_SECTOR: Record<string, SectorKey> = {
  drone: "drone_aerospace", gis: "gis", ai: "ai", robotics: "robotics", "business support": "business_support",
};

// Opens a profile made with the older form: fills what can be matched and
// leaves the rest for the person to complete.
export function profileFromStored(formData: any): ProfileValues {
  const fd = formData && typeof formData === "object" ? formData : {};
  const stored = fd.profile && typeof fd.profile === "object" ? fd.profile : null;
  if (stored) return { ...EMPTY_PROFILE, ...stored, certifications: stored.certifications || [], skills: stored.skills || [] };

  const parse = (v: any) => { if (typeof v !== "string") return v; try { return JSON.parse(v); } catch { return v; } };
  const basic = parse(fd.basicInfo) || {};
  const addr = parse(fd.addressInformation) || {};
  const social = parse(fd.socialMediaLinks) || {};
  const alt = parse(fd.alternateContact) || {};
  const cats: string[] = Array.isArray(parse(fd.categories)) ? parse(fd.categories) : [];
  const sectors = cats.map(c => LEGACY_SECTOR[String(c).toLowerCase()]).filter(Boolean) as SectorKey[];
  const phone = String(addr.phoneNumber || basic.Phonenumber || "").replace(/\D/g, "").slice(-10);
  const state = INDIA_STATES.includes(basic.state) ? basic.state : "";
  const skills = [...(Array.isArray(parse(fd.skills)) ? parse(fd.skills) : []), ...(Array.isArray(parse(fd.freeformSkills)) ? parse(fd.freeformSkills) : [])]
    .filter((s: any) => typeof s === "string");
  const gender = String(basic.gender || "");
  return {
    ...EMPTY_PROFILE,
    sectors,
    primary_sector: sectors[0] || "",
    mobile: phone,
    full_name: basic.fullName || "",
    date_of_birth: basic.date_of_birth || "",
    gender: gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "",
    address: basic.address || "",
    city: basic.city_district || "",
    pin_code: basic.pincode || "",
    country: basic.country || "India",
    state,
    user_name: basic.user_name || "",
    email: addr.email || "",
    nationality: addr.nationality === "indian" ? "India" : "",
    job_title: addr.designation || "",
    tagline: addr.tagline || "",
    skills,
    linkedin: social.linkedin || "", instagram: social.instagram || "", youtube: social.youtube || "",
    facebook: social.facebook || "", twitter: social.twitter || "", portfolio: social.portfolio || "",
    alt_contact_name: alt.name || "", alt_contact_phone: alt.phone || "", alt_contact_email: alt.email || "",
  };
}

export interface KycPrefill {
  status: string;
  fullName?: string; dateOfBirth?: string; gender?: string; email?: string; address?: string;
  cityDistrict?: string; pincode?: string; state?: string; country?: string;
}

export const kycMobilePrefill = async (mobile: string): Promise<KycPrefill> => {
  const res = await fetch(`${PROFESSIONAL_API}/kyc/mobile-prefill`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mobile_number: mobile }),
  });
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
};

export const digilockerInit = async (): Promise<{ url: string; client_id: string }> =>
  (await axios.post(`${PROFESSIONAL_API}/kyc/digilocker-init`, {}, { timeout: 40000 })).data;

export const digilockerPoll = async (clientId: string): Promise<boolean> => {
  const r = await axios.get(`${PROFESSIONAL_API}/kyc/digilocker-poll/${encodeURIComponent(clientId)}`, { timeout: 40000 });
  return !!r.data?.success;
};

export const usernameAvailable = async (userName: string, professionalId?: string): Promise<boolean> => {
  const r = await axios.post(`${PROFESSIONAL_API}/professional-username-check`, { user_name: userName, professional_id: professionalId || null });
  return !!r.data?.available;
};
