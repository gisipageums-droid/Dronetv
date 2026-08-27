import { useState } from "react";
import { Card, Field, FormGrid, Chip, Btn, EmptyState, Badge, ActionBar, inputCls } from "../../ui";
import type { TabProps } from "./CompanyProfilePage";

const INDUSTRIES = ["Agriculture", "Mining", "Construction", "Surveying / GIS", "Infrastructure", "Energy", "Real Estate", "Media / Film", "Defence / Security", "Disaster Management"];
const emptyProject = { title: "", client: "", industry: "", role: "", location: "", startDate: "", endDate: "", description: "", status: "Completed" };

const ENV_OPTIONS = ["Urban", "Rural", "Coastal / Maritime", "Forest / Hilly", "Industrial Site", "High Altitude"];

function ProjectHistory({ profile, save }: TabProps) {
  const [projects, setProjects] = useState<any[]>(profile.projects || []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyProject);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const persist = async (next: any[]) => {
    setProjects(next);
    setSaving(true);
    await save("projects", next);
    setSaving(false);
  };

  const addProject = () => {
    if (!form.title || !form.client) return;
    persist([...projects, form]);
    setForm(emptyProject);
    setShowForm(false);
  };

  const removeProject = (i: number) => persist(projects.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm text-white/40 flex-1">Completed and ongoing drone service projects</div>
        <Btn onClick={() => setShowForm(!showForm)}>+ Add Project</Btn>
      </div>

      {showForm && (
        <Card className="p-6 mb-5">
          <FormGrid>
            <Field label="Project Title" required><input className={inputCls} value={form.title} onChange={e => set("title", e.target.value)} /></Field>
            <Field label="Client Name" required><input className={inputCls} value={form.client} onChange={e => set("client", e.target.value)} /></Field>
            <Field label="Industry">
              <select className={inputCls} value={form.industry} onChange={e => set("industry", e.target.value)}>
                <option value="">Select</option>
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>
            </Field>
            <Field label="Our Role"><input className={inputCls} value={form.role} onChange={e => set("role", e.target.value)} placeholder="e.g. Aerial Survey Partner" /></Field>
            <Field label="Location"><input className={inputCls} value={form.location} onChange={e => set("location", e.target.value)} /></Field>
            <Field label="Status">
              <select className={inputCls} value={form.status} onChange={e => set("status", e.target.value)}>
                <option>Completed</option><option>Ongoing</option><option>Planned</option>
              </select>
            </Field>
            <Field label="Start Date"><input type="date" className={inputCls} value={form.startDate} onChange={e => set("startDate", e.target.value)} /></Field>
            <Field label="End Date"><input type="date" className={inputCls} value={form.endDate} onChange={e => set("endDate", e.target.value)} /></Field>
            <Field label="Description" wide><textarea className={inputCls} rows={3} value={form.description} onChange={e => set("description", e.target.value)} /></Field>
          </FormGrid>
          <div className="flex gap-3 mt-4">
            <Btn onClick={addProject}>Save Project</Btn>
            <Btn variant="outline" onClick={() => setShowForm(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      {projects.length === 0 ? <EmptyState text="No projects added yet" /> : (
        <div className="space-y-2.5">
          {projects.map((p, i) => (
            <Card key={i} className="p-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">{p.title}</div>
                <div className="text-xs text-white/40 mt-0.5">{p.client} {p.industry && `· ${p.industry}`} {p.location && `· ${p.location}`}</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={p.status === "Completed" ? "success" : p.status === "Ongoing" ? "info" : "warning"}>{p.status}</Badge>
                <button onClick={() => removeProject(i)} className="text-status-error text-xs font-semibold">Remove</button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {saving && <div className="text-xs text-white/40 mt-3">Saving...</div>}
    </div>
  );
}

function ProjectExpertise({ profile, save }: TabProps) {
  const data = profile.projectExpertise || {};
  const [environments, setEnvironments] = useState<string[]>(data.environments || []);
  const [totalFlightHours, setTotalFlightHours] = useState(data.totalFlightHours || "");
  const [totalProjects, setTotalProjects] = useState(data.totalProjects || "");
  const [areaCovered, setAreaCovered] = useState(data.areaCovered || "");
  const [saving, setSaving] = useState(false);

  const toggle = (val: string) =>
    setEnvironments(environments.includes(val) ? environments.filter(v => v !== val) : [...environments, val]);

  const handleSave = async () => {
    setSaving(true);
    await save("projectExpertise", { environments, totalFlightHours, totalProjects, areaCovered });
    setSaving(false);
  };

  return (
    <div className="mt-8">
      <div className="text-xs font-bold text-brand-gold uppercase tracking-wide mb-3">Flight Summary</div>
      <Card className="p-6 mb-7">
        <FormGrid>
          <Field label="Total Flight Hours"><input className={inputCls} value={totalFlightHours} onChange={e => setTotalFlightHours(e.target.value)} placeholder="e.g. 3200" /></Field>
          <Field label="Total Projects Delivered"><input className={inputCls} value={totalProjects} onChange={e => setTotalProjects(e.target.value)} placeholder="e.g. 145" /></Field>
          <Field label="Total Area Covered (acres)"><input className={inputCls} value={areaCovered} onChange={e => setAreaCovered(e.target.value)} placeholder="e.g. 50000" /></Field>
        </FormGrid>
      </Card>
      <div className="text-xs font-bold text-brand-gold uppercase tracking-wide mb-3">Operating Environments</div>
      <div className="flex flex-wrap gap-2 mb-7">
        {ENV_OPTIONS.map(e => <Chip key={e} on={environments.includes(e)} onClick={() => toggle(e)}>{e}</Chip>)}
      </div>
      <ActionBar onSave={handleSave} saveLabel={saving ? "Saving..." : "Save Changes"} />
    </div>
  );
}

export default function ProjectsTab(props: TabProps) {
  return (
    <div>
      <ProjectHistory {...props} />
      <div className="border-t border-white/10 mt-8" />
      <ProjectExpertise {...props} />
    </div>
  );
}
