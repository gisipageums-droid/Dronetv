import { useState } from 'react';

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
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Partnerships</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Become a Partner <span className="text-yellow-400 not-italic">on DroneTv.in</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Join India's drone industry platform. Get your company verified, listed, and in front of buyers, pilots, and decision-makers across India.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">2 wks</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">To Go Live</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">48hr</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Response</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/5 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap gap-6 justify-center">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <span className="font-extrabold text-yellow-600 text-base block">{s.value}</span>
              <span className="text-xs text-gray-500">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
              <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Process</span>
              How it Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((s) => (
                <div key={s.num} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-extrabold text-base mb-3">
                    {s.num}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-2">{s.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
              <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Enquiry</span>
              Submit Your Interest
            </h2>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <p className="text-2xl mb-3">✅</p>
                <h3 className="font-bold text-green-800 text-lg mb-2">Thank you!</h3>
                <p className="text-sm text-green-700 mb-1">Our team will contact you within 48 hours.</p>
                <p className="text-sm font-bold text-green-800">Email: bd@dronetv.in</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Company Name *</label>
                    <input
                      name="companyName"
                      value={form.companyName}
                      onChange={handleChange}
                      required
                      placeholder="Your company name"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Name *</label>
                    <input
                      name="yourName"
                      value={form.yourName}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="your@company.com"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Company Type *</label>
                    <select
                      name="companyType"
                      value={form.companyType}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
                    >
                      <option value="">Select type...</option>
                      {companyTypes.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Package</label>
                    <select
                      name="preferredPackage"
                      value={form.preferredPackage}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
                    >
                      <option value="">Select package...</option>
                      {packages.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your company and what you're looking to achieve..."
                    rows={4}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-400 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-yellow-400 text-black font-bold text-sm py-3 rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  Submit Partnership Enquiry →
                </button>
                <p className="text-xs text-gray-400 text-center">We respond within 48 hours · bd@dronetv.in · 100% advance required</p>
              </form>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="bg-black px-4 py-3 rounded-t-xl">
              <h3 className="text-white font-bold text-sm">Contact Us Directly</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-b-xl px-4 py-4">
              <p className="text-xs text-gray-500 mb-3">Prefer to talk? Reach our BD team directly:</p>
              <a href="mailto:bd@dronetv.in" className="block text-sm font-bold text-yellow-600 hover:text-yellow-700 mb-3">bd@dronetv.in</a>
              <p className="text-xs text-gray-400">Response within 48 hours on business days.</p>
            </div>
          </div>

          <div>
            <div className="bg-black px-4 py-3 rounded-t-xl">
              <h3 className="text-white font-bold text-sm">Package Summary</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-b-xl px-4 py-4 space-y-3">
              {[
                { name: 'Reach', price: 'Rs.25,000/yr', highlight: false },
                { name: 'Scale', price: 'Rs.75,000/yr', highlight: true },
                { name: 'Brand', price: 'Rs.1,50,000/yr', highlight: false },
              ].map((p) => (
                <div key={p.name} className={`flex items-center justify-between py-2 px-3 rounded-lg ${p.highlight ? 'bg-yellow-50 border border-yellow-200' : ''}`}>
                  <span className="text-sm font-bold text-gray-900">{p.name}</span>
                  <span className={`text-xs font-bold ${p.highlight ? 'text-yellow-600' : 'text-gray-500'}`}>{p.price}</span>
                </div>
              ))}
              <p className="text-xs text-gray-400 pt-1">All + GST. 100% advance. 12-month term.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
