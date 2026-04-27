import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Portfolio Templates</h1>
        <div className="space-y-4">
          <Link
            to="/portfolio-template-1"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View Drone TV Portfolio Template
          </Link>
          <Link
            to="/portfolio-template-2"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View Drone TV Portfolio Template 2
          </Link>
          <Link
            to="/create-portfolio"
            className="inline-block bg-[#FFD400] hover:bg-[#FFD400]/90 text-black font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Create Your Portfolio
          </Link>
          <Link
            to="/company-template-1"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View Company Template
          </Link>
          <Link
            to="/company-template-2"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View Company Template 2 (Dark)
          </Link>
          <Link
            to="/event-template-1"
            className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View Event Template 1 (Conference)
          </Link>
          <Link
            to="/event-template-2"
            className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View Event Template 2 (Expo)
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;