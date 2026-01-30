import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Custom404() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-black text-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        <div className="text-9xl font-black">404</div>
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        <p className="text-xl text-gray-300">
          Oops! We couldn't find the page you're looking for.
        </p>
        <Link href="/" className="inline-block btn btn-accent">
          Go Back Home
        </Link>
      </motion.div>
    </div>
  );
}
