import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { motion } from "motion/react";

export default function Contact({ contactData }) {
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
            <h2 className="text-3xl md:text-4xl text-foreground mb-4">
              {contactData.header.title}
            </h2>
          </motion.div>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <p className="text-lg text-muted-foreground inline">
              {contactData.header.descriptionPart1}
            </p>
            <motion.span
              className="text-red-accent font-semibold"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-lg text-red-accent font-semibold">
                {contactData.header.descriptionPart2}
              </span>
            </motion.span>
            <span className="text-lg text-muted-foreground">
              {contactData.header.descriptionPart3}
            </span>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
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
                  <select className="w-full border-[1px] rounded-[5px] py-1 px-2 focus:border-primary transition-all duration-300 ">
                    <option className="text-black">General Inquiry</option>
                    <option className="text-black">Strategy Consulting</option>
                  
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
            {contactData.contactInfo.map((info, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-card border-border hover-lift cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-full">
                        <motion.div
                          whileHover={{ color: "var(--color-primary)" }}
                        >
                          <h4 className="font-medium text-card-foreground mb-1">
                            {info.title}
                          </h4>
                        </motion.div>
                        <p className="text-muted-foreground">{info.primary}</p>
                        <p className="text-muted-foreground text-sm">
                          {info.secondary}
                        </p>
                        <span className="text-muted-foreground">
                          Closed on Sundays
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Contact CTA card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-primary text-primary-foreground hover-lift">
                <CardContent className="p-6 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <h4 className="font-bold mb-2 text-primary-foreground">
                      {contactData.cta.title}
                    </h4>
                  </motion.div>
                  <p className="text-sm mb-4 opacity-90 text-primary-foreground">
                    {contactData.cta.description}
                  </p>
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
