import React from 'react';
import { Zap } from 'lucide-react';

const Preloader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#FFD400] flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 border-4 border-ink/20 rounded-full animate-spin">
            <div className="absolute inset-2 bg-[#FF0000] rounded-full flex items-center justify-center animate-pulse">
              <Zap size={32} className="text-white" />
            </div>
          </div>
          <div
            className="absolute inset-0 w-24 h-24 border-t-4 border-[#FF0000] rounded-full animate-spin"
            style={{ animationDuration: '1s' }}
          ></div>
        </div>

        <div className="text-3xl font-bold text-ink mb-4">
          Drone<span className="text-[#FF0000]">TV</span>
        </div>

        <div className="text-lg text-ink/80 mb-6">Loading Portfolio...</div>

        <div className="w-48 h-2 bg-ink/20 rounded-full mx-auto overflow-hidden">
          <div
            className="h-full bg-[#FF0000] rounded-full animate-pulse"
            style={{
              width: '100%',
              animation: 'loading 2s ease-in-out',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
