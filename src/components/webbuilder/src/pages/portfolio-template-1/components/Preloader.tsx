import React from 'react';
import { Camera } from 'lucide-react';

const Preloader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#F8C400] flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative">
          <Camera 
            size={80} 
            className="text-ink animate-spin mx-auto mb-4" 
            style={{ animationDuration: '2s' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-[#DC2626] rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="text-2xl font-bold text-ink mb-2">
          Loading Portfolio
        </div>
        <div className="w-32 h-1 bg-ink/20 rounded-full mx-auto">
          <div className="h-full bg-[#DC2626] rounded-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;