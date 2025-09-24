import React, { useState, useEffect, useRef } from 'react';
import { Target, Eye, Heart, Users, Calendar, Award, Lightbulb, Globe, ArrowRight, Mail, Phone, MapPin, Rocket, Star, Video } from 'lucide-react';



const AboutPage = () => {
  return (
    <div className="min-h-screen bg-yellow-400 pt-16">
      {/* Mission, Vision, and Logo Section */}
      <section className="py-8 bg-gradient-to-b from-yellow-400 to-yellow-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-[#f1ee8e] rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="bg-yellow-400 rounded-full p-4 mr-4">
                    <Target className="h-8 w-8 text-black" />
                  </div>
                  <h2 className="text-3xl font-black text-black">Our Mission</h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  To bring every sector of the drone industry together on one unified platform Drone TV. We aim to offer new innovators a prominent space to showcase their ideas, deliver expert content from drone companies, and present in-depth insights from drone enthusiasts, industry speakers, and tech visionaries.
                </p>
              </div>
              <div className="bg-[#f1ee8e] rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="bg-yellow-400 rounded-full p-4 mr-4">
                    <Eye className="h-8 w-8 text-black" />
                  </div>
                  <h2 className="text-3xl font-black text-black">Our Vision</h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  To become the definitive global platform for showcasing drone innovation where every drone enthusiast, creator, and company has a voice. We envision a future where Drone TV stands as the trusted source for all things drones: from new technologies and speaker sessions to deep-dive interviews and public showcases.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-[#f1ee8e] rounded-3xl p-8 shadow-2xl flex flex-col items-center">
                <img
                  src="/images/Drone tv .in.png"
                  alt="Drone Technology"
                  className="w-72 h-72 object-contain rounded-2xl mb-6"
                />
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-black mb-4">Shaping Tomorrow's Technology</h3>
                  <p className="text-gray-600 mb-6">
                    Through comprehensive education and industry partnerships, we're building the foundation for the next generation of drone innovations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are and rest of new content */}
      <section className="py-12 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-black mb-6 tracking-tight">Who We Are</h1>
          <p className="text-lg text-black/80 mb-8">
            DroneTV is a leading, technology-driven platform dedicated to transforming the drone, GIS, and AI industries through education, innovation, and business collaboration. Our platform serves as a comprehensive hub for drone technology enthusiasts, professionals, and organizations across various sectors, including agriculture, infrastructure, security, environmental monitoring, and more.
          </p>
          <p className="text-lg text-black/80 mb-8">
            We empower businesses and individuals by providing high-quality content, industry insights, and the latest trends in drone technology. Through our platform, users can access educational resources, participate in global events, and collaborate with industry experts. Our mission is to foster the growth of the drone ecosystem by providing a centralized, reliable, and engaging platform for both new entrants and seasoned professionals.
          </p>
          <p className="text-lg text-black/80 mb-8">
            DroneTV offers a dynamic marketplace where verified drone companies and individual professionals can list their services, engage with clients, and promote their products. With a focus on quality and reliability, we ensure that all content and services delivered via our platform meet the highest industry standards.
          </p>
        </div>
      </section>

      <section className="py-12 bg-yellow-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-black mb-6 text-center">Key Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            <div className="bg-yellow-200 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-yellow-700 mb-2">100+</div>
              <div className="text-lg text-black">Active Industry Professionals</div>
            </div>
            <div className="bg-yellow-200 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-yellow-700 mb-2">500,000+</div>
              <div className="text-lg text-black">Monthly Platform Visitors</div>
            </div>
            <div className="bg-yellow-200 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-yellow-700 mb-2">50+</div>
              <div className="text-lg text-black">Drone-related Events and Expos Hosted</div>
            </div>
            <div className="bg-yellow-200 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-yellow-700 mb-2">10+</div>
              <div className="text-lg text-black">Countries Represented</div>
            </div>
            <div className="bg-yellow-200 rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-yellow-700 mb-2">200+</div>
              <div className="text-lg text-black">Verified Drone Companies</div>
            </div>
            <div className="bg-yellow-200 rounded-2xl p-6 shadow-lg">
              <div className="text-lg text-black">(As of September 2025)</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-b from-yellow-400 to-yellow-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-black mb-6 text-center">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-yellow-200 rounded-2xl p-6 shadow-lg">
              <div className="text-xl font-bold text-black mb-2">DEV.R</div>
              <div className="text-yellow-700 font-semibold">Managing Director & CEO</div>
            </div>
            <div className="bg-yellow-200 rounded-2xl p-6 shadow-lg">
              <div className="text-xl font-bold text-black mb-2">Vamsi Krishna</div>
              <div className="text-yellow-700 font-semibold">Director</div>
            </div>
            <div className="bg-yellow-200 rounded-2xl p-6 shadow-lg">
              <div className="text-xl font-bold text-black mb-2">Dr. Pranay Kumar</div>
              <div className="text-yellow-700 font-semibold">Marketing Director</div>
            </div>
            <div className="bg-yellow-200 rounded-2xl p-6 shadow-lg">
              <div className="text-xl font-bold text-black mb-2">D. Kamala</div>
              <div className="text-yellow-700 font-semibold">Chief Financial Officer</div>
            </div>
            <div className="bg-yellow-200 rounded-2xl p-6 shadow-lg">
              <div className="text-xl font-bold text-black mb-2">Preetham</div>
              <div className="text-yellow-700 font-semibold">Chief Business Officer - Singapore</div>
            </div>
            <div className="bg-yellow-200 rounded-2xl p-6 shadow-lg">
              <div className="text-xl font-bold text-black mb-2">Manasa</div>
              <div className="text-yellow-700 font-semibold">Chief Human Resources Officer</div>
            </div>
            <div className="bg-yellow-200 rounded-2xl p-6 shadow-lg">
              <div className="text-xl font-bold text-black mb-2">Nithin</div>
              <div className="text-yellow-700 font-semibold">Vice President - Engineering</div>
            </div>
            <div className="bg-yellow-200 rounded-2xl p-6 shadow-lg">
              <div className="text-xl font-bold text-black mb-2">Ram Mohan</div>
              <div className="text-yellow-700 font-semibold">General Counsel - Legal</div>
            </div>
            <div className="bg-yellow-200 rounded-2xl p-6 shadow-lg">
              <div className="text-xl font-bold text-black mb-2">Venkat Reddy</div>
              <div className="text-yellow-700 font-semibold">Company Secretary and Compliance Officer</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-yellow-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-black mb-6">Our Investors</h2>
          <p className="text-lg text-black mb-4">IPAGE UM SERVICES PVT LTD, SINGAPORE AND INDIA</p>
          <p className="text-lg text-black">For media queries, contact: <a href="mailto:press@dronetv.in" className="text-yellow-700 font-bold">press@dronetv.in</a></p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;