import { useState } from 'react';

const issues = [
  {
    number: '04',
    quarter: 'Q2 2026',
    title: 'Defence Drones: India\'s $2B Procurement Shift',
    gradient: 'from-slate-900 via-blue-950 to-slate-800',
    topics: [
      '$2B domestic drone order pipeline',
      'Indigenous UAV manufacturers profiled',
      'DRDO programmes update',
      'Export potential for Indian defence drones',
    ],
  },
  {
    number: '03',
    quarter: 'Q1 2026',
    title: 'Agriculture Drones at Scale: Namo Drone Didi',
    gradient: 'from-green-950 via-emerald-900 to-green-800',
    topics: [
      'Namo Drone Didi scheme deep-dive',
      '500+ SHG deployments mapped',
      'ROI analysis from Telangana farmers',
      'Soil health monitoring use cases',
    ],
  },
  {
    number: '02',
    quarter: 'Q4 2025',
    title: 'Drone Expo 2025 Mumbai: Full Coverage Report',
    gradient: 'from-amber-900 via-orange-950 to-yellow-900',
    topics: [
      '50+ exhibitor profiles',
      'Key announcements and launches',
      'Interview highlights reel',
      'Market sentiment survey results',
    ],
  },
];

export default function MagazinePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail('');
  };

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Media Hub</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              DroneTv <span className="text-yellow-400 not-italic">Magazine</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              In-depth quarterly analysis of India's drone industry — market data, policy, technology, and company profiles.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">4</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Issues Published</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Qtrly</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Publication</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
          <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Issues</span>
          All Editions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {issues.map((issue) => (
            <div key={issue.number} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className={`bg-gradient-to-br ${issue.gradient} aspect-[3/4] flex flex-col items-center justify-center p-6 relative`}>
                <div className="absolute top-4 left-4">
                  <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">ISSUE {issue.number}</span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="text-white/60 text-xs font-semibold">{issue.quarter}</span>
                </div>
                <div className="mt-8 text-center">
                  <span className="text-yellow-400 font-extrabold text-5xl block leading-none mb-1">{issue.number}</span>
                  <span className="text-white/40 text-xs uppercase tracking-widest">DroneTv</span>
                </div>
                <p className="text-white font-bold text-center text-sm mt-4 leading-snug px-2">{issue.title}</p>
              </div>
              <div className="p-5">
                <ul className="space-y-1.5 mb-4">
                  {issue.topics.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="text-yellow-400 font-bold mt-0.5">—</span>
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-green-700 font-semibold">Free for subscribers</span>
                  <a
                    href="mailto:bd@dronetv.in?subject=Request DroneTv Magazine Issue"
                    className="text-xs font-bold text-gray-900 hover:text-yellow-600 transition-colors"
                  >
                    Request Issue →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-black rounded-xl p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="text-white font-extrabold text-xl mb-2">
              Subscribe to receive all future issues <span className="text-yellow-400">free</span>
            </h3>
            <p className="text-white/60 text-sm">New issues drop every quarter. Subscribers also get early access to market intelligence data.</p>
          </div>
          <div className="w-full md:w-auto">
            {submitted ? (
              <p className="text-yellow-400 font-bold text-sm">Subscribed! You'll receive the next issue on release.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Your email address"
                  className="px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full sm:w-64"
                />
                <button
                  type="submit"
                  className="bg-yellow-400 text-black font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-yellow-500 transition-colors whitespace-nowrap"
                >
                  Subscribe Free
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
