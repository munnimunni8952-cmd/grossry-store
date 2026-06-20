import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBasket, Instagram, Facebook, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white">
                <ShoppingBasket size={24} />
              </div>
              <span className="text-2xl font-bold">FreshCart</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Your one-stop destination for premium, farm-fresh groceries delivered straight to your doorstep. Experience the quality and freshness you deserve.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-green-500 transition-colors rounded-full flex items-center justify-center group">
                <Instagram size={20} className="group-hover:text-white transition-colors" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-green-500 transition-colors rounded-full flex items-center justify-center group">
                <Facebook size={20} className="group-hover:text-white transition-colors" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-green-500 transition-colors rounded-full flex items-center justify-center group">
                <Twitter size={20} className="group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <ul className="space-y-4">
              {['Home', 'Categories', 'Trending Products', 'Special Offers', 'My Account', 'Order History'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-green-500 transition-colors flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Help & Support</h3>
            <ul className="space-y-4">
              {['FAQs', 'Shipping Policy', 'Refund Policy', 'Terms of Service', 'Privacy Policy', 'Contact Us'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-green-500 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Store Information</h3>
            <div className="space-y-4 text-gray-400">
              <div className="flex items-start gap-3">
                <MapPin className="text-green-500 shrink-0 mt-1" size={20} />
                <p>123 Fresh Lane, Organic District, Green City, 560001</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-green-500 shrink-0" size={20} />
                <p>+91 98765 43210</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-green-500 shrink-0" size={20} />
                <p>support@freshcart.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-10 border-t border-white/10 text-center text-gray-500 text-sm">
          <p>Website made by Raj. © {new Date().getFullYear()} FreshCart Premium. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
