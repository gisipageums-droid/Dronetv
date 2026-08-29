import React from "react";
import { PageHeader, Card, Badge } from "../ui";

// Curated RPTO directory - static reference content, same nature as the
// public Training page on the main site. Not a live per-user database.
const RPTOS = [
  {
    name: "Drone Academy Private Limited — Hyderabad",
    location: "Hyderabad, Telangana · DGCA Approved RPTO · Affiliated with DroneTv.in",
    courses: ["Small RPC", "Medium RPC", "GIS Mapping", "NDVI Specialist"],
    fees: "Medium RPC: ₹1,00,000 – ₹1,20,000",
    duration: "12 Days",
  },
  {
    name: "PinakShakti Aerospace Academy",
    location: "Multi-location (Hyderabad, Bengaluru, Pune) · 1,200+ Pilots Certified",
    courses: ["Small RPC", "Medium RPC", "Job Placement", "Defence Track"],
    fees: "Medium RPC: ₹1,10,000 – ₹1,40,000",
    duration: "15 Days",
  },
  {
    name: "Garuda Krishi Drone Academy — AP State",
    location: "Vijayawada, Andhra Pradesh · Specialises in Agriculture Drones",
    courses: ["Small RPC", "Agri Spraying", "NDVI Mapping", "Namo Drone Didi"],
    fees: "Small RPC: ₹55,000 – ₹70,000",
    duration: "5 Days",
  },
];

export default function Training() {
  return (
    <div>
      <PageHeader title="Training & RPTOs" sub="Find DGCA-approved training institutes near you to upgrade certifications or learn new skills" />
      <Card className="bg-brand-yellow/10 border-brand-yellow/30 p-4 mb-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-[13.5px] font-bold text-white">Recommended: Get Medium Category RPC</div>
          <div className="text-[12px] text-white/50 mt-0.5">Medium RPC unlocks ₹10,000–15,000 more per month in salary.</div>
        </div>
      </Card>
      {RPTOS.map((r, i) => (
        <Card key={i} className="mb-3 p-4 flex gap-4 items-start">
          <div className="text-2xl flex-shrink-0">🏫</div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-bold text-white mb-1">{r.name}</div>
            <div className="text-[11.5px] text-white/40 mb-2">{r.location}</div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {r.courses.map(c => <Badge key={c} tone="neutral">{c}</Badge>)}
            </div>
            <div className="flex gap-5 text-[12.5px]">
              <div className="font-bold text-status-error">{r.fees}</div>
              <div className="text-white/40">Duration: {r.duration}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
