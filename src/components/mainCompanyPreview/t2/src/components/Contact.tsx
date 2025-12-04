import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { motion } from "motion/react";
import { toast } from "react-toastify";

export default function Contact({ contactData, publishedId }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    subject: "General Inquiry",
    message: "",
    category: "Enterprise", // ✅ required field
  });

  const [loading, setLoading] = useState(false);

  // 🔹 constant publishedId (required by API)
  // const publishedId = "pub-nh7sa9cbqvq";

  const subjectOptions = [
    "General Inquiry",
    "Sales Inquiry",
    "Products Inquiry",
    "Services Inquiry",
    "Support Inquiry",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // ✅ Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.message) {
      alert("Please fill in required fields: Email and Message.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://gzl99ryxne.execute-api.ap-south-1.amazonaws.com/Prod/leads-resource/submit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publishedId, ...formData }),
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        // alert("✅ Message sent successfully!");
        toast.success(" Your message sent successfully!");
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
        console.error(data);
        // alert(`❌ Failed: ${data.message || "Unknown error"}`);
        toast.error("❌ Failed to send message: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      // alert("⚠️ Network error. Please check your connection.");
      toast.error("❌ Something went wrong while sending your message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      id="contact"
      className="py-5 bg-secondary theme-transition"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl text-foreground mb-4 text-center">
            {contactData.header.title}
          </h2>
          <p className="text-lg text-muted-foreground text-center">
            {contactData.header.descriptionPart1}
            <span className="text-red-accent font-semibold mx-1">
              {contactData.header.descriptionPart2}
            </span>
            {contactData.header.descriptionPart3}
          </p>
        </motion.div>

        <div className="max-w-[700px] mx-auto">
          {/*  Contact Form with API integration */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-card border-border relative overflow-hidden hover-lift">
              <CardHeader>
                <CardTitle className="text-card-foreground text-justify">
                  Send us a message
                </CardTitle>
                <p className="text-sm text-muted-foreground text-justify">
                  We'll get back to you within 24 hours during business days.
                </p>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  {/* Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-justify">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="Rahul"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="border-border focus:border-primary bg-input-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-justify">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Sharma"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="border-border focus:border-primary bg-input-background"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-justify">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="rahul.sharma@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border-border focus:border-primary bg-input-background"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-justify">Phone Number</Label>
                    <Input
                      id="phone"
                      type="text"
                      placeholder="Your Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="border-border focus:border-primary bg-input-background"
                    />
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-justify">Company</Label>
                    <Input
                      id="company"
                      placeholder="Your Company"
                      value={formData.company}
                      onChange={handleChange}
                      className="border-border focus:border-primary bg-input-background"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-justify">Subject</Label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full border-[1px] rounded-[5px] py-1 px-2 focus:border-primary transition-all duration-300 text-black text-justify"
                    >
                      {subjectOptions.map((option, index) => (
                        <option key={index} value={option} className="text-justify">
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-justify">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your project and how we can help..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="min-h-[120px] border-border focus:border-primary bg-input-background text-justify"
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 text-justify"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </Button>

                  <p className=" text-sm text-muted-foreground text-justify">
                    We typically respond within 24 hours during business days.
                  </p>
                </CardContent>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}