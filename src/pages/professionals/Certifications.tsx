import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { fetchContent, MediaItem } from '../../lib/mediaApi';

const certTypes = [
  {
    title: 'Remote Pilot Certificate (RPC)',
    icon: '🏅',
    desc: 'Mandatory for all commercial drone operations in India. Issued by DGCA after completing training at an approved RPTO and passing the RPC examination.',
    validity: '5 years (renewable)',
    issued: 'DGCA India',
  },
  {
    title: 'Remote Pilot Training Organisation (RPTO)',
    icon: '🏫',
    desc: 'Certification for organisations that wish to conduct drone pilot training. RPTOs must meet DGCA infrastructure and instructor requirements.',
    validity: 'Annual renewal',
    issued: 'DGCA India',
  },
  {
    title: 'Type Certification',
    icon: '✅',
    desc: 'Mandatory certification for drone manufacturers confirming their aircraft meets DGCA airworthiness standards. Required before commercial sale.',
    validity: 'Per aircraft model',
    issued: 'DGCA / BCAS',
  },
  {
    title: 'BVLOS Approval',
    icon: '🛰️',
    desc: 'Special authorisation for Beyond Visual Line of Sight operations. Requires additional safety systems, operational procedures, and DGCA/MoCA approval.',
    validity: 'Case-by-case',
    issued: 'DGCA / MoCA',
  },
];

const rptOs = [
  { name: 'Drone Destination', city: 'Delhi', specialty: 'Multi-category' },
  { name: 'ideaForge Technology', city: 'Pune', specialty: 'Small & Medium category' },
  { name: 'Garuda Aerospace', city: 'Chennai', specialty: 'Agriculture drones' },
  { name: 'TATA Advanced Systems', city: 'Bengaluru', specialty: 'Large category' },
  { name: 'Throttle Aerospace Systems', city: 'Hyderabad', specialty: 'Survey & mapping' },
];

export default function CertificationsPage() {
  const [cmsItems, setCmsItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetchContent('certification', controller.signal).then(setCmsItems).catch(() => {});
    return () => controller.abort();
  }, []);

  const rptOsToShow = cmsItems.length > 0 ? null : rptOs;

  return (
    <div className="pt-[104px] min-h-screen bg-gray-50">
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400" />
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-bold tracking-widest text-yellow-400 uppercase mb-2">Professionals</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3">
              DGCA Drone <span className="text-yellow-400 not-italic">Certifications</span>
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-lg">
              Everything you need to know about DGCA drone certification — RPC, RPTO approval, type certification, and BVLOS authorisation.
            </p>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">39,890</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">Certified Pilots</span>
            </div>
            <div>
              <span className="text-4xl font-extrabold text-yellow-400 block leading-none">240+</span>
              <span className="text-xs text-white/50 font-semibold uppercase tracking-wide mt-1 block">RPTOs Approved</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Types</span>
            Certification Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certTypes.map((c) => (
              <div key={c.title} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug">{c.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Issued by: {c.issued}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{c.desc}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Validity:</span>
                  <span className="text-xs text-gray-700 font-semibold">{c.validity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">Process</span>
            How to Get Certified
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Choose an RPTO', desc: 'Select a DGCA-approved Remote Pilot Training Organisation near you. 240+ options across India.' },
              { step: '2', title: 'Complete Training', desc: 'Complete the required training hours — 5 days for small category, up to 30 days for large category drones.' },
              { step: '3', title: 'Pass DGCA Exam', desc: 'Pass the theoretical and practical examination. Your RPC is issued digitally via the DigitalSky platform.' },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-center">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black font-extrabold text-xl mx-auto mb-3">
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-5 after:flex-1 after:h-0.5 after:bg-gray-200 after:content-['']">
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">RPTOs</span>
            Top Training Organisations
          </h2>
          {cmsItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cmsItems.map(item => (
                <div key={item.contentId} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-3" />}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm leading-snug">{item.title}</h3>
                    {item.category && <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded flex-shrink-0">{item.category}</span>}
                  </div>
                  {item.company && <p className="text-xs text-gray-500 mb-1">{item.company}</p>}
                  {item.location && <p className="text-xs text-gray-400 mb-2">{item.location}</p>}
                  {item.description && <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3">{item.description}</p>}
                  <div className="flex items-center justify-between mt-2">
                    {item.price && <span className="text-xs font-semibold text-gray-600">{item.price}</span>}
                    {item.externalLink && (
                      <a href={item.externalLink} target="_blank" rel="noopener noreferrer"
                        className="text-xs font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1 ml-auto">
                        Learn More <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {rptOsToShow!.map((r, i) => (
                <div key={i} className={`flex items-center justify-between px-5 py-3.5 ${i < rptOsToShow!.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.specialty}</p>
                  </div>
                  <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">{r.city}</span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 text-center">
            <a
              href="https://digitalsky.dgca.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-yellow-600 hover:text-yellow-700 transition-colors"
            >
              View all 240+ approved RPTOs on DGCA DigitalSky →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
