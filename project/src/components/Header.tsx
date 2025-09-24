import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isAuthenticated, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  const services = [
    { name: 'Boma Lite', path: '/services/lite', price: 'KES 39K' },
    { name: 'Boma Core', path: '/services/core', price: 'KES 145K' },
    { name: 'Boma Prime', path: '/services/prime', price: 'KES 299K' },
    { name: 'Boma Titan', path: '/services/titan', price: 'KES 499K' },
    { name: 'Boma Shop', path: '/boma-shop', price: 'Custom', featured: true }
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity group">
            <motion.div 
              className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl group-hover:scale-110 transition-transform duration-200"
              whileHover={{ rotate: 5 }}
            >
              <span className="text-2xl font-bold text-white font-mono">&lt;/&gt;</span>
            </motion.div>
            <div>
              <span className="text-2xl font-bold text-gray-900">DevBoma</span>
              <div className="text-xs text-gray-500 -mt-1">Faith • Excellence • Innovation</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'nav-link-active' : ''}`}
            >
              Home
            </Link>
            
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button className="flex items-center space-x-1 nav-link">
                <span>Services</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-4 z-50"
                  >
                    {services.map((service) => (
                      <Link
                        key={service.path}
                        to={service.path}
                        className={`block px-6 py-3 hover:bg-gray-50 transition-colors duration-200 ${
                          service.featured ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className={`font-medium ${service.featured ? 'text-yellow-700' : 'text-gray-900'}`}>
                              {service.name}
                              {service.featured && <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">Popular</span>}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{service.price}</span>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              to="/boma-shop" 
              className={`nav-link ${isActive('/boma-shop') ? 'nav-link-active' : ''}`}
            >
              Shop Builder
            </Link>
            
            {isAuthenticated && (
              <Link 
                to={isAdmin ? '/admin' : '/dashboard'} 
                className={`nav-link ${(isActive('/dashboard') || isActive('/admin')) ? 'nav-link-active' : ''}`}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-4 py-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 rounded-lg hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="hidden lg:block btn-primary"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-100 py-4"
            >
              <div className="space-y-4">
                <Link 
                  to="/" 
                  className="block text-gray-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Services</p>
                  {services.map((service) => (
                    <Link
                      key={service.path}
                      to={service.path}
                      className={`block pl-4 py-2 text-gray-600 hover:text-blue-700 transition-colors duration-200 ${
                        service.featured ? 'text-yellow-600 font-medium' : ''
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {service.name} <span className="text-xs text-gray-400">({service.price})</span>
                    </Link>
                  ))}
                </div>

                {isAuthenticated ? (
                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <Link 
                      to={isAdmin ? '/admin' : '/dashboard'}
                      className="block text-gray-600 hover:text-blue-700 font-medium transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login"
                    className="block btn-primary text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}