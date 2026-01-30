import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuthStore } from '@/store';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const router = useRouter();
  const { signIn, loading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { isAuthenticated, user } = useAuthStore();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await signIn(formData.email, formData.password);
    // If login successful, redirect based on role
    const { isAuthenticated, user } = useAuthStore.getState();
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'canteen_owner') {
        router.push('/canteen');
      } else {
        router.push('/menu');
      }
    }
  };

  const fillDemoCredentials = (role: string) => {
    const credentials = {
      student: { email: 'raj@student.com', password: 'student123' },
      teacher: { email: 'amit@teacher.com', password: 'teacher123' },
      admin: { email: 'admin@canteenx.com', password: 'admin123' },
      canteen_owner: { email: 'canteen@canteenx.com', password: 'canteen123' },
    };
    setFormData(credentials[role as keyof typeof credentials]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white dark:bg-gray-950 rounded-3xl shadow-2xl p-10 md:p-14 border border-gray-200 dark:border-gray-800">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-black gradient-text mb-2 tracking-tight">CanteenX</h1>
            <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Demo Credentials */}
          <div className="mb-8 space-y-2">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">🎯 Demo Credentials:</p>
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                type="button"
                onClick={() => fillDemoCredentials('student')}
                className="px-5 py-1.5 rounded-full font-semibold border text-xs transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400/50 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('teacher')}
                className="px-5 py-1.5 rounded-full font-semibold border text-xs transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400/50 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900"
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="px-5 py-1.5 rounded-full font-semibold border text-xs transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400/50 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('canteen_owner')}
                className="px-5 py-1.5 rounded-full font-semibold border text-xs transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400/50 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900"
              >
                Canteen Owner
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">Email or College ID</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="your@email.com or STU001"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />

            useEffect(() => {
              if (isAuthenticated && user) {
                if (user.role === 'admin') {
                  router.push('/admin');
                } else if (user.role === 'canteen_owner') {
                  router.push('/canteen');
                } else {
                  router.push('/menu');
                }
              }
            }, [isAuthenticated, user, router]);
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input pl-10 pr-10"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-200 mt-4 text-lg tracking-wide"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 space-y-3 text-center text-sm">
            <div>
              <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">
                Forgot password?
              </a>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
