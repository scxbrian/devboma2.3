import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ArrowLeft, Star, Clock, Shield, Zap, Crown, Rocket, Building } from 'lucide-react';
import { serviceTiers } from '../data/serviceTiers';

const tierIcons = {
  lite: Building,
  core: Zap,
  prime: Crown,
  titan: Rocket,
  shop: Star
};

const tierGradients = {
  lite: 'from-green-600 to-green-700',
  core: 'from-blue-600 to-blue-700',
  prime: 'from-purple-600 to-purple-700',
  titan: 'from-red-600 to-red-700',
  shop: 'from-yellow-500 to-yellow-600'
};

export default function ServiceTierPage() {
  const { tier: tierId } = useParams<{ tier: string }>();
  const tier = serviceTiers.find(t => t.id === tierId);

  if (!tier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service tier not found</h1>
          <p className="text-gray-600 mb-6">The requested service tier doesn't exist.</p>
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to homepage</span>
          </Link>
        </div>
      </div>
    );
  }

  const TierIcon = tierIcons[tier.id as keyof typeof tierIcons] || Building;
  const gradient = tierGradients[tier.id as keyof typeof tierGradients] || 'from-blue-600 to-blue-700';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-blue-700 hover:text-blue-800 mb-8 font-medium transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to services</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className={`bg-gradient-to-r ${gradient} px-8 py-16 text-white text-center relative overflow-hidden`}>
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-2xl opacity-10"></div>
            </div>
            
            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl mb-6">
                <TierIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{tier.name}</h1>
              <p className="text-xl text-white text-opacity-90 mb-8 max-w-2xl mx-auto">{tier.description}</p>
              
              <div className="inline-flex items-center space-x-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl px-8 py-4">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">
                    KES {tier.price.toLocaleString()}
                  </div>
                  <p className="text-white text-opacity-80 text-sm">Investment</p>
                </div>
                <div className="w-px h-12 bg-white bg-opacity-30"></div>
                <div className="text-center">
                  <div className="flex items-center space-x-1 text-lg font-bold mb-1">
                    <Clock className="w-5 h-5" />
                    <span>{tier.timeline.split(' ')[2]}-{tier.timeline.split(' ')[3]}</span>
                  </div>
                  <p className="text-white text-opacity-80 text-sm">Delivery</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  <span>Features Included</span>
                </h2>
                <div className="space-y-4">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3 group">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-200">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <span>What's Included</span>
                </h2>
                <div className="space-y-4">
                  {tier.included.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 group">
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Process Timeline */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Development Process</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { step: '1', title: 'Consultation', desc: 'Requirements gathering' },
                  { step: '2', title: 'Design', desc: 'UI/UX creation' },
                  { step: '3', title: 'Development', desc: 'Building your solution' },
                  { step: '4', title: 'Launch', desc: 'Deployment & support' }
                ].map((phase, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                      {phase.step}
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{phase.title}</h4>
                    <p className="text-sm text-gray-600">{phase.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="border-t border-gray-200 pt-12">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Ready to get started with {tier.name}?
                </h3>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Contact us today to discuss your project requirements, timeline, and how we can 
                  bring your vision to life with excellence and integrity.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2 group">
                    <span>Start Your Project</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-bold hover:border-blue-600 hover:text-blue-600 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1">
                    Schedule Consultation
                  </button>
                </div>

                <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>30-day guarantee</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>5-star support</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>On-time delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}