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
    title: "Freshness Delivered to Your Doorstep",
    subtitle: "UP TO 40% OFF",
    description: "Get the finest organic vegetables and fruits sourced directly from local farms. Pure quality, pure health.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1920&fm=webp",
    color: "bg-green-600",
    textPosition: "left"
  },
  {
    id: 2,
    title: "Organic Daily Essentials Store",
    subtitle: "NEW ARRIVALS",
    description: "Discover our wide range of organic daily essentials. From farm-fresh milk to pure Himalayan honey.",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1920&fm=webp",
    color: "bg-orange-500",
    textPosition: "center"
  }
];

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

  const trendingProducts = STATIC_PRODUCTS.filter(p => ['t1', 't2', 't3', 't4', 't5', 't6'].includes(p.id));
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
      <section className="relative h-[600px] sm:h-[700px] overflow-hidden">
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
                <div className="absolute inset-0 bg-black/30 z-10" />
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  loading="eager"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 z-20 flex items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className={cn(
                      "max-w-2xl w-full text-white",
                      slide.textPosition === 'center' ? 'mx-auto text-center' : ''
                    )}
                  >
                    <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold tracking-widest uppercase mb-6 border border-white/30">
                      {slide.subtitle}
                    </span>
                    <h1 className="text-[32px] md:text-[48px] font-black mb-6 leading-[0.9] uppercase tracking-tighter">
                      {slide.title}
                    </h1>
                    <p className="text-[14px] md:text-[16px] text-white/80 mb-10 leading-relaxed font-medium">
                      {slide.description}
                    </p>
                    <div className={cn(
                      "flex flex-col sm:flex-row flex-wrap gap-4",
                      slide.textPosition === 'center' ? 'sm:justify-center' : ''
                    )}>
                      <button 
                        onClick={() => scrollToSection('categories')}
                        className="text-[14px] md:text-[16px] px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold uppercase tracking-wider transition-all shadow-xl shadow-green-900/40 flex items-center justify-center gap-3 group"
                      >
                        Shop Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button 
                        onClick={() => scrollToSection('trending')}
                        className="text-[14px] md:text-[16px] px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-2xl font-bold uppercase tracking-wider transition-all text-center"
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
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
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

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-24 z-30">
        <div className="bg-white rounded-[40px] shadow-2xl p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            { icon: Truck, title: "Free Delivery", desc: "For orders above ₹500", color: "bg-blue-50 text-blue-600" },
            { icon: ShieldCheck, title: "100% Secure", desc: "Safe payment methods", color: "bg-green-50 text-green-600" },
            { icon: Clock, title: "Quick Delivery", desc: "Within 60 minutes", color: "bg-orange-50 text-orange-600" },
            { icon: Star, title: "Top Quality", desc: "Farm fresh organic", color: "bg-yellow-50 text-yellow-600" }
          ].map((item, i) => (
            <div key={i} className="flex sm:flex-row items-center sm:items-start text-left gap-4 p-4 hover:bg-gray-50 rounded-3xl transition-colors group">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform", item.color)}>
                <item.icon size={28} />
              </div>
              <div>
                <h4 className="text-[16px] md:text-[18px] font-bold text-gray-900">{item.title}</h4>
                <p className="text-[14px] md:text-[16px] text-gray-500 font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-green-600 mb-2 block">Departments</span>
            <h2 className="text-[24px] md:text-[32px] font-black text-gray-900 uppercase tracking-tighter">Shop by Category</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {STATIC_CATEGORIES.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="w-full"
            >
              <Link 
                to={`/category/${category.name.toLowerCase()}`} 
                className="group flex flex-col items-center bg-white rounded-[16px] p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer w-full"
              >
                <div className="w-full aspect-square overflow-hidden bg-gray-50 rounded-[16px] mb-3">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
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
              <div key={product.id} className="w-full h-full">
                <ProductCard product={product} index={i} />
              </div>
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
                <div key={`rec-${product.id}`} className="w-full h-full">
                  <ProductCard product={product} index={i} />
                </div>
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
              <div key={product.id} className="w-full h-full">
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        </section>

        {/* Promo Banner */}
        <section className="relative h-[400px] rounded-[40px] overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=70&w=1200&fm=webp" 
            alt="Promo"
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-transparent flex items-center p-6 sm:p-12">
            <div className="max-w-md text-white">
              <span className="text-orange-400 font-black tracking-widest uppercase mb-4 block">Limited Time Offer</span>
              <h2 className="text-[32px] md:text-[48px] font-black mb-6 uppercase tracking-tighter leading-none">Fresh Farm <br /> Veggies Combo</h2>
              <p className="text-[14px] md:text-[16px] text-white/80 mb-8 font-medium">Get a curated box of 10 organic vegetables for just ₹299. Freshly harvested this morning.</p>
              <button 
                onClick={() => navigate('/category/vegetables')}
                className="text-[14px] md:text-[16px] px-6 py-4 sm:px-8 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold uppercase tracking-wider transition-all shadow-xl shadow-orange-900/20 w-full sm:w-auto"
              >
                Order Box Now
              </button>
            </div>
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
              <div key={product.id} className="w-full h-full">
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
