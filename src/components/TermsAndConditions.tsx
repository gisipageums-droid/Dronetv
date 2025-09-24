import React from 'react';

const terms = [
  {
    title: '1. SERVICES',
    content: [
      '(a) The Services include the provision of the Platform that enables you to access drone-related content, events, educational material, and business listings, including the ability to interact with other companies and professionals in the drone ecosystem.',
      '(b) Business Listings: DroneTV facilitates business development for verified companies and individual professionals in the drone, GIS, and AI industries by allowing them to list their products and services on the Platform. DroneTV does not provide any of the products or services listed by businesses or professionals; it only serves as a platform for business visibility and connection.',
      '(c) The Platform is for your personal and non-commercial use only, unless otherwise agreed upon in accordance with the terms of a separate agreement. You agree that in the event you avail the Services or business listing services from a legal jurisdiction other than the territory of India, you will be deemed to have accepted DroneTV’s terms and conditions applicable to that jurisdiction.',
      '(d) DroneTV is a platform owned and operated by DroneTV Inc. and its affiliates.',
      '(e) Communication: A key part of the Services is DroneTV’s ability to send you text messages, emails, or WhatsApp messages, including in connection with your business listing, content updates, promotional and marketing strategies. You may opt out of receiving these messages by contacting DroneTV at privacy@dronetv.in or through the in-Platform settings, but please note that this may impact DroneTV’s ability to provide certain services to you.'
    ]
  },
  {
    title: '2. ACCOUNT CREATION',
    content: [
      '(a) To avail the Services, you will be required to create an account on the Platform ("Account"). For this Account, you may be required to furnish certain details, including but not limited to your name, phone number, and email address. To create an Account, you must be at least 18 years of age.',
      '(b) You warrant that all information furnished in connection with your Account is accurate and true. You agree to promptly update your details on the Platform in the event of any change to or modification of this information.',
      '(c) You are solely responsible for maintaining the security and confidentiality of your Account and agree to immediately notify us of any disclosure or unauthorized use of your Account or any other breach of security with respect to your Account.',
      '(d) You are liable for all activities that take place through your Account, including activities performed by persons other than you. DroneTV shall not be liable for any unauthorized access to your Account.'
    ]
  },
  {
    title: '3. USER CONTENT',
    content: [
      '(a) Our Platform may contain interactive features or services that allow users who have created an account with us to post, upload, publish, display, transmit, or submit comments, reviews, suggestions, feedback, ideas, or other content on or through the Platform (“User Content”).',
      '(b) You agree to provide accurate, truthful, and non-misleading reviews about other businesses or professionals, and you acknowledge that reviews may be used by DroneTV for quality control purposes.',
      '(c) You grant DroneTV a non-exclusive, worldwide, perpetual, irrevocable, transferable, sublicensable, and royalty-free license to use, publish, display, store, host, modify, adapt, translate, and create derivative works of the User Content for the functioning of, and in connection with, the Services.'
    ]
  },
  {
    title: '4. CONSENT TO USE DATA',
    content: [
      '(a) You agree that DroneTV may, in accordance with our Privacy Policy, collect and use your personal data. The Privacy Policy explains the categories of personal data that we collect and how we process such data.',
      '(b) In addition to the consent you provide under the Privacy Policy, you consent to DroneTV sharing your information with our affiliates or third-party service providers.'
    ]
  },
  {
    title: '5. BOOKINGS AND BUSINESS LISTINGS',
    content: [
      '(a) Business Listings: The Platform permits businesses and individual professionals in the drone industry to list their services. The listing process requires accurate and complete information, and DroneTV reserves the right to verify and approve all listings.',
      '(b) Payments: For businesses listed on the Platform, DroneTV may charge service fees or commissions for facilitating business development opportunities. Payments to verified businesses will be facilitated through DroneTV, subject to the agreed terms.'
    ]
  },
  {
    title: '6. PRICING, FEES, AND PAYMENT TERMS',
    content: [
      '(a) DroneTV reserves the right to charge you for the different services you may avail, including event participation, content creation, and premium business listings. The applicable fees and payment terms will be provided to you prior to availing the services.',
      '(b) Payments: DroneTV uses a third-party payment processor (“Payment Processor”) to facilitate transactions. Payments will be processed in accordance with the payment method selected by you, and we are not responsible for errors made by the Payment Processor.'
    ]
  },
  {
    title: '7. CUSTOMER CONDUCT',
    content: [
      '(a) You agree to treat all individuals and businesses you interact with on the Platform with courtesy and respect. You shall not engage in discriminatory, abusive, or inappropriate conduct.',
      '(b) You agree not to solicit businesses or professionals listed on DroneTV for services outside the Platform or engage in activities that may disrupt the functioning of the Platform.'
    ]
  },
  {
    title: '8. THIRD PARTY SERVICES',
    content: [
      '(a) The Platform may include services or content provided by third parties (“Third Party Services”). You acknowledge that DroneTV is not responsible for the accuracy, completeness, or legality of Third Party Services.'
    ]
  },
  {
    title: '9. DISCLAIMER OF WARRANTIES AND LIMITATION OF LIABILITY',
    content: [
      '(a) The Services are provided on an “as is” basis without warranty of any kind, express or implied. DroneTV does not guarantee the availability or reliability of the services or listings on the Platform.',
      '(b) DroneTV is not liable for any indirect, special, or consequential damages arising out of your use of the Platform or services.'
    ]
  },
  {
    title: '10. INDEMNITY',
    content: [
      'You agree to indemnify, defend, and hold harmless DroneTV, its affiliates, and employees from any claims or damages arising from your use of the Platform or services, or your violation of these Terms.'
    ]
  },
  {
    title: '11. TERM AND TERMINATION',
    content: [
      '(a) These Terms shall remain in effect unless terminated in accordance with these Terms. Either party may terminate this Agreement by providing written notice.',
      '(b) Upon termination, your access to the Platform and Services will be disabled.'
    ]
  },
  {
    title: '12. GOVERNING LAW AND DISPUTE RESOLUTION',
    content: [
      '(a) These Terms shall be governed by and construed in accordance with the laws of India. Any disputes will be resolved through arbitration under the Arbitration and Conciliation Act, 1996, with jurisdiction in Hyderabad, Telangana.'
    ]
  },
  {
    title: '13. MISCELLANEOUS',
    content: [
      '(a) Changes to Terms: DroneTV may modify these Terms at any time. You are responsible for reviewing the updated Terms periodically.',
      '(b) Force Majeure: DroneTV will not be liable for any failure or delay in performance due to circumstances beyond its reasonable control.'
    ]
  }
];


const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-yellow-50 pt-16 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-black mb-2 tracking-tight">Terms and Conditions</h1>
          <div className="text-lg text-gray-700 mb-2">Last Updated: 24th September, 2025</div>
          <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 mb-4">
            These terms and conditions ("Terms") govern the use of services made available on or through
            <a href="https://www.dronetv.in" className="text-yellow-700 font-bold" target="_blank" rel="noopener noreferrer"> dronetv.in</a>
            and/or the DroneTV mobile app (collectively, the "Platform"). These Terms also include our
            <a href="https://www.dronetv.in/privacy-policy" className="text-yellow-700 font-bold" target="_blank" rel="noopener noreferrer"> Privacy Policy</a>
            and any guidelines, additional, or supplemental terms, policies, and disclaimers made available or issued by us from time to time.
          </p>
        </div>
        <div className="space-y-8">
          {terms.map((section, idx) => (
            <div key={idx} className="bg-yellow-100 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-yellow-800 mb-4">{section.title}</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                {section.content.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
