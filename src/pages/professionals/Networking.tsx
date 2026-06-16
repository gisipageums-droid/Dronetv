import { Link } from 'react-router-dom';

const chapters = [
  {
    city: 'Hyderabad',
    members: '85+ members',
    schedule: 'Monthly — 3rd Saturday',
    focus: 'Agriculture & Survey',
  },
  {
    city: 'Delhi NCR',
    members: '120+ members',
    schedule: 'Monthly — 2nd Thursday',
    focus: 'Defence & Inspection',
  },
  {
    city: 'Mumbai',
    members: '65+ members',
    schedule: 'Bi-monthly — 1st Saturday',
    focus: 'GIS & Cinematography',
  },
];

const threads = [
  {
    title: 'DGCA BVLOS framework — what we know so far',
    replies: 23,
    author: 'Amit Singh, Delhi',
    category: 'Regulation',
    categoryClass: 'bg-green-100 text-green-700',
    time: '2 days ago',
  },
  {
    title: 'Agriculture drone job market in Telangana — anyone hiring?',
    replies: 14,
    author: 'Rajesh Kumar, Hyderabad',
    category: 'Jobs',
    categoryClass: 'bg-blue-100 text-blue-700',
    time: '4 days ago',
  },
  {
    title: 'DJI Agras T40 vs Garuda Agri for paddy spraying',
    replies: 31,
    author: 'Sunita Reddy, Bengaluru',
    category: 'Equipment',
    categoryClass: 'bg-purple-100 text-purple-700',
    time: '1 week ago',
  },
  {
    title: 'BVLOS approval process — step-by-step for those who have done it',
    replies: 8,
    author: 'Mohammed Farhan, Hyderabad',
    category: 'Regulation',
    categoryClass: 'bg-green-100 text-green-700',
    time: '1 week ago',
  },
];

export default function NetworkingPage() {
  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Professionals</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              Drone Professional <span className="text-yellow-400 not-italic">Networking</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Connect with India's drone community — city meetups, LinkedIn, discussion forums, and WhatsApp groups.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">3</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">City Chapters</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">Monthly</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Meetups</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
              <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">City</span>
              Local Chapters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {chapters.map((c) => (
                <div key={c.city} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="bg-black px-4 py-3">
                    <p className="text-yellow-400 font-extrabold">{c.city}</p>
                    <p className="text-white/40 text-xs">{c.members}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">📅 {c.schedule}</p>
                    <p className="text-xs font-semibold text-gray-700 mb-3">Focus: {c.focus}</p>
                    <Link to="/events/meetups" className="text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors">
                      Join Chapter →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
              <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Forum</span>
              Recent Discussions
            </h2>
            <div className="space-y-3">
              {threads.map((t, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${t.categoryClass}`}>{t.category}</span>
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1">{t.title}</h3>
                      <p className="text-xs text-gray-500">{t.author} · {t.time}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-extrabold text-gray-700">{t.replies}</p>
                      <p className="text-xs text-gray-400">replies</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="bg-black px-4 py-3 rounded-t-xl">
              <h3 className="text-white font-bold text-sm">LinkedIn Community</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-b-xl px-4 py-4">
              <p className="text-xs text-gray-500 mb-3">India's largest drone professional community on LinkedIn.</p>
              <p className="text-base font-extrabold text-gray-900 mb-1">@indiaDroneTv</p>
              <p className="text-xs text-yellow-600 font-bold mb-3">6,000+ members</p>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 text-white font-bold text-xs py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Join on LinkedIn →
              </a>
            </div>
          </div>

          <div>
            <div className="bg-black px-4 py-3 rounded-t-xl">
              <h3 className="text-white font-bold text-sm">Quick Links</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-b-xl px-4 py-4 space-y-2">
              {[
                { label: 'Job Board', to: '/professionals/job-board' },
                { label: 'Pilot Directory', to: '/professionals/pilot-directory' },
                { label: 'Certifications', to: '/professionals/certifications' },
                { label: 'Training', to: '/professionals/training' },
                { label: 'Upcoming Meetups', to: '/events/meetups' },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="flex items-center justify-between py-1.5 text-sm text-gray-700 hover:text-yellow-600 font-medium group">
                  {l.label}
                  <span className="text-gray-300 group-hover:text-yellow-400">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
