import { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { FileText, Mail, ChevronRight } from 'lucide-react';
import CompactHero from '../common/CompactHero';
import {
  LEGAL_POLICIES,
  LEGAL_CONFIG,
  LEGAL_CONTACTS,
  policyBySlug,
} from '../../data/legalPolicies';

const TOKENS: Record<string, string> = {
  entity: LEGAL_CONFIG.entity || 'the DroneTV operating entity',
  gstin: LEGAL_CONFIG.gstin || '(registration number to be published)',
  grievanceOfficer: LEGAL_CONFIG.grievanceOfficer || 'the designated Grievance Officer',
  effectiveDate: LEGAL_CONFIG.effectiveDate || 'the date of publication',
};

const fill = (s: string) =>
  s.replace(/\{\{(\w+)\}\}/g, (_, k) => TOKENS[k] ?? `{{${k}}}`);

export default function PolicyPage() {
  const { slug = '' } = useParams();
  const policy = policyBySlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (!policy) return <Navigate to="/legal" replace />;

  // Canonicalise: if reached via an alias, point at the primary slug.
  if (slug !== policy.slug) return <Navigate to={`/legal/${policy.slug}`} replace />;

  return (
    <div className="pt-[104px] min-h-screen bg-surface-main">
      <CompactHero
        title={<>DroneTV <span>Legal</span></>}
        stats={[{ n: LEGAL_CONFIG.effectiveDate || 'Draft', l: 'Effective' }]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <nav className="flex items-center gap-1.5 text-xs text-ink-caption mb-4">
          <Link to="/legal" className="hover:text-ink">Legal &amp; Policies</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-ink-paragraph">{policy.title}</span>
        </nav>

        <div className="bg-surface-card rounded-xl border border-ink-light shadow-sm p-8 mb-6">
          <h1 className="text-2xl font-bold text-ink mb-2">{policy.title}</h1>
          <p className="text-ink-paragraph leading-relaxed text-sm">{policy.summary}</p>
          <p className="text-xs text-ink-caption mt-4">
            Version 1.0 · Effective {LEGAL_CONFIG.effectiveDate || 'on publication'} · Reviewed at least annually.
            This policy is being finalised with Indian legal counsel.
          </p>
        </div>

        <div className="space-y-4">
          {policy.sections.map((section, i) => (
            <div key={i} className="bg-surface-card rounded-xl border border-ink-light shadow-sm p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="bg-ink rounded-xl p-2.5 flex-shrink-0">
                  <FileText className="h-5 w-5 text-brand-yellow" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-ink mb-3">{section.title}</h2>
                  {section.items.length === 1 ? (
                    <p className="text-sm text-ink-paragraph leading-relaxed">{fill(section.items[0])}</p>
                  ) : (
                    <ul className="space-y-2.5">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-ink-paragraph">
                          <span className="flex-shrink-0 h-1.5 w-1.5 bg-brand-yellow rounded-full mt-2" />
                          <span className="leading-relaxed text-sm">{fill(item)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-surface-card rounded-xl border border-ink-light shadow-sm p-6">
          <h3 className="text-sm font-bold text-ink mb-3">Contacts</h3>
          <ul className="text-sm text-ink-paragraph space-y-1.5">
            <li>General / support: <a className="text-brand-gold hover:underline" href={`mailto:${LEGAL_CONTACTS.support}`}>{LEGAL_CONTACTS.support}</a></li>
            <li>Privacy &amp; data requests: <a className="text-brand-gold hover:underline" href={`mailto:${LEGAL_CONTACTS.privacy}`}>{LEGAL_CONTACTS.privacy}</a></li>
            <li>Grievance Officer: <a className="text-brand-gold hover:underline" href={`mailto:${LEGAL_CONTACTS.grievance}`}>{LEGAL_CONTACTS.grievance}</a></li>
            <li>Billing / payments: <a className="text-brand-gold hover:underline" href={`mailto:${LEGAL_CONTACTS.billing}`}>{LEGAL_CONTACTS.billing}</a></li>
            <li>IP / legal notices: <a className="text-brand-gold hover:underline" href={`mailto:${LEGAL_CONTACTS.legal}`}>{LEGAL_CONTACTS.legal}</a></li>
            <li>Security disclosure: <a className="text-brand-gold hover:underline" href={`mailto:${LEGAL_CONTACTS.security}`}>{LEGAL_CONTACTS.security}</a></li>
            <li className="pt-1 text-ink-caption">Registered office: {LEGAL_CONTACTS.office}</li>
          </ul>
        </div>

        <div className="mt-6 bg-ink rounded-xl p-6 text-center">
          <Mail className="h-8 w-8 text-brand-yellow mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-2">Questions about this policy?</h3>
          <a
            href="/contact"
            className="inline-block bg-brand-yellow text-ink px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-brand-yellow-soft transition-colors"
          >
            Contact Us
          </a>
        </div>

        <div className="mt-8">
          <h3 className="text-xs font-bold uppercase tracking-wide text-ink-caption mb-3">All policies</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {LEGAL_POLICIES.map((p) => (
              <Link
                key={p.slug}
                to={`/legal/${p.slug}`}
                className={`text-sm rounded-lg border px-3 py-2 transition-colors ${
                  p.slug === policy.slug
                    ? 'border-brand-yellow bg-brand-yellow/10 text-ink font-semibold'
                    : 'border-ink-light text-ink-paragraph hover:border-brand-yellow hover:text-ink'
                }`}
              >
                {p.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
