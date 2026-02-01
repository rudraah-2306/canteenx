import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

// Toast notification component
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const ToastContainer = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleToast = (e: CustomEvent) => {
      const { message, type = 'success' } = e.detail;
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 3000);
    };

    window.addEventListener('toast' as any, handleToast);
    return () => window.removeEventListener('toast' as any, handleToast);
  }, []);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-food-lettuce" />,
    error: <AlertCircle className="w-5 h-5 text-food-tomato" />,
    info: <Info className="w-5 h-5 text-food-mustard" />,
  };

  const colors = {
    success: 'border-food-lettuce/20 bg-food-lettuce/10',
    error: 'border-food-tomato/20 bg-food-tomato/10',
    info: 'border-food-mustard/20 bg-food-mustard/10',
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-xl shadow-soft-lg ${colors[toast.type]}`}
          >
            {icons[toast.type]}
            <span className="font-heading font-medium text-gray-800 dark:text-white">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { setUser } = useAuthStore();

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        
        // Check approval for students/teachers
        if (meta.role === 'student' || meta.role === 'teacher') {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('is_approved')
            .eq('id', session.user.id)
            .single();
          
          if (!profileData || profileData.is_approved !== true) {
            // Not approved - sign out
            await supabase.auth.signOut();
            setUser(null);
            setIsLoading(false);
            return;
          }
        }
        
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: meta.name || '',
          collegeId: meta.collegeId || '',
          phone: meta.phone || '',
          role: meta.role || 'student',
          department: meta.department || '',
          avatar: meta.avatar || '',
          createdAt: session.user.created_at,
        });
      }
      setIsLoading(false);
    };

    checkSession();

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const meta = session.user.user_metadata || {};
          
          // Check approval for students/teachers
          if (meta.role === 'student' || meta.role === 'teacher') {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('is_approved')
              .eq('id', session.user.id)
              .single();
            
            if (!profileData || profileData.is_approved !== true) {
              // Not approved - sign out
              await supabase.auth.signOut();
              setUser(null);
              return;
            }
          }
          
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: meta.name || '',
            collegeId: meta.collegeId || '',
            phone: meta.phone || '',
            role: meta.role || 'student',
            department: meta.department || '',
            avatar: meta.avatar || '',
            createdAt: session.user.created_at,
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {/* Animated logo */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 mx-auto mb-6"
          >
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-food-mustard to-food-tomato flex items-center justify-center shadow-glow">
              <span className="text-3xl">🍽️</span>
            </div>
          </motion.div>
          
          {/* Loading text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-heading font-bold gradient-text mb-2">DGI Eats</h2>
            <p className="text-gray-400 text-sm">Loading deliciousness...</p>
          </motion.div>
          
          {/* Loading bar */}
          <motion.div 
            className="mt-6 w-48 h-1 bg-gray-700 rounded-full overflow-hidden mx-auto"
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1/2 h-full bg-gradient-to-r from-food-mustard to-food-tomato rounded-full"
            ></motion.div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={router.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
