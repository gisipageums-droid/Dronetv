import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { CheckCircle, Globe, Mail, Download, ExternalLink } from 'lucide-react';
import { useAuth } from '../../../../../../context/context';
import { COMPANY_API, LAMBDA } from '../../../../../../../lib/apiConfig';

interface SuccessPageProps {
  formData: any;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ formData }) => {
  const websiteUrl = `https://${formData.companyName?.toLowerCase().replace(/\s+/g, '-')}.dronetv.com`;

  const [isloading, setisloading]= useState(false);

  const { draftDetails, setAIGenData, AIGenData } = useAuth();
  const navigate = useNavigate(); // Use the useNavigate hook

  const API = COMPANY_API ? `${COMPANY_API}/api/draft` : `${LAMBDA.companyDraft}/api/draft`;
//  const Dummyapi = COMPANY_API ? `${COMPANY_API}/api/draft/alok-12345/draft-alok-aerospace-2025-002?template=template-2` : `${LAMBDA.companyDraft}/api/draft/alok-12345/draft-alok-aerospace-2025-002?template=template-2`;
  async function handleClick() {
    try {
      const response = await fetch(`${API}/${draftDetails.userId}/${draftDetails.draftId}?template=template-${draftDetails.templateSelection}`);
      // const response = await fetch(`${Dummyapi}`);
      
      const data = await response.json();
      if (response.ok) {
        
        // console.log("data: ",data);
        
        setisloading(!isloading)
        // Use navigate function instead of Navigate component
        setTimeout(() => {
          setAIGenData(data);
          navigate("/edit/template/t2");
        }, 3000);

        
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-status-success/10 to-status-info/10 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-status-success rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-ink mb-2">
            🎉 Website Generated Successfully!
          </h1>
          <p className="text-xl text-ink-paragraph">
            Your AI-powered website is now live and ready to showcase your business
          </p>
        </div>

        {/* Website Preview Card */}
        <div className="bg-surface-card rounded-xl shadow-lg border border-ink-light p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-ink">{formData.companyName}</h2>
              <p className="text-ink-paragraph">Your new website is live!</p>
            </div>
            <Globe className="w-12 h-12 text-status-info" />
          </div>

          <div className="bg-ink-offwhite rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-ink-paragraph font-medium">Website URL:</span>
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-status-info hover:text-status-info font-medium"
              >
                {websiteUrl}
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center px-6 py-3 bg-status-info text-white rounded-lg hover:bg-status-info transition-colors"
            onClick={handleClick}
            >
              <Globe className="w-5 h-5 mr-2" />
              {isloading?"loading...":"View Website"}
              
            </button>
            <button className="flex items-center justify-center px-6 py-3 bg-ink-light text-ink-paragraph rounded-lg hover:bg-ink-light transition-colors"
            
            >
              <Download className="w-5 h-5 mr-2" />
              Download Assets
            </button>
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-surface-card rounded-xl shadow-lg border border-ink-light p-8 mb-8">
          <h3 className="text-xl font-bold text-ink mb-4">What's Included in Your Website:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-status-success mr-3 mt-0.5" />
              <div>
                <h4 className="font-semibold text-ink-charcoal">Professional Design</h4>
                <p className="text-ink-paragraph text-sm">Modern, responsive design optimized for all devices</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-status-success mr-3 mt-0.5" />
              <div>
                <h4 className="font-semibold text-ink-charcoal">SEO Optimized</h4>
                <p className="text-ink-paragraph text-sm">Search engine friendly with meta tags and structure</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-status-success mr-3 mt-0.5" />
              <div>
                <h4 className="font-semibold text-ink-charcoal">Contact Forms</h4>
                <p className="text-ink-paragraph text-sm">Lead generation forms connected to your email</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-status-success mr-3 mt-0.5" />
              <div>
                <h4 className="font-semibold text-ink-charcoal">Social Integration</h4>
                <p className="text-ink-paragraph text-sm">Connected to your social media profiles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-status-info/10 rounded-xl border border-status-info/25 p-8">
          <h3 className="text-xl font-bold text-status-info mb-4">Next Steps:</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-status-info mr-3" />
              <span className="text-status-info">Check your email for login credentials and additional resources</span>
            </div>
            <div className="flex items-center">
              <Globe className="w-5 h-5 text-status-info mr-3" />
              <span className="text-status-info">Share your new website with customers and partners</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-status-info mr-3" />
              <span className="text-status-info">Monitor your website analytics and lead generation</span>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="text-center mt-8">
          <p className="text-ink-paragraph">
            Need help or have questions? Contact our support team at{' '}
            <a href="mailto:support@dronetv.com" className="text-status-info hover:text-status-info">
              support@dronetv.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};