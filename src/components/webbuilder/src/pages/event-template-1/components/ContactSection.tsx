import React, { useState } from 'react';
import { Mail, Phone, MapPin, User } from 'lucide-react';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    fullName: '',
    mobile: '',
    email: '',
    website: '',
    enquiryType: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted:', formData);
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-black mb-4">
            Register & <span className="text-[#FF0000]">Contact</span>
          </h2>
          <div data-aos="fade-up" data-aos-delay="200" className="w-24 h-1 bg-[#FFD400] mx-auto mb-6"></div>
          <p data-aos="fade-up" data-aos-delay="400" className="text-gray-600 text-lg max-w-2xl mx-auto">
            Ready to join us? Register now or get in touch for more information about the summit.
          </p>
        </div>
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16">
        {/* Left Card - Contact Info */}
        
        <div className="bg-white rounded-2xl shadow-lg p-6">
        
          <h2 className="text-2xl font-bold mb-4">Services International</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p><Phone className="inline-block mr-2" size={16} />011-45055579, +91 9354688923, +91 8882210038, +91 73883 37522</p>
            <p><Mail className="inline-block mr-2" size={16} />info@droneexpo.in</p>
            <p><MapPin className="inline-block mr-2" size={16} />D-4 LSC, A Block, Naraina Vihar, New Delhi - 110028</p>
          </div>

          <hr className="my-4" />

          <h3 className="text-md font-semibold mb-2">For China Enquiries</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p><User className="inline-block mr-2" size={16} />Lydia Li | +86-13122908685 | lina@damuite.com</p>
            <p><User className="inline-block mr-2" size={16} />Ting Ma | +86-17002117355 | 2881778361@qq.com</p>
            <p><MapPin className="inline-block mr-2" size={16} />Shanghai Damuite Exhibition Service Co., Ltd No.1088, New Jinqiao Road, Pudong District Shanghai China</p>
          </div>
        </div>

        {/* Right Card - Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Company Name *</label>
            <input name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full border border-gray-300 rounded px-4 py-2" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Full Name *</label>
            <input name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full border border-gray-300 rounded px-4 py-2" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Mobile *</label>
            <div className="flex gap-2">
              <select className="border border-gray-300 rounded px-2">
                <option>India (+91)</option>
              </select>
              <input name="mobile" value={formData.mobile} onChange={handleChange} required className="flex-1 border border-gray-300 rounded px-4 py-2" />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Email *</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full border border-gray-300 rounded px-4 py-2" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Website</label>
            <input name="website" value={formData.website} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Enquiry Type</label>
            <select name="enquiryType" value={formData.enquiryType} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2">
              <option value="">Select Enquiry Type</option>
              <option value="general">General</option>
              <option value="product">Product</option>
              <option value="sponsorship">Sponsorship</option>
              <option value="exhibition">Exhibition</option>
            </select>
          </div>

          <div>
            <div className="border border-gray-300 rounded px-4 py-2">
              <input type="checkbox" /> I'm not a robot
            </div>
          </div>

          <button type="submit" className="w-full bg-[#003D73] text-white font-semibold py-3 rounded hover:bg-blue-900 transition-all">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
