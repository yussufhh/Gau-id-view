
// src/components/Header.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';
import Login from './Login';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#00923F] text-white py-4 text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span>📞</span>
              <span>(+254) 721966418</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✉️</span>
              <span>info@gau.ac.ke</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-white">
                  Welcome, {user?.name || 'User'}
                </span>
                <NavLink
                  to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  className="px-4 py-2 border border-white text-white rounded hover:bg-white hover:text-[#00923F] transition-colors font-medium"
                >
                  Dashboard
                </NavLink>
                <button 
                  onClick={logout}
                  className="px-4 py-2 bg-white text-[#00923F] rounded hover:bg-gray-100 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setShowLogin(true)}
                  className="px-4 py-2 border border-white text-white rounded hover:bg-white hover:text-[#00923F] transition-colors font-medium"
                >
                  Login
                </button>
                <button 
                  onClick={() => setShowLogin(true)}
                  className="px-4 py-2 bg-white text-[#00923F] rounded hover:bg-gray-100 transition-colors font-medium"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <img 
                src={logo} 
                alt="Garissa University Logo" 
                className="w-16 h-16 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-[#00923F] leading-tight">Garissa University</h1>
                <p className="text-sm text-gray-600 italic">(Oasis of Innovation)</p>
              </div>
            </div>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `hover:text-[#00923F] transition-colors text-gray-700 ${isActive ? 'text-[#00923F] font-semibold border-b-2 border-[#00923F]' : ''}`
                }
              >
                Home
              </NavLink>
              <NavLink 
                to="/about" 
                className={({ isActive }) => 
                  `hover:text-[#00923F] transition-colors text-gray-700 ${isActive ? 'text-[#00923F] font-semibold border-b-2 border-[#00923F]' : ''}`
                }
              >
                About
              </NavLink>
              <NavLink 
                to="/features" 
                className={({ isActive }) => 
                  `hover:text-[#00923F] transition-colors text-gray-700 ${isActive ? 'text-[#00923F] font-semibold border-b-2 border-[#00923F]' : ''}`
                }
              >
                Features
              </NavLink>
              <NavLink 
                to="/how-it-works" 
                className={({ isActive }) => 
                  `hover:text-[#00923F] transition-colors text-gray-700 ${isActive ? 'text-[#00923F] font-semibold border-b-2 border-[#00923F]' : ''}`
                }
              >
                How It Works
              </NavLink>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => 
                  `hover:text-[#00923F] transition-colors text-gray-700 ${isActive ? 'text-[#00923F] font-semibold border-b-2 border-[#00923F]' : ''}`
                }
              >
                Contact
              </NavLink>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-0.5 bg-current mb-1.5"></div>
              <div className="w-6 h-0.5 bg-current mb-1.5"></div>
              <div className="w-6 h-0.5 bg-current"></div>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `hover:text-[#00923F] transition-colors text-gray-700 ${isActive ? 'text-[#00923F] font-semibold' : ''}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink 
                  to="/about" 
                  className={({ isActive }) => 
                    `hover:text-[#00923F] transition-colors text-gray-700 ${isActive ? 'text-[#00923F] font-semibold' : ''}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </NavLink>
                <NavLink 
                  to="/features" 
                  className={({ isActive }) => 
                    `hover:text-[#00923F] transition-colors text-gray-700 ${isActive ? 'text-[#00923F] font-semibold' : ''}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </NavLink>
                <NavLink 
                  to="/how-it-works" 
                  className={({ isActive }) => 
                    `hover:text-[#00923F] transition-colors text-gray-700 ${isActive ? 'text-[#00923F] font-semibold' : ''}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </NavLink>
                <NavLink 
                  to="/contact" 
                  className={({ isActive }) => 
                    `hover:text-[#00923F] transition-colors text-gray-700 ${isActive ? 'text-[#00923F] font-semibold' : ''}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </NavLink>
              </nav>
            </div>
          )}
        </div>
      </header>
      
      {/* Login Modal */}
      <Login showLogin={showLogin} setShowLogin={setShowLogin} />
    </>
  );
};

export default Header;