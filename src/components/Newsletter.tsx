import React, { useState } from 'react';
import { Mail, CheckCircle, Send, Sparkles } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsLoading(false);
      setIsSubscribed(true);
      setEmail('');
      
      setTimeout(() => setIsSubscribed(false), 4000);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-200/30 rounded-full animate-pulse blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-yellow-600/20 rounded-full animate-pulse blur-3xl" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-yellow-500/40 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-600/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Icon with Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-black/20 rounded-full blur-2xl scale-150 animate-pulse"></div>
            <div className="relative bg-black/10 backdrop-blur-sm rounded-full p-6 border border-black/20">
              <Mail className="h-16 w-16 text-black animate-bounce" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-8 w-8 text-black animate-spin-slow" />
            </div>
          </div>
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black mb-4 sm:mb-6 tracking-tight">
          Stay Updated with{' '}
          <span className="">
            Drone TV!
          </span>
        </h2>
        
        <p className="text-lg sm:text-xl text-black/80 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
          Get exclusive access to the latest news, cutting-edge videos, and industry insights delivered straight to your inbox.
        </p>
        
        {!isSubscribed ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto px-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-black/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative flex flex-col gap-3 sm:flex-row sm:gap-4 bg-white/20 backdrop-blur-sm p-2 rounded-2xl border border-white/30">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-0 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-black/20 text-black placeholder-gray-600 font-medium transition-all duration-300 text-sm sm:text-base"
                  required
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group/btn bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px] sm:min-w-[140px] text-sm sm:text-base"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <Send className="h-3 w-3 sm:h-4 sm:w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-black animate-fade-in-up px-4">
            <div className="bg-green-500 rounded-full p-3 animate-bounce">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <div className="text-xl sm:text-2xl font-bold">Thank you for subscribing!</div>
              <div className="text-base sm:text-lg opacity-80">Welcome to the Drone TV community</div>
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="mt-8 sm:mt-12 flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-black/60 px-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm font-medium">10,000+ Subscribers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <span className="text-xs sm:text-sm font-medium">Weekly Updates</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <span className="text-xs sm:text-sm font-medium">No Spam, Ever</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
