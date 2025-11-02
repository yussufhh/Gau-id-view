import React from 'react';

const Problems = () => {
  const challenges = [
    {
      icon: "⏰",
      title: "Manual & Time-Consuming Process",
      description: "Long queues, multiple office visits, and wasted time during manual ID processing",
      impact: "Hours of student time lost"
    },
    {
      icon: "🔄",
      title: "Frequent Delays & Poor Communication",
      description: "\"Come back tomorrow\" experiences with no progress tracking or notifications",
      impact: "Repeated unnecessary visits"
    },
    {
      icon: "🔍",
      title: "Unorganized ID Retrieval",
      description: "Manual searching through hundreds of printed cards, leading to mix-ups and losses",
      impact: "IDs lost or misplaced"
    },
    {
      icon: "👁️",
      title: "Lack of Transparency",
      description: "No way to track ID request progress or see who's handling the application",
      impact: "Zero visibility into process"
    },
    {
      icon: "💾",
      title: "No Centralized Database",
      description: "Student information scattered across departments and paper files",
      impact: "Data fragmentation & inefficiency"
    },
    {
      icon: "🔐",
      title: "Difficult Identity Verification",
      description: "Reliance on physical cards only, causing confusion with lost or damaged IDs",
      impact: "Security & access issues"
    },
    {
      icon: "📱",
      title: "High Rate of Lost IDs",
      description: "Students lose physical IDs before collection, replacement takes weeks",
      impact: "Service access disruption"
    },
    {
      icon: "🔗",
      title: "Limited System Integration",
      description: "ID process disconnected from student portal, library, and other university systems",
      impact: "Operational inefficiencies"
    },
    {
      icon: "🛡️",
      title: "Security & Privacy Concerns",
      description: "Manual record-keeping exposes data to unauthorized access and tampering",
      impact: "Data vulnerability risks"
    },
    {
      icon: "🔄",
      title: "No Real-Time Updates",
      description: "Student status changes not reflected automatically, causing errors and duplication",
      impact: "Outdated information chaos"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Problems We Solve
          </h2>
          <div className="w-20 h-1 bg-[#00923F] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            GAU-ID-View eliminates the pain points that have plagued Garissa University's 
            student ID system for years. No more queues, no more "come back tomorrow."
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {challenges.map((challenge, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-red-400">
              <div className="flex items-start space-x-4">
                <div className="text-3xl flex-shrink-0 mt-1">
                  {challenge.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {challenge.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    {challenge.description}
                  </p>
                  <div className="text-xs text-red-600 font-medium bg-red-50 px-3 py-1 rounded-full inline-block">
                    {challenge.impact}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Solution Summary */}
        <div className="bg-[#00923F] text-white rounded-2xl p-8 text-center">
          <h3 className="text-3xl font-bold mb-4">
            ✅ GAU-ID-View: The Complete Solution
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Our digital platform eliminates every single one of these challenges by automating 
            and streamlining the entire student ID lifecycle — from application to verification.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-white/20 px-4 py-2 rounded-full">No More Queues</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">Real-Time Tracking</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">Instant Notifications</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">Digital Verification</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">Secure & Transparent</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problems;