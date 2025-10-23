// import { motion } from "motion/react";
// import { Input } from "../components/ui/input";
// import { Button } from "../components/ui/button";
// import { Textarea } from "../components/ui/textarea";

// export default function Contact({ content }) {
//   const contactData = content;

//   return (
//     <section
//       id="contact"
//       className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-500 scroll-mt-20"
//     >
//       <div className="max-w-6xl mx-auto px-6">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
//             {contactData?.title || "Get In Touch"}
//           </h2>
//           <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
//             {contactData?.description ||
//               "Ready to transform your business? Let's start a conversation about how we can help you achieve your goals with our expert solutions."}
//           </p>
//         </div>

//         {/* Main Card */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left: Contact Form */}
//           <motion.div
//             initial={{ opacity: 0, x: -30 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//             className="col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 lg:p-10"
//           >
//             <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//               Send us a message 
//             </h3>
//             <p className="text-gray-500 dark:text-gray-300 mb-6 text-sm">
//               We'll get back to you within 24 hours during business days.
//             </p>

//             <form className="space-y-6">
//               {/* First & Last Name */}
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                     First Name
//                   </label>
//                   <Input placeholder="John" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                     Last Name
//                   </label>
//                   <Input placeholder="Doe" />
//                 </div>
//               </div>

//               {/* Email & Company */}
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                     Email
//                   </label>
//                   <Input type="email" placeholder="john@company.com" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                     Company
//                   </label>
//                   <Input placeholder="Your Company" />
//                 </div>
//               </div>

//               {/* Subject */}
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                   Subject
//                 </label>
//                 <select className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-400 transition-all duration-200">
//                   <option>General Inquiry</option>
//                   <option>Support</option>
//                   <option>Partnership</option>
//                   <option>Other</option>
//                 </select>
//               </div>

//               {/* Message */}
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                   Message
//                 </label>
//                 <Textarea
//                   rows={4}
//                   placeholder="Tell us about your project and how we can help..."
//                   className="resize-none bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
//                 />
//               </div>

//               {/* Send Message Button */}
//               <Button className="w-full bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white font-semibold py-4 transition-colors duration-300 text-lg">
//                 {contactData?.ctaButton || "Send Message"}
//               </Button>
//             </form>
//           </motion.div>

//           {/* Right: Info Panel */}
//           <motion.div
//             initial={{ opacity: 0, x: 30 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//             className="space-y-6"
//           >
//             {/* Business Hours Card */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
//               <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
//                 Business Hours
//               </h4>
//               <ul className="text-gray-600 dark:text-gray-300 space-y-1 text-sm">
//                 <li>Mon - Fri: 9:00 AM - 6:00 PM EST</li>
//                 <li>Sat: 10:00 AM - 2:00 PM EST</li>
//                 <li>Closed on Sundays</li>
//               </ul>
//             </div>

//             {/* Consultation Card */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 text-center">
//               <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//                 Ready to Get Started?
//               </h4>
//               <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
//                 Schedule a free consultation to discuss your business needs
//               </p>
//               <Button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-semibold transition-colors duration-300">
//                 Book Free Consultation
//               </Button>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }




import { useState } from "react";
import { motion } from "motion/react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { toast } from "react-toastify";

export default function Contact({ content }) {
  const contactData = content;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    subject: "General Inquiry",
    message: "",
    category: "Enterprise",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      publishedId: "pub-nh7sa9cbqvq",
      ...formData,
    };

    try {
      const response = await fetch(
        "https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/leads-resource/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        // alert("✅ Message sent successfully!");
        toast.success("✅ Message sent successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          subject: "General Inquiry",
          message: "",
          category: "Enterprise",
        });
      } else {
        const err = await response.json();
        // alert("❌ Failed to send message: " + (err.message || "Unknown error"));
         toast.error("❌ Failed to send message: " + (err.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error:", error);
      // alert("❌ Something went wrong while sending your message.");
       toast.error("❌ Something went wrong while sending your message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-500 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {contactData?.title || "Get In Touch"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            {contactData?.description ||
              "Ready to transform your business? Let's start a conversation about how we can help you achieve your goals with our expert solutions."}
          </p>
        </div>

        {/* Main Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 lg:p-10"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Send us a message
            </h3>
            <p className="text-gray-500 dark:text-gray-300 mb-6 text-sm">
              We'll get back to you within 24 hours during business days.
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* First & Last Name */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    First Name
                  </label>
                  <Input
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Last Name
                  </label>
                  <Input
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email & Company */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Company
                  </label>
                  <Input
                    name="company"
                    placeholder="Your Company"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Phone
                </label>
                <Input
                  name="phone"
                  placeholder="+1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
                >
                  <option>General Inquiry</option>
                  <option>Support</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Message
                </label>
                <Textarea
                  name="message"
                  rows={4}
                  placeholder="Tell us about your project and how we can help..."
                  className="resize-none bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Send Message Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white font-semibold py-4 transition-colors duration-300 text-lg"
              >
                {loading ? "Sending..." : contactData?.ctaButton || "Send Message"}
              </Button>
            </form>
          </motion.div>

          {/* Right: Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Business Hours Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Business Hours
              </h4>
              <ul className="text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                <li>Mon - Fri: 9:00 AM - 6:00 PM EST</li>
                <li>Sat: 10:00 AM - 2:00 PM EST</li>
                <li>Closed on Sundays</li>
              </ul>
            </div>

            {/* Consultation Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 text-center">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Ready to Get Started?
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Schedule a free consultation to discuss your business needs
              </p>
              <Button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-semibold transition-colors duration-300">
                Book Free Consultation
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
