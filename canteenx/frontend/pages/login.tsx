import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuthStore } from '@/store';
import { Mail, Lock, Eye, EyeOff, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const router = useRouter();
  const { signIn, loading, error, isAuthenticated, user } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        window.location.href = '/admin';
      } else if (user.role === 'canteen_owner') {
        window.location.href = '/canteen';
      } else {
        window.location.href = '/menu';
      }
    }
  }, [isAuthenticated, user]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await signIn(formData.email, formData.password);
    const { isAuthenticated, user } = useAuthStore.getState();
    if (isAuthenticated && user) {
      // Use window.location for reliable full page navigation after auth
      if (user.role === 'admin') {
        window.location.href = '/admin';
      } else if (user.role === 'canteen_owner') {
        window.location.href = '/canteen';
      } else {
        window.location.href = '/menu';
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="absolute inset-0 food-pattern opacity-5"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-food-mustard/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-food-tomato/20 rounded-full blur-3xl"></div>
      </div>

      {/* Floating food emojis */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [-5, 5, -5] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 left-10 text-5xl opacity-20"
      >🍕</motion.div>
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [5, -5, 5] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-20 right-10 text-5xl opacity-20"
      >🍔</motion.div>
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        className="absolute top-1/3 right-20 text-4xl opacity-20"
      >☕</motion.div>

      <div className="flex items-center justify-center min-h-screen py-12 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                whileHover={{ rotate: 20, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-food-mustard to-food-tomato rounded-2xl flex items-center justify-center shadow-glow"
              >
                <UtensilsCrossed className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-3xl font-heading font-black gradient-text mb-2">Welcome Back</h1>
              <p className="text-gray-500 dark:text-gray-400">Sign in to continue ordering</p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-food-tomato/10 border border-food-tomato/20 text-food-tomato rounded-xl text-sm flex items-center gap-2"
              >
                <span>⚠️</span> {error}
              </motion.div>
            )}

            {/* Role Selection Buttons */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-2">
                {['student', 'teacher', 'admin', 'canteen_owner'].map((role) => (
                  <motion.div
                    key={role}
                    whileHover={{ scale: 1.02 }}
                    className="px-3 py-2 rounded-xl font-heading font-medium text-xs text-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                  >
                    {role === 'canteen_owner' ? '🍳 Canteen' : role === 'admin' ? '👑 Admin' : role === 'teacher' ? '👨‍🏫 Teacher' : '🎓 Student'}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-heading font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Email or College ID
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-food-mustard transition-colors" />
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-food-mustard dark:focus:border-food-mustard focus:ring-4 focus:ring-food-mustard/10 transition-all outline-none font-medium"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-heading font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-food-mustard transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-food-mustard dark:focus:border-food-mustard focus:ring-4 focus:ring-food-mustard/10 transition-all outline-none font-medium"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-food-mustard focus:ring-food-mustard/20"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <a href="#" className="text-sm text-food-mustard hover:text-food-tomato font-medium transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(243, 156, 18, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl font-heading font-bold text-lg bg-gradient-to-r from-food-mustard to-food-tomato text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    ></motion.div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link href="/signup" className="text-food-mustard hover:text-food-tomato font-heading font-semibold transition-colors">
                  Sign up free
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom text */}
          <p className="text-center text-gray-500 text-sm mt-6">
            By signing in, you agree to our Terms of Service
          </p>
        </motion.div>
      </div>
    </div>
  );
}
