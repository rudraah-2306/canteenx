import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore, useCartStore } from '@/store';
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, LogOut, UtensilsCrossed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Desktop Nav Link Component
const NavLink = ({ href, label }: { href: string; label: string }) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  
  return (
    <Link href={href}>
      <motion.span
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-4 py-2 rounded-xl font-heading font-medium text-sm transition-all duration-300 inline-block ${
          isActive
            ? 'bg-gradient-to-r from-food-mustard/10 to-food-tomato/10 text-food-tomato'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        {label}
      </motion.span>
    </Link>
  );
};

// Mobile Nav Link Component
const MobileNavLink = ({ href, label, onClick }: { href: string; label: string; onClick: () => void }) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  
  return (
    <Link href={href} onClick={onClick}>
      <motion.div
        whileTap={{ scale: 0.98 }}
        className={`px-4 py-3 rounded-xl font-heading font-medium transition-all ${
          isActive
            ? 'bg-gradient-to-r from-food-mustard/10 to-food-tomato/10 text-food-tomato'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        {label}
      </motion.div>
    </Link>
  );
};

export default function Navbar() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const { items } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
    // Use window.location for reliable full page reload after logout
    window.location.href = '/';
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-soft-lg' 
          : 'bg-white dark:bg-gray-900'
      } border-b border-gray-100 dark:border-gray-800`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="w-12 h-12 rounded-xl flex items-center justify-center"
            >
              <img src="/logo.png" alt="DGI Eats" className="w-12 h-12 object-contain" />
            </motion.div>
            <span className="text-2xl font-heading font-black gradient-text">DGI Eats</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {user && (user.role === 'student' || user.role === 'teacher') && (
              <NavLink href="/menu" label="🍽️ Menu" />
            )}

            {user?.role === 'admin' && (
              <NavLink href="/admin" label="👥 Users" />
            )}

            {user?.role === 'canteen_owner' && (
              <NavLink href="/canteen" label="📊 Dashboard" />
            )}

            {user && (user.role === 'student' || user.role === 'teacher') && (
              <NavLink href="/orders" label="📦 Orders" />
            )}

            <NavLink href="/about" label="ℹ️ About" />
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {(user.role === 'student' || user.role === 'teacher') && (
                  <Link href="/cart" className="relative group">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gradient-to-br hover:from-food-mustard hover:to-food-tomato transition-all duration-300"
                    >
                      <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors" />
                    </motion.div>
                    <AnimatePresence>
                      {cartCount > 0 && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1 -right-1 bg-food-tomato text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                        >
                          {cartCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                )}

                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-food-mustard to-food-tomato flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {user.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white font-heading">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></span>
                        {user.role.replace('_', ' ')}
                      </p>
                    </div>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLogout}
                    className="p-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 group"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2.5 rounded-xl font-heading font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(243, 156, 18, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 rounded-xl font-heading font-semibold bg-gradient-to-r from-food-mustard to-food-tomato text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 border-t border-gray-100 dark:border-gray-800">
                {user && (user.role === 'student' || user.role === 'teacher') && (
                  <MobileNavLink href="/menu" label="🍽️ Menu" onClick={() => setIsOpen(false)} />
                )}

                {user?.role === 'admin' && (
                  <MobileNavLink href="/admin" label="👥 User Management" onClick={() => setIsOpen(false)} />
                )}

                {user?.role === 'canteen_owner' && (
                  <MobileNavLink href="/canteen" label="📊 Dashboard" onClick={() => setIsOpen(false)} />
                )}

                {user && (user.role === 'student' || user.role === 'teacher') && (
                  <MobileNavLink href="/orders" label="📦 My Orders" onClick={() => setIsOpen(false)} />
                )}

                <MobileNavLink href="/about" label="ℹ️ About" onClick={() => setIsOpen(false)} />

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 px-2 space-y-2">
                  {user ? (
                    <>
                      {(user.role === 'student' || user.role === 'teacher') && (
                        <Link href="/cart" onClick={() => setIsOpen(false)}>
                          <motion.div
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800"
                          >
                            <span className="font-heading font-medium">🛒 Cart</span>
                            {cartCount > 0 && (
                              <span className="bg-food-tomato text-white text-xs font-bold px-2 py-1 rounded-full">
                                {cartCount} items
                              </span>
                            )}
                          </motion.div>
                        </Link>
                      )}
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-heading font-semibold flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </motion.button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          className="w-full px-4 py-3 rounded-xl border-2 border-food-mustard text-food-mustard font-heading font-semibold"
                        >
                          Login
                        </motion.button>
                      </Link>
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-food-mustard to-food-tomato text-white font-heading font-semibold shadow-lg"
                        >
                          Sign Up
                        </motion.button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
