// Simplified Clients component

const clients = [
  { name: 'TechCorp', industry: 'Technology' },
  { name: 'StartupCo', industry: 'E-commerce' },
  { name: 'InnovateLabs', industry: 'FinTech' },
  { name: 'DigitalFirst', industry: 'Healthcare' },
  { name: 'CloudVentures', industry: 'SaaS' },
  { name: 'NextGen Solutions', industry: 'Enterprise' }
];

const stats = [
  { number: '50+', label: 'Happy Clients' },
  { number: '100+', label: 'Projects Delivered' },
  { number: '15+', label: 'Industries Served' },
  { number: '99%', label: 'Success Rate' }
];

export function Clients() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl text-foreground mb-4">
            Trusted by <span className="text-yellow-500">Leading Companies</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            I've had the privilege of working with amazing companies across various 
            industries, delivering innovative solutions that drive real business results.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center hover:scale-105 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl text-yellow-500 mb-2">{stat.number}</div>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Client Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {clients.map((client) => (
            <div
              key={client.name}
              className="group bg-muted rounded-xl p-6 h-24 flex items-center justify-center hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-center">
                <div className="text-lg text-foreground group-hover:text-yellow-600 transition-colors duration-300 mb-1">
                  {client.name}
                </div>
                <div className="text-xs text-muted-foreground">{client.industry}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-yellow-50 to-card dark:from-yellow-900/20 dark:to-card rounded-2xl p-8">
          <h3 className="text-2xl text-foreground mb-4">
            Ready to join these successful companies?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Let's discuss how I can help transform your ideas into powerful 
            digital solutions that drive growth and innovation.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center px-8 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Start Your Project
          </a>
        </div>
      </div>
    </section>
  );
}