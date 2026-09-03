import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scale, ArrowRight } from 'lucide-react';
import CompactHero from '../common/CompactHero';
import { LEGAL_POLICIES, LEGAL_CONFIG } from '../../data/legalPolicies';

export default function LegalIndexPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="pt-[104px] min-h-screen bg-surface-main">
      <CompactHero
        title={<>DroneTV <span>Legal &amp; Policies</span></>}
        stats={[{ n: `${LEGAL_POLICIES.length}`, l: 'Documents' }]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-surface-card rounded-xl border border-ink-light shadow-sm p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="bg-ink rounded-xl p-3 flex-shrink-0">
              <Scale className="h-6 w-6 text-brand-yellow" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink mb-2">Legal &amp; Policies</h1>
              <p className="text-ink-paragraph leading-relaxed text-sm">
                The documents below govern the use of DroneTV.in. They apply together and
                cross-reference each other. DroneTV is a discovery, media and industry-connect
                platform for the drone, GIS and AI ecosystem; unless it expressly identifies
                itself as the seller, provider, employer or organiser, the relevant third party
                is responsible for the underlying offering.
              </p>
              <p className="text-xs text-ink-caption mt-3">
                Effective {LEGAL_CONFIG.effectiveDate || 'on publication'} · Version 1.0 ·
                Being finalised with Indian legal counsel.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {LEGAL_POLICIES.map((p) => (
            <Link
              key={p.slug}
              to={`/legal/${p.slug}`}
              className="group bg-surface-card rounded-xl border border-ink-light shadow-sm p-5 hover:border-brand-yellow transition-colors flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <h2 className="text-base font-bold text-ink group-hover:text-brand-gold transition-colors">
                  {p.title}
                </h2>
                <p className="text-sm text-ink-caption leading-relaxed mt-1">{p.summary}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-ink-caption group-hover:text-brand-gold flex-shrink-0 mt-1" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
