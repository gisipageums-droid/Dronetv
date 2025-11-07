import { motion } from 'motion/react';
import { Calendar, MapPin, Building } from 'lucide-react';

const experiences = [
  {
    company: 'TechCorp Inc.',
    position: 'Senior Full-Stack Developer',
    duration: '2022 - Present',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: [
      'Led development of microservices architecture serving 1M+ daily active users',
      'Implemented CI/CD pipelines reducing deployment time by 70%',
      'Mentored junior developers and conducted technical interviews',
      'Built real-time analytics dashboard using React and Node.js'
    ],
    technologies: ['React', 'Node.js', 'AWS', 'PostgreSQL', 'Docker']
  },
  {
    company: 'StartupCo',
    position: 'Full-Stack Developer',
    duration: '2020 - 2022',
    location: 'Remote',
    type: 'Full-time',
    description: [
      'Developed MVP that attracted $2M in Series A funding',
      'Built responsive web applications using Vue.js and Express',
      'Integrated payment systems and third-party APIs',
      'Collaborated with designers to implement pixel-perfect UIs'
    ],
    technologies: ['Vue.js', 'Express', 'MongoDB', 'Stripe', 'Firebase']
  },
  {
    company: 'Digital Agency Pro',
    position: 'Frontend Developer',
    duration: '2019 - 2020',
    location: 'New York, NY',
    type: 'Full-time',
    description: [
      'Created custom WordPress themes and plugins for 50+ clients',
      'Optimized website performance achieving 95+ Google PageSpeed scores',
      'Implemented responsive designs across multiple devices',
      'Collaborated with design team to deliver pixel-perfect websites'
    ],
    technologies: ['JavaScript', 'WordPress', 'PHP', 'SASS', 'jQuery']
  },
  {
    company: 'Freelance',
    position: 'Web Developer',
    duration: '2018 - 2019',
    location: 'Remote',
    type: 'Freelance',
    description: [
      'Delivered 20+ successful projects for small to medium businesses',
      'Specialized in e-commerce solutions using Shopify and WooCommerce',
      'Provided ongoing maintenance and support for client websites',
      'Built custom web applications using modern JavaScript frameworks'
    ],
    technologies: ['React', 'Shopify', 'WooCommerce', 'Node.js', 'MySQL']
  }
];

export function Experience() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">
            Professional <span className="text-yellow-500">Experience</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A journey through my professional career, showcasing the experience 
            and expertise I've gained working with diverse teams and technologies.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-yellow-400 transform md:-translate-x-1/2"></div>

          {experiences.map((experience, index) => (
            <motion.div
              key={experience.company}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline dot */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                viewport={{ once: true }}
                className="absolute left-8 md:left-1/2 w-4 h-4 bg-yellow-400 rounded-full transform -translate-x-1/2 z-10"
              />

              {/* Content */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className={`w-full md:w-5/12 ml-16 md:ml-0 ${
                  index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                }`}
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl text-gray-900">{experience.position}</h3>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                        {experience.type}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <Building className="w-4 h-4" />
                        <span>{experience.company}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{experience.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{experience.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <ul className="space-y-2 mb-4">
                    {experience.description.map((item, itemIndex) => (
                      <motion.li
                        key={itemIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 + itemIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start space-x-3 text-gray-600"
                      >
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map((tech, techIndex) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.2 + techIndex * 0.05 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.1 }}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-yellow-100 hover:text-yellow-700 transition-all duration-300"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl text-gray-900 mb-4">
              Want to learn more about my experience?
            </h3>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Download my detailed resume or schedule a call to discuss how my experience 
              can benefit your next project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="#"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Download Resume
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 bg-white text-yellow-600 border-2 border-yellow-400 rounded-lg hover:bg-yellow-50 transition-all duration-300"
              >
                Schedule a Call
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}