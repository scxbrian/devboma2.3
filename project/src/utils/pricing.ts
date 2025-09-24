// Enhanced pricing utilities with proper currency conversion and domain integration
export interface PricingRegion {
  code: string;
  name: string;
  currency: string;
  symbol: string;
  exchangeRate: number; // KSH to local currency
  markup: number; // Additional markup for stronger currencies
}

export const pricingRegions: Record<string, PricingRegion> = {
  // East African Community (base pricing)
  KE: { code: 'KE', name: 'Kenya', currency: 'KSH', symbol: 'KSH', exchangeRate: 1.0, markup: 1.0 },
  UG: { code: 'UG', name: 'Uganda', currency: 'UGX', symbol: 'UGX', exchangeRate: 38.5, markup: 1.0 },
  TZ: { code: 'TZ', name: 'Tanzania', currency: 'TZS', symbol: 'TZS', exchangeRate: 3.4, markup: 1.0 },
  RW: { code: 'RW', name: 'Rwanda', currency: 'RWF', symbol: 'RWF', exchangeRate: 14.2, markup: 1.0 },
  
  // Other African countries (base pricing)
  NG: { code: 'NG', name: 'Nigeria', currency: 'NGN', symbol: '₦', exchangeRate: 0.18, markup: 1.0 },
  GH: { code: 'GH', name: 'Ghana', currency: 'GHS', symbol: 'GH₵', exchangeRate: 0.067, markup: 1.0 },
  ZA: { code: 'ZA', name: 'South Africa', currency: 'ZAR', symbol: 'R', exchangeRate: 0.75, markup: 1.0 },
  EG: { code: 'EG', name: 'Egypt', currency: 'EGP', symbol: 'E£', exchangeRate: 0.51, markup: 1.0 },
  MA: { code: 'MA', name: 'Morocco', currency: 'MAD', symbol: 'DH', exchangeRate: 1.28, markup: 1.0 },
  ET: { code: 'ET', name: 'Ethiopia', currency: 'ETB', symbol: 'Br', exchangeRate: 6.1, markup: 1.0 },
  
  // Stronger currency countries (40% markup)
  US: { code: 'US', name: 'United States', currency: 'USD', symbol: '$', exchangeRate: 0.0077, markup: 1.4 },
  GB: { code: 'GB', name: 'United Kingdom', currency: 'GBP', symbol: '£', exchangeRate: 0.0061, markup: 1.4 },
  CA: { code: 'CA', name: 'Canada', currency: 'CAD', symbol: 'C$', exchangeRate: 0.011, markup: 1.4 },
  AU: { code: 'AU', name: 'Australia', currency: 'AUD', symbol: 'A$', exchangeRate: 0.012, markup: 1.4 },
  DE: { code: 'DE', name: 'Germany', currency: 'EUR', symbol: '€', exchangeRate: 0.0073, markup: 1.4 },
  FR: { code: 'FR', name: 'France', currency: 'EUR', symbol: '€', exchangeRate: 0.0073, markup: 1.4 },
  JP: { code: 'JP', name: 'Japan', currency: 'JPY', symbol: '¥', exchangeRate: 1.19, markup: 1.4 },
  CH: { code: 'CH', name: 'Switzerland', currency: 'CHF', symbol: 'CHF', exchangeRate: 0.0072, markup: 1.4 },
  
  // Default for unlisted countries
  DEFAULT: { code: 'DEFAULT', name: 'International', currency: 'USD', symbol: '$', exchangeRate: 0.0077, markup: 1.2 }
};

export const africanCountries = new Set([
  'KE', 'UG', 'TZ', 'RW', 'ET', 'GH', 'NG', 'ZA', 'EG', 'MA', 'DZ', 'TN', 'SN', 'CI', 
  'BF', 'ML', 'NE', 'TD', 'CM', 'GA', 'CG', 'CD', 'CF', 'AO', 'ZM', 'ZW', 'BW', 'NA', 
  'SZ', 'LS', 'MW', 'MZ', 'MG', 'MU', 'SC'
]);

export class PricingManager {
  private static instance: PricingManager;
  private currentRegion: PricingRegion = pricingRegions.KE; // Default to Kenya
  private userCountry: string | null = null;

  private constructor() {
    this.detectUserLocation();
  }

  public static getInstance(): PricingManager {
    if (!PricingManager.instance) {
      PricingManager.instance = new PricingManager();
    }
    return PricingManager.instance;
  }

  private async detectUserLocation(): Promise<void> {
    try {
      // Try to get user's country from IP geolocation
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.country_code) {
        this.userCountry = data.country_code;
        this.updateRegion(data.country_code);
      }
    } catch (error) {
      console.log('Could not detect location, using Kenya pricing');
      // Fallback to Kenya pricing
      this.currentRegion = pricingRegions.KE;
    }
  }

  private updateRegion(countryCode: string): void {
    this.currentRegion = pricingRegions[countryCode] || pricingRegions.DEFAULT;
  }

  public getCurrentRegion(): PricingRegion {
    return this.currentRegion;
  }

  public formatPrice(basePriceKSH: number): string {
    const adjustedPrice = this.getAdjustedPrice(basePriceKSH);
    const localPrice = Math.round(adjustedPrice * this.currentRegion.exchangeRate);
    return `${this.currentRegion.symbol} ${localPrice.toLocaleString()}`;
  }

  public getAdjustedPrice(basePriceKSH: number): number {
    return Math.round(basePriceKSH * this.currentRegion.markup);
  }

  public isAfricanRegion(): boolean {
    return africanCountries.has(this.userCountry || 'KE');
  }

  public getUserCountry(): string | null {
    return this.userCountry;
  }
}

// Domain pricing in KSH (base prices)
export const domainPrices = {
  '.com': 1500,
  '.co.ke': 2000,
  '.ke': 3000,
  '.org': 1800,
  '.net': 1600,
  '.biz': 2200,
  '.info': 1400,
  '.shop': 3500,
  '.store': 4000,
  '.online': 3200,
  '.site': 2800,
  '.tech': 4500
};

// Domain registration API integration
export class DomainManager {
  private static instance: DomainManager;
  private apiKey: string = process.env.DOMAIN_API_KEY || '';

  public static getInstance(): DomainManager {
    if (!DomainManager.instance) {
      DomainManager.instance = new DomainManager();
    }
    return DomainManager.instance;
  }

  public async checkAvailability(domain: string): Promise<{ available: boolean; price: number }> {
    try {
      // For demo purposes, simulate API call
      // In production, integrate with domain registrar API like Namecheap, GoDaddy, or local Kenyan registrar
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const extension = '.' + domain.split('.').pop();
      const basePrice = domainPrices[extension as keyof typeof domainPrices] || 2000;
      
      // Simulate availability (70% chance available)
      const available = Math.random() > 0.3;
      
      return { available, price: basePrice };
    } catch (error) {
      console.error('Domain check failed:', error);
      return { available: false, price: 0 };
    }
  }

  public async registerDomain(domain: string, customerInfo: any): Promise<{ success: boolean; orderId?: string }> {
    try {
      // Integrate with domain registrar API
      // This would typically involve:
      // 1. Validating customer information
      // 2. Processing payment
      // 3. Submitting registration request
      // 4. Setting up DNS records
      
      console.log('Registering domain:', domain, 'for customer:', customerInfo);
      
      // Simulate registration process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      return { success: true, orderId: 'DOM-' + Date.now() };
    } catch (error) {
      console.error('Domain registration failed:', error);
      return { success: false };
    }
  }
}

// Service tier base prices (in KSH)
export const serviceTierPrices = {
  lite: 39000,
  core: 145000,
  prime: 299000,
  titan: 499000
};

// Hosting plan base prices (in KSH - yearly)
export const hostingPrices = {
  basic: 1500,
  standard: 8000,
  premium: 20000
};

// Calculate monthly hosting price with 3% increase
export function calculateMonthlyHostingPrice(yearlyPrice: number): number {
  const monthlyBase = yearlyPrice / 12;
  return Math.round(monthlyBase * 1.03); // 3% increase for monthly
}