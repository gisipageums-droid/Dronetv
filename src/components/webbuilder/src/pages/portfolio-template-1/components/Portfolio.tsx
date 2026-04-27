import React from 'react';

interface Project {
  title: string;
  description: string;
  category: string;
  image: string;
}

interface PortfolioProps {
  projects: Project[];
}

const Portfolio: React.FC<PortfolioProps> = ({ projects }) => {
  return (
    <section id="portfolio" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Project <span className="text-[#FF0000]">Gallery</span>
          </h2>
          <div data-aos="fade-up" data-aos-delay="200" className="w-24 h-1 bg-[#FFD400] mx-auto mb-6"></div>
          <p data-aos="fade-up" data-aos-delay="400" className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {projects.length > 0 
              ? "A collection of my recent projects and work."
              : "No projects to display at the moment."}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4 bg-white dark:bg-gray-800">
                <h3 className="text-xl font-semibold text-black dark:text-white">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {project.description}
                </p>
                <span className="inline-block mt-3 px-3 py-1 bg-[#FFD400] text-black rounded-full text-sm">
                  {project.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
