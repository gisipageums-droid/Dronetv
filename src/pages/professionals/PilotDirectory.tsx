import { useState } from 'react';
import { Link } from 'react-router-dom';

const pilots = [
  {
    name: 'Rajesh Kumar',
    location: 'Hyderabad, Telangana',
    rpc: 'DGCA RPC — 2024',
    specialisations: ['Agriculture', 'Survey & Mapping'],
    exp: '3 years',
    initials: 'RK',
    color: 'bg-blue-600',
  },
  {
    name: 'Priya Nair',
    location: 'Kochi, Kerala',
    rpc: 'DGCA RPC — 2023',
    specialisations: ['Cinematography', 'Events'],
    exp: '4 years',
    initials: 'PN',
    color: 'bg-purple-600',
  },
  {
    name: 'Amit Singh',
    location: 'Delhi NCR',
    rpc: 'DGCA RPC — 2025',
    specialisations: ['Infrastructure Inspection', 'Survey'],
    exp: '2 years',
    initials: 'AS',
    color: 'bg-orange-600',
  },
  {
    name: 'Sunita Reddy',
    location: 'Bengaluru, Karnataka',
    rpc: 'DGCA RPC — 2024',
    specialisations: ['GIS Mapping', 'Agriculture'],
    exp: '3 years',
    initials: 'SR',
    color: 'bg-green-600',
  },
  {
    name: 'Mohammed Farhan',
    location: 'Hyderabad, Telangana',
    rpc: 'DGCA RPC — 2023',
    specialisations: ['Defence Applications', 'Surveillance'],
    exp: '4 years',
    initials: 'MF',
    color: 'bg-red-700',
  },
  {
    name: 'Kavita Sharma',
    location: 'Pune, Maharashtra',
    rpc: 'DGCA RPC — 2024',
    specialisations: ['Training', 'RPTO Instructor'],
    exp: '5 years',
    initials: 'KS',
    color: 'bg-indigo-600',
  },
];

const states = ['All States', 'Telangana', 'Karnataka', 'Maharashtra', 'Delhi NCR', 'Kerala', 'Tamil Nadu'];

export default function PilotDirectoryPage() {
  const [search, setSearch] = useState('');
  const [state, setState] = useState('All States');

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Professionals</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Certified Drone <span className="text-yellow-400 not-italic">Pilot Directory</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              India's verified drone pilot directory. All listed pilots hold a valid DGCA Remote Pilot Certificate.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">39,890</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">DGCA Certified</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-yellow-600 font-bold text-sm">Note:</span>
          <span className="text-sm text-gray-700">Pilots must hold a valid DGCA Remote Pilot Certificate (RPC) to be listed in this directory.</span>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, city, or specialisation..."
            className="flex-1 min-w-[200px] border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
          />
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-yellow-400"
          >
            {states.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Listed</span>
          Verified Pilots
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {pilots.map((p, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`${p.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0`}>
                  {p.initials}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{p.name}</h3>
                  <p className="text-xs text-gray-500">📍 {p.location}</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg px-3 py-1.5 mb-3">
                <p className="text-xs font-bold text-green-700">✓ {p.rpc}</p>
              </div>
              <div className="mb-2">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1.5">Specialisations</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.specialisations.map((s) => (
                    <span key={s} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">{p.exp} experience</p>
            </div>
          ))}
        </div>

        <div className="bg-yellow-400 rounded-xl p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-black text-base mb-1">List Your Pilot Profile</h3>
            <p className="text-black/70 text-sm">DGCA-certified pilots can create a free profile on DroneTv.in to be discovered by operators and companies.</p>
          </div>
          <Link
            to="/professionals/community"
            className="bg-black text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-900 transition-colors whitespace-nowrap"
          >
            Join Community →
          </Link>
        </div>
      </div>
    </div>
  );
}
