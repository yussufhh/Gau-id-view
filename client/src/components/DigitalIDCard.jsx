import React, { useState } from 'react';
import { 
  Download, 
  Share2, 
  QrCode, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  Shield,
  Printer,
  Eye,
  EyeOff
} from 'lucide-react';
import logo from '../assets/logo.png';

const DigitalIDCard = () => {
  const [showBackside, setShowBackside] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Mock student data - in real app, this would come from API
  const studentData = {
    name: 'JOHN KAMAU DOE',
    admissionNumber: 'S110/2099/23',
    course: 'Bachelor of Computer Science',
    department: 'Computer Science',
    yearOfStudy: 'Year 3',
    email: 'john.doe@student.gau.ac.ke',
    phone: '+254 712 345 678',
    dateOfBirth: '1998-05-15',
    nationalId: '32******89',
    address: 'Garissa, Kenya',
    issueDate: '2024-01-20',
    expiryDate: '2025-12-31',
    cardNumber: 'GAU2024001234',
    photo: '/api/placeholder/150/200' // This would be actual photo in real app
  };

  const IDCardFront = () => (
    <div className="w-full h-full bg-gradient-to-br from-[#00923F] via-[#00923F] to-[#007A33] rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full border-2 border-white transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full border-2 border-white transform -translate-x-12 translate-y-12"></div>
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="GAU Logo" className="w-8 h-8" />
          <div>
            <h3 className="font-bold text-sm">GARISSA UNIVERSITY</h3>
            <p className="text-xs opacity-90">Student ID Card</p>
          </div>
        </div>
        <div className="text-xs opacity-75">
          <p>{studentData.cardNumber}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex space-x-4 h-full">
        {/* Photo */}
        <div className="w-24 h-32 bg-white rounded-lg flex items-center justify-center overflow-hidden">
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>
        </div>

        {/* Student Info */}
        <div className="flex-1 space-y-2">
          <div>
            <h2 className="font-bold text-lg leading-tight">{studentData.name}</h2>
            <p className="text-sm opacity-90">{studentData.admissionNumber}</p>
          </div>
          
          <div className="space-y-1 text-sm">
            <p className="opacity-90">{studentData.course}</p>
            <p className="opacity-90">{studentData.department}</p>
            <p className="opacity-90">{studentData.yearOfStudy}</p>
          </div>

          <div className="text-xs opacity-75 mt-4">
            <p>Valid Until: {new Date(studentData.expiryDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Security strip */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
    </div>
  );

  const IDCardBack = () => (
    <div className="w-full h-full bg-white rounded-2xl p-6 border border-gray-200 relative overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="GAU Logo" className="w-6 h-6" />
          <h3 className="font-bold text-sm text-[#00923F]">Student Information</h3>
        </div>
      </div>

      {/* Student Details */}
      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{studentData.email}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{studentData.phone}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">DOB: {new Date(studentData.dateOfBirth).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">National ID: {studentData.nationalId}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{studentData.address}</span>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mt-6">
          <div className="w-20 h-20 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
            <QrCode className="w-12 h-12 text-gray-400" />
          </div>
        </div>

        {/* Issue Info */}
        <div className="text-xs text-gray-500 text-center mt-4 pt-4 border-t border-gray-200">
          <p>Issued: {new Date(studentData.issueDate).toLocaleDateString()}</p>
          <p>Expires: {new Date(studentData.expiryDate).toLocaleDateString()}</p>
          <p className="mt-2 text-[#00923F]">This card remains property of Garissa University</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Digital ID</h1>
            <p className="text-gray-600 mt-1">Your official Garissa University student identification</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              Active
            </span>
          </div>
        </div>
      </div>

      {/* ID Card Display */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Digital ID Card</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowBackside(!showBackside)}
              className="flex items-center space-x-2 px-4 py-2 text-[#00923F] border border-[#00923F] rounded-lg hover:bg-[#00923F] hover:text-white transition-colors"
            >
              {showBackside ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showBackside ? 'Show Front' : 'Show Back'}</span>
            </button>
          </div>
        </div>

        {/* Card Container */}
        <div className="flex justify-center">
          <div className="w-80 h-52 perspective-1000">
            <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
              showBackside ? 'rotate-y-180' : ''
            }`}>
              {/* Front Side */}
              <div className="absolute inset-0 backface-hidden">
                <IDCardFront />
              </div>
              
              {/* Back Side */}
              <div className="absolute inset-0 backface-hidden rotate-y-180">
                <IDCardBack />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Card Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center space-y-2 p-4 border-2 border-[#00923F] text-[#00923F] rounded-lg hover:bg-[#00923F] hover:text-white transition-colors">
            <Download className="w-6 h-6" />
            <span className="text-sm font-medium">Download PDF</span>
          </button>
          
          <button className="flex flex-col items-center space-y-2 p-4 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">
            <Printer className="w-6 h-6" />
            <span className="text-sm font-medium">Print Card</span>
          </button>
          
          <button 
            onClick={() => setShowQR(!showQR)}
            className="flex flex-col items-center space-y-2 p-4 border-2 border-purple-500 text-purple-500 rounded-lg hover:bg-purple-500 hover:text-white transition-colors"
          >
            <QrCode className="w-6 h-6" />
            <span className="text-sm font-medium">Show QR Code</span>
          </button>
          
          <button className="flex flex-col items-center space-y-2 p-4 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            <Share2 className="w-6 h-6" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Student Verification QR</h3>
              <div className="w-64 h-64 bg-gray-100 border border-gray-300 rounded-lg mx-auto flex items-center justify-center mb-4">
                <QrCode className="w-32 h-32 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Scan this QR code to verify student identity and access digital services.
              </p>
              <button
                onClick={() => setShowQR(false)}
                className="px-6 py-2 bg-[#00923F] text-white rounded-lg hover:bg-[#007A33] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Validity Information */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Validity Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Issue Date:</span>
              <span className="font-medium">{new Date(studentData.issueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expiry Date:</span>
              <span className="font-medium">{new Date(studentData.expiryDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-600">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Card Number:</span>
              <span className="font-medium">{studentData.cardNumber}</span>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Features</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Encrypted QR Code</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Unique Card Number</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Digital Signature</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Biometric Verification</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalIDCard;