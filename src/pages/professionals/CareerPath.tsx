import { TrendingUp, Award, Briefcase, GraduationCap, IndianRupee, ArrowRight, CheckCircle } from 'lucide-react';

const CAREER_STAGES = [
  {
    stage: 1,
    title: "Entry Level",
    subtitle: "DGCA Small Category RPC",
    salary: "₹15,000 – ₹25,000/month",
    color: "bg-blue-500",
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
    color: "bg-yellow-400",
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
    color: "bg-green-500",
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
    color: "bg-purple-500",
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
    <div className="pt-[104px] min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-5xl mx-auto px-6 py-12">
          <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Professionals</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
            Drone Industry <span className="text-yellow-400">Career Path</span>
          </h1>
          <p className="text-sm text-white/60 max-w-xl">
            From DGCA certification to senior leadership — a guide to building a career in India's drone, GIS, and AI industry.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* Career stages */}
        <section>
          <h2 className="text-lg font-extrabold text-gray-900 mb-6">Career Progression — Drone Pilot Track</h2>
          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200 hidden sm:block" />
            <div className="space-y-6">
              {CAREER_STAGES.map((s) => (
                <div key={s.stage} className="relative bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:ml-16">
                  <div className={`absolute -left-6 top-5 w-8 h-8 rounded-full ${s.color} flex items-center justify-center text-white text-xs font-black hidden sm:flex`}>
                    {s.stage}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`w-5 h-5 rounded-full ${s.color} flex items-center justify-center text-white text-[9px] font-black sm:hidden`}>{s.stage}</span>
                        <h3 className="text-base font-extrabold text-gray-900">{s.title}</h3>
                        <span className="text-xs text-gray-500">{s.subtitle}</span>
                      </div>
                      <span className="text-xs text-gray-400">{s.duration} experience</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 self-start">
                      <IndianRupee size={12} className="text-green-600" />
                      <span className="text-xs font-bold text-green-700">{s.salary}</span>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Requirements</p>
                      <ul className="space-y-1">
                        {s.requirements.map((r) => (
                          <li key={r} className="flex items-start gap-1.5">
                            <CheckCircle size={11} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-gray-600">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Typical Roles</p>
                      <ul className="space-y-1">
                        {s.roles.map((r) => (
                          <li key={r} className="flex items-start gap-1.5">
                            <Briefcase size={11} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-gray-600">{r}</span>
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
          <h2 className="text-lg font-extrabold text-gray-900 mb-4">Salary Ranges by Sector</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Sector</th>
                  <th className="px-4 py-3 text-left">Salary Range</th>
                  <th className="px-4 py-3 text-left">Demand</th>
                </tr>
              </thead>
              <tbody>
                {SALARY_BY_SECTOR.map((s, i) => (
                  <tr key={s.sector} className={`border-t border-gray-100 ${i % 2 === 0 ? '' : 'bg-gray-50/40'}`}>
                    <td className="px-4 py-3 font-medium text-gray-900">{s.sector}</td>
                    <td className="px-4 py-3 font-bold text-green-700">{s.range}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        s.demand === "Very High" ? "bg-green-100 text-green-700" :
                        s.demand === "High" ? "bg-blue-100 text-blue-700" :
                        s.demand === "Growing" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-600"
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
            { icon: GraduationCap, title: "Find Training", desc: "DGCA-approved RPTOs across India", href: "/professionals/training", color: "text-yellow-500" },
            { icon: Award, title: "Certifications", desc: "DGCA certificate guide and requirements", href: "/professionals/certifications", color: "text-blue-500" },
            { icon: Briefcase, title: "Job Board", desc: "Active drone jobs matched to your skills", href: "/professionals/job-board", color: "text-green-500" },
          ].map((cta) => {
            const Icon = cta.icon;
            return (
              <a key={cta.title} href={cta.href} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow group">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className={cta.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-gray-900">{cta.title}</span>
                    <ArrowRight size={13} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  <p className="text-xs text-gray-500">{cta.desc}</p>
                </div>
              </a>
            );
          })}
        </section>
      </div>
    </div>
  );
}
