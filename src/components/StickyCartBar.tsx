import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBasket, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

export const StickyCartBar = () => {
  const { itemCount, total, subtotal, deliveryCharge } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // Don't show on Cart, Checkout, or Product pages
  const isExcludedPage = ['/cart', '/checkout'].includes(location.pathname) || location.pathname.startsWith('/product/');
  const showBar = itemCount > 0 && !isExcludedPage;

  return (
    <AnimatePresence>
      {showBar && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-2xl"
        >
          <div className="bg-gray-900 border border-white/10 text-white rounded-[2rem] p-3.5 sm:p-5 shadow-2xl flex flex-col gap-3 backdrop-blur-xl group overflow-hidden relative">
            {/* Progress Bar Background */}
            {subtotal < 500 && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(subtotal / 500) * 100}%` }}
                  className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                />
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-black shrink-0 relative">
                  <ShoppingBasket size={22} className="sm:size-6" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-gray-900">
                    {itemCount}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg sm:text-xl font-black tracking-tighter">₹{total.toFixed(0)}</span>
                    {deliveryCharge === 0 && (
                      <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-green-400 bg-green-400/10 px-2 py-0.5 rounded-md">
                        Free Delivery
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-wide">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'} • ₹{subtotal.toFixed(0)} subtotal
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                {subtotal < 500 && (
                  <div className="flex flex-col items-end text-right">
                    <p className="text-[8px] sm:text-[10px] uppercase font-black text-gray-500 leading-tight">Add ₹{500 - subtotal}</p>
                    <p className="text-[8px] sm:text-[10px] uppercase font-black text-green-400 leading-tight">for Free Ship</p>
                  </div>
                )}
                <button 
                  onClick={() => navigate('/cart')}
                  className="bg-green-500 hover:bg-green-400 text-black px-5 sm:px-8 h-11 sm:h-14 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-sm flex items-center gap-2 transition-all active:scale-95 group/btn"
                >
                  <span className="hidden xs:inline">Basket</span>
                  <span className="xs:hidden">Cart</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
