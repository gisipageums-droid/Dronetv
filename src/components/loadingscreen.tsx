import React from 'react';

interface LoadingScreenProps {
  logoSrc?: string;
  loadingText?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  logoSrc = "images/logo.png",
  loadingText = "Loading..."
}) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 z-[9999] overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-red-500 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Pulse rings */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-64 h-64 border-4 border-red-500 rounded-full animate-ping-slow opacity-20"></div>
          <div className="w-80 h-80 border-4 border-red-400 rounded-full animate-ping-slower opacity-15"></div>
        </div>
      </div>

      {/* Enhanced Logo Container */}
      <div className="relative w-40 h-40 flex items-center justify-center mb-8">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 border-4 border-transparent border-t-red-500 border-r-red-500 rounded-full animate-spin-slow"></div>
        <div className="absolute inset-4 border-4 border-transparent border-b-yellow-300 border-l-yellow-300 rounded-full animate-spin-slow-reverse"></div>
        
        {/* Logo with enhanced animation */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-yellow-400 rounded-full blur-lg opacity-70 animate-pulse-slow"></div>
          <img
            src={logoSrc}
            alt="Loading..."
            className="relative w-full h-full object-contain animate-float-gentle"
            style={{
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))'
            }}
          />
        </div>
      </div>

      {/* Enhanced Loading text */}
      <div className="mt-8 text-center">
        <div className="text-2xl font-black text-white tracking-wider mb-6">
          {loadingText.split('').map((char, index) => (
            <span
              key={index}
              className="inline-block animate-wave"
              style={{
                animationDelay: `${index * 0.1}s`,
                textShadow: '0 2px 8px rgba(0,0,0,0.4)'
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>
        
        {/* Enhanced loading dots */}
        <div className="flex justify-center items-center space-x-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full animate-bounce-slow shadow-lg"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Progress bar */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-80">
        <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 rounded-full animate-shimmer bg-[length:200%_100%]"></div>
        </div>
        <div className="text-center mt-2 text-white/80 text-sm font-medium tracking-wide">
          Preparing your experience...
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          to { transform: rotate(-360deg); }
        }
        @keyframes ping-slow {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        @keyframes ping-slower {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.05); }
        }
        @keyframes wave {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.9; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 4s linear infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 3s ease-out infinite;
        }
        .animate-ping-slower {
          animation: ping-slower 4s ease-out infinite;
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
        .animate-float-gentle {
          animation: float-gentle 3s ease-in-out infinite;
        }
        .animate-wave {
          animation: wave 1.5s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.5s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;