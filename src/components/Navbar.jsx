import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, Briefcase, LogOut, ChevronDown, Building2, Users, Home, Plus } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
    setIsUserDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-500 ease-in-out ${isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-200/50'
            : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-500 ${isScrolled ? 'h-16' : 'h-18'
            }`}>

            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                to="/"
                className={`flex items-center space-x-3 text-2xl font-bold transition-all duration-500 hover:scale-105 group ${isScrolled
                    ? 'text-gray-800'
                    : 'text-white'
                  }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isScrolled
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg'
                    : 'bg-white/20 backdrop-blur-sm border border-white/30'
                  }`}>
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <span className={`bg-gradient-to-r bg-clip-text text-transparent ${isScrolled
                    ? 'from-blue-600 to-indigo-600'
                    : 'from-white to-blue-100'
                  }`}>
                  JobPortal
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <Link
                  to="/"
                  className={`relative group flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${isScrolled
                      ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      : 'text-white hover:text-blue-100 hover:bg-white/10'
                    }`}
                >
                  <Home className="w-4 h-4" />
                  <span className="font-medium">Ana Səhifə</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>

                {user.token && (
                  <>
                    {user.role === 'applicant' && (
                      <Link
                        to="/applicant-dashboard"
                        className={`relative group flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${isScrolled
                            ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                            : 'text-white hover:text-blue-100 hover:bg-white/10'
                          }`}
                      >
                        <User className="w-4 h-4" />
                        <span className="font-medium">Profilim</span>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                    )}

                    {user.role === 'company' && (
                      <>
                        <Link
                          to="/company-dashboard"
                          className={`relative group flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${isScrolled
                              ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                              : 'text-white hover:text-blue-100 hover:bg-white/10'
                            }`}
                        >
                          <Building2 className="w-4 h-4" />
                          <span className="font-medium">Şirkət Paneli</span>
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link
                          to="/post-job"
                          className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
                        >
                          <span className="relative z-10 flex items-center space-x-2 font-semibold">
                            <Plus className="w-4 h-4" />
                            <span>Elan Yerləşdir</span>
                          </span>
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        </Link>
                      </>
                    )}

                    {user.role === 'admin' && (
                      <Link
                        to="/admin-dashboard"
                        className={`relative group flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${isScrolled
                            ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                            : 'text-white hover:text-blue-100 hover:bg-white/10'
                          }`}
                      >
                        <Building2 className="w-4 h-4" />
                        <span className="font-medium">Admin Paneli</span>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                    )}

                    
                    {/* User Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${isScrolled
                            ? 'text-gray-700 hover:bg-gray-100'
                            : 'text-white hover:bg-white/10'
                          }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isScrolled
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-500'
                            : 'bg-white/20 backdrop-blur-sm border border-white/30'
                          }`}>
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isUserDropdownOpen && (
                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-fadeIn overflow-hidden">
                          <div className="px-4 py-3 text-sm text-gray-500 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                <User className="w-3 h-3 text-white" />
                              </div>
                              <span className="font-medium">Hesab: {user.displayName}</span>
                            </div>

                          </div>
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-200 group"
                          >
                            <LogOut className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                            <span className="font-medium">Çıxış</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                  }`}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden mobile-menu-container transition-all duration-500 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}>
          <div className={`px-4 py-6 space-y-3 ${isScrolled
              ? 'bg-white/95 backdrop-blur-xl border-t border-gray-200/50'
              : 'bg-gradient-to-b from-indigo-700/95 to-purple-700/95 backdrop-blur-xl'
            }`}>
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${isScrolled
                  ? 'text-gray-700 hover:bg-blue-50'
                  : 'text-white hover:bg-white/10'
                }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Ana Səhifə</span>
            </Link>

            {user.token && (
              <>
                {user.role === 'applicant' && (
                  <Link
                    to="/applicant-dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${isScrolled
                        ? 'text-gray-700 hover:bg-blue-50'
                        : 'text-white hover:bg-white/10'
                      }`}
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Profilim</span>
                  </Link>
                )}

                {user.role === 'company' && (
                  <>
                    <Link
                      to="/company-dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${isScrolled
                          ? 'text-gray-700 hover:bg-blue-50'
                          : 'text-white hover:bg-white/10'
                        }`}
                    >
                      <Building2 className="w-5 h-5" />
                      <span className="font-medium">Şirkət Paneli</span>
                    </Link>
                    <Link
                      to="/post-job"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 mx-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="font-semibold">Elan Yerləşdir</span>
                    </Link>
                  </>
                )}

                {user.role === 'admin' && (
                  <Link
                    to="/admin-dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${isScrolled
                        ? 'text-gray-700 hover:bg-blue-50'
                        : 'text-white hover:bg-white/10'
                      }`}
                  >
                    <Building2 className="w-5 h-5" />
                    <span className="font-medium">Admin Paneli</span>
                  </Link>
                )}

                <Link
                  to="/applicants"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${isScrolled
                      ? 'text-gray-700 hover:bg-blue-50'
                      : 'text-white hover:bg-white/10'
                    }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Namizədlər</span>
                </Link>

                <div className="border-t border-gray-200/30 pt-3 mt-3">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-left text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Çıxış</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-18"></div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;