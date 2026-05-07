import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, CheckCircle2, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const FreeDeliveryAlert = () => {
  const { subtotal } = useCart();
  const [show, setShow] = useState(false);
  const [hasQualified, setHasQualified] = useState(false);

  useEffect(() => {
    // Show only when transitioning from under 500 to 500+
    if (subtotal >= 500 && !hasQualified) {
      setShow(true);
      setHasQualified(true);
      
      const timer = setTimeout(() => {
        setShow(false);
      }, 4000);
      
      return () => clearTimeout(timer);
    } else if (subtotal < 500) {
      setHasQualified(false);
      setShow(false);
    }
  }, [subtotal, hasQualified]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9, x: '-50%' }}
          animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
          exit={{ opacity: 0, y: 20, scale: 0.9, x: '-50%' }}
          className="fixed top-24 left-1/2 z-[200] w-[90%] max-w-sm"
        >
          <div className="bg-white border-2 border-green-500 rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(22,163,74,0.3)] overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-50 rounded-full blur-3xl opacity-50" />
            
            <button 
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-green-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-green-200">
                  <Truck size={40} />
                </div>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border-4 border-white rounded-full flex items-center justify-center text-green-600 shadow-md"
                >
                  <CheckCircle2 size={24} fill="white" />
                </motion.div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-2">
                  Unbeatable!
                </h3>
                <p className="text-sm font-bold text-green-600 uppercase tracking-widest mb-2">
                  Free Delivery Unlocked
                </p>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  You've reached the ₹500 milestone. Standard delivery is now on the house!
                </p>
              </div>

              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-2">
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 4, ease: 'linear' }}
                  className="h-full bg-green-500"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
