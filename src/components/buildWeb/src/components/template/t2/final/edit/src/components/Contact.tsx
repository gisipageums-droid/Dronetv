import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

export default function Contact({ onStateChange, contactData }) {
  const [isEditing, setIsEditing] = useState(false);

  // Static options for the subject dropdown
  const subjectOptions = [
    "General Inquiry",
    "Sales Inquiry",
    "Products Inquiry",
    "Services Inquiry",
    "Support Inquiry"
  ];

  // Merged all state into a single object
  const [contactSection, setContactSection] = useState(contactData);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Edit/Save Buttons */}
        <div className="flex justify-end mt-6">
          {isEditing ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -1, scaleX: 1.1 }}
              onClick={() => setIsEditing(false)}
              className="bg-green-600 cursor-pointer hover:font-semibold hover:shadow-2xl shadow-xl text-white px-4 py-2 rounded"
            >
              Save
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -1, scaleX: 1.1 }}
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer hover:shadow-2xl shadow-xl hover:font-semibold"
            >
              Edit
            </motion.button>
          )}
        </div>

        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
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
              <input
                value={contactSection.header.title}
                onChange={(e) =>
                  setContactSection((prev) => ({
                    ...prev,
                    header: { ...prev.header, title: e.target.value },
                  }))
                }
                className="text-3xl md:text-4xl text-foreground mb-4 w-full text-center border-b bg-transparent font-bold"
              />
            ) : (
              <h2 className="text-3xl md:text-4xl text-foreground mb-4">
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
                  className="text-lg text-muted-foreground border-b bg-transparent w-full text-center mb-2"
                />
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
                  className="text-lg text-red-accent font-semibold border-b bg-transparent w-full text-center mb-2"
                />
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
                  className="text-lg text-muted-foreground border-b bg-transparent w-full text-center"
                />
              </div>
            ) : (
              <>
                <p className="text-lg text-muted-foreground inline">
                  {contactSection.header.descriptionPart1}
                </p>
                <motion.span
                  className="text-red-accent font-semibold"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-lg text-red-accent font-semibold">
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

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form - Keeping this static as requested */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-card border-border relative overflow-hidden hover-lift">
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
                        placeholder="John"
                        className="border-border focus:border-primary transition-all duration-300 bg-input-background"
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
                        placeholder="Doe"
                        className="border-border focus:border-primary transition-all duration-300 bg-input-background"
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
                      placeholder="john@company.com"
                      className="border-border focus:border-primary transition-all duration-300 bg-input-background"
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
                      className="border-border focus:border-primary transition-all duration-300 bg-input-background"
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
                  <select className="w-full border-[1px] rounded-[5px] py-1 px-2 focus:border-primary transition-all duration-300">
                    {subjectOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
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
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300">
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
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {contactSection.contactInfo.map((info, index) => {
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-card border-border hover-lift cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-full">
                          {isEditing ? (
                            <>
                              <input
                                value={info.title}
                                onChange={(e) =>
                                  updateContactInfo(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className="font-medium text-card-foreground mb-1 border-b bg-transparent w-full"
                              />
                              <input
                                value={info.primary}
                                onChange={(e) =>
                                  updateContactInfo(
                                    index,
                                    "primary",
                                    e.target.value
                                  )
                                }
                                className="text-muted-foreground border-b bg-transparent w-full mb-1"
                              />
                              <input
                                value={info.secondary}
                                onChange={(e) =>
                                  updateContactInfo(
                                    index,
                                    "secondary",
                                    e.target.value
                                  )
                                }
                                className="text-muted-foreground text-sm border-b bg-transparent w-full mb-1"
                              />
                              <input
                                value={info.color}
                                onChange={(e) =>
                                  updateContactInfo(
                                    index,
                                    "color",
                                    e.target.value
                                  )
                                }
                                className="text-muted-foreground border-b bg-transparent w-full"
                                placeholder="Color class (e.g., red-accent)"
                              />
                              <Button
                                size="sm"
                                variant="destructive"
                                className="mt-2 cursor-pointer hover:scale-105"
                                onClick={() => removeContactInfo(index)}
                              >
                                Remove
                              </Button>
                            </>
                          ) : (
                            <>
                              <motion.div
                                whileHover={{ color: "var(--color-primary)" }}
                              >
                                <h4 className="font-medium text-card-foreground mb-1">
                                  {info.title}
                                </h4>
                              </motion.div>
                              <p className="text-muted-foreground">
                                {info.primary}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                {info.secondary}
                              </p>
                              <span className="text-muted-foreground">
                                Closed on Sundays
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {isEditing && (
              <motion.div
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                className="flex items-center justify-center"
              >
                <Button
                  onClick={addContactInfo}
                  className="cursor-pointer text-green-600"
                >
                  + Add Contact Info
                </Button>
              </motion.div>
            )}

            {/* Contact CTA card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-primary  text-primary-foreground hover-lift">
                <CardContent className="p-6 text-center">
                  {isEditing ? (
                    <>
                      <input
                        value={contactSection.cta.title}
                        onChange={(e) =>
                          setContactSection((prev) => ({
                            ...prev,
                            cta: { ...prev.cta, title: e.target.value },
                          }))
                        }
                        className="font-bold mb-2 text-primary-foreground border-b bg-transparent w-full text-center bg-primary/50"
                      />
                      <input
                        value={contactSection.cta.description}
                        onChange={(e) =>
                          setContactSection((prev) => ({
                            ...prev,
                            cta: { ...prev.cta, description: e.target.value },
                          }))
                        }
                        className="text-sm mb-4 opacity-90 text-primary-foreground border-b bg-transparent w-full text-center bg-primary/50"
                      />
                      <input
                        value={contactSection.cta.buttonText}
                        onChange={(e) =>
                          setContactSection((prev) => ({
                            ...prev,
                            cta: { ...prev.cta, buttonText: e.target.value },
                          }))
                        }
                        className="bg-red-accent text-white hover:bg-red-accent/90 font-bold shadow-lg border-b bg-transparent w-full text-center mb-2"
                      />
                    </>
                  ) : (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <h4 className="font-bold mb-2 text-primary-foreground">
                          {contactSection.cta.title}
                        </h4>
                      </motion.div>
                      <p className="text-sm mb-4 opacity-90 text-primary-foreground">
                        {contactSection.cta.description}
                      </p>
                    </>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                 
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}