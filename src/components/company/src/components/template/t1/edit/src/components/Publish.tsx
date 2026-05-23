import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, X, Upload, AlertCircle, Loader2 } from "lucide-react";
import { useTemplate } from "../../../../../../../../context/context";
import axios from "axios";
import { toast } from "react-toastify";

export default function Publish() {
  const [model, setModel] = useState(false);
  const [termsModel, setTermsModel] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const { publishTemplate, navigatemodel, navModel, draftDetails, AIGenData } = useTemplate();

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const email =
        draftDetails?.directorEmail ||
        draftDetails?.userId ||
        draftDetails?.formData?.directorEmail ||
        AIGenData?.content?.company?.email ||
        AIGenData?.content?.contact?.email ||
        '';
      if (email) {
        const rand = () => Math.random().toString(36).slice(2);
        const password = rand().slice(0, 6) + rand().slice(0, 4).toUpperCase() + '@1';
        const companyName =
          AIGenData?.content?.company?.name ||
          draftDetails?.formData?.companyName ||
          draftDetails?.companyName ||
          '';
        try {
          await axios.post('https://rnpcnionle.execute-api.ap-south-1.amazonaws.com/user_register_post', {
            email,
            password,
            fullName:
              draftDetails?.formData?.directorName ||
              draftDetails?.directorName ||
              companyName,
            companyName,
          });
        } catch { /* user may already exist */ }
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

3. USER CONTENT
(a) You grant DroneTV a non-exclusive, worldwide, perpetual, irrevocable, transferable, sublicensable, and royalty-free license to use, publish, display, store, host, modify, adapt, translate, and create derivative works of the User Content for the functioning of, and in connection with, the Services.

4. CONSENT TO USE DATA
(a) You agree that DroneTV may, in accordance with our Privacy Policy, collect and use your personal data.

5. GOVERNING LAW
These Terms shall be governed by the laws of India. Disputes resolved through arbitration in Hyderabad, Telangana.`;

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
          Submit Listing
        </motion.button>
      </motion.div>

      {navModel && <div>{navigatemodel()}</div>}

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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-indigo-600" size={24} />
                  <h3 className="text-xl font-semibold text-gray-900">Submit Your Listing</h3>
                </div>
                <button onClick={() => setModel(false)} className="p-1 rounded-full hover:bg-gray-100">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg mb-5">
                <AlertCircle size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  Your website preview is ready. Submit to save your listing and receive login credentials on your registered email. You can <strong>publish it live</strong> from your dashboard after Aadhaar verification. Review our{" "}
                  <button onClick={() => setTermsModel(true)} className="text-red-800 underline font-medium hover:text-red-900">
                    terms and conditions
                  </button>{" "}
                  before proceeding.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setModel(false)}
                  className="px-4 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className={`px-4 py-2 font-medium rounded-lg transition-colors shadow-md flex items-center gap-2 ${
                    isPublishing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                  }`}
                >
                  {isPublishing ? (
                    <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                  ) : (
                    'Confirm & Submit'
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terms Modal */}
      <AnimatePresence>
        {termsModel && (
          <motion.div
            className="fixed top-25 right-0 bottom-0 left-0 z-[60] flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setTermsModel(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[75vh] overflow-hidden flex flex-col mt-4"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h3 className="text-2xl font-bold text-gray-900">Terms and Conditions</h3>
                <button onClick={() => setTermsModel(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <X size={24} className="text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed">{termsContent}</pre>
              </div>
              <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setTermsModel(false)}
                  className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
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
