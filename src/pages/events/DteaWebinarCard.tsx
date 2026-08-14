import { useState } from 'react';
import { CalendarDays, Clock, Globe2 } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { ADMIN_API, LAMBDA } from '../../lib/apiConfig';

const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029VbBjDcVIXnloFSQOoj13';

const CONTACT_URL = ADMIN_API ? `${ADMIN_API}/contact` : `${LAMBDA.contact}/contact`;

const INDUSTRY_OPTIONS = ['Drone / UAV', 'GIS / Geospatial', 'AI / Technology', 'Surveying / Mapping', 'Startup', 'Academia / Training', 'Government', 'Student', 'Corporate', 'Other'];
const MEMBERSHIP_INTEREST_OPTIONS = ['Yes, I am interested', 'Maybe, send more information', 'Already a member', 'Not currently'];
const MEMBERSHIP_CATEGORY_OPTIONS = ['Professional Member', 'Student Member', 'Startup Member', 'Corporate Member', 'Institutional Member', 'Need Guidance'];
const SOURCE_OPTIONS = ['DroneTV.in', 'DTEA', 'WhatsApp Group', 'LinkedIn', 'Instagram', 'Email', 'Friend / Industry Contact', 'Drone Expo 2026', 'Other'];

interface DteaForm {
  fullName: string;
  designation: string;
  organisation: string;
  city: string;
  email: string;
  phone: string;
  industry: string;
  membershipInterest: string;
  membershipCategory: string;
  expectation: string;
  source: string;
  consent: boolean;
}

const EMPTY_FORM: DteaForm = {
  fullName: '', designation: '', organisation: '', city: '', email: '', phone: '',
  industry: '', membershipInterest: '', membershipCategory: '', expectation: '',
  source: '', consent: false,
};

// Arbitrary-value hex classes (not the design-system token names like
// brand-yellow/ink/surface-*) so this renders correctly on both dev
// (custom Tailwind theme) and main/live (stock Tailwind, no theme
// extension) — matches the exact "Full Yellow DroneTV Theme" palette
// supplied for this card rather than approximating with named utilities.
export default function DteaWebinarCard() {
  const [form, setForm] = useState<DteaForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const set = (key: keyof DteaForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const setConsent = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, consent: e.target.checked }));

  const setPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setForm(f => ({ ...f, phone: digits }));
    setPhoneError('');
  };

  const isValidPhone = (phone: string) => {
    if (!/^\d{10}$/.test(phone)) return false;
    if (/^(\d)\1{9}$/.test(phone)) return false; // all digits the same, e.g. 1111111111
    if (/^0123456789$|^1234567890$|^9876543210$|^0987654321$/.test(phone)) return false; // sequential
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhone(form.phone)) {
      setPhoneError('Enter a valid 10-digit mobile number.');
      return;
    }
    setSubmitting(true);
    setSubmitError(false);
    try {
      const message = [
        'DTEA Webinar Registration — DTEA: Role, Industry & Technology (17 Aug 2026)',
        `Designation: ${form.designation}`,
        `Organisation: ${form.organisation}`,
        `City: ${form.city}`,
        `Industry / Sector: ${form.industry}`,
        `Interested in DTEA Membership: ${form.membershipInterest}`,
        `Preferred Membership Category: ${form.membershipCategory || '—'}`,
        `What they'd like DTEA to focus on: ${form.expectation || '—'}`,
        `How did you hear about this webinar: ${form.source || '—'}`,
      ].join('\n');
      const res = await fetch(CONTACT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.fullName, email: form.email, phone: form.phone, message }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json().catch(() => ({}));
      if (result?.alreadyRegistered) {
        setAlreadyRegistered(true);
      } else {
        setSubmitted(true);
      }
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-3 py-2.5 border border-[#CFCFCF] rounded-lg text-sm text-[#1F1F1F] bg-white focus:outline-none focus:border-[#E8B400]";
  const labelCls = "block text-xs font-bold text-[#2F2F2F] mb-1";

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-[#E2C25A]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#FFC515] to-[#FFD85A] px-6 sm:px-8 py-7">
        <div className="flex items-start gap-4 flex-wrap">
          <img src="/images/dtea-logo.png" alt="Drone Tech Excellence Association" className="h-16 sm:h-20 object-contain flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-[#2F2F2F]/70 uppercase tracking-wide mb-1">Featured Webinar</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2F2F2F] leading-tight">DTEA Webinar</h2>
            <p className="text-base sm:text-lg font-semibold text-[#2F2F2F]/90 mt-0.5">DTEA — Role, Industry &amp; Technology</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-5">
          <span className="flex items-center gap-1.5 bg-[#2F2F2F] text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-bold">
            <CalendarDays className="w-4 h-4" /> 17 August 2026, Monday
          </span>
          <span className="flex items-center gap-1.5 bg-[#2F2F2F] text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-bold">
            <Clock className="w-4 h-4" /> 11:00 AM – 12:00 PM
          </span>
          <span className="flex items-center gap-1.5 bg-[#2F2F2F] text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-bold">
            <Globe2 className="w-4 h-4" /> Online Webinar
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] bg-[#FFC515]">
        {/* Info */}
        <div className="px-6 sm:px-8 py-7 border-t lg:border-t-0 lg:border-r border-[#2F2F2F]/10">
          <h3 className="text-lg font-bold text-[#2F2F2F] mb-3">DTEA Membership Drive</h3>
          <p className="text-sm text-[#2F2F2F]/80 leading-relaxed mb-3">
            Connect with professionals, companies, startups, institutions and stakeholders from the Drone, GIS and AI technology ecosystem.
          </p>
          <ul className="space-y-1.5 mb-4">
            {[
              'DTEA vision, mission and objectives',
              'Drone, GIS and AI industry collaboration',
              'Industry challenges and opportunities',
              'Networking and knowledge sharing',
              'Technology trends and industry engagement',
              'Membership benefits and joining process',
            ].map(li => (
              <li key={li} className="text-sm text-[#2F2F2F]/80 flex items-start gap-2">
                <span className="text-[#E8B400] mt-1">●</span> {li}
              </li>
            ))}
          </ul>
          <div className="bg-[#FFF1B8] border-l-4 border-[#FF1F1F] rounded-lg p-3.5">
            <p className="text-sm font-bold text-[#2F2F2F]">Membership Drive 2026</p>
            <p className="text-xs text-[#2F2F2F]/80 mt-1">Register for the webinar and indicate your interest in becoming a DTEA member.</p>
          </div>

          <h3 className="text-sm font-bold text-[#2F2F2F] mt-6 mb-2">Who should attend?</h3>
          <p className="text-xs text-[#2F2F2F]/80 leading-relaxed">
            Drone professionals and operators, GIS and geospatial experts, AI professionals, startups and entrepreneurs, academia and students, technology companies, government representatives and other industry stakeholders.
          </p>
        </div>

        {/* Form */}
        <div className="px-6 sm:px-8 py-7">
          <h3 className="text-lg font-bold text-[#2F2F2F] mb-4">Register for the Webinar</h3>
          {!submitted && !alreadyRegistered ? (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 gap-3.5">
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input required placeholder="Enter your full name" value={form.fullName} onChange={set('fullName')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Designation *</label>
                  <input required placeholder="e.g. CEO, Engineer, Student, Researcher" value={form.designation} onChange={set('designation')} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3.5">
                <div>
                  <label className={labelCls}>Company / Organisation *</label>
                  <input required placeholder="Enter company / organisation name" value={form.organisation} onChange={set('organisation')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>City *</label>
                  <input required placeholder="Enter your city" value={form.city} onChange={set('city')} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3.5">
                <div>
                  <label className={labelCls}>Email Address *</label>
                  <input type="email" required placeholder="e.g. john@company.com" value={form.email} onChange={set('email')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Mobile / WhatsApp *</label>
                  <input type="tel" inputMode="numeric" maxLength={10} required placeholder="9876543211"
                    value={form.phone} onChange={setPhone} className={inputCls} />
                  {phoneError && <p className="text-xs text-[#FF1F1F] font-medium mt-1">{phoneError}</p>}
                </div>
              </div>
              <div>
                <label className={labelCls}>Industry / Sector *</label>
                <select required value={form.industry} onChange={set('industry')} className={inputCls}>
                  <option value="">Select</option>
                  {INDUSTRY_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Interested in DTEA Membership? *</label>
                <select required value={form.membershipInterest} onChange={set('membershipInterest')} className={inputCls}>
                  <option value="">Select</option>
                  {MEMBERSHIP_INTEREST_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Preferred Membership Category</label>
                <select value={form.membershipCategory} onChange={set('membershipCategory')} className={inputCls}>
                  <option value="">Select</option>
                  {MEMBERSHIP_CATEGORY_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>What would you like DTEA to focus on?</label>
                <textarea rows={3} placeholder="e.g. Networking, industry collaboration, business opportunities, training, technology updates" value={form.expectation} onChange={set('expectation')} className={`${inputCls} resize-none`} />
              </div>
              <div>
                <label className={labelCls}>How did you hear about this webinar?</label>
                <select value={form.source} onChange={set('source')} className={inputCls}>
                  <option value="">Select how you heard about the webinar</option>
                  {SOURCE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <input type="checkbox" id="dtea-consent" required checked={form.consent} onChange={setConsent}
                  className="mt-0.5 w-4 h-4 flex-shrink-0 accent-[#FF1F1F]" />
                <label htmlFor="dtea-consent" className="text-sm text-[#2F2F2F] leading-snug">
                  I agree to receive webinar updates, DTEA membership information and relevant industry communication from DTEA and DroneTV.
                </label>
              </div>
              {submitError && (
                <p className="text-xs text-[#FF1F1F] font-medium">Registration failed. Please check your connection and try again.</p>
              )}
              <button type="submit" disabled={submitting}
                className="w-full bg-[#FF1F1F] hover:opacity-90 text-white font-bold text-sm py-3.5 rounded-lg transition-opacity disabled:opacity-50">
                {submitting ? 'Registering...' : 'REGISTER NOW'}
              </button>
            </form>
          ) : alreadyRegistered ? (
            <div className="bg-[#FFF1B8] border border-[#E8B400] rounded-lg p-4 text-center">
              <p className="text-sm font-bold text-[#2F2F2F] mb-1">You're already registered!</p>
              <p className="text-xs text-[#2F2F2F]/80 mb-3">This email has already been registered for this webinar. Check your inbox at {form.email} for the confirmation and joining details.</p>
              <a href={WHATSAPP_CHANNEL_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:opacity-90 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-opacity">
                <FaWhatsapp className="w-3.5 h-3.5" /> Follow on WhatsApp
              </a>
            </div>
          ) : (
            <div className="bg-[#FFF4F4] border border-[#FF1F1F] rounded-lg p-4 text-center">
              <p className="text-sm font-bold text-[#2F2F2F] mb-1">Thank you, {form.fullName.split(' ')[0]}!</p>
              <p className="text-xs text-[#2F2F2F]/80 mb-3">Your registration has been received. Webinar details will be shared with you at {form.email}.</p>
              <a href={WHATSAPP_CHANNEL_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:opacity-90 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-opacity">
                <FaWhatsapp className="w-3.5 h-3.5" /> Follow on WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Partners */}
      <div className="bg-[#FFC515] border-t border-[#2F2F2F]/10 px-6 sm:px-8 py-6">
        <h3 className="text-center text-sm font-bold text-[#2F2F2F] uppercase tracking-wide mb-4">Partners</h3>
        <div className="grid grid-cols-2 gap-5 max-w-lg mx-auto">
          <div className="bg-[#FFD85A] border border-[#2F2F2F]/15 rounded-xl p-4 text-center flex flex-col items-center justify-center min-h-[140px]">
            <span className="text-[11px] font-extrabold text-[#2F2F2F] uppercase tracking-wide mb-2.5">Media Partner</span>
            <img src="/images/logo.png" alt="DroneTv.in" className="max-w-full h-16 object-contain" />
          </div>
          <div className="bg-[#FFD85A] border border-[#2F2F2F]/15 rounded-xl p-4 text-center flex flex-col items-center justify-center min-h-[140px]">
            <span className="text-[11px] font-extrabold text-[#2F2F2F] uppercase tracking-wide mb-2.5">Expo Partner</span>
            <img src="/images/drone-expo-2026-logo.jpg" alt="Drone Expo 2026" className="max-w-full h-24 object-contain rounded" />
          </div>
        </div>
      </div>

      {/* WhatsApp Channel */}
      <div className="bg-[#FFC515] border-t border-[#2F2F2F]/10 px-6 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
        <p className="text-sm font-bold text-[#2F2F2F]">Stay updated on DTEA webinars and events</p>
        <a href={WHATSAPP_CHANNEL_URL} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:opacity-90 text-white font-bold text-sm px-4 py-2 rounded-lg transition-opacity">
          <FaWhatsapp className="w-4 h-4" /> Follow on WhatsApp
        </a>
      </div>

      <div className="bg-[#2F2F2F] text-white text-center py-3.5 text-sm font-bold">
        www.dronetechassociation.org &nbsp;|&nbsp; DTEA Membership Drive 2026
      </div>
    </div>
  );
}
