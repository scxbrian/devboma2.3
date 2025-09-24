import React from 'react';
import { Code, Mail, Phone, MapPin, Heart, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-2 rounded-xl">
                <Code className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold">DevBoma</span>
            </div>
            <p className="text-blue-200 mb-8 max-w-md leading-relaxed">
              Delivering premium web and software solutions for businesses and creators, 
              combining technical excellence with faith-driven values to create digital experiences that matter.
            </p>
            
            {/* Bible Verse */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white border-opacity-20">
              <div className="flex items-center space-x-2 mb-3">
                <Heart className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold text-yellow-400">Our Foundation</span>
              </div>
              <p className="text-blue-100 italic leading-relaxed">
                "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters." 
                <span className="block text-yellow-300 font-medium mt-2">- Colossians 3:23</span>
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-blue-200">
                <Mail className="w-5 h-5 text-blue-400" />
                <span>info@devboma.com</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-200">
                <Phone className="w-5 h-5 text-blue-400" />
                <span>+254 700 123 456</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-200">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-yellow-400">Services</h3>
            <ul className="space-y-3">
              <li><a href="/services/lite" className="text-blue-200 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">Boma Lite</a></li>
              <li><a href="/services/core" className="text-blue-200 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">Boma Core</a></li>
              <li><a href="/services/prime" className="text-blue-200 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">Boma Prime</a></li>
              <li><a href="/services/titan" className="text-blue-200 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">Boma Titan</a></li>
              <li><a href="/boma-shop" className="text-yellow-400 hover:text-yellow-300 transition-colors hover:translate-x-1 transform duration-200 block font-semibold">Boma Shop ⭐</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-yellow-400">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">About Us</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">Our Team</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">Portfolio</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">Contact</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">Support</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="relative border-t border-white border-opacity-20 mt-12 pt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-blue-300 text-center md:text-left">
                © 2025 DevBoma. All rights reserved. Built with faith and excellence. 🙏
              </p>
              
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-blue-300 hover:text-white transition-colors transform hover:scale-110 duration-200">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-blue-300 hover:text-white transition-colors transform hover:scale-110 duration-200">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-blue-300 hover:text-white transition-colors transform hover:scale-110 duration-200">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-blue-300 hover:text-white transition-colors transform hover:scale-110 duration-200">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}