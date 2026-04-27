import React from 'react';

type Client = {
  name: string;
  logo: string;
  industry: string;
};

type Testimonial = {
  name: string;
  photo: string;
  quote: string;
  rating: number; // out of 5
  role: string;
};

interface ClientsSectionProps {
  clientsTitle: string;
  clients: Client[];
  clientLogos?: string[];
  testimonials: Testimonial[];
}

const ClientsSection: React.FC<ClientsSectionProps> = ({
  clientsTitle,
  clients,
  clientLogos = [],
  testimonials,
}) => (
  <section className="w-full py-16 md:py-24 bg-[#FFD400] relative overflow-hidden">
    {/* Background decorative elements */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#FF0000] rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[#FF0000] rounded-full blur-3xl opacity-50"></div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black mb-6 leading-tight">
          {clientsTitle}
        </h2>
        
        {/* Decorative line */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="h-1 w-20 bg-[#FF0000] rounded-full"></div>
          <div className="h-1 w-12 bg-black rounded-full"></div>
          <div className="h-1 w-6 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Clients Section */}
      <div className="mb-20">
        {clientLogos && clientLogos.length > 0 ? (
          /* Simple Logo Grid */
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
            {clientLogos.map((logo, idx) => (
              <div
                key={logo + idx}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border-2 border-transparent hover:border-[#FF0000]"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD400]/20 to-[#FF0000]/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <img
                    src={logo}
                    alt={`Client ${idx + 1}`}
                    className="h-16 md:h-20 w-full object-contain transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-br from-[#FFD400] to-[#FF0000] rounded-bl-xl rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        ) : (
          /* Detailed Client Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {clients.map((client, idx) => (
              <div
                key={client.name + idx}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 border-4 border-transparent hover:border-[#FF0000]"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD400]/10 to-[#FF0000]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 text-center">
                  {/* Logo Container */}
                  <div className="mb-6">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD400] to-[#FF0000] rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                      <div className="relative bg-white rounded-2xl p-4 shadow-lg">
                        <img
                          src={client.logo}
                          alt={client.name}
                          className="h-16 w-16 object-contain mx-auto transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Client Name */}
                  <h3 className="text-xl font-bold text-black mb-2 group-hover:text-[#FF0000] transition-colors duration-300">
                    {client.name}
                  </h3>

                  {/* Industry */}
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#FF0000] to-[#FF0000]/90 text-white text-sm font-bold rounded-full shadow-lg group-hover:from-[#FFD400] group-hover:to-[#FFD400] group-hover:text-black transition-all duration-500">
                    {client.industry}
                  </span>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-[#FFD400] to-[#FF0000] rounded-bl-2xl rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Testimonials Section */}
      {testimonials && testimonials.length > 0 && (
        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-black text-black mb-4">
              What Our Clients Say
            </h3>
            <div className="flex items-center gap-2 justify-center">
              <div className="h-1 w-12 bg-[#FF0000] rounded-full"></div>
              <div className="h-1 w-8 bg-black rounded-full"></div>
              <div className="h-1 w-4 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <div
                key={testimonial.name + idx}
                className="group relative bg-white rounded-3xl p-8 lg:p-10 shadow-2xl border-4 border-transparent hover:border-[#FF0000] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD400]/10 to-[#FF0000]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  {/* Profile Section */}
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD400] to-[#FF0000] rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                      <img
                        src={testimonial.photo}
                        alt={testimonial.name}
                        className="relative w-16 h-16 rounded-full object-cover border-4 border-[#FFD400] shadow-lg transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-bold text-black group-hover:text-[#FF0000] transition-colors duration-300">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600 font-medium">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center mb-4 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-2xl transition-colors duration-300 ${
                          i < testimonial.rating
                            ? 'text-[#FFD400] group-hover:text-[#FF0000]'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-gray-700 text-lg leading-relaxed italic text-center mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-[#FFD400] to-[#FF0000] rounded-bl-2xl rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-[#FFD400] to-[#FF0000] group-hover:w-20 transition-all duration-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom decorative element */}
      <div className="flex justify-center mt-16">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#FF0000] rounded-full"></div>
          <div className="w-2 h-2 bg-black rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  </section>
);

export default ClientsSection