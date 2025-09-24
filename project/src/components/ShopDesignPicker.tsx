import React from 'react';
import { Star, Crown, Zap, Palette } from 'lucide-react';

interface ShopDesignPickerProps {
  selectedDesign: string;
  onDesignChange: (design: string) => void;
}

const designOptions = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, contemporary design with bold typography and minimalist aesthetics',
    cost: 0,
    icon: Zap,
    gradient: 'from-blue-500 to-indigo-600',
    image: 'https://images.pexels.com/photos/356043/pexels-photo-356043.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['Clean layouts', 'Modern typography', 'Smooth animations', 'Mobile-first design']
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Premium design with elegant animations, gold accents, and sophisticated layouts',
    cost: 15000,
    icon: Crown,
    gradient: 'from-yellow-500 to-yellow-600',
    image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['Premium animations', 'Gold accents', 'Elegant typography', 'Luxury feel']
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean design focusing on products and simplicity with maximum impact',
    cost: 5000,
    icon: Palette,
    gradient: 'from-gray-500 to-gray-600',
    image: 'https://images.pexels.com/photos/821754/pexels-photo-821754.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['Ultra-clean design', 'Product focus', 'Maximum simplicity', 'Fast loading']
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Colorful, energetic design perfect for lifestyle brands and creative businesses',
    cost: 10000,
    icon: Star,
    gradient: 'from-pink-500 to-purple-600',
    image: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['Bold colors', 'Creative layouts', 'Energetic feel', 'Brand personality']
  },
  {
    id: 'heavy',
    name: 'Heavy',
    description: 'Bold, impactful design with strong visual elements and dynamic interactions',
    cost: 30000,
    icon: Zap,
    gradient: 'from-red-500 to-red-600',
    image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['Bold visual elements', 'Dynamic interactions', 'Strong typography', 'High impact design']
  },
  {
    id: 'titan',
    name: 'Titan',
    description: 'Ultimate premium design with advanced animations, custom elements, and enterprise features',
    cost: 50000,
    icon: Crown,
    gradient: 'from-purple-600 to-purple-700',
    image: 'https://images.pexels.com/photos/356043/pexels-photo-356043.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['Advanced animations', 'Custom elements', 'Enterprise features', 'Ultimate premium feel']
  }
];

export default function ShopDesignPicker({ selectedDesign, onDesignChange }: ShopDesignPickerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {designOptions.map((design) => {
        const Icon = design.icon;
        const isSelected = selectedDesign === design.id;
        
        return (
          <div
            key={design.id}
            className={`relative border-2 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group ${
              isSelected 
                ? 'border-blue-500 shadow-2xl transform -translate-y-2 ring-4 ring-blue-200' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => onDesignChange(design.id)}
          >
            {/* Image Preview */}
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
              <img 
                src={design.image} 
                alt={design.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className={`bg-gradient-to-r ${design.gradient} text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg flex items-center space-x-2`}>
                  <Icon className="w-5 h-5" />
                  <span>{design.name}</span>
                </div>
              </div>
              
              {isSelected && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg">
                  <Star className="w-5 h-5 fill-current" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                  <h3 className="text-xl font-bold text-gray-900">{design.name}</h3>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                    {design.cost === 0 ? 'Free' : `+KES ${design.cost.toLocaleString()}`}
                  </span>
                  {design.cost > 0 && (
                    <p className="text-xs text-gray-500">one-time</p>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 leading-relaxed">{design.description}</p>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Includes:</p>
                <div className="grid grid-cols-2 gap-1">
                  {design.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}