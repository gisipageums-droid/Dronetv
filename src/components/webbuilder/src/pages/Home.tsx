import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-ink-light flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8 text-ink-charcoal">Portfolio Templates</h1>
        <div className="space-y-4">
          <Link
            to="/portfolio-template-1"
            className="inline-block bg-status-info hover:bg-status-info text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View Drone TV Portfolio Template
          </Link>
          <Link
            to="/portfolio-template-2"
            className="inline-block bg-status-success hover:bg-status-success text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View Drone TV Portfolio Template 2
          </Link>
          <Link
            to="/create-portfolio"
            className="inline-block bg-[#F8C400] hover:bg-[#F8C400]/90 text-ink font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Create Your Portfolio
          </Link>
          <Link
            to="/company-template-1"
            className="inline-block bg-status-error hover:bg-status-error text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View Company Template
          </Link>
          <Link
            to="/company-template-2"
            className="inline-block bg-brand-gold hover:bg-brand-gold text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View Company Template 2 (Dark)
          </Link>
          <Link
            to="/event-template-1"
            className="inline-block bg-brand-gold hover:bg-brand-gold text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View Event Template 1 (Conference)
          </Link>
          <Link
            to="/event-template-2"
            className="inline-block bg-status-error hover:bg-status-error text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View Event Template 2 (Expo)
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;