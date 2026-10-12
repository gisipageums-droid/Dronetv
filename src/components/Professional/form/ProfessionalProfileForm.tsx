import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { PROFESSIONAL_API } from "../../../lib/apiConfig";
import { useUserAuth } from "../../context/context";
import { uploadFile } from "./src/api/formApi";
import { extractResumeText } from "../../../lib/resumeText";
import {
  SECTOR_INFO, SECTOR_LABEL, SPECIALIZATIONS, INDIA_STATES, CERT_TYPES, BUSINESS_SUPPORT_CATEGORIES,
  PROFESSIONAL_TYPES, EXPERIENCE_LEVELS, AVAILABILITY, WORK_PREFERENCES, GENDERS, countryNames, type SectorKey,
} from "../../../lib/professionalOptions";
import {
  EMPTY_PROFILE, profileFromStored, kycMobilePrefill, digilockerInit, digilockerPoll, usernameAvailable,
  type ProfileValues, type CertEntry,
} from "../../../lib/professionalProfile";

const MIN_AGE = 18;
const MAX_SKILLS = 20;
const MAX_CERTS = 10;
const MAX_MB = { resume: 5, photo: 2, cert: 5 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[6-9][0-9]{9}$/;
const PIN_RE = /^[1-9][0-9]{5}$/;
const USER_RE = /^[a-z0-9_]{3,30}$/;

const INPUT = "w-full rounded-md border border-[#f0d27a] bg-white px-3 py-2.5 text-[13px] text-[#1c1c1c] outline-none focus:border-[#e0a100] focus:ring-[3px] focus:ring-[#fbc50b]/30 disabled:bg-[#f6f1e2] disabled:text-slate-400";
const BAD = "!border-[#d40000]";
const PANEL = "mt-[18px] rounded-[10px] bg-[#fff4cb] p-[18px] shadow-[0_1px_4px_rgba(0,0,0,.06)]";
const PANEL_TITLE = "mb-3.5 border-b border-[#f0c94a] pb-2 text-[13px] font-extrabold";
const BTN_SMALL = "whitespace-nowrap rounded-md border border-[#c99a00] bg-[#ffd75e] px-3.5 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-50";

type Errors = Record<string, string>;

const Field: React.FC<{ label: string; htmlFor?: string; required?: boolean; error?: string; help?: string; className?: string; children: React.ReactNode }> =
  ({ label, htmlFor, required, error, help, className = "", children }) => (
    <div className={`mb-3.5 flex flex-col ${className}`}>
      <label htmlFor={htmlFor} className="mb-1.5 text-xs font-bold">{label}{required && <span className="text-[#d40000]"> *</span>}</label>
      {children}
      {help && !error && <div className="mt-1.5 text-[11px] leading-snug text-slate-500">{help}</div>}
      {error && <div role="alert" className="mt-1.5 text-[11px] text-[#d40000]">{error}</div>}
    </div>
  );

const Grid2: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 [&>div]:mb-0">{children}</div>;

const PhoneBox: React.FC<{ id: string; value: string; onChange: (v: string) => void; placeholder: string; bad?: boolean }> = ({ id, value, onChange, placeholder, bad }) => (
  <div className={`flex overflow-hidden rounded-md border bg-white focus-within:ring-[3px] focus-within:ring-[#fbc50b]/30 ${bad ? "border-[#d40000]" : "border-[#f0d27a]"}`}>
    <span className="flex items-center border-r border-[#f0d27a] bg-[#fbf3d6] px-2.5 text-xs">+91</span>
    <input id={id} type="tel" inputMode="numeric" maxLength={10} value={value} placeholder={placeholder}
      onChange={e => onChange(e.target.value.replace(/\D/g, ""))} className="w-full bg-white px-3 py-2.5 text-[13px] outline-none" />
  </div>
);

function ageOf(dob: string): number {
  const d = new Date(dob), n = new Date();
  let a = n.getFullYear() - d.getFullYear();
  if (n.getMonth() < d.getMonth() || (n.getMonth() === d.getMonth() && n.getDate() < d.getDate())) a--;
  return a;
}

const isHttp = (v: string) => { try { return /^https?:$/.test(new URL(v.trim()).protocol); } catch { return false; } };
const tooBig = (f: File | undefined | null, mb: number) => !!f && f.size > mb * 1024 * 1024;

type Step = "idle" | "loading" | "ok" | "bad";

const ProfessionalProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId: editUserId, professionalId: editProfessionalId } = useParams<{ userId?: string; professionalId?: string }>();
  const { isLogin, user } = useUserAuth();
  const editing = !!(editUserId && editProfessionalId);

  const [v, setV] = useState<ProfileValues>(EMPTY_PROFILE);
  const [errors, setErrors] = useState<Errors>({});
  const [loadingDraft, setLoadingDraft] = useState(editing);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; kind: "ok" | "bad" } | null>(null);
  const [templateSelection, setTemplateSelection] = useState<string>(String(location.state?.templateId ?? ""));
  const [resumeDocs, setResumeDocs] = useState<any[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  const [submissionId] = useState(() => (editing ? editProfessionalId! : `draft-${Date.now()}`));

  // verification state
  const [phoneConsent, setPhoneConsent] = useState(false);
  const [phoneState, setPhoneState] = useState<{ s: Step; msg: string }>({ s: "idle", msg: "" });
  const [userState, setUserState] = useState<{ s: Step; msg: string }>({ s: "idle", msg: "" });
  const [idState, setIdState] = useState<{ s: "idle" | "loading" | "ready" | "polling" | "verified" | "error"; msg: string; url: string; clientId: string }>({ s: "idle", msg: "", url: "", clientId: "" });
  const [identityClientId, setIdentityClientId] = useState("");
  const [alreadyVerified, setAlreadyVerified] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const popupRef = useRef<Window | null>(null);

  const [skillInput, setSkillInput] = useState("");
  const [busyUpload, setBusyUpload] = useState<Record<string, boolean>>({});
  const [resumeName, setResumeName] = useState("");
  const countries = useMemo(countryNames, []);
  const formRef = useRef<HTMLFormElement>(null);

  const set = useCallback(<K extends keyof ProfileValues>(key: K, value: ProfileValues[K]) => {
    setV(p => ({ ...p, [key]: value }));
    setErrors(e => (e[key as string] ? { ...e, [key as string]: "" } : e));
  }, []);

  // account email wins for uploads and ownership, same as the older form
  const accountEmail = isLogin ? (user?.userData?.email || "") : "";
  useEffect(() => {
    if (accountEmail && !v.email) setV(p => ({ ...p, email: accountEmail }));
  }, [accountEmail]); // eslint-disable-line react-hooks/exhaustive-deps

  // open an existing profile for editing
  useEffect(() => {
    if (!editing) return;
    let cancelled = false;
    const load = async (): Promise<any> => {
      // The owner (or an admin) can always read the saved form. Anyone else only
      // gets it from the draft link once the website content has been built.
      try {
        const own = await axios.get(`${PROFESSIONAL_API}/${editProfessionalId}`, { timeout: 20000 });
        if (own.data?.formData) return { ...own.data, templateSelection: own.data.templateSelection };
      } catch { /* fall back to the draft link */ }
      for (let i = 0; i < 20; i++) {
        const res = await fetch(`${PROFESSIONAL_API}/draft/${editUserId}/${editProfessionalId}`);
        if (res.status === 200) return res.json();
        if (res.status !== 202) throw new Error(String(res.status));
        await new Promise(r => setTimeout(r, 4000));
        if (cancelled) throw new Error("cancelled");
      }
      throw new Error("timeout");
    };
    (async () => {
      try {
        const d = await load();
        if (cancelled) return;
        setV(profileFromStored(d.formData));
        const fd = d.formData || {};
        const tpl = d.templateSelection || fd.templateSelection;
        if (tpl) setTemplateSelection(String(tpl));
        setResumeDocs(Array.isArray(fd.resume) ? fd.resume : []);
        setMedia(Array.isArray(fd.media) ? fd.media : []);
        setAlreadyVerified(!!fd.profile?.identity_verified);
      } catch {
        if (!cancelled) setMessage({ text: "We could not open this profile yet. If you just created it, wait a minute and try again.", kind: "bad" });
      } finally {
        if (!cancelled) setLoadingDraft(false);
      }
    })();
    return () => { cancelled = true; };
  }, [editing, editUserId, editProfessionalId]);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); popupRef.current?.close(); }, []);

  // ---- sectors -------------------------------------------------------------------
  const tech = v.sectors.filter(s => s !== "business_support") as Exclude<SectorKey, "business_support">[];
  const hasBss = v.sectors.includes("business_support");

  const toggleSector = (k: SectorKey) => {
    setV(p => {
      const sectors = p.sectors.includes(k) ? p.sectors.filter(s => s !== k) : [...p.sectors, k];
      const nextTech = sectors.filter(s => s !== "business_support") as Exclude<SectorKey, "business_support">[];
      const allowed = new Set(nextTech.flatMap(s => SPECIALIZATIONS[s]));
      return {
        ...p,
        sectors,
        primary_sector: sectors.length === 1 ? sectors[0] : (sectors.includes(p.primary_sector as SectorKey) ? p.primary_sector : ""),
        specialization: allowed.has(p.specialization) ? p.specialization : "",
        business_support_category: sectors.includes("business_support") ? p.business_support_category : "",
        business_support_other: sectors.includes("business_support") ? p.business_support_other : "",
      };
    });
    setErrors(e => ({ ...e, sectors: "" }));
  };

  // ---- phone check (Surepass mobile prefill) -----------------------------------------
  const verifyPhone = async () => {
    if (!MOBILE_RE.test(v.mobile)) { setErrors(e => ({ ...e, mobile: "Enter a valid 10 digit Indian mobile number." })); return; }
    if (!phoneConsent) { setPhoneState({ s: "bad", msg: "Please tick the consent box to verify your phone number." }); return; }
    setPhoneState({ s: "loading", msg: "Checking..." });
    try {
      const r = await kycMobilePrefill(v.mobile);
      if (r.status !== "success") { setPhoneState({ s: "bad", msg: "We could not find details for this number. You can fill the form yourself." }); return; }
      setV(p => ({
        ...p,
        full_name: p.full_name || r.fullName || "",
        date_of_birth: p.date_of_birth || r.dateOfBirth || "",
        gender: p.gender || (r.gender ? r.gender.charAt(0).toUpperCase() + r.gender.slice(1) : ""),
        address: p.address || r.address || "",
        city: p.city || r.cityDistrict || "",
        pin_code: p.pin_code || r.pincode || "",
        country: p.country || r.country || "India",
        state: p.state || (INDIA_STATES.includes(r.state || "") ? r.state! : ""),
        email: p.email || r.email || "",
        nationality: p.nationality || "India",
      }));
      setPhoneState({ s: "ok", msg: "Number checked. Your details were filled in. Please review them." });
    } catch {
      setPhoneState({ s: "bad", msg: "Something went wrong. Please try again or fill the details yourself." });
    }
  };

  // ---- username --------------------------------------------------------------------
  const checkUser = async () => {
    if (!USER_RE.test(v.user_name)) return;
    try {
      const ok = await usernameAvailable(v.user_name, editing ? editProfessionalId : undefined);
      setUserState(ok ? { s: "ok", msg: "This username is available." } : { s: "bad", msg: "This username is already taken." });
      if (!ok) setErrors(e => ({ ...e, user_name: "This username is already taken." }));
    } catch { /* the server checks again on submit */ }
  };

  // ---- identity (Surepass DigiLocker, popup and poll) ----------------------------------
  const startIdentity = async () => {
    setIdState({ s: "loading", msg: "", url: "", clientId: "" });
    try {
      const d = await digilockerInit();
      const popup = window.open(d.url, "digilocker-verify", "width=620,height=720,left=300,top=80");
      popupRef.current = popup;
      setIdState({ s: "polling", msg: "Complete the DigiLocker steps in the new window.", url: d.url, clientId: d.client_id });
      let attempts = 0;
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(async () => {
        attempts++;
        let ok = false;
        try { ok = await digilockerPoll(d.client_id); } catch { /* keep trying */ }
        if (ok) {
          clearInterval(pollRef.current!); popupRef.current?.close();
          setIdentityClientId(d.client_id);
          setIdState({ s: "verified", msg: "Identity check completed. It is confirmed by our server when you submit.", url: "", clientId: d.client_id });
        } else if (popupRef.current?.closed && attempts > 3) {
          clearInterval(pollRef.current!);
          setIdState({ s: "error", msg: "The DigiLocker window was closed before the check finished. You can try again.", url: "", clientId: "" });
        } else if (attempts >= 90) {
          clearInterval(pollRef.current!);
          setIdState({ s: "error", msg: "The identity check timed out. Please try again.", url: "", clientId: "" });
        }
      }, 2000);
    } catch {
      setIdState({ s: "error", msg: "We could not start the identity check right now. Please try again later.", url: "", clientId: "" });
    }
  };

  // ---- skills ----------------------------------------------------------------------
  const addSkill = (raw: string) => {
    const s = raw.trim();
    if (!s || v.skills.length >= MAX_SKILLS) return;
    if (v.skills.some(k => k.toLowerCase() === s.toLowerCase())) return;
    set("skills", [...v.skills, s]);
  };

  // ---- uploads ---------------------------------------------------------------------
  const uploadOwner = () => (accountEmail || (EMAIL_RE.test(v.email) ? v.email : "guest"));
  const busy = (key: string, on: boolean) => setBusyUpload(b => ({ ...b, [key]: on }));

  const onPhoto = async (f: File | undefined) => {
    if (!f) return;
    if (!/\.(jpe?g|png)$/i.test(f.name) || tooBig(f, MAX_MB.photo)) { setErrors(e => ({ ...e, photo_url: "Photo must be JPG or PNG, up to 2 MB." })); return; }
    busy("photo", true);
    try {
      const r = await uploadFile(uploadOwner(), "userImage", f);
      set("photo_url", r.url);
      setMedia(m => [...m.filter(x => x.fieldName !== "userImage"), { fieldName: "userImage", fileUrl: r.url, fileName: f.name }]);
    } catch { setErrors(e => ({ ...e, photo_url: "Upload failed. Please try again." })); }
    finally { busy("photo", false); }
  };

  const onResume = async (f: File | undefined) => {
    if (!f) return;
    if (!/\.(pdf|docx?|DOCX?)$/i.test(f.name) || tooBig(f, MAX_MB.resume)) { setErrors(e => ({ ...e, resume_url: "Resume must be PDF, DOC or DOCX, up to 5 MB." })); return; }
    busy("resume", true);
    try {
      const [r, text] = await Promise.all([uploadFile(uploadOwner(), "resume", f), extractResumeText(f).catch(() => "")]);
      set("resume_url", r.url);
      setResumeName(f.name);
      setResumeDocs(text ? [{ id: String(Date.now()), name: f.name, type: f.type || "unknown", size: f.size, extractedText: text, uploadDate: new Date().toISOString() }] : []);
    } catch { setErrors(e => ({ ...e, resume_url: "Upload failed. Please try again." })); }
    finally { busy("resume", false); }
  };

  const setCert = (i: number, patch: Partial<CertEntry>) => set("certifications", v.certifications.map((c, k) => (k === i ? { ...c, ...patch } : c)));
  const onCertFile = async (i: number, f: File | undefined) => {
    if (!f) return;
    if (!/\.(pdf|jpe?g|png)$/i.test(f.name) || tooBig(f, MAX_MB.cert)) { setErrors(e => ({ ...e, certifications: "Certificate must be PDF, JPG or PNG, up to 5 MB." })); return; }
    busy(`cert${i}`, true);
    try {
      const r = await uploadFile(uploadOwner(), "certification", f);
      setCert(i, { file_url: r.url, file_name: f.name });
    } catch { setErrors(e => ({ ...e, certifications: "Upload failed. Please try again." })); }
    finally { busy(`cert${i}`, false); }
  };

  // ---- progress --------------------------------------------------------------------
  const progress = useMemo(() => {
    const checks = [
      v.sectors.length > 0, MOBILE_RE.test(v.mobile), !!v.full_name.trim(), USER_RE.test(v.user_name), EMAIL_RE.test(v.email.trim()),
      !!v.nationality, !!v.job_title.trim(), !!v.tagline.trim(), !!v.professional_type,
      tech.length === 0 || !!v.specialization, !hasBss || !!v.business_support_category, v.declaration_accuracy && v.consent_privacy,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [v, tech.length, hasBss]);

  // ---- validation (the server checks everything again) ---------------------------------
  const validate = (): Errors => {
    const e: Errors = {};
    if (!v.sectors.length) e.sectors = "Please select at least one business sector.";
    if (v.sectors.length > 1 && !v.primary_sector) e.primary_sector = "Please choose your primary sector.";
    if (tech.length && !v.specialization) e.specialization = "Please select a specialization.";
    if (hasBss) {
      if (!v.business_support_category) e.business_support_category = "Please select a business support category.";
      if (v.business_support_category === "Other Business Services" && !v.business_support_other.trim()) e.business_support_other = "Please describe your service.";
    }
    if (!v.full_name.trim()) e.full_name = "Please enter your full name.";
    if (!v.professional_type) e.professional_type = "Please select your professional type.";
    if (!v.job_title.trim()) e.job_title = "Please enter your title or designation.";
    if (!v.tagline.trim()) e.tagline = "Please enter a short tagline.";
    if (!v.nationality) e.nationality = "Please select your nationality.";
    if (!EMAIL_RE.test(v.email.trim())) e.email = "Please enter a valid email address.";
    if (!MOBILE_RE.test(v.mobile)) e.mobile = "Enter a valid 10 digit Indian mobile number.";
    if (!USER_RE.test(v.user_name)) e.user_name = "Enter a valid username.";
    if (v.pin_code && !PIN_RE.test(v.pin_code)) e.pin_code = "Enter a valid 6 digit pin code.";
    if (v.alt_contact_phone && !MOBILE_RE.test(v.alt_contact_phone)) e.alt_contact_phone = "Enter a valid 10 digit mobile number.";
    if (v.alt_contact_email.trim() && !EMAIL_RE.test(v.alt_contact_email.trim())) e.alt_contact_email = "Please enter a valid email address.";
    (["portfolio", "linkedin", "instagram", "youtube", "facebook", "twitter"] as const).forEach(k => {
      if (v[k].trim() && !isHttp(v[k])) e[k] = "Enter a full web address starting with https://";
    });
    if (v.date_of_birth) {
      const d = new Date(v.date_of_birth);
      if (isNaN(d.getTime()) || d > new Date()) e.date_of_birth = "Please enter a valid date of birth.";
      else if (ageOf(v.date_of_birth) < MIN_AGE) e.date_of_birth = `You must be at least ${MIN_AGE} years old to create a profile.`;
    }
    if (!(v.declaration_accuracy && v.consent_privacy)) e.declaration = "Please accept both required declarations to continue.";
    return e;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setMessage(null);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      setMessage({ text: "Please correct the highlighted fields and try again.", kind: "bad" });
      setTimeout(() => {
        const first = formRef.current?.querySelector('[role="alert"]');
        first?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }
    if (Object.values(busyUpload).some(Boolean)) { setMessage({ text: "Please wait for the uploads to finish.", kind: "bad" }); return; }

    setSubmitting(true);
    const email = accountEmail || v.email.trim().toLowerCase();
    const rawTemplate = templateSelection || "1";
    const templateId = String(rawTemplate).includes("2") ? 2 : 1;
    const payload = {
      userId: email,
      username: v.user_name,
      submissionId,
      draftId: submissionId,
      intake: true,
      formData: {
        profile: { ...v, mobile: v.mobile, identity_client_id: identityClientId || undefined },
        media,
        resume: resumeDocs,
        templateSelection: templateId,
      },
      templateSelection: templateId,
    };
    try {
      let res;
      if (editing) res = await axios.put(`${PROFESSIONAL_API}/${editUserId}/${editProfessionalId}`, payload);
      else res = await axios.post(`${PROFESSIONAL_API}/submit`, payload);
      if (identityClientId && res.data && res.data.identityVerified === false) {
        toast.warn("Your profile was saved, but we could not confirm the identity check. You can try again from your dashboard.");
      }
      try { localStorage.removeItem("professionalFormDraft"); } catch { /* ignore */ }
      navigate(`/professional/edit/${submissionId}/${editing ? editUserId : email}/template=${templateId}`);
    } catch (err: any) {
      setSubmitting(false);
      const detail = err?.response?.data?.detail;
      if (err?.response?.status === 422 && detail?.errors) {
        setErrors(detail.errors);
        setMessage({ text: "Please correct the highlighted fields and try again.", kind: "bad" });
        setTimeout(() => formRef.current?.querySelector('[role="alert"]')?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
      } else if (err?.response?.status === 409) {
        setMessage({ text: typeof detail === "string" ? detail : "This identity check was already used for another profile.", kind: "bad" });
      } else {
        setMessage({ text: "Something went wrong while submitting. Please try again.", kind: "bad" });
      }
    }
  };

  const specOptions = tech.map(s => ({ label: SECTOR_LABEL[s], items: SPECIALIZATIONS[s] }));
  const err = (k: string) => errors[k] || "";
  const cls = (k: string) => `${INPUT} ${err(k) ? BAD : ""}`;

  if (loadingDraft) {
    return <div className="flex min-h-screen items-center justify-center bg-white text-sm font-semibold" role="status">Opening your profile...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-[14px] text-[#1c1c1c]">
      <header className="bg-[#fbc50b] px-5 py-2">
        <div className="mx-auto flex max-w-[760px] items-center justify-between gap-3">
          <button type="button" onClick={() => navigate(-1)} aria-label="Go back" className="size-[30px] rounded-full border border-[#c99a00] bg-white text-[15px] font-bold">&lt;</button>
          <div className="ml-2 flex-1">
            <img src="/images/Drone tv .in.png" alt="DroneTV" className="h-14 w-auto" />
            <div className="text-[11px] text-[#4a3a00]">Professional Profile</div>
          </div>
          <div className="hidden text-right text-[11px] leading-snug text-[#4a3a00] sm:block">Drone / Aerospace, GIS, AI, Robotics<br />and Business Support</div>
        </div>
      </header>
      <div className="bg-[#ffd75e] px-5 pb-2.5 pt-3">
        <div className="mx-auto max-w-[760px]">
          <div className="mb-1.5 flex justify-between text-[11px] text-[#4a3a00]"><span>Required details completed</span><span>{progress}% complete</span></div>
          <div className="h-1.5 overflow-hidden rounded bg-[#fff3c0]"><div className="h-full bg-[#1c1c1c] transition-all" style={{ width: `${progress}%` }} /></div>
        </div>
      </div>

      <div className="mx-auto mb-10 mt-[22px] max-w-[760px] px-3.5">
        <form ref={formRef} onSubmit={submit} noValidate className="rounded-[10px] border border-[#f0c94a] p-3.5 shadow-[0_2px_10px_rgba(0,0,0,.05)] sm:p-[22px]">
          <h1 className="mb-[18px] border-b border-[#f0c94a] pb-2 text-[17px] font-extrabold text-[#e0a100]">Professional Information</h1>

          {/* SECTORS */}
          <div className="mb-1 text-sm font-extrabold">Select Your Business Sector <span className="text-[#d40000]">*</span></div>
          <div className="mb-3 text-xs text-slate-500">Select the main sector of your work. You can select more than one.</div>
          <div className="mb-2.5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {SECTOR_INFO.map(s => {
              const on = v.sectors.includes(s.key);
              return (
                <label key={s.key} className={`relative block cursor-pointer rounded-lg px-3 text-center transition focus-within:ring-[3px] focus-within:ring-[#fbc50b]/45 ${on ? "border-2 border-[#1c1c1c] bg-[#ffd75e] py-[17px]" : "border border-[#f0c94a] bg-white py-[18px] hover:bg-[#fffaf0]"}`}>
                  <input type="checkbox" checked={on} onChange={() => toggleSector(s.key)} className="absolute right-2 top-2 size-3.5 cursor-pointer accent-[#1c1c1c]" />
                  <span className="mb-1 block text-xs font-extrabold">{s.name}</span>
                  <span className="block text-[9px] leading-snug text-slate-500">{s.desc}</span>
                </label>
              );
            })}
          </div>
          {err("sectors") && <div role="alert" className="mb-2 text-[11px] text-[#d40000]">{err("sectors")}</div>}

          {hasBss && (
            <Field label="Select Business Support Category" htmlFor="bss" required error={err("business_support_category")}>
              <select id="bss" value={v.business_support_category} onChange={e => set("business_support_category", e.target.value)} className={cls("business_support_category")}>
                <option value="">Select Business Support Category</option>
                {BUSINESS_SUPPORT_CATEGORIES.map(o => <option key={o}>{o}</option>)}
              </select>
              {v.business_support_category === "Other Business Services" && (
                <div className="mt-2.5">
                  <label htmlFor="bsso" className="mb-1.5 block text-xs font-bold">Please specify your service <span className="text-[#d40000]">*</span></label>
                  <input id="bsso" type="text" maxLength={100} value={v.business_support_other} onChange={e => set("business_support_other", e.target.value)} className={cls("business_support_other")} />
                  {err("business_support_other") && <div role="alert" className="mt-1.5 text-[11px] text-[#d40000]">{err("business_support_other")}</div>}
                </div>
              )}
            </Field>
          )}

          {v.sectors.length > 1 && (
            <Field label="Primary Sector" htmlFor="primary" required error={err("primary_sector")}>
              <select id="primary" value={v.primary_sector} onChange={e => set("primary_sector", e.target.value)} className={cls("primary_sector")}>
                <option value="">Select Primary Sector</option>
                {v.sectors.map(s => <option key={s} value={s}>{SECTOR_LABEL[s]}</option>)}
              </select>
            </Field>
          )}

          {/* BASIC INFORMATION */}
          <section className={PANEL}>
            <div className={PANEL_TITLE}>Basic Information</div>
            <Field label="Phone Number" htmlFor="mobile" required error={err("mobile")}>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex-1"><PhoneBox id="mobile" value={v.mobile} onChange={x => { set("mobile", x); setPhoneState({ s: "idle", msg: "" }); }} placeholder="Enter 10 digit mobile number" bad={!!err("mobile")} /></div>
                <button type="button" className={BTN_SMALL} onClick={verifyPhone} disabled={phoneState.s === "loading"}>{phoneState.s === "loading" ? "Checking..." : "Verify"}</button>
              </div>
              <label className="mt-2 flex cursor-pointer items-start gap-2 text-xs leading-snug">
                <input type="checkbox" checked={phoneConsent} onChange={e => setPhoneConsent(e.target.checked)} className="mt-0.5" />
                <span>I consent to phone number verification</span>
              </label>
              {phoneState.msg && <div role="status" className={`mt-1.5 text-xs font-semibold ${phoneState.s === "ok" ? "text-[#1b7a2f]" : "text-[#d40000]"}`}>{phoneState.msg}</div>}
            </Field>

            <Field label="Full Name" htmlFor="full_name" required error={err("full_name")}>
              <input id="full_name" type="text" maxLength={100} value={v.full_name} onChange={e => set("full_name", e.target.value)} placeholder="Enter your full name" className={cls("full_name")} />
            </Field>

            <Grid2>
              <Field label="Date of Birth" htmlFor="dob" error={err("date_of_birth")}>
                <input id="dob" type="date" max={new Date().toISOString().split("T")[0]} value={v.date_of_birth} onChange={e => set("date_of_birth", e.target.value)} className={cls("date_of_birth")} />
              </Field>
              <Field label="Gender" htmlFor="gender">
                <select id="gender" value={v.gender} onChange={e => set("gender", e.target.value)} className={INPUT}>
                  <option value="">Select Gender</option>
                  {GENDERS.map(g => <option key={g}>{g}</option>)}
                </select>
              </Field>
            </Grid2>

            <Field label="Address" htmlFor="address" className="mt-3.5">
              <textarea id="address" maxLength={300} value={v.address} onChange={e => set("address", e.target.value)} placeholder="Complete address with building details" className={`${INPUT} min-h-[84px] resize-y`} />
            </Field>
            <Grid2>
              <Field label="City / District" htmlFor="city"><input id="city" type="text" maxLength={100} value={v.city} onChange={e => set("city", e.target.value)} placeholder="Enter city or district" className={INPUT} /></Field>
              <Field label="Pin Code" htmlFor="pin" error={err("pin_code")}>
                <input id="pin" type="text" inputMode="numeric" maxLength={6} value={v.pin_code} onChange={e => set("pin_code", e.target.value.replace(/\D/g, ""))} placeholder="Enter 6 digit pin code" className={cls("pin_code")} />
              </Field>
            </Grid2>
            <div className="mt-3.5"><Grid2>
              <Field label="Country" htmlFor="country">
                <select id="country" value={v.country} onChange={e => { set("country", e.target.value); set("state", ""); }} className={INPUT}>
                  <option value="">Select Country</option>
                  {countries.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="State" htmlFor="state" error={err("state")}>
                {v.country === "India" ? (
                  <select id="state" value={v.state} onChange={e => set("state", e.target.value)} className={INPUT}>
                    <option value="">Select State</option>
                    {INDIA_STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                ) : v.country ? (
                  <input id="state" type="text" maxLength={100} value={v.state} onChange={e => set("state", e.target.value)} placeholder="State / Province / Region" className={INPUT} />
                ) : (
                  <select id="state" disabled className={INPUT}><option>Select country first</option></select>
                )}
              </Field>
            </Grid2></div>
          </section>

          {/* ACCOUNT */}
          <section className={PANEL}>
            <div className={PANEL_TITLE}>Professional Information</div>
            <Field label="User Name" htmlFor="user_name" required error={err("user_name")} help="3 to 30 characters. Lowercase letters, numbers and underscore only.">
              <div className="mb-1 break-all text-[11px] text-[#1a56c4]">https://www.dronetv.in/professional/{v.user_name}</div>
              <input id="user_name" type="text" maxLength={30} autoComplete="username" value={v.user_name}
                onChange={e => { set("user_name", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")); setUserState({ s: "idle", msg: "" }); }}
                onBlur={checkUser} placeholder="Enter your username" className={cls("user_name")} />
              {userState.s === "ok" && <div className="mt-1.5 text-xs font-semibold text-[#1b7a2f]">{userState.msg}</div>}
            </Field>
            <Field label="Email" htmlFor="email" required error={err("email")}>
              <input id="email" type="email" maxLength={150} value={v.email} readOnly={!!accountEmail} onChange={e => set("email", e.target.value)} placeholder="Enter your email address" className={`${cls("email")} ${accountEmail ? "bg-[#f6f1e2]" : ""}`} />
            </Field>
          </section>

          <div className="mt-[18px]">
            <Field label="Nationality / Country of Citizenship" htmlFor="nationality" required error={err("nationality")}>
              <select id="nationality" value={v.nationality} onChange={e => set("nationality", e.target.value)} className={cls("nationality")}>
                <option value="">Select Nationality</option>
                {countries.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          {/* PROFESSIONAL DETAILS */}
          <section className={PANEL}>
            <div className={PANEL_TITLE}>Professional Details</div>
            <Field label="Profile Title / Designation" htmlFor="job_title" required error={err("job_title")}>
              <input id="job_title" type="text" maxLength={100} value={v.job_title} onChange={e => set("job_title", e.target.value)} placeholder="e.g., UAV Engineer, Marketing Manager, Consultant" className={cls("job_title")} />
            </Field>
            <Field label="Professional Tagline" htmlFor="tagline" required error={err("tagline")} help={'Example: "Turning aerial data into survey grade maps"'}>
              <input id="tagline" type="text" maxLength={120} value={v.tagline} onChange={e => set("tagline", e.target.value)} placeholder="A short phrase that describes your professional expertise" className={cls("tagline")} />
            </Field>
            <Grid2>
              <Field label="Professional Type" htmlFor="ptype" required error={err("professional_type")}>
                <select id="ptype" value={v.professional_type} onChange={e => set("professional_type", e.target.value)} className={cls("professional_type")}>
                  <option value="">Select Professional Type</option>
                  {PROFESSIONAL_TYPES.map(o => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Organisation / Company" htmlFor="org"><input id="org" type="text" maxLength={150} value={v.organisation} onChange={e => set("organisation", e.target.value)} placeholder="Current organisation" className={INPUT} /></Field>
            </Grid2>
            {tech.length > 0 && (
              <Field label="Specialization" htmlFor="spec" required error={err("specialization")} className="mt-3.5">
                <select id="spec" value={v.specialization} onChange={e => set("specialization", e.target.value)} className={cls("specialization")}>
                  <option value="">Select Specialization</option>
                  {specOptions.map(g => <optgroup key={g.label} label={g.label}>{g.items.map(n => <option key={n} value={n}>{n}</option>)}</optgroup>)}
                </select>
              </Field>
            )}
            <div className="mt-3.5"><Grid2>
              <Field label="Experience Level" htmlFor="exp"><select id="exp" value={v.experience_level} onChange={e => set("experience_level", e.target.value)} className={INPUT}><option value="">Select Experience</option>{EXPERIENCE_LEVELS.map(o => <option key={o}>{o}</option>)}</select></Field>
              <Field label="Current Availability" htmlFor="avail"><select id="avail" value={v.availability} onChange={e => set("availability", e.target.value)} className={INPUT}><option value="">Select Availability</option>{AVAILABILITY.map(o => <option key={o}>{o}</option>)}</select></Field>
              <Field label="Work Preference" htmlFor="work"><select id="work" value={v.work_preference} onChange={e => set("work_preference", e.target.value)} className={INPUT}><option value="">Select Preference</option>{WORK_PREFERENCES.map(o => <option key={o}>{o}</option>)}</select></Field>
              <Field label="Preferred Work Location" htmlFor="ploc"><input id="ploc" type="text" maxLength={100} value={v.preferred_location} onChange={e => set("preferred_location", e.target.value)} placeholder="Example: Hyderabad, Bengaluru, Remote" className={INPUT} /></Field>
            </Grid2></div>
          </section>

          {/* SKILLS */}
          <section className={PANEL}>
            <div className={PANEL_TITLE}>Skills and Expertise</div>
            <Field label="Professional Skills" htmlFor="skillInput" help="Add up to 20 skills. Press Enter or comma after each one. Each skill is saved separately so people can be found by skill.">
              <div className="flex cursor-text flex-wrap gap-1.5 rounded-md border border-[#f0d27a] bg-white px-2 py-1.5 focus-within:border-[#e0a100] focus-within:ring-[3px] focus-within:ring-[#fbc50b]/30" onClick={() => document.getElementById("skillInput")?.focus()}>
                {v.skills.map((s, i) => (
                  <span key={s} className="flex items-center gap-1 rounded-2xl border border-[#1c1c1c] bg-[#ffd75e] py-[3px] pl-2.5 pr-1 text-xs font-semibold">
                    {s}<button type="button" aria-label={`Remove ${s}`} onClick={() => set("skills", v.skills.filter((_, k) => k !== i))} className="px-1.5 text-[13px] leading-none">x</button>
                  </span>
                ))}
                <input id="skillInput" type="text" maxLength={40} value={skillInput} placeholder="Type a skill and press Enter. Example: LiDAR, QGIS, Python"
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(skillInput.replace(",", "")); setSkillInput(""); }
                    else if (e.key === "Backspace" && !skillInput && v.skills.length) set("skills", v.skills.slice(0, -1));
                  }}
                  onBlur={() => { addSkill(skillInput); setSkillInput(""); }}
                  className="min-w-[160px] flex-1 border-none bg-transparent p-1.5 text-[13px] outline-none" />
              </div>
            </Field>
          </section>

          {/* CERTIFICATIONS */}
          <section className={PANEL}>
            <div className={PANEL_TITLE}>Certifications</div>
            {err("certifications") && <div role="alert" className="mb-2 text-[11px] text-[#d40000]">{err("certifications")}</div>}
            {v.certifications.map((c, i) => (
              <div key={i} className="mb-3 rounded-lg border border-[#f0c94a] bg-white p-3.5">
                <div className="mb-3 flex items-center justify-between text-xs font-bold">
                  <span>Certification {i + 1}</span>
                  <button type="button" className={BTN_SMALL} onClick={() => set("certifications", v.certifications.filter((_, k) => k !== i))}>Remove</button>
                </div>
                <Grid2>
                  <Field label="Certification Type"><select value={c.type} onChange={e => setCert(i, { type: e.target.value })} className={INPUT}><option value="">Select Certification</option>{CERT_TYPES.map(o => <option key={o}>{o}</option>)}</select></Field>
                  <Field label="Issuing Organisation"><input type="text" maxLength={150} value={c.issuer} onChange={e => setCert(i, { issuer: e.target.value })} placeholder="Organisation name" className={INPUT} /></Field>
                  <Field label="Certificate Number"><input type="text" maxLength={60} value={c.number} onChange={e => setCert(i, { number: e.target.value })} className={INPUT} /></Field>
                  <Field label="Certificate Upload" help={busyUpload[`cert${i}`] ? "Uploading..." : c.file_name ? `Uploaded: ${c.file_name}` : undefined}>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => { onCertFile(i, e.target.files?.[0]); e.target.value = ""; }} className={INPUT} />
                  </Field>
                </Grid2>
              </div>
            ))}
            <button type="button" className={BTN_SMALL} disabled={v.certifications.length >= MAX_CERTS} onClick={() => set("certifications", [...v.certifications, { type: "", issuer: "", number: "", file_url: "", file_name: "" }])}>
              {v.certifications.length ? "Add another certification" : "Add a certification"}
            </button>
            <div className="mt-1.5 text-[11px] text-slate-500">Optional. Up to 10 certificates. PDF, JPG or PNG, maximum 5 MB each. A certificate is marked checked only after our team reviews the file.</div>
          </section>

          {/* ABOUT */}
          <section className={PANEL}>
            <div className={PANEL_TITLE}>About You</div>
            <Field label="Professional Summary" htmlFor="summary">
              <textarea id="summary" maxLength={1000} value={v.summary} onChange={e => set("summary", e.target.value)} placeholder="Briefly describe your professional experience, expertise and key projects." className={`${INPUT} min-h-[84px] resize-y`} />
              <div className="mt-[3px] text-right text-[11px] text-slate-500">{v.summary.length} / 1000</div>
            </Field>
            <Field label="Portfolio / Website" htmlFor="portfolio" error={err("portfolio")}>
              <input id="portfolio" type="url" value={v.portfolio} onChange={e => set("portfolio", e.target.value)} placeholder="https://..." className={cls("portfolio")} />
            </Field>
            <Grid2>
              <Field label="Upload Resume / CV" htmlFor="resume" error={err("resume_url")} help={busyUpload.resume ? "Uploading..." : (resumeName || v.resume_url) ? `Uploaded${resumeName ? `: ${resumeName}` : ""}` : "PDF, DOC or DOCX, maximum 5 MB."}>
                <input id="resume" type="file" accept=".pdf,.doc,.docx" onChange={e => { onResume(e.target.files?.[0]); e.target.value = ""; }} className={cls("resume_url")} />
              </Field>
              <Field label="Profile Photo" htmlFor="photo" error={err("photo_url")} help={busyUpload.photo ? "Uploading..." : v.photo_url ? "Photo uploaded." : "JPG or PNG, maximum 2 MB."}>
                <input id="photo" type="file" accept=".jpg,.jpeg,.png" onChange={e => { onPhoto(e.target.files?.[0]); e.target.value = ""; }} className={cls("photo_url")} />
              </Field>
            </Grid2>
          </section>

          {/* ALTERNATE CONTACT */}
          <section className={PANEL}>
            <div className={PANEL_TITLE}>Alternate Contact</div>
            <Grid2>
              <Field label="Contact Person Name" htmlFor="altn"><input id="altn" type="text" maxLength={100} value={v.alt_contact_name} onChange={e => set("alt_contact_name", e.target.value)} placeholder="Name of alternate contact person" className={INPUT} /></Field>
              <Field label="Contact Phone" htmlFor="altp" error={err("alt_contact_phone")}><PhoneBox id="altp" value={v.alt_contact_phone} onChange={x => set("alt_contact_phone", x)} placeholder="Alternate phone number" bad={!!err("alt_contact_phone")} /></Field>
            </Grid2>
            <Field label="Contact Email" htmlFor="alte" error={err("alt_contact_email")} className="mt-3.5 !mb-0">
              <input id="alte" type="email" maxLength={150} value={v.alt_contact_email} onChange={e => set("alt_contact_email", e.target.value)} placeholder="Alternate email address" className={cls("alt_contact_email")} />
            </Field>
          </section>

          {/* SOCIAL */}
          <section className={PANEL}>
            <div className={PANEL_TITLE}>Social Media Links</div>
            <Grid2>
              {([["linkedin", "LinkedIn", "https://linkedin.com/in/yourprofile"], ["instagram", "Instagram", "https://instagram.com/yourprofile"], ["youtube", "YouTube", "https://youtube.com/yourchannel"], ["facebook", "Facebook", "https://facebook.com/yourprofile"], ["twitter", "Twitter / X", "https://x.com/yourprofile"]] as const).map(([k, label, ph]) => (
                <Field key={k} label={label} htmlFor={k} error={err(k)}><input id={k} type="url" value={v[k]} onChange={e => set(k, e.target.value)} placeholder={ph} className={cls(k)} /></Field>
              ))}
            </Grid2>
          </section>

          {/* IDENTITY */}
          <section className={PANEL}>
            <div className={PANEL_TITLE}>Identity Verification</div>
            <div className="mb-3 rounded border-l-4 border-[#e0a100] bg-white px-3 py-2.5 text-xs leading-relaxed">
              Your identity is confirmed through DigiLocker, where you share your own document. DroneTV does not ask you to type your Aadhaar number and does not store it. You are responsible for the accuracy of the details in your profile.
            </div>
            {alreadyVerified && idState.s !== "verified" ? (
              <div role="status" className="text-xs font-semibold text-[#1b7a2f]">Your identity is already verified.</div>
            ) : (
              <>
                <button type="button" className={BTN_SMALL} onClick={startIdentity} disabled={idState.s === "loading" || idState.s === "polling" || idState.s === "verified"}>
                  {idState.s === "loading" ? "Starting..." : idState.s === "polling" ? "Waiting for DigiLocker..." : idState.s === "verified" ? "Identity check completed" : "Verify with DigiLocker"}
                </button>
                {idState.msg && <div role="status" className={`mt-1.5 text-xs font-semibold ${idState.s === "verified" ? "text-[#1b7a2f]" : idState.s === "error" ? "text-[#d40000]" : "text-slate-700"}`}>{idState.msg}</div>}
              </>
            )}
            <div className="mt-1.5 text-[11px] text-slate-500">Optional. A verified profile is listed first in the directory and shows a Verified badge.</div>
          </section>

          {/* DECLARATION */}
          <section className={PANEL}>
            <div className={PANEL_TITLE}>Declaration and Consent</div>
            {([
              ["declaration_accuracy", "I confirm that the information I have entered is true and correct, and that I am responsible for its accuracy. I understand that DroneTV provides this platform and does not verify or certify my details.", true],
              ["consent_privacy", "I agree to the Terms of Use and Privacy Policy and consent to DroneTV processing my personal data to create and display my professional profile.", true],
              ["consent_contact", "I am happy to be contacted by DroneTV and by employers or companies through the platform about opportunities.", false],
              ["show_contact_public", "Show my email address and mobile number on my public profile. If this is left unticked, they stay private.", false],
            ] as const).map(([k, text, req]) => (
              <label key={k} className="mt-2 flex cursor-pointer items-start gap-2 text-xs leading-relaxed">
                <input type="checkbox" checked={v[k]} onChange={e => set(k, e.target.checked)} className="mt-[3px]" />
                <span>{text}{req && <span className="text-[#d40000]"> *</span>}</span>
              </label>
            ))}
            {err("declaration") && <div role="alert" className="mt-2 text-[11px] text-[#d40000]">{err("declaration")}</div>}
          </section>

          {message && (
            <div role="alert" className={`mt-4 rounded-md border px-3.5 py-3 text-[13px] ${message.kind === "ok" ? "border-[#1b7a2f] bg-[#e8f6ec] text-[#1b7a2f]" : "border-[#d40000] bg-[#fdeaea] text-[#d40000]"}`}>{message.text}</div>
          )}

          <div className="mt-6 flex justify-end gap-2.5">
            <button type="submit" disabled={submitting} className="rounded-md bg-[#fbc50b] px-6 py-[11px] text-[13px] font-extrabold text-[#1c1c1c] hover:bg-[#1c1c1c] hover:text-[#fbc50b] disabled:opacity-60">
              {submitting ? "Submitting..." : editing ? "Save Professional Profile" : "Create Professional Profile"}
            </button>
          </div>
        </form>
      </div>
      <footer className="p-[18px] text-center text-[11px] text-slate-500">Copyright 2026 DroneTV.in | India&rsquo;s Drone / Aerospace, GIS and AI Industry Network</footer>
    </div>
  );
};

export default ProfessionalProfileForm;
