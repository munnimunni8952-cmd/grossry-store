import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBasket, Heart, Menu, X, User, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { PRODUCTS } from '../constants';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { itemCount, subtotal } = useCart();
  const { user, signIn, signOut } = useAuth();
  const navigate = useNavigate();

  const filteredProducts = searchQuery.trim() 
    ? PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      setSearchQuery('');
      // In a real app, this would navigate to a search results page
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group relative">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200 group-hover:rotate-[-10deg] transition-all duration-300 relative z-10">
              <ShoppingBasket size={24} />
            </div>
            <div className="flex flex-col -gap-1">
              <span className="text-xl sm:text-2xl font-black tracking-tighter text-gray-900 leading-none">
                FRESH<span className="text-green-600">CART</span>
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400 leading-none">
                Premium Grocery
              </span>
            </div>
            <motion.div 
              initial={false}
              whileHover={{ scale: 1.2, opacity: 0.1 }}
              className="absolute -inset-2 bg-green-600 rounded-2xl opacity-0 transition-opacity"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
            <Link to="/#categories" className="hover:text-green-600 transition-colors">Categories</Link>
            <Link to="/#trending" className="hover:text-green-600 transition-colors">Trending</Link>
            <Link to="/#offers" className="hover:text-green-600 transition-colors">Offers</Link>
            <Link to="/contact" className="hover:text-green-600 transition-colors">Contact</Link>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
            >
              <Search size={22} />
            </button>
            <Link to="/wishlist" className="hidden sm:block p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
              <Heart size={22} />
            </Link>
            <Link to="/cart" className="relative p-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors flex items-center gap-2 group">
              <ShoppingBasket size={22} />
              {itemCount > 0 && (
                <div className="hidden sm:flex flex-col items-start leading-none pr-1">
                  <span className="text-[10px] uppercase font-bold opacity-70">Cart</span>
                  <span className="text-xs font-bold">₹{subtotal.toFixed(0)}</span>
                </div>
              )}
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-gray-100">
                <div className="flex flex-col items-end leading-none">
                  <span className="text-[10px] uppercase font-black text-gray-400">Hi,</span>
                  <span className="text-xs font-black text-gray-900 truncate max-w-[80px]">
                    {user.displayName?.split(' ')[0]}
                  </span>
                </div>
                <button 
                  onClick={() => signOut()}
                  className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                >
                  <User size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => signIn()}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95"
              >
                <User size={16} />
                Login
              </button>
            )}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-full"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white z-[70] p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-bold">Menu</span>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex flex-col gap-6 text-lg font-medium">
                <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link to="/#categories" onClick={() => setIsMenuOpen(false)}>Categories</Link>
                <Link to="/#trending" onClick={() => setIsMenuOpen(false)}>Trending</Link>
                <Link to="/#offers" onClick={() => setIsMenuOpen(false)}>Offers</Link>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                <hr className="border-gray-100" />
                <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="flex justify-between items-center text-gray-600 hover:text-green-600">
                  Wishlist <Heart size={20} className="text-gray-400" />
                </Link>
                {user ? (
                  <>
                    <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="flex justify-between items-center text-gray-600 hover:text-green-600">
                      My Orders <ShoppingBasket size={20} className="text-gray-400" />
                    </Link>
                    <button 
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }} 
                      className="flex justify-between items-center text-red-500 font-bold"
                    >
                      Logout <X size={20} />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => {
                      signIn();
                      setIsMenuOpen(false);
                    }} 
                    className="w-full bg-green-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl shadow-green-900/20"
                  >
                    Login / Sign Up
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-[100] flex flex-col"
          >
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center gap-4">
                <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Search for fresh fruits, veggies, snacks..."
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-4 focus:ring-2 focus:ring-green-500 text-lg outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
                <button 
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="p-3 hover:bg-gray-50 rounded-full"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="mt-8">
                {searchQuery.trim() ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <div 
                          key={product.id}
                          onClick={() => {
                            navigate(`/product/${product.id}`);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors group"
                        >
                          <img 
                            src={product.image} 
                            alt={product.name}
                            loading="lazy"
                            className="w-20 h-20 object-cover rounded-xl"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">{product.name}</h4>
                            <p className="text-sm text-gray-500">{product.category} • {product.unit}</p>
                            <p className="font-bold text-green-700 mt-1">₹{product.price}</p>
                          </div>
                          <ArrowRight className="text-gray-300 group-hover:text-green-500 transition-colors" size={20} />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        No products found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Popular Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Vegetables', 'Fruits', 'Organic', 'Snacks', 'Beverages'].map(cat => (
                        <Link 
                          key={cat}
                          to={`/category/${cat.toLowerCase()}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="px-5 py-2.5 bg-gray-50 hover:bg-green-50 hover:text-green-700 rounded-full transition-colors text-sm font-medium"
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
