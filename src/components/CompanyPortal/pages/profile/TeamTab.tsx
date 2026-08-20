import { useState } from "react";
import { Card, Field, FormGrid, Btn, EmptyState, Badge, inputCls } from "../../ui";
import type { TabProps } from "./CompanyProfilePage";

const DEPARTMENTS = ["Operations / Flight", "GIS / Data Processing", "Sales / Business Dev", "Technical / Engineering", "Training", "Management", "Admin / Support"];
const empty = { name: "", role: "", department: "", license: "", email: "", phone: "" };

export default function TeamTab({ profile, save }: TabProps) {
  const [team, setTeam] = useState<any[]>(profile.team || []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const persist = async (next: any[]) => {
    setTeam(next);
    setSaving(true);
    await save("team", next);
    setSaving(false);
  };

  const addMember = () => {
    if (!form.name || !form.role) return;
    persist([...team, form]);
    setForm(empty);
    setShowForm(false);
  };

  const removeMember = (i: number) => persist(team.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="px-4 py-3.5 bg-ink border border-white/10 rounded-lg flex-1">
          <span className="text-xl font-extrabold text-brand-gold">{team.length}</span> <span className="text-xs text-white/40 ml-1">Team Members</span>
        </div>
        <Btn onClick={() => setShowForm(!showForm)} className="ml-4">+ Add Member</Btn>
      </div>

      {showForm && (
        <Card className="p-6 mb-5">
          <FormGrid>
            <Field label="Full Name" required><input className={inputCls} value={form.name} onChange={e => set("name", e.target.value)} /></Field>
            <Field label="Role / Designation" required><input className={inputCls} value={form.role} onChange={e => set("role", e.target.value)} placeholder="e.g. Chief Pilot" /></Field>
            <Field label="Department">
              <select className={inputCls} value={form.department} onChange={e => set("department", e.target.value)}>
                <option value="">Select</option>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="DGCA License No."><input className={inputCls} value={form.license} onChange={e => set("license", e.target.value)} placeholder="If applicable" /></Field>
            <Field label="Email"><input type="email" className={inputCls} value={form.email} onChange={e => set("email", e.target.value)} /></Field>
            <Field label="Phone"><input type="tel" className={inputCls} value={form.phone} onChange={e => set("phone", e.target.value)} /></Field>
          </FormGrid>
          <div className="flex gap-3 mt-4">
            <Btn onClick={addMember}>Save Member</Btn>
            <Btn variant="outline" onClick={() => setShowForm(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      {team.length === 0 ? <EmptyState text="No team members added yet" /> : (
        <Card className="overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="text-left px-4 py-2.5 text-[11px] font-bold text-white/40 uppercase">Name</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-bold text-white/40 uppercase">Role</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-bold text-white/40 uppercase">Department</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-bold text-white/40 uppercase">License</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {team.map((m, i) => (
                <tr key={i} className="border-b border-white/10 last:border-0">
                  <td className="px-4 py-2.5 font-medium text-white">{m.name}</td>
                  <td className="px-4 py-2.5">{m.role}</td>
                  <td className="px-4 py-2.5 text-white/40">{m.department || "—"}</td>
                  <td className="px-4 py-2.5">{m.license ? <Badge tone="success">{m.license}</Badge> : <span className="text-white/40">N/A</span>}</td>
                  <td className="px-4 py-2.5"><button onClick={() => removeMember(i)} className="text-status-error text-xs font-semibold">Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {saving && <div className="text-xs text-white/40 mt-3">Saving...</div>}
    </div>
  );
}
