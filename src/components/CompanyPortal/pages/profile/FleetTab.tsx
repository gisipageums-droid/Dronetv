import { useState } from "react";
import { Card, Field, FormGrid, Btn, ActionBar, EmptyState, inputCls } from "../../ui";
import type { TabProps } from "./CompanyProfilePage";

const MODELS = ["DJI Matrice 350 RTK", "DJI Mavic 3 Enterprise", "DJI Agras T40", "DJI Phantom 4 RTK", "Autel EVO II Pro", "ideaForge SWITCH 1.0", "Garuda KISAN Drone", "Other"];
const TYPES = ["Nano (< 250g)", "Micro (250g - 2kg)", "Small (2kg - 25kg)", "Medium (25kg - 150kg)", "Large (> 150kg)"];
const PAYLOADS = ["RGB Camera", "Multispectral", "Thermal", "LiDAR", "Spray System", "None"];

const empty = { model: "", type: "", serial: "", uin: "", year: "", batteries: "", payload: "", status: "Active" };

export default function FleetTab({ profile, save }: TabProps) {
  const [fleet, setFleet] = useState<any[]>(profile.fleet || []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const persist = async (next: any[]) => {
    setFleet(next);
    setSaving(true);
    await save("fleet", next);
    setSaving(false);
  };

  const addDrone = () => {
    if (!form.model || !form.serial) return;
    persist([...fleet, form]);
    setForm(empty);
    setShowForm(false);
  };

  const removeDrone = (i: number) => persist(fleet.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-6 px-4 py-3.5 bg-ink border border-white/10 rounded-lg flex-1">
          <div><span className="text-xl font-extrabold text-brand-gold">{fleet.length}</span> <span className="text-xs text-white/40 ml-1">Total Drones</span></div>
          <div><span className="text-xl font-extrabold text-brand-gold">{fleet.filter(f => f.status === "Active").length}</span> <span className="text-xs text-white/40 ml-1">Active</span></div>
        </div>
        <Btn onClick={() => setShowForm(!showForm)} className="ml-4">+ Add Drone</Btn>
      </div>

      {showForm && (
        <Card className="p-6 mb-5">
          <FormGrid>
            <Field label="Drone Model" required>
              <select className={inputCls} value={form.model} onChange={e => set("model", e.target.value)}>
                <option value="">Select Model</option>
                {MODELS.map(m => <option key={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Drone Type" required>
              <select className={inputCls} value={form.type} onChange={e => set("type", e.target.value)}>
                <option value="">Select</option>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Serial Number" required><input className={inputCls} value={form.serial} onChange={e => set("serial", e.target.value)} /></Field>
            <Field label="UIN Number"><input className={inputCls} value={form.uin} onChange={e => set("uin", e.target.value)} placeholder="DGCA UIN" /></Field>
            <Field label="Year of Purchase"><input type="number" className={inputCls} value={form.year} onChange={e => set("year", e.target.value)} /></Field>
            <Field label="Batteries"><input type="number" className={inputCls} value={form.batteries} onChange={e => set("batteries", e.target.value)} /></Field>
            <Field label="Payload">
              <select className={inputCls} value={form.payload} onChange={e => set("payload", e.target.value)}>
                <option value="">Select</option>
                {PAYLOADS.map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select className={inputCls} value={form.status} onChange={e => set("status", e.target.value)}>
                <option>Active</option><option>Maintenance</option><option>Retired</option>
              </select>
            </Field>
          </FormGrid>
          <div className="flex gap-3 mt-4">
            <Btn onClick={addDrone}>Save Drone</Btn>
            <Btn variant="outline" onClick={() => setShowForm(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      {fleet.length === 0 ? <EmptyState text="No drones added yet" /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {fleet.map((d, i) => (
            <Card key={i} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-bold text-white">{d.model}</div>
                  <div className="text-[10px] font-bold text-brand-gold uppercase mt-0.5">{d.type}</div>
                </div>
                <span className={`text-[10px] font-bold ${d.status === "Active" ? "text-status-success" : "text-brand-gold"}`}>● {d.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
                <div><div className="text-white/40 uppercase text-[10px]">Serial</div><div className="font-medium">{d.serial}</div></div>
                <div><div className="text-white/40 uppercase text-[10px]">UIN</div><div className="font-medium">{d.uin || "N/A"}</div></div>
                <div><div className="text-white/40 uppercase text-[10px]">Batteries</div><div className="font-medium">{d.batteries || "—"}</div></div>
                <div><div className="text-white/40 uppercase text-[10px]">Payload</div><div className="font-medium">{d.payload || "—"}</div></div>
              </div>
              <button onClick={() => removeDrone(i)} className="text-status-error text-[11px] font-semibold mt-3">Remove</button>
            </Card>
          ))}
        </div>
      )}
      {saving && <div className="text-xs text-white/40 mt-3">Saving...</div>}
    </div>
  );
}
