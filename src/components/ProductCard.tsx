import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Plus, Minus, Eye } from 'lucide-react';
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
      className="group bg-white h-full flex flex-col rounded-3xl border border-gray-100 hover:border-green-200 hover:shadow-2xl hover:shadow-green-100/50 transition-all duration-500 overflow-hidden relative"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.badge && (
          <span className="px-3 py-1 bg-green-600 text-white text-[10px] font-bold uppercase rounded-full shadow-lg shadow-green-200">
            {product.badge}
          </span>
        )}
        {!product.badge && product.isOffer && (
          <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase rounded-full shadow-lg shadow-orange-200">
            Offer
          </span>
        )}
        {!product.badge && product.isTrending && (
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
      <Link to={`/product/${product.id}`} className="block relative w-full h-[180px] sm:h-[220px] overflow-hidden bg-gray-50 shrink-0">
        <motion.img 
          layoutId={`prod-img-${product.id}`}
          src={product.image} 
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 line-clamp-1">{product.category}</span>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-gray-600">{product.rating}</span>
            </div>
          </div>
          
          <Link to={`/product/${product.id}`} className="block mb-3">
            <h3 className="text-[14px] sm:text-[16px] md:text-[18px] font-bold text-gray-900 line-clamp-2 md:line-clamp-1 group-hover:text-green-600 transition-colors uppercase tracking-tight">
              {product.name}
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium mt-0.5">{product.unit}</p>
          </Link>
        </div>

        <div className="mt-auto">
          <div className="flex flex-col gap-3">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[18px] sm:text-xl font-black text-green-700 leading-none">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xs sm:text-sm text-gray-400 line-through font-medium leading-none">₹{product.originalPrice}</span>
                  )}
                </div>
                {product.originalPrice && (
                  <p className="text-[9px] sm:text-[10px] font-bold text-orange-500 uppercase tracking-wide mt-1">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-2">
              <Link 
                to={`/product/${product.id}`}
                className="w-full flex-1 h-9 sm:h-11 bg-gray-100 text-gray-700 rounded-lg sm:rounded-xl flex items-center justify-center gap-1.5 hover:bg-gray-200 transition-colors active:scale-95 duration-200 px-3 shrink-0"
                title="View Product"
              >
                <Eye size={16} className="shrink-0" />
                <span className="text-[12px] sm:text-[14px] xl:text-[12px] 2xl:text-[14px] font-bold uppercase tracking-wider">View</span>
              </Link>

              {cartItem ? (
                <div className="w-full flex-[1.5] h-9 sm:h-11 flex items-center justify-between px-1.5 sm:px-2 bg-green-600 text-white rounded-lg sm:rounded-xl overflow-hidden shadow-sm shadow-green-200 shrink-0">
                  <button 
                    onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-black/10 transition-colors rounded-md active:scale-90 shrink-0"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="flex-1 text-center font-bold text-xs sm:text-sm">{cartItem.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-black/10 transition-colors rounded-md active:scale-90 shrink-0"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full flex-[1.5] h-9 sm:h-11 bg-green-600 text-white rounded-lg sm:rounded-xl flex items-center justify-center gap-1.5 hover:bg-green-700 transition-colors shadow-sm shadow-green-200 active:scale-95 duration-200 px-3 shrink-0"
                  title="Add to Cart"
                >
                  <ShoppingCart size={16} className="shrink-0" />
                  <span className="text-[12px] sm:text-[14px] xl:text-[12px] 2xl:text-[14px] font-bold uppercase tracking-wider whitespace-nowrap">Add</span>
                </button>
              )}
            </div>
          </div>

          {/* Delivery Time */}
          <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-50 flex items-center gap-2">
            <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 line-clamp-1">
              <span role="img" aria-label="truck" className="shrink-0">🚚</span> 20 Mins
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
