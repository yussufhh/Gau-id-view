import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText, 
  User, 
  Camera,
  Download,
  RefreshCw,
  Calendar,
  MessageSquare
} from 'lucide-react';

const ApplicationTracking = () => {
  const [applications, setApplications] = useState([
    {
      id: 'APP-2024-001',
      submittedDate: '2024-01-15',
      status: 'Under Review',
      statusCode: 'reviewing',
      estimatedCompletion: '2024-01-22',
      documents: [
        { name: 'Passport Photo', status: 'approved', uploadedDate: '2024-01-15' },
        { name: 'National ID Copy', status: 'approved', uploadedDate: '2024-01-15' },
        { name: 'Admission Letter', status: 'pending', uploadedDate: '2024-01-15' }
      ],
      timeline: [
        { 
          status: 'Application Submitted', 
          date: '2024-01-15', 
          time: '10:30 AM',
          completed: true,
          description: 'Your application has been successfully submitted'
        },
        { 
          status: 'Document Verification', 
          date: '2024-01-16', 
          time: '02:15 PM',
          completed: true,
          description: 'Documents are being verified by our team'
        },
        { 
          status: 'Under Review', 
          date: '2024-01-17', 
          time: '09:00 AM',
          completed: true,
          description: 'Application is currently under administrative review'
        },
        { 
          status: 'ID Card Production', 
          date: 'Pending', 
          time: '',
          completed: false,
          description: 'ID card will be produced after approval'
        },
        { 
          status: 'Ready for Collection', 
          date: 'Pending', 
          time: '',
          completed: false,
          description: 'ID card will be ready for collection'
        }
      ],
      comments: [
        {
          date: '2024-01-17',
          time: '11:30 AM',
          author: 'Admin Office',
          message: 'Please ensure your admission letter is clearly visible. We may need a higher resolution copy.'
        }
      ]
    }
  ]);

  const [selectedApplication, setSelectedApplication] = useState(applications[0]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'reviewing': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'pending': return Clock;
      case 'rejected': return AlertCircle;
      case 'reviewing': return RefreshCw;
      default: return Clock;
    }
  };

  const StatusBadge = ({ status, label }) => {
    const Icon = getStatusIcon(status);
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
        <Icon className="w-4 h-4 mr-1" />
        {label}
      </span>
    );
  };

  const ProgressStepper = ({ timeline }) => (
    <div className="space-y-4">
      {timeline.map((step, index) => (
        <div key={index} className="flex items-start space-x-4">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
            step.completed 
              ? 'bg-[#00923F] border-[#00923F] text-white' 
              : 'border-gray-300 bg-white text-gray-400'
          }`}>
            {step.completed ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <span className="text-sm font-medium">{index + 1}</span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className={`text-sm font-medium ${
                step.completed ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.status}
              </h4>
              {step.date !== 'Pending' && (
                <span className="text-xs text-gray-500">
                  {step.date} {step.time}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Application Tracking</h1>
          <button className="flex items-center space-x-2 px-4 py-2 text-[#00923F] border border-[#00923F] rounded-lg hover:bg-[#00923F] hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Status</span>
          </button>
        </div>

        {/* Application Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-[#00923F]" />
              <div>
                <p className="text-sm text-gray-600">Application ID</p>
                <p className="font-semibold text-gray-800">{selectedApplication.id}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="font-semibold text-gray-800">{selectedApplication.submittedDate}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Estimated Completion</p>
                <p className="font-semibold text-gray-800">{selectedApplication.estimatedCompletion}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8">
                <StatusBadge 
                  status={selectedApplication.statusCode} 
                  label="" 
                />
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold text-gray-800">{selectedApplication.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Timeline */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Application Progress</h2>
          <ProgressStepper timeline={selectedApplication.timeline} />
        </div>

        {/* Document Status */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Document Status</h2>
          <div className="space-y-4">
            {selectedApplication.documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{doc.name}</p>
                    <p className="text-sm text-gray-600">Uploaded: {doc.uploadedDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusBadge status={doc.status} label={doc.status.charAt(0).toUpperCase() + doc.status.slice(1)} />
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">Document Requirements</h4>
                <p className="text-sm text-blue-700 mt-1">
                  All documents must be clear and legible. If any document is rejected, 
                  you will need to re-upload a better quality version.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments/Messages */}
      {selectedApplication.comments && selectedApplication.comments.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <MessageSquare className="w-6 h-6 mr-2" />
            Messages from Admin Office
          </h2>
          <div className="space-y-4">
            {selectedApplication.comments.map((comment, index) => (
              <div key={index} className="border-l-4 border-[#00923F] pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{comment.author}</span>
                  <span className="text-sm text-gray-500">{comment.date} {comment.time}</span>
                </div>
                <p className="text-gray-700">{comment.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Available Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 border-2 border-[#00923F] text-[#00923F] rounded-lg hover:bg-[#00923F] hover:text-white transition-colors">
            <Download className="w-5 h-5" />
            <span>Download Receipt</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 p-4 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">
            <MessageSquare className="w-5 h-5" />
            <span>Contact Support</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 p-4 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            <FileText className="w-5 h-5" />
            <span>Update Documents</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationTracking;