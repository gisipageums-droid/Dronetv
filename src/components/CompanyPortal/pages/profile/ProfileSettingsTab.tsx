import { useState } from "react";
import { Card, Toggle } from "../../ui";
import type { TabProps } from "./CompanyProfilePage";

const ROWS = [
  { key: "showInDirectory", title: "Show company in DroneTv Directory", sub: "Your company profile will appear in search results and listings", defaultOn: true },
  { key: "showContactPublicly", title: "Show contact details publicly", sub: "Phone and email visible on company page", defaultOn: false },
  { key: "receiveLeadNotifications", title: "Receive lead notifications", sub: "Get email alerts when someone enquires about your services", defaultOn: true },
];

export default function ProfileSettingsTab({ profile, save }: TabProps) {
  const data = profile.settings || {};
  const [values, setValues] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(ROWS.map(r => [r.key, data[r.key] ?? r.defaultOn]))
  );

  const update = async (key: string, v: boolean) => {
    const next = { ...values, [key]: v };
    setValues(next);
    await save("settings", next);
  };

  return (
    <Card className="p-6">
      <div className="text-sm font-bold text-white mb-5">Profile Visibility</div>
      {ROWS.map((r, i) => (
        <div key={r.key} className={`flex items-center justify-between py-3.5 ${i < ROWS.length - 1 ? "border-b border-white/10" : ""}`}>
          <div>
            <div className="text-[13px] font-medium text-white">{r.title}</div>
            <div className="text-[11px] text-white/40 mt-0.5">{r.sub}</div>
          </div>
          <Toggle checked={values[r.key]} onChange={v => update(r.key, v)} />
        </div>
      ))}
    </Card>
  );
}
