import React from 'react';
import { CheckCircle, BarChart3, Package, CreditCard, Globe, Mail, Share2, Server, Zap, Shield } from 'lucide-react';
import DomainSelector from './DomainSelector';

interface FeatureSelectorProps {
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
  hostingTier: string;
  onHostingChange: (tier: string) => void;
  billingCycle: 'monthly' | 'yearly';
  onBillingCycleChange: (cycle: 'monthly' | 'yearly') => void;
  selectedDomain: string;
  onDomainChange: (domain: string, price: number) => void;
  selectedMaintenance: string;
  onMaintenanceChange: (maintenance: string) => void;
}

const additionalFeatures = [
  {
    id: 'advanced-analytics',
    name: 'Advanced Analytics',
    description: 'Detailed sales reports, customer insights, conversion tracking, and performance metrics',
    cost: 20000,
    icon: BarChart3,
    popular: true
  },
  {
    id: 'inventory-management',
    name: 'Advanced Inventory',
    description: 'Stock alerts, supplier management, automated reordering, and inventory forecasting',
    cost: 15000,
    icon: Package,
    popular: true
  },
  {
    id: 'multi-payment',
    name: 'Multiple Payment Options',
    description: 'Mpesa, Stripe, PayPal, bank transfer integration with fraud protection',
    cost: 10000,
    icon: CreditCard,
    popular: false
  },
  {
    id: 'custom-domain',
    name: 'Custom Domain',
    description: 'Your own domain name (yourshop.com) instead of subdomain with SSL',
    cost: 5000,
    icon: Globe,
    popular: false
  },
  {
    id: 'email-marketing',
    name: 'Email Marketing',
    description: 'Built-in email campaigns, newsletters, customer automation, and segmentation',
    cost: 12000,
    icon: Mail,
    popular: true
  },
  {
    id: 'social-integration',
    name: 'Social Media Integration',
    description: 'Instagram, Facebook, WhatsApp shop integration with social commerce',
    cost: 8000,
    icon: Share2,
    popular: false
  }
];

const hostingTiers = [
  {
    id: 'basic',
    name: 'Basic Hosting',
    description: '1GB storage, 10GB bandwidth, basic SSL, daily backups',
    yearlyPrice: 1500,
    icon: Server,
    features: ['1GB Storage', '10GB Bandwidth', 'Basic SSL', 'Daily Backups'],
  },
  {
    id: 'standard',
    name: 'Standard Hosting',
    description: '5GB storage, 50GB bandwidth, advanced SSL, CDN, real-time backups',
    yearlyPrice: 8000,
    icon: Zap,
    features: ['5GB Storage', '50GB Bandwidth', 'Advanced SSL', 'CDN Included', 'Real-time Backups'],
  },
  {
    id: 'premium',
    name: 'Premium Hosting',
    description: '20GB storage, unlimited bandwidth, priority support, global CDN',
    yearlyPrice: 20000,
    icon: Shield,
    features: ['20GB Storage', 'Unlimited Bandwidth', 'Priority Support', 'Global CDN', 'Advanced Security'],
  }
];

const maintenanceTiers = [
  {
    id: 'basic',
    name: 'Basic Maintenance',
    description: 'Essential maintenance and updates',
    cost: 1250,
    icon: Server,
    features: ['Monthly Updates', 'Basic Monitoring', 'Email Support', 'Security Patches']
  },
  {
    id: 'standard',
    name: 'Standard Maintenance',
    description: 'Comprehensive maintenance with priority support',
    cost: 2500,
    icon: Zap,
    features: ['Weekly Updates', 'Advanced Monitoring', 'Priority Support', 'Security Patches', 'Performance Optimization']
  },
  {
    id: 'premium',
    name: 'Premium Maintenance',
    description: 'Full-service maintenance with dedicated support',
    cost: 5000,
    icon: Shield,
    features: ['Daily Updates', '24/7 Monitoring', 'Dedicated Support', 'Security Patches', 'Performance Optimization', 'Custom Configurations']
  }
];

export default function FeatureSelector({
  selectedFeatures,
  onFeaturesChange,
  hostingTier,
  onHostingChange,
  billingCycle,
  onBillingCycleChange,
  selectedDomain,
 onDomainChange,
  selectedMaintenance,
  onMaintenanceChange
}: FeatureSelectorProps) {

  const toggleFeature = (featureId: string) => {
    if (selectedFeatures.includes(featureId)) {
      onFeaturesChange(selectedFeatures.filter(f => f !== featureId));
    } else {
      onFeaturesChange([...selectedFeatures, featureId]);
    }
  };

  return (
    <div className="space-y-10">
      {/* Additional Features */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Additional Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {additionalFeatures.map((feature) => {
            const Icon = feature.icon;
            const isSelected = selectedFeatures.includes(feature.id);
            
            return (
              <div
                key={feature.id}
                className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  isSelected
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                }`}
                onClick={() => toggleFeature(feature.id)}
              >
                {feature.popular && (
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                    Popular
                  </div>
                )}
                
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl transition-colors duration-200 ${
                    isSelected 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle 
                          className={`w-5 h-5 transition-colors duration-200 ${
                            isSelected ? 'text-blue-500' : 'text-gray-300'
                          }`} 
                        />
                        <h4 className="font-bold text-gray-900">{feature.name}</h4>
                      </div>
                      <span className="text-lg font-bold text-blue-600">
                        +KES {feature.cost.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Domain Selection */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Domain & Branding</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <DomainSelector 
            selectedDomain={selectedDomain}
            onDomainChange={onDomainChange}
          />
        </div>
      </div>

      {/* Hosting Tier Selection */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Hosting Tier</h3>
        
        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1 inline-flex">
            <button
              onClick={() => onBillingCycleChange('yearly')}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                billingCycle === 'yearly'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs text-green-600 font-bold">Best Value</span>
            </button>
            <button
              onClick={() => onBillingCycleChange('monthly')}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
              <span className="ml-1 text-xs text-red-600 font-bold">+3%</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hostingTiers.map((tier) => {
            const Icon = tier.icon;
            const isSelected = hostingTier === tier.id;
            
            // Calculate pricing: yearly is base, monthly is yearly/12 + 3%
            const yearlyPrice = tier.yearlyPrice;
            const monthlyPrice = Math.round((yearlyPrice / 12) * 1.03);
            const displayPrice = billingCycle === 'yearly' ? yearlyPrice : monthlyPrice;
            
            return (
              <div
                key={tier.id}
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  isSelected
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                }`}
                onClick={() => onHostingChange(tier.id)}
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-colors duration-200 ${
                    isSelected 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <h4 className="font-bold text-gray-900 mb-2">{tier.name}</h4>
                  <div className="mb-3">
                    <p className="text-xl font-bold text-blue-600">
                      KES {displayPrice.toLocaleString()}
                    </p>
                    {billingCycle === 'monthly' && (
                      <p className="text-sm text-red-600 font-medium">
                        +3% monthly fee
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      per {billingCycle}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
                  
                  <div className="space-y-1">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Maintenance Selection */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Maintenance Plan</h3>
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-200">
          <p className="text-gray-700 mb-6 leading-relaxed">
            Keep your shop running smoothly with our maintenance services. All plans are billed monthly.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {maintenanceTiers.map((tier) => {
              const Icon = tier.icon;
              const isSelected = selectedMaintenance === tier.id;
              
              return (
                <div
                  key={tier.id}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    isSelected
                      ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-lg'
                      : 'border-gray-200 hover:border-green-300 bg-white'
                  }`}
                  onClick={() => onMaintenanceChange(tier.id)}
                >
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 transition-colors duration-200 ${
                      isSelected 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <h4 className="font-bold text-gray-900 mb-2">{tier.name}</h4>
                    <p className="text-lg font-bold text-green-600 mb-2">
                      KES {tier.cost.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">per month</p>
                    <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
                    
                    <div className="space-y-1">
                      {tier.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-center space-x-1">
                          <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}