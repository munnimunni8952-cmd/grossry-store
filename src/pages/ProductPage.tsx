import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Truck, Clock, RefreshCw, ShoppingCart, Heart, Plus, Minus, ArrowLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS as STATIC_PRODUCTS } from '../constants';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';
import { ProductCard } from '../components/ProductCard';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
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
          p = { ...docSnap.data(), id: docSnap.id } as Product;
        }

        if (!p) {
          // Fallback to static
          p = STATIC_PRODUCTS.find(p => p.id === id) || null;
        }
        
        setProduct(p);

        if (p) {
          // Fetch related
          try {
            const q = query(
              collection(db, 'products'),
              where('category', '==', p.category),
              limit(5) // Get one extra to filter out the current product if it's there
            );
            const relSnap = await getDocs(q);

            const dynamicRelated = relSnap.docs
              .map(doc => ({ ...doc.data(), id: doc.id } as Product))
              .filter(prod => prod.id !== id)
              .slice(0, 4);
              
            if (dynamicRelated.length < 4) {
              const staticRelated = STATIC_PRODUCTS
                .filter(sp => sp.category === p!.category && sp.id !== id)
                .slice(0, 4 - dynamicRelated.length);
              setRelatedProducts([...dynamicRelated, ...staticRelated].slice(0, 4));
            } else {
              setRelatedProducts(dynamicRelated);
            }
          } catch (relError) {
            console.error("Error fetching related products:", relError);
            setRelatedProducts(STATIC_PRODUCTS.filter(sp => sp.category === p!.category && sp.id !== id).slice(0, 4));
            handleFirestoreError(relError, OperationType.GET, 'products');
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        // Even on error, try fallback
        const fallback = STATIC_PRODUCTS.find(p => p.id === id) || null;
        setProduct(fallback);
        handleFirestoreError(error, OperationType.GET, 'products');
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
            <div className="aspect-square rounded-[3rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-xl relative">
              <motion.img 
                layoutId={`prod-img-${product.id}`}
                src={images[selectedImage] || product.image} 
                alt={product.name}
                loading="eager"
                decoding="async"
                className="opacity-0 w-full h-full object-cover transition-opacity duration-300 relative z-10"
                style={{ width: '100%', height: '100%' }}
                referrerPolicy="no-referrer"
                onLoad={(e) => {
                  (e.target as HTMLImageElement).classList.add('opacity-100');
                  (e.target as HTMLImageElement).classList.remove('opacity-0');
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).classList.add('opacity-100');
                  (e.target as HTMLImageElement).classList.remove('opacity-0');
                }}
              />
              <div className="absolute inset-0 bg-gray-200 animate-pulse z-0" />
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-4 pb-2">
              {images.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all shadow-md shrink-0 relative bg-gray-50",
                    selectedImage === i ? "border-green-600 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img 
                    src={img} 
                    alt="" 
                    loading="lazy" 
                    decoding="async"
                    className="opacity-0 w-full h-full object-cover transition-opacity duration-300 relative z-10" 
                    style={{ width: '100%', height: '100%' }}
                    referrerPolicy="no-referrer" 
                    onLoad={(e) => {
                      (e.target as HTMLImageElement).classList.add('opacity-100');
                      (e.target as HTMLImageElement).classList.remove('opacity-0');
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).classList.add('opacity-100');
                      (e.target as HTMLImageElement).classList.remove('opacity-0');
                    }}
                  />
                  <div className="absolute inset-0 bg-gray-200 animate-pulse z-0" />
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
              <h1 className="text-[32px] md:text-[48px] font-black text-gray-900 mb-4 uppercase tracking-tighter leading-none">
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
              <p className="text-[14px] md:text-[16px] text-gray-500 font-medium">MRP (Inclusive of all taxes) • {product.unit}</p>
              {product.originalPrice && (
                <div className="mt-3 inline-block px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-sm font-bold border border-orange-100">
                  You Save ₹{product.originalPrice - product.price} ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF)
                </div>
              )}
            </div>

            <p className="text-[14px] md:text-[16px] text-gray-600 leading-relaxed mb-10 pb-10 border-b border-gray-100 italic">
              "{product.description}"
            </p>

            <div className="flex gap-3 sm:gap-5 mb-12 items-start">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {cartItem ? (
                  <div className="flex items-center bg-gray-100 rounded-2xl h-14 sm:h-[64px] overflow-hidden shadow-inner px-2 border border-gray-100 w-full">
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
                    className="w-full h-14 sm:h-[64px] bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-900/20 group active:scale-[0.98] text-[14px] md:text-[16px]"
                  >
                    <ShoppingCart size={22} className="group-hover:-translate-y-1 transition-transform" />
                    <span>Add to Cart</span>
                  </button>
                )}
                <button 
                  onClick={handleBuyNow}
                  className="w-full h-14 sm:h-[64px] bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center transition-all shadow-xl shadow-orange-900/20 hover:shadow-2xl hover:shadow-orange-900/40 hover:-translate-y-1 active:scale-[0.98] text-[14px] md:text-[16px] border border-white/10"
                >
                  Buy Now
                </button>
              </div>
              <button 
                onClick={() => toggleWishlist(product.id)}
                className={cn(
                  "w-14 h-14 sm:w-[64px] sm:h-[64px] rounded-2xl flex items-center justify-center border-2 transition-all shrink-0 active:scale-95",
                  isWishlisted 
                    ? "bg-red-50 border-red-200 text-red-500" 
                    : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50"
                )}
              >
                <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 bg-gray-50 rounded-3xl sm:rounded-[2rem] p-6 sm:p-8">
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

        {/* Related Products */}
        <section className="mt-32">
          <h2 className="text-[24px] md:text-[32px] font-black text-gray-900 uppercase tracking-tighter mb-12">You May Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {relatedProducts.map((p, i) => (
              <div key={p.id} className="w-full h-full">
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
