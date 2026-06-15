import { useState } from 'react';
import { Link } from 'react-router-dom';

const jobFilters = ['All Jobs', 'Agriculture', 'Survey & GIS', 'Inspection', 'Cinematography', 'Instructor', 'Defence'];

const jobs = [
  {
    title: 'Agriculture Drone Pilot',
    company: 'TechEagle Innovations',
    location: 'Hyderabad',
    salary: 'Rs.30K–40K/mo',
    type: 'Full-Time',
    sector: 'Agriculture',
    borderColor: 'border-l-amber-500',
    posted: 'Jun 10, 2026',
  },
  {
    title: 'GIS Survey Specialist',
    company: 'Aarav Unmanned Systems',
    location: 'Bengaluru',
    salary: 'Rs.45K–65K/mo',
    type: 'Full-Time',
    sector: 'Survey & GIS',
    borderColor: 'border-l-blue-500',
    posted: 'Jun 8, 2026',
  },
  {
    title: 'UAV Instructor (DGCA RPTO)',
    company: 'Drone Destination',
    location: 'Delhi',
    salary: 'Rs.50K–80K/mo',
    type: 'Full-Time',
    sector: 'Instructor',
    borderColor: 'border-l-green-500',
    posted: 'Jun 5, 2026',
  },
  {
    title: 'Drone Cinematographer',
    company: 'Aerial Imageworks',
    location: 'Mumbai',
    salary: 'Rs.35K–60K/mo',
    type: 'Project-Based',
    sector: 'Cinematography',
    borderColor: 'border-l-purple-500',
    posted: 'Jun 3, 2026',
  },
  {
    title: 'Inspection Drone Operator',
    company: 'Skye Air Mobility',
    location: 'Chennai',
    salary: 'Rs.32K–45K/mo',
    type: 'Full-Time',
    sector: 'Inspection',
    borderColor: 'border-l-red-500',
    posted: 'May 30, 2026',
  },
  {
    title: 'Junior Drone Technician',
    company: 'ideaForge Technology',
    location: 'Pune',
    salary: 'Rs.25K–35K/mo',
    type: 'Full-Time',
    sector: 'Manufacturing',
    borderColor: 'border-l-gray-400',
    posted: 'May 28, 2026',
  },
];

const salaryGuide = [
  { level: 'Entry Level', range: 'Rs.25K–40K/mo', roles: 'Junior Pilot, Field Operator, Technician', bg: 'bg-gray-50' },
  { level: 'Experienced', range: 'Rs.40K–70K/mo', roles: 'Agriculture Specialist, GIS Analyst, Instructor', bg: 'bg-yellow-50' },
  { level: 'Senior / Lead', range: 'Rs.70K–1L+/mo', roles: 'Senior Pilot Lead, RPTO Manager, Product Lead', bg: 'bg-green-50' },
];

export default function JobBoardPage() {
  const [active, setActive] = useState('All Jobs');

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Professionals</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Drone Industry <span className="text-yellow-400 not-italic">Job Board</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Active job listings across India's drone sector — pilots, survey specialists, instructors, and technicians.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">20+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Active Listings</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Rs.1L</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Top Monthly</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-3 bg-black/5 border-b border-gray-200">
        <div className="flex flex-wrap gap-6 text-center py-2">
          {[
            ['39,890', 'Certified Pilots'],
            ['2L+', 'Pilots Needed'],
            ['7.2L', 'Total Jobs Projected'],
            ['Rs.25K–1L', 'Salary Range'],
            ['240+', 'RPTOs Training'],
          ].map(([v, l]) => (
            <div key={l} className="flex-1 min-w-[100px]">
              <span className="font-extrabold text-yellow-600 text-base block">{v}</span>
              <span className="text-xs text-gray-500">{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex flex-wrap gap-2">
          {jobFilters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                active === f
                  ? 'bg-yellow-400 border-yellow-400 text-black'
                  : 'border-gray-200 text-gray-500 hover:border-yellow-400 hover:text-gray-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-yellow-300 shadow-sm overflow-hidden">
          <div className="bg-yellow-400 px-5 py-2">
            <p className="text-black font-bold text-xs uppercase tracking-widest">Urgent — Featured Listing</p>
          </div>
          <div className="p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block">Agriculture</span>
                <h3 className="text-lg font-extrabold text-gray-900">Senior Agriculture Drone Pilot — Telangana and AP Region</h3>
                <p className="text-sm text-gray-500 mt-1">Garuda Aerospace · Hyderabad (field-based)</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-xl font-extrabold text-yellow-600 block">Rs.35,000–50,000/mo</span>
                <span className="text-xs text-gray-500">Full-Time · Jun 2026</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">DGCA RPC Required</span>
                <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">2+ years exp</span>
              </div>
              <a href="mailto:bd@dronetv.in?subject=Job Application" className="text-xs font-bold text-yellow-600 hover:text-yellow-700">Apply Now →</a>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {jobs.map((j, i) => (
            <div
              key={i}
              className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 border-l-4 ${j.borderColor}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{j.title}</h3>
                  <p className="text-xs text-gray-500">{j.company} · {j.location}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-sm font-bold text-gray-700">{j.salary}</span>
                  <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded">{j.type}</span>
                  <a href="mailto:bd@dronetv.in" className="text-xs font-bold text-yellow-600 hover:text-yellow-700">Apply →</a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-4 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Salary</span>
            Market Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {salaryGuide.map((s) => (
              <div key={s.level} className={`${s.bg} rounded-xl border border-gray-200 p-5`}>
                <h3 className="font-bold text-gray-900 mb-1">{s.level}</h3>
                <p className="text-xl font-extrabold text-yellow-600 mb-2">{s.range}</p>
                <p className="text-xs text-gray-500">{s.roles}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-400 rounded-xl p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-black text-base mb-1">Post a Job on DroneTv.in</h3>
            <p className="text-black/70 text-sm">Reach India's certified drone pilot and professional community directly.</p>
          </div>
          <Link
            to="/partnerships/become-a-partner"
            className="bg-black text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-900 transition-colors whitespace-nowrap"
          >
            Post a Job →
          </Link>
        </div>
      </div>
    </div>
  );
}
