import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  Shield, 
  Palette, 
  TrendingUp, 
  Heart, 
  Star, 
  Users, 
  Clock, 
  Award,
  Building,
  Crown,
  Rocket,
  Code,
  Globe,
  Search
} from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import PaymentModal from '../components/PaymentModal';
import { usePricing } from '../contexts/PricingContext';
import { serviceTiers } from '../data/serviceTiers';

export default function LandingPage() {
  const [selectedYears, setSelectedYears] = useState(1);
  const [paymentModal, setPaymentModal] = useState({ 
    isOpen: false, 
    service: { name: '', price: 0, duration: '' } 
  });
  const { formatPrice, getAdjustedPrice } = usePricing();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Enhanced Animations */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-20 lg:py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div 
            className="absolute top-40 right-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div 
            className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              scale: [1, 1.3, 1],
              x: [-50, 50, -50],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full px-6 py-3 text-white border border-white border-opacity-20">
              <Heart className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">
                "For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future." - Jeremiah 29:11
              </span>
            </div>
          </motion.div>
          
          {/* Animated Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 1.2, 
              type: "spring", 
              stiffness: 100,
              delay: 0.2 
            }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl shadow-2xl mb-6 animate-pulse-glow">
              <span className="text-6xl font-bold text-yellow-900 font-mono">&lt;/&gt;</span>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight"
          >
            Premium Web Solutions
            <motion.span 
              className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Built with Excellence
            </motion.span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Combining technical excellence with faith-driven values, we deliver 
            cutting-edge web and software solutions for businesses and creators across Kenya and beyond.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <Link
              to="/boma-shop"
              className="group bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-10 py-5 rounded-xl text-lg font-bold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 transform hover:-translate-y-1 flex items-center justify-center space-x-3"
            >
              <Zap className="w-6 h-6 group-hover:animate-bounce" />
              <span>Build Your Shop</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#services"
              className="group bg-white bg-opacity-10 backdrop-blur-sm text-white border-2 border-white border-opacity-30 px-10 py-5 rounded-xl text-lg font-bold hover:bg-opacity-20 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Explore Services
            </a>
          </motion.div>

          {/* Trust Indicators with Animation */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: '50+', label: 'Projects Delivered' },
              { value: '100%', label: 'Client Satisfaction' },
              { value: '24/7', label: 'Support Available' },
              { value: '5★', label: 'Average Rating' }
            ].map((stat, index) => (
              <motion.div key={index} variants={itemVariants} className="text-white">
                <div className="text-3xl font-bold text-yellow-400 mb-1">{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose DevBoma Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose DevBoma?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge technology with unwavering faith-driven values to deliver exceptional results
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Shield,
                title: 'Secure & Reliable',
                description: 'Enterprise-grade security with SSL, automated backups, and industry best practices built into every solution.',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: Palette,
                title: 'Custom Design',
                description: 'Unique, branded experiences tailored to your business vision, goals, and target audience.',
                color: 'from-green-500 to-green-600'
              },
              {
                icon: TrendingUp,
                title: 'Scalable Growth',
                description: 'Multi-tenant architecture that grows with your business needs and scales seamlessly.',
                color: 'from-yellow-500 to-yellow-600'
              },
              {
                icon: Clock,
                title: 'Fast Delivery',
                description: 'Rapid development cycles with quality assurance, delivering your project on time, every time.',
                color: 'from-purple-500 to-purple-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group text-center p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white border border-gray-100"
              >
                <div className={`bg-gradient-to-br ${feature.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              <span>Premium Service Tiers</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Perfect Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From basic web apps to enterprise solutions and custom e-commerce platforms
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16"
          >
            {serviceTiers.map((tier, index) => (
              <motion.div key={tier.id} variants={itemVariants}>
                <ServiceCard 
                  tier={tier} 
                  featured={tier.id === 'shop'} 
                  onGetStarted={(selectedTier) => setPaymentModal({
                    isOpen: true,
                    service: {
                      name: selectedTier.name,
                      price: getAdjustedPrice(selectedTier.price),
                      duration: 'One-time payment'
                    }
                  })}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Special Boma Shop Highlight */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-3xl p-8 md:p-12 text-center shadow-2xl"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4">
                  <Code className="w-12 h-12 text-yellow-900" />
                </div>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-yellow-900 mb-4">
                Boma Shop: The Ultimate E-Commerce Solution
              </h3>
              <p className="text-lg text-yellow-800 mb-8 max-w-2xl mx-auto">
                Build your custom online store with our interactive shop builder. Choose your design, 
                select features, and watch the cost calculate in real-time. Each shop gets a unique frontend 
                connected to our powerful shared backend.
              </p>
              <Link
                to="/boma-shop"
                className="inline-flex items-center space-x-3 bg-yellow-900 text-yellow-100 px-8 py-4 rounded-xl font-bold hover:bg-yellow-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span>Start Building Your Shop</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hosting Plans Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Premium Hosting Plans
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect hosting plan for your business needs
            </p>
          </motion.div>

          {/* Year Selector */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 rounded-xl p-2 inline-flex">
              {[
                { years: 1, label: '1yr', discount: 0 },
                { years: 3, label: '3yrs', discount: 5 },
                { years: 5, label: '5yrs', discount: 7 },
                { years: 7, label: '7yrs', discount: 10 }
              ].map((option) => (
                <button
                  key={option.years}
                  onClick={() => setSelectedYears(option.years)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedYears === option.years
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {option.label}
                  {option.discount > 0 && (
                    <span className="ml-1 text-xs text-green-600 font-bold">
                      Save {option.discount}%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                name: 'Lite Hosting',
                basePrice: 1500,
                features: ['2GB Storage', '20GB Bandwidth', 'Basic SSL Certificate', 'Weekly Backups', 'Email Support', 'Basic Security'],
                highlight: false
              },
              {
                name: 'Core Hosting',
                basePrice: 3500,
                features: ['10GB Storage', '100GB Bandwidth', 'Advanced SSL', 'Daily Backups', 'Priority Support', 'Basic CDN', 'Enhanced Security'],
                highlight: false
              },
              {
                name: 'Prime Hosting',
                basePrice: 6500,
                features: ['50GB Storage', '500GB Bandwidth', 'Premium SSL', 'Real-time Backups', 'Priority Support', 'Global CDN', 'Advanced Security', 'Performance Monitoring'],
                highlight: true
              },
              {
                name: 'Titan Hosting',
                basePrice: 9500,
                features: ['Unlimited Storage', 'Unlimited Bandwidth', 'Enterprise SSL', 'Continuous Backups', 'Dedicated Support', 'Global CDN', 'Enterprise Security', 'Load Balancing', 'Custom Configurations'],
                highlight: false
              }
            ].map((plan, index) => {
              const discountRate = selectedYears === 1 ? 0 : selectedYears === 3 ? 5 : selectedYears === 5 ? 7 : 10;
              const totalPrice = plan.basePrice * selectedYears;
              const discountedPrice = totalPrice * (1 - discountRate / 100);
              const monthlyPrice = discountedPrice / (selectedYears * 12);

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`relative bg-white rounded-2xl shadow-xl p-8 ${
                    plan.highlight ? 'ring-2 ring-blue-500 scale-105' : ''
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {formatPrice(discountedPrice)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatPrice(monthlyPrice)}/month • {selectedYears} year{selectedYears > 1 ? 's' : ''}
                    </div>
                    {discountRate > 0 && (
                      <div className="text-sm text-green-600 font-medium">
                        Save {discountRate}% • Was {formatPrice(totalPrice)}
                      </div>
                    )}
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => setPaymentModal({
                      isOpen: true,
                      service: {
                        name: `${plan.name} - ${selectedYears} Year${selectedYears > 1 ? 's' : ''}`,
                        price: discountedPrice,
                        duration: `${selectedYears} year${selectedYears > 1 ? 's' : ''}`
                      }
                    })}
                    className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-200 ${
                      plan.highlight
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Get Started
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Domain & Branding Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Globe className="w-4 h-4" />
              <span>Get Your Domain Today</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Buy Your Perfect Domain
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Purchase your professional domain name instantly and build credibility with your customers
            </p>
          </motion.div>

          {/* Domain Search */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-16"
          >
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Search & Buy Your Domain Now
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="yourbusiness"
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>
                <select className="px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors">
                  <option value=".com">.com</option>
                  <option value=".co.ke">.co.ke</option>
                  <option value=".ke">.ke</option>
                  <option value=".shop">.shop</option>
                </select>
                <button className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Check & Buy</span>
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Instant domain registration • SSL included • 24/7 support
              </p>
            </div>
          </motion.div>

          {/* Domain Pricing */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {[
              { extension: '.com', price: 1500, description: 'Most popular worldwide', icon: '🌍', popular: true },
              { extension: '.co.ke', price: 2000, description: 'Perfect for Kenyan businesses', icon: '🇰🇪', popular: true },
              { extension: '.shop', price: 3500, description: 'Ideal for e-commerce', icon: '🛒', popular: false },
              { extension: '.ke', price: 3000, description: 'Premium Kenyan domain', icon: '👑', popular: false }
            ].map((domain, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center border-2 border-gray-100 hover:border-green-300"
              >
                {domain.popular && (
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Popular
                  </div>
                )}
                <div className="text-4xl mb-4">{domain.icon}</div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{domain.extension}</h4>
                <p className="text-gray-600 text-sm mb-4">{domain.description}</p>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatPrice(domain.price)}
                </div>
                <p className="text-xs text-gray-500 mb-4">per year</p>
                <button
                  onClick={() => setPaymentModal({
                    isOpen: true,
                    service: {
                      name: `${domain.extension} Domain - 1 Year`,
                      price: getAdjustedPrice(domain.price),
                      duration: '1 year registration'
                    }
                  })}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Buy Now
                </button>
              </motion.div>
            ))}
          </motion.div>

          {/* Domain Benefits */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Building,
                title: 'Instant Setup',
                description: 'Domain activates immediately after purchase with automatic DNS configuration'
              },
              {
                icon: TrendingUp,
                title: 'SEO Boost',
                description: 'Professional domains rank higher in search results and build customer trust'
              },
              {
                icon: Crown,
                title: 'Full Ownership',
                description: 'Complete control over your domain with free SSL certificate and email forwarding'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center p-6"
              >
                <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h4>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, service: { name: '', price: 0, duration: '' } })}
        service={paymentModal.service}
      />
    </div>
  );
}