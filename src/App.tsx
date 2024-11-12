import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useThemeStore } from './store/theme-store';
import { ChristmasBanner } from './components/ChristmasBanner';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Cart } from './pages/Cart';
import { Profile } from './pages/Profile';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useAuthStore } from './store/auth-store';
import { useEffect } from 'react';

export default function App() {
  const theme = useThemeStore((state) => state.theme);
  const isLoading = useAuthStore((state) => !state.isAuthInitialized);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''} bg-gray-50 dark:bg-zinc-950 transition-colors`}>
        <ChristmasBanner />
        <Navbar />
        {isLoading && <LoadingSpinner />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
        </Routes>
      </div>
    </Router>
  );
}