import { Linkedin, Twitter, User } from 'lucide-react';

export function SpeakersSection() {
  const speakers = [
    {
      name: 'Dr. Sarah Mitchell',
      role: 'Chief Innovation Officer',
      company: 'TechCorp Global',
      topic: 'The Future of AI in Business',
      color: 'from-yellow-400 to-amber-500',
    },
    {
      name: 'Marcus Chen',
      role: 'CEO & Founder',
      company: 'Innovation Labs',
      topic: 'Building Sustainable Tech Solutions',
      color: 'from-amber-400 to-orange-500',
    },
    {
      name: 'Elena Rodriguez',
      role: 'VP of Product',
      company: 'Digital Dynamics',
      topic: 'User-Centric Design Thinking',
      color: 'from-yellow-300 to-amber-400',
    },
    {
      name: 'James Taylor',
      role: 'Strategy Director',
      company: 'Future Ventures',
      topic: 'Digital Transformation Strategies',
      color: 'from-amber-500 to-yellow-600',
    },
    {
      name: 'Dr. Amara Okafor',
      role: 'Research Lead',
      company: 'NextGen Institute',
      topic: 'Emerging Technologies & Ethics',
      color: 'from-yellow-400 to-amber-600',
    },
    {
      name: 'David Kim',
      role: 'Growth Strategist',
      company: 'Startup Accelerator',
      topic: 'Scaling Your Business Effectively',
      color: 'from-amber-400 to-yellow-500',
    },
  ];

  return (
    <section id="speakers" className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-yellow-100 rounded-full">
              <span className="text-red-700 text-xl font-semibold">Featured Speakers</span>
            </div>
            <h2 className="text-gray-900 mb-4 text-3xl sm:text-4xl md:text-5xl">Learn From the Best</h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
              Hear from industry pioneers, innovators, and thought leaders who are shaping the future of business and technology.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {speakers.map((speaker, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-amber-300 hover:shadow-2xl transition-all duration-300"
              >
                {/* Icon Header */}
                <div className={`relative h-40 bg-yellow-200 flex items-center justify-center`}>
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <User className="w-10 h-10 text-gray-700" />
                  </div>
                  {/* Social Icons */}
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md">
                      <Linkedin className="w-4 h-4 text-gray-700" />
                    </button>
                    <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md">
                      <Twitter className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-gray-900 mb-2 text-lg sm:text-xl group-hover:text-amber-600 transition-colors">
                    {speaker.name}
                  </h3>
                  <p className="text-amber-600 mb-1 text-sm sm:text-base">{speaker.role}</p>
                  <p className="text-gray-600 mb-4 text-sm">{speaker.company}</p>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-gray-700 text-sm sm:text-base">
                      <span className="text-gray-500">Topic: </span>
                      {speaker.topic}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
