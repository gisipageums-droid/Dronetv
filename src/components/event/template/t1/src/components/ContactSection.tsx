import React, { useState } from "react";
import { Mail, Phone, MapPin, User, ExternalLink } from "lucide-react";

const contactInfo = {
  company: "Services International",
  phones: "011-45055579, +91 9354688923, +91 8882210038, +91 73883 37522",
  email: "info@droneexpo.in",
  address: "D-4 LSC, A Block, Naraina Vihar, New Delhi - 110028",
  chinaContacts: [
    {
      name: "Lydia Li",
      phone: "+86-13122908685",
      email: "lina@damuite.com",
    },
    {
      name: "Ting Ma",
      phone: "+86-17002117355",
      email: "2881778361@qq.com",
    },
  ],
  chinaAddress:
    "Shanghai Damuite Exhibition Service Co., Ltd No.1088, New Jinqiao Road, Pudong District Shanghai China",
};

const ContactSection: React.FC = () => {
  /* ORIGINAL FORM STATE — commented out as per MOU (redirect to droneexpo.in)
  const [formData, setFormData] = useState({
    companyName: "",
    fullName: "",
    mobile: "",
    email: "",
    website: "",
    enquiryType: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
  };
  */

  return (
    <section id="contact" className="py-20 bg-gray-50">
      {/* Header */}
      <div className="text-center mb-16">
        <h2
          data-aos="fade-up"
          className="text-4xl md:text-5xl font-bold text-black mb-4"
        >
          Register & <span className="text-[#FF0000]">Contact</span>
        </h2>
        <div
          data-aos="fade-up"
          data-aos-delay="200"
          className="w-24 h-1 bg-[#FFD400] mx-auto mb-6"
        ></div>
        <p
          data-aos="fade-up"
          data-aos-delay="400"
          className="text-gray-600 text-lg max-w-2xl mx-auto"
        >
          All visitor registrations and exhibitor enquiries are handled exclusively through the official Drone Expo website.
        </p>
      </div>

      {/* Content Grid */}
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16">
        {/* Left Card - Contact Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{contactInfo.company}</h2>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <Phone className="inline-block mr-2 text-blue-600" size={16} />
              {contactInfo.phones}
            </p>
            <p>
              <Mail className="inline-block mr-2 text-red-500" size={16} />
              {contactInfo.email}
            </p>
            <p>
              <MapPin className="inline-block mr-2 text-green-600" size={16} />
              {contactInfo.address}
            </p>
          </div>

          <hr className="my-6" />

          <h3 className="text-md font-semibold mb-2">For China Enquiries</h3>
          <div className="space-y-3 text-sm text-gray-700">
            {contactInfo.chinaContacts.map((c, i) => (
              <p key={i}>
                <User className="inline-block mr-2 text-purple-600" size={16} />
                {c.name} | {c.phone} | {c.email}
              </p>
            ))}
            <p>
              <MapPin className="inline-block mr-2 text-green-600" size={16} />
              {contactInfo.chinaAddress}
            </p>
          </div>
        </div>

        {/* Right Card — Redirect to Official Drone Expo Website (MOU requirement) */}
        {/* ORIGINAL FORM — commented out, redirect now active as per MOU
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
          <div>
            <label className="block mb-1 font-medium">Company Name *</label>
            <input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Full Name *</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Mobile *</label>
            <div className="flex gap-2">
              <select className="border border-gray-300 rounded-lg px-2">
                <option>India (+91)</option>
              </select>
              <input
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Email *</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Website</label>
            <input
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Enquiry Type</label>
            <select
              name="enquiryType"
              value={formData.enquiryType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Enquiry Type</option>
              <option value="general">General</option>
              <option value="product">Product</option>
              <option value="sponsorship">Sponsorship</option>
              <option value="exhibition">Exhibition</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="robotCheck" />
            <label htmlFor="robotCheck">I'm not a robot</label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#003D73] text-white font-semibold py-3 rounded-lg hover:bg-blue-900 transition-all"
          >
            Submit
          </button>
        </form>
        */}

        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-16 h-16 bg-[#FF0000]/10 rounded-full flex items-center justify-center">
            <ExternalLink size={32} className="text-[#FF0000]" />
          </div>
          <h3 className="text-2xl font-bold text-black">
            Register on the Official Drone Expo Website
          </h3>
          <p className="text-gray-600 text-base max-w-sm">
            As per the MOU, all exhibitor queries and registration forms are redirected to the official Drone Expo website. Please use the links below to register or submit your enquiry.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <a
              href="https://www.droneexpo.in/visitor-registration"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FF0000] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#cc0000] transition-all flex items-center justify-center gap-2"
            >
              Visitor Registration <ExternalLink size={16} />
            </a>
            <a
              href="https://www.droneexpo.in/exhibitor-registration"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-[#FF0000] text-[#FF0000] px-6 py-3 rounded-full font-semibold hover:bg-[#FF0000] hover:text-white transition-all flex items-center justify-center gap-2"
            >
              Exhibitor Enquiry <ExternalLink size={16} />
            </a>
          </div>

          <p className="text-sm text-gray-400">
            You will be redirected to{" "}
            <a
              href="https://www.droneexpo.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF0000] underline"
            >
              www.droneexpo.in
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
