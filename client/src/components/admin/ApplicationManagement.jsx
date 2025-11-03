import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Trash2,
  Download,
  Calendar,
  User,
  FileText,
  AlertCircle,
  Clock,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([
    {
      id: 'APP-2024-156',
      studentName: 'John Kamau Doe',
      admissionNumber: 'S110/2099/23',
      email: 'john.doe@student.gau.ac.ke',
      course: 'Bachelor of Computer Science',
      department: 'Computer Science',
      yearOfStudy: 'Year 3',
      submittedDate: '2024-11-03T10:30:00',
      status: 'pending',
      priority: 'normal',
      documents: {
        passportPhoto: { status: 'verified', url: '/docs/photo1.jpg' },
        nationalId: { status: 'pending', url: '/docs/id1.pdf' },
        admissionLetter: { status: 'verified', url: '/docs/admission1.pdf' }
      },
      phoneNumber: '+254 712 345 678',
      dateOfBirth: '1998-05-15'
    },
    {
      id: 'APP-2024-155',
      studentName: 'Mary Njeri Mwangi',
      admissionNumber: 'S110/2088/23',
      email: 'mary.mwangi@student.gau.ac.ke',
      course: 'Bachelor of Business Administration',
      department: 'Business',
      yearOfStudy: 'Year 2',
      submittedDate: '2024-11-03T09:15:00',
      status: 'reviewing',
      priority: 'high',
      documents: {
        passportPhoto: { status: 'verified', url: '/docs/photo2.jpg' },
        nationalId: { status: 'verified', url: '/docs/id2.pdf' },
        admissionLetter: { status: 'rejected', url: '/docs/admission2.pdf', reason: 'Poor image quality' }
      },
      phoneNumber: '+254 722 987 654',
      dateOfBirth: '1999-08-22'
    },
    {
      id: 'APP-2024-154',
      studentName: 'David Ochieng Otieno',
      admissionNumber: 'S110/2077/23',
      email: 'david.otieno@student.gau.ac.ke',
      course: 'Bachelor of Education',
      department: 'Education',
      yearOfStudy: 'Year 4',
      submittedDate: '2024-11-02T16:45:00',
      status: 'approved',
      priority: 'normal',
      documents: {
        passportPhoto: { status: 'verified', url: '/docs/photo3.jpg' },
        nationalId: { status: 'verified', url: '/docs/id3.pdf' },
        admissionLetter: { status: 'verified', url: '/docs/admission3.pdf' }
      },
      phoneNumber: '+254 733 456 789',
      dateOfBirth: '1997-12-10'
    }
  ]);

  const [filteredApplications, setFilteredApplications] = useState(applications);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [viewingApplication, setViewingApplication] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    let filtered = applications;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  }, [searchTerm, statusFilter, applications]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'ready': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const handleApprove = async (applicationId) => {
    try {
      // Simulate API call
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'approved' }
          : app
      ));
      alert('Application approved successfully!');
    } catch (error) {
      alert('Error approving application');
    }
  };

  const handleReject = async (applicationId, reason) => {
    try {
      // Simulate API call
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'rejected', rejectReason: reason }
          : app
      ));
      setShowRejectModal(null);
      setRejectReason('');
      alert('Application rejected successfully!');
    } catch (error) {
      alert('Error rejecting application');
    }
  };

  const handleBulkApprove = () => {
    setApplications(prev => prev.map(app => 
      selectedApplications.includes(app.id)
        ? { ...app, status: 'approved' }
        : app
    ));
    setSelectedApplications([]);
    alert(`${selectedApplications.length} applications approved successfully!`);
  };

  const toggleSelection = (applicationId) => {
    setSelectedApplications(prev => 
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const selectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(app => app.id));
    }
  };

  const ApplicationDetailModal = ({ application, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Application Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XCircle className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Student Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-gray-800 font-medium">{application.studentName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Admission Number</label>
                <p className="text-gray-800 font-medium">{application.admissionNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-800">{application.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone Number</label>
                <p className="text-gray-800">{application.phoneNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Course</label>
                <p className="text-gray-800">{application.course}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Department</label>
                <p className="text-gray-800">{application.department}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Year of Study</label>
                <p className="text-gray-800">{application.yearOfStudy}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="text-gray-800">{new Date(application.dateOfBirth).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Documents</h3>
            <div className="space-y-4">
              {Object.entries(application.documents).map(([docType, doc]) => (
                <div key={docType} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-800">
                        {docType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                      {doc.reason && (
                        <p className="text-sm text-red-600">Reason: {doc.reason}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => handleApprove(application.id)}
              disabled={application.status === 'approved'}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <CheckCircle className="w-5 h-5 inline mr-2" />
              Approve Application
            </button>
            <button
              onClick={() => setShowRejectModal(application.id)}
              disabled={application.status === 'rejected'}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <XCircle className="w-5 h-5 inline mr-2" />
              Reject Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const RejectModal = ({ applicationId, onClose, onReject }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Reject Application</h3>
        <p className="text-gray-600 mb-4">Please provide a reason for rejecting this application:</p>
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
          placeholder="Enter rejection reason..."
        />
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onReject(applicationId, rejectReason)}
            disabled={!rejectReason.trim()}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Application Management</h1>
            <p className="text-gray-600">Review and process student ID applications</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 text-[#00923F] border border-[#00923F] rounded-lg hover:bg-[#00923F] hover:text-white transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, admission number, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="ready">Ready for Collection</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedApplications.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                {selectedApplications.length} application(s) selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handleBulkApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Bulk Approve
                </button>
                <button
                  onClick={() => setSelectedApplications([])}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedApplications.length === filteredApplications.length}
                    onChange={selectAll}
                    className="w-4 h-4 text-[#00923F] border-gray-300 rounded focus:ring-[#00923F]"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course & Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedApplications.includes(application.id)}
                      onChange={() => toggleSelection(application.id)}
                      className="w-4 h-4 text-[#00923F] border-gray-300 rounded focus:ring-[#00923F]"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#00923F] rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {application.studentName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{application.studentName}</div>
                        <div className="text-sm text-gray-500">{application.admissionNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application.course}</div>
                    <div className="text-sm text-gray-500">{application.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(application.submittedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getPriorityColor(application.priority)}`}>
                      {application.priority.charAt(0).toUpperCase() + application.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewingApplication(application)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleApprove(application.id)}
                        disabled={application.status === 'approved'}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowRejectModal(application.id)}
                        disabled={application.status === 'rejected'}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No applications found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No student applications have been submitted yet.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {viewingApplication && (
        <ApplicationDetailModal
          application={viewingApplication}
          onClose={() => setViewingApplication(null)}
        />
      )}

      {showRejectModal && (
        <RejectModal
          applicationId={showRejectModal}
          onClose={() => setShowRejectModal(null)}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default ApplicationManagement;