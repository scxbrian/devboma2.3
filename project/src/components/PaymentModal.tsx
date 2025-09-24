import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, Building, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { usePayment } from '../contexts/PaymentContext';
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    name: string;
    price: number;
    duration?: string;
  };
}

export default function PaymentModal({ isOpen, onClose, service }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile' | 'bank'>('card');
  const [formData, setFormData] = useState({
    // Card details
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    // Mobile details
    phoneNumber: '',
    provider: 'mpesa',
    // Bank details
    accountName: '',
    // Common details
    email: '',
    name: '',
    company: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { processCardPayment, processMobilePayment, processBankTransfer, isProcessing } = usePayment();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
      if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    } else if (paymentMethod === 'mobile') {
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
      if (!/^\+254\d{9}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid Kenyan phone number (+254XXXXXXXXX)';
      }
    } else if (paymentMethod === 'bank') {
      if (!formData.accountName.trim()) newErrors.accountName = 'Account name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    try {
      let success = false;
      
      if (paymentMethod === 'card') {
        success = await processCardPayment(
          service.price,
          {
            ...formData,
            email: formData.email
          },
          `${service.name} - ${service.duration || 'One-time payment'}`
        );
      } else if (paymentMethod === 'mobile') {
        success = await processMobilePayment(
          service.price,
          formData.phoneNumber,
          `${service.name} - ${service.duration || 'One-time payment'}`
        );
      } else if (paymentMethod === 'bank') {
        success = await processBankTransfer(
          service.price,
          {
            name: formData.name,
            email: formData.email,
            accountName: formData.accountName
          },
          `${service.name} - ${service.duration || 'One-time payment'}`
        );
      }

      if (success) {
        onClose();
        // Reset form
        setFormData({
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          cardName: '',
          phoneNumber: '',
          provider: 'mpesa',
          accountName: '',
          email: '',
          name: '',
          company: ''
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900">{service.name}</h3>
              <p className="text-blue-700">
                KES {typeof service.price === 'number' ? service.price.toLocaleString() : service.price}
                {service.duration && <span className="text-sm"> / {service.duration}</span>}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  disabled={isProcessing}
                  className={`p-3 border-2 rounded-lg flex flex-col items-center justify-center space-y-1 transition-all disabled:opacity-50 ${
                    paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs font-medium">Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mobile')}
                  disabled={isProcessing}
                  className={`p-3 border-2 rounded-lg flex flex-col items-center justify-center space-y-1 transition-all disabled:opacity-50 ${
                    paymentMethod === 'mobile'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="text-xs font-medium">M-Pesa</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  disabled={isProcessing}
                  className={`p-3 border-2 rounded-lg flex flex-col items-center justify-center space-y-1 transition-all disabled:opacity-50 ${
                    paymentMethod === 'bank'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Building className="w-5 h-5" />
                  <span className="text-xs font-medium">Bank</span>
                </button>
              </div>
            </div>

            {/* Common Fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isProcessing}
                  className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>
              <div>
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isProcessing}
                  className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Payment Method Specific Fields */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="form-label">Card Number *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    required
                    value={formData.cardNumber}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      setFormData(prev => ({ ...prev, cardNumber: formatted }));
                      if (errors.cardNumber) {
                        setErrors(prev => ({ ...prev, cardNumber: '' }));
                      }
                    }}
                    disabled={isProcessing}
                    className={`form-input ${errors.cardNumber ? 'border-red-500' : ''}`}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.cardNumber}</span>
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Expiry Date *</label>
                    <input
                      type="text"
                      name="expiryDate"
                      required
                      value={formData.expiryDate}
                      onChange={(e) => {
                        const formatted = formatExpiryDate(e.target.value);
                        setFormData(prev => ({ ...prev, expiryDate: formatted }));
                        if (errors.expiryDate) {
                          setErrors(prev => ({ ...prev, expiryDate: '' }));
                        }
                      }}
                      disabled={isProcessing}
                      className={`form-input ${errors.expiryDate ? 'border-red-500' : ''}`}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    {errors.expiryDate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.expiryDate}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="form-label">CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      required
                      value={formData.cvv}
                      onChange={handleInputChange}
                      disabled={isProcessing}
                      className={`form-input ${errors.cvv ? 'border-red-500' : ''}`}
                      placeholder="123"
                      maxLength={4}
                    />
                    {errors.cvv && (
                      <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.cvv}</span>
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="form-label">Cardholder Name *</label>
                  <input
                    type="text"
                    name="cardName"
                    required
                    value={formData.cardName}
                    onChange={handleInputChange}
                    disabled={isProcessing}
                    className={`form-input ${errors.cardName ? 'border-red-500' : ''}`}
                    placeholder="Name on card"
                  />
                  {errors.cardName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.cardName}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {paymentMethod === 'mobile' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="form-label">Mobile Money Provider *</label>
                  <select
                    name="provider"
                    value={formData.provider}
                    onChange={handleInputChange}
                    disabled={isProcessing}
                    className="form-input"
                  >
                    <option value="mpesa">M-Pesa (Safaricom)</option>
                    <option value="airtel">Airtel Money</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={isProcessing}
                    className={`form-input ${errors.phoneNumber ? 'border-red-500' : ''}`}
                    placeholder="+254 700 123 456"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.phoneNumber}</span>
                    </p>
                  )}
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Mobile Money Payment</span>
                  </div>
                  <p className="text-sm text-green-600 mt-2">
                    You'll receive a prompt on your phone to complete the payment.
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === 'bank' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="form-label">Account Name *</label>
                  <input
                    type="text"
                    name="accountName"
                    required
                    value={formData.accountName}
                    onChange={handleInputChange}
                    disabled={isProcessing}
                    className={`form-input ${errors.accountName ? 'border-red-500' : ''}`}
                    placeholder="Account holder name"
                  />
                  {errors.accountName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.accountName}</span>
                    </p>
                  )}
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-purple-700">
                    <Building className="w-5 h-5" />
                    <span className="font-medium">Bank Transfer</span>
                  </div>
                  <p className="text-sm text-purple-600 mt-2">
                    You'll receive bank details via email to complete the transfer.
                  </p>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 text-gray-700">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Secure Payment via Paystack</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Your payment information is encrypted and secure. Powered by Paystack.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 ${
                paymentMethod === 'card'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'
                  : paymentMethod === 'mobile'
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                  : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
              }`}
            >
              {isProcessing ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>
                  {paymentMethod === 'card' && 'Pay with Card'}
                  {paymentMethod === 'mobile' && 'Pay with Mobile Money'}
                  {paymentMethod === 'bank' && 'Generate Bank Details'}
                </span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}