import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { PricingProvider } from './contexts/PricingContext';
import LandingPage from './pages/LandingPage';
import ServiceTierPage from './pages/ServiceTierPage';
import BomaShopBuilder from './pages/BomaShopBuilder';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <PricingProvider>
      <AuthProvider>
        <PaymentProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/services/:tier" element={<ServiceTierPage />} />
                <Route path="/boma-shop" element={<BomaShopBuilder />} />
                <Route path="/login" element={<LoginPage />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <ClientDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
              <Footer />
            </div>
          </Router>
        </PaymentProvider>
      </AuthProvider>
    </PricingProvider>
  );
}

export default App;