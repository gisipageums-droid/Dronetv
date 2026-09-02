import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Plus, X } from "lucide-react";
import { useUserAuth } from "../../context/context";
import { getMyProfessional, getPortalProfile, savePortalProfileSection } from "../api";
import { PageHeader, Card, CardHeader, Btn, SkillRow, inputCls } from "../ui";

interface Skill { name: string; level: number; }

export default function Skills() {
  const { user } = useUserAuth();
  const userId = (user as any)?.userData?.email || (user as any)?.email || "";
  const [loading, setLoading] = useState(true);
  const [professionalId, setProfessionalId] = useState("");
  const [flightSkills, setFlightSkills] = useState<Skill[]>([]);
  const [softwareSkills, setSoftwareSkills] = useState<Skill[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [newFlight, setNewFlight] = useState("");
  const [newSoftware, setNewSoftware] = useState("");
  const [newEquipment, setNewEquipment] = useState("");

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    (async () => {
      try {
        const card = await getMyProfessional(userId);
        if (!card) { setLoading(false); return; }
        setProfessionalId(card.professionalId);
        const portal = await getPortalProfile(card.professionalId);
        const skills = portal.skills || {};
        setFlightSkills(skills.flightSkills || []);
        setSoftwareSkills(skills.softwareSkills || []);
        setEquipment(skills.equipment || []);
      } catch {
        toast.error("Failed to load skills");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const persist = async (flight: Skill[], software: Skill[], equip: string[]) => {
    setFlightSkills(flight);
    setSoftwareSkills(software);
    setEquipment(equip);
    try {
      await savePortalProfileSection(professionalId, "skills", { flightSkills: flight, softwareSkills: software, equipment: equip });
    } catch {
      toast.error("Failed to save skills");
    }
  };

  const addFlight = () => {
    if (!newFlight.trim()) return;
    persist([...flightSkills, { name: newFlight.trim(), level: 50 }], softwareSkills, equipment);
    setNewFlight("");
  };
  const addSoftware = () => {
    if (!newSoftware.trim()) return;
    persist(flightSkills, [...softwareSkills, { name: newSoftware.trim(), level: 50 }], equipment);
    setNewSoftware("");
  };
  const addEquipment = () => {
    if (!newEquipment.trim()) return;
    persist(flightSkills, softwareSkills, [...equipment, newEquipment.trim()]);
    setNewEquipment("");
  };

  const updateLevel = (list: "flight" | "software", idx: number, level: number) => {
    if (list === "flight") {
      const next = flightSkills.map((s, i) => i === idx ? { ...s, level } : s);
      persist(next, softwareSkills, equipment);
    } else {
      const next = softwareSkills.map((s, i) => i === idx ? { ...s, level } : s);
      persist(flightSkills, next, equipment);
    }
  };

  const removeSkill = (list: "flight" | "software", idx: number) => {
    if (list === "flight") persist(flightSkills.filter((_, i) => i !== idx), softwareSkills, equipment);
    else persist(flightSkills, softwareSkills.filter((_, i) => i !== idx), equipment);
  };

  const removeEquipment = (idx: number) => persist(flightSkills, softwareSkills, equipment.filter((_, i) => i !== idx));

  if (loading) return <Card className="text-center py-16 text-white/40">Loading...</Card>;
  if (!professionalId) return <Card className="text-center py-16 text-white/40">No professional profile found for this account.</Card>;

  return (
    <div>
      <PageHeader title="Skills & Tools" sub="Skills displayed on your profile help recruiters find you for the right roles" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader title="Flight & Operation Skills" />
          <div className="p-4">
            {flightSkills.map((s, i) => (
              <div key={i} className="flex items-center gap-2 mb-1">
                <div className="flex-1"><SkillRow name={s.name} pct={s.level} /></div>
                <input type="range" min={0} max={100} value={s.level} onChange={(e) => updateLevel("flight", i, Number(e.target.value))} className="w-16 accent-brand-yellow" />
                <button onClick={() => removeSkill("flight", i)} className="text-white/30 hover:text-status-error"><X size={14} /></button>
              </div>
            ))}
            <div className="flex gap-2 mt-3">
              <input className={inputCls} placeholder="e.g. Precision Agriculture" value={newFlight} onChange={(e) => setNewFlight(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addFlight()} />
              <Btn size="sm" onClick={addFlight}><Plus size={14} /></Btn>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Software & Tools" />
          <div className="p-4">
            {softwareSkills.map((s, i) => (
              <div key={i} className="flex items-center gap-2 mb-1">
                <div className="flex-1"><SkillRow name={s.name} pct={s.level} /></div>
                <input type="range" min={0} max={100} value={s.level} onChange={(e) => updateLevel("software", i, Number(e.target.value))} className="w-16 accent-brand-yellow" />
                <button onClick={() => removeSkill("software", i)} className="text-white/30 hover:text-status-error"><X size={14} /></button>
              </div>
            ))}
            <div className="flex gap-2 mt-3">
              <input className={inputCls} placeholder="e.g. DJI Terra" value={newSoftware} onChange={(e) => setNewSoftware(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSoftware()} />
              <Btn size="sm" onClick={addSoftware}><Plus size={14} /></Btn>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Drone Equipment Experience" />
          <div className="p-4 flex flex-wrap gap-2.5 items-center">
            {equipment.map((eq, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 bg-brand-yellow/15 text-brand-yellow text-xs font-semibold px-3 py-1.5 rounded">
                {eq}
                <button onClick={() => removeEquipment(i)}><X size={12} /></button>
              </span>
            ))}
            <div className="flex gap-2">
              <input className={`${inputCls} w-48`} placeholder="e.g. DJI Agras T40" value={newEquipment} onChange={(e) => setNewEquipment(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addEquipment()} />
              <Btn size="sm" variant="outline" onClick={addEquipment}><Plus size={14} /> Add</Btn>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
