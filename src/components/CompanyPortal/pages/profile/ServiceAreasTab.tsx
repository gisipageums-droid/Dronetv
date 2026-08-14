import { useState } from "react";
import { Card, Field, FormGrid, Chip, ActionBar, inputCls } from "../../ui";
import type { TabProps } from "./CompanyProfilePage";

const COVERAGE = ["Pan India", "North India", "South India", "East India", "West India", "Central India", "International"];
const STATES = ["Telangana", "Andhra Pradesh", "Karnataka", "Maharashtra", "Tamil Nadu", "Gujarat", "Rajasthan", "Madhya Pradesh", "Uttar Pradesh", "Punjab", "West Bengal", "Delhi NCR"];

export default function ServiceAreasTab({ profile, save }: TabProps) {
  const data = profile.serviceAreas || {};
  const [coverage, setCoverage] = useState<string[]>(data.coverage || []);
  const [states, setStates] = useState<string[]>(data.states || []);
  const [headOffice, setHeadOffice] = useState(data.headOffice || "");
  const [branchOffices, setBranchOffices] = useState(data.branchOffices || "");
  const [saving, setSaving] = useState(false);

  const toggle = (list: string[], setList: (v: string[]) => void, val: string) =>
    setList(list.includes(val) ? list.filter(v => v !== val) : [...list, val]);

  const handleSave = async () => {
    setSaving(true);
    await save("serviceAreas", { coverage, states, headOffice, branchOffices });
    setSaving(false);
  };

  return (
    <div>
      <div className="text-xs font-bold text-brand-gold uppercase tracking-wide mb-3">Operational Coverage</div>
      <div className="flex flex-wrap gap-2 mb-7">
        {COVERAGE.map(c => <Chip key={c} on={coverage.includes(c)} onClick={() => toggle(coverage, setCoverage, c)}>{c}</Chip>)}
      </div>
      <div className="text-xs font-bold text-brand-gold uppercase tracking-wide mb-3">Primary States</div>
      <div className="flex flex-wrap gap-2 mb-7">
        {STATES.map(s => <Chip key={s} on={states.includes(s)} onClick={() => toggle(states, setStates, s)}>{s}</Chip>)}
      </div>
      <Card className="p-6">
        <FormGrid>
          <Field label="Head Office Location" wide><input className={inputCls} value={headOffice} onChange={e => setHeadOffice(e.target.value)} /></Field>
          <Field label="Branch Offices (if any)" wide><textarea className={inputCls} rows={2} value={branchOffices} onChange={e => setBranchOffices(e.target.value)} placeholder="City, State — one per line" /></Field>
        </FormGrid>
      </Card>
      <ActionBar onSave={handleSave} saveLabel={saving ? "Saving..." : "Save Changes"} />
    </div>
  );
}
