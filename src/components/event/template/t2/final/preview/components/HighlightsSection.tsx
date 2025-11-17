import { useState, useEffect } from 'react';
import { Users, Award, Lightbulb, Heart, Zap, Sparkles, Calendar, MapPin, Clock, TrendingUp, Building2, Mic } from 'lucide-react';
import { motion } from 'motion/react';

interface Stat {
  icon: string;
  value: string;
  label: string;
}

interface HighlightsData {
  subtitle: string;
  heading: string;
  description: string;
  stats: Stat[];
}

interface HighlightsProps {
  highlightsData?: any;
}

const defaultData: HighlightsData = {
  subtitle: "event highlights",
  heading: "Event by Numbers",
  description: "Impact and reach",
  stats: [
    {
      icon: 'Users',
      value: '1000+',
      label: 'Expected Attendees'
    },
    {
      icon: 'Mic',
      value: '20+',
      label: 'Expert Speakers'
    }
  ]
};

const iconOptions = [
  { value: 'Users', label: 'Users', icon: Users },
  { value: 'Award', label: 'Award', icon: Award },
  { value: 'Lightbulb', label: 'Lightbulb', icon: Lightbulb },
  { value: 'Heart', label: 'Heart', icon: Heart },
  { value: 'Zap', label: 'Zap', icon: Zap },
  { value: 'Sparkles', label: 'Sparkles', icon: Sparkles },
  { value: 'Calendar', label: 'Calendar', icon: Calendar },
  { value: 'MapPin', label: 'Location', icon: MapPin },
  { value: 'Clock', label: 'Clock', icon: Clock },
  { value: 'TrendingUp', label: 'Trending Up', icon: TrendingUp },
  { value: 'Building', label: 'Building', icon: Building2 },
  { value: 'Mic', label: 'Mic', icon: Mic },
];

const getIconComponent = (iconName: string) => {
  const iconOption = iconOptions.find(option => option.value === iconName);
  return iconOption ? iconOption.icon : Users;
};

const transformHighlightsData = (apiData: any): HighlightsData => {
  if (!apiData) return defaultData;

  return {
    subtitle: apiData.subtitle,
    heading: apiData.heading,
    description: apiData.description,
    stats: apiData.stats
  };
};

export function HighlightsSection({ highlightsData }: HighlightsProps) {
  const [data, setData] = useState<HighlightsData>(defaultData);

  useEffect(() => {
    if (highlightsData) {
      const transformedData = transformHighlightsData(highlightsData);
      setData(transformedData);
    }
  }, [highlightsData]);

  const displayData = data;

  return (
    <section id="highlights" className="py-16 sm:py-20 md:py-24 bg-amber-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-yellow-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-amber-300/30 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-white rounded-full border border-amber-200 shadow-sm">
              <span className="text-red-700 text-xl font-semibold">{displayData.subtitle}</span>
            </div>
            <h2 className="text-gray-900 mb-4 text-3xl sm:text-4xl md:text-5xl">{displayData.heading}</h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
              {displayData.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {displayData.stats.map((stat, index) => {
              const IconComponent = getIconComponent(stat.icon);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="group relative bg-white p-6 sm:p-8 rounded-2xl border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 overflow-hidden hover:shadow-xl"
                >
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-amber-600 mb-2 text-3xl sm:text-4xl">{stat.value}</div>
                    <h3 className="text-gray-900 mb-2 text-lg sm:text-xl">{stat.label}</h3>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State */}
          {displayData.stats.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Stats Added</h4>
                <p className="text-gray-600">Add stats to showcase your event highlights.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}