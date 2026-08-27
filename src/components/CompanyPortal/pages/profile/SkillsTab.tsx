import { useState } from "react";
import { Chip, ActionBar } from "../../ui";
import type { TabProps } from "./CompanyProfilePage";

const CAPABILITIES = ["BVLOS Operations", "Night Operations", "Autonomous Flights", "Multi-drone Operations", "Urban / City Flights", "Maritime Operations", "Agricultural Operations", "Emergency / Disaster Response"];
const TOOLS = ["Pix4D", "Agisoft Metashape", "DJI Terra", "QGIS", "ArcGIS", "Global Mapper", "CloudCompare", "AutoCAD", "DJI FlightHub", "Drone Deploy"];

export default function SkillsTab({ profile, save }: TabProps) {
  const data = profile.skillsResources || {};
  const [capabilities, setCapabilities] = useState<string[]>(data.capabilities || []);
  const [tools, setTools] = useState<string[]>(data.tools || []);
  const [saving, setSaving] = useState(false);

  const toggle = (list: string[], setList: (v: string[]) => void, val: string) =>
    setList(list.includes(val) ? list.filter(v => v !== val) : [...list, val]);

  const handleSave = async () => {
    setSaving(true);
    await save("skillsResources", { capabilities, tools });
    setSaving(false);
  };

  return (
    <div>
      <div className="text-xs font-bold text-brand-gold uppercase tracking-wide mb-3">Drone Operations Capability</div>
      <div className="flex flex-wrap gap-2 mb-7">
        {CAPABILITIES.map(c => <Chip key={c} on={capabilities.includes(c)} onClick={() => toggle(capabilities, setCapabilities, c)}>{c}</Chip>)}
      </div>
      <div className="text-xs font-bold text-brand-gold uppercase tracking-wide mb-3">Software & Tools</div>
      <div className="flex flex-wrap gap-2 mb-7">
        {TOOLS.map(t => <Chip key={t} on={tools.includes(t)} onClick={() => toggle(tools, setTools, t)}>{t}</Chip>)}
      </div>
      <ActionBar onSave={handleSave} saveLabel={saving ? "Saving..." : "Save Changes"} />
    </div>
  );
}
