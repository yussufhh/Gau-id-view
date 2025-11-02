import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Create an Account & Log In",
      description: "Create an account and log in with your credentials to access the GAU-ID-View platform securely."
    },
    {
      number: "2", 
      title: "Complete the Application form",
      description: "Navigate to the Application form and fill in all the required details including your photo upload."
    },
    {
      number: "3",
      title: "Download & Access Your ID",
      description: "Track your ID status and download your verified digital ID or printable PDF once approved."
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How does it work?
          </h1>
          <p className="text-gray-600 text-lg">
            Our Application will help you from start to finish
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 relative">
            {steps.map((item, index) => (
              <div key={index} className="text-center relative">
                {/* Number Circle */}
                <div className="relative mb-8">
                  <div className="w-16 h-16 border-3 border-[#00923F] rounded-full flex items-center justify-center text-xl font-bold text-[#00923F] mx-auto relative z-10 bg-white">
                    {item.number}
                  </div>
                  
                  {/* Dotted connecting line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 z-0" style={{width: 'calc(100% + 3rem)', transform: 'translateX(2rem)'}}>
                      <div className="w-full border-t-2 border-dotted border-gray-400"></div>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
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