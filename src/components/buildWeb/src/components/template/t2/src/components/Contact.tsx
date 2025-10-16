import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Clock } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function Contact() {
  const [isEditing, setIsEditing] = useState(false);

  const [header, setHeader] = useState({
    title: "Get In Touch",
    descriptionPart1:
      "Ready to transform your business? Let's start a conversation about how we can help you achieve your goals with our",
    descriptionPart2: "expert solutions",
    descriptionPart3: ".",
  });

  const [contactInfo, setContactInfo] = useState([
    {
      title: "Business Hours",
      primary: "Mon - Fri: 9:00 AM - 6:00 PM EST",
      secondary: "Sat: 10:00 AM - 2:00 PM EST",
      color: "red-accent",
    },
  ]);

  const [cta, setCta] = useState({
    title: "Ready to Get Started?",
    description: "Schedule a free consultation to discuss your business needs",
    buttonText: "Book Free Consultation",
  });

  // Handlers for contact info
  const updateContactInfo = (idx, field, value) => {
    setContactInfo((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
    );
  };

  const removeContactInfo = (idx) => {
    setContactInfo((prev) => prev.filter((_, i) => i !== idx));
  };

  const addContactInfo = () => {
    setContactInfo((prev) => [
      ...prev,
      {
        icon: Clock,
        title: "New Info",
        primary: "Primary info",
        secondary: "Secondary info",
        color: "red-accent",
      },
    ]);
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
      id='contact'
      className='py-20 bg-secondary theme-transition'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <motion.div
          className='text-center max-w-3xl mx-auto mb-16'
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
                value={header.title}
                onChange={(e) =>
                  setHeader({ ...header, title: e.target.value })
                }
                className='text-3xl md:text-4xl text-foreground mb-4 w-full text-center border-b bg-transparent font-bold'
              />
            ) : (
              <h2 className='text-3xl md:text-4xl text-foreground mb-4'>
                {header.title}
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
              <div className='flex flex-col items-center'>
                <input
                  value={header.descriptionPart1}
                  onChange={(e) =>
                    setHeader({ ...header, descriptionPart1: e.target.value })
                  }
                  className='text-lg text-muted-foreground border-b bg-transparent w-full text-center mb-2'
                />
                <input
                  value={header.descriptionPart2}
                  onChange={(e) =>
                    setHeader({ ...header, descriptionPart2: e.target.value })
                  }
                  className='text-lg text-red-accent font-semibold border-b bg-transparent w-full text-center mb-2'
                />
                <input
                  value={header.descriptionPart3}
                  onChange={(e) =>
                    setHeader({ ...header, descriptionPart3: e.target.value })
                  }
                  className='text-lg text-muted-foreground border-b bg-transparent w-full text-center'
                />
              </div>
            ) : (
              <>
                <p className='text-lg text-muted-foreground inline'>
                  {header.descriptionPart1}
                </p>
                <motion.span
                  className='text-red-accent font-semibold'
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className='text-lg text-red-accent font-semibold'>
                    {header.descriptionPart2}
                  </span>
                </motion.span>
                <span className='text-lg text-muted-foreground'>
                  {header.descriptionPart3}
                </span>
              </>
            )}
          </motion.div>
        </motion.div>

        <div className='grid lg:grid-cols-2 gap-12'>
          {/* Contact Form - Keeping this static as requested */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className='bg-card border-border relative overflow-hidden hover-lift'>
              <motion.div
                className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-accent to-primary'
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 1 }}
              />

              <CardHeader>
                <CardTitle className='text-card-foreground'>
                  <span className='text-card-foreground'>
                    Send us a message
                  </span>
                </CardTitle>
                <p className='text-sm text-muted-foreground'>
                  We'll get back to you within 24 hours during business days.
                </p>
              </CardHeader>
              <CardContent className='space-y-6'>
                <motion.div
                  className='grid grid-cols-2 gap-4'
                  variants={containerVariants}
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true }}
                >
                  <motion.div className='space-y-2' variants={itemVariants}>
                    <Label htmlFor='firstName'>
                      <span className='text-sm font-medium text-card-foreground'>
                        First Name
                      </span>
                    </Label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        id='firstName'
                        placeholder='John'
                        className='border-border focus:border-primary transition-all duration-300 bg-input-background'
                      />
                    </motion.div>
                  </motion.div>
                  <motion.div className='space-y-2' variants={itemVariants}>
                    <Label htmlFor='lastName'>
                      <span className='text-sm font-medium text-card-foreground'>
                        Last Name
                      </span>
                    </Label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        id='lastName'
                        placeholder='Doe'
                        className='border-border focus:border-primary transition-all duration-300 bg-input-background'
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>

                <motion.div
                  className='space-y-2'
                  variants={itemVariants}
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true }}
                >
                  <Label htmlFor='email'>
                    <span className='text-sm font-medium text-card-foreground'>
                      Email
                    </span>
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      id='email'
                      type='email'
                      placeholder='john@company.com'
                      className='border-border focus:border-primary transition-all duration-300 bg-input-background'
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  className='space-y-2'
                  variants={itemVariants}
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true }}
                >
                  <Label htmlFor='company'>
                    <span className='text-sm font-medium text-card-foreground'>
                      Company
                    </span>
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      id='company'
                      placeholder='Your Company'
                      className='border-border focus:border-primary transition-all duration-300 bg-input-background'
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  className='space-y-2'
                  variants={itemVariants}
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true }}
                >
                  <Label htmlFor='subject'>
                    <span className='text-sm font-medium text-card-foreground'>
                      Subject
                    </span>
                  </Label>
                  <motion.select
                    className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-input-background text-card-foreground'
                    whileFocus={{ scale: 1.02 }}
                  >
                    <option>General Inquiry</option>
                    <option>Sales Inquiry</option>
                    <option>Products Inquiry</option>
                    <option>Services Inquiry</option>
                    <option>Support Inquiry</option>
                    
                  </motion.select>
                </motion.div>

                <motion.div
                  className='space-y-2'
                  variants={itemVariants}
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true }}
                >
                  <Label htmlFor='message'>
                    <span className='text-sm font-medium text-card-foreground'>
                      Message
                    </span>
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Textarea
                      id='message'
                      placeholder='Tell us about your project and how we can help...'
                      className='min-h-[120px] border-border focus:border-primary transition-all duration-300 bg-input-background'
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className='w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300'>
                    <motion.span
                      animate={{ opacity: [1, 0.8, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className='text-sm font-medium text-primary-foreground'>
                        Send Message
                      </span>
                    </motion.span>
                  </Button>
                </motion.div>

                <motion.div
                  className='text-center'
                  variants={itemVariants}
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true }}
                >
                  <p className='text-sm text-muted-foreground'>
                    We typically respond within 24 hours during business days.
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className='space-y-8'
            variants={containerVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
          >
            {contactInfo.map((info, index) => {
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className='bg-card border-border hover-lift cursor-pointer'>
                    <CardContent className='p-6'>
                      <div className='flex items-start space-x-4'>
                        <div className='w-full'>
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
                                className='font-medium text-card-foreground mb-1 border-b bg-transparent w-full'
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
                                className='text-muted-foreground border-b bg-transparent w-full mb-1'
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
                                className='text-muted-foreground text-sm border-b bg-transparent w-full mb-1'
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
                                className='text-muted-foreground border-b bg-transparent w-full'
                                placeholder='Color class (e.g., red-accent)'
                              />
                              <Button
                                size='sm'
                                variant='destructive'
                                className='mt-2'
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
                                <h4 className='font-medium text-card-foreground mb-1'>
                                  {info.title}
                                </h4>
                              </motion.div>
                              <p className='text-muted-foreground'>
                                {info.primary}
                              </p>
                              <p className='text-muted-foreground text-sm'>
                                {info.secondary}
                              </p>
                              <span className='text-muted-foreground'>
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
              <div className='flex items-center justify-center'>
                <Button onClick={addContactInfo} className='text-green-600'>
                  + Add Contact Info
                </Button>
              </div>
            )}

            {/* Contact CTA card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Card className='bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover-lift'>
                <CardContent className='p-6 text-center'>
                  {isEditing ? (
                    <>
                      <input
                        value={cta.title}
                        onChange={(e) =>
                          setCta({ ...cta, title: e.target.value })
                        }
                        className='font-bold mb-2 text-primary-foreground border-b bg-transparent w-full text-center bg-primary/50'
                      />
                      <input
                        value={cta.description}
                        onChange={(e) =>
                          setCta({ ...cta, description: e.target.value })
                        }
                        className='text-sm mb-4 opacity-90 text-primary-foreground border-b bg-transparent w-full text-center bg-primary/50'
                      />
                      <input
                        value={cta.buttonText}
                        onChange={(e) =>
                          setCta({ ...cta, buttonText: e.target.value })
                        }
                        className='bg-red-accent text-white hover:bg-red-accent/90 font-bold shadow-lg border-b bg-transparent w-full text-center mb-2'
                      />
                    </>
                  ) : (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <h4 className='font-bold mb-2 text-primary-foreground'>
                          {cta.title}
                        </h4>
                      </motion.div>
                      <p className='text-sm mb-4 opacity-90 text-primary-foreground'>
                        {cta.description}
                      </p>
                    </>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className='bg-red-accent text-white hover:bg-red-accent/90 font-bold shadow-lg'>
                      <span className='font-bold text-white'>
                        {isEditing ? cta.buttonText : "Book Free Consultation"}
                      </span>
                    </Button>
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
