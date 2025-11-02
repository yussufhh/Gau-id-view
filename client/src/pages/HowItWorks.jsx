import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      icon: "�",
      title: "Access System",
      description: "Login with your university credentials through SSO authentication on the GAU student portal."
    },
    {
      number: "2", 
      icon: "📋",
      title: "Request ID",
      description: "Fill out the guided form with your details and upload your photo for ID creation or reissue."
    },
    {
      number: "3",
      icon: "📱",
      title: "Download ID",
      description: "Track your ID status and download your verified digital ID or printable PDF once approved."
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Dotted Pattern */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6">
            <svg width="60" height="60" viewBox="0 0 60 60" className="text-gray-400">
              {/* Create dotted pattern */}
              {[...Array(6)].map((_, row) => (
                [...Array(6)].map((_, col) => (
                  <circle
                    key={`${row}-${col}`}
                    cx={5 + col * 10}
                    cy={5 + row * 10}
                    r="1"
                    fill="currentColor"
                    opacity={Math.random() > 0.3 ? "0.6" : "0.2"}
                  />
                ))
              ))}
            </svg>
          </div>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Learn More About Process
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Simple and fast digital ID management for Garissa University students. Get your student ID online without queues or delays.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16 relative">
            {steps.map((item, index) => (
              <div key={index} className="text-center relative">
                {/* Step Number */}
                <div className="text-6xl font-light text-gray-200 mb-4">
                  {item.number}
                </div>

                {/* Icon Circle */}
                <div className="relative mb-8">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-2xl mx-auto relative z-10">
                    <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white">
                      {item.icon}
                    </div>
                  </div>
                  
                  {/* Zigzag connecting line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 transform translate-x-8 z-0">
                      <svg width="140" height="40" className="text-teal-400">
                        <path
                          d="M 0 20 Q 35 5 70 20 T 140 20"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray="8,4"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;