import React, { useState } from 'react';
import { FormStep } from '../FormStep';
import { MultiSelect, FormInput } from '../FormInput';
import { StepProps } from '../../types/form';

// Modal Component
const TermsModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  content: string;
}> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="prose prose-slate max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700">
              {content}
            </pre>
          </div>
        </div>
        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Step7PromotionBilling: React.FC<StepProps> = ({
  formData,
  updateFormData,
  onNext,
    onSkip, // Add this line
  showSkip, // Add this line
  onPrev,
  isValid,
}) => {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const promoFormatOptions = [
    'YouTube Company Promotion (Shorts/Full)',
    'Social Shoutout',
    'Magazine Article (Premium)',
    'Website Feature (Premium)',
    'Event Coverage/Live Show (Premium)',
    'Interview (Premium)',
    'Open to all (Paid)',
  ];

  const paymentMethodOptions = ['UPI', 'Card', 'Bank Transfer'];

  const showBillingFields = formData.promoFormats.some(format => 
    format.includes('Premium') || format.includes('Paid')
  );

  // Terms and Conditions Content
  const termsContent = `Last Updated: 24th September, 2025
These terms and conditions ("Terms") govern the use of services made available on or through https://www.dronetv.in and/or the DroneTV mobile app (collectively, the "Platform", and together with the services made available on or through the Platform, the "Services"). These Terms also include our privacy policy, available at https://www.dronetv.in/privacy-policy  ("Privacy Policy"), and any guidelines, additional, or supplemental terms, policies, and disclaimers made available or issued by us from time to time ("Supplemental Terms"). The Privacy Policy and the Supplemental Terms form an integral part of these Terms. In the event of a conflict between these Terms and the Supplemental Terms with respect to applicable Services, the Supplemental Terms will prevail.
The Terms constitute a binding and enforceable legal contract between Drone Academy Pvt ltd (Drone TV) (a company incorporated under the laws of India with its registered office at 5A/6B, White Waters, Timberlake Colony, Shaikpet, Hyderabad – 500008, India) and you, a user of the Services, or any legal entity that avails Services (defined below) on behalf of end-users (“you” or “Customer”). By using the Services, you represent and warrant that you have full legal capacity and authority to agree to and bind yourself to these Terms. If you represent any other person, you confirm and represent that you have the necessary power and authority to bind such person to these Terms.
By using the Services, you agree that you have read, understood, and are bound by these Terms, as amended from time to time, and that you will comply with the requirements listed here. These Terms expressly supersede any prior written agreements with you. If you do not agree to these Terms, or comply with the requirements listed here, please do not use the Services.

1. SERVICES
(a) The Services include the provision of the Platform that enables you to access drone-related content, events, educational material, and business listings, including the ability to interact with other companies and professionals in the drone ecosystem.
(b) Business Listings: DroneTV facilitates business development for verified companies and individual professionals in the drone, GIS, and AI industries by allowing them to list their products and services on the Platform. DroneTV does not provide any of the products or services listed by businesses or professionals; it only serves as a platform for business visibility and connection.
(c) The Platform is for your personal and non-commercial use only, unless otherwise agreed upon in accordance with the terms of a separate agreement. You agree that in the event you avail the Services or business listing services from a legal jurisdiction other than the territory of India, you will be deemed to have accepted DroneTV’s terms and conditions applicable to that jurisdiction.
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

  // Privacy Policy Content
  const privacyContent = `Last Updated: 24th September, 2025
Welcome to DroneTV's privacy policy ("Privacy Policy" or "Policy").
DroneTV (hereinafter referred to as "DroneTV", "we" or "us") is dedicated to providing a platform for education, innovation, and business collaboration within the drone, GIS, and AI industries. This Policy outlines our practices in relation to the collection, storage, usage, processing, and disclosure of personal data that you have consented to share with us when you access, use, or otherwise interact with our website available at https://www.dronetv.in or mobile application "DroneTV" (collectively, the "Platform") or avail products or services that DroneTV offers you on or through the Platform (collectively, the "Services").
At DroneTV, we are committed to protecting your personal data and respecting your privacy. In order to provide you with access to the Services or Professional Services, we have to collect and otherwise process certain data about you. This Policy explains how we process and use personal data about you.
Please note that unless specifically defined in this Policy, capitalized terms shall have the same meaning ascribed to them in our Terms and Conditions, available at https://www.dronetv.in/terms ("Terms"). Please read this Policy in consonance with the Terms.
By using the Services, you confirm that you have read and agree to be bound by this Policy and consent to the processing activities described under this Policy.
Please refer to Section 1 to understand how the terms of this Policy apply to you.

1. BACKGROUND AND KEY INFORMATION
(a) How this Policy Applies:
This Policy applies to individuals who access or use the Services or otherwise avail the Professional Services. For the avoidance of doubt, references to "you" across this Policy are to an end user that uses the Platform.
By using the Platform, you consent to the collection, storage, usage, and disclosure of your personal data, as described in and collected by us in accordance with this Policy.
(b) Review and Updates:
We regularly review and update our Privacy Policy, and we request you to regularly review this Policy. It is important that the personal data we hold about you is accurate and current. Please let us know if your personal data changes during your relationship with us.
(c) Third-Party Services:
The Platform may include links to third-party websites, plug-ins, services, and applications ("Third-Party Services"). Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We neither control nor endorse these Third-Party Services and are not responsible for their privacy statements. When you leave the Platform or access third-party links through the Platform, we encourage you to read the privacy policy of such third-party service providers.

2. PERSONAL DATA THAT WE COLLECT
We collect different types of personal data about you. This includes, but is not limited to:
• Contact Data: such as your mailing or home address, location, email addresses, and mobile numbers.
• Identity and Profile Data: such as your name, username or similar identifiers, photographs, and gender.
• Marketing and Communications Data: such as your address, email address, information posted in service requests, offers, wants, feedback, comments, pictures, and discussions in our blog and chat boxes, responses to user surveys and polls, your preferences in receiving marketing communications from us and our third parties, and your communication preferences.
• Technical Data: which includes your IP address, browser type, internet service provider, details of operating system, access time, page views, device ID, device type, frequency of visiting our website and use of the Platform, website and mobile application activity, clicks, date and time stamps, location data, and other technology on the devices that you use to access the Platform.
• Transaction Data: such as details of the Services or Professional Services you have availed, a limited portion of your credit or debit card details for tracking transactions that are provided to us by payment processors, and UPI IDs for processing payments.
• Usage Data: which includes information about how you use the Services and Professional Services, your activity on the Platform, booking history, user taps and clicks, user interests, time spent on the Platform, details about user journey on the mobile application, and page views.
We also collect, use, and share aggregated data such as statistical or demographic data for any purpose. Aggregated data could be derived from your personal data but is not considered personal data under law as it does not directly or indirectly reveal your identity. However, if we combine or connect aggregated data with your personal data so that it can directly or indirectly identify you, we treat the combined data as personal data which will be used in accordance with this Policy.
(c) What Happens If I Refuse to Provide My Personal Data?
Where we need to collect personal data by law, or under the terms of a contract (such as the Terms), and you fail to provide that data when requested, we may not be able to perform the contract (for example, to provide you with the Services). In this case, we may have to cancel or limit your access to the Services.

3. HOW DO WE COLLECT PERSONAL DATA?
We use different methods to collect personal data from and about you, including through:
• Direct Interactions: You provide us your personal data when you interact with us. This includes personal data you provide when you:
  o Create an account or profile with us;
  o Use our Services or carry out other activities in connection with the Services;
  o Enter a promotion, user poll, or online surveys;
  o Request marketing communications to be sent to you;
  o Report a problem with the Platform and/or our Services, give us feedback or contact us.
• Automated Technologies or Interactions: Each time you visit the Platform or use the Services, we will automatically collect Technical Data about your equipment, browsing actions, and patterns. We collect this personal data by using cookies, web beacons, pixel tags, server logs, and other similar technologies. We may also receive Technical Data about you if you visit other websites or apps that employ our cookies.
• Third Parties or Publicly Available Sources: We will receive personal data about you from various third parties:
  o Technical data from analytics providers such as Facebook and advertising networks;
  o Identity and profile-related Data and Contact Data from service professionals, publicly available sources, etc.;
  o Personal data about you from our affiliate entities.

4. HOW DO WE USE YOUR PERSONAL DATA?
We will only use your personal data when the law allows us to. Most commonly, we will use your personal data where we need to provide you with the Services, enable you to use the Professional Services, or where we need to comply with a legal obligation. We use your personal data for the following purposes:
• To verify your identity to register you as a user and create your user account with us on the Platform;
• To provide the Services to you;
• To enable the provision of Professional Services to you;
• To monitor trends and personalize your experience;
• To improve the functionality of our Services based on the information and feedback we receive from you;
• To improve customer service to effectively respond to your Service requests and support needs;
• To track transactions and process payments;
• To send periodic notifications to manage our relationship with you, including to notify you of changes to the Services, send you information and updates pertaining to the Services you have availed, and to receive occasional company news and updates related to us or the Services;
• To assist with the facilitation of the Professional Services offered to you, including to send you information and updates about the Professional Services you have availed;
• To market and advertise the Services to you;
• To comply with legal obligations;
• To administer and protect our business and the Services, including for troubleshooting, data analysis, system testing, and performing internal operations;
• To improve our business and delivery models;
• To perform our obligations that arise out of the arrangement we are about to enter or have entered with you;
• To enforce our Terms;
• To respond to court orders, establish or exercise our legal rights, or defend ourselves against legal claims.

5. COOKIES
• What are cookies? Cookies are small files that a site or its service provider transfers to your device's hard drive through your web browser (if you permit it to) that enables the sites or service providers' systems to recognize your browser and capture and remember certain information.
• How we use cookies: We use cookies to help us distinguish you from other users of the Platform, understand and save your preferences for future visits, keep track of advertisements, and compile aggregate data about site traffic and site interaction so that we can offer you a seamless user experience.

6. DISCLOSURES OF YOUR PERSONAL DATA
We may share your personal data with third parties set out below for the purposes set out in Section 4:
• Service professionals to enable them to provide you with Professional Services;
• Internal third parties, which are other companies within the DroneTV group of companies;
• External third parties such as trusted third parties, our service providers, data analytics providers, and regulatory bodies.

7. YOUR RIGHTS IN RELATION TO YOUR PERSONAL DATA
You hereby warrant that all personal data that you provide us with is accurate, up-to-date, and true. You can access, update, or correct your personal data by contacting us at privacy@dronetv.in.

8. DELETION OF ACCOUNT AND PERSONAL DATA
You may delete your account as well as your personal data stored with DroneTV by sending an email to privacy@dronetv.in. DroneTV may take up to 7 (seven) working days to process your request. Once your account is deleted, you will lose access to all Services.

9. TRANSFERS OF YOUR PERSONAL DATA
By using our Services, you agree to the transfer, storage, and processing of your personal data in accordance with this Privacy Policy, which may involve transfer to countries other than the one you are based in.

10. DATA SECURITY
We implement appropriate security measures and privacy-protective features on our Platform to protect your personal data from unauthorized access and disclosure, and follow standards prescribed by applicable law.

11. DATA RETENTION
Your personal data will continue to be stored and retained by us for as long as necessary to fulfil the purpose(s) for which it was collected, including for legal, regulatory, and operational purposes.

12. BUSINESS TRANSITIONS
In the event of a business transition such as a merger, acquisition, or sale of assets, your personal data may be among the assets transferred.

13. USER GENERATED CONTENT
You may post content on our Platform, including feedback, reviews, and images. Please note that such content will be available to all visitors to our Platform, and we disclaim liability for any misuse of such content.

14. UPDATES TO THIS POLICY
We may update this Privacy Policy from time to time. Any changes will be posted on the Platform, and you will be deemed to have accepted such changes by continuing to use the Services.

15. CONTACT DETAILS
For any questions or concerns regarding this Privacy Policy or the way your personal data is processed, please contact us at:
Email: privacy@dronetv.in`;

  return (
    <>
      <FormStep
        title="Promotion Preferences & Billing"
        description="Select your preferred promotion formats and provide billing information if needed."
        onNext={onNext}
        onPrev={onPrev}
        isValid={isValid}
        currentStep={5}
         onSkip={onSkip}
  showSkip={showSkip}
        totalSteps={6}
      >
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-orange-900 mb-4">Promotion Preferences</h3>
            <MultiSelect
              label="Select Promotion Formats"
              options={promoFormatOptions}
              selected={formData.promoFormats}
              onChange={(selected) => updateFormData({ promoFormats: selected })}
            />
            
            {formData.promoFormats.length > 0 && (
              <div className="mt-4 p-4 bg-orange-100 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">Selected Formats:</h4>
                <ul className="space-y-1">
                  {formData.promoFormats.map((format) => (
                    <li key={format} className="flex items-center text-orange-800">
                      <span className="w-2 h-2 bg-orange-600 rounded-full mr-3"></span>
                      {format}
                      {(format.includes('Premium') || format.includes('Paid')) && (
                        <span className="ml-2 px-2 py-1 bg-orange-200 text-orange-800 text-xs rounded-full">
                          Paid Service
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-slate-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Terms & Conditions</h3>
            
            <div className="space-y-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => updateFormData({ acceptTerms: e.target.checked })}
                  className="mt-1 mr-3 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-slate-700">
                  <span className="font-semibold">I accept the </span>
                  <button
                    type="button"
                    onClick={() => setIsTermsModalOpen(true)}
                    className="text-blue-600 underline hover:text-blue-800 font-semibold"
                  >
                    Terms & Conditions
                  </button>
                  <span className="text-red-500 ml-1">*</span>
                  <br />
                  <span className="text-sm text-slate-600">
                    I agree to the terms of service, data processing, and promotional activities as outlined in the DroneTV platform agreement.
                  </span>
                </span>
              </label>
              
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.acceptPrivacy}
                  onChange={(e) => updateFormData({ acceptPrivacy: e.target.checked })}
                  className="mt-1 mr-3 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-slate-700">
                  <span className="font-semibold">I accept the </span>
                  <button
                    type="button"
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="text-blue-600 underline hover:text-blue-800 font-semibold"
                  >
                    Privacy Policy
                  </button>
                  <span className="text-red-500 ml-1">*</span>
                  <br />
                  <span className="text-sm text-slate-600">
                    I understand how my data will be collected, processed, and used for website generation and promotional purposes.
                  </span>
                </span>
              </label>
            </div>
            
            {(!formData.acceptTerms || !formData.acceptPrivacy) && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  Please accept both Terms & Conditions and Privacy Policy to continue.
                </p>
              </div>
            )}
          </div>
        </div>
      </FormStep>

      {/* Terms & Conditions Modal */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        title="Terms & Conditions"
        content={termsContent}
      />

      {/* Privacy Policy Modal */}
      <TermsModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        title="Privacy Policy"
        content={privacyContent}
      />
    </>
  );
};

export default Step7PromotionBilling;