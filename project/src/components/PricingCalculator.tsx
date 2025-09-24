import React from 'react';
import { DollarSign, TrendingUp, Shield, Zap } from 'lucide-react';
import { usePricing } from '../contexts/PricingContext';

interface PricingCalculatorProps {
  selectedDesign: string;
  selectedFeatures: string[];
  hostingTier: string;
  billingCycle: 'monthly' | 'yearly';
  selectedDomain: string;
  domainPrice: number;
  selectedMaintenance: string;
  totalCost: number;
}

export default function PricingCalculator({
  selectedDesign,
  selectedFeatures,
  hostingTier,
  billingCycle,
  selectedDomain,
  domainPrice,
  selectedMaintenance,
  totalCost
}: PricingCalculatorProps) {
  const { formatPrice, currentRegion } = usePricing();
  const baseCost = 25000;
  
  const designCosts = {
    'modern': 0,
    'luxury': 15000,
    'minimal': 5000,
    'vibrant': 10000,
    'heavy': 30000,
    'titan': 50000
  };

  const featureCosts = {
    'basic-analytics': 0,
    'advanced-analytics': 20000,
    'inventory-management': 15000,
    'multi-payment': 10000,
    'custom-domain': 5000,
    'email-marketing': 12000,
    'social-integration': 8000
  };

  const hostingCosts = {
    'basic': billingCycle === 'yearly' ? 1500 : Math.round((1500 / 12) * 1.03),
    'standard': billingCycle === 'yearly' ? 8000 : Math.round((8000 / 12) * 1.03),
    'premium': billingCycle === 'yearly' ? 20000 : Math.round((20000 / 12) * 1.03)
  };

  const maintenanceCosts = {
    'basic': 1250,
    'standard': 2500,
    'premium': 5000
  };

  const designNames = {
    'modern': 'Modern',
    'luxury': 'Luxury',
    'minimal': 'Minimal',
    'vibrant': 'Vibrant',
    'heavy': 'Heavy',
    'titan': 'Titan'
  };

  const hostingNames = {
    'basic': 'Basic',
    'standard': 'Standard',
    'premium': 'Premium'
  };

  const maintenanceNames = {
    'basic': 'Basic',
    'standard': 'Standard',
    'premium': 'Premium'
  };

  return (
    <div className="space-y-6">
      {/* Cost Breakdown */}
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-700 font-medium">Base Boma Shop</span>
          <span className="font-bold text-gray-900">KES {baseCost.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-700">Design: {designNames[selectedDesign as keyof typeof designNames]}</span>
          <span className="font-bold text-gray-900">
            {designCosts[selectedDesign as keyof typeof designCosts] === 0 
              ? 'Free' 
              : `+KES ${designCosts[selectedDesign as keyof typeof designCosts]?.toLocaleString()}`}
          </span>
        </div>

        {selectedFeatures.filter(f => f !== 'basic-analytics').map((feature) => (
          <div key={feature} className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-700 capitalize">
              {feature.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
            <span className="font-bold text-blue-600">
              +KES {(featureCosts[feature as keyof typeof featureCosts] || 0).toLocaleString()}
            </span>
          </div>
        ))}

        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-700">Hosting: {hostingNames[hostingTier as keyof typeof hostingNames]}</span>
          <span className="font-bold text-gray-900">
            +{formatPrice(hostingCosts[hostingTier as keyof typeof hostingCosts] || 0)}
            <span className="text-xs text-gray-500 ml-1">/{billingCycle}</span>
          </span>
        </div>

        {selectedDomain && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-700">Domain: {selectedDomain}</span>
            <span className="font-bold text-gray-900">
              +KES {domainPrice.toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-700">Maintenance: {maintenanceNames[selectedMaintenance as keyof typeof maintenanceNames]}</span>
          <span className="font-bold text-gray-900">
            +{formatPrice(maintenanceCosts[selectedMaintenance as keyof typeof maintenanceCosts] || 0)}
            <span className="text-xs text-gray-500 ml-1">/month</span>
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-700">Maintenance: {maintenanceNames[selectedMaintenance as keyof typeof maintenanceNames]}</span>
          <span className="font-bold text-gray-900">
            +{formatPrice(maintenanceCosts[selectedMaintenance as keyof typeof maintenanceCosts] || 0)}
            <span className="text-xs text-gray-500 ml-1">/month</span>
          </span>
        </div>
        {billingCycle === 'monthly' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Monthly Billing:</strong> 3% surcharge applied to hosting costs
            </p>
          </div>
        )}
      </div>

      {/* Total Cost */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Total Investment</span>
          </div>
          <span className="text-3xl font-bold text-blue-600">
            {formatPrice(totalCost)}
          </span>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          <p>One-time setup cost</p>
          <p>Hosting: {formatPrice(hostingCosts[hostingTier as keyof typeof hostingCosts] || 0)} per {billingCycle}</p>
          {!currentRegion.code.match(/^(KE|UG|TZ|RW|ET|GH|NG|ZA|EG|MA)$/) && (
            <p className="text-blue-600 font-medium">International pricing (+70%)</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center space-x-1 text-green-600">
            <Shield className="w-3 h-3" />
            <span>6-month warranty</span>
          </div>
          <div className="flex items-center space-x-1 text-blue-600">
            <Zap className="w-3 h-3" />
            <span>Fast deployment</span>
          </div>
        </div>
      </div>

      {/* What's Included */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <span className="font-bold text-gray-900">What's Always Included:</span>
        </div>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>Custom webapp frontend with your branding</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>Multi-tenant backend system (shared, secure)</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>Global payment processing (Stripe)</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>6-month support & maintenance</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>SSL certificate & enterprise security</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>Mobile-responsive design</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>Basic analytics & reporting</span>
          </li>
        </ul>
      </div>

      {/* Savings Indicator */}
      {selectedFeatures.length > 2 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-green-700">
            <TrendingUp className="w-4 h-4" />
            <span className="font-bold text-sm">
              Great choice! You're getting {selectedFeatures.length} premium features.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}