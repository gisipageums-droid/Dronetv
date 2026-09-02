import React from "react";
import { PageHeader, Card, CardHeader, ProgressBar } from "../ui";

// Static career-progression reference content - same nature as the mockup
// itself (industry-standard salary bands), not per-user tracked data.
const STEPS = [
  { num: "Step 01", name: "DGCA Small RPC", desc: "Basic commercial certification. Agriculture, survey, photography operations.", done: true },
  { num: "Step 02", name: "First Commercial Role", desc: "Entry-level agriculture pilot position. Building hours and field experience.", done: true },
  { num: "Step 03", name: "DGCA Medium RPC", desc: "Unlocks heavy agri drones (T50+), industrial LiDAR platforms, and high-paying contracts.", done: false },
  { num: "Step 04", name: "GIS Specialisation", desc: "Add Pix4D, Agisoft, and QGIS certifications. Open senior surveying and data analyst roles.", done: false },
];

const SALARY_BANDS = [
  { label: "Current (Small RPC)", pct: 35, range: "₹30K–40K/mo" },
  { label: "After Medium RPC", pct: 58, range: "₹45K–65K/mo" },
  { label: "With GIS Specialisation", pct: 78, range: "₹65K–90K/mo" },
  { label: "Senior / Instructor", pct: 95, range: "₹80K–1.2L/mo" },
];

export default function CareerPath() {
  return (
    <div>
      <PageHeader title="Career Path" sub="Progression roadmap from entry-level drone pilot to specialist or instructor — industry-standard reference bands" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        {STEPS.map((s, i) => (
          <Card key={i} className={`p-4 ${s.done ? "border-status-success/40" : ""}`}>
            <div className={`text-[9px] font-bold uppercase tracking-widest mb-2 ${s.done ? "text-status-success" : "text-white/30"}`}>{s.num}</div>
            <div className="text-[13.5px] font-bold text-white mb-1.5">{s.name}</div>
            <div className="text-[11.5px] text-white/40 leading-relaxed">{s.desc}</div>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader title="Salary Progression Reference" />
        <div className="p-4 flex flex-col gap-3">
          {SALARY_BANDS.map((b, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="text-[12.5px] text-white/60 min-w-[150px]">{b.label}</div>
              <div className="flex-1"><ProgressBar pct={b.pct} accent={i === STEPS.length - 1 ? "green" : "yellow"} /></div>
              <div className="text-[13px] font-bold text-white min-w-[100px] text-right">{b.range}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
