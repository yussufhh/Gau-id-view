
// src/components/Hero.js
import React from 'react';

const Hero = () => {
  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="max-w-lg">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Take the Next Step in
              <br />
              <span className="text-[#00923F]">Your Student ID</span>
              <br />
              With Exclusive Garissa
              <br />
              <span className="text-[#00923F]">University Digital System</span>
            </h1>
            
            <p className="text-base text-gray-600 mb-6 leading-relaxed">
              Experience seamless digital ID management offered by Garissa University. Secure 
              your future with instant access tailored for qualified students.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-6 py-3 bg-[#00923F] text-white rounded-md font-semibold hover:bg-[#007A33] transition-colors">
                Get Started
              </button>
              <button className="px-6 py-3 border-2 border-[#00923F] text-[#00923F] rounded-md font-semibold hover:bg-[#00923F] hover:text-white transition-colors">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative">
            <div className="bg-gray-200 rounded-2xl p-6 min-h-[300px] flex items-center justify-center">
              {/* Student ID Card Illustration */}
              <div className="relative">
                {/* Main ID Card */}
                <div className="bg-white rounded-xl shadow-lg p-4 w-56 h-36 border-4 border-[#00923F]">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#00923F] text-sm">GAU Student ID</h3>
                      <p className="text-xs text-gray-600">Digital Identity</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="h-1.5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-1.5 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-1.5 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <div className="w-6 h-6 bg-[#00923F] rounded opacity-20"></div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-[#00923F] rounded-full"></div>
                <div className="absolute top-8 -left-6 w-6 h-6 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;