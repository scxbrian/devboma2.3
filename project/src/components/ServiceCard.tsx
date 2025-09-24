import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Star, Zap, Crown, Rocket, Building } from 'lucide-react';
import { ServiceTier } from '../data/serviceTiers';
import { usePricing } from '../contexts/PricingContext';

interface ServiceCardProps {
  tier: ServiceTier;
  featured?: boolean;
  onGetStarted?: (tier: ServiceTier) => void;
}

const tierIcons = {
  lite: Building,
  core: Zap,
  prime: Crown,
  titan: Rocket,
  shop: Star
};

export default function ServiceCard({ tier, featured, onGetStarted }: ServiceCardProps) {
  const TierIcon = tierIcons[tier.id as keyof typeof tierIcons] || Building;
  const { formatPrice } = usePricing();

  return (
    <div className={`relative rounded-3xl border-2 p-8 bg-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 group ${
      featured 
        ? 'border-yellow-400 shadow-2xl scale-105 bg-gradient-to-br from-yellow-50 to-yellow-100' 
        : 'border-gray-200 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50'
    }`}>
      {featured && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-6 py-3 rounded-full text-sm font-bold flex items-center space-x-2 shadow-lg">
            <Star className="w-4 h-4" />
            <span>MOST POPULAR</span>
          </div>
        </div>
      )}
      
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-transform duration-300 group-hover:scale-110 ${
          featured 
            ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' 
            : 'bg-gradient-to-br from-blue-600 to-indigo-700'
        }`}>
          <TierIcon className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{tier.name}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{tier.description}</p>
        
        <div className="mb-4">
          <div className={`text-5xl font-bold mb-2 ${
            featured ? 'text-yellow-600' : 'text-blue-700'
          }`}>
            {tier.price === 0 ? 'Custom' : formatPrice(tier.price)}
          </div>
          <p className="text-sm text-gray-500 font-medium">{tier.timeline}</p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {tier.features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3 group/item">
            <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-colors duration-200 ${
              featured ? 'text-yellow-600' : 'text-green-600 group-hover/item:text-blue-600'
            }`} />
            <span className="text-gray-700 leading-relaxed group-hover/item:text-gray-900 transition-colors duration-200">{feature}</span>
          </div>
        ))}
      </div>

      {tier.id === 'shop' ? (
        <Link
          to="/boma-shop"
          className={`w-full flex items-center justify-center space-x-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${
            featured
              ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 hover:from-yellow-500 hover:to-yellow-600 shadow-lg hover:shadow-yellow-500/25'
              : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 shadow-lg hover:shadow-blue-500/25'
          }`}
        >
          <span>Build Your Shop</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      ) : (
        <button
          onClick={() => onGetStarted && onGetStarted(tier)}
          className={`w-full flex items-center justify-center space-x-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${
            featured
              ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 hover:from-yellow-500 hover:to-yellow-600 shadow-lg hover:shadow-yellow-500/25'
              : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 shadow-lg hover:shadow-blue-500/25'
          }`}
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      )}

      {tier.id === 'shop' && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Interactive builder • Dynamic pricing • Custom frontend
          </p>
        </div>
      )}
    </div>
  );
}