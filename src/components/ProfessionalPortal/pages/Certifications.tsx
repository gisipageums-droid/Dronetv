import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Award, Plus, Trash2 } from "lucide-react";
import { useUserAuth } from "../../context/context";
import { getMyProfessional, getPortalProfile, savePortalProfileSection } from "../api";
import { PageHeader, Card, CardHeader, Field, inputCls, FormGrid, Btn, Badge, EmptyState } from "../ui";

interface Certification {
  id: string;
  name: string;
  certificateNumber: string;
  issuer: string;
  category: string;
  issuedDate: string;
  validUntil: string;
  rptoName: string;
  operationsAuthorised: string;
}

interface MedicalCertificate {
  fitnessClass: string;
  examinerName: string;
  certificateNumber: string;
  lastExamDate: string;
  validUntil: string;
}

const emptyCert = (): Certification => ({
  id: `cert-${Date.now()}`, name: "", certificateNumber: "", issuer: "DGCA India",
  category: "Small (250g – 2kg MTOW)", issuedDate: "", validUntil: "", rptoName: "", operationsAuthorised: "",
});

function daysRemaining(validUntil: string): number | null {
  if (!validUntil) return null;
  const diff = new Date(validUntil).getTime() - Date.now();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function Certifications() {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [professionalId, setProfessionalId] = useState("");
  const [certs, setCerts] = useState<Certification[]>([]);
  const [medical, setMedical] = useState<MedicalCertificate>({ fitnessClass: "Class 2 — Fit to Fly", examinerName: "", certificateNumber: "", lastExamDate: "", validUntil: "" });
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Certification>(emptyCert());

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    (async () => {
      try {
        const card = await getMyProfessional(userId);
        if (!card) { setLoading(false); return; }
        setProfessionalId(card.professionalId);
        const portal = await getPortalProfile(card.professionalId);
        setCerts(portal.certifications || []);
        if (portal.medicalCertificate) setMedical(portal.medicalCertificate);
      } catch {
        toast.error("Failed to load certifications");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const saveCerts = async (next: Certification[]) => {
    setCerts(next);
    setSaving(true);
    try {
      await savePortalProfileSection(professionalId, "certifications", next);
    } catch {
      toast.error("Failed to save certifications");
    } finally {
      setSaving(false);
    }
  };

  const addCert = async () => {
    if (!draft.name || !draft.certificateNumber) {
      toast.error("Certificate name and number are required");
      return;
    }
    await saveCerts([...certs, draft]);
    toast.success("Certification added");
    setDraft(emptyCert());
    setAdding(false);
  };

  const removeCert = async (id: string) => {
    await saveCerts(certs.filter(c => c.id !== id));
    toast.success("Certification removed");
  };

  const saveMedical = async () => {
    setSaving(true);
    try {
      await savePortalProfileSection(professionalId, "medicalCertificate", medical);
      toast.success("Medical certificate saved");
    } catch {
      toast.error("Failed to save medical certificate");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Card className="text-center py-16 text-white/40">Loading...</Card>;
  if (!professionalId) return <Card className="text-center py-16 text-white/40">No professional profile found for this account.</Card>;

  return (
    <div>
      <PageHeader title="DGCA Certifications" sub="Your Remote Pilot Certificates — verified and displayed on your DroneTv.in profile" />

      {certs.length === 0 && !adding ? (
        <EmptyState text="No certifications added yet." />
      ) : (
        certs.map(cert => {
          const days = daysRemaining(cert.validUntil);
          return (
            <Card key={cert.id} className="mb-3.5">
              <div className="p-4 flex gap-4 items-start">
                <div className="w-12 h-12 rounded-lg bg-brand-yellow/15 flex items-center justify-center flex-shrink-0">
                  <Award size={22} className="text-brand-yellow" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold text-white mb-1">{cert.name}</div>
                  <div className="text-[11.5px] text-white/40 mb-2">Certificate No.: {cert.certificateNumber} · Issued by: {cert.issuer}</div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-white/60">
                    <span>Category: <b className="text-white">{cert.category}</b></span>
                    {cert.rptoName && <span>RPTO: <b className="text-white">{cert.rptoName}</b></span>}
                    {cert.issuedDate && <span>Issued: <b className="text-white">{cert.issuedDate}</b></span>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[10px] text-white/40 uppercase tracking-wide mb-1">Valid Until</div>
                  <div className="text-sm font-bold text-status-success">{cert.validUntil || "—"}</div>
                  {days !== null && (
                    <div className={`text-[11px] mt-0.5 ${days < 90 ? "text-status-error" : "text-white/40"}`}>
                      {days >= 0 ? `${Math.round(days / 30)} months remaining` : "Expired"}
                    </div>
                  )}
                  <button onClick={() => removeCert(cert.id)} className="mt-2 text-status-error/70 hover:text-status-error" title="Remove">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </Card>
          );
        })
      )}

      {adding ? (
        <Card className="mb-5">
          <CardHeader title="Add Certification" />
          <div className="p-4">
            <FormGrid>
              <Field label="Certificate Name" required><input className={inputCls} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="DGCA Remote Pilot Certificate — Small Category" /></Field>
              <Field label="Certificate Number" required><input className={inputCls} value={draft.certificateNumber} onChange={(e) => setDraft({ ...draft, certificateNumber: e.target.value })} /></Field>
              <Field label="Issuer"><input className={inputCls} value={draft.issuer} onChange={(e) => setDraft({ ...draft, issuer: e.target.value })} /></Field>
              <Field label="Category">
                <select className={inputCls} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
                  <option>Small (250g – 2kg MTOW)</option>
                  <option>Medium (2kg – 25kg MTOW)</option>
                  <option>Large (25kg+ MTOW)</option>
                </select>
              </Field>
              <Field label="RPTO Name"><input className={inputCls} value={draft.rptoName} onChange={(e) => setDraft({ ...draft, rptoName: e.target.value })} /></Field>
              <Field label="Issued Date"><input className={inputCls} type="date" value={draft.issuedDate} onChange={(e) => setDraft({ ...draft, issuedDate: e.target.value })} /></Field>
              <Field label="Valid Until"><input className={inputCls} type="date" value={draft.validUntil} onChange={(e) => setDraft({ ...draft, validUntil: e.target.value })} /></Field>
              <Field label="Operations Authorised" wide><input className={inputCls} value={draft.operationsAuthorised} onChange={(e) => setDraft({ ...draft, operationsAuthorised: e.target.value })} placeholder="Agriculture, Survey, Photography, Inspection" /></Field>
            </FormGrid>
            <div className="flex gap-3 mt-5">
              <Btn onClick={addCert}>Save Certification</Btn>
              <Btn variant="outline" onClick={() => { setAdding(false); setDraft(emptyCert()); }}>Cancel</Btn>
            </div>
          </div>
        </Card>
      ) : (
        <Btn variant="outline" onClick={() => setAdding(true)} className="mb-6"><Plus size={15} /> Add Certification</Btn>
      )}

      <div className="text-sm font-bold text-white mt-2 mb-3">DGCA Medical Certificate</div>
      <Card>
        <div className="p-4">
          <FormGrid>
            <Field label="Fitness Class">
              <select className={inputCls} value={medical.fitnessClass} onChange={(e) => setMedical({ ...medical, fitnessClass: e.target.value })}>
                <option>Class 2 — Fit to Fly</option>
                <option>Class 1 — Fit to Fly</option>
              </select>
            </Field>
            <Field label="Examiner Name"><input className={inputCls} value={medical.examinerName} onChange={(e) => setMedical({ ...medical, examinerName: e.target.value })} /></Field>
            <Field label="Medical Certificate Number"><input className={inputCls} value={medical.certificateNumber} onChange={(e) => setMedical({ ...medical, certificateNumber: e.target.value })} /></Field>
            <Field label="Last Examination Date"><input className={inputCls} type="date" value={medical.lastExamDate} onChange={(e) => setMedical({ ...medical, lastExamDate: e.target.value })} /></Field>
            <Field label="Valid Until"><input className={inputCls} type="date" value={medical.validUntil} onChange={(e) => setMedical({ ...medical, validUntil: e.target.value })} /></Field>
          </FormGrid>
          <div className="mt-5">
            <Btn onClick={saveMedical}>{saving ? "Saving..." : "Save Medical Certificate"}</Btn>
          </div>
        </div>
      </Card>
    </div>
  );
}
