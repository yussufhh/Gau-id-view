import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  BookOpen,
  Upload,
  Download,
  Edit3,
  Save,
  X,
  Camera,
  FileText,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const ProfileManagement = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [editMode, setEditMode] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    // Personal Information
    firstName: 'John',
    lastName: 'Kamau Doe',
    email: 'john.doe@student.gau.ac.ke',
    phone: '+254 712 345 678',
    dateOfBirth: '1998-05-15',
    nationalId: '32123456',
    gender: 'male',
    
    // Academic Information
    admissionNumber: 'S110/2099/23',
    department: 'Computer Science',
    course: 'Bachelor of Computer Science',
    yearOfStudy: '3',
    expectedGraduation: '2025-12',
    
    // Contact Information
    permanentAddress: 'P.O. Box 1234, Garissa, Kenya',
    currentAddress: 'Student Hostel Room 204, Garissa University',
    nextOfKinName: 'Mary Doe',
    nextOfKinPhone: '+254 722 987 654',
    nextOfKinRelationship: 'Mother',
    
    // Account Settings
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'National ID Copy',
      type: 'identification',
      status: 'verified',
      uploadDate: '2024-01-15',
      size: '2.1 MB',
      format: 'PDF'
    },
    {
      id: 2,
      name: 'Passport Photo',
      type: 'photo',
      status: 'verified',
      uploadDate: '2024-01-15',
      size: '1.2 MB',
      format: 'JPG'
    },
    {
      id: 3,
      name: 'Birth Certificate',
      type: 'certificate',
      status: 'pending',
      uploadDate: '2024-01-18',
      size: '1.8 MB',
      format: 'PDF'
    },
    {
      id: 4,
      name: 'Academic Transcript',
      type: 'academic',
      status: 'verified',
      uploadDate: '2024-01-10',
      size: '956 KB',
      format: 'PDF'
    }
  ]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleEditMode = (field) => {
    setEditMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const saveField = (field) => {
    // Here you would typically save to backend API
    console.log(`Saving ${field}:`, profileData[field]);
    toggleEditMode(field);
    // Show success message
  };

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'identification': return User;
      case 'photo': return Camera;
      case 'certificate': return FileText;
      case 'academic': return BookOpen;
      default: return FileText;
    }
  };

  const ProfileField = ({ label, field, type = 'text', required = false, editable = true }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center space-x-2">
        {editMode[field] ? (
          <div className="flex-1 flex space-x-2">
            {type === 'select' ? (
              <select
                value={profileData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
              >
                {field === 'gender' && (
                  <>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </>
                )}
                {field === 'yearOfStudy' && (
                  <>
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                    <option value="5">Year 5</option>
                  </>
                )}
                {field === 'nextOfKinRelationship' && (
                  <>
                    <option value="Parent">Parent</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Other">Other</option>
                  </>
                )}
              </select>
            ) : type === 'textarea' ? (
              <textarea
                value={profileData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                rows={3}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
              />
            ) : (
              <input
                type={type}
                value={profileData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
              />
            )}
            <button
              onClick={() => saveField(field)}
              className="p-2 bg-[#00923F] text-white rounded-lg hover:bg-[#007A33] transition-colors"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleEditMode(field)}
              className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-between">
            <span className="text-gray-800">
              {type === 'date' ? new Date(profileData[field]).toLocaleDateString() : profileData[field]}
            </span>
            {editable && (
              <button
                onClick={() => toggleEditMode(field)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const PersonalInfoTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileField label="First Name" field="firstName" required />
        <ProfileField label="Last Name" field="lastName" required />
        <ProfileField label="Email" field="email" type="email" required />
        <ProfileField label="Phone Number" field="phone" type="tel" required />
        <ProfileField label="Date of Birth" field="dateOfBirth" type="date" required />
        <ProfileField label="National ID" field="nationalId" required />
        <ProfileField label="Gender" field="gender" type="select" required />
      </div>
    </div>
  );

  const AcademicInfoTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileField label="Admission Number" field="admissionNumber" editable={false} />
        <ProfileField label="Department" field="department" editable={false} />
        <ProfileField label="Course" field="course" editable={false} />
        <ProfileField label="Year of Study" field="yearOfStudy" type="select" />
        <ProfileField label="Expected Graduation" field="expectedGraduation" type="month" />
      </div>
    </div>
  );

  const ContactInfoTab = () => (
    <div className="space-y-6">
      <ProfileField label="Permanent Address" field="permanentAddress" type="textarea" required />
      <ProfileField label="Current Address" field="currentAddress" type="textarea" required />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProfileField label="Next of Kin Name" field="nextOfKinName" required />
        <ProfileField label="Next of Kin Phone" field="nextOfKinPhone" type="tel" required />
        <ProfileField label="Relationship" field="nextOfKinRelationship" type="select" required />
      </div>
    </div>
  );

  const DocumentsTab = () => (
    <div className="space-y-6">
      {/* Upload New Document */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload New Document</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div>
            <label className="cursor-pointer text-[#00923F] hover:text-[#007A33] font-medium">
              Click to upload
              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
            </label>
            <p className="text-sm text-gray-500 mt-1">PDF, JPG, PNG up to 5MB</p>
          </div>
        </div>
      </div>

      {/* Existing Documents */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">My Documents</h3>
        <div className="space-y-4">
          {documents.map((doc) => {
            const Icon = getDocumentIcon(doc.type);
            return (
              <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{doc.name}</h4>
                      <p className="text-sm text-gray-600">
                        {doc.format} • {doc.size} • Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDocumentStatusColor(doc.status)}`}>
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={profileData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={profileData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                placeholder="Enter new password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={profileData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Password Requirements</h4>
                <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                  <li>• Contains at least one special character</li>
                </ul>
              </div>
            </div>
          </div>

          <button className="px-6 py-3 bg-[#00923F] text-white rounded-lg hover:bg-[#007A33] transition-colors">
            Update Password
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-700">Add an extra layer of security to your account</p>
            <p className="text-sm text-gray-500 mt-1">Receive verification codes via SMS or email</p>
          </div>
          <button className="px-4 py-2 border border-[#00923F] text-[#00923F] rounded-lg hover:bg-[#00923F] hover:text-white transition-colors">
            Enable 2FA
          </button>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Actions</h3>
        <div className="space-y-4">
          <button className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Download Account Data
          </button>
          <button className="w-full md:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ml-0 md:ml-4">
            Deactivate Account
          </button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'academic', label: 'Academic Info', icon: BookOpen },
    { id: 'contact', label: 'Contact Info', icon: MapPin },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-[#00923F] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {profileData.firstName[0]}{profileData.lastName[0]}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {profileData.firstName} {profileData.lastName}
            </h1>
            <p className="text-gray-600">{profileData.admissionNumber} • {profileData.course}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex space-x-0 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#00923F] text-[#00923F]'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'personal' && <PersonalInfoTab />}
          {activeTab === 'academic' && <AcademicInfoTab />}
          {activeTab === 'contact' && <ContactInfoTab />}
          {activeTab === 'documents' && <DocumentsTab />}
          {activeTab === 'security' && <SecurityTab />}
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;