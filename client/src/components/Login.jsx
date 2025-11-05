import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { utils } from '../services/api';

const Login = ({ showLogin, setShowLogin }) => {
  const [state, setState] = useState("login");
  const [showForgot, setShowForgot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { login, register } = useAuth();
  
  // Form data state
  const [formData, setFormData] = useState({
    fullName: "",
    registrationNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    school: "",
    phoneNumber: "",
    yearOfStudy: "",
    course: "",
    dateOfBirth: ""
  });

  const schools = [
    "School of Pure and Applied Science",
    "School of Education Arts and Social Science", 
    "School of Business and Economics"
  ];

  const yearsOfStudy = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateRegistrationNumber = (regNum) => {
    // Format validation: S110/2099/23 (letter + numbers + / + numbers + / + numbers)
    const regex = /^[A-Z]\d+\/\d+\/\d+$/;
    return regex.test(regNum);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      if (state === "register") {
        // Registration validation
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match!");
          return;
        }
        
        if (!validateRegistrationNumber(formData.registrationNumber)) {
          setError("Invalid registration number format. Use format: S110/2099/23");
          return;
        }
        
        if (!formData.school) {
          setError("Please select your school");
          return;
        }

        if (!formData.email.includes('@student.gau.ac.ke') && !formData.email.includes('@gau.ac.ke')) {
          setError("Please use your GAU email address (@student.gau.ac.ke or @gau.ac.ke)");
          return;
        }

        // Call registration API
        const response = await register(formData);
        
        if (response.success) {
          setSuccess("Account created successfully! Please check your email for verification.");
          setTimeout(() => {
            setState("login");
            setSuccess('');
          }, 2000);
        } else {
          setError(response.message || "Registration failed");
        }
        
      } else {
        // Login validation
        if (!formData.registrationNumber || !formData.password) {
          setError("Please enter registration number and password");
          return;
        }

        if (!validateRegistrationNumber(formData.registrationNumber) && formData.registrationNumber !== "ADMIN001") {
          setError("Invalid registration number format. Use format: S110/2099/23");
          return;
        }

        // Call login API
        const response = await login({
          reg_number: formData.registrationNumber,
          password: formData.password
        });
        
        if (response.success) {
          setSuccess("Login successful! Redirecting...");
          setShowLogin(false);
          
          // Redirect based on user role
          const user = response.data.user;
          setTimeout(() => {
            if (user.role === 'admin') {
              window.location.href = "/admin/dashboard";
            } else {
              window.location.href = "/dashboard";
            }
          }, 1000);
        } else {
          setError(response.message || "Login failed");
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(utils.formatError(error) || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!showLogin) return null;

  return (
    <div 
      onClick={() => setShowLogin(false)} 
      className='fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black/50'
    >
      <div className="m-auto w-full max-w-lg mx-4">
        {showForgot ? (
          // Forgot Password Form
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
              <p className="text-gray-600 mt-2">Enter your registration number to reset your password</p>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <input 
                  type="text" 
                  placeholder="e.g., S110/2099/23"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-[#00923F] text-white py-3 rounded-lg font-semibold hover:bg-[#007A33] transition-colors"
              >
                Send Reset Link
              </button>
              <button 
                type="button"
                onClick={() => setShowForgot(false)}
                className="w-full text-[#00923F] py-2 font-medium hover:underline"
              >
                Back to Login
              </button>
            </form>
          </div>
        ) : (
          // Main Login/Signup Form
          <form 
            onSubmit={onSubmitHandler} 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                <span className="text-[#00923F]">GAU-ID-View</span> {state === "login" ? "Login" : "Sign Up"}
              </h2>
              <p className="text-gray-600 mt-2">
                {state === "login" 
                  ? "Access your digital student ID system" 
                  : "Create your GAU-ID-View account"}
              </p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            {/* Registration Fields */}
            {state === "register" && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number *
                  </label>
                  <input 
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="e.g., S110/2099/23"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    required 
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: Letter + Numbers + / + Numbers + / + Numbers</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email" 
                    placeholder="your.email@student.gau.ac.ke"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School *
                  </label>
                  <select 
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    required
                  >
                    <option value="">Select your school</option>
                    {schools.map((school, index) => (
                      <option key={index} value={school}>{school}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year of Study *
                    </label>
                    <select 
                      name="yearOfStudy"
                      value={formData.yearOfStudy}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                      required
                    >
                      <option value="">Select year</option>
                      {yearsOfStudy.map((year, index) => (
                        <option key={index} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input 
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      type="tel" 
                      placeholder="+254 7XX XXX XXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course/Program
                  </label>
                  <input 
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="e.g., Bachelor of Computer Science"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input 
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    type="date" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    type="password" 
                    placeholder="Create a strong password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    type="password" 
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    required 
                  />
                </div>
              </div>
            )}

            {/* Login Fields */}
            {state === "login" && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number
                  </label>
                  <input 
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="Enter your registration number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    required 
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: S110/2099/23 or ADM001 for admin</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    type="password" 
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                    required 
                  />
                </div>
              </div>
            )}

            {/* Toggle between login/register */}
            <div className="text-center mb-6">
              {state === "register" ? (
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button 
                    type="button"
                    onClick={() => setState("login")} 
                    className="text-[#00923F] font-semibold hover:underline"
                  >
                    Login here
                  </button>
                </p>
              ) : (
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <button 
                    type="button"
                    onClick={() => setState("register")} 
                    className="text-[#00923F] font-semibold hover:underline"
                  >
                    Sign up here
                  </button>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00923F] text-white py-3 rounded-lg font-semibold hover:bg-[#007A33] transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {state === "register" ? "Creating Account..." : "Logging in..."}
                </div>
              ) : (
                state === "register" ? "Create Account" : "Login"
              )}
            </button>

            {/* Forgot Password */}
            {state === "login" && (
              <button 
                type="button" 
                onClick={() => setShowForgot(true)} 
                className="w-full text-[#00923F] py-2 font-medium hover:underline transition-colors"
              >
                Forgot Password?
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;