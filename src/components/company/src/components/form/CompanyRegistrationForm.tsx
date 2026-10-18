import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { COMPANY_API } from "../../../../../lib/apiConfig";
import { useTemplate, useUserAuth } from "../../../../context/context";
import { compressImage } from "../../../../../lib/compressImage";
import { SECTOR_INFO, SECTOR_LABEL, INDIA_STATES, BUSINESS_SUPPORT_CATEGORIES, type SectorKey } from "../../../../../lib/professionalOptions";
import { BUSINESS_ENTITY_TYPES, NATURE_OF_BUSINESS, TITLES } from "../../../../../lib/companyOptions";
import { mapFormDataToAIGenData, initialFormData } from "./src/App";

const GST_RE = /^(0[1-9]|[12][0-9]|3[0-8])[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const CIN_RE = /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;
const LLPIN_RE = /^[A-Z]{3}-[0-9]{4}$/;
const UDYAM_RE = /^UDYAM-[A-Z]{2}-[0-9]{2}-[0-9]{7}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[6-9][0-9]{9}$/;
const PIN_RE = /^[1-9][0-9]{5}$/;
const MAX_LOGO_MB = 2;
const DRAFT_KEY = "companyRegistrationDraft";

const INPUT = "w-full rounded-md border border-[#f0d27a] bg-white px-3 py-2.5 text-[13px] text-[#1c1c1c] outline-none focus:border-[#e0a100] focus:ring-[3px] focus:ring-[#fbc50b]/30";
const LOCKED = "!bg-[#f1ecd6] !text-[#555] pointer-events-none";
const BAD = "!border-[#d40000]";
const PANEL = "mt-[18px] rounded-[10px] border border-[#f0c94a] bg-[#fff6d6] p-[18px]";
const PANEL_DEEP = "mt-[18px] rounded-[10px] border border-[#e6c540] bg-[#f4d85f] p-[18px]";
const INNER = "mt-3 rounded-lg border border-[#f0c94a] bg-[#fffdf3] p-3.5";
const BTN_SMALL = "whitespace-nowrap rounded-md border border-[#c99a00] bg-[#ffd75e] px-3.5 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-50";

interface Values {
  company_sectors: SectorKey[];
  primary_sector: string;
  business_support_category: string;
  business_support_other: string;
  verification_type: "GST" | "CIN" | "LLP";
  gst_number: string;
  consent_gst_verification: boolean;
  gst_verified: boolean;
  consent_cin_verification: boolean;
  cin_verified: boolean;
  verify_token: string;
  trade_name: string;
  legal_name: string;
  registered_address: string;
  registered_state: string;
  registered_pincode: string;
  date_of_incorporation: string;
  communication_address: string;
  same_as_registered: boolean;
  business_entity_type: string;
  pan_number: string;
  nature_of_business: string;
  nature_of_business_other: string;
  cin: string;
  udyam_number: string;
  website_url: string;
  company_logo: string;
  promotional_code: string;
  director_title: string;
  director_name: string;
  director_address: string;
  director_phone: string;
  director_email: string;
  alt_contact_title: string;
  alt_contact_name: string;
  alt_contact_phone: string;
  company_email: string;
  declaration_authorised: boolean;
  declaration_accuracy: boolean;
  consent_privacy: boolean;
}

const EMPTY: Values = {
  company_sectors: [], primary_sector: "", business_support_category: "", business_support_other: "", verification_type: "GST", gst_number: "",
  consent_gst_verification: false, gst_verified: false, consent_cin_verification: false, cin_verified: false, verify_token: "", trade_name: "", legal_name: "", registered_address: "",
  registered_state: "", registered_pincode: "", date_of_incorporation: "", communication_address: "", same_as_registered: false,
  business_entity_type: "", pan_number: "", nature_of_business: "", nature_of_business_other: "", cin: "", udyam_number: "",
  website_url: "", company_logo: "", promotional_code: "", director_title: "Mr", director_name: "", director_address: "",
  director_phone: "", director_email: "", alt_contact_title: "Mr", alt_contact_name: "", alt_contact_phone: "", company_email: "",
  declaration_authorised: false, declaration_accuracy: false, consent_privacy: false,
};

type Errors = Record<string, string>;

const Field: React.FC<{ label: string; htmlFor?: string; required?: boolean; error?: string; help?: string; className?: string; children: React.ReactNode }> =
  ({ label, htmlFor, required, error, help, className = "", children }) => (
    <div className={`mb-3.5 flex flex-col ${className}`}>
      <label htmlFor={htmlFor} className="mb-1.5 text-[11px] font-bold">{label}{required && <span className="text-[#d40000]"> *</span>}</label>
      {children}
      {help && !error && <div className="mt-1.5 text-[11px] leading-snug text-slate-500">{help}</div>}
      {error && <div role="alert" className="mt-1.5 text-[11px] text-[#d40000]">{error}</div>}
    </div>
  );

const Grid2: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 [&>div]:mb-0">{children}</div>;

const Phone: React.FC<{ id: string; value: string; onChange: (v: string) => void; placeholder: string; bad?: boolean }> = ({ id, value, onChange, placeholder, bad }) => (
  <div className={`flex overflow-hidden rounded-md border bg-white focus-within:ring-[3px] focus-within:ring-[#fbc50b]/30 ${bad ? "border-[#d40000]" : "border-[#f0d27a]"}`}>
    <span className="flex items-center border-r border-[#f0d27a] bg-[#fbf3d6] px-2.5 text-xs">+91</span>
    <input id={id} type="tel" inputMode="numeric" maxLength={10} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value.replace(/\D/g, ""))} className="w-full bg-white px-3 py-2.5 text-[13px] outline-none" />
  </div>
);

const TitleName: React.FC<{ id: string; title: string; name: string; onTitle: (v: string) => void; onName: (v: string) => void; bad?: boolean }> = ({ id, title, name, onTitle, onName, bad }) => (
  <div className={`flex overflow-hidden rounded-md border bg-white focus-within:ring-[3px] focus-within:ring-[#fbc50b]/30 ${bad ? "border-[#d40000]" : "border-[#f0d27a]"}`}>
    <select aria-label="Title" value={title} onChange={e => onTitle(e.target.value)} className="w-[78px] flex-none border-r border-[#f0d27a] bg-[#fbf3d6] px-2 py-2.5 text-[13px] outline-none">
      {TITLES.map(t => <option key={t}>{t}</option>)}
    </select>
    <input id={id} type="text" maxLength={100} value={name} onChange={e => onName(e.target.value)} placeholder="Full name" className="w-full bg-white px-3 py-2.5 text-[13px] outline-none" />
  </div>
);

const isHttp = (v: string) => { try { return /^https?:$/.test(new URL(v.trim()).protocol); } catch { return false; } };

// SVG logos are turned into PNG before upload so no script can ever travel in the file.
async function svgToPng(file: File): Promise<File> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error("bad svg")); i.src = url; });
    const w = img.naturalWidth || 512, h = img.naturalHeight || 512;
    const scale = Math.min(1, 1024 / Math.max(w, h));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(w * scale)); canvas.height = Math.max(1, Math.round(h * scale));
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob: Blob = await new Promise((res, rej) => canvas.toBlob(b => (b ? res(b) : rej(new Error("png failed"))), "image/png"));
    return new File([blob], file.name.replace(/\.svg$/i, "") + ".png", { type: "image/png" });
  } finally { URL.revokeObjectURL(url); }
}

const CompanyRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser } = useUserAuth();
  const { setDraftDetails } = useTemplate();
  const loggedInEmail = authUser?.email || authUser?.userData?.email || null;
  const templateId = String(location.state?.templateId ?? "1");
  // Multi-company / multi-vertical model (2026-10-18): set only when this
  // registration was started from a company's "+ Add Vertical" button
  // (MyCompanies.tsx -> Select.tsx both forward it through). A brand-new
  // standalone company (the plain "+ Add New Company" / "Register another
  // company" path) always requires its own GST/CIN, even on an account that
  // already owns other companies - only a Vertical of a confirmed parent
  // skips it, since the server then inherits the parent's legal identity.
  const parentCompanyId: string | null = location.state?.parentCompanyId || null;
  const parentCompanyName: string | null = location.state?.parentCompanyName || null;
  const isVertical = !!parentCompanyId;

  const [v, setV] = useState<Values>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (saved && typeof saved === "object") return { ...EMPTY, ...saved, gst_verified: false, verify_token: "" };
    } catch { /* no saved draft */ }
    return EMPTY;
  });
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState<{ text: string; kind: "ok" | "bad" } | null>(null);
  const [gst, setGst] = useState<{ s: "idle" | "loading" | "ok" | "bad"; msg: string }>({ s: "idle", msg: "" });
  const [cin, setCin] = useState<{ s: "idle" | "loading" | "ok" | "bad"; msg: string }>({ s: "idle", msg: "" });
  const [panAuto, setPanAuto] = useState(true);
  const [logoBusy, setLogoBusy] = useState(false);
  const [logoNote, setLogoNote] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dupConfirm, setDupConfirm] = useState<{ msg: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const locked = v.verification_type === "GST" ? v.gst_verified : v.cin_verified;

  useEffect(() => {
    try {
      const { gst_verified, verify_token, ...rest } = v; // never keep the proof in storage
      localStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
    } catch { /* storage unavailable */ }
  }, [v]);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setV(p => ({ ...p, [key]: value }));
    setErrors(e => (e[key as string] ? { ...e, [key as string]: "" } : e));
  };
  const patch = (p: Partial<Values>) => { setV(prev => ({ ...prev, ...p })); };

  const tech = v.company_sectors;
  const hasBss = tech.includes("business_support");
  const toggleSector = (k: SectorKey) => {
    setV(p => {
      const sectors = p.company_sectors.includes(k) ? p.company_sectors.filter(s => s !== k) : [...p.company_sectors, k];
      return {
        ...p, company_sectors: sectors,
        primary_sector: sectors.length === 1 ? sectors[0] : (sectors.includes(p.primary_sector as SectorKey) ? p.primary_sector : ""),
        business_support_category: sectors.includes("business_support") ? p.business_support_category : "",
        business_support_other: sectors.includes("business_support") ? p.business_support_other : "",
      };
    });
    setErrors(e => ({ ...e, company_sectors: "" }));
  };

  // ---- GST ----------------------------------------------------------------------------
  const onGstChange = (raw: string) => {
    const g = raw.toUpperCase().replace(/\s/g, "");
    setV(p => {
      const next: Values = { ...p, gst_number: g };
      if (p.gst_verified) { next.gst_verified = false; next.verify_token = ""; }
      if (GST_RE.test(g) && (panAuto || !p.pan_number)) { next.pan_number = g.slice(2, 12); }
      return next;
    });
    if (gst.s !== "idle") setGst({ s: "idle", msg: "" });
    setErrors(e => ({ ...e, gst_number: "" }));
  };

  const verifyGst = async () => {
    if (!GST_RE.test(v.gst_number)) { setErrors(e => ({ ...e, gst_number: "Enter a valid 15 character GST number." })); return; }
    if (!v.consent_gst_verification) { setGst({ s: "bad", msg: "Please tick the consent box to verify the GST number." }); return; }
    setGst({ s: "loading", msg: "" });
    try {
      const res = await axios.post(`${COMPANY_API}/gst/verify`, { gst_number: v.gst_number }, { timeout: 60000 });
      const d = res.data?.data || {};
      patch({
        trade_name: d.trade_name || v.trade_name, legal_name: d.legal_name || v.legal_name, registered_address: d.address || v.registered_address,
        registered_state: d.state || v.registered_state, registered_pincode: d.pincode || v.registered_pincode,
        date_of_incorporation: d.date_of_incorporation || v.date_of_incorporation, pan_number: d.pan_number || v.pan_number,
        business_entity_type: v.business_entity_type || (BUSINESS_ENTITY_TYPES.includes(d.business_entity_type) ? d.business_entity_type : ""),
        director_name: v.director_name || d.signatory_name || "",
        gst_verified: true, verify_token: res.data?.verify_token || "",
        ...(v.same_as_registered ? { communication_address: composed(d.address || v.registered_address, d.state || v.registered_state, d.pincode || v.registered_pincode) } : {}),
      });
      setPanAuto(false);
      setErrors(e => ({ ...e, gst_number: "", trade_name: "", legal_name: "", registered_address: "", registered_state: "", registered_pincode: "", date_of_incorporation: "", pan_number: "", business_entity_type: "", director_name: "", communication_address: "" }));
      let msg = "GST details fetched from the government portal.";
      const contact = [res.data?.masked_phone, res.data?.masked_email].filter(Boolean).join(" and ");
      if (contact) msg += ` Registered contact on record: ${contact}.`;
      setGst({ s: "ok", msg });
      checkName(d.trade_name || v.trade_name);
    } catch (err: any) {
      const st = err?.response?.status;
      const detail = err?.response?.data?.detail;
      setGst({ s: "bad", msg: st === 404 ? (typeof detail === "string" ? detail : "This GST number was not found.") : "We could not verify this GST number right now. You can try again, or fill the details yourself and our team will check them." });
    }
  };

  const checkName = async (name: string, setStatus: typeof setGst = setGst) => {
    if (!name) return;
    try {
      const r = await axios.get(`${COMPANY_API}/drafts/check-name`, { params: { name, userId: v.director_email || undefined }, timeout: 15000 });
      if (r.data?.available === false) setStatus({ s: "bad", msg: `"${name}" is already registered with DroneTV. If this is your company, please contact support instead of registering again.` });
    } catch { /* the server checks again on submit */ }
  };

  // ---- CIN / LLPIN ------------------------------------------------------------------------
  // Surepass's company-details lookup covers both a company's CIN and an
  // LLP's LLPIN via the same id_number param, so the two just differ in
  // regex/formatting here, not in which endpoint gets called.
  const idRe = (t: Values["verification_type"]) => (t === "LLP" ? LLPIN_RE : CIN_RE);

  const onCinChange = (raw: string) => {
    const idNum = v.verification_type === "LLP" ? raw.replace(/[^a-zA-Z0-9-]/g, "").toUpperCase() : raw.toUpperCase().replace(/\s/g, "");
    setV(p => {
      const next: Values = { ...p, cin: idNum };
      if (p.cin_verified) { next.cin_verified = false; next.verify_token = ""; }
      return next;
    });
    if (cin.s !== "idle") setCin({ s: "idle", msg: "" });
    setErrors(e => ({ ...e, cin: "" }));
  };

  const verifyCin = async () => {
    const label = v.verification_type === "LLP" ? "LLPIN (e.g. AAA-1234)" : "21 character CIN";
    if (!idRe(v.verification_type).test(v.cin)) { setErrors(e => ({ ...e, cin: `Enter a valid ${label}.` })); return; }
    if (!v.consent_cin_verification) { setCin({ s: "bad", msg: "Please tick the consent box to verify the CIN." }); return; }
    setCin({ s: "loading", msg: "" });
    try {
      const res = await axios.post(`${COMPANY_API}/cin/verify`, { cin: v.cin }, { timeout: 60000 });
      const d = res.data?.data || {};
      patch({
        trade_name: d.trade_name || v.trade_name, legal_name: d.legal_name || v.legal_name, registered_address: d.address || v.registered_address,
        registered_state: d.state || v.registered_state, registered_pincode: d.pincode || v.registered_pincode,
        date_of_incorporation: d.date_of_incorporation || v.date_of_incorporation,
        business_entity_type: v.business_entity_type || (BUSINESS_ENTITY_TYPES.includes(d.business_entity_type) ? d.business_entity_type : ""),
        director_name: v.director_name || d.signatory_name || "",
        cin_verified: true, verify_token: res.data?.verify_token || "",
        ...(v.same_as_registered ? { communication_address: composed(d.address || v.registered_address, d.state || v.registered_state, d.pincode || v.registered_pincode) } : {}),
      });
      setErrors(e => ({ ...e, cin: "", trade_name: "", legal_name: "", registered_address: "", registered_state: "", registered_pincode: "", date_of_incorporation: "", business_entity_type: "", director_name: "", communication_address: "" }));
      let msg = "Company details fetched from the MCA portal.";
      const contact = [res.data?.masked_phone, res.data?.masked_email].filter(Boolean).join(" and ");
      if (contact) msg += ` Registered contact on record: ${contact}.`;
      setCin({ s: "ok", msg });
      checkName(d.trade_name || v.trade_name, setCin);
    } catch (err: any) {
      const st = err?.response?.status;
      const detail = err?.response?.data?.detail;
      setCin({ s: "bad", msg: st === 404 ? (typeof detail === "string" ? detail : "This CIN was not found.") : "We could not verify this CIN right now. You can try again, or fill the details yourself and our team will check them." });
    }
  };

  // ---- addresses ----------------------------------------------------------------------
  const composed = (addr: string, state: string, pin: string) => {
    const tail = [state, pin].filter(Boolean).join(" - ");
    return [addr.trim(), tail].filter(Boolean).join(", ");
  };
  useEffect(() => {
    if (v.same_as_registered) setV(p => ({ ...p, communication_address: composed(p.registered_address, p.registered_state, p.registered_pincode) }));
  }, [v.same_as_registered, v.registered_address, v.registered_state, v.registered_pincode]);

  // ---- logo -----------------------------------------------------------------------------
  const onLogo = async (raw: File | undefined) => {
    if (!raw) return;
    if (!/\.(png|jpe?g|svg)$/i.test(raw.name) || raw.size > MAX_LOGO_MB * 1024 * 1024) { setErrors(e => ({ ...e, company_logo: "Logo must be PNG, JPG or SVG and not larger than 2 MB." })); return; }
    setLogoBusy(true);
    try {
      let file = raw;
      if (/\.svg$/i.test(raw.name)) file = await svgToPng(raw);
      else file = await compressImage(raw);
      const owner = loggedInEmail || (EMAIL_RE.test(v.director_email) ? v.director_email : "guest");
      const pre = await axios.post(`${COMPANY_API}/upload-file`, { userId: owner, fieldName: "companyLogo", filename: file.name, contentType: file.type || "image/png" }, { timeout: 30000 });
      if (!pre.data?.success) throw new Error("presign");
      await axios.put(pre.data.uploadUrl, file, { headers: { "Content-Type": file.type || "image/png" }, timeout: 120000 });
      set("company_logo", pre.data.imageUrl);
    } catch (err: any) {
      // The generic message below is what the user sees, but logging the real
      // reason (network vs a specific HTTP status from either call) is the
      // difference between diagnosing the next report and re-guessing blind.
      console.error("Company logo upload failed:", err?.response?.status, err?.message, err);
      setErrors(e => ({ ...e, company_logo: "Upload failed. Please try again." }));
    }
    finally { setLogoBusy(false); }
  };

  // Picks the logo up from the company website once, unless one is already there.
  const fetchedFor = useRef("");
  const fetchLogoFromWebsite = async () => {
    const url = v.website_url.trim();
    if (!url || !isHttp(url) || v.company_logo || logoBusy || fetchedFor.current === url) return;
    fetchedFor.current = url;
    setLogoBusy(true); setLogoNote("Looking for your logo on the website...");
    try {
      const owner = loggedInEmail || (EMAIL_RE.test(v.director_email) ? v.director_email : "guest");
      const res = await axios.post(`${COMPANY_API}/logo-from-website`, { url, userId: owner }, { timeout: 40000 });
      if (res.data?.success && res.data.logoUrl) { setV(p => (p.company_logo ? p : { ...p, company_logo: res.data.logoUrl })); setLogoNote("Logo taken from your website. You can change it."); }
      else setLogoNote("We could not find a logo on that website. Please upload it.");
    } catch { setLogoNote("We could not fetch the logo. Please upload it."); }
    finally { setLogoBusy(false); }
  };

  // ---- progress / validation --------------------------------------------------------------
  const natureOk = !!v.nature_of_business && (v.nature_of_business !== "Other" || !!v.nature_of_business_other.trim());
  const progress = useMemo(() => {
    const checks = [
      v.company_sectors.length > 0, !hasBss || !!v.business_support_category, GST_RE.test(v.gst_number),
      !!v.trade_name.trim(), !!v.legal_name.trim(), !!v.registered_address.trim(), !!v.registered_state, PIN_RE.test(v.registered_pincode),
      !!v.communication_address.trim(), !!v.business_entity_type, PAN_RE.test(v.pan_number), natureOk, !!v.website_url.trim(),
      !!v.company_logo,
      !!v.director_name.trim(), !!v.director_address.trim(), MOBILE_RE.test(v.director_phone), EMAIL_RE.test(v.director_email.trim()),
      EMAIL_RE.test(v.company_email.trim()), v.declaration_authorised && v.declaration_accuracy && v.consent_privacy,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [v, hasBss, natureOk]);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!v.company_sectors.length) e.company_sectors = "Please select at least one category to continue";
    if (v.company_sectors.length > 1 && !v.primary_sector) e.primary_sector = "Please choose your primary sector.";
    if (hasBss) {
      if (!v.business_support_category) e.business_support_category = "Please select a business support category.";
      if (v.business_support_category === "Other Business Services" && !v.business_support_other.trim()) e.business_support_other = "Please describe your service.";
    }
    if (v.verification_type === "GST") {
      // Blank is only an error for a standalone company - GST/CIN/LLP
      // proves who you are and is skipped only for a Vertical registered
      // under an already-verified parent company (the server inherits the
      // parent's legal identity in that case). A value, if given anyway,
      // is still format-checked (mirrors the backend exactly).
      if (v.gst_number ? !GST_RE.test(v.gst_number) : !isVertical) e.gst_number = "Enter a valid 15 character GST number.";
    } else if (v.cin ? !idRe(v.verification_type).test(v.cin) : !isVertical) {
      e.cin = `Enter a valid ${v.verification_type === "LLP" ? "LLPIN (e.g. AAA-1234)" : "21 character CIN"}.`;
    }
    if (!v.trade_name.trim()) e.trade_name = "Please enter the company name.";
    if (!v.legal_name.trim()) e.legal_name = "Please enter the legal name.";
    if (!v.registered_address.trim()) e.registered_address = "Please enter the registered address.";
    if (!v.registered_state) e.registered_state = "Please select the state.";
    if (!PIN_RE.test(v.registered_pincode)) e.registered_pincode = "Enter a valid 6 digit pincode.";
    if (!v.communication_address.trim()) e.communication_address = "Please enter the communication address.";
    if (!v.business_entity_type) e.business_entity_type = "Please select the business entity type.";
    if (!v.nature_of_business) e.nature_of_business = "Please select the nature of business.";
    if (v.nature_of_business === "Other" && !v.nature_of_business_other.trim()) e.nature_of_business_other = "Please describe your business.";
    // PAN is identity proof too - skipped for a Vertical exactly like
    // GST/CIN, since it's about to be overwritten by the parent's real PAN
    // server-side anyway (mirrors the backend's validate_company exactly).
    if (v.pan_number ? !PAN_RE.test(v.pan_number) : !isVertical) e.pan_number = "Enter a valid PAN number.";
    else if (v.pan_number && GST_RE.test(v.gst_number) && v.gst_number.slice(2, 12) !== v.pan_number) e.pan_number = "PAN does not match the GST number.";
    if (v.verification_type === "GST" && v.cin && !CIN_RE.test(v.cin)) e.cin = "Enter a valid 21 character CIN.";
    if (v.udyam_number && !UDYAM_RE.test(v.udyam_number)) e.udyam_number = "Enter a valid UDYAM number.";
    if (v.date_of_incorporation) {
      const d = new Date(v.date_of_incorporation);
      if (isNaN(d.getTime()) || d > new Date()) e.date_of_incorporation = "Please enter a valid date, not in the future.";
    }
    if (!v.website_url.trim() || !isHttp(v.website_url)) e.website_url = "Enter a full web address starting with https://";
    if (!v.company_logo) e.company_logo = "Please upload your company logo.";
    if (!v.director_name.trim()) e.director_name = "Please enter the director name.";
    if (!v.director_address.trim()) e.director_address = "Please enter the director address.";
    if (!MOBILE_RE.test(v.director_phone)) e.director_phone = "Enter a valid 10 digit mobile number.";
    if (!EMAIL_RE.test(v.director_email.trim())) e.director_email = "Please enter a valid email address.";
    if (v.alt_contact_phone && !MOBILE_RE.test(v.alt_contact_phone)) e.alt_contact_phone = "Enter a valid 10 digit mobile number.";
    if (!EMAIL_RE.test(v.company_email.trim())) e.company_email = "Please enter a valid company email address.";
    if (!(v.declaration_authorised && v.declaration_accuracy && v.consent_privacy)) e.declaration = "Please accept all three required declarations to continue.";
    return e;
  };

  const scrollToFirst = () => setTimeout(() => formRef.current?.querySelector('[role="alert"]')?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setMessage(null);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) { setMessage({ text: "Please correct the highlighted fields and try again.", kind: "bad" }); scrollToFirst(); return; }
    if (logoBusy) { setMessage({ text: "Please wait for the logo upload to finish.", kind: "bad" }); return; }
    setPreviewOpen(true);
  };

  const publish = async (confirmDuplicate = false) => {
    setSubmitting(true);
    try {
      const company = {
        ...v, director_email: v.director_email.trim(), company_email: v.company_email.trim(), website_url: v.website_url.trim(),
        confirm_duplicate: confirmDuplicate,
        parent_company_id: parentCompanyId || "",
      };
      const payload = {
        userId: loggedInEmail || company.director_email,
        directorEmail: company.director_email,
        templateSelection: templateId,
        intake: true,
        formData: { company, templateId },
        batchInfo: { isLastBatch: true, timestamp: Date.now(), processingMethod: "registration_form_v3" },
      };
      const res = await axios.post(`${COMPANY_API}/drafts`, payload, { timeout: 90000 });
      setDraftDetails(res.data);
      ["companyFormDraft", "digi_preview_mode", "gstSectionData", "verifiedGSTData", DRAFT_KEY].forEach(k => { try { localStorage.removeItem(k); } catch { /* ignore */ } });
      const draftId = res.data?.draftId, userId = res.data?.userId;
      if (userId) localStorage.setItem("dronetv_company_userId", userId);
      const cats = v.company_sectors.map(s => ({ drone_aerospace: "Drone", gis: "GIS", ai: "AI", robotics: "Robotics", business_support: "Business Support" }[s]));
      const fd = {
        ...initialFormData, companyCategory: cats, companyName: v.trade_name, yearEstablished: v.date_of_incorporation, state: v.registered_state,
        country: "India", officeAddress: v.registered_address, postalCode: v.registered_pincode, companyLogoUrl: v.company_logo, websiteUrl: v.website_url,
      };
      const aiGenData: any = mapFormDataToAIGenData(fd as any, draftId, userId);
      aiGenData.publishedId = res.data?.publishedId || "";
      const slug = templateId === "2" || templateId === "template-2" ? "t2" : "t1";
      navigate(`/edit/template/${slug}/${draftId}/${userId}`, { state: { aiGenData } });
    } catch (err: any) {
      setSubmitting(false);
      setPreviewOpen(false);
      const st = err?.response?.status, detail = err?.response?.data?.detail;
      if (st === 422 && detail?.errors) {
        setErrors(detail.errors);
        setMessage({ text: "Please correct the highlighted fields and try again.", kind: "bad" });
        scrollToFirst();
      } else if (st === 409 && detail && typeof detail === "object" && detail.duplicate) {
        setDupConfirm({ msg: detail.message || "This company is already listed on DroneTV." });
      } else if (st === 409) {
        setMessage({ text: `${typeof detail === "string" ? detail : "This company is already listed on DroneTV"}. If it is yours, sign in and open it from your dashboard instead of registering again, or contact support.`, kind: "bad" });
      } else {
        setMessage({ text: "Something went wrong while submitting. Please try again.", kind: "bad" });
        toast.error("Failed to list your company. Please try again.");
      }
    }
  };

  const err = (k: string) => errors[k] || "";
  const cls = (k: string, lock = false) => `${INPUT} ${err(k) ? BAD : ""} ${lock && locked ? LOCKED : ""}`;

  const previewRows: [string, string][] = ([
    ["Sectors", v.company_sectors.map(s => SECTOR_LABEL[s]).join(", ")],
    ["Primary Sector", v.primary_sector ? SECTOR_LABEL[v.primary_sector as SectorKey] : ""],
    ["Business Support Category", v.business_support_category === "Other Business Services" ? `Other: ${v.business_support_other}` : v.business_support_category],
    ["GST Number", v.gst_number], ["GST Verified", v.gst_verified ? "Yes" : "Not verified"],
    ["Company Name (Trade Name)", v.trade_name], ["Legal Name", v.legal_name],
    ["Registered Address", composed(v.registered_address, v.registered_state, v.registered_pincode)],
    ["Date of Incorporation", v.date_of_incorporation], ["Communication Address", v.communication_address],
    ["Business Entity Type", v.business_entity_type], ["PAN Number", v.pan_number],
    ["Nature of Business", v.nature_of_business === "Other" ? `Other: ${v.nature_of_business_other}` : v.nature_of_business],
    ["CIN", v.cin], ["UDYAM Number", v.udyam_number], ["Website", v.website_url],
    ["Director", `${v.director_title} ${v.director_name}`], ["Director Address", v.director_address],
    ["Director Phone", v.director_phone ? `+91 ${v.director_phone}` : ""], ["Director Email", v.director_email],
    ["Alternative Contact", v.alt_contact_name ? `${v.alt_contact_title} ${v.alt_contact_name}` : ""],
    ["Alternative Phone", v.alt_contact_phone ? `+91 ${v.alt_contact_phone}` : ""], ["Company Email", v.company_email], ["Promotional Code", v.promotional_code],
  ] as [string, string][]).filter(r => r[1]);

  return (
    <div className="min-h-screen bg-white text-[14px] text-[#1c1c1c]">
      <header className="mt-16 bg-[#fbc50b] px-5 py-2">
        <div className="mx-auto flex max-w-[760px] items-center justify-between gap-3">
          <button type="button" onClick={() => navigate(-1)} aria-label="Go back" className="size-[30px] rounded-full border border-[#c99a00] bg-white text-[15px] font-bold">&lt;</button>
          <div className="ml-2 flex flex-1 items-center gap-3"><img src="/images/Drone tv .in.png" alt="DroneTV" className="h-14 w-auto" /><div className="text-[11px] text-[#4a3a00]">Company Registration</div></div>
          <div className="hidden text-right text-[11px] leading-snug text-[#4a3a00] sm:block">Drone / Aerospace, GIS, AI, Robotics<br />and Business Support</div>
        </div>
      </header>
      <div className="bg-[#ffd75e] px-5 pb-2.5 pt-3">
        <div className="mx-auto max-w-[760px]">
          <div className="mb-1.5 flex justify-between text-[11px] text-[#4a3a00]"><span>Required details completed</span><span>{progress}% complete</span></div>
          <div className="h-1.5 overflow-hidden rounded bg-[#fff3c0]"><div className="h-full bg-[#1c1c1c] transition-all" style={{ width: `${progress}%` }} /></div>
        </div>
      </div>

      <div className="mx-auto mb-10 max-w-[760px] px-3.5">
        <div className="-mx-3.5 bg-gradient-to-b from-[#fbefb0] to-[#fff9dd] px-7 pb-[22px] pt-[18px]">
          <h1 className="text-lg font-extrabold">Company Information</h1>
          <p className="mt-[3px] text-[11px] text-[#5f5430]">Select your company category and provide basic details</p>
          {isVertical && (
            <div className="mt-2.5 rounded-md border border-[#1c1c1c]/15 bg-white/60 px-3 py-2 text-[11.5px] font-semibold text-[#3a3310]">
              Adding a new vertical under <span className="font-extrabold">{parentCompanyName || "your company"}</span>. GST/CIN/LLP is inherited automatically — you won't need to re-verify it.
            </div>
          )}
        </div>

        <form ref={formRef} onSubmit={onSubmit} noValidate className="-mt-2 rounded-[10px] border border-[#f0c94a] bg-white p-3.5 shadow-[0_2px_10px_rgba(0,0,0,.05)] sm:p-[22px]">
          <div className="mb-1 text-sm font-extrabold">Select Your Business Sector <span className="text-[#d40000]">*</span></div>
          <div className="mb-3 text-xs text-slate-500">Select all categories that apply to your company</div>
          <div className="mb-2.5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {SECTOR_INFO.map(s => {
              const on = v.company_sectors.includes(s.key);
              return (
                <label key={s.key} className={`relative block cursor-pointer rounded-lg px-3 text-center transition focus-within:ring-[3px] focus-within:ring-[#fbc50b]/45 ${on ? "border-2 border-[#1c1c1c] bg-[#ffd75e] py-[17px]" : "border border-[#f0c94a] bg-white py-[18px] hover:bg-[#fffaf0]"}`}>
                  <input type="checkbox" checked={on} onChange={() => toggleSector(s.key)} className="absolute right-2 top-2 size-3.5 cursor-pointer accent-[#1c1c1c]" />
                  <span className="mb-1 block text-xs font-extrabold">{s.name}</span>
                  <span className="block text-[9px] leading-snug text-slate-500">{s.desc}</span>
                </label>
              );
            })}
          </div>
          {err("company_sectors") ? <div role="alert" className="py-2 text-center text-xs font-bold text-[#d40000]">{err("company_sectors")}</div>
            : !v.company_sectors.length && <div className="py-3 text-center text-xs text-slate-500">Please select at least one category to continue</div>}

          {hasBss && (
            <Field label="Select Business Support Category" htmlFor="bss" required error={err("business_support_category")}>
              <select id="bss" value={v.business_support_category} onChange={e => set("business_support_category", e.target.value)} className={cls("business_support_category")}>
                <option value="">Select Business Support Category</option>
                {BUSINESS_SUPPORT_CATEGORIES.map(o => <option key={o}>{o}</option>)}
              </select>
              {v.business_support_category === "Other Business Services" && (
                <div className="mt-2.5">
                  <label htmlFor="bsso" className="mb-1.5 block text-[11px] font-bold">Please specify your service <span className="text-[#d40000]">*</span></label>
                  <input id="bsso" type="text" maxLength={100} value={v.business_support_other} onChange={e => set("business_support_other", e.target.value)} className={cls("business_support_other")} />
                  {err("business_support_other") && <div role="alert" className="mt-1.5 text-[11px] text-[#d40000]">{err("business_support_other")}</div>}
                </div>
              )}
            </Field>
          )}
          {v.company_sectors.length > 1 && (
            <Field label="Primary Sector" htmlFor="primary" required error={err("primary_sector")} help="Used for search results and your main listing.">
              <select id="primary" value={v.primary_sector} onChange={e => set("primary_sector", e.target.value)} className={cls("primary_sector")}>
                <option value="">Select Primary Sector</option>
                {v.company_sectors.map(s => <option key={s} value={s}>{SECTOR_LABEL[s]}</option>)}
              </select>
            </Field>
          )}

          {/* VERIFY GST */}
          <section className={PANEL}>
            <div className="mb-3.5 border-b border-[#f0c94a] pb-2 text-[13px] font-extrabold">Verify GST</div>
            <div className="mb-0.5 text-[13px] font-extrabold">Verify Your Company</div>
            <div className="mb-3 text-[11px] text-[#5f5430]">Automatically fill your company details using the government portal</div>
            <Field label="Verification Type" htmlFor="vtype">
              <select id="vtype" className={INPUT} value={v.verification_type} onChange={e => {
                const t = e.target.value as Values["verification_type"];
                patch({ verification_type: t, gst_verified: false, cin_verified: false, verify_token: "" });
                setGst({ s: "idle", msg: "" }); setCin({ s: "idle", msg: "" });
                setErrors(er => ({ ...er, gst_number: "", cin: "" }));
              }}>
                <option value="GST">GST</option>
                <option value="CIN">CIN</option>
                <option value="LLP">LLP</option>
              </select>
            </Field>
            {v.verification_type === "GST" ? (
              <>
                <Field label="GST Number" htmlFor="gst_number" required={!isVertical} error={err("gst_number")} help={isVertical ? `Optional - inherited from ${parentCompanyName || "the parent company"}.` : undefined}>
                  <input id="gst_number" type="text" maxLength={15} autoComplete="off" value={v.gst_number} onChange={e => onGstChange(e.target.value)} placeholder="22AAAAA0000A1Z5" className={cls("gst_number")} />
                </Field>
                <div className={`${INNER} mt-0`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="flex cursor-pointer items-center gap-2 text-xs"><input type="checkbox" checked={v.consent_gst_verification} onChange={e => set("consent_gst_verification", e.target.checked)} />I consent to GST verification</label>
                    <button type="button" className={BTN_SMALL} onClick={verifyGst} disabled={gst.s === "loading"}>{gst.s === "loading" ? "Verifying..." : "Verify"}</button>
                  </div>
                  {gst.msg && <div role="status" className={`mt-2 text-xs font-semibold leading-snug ${gst.s === "ok" ? "text-[#1b7a2f]" : "text-[#d40000]"}`}>{gst.msg}</div>}
                </div>
              </>
            ) : (
              <>
                <Field label={v.verification_type === "LLP" ? "LLPIN" : "Corporate Identity Number (CIN)"} htmlFor="cin_verify" required={!isVertical} error={err("cin")} help={isVertical ? `Optional - inherited from ${parentCompanyName || "the parent company"}.` : undefined}>
                  <input id="cin_verify" type="text" maxLength={21} autoComplete="off" value={v.cin} onChange={e => onCinChange(e.target.value)} placeholder={v.verification_type === "LLP" ? "AAA-1234" : "U72200KA2010PTC054321"} className={cls("cin")} />
                </Field>
                <div className={`${INNER} mt-0`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="flex cursor-pointer items-center gap-2 text-xs"><input type="checkbox" checked={v.consent_cin_verification} onChange={e => set("consent_cin_verification", e.target.checked)} />I consent to {v.verification_type} verification</label>
                    <button type="button" className={BTN_SMALL} onClick={verifyCin} disabled={cin.s === "loading"}>{cin.s === "loading" ? "Verifying..." : "Verify"}</button>
                  </div>
                  {cin.msg && <div role="status" className={`mt-2 text-xs font-semibold leading-snug ${cin.s === "ok" ? "text-[#1b7a2f]" : "text-[#d40000]"}`}>{cin.msg}</div>}
                </div>
              </>
            )}

            <div className={INNER}>
              <div className="mb-3 border-b border-[#f0c94a] pb-2 text-xs font-extrabold">Company Details</div>
              <Field label="Company Name (Trade Name)" htmlFor="trade_name" required error={err("trade_name")}>
                <input id="trade_name" type="text" maxLength={150} readOnly={locked} value={v.trade_name} onChange={e => set("trade_name", e.target.value)} placeholder="Enter company name" className={cls("trade_name", true)} />
              </Field>
              <Field label="Legal Name" htmlFor="legal_name" required error={err("legal_name")}>
                <input id="legal_name" type="text" maxLength={150} readOnly={locked} value={v.legal_name} onChange={e => set("legal_name", e.target.value)} placeholder="Enter legal name" className={cls("legal_name", true)} />
              </Field>
              <Field label="Registered Address" htmlFor="registered_address" required error={err("registered_address")} help="Please provide the full address as registered with the GST portal (excluding state and pincode).">
                <textarea id="registered_address" maxLength={300} readOnly={locked} value={v.registered_address} onChange={e => set("registered_address", e.target.value)} placeholder="Enter complete registered address (excluding state and pincode)" className={`${cls("registered_address", true)} min-h-[78px] resize-y`} />
              </Field>
              <Grid2>
                <Field label="State" htmlFor="registered_state" required error={err("registered_state")}>
                  <select id="registered_state" value={v.registered_state} onChange={e => set("registered_state", e.target.value)} className={cls("registered_state", true)}>
                    <option value="">Select State</option>{INDIA_STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Pincode" htmlFor="registered_pincode" required error={err("registered_pincode")}>
                  <input id="registered_pincode" type="text" inputMode="numeric" maxLength={6} readOnly={locked} value={v.registered_pincode} onChange={e => set("registered_pincode", e.target.value.replace(/\D/g, ""))} placeholder="6 digit pincode" className={cls("registered_pincode", true)} />
                </Field>
              </Grid2>
              <Field label="Date of Incorporation" htmlFor="doi" error={err("date_of_incorporation")} className="mt-3.5">
                <input id="doi" type="date" max={new Date().toISOString().split("T")[0]} readOnly={locked} value={v.date_of_incorporation} onChange={e => set("date_of_incorporation", e.target.value)} className={cls("date_of_incorporation", true)} />
              </Field>
              <Field label="Communication Address" htmlFor="communication_address" required error={err("communication_address")}>
                <label className="mb-1.5 flex cursor-pointer items-center gap-2 text-xs"><input type="checkbox" checked={v.same_as_registered} onChange={e => set("same_as_registered", e.target.checked)} />Same as Registered Address</label>
                <textarea id="communication_address" maxLength={400} readOnly={v.same_as_registered} value={v.communication_address} onChange={e => set("communication_address", e.target.value)} placeholder="Enter communication address" className={`${INPUT} ${err("communication_address") ? BAD : ""} ${v.same_as_registered ? LOCKED : ""} min-h-[78px] resize-y`} />
              </Field>
            </div>

            <Field label="Business Entity Type" htmlFor="business_entity_type" required error={err("business_entity_type")} className="mt-3.5">
              <select id="business_entity_type" value={v.business_entity_type} onChange={e => set("business_entity_type", e.target.value)} className={cls("business_entity_type")}>
                <option value="">Select your business entity type</option>{BUSINESS_ENTITY_TYPES.map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="PAN Number" htmlFor="pan_number" required={!isVertical} error={err("pan_number")} help={isVertical ? `Optional - inherited from ${parentCompanyName || "the parent company"}.` : undefined}>
              <input id="pan_number" type="text" maxLength={10} autoComplete="off" value={v.pan_number} onChange={e => { setPanAuto(false); set("pan_number", e.target.value.toUpperCase().replace(/\s/g, "")); }} placeholder="Enter PAN Number (e.g., ABCDE1234F)" className={cls("pan_number")} />
            </Field>
            <Field label="Nature of Business" htmlFor="nature_of_business" required error={err("nature_of_business")}>
              <select id="nature_of_business" value={v.nature_of_business} onChange={e => { set("nature_of_business", e.target.value); if (e.target.value !== "Other") set("nature_of_business_other", ""); }} className={cls("nature_of_business")}>
                <option value="">Select nature of business</option>{NATURE_OF_BUSINESS.map(o => <option key={o}>{o}</option>)}
              </select>
              {v.nature_of_business === "Other" && (
                <div className="mt-2.5">
                  <input id="nature_other" type="text" maxLength={100} value={v.nature_of_business_other} onChange={e => set("nature_of_business_other", e.target.value)} placeholder="Please specify" className={cls("nature_of_business_other")} />
                  {err("nature_of_business_other") && <div role="alert" className="mt-1.5 text-[11px] text-[#d40000]">{err("nature_of_business_other")}</div>}
                </div>
              )}
            </Field>
            {v.verification_type === "GST" && (
              // Only shown in GST mode - in CIN/LLP mode the Verification Type
              // panel above is already editing this same v.cin field, so a
              // second input here would just be a confusing duplicate.
              <Field label="Corporate Identity Number (CIN)" htmlFor="cin" error={err("cin")} help="For companies registered with the Registrar of Companies. Leave blank if not applicable.">
                <input id="cin" type="text" maxLength={21} autoComplete="off" value={v.cin} onChange={e => set("cin", e.target.value.toUpperCase().replace(/\s/g, ""))} placeholder="Enter CIN" className={cls("cin")} />
              </Field>
            )}
            <Field label="UDYAM Registration Number" htmlFor="udyam" error={err("udyam_number")} help="Format: UDYAM, state code, two digits, seven digits.">
              <input id="udyam" type="text" maxLength={19} autoComplete="off" value={v.udyam_number} onChange={e => set("udyam_number", e.target.value.toUpperCase().replace(/\s/g, ""))} placeholder="Enter UDYAM Registration Number" className={cls("udyam_number")} />
            </Field>
            <Field label="Website URL" htmlFor="website_url" required error={err("website_url")}>
              <input id="website_url" type="url" value={v.website_url} onChange={e => set("website_url", e.target.value)} onBlur={fetchLogoFromWebsite} placeholder="https://www.yourcompany.com" className={cls("website_url")} />
            </Field>
            <Field label="Company Logo" htmlFor="company_logo" required error={err("company_logo")} help={logoBusy ? (logoNote || "Uploading...") : v.company_logo ? (logoNote || "Logo uploaded.") : logoNote || "PNG, JPG, SVG. Shown in your website header. Maximum 2 MB."}>
              <div className="flex items-center gap-3.5">
                <div className="flex size-14 flex-none items-center justify-center overflow-hidden rounded-md border border-dashed border-[#c9b25a] bg-white text-[10px] text-slate-500">
                  {v.company_logo ? <img src={v.company_logo} alt="Logo preview" className="max-h-full max-w-full" /> : "Logo"}
                </div>
                <input id="company_logo" type="file" accept=".png,.jpg,.jpeg,.svg" onChange={e => { onLogo(e.target.files?.[0]); e.target.value = ""; }} className={`${INPUT} ${err("company_logo") ? BAD : ""}`} />
              </div>
            </Field>
            <Field label="Promotional Code" htmlFor="promo" className="!mb-0">
              <input id="promo" type="text" maxLength={30} autoComplete="off" value={v.promotional_code} onChange={e => set("promotional_code", e.target.value.toUpperCase().replace(/\s/g, ""))} placeholder="Enter promotional code" className={INPUT} />
            </Field>
          </section>

          {/* DIRECTOR */}
          <div className="mt-[22px]"><div className="text-[15px] font-extrabold">Director / MD Details</div><div className="mb-3 text-xs text-slate-500">Tell us about your basic information</div></div>
          <section className={`${PANEL_DEEP} !mt-1.5`}>
            <div className="mb-3.5 border-b border-[#e0bd3a] pb-2 text-[13px] font-extrabold">Director / MD Information</div>
            <Field label="Director Name" htmlFor="director_name" required error={err("director_name")}>
              <TitleName id="director_name" title={v.director_title} name={v.director_name} onTitle={t => set("director_title", t)} onName={n => set("director_name", n)} bad={!!err("director_name")} />
            </Field>
            <Field label="Director Address" htmlFor="director_address" required error={err("director_address")}>
              <textarea id="director_address" maxLength={300} value={v.director_address} onChange={e => set("director_address", e.target.value)} placeholder="Enter complete address" className={`${cls("director_address")} min-h-[78px] resize-y`} />
            </Field>
            <Grid2>
              <Field label="Director Phone" htmlFor="director_phone" required error={err("director_phone")}><Phone id="director_phone" value={v.director_phone} onChange={x => set("director_phone", x)} placeholder="Enter phone number" bad={!!err("director_phone")} /></Field>
              <Field label="Director Email" htmlFor="director_email" required error={err("director_email")}><input id="director_email" type="email" maxLength={150} value={v.director_email} onChange={e => set("director_email", e.target.value)} placeholder="director@company.com" className={cls("director_email")} /></Field>
            </Grid2>
          </section>

          <section className={PANEL_DEEP}>
            <div className="mb-3.5 border-b border-[#e0bd3a] pb-2 text-[13px] font-extrabold">Alternative Contact</div>
            <Grid2>
              <Field label="Contact Person Name" htmlFor="alt_contact_name"><TitleName id="alt_contact_name" title={v.alt_contact_title} name={v.alt_contact_name} onTitle={t => set("alt_contact_title", t)} onName={n => set("alt_contact_name", n)} /></Field>
              <Field label="Contact Phone" htmlFor="alt_contact_phone" error={err("alt_contact_phone")}><Phone id="alt_contact_phone" value={v.alt_contact_phone} onChange={x => set("alt_contact_phone", x)} placeholder="Enter phone number" bad={!!err("alt_contact_phone")} /></Field>
            </Grid2>
            <Field label="Company Email" htmlFor="company_email" required error={err("company_email")} className="mt-3.5 !mb-0">
              <input id="company_email" type="email" maxLength={150} value={v.company_email} onChange={e => set("company_email", e.target.value)} placeholder="company@yourcompany.com" className={cls("company_email")} />
            </Field>
          </section>

          {/* DECLARATION */}
          <section className={PANEL}>
            <div className="mb-3.5 border-b border-[#f0c94a] pb-2 text-[13px] font-extrabold">Declaration and Consent</div>
            {([
              ["declaration_authorised", "I am a director or authorised signatory of this company and I am authorised to create this listing on its behalf."],
              ["declaration_accuracy", "I confirm that the details entered are true and correct, and that the company is responsible for their accuracy. I understand that DroneTV provides this platform and does not verify or certify the company's information."],
              ["consent_privacy", "I agree to the Terms of Listing and Privacy Policy and consent to DroneTV processing the company and director details to create and display the company profile."],
            ] as const).map(([k, text]) => (
              <label key={k} className="mt-2 flex cursor-pointer items-start gap-2 text-xs leading-relaxed">
                <input type="checkbox" checked={v[k]} onChange={e => set(k, e.target.checked)} className="mt-[3px]" />
                <span>{text}<span className="text-[#d40000]"> *</span></span>
              </label>
            ))}
            <div className="mt-3 rounded border-l-4 border-[#e0a100] bg-white px-3 py-2.5 text-xs leading-relaxed">
              The login link to claim and manage this profile is sent only to the phone number and email registered against the GST or incorporation record, not to the contact details typed in this form.
            </div>
            {err("declaration") && <div role="alert" className="mt-2 text-[11px] text-[#d40000]">{err("declaration")}</div>}
          </section>

          {message && <div role="alert" className={`mt-4 rounded-md border px-3.5 py-3 text-[13px] ${message.kind === "ok" ? "border-[#1b7a2f] bg-[#e8f6ec] text-[#1b7a2f]" : "border-[#d40000] bg-[#fdeaea] text-[#d40000]"}`}>{message.text}</div>}

          <div className="mt-6 flex items-center justify-between rounded-[10px] border border-[#f0c94a] bg-white p-3">
            <button type="button" onClick={() => navigate(-1)} className="rounded-md bg-[#ffd75e] px-[18px] py-2.5 text-xs font-bold">&lt; Previous</button>
            <button type="submit" className="rounded-md bg-[#1c1c1c] px-[22px] py-[11px] text-[13px] font-extrabold text-white">Preview &amp; Publish</button>
          </div>
        </form>
      </div>
      <footer className="p-[18px] text-center text-[11px] text-slate-500">Copyright 2026 DroneTV.in | India&rsquo;s Drone / Aerospace, GIS and AI Industry Network</footer>

      {previewOpen && (
        <div className="fixed inset-0 z-[100000000] flex items-center justify-center bg-black/45 p-3.5" role="dialog" aria-modal="true" aria-label="Preview your company details">
          <div className="w-full max-w-[620px] overflow-hidden rounded-[10px] border border-[#f0c94a] bg-white">
            <div className="bg-[#fbc50b] px-[18px] py-3.5 text-sm font-extrabold">Preview your company details</div>
            <div className="max-h-[60vh] overflow-auto px-[18px] py-4">
              <table className="w-full border-collapse text-xs">
                <tbody>{previewRows.map(([k, val]) => (
                  <tr key={k}><td className="w-[38%] border-b border-[#f1e6b8] p-[7px] align-top font-bold text-[#4a3a00]">{k}</td><td className="break-words border-b border-[#f1e6b8] p-[7px] align-top">{val}</td></tr>
                ))}</tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2.5 border-t border-[#f0c94a] px-[18px] py-3">
              <button type="button" onClick={() => setPreviewOpen(false)} disabled={submitting} className="rounded-md bg-[#eee] px-[18px] py-2.5 text-xs font-bold">Edit</button>
              <button type="button" onClick={() => publish()} disabled={submitting} className="rounded-md bg-[#1c1c1c] px-[22px] py-[11px] text-[13px] font-extrabold text-white disabled:opacity-60">{submitting ? "Publishing..." : "Publish"}</button>
            </div>
          </div>
        </div>
      )}

      {dupConfirm && (
        <div className="fixed inset-0 z-[100000001] flex items-center justify-center bg-black/45 p-3.5" role="dialog" aria-modal="true" aria-label="Company already listed">
          <div className="w-full max-w-[460px] overflow-hidden rounded-[10px] border border-[#f0c94a] bg-white">
            <div className="bg-[#fbc50b] px-[18px] py-3.5 text-sm font-extrabold">Already listed</div>
            <div className="px-[18px] py-4 text-[13px] text-[#333]">{dupConfirm.msg} Do you want to continue?</div>
            <div className="flex justify-end gap-2.5 border-t border-[#f0c94a] px-[18px] py-3">
              <button type="button" onClick={() => { setDupConfirm(null); setSubmitting(false); }} disabled={submitting} className="rounded-md bg-[#eee] px-[18px] py-2.5 text-xs font-bold">Cancel</button>
              <button type="button" onClick={() => { setDupConfirm(null); publish(true); }} disabled={submitting} className="rounded-md bg-[#1c1c1c] px-[22px] py-[11px] text-[13px] font-extrabold text-white disabled:opacity-60">OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyRegistrationForm;
