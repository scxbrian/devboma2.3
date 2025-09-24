import React, { createContext, useContext, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile' | 'bank';
  name: string;
  details: any;
}

interface PaymentContextType {
  isProcessing: boolean;
  processPayment: (amount: number, method: PaymentMethod, description: string) => Promise<boolean>;
  processCardPayment: (amount: number, cardDetails: any, description: string) => Promise<boolean>;
  processMobilePayment: (amount: number, phoneNumber: string, description: string) => Promise<boolean>;
  processBankTransfer: (amount: number, customerDetails: any, description: string) => Promise<boolean>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const processCardPayment = async (
    amount: number, 
    cardDetails: any, 
    description: string
  ): Promise<boolean> => {
    setIsProcessing(true);
    
    try {
      // Initialize Paystack payment
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount * 100, // Paystack uses kobo (multiply by 100)
          currency: 'KES',
          email: cardDetails.email,
          description,
          card: {
            number: cardDetails.cardNumber.replace(/\s/g, ''),
            cvv: cardDetails.cvv,
            expiry_month: cardDetails.expiryDate.split('/')[0],
            expiry_year: '20' + cardDetails.expiryDate.split('/')[1],
          }
        })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Payment failed');
      }
      
      // For demo purposes, we'll simulate success
      // In production, you'd redirect to Paystack checkout or handle the response
      toast.success(`Payment of KES ${amount.toLocaleString()} processed successfully!`);
      return true;
    } catch (error) {
      console.error('Card payment error:', error);
      toast.error(error instanceof Error ? error.message : 'Payment failed. Please try again.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const processMobilePayment = async (
    amount: number, 
    phoneNumber: string, 
    description: string
  ): Promise<boolean> => {
    setIsProcessing(true);
    
    try {
      // Initialize mobile money payment via Paystack
      const response = await fetch('/api/payments/mobile-money', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount * 100,
          currency: 'KES',
          mobile_money: {
            phone: phoneNumber,
            provider: 'mpesa' // or 'airtel'
          },
          description
        })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Mobile payment failed');
      }
      
      toast.success(`Mobile payment of KES ${amount.toLocaleString()} initiated! Check your phone.`);
      return true;
    } catch (error) {
      console.error('Mobile payment error:', error);
      toast.error('Mobile payment failed. Please try again.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const processBankTransfer = async (
    amount: number, 
    customerDetails: any, 
    description: string
  ): Promise<boolean> => {
    setIsProcessing(true);
    
    try {
      // Generate bank transfer details via Paystack
      const response = await fetch('/api/payments/bank-transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount * 100,
          currency: 'KES',
          customer: customerDetails,
          description
        })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Bank transfer setup failed');
      }
      
      toast.success(`Bank transfer details generated! Check your email for payment instructions.`);
      return true;
    } catch (error) {
      console.error('Bank transfer error:', error);
      toast.error('Bank transfer setup failed. Please try again.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const processPayment = async (
    amount: number, 
    method: PaymentMethod, 
    description: string
  ): Promise<boolean> => {
    if (method.type === 'card') {
      return await processCardPayment(amount, method.details, description);
    } else if (method.type === 'mobile') {
      return await processMobilePayment(amount, method.details.phoneNumber, description);
    } else if (method.type === 'bank') {
      return await processBankTransfer(amount, method.details, description);
    }
    
    toast.error('Invalid payment method');
    return false;
  };

  const value = {
    isProcessing,
    processPayment,
    processCardPayment,
    processMobilePayment,
    processBankTransfer
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}