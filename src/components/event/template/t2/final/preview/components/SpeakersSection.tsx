import { useState, useEffect } from 'react';
import { Linkedin, Twitter, User } from 'lucide-react';
import { motion } from 'motion/react';

interface Speaker {
  id: string;
  name: string;
  role: string;
  company: string;
  topic: string;
  image?: string;
  bio?: string;
  color: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

interface SpeakersData {
  subtitle: string;
  heading: string;
  description: string;
  speakers: Speaker[];
}

interface SpeakersProps {
  speakersData?: SpeakersData;
}

const defaultSpeakersData: SpeakersData = {
  "subtitle": "expert speakers",
  "heading": "Meet Our Speakers", 
  "description": "Industry leaders and experts",
  "speakers": [
    {
      "image": "https://images.unsplash.com/photo-1674081955099-9a290e8f5947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTg4ODN8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHNwZWFrZXIlMjBwcmVzZW50YXRpb24lMjBjb25mZXJlbmNlJTIwaGVhZHNob3R8ZW58MHwxfHx8MTc2MjY3MTYyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      "socialLinks": {
        "twitter": "",
        "linkedin": ""
      },
      "role": "EXACT role",
      "name": "EXACT NAME from brochure", 
      "bio": "100-150 word professional bio",
      "topic": "Session topic",
      "company": "EXACT company",
      "id": "1",
      "color": "from-brand-yellow to-brand-gold"
    }
  ]
};

export function SpeakersSection({ speakersData }: SpeakersProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState<SpeakersData>(defaultSpeakersData);

  useEffect(() => {
    if (speakersData) {
      const transformedSpeakers = speakersData.speakers?.map(speaker => ({
        id: speaker.id || Date.now().toString(),
        name: speaker.name || 'New Speaker',
        role: speaker.role || 'Position',
        company: speaker.company || 'Company',
        topic: speaker.topic || 'Speaking Topic',
        bio: speaker.bio || 'Professional bio',
        image: speaker.image,
        color: speaker.color || 'from-brand-yellow to-brand-gold',
        socialLinks: speaker.socialLinks || {
          linkedin: '',
          twitter: '',
          website: ''
        }
      })) || [];

      const transformedData: SpeakersData = {
        subtitle: speakersData.subtitle || "expert speakers",
        heading: speakersData.heading || "Meet Our Speakers",
        description: speakersData.description || "Industry leaders and experts",
        speakers: transformedSpeakers
      };
      
      setData(transformedData);
      setDataLoaded(true);
    } else if (!dataLoaded) {
      setData(defaultSpeakersData);
      setDataLoaded(true);
    }
  }, [speakersData, dataLoaded]);

  const displayData = data;

  return (
    <section id="speakers" className="py-16 sm:py-20 md:py-24 bg-surface-card">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-brand-yellow-soft rounded-full">
              <span className="text-status-error text-xl font-semibold">{displayData.subtitle}</span>
            </div>
            <h2 className="text-ink mb-4 text-3xl sm:text-4xl md:text-5xl">{displayData.heading}</h2>
            <p className="text-ink-paragraph text-base sm:text-lg max-w-2xl mx-auto px-4">
              {displayData.description}
            </p>
          </div>

          {/* Speakers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayData.speakers.map((speaker) => (
              <motion.div
                key={speaker.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group relative bg-surface-card rounded-2xl overflow-hidden border-2 border-ink-light hover:border-brand-yellow-soft hover:shadow-2xl transition-all duration-300"
              >
                {/* Speaker Header */}
                <div className={`relative h-40 bg-brand-yellow-soft flex items-center justify-center ${speaker.color}`}>
                  {speaker.image ? (
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-20 h-20 rounded-full object-cover shadow-lg group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-surface-card rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <User className="w-10 h-10 text-ink-paragraph" />
                    </div>
                  )}
                </div>

                {/* Speaker Content */}
                <div className="p-6">
                  <h3 className="text-ink mb-2 text-lg sm:text-xl group-hover:text-brand-yellow transition-colors">
                    {speaker.name}
                  </h3>
                  <p className="text-brand-gold mb-1 text-sm sm:text-base">{speaker.role}</p>
                  <p className="text-ink-paragraph mb-4 text-sm">{speaker.company}</p>
                  <div className="pt-4 border-t border-ink-light">
                    <p className="text-ink-paragraph text-sm sm:text-base mb-2">
                      <span className="text-ink-caption">Topic: </span>
                      {speaker.topic}
                    </p>
                    {speaker.bio && (
                      <p className="text-ink-paragraph text-sm mt-2">{speaker.bio}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {displayData.speakers.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-ink-light rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-ink-caption" />
                </div>
                <h4 className="text-lg font-semibold text-ink mb-2">No Speakers Added</h4>
                <p className="text-ink-paragraph">Add speakers to showcase your event presenters.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}