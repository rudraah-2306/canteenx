import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, Zap, Clock, TrendingUp, Users, ArrowRight } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-black text-white overflow-hidden flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="container mx-auto relative z-10 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen py-20">
            {/* Left Content */}
            <motion.div {...fadeInUp} className="space-y-6">
              <motion.h1
                className="text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Skip the Queue.<br />
                <span className="block text-accent-400">Secure Your Meal.</span>
              </motion.h1>

              <motion.p
                className="text-2xl text-gray-200 max-w-xl leading-relaxed mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Pre-order your favorite food directly from your classroom. Beat the rush, ensure availability, and enjoy your meal on your schedule.
              </motion.p>

              <motion.div
                className="flex gap-4 pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Link href="/signup" className="px-8 py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-bold text-lg shadow-lg transition-all flex items-center gap-2">
                  Get Started <ChevronRight className="w-5 h-5" />
                </Link>
                <Link href="/about" className="px-8 py-3 rounded-xl border-2 border-accent-500 text-accent-500 font-bold text-lg hover:bg-accent-50 dark:hover:bg-accent-900 transition-all flex items-center gap-2">
                  Learn More
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-3 gap-8 pt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="bg-white/10 rounded-2xl p-6 text-center shadow-lg">
                  <div className="text-4xl font-extrabold text-accent-400 mb-2">10K+</div>
                  <p className="text-base text-gray-200">Students</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-6 text-center shadow-lg">
                  <div className="text-4xl font-extrabold text-accent-400 mb-2">50+</div>
                  <p className="text-base text-gray-200">Colleges</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-6 text-center shadow-lg">
                  <div className="text-4xl font-extrabold text-accent-400 mb-2">1M+</div>
                  <p className="text-base text-gray-200">Orders</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-primary-500 rounded-3xl blur-2xl opacity-20"></div>
                <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-10 border border-gray-700 shadow-2xl">
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex gap-4 p-6 bg-gray-800/60 rounded-2xl hover:bg-gray-800 transition-colors shadow-lg"
                      >
                        <div className="w-16 h-16 bg-gray-700 rounded-xl flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                        </div>
                        <div className="text-accent-400 font-bold text-lg">₹120</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">The Problem We Solve</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Every day, students waste 30+ minutes in queues. Food runs out. Everyone loses.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: 'Endless Queues', desc: 'Long waiting lines every lunch time' },
              { icon: TrendingUp, title: 'Stock Outs', desc: 'Popular items run out quickly' },
              { icon: Users, title: 'Chaos', desc: 'Crowded canteen during peak hours' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="card p-8 text-center rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
              >
                <item.icon className="w-12 h-12 mx-auto text-red-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How CanteenX Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Simple, fast, and delicious. Get your order in 4 steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: '1', title: 'Sign Up', desc: 'Register with your college ID' },
              { num: '2', title: 'Browse Menu', desc: 'Check live inventory & prices' },
              { num: '3', title: 'Pre-Order', desc: 'Choose items & payment method' },
              { num: '4', title: 'Pick Up', desc: 'Collect at scheduled time' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="card p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
              >
                <div className="text-4xl font-black text-accent-500 mb-4">{step.num}</div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need for a seamless ordering experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Zap, title: 'Instant Orders', desc: 'Pre-order and have your meal ready in 15 minutes' },
              { icon: Clock, title: 'Schedule Ahead', desc: 'Order for future dates and specific times' },
              { icon: TrendingUp, title: 'Live Inventory', desc: 'Real-time stock updates and availability' },
              { icon: Users, title: 'Order History', desc: 'Track your past orders and favorites' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="card p-8 flex gap-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
              >
                <feature.icon className="w-12 h-12 text-accent-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="container mx-auto text-center space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold"
          >
            Ready to Skip the Queue?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-xl max-w-2xl mx-auto"
          >
            Join thousands of students enjoying hassle-free campus dining today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex gap-4 justify-center"
          >
            <Link href="/signup" className="px-8 py-3 rounded-xl bg-white text-accent-600 hover:bg-gray-100 font-bold text-lg shadow-lg transition-all flex items-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="px-8 py-3 rounded-xl border-2 border-white text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2">
              Request Demo
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
