import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

export function ContactSection() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <section id="contact" className="py-16 sm:py-20 md:py-24 bg-surface-main">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-surface-card rounded-full border border-brand-yellow-soft shadow-sm">
              <span className="text-status-error text-xl font-semibold">Get in Touch</span>
            </div>
            <h2 className="text-ink mb-4 text-3xl sm:text-4xl md:text-5xl">Contact Us</h2>
            <p className="text-ink-paragraph text-base sm:text-lg max-w-2xl mx-auto px-4">
              Have questions? We're here to help. Reach out to our team for any inquiries about the event.
            </p>
          </div>

          <div className="gap-8 sm:gap-12">
            {/* Contact Form */}
            <div className="bg-surface-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border-2 border-brand-yellow-soft shadow-lg max-w-3xl mx-auto">
              <h3 className="text-ink mb-6 text-xl sm:text-2xl">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-ink-paragraph mb-2 text-sm sm:text-base">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      placeholder="Naveen"
                      className="bg-surface-card border-ink-light"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-ink-paragraph mb-2 text-sm sm:text-base">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      placeholder="Saini"
                      className="bg-surface-card border-ink-light"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-ink-paragraph mb-2 text-sm sm:text-base">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="naveenjpr@example.com"
                    className="bg-surface-card border-ink-light"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-ink-paragraph mb-2 text-sm sm:text-base">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="How can we help?"
                    className="bg-surface-card border-ink-light"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-ink-paragraph mb-2 text-sm sm:text-base">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    className="bg-surface-card border-ink-light resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-brand-yellow hover:bg-brand-gold text-ink py-5 sm:py-6 text-sm sm:text-base"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 sm:px-6 mt-16 sm:mt-24">
        <div className="max-w-6xl mx-auto border-t border-brand-yellow-soft pt-8 sm:pt-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-brand-yellow rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">E</span>
              </div>
              <span className="text-ink text-base sm:text-lg">EventPro 2025</span>
            </div>
            <p className="text-ink-paragraph text-sm sm:text-base">© 2025 EventPro. All rights reserved.</p>
          </div>
        </div>
      </div>
    </section>
  );
}