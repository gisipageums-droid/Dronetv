import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, Calendar, ArrowRight } from 'lucide-react';

const CreatePortfolio: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'company',
      title: 'Company',
      description: 'Create a professional company portfolio',
      icon: <Building2 size={48} />,
      available: true
    },
    {
      id: 'professional',
      title: 'Professional',
      description: 'Build your personal professional portfolio',
      icon: <User size={48} />,
      available: true
    },
    {
      id: 'event',
      title: 'Event Manager',
      description: 'Showcase your event management services',
      icon: <Calendar size={48} />,
      available: true
    }
  ];

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === 'professional') {
      navigate('/company/create-portfolio/professional');
    } else if (categoryId === 'company') {
      navigate('/company/create-company');
    } else if (categoryId === 'event') {
      navigate('/company/create-event');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              Drone<span className="text-[#FFD400]">TV</span>
            </div>
            <nav>
              <a href="/company" className="text-white hover:text-[#FFD400] transition-colors">
                ← Back to Home
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-black mb-6">
              Create Your <span className="text-[#FF0000]">Company Portfolio</span>
            </h1>
            <div className="w-24 h-1 bg-[#FFD400] mx-auto mb-6"></div>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
             Choose your company category to get started with our professional templates and showcase your products, services, and innovations to a wide audience.
            </p>
          </div>

          {/* Category Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 ${
                  category.available
                    ? 'border-[#FFD400] hover:border-[#FF0000] hover:shadow-xl cursor-pointer transform hover:scale-105'
                    : 'border-gray-200 opacity-50 cursor-not-allowed'
                }`}
              >
                {!category.available && (
                  <div className="absolute inset-0 bg-gray-100/80 rounded-2xl flex items-center justify-center">
                    <span className="bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Coming Soon
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                    category.available ? 'bg-[#FFD400] text-black' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {category.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-black mb-4">
                    {category.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    {category.description}
                  </p>

                  {category.available && (
                    <div className="flex items-center justify-center gap-2 text-[#FF0000] font-semibold">
                      <span>Get Started</span>
                      <ArrowRight size={20} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="mt-20 bg-[#FFD400] rounded-3xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">
                Why Choose Our Portfolio Builder?
              </h2>
              <p className="text-black/80 text-lg">
                Create stunning, professional portfolios in minutes
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#FF0000] rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Easy Customization</h3>
                <p className="text-black/80">Customize every aspect of your portfolio with our intuitive form builder</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#FF0000] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Professional Templates</h3>
                <p className="text-black/80">Choose from beautifully designed templates optimized for conversions</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#FF0000] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Instant Preview</h3>
                <p className="text-black/80">See your changes in real-time with our live preview feature</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePortfolio;