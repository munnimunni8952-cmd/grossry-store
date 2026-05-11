import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const { addToCart, cart, updateQuantity, toggleWishlist, wishlist } = useCart();
  
  const cartItem = cart.find(item => item.id === product.id);
  const isWishlisted = wishlist.includes(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white rounded-3xl border border-gray-100 hover:border-green-200 hover:shadow-2xl hover:shadow-green-100/50 transition-all duration-500 overflow-hidden relative"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isOffer && (
          <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase rounded-full shadow-lg shadow-orange-200">
            Offer
          </span>
        )}
        {product.isTrending && (
          <span className="px-3 py-1 bg-green-600 text-white text-[10px] font-bold uppercase rounded-full shadow-lg shadow-green-200">
            Trending
          </span>
        )}
      </div>

      {/* Wishlist Toggle */}
      <button 
        onClick={() => toggleWishlist(product.id)}
        className={cn(
          "absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-lg",
          isWishlisted 
            ? "bg-red-500 text-white" 
            : "bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white"
        )}
      >
        <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
      </button>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <motion.img 
          layoutId={`prod-img-${product.id}`}
          src={product.image} 
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </Link>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">{product.category}</span>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-gray-600">{product.rating}</span>
          </div>
        </div>
        
        <Link to={`/product/${product.id}`} className="block mb-3">
          <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-green-600 transition-colors uppercase tracking-tight text-sm">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 font-medium">{product.unit}</p>
        </Link>

        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-green-700">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through font-medium">₹{product.originalPrice}</span>
              )}
            </div>
            {product.originalPrice && (
              <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wide">
                Save ₹{product.originalPrice - product.price}
              </p>
            )}
          </div>

          <div className="relative">
            {cartItem ? (
              <div className="flex items-center bg-green-600 text-white rounded-xl overflow-hidden shadow-lg shadow-green-200">
                <button 
                  onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                  className="w-10 h-12 flex items-center justify-center hover:bg-black/10 transition-colors active:scale-90"
                >
                  <Minus size={18} />
                </button>
                <span className="w-8 text-center font-bold text-sm bg-black/5">{cartItem.quantity}</span>
                <button 
                  onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                  className="w-10 h-12 flex items-center justify-center hover:bg-black/10 transition-colors active:scale-90"
                >
                  <Plus size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => addToCart(product)}
                className="w-12 h-12 sm:w-auto sm:px-4 bg-green-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-200 active:scale-95 duration-200"
              >
                <ShoppingCart size={20} />
                <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Add</span>
              </button>
            )}
          </div>
        </div>

        {/* Delivery Time */}
        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-2">
          <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <span role="img" aria-label="truck">🚚</span> Delivery in 20 Minutes
          </span>
        </div>
      </div>
    </motion.div>
  );
};
