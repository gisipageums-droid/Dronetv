import { Link } from 'react-router-dom';

const whyPartner = [
  { icon: '🎯', title: '100% Drone, GIS & AI Audience', desc: 'Every visitor, viewer, and lead on DroneTv.in is from the drone, GIS & AI ecosystem. No dilution across unrelated industries. Agriculture drones, defence UAVs, GIS & mapping technology, AI and computer-vision platforms — your content reaches exactly the right people.' },
  { icon: '📹', title: 'Professional Video Production', desc: 'In-house production team delivers 5-minute video interviews published on YouTube (@indiadronetv) and embedded permanently on your company profile. Both promoted via social media on publish week across LinkedIn, Instagram, and Facebook.' },
  { icon: '🏛️', title: 'Expo Media Partnership', desc: 'DroneTv.in is the official Digital Broadcast Media Partner for major drone expos including Drone Expo 2026 Bengaluru. Brand partners receive expo stall branding credit and on-ground media coverage at DroneTv partner events.' },
  { icon: '📊', title: 'B2B Lead Generation', desc: 'Verified leads from buyers actively searching for your product or service category. Lead notification emails sent immediately. Brand package subscribers see full buyer contact details — name, company, email, and phone — directly on the platform.' },
  { icon: '📖', title: 'Magazine and Editorial Coverage', desc: "Scale and Brand partners receive advertising and editorial coverage in DroneTv's quarterly digital magazine — half-page or full-page ads, editorial articles, and cover page eligibility for Brand tier partners." },
  { icon: '🌐', title: 'Dedicated Company Profile', desc: 'A single-page website on DroneTv.in with product listings, service descriptions, video embeds, contact details, and an active B2B enquiry form — updated as part of your subscription and permanently indexed on the platform.' },
];

const testimonials = [
  { quote: 'DroneTv covered our product launch at Drone Expo 2025 with a video interview that reached more qualified buyers than any other media we have tried. The ROI was immediate.', name: 'Dr. Pranay Kumar', role: 'COO — BBPL Aero Pvt Ltd' },
  { quote: 'Being listed on DroneTv.in gave our training institute credibility with industry partners. The enquiry quality is strong — these are people who already know what they want.', name: 'Training Partner', role: 'DGCA-Approved RPTO, Telangana' },
  { quote: "DroneTv's media partnership at Drone Expo is different from other media partners. They bring a full team, do live interviews, and push content to their channels same day.", name: 'Event Organizer', role: 'Drone Expo Series' },
  { quote: 'As an AI company moving into the drone sector, DroneTv gave us a credible platform to establish ourselves before we had market presence. Worth every rupee.', name: 'AI Partner', role: 'Drone AI Platform, Bengaluru' },
];

const categories = [
  {
    to: '/partnerships/drone-manufacturers',
    icon: '🏭',
    title: 'Drone Manufacturers',
    desc: 'Agriculture, defence, survey, cargo, fixed wing, and multirotor drone companies across India.',
    count: '180+ manufacturers',
    tag: '50+ listed on DroneTv',
  },
  {
    to: '/partnerships/ai-tech',
    icon: '🤖',
    title: 'AI & Tech Companies',
    desc: 'Software platforms, AI autonomy stacks, GIS tools, and data analytics companies.',
    count: '50+ tech companies',
    tag: 'AI, GIS, Analytics',
  },
  {
    to: '/partnerships/event-organizers',
    icon: '📅',
    title: 'Event Organizers',
    desc: 'Expo and conference organisers where DroneTv provides official media coverage.',
    count: '2 current partners',
    tag: 'Media Partner',
  },
  {
    to: '/partnerships/education-partners',
    icon: '🎓',
    title: 'Education Partners (RPTOs)',
    desc: 'DGCA-approved Remote Pilot Training Organisations across all drone categories.',
    count: '240+ RPTOs in India',
    tag: 'DGCA Approved',
  },
  {
    to: '/partnerships/industry-players',
    icon: '🚁',
    title: 'Industry Players',
    desc: 'Full ecosystem — manufacturers, service providers, training, and tech companies.',
    count: '515+ companies total',
    tag: 'Complete Directory',
  },
];

const packages = [
  { name: 'Reach', price: 'Rs.25,000/yr', highlight: false, headline: 'Verified profile + single-page website + 10 product listings' },
  { name: 'Scale', price: 'Rs.75,000/yr', highlight: true, headline: 'Everything in Reach + video interview + editorial article + monthly social posts' },
  { name: 'Brand', price: 'Rs.1,50,000/yr', highlight: false, headline: 'Everything in Scale + expo stall branding + priority placement + 4 posts/month' },
];

export default function PartnershipsHubPage() {
  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">DroneTv.in</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Partner with <span className="text-yellow-400 not-italic">DroneTv.in</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              India's drone industry platform — connect your company with pilots, buyers, government officials, and decision-makers across the ecosystem.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">515+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Companies</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">5M+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Views</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Explore</span>
            Partner Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <div className="bg-black px-5 py-4 flex items-center gap-3">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <h3 className="text-white font-bold text-sm group-hover:text-yellow-400 transition-colors">{c.title}</h3>
                    <p className="text-white/40 text-xs">{c.count}</p>
                  </div>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">{c.desc}</p>
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded">{c.tag}</span>
                </div>
                <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Explore section</span>
                  <span className="text-yellow-400 font-bold group-hover:translate-x-1 transition-transform inline-block">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Packages</span>
            Partnership Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packages.map((p) => (
              <div
                key={p.name}
                className={`bg-white rounded-xl border shadow-sm p-5 ${
                  p.highlight ? 'border-yellow-400' : 'border-gray-200'
                }`}
              >
                {p.highlight && (
                  <span className="bg-yellow-400 text-black text-xs font-extrabold px-2 py-0.5 rounded mb-3 inline-block">POPULAR</span>
                )}
                <h3 className="font-extrabold text-gray-900 text-lg">{p.name}</h3>
                <p className="text-xl font-extrabold text-yellow-500 mb-2">{p.price}</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{p.headline}</p>
                <Link
                  to="/partnerships/benefits"
                  className="text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors"
                >
                  See full features →
                </Link>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">All prices exclusive of GST. 100% advance payment. 12-month term.</p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Why</span>
            Why Partner with DroneTv.in
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyPartner.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Reviews</span>
            Partner Testimonials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-400 rounded-xl p-8 text-center">
          <h3 className="font-extrabold text-black text-2xl mb-2">Ready to join India's drone industry platform?</h3>
          <p className="text-black/70 text-sm mb-6 max-w-xl mx-auto">
            Submit your enquiry and our BD team will respond within 48 hours. Go live in 2 weeks.
          </p>
          <Link
            to="/partnerships/become-a-partner"
            className="inline-block bg-black text-white font-extrabold text-base px-8 py-3.5 rounded-xl hover:bg-gray-900 transition-colors"
          >
            Become a Partner →
          </Link>
        </div>
      </div>
    </div>
  );
}
