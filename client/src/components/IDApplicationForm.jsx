import React, { useState } from 'react';
import { 
  Upload, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Camera,
  FileText
} from 'lucide-react';

const IDApplicationForm = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    admissionNumber: '',
    nationalId: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    
    // Academic Information
    department: '',
    course: '',
    yearOfStudy: '',
    expectedGraduation: '',
    
    // Contact Information
    permanentAddress: '',
    currentAddress: '',
    nextOfKinName: '',
    nextOfKinPhone: '',
    nextOfKinRelationship: '',
    
    // Documents
    passportPhoto: null,
    nationalIdCopy: null,
    admissionLetter: null
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, title: 'Personal Info', description: 'Basic personal details' },
    { id: 2, title: 'Academic Info', description: 'Course and department' },
    { id: 3, title: 'Contact Info', description: 'Address and emergency contact' },
    { id: 4, title: 'Documents', description: 'Upload required documents' },
    { id: 5, title: 'Review', description: 'Review and submit' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.admissionNumber) newErrors.admissionNumber = 'Admission number is required';
        if (!formData.nationalId) newErrors.nationalId = 'National ID is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        break;
        
      case 2:
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.course) newErrors.course = 'Course is required';
        if (!formData.yearOfStudy) newErrors.yearOfStudy = 'Year of study is required';
        if (!formData.expectedGraduation) newErrors.expectedGraduation = 'Expected graduation is required';
        break;
        
      case 3:
        if (!formData.permanentAddress) newErrors.permanentAddress = 'Permanent address is required';
        if (!formData.currentAddress) newErrors.currentAddress = 'Current address is required';
        if (!formData.nextOfKinName) newErrors.nextOfKinName = 'Next of kin name is required';
        if (!formData.nextOfKinPhone) newErrors.nextOfKinPhone = 'Next of kin phone is required';
        if (!formData.nextOfKinRelationship) newErrors.nextOfKinRelationship = 'Relationship is required';
        break;
        
      case 4:
        if (!formData.passportPhoto) newErrors.passportPhoto = 'Passport photo is required';
        if (!formData.nationalIdCopy) newErrors.nationalIdCopy = 'National ID copy is required';
        if (!formData.admissionLetter) newErrors.admissionLetter = 'Admission letter is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitApplication = async () => {
    if (!validateStep(4)) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      const applicationData = new FormData();
      Object.keys(formData).forEach(key => {
        applicationData.append(key, formData[key]);
      });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful submission
      alert('Application submitted successfully! You will receive an email confirmation shortly.');
      
      // Reset form or redirect
      setCurrentStep(1);
      setFormData({
        firstName: '', lastName: '', admissionNumber: '', nationalId: '',
        email: '', phone: '', dateOfBirth: '', gender: '',
        department: '', course: '', yearOfStudy: '', expectedGraduation: '',
        permanentAddress: '', currentAddress: '', nextOfKinName: '',
        nextOfKinPhone: '', nextOfKinRelationship: '',
        passportPhoto: null, nationalIdCopy: null, admissionLetter: null
      });
      
    } catch (error) {
      alert('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const FileUploadField = ({ label, name, accept, required, icon: Icon }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        formData[name] ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
      }`}>
        {formData[name] ? (
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <CheckCircle className="w-6 h-6" />
            <span className="font-medium">{formData[name].name}</span>
          </div>
        ) : (
          <div className="space-y-2">
            <Icon className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <label className="cursor-pointer text-[#00923F] hover:text-[#007A33] font-medium">
                Click to upload
                <input
                  type="file"
                  accept={accept}
                  onChange={(e) => handleFileUpload(e, name)}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>
        )}
      </div>
      {errors[name] && (
        <p className="text-red-500 text-sm flex items-center space-x-1">
          <AlertCircle className="w-4 h-4" />
          <span>{errors[name]}</span>
        </p>
      )}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admission Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="admissionNumber"
                  value={formData.admissionNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                  placeholder="e.g., S110/2099/23"
                />
                {errors.admissionNumber && <p className="text-red-500 text-sm mt-1">{errors.admissionNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  National ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                  placeholder="Enter your national ID number"
                />
                {errors.nationalId && <p className="text-red-500 text-sm mt-1">{errors.nationalId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    placeholder="your.email@student.gau.ac.ke"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    placeholder="+254 712 345 678"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                  />
                </div>
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  <option value="computer-science">Computer Science</option>
                  <option value="business">Business Administration</option>
                  <option value="education">Education</option>
                  <option value="engineering">Engineering</option>
                  <option value="health-sciences">Health Sciences</option>
                </select>
                {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                  placeholder="e.g., Bachelor of Computer Science"
                />
                {errors.course && <p className="text-red-500 text-sm mt-1">{errors.course}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year of Study <span className="text-red-500">*</span>
                </label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                >
                  <option value="">Select Year</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                  <option value="5">Year 5</option>
                </select>
                {errors.yearOfStudy && <p className="text-red-500 text-sm mt-1">{errors.yearOfStudy}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Graduation <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  name="expectedGraduation"
                  value={formData.expectedGraduation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                />
                {errors.expectedGraduation && <p className="text-red-500 text-sm mt-1">{errors.expectedGraduation}</p>}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permanent Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                  placeholder="Enter your permanent address"
                />
                {errors.permanentAddress && <p className="text-red-500 text-sm mt-1">{errors.permanentAddress}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                  placeholder="Enter your current address"
                />
                {errors.currentAddress && <p className="text-red-500 text-sm mt-1">{errors.currentAddress}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Next of Kin Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nextOfKinName"
                    value={formData.nextOfKinName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    placeholder="Full name"
                  />
                  {errors.nextOfKinName && <p className="text-red-500 text-sm mt-1">{errors.nextOfKinName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Next of Kin Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="nextOfKinPhone"
                    value={formData.nextOfKinPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    placeholder="+254 712 345 678"
                  />
                  {errors.nextOfKinPhone && <p className="text-red-500 text-sm mt-1">{errors.nextOfKinPhone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="nextOfKinRelationship"
                    value={formData.nextOfKinRelationship}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                  >
                    <option value="">Select Relationship</option>
                    <option value="parent">Parent</option>
                    <option value="guardian">Guardian</option>
                    <option value="sibling">Sibling</option>
                    <option value="spouse">Spouse</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.nextOfKinRelationship && <p className="text-red-500 text-sm mt-1">{errors.nextOfKinRelationship}</p>}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Document Requirements</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• All documents must be clear and legible</li>
                <li>• Passport photo should have a white background</li>
                <li>• File size should not exceed 5MB per document</li>
                <li>• Accepted formats: PNG, JPG, PDF</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploadField
                label="Passport Photo"
                name="passportPhoto"
                accept="image/*"
                required
                icon={Camera}
              />

              <FileUploadField
                label="National ID Copy"
                name="nationalIdCopy"
                accept="image/*,application/pdf"
                required
                icon={FileText}
              />
            </div>

            <FileUploadField
              label="Admission Letter"
              name="admissionLetter"
              accept="image/*,application/pdf"
              required
              icon={FileText}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Application Summary</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Name:</p>
                    <p className="text-gray-600">{formData.firstName} {formData.lastName}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Admission Number:</p>
                    <p className="text-gray-600">{formData.admissionNumber}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Email:</p>
                    <p className="text-gray-600">{formData.email}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Department:</p>
                    <p className="text-gray-600">{formData.department}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Course:</p>
                    <p className="text-gray-600">{formData.course}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Year of Study:</p>
                    <p className="text-gray-600">Year {formData.yearOfStudy}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <p className="font-medium text-gray-700 mb-2">Uploaded Documents:</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>✓ Passport Photo: {formData.passportPhoto?.name}</p>
                    <p>✓ National ID Copy: {formData.nationalIdCopy?.name}</p>
                    <p>✓ Admission Letter: {formData.admissionLetter?.name}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Once submitted, your application will be reviewed within 3-5 business days. 
                You will receive email notifications about the status of your application.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step.id < currentStep 
                  ? 'bg-[#00923F] border-[#00923F] text-white' 
                  : step.id === currentStep
                  ? 'border-[#00923F] text-[#00923F] bg-white'
                  : 'border-gray-300 text-gray-400 bg-white'
              }`}>
                {step.id < currentStep ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span className="font-medium">{step.id}</span>
                )}
              </div>
              <div className="ml-3 hidden md:block">
                <p className={`text-sm font-medium ${
                  step.id <= currentStep ? 'text-[#00923F]' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-1 mx-4 ${
                  step.id < currentStep ? 'bg-[#00923F]' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {steps[currentStep - 1]?.title}
          </h2>
          <p className="text-gray-600">{steps[currentStep - 1]?.description}</p>
        </div>

        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {currentStep < 5 ? (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-[#00923F] text-white rounded-lg hover:bg-[#007A33] transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={submitApplication}
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#00923F] text-white rounded-lg hover:bg-[#007A33] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Application</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IDApplicationForm;