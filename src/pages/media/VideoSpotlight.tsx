import { useState } from 'react';

const filters = ['All Videos', 'Drone Expo 2025', 'Manufacturing', 'Agriculture', 'Defence', 'Training'];

const videos = [
  {
    ep: 11,
    title: 'Industry-Scale Drone Integration',
    person: 'Dr. Pranay Kumar',
    company: 'BBPL Aero',
    tag: 'Manufacturing',
    tagClass: 'bg-purple-100 text-purple-700',
  },
  {
    ep: 10,
    title: 'Agriculture Drone Operations at Scale',
    person: 'Venkatesh Rao',
    company: 'Garuda Aerospace',
    tag: 'Agriculture',
    tagClass: 'bg-amber-100 text-amber-700',
  },
  {
    ep: 9,
    title: 'GIS Technology in Drone Survey Workflows',
    person: 'Sanjay Mehta',
    company: 'Aarav Unmanned Systems',
    tag: 'Survey',
    tagClass: 'bg-blue-100 text-blue-700',
  },
  {
    ep: 8,
    title: 'Building India\'s First Indigenous Drone Platform',
    person: 'Ankit Mehta',
    company: 'ideaForge Technology',
    tag: 'Manufacturing',
    tagClass: 'bg-purple-100 text-purple-700',
  },
  {
    ep: 7,
    title: 'Training India\'s Next Generation of Drone Pilots',
    person: 'Vikram Singh',
    company: 'Drone Destination',
    tag: 'Training',
    tagClass: 'bg-green-100 text-green-700',
  },
  {
    ep: 6,
    title: 'Drone Applications in Border Security',
    person: 'Brig. (Retd.) Rajiv Narang',
    company: 'CATS Warrior Programme',
    tag: 'Defence',
    tagClass: 'bg-orange-100 text-orange-700',
  },
];

export default function VideoSpotlightPage() {
  const [active, setActive] = useState('All Videos');

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Media Hub</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              DroneTv <span className="text-yellow-400 not-italic">Video Spotlight</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              In-depth interviews with India's top drone industry leaders, manufacturers, pilots, and policymakers.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">50+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Interviews</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">5M+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Views</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
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

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Featured</span>
            Latest Interview
          </h2>
          <a
            href="https://www.youtube.com/@indiadronetv"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-black rounded-xl overflow-hidden hover:opacity-95 transition-opacity"
          >
            <div className="relative aspect-video flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
              <div className="relative z-10 text-center px-6">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2">Episode 11 — Drone Expo 2025 Mumbai</p>
                <h3 className="text-white font-extrabold text-xl md:text-2xl leading-snug mb-2">
                  Dr. Pranay Kumar — COO, BBPL Aero
                </h3>
                <p className="text-white/60 text-sm">Industry-Scale Drone Integration</p>
              </div>
            </div>
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-white/50 text-xs">Watch on YouTube →</span>
              <span className="text-yellow-400 text-xs font-bold">@indiadronetv</span>
            </div>
          </a>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Episodes</span>
            Drone Expo 2025 Mumbai Series
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((v) => (
              <div key={v.ep} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="bg-gray-900 aspect-video flex items-center justify-center relative">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span className="absolute top-3 left-3 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded">Ep {v.ep}</span>
                </div>
                <div className="p-4">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block ${v.tagClass}`}>{v.tag}</span>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1">{v.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    {v.person} — {v.company}
                  </p>
                  <a
                    href="https://www.youtube.com/@indiadronetv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors"
                  >
                    Watch on YouTube →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-400 rounded-xl p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-black text-lg mb-1">Watch the full series on YouTube</h3>
            <p className="text-black/70 text-sm">50+ interviews with India's drone industry leaders. New episodes added regularly.</p>
          </div>
          <a
            href="https://www.youtube.com/@indiadronetv"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-900 transition-colors whitespace-nowrap"
          >
            Visit Channel →
          </a>
        </div>
      </div>
    </div>
  );
}
