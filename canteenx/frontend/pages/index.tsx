import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, Zap, Clock, TrendingUp, Users, ArrowRight, Sparkles, Shield, Utensils, Coffee, Pizza, Salad } from 'lucide-react';
import { useRef } from 'react';

// Floating food emoji component
const FloatingEmoji = ({ emoji, className, delay = 0 }: { emoji: string; className: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className={`absolute text-4xl md:text-6xl select-none pointer-events-none ${className}`}
  >
    <motion.span
      animate={{ y: [0, -15, 0], rotate: [-5, 5, -5] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
      className="block"
    >
      {emoji}
    </motion.span>
  </motion.div>
);

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef}>
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden flex items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            style={{ y }}
            className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-food-mustard/30 to-food-tomato/30 rounded-full blur-3xl"
          ></motion.div>
          <motion.div 
            style={{ y }}
            className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-food-lettuce/20 to-food-mustard/20 rounded-full blur-3xl"
          ></motion.div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        </div>

        {/* Floating food emojis */}
        <FloatingEmoji emoji="🍕" className="top-[15%] left-[10%]" delay={0} />
        <FloatingEmoji emoji="🍔" className="top-[25%] right-[15%]" delay={0.2} />
        <FloatingEmoji emoji="🌮" className="bottom-[30%] left-[8%]" delay={0.4} />
        <FloatingEmoji emoji="🍜" className="top-[60%] right-[10%]" delay={0.6} />
        <FloatingEmoji emoji="🥗" className="bottom-[15%] right-[20%]" delay={0.8} />
        <FloatingEmoji emoji="☕" className="top-[40%] left-[5%]" delay={1} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen py-20">
            {/* Left Content */}
            <motion.div style={{ opacity }} className="space-y-8">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-food-mustard/10 border border-food-mustard/20 text-food-mustard text-sm font-heading font-semibold">
                  <Sparkles className="w-4 h-4" />
                  The Future of Campus Dining
                </span>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-heading font-black leading-tight text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Skip the Queue.
                <br />
                <span className="gradient-text">Savor the Flavor.</span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-gray-300 max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Pre-order your favorite meals from anywhere on campus. Beat the rush, ensure availability, and enjoy hot food on your schedule.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(243, 156, 18, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-food-mustard to-food-tomato text-white font-heading font-bold text-lg shadow-lg transition-all flex items-center gap-2"
                  >
                    Start Ordering <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link href="/about">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-2xl border-2 border-white/20 text-white font-heading font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    How It Works
                  </motion.button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-3 gap-6 pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                {[
                  { value: '10K+', label: 'Happy Students', emoji: '😊' },
                  { value: '50+', label: 'Colleges', emoji: '🏫' },
                  { value: '1M+', label: 'Orders Served', emoji: '🍽️' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="glass rounded-2xl p-5 text-center"
                  >
                    <div className="text-3xl md:text-4xl font-heading font-black gradient-text mb-1">{stat.value}</div>
                    <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
                      {stat.emoji} {stat.label}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Visual - Attractive Food Showcase */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Glow effects */}
                <div className="absolute -top-10 -right-10 w-72 h-72 bg-food-mustard/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-food-tomato/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                
                {/* Main showcase card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  {/* Logo at top */}
                  <motion.div 
                    className="flex justify-center mb-6"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <img src="/logo.png" alt="DGI Eats" className="w-40 h-40 object-contain drop-shadow-2xl" />
                  </motion.div>

                  {/* Glass card with food items */}
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
                    {/* Featured items grid */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { emoji: '🍛', name: 'Curry', color: 'from-orange-500/20 to-red-500/20' },
                        { emoji: '🍕', name: 'Pizza', color: 'from-yellow-500/20 to-orange-500/20' },
                        { emoji: '🥗', name: 'Salad', color: 'from-green-500/20 to-emerald-500/20' },
                        { emoji: '🍔', name: 'Burger', color: 'from-amber-500/20 to-orange-500/20' },
                        { emoji: '☕', name: 'Coffee', color: 'from-brown-500/20 to-amber-500/20' },
                        { emoji: '🧁', name: 'Dessert', color: 'from-pink-500/20 to-rose-500/20' },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`bg-gradient-to-br ${item.color} rounded-2xl p-4 text-center cursor-pointer border border-white/10 hover:border-food-mustard/50 transition-all`}
                        >
                          <div className="text-4xl mb-1">{item.emoji}</div>
                          <p className="text-xs text-gray-300 font-medium">{item.name}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Quick stats */}
                    <div className="flex justify-between items-center px-2 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-food-mustard">15min</div>
                        <div className="text-xs text-gray-400">Avg. Delivery</div>
                      </div>
                      <div className="w-px h-10 bg-white/20"></div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-food-lettuce">4.9⭐</div>
                        <div className="text-xs text-gray-400">Rating</div>
                      </div>
                      <div className="w-px h-10 bg-white/20"></div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-food-tomato">50+</div>
                        <div className="text-xs text-gray-400">Items</div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link href="/menu">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-food-mustard via-food-tomato to-food-mustard bg-[length:200%_100%] animate-gradient text-white font-heading font-bold text-lg shadow-lg flex items-center justify-center gap-2"
                      >
                        <span>Explore Menu</span>
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </motion.button>
                    </Link>
                  </div>

                  {/* Floating badges */}
                  <motion.div
                    animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -top-4 -right-4 bg-food-lettuce text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                  >
                    🔥 Hot Deals
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, 10, 0], rotate: [5, -5, 5] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    className="absolute -bottom-4 -left-4 bg-food-tomato text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                  >
                    ⚡ Fast Pickup
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
          >
            <motion.div
              animate={{ opacity: [1, 0, 1], y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-white"
            ></motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 food-pattern"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-food-tomato font-heading font-semibold text-sm uppercase tracking-wider">The Problem</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-6 text-gray-900 dark:text-white">
              Why Campus Dining is <span className="gradient-text">Broken</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Every day, students waste precious time and energy dealing with these frustrations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Clock, 
                title: '30+ Min Queues', 
                desc: 'Precious break time wasted standing in endless lines',
                color: 'from-red-500 to-orange-500',
                emoji: '😤'
              },
              { 
                icon: TrendingUp, 
                title: 'Food Runs Out', 
                desc: 'Your favorite items sold out before you reach the counter',
                color: 'from-orange-500 to-yellow-500',
                emoji: '😢'
              },
              { 
                icon: Users, 
                title: 'Peak Hour Chaos', 
                desc: 'Overcrowded canteen makes dining stressful',
                color: 'from-yellow-500 to-red-500',
                emoji: '😵'
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-soft hover:shadow-soft-xl transition-all duration-500 border border-gray-100 dark:border-gray-800 overflow-hidden">
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                      {item.emoji}
                    </div>
                    <h3 className="text-xl font-heading font-bold mb-3 text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-food-mustard font-heading font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-6 text-gray-900 dark:text-white">
              How <span className="gradient-text">DGI Eats</span> Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From signup to savor - just 4 simple steps to food freedom.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-food-mustard via-food-tomato to-food-lettuce transform -translate-y-1/2 rounded-full opacity-20"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {[
                { num: '01', title: 'Sign Up', desc: 'Register with your college ID in seconds', emoji: '✨', icon: Sparkles },
                { num: '02', title: 'Browse Menu', desc: 'Explore daily specials & check live stock', emoji: '📱', icon: Utensils },
                { num: '03', title: 'Pre-Order', desc: 'Choose items, time slot & payment method', emoji: '🛒', icon: Shield },
                { num: '04', title: 'Pick Up', desc: 'Skip the queue & collect your hot meal', emoji: '🍽️', icon: Coffee },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ y: -10 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-soft hover:shadow-soft-xl transition-all duration-500 border border-gray-100 dark:border-gray-800 text-center h-full"
                  >
                    {/* Step number */}
                    <div className="relative mx-auto mb-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-food-mustard/10 to-food-tomato/10 flex items-center justify-center mx-auto">
                        <span className="text-4xl font-heading font-black gradient-text">{step.num}</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-food-mustard to-food-tomato flex items-center justify-center text-lg shadow-lg">
                        {step.emoji}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-heading font-bold mb-3 text-gray-900 dark:text-white">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-food-lettuce font-heading font-semibold text-sm uppercase tracking-wider">Features</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-6 text-gray-900 dark:text-white">
              Packed with <span className="gradient-text">Goodness</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need for the ultimate campus dining experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: '15-Min Ready', desc: 'Pre-order and your meal is ready when you arrive', color: 'food-mustard' },
              { icon: Clock, title: 'Schedule Orders', desc: 'Plan your meals ahead for busy days', color: 'food-tomato' },
              { icon: TrendingUp, title: 'Live Inventory', desc: 'Never be disappointed by out-of-stock items', color: 'food-lettuce' },
              { icon: Shield, title: 'Secure Payments', desc: 'Multiple payment options with 100% security', color: 'food-berry' },
              { icon: Users, title: 'Order History', desc: 'Track orders, reorder favorites instantly', color: 'food-chocolate' },
              { icon: Sparkles, title: 'Smart Suggestions', desc: 'Personalized recommendations based on taste', color: 'food-cheese' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 hover:bg-white dark:hover:bg-gray-800 transition-all duration-500 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-soft-lg h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-${feature.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-7 h-7 text-${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-food-mustard/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-food-tomato/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-food-mustard font-heading font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-6">
              Students <span className="gradient-text">Love Us</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Priya Sharma', role: 'CS Student', quote: 'Finally, no more rushing to the canteen! I order during lectures and pick up during break. Genius!', avatar: '👩‍💻' },
              { name: 'Rahul Kumar', role: 'MBA Student', quote: 'The best part? I can see what\'s available before ordering. No more disappointments!', avatar: '👨‍💼' },
              { name: 'Ananya Patel', role: 'Design Student', quote: 'Clean interface, smooth experience. As a designer, I appreciate the attention to detail!', avatar: '👩‍🎨' },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="glass rounded-3xl p-8 h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-food-mustard/20 to-food-tomato/20 flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed italic">"{testimonial.quote}"</p>
                  <div className="flex gap-1 mt-4">
                    {[1,2,3,4,5].map((star) => (
                      <span key={star} className="text-food-cheese">★</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-food-mustard via-food-spice to-food-tomato relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        {/* Floating elements */}
        <div className="absolute top-10 left-10 text-6xl animate-float">🍕</div>
        <div className="absolute bottom-10 right-10 text-6xl animate-float" style={{ animationDelay: '1s' }}>🍔</div>
        <div className="absolute top-1/2 right-1/4 text-4xl animate-float" style={{ animationDelay: '2s' }}>🌮</div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
              Ready to Skip the Queue?
            </h2>
            <p className="text-xl md:text-2xl text-white/80 mb-10">
              Join thousands of students enjoying stress-free campus dining. Sign up takes just 30 seconds!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255, 255, 255, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 rounded-2xl bg-white text-food-tomato font-heading font-bold text-lg shadow-xl transition-all flex items-center gap-2"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 rounded-2xl border-2 border-white text-white font-heading font-bold text-lg hover:bg-white/10 transition-all"
                >
                  Contact Sales
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
