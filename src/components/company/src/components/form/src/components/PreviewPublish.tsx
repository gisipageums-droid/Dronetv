import { Globe, Phone, Mail, MapPin, CheckCircle, ArrowLeft, Upload, Shield } from 'lucide-react';
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
}

export default function PreviewPublish({
  formData, onBack, onPublish, isPublishing,
  aadharVerified, digiStatus, consent, onConsentChange, onStartDigiLocker
}: Props) {
  const isBusy = digiStatus === 'loading' || digiStatus === 'polling';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Edit Details</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* LEFT: Company Listing Preview */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-3">Your Listing Preview</h2>
            <p className="text-sm text-gray-500 mb-4">This is how your company will appear in our directory.</p>

            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                  {formData.companyLogoUrl ? (
                    <img src={formData.companyLogoUrl} alt="logo" className="w-14 h-14 rounded-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-yellow-600">
                      {formData.companyName?.charAt(0)?.toUpperCase() || 'C'}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{formData.companyName || 'Your Company'}</h3>
                {formData.companyCategory?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.companyCategory.map(cat => (
                      <span key={cat} className="text-xs bg-white/80 text-gray-700 px-2 py-0.5 rounded-full">{cat}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3">
                {formData.natureOfBusiness && (
                  <p className="text-gray-600 text-sm leading-relaxed">{formData.natureOfBusiness}</p>
                )}

                {formData.websiteUrl && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Globe size={14} className="flex-shrink-0" />
                    <span className="truncate">{formData.websiteUrl}</span>
                  </div>
                )}

                {(formData.directorPhone || formData.contactPhone) && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={14} className="flex-shrink-0" />
                    {formData.directorPhone || formData.contactPhone}
                  </div>
                )}

                {(formData.directorEmail || formData.contactEmail) && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={14} className="flex-shrink-0" />
                    {formData.directorEmail || formData.contactEmail}
                  </div>
                )}

                {(formData.city || formData.state) && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={14} className="flex-shrink-0" />
                    {[formData.city, formData.state].filter(Boolean).join(', ')}
                  </div>
                )}

                {formData.services && formData.services.length > 0 && (
                  <div className="border-t pt-3 mt-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Services</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.services.slice(0, 6).map((s, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{s.title}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Verify & Publish */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-3">Verify & Publish</h2>
            <p className="text-sm text-gray-500 mb-4">Complete Aadhaar verification to publish your listing instantly.</p>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">

              {!aadharVerified ? (
                <>
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg mb-5">
                    <Shield size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      Verify your identity with Aadhaar via DigiLocker. Your listing will go live <strong>immediately</strong> after verification — no admin review needed.
                    </p>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer mb-5">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={e => onConsentChange(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-yellow-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">
                      I consent to verify my identity using Aadhaar/DigiLocker and agree to the{' '}
                      <span className="text-blue-600 underline cursor-pointer">terms of service</span>.
                    </span>
                  </label>

                  {digiStatus === 'polling' && (
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                      <span className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                      <span className="text-sm text-yellow-800">Waiting for DigiLocker verification… please complete the process in the opened window.</span>
                    </div>
                  )}

                  {digiStatus === 'error' && (
                    <p className="text-sm text-red-500 mb-4">Verification failed or timed out. Please try again.</p>
                  )}

                  <button
                    onClick={onStartDigiLocker}
                    disabled={!consent || isBusy}
                    className="w-full py-3 px-4 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isBusy ? (
                      <span className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Shield size={18} />
                    )}
                    {digiStatus === 'polling' ? 'Verifying…' : digiStatus === 'loading' ? 'Starting…' : 'Verify with Aadhaar'}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg mb-5">
                    <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-800">Identity Verified</p>
                      <p className="text-sm text-green-600">Aadhaar verification was successful. You can now publish.</p>
                    </div>
                  </div>

                  <button
                    onClick={onPublish}
                    disabled={isPublishing}
                    className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isPublishing ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Publishing…
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        Publish & List My Company
                      </>
                    )}
                  </button>
                </>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
