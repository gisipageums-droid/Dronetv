import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

export default function Contact({ onStateChange }) {
  const [isEditing, setIsEditing] = useState(false);

  // Merged all state into a single object
  const [contactSection, setContactSection] = useState({
    header: {
      title: "Get In Touch",
      descriptionPart1:
        "Ready to transform your business? Let's start a conversation about how we can help you achieve your goals with our",
      descriptionPart2: "expert solutions",
      descriptionPart3: ".",
    },
    contactInfo: [],
    cta: {
      title: "Ready to Get Started?",
      description:
        "Schedule a free consultation to discuss your business needs",
    },
  });
  // Add this useEffect to notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(contactSection);
    }
  }, [contactSection, onStateChange]);
  // Handlers for contact info
  const updateContactInfo = (idx, field, value) => {
    setContactSection((prev) => ({
      ...prev,
      contactInfo: prev.contactInfo.map((c, i) =>
        i === idx ? { ...c, [field]: value } : c
      ),
    }));
  };

  const removeContactInfo = (idx) => {
    setContactSection((prev) => ({
      ...prev,
      contactInfo: prev.contactInfo.filter((_, i) => i !== idx),
    }));
  };

  const addContactInfo = () => {
    setContactSection((prev) => ({
      ...prev,
      contactInfo: [
        ...prev.contactInfo,
        {
          title: "New Info",
          primary: "Primary info",
          secondary: "Secondary info",
          color: "red-accent",
        },
      ],
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
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
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Edit/Save Buttons */}
        <div className="flex justify-end mt-6">
          {isEditing ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -1, scaleX: 1.1 }}
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-white bg-green-600 rounded shadow-xl cursor-pointer hover:font-semibold hover:shadow-2xl"
            >
              Save
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -1, scaleX: 1.1 }}
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-black bg-yellow-500 rounded shadow-xl cursor-pointer hover:shadow-2xl hover:font-semibold"
            >
              Edit
            </motion.button>
          )}
        </div>

        {/* Header */}
        <motion.div
          className="max-w-3xl mx-auto mb-16 text-center"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            {isEditing ? (
              <div className="relative">
                <input
                  value={contactSection.header.title}
                  onChange={(e) =>
                    setContactSection((prev) => ({
                      ...prev,
                      header: { ...prev.header, title: e.target.value },
                    }))
                  }
                  maxLength={80}
                  className={`w-full mb-4 text-3xl font-bold text-center bg-transparent border-b md:text-4xl text-foreground ${
                    contactSection.header.title.length >= 80
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {contactSection.header.title.length}/80
                  {contactSection.header.title.length >= 80 && (
                    <span className="ml-2 text-red-500 font-bold">
                      Limit reached!
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <h2 className="mb-4 text-3xl md:text-4xl text-foreground">
                {contactSection.header.title}
              </h2>
            )}
          </motion.div>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {isEditing ? (
              <div className="flex flex-col items-center">
                <div className="relative w-full mb-2">
                  <input
                    value={contactSection.header.descriptionPart1}
                    onChange={(e) =>
                      setContactSection((prev) => ({
                        ...prev,
                        header: {
                          ...prev.header,
                          descriptionPart1: e.target.value,
                        },
                      }))
                    }
                    maxLength={100}
                    className={`w-full mb-2 text-lg text-center bg-transparent border-b text-muted-foreground ${
                      contactSection.header.descriptionPart1.length >= 100
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {contactSection.header.descriptionPart1.length}/100
                    {contactSection.header.descriptionPart1.length >= 100 && (
                      <span className="ml-2 text-red-500 font-bold">
                        Limit reached!
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative w-full mb-2">
                  <input
                    value={contactSection.header.descriptionPart2}
                    onChange={(e) =>
                      setContactSection((prev) => ({
                        ...prev,
                        header: {
                          ...prev.header,
                          descriptionPart2: e.target.value,
                        },
                      }))
                    }
                    maxLength={30}
                    className={`w-full mb-2 text-lg font-semibold text-center bg-transparent border-b text-red-accent ${
                      contactSection.header.descriptionPart2.length >= 30
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {contactSection.header.descriptionPart2.length}/30
                    {contactSection.header.descriptionPart2.length >= 30 && (
                      <span className="ml-2 text-red-500 font-bold">
                        Limit reached!
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative w-full">
                  <input
                    value={contactSection.header.descriptionPart3}
                    onChange={(e) =>
                      setContactSection((prev) => ({
                        ...prev,
                        header: {
                          ...prev.header,
                          descriptionPart3: e.target.value,
                        },
                      }))
                    }
                    maxLength={10}
                    className={`w-full text-lg text-center bg-transparent border-b text-muted-foreground ${
                      contactSection.header.descriptionPart3.length >= 10
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {contactSection.header.descriptionPart3.length}/10
                    {contactSection.header.descriptionPart3.length >= 10 && (
                      <span className="ml-2 text-red-500 font-bold">
                        Limit reached!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="inline text-lg text-muted-foreground">
                  {contactSection.header.descriptionPart1}
                </p>
                <motion.span
                  className="font-semibold text-red-accent"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-lg font-semibold text-red-accent">
                    {contactSection.header.descriptionPart2}
                  </span>
                </motion.span>
                <span className="text-lg text-muted-foreground">
                  {contactSection.header.descriptionPart3}
                </span>
              </>
            )}
          </motion.div>
        </motion.div>

        <div className="max-w-[700px] mx-auto">
          {/* Contact Form - Keeping this static as requested */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="relative overflow-hidden bg-card border-border hover-lift">
              <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-accent to-primary"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 1 }}
              />

              <CardHeader>
                <CardTitle className="text-card-foreground">
                  <span className="text-card-foreground">
                    Send us a message
                  </span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  We'll get back to you within 24 hours during business days.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div
                  className="grid grid-cols-2 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="firstName">
                      <span className="text-sm font-medium text-card-foreground">
                        First Name
                      </span>
                    </Label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        id="firstName"
                        placeholder="Rahul"
                        className="transition-all duration-300 border-border focus:border-primary bg-input-background"
                      />
                    </motion.div>
                  </motion.div>
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="lastName">
                      <span className="text-sm font-medium text-card-foreground">
                        Last Name
                      </span>
                    </Label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        id="lastName"
                        placeholder="sharma"
                        className="transition-all duration-300 border-border focus:border-primary bg-input-background"
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="space-y-2"
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Label htmlFor="email">
                    <span className="text-sm font-medium text-card-foreground">
                      Email
                    </span>
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      id="email"
                      type="email"
                      placeholder="rahul.sharma@example.com"
                      className="transition-all duration-300 border-border focus:border-primary bg-input-background"
                    />
                  </motion.div>
                </motion.div>
                <motion.div
                  className="space-y-2"
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Label htmlFor="company">
                    <span className="text-sm font-medium text-card-foreground">
                      Phone Number
                    </span>
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      type="number"
                      id="phone"
                      placeholder="Your Phone Number"
                      className="border-border focus:border-primary transition-all duration-300 bg-input-background [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  className="space-y-2"
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Label htmlFor="company">
                    <span className="text-sm font-medium text-card-foreground">
                      Company
                    </span>
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      id="company"
                      placeholder="Your Company"
                      className="transition-all duration-300 border-border focus:border-primary bg-input-background"
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  className="space-y-2"
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Label htmlFor="subject">
                    <span className="text-sm font-medium text-card-foreground">
                      Subject
                    </span>
                  </Label>
                  <select className="w-full border-[1px] rounded-[5px] py-1 px-2 focus:border-primary transition-all duration-300 ">
                    <option>General Inquiry</option>
                    <option>Sales Inquiry</option>
                    <option>Products Inquiry</option>
                    <option>Services Inquiry</option>
                    <option>Support Inquiry</option>
                  </select>
                </motion.div>

                <motion.div
                  className="space-y-2"
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Label htmlFor="message">
                    <span className="text-sm font-medium text-card-foreground">
                      Message
                    </span>
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Textarea
                      id="message"
                      placeholder="Tell us about your project and how we can help..."
                      className="min-h-[120px] border-border focus:border-primary transition-all duration-300 bg-input-background"
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className="w-full transition-all duration-300 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-xl">
                    <motion.span
                      animate={{ opacity: [1, 0.8, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-sm font-medium text-primary-foreground">
                        Send Message
                      </span>
                    </motion.span>
                  </Button>
                </motion.div>

                <motion.div
                  className="text-center"
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <p className="text-sm text-muted-foreground">
                    We typically respond within 24 hours during business days.
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
        </div>
      </div>
    </motion.section>
  );
}
