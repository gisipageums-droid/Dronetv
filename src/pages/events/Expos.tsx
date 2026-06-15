import { useState } from 'react';
import { Link } from 'react-router-dom';

const filters = ['All Expos', 'India', 'DroneTv Media Partner', 'Upcoming', 'Past'];

export default function ExposPage() {
  const [active, setActive] = useState('All Expos');
  const [email, setEmail] = useState('');

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Events</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Drone <span className="text-yellow-400 not-italic">Expos and Exhibitions</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              India's leading drone trade shows — B2B exhibitions, product launches, live demos, and networking with manufacturers and buyers.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">2</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Upcoming Expos</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">50+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Interviews Produced</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
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

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-yellow-400 px-5 py-2">
              <p className="text-black font-bold text-xs uppercase tracking-widest">Next Upcoming</p>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="bg-black rounded-xl p-6 text-center md:w-40 flex-shrink-0 flex flex-col items-center justify-center">
                  <span className="text-yellow-400 font-extrabold text-3xl block leading-none">9</span>
                  <span className="text-white/60 text-xs font-semibold">Days Away</span>
                  <div className="mt-3 pt-3 border-t border-white/20 w-full text-center">
                    <span className="text-white font-bold text-sm block">Jun 24</span>
                    <span className="text-white/50 text-xs">— Jun 25, 2026</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-extrabold text-gray-900 mb-1">Drone International Expo 2026</h3>
                  <p className="text-sm text-yellow-600 font-bold mb-3">Bharat Mandapam (Pragati Maidan), New Delhi</p>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    India's premier B2B drone exhibition bringing together manufacturers, service providers, government buyers, and investors for two days of product launches, live demonstrations, and business meetings.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Agriculture Drones', 'Anti-Drone Systems', 'LiDAR', 'Defence', 'Logistics', 'GIS'].map((t) => (
                      <span key={t} className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">{t}</span>
                    ))}
                  </div>
                  <span className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded">DroneTv Media Partner</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Drone Expo 2026 New Delhi</h3>
                <p className="text-sm text-gray-500">Yashobhoomi, IICC, Dwarka</p>
              </div>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded">Upcoming</span>
            </div>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              Outdoor DEMOex live drone demonstrations, Innovation Awards ceremony, and full exhibition floor with 200+ exhibitor booths. Includes a dedicated pavilion for agriculture drone showcases.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-semibold">Sep 2026</span>
              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded">DroneTv Media Partner</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">IFSEC 2026</h3>
                <p className="text-sm text-gray-500">Venue to be announced</p>
              </div>
              <div className="flex gap-2">
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded">Coming Soon</span>
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded">DroneTv Media Partner</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              International Fire & Security Exhibition — featuring a dedicated drone security and surveillance zone. DroneTv will produce interviews and media coverage from the event.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="bg-black px-4 py-3 rounded-t-xl">
              <h3 className="text-white font-bold text-sm">Get Event Updates</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-b-xl px-4 py-4">
              <p className="text-xs text-gray-500 mb-3">Be the first to know about drone expos, deadlines, and media coverage plans.</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-yellow-400"
              />
              <button className="w-full bg-yellow-400 text-black font-bold text-xs py-2 rounded-lg hover:bg-yellow-500 transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          <div>
            <div className="bg-black px-4 py-3 rounded-t-xl">
              <h3 className="text-white font-bold text-sm">Contact</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-b-xl px-4 py-4 space-y-2">
              <p className="text-xs text-gray-500">Media partnerships and expo coverage enquiries:</p>
              <a href="mailto:bd@dronetv.in" className="block text-sm font-bold text-yellow-600 hover:text-yellow-700">bd@dronetv.in</a>
              <p className="text-xs text-gray-500 mt-2">Or visit our</p>
              <Link to="/contact" className="text-xs font-bold text-gray-700 hover:text-yellow-600 transition-colors">Contact Page →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
