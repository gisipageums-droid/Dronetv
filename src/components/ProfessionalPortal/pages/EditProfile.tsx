import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUserAuth } from "../../context/context";
import { getMyProfessional, getPortalProfile, updateProfessionalBase, savePortalProfileSection } from "../api";
import { PageHeader, Card, CardHeader, Field, inputCls, FormGrid, ActionBar, Badge } from "../ui";

const SPECIALISATIONS = [
  "Agriculture Spraying", "NDVI / Crop Mapping", "Infrastructure Inspection",
  "Aerial Photography", "LiDAR Survey", "Flight Instruction",
];
const AVAILABILITY = ["Available for Full-Time", "Available for Contract", "Open to Both", "Not Currently Looking"];

export default function EditProfile() {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [professionalId, setProfessionalId] = useState("");
  const [slug, setSlug] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [specialisation, setSpecialisation] = useState(SPECIALISATIONS[0]);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [availability, setAvailability] = useState(AVAILABILITY[0]);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    (async () => {
      try {
        const card = await getMyProfessional(userId);
        if (!card) { setLoading(false); return; }
        setProfessionalId(card.professionalId);
        setSlug(card.urlSlug || card.professionalId);
        setFullName(card.fullName || "");
        setEmail(card.email || userId);
        setPhone(card.phone || "");
        setLocation(card.location || "");
        setBio(card.professionalDescription || "");

        const portal = await getPortalProfile(card.professionalId);
        const profile = portal.profile || {};
        setDisplayName(profile.displayName || card.fullName || "");
        setSpecialisation(profile.specialisation || SPECIALISATIONS[0]);
        setLinkedinUrl(profile.linkedinUrl || "");
        setAvailability(profile.availability || AVAILABILITY[0]);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const save = async () => {
    if (!professionalId) return;
    setSaving(true);
    try {
      await updateProfessionalBase(userId, professionalId, { fullName, email, phone, location, bio });
      await savePortalProfileSection(professionalId, "profile", { displayName, specialisation, linkedinUrl, availability });
      toast.success("Profile saved and updated on DroneTv.in");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Card className="text-center py-16 text-white/40">Loading...</Card>;
  if (!professionalId) return <Card className="text-center py-16 text-white/40">No professional profile found for this account.</Card>;

  return (
    <div>
      <PageHeader title="Edit Profile" sub={`Your public pilot profile on dev.dronetv.in/professionals/${slug}`} />
      <Card>
        <CardHeader title="Personal & Professional Information" action={<Badge tone="success">Profile Live</Badge>} />
        <div className="p-4">
          <div className="flex items-center gap-4 pb-5 border-b border-white/10 mb-5">
            <div className="w-16 h-16 rounded-full bg-brand-yellow flex items-center justify-center text-xl font-extrabold text-ink flex-shrink-0">
              {(displayName || fullName || "P").slice(0, 2).toUpperCase()}
            </div>
            <div className="text-[12px] text-white/40">
              Profile: dev.dronetv.in/professionals/{slug}
            </div>
          </div>
          <FormGrid>
            <Field label="Full Name" required>
              <input className={inputCls} value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </Field>
            <Field label="Display Name (shown on profile)">
              <input className={inputCls} value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </Field>
            <Field label="Email Address" required>
              <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Mobile / WhatsApp">
              <input className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Field>
            <Field label="City / State">
              <input className={inputCls} value={location} onChange={(e) => setLocation(e.target.value)} />
            </Field>
            <Field label="Primary Specialisation">
              <select className={inputCls} value={specialisation} onChange={(e) => setSpecialisation(e.target.value)}>
                {SPECIALISATIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Professional Bio (shown on profile)" wide>
              <textarea className={`${inputCls} min-h-[110px] resize-y`} value={bio} onChange={(e) => setBio(e.target.value)} />
            </Field>
            <Field label="LinkedIn Profile URL">
              <input className={inputCls} placeholder="https://linkedin.com/in/..." value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
            </Field>
            <Field label="Availability">
              <select className={inputCls} value={availability} onChange={(e) => setAvailability(e.target.value)}>
                {AVAILABILITY.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>
          </FormGrid>
          <ActionBar onSave={save} saveLabel={saving ? "Saving..." : "Save Profile"} />
        </div>
      </Card>
    </div>
  );
}
