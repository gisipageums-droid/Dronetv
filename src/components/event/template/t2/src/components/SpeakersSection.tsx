import { Linkedin, Twitter, User } from 'lucide-react';

export function SpeakersSection() {
  const speakers = [
    {
      name: 'Dr. Sarah Mitchell',
      role: 'Chief Innovation Officer',
      company: 'TechCorp Global',
      topic: 'The Future of AI in Business',
      color: 'from-brand-yellow to-brand-gold',
    },
    {
      name: 'Marcus Chen',
      role: 'CEO & Founder',
      company: 'Innovation Labs',
      topic: 'Building Sustainable Tech Solutions',
      color: 'from-brand-yellow to-status-warning',
    },
    {
      name: 'Elena Rodriguez',
      role: 'VP of Product',
      company: 'Digital Dynamics',
      topic: 'User-Centric Design Thinking',
      color: 'from-brand-yellow-soft to-brand-yellow',
    },
    {
      name: 'James Taylor',
      role: 'Strategy Director',
      company: 'Future Ventures',
      topic: 'Digital Transformation Strategies',
      color: 'from-brand-gold to-brand-gold',
    },
    {
      name: 'Dr. Amara Okafor',
      role: 'Research Lead',
      company: 'NextGen Institute',
      topic: 'Emerging Technologies & Ethics',
      color: 'from-brand-yellow to-brand-gold',
    },
    {
      name: 'David Kim',
      role: 'Growth Strategist',
      company: 'Startup Accelerator',
      topic: 'Scaling Your Business Effectively',
      color: 'from-brand-yellow to-brand-gold',
    },
  ];

  return (
    <section id="speakers" className="py-16 sm:py-20 md:py-24 bg-surface-card">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-brand-yellow-soft rounded-full">
              <span className="text-status-error text-xl font-semibold">Featured Speakers</span>
            </div>
            <h2 className="text-ink mb-4 text-3xl sm:text-4xl md:text-5xl">Learn From the Best</h2>
            <p className="text-ink-paragraph text-base sm:text-lg max-w-2xl mx-auto px-4">
              Hear from industry pioneers, innovators, and thought leaders who are shaping the future of business and technology.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {speakers.map((speaker, index) => (
              <div
                key={index}
                className="group relative bg-surface-card rounded-2xl overflow-hidden border-2 border-ink-light hover:border-brand-yellow-soft hover:shadow-2xl transition-all duration-300"
              >
                {/* Icon Header */}
                <div className={`relative h-40 bg-brand-yellow-soft flex items-center justify-center`}>
                  <div className="w-20 h-20 bg-surface-card rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <User className="w-10 h-10 text-ink-paragraph" />
                  </div>
                  {/* Social Icons */}
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-surface-card transition-colors shadow-md">
                      <Linkedin className="w-4 h-4 text-ink-paragraph" />
                    </button>
                    <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-surface-card transition-colors shadow-md">
                      <Twitter className="w-4 h-4 text-ink-paragraph" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-ink mb-2 text-lg sm:text-xl group-hover:text-brand-yellow transition-colors">
                    {speaker.name}
                  </h3>
                  <p className="text-brand-gold mb-1 text-sm sm:text-base">{speaker.role}</p>
                  <p className="text-ink-paragraph mb-4 text-sm">{speaker.company}</p>
                  <div className="pt-4 border-t border-ink-light">
                    <p className="text-ink-paragraph text-sm sm:text-base">
                      <span className="text-ink-caption">Topic: </span>
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
