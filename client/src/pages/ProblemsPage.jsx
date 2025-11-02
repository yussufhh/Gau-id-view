import React from 'react';

const ProblemsPage = () => {
  const challengeDetails = [
    {
      id: 1,
      icon: "⏰",
      title: "Manual & Time-Consuming ID Issuance Process",
      description: "The existing process for student ID creation is fully manual, requiring students to visit multiple offices physically.",
      impacts: [
        "Students face long queues at help desk, especially during registration periods",
        "Manual steps waste time and cause frustration for both students and staff",
        "Multiple office visits required for a single ID request",
        "No appointment system leads to unpredictable waiting times"
      ],
      solution: "Complete digital workflow eliminates physical visits and queues"
    },
    {
      id: 2, 
      icon: "🔄",
      title: "Frequent Delays and Inconsistent Communication",
      description: "Common experiences like 'Come back tomorrow,' 'Try next week,' 'Come back on Tuesday or Friday' reflect inefficiency.",
      impacts: [
        "Students are rarely notified when their IDs are ready",
        "Repeated visits to ID office due to lack of communication",
        "No digital notification or progress-tracking mechanism",
        "Inconsistent information from different staff members"
      ],
      solution: "Real-time notifications via SMS, email, and dashboard updates"
    },
    {
      id: 3,
      icon: "🔍", 
      title: "Unorganized ID Retrieval and Searching Issues",
      description: "When IDs are ready, students must search through hundreds of printed cards at the help desk.",
      impacts: [
        "Manual searching wastes time and increases errors",
        "Causes unnecessary crowding at help desk",
        "IDs get misplaced, mixed up, or lost during manual handling",
        "No systematic organization of completed IDs"
      ],
      solution: "Digital delivery system with organized database and search functionality"
    },
    {
      id: 4,
      icon: "👁️",
      title: "Lack of Transparency and Status Visibility", 
      description: "Students have no way to check progress or see who is handling their ID request.",
      impacts: [
        "No centralized dashboard to track pending, approved, or printed IDs",
        "Administrative confusion about request status",
        "Results in inefficiency and mistrust in the system",
        "Students can't plan around ID availability"
      ],
      solution: "Live tracking dashboard with complete process transparency"
    },
    {
      id: 5,
      icon: "💾",
      title: "No Centralized Digital Database",
      description: "Student ID information is scattered across departments, paper files, and emails.",
      impacts: [
        "No secure central database for instant information retrieval",
        "Administrators waste time locating data manually",
        "Inconsistent record keeping across departments",
        "Difficulty in confirming student records"
      ],
      solution: "Secure, centralized database with instant access and synchronization"
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Challenges We're Solving
          </h1>
          <div className="w-20 h-1 bg-[#00923F] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            GAU-ID-View addresses the critical pain points that have made student ID 
            management at Garissa University inefficient, frustrating, and time-consuming.
          </p>
        </div>

        {/* Challenge Details */}
        <div className="space-y-12 mb-16">
          {challengeDetails.map((challenge, index) => (
            <div key={challenge.id} className="bg-gray-50 rounded-2xl p-8">
              <div className="flex items-start space-x-6">
                <div className="text-4xl flex-shrink-0 bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-md">
                  {challenge.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    {challenge.id}. {challenge.title}
                  </h2>
                  <p className="text-gray-600 mb-6 text-lg">
                    {challenge.description}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-red-600 mb-3 flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        Current Problems:
                      </h4>
                      <ul className="space-y-2">
                        {challenge.impacts.map((impact, idx) => (
                          <li key={idx} className="text-gray-600 text-sm flex items-start">
                            <span className="text-red-400 mr-2 flex-shrink-0">•</span>
                            {impact}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#00923F] mb-3 flex items-center">
                        <span className="w-2 h-2 bg-[#00923F] rounded-full mr-2"></span>
                        Our Solution:
                      </h4>
                      <p className="text-gray-700 bg-green-50 p-4 rounded-lg text-sm">
                        {challenge.solution}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Challenges Summary */}
        <div className="bg-[#00923F] text-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Additional Challenges Addressed</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl mb-2">🔐</div>
              <h4 className="font-semibold mb-2">Identity Verification Issues</h4>
              <p className="text-sm opacity-90">Physical-card-only verification causes confusion with lost or damaged IDs</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📱</div>
              <h4 className="font-semibold mb-2">High Loss Rate</h4>
              <p className="text-sm opacity-90">Students lose physical IDs before collection, replacement takes weeks</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🔗</div>
              <h4 className="font-semibold mb-2">Limited Integration</h4>
              <p className="text-sm opacity-90">ID process disconnected from student portal and university systems</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🛡️</div>
              <h4 className="font-semibold mb-2">Security Concerns</h4>
              <p className="text-sm opacity-90">Manual record-keeping exposes data to unauthorized access and tampering</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🔄</div>
              <h4 className="font-semibold mb-2">No Real-Time Updates</h4>
              <p className="text-sm opacity-90">Student status changes not reflected automatically in ID records</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-semibold mb-2">Complete Solution</h4>
              <p className="text-sm opacity-90">GAU-ID-View eliminates ALL these problems with digital automation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsPage;