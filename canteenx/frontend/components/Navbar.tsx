import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore, useCartStore } from '@/store';
import { useState } from 'react';
import { Menu, X, ShoppingCart, LogOut } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const { items } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    signOut();
    router.push('/');
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-soft">
      <div className="container mx-auto">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-3xl font-black gradient-text">CanteenX</div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/menu"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              Menu
            </Link>

            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                Admin
              </Link>
            )}
            {user?.role === 'canteen_owner' && (
              <Link
                href="/canteen"
                className="text-gray-700 dark:text-gray-300 hover:text-accent-600 dark:hover:text-accent-400 font-medium transition-colors"
              >
                Canteen Dashboard
              </Link>
            )}

            {user && (
              <Link
                href="/orders"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                Orders
              </Link>
            )}

            <Link
              href="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              About
            </Link>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {user.role !== 'admin' && (
                  <Link href="/cart" className="relative">
                    <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}

                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link href="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 space-y-3">
            <Link
              href="/menu"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
            >
              Menu
            </Link>

            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
              >
                Admin
              </Link>
            )}
            {user?.role === 'canteen_owner' && (
              <Link
                href="/canteen"
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-accent-600 dark:hover:text-accent-400 font-medium"
              >
                Canteen Dashboard
              </Link>
            )}

            {user && (
              <Link
                href="/orders"
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
              >
                Orders
              </Link>
            )}

            <Link
              href="/about"
              className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
            >
              About
            </Link>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 px-4 space-y-2">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full btn btn-secondary justify-center"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link href="/login" className="w-full btn btn-secondary justify-center block">
                    Login
                  </Link>
                  <Link href="/signup" className="w-full btn btn-primary justify-center block">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
