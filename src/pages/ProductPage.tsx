import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Truck, Clock, RefreshCw, ShoppingCart, Heart, Plus, Minus, ArrowLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS as STATIC_PRODUCTS } from '../constants';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';
import { ProductCard } from '../components/ProductCard';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { Product } from '../types';

export const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart, updateQuantity, toggleWishlist, wishlist } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        let p: Product | null = null;
        if (docSnap.exists()) {
          p = { id: docSnap.id, ...docSnap.data() } as Product;
        } else {
          // Fallback to static
          p = STATIC_PRODUCTS.find(p => p.id === id) || null;
        }
        
        setProduct(p);

        if (p) {
          // Fetch related
          const q = query(
            collection(db, 'products'),
            where('category', '==', p.category),
            limit(5)
          );
          const relatedSnap = await getDocs(q);
          const relatedData = relatedSnap.docs
            .map(doc => doc.data() as Product)
            .filter(rp => rp.id !== id)
            .slice(0, 4);
          
          if (relatedData.length === 0) {
            setRelatedProducts(STATIC_PRODUCTS.filter(sp => sp.category === p!.category && sp.id !== id).slice(0, 4));
          } else {
            setRelatedProducts(relatedData);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Getting details...</p>
      </div>
    );
  }

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-32 text-center">
      <h2 className="text-3xl font-black uppercase tracking-tighter">Product Not Found</h2>
      <Link to="/" className="text-green-600 font-bold mt-4 inline-block underline">Back to Home</Link>
    </div>
  );

  const cartItem = cart.find(item => item.id === product.id);
  const isWishlisted = wishlist.includes(product.id);

  const handleBuyNow = () => {
    if (!product) return;
    if (!cartItem) {
      addToCart(product);
    }
    navigate('/checkout');
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="pb-32 lg:pb-20">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3 text-sm font-medium">
          <Link to="/" className="text-gray-500 hover:text-green-600 transition-colors">Home</Link>
          <ChevronRight size={14} className="text-gray-300" />
          <Link to={`/category/${product.category.toLowerCase()}`} className="text-gray-500 hover:text-green-600 transition-colors">{product.category}</Link>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-gray-900 truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-square rounded-[3rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-xl">
              <motion.img 
                layoutId={`prod-img-${product.id}`}
                src={images[selectedImage] || product.image} 
                alt={product.name}
                loading="eager"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shadow-md shrink-0",
                    selectedImage === i ? "border-green-600 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-full mb-4 inline-block tracking-widest border border-green-100">
                {product.category}
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 uppercase tracking-tighter leading-none">
                {product.name}
              </h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <span className="text-sm font-black text-gray-900">{product.rating}</span>
                  <span className="text-sm text-gray-400 font-medium">({product.reviewsCount} Reviews)</span>
                </div>
                <div className="h-4 w-[1px] bg-gray-200" />
                <span className="text-sm font-bold text-green-600 uppercase tracking-widest">In Stock</span>
              </div>
            </div>

            <div className="mb-10">
              <div className="flex items-end gap-4 mb-2">
                <span className="text-5xl font-black text-green-700 leading-none">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-2xl text-gray-400 line-through font-medium leading-none">₹{product.originalPrice}</span>
                )}
              </div>
              <p className="text-gray-500 font-medium">MRP (Inclusive of all taxes) • {product.unit}</p>
              {product.originalPrice && (
                <div className="mt-3 inline-block px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-sm font-bold border border-orange-100">
                  You Save ₹{product.originalPrice - product.price} ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF)
                </div>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed text-lg mb-10 pb-10 border-b border-gray-100 italic">
              "{product.description}"
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mb-12">
              <div className="flex-1 flex gap-3">
                {cartItem ? (
                  <div className="flex-1 flex items-center bg-gray-100 rounded-2xl h-14 sm:h-16 overflow-hidden shadow-inner px-2 border border-gray-100">
                    <button 
                      onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                      className="flex-1 h-10 sm:h-12 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-red-500 transition-colors active:scale-95"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="w-12 sm:w-16 text-center font-black text-lg sm:text-xl">{cartItem.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                      className="flex-1 h-10 sm:h-12 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-green-600 transition-colors active:scale-95"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => addToCart(product)}
                    className="flex-1 h-14 sm:h-16 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-900/20 group active:scale-[0.98]"
                  >
                    <ShoppingCart size={22} className="group-hover:-translate-y-1 transition-transform" />
                    <span className="text-sm sm:text-base">Add to Basket</span>
                  </button>
                )}
                <button 
                  onClick={() => toggleWishlist(product.id)}
                  className={cn(
                    "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border-2 transition-all shrink-0 active:scale-95",
                    isWishlisted 
                      ? "bg-red-50 border-red-200 text-red-500" 
                      : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50"
                  )}
                >
                  <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>
              <button 
                onClick={handleBuyNow}
                className="flex-1 h-14 sm:h-16 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center transition-all shadow-xl shadow-orange-900/20 hover:shadow-2xl hover:shadow-orange-900/40 hover:-translate-y-1 active:scale-[0.98] text-sm sm:text-base border border-white/10"
              >
                Buy Now
              </button>
</div>

            {/* Mobile Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/90 backdrop-blur-2xl border-t border-gray-100 md:hidden flex gap-3 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.15)]">
              {cartItem ? (
                <div className="flex-1 flex items-center bg-gray-100 rounded-2xl h-16 overflow-hidden px-1.5 border border-gray-200">
                  <button 
                    onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                    className="w-12 h-13 flex items-center justify-center bg-white rounded-lg shadow-sm active:scale-90"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="flex-1 text-center font-black text-xl">{cartItem.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                    className="w-12 h-13 flex items-center justify-center bg-white rounded-lg shadow-sm active:scale-90"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => addToCart(product)}
                  className="flex-1 h-16 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 active:scale-[0.98] text-xs"
                >
                  <ShoppingCart size={18} />
                  Add
                </button>
              )}
              <button 
                onClick={handleBuyNow}
                className="flex-[2] h-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center shadow-xl shadow-orange-900/30 active:scale-[0.98] text-sm tracking-tight border border-white/5"
              >
                Buy Now
              </button>
</div>

            <div className="grid grid-cols-2 gap-6 bg-gray-50 rounded-[2rem] p-8">
              {[
                { icon: ShieldCheck, title: "100% Quality", desc: "Premium quality guaranteed" },
                { icon: Clock, title: "1-Hour Delivery", desc: "Super fast local shipping" },
                { icon: Truck, title: "Free Shipping", desc: "On orders above ₹500" },
                { icon: RefreshCw, title: "Easy Returns", desc: "7 days return policy" }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm shrink-0">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section Placeholder */}
        <section className="mt-32">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Customer Reviews</h2>
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold">Write a review</span>
              <ArrowLeft size={18} className="rotate-180" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: "Rahul Sharma", rating: 5, date: "2 days ago", comment: "The quality of these tomatoes is exceptional. Much better than what I get at the local supermarket. Very fresh!" },
              { name: "Priya Patel", rating: 4, date: "1 week ago", comment: "Good packaging and fast delivery. The fruit was perfectly ripe and sweet. Highly recommend." }
            ].map((review, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                      {review.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{review.name}</h4>
                      <p className="text-xs text-gray-400 font-medium">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Products */}
        <section className="mt-32">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-12">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
