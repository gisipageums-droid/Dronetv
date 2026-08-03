import { Link } from 'react-router-dom';
import CompactHero from '../../components/common/CompactHero';

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
    <div className="pt-[104px] min-h-screen bg-ink-offwhite">
      <CompactHero
        title={<>Partnership Benefits <span>and Packages</span></>}
        stats={[
          { n: '3', l: 'Tiers' },
          { n: '14', l: 'Feature Benefits' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {packages.map((p) => (
            <div
              key={p.name}
              className={`bg-surface-card rounded-xl border shadow-sm overflow-hidden ${
                p.popular ? 'border-brand-yellow shadow-lg' : 'border-ink-light'
              }`}
            >
              {p.popular && (
                <div className="bg-brand-yellow px-5 py-2 text-center">
                  <p className="text-ink font-extrabold text-xs uppercase tracking-widest">Most Popular</p>
                </div>
              )}
              <div className="bg-ink px-5 py-5">
                <h3 className="text-white font-extrabold text-xl mb-1">{p.name}</h3>
                <p className="text-brand-yellow font-extrabold text-2xl">{p.price}<span className="text-sm font-normal text-white/40">{p.period}</span></p>
              </div>
              <div className="p-5">
                <ul className="space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2.5">
                      <span className={`mt-0.5 flex-shrink-0 font-bold text-sm ${f.included ? 'text-status-success' : 'text-ink-light'}`}>
                        {f.included ? '✓' : '✗'}
                      </span>
                      <span className={`text-xs leading-snug ${f.included ? 'text-ink-paragraph' : 'text-ink-caption'}`}>{f.text}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/partnerships/become-a-partner"
                  className={`block w-full text-center font-bold text-sm py-2.5 rounded-lg mt-5 transition-colors ${
                    p.popular
                      ? 'bg-brand-yellow text-ink hover:bg-brand-gold'
                      : 'bg-ink text-white hover:bg-ink-charcoal'
                  }`}
                >
                  Choose {p.name} →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-ink-light rounded-xl p-5 text-center">
          <p className="text-sm text-ink-paragraph">
            All prices exclusive of GST. 100% advance payment required before onboarding begins. Packages are annual (12 months).
          </p>
        </div>
      </div>
    </div>
  );
}
