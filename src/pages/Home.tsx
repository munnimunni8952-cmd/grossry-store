import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, ShoppingBag, Truck, ShieldCheck, Clock, ChevronRight, ChevronLeft, Database } from 'lucide-react';
import { CATEGORIES as STATIC_CATEGORIES, PRODUCTS as STATIC_PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { cn } from '../lib/utils';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { seedDatabase } from '../lib/seed';
import { useAuth } from '../context/AuthContext';
import { Product, Category } from '../types';

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
  const { isAdmin } = useAuth();

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
      const productsData = snapshot.docs.map(doc => doc.data() as Product);
      // Fallback to static if empty
      setProducts(productsData.length > 0 ? productsData : STATIC_PRODUCTS);
      setLoading(false);
    });

    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const categoriesData = snapshot.docs.map(doc => doc.data() as Category);
      setCategories(categoriesData.length > 0 ? categoriesData : STATIC_CATEGORIES);
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

  const trendingProducts = products.filter(p => p.isTrending);
  const featuredFruits = products.filter(p => p.category === 'Fruits');
  const freshVeggies = products.filter(p => p.category === 'Vegetables');

  const handleSeed = async () => {
    if (window.confirm("Seed database with initial products?")) {
      await seedDatabase();
      alert("Database seeded!");
    }
  };

  return (
    <div className="flex flex-col gap-16 pb-20">
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
                    <h1 className="text-5xl sm:text-7xl font-black mb-6 leading-[0.9] uppercase tracking-tighter">
                      {slide.title}
                    </h1>
                    <p className="text-lg sm:text-xl text-white/80 mb-10 leading-relaxed font-medium">
                      {slide.description}
                    </p>
                    <div className={cn(
                      "flex flex-wrap gap-4",
                      slide.textPosition === 'center' ? 'justify-center' : ''
                    )}>
                      <button 
                        onClick={() => scrollToSection('categories')}
                        className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold uppercase tracking-wider transition-all shadow-xl shadow-green-900/40 flex items-center gap-3 group"
                      >
                        Shop Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button 
                        onClick={() => scrollToSection('trending')}
                        className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-2xl font-bold uppercase tracking-wider transition-all"
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
        <div className="bg-white rounded-[40px] shadow-2xl p-6 sm:p-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Truck, title: "Free Delivery", desc: "For orders above ₹500", color: "bg-blue-50 text-blue-600" },
            { icon: ShieldCheck, title: "100% Secure", desc: "Safe payment methods", color: "bg-green-50 text-green-600" },
            { icon: Clock, title: "Quick Delivery", desc: "Within 60 minutes", color: "bg-orange-50 text-orange-600" },
            { icon: Star, title: "Top Quality", desc: "Farm fresh organic", color: "bg-yellow-50 text-yellow-600" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 p-4 hover:bg-gray-50 rounded-3xl transition-colors group">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", item.color)}>
                <item.icon size={28} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
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
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 uppercase tracking-tighter">Shop by Category</h2>
          </div>
          <button 
            onClick={() => scrollToSection('categories')}
            className="hidden sm:flex items-center gap-2 text-green-600 font-bold hover:gap-3 transition-all underline underline-offset-8"
          >
            View All Categories <ArrowRight size={18} />
          </button>
          {isAdmin && (
            <button 
              onClick={handleSeed}
              className="flex items-center gap-2 text-orange-600 font-bold hover:gap-3 transition-all bg-orange-50 px-4 py-2 rounded-xl"
            >
              Seed DB <Database size={18} />
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/category/${category.name.toLowerCase()}`} className="group cursor-pointer text-center block">
                <div className="aspect-square rounded-[2rem] overflow-hidden mb-4 relative shadow-lg shadow-gray-100 border border-gray-100 ring-4 ring-transparent group-hover:ring-green-100 group-hover:border-green-200 transition-all duration-300">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/30 group-hover:bg-green-500 transition-colors">
                      <ShoppingBag size={20} />
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors uppercase tracking-tight text-sm">
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
              <h2 className="text-3xl sm:text-5xl font-black text-gray-900 uppercase tracking-tighter">Trending Products</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col gap-20">
        {/* Fruits Section */}
        <section>
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Juicy Fruits</h2>
            </div>
            <Link to="/category/fruits" className="text-green-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Shop Now <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredFruits.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
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
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-transparent flex items-center p-12">
            <div className="max-w-md text-white">
              <span className="text-orange-400 font-black tracking-widest uppercase mb-4 block">Limited Time Offer</span>
              <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter leading-none">Fresh Farm <br /> Veggies Combo</h2>
              <p className="text-lg text-white/80 mb-8 font-medium">Get a curated box of 10 organic vegetables for just ₹299. Freshly harvested this morning.</p>
              <button 
                onClick={() => navigate('/category/vegetables')}
                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold uppercase tracking-wider transition-all shadow-xl shadow-orange-900/20"
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
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Fresh Vegetables</h2>
            </div>
            <Link to="/category/vegetables" className="text-green-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Shop Now <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {freshVeggies.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
