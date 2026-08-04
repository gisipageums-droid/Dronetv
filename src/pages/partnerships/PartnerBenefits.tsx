import { Link } from 'react-router-dom';
import CompactHero from '../../components/common/CompactHero';
import { SLOT_DEFINITIONS, DURATION_OPTIONS } from '../../components/UserDashboard/pages/PagePlacements';

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
    <div className="pt-[104px] min-h-screen bg-surface-main">
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

        {/* Page Placement (banner ad) pricing — pay-per-day placements, separate
            from the annual partnership packages above. Booked from the User
            Dashboard > Page Placements after logging in. */}
        <div className="pt-4">
          <h2 className="text-lg font-extrabold text-ink mb-1">Advertise on DroneTv.in — Page Placement Pricing</h2>
          <p className="text-sm text-ink-paragraph mb-6">
            Book a banner placement on a specific page for as little as a day, or as long as a month — no annual commitment. Pay with tokens, from your Dashboard.
          </p>

          <div className="space-y-6">
            {Array.from(new Set(SLOT_DEFINITIONS.map(s => s.category))).map(cat => (
              <div key={cat}>
                <div className="text-[11px] font-bold text-ink-caption uppercase tracking-widest mb-2">{cat}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {SLOT_DEFINITIONS.filter(s => s.category === cat).map(slot => (
                    <div key={slot.id} className="bg-surface-card rounded-lg border border-ink-light p-4">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-bold text-ink">{slot.label}</span>
                        {slot.disabled ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-ink-light text-ink-paragraph flex-shrink-0">{slot.disabledReason}</span>
                        ) : (
                          <span className="text-right flex-shrink-0">
                            <span className="text-sm font-black text-brand-gold">{slot.costPerDay} ₮</span>
                            <span className="block text-[10px] text-ink-caption">per day</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-caption mt-1">{slot.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-surface-card rounded-xl border border-ink-light p-5">
            <div className="text-[11px] font-bold text-ink-caption uppercase tracking-widest mb-3">Duration discounts</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DURATION_OPTIONS.map(d => (
                <div key={d.days} className="text-center bg-ink-light rounded-lg py-3">
                  <div className="text-sm font-bold text-ink">{d.label}</div>
                  {d.discount && <div className="text-xs text-status-success font-semibold mt-0.5">{d.discount}</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/user-page-placements"
              className="inline-block bg-brand-yellow text-ink font-bold text-sm px-6 py-2.5 rounded-lg hover:bg-brand-gold transition-colors"
            >
              Book a Placement →
            </Link>
            <p className="text-xs text-ink-caption mt-2">Login required. Tokens can be purchased from your Dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
