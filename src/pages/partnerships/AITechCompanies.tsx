import { Link } from 'react-router-dom';

const categories = [
  {
    title: 'AI Software Platforms',
    icon: '🤖',
    desc: 'Computer vision, object detection, autonomous flight planning, and AI-powered analytics platforms built for drone operations.',
    companies: ['Asteria Aerospace — AI autonomy stack', 'Skye Air — AI flight management', 'DroneAcharya — AI training tools'],
  },
  {
    title: 'GIS & Geospatial',
    icon: '🗺️',
    desc: 'Geospatial data processing, photogrammetry, LiDAR point cloud analysis, and map generation tools for survey drone workflows.',
    companies: ['Aarav Unmanned Systems — GIS processing', 'Throttle Aerospace — Survey software', 'MapmyIndia — Integration tools'],
  },
  {
    title: 'Data Analytics',
    icon: '📊',
    desc: 'Crop analytics, infrastructure health monitoring, asset inspection data platforms, and compliance reporting tools.',
    companies: ['Fasal — Crop intelligence', 'Detect Technologies — Inspection analytics', 'Netra.ai — Visual AI platform'],
  },
];

const featured = [
  { name: 'Aarav Unmanned Systems', tag: 'GIS & Survey', desc: 'Leading GIS and survey drone software provider with deployments across India including SVAMITVA.' },
  { name: 'Asteria Aerospace', tag: 'AI Autonomy', desc: 'AI-powered drone autonomy stack for industrial inspection and security applications.' },
  { name: 'Throttle Aerospace Systems', tag: 'Survey Software', desc: 'Comprehensive drone survey software with LiDAR integration and GIS output formats.' },
];

export default function AITechCompaniesPage() {
  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Partnerships</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              AI & Tech Partners <span className="text-yellow-400 not-italic">on DroneTv.in</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Software platforms, AI tools, GIS systems, and data analytics companies powering India's drone ecosystem.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Categories</span>
            Technology Sectors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {categories.map((c) => (
              <div key={c.title} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{c.icon}</span>
                  <h3 className="font-bold text-gray-900 text-sm">{c.title}</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{c.desc}</p>
                <div className="space-y-1.5">
                  {c.companies.map((co) => (
                    <div key={co} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="text-yellow-400 font-bold flex-shrink-0 mt-0.5">→</span>
                      {co}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Featured</span>
            Partner Companies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featured.map((f) => (
              <div key={f.name} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded mb-3 inline-block">{f.tag}</span>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{f.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-400 rounded-xl p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-black text-base mb-1">List Your Tech Company on DroneTv.in</h3>
            <p className="text-black/70 text-sm">Reach drone operators, manufacturers, and integrators who need your software or analytics platform.</p>
          </div>
          <Link
            to="/partnerships/become-a-partner"
            className="bg-black text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-900 transition-colors whitespace-nowrap"
          >
            Become a Partner →
          </Link>
        </div>
      </div>
    </div>
  );
}
