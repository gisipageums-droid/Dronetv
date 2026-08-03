import { Globe, Phone, Mail, MapPin, CheckCircle, ArrowLeft, Upload } from 'lucide-react';
import { FormData } from '../types/form';

type DigiStatus = 'idle' | 'loading' | 'polling' | 'verified' | 'error';

interface Props {
  formData: FormData;
  onBack: () => void;
  onPublish: () => void;
  isPublishing: boolean;
  aadharVerified: boolean;
  digiStatus: DigiStatus;
  consent: boolean;
  onConsentChange: (v: boolean) => void;
  onStartDigiLocker: () => void;
  embedded?: boolean;
}

export default function PreviewPublish({
  formData, onBack, onPublish, isPublishing,
  aadharVerified, digiStatus, consent, onConsentChange, onStartDigiLocker,
  embedded = false,
}: Props) {
  const isBusy = digiStatus === 'loading' || digiStatus === 'polling';

  return (
    <div className={embedded ? "bg-ink-offwhite pb-8 px-4" : "min-h-screen bg-ink-offwhite pt-24 pb-8 px-4"}>
      <div className="max-w-5xl mx-auto">

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-ink-paragraph mb-6 hover:text-ink transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Edit Details</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* LEFT: Company Listing Preview */}
          <div>
            <h2 className="text-lg font-bold text-ink-charcoal mb-3">Your Listing Preview</h2>
            <p className="text-sm text-ink-caption mb-4">This is how your company will appear in our directory.</p>

            <div className="bg-surface-card rounded-xl shadow-md overflow-hidden border border-ink-light">
              <div className="bg-gradient-to-r from-brand-yellow to-brand-gold p-6">
                <div className="w-16 h-16 bg-surface-card rounded-full flex items-center justify-center mb-3 shadow-sm">
                  {formData.companyLogoUrl ? (
                    <img src={formData.companyLogoUrl} alt="logo" className="w-14 h-14 rounded-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-brand-gold">
                      {formData.companyName?.charAt(0)?.toUpperCase() || 'C'}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-ink">{formData.companyName || 'Your Company'}</h3>
                {formData.companyCategory?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.companyCategory.map(cat => (
                      <span key={cat} className="text-xs bg-white/80 text-ink-paragraph px-2 py-0.5 rounded-full">{cat}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3">
                {formData.natureOfBusiness && (
                  <p className="text-ink-paragraph text-sm leading-relaxed">{formData.natureOfBusiness}</p>
                )}

                {formData.websiteUrl && (
                  <div className="flex items-center gap-2 text-sm text-status-info">
                    <Globe size={14} className="flex-shrink-0" />
                    <span className="truncate">{formData.websiteUrl}</span>
                  </div>
                )}

                {(formData.directorPhone || formData.contactPhone) && (
                  <div className="flex items-center gap-2 text-sm text-ink-paragraph">
                    <Phone size={14} className="flex-shrink-0" />
                    {formData.directorPhone || formData.contactPhone}
                  </div>
                )}

                {(formData.directorEmail || formData.contactEmail) && (
                  <div className="flex items-center gap-2 text-sm text-ink-paragraph">
                    <Mail size={14} className="flex-shrink-0" />
                    {formData.directorEmail || formData.contactEmail}
                  </div>
                )}

                {(formData.city || formData.state) && (
                  <div className="flex items-center gap-2 text-sm text-ink-paragraph">
                    <MapPin size={14} className="flex-shrink-0" />
                    {[formData.city, formData.state].filter(Boolean).join(', ')}
                  </div>
                )}

                {formData.services && formData.services.length > 0 && (
                  <div className="border-t pt-3 mt-3">
                    <p className="text-xs font-semibold text-ink-caption uppercase tracking-wide mb-2">Services</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.services.slice(0, 6).map((s, i) => (
                        <span key={i} className="text-xs bg-ink-light text-ink-paragraph px-2 py-0.5 rounded">{s.title}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Publish */}
          <div>
            <h2 className="text-lg font-bold text-ink-charcoal mb-3">Ready to Publish</h2>
            <p className="text-sm text-ink-caption mb-4">Your listing is ready. Click below to submit and list your company instantly.</p>

            <div className="bg-surface-card rounded-xl shadow-md p-6 border border-ink-light">

              <div className="flex items-start gap-3 p-4 bg-surface-main rounded-lg mb-6">
                <CheckCircle size={18} className="text-brand-gold mt-0.5 flex-shrink-0" />
                <p className="text-sm text-brand-gold">
                  Your company details have been filled in. Once submitted, your listing will go live and you can customise your website in the editor.
                </p>
              </div>

              <button
                onClick={onPublish}
                disabled={isPublishing}
                className="w-full py-3 px-4 bg-brand-yellow hover:bg-brand-gold disabled:opacity-60 disabled:cursor-not-allowed text-ink font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isPublishing ? (
                  <>
                    <span className="w-5 h-5 border-2 border-ink-paragraph border-t-transparent rounded-full animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Submit & List My Company
                  </>
                )}
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
