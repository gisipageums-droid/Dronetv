import React, { useState } from "react";

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    companyName: "",
    designation: "",
    country: "",
    website: "",
    enquiryType: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
          Register & <span className="text-[#FF0000]">Contact</span>
        </h2>

        <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-6"></div>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Ready to participate? Fill the form below & our team will contact you shortly.
        </p>
      </div>

      {/* Contact Form */}
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Full Name */}
          <div>
            <label className="block mb-1 font-semibold">Full Name *</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold">Email *</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block mb-1 font-semibold">Mobile *</label>
            <div className="flex gap-2">
              <select className="border border-gray-300 rounded-lg px-3">
                <option>+91</option>
              </select>

              <input
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                placeholder="9876543210"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block mb-1 font-semibold">Company Name *</label>
            <input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="Your company name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block mb-1 font-semibold">Designation *</label>
            <input
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
              placeholder="Your role / title"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block mb-1 font-semibold">Country *</label>
            <input
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              placeholder="Enter your country"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block mb-1 font-semibold">Website</label>
            <input
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://yourcompany.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          {/* Enquiry Type */}
          <div>
            <label className="block mb-1 font-semibold">Enquiry Type *</label>
            <select
              name="enquiryType"
              value={formData.enquiryType}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            >
              <option value="">Select Option</option>
              <option value="general">General</option>
              <option value="delegate">Delegate Registration</option>
              <option value="sponsorship">Sponsorship</option>
              <option value="exhibition">Exhibition</option>
            </select>
          </div>

          {/* Message */}
          <div className="col-span-1 md:col-span-2">
            <label className="block mb-1 font-semibold">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32"
            />
          </div>

          {/* Submit */}
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full bg-[#003D73] text-white font-bold py-3 rounded-lg hover:bg-blue-900 transition-all"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
