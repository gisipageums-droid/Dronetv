import React from 'react';
import { CheckCircle, Globe, Mail, Download, ExternalLink } from 'lucide-react';

interface SuccessPageProps {
  formData: any;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ formData }) => {
  const websiteUrl = `https://${formData.companyName?.toLowerCase().replace(/\s+/g, '-')}.dronetv.com`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            🎉 Website Generated Successfully!
          </h1>
          <p className="text-xl text-slate-600">
            Your AI-powered website is now live and ready to showcase your business
          </p>
        </div>

        {/* Website Preview Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{formData.companyName}</h2>
              <p className="text-slate-600">Your new website is live!</p>
            </div>
            <Globe className="w-12 h-12 text-blue-600" />
          </div>

          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">Website URL:</span>
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                {websiteUrl}
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Globe className="w-5 h-5 mr-2" />
              View Website
            </button>
            <button className="flex items-center justify-center px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors">
              <Download className="w-5 h-5 mr-2" />
              Download Assets
            </button>
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4">What's Included in Your Website:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-800">Professional Design</h4>
                <p className="text-slate-600 text-sm">Modern, responsive design optimized for all devices</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-800">SEO Optimized</h4>
                <p className="text-slate-600 text-sm">Search engine friendly with meta tags and structure</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-800">Contact Forms</h4>
                <p className="text-slate-600 text-sm">Lead generation forms connected to your email</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-800">Social Integration</h4>
                <p className="text-slate-600 text-sm">Connected to your social media profiles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-8">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Next Steps:</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-blue-800">Check your email for login credentials and additional resources</span>
            </div>
            <div className="flex items-center">
              <Globe className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-blue-800">Share your new website with customers and partners</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-blue-800">Monitor your website analytics and lead generation</span>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="text-center mt-8">
          <p className="text-slate-600">
            Need help or have questions? Contact our support team at{' '}
            <a href="mailto:support@dronetv.com" className="text-blue-600 hover:text-blue-700">
              support@dronetv.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};