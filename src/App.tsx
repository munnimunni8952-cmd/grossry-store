import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { CategoryPage } from './pages/CategoryPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { StickyCartBar } from './components/StickyCartBar';
import { FreeDeliveryAlert } from './components/FreeDeliveryAlert';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-green-100 selection:text-green-900">
            <ScrollToTop />
            <Navbar />
            <main className="flex-grow pt-16 sm:pt-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                {/* Fallback to home */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
            <StickyCartBar />
            <FreeDeliveryAlert />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
