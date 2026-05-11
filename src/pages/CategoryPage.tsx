import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { CATEGORIES as STATIC_CATEGORIES, PRODUCTS as STATIC_PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { Product, Category } from '../types';

export const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Categories
        const catSnap = await getDocs(collection(db, 'categories'));
        const categoriesData = catSnap.docs.map(doc => doc.data() as Category);
        setCategories(categoriesData.length > 0 ? categoriesData : STATIC_CATEGORIES);

        // Fetch Products for this category
        // Note: Field mapping might be needed if case differs
        const q = query(
          collection(db, 'products'),
          where('category', '==', categoryName?.charAt(0).toUpperCase() + categoryName!.slice(1).toLowerCase())
        );
        const prodSnap = await getDocs(q);
        let productsData = prodSnap.docs.map(doc => doc.data() as Product);
        
        // Fallback for demo
        if (productsData.length === 0) {
          productsData = STATIC_PRODUCTS.filter(
            p => p.category.toLowerCase() === categoryName?.toLowerCase()
          );
        }
        
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryName]);

  const category = categories.find(
    c => c.name.toLowerCase() === categoryName?.toLowerCase()
  );

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-3xl font-black uppercase tracking-tighter">Category Not Found</h2>
        <Link to="/" className="text-green-600 font-bold mt-4 inline-block">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="relative h-[300px] sm:h-[400px] mb-12 overflow-hidden">
        <img 
          src={category.image} 
          alt={category.name}
          className="w-full h-full object-cover"
          loading="eager"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
            <div className="flex items-center gap-3 text-sm font-bold text-white/60 mb-4 px-1">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={14} />
              <span className="text-white">{category.name}</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4">
              {category.name}
            </h1>
            <p className="text-white/70 font-medium max-w-xl text-lg px-1">
              Explore our premium selection of fresh {category.name.toLowerCase()} sourced directly from organic farms.
            </p>
          </div>
        </div>
      </div>

      {/* Grid Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-black transition-all">
              <SlidersHorizontal size={18} />
              Filters
            </button>
            <div className="text-sm font-bold text-gray-400">
              <span className="text-gray-900">{products.length}</span> Products Found
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border-2 border-dashed border-gray-100 rounded-[3rem]">
            <p className="text-gray-400 font-bold uppercase tracking-widest">No products available in this category yet.</p>
          </div>
        )}
      </div>

      {/* Other Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-10">Explore More Categories</h2>
        <div className="flex flex-wrap gap-4">
          {categories.filter(c => c.id !== category.id).map(cat => (
            <Link 
              key={cat.id} 
              to={`/category/${cat.name.toLowerCase()}`}
              className="px-8 py-4 bg-gray-50 hover:bg-green-600 hover:text-white rounded-2xl text-sm font-black uppercase tracking-widest transition-all border border-gray-100"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
