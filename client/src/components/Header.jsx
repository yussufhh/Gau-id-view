
// src/components/Header.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#00923F] text-white py-2 text-sm">
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
          <div className="flex items-center space-x-6">
            <span>ELEARNING</span>
            <span>STUDENT PORTAL</span>
            <span>SUPPLY CHAIN DEPT</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
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

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
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

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="px-6 py-2 rounded-lg border border-[#00923F] text-[#00923F] hover:bg-[#00923F] hover:text-white transition-colors">
                Login
              </button>
              <button className="px-6 py-2 rounded-lg bg-[#00923F] text-white hover:bg-[#007A33] transition-colors">
                Register
              </button>
            </div>

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
                <div className="flex space-x-4 pt-2">
                  <button className="px-4 py-2 rounded-lg border border-[#00923F] text-[#00923F] hover:bg-[#00923F] hover:text-white transition-colors flex-1">
                    Login
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-[#00923F] text-white hover:bg-[#007A33] transition-colors flex-1">
                    Register
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;