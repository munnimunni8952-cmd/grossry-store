import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // In a real app, send to API
  };

  if (isSubmitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-green-50 border-2 border-green-100 p-12 rounded-[3rem] max-w-2xl mx-auto"
        >
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-green-900/20">
            <Send size={32} />
          </div>
          <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">Message Sent!</h2>
          <p className="text-gray-500 font-bold mb-8 uppercase tracking-widest text-sm">We'll get back to you within 24 hours.</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Info Column */}
        <div className="lg:w-1/3 space-y-12">
          <div>
            <h1 className="text-[32px] md:text-[48px] font-black text-gray-900 uppercase tracking-tighter leading-none mb-6">
              Get in <br /> <span className="text-green-600">Touch</span>
            </h1>
            <p className="text-gray-500 font-medium text-[14px] md:text-[16px]">
              Have a question about your order or our delivery process? We're here to help you get the freshest groceries.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6 p-6 bg-white border-2 border-gray-100 rounded-3xl hover:border-green-200 transition-colors">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Us</p>
                <p className="text-lg font-black text-gray-900">support@freshcart.com</p>
              </div>
            </div>

            <div className="flex items-center gap-6 p-6 bg-white border-2 border-gray-100 rounded-3xl hover:border-green-200 transition-colors">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Call Us</p>
                <p className="text-lg font-black text-gray-900">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-center gap-6 p-6 bg-white border-2 border-gray-100 rounded-3xl hover:border-green-200 transition-colors">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Visit Us</p>
                <p className="text-lg font-black text-gray-900">Sector 45, Gurgaon, HR</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="flex-1">
          <div className="bg-white border-2 border-gray-100 rounded-[3rem] p-8 sm:p-12 shadow-2xl shadow-gray-200/50">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white">
                <MessageSquare size={20} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Send a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Your Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 focus:border-green-600 focus:bg-white outline-none font-bold placeholder:text-gray-300 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 focus:border-green-600 focus:bg-white outline-none font-bold placeholder:text-gray-300 transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Subject</label>
                <input 
                  required
                  type="text" 
                  placeholder="Order Inquiry"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 focus:border-green-600 focus:bg-white outline-none font-bold placeholder:text-gray-300 transition-all"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Message</label>
                <textarea 
                  required
                  rows={5}
                  placeholder="Tell us what you need help with..."
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl py-4 px-6 focus:border-green-600 focus:bg-white outline-none font-bold placeholder:text-gray-300 transition-all resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-gray-900 text-white h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[14px] md:text-[16px] flex items-center justify-center gap-3 hover:bg-black hover:scale-[1.01] active:scale-[0.98] transition-all shadow-xl shadow-black/10"
              >
                Send Message
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
