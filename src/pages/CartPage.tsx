import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBasket, ShoppingCart, ArrowLeft, ArrowRight, Truck, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

export const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, deliveryCharge, total, itemCount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-8">
            <ShoppingBasket size={64} />
          </div>
          <h2 className="text-[24px] md:text-[32px] font-black text-gray-900 uppercase tracking-tighter mb-4">Your basket is empty</h2>
          <p className="text-[14px] md:text-[16px] text-gray-500 font-medium mb-10 max-w-sm mx-auto">
            Looks like you haven't added anything to your basket yet. Start shopping and discover our fresh products!
          </p>
          <Link 
            to="/" 
            className="text-[14px] md:text-[16px] px-10 py-5 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-900/20 transition-all"
          >
            Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
      <div className="flex items-center gap-4 mb-12">
        <Link to="/" className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-[32px] md:text-[48px] font-black text-gray-900 uppercase tracking-tighter leading-none">Your Shopping Basket ({itemCount})</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-[2.5rem] border border-gray-100 p-6 sm:p-8 flex items-center gap-6 group hover:border-green-200 hover:shadow-xl transition-all"
              >
                <Link to={`/product/${item.id}`} className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-gray-50 shrink-0 shadow-sm">
                  <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </Link>
                
                <div className="flex-1 flex flex-col sm:flex-row justify-between gap-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-1 block">{item.category}</span>
                    <Link to={`/product/${item.id}`} className="text-xl font-black text-gray-900 uppercase tracking-tighter hover:text-green-600 transition-colors">
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-500 font-medium">{item.unit}</p>
                    <p className="font-black text-green-700 mt-2">₹{item.price}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-10">
                    <div className="flex items-center bg-gray-50 rounded-2xl h-14 overflow-hidden shadow-inner px-2 border border-gray-100">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-red-500 transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="w-12 text-center font-black text-lg">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-green-600 transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <div className="flex flex-col items-end justify-between self-stretch min-w-[120px]">
                      <p className="text-xl font-black text-gray-900">₹{(item.price * item.quantity).toFixed(0)}</p>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-all font-black uppercase tracking-[0.2em] text-[10px] group/remove bg-gray-50 hover:bg-red-50 px-3 py-2 rounded-xl border border-transparent hover:border-red-100"
                      >
                        <Trash2 size={14} className="group-hover/remove:scale-110 transition-transform" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 text-white rounded-[3rem] p-10 shadow-2xl sticky top-24">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 pb-6 border-b border-white/10">Order Summary</h2>
            
            <div className="space-y-6 mb-10">
              <div className="flex justify-between text-gray-400 font-medium">
                <span>Subtotal</span>
                <span className="text-white">₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-400 font-medium">
                <span className="flex items-center gap-2">
                  Delivery Charge
                  <Info size={14} className="opacity-50" />
                </span>
                <span className={cn(deliveryCharge === 0 ? "text-green-400 font-black" : "text-white")}>
                  {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                </span>
              </div>
              
              {subtotal < 500 && (
                <div className="bg-white/5 rounded-3xl p-5 border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:rotate-12 transition-transform">
                    <Truck size={48} />
                  </div>
                  <div className="flex items-center gap-3 text-orange-400 mb-3">
                    <div className="w-8 h-8 bg-orange-400/10 rounded-lg flex items-center justify-center">
                      <Truck size={18} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest">Free Shipping Goal</span>
                  </div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                      Added: <span className="text-white">₹{subtotal.toFixed(0)}</span>
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                      Needed: <span className="text-green-400">₹{500 - subtotal}</span>
                    </p>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(subtotal / 500) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-green-600 to-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium leading-relaxed italic">
                    "Just ₹{500 - subtotal} more and you'll skip the ₹50 delivery fee!"
                  </p>
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-white/10 mb-10">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs uppercase font-black tracking-[0.2em] text-gray-500 mb-1">Grand Total</p>
                  <h3 className="text-5xl font-black tracking-tighter">₹{total.toFixed(0)}</h3>
                </div>
                <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-black uppercase mb-1">
                  Saved ₹{cart.reduce((acc, item) => acc + (item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0), 0)}
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-green-500 hover:bg-green-400 text-black py-5 rounded-[2rem] font-black uppercase tracking-[0.1em] text-lg transition-all shadow-xl shadow-green-500/20 group flex items-center justify-center gap-3"
            >
              Checkout <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-gray-500 text-xs font-medium mt-6 uppercase tracking-wider">
              Secure Checkout • Fast Delivery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
