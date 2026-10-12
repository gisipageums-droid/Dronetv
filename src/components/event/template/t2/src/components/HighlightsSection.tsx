import { Sparkles, Users, Award, Lightbulb, Heart, Zap } from 'lucide-react';

export function HighlightsSection() {
  const highlights = [
    {
      icon: Users,
      number: '2000+',
      label: 'Attendees',
      description: 'Industry professionals from around the globe',
    },
    {
      icon: Award,
      number: '50+',
      label: 'Expert Speakers',
      description: 'Thought leaders and innovators',
    },
    {
      icon: Lightbulb,
      number: '75+',
      label: 'Sessions',
      description: 'Workshops, panels, and keynotes',
    },
    {
      icon: Heart,
      number: '30+',
      label: 'Partners',
      description: 'Leading companies and organizations',
    },
    {
      icon: Zap,
      number: '100+',
      label: 'Exhibitors',
      description: 'Showcasing cutting-edge solutions',
    },
    {
      icon: Sparkles,
      number: '3',
      label: 'Days',
      description: 'Of innovation and networking',
    },
  ];

  return (
    <section id="highlights" className="py-16 sm:py-20 md:py-24 bg-surface-main relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-brand-yellow-soft/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-brand-yellow-soft/30 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-surface-card rounded-full border border-brand-yellow-soft shadow-sm">
              <span className="text-status-error text-xl font-semibold">Event Highlights</span>
            </div>
            <h2 className="text-ink mb-4 text-3xl sm:text-4xl md:text-5xl">The Numbers Speak</h2>
            <p className="text-ink-paragraph text-base sm:text-lg max-w-2xl mx-auto px-4">
              Join thousands of professionals in an event that's breaking records and setting new standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-surface-card p-6 sm:p-8 rounded-2xl border-2 border-brand-yellow-soft hover:border-brand-yellow transition-all duration-300 overflow-hidden hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-surface-main/50 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-brand-yellow rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-brand-gold mb-2 text-3xl sm:text-4xl">{highlight.number}</div>
                    <h3 className="text-ink mb-2 text-lg sm:text-xl">{highlight.label}</h3>
                    <p className="text-ink-paragraph text-sm sm:text-base">{highlight.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Special Call-out */}
          <div className="bg-brand-yellow rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-xl">
            <h3 className="text-ink mb-4 text-2xl sm:text-3xl md:text-4xl">Early Bird Discount Available</h3>
            <p className="text-ink-charcoal text-base sm:text-lg mb-6 max-w-2xl mx-auto px-4">
              Register before February 1st and save 30% on your ticket. Limited spots available!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-ink text-white rounded-xl hover:bg-ink-charcoal transition-colors text-sm sm:text-base">
                Claim Your Discount
              </button>
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-surface-card text-ink rounded-xl hover:bg-ink-light transition-colors text-sm sm:text-base">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
