import React, { useState } from 'react';
import { Globe, Search, CheckCircle, AlertCircle, Star } from 'lucide-react';

interface DomainSelectorProps {
  selectedDomain: string;
  onDomainChange: (domain: string, price: number) => void;
}

const domainExtensions = [
  {
    extension: '.com',
    price: 1500,
    description: 'Most popular and trusted worldwide',
    popular: true,
    renewal: 1500
  },
  {
    extension: '.co.ke',
    price: 2000,
    description: 'Perfect for Kenyan businesses',
    popular: true,
    renewal: 2000
  },
  {
    extension: '.ke',
    price: 3000,
    description: 'Premium Kenyan domain',
    popular: false,
    renewal: 3000
  },
  {
    extension: '.org',
    price: 1800,
    description: 'Great for organizations and NGOs',
    popular: false,
    renewal: 1800
  },
  {
    extension: '.net',
    price: 1600,
    description: 'Alternative to .com domains',
    popular: false,
    renewal: 1600
  },
  {
    extension: '.biz',
    price: 2200,
    description: 'Perfect for business websites',
    popular: false,
    renewal: 2200
  },
  {
    extension: '.info',
    price: 1400,
    description: 'Ideal for informational sites',
    popular: false,
    renewal: 1400
  },
  {
    extension: '.shop',
    price: 3500,
    description: 'Perfect for e-commerce stores',
    popular: true,
    renewal: 3500
  }
];

export default function DomainSelector({ selectedDomain, onDomainChange }: DomainSelectorProps) {
  const [domainName, setDomainName] = useState('');
  const [selectedExtension, setSelectedExtension] = useState('.com');
  const [isChecking, setIsChecking] = useState(false);
  const [domainStatus, setDomainStatus] = useState<'available' | 'taken' | 'invalid' | null>(null);

  const checkDomainAvailability = async () => {
    if (!domainName.trim()) {
      setDomainStatus('invalid');
      return;
    }

    setIsChecking(true);
    setDomainStatus(null);

    // Simulate domain check (in production, you'd call a real API)
    setTimeout(() => {
      // Random availability for demo
      const isAvailable = Math.random() > 0.3;
      setDomainStatus(isAvailable ? 'available' : 'taken');
      
      if (isAvailable) {
        const fullDomain = domainName + selectedExtension;
        const extension = domainExtensions.find(ext => ext.extension === selectedExtension);
        onDomainChange(fullDomain, extension?.price || 0);
      }
      
      setIsChecking(false);
    }, 1500);
  };

  const handleDomainNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setDomainName(value);
    setDomainStatus(null);
  };

  const handleExtensionSelect = (extension: string) => {
    setSelectedExtension(extension);
    setDomainStatus(null);
  };

  return (
    <div className="space-y-8">
      {/* Domain Search */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center space-x-2 mb-4">
          <Globe className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Find Your Perfect Domain</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={domainName}
              onChange={handleDomainNameChange}
              placeholder="Enter your domain name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
          <select
            value={selectedExtension}
            onChange={(e) => handleExtensionSelect(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            {domainExtensions.map((ext) => (
              <option key={ext.extension} value={ext.extension}>
                {ext.extension} - KES {ext.price.toLocaleString()}
              </option>
            ))}
          </select>
          <button
            onClick={checkDomainAvailability}
            disabled={isChecking || !domainName.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isChecking ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Checking...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Check</span>
              </>
            )}
          </button>
        </div>

        {/* Domain Status */}
        {domainStatus && (
          <div className="mt-4">
            {domainStatus === 'available' && (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">
                  {domainName}{selectedExtension} is available!
                </span>
              </div>
            )}
            {domainStatus === 'taken' && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">
                  {domainName}{selectedExtension} is already taken. Try a different name.
                </span>
              </div>
            )}
            {domainStatus === 'invalid' && (
              <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">
                  Please enter a valid domain name.
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Domain Extensions Grid */}
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-4">Popular Domain Extensions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {domainExtensions.map((domain) => (
            <div
              key={domain.extension}
              className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                selectedExtension === domain.extension
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              }`}
              onClick={() => handleExtensionSelect(domain.extension)}
            >
              {domain.popular && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                  Popular
                </div>
              )}
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {domain.extension}
                </div>
                <div className="text-lg font-bold text-blue-600 mb-2">
                  KES {domain.price.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {domain.description}
                </p>
                <div className="text-xs text-gray-500">
                  Renewal: KES {domain.renewal.toLocaleString()}/year
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Domain Benefits */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Why Get a Custom Domain?</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Professional brand image</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Better search engine ranking</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Custom email addresses</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Full control over your online presence</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Easy to remember and share</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">SSL certificate included</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skip Option */}
      <div className="text-center">
        <button
          onClick={() => onDomainChange('', 0)}
          className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          Skip for now - Use free subdomain (yourshop.devboma.com)
        </button>
      </div>
    </div>
  );
}