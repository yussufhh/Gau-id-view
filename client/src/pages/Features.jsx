import React from 'react';

const Features = () => {
  const features = [
    {
      title: "Digital ID Access",
      description: "Access your student ID digitally anytime, anywhere",
      icon: "📱"
    },
    {
      title: "Real-time Updates", 
      description: "Get instant notifications about your ID status",
      icon: "🔄"
    },
    {
      title: "Secure Verification",
      description: "Advanced security measures protect your information",
      icon: "🔒"
    },
    {
      title: "Mobile Friendly",
      description: "Optimized for all devices - desktop, tablet, and mobile",
      icon: "📲"
    },
    {
      title: "SSO Integration",
      description: "Single sign-on with your university credentials",
      icon: "🔐"
    },
    {
      title: "24/7 Availability",
      description: "Access your ID information around the clock",
      icon: "🕰️"
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Platform Features
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the powerful features that make GAU-ID-View the ultimate 
            solution for digital student ID management.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;