import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, User, Phone, MapPin, CreditCard, Wallet, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '../lib/utils';

export const CheckoutPage = () => {
  const { total, clearCart, itemCount, cart } = useCart();
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    phone: '',
    address: '',
    payment: 'COD',
    notes: ''
  });

  React.useEffect(() => {
    if (user && !formData.name) {
      setFormData(prev => ({ ...prev, name: user.displayName || '' }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      const orderData: any = {
        customerName: formData.name,
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes,
        paymentMethod: formData.payment,
        totalAmount: total,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        status: 'pending',
        createdAt: serverTimestamp()
      };

      if (user) {
        orderData.userId = user.uid;
      }

      await addDoc(collection(db, 'orders'), orderData);
      
      setIsOrdered(true);
      setTimeout(() => {
        clearCart();
      }, 500);
    } catch (error) {
      console.error("Error creating order", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isOrdered) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-40 h-40 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-8 relative">
            <CheckCircle2 size={100} strokeWidth={1.5} />
            <motion.div 
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-green-500 rounded-full"
            />
          </div>
          <h2 className="text-5xl font-black text-gray-900 uppercase tracking-tighter mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-500 font-bold mb-10 max-w-sm mx-auto uppercase tracking-wider">
            Your tracking ID: <span className="text-green-600 font-black">#FC-9921{Math.floor(Math.random() * 1000)}</span>
          </p>
          <p className="text-gray-500 font-medium mb-10 max-w-md mx-auto">
            Thank you for shopping with FreshCart! Your order will be delivered to your doorstep within 60 minutes.
          </p>
          <div className="flex gap-4">
            <Link 
              to="/" 
              className="px-10 py-5 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-900/20 transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
      <div className="flex items-center gap-4 mb-12">
        <Link to="/cart" className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Checkout Form */}
        <div className="space-y-12">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Delivery Info */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <User size={20} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900">Delivery Details</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="text-xs uppercase font-black text-gray-400 mb-2 block tracking-wider">Full Name</label>
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
                  <label className="text-xs uppercase font-black text-gray-400 mb-2 block tracking-wider">Mobile Number</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="+91 98765 43210"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 focus:border-green-600 focus:bg-white outline-none font-bold placeholder:text-gray-300 transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs uppercase font-black text-gray-400 mb-2 block tracking-wider">Delivery Address</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="House No, Street, Landmark, Area, City, Pincode"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 focus:border-green-600 focus:bg-white outline-none font-bold placeholder:text-gray-300 transition-all resize-none"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs uppercase font-black text-gray-400 mb-2 block tracking-wider">Delivery Notes (Optional)</label>
                  <textarea 
                    rows={2}
                    placeholder="E.g. Ring the bell, leave at the gate, etc."
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 focus:border-green-600 focus:bg-white outline-none font-bold placeholder:text-gray-300 transition-all resize-none"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
              </div>
            </section>

            {/* Payment Options */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900">Payment Option</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'COD', label: 'Cash on Delivery', icon: Wallet },
                  { id: 'UPI', label: 'PhonePe / GPay / UPI', icon: CreditCard }
                ].map((pay) => (
                  <button
                    key={pay.id}
                    type="button"
                    onClick={() => setFormData({...formData, payment: pay.id})}
                    className={cn(
                      "flex items-center gap-4 p-6 rounded-3xl border-2 transition-all text-left",
                      formData.payment === pay.id 
                        ? "border-green-600 bg-green-50 text-green-700" 
                        : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      formData.payment === pay.id ? "bg-green-600 text-white" : "bg-white text-gray-400 shadow-sm"
                    )}>
                      <pay.icon size={24} />
                    </div>
                    <span className="font-bold text-sm uppercase tracking-wider">{pay.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full bg-gradient-to-br from-gray-800 to-black hover:from-black hover:to-black text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xl transition-all shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3 border border-white/10",
                isSubmitting && "opacity-70 cursor-not-allowed pointer-events-none"
              )}
            >
              {isSubmitting ? 'Processing...' : `Confirm Order (₹${total.toFixed(0)})`}
            </button>
          </form>

          <div className="flex items-center justify-center gap-6 p-6 bg-green-50 rounded-3xl border border-green-100 italic">
            <ShieldCheck className="text-green-600 shrink-0" size={24} />
            <p className="text-sm font-bold text-gray-700">
              Safe & Secure Checkouts. Standard 256-bit encryption. Freshness guaranteed or 100% refund.
            </p>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="hidden lg:block">
          <div className="bg-gray-50 rounded-[3rem] p-10 border border-gray-100">
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 text-gray-900 border-b border-gray-200 pb-6">Your Order Summary</h3>
            <div className="space-y-6">
              <div className="flex justify-between text-gray-500 font-bold uppercase text-xs tracking-[0.1em]">
                <span>Items ({itemCount})</span>
                <span>Subtotal</span>
              </div>
              <div className="pt-4 space-y-4">
                <div className="flex justify-between items-center text-gray-900 font-black text-lg">
                  <span className="uppercase tracking-tighter">Total Payable</span>
                  <span className="text-3xl text-green-700 tracking-tighter">₹{total.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
