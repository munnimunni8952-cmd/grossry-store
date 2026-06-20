import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingCart, Trash2, ArrowLeft, ShoppingBasket } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../constants';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Product } from '../types';

export const WishlistPage = () => {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
      setAllProducts(productsData.length > 0 ? productsData : PRODUCTS);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching products for wishlist:', error);
      setAllProducts(PRODUCTS);
      setLoading(false);
      handleFirestoreError(error, OperationType.GET, 'products');
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const wishlistedProducts = allProducts.filter(p => wishlist.includes(p.id));

  const handleMoveToCart = (product: Product) => {
    addToCart(product);
    toggleWishlist(product.id);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Finding your favorites...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
      <div className="flex items-center gap-4 mb-12">
        <Link to="/" className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">My Wishlist</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">
            {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'Item' : 'Items'} Saved
          </p>
        </div>
      </div>

      {wishlistedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {wishlistedProducts.map((product, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                key={product.id}
                className="group bg-white border-2 border-gray-100 rounded-[2.5rem] p-6 hover:border-green-200 hover:shadow-2xl hover:shadow-green-900/5 transition-all"
              >
                <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-gray-50 mb-6">
                  <motion.img 
                    layoutId={`prod-img-${product.id}`}
                    src={product.image} 
                    alt={product.name} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-all active:scale-90"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">
                        {product.category}
                      </span>
                      <h3 className="text-xl font-black text-gray-900 mt-2 tracking-tight line-clamp-1">{product.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-gray-900 tracking-tighter">₹{product.price}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">{product.unit}</div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => handleMoveToCart(product)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white h-14 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-green-900/20 active:scale-[0.98] transition-all"
                    >
                      <ShoppingCart size={18} />
                      Move to Cart
                    </button>
                    <Link 
                      to={`/product/${product.id}`}
                      className="w-14 h-14 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl flex items-center justify-center transition-all active:scale-95"
                    >
                      <ArrowLeft size={20} className="rotate-180" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-24 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-gray-200 mx-auto mb-8 shadow-inner">
            <Heart size={40} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-3">Your wishlist is empty</h2>
          <p className="text-gray-400 font-medium mb-12 max-w-sm mx-auto">
            Save items you like to see them here later and grab them before they're gone!
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-black/20 hover:bg-black hover:-translate-y-1 active:scale-95 transition-all"
          >
            <ShoppingBasket size={20} />
            Shop Now
          </Link>
        </div>
      )}
    </div>
  );
};
