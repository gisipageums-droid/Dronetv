import React, { useState } from "react";
import { Mail, Phone, MapPin, User, Edit2, Save, X } from "lucide-react";

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    fullName: "",
    mobile: "",
    email: "",
    website: "",
    enquiryType: "",
  });

  const [contactInfo, setContactInfo] = useState({
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
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(contactInfo);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setEditForm({ ...editForm, [field]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", formData);
  };

  const handleSaveContact = () => {
    setContactInfo(editForm);
    setIsEditing(false);
  };

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
          Ready to join us? Register now or get in touch for more information
          about the summit.
        </p>
      </div>

      {/* Content Grid */}
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16">
        {/* Left Card - Contact Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {isEditing ? (
                <input
                  className="border px-2 py-1 rounded w-full"
                  value={editForm.company}
                  onChange={(e) => handleContactChange(e, "company")}
                />
              ) : (
                contactInfo.company
              )}
            </h2>
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveContact}
                  className="p-2 bg-green-500 text-white rounded"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 bg-gray-400 text-white rounded"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditForm(contactInfo);
                }}
                className="p-2 bg-blue-500 text-white rounded"
              >
                <Edit2 size={16} />
              </button>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <Phone className="inline-block mr-2 text-blue-600" size={16} />
              {isEditing ? (
                <input
                  className="border px-2 py-1 rounded w-full"
                  value={editForm.phones}
                  onChange={(e) => handleContactChange(e, "phones")}
                />
              ) : (
                contactInfo.phones
              )}
            </p>
            <p>
              <Mail className="inline-block mr-2 text-red-500" size={16} />
              {isEditing ? (
                <input
                  className="border px-2 py-1 rounded w-full"
                  value={editForm.email}
                  onChange={(e) => handleContactChange(e, "email")}
                />
              ) : (
                contactInfo.email
              )}
            </p>
            <p>
              <MapPin className="inline-block mr-2 text-green-600" size={16} />
              {isEditing ? (
                <input
                  className="border px-2 py-1 rounded w-full"
                  value={editForm.address}
                  onChange={(e) => handleContactChange(e, "address")}
                />
              ) : (
                contactInfo.address
              )}
            </p>
          </div>

          <hr className="my-6" />

          {/* China Contacts */}
          <h3 className="text-md font-semibold mb-2">For China Enquiries</h3>
          <div className="space-y-3 text-sm text-gray-700">
            {contactInfo.chinaContacts.map((c, i) => (
              <p key={i}>
                <User
                  className="inline-block mr-2 text-purple-600"
                  size={16}
                />
                {c.name} | {c.phone} | {c.email}
              </p>
            ))}
            <p>
              <MapPin className="inline-block mr-2 text-green-600" size={16} />
              {contactInfo.chinaAddress}
            </p>
          </div>
        </div>

        {/* Right Card - Form */}
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
      </div>
    </section>
  );
};

export default ContactSection;
