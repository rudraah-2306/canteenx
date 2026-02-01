import { motion, useScroll, useTransform } from 'framer-motion';
import { Users, Zap, Globe, Award, Heart, Clock, Utensils, Shield, ArrowRight, ChefHat, Target, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

const teamMembers = [
  { name: 'Tanishq Chauhan', role: 'Design & Developer Lead', emoji: '🎨', color: 'from-food-tomato to-food-mustard' },
  { name: 'Rudra Bansal', role: 'Full Stack Developer', emoji: '⚡', color: 'from-food-lettuce to-food-mustard' },
];

const stats = [
  { value: '50K+', label: 'Orders Served', emoji: '🍛' },
  { value: '25+', label: 'Partner Canteens', emoji: '🏪' },
  { value: '10K+', label: 'Happy Students', emoji: '😊' },
  { value: '4.8', label: 'App Rating', emoji: '⭐' },
];

const values = [
  { icon: Users, title: 'Student-First', desc: 'Every decision is made with students in mind', emoji: '🎓' },
  { icon: Zap, title: 'Efficiency', desc: 'We optimize every aspect of campus dining', emoji: '⚡' },
  { icon: Globe, title: 'Transparency', desc: 'Clear communication with all stakeholders', emoji: '🌍' },
  { icon: Award, title: 'Quality', desc: 'High standards in everything we do', emoji: '🏆' },
];

const timeline = [
  { year: '2023', title: 'The Idea', desc: 'Started as a college project to solve queue problems' },
  { year: '2024', title: 'First Launch', desc: 'Launched in our own college with 500+ users' },
  { year: 'Now', title: 'Growing Fast', desc: 'Expanding to multiple colleges across India' },
  { year: 'Future', title: 'The Vision', desc: 'Every college canteen in India, digitized' },
];

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div ref={containerRef} className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="absolute inset-0 food-pattern opacity-5"></div>
          <motion.div style={{ y: y1 }} className="absolute -top-40 -left-40 w-96 h-96 bg-food-tomato/20 rounded-full blur-3xl" />
          <motion.div style={{ y: y2 }} className="absolute -bottom-40 -right-40 w-96 h-96 bg-food-mustard/20 rounded-full blur-3xl" />
        </div>

        {/* Floating food emojis */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 right-20 text-6xl opacity-20"
        >🍜</motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [5, -5, 5] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 left-20 text-6xl opacity-20"
        >🥘</motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-food-mustard to-food-tomato rounded-2xl flex items-center justify-center shadow-glow"
            >
              <ChefHat className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-heading font-black text-white mb-6">
              About{' '}
              <span className="gradient-text">DGI Eats</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              We're on a mission to revolutionize campus dining by making it smarter, 
              faster, and more delicious. No more queues, just great food. 🚀
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass px-6 py-4 rounded-2xl text-center min-w-[120px]"
                >
                  <span className="text-2xl block mb-1">{stat.emoji}</span>
                  <div className="text-2xl font-heading font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* The Problem */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-10 -left-10 text-8xl opacity-10">😔</div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-food-tomato/10 text-food-tomato text-sm font-heading font-semibold mb-4">
                <Target className="w-4 h-4" /> The Problem
              </span>
              <h2 className="text-4xl font-heading font-black mb-6">Long Queues, Empty Stomachs</h2>
              <div className="space-y-4 text-lg text-gray-600 dark:text-gray-400">
                <p>
                  Every day, thousands of students waste precious time standing in long canteen queues. 
                  By the time they reach the counter, their favorite items are often sold out. 😤
                </p>
                <p>
                  The canteen staff struggle with unpredictable demand, leading to food waste and 
                  unsatisfied customers. It's a lose-lose situation that needed fixing.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {['⏰ Wasted Time', '😫 Frustration', '🍔 Food Waste', '📉 Inefficiency'].map((item, i) => (
                  <span key={i} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* The Solution */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-10 -right-10 text-8xl opacity-10">🎉</div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-food-lettuce/10 text-food-lettuce text-sm font-heading font-semibold mb-4">
                <Sparkles className="w-4 h-4" /> Our Solution
              </span>
              <h2 className="text-4xl font-heading font-black mb-6">Smart Pre-Ordering</h2>
              <div className="space-y-4 text-lg text-gray-600 dark:text-gray-400">
                <p>
                  DGI Eats lets students pre-order food from anywhere on campus. 
                  Order from your classroom, hostel, or even the library! 📱
                </p>
                <p>
                  Canteen owners get real-time demand forecasting, reducing waste and ensuring 
                  your favorite items are always available. It's a win-win! 🙌
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {['⚡ Skip Queues', '😊 Happy Students', '📊 Smart Analytics', '💚 Zero Waste'].map((item, i) => (
                  <span key={i} className="px-4 py-2 bg-food-lettuce/10 text-food-lettuce rounded-xl text-sm font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 food-pattern opacity-5"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-food-mustard/10 text-food-mustard text-sm font-heading font-semibold mb-4">
              <Heart className="w-4 h-4" /> What Drives Us
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-black mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              These principles guide every decision we make
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 text-center group"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 mx-auto bg-gradient-to-br from-food-mustard/20 to-food-tomato/20 rounded-2xl flex items-center justify-center mb-4 group-hover:from-food-mustard/30 group-hover:to-food-tomato/30 transition-all"
                >
                  <span className="text-3xl">{value.emoji}</span>
                </motion.div>
                <h3 className="text-xl font-heading font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-food-berry/10 text-food-berry text-sm font-heading font-semibold mb-4">
              <Clock className="w-4 h-4" /> Our Story
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-black mb-4">The Journey</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From a college project to a growing startup
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-food-mustard via-food-tomato to-food-berry -translate-x-1/2 hidden md:block"></div>

              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center gap-8 mb-12 ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 inline-block"
                    >
                      <span className="text-sm font-heading font-bold text-food-mustard">{item.year}</span>
                      <h3 className="text-xl font-heading font-bold mt-1 mb-2">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                    </motion.div>
                  </div>

                  {/* Circle marker */}
                  <div className="hidden md:flex w-12 h-12 bg-gradient-to-br from-food-mustard to-food-tomato rounded-full items-center justify-center shadow-glow z-10">
                    <span className="text-white font-heading font-bold">{i + 1}</span>
                  </div>

                  {/* Empty space for alignment */}
                  <div className="flex-1 hidden md:block"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-food-lettuce/10 text-food-lettuce text-sm font-heading font-semibold mb-4">
              <Users className="w-4 h-4" /> The Team
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-black mb-4">Meet the Foodies</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Built by students, for students. We experienced the problem firsthand.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft overflow-hidden border border-gray-100 dark:border-gray-700 text-center group"
              >
                <div className={`h-24 bg-gradient-to-br ${member.color}`}></div>
                <div className="-mt-10 relative z-10">
                  <div className="w-20 h-20 mx-auto bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800 text-4xl">
                    {member.emoji}
                  </div>
                </div>
                <div className="p-6 pt-4">
                  <h3 className="text-lg font-heading font-bold">{member.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-food-mustard to-food-tomato">
          <div className="absolute inset-0 food-pattern opacity-10"></div>
        </div>

        {/* Floating emojis */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [-10, 10, -10] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-10 left-10 text-5xl opacity-30"
        >🍕</motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [10, -10, 10] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          className="absolute bottom-10 right-10 text-5xl opacity-30"
        >🥪</motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-black mb-6">
              Ready to Skip the Queue? 🚀
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of students who are already enjoying faster, smarter campus dining
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,255,255,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-food-tomato font-heading font-bold rounded-2xl shadow-lg flex items-center gap-2"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/20 text-white font-heading font-bold rounded-2xl border-2 border-white/30 backdrop-blur-sm"
                >
                  Contact Us
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
