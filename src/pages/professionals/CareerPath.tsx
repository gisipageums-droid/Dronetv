import { TrendingUp, Award, Briefcase, GraduationCap, IndianRupee, ArrowRight, CheckCircle } from 'lucide-react';
import CompactHero from '../../components/common/CompactHero';
import { AdSidebarRail } from '../../components/common/adCreatives';

const CAREER_STAGES = [
  {
    stage: 1,
    title: "Entry Level",
    subtitle: "DGCA Small Category RPC",
    salary: "₹15,000 – ₹25,000/month",
    color: "bg-status-info",
    requirements: [
      "DGCA Small Category Remote Pilot Certificate",
      "Basic drone operation skills",
      "DigitalSky platform registration",
    ],
    roles: ["Agriculture Drone Operator", "Photography/Videography Pilot", "Aerial Survey Assistant"],
    duration: "0–2 years",
  },
  {
    stage: 2,
    title: "Mid Level",
    subtitle: "DGCA Small + Medium RPC",
    salary: "₹25,000 – ₹45,000/month",
    color: "bg-brand-yellow",
    requirements: [
      "DGCA Small + Medium Category RPC",
      "1–2 years field experience",
      "Specialisation in one domain (agri/survey/inspection)",
      "Software: DJI Terra, Pix4D, or QGIS",
    ],
    roles: ["Senior Agriculture Drone Pilot", "NDVI Mapping Specialist", "Infrastructure Inspection Pilot"],
    duration: "2–5 years",
  },
  {
    stage: 3,
    title: "Senior Level",
    subtitle: "Multi-Category + GIS/AI Skills",
    salary: "₹45,000 – ₹80,000/month",
    color: "bg-status-success",
    requirements: [
      "All DGCA categories (Small/Medium/Large)",
      "5+ years field experience",
      "GIS/photogrammetry expertise",
      "Team leadership experience",
      "BVLOS operations knowledge",
    ],
    roles: ["Lead Drone Operations Manager", "GIS Survey Lead", "Drone Solutions Architect"],
    duration: "5–10 years",
  },
  {
    stage: 4,
    title: "Expert / Management",
    subtitle: "Director / CTO / Founder",
    salary: "₹80,000+ / equity",
    color: "bg-brand-gold",
    requirements: [
      "Deep domain expertise (defence/agri/survey/logistics)",
      "Business development skills",
      "Regulatory and compliance knowledge",
      "Team building and P&L management",
    ],
    roles: ["Head of Drone Operations", "VP Engineering — Drones", "Drone Startup Founder"],
    duration: "10+ years",
  },
];

const SALARY_BY_SECTOR = [
  { sector: "Agriculture / Spraying", range: "₹18K – ₹40K/mo", demand: "Very High" },
  { sector: "Survey / GIS / LiDAR", range: "₹25K – ₹65K/mo", demand: "High" },
  { sector: "Defence / Security", range: "₹35K – ₹1L/mo", demand: "Moderate" },
  { sector: "Infrastructure Inspection", range: "₹28K – ₹55K/mo", demand: "High" },
  { sector: "Media / Cinematography", range: "₹15K – ₹50K/mo", demand: "Moderate" },
  { sector: "Training / Instruction", range: "₹20K – ₹45K/mo", demand: "Growing" },
];

export default function CareerPathPage() {
  return (
    <div className="pt-[104px] min-h-screen bg-surface-main">
      {/* Hero */}
      <CompactHero title={<>Drone Industry <span>Career Path</span></>} />

      <div className="max-w-5xl mx-auto px-6 py-10 lg:flex lg:items-start lg:gap-6">
      <div className="flex-1 min-w-0 space-y-10">

        {/* Career stages */}
        <section>
          <h2 className="text-lg font-extrabold text-ink mb-6">Career Progression — Drone Pilot Track</h2>
          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-ink-light hidden sm:block" />
            <div className="space-y-6">
              {CAREER_STAGES.map((s) => (
                <div key={s.stage} className="relative bg-surface-card rounded-xl border border-ink-light shadow-sm p-5 sm:ml-16">
                  <div className={`absolute -left-6 top-5 w-8 h-8 rounded-full ${s.color} flex items-center justify-center text-white text-xs font-black hidden sm:flex`}>
                    {s.stage}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`w-5 h-5 rounded-full ${s.color} flex items-center justify-center text-white text-[9px] font-black sm:hidden`}>{s.stage}</span>
                        <h3 className="text-base font-extrabold text-ink">{s.title}</h3>
                        <span className="text-xs text-ink-caption">{s.subtitle}</span>
                      </div>
                      <span className="text-xs text-ink-caption">{s.duration} experience</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-status-success/10 border border-status-success/25 rounded-lg px-3 py-1.5 self-start">
                      <IndianRupee size={12} className="text-status-success" />
                      <span className="text-xs font-bold text-status-success">{s.salary}</span>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-ink-caption uppercase tracking-wider mb-2">Requirements</p>
                      <ul className="space-y-1">
                        {s.requirements.map((r) => (
                          <li key={r} className="flex items-start gap-1.5">
                            <CheckCircle size={11} className="text-status-success mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-ink-paragraph">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-ink-caption uppercase tracking-wider mb-2">Typical Roles</p>
                      <ul className="space-y-1">
                        {s.roles.map((r) => (
                          <li key={r} className="flex items-start gap-1.5">
                            <Briefcase size={11} className="text-brand-gold mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-ink-paragraph">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Salary by sector */}
        <section>
          <h2 className="text-lg font-extrabold text-ink mb-4">Salary Ranges by Sector</h2>
          <div className="bg-surface-card rounded-xl border border-ink-light overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink-offwhite text-xs text-ink-caption uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Sector</th>
                  <th className="px-4 py-3 text-left">Salary Range</th>
                  <th className="px-4 py-3 text-left">Demand</th>
                </tr>
              </thead>
              <tbody>
                {SALARY_BY_SECTOR.map((s, i) => (
                  <tr key={s.sector} className={`border-t border-ink-light ${i % 2 === 0 ? '' : 'bg-ink-offwhite/40'}`}>
                    <td className="px-4 py-3 font-medium text-ink">{s.sector}</td>
                    <td className="px-4 py-3 font-bold text-status-success">{s.range}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        s.demand === "Very High" ? "bg-status-success/15 text-status-success" :
                        s.demand === "High" ? "bg-status-info/15 text-status-info" :
                        s.demand === "Growing" ? "bg-brand-yellow-soft text-brand-gold" :
                        "bg-ink-light text-ink-paragraph"
                      }`}>
                        {s.demand}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTAs */}
        <section className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: GraduationCap, title: "Find Training", desc: "DGCA-approved RPTOs across India", href: "/professionals/training", color: "text-brand-gold" },
            { icon: Award, title: "Certifications", desc: "DGCA certificate guide and requirements", href: "/professionals/certifications", color: "text-status-info" },
            { icon: Briefcase, title: "Job Board", desc: "Active drone jobs matched to your skills", href: "/professionals/job-board", color: "text-status-success" },
          ].map((cta) => {
            const Icon = cta.icon;
            return (
              <a key={cta.title} href={cta.href} className="flex items-start gap-3 p-4 bg-surface-card rounded-xl border border-ink-light hover:shadow-md transition-shadow group">
                <div className="w-9 h-9 rounded-lg bg-ink-light flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className={cta.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-ink">{cta.title}</span>
                    <ArrowRight size={13} className="text-ink-caption group-hover:text-ink-paragraph transition-colors" />
                  </div>
                  <p className="text-xs text-ink-caption">{cta.desc}</p>
                </div>
              </a>
            );
          })}
        </section>
      </div>
      <AdSidebarRail />
      </div>
    </div>
  );
}
