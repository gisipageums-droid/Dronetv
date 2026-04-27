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
    <section id="contact" className="py-16 sm:py-20 md:py-24 bg-amber-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-white rounded-full border border-amber-200 shadow-sm">
              <span className="text-red-700 text-xl font-semibold">Get in Touch</span>
            </div>
            <h2 className="text-gray-900 mb-4 text-3xl sm:text-4xl md:text-5xl">Contact Us</h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
              Have questions? We're here to help. Reach out to our team for any inquiries about the event.
            </p>
          </div>

          <div className="gap-8 sm:gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border-2 border-amber-200 shadow-lg max-w-3xl mx-auto">
              <h3 className="text-gray-900 mb-6 text-xl sm:text-2xl">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-gray-700 mb-2 text-sm sm:text-base">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      placeholder="Naveen"
                      className="bg-white border-gray-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-gray-700 mb-2 text-sm sm:text-base">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      placeholder="Saini"
                      className="bg-white border-gray-200"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2 text-sm sm:text-base">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="naveenjpr@example.com"
                    className="bg-white border-gray-200"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 mb-2 text-sm sm:text-base">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="bg-white border-gray-200"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-2 text-sm sm:text-base">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    className="bg-white border-gray-200 resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-amber-600 text-gray-900 py-5 sm:py-6 text-sm sm:text-base"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}