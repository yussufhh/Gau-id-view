import React from 'react';

const About = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            About GAU-ID-View
          </h1>
          <div className="prose prose-lg mx-auto">
            <p className="text-lg text-gray-600 mb-6">
              GAU-ID-View is a revolutionary digital platform designed to modernize 
              Garissa University's student identification system. Our mission is to 
              eliminate the inefficiencies of manual ID processing and create a 
              seamless digital experience for all students.
            </p>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 mb-6">
              To create a fully digital, automated, and user-friendly student ID 
              management system that integrates seamlessly with the university's 
              existing infrastructure.
            </p>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Challenges We Address</h2>
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">🕒 Process Issues</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Manual and time-consuming ID issuance</li>
                    <li>• Long queues and multiple office visits</li>
                    <li>• Frequent delays with poor communication</li>
                    <li>• "Come back tomorrow" experiences</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">🔍 Organization Problems</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Unorganized ID retrieval process</li>
                    <li>• Manual searching through hundreds of cards</li>
                    <li>• High rate of lost or misplaced IDs</li>
                    <li>• No centralized digital database</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">👁️ Transparency Issues</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Lack of progress tracking visibility</li>
                    <li>• No real-time status updates</li>
                    <li>• Difficult identity verification</li>
                    <li>• Limited system integration</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">🛡️ Security Concerns</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Data privacy and security risks</li>
                    <li>• Manual record-keeping vulnerabilities</li>
                    <li>• Unauthorized access possibilities</li>
                    <li>• No audit tracking mechanisms</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Solution Benefits</h2>
            <ul className="text-gray-600 space-y-2">
              <li>• <strong>Eliminates queues:</strong> Complete online process from application to download</li>
              <li>• <strong>Real-time tracking:</strong> Students can monitor their ID status 24/7</li>
              <li>• <strong>Instant notifications:</strong> Automated alerts via email and SMS</li>
              <li>• <strong>Digital verification:</strong> QR codes and online validation systems</li>
              <li>• <strong>Secure database:</strong> Encrypted, centralized student information</li>
              <li>• <strong>System integration:</strong> Connected to university portal and services</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;