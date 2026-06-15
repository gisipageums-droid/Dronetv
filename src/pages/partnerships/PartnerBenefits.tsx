import { Link } from 'react-router-dom';

const packages = [
  {
    name: 'Reach',
    price: 'Rs.25,000',
    period: '/year + GST',
    popular: false,
    features: [
      { text: 'Verified company profile', included: true },
      { text: 'Single-page website on DroneTv.in', included: true },
      { text: '10 product listings', included: true },
      { text: 'B2B enquiry form', included: true },
      { text: 'Lead notifications by email', included: true },
      { text: '2 social media posts', included: true },
      { text: '1 DroneTv Magazine issue', included: true },
      { text: 'Video interview', included: false },
      { text: 'Editorial article', included: false },
      { text: 'Job board listing', included: false },
      { text: 'Event calendar listing', included: false },
      { text: 'Expo stall branding', included: false },
    ],
  },
  {
    name: 'Scale',
    price: 'Rs.75,000',
    period: '/year + GST',
    popular: true,
    features: [
      { text: 'Verified company profile', included: true },
      { text: 'Single-page website on DroneTv.in', included: true },
      { text: '10 product listings', included: true },
      { text: 'B2B enquiry form', included: true },
      { text: 'Lead notifications by email', included: true },
      { text: 'Monthly social media posts', included: true },
      { text: '1 DroneTv Magazine issue', included: true },
      { text: 'Video interview (DroneTv production)', included: true },
      { text: 'Editorial article', included: true },
      { text: 'Job board listing', included: true },
      { text: 'Event calendar listing', included: true },
      { text: 'Expo stall branding', included: false },
    ],
  },
  {
    name: 'Brand',
    price: 'Rs.1,50,000',
    period: '/year + GST',
    popular: false,
    features: [
      { text: 'Verified company profile', included: true },
      { text: 'Single-page website on DroneTv.in', included: true },
      { text: 'Unlimited product listings', included: true },
      { text: 'B2B enquiry form', included: true },
      { text: 'Lead notifications by email', included: true },
      { text: '4 social media posts/month', included: true },
      { text: '2 DroneTv Magazine issues', included: true },
      { text: 'Video interview (DroneTv production)', included: true },
      { text: '2 editorial articles', included: true },
      { text: 'Job board listing', included: true },
      { text: 'Event calendar listing', included: true },
      { text: 'Expo stall branding (Drone Expo 2026 Bengaluru)', included: true },
    ],
  },
];

export default function PartnerBenefitsPage() {
  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Partnerships</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Partnership Benefits <span className="text-yellow-400 not-italic">and Packages</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Three partnership tiers designed to fit different company sizes — from early-stage startups to established manufacturers.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">3</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Tiers</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">14</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Feature Benefits</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {packages.map((p) => (
            <div
              key={p.name}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
                p.popular ? 'border-yellow-400 shadow-lg' : 'border-gray-200'
              }`}
            >
              {p.popular && (
                <div className="bg-yellow-400 px-5 py-2 text-center">
                  <p className="text-black font-extrabold text-xs uppercase tracking-widest">Most Popular</p>
                </div>
              )}
              <div className="bg-black px-5 py-5">
                <h3 className="text-white font-extrabold text-xl mb-1">{p.name}</h3>
                <p className="text-yellow-400 font-extrabold text-2xl">{p.price}<span className="text-sm font-normal text-white/40">{p.period}</span></p>
              </div>
              <div className="p-5">
                <ul className="space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5">
                      <span className={`mt-0.5 flex-shrink-0 font-bold text-sm ${f.included ? 'text-green-600' : 'text-gray-300'}`}>
                        {f.included ? '✓' : '✗'}
                      </span>
                      <span className={`text-xs leading-snug ${f.included ? 'text-gray-700' : 'text-gray-400'}`}>{f.text}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/partnerships/become-a-partner"
                  className={`block w-full text-center font-bold text-sm py-2.5 rounded-lg mt-5 transition-colors ${
                    p.popular
                      ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                      : 'bg-black text-white hover:bg-gray-900'
                  }`}
                >
                  Choose {p.name} →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-100 rounded-xl p-5 text-center">
          <p className="text-sm text-gray-600">
            All prices exclusive of GST. 100% advance payment required before onboarding begins. Packages are annual (12 months).
          </p>
        </div>
      </div>
    </div>
  );
}
