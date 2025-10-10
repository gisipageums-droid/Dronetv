import React from 'react';
import { Upload } from 'lucide-react';

const Publish: React.FC = () => {
  return (
    <div className="fixed bottom-14 right-6 z-50">
      <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300">
        <Upload size={18} />
        <span>Publish</span>
      </button>
    </div>
  );
};

export default Publish;
