import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PricingManager, PricingRegion } from '../utils/pricing';

interface PricingContextType {
  currentRegion: PricingRegion;
  formatPrice: (basePrice: number) => string;
  getAdjustedPrice: (basePrice: number) => number;
  isAfricanRegion: boolean;
  isLoading: boolean;
  userCountry: string | null;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export function PricingProvider({ children }: { children: ReactNode }) {
  const [pricingManager] = useState(() => PricingManager.getInstance());
  const [currentRegion, setCurrentRegion] = useState(pricingManager.getCurrentRegion());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for location detection to complete
    const checkLocation = async () => {
      // Give it a moment to detect location
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentRegion(pricingManager.getCurrentRegion());
      setIsLoading(false);
    };

    checkLocation();
  }, [pricingManager]);

  const value: PricingContextType = {
    currentRegion,
    formatPrice: (basePrice: number) => pricingManager.formatPrice(basePrice),
    getAdjustedPrice: (basePrice: number) => pricingManager.getAdjustedPrice(basePrice),
    isAfricanRegion: pricingManager.isAfricanRegion(),
    isLoading,
    userCountry: pricingManager.getUserCountry()
  };

  return (
    <PricingContext.Provider value={value}>
      {children}
    </PricingContext.Provider>
  );
}

export function usePricing() {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
}