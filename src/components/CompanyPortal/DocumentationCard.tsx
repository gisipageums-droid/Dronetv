import React, { useState } from "react";
import { Radar, ShieldCheck, FolderCheck, Fingerprint, Check, X } from "lucide-react";
import { Card, CardHeader, Chip } from "./ui";
import { setCapacityStatus } from "./api";

// Fixes-doc #3 - "graduated trust model": equipment/UIN, insurance and
// project history are incremental, not pass/fail, so a vendor with more of
// them should visibly see what raising it would take. Fixes-doc #19 -
// vendor-set availability, so buyers/RFQ matching can favour vendors who
// can actually take work right now.

type Documentation = {
  score: number;
  hasEquipment: boolean;
  hasUIN: boolean;
  hasInsurance: boolean;
  hasProjectHistory: boolean;
};

const SIGNALS: { key: keyof Documentation; label: string; icon: React.ComponentType<any>; hint: string }[] = [
  { key: "hasEquipment", label: "Equipment listed", icon: Radar, hint: "Add your drones in Company Profile → Fleet" },
  { key: "hasUIN", label: "DGCA UIN on file", icon: Fingerprint, hint: "Add a UIN number to at least one drone in Fleet" },
  { key: "hasInsurance", label: "Insurance certificate", icon: ShieldCheck, hint: "Add a Drone Insurance certification in Company Profile → Certifications" },
  { key: "hasProjectHistory", label: "Project history", icon: FolderCheck, hint: "Add a completed project in Company Profile → Projects" },
];

const CAPACITY_OPTIONS: { value: "AVAILABLE" | "LIMITED" | "UNAVAILABLE"; label: string }[] = [
  { value: "AVAILABLE", label: "Available" },
  { value: "LIMITED", label: "Limited capacity" },
  { value: "UNAVAILABLE", label: "Not taking new work" },
];

export default function DocumentationCard({
  publishedId,
  documentation,
  capacityStatus,
}: {
  publishedId: string;
  documentation: Documentation | undefined;
  capacityStatus: string | undefined;
}) {
  const [capacity, setCapacity] = useState(capacityStatus || "AVAILABLE");
  const [saving, setSaving] = useState(false);
  const doc = documentation || { score: 0, hasEquipment: false, hasUIN: false, hasInsurance: false, hasProjectHistory: false };

  const updateCapacity = async (value: "AVAILABLE" | "LIMITED" | "UNAVAILABLE") => {
    setCapacity(value);
    setSaving(true);
    try {
      await setCapacityStatus(publishedId, value);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="mb-5">
      <CardHeader title="Profile Strength & Availability" />
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl font-extrabold text-brand-gold">{doc.score}%</div>
          <div className="text-xs text-white/40">
            More documentation gives your profile modest priority when buyers compare quotes.
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
          {SIGNALS.map(({ key, label, icon: Icon, hint }) => {
            const done = !!doc[key];
            return (
              <div key={key} title={done ? undefined : hint}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md border ${done ? "border-status-success/30 bg-status-success/5" : "border-white/10"}`}>
                <Icon className={`w-4 h-4 flex-shrink-0 ${done ? "text-status-success" : "text-white/30"}`} />
                <span className={`text-sm flex-1 ${done ? "text-white" : "text-white/40"}`}>{label}</span>
                {done ? <Check className="w-3.5 h-3.5 text-status-success" /> : <X className="w-3.5 h-3.5 text-white/20" />}
              </div>
            );
          })}
        </div>

        <div className="text-[11px] font-bold text-white/40 uppercase tracking-wide mb-2">Availability</div>
        <div className="flex flex-wrap gap-2">
          {CAPACITY_OPTIONS.map((opt) => (
            <Chip key={opt.value} on={capacity === opt.value} onClick={() => updateCapacity(opt.value)}>
              {opt.label}
            </Chip>
          ))}
        </div>
        {saving && <div className="text-xs text-white/40 mt-2">Saving...</div>}
      </div>
    </Card>
  );
}
