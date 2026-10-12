import { useEffect, useRef } from 'react';
import { Building2, ExternalLink } from 'lucide-react';

export function ExhibitorsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const exhibitors = [
    { name: 'TechCorp Global', category: 'Technology', booth: 'A-101' },
    { name: 'Innovation Labs', category: 'R&D', booth: 'A-102' },
    { name: 'Digital Dynamics', category: 'Digital Solutions', booth: 'B-201' },
    { name: 'Future Ventures', category: 'Investment', booth: 'B-202' },
    { name: 'NextGen Institute', category: 'Education', booth: 'C-301' },
    { name: 'Startup Accelerator', category: 'Growth', booth: 'C-302' },
    { name: 'CloudFirst Solutions', category: 'Infrastructure', booth: 'D-401' },
    { name: 'DataVision Analytics', category: 'Data Science', booth: 'D-402' },
    { name: 'SecureNet Systems', category: 'Cybersecurity', booth: 'E-501' },
    { name: 'AI Innovations Co', category: 'Artificial Intelligence', booth: 'E-502' },
  ];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scroll = () => {
      scrollPosition += 0.5;
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(scroll, 20);
    return () => clearInterval(intervalId);
  }, []);

  // Duplicate exhibitors for seamless loop
  const duplicatedExhibitors = [...exhibitors, ...exhibitors];

  return (
    <section id="exhibitors" className="py-16 sm:py-20 md:py-24 bg-surface-main overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto mb-12 sm:mb-16">
          <div className="text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-surface-card rounded-full border border-brand-yellow-soft shadow-sm">
              <span className="text-status-error text-xl font-semibold">Our Exhibitors</span>
            </div>
            <h2 className="text-ink mb-4 text-3xl sm:text-4xl md:text-5xl">Discover Innovation</h2>
            <p className="text-ink-paragraph text-base sm:text-lg max-w-2xl mx-auto px-4">
              Meet with leading companies showcasing the latest products, services, and solutions.
            </p>
          </div>
        </div>
      </div>

      {/* Auto-scrolling Exhibitors */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden pb-4"
          style={{ scrollBehavior: 'auto' }}
        >
          {duplicatedExhibitors.map((exhibitor, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-80 sm:w-96 group bg-surface-card p-6 sm:p-8 rounded-2xl border-2 border-brand-yellow-soft hover:border-brand-yellow hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-brand-yellow rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 bg-brand-yellow-soft text-brand-gold rounded-full text-xs sm:text-sm">
                  {exhibitor.booth}
                </span>
              </div>
              <h3 className="text-ink mb-2 text-lg sm:text-xl group-hover:text-brand-yellow transition-colors">
                {exhibitor.name}
              </h3>
              <p className="text-brand-gold mb-4 text-sm sm:text-base">{exhibitor.category}</p>
              <button className="flex items-center gap-2 text-brand-gold hover:text-brand-yellow group/link text-sm sm:text-base">
                <span>Visit Booth</span>
                <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 bottom-0 w-32 bg-surface-main to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-32 bg-surface-main to-transparent pointer-events-none" />
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 sm:px-6 mt-12 sm:mt-16">
        <div className="max-w-4xl mx-auto bg-brand-yellow rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-xl">
          <h3 className="text-ink mb-4 text-2xl sm:text-3xl md:text-4xl">Interested in Exhibiting?</h3>
          <p className="text-ink-charcoal text-base sm:text-lg mb-6 max-w-2xl mx-auto">
            Join our community of innovators and showcase your products to thousands of industry professionals.
          </p>
          <button className="px-6 sm:px-8 py-3 sm:py-4 bg-ink text-white rounded-xl hover:bg-ink-charcoal transition-colors text-sm sm:text-base">
            Become an Exhibitor
          </button>
        </div>
      </div>
    </section>
  );
}
