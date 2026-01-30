import { motion } from 'framer-motion';
import { Users, Zap, Globe, Award } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-900 to-black text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">About CanteenX</h1>
            <p className="text-2xl text-gray-200 mb-2">
              We're on a mission to revolutionize campus dining by making it smarter, faster, and more efficient.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Our Vision</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              To create a world where every college student can enjoy quality food without wasting time in queues.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold">The Problem</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Every day, thousands of students waste time in long canteen queues.
                Food items run out, leaving people disappointed. The canteen staff
                struggle with inventory management and demand planning.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                This inefficiency affects academic productivity and student
                satisfaction. CanteenX solves this with smart pre-ordering and
                real-time inventory management.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold">Our Solution</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                CanteenX is a modern platform that enables students to pre-order
                food directly from their classroom or hostels. Canteen staff get
                real-time visibility into demand, helping them plan inventory
                better.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                The result: zero queues, guaranteed food availability, happy students,
                and optimized operations for the canteen.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              What drives us every day
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: 'Student-First',
                desc: 'Every decision is made with students in mind',
              },
              {
                icon: Zap,
                title: 'Efficiency',
                desc: 'We optimize every aspect of campus dining',
              },
              {
                icon: Globe,
                title: 'Transparency',
                desc: 'Clear communication with all stakeholders',
              },
              {
                icon: Award,
                title: 'Quality',
                desc: 'High standards in everything we do',
              },
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="card p-8 text-center rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
              >
                <value.icon className="w-12 h-12 mx-auto text-primary-600 dark:text-primary-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Built By Students, For Students</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              CanteenX was created by a team of college students who experienced the problems firsthand and decided to build a solution.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="container mx-auto text-center space-y-6 px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold"
          >
            Ready to Transform Your Campus?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex gap-4 justify-center"
          >
            <Link href="/signup" className="px-8 py-3 rounded-xl bg-white text-accent-600 hover:bg-gray-100 font-bold text-lg shadow-lg transition-all flex items-center gap-2">
              Get Started
            </Link>
            <Link href="/contact" className="px-8 py-3 rounded-xl border-2 border-white text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2">
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
