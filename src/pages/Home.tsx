import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, ShoppingBag, Truck, ShieldCheck, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import { CATEGORIES as STATIC_CATEGORIES, PRODUCTS as STATIC_PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { cn } from '../lib/utils';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Product, Category } from '../types';
import { seedDatabase } from '../lib/seed';

const HERO_SLIDES = [
  {
    id: 1,
    title: "Special Offers & Fresh Groceries",
    subtitle: "NEW UPDATE",
    description: "Fast Delivery • Best Prices\nFresh Products Delivered to Your Doorstep",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1920&fm=webp",
    color: "bg-green-600",
    textPosition: "left"
  },
  {
    id: 2,
    title: "Special Offers & Fresh Groceries",
    subtitle: "NEW UPDATE",
    description: "Fast Delivery • Best Prices\nFresh Products Delivered to Your Doorstep",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1920&fm=webp",
    color: "bg-orange-500",
    textPosition: "center"
  }
];

const FastLoadProduct: React.FC<{ product: Product, index: number }> = ({ product, index }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'timeout'>('loading');

  useEffect(() => {
    let isMounted = true;
    let hasResolved = false;
    const img = new Image();
    
    // Only wait up to 2.5 seconds before hiding
    const timeoutId = setTimeout(() => {
      if (isMounted && !hasResolved) {
        hasResolved = true;
        setStatus('timeout');
      }
    }, 2500);

    img.onload = () => {
      if (isMounted && !hasResolved) {
        hasResolved = true;
        clearTimeout(timeoutId);
        setStatus('success');
      }
    };

    img.onerror = () => {
      if (isMounted && !hasResolved) {
        hasResolved = true;
        clearTimeout(timeoutId);
        setStatus('error');
      }
    };
    
    img.src = product.image;

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [product.image]);

  if (status === 'success') {
    return (
      <div className="w-full h-full">
        <ProductCard product={product} index={index} />
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="w-full h-full min-h-[350px] rounded-3xl bg-white border border-gray-100 overflow-hidden animate-pulse flex flex-col">
        <div className="w-full h-[180px] sm:h-[220px] bg-gray-200" />
        <div className="p-4 sm:p-5 flex-1 flex flex-col gap-3">
          <div className="h-4 sm:h-5 bg-gray-200 rounded-md w-full" />
          <div className="h-4 sm:h-5 bg-gray-200 rounded-md w-2/3" />
          <div className="mt-auto h-10 sm:h-12 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  // error or timeout -> hide completely
  return null;
};

export const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const { isAdmin, user } = useAuth();
  const { cart } = useCart();

  const handleSeed = async () => {
    if (!window.confirm("Seed database with initial products and categories?")) return;
    setSeeding(true);
    try {
      const result = await seedDatabase();
      if (result.success) {
        alert("Database seeded successfully! Page will reload.");
        window.location.reload();
      } else {
        alert("Seeding failed. Check console for details.");
      }
    } catch (err) {
      console.error(err);
      alert("Seeding failed.");
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    // Handle hash scroll on location change
    const hash = location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => scrollToSection(hash), 100);
    }
  }, [location.hash]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
      setProducts(productsData.length > 0 ? productsData : STATIC_PRODUCTS);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setProducts(STATIC_PRODUCTS);
      setLoading(false);
      handleFirestoreError(error, OperationType.GET, 'products');
    });

    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const categoriesData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Category));
      setCategories(categoriesData.length > 0 ? categoriesData : STATIC_CATEGORIES);
    }, (error) => {
      console.error(error);
      setCategories(STATIC_CATEGORIES);
      handleFirestoreError(error, OperationType.GET, 'categories');
    });

    return () => {
      unsubProducts();
      unsubCategories();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const trendingProducts = STATIC_PRODUCTS.filter(p => ['t1', 't2', 't3', 't4', 't5', 't6', 't7'].includes(p.id));
  const summerSpecials = STATIC_PRODUCTS.filter(p => ['s1', 's2', 's3', 's4'].includes(p.id));
  const freshVeggies = STATIC_PRODUCTS.filter(p => ['v1', 'v2'].includes(p.id));

  // Mock Recommendation Algorithm
  const getRecommendations = () => {
    const dataSource = products.length > 0 ? products : STATIC_PRODUCTS;
    const cartCategories = Array.from(new Set(cart.map(item => item.category)));
    let recommended = dataSource.filter(p => 
      cartCategories.includes(p.category) && !cart.some(item => item.id === p.id)
    );
    
    if (recommended.length < 6) {
      const fallbackProducts = dataSource.filter(p => !cart.some(item => item.id === p.id) && !recommended.some(r => r.id === p.id));
      const topRatedFallback = [...fallbackProducts].sort((a, b) => b.rating - a.rating);
      const needed = 6 - recommended.length;
      recommended = [...recommended, ...topRatedFallback.slice(0, needed)];
    }
    
    return recommended.slice(0, 6); // Or randomize: recommended.sort(() => 0.5 - Math.random()).slice(0, 6)
  };
  
  const recommendedProducts = getRecommendations();

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Admin Actions */}
      {isAdmin && (
        <div className="bg-orange-50 border-y border-orange-100 px-4 py-3 flex items-center justify-between z-50">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <p className="text-sm font-black text-orange-900 uppercase tracking-tight">Admin Mode Active</p>
          </div>
          <button 
            onClick={handleSeed}
            disabled={seeding}
            className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all disabled:opacity-50"
          >
            {seeding ? 'Seeding...' : 'Seed Database'}
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden h-[300px] rounded-b-[18px] sm:rounded-none sm:h-[700px]">
        <AnimatePresence mode="wait">
          {HERO_SLIDES.map((slide, index) => (
            index === currentSlide && (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 bg-black/50 sm:bg-black/30 z-10" />
                <div className="absolute inset-0 bg-gray-200 animate-pulse z-0" />
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  loading="eager"
                  decoding="async"
                  className="opacity-0 w-full h-full object-cover transition-opacity duration-700 relative z-0"
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
                <div className="absolute inset-0 z-20 flex items-center p-5 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className={cn(
                      "w-full text-white sm:max-w-2xl",
                      slide.textPosition === 'center' ? 'mx-auto text-center' : 'text-center sm:text-left'
                    )}
                  >
                    <span className="inline-block px-3 py-1 sm:px-4 sm:py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] sm:text-sm font-bold tracking-widest uppercase mb-3 sm:mb-6 border border-white/30">
                      {slide.subtitle}
                    </span>
                    <h1 className="text-[26px] sm:text-[32px] md:text-[48px] font-black mb-2 sm:mb-6 leading-[1.1] sm:leading-[0.9] uppercase tracking-tight sm:tracking-tighter w-full max-w-[320px] mx-auto sm:max-w-none">
                      {slide.title}
                    </h1>
                    <p className="text-[14px] sm:text-[14px] md:text-[16px] text-white/90 mb-5 sm:mb-10 leading-relaxed font-medium whitespace-pre-line">
                      {slide.description}
                    </p>
                    <div className={cn(
                      "flex justify-center flex-wrap gap-3 sm:gap-4",
                      slide.textPosition === 'center' ? 'sm:justify-center' : 'sm:justify-start'
                    )}>
                      <button 
                        onClick={() => scrollToSection('categories')}
                        className="text-[14px] px-8 py-3 sm:px-8 sm:py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl sm:rounded-2xl font-bold uppercase tracking-wider transition-all shadow-xl shadow-green-900/40 flex items-center justify-center gap-2 group"
                      >
                        Shop Now <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button 
                        onClick={() => scrollToSection('trending')}
                        className="hidden sm:flex text-[14px] md:text-[16px] px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-2xl font-bold uppercase tracking-wider transition-all items-center justify-center"
                      >
                        View Offers
                      </button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-3">
          {HERO_SLIDES.map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                currentSlide === i ? "w-10 bg-white" : "w-2 bg-white/40"
              )}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8 mt-4 sm:mt-0">
        <div className="flex justify-between items-end mb-6 sm:mb-10 px-2 sm:px-0">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-green-600 mb-1 sm:mb-2 block">Departments</span>
            <h2 className="text-[24px] md:text-[32px] font-black text-gray-900 uppercase tracking-tighter">Shop by Category</h2>
          </div>
        </div>
        <div className="flex overflow-x-auto sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 pb-4 sm:pb-0 px-2 sm:px-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {STATIC_CATEGORIES.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[140px] sm:min-w-0 w-[140px] sm:w-full flex justify-center snap-start shrink-0"
            >
              <Link 
                to={`/category/${category.name.toLowerCase()}`} 
                className="group flex flex-col items-center bg-white rounded-[16px] p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer w-full h-full"
              >
                <div className="w-full aspect-square overflow-hidden bg-gray-50 rounded-[16px] mb-3 relative shrink-0">
                  <div className="absolute inset-0 bg-gray-200 animate-pulse z-0" />
                  <img 
                    src={category.image} 
                    alt={category.name}
                    loading="lazy"
                    decoding="async"
                    className="opacity-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-500 relative z-10"
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
                </div>
                <h3 className="font-bold text-gray-900 text-center text-sm md:text-md tracking-tight line-clamp-1">
                  {category.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section id="trending" className="bg-gray-50 py-20">
        <div id="offers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-green-600 mb-2 block">Hot Deals</span>
              <h2 className="text-[24px] md:text-[32px] font-black text-gray-900 uppercase tracking-tighter">Trending Products</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-8">
            {trendingProducts.map((product, i) => (
              <FastLoadProduct key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Recommended for You */}
      {recommendedProducts.length > 0 && (
        <section className="bg-white py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-2 block">Just For You</span>
                <h2 className="text-[24px] md:text-[32px] font-black text-gray-900 uppercase tracking-tighter">Recommended For You</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-8">
              {recommendedProducts.map((product, i) => (
                <FastLoadProduct key={`rec-${product.id}`} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Sections */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col gap-20">
        {/* Summer Specials Section */}
        <section>
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 mb-2 block">Seasonal Cuts</span>
              <h2 className="text-[24px] md:text-[32px] font-black text-gray-900 uppercase tracking-tighter">Summer Specials</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {summerSpecials.map((product, i) => (
              <FastLoadProduct key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>

        {/* Promotional Video Section */}
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center">
          <div className="mb-8 text-center">
            <h2 className="text-[20px] md:text-[24px] font-black text-gray-900 tracking-tight mb-1">Fresh From Our Store 🎥</h2>
            <p className="text-[14px] md:text-[15px] text-gray-500 font-medium">Watch our latest products and daily fresh grocery collection.</p>
          </div>
          
          <div className="relative w-full max-w-[320px] h-[560px] sm:max-w-[340px] sm:h-[600px] rounded-[20px] overflow-hidden shadow-2xl bg-gray-100 border border-gray-200">
            <div className="absolute inset-0 bg-gray-200 animate-pulse z-0" />
            <video 
              src="https://www.image2url.com/r2/default/videos/1782021316476-ee75dd2e-324a-419d-8c2d-43fd1ab99927.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              controlsList="nodownload"
              title="Promo Video"
              className="relative z-10 w-full h-full object-cover transition-opacity duration-700 opacity-0"
              onLoadedData={(e) => {
                (e.target as HTMLVideoElement).classList.add('opacity-100');
                (e.target as HTMLVideoElement).classList.remove('opacity-0');
              }}
            />
          </div>
        </section>

        {/* Veggies Section */}
        <section>
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-[24px] md:text-[32px] font-black text-gray-900 uppercase tracking-tighter text-wrap max-w-[200px] sm:max-w-none leading-none">Fresh Vegetables</h2>
            </div>
            <Link to="/category/vegetables" className="text-[14px] md:text-[16px] text-green-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Shop Now <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {freshVeggies.map((product, i) => (
              <FastLoadProduct key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
