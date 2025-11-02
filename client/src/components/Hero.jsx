
// src/components/Hero.js
import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="relative bg-gradient-to-r from-[#00923F] to-[#007A33] text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            GAU-ID-View
            <span className="block text-xl md:text-2xl font-normal mt-2">
              Digitizing Garissa University Student ID Experience
            </span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-gray-100 leading-relaxed">
            Say goodbye to queues, delays, and lost IDs — manage your student ID online, instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-3 bg-white text-[#00923F] rounded-lg font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105 duration-200">
              Get Started
            </button>
            <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#00923F] transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
      
      {/* Student Illustration Placeholder */}
      <div className="absolute right-0 bottom-0 w-1/3 h-full hidden lg:flex items-end">
        <div className="w-full h-4/5 bg-gradient-to-t from-[#00923F] to-transparent rounded-tl-full">
          <div className="w-full h-full bg-gray-300 rounded-tl-full flex items-center justify-center">
            <span className="text-gray-500">Student Illustration</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;