import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBasket, Package, Clock, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching orders:', error);
      setLoading(false);
      handleFirestoreError(error, OperationType.GET, 'orders');
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Please login to view orders</h2>
        <Link to="/" className="text-green-600 font-bold uppercase tracking-widest text-sm hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-32">
      <div className="flex items-center gap-4 mb-12">
        <Link to="/" className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">My Orders</h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading orders...</p>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={order.id}
              className="bg-white border-2 border-gray-100 rounded-3xl p-6 sm:p-8 hover:border-green-100 transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
                    <Package size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 uppercase tracking-tight">Order #{order.id.slice(-6).toUpperCase()}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                       <Clock size={12} /> {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Just now'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                    order.status === 'delivered' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                  )}>
                    {order.status}
                  </span>
                  <span className="text-xl font-black text-gray-900 tracking-tighter">₹{parseFloat(order.total_amount).toFixed(0)}</span>
                </div>
              </div>

              <div className="border-t border-gray-50 pt-6 space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">
                      {item.name} <span className="text-gray-400 text-xs font-bold pl-2">x{item.quantity}</span>
                    </span>
                    <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {order.notes && (
                <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Order Notes</p>
                  <p className="text-sm text-gray-600 italic">"{order.notes}"</p>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-green-600 hover:text-green-700 transition-colors">
                  View Full Details <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6">
            <ShoppingBasket size={32} />
          </div>
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-2">No orders found</h3>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">Looks like you haven't ordered anything yet. Time to fill your basket!</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-green-900/20 active:scale-95 transition-all"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};
