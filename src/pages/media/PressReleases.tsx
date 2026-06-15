import { useState } from 'react';

const releases = [
  {
    day: '03',
    month: 'Jun',
    year: '2026',
    company: 'Drone Federation India',
    title: 'India Set to Issue Largest-Ever Domestic Drone Order Worth Over $2 Billion',
    excerpt: 'The Drone Federation of India confirmed that the Indian government is preparing to issue a domestic drone procurement order exceeding $2 billion, which would be the largest single drone order placed by any government globally.',
    badges: ['Defence', 'Policy'],
  },
  {
    day: '05',
    month: 'Jun',
    year: '2026',
    company: 'IBEF',
    title: 'India Drone Market to Reach US$ 3,231 Million by 2030 at 21.51% CAGR',
    excerpt: 'The India Brand Equity Foundation released updated drone market projections showing the sector growing from Rs.10,977 Crore in 2025 to Rs.29,080 Crore by 2030, equivalent to approximately US$ 3.23 billion.',
    badges: ['Market', 'Research'],
  },
  {
    day: '15',
    month: 'Mar',
    year: '2026',
    company: 'DGCA India',
    title: 'DGCA Certifies 39,890 Remote Pilots; 240 RPTOs Approved Across India',
    excerpt: 'The Directorate General of Civil Aviation announced that 39,890 remote pilots have now received the Remote Pilot Certificate (RPC), with 240 Remote Pilot Training Organisations approved to train new pilots.',
    badges: ['Regulation', 'Training'],
  },
  {
    day: 'Feb',
    month: '',
    year: '2026',
    company: 'Ministry of Panchayati Raj',
    title: 'SVAMITVA Drone Surveys Reach 3.28 Lakh Villages Across India',
    excerpt: 'The Ministry of Panchayati Raj reported that the SVAMITVA scheme has completed drone-based property surveys in 3.28 lakh villages, providing land rights documentation to rural property holders.',
    badges: ['Policy', 'Agriculture'],
  },
];

export default function PressReleasesPage() {
  const [form, setForm] = useState({ company: '', email: '', title: '', content: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ company: '', email: '', title: '', content: '' });
  };

  const badgeClass = (b: string) => {
    if (b === 'Defence') return 'bg-orange-100 text-orange-700';
    if (b === 'Policy') return 'bg-green-100 text-green-700';
    if (b === 'Market' || b === 'Research') return 'bg-blue-100 text-blue-700';
    if (b === 'Regulation' || b === 'Training') return 'bg-purple-100 text-purple-700';
    if (b === 'Agriculture') return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Media Hub</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Drone Industry <span className="text-yellow-400 not-italic">Press Releases</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Official announcements from government bodies, industry associations, and leading drone companies.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Free</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Submission</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">48hr</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Turnaround</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Latest</span>
            Press Releases
          </h2>
          {releases.map((r, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex">
                <div className="bg-black w-20 flex-shrink-0 flex flex-col items-center justify-center py-4 px-2">
                  {r.month ? (
                    <>
                      <span className="text-yellow-400 font-extrabold text-2xl leading-none">{r.day}</span>
                      <span className="text-white/60 text-xs font-semibold mt-0.5">{r.month}</span>
                      <span className="text-white/40 text-xs">{r.year}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-yellow-400 font-extrabold text-sm leading-none text-center">{r.day}</span>
                      <span className="text-white/40 text-xs mt-0.5">{r.year}</span>
                    </>
                  )}
                </div>
                <div className="p-5 flex-1">
                  <p className="text-xs font-bold text-gray-500 mb-1">{r.company}</p>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2">{r.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{r.excerpt}</p>
                  <div className="flex gap-2 flex-wrap">
                    {r.badges.map((b) => (
                      <span key={b} className={`text-xs font-bold px-2 py-0.5 rounded ${badgeClass(b)}`}>{b}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <div className="bg-black px-4 py-3 rounded-t-xl">
              <h3 className="text-white font-bold text-sm">Submit a Press Release</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-b-xl px-4 py-4">
              {submitted ? (
                <div className="text-center py-4">
                  <p className="text-green-700 font-bold text-sm mb-1">Submitted!</p>
                  <p className="text-xs text-gray-500">Our team will review and publish within 48 hours. Email: bd@dronetv.in</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    required
                    placeholder="Company name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                  />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Contact email"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                  />
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="Press release title"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                  />
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    required
                    placeholder="Press release content..."
                    rows={5}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-yellow-400 text-black font-bold text-xs py-2.5 rounded-lg hover:bg-yellow-500 transition-colors"
                  >
                    Submit Press Release
                  </button>
                  <p className="text-xs text-gray-400 text-center">Free submission · 48hr review</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
