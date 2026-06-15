import { Link } from 'react-router-dom';

const stats = [
  { value: 'Rs.10,977Cr', label: 'Market Size 2025' },
  { value: 'Rs.29,080Cr', label: 'Projected 2030' },
  { value: '21.51%', label: 'India CAGR' },
  { value: '38,500+', label: 'Drones Registered' },
];

const chartData = [
  { year: '2022', value: 4200, label: 'Rs.4,200Cr' },
  { year: '2023', value: 6800, label: 'Rs.6,800Cr' },
  { year: '2024', value: 8400, label: 'Rs.8,400Cr' },
  { year: '2025', value: 10977, label: 'Rs.10,977Cr' },
  { year: '2026', value: 13300, label: 'Rs.13,300Cr' },
  { year: '2027', value: 16100, label: 'Rs.16,100Cr' },
  { year: '2028', value: 19500, label: 'Rs.19,500Cr' },
  { year: '2029', value: 23600, label: 'Rs.23,600Cr' },
  { year: '2030', value: 29080, label: 'Rs.29,080Cr' },
];

const maxValue = 29080;

const sectors = [
  { name: 'Agriculture', share: '38%', trend: '↑' },
  { name: 'Defence & Security', share: '28%', trend: '↑' },
  { name: 'Infrastructure', share: '16%', trend: '↑' },
  { name: 'Survey & GIS', share: '11%', trend: '→' },
  { name: 'Logistics & Delivery', share: '7%', trend: '↑' },
];

const reports = [
  { title: 'India Drone Market Report 2026', publisher: 'IBEF', date: 'Jun 2026' },
  { title: 'PLI Drone Scheme Progress Report', publisher: 'Ministry of Civil Aviation', date: 'May 2026' },
  { title: 'DGCA Registration Data Q1 2026', publisher: 'DGCA India', date: 'Apr 2026' },
  { title: 'Global Drone Industry Overview', publisher: 'Drone Industry Insights', date: 'Mar 2026' },
];

export default function MarketIntelligencePage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Media Hub</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Drone <span className="text-yellow-400 not-italic">Market Intelligence</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Data-backed analysis of India's drone industry — market size, growth projections, sector breakdown, and key indicators.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">21.51%</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">India CAGR</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">7.3%</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Global CAGR</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-center">
                <span className="text-xl font-extrabold text-yellow-500 block leading-none mb-1">{s.value}</span>
                <span className="text-xs text-gray-500 font-semibold">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-1">India Drone Market Growth Trajectory (2022–2030)</h2>
            <p className="text-xs text-gray-400 mb-6">Source: IBEF June 2026</p>
            <div className="flex items-end gap-2 h-48">
              {chartData.map((d) => {
                const heightPct = Math.round((d.value / maxValue) * 100);
                return (
                  <div key={d.year} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-500 font-semibold" style={{ fontSize: '9px' }}>{d.label}</span>
                    <div
                      className="w-full bg-red-500 rounded-t-sm"
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-xs text-gray-600 font-bold">{d.year}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
              <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Reports</span>
              Download Reports
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((r, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">📋</div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">{r.publisher} · {r.date}</p>
                      <h3 className="text-sm font-bold text-gray-900 leading-snug">{r.title}</h3>
                    </div>
                  </div>
                  <Link
                    to="/media/industry-reports"
                    className="text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors"
                  >
                    Access Report →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="bg-black px-4 py-3 rounded-t-xl">
              <h3 className="text-white font-bold text-sm">Top Sectors by Market Share</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-b-xl px-4 py-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs text-gray-400 font-semibold pb-2">Sector</th>
                    <th className="text-right text-xs text-gray-400 font-semibold pb-2">Share</th>
                    <th className="text-right text-xs text-gray-400 font-semibold pb-2">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {sectors.map((s) => (
                    <tr key={s.name} className="border-b border-gray-50">
                      <td className="py-2 text-xs text-gray-700 font-medium">{s.name}</td>
                      <td className="py-2 text-xs text-right font-bold text-gray-900">{s.share}</td>
                      <td className="py-2 text-xs text-right text-green-600 font-bold">{s.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="bg-black px-4 py-3 rounded-t-xl">
              <h3 className="text-white font-bold text-sm">Key Drivers</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-b-xl px-4 py-4 space-y-2">
              {[
                'PLI Scheme: Rs.120Cr incentive pool',
                'Defence procurement: $2B pipeline',
                'Namo Drone Didi: 15,000 drones',
                'SVAMITVA: 3.28L village surveys',
                'NHAI mandate: highway monitoring',
              ].map((d, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="text-yellow-400 font-bold mt-0.5 flex-shrink-0">→</span>
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
