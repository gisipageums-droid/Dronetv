import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, X, Upload, AlertCircle, Shield, Loader2 } from "lucide-react";
import { useTemplate } from "../../../../../../../../context/context";
import axios from "axios";
import { toast } from "react-toastify";

type DigiStatus = 'idle' | 'loading' | 'polling' | 'verified' | 'error';

export default function Publish() {
  const [model, setModel] = useState(false);
  const [termsModel, setTermsModel] = useState(false);
  const [digiStatus, setDigiStatus] = useState<DigiStatus>('idle');
  const [digiConsent, setDigiConsent] = useState(false);
  const [aadharVerified, setAadharVerified] = useState(false);
  const [startPolling, setStartPolling] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const digiTokenRef = useRef('');
  const digiStateRef = useRef('');

  const { publishTemplate, navigatemodel, navModel, draftDetails } = useTemplate();

  // Restore Aadhaar polling if returning from DigiLocker redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('digi_callback')) {
      const storedToken = localStorage.getItem('digi_client_token');
      const storedState = localStorage.getItem('digi_state');
      if (storedToken && storedState) {
        digiTokenRef.current = storedToken;
        digiStateRef.current = storedState;
        setStartPolling(true);
        setDigiStatus('polling');
        setDigiConsent(true);
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // DigiLocker polling
  useEffect(() => {
    if (!startPolling) return;
    let attempts = 0;
    const MAX = 40;
    const timer = setInterval(async () => {
      const token = digiTokenRef.current;
      const state = digiStateRef.current;
      if (!token || !state) return;
      try {
        const res = await axios.post('https://digilocker.meon.co.in/v2/send_entire_data', {
          client_token: token,
          state,
        });
        if (res.data.success && res.data.status === 'success') {
          clearInterval(timer);
          setStartPolling(false);
          setAadharVerified(true);
          setDigiStatus('verified');
          localStorage.removeItem('digi_client_token');
          localStorage.removeItem('digi_state');
          toast.success('Aadhaar verification successful!');
          return;
        }
      } catch { /* continue polling */ }
      attempts++;
      if (attempts >= MAX) {
        clearInterval(timer);
        setStartPolling(false);
        setDigiStatus('error');
        toast.error('Verification timed out. Please try again.');
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [startPolling]);

  const handleDigiLockerLogin = async () => {
    if (!digiConsent) {
      toast.error('Please accept the consent checkbox first.');
      return;
    }
    setDigiStatus('loading');
    try {
      const tokenRes = await axios.post('https://digilocker.meon.co.in/get_access_token', {
        company_name: 'ipage',
        secret_token: 'lwHaBrdbfda67P3uO5jbC7HElp6cpBQb',
      });
      if (tokenRes.data.status) {
        const { client_token, state } = tokenRes.data;
        localStorage.setItem('digi_client_token', client_token);
        localStorage.setItem('digi_state', state);
        const redirectUrl = window.location.origin + window.location.pathname + '?digi_callback=true';
        const urlRes = await axios.post('https://digilocker.meon.co.in/digi_url', {
          client_token,
          redirect_url: redirectUrl,
          company_name: 'ipage',
          documents: 'aadhaar,pan',
          pan_name: 'RAHUL KUMAR',
          pan_no: 'CAPUD4335K',
          other_documents: [],
        });
        if (urlRes.data.status === 'success' && urlRes.data.url) {
          window.location.href = urlRes.data.url;
        } else {
          setDigiStatus('error');
          toast.error('Unable to start DigiLocker. Please try again.');
        }
      } else {
        setDigiStatus('error');
        toast.error('DigiLocker initialization failed.');
      }
    } catch {
      setDigiStatus('error');
      toast.error('Error starting DigiLocker. Please try again.');
    }
  };

  const handleConfirmPublish = async () => {
    if (!aadharVerified) return;
    setIsPublishing(true);
    try {
      const email = draftDetails?.directorEmail || draftDetails?.userId || draftDetails?.formData?.directorEmail || '';
      if (email) {
        const rand = () => Math.random().toString(36).slice(2);
        const password = rand().slice(0, 6) + rand().slice(0, 4).toUpperCase() + '@1';
        try {
          await axios.post('https://rnpcnionle.execute-api.ap-south-1.amazonaws.com/user_register_post', {
            email,
            password,
            fullName: draftDetails?.formData?.directorName || draftDetails?.directorName || '',
          });
        } catch {
          // User may already exist — proceed with publish anyway
        }
      }
      publishTemplate();
      setModel(false);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const termsContent = `Last Updated: 24th September, 2025
These terms and conditions ("Terms") govern the use of services made available on or through https://www.dronetv.in and/or the DroneTV mobile app (collectively, the "Platform", and together with the services made available on or through the Platform, the "Services"). These Terms also include our privacy policy, available at https://www.dronetv.in/privacy-policy  ("Privacy Policy"), and any guidelines, additional, or supplemental terms, policies, and disclaimers made available or issued by us from time to time ("Supplemental Terms"). The Privacy Policy and the Supplemental Terms form an integral part of these Terms. In the event of a conflict between these Terms and the Supplemental Terms with respect to applicable Services, the Supplemental Terms will prevail.
The Terms constitute a binding and enforceable legal contract between Drone Academy Pvt ltd (Drone TV) (a company incorporated under the laws of India with its registered office at 5A/6B, White Waters, Timberlake Colony, Shaikpet, Hyderabad – 500008, India) and you, a user of the Services, or any legal entity that avails Services (defined below) on behalf of end-users ("you" or "Customer"). By using the Services, you represent and warrant that you have full legal capacity and authority to agree to and bind yourself to these Terms. If you represent any other person, you confirm and represent that you have the necessary power and authority to bind such person to these Terms.
By using the Services, you agree that you have read, understood, and are bound by these Terms, as amended from time to time, and that you will comply with the requirements listed here. These Terms expressly supersede any prior written agreements with you. If you do not agree to these Terms, or comply with the requirements listed here, please do not use the Services.

1. SERVICES
(a) The Services include the provision of the Platform that enables you to access drone-related content, events, educational material, and business listings, including the ability to interact with other companies and professionals in the drone ecosystem.
(b) Business Listings: DroneTV facilitates business development for verified companies and individual professionals in the drone, GIS, and AI industries by allowing them to list their products and services on the Platform. DroneTV does not provide any of the products or services listed by businesses or professionals; it only serves as a platform for business visibility and connection.
(c) The Platform is for your personal and non-commercial use only, unless otherwise agreed upon in accordance with the terms of a separate agreement. You agree that in the event you avail the Services or business listing services from a legal jurisdiction other than the territory of India, you will be deemed to have accepted DroneTV's terms and conditions applicable to that jurisdiction.
(d) DroneTV is a platform owned and operated by DroneTV Inc. and its affiliates.
(e) Communication: A key part of the Services is DroneTV's ability to send you text messages, emails, or WhatsApp messages, including in connection with your business listing, content updates, promotional and marketing strategies. You may opt out of receiving these messages by contacting DroneTV at privacy@dronetv.in or through the in-Platform settings, but please note that this may impact DroneTV's ability to provide certain services to you.

2. ACCOUNT CREATION
(a) To avail the Services, you will be required to create an account on the Platform ("Account"). For this Account, you may be required to furnish certain details, including but not limited to your name, phone number, and email address. To create an Account, you must be at least 18 years of age.
(b) You warrant that all information furnished in connection with your Account is accurate and true. You agree to promptly update your details on the Platform in the event of any change to or modification of this information.
(c) You are solely responsible for maintaining the security and confidentiality of your Account and agree to immediately notify us of any disclosure or unauthorized use of your Account or any other breach of security with respect to your Account.
(d) You are liable for all activities that take place through your Account, including activities performed by persons other than you. DroneTV shall not be liable for any unauthorized access to your Account.

3. USER CONTENT
(a) Our Platform may contain interactive features or services that allow users who have created an account with us to post, upload, publish, display, transmit, or submit comments, reviews, suggestions, feedback, ideas, or other content on or through the Platform ("User Content").
(b) You agree to provide accurate, truthful, and non-misleading reviews about other businesses or professionals, and you acknowledge that reviews may be used by DroneTV for quality control purposes.
(c) You grant DroneTV a non-exclusive, worldwide, perpetual, irrevocable, transferable, sublicensable, and royalty-free license to use, publish, display, store, host, modify, adapt, translate, and create derivative works of the User Content for the functioning of, and in connection with, the Services.

4. CONSENT TO USE DATA
(a) You agree that DroneTV may, in accordance with our Privacy Policy, collect and use your personal data. The Privacy Policy explains the categories of personal data that we collect and how we process such data.
(b) In addition to the consent you provide under the Privacy Policy, you consent to DroneTV sharing your information with our affiliates or third-party service providers.

5. BOOKINGS AND BUSINESS LISTINGS
(a) Business Listings: The Platform permits businesses and individual professionals in the drone industry to list their services. The listing process requires accurate and complete information, and DroneTV reserves the right to verify and approve all listings.
(b) Payments: For businesses listed on the Platform, DroneTV may charge service fees or commissions for facilitating business development opportunities. Payments to verified businesses will be facilitated through DroneTV, subject to the agreed terms.

6. PRICING, FEES, AND PAYMENT TERMS
(a) DroneTV reserves the right to charge you for the different services you may avail, including event participation, content creation, and premium business listings. The applicable fees and payment terms will be provided to you prior to availing the services.
(b) Payments: DroneTV uses a third-party payment processor ("Payment Processor") to facilitate transactions. Payments will be processed in accordance with the payment method selected by you, and we are not responsible for errors made by the Payment Processor.

7. CUSTOMER CONDUCT
(a) You agree to treat all individuals and businesses you interact with on the Platform with courtesy and respect. You shall not engage in discriminatory, abusive, or inappropriate conduct.
(b) You agree not to solicit businesses or professionals listed on DroneTV for services outside the Platform or engage in activities that may disrupt the functioning of the Platform.

8. THIRD PARTY SERVICES
(a) The Platform may include services or content provided by third parties ("Third Party Services"). You acknowledge that DroneTV is not responsible for the accuracy, completeness, or legality of Third Party Services.

9. DISCLAIMER OF WARRANTIES AND LIMITATION OF LIABILITY
(a) The Services are provided on an "as is" basis without warranty of any kind, express or implied. DroneTV does not guarantee the availability or reliability of the services or listings on the Platform.
(b) DroneTV is not liable for any indirect, special, or consequential damages arising out of your use of the Platform or services.

10. INDEMNITY
You agree to indemnify, defend, and hold harmless DroneTV, its affiliates, and employees from any claims or damages arising from your use of the Platform or services, or your violation of these Terms.

11. TERM AND TERMINATION
(a) These Terms shall remain in effect unless terminated in accordance with these Terms. Either party may terminate this Agreement by providing written notice.
(b) Upon termination, your access to the Platform and Services will be disabled.

12. GOVERNING LAW AND DISPUTE RESOLUTION
(a) These Terms shall be governed by and construed in accordance with the laws of India. Any disputes will be resolved through arbitration under the Arbitration and Conciliation Act, 1996, with jurisdiction in Hyderabad, Telangana.

13. MISCELLANEOUS
(a) Changes to Terms: DroneTV may modify these Terms at any time. You are responsible for reviewing the updated Terms periodically.
(b) Force Majeure: DroneTV will not be liable for any failure or delay in performance due to circumstances beyond its reasonable control.`;

  return (
    <>
      <motion.div className="fixed bottom-20 right-10 z-50">
        <motion.button
          onClick={() => setModel(true)}
          className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg flex items-center gap-2"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Upload size={18} />
          Publish Site
        </motion.button>
      </motion.div>

      {navModel && (
        <div className="">
          {navigatemodel()}
        </div>
      )}

      {/* Publish Modal */}
      <AnimatePresence>
        {model && (
          <motion.div
            className="fixed top-[8rem] right-0 bottom-0 left-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModel(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="text-indigo-600" size={24} />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Verify & Publish
                  </h3>
                </div>
                <button
                  onClick={() => setModel(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="mb-5">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg mb-4">
                  <AlertCircle size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    Please verify your Aadhaar identity before publishing. Your login credentials will be sent to your registered email once published. Please review the{" "}
                    <button
                      onClick={() => setTermsModel(true)}
                      className="text-red-800 underline font-medium hover:text-red-900 transition-colors"
                    >
                      terms and conditions
                    </button>
                    .
                  </p>
                </div>

                {/* Aadhaar Verification Section */}
                {!aadharVerified ? (
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Shield size={16} className="text-indigo-500" />
                      Aadhaar Verification Required
                    </h4>

                    <label className="flex items-start gap-2 cursor-pointer mb-3">
                      <input
                        type="checkbox"
                        checked={digiConsent}
                        onChange={(e) => setDigiConsent(e.target.checked)}
                        disabled={digiStatus === 'loading' || digiStatus === 'polling'}
                        className="mt-0.5 accent-indigo-600"
                      />
                      <span className="text-xs text-gray-600">
                        I consent to verify my Aadhaar identity via DigiLocker for publishing this listing.
                      </span>
                    </label>

                    {digiStatus === 'polling' && (
                      <div className="flex items-center gap-2 text-indigo-600 text-sm mb-3">
                        <Loader2 size={16} className="animate-spin" />
                        Waiting for DigiLocker verification...
                      </div>
                    )}

                    {digiStatus === 'error' && (
                      <p className="text-xs text-red-600 mb-3">Verification failed. Please try again.</p>
                    )}

                    <button
                      onClick={handleDigiLockerLogin}
                      disabled={!digiConsent || digiStatus === 'loading' || digiStatus === 'polling'}
                      className="w-full py-2 px-4 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {digiStatus === 'loading' ? (
                        <><Loader2 size={16} className="animate-spin" /> Starting DigiLocker...</>
                      ) : digiStatus === 'polling' ? (
                        <><Loader2 size={16} className="animate-spin" /> Verifying...</>
                      ) : (
                        <><Shield size={16} /> Verify via DigiLocker</>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle size={18} className="text-green-600" />
                    <span className="text-sm font-medium text-green-700">Aadhaar Verified Successfully</span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 justify-end">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setModel(false)}
                  className="px-4 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: aadharVerified ? 0.9 : 1 }}
                  whileHover={{ scale: aadharVerified ? 1.1 : 1 }}
                  onClick={handleConfirmPublish}
                  disabled={!aadharVerified || isPublishing}
                  className={`px-4 py-2 font-medium rounded-lg transition-colors shadow-md flex items-center gap-2 ${
                    aadharVerified && !isPublishing
                      ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isPublishing ? (
                    <><Loader2 size={16} className="animate-spin" /> Publishing...</>
                  ) : (
                    'Confirm & Publish'
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terms and Conditions Modal */}
      <AnimatePresence>
        {termsModel && (
          <motion.div
            className="fixed top-25 right-0 bottom-0 left-0 z-[60] flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTermsModel(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[75vh] overflow-hidden flex flex-col mt-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
                <h3 className="text-2xl font-bold text-gray-900">Terms and Conditions</h3>
                <button
                  onClick={() => setTermsModel(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="prose prose-lg max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed">
                    {termsContent}
                  </pre>
                </div>
              </div>
              <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setTermsModel(false)}
                  className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                  I Understand
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
