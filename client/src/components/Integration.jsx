
// src/components/Integration.js
import React from 'react';

const Integration = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Integration with Garissa University Portal
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              GAU-ID-View will be seamlessly integrated into the university's main website 
              and student portal for single sign-on (SSO) access. No additional passwords 
              to remember — use your existing university credentials.
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#00923F] rounded-full mr-3"></span>
                Single Sign-On (SSO) with university credentials
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#00923F] rounded-full mr-3"></span>
                Real-time data synchronization
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#00923F] rounded-full mr-3"></span>
                Secure API integration
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#00923F] rounded-full mr-3"></span>
                Automated student data validation
              </li>
            </ul>
          </div>
          
          <div className="bg-[#F5F5F5] rounded-2xl p-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-100 rounded mt-8 flex items-center justify-center">
                  <span className="text-gray-400">University Portal Mockup</span>
                </div>
                <div className="h-10 bg-[#00923F] rounded mt-6 flex items-center justify-center text-white font-semibold">
                  Login with University Account
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integration;