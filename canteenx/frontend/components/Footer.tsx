import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, UtensilsCrossed, Heart, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-food-mustard/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-food-tomato/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-14 h-14 rounded-xl flex items-center justify-center"
              >
                <img src="/logo.png" alt="DGI Eats" className="w-14 h-14 object-contain" />
              </motion.div>
              <span className="text-2xl font-heading font-black gradient-text">DGI Eats</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Skip the queue. Secure your meal. The smart way to order food at your college canteen.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Instagram, href: '#', label: 'Instagram' },
              ].map((social, i) => (
                <motion.a 
                  key={i}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gradient-to-br hover:from-food-mustard hover:to-food-tomato flex items-center justify-center transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-food-mustard"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/menu', label: '🍽️ View Menu' },
                { href: '/about', label: 'ℹ️ About Us' },
                { href: '/contact', label: '📞 Contact' },
                { href: '#', label: '📜 Privacy Policy' },
              ].map((link, i) => (
                <motion.li key={i} whileHover={{ x: 4 }}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-food-mustard transition-colors text-sm flex items-center gap-2"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-food-tomato"></span>
              Support
            </h4>
            <ul className="space-y-3">
              {[
                { href: '#', label: '❓ FAQ' },
                { href: '#', label: '📚 Documentation' },
                { href: '#', label: '🟢 Status' },
                { href: '#', label: '📋 Terms of Service' },
              ].map((link, i) => (
                <motion.li key={i} whileHover={{ x: 4 }}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-food-mustard transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-food-lettuce"></span>
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <motion.li whileHover={{ x: 4 }} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-food-mustard" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email us</p>
                  <a href="mailto:rudrabansal06@gmail.com" className="text-gray-300 hover:text-food-mustard transition-colors text-sm">
                    rudrabansal06@gmail.com
                  </a>
                </div>
              </motion.li>
              <motion.li whileHover={{ x: 4 }} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-food-mustard" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Call us</p>
                  <a href="tel:+919876543210" className="text-gray-300 hover:text-food-mustard transition-colors text-sm">
                    +91 9711344559
                  </a>
                </div>
              </motion.li>
              <motion.li whileHover={{ x: 4 }} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-food-mustard" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Hours</p>
                  <p className="text-gray-300 text-sm">Mon - Sat: 8AM - 8PM</p>
                </div>
              </motion.li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} DGI Eats. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-food-tomato fill-food-tomato animate-pulse" /> for hungry students
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
