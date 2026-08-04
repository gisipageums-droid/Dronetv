import { useState } from 'react';
import CompactHero from '../../components/common/CompactHero';

const stats = [
  { value: '515+', label: 'Companies Listed' },
  { value: '50+', label: 'Video Interviews' },
  { value: '5M+', label: 'Total Views' },
  { value: '38,500+', label: 'Drones Registered' },
  { value: 'Rs.29,080Cr', label: 'Market by 2030' },
];

const steps = [
  { num: '1', title: 'Submit Enquiry', desc: 'Fill in the form below with your company details and preferred partnership package. Our BD team reviews all enquiries.' },
  { num: '2', title: 'DroneTv Review', desc: 'We review your enquiry within 48 hours and schedule a call to discuss your requirements, timeline, and final package details.' },
  { num: '3', title: 'Payment & Onboarding', desc: '100% advance payment required before onboarding begins. Invoices include GST. All major payment methods accepted.' },
  { num: '4', title: 'Profile Goes Live', desc: 'Your verified company profile, website, and all deliverables go live on DroneTv.in within 2 weeks of payment confirmation.' },
];

const companyTypes = ['Drone Manufacturer', 'Service Provider', 'RPTO', 'Event Organizer', 'Tech Company', 'Other'];
const packages = ['Reach — Rs.25,000/year + GST', 'Scale — Rs.75,000/year + GST', 'Brand — Rs.1,50,000/year + GST', 'Not sure yet'];

export default function BecomePartnerPage() {
  const [form, setForm] = useState({
    companyName: '',
    yourName: '',
    email: '',
    phone: '',
    companyType: '',
    preferredPackage: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ companyName: '', yourName: '', email: '', phone: '', companyType: '', preferredPackage: '', message: '' });
  };

  return (
    <div className="pt-[104px] min-h-screen bg-surface-main">
      <CompactHero
        title={<>Become a Partner <span>on DroneTv.in</span></>}
        stats={[
          { n: '2 wks', l: 'To Go Live' },
          { n: '48hr', l: 'Response' },
        ]}
      />

      <div className="bg-ink/5 border-b border-ink-light">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap gap-6 justify-center">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <span className="font-extrabold text-brand-gold text-base block">{s.value}</span>
              <span className="text-xs text-ink-caption">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
              <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">Process</span>
              How it Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((s) => (
                <div key={s.num} className="bg-surface-card rounded-xl border border-ink-light shadow-sm p-5">
                  <div className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center text-ink font-extrabold text-base mb-3">
                    {s.num}
                  </div>
                  <h3 className="font-bold text-ink text-sm mb-2">{s.title}</h3>
                  <p className="text-xs text-ink-caption leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-ink flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-ink-light after:content-['']">
              <span className="bg-brand-yellow text-ink text-xs font-bold px-2 py-0.5 rounded">Enquiry</span>
              Submit Your Interest
            </h2>
            {submitted ? (
              <div className="bg-status-success/10 border border-status-success/25 rounded-xl p-8 text-center">
                <p className="text-2xl mb-3">✅</p>
                <h3 className="font-bold text-status-success text-lg mb-2">Thank you!</h3>
                <p className="text-sm text-status-success mb-1">Our team will contact you within 48 hours.</p>
                <p className="text-sm font-bold text-status-success">Email: bd@dronetv.in</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-surface-card rounded-xl border border-ink-light shadow-sm p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink-paragraph mb-1">Company Name *</label>
                    <input
                      name="companyName"
                      value={form.companyName}
                      onChange={handleChange}
                      required
                      placeholder="Your company name"
                      className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink-paragraph mb-1">Your Name *</label>
                    <input
                      name="yourName"
                      value={form.yourName}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink-paragraph mb-1">Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="your@company.com"
                      className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink-paragraph mb-1">Phone</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink-paragraph mb-1">Company Type *</label>
                    <select
                      name="companyType"
                      value={form.companyType}
                      onChange={handleChange}
                      required
                      className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow"
                    >
                      <option value="">Select type...</option>
                      {companyTypes.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink-paragraph mb-1">Preferred Package</label>
                    <select
                      name="preferredPackage"
                      value={form.preferredPackage}
                      onChange={handleChange}
                      className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow"
                    >
                      <option value="">Select package...</option>
                      {packages.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-paragraph mb-1">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your company and what you're looking to achieve..."
                    rows={4}
                    className="w-full border border-ink-light rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-yellow resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand-yellow text-ink font-bold text-sm py-3 rounded-lg hover:bg-brand-gold transition-colors"
                >
                  Submit Partnership Enquiry →
                </button>
                <p className="text-xs text-ink-caption text-center">We respond within 48 hours · bd@dronetv.in · 100% advance required</p>
              </form>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="bg-ink px-4 py-3 rounded-t-xl">
              <h3 className="text-white font-bold text-sm">Contact Us Directly</h3>
            </div>
            <div className="bg-surface-card border border-ink-light rounded-b-xl px-4 py-4">
              <p className="text-xs text-ink-caption mb-3">Prefer to talk? Reach our BD team directly:</p>
              <a href="mailto:bd@dronetv.in" className="block text-sm font-bold text-brand-gold hover:text-brand-yellow mb-3">bd@dronetv.in</a>
              <p className="text-xs text-ink-caption">Response within 48 hours on business days.</p>
            </div>
          </div>

          <div>
            <div className="bg-ink px-4 py-3 rounded-t-xl">
              <h3 className="text-white font-bold text-sm">Package Summary</h3>
            </div>
            <div className="bg-surface-card border border-ink-light rounded-b-xl px-4 py-4 space-y-3">
              {[
                { name: 'Reach', price: 'Rs.25,000/yr', highlight: false },
                { name: 'Scale', price: 'Rs.75,000/yr', highlight: true },
                { name: 'Brand', price: 'Rs.1,50,000/yr', highlight: false },
              ].map((p) => (
                <div key={p.name} className={`flex items-center justify-between py-2 px-3 rounded-lg ${p.highlight ? 'bg-surface-main border border-brand-yellow-soft' : ''}`}>
                  <span className="text-sm font-bold text-ink">{p.name}</span>
                  <span className={`text-xs font-bold ${p.highlight ? 'text-brand-gold' : 'text-ink-caption'}`}>{p.price}</span>
                </div>
              ))}
              <p className="text-xs text-ink-caption pt-1">All + GST. 100% advance. 12-month term.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
