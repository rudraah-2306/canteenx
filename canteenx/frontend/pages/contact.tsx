import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, Building2, User, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    value: 'rudrabansal06@gmail.com',
    href: 'mailto:rudrabansal06@gmail.com',
    emoji: '📧',
    color: 'from-food-tomato to-food-mustard',
  },
  {
    icon: Phone,
    title: 'Call Us',
    value: '+91 9711344559',
    href: 'tel:+919876543210',
    emoji: '📞',
    color: 'from-food-lettuce to-food-mustard',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    value: 'Campus Innovation Hub',
    href: '#',
    emoji: '📍',
    color: 'from-food-berry to-food-tomato',
  },
];

const faqs = [
  { q: 'How do I place an order?', a: 'Simply browse our menu, add items to cart, select pickup time, and checkout. Your food will be ready when you arrive!' },
  { q: 'Can I cancel my order?', a: 'Yes, you can cancel your order within 5 minutes of placing it, or before the canteen starts preparing.' },
  { q: 'What payment methods are accepted?', a: 'We accept UPI payments (GPay, PhonePe, Paytm) and cash on pickup.' },
  { q: 'How do I become a canteen partner?', a: 'Fill out the contact form below or email us at partners@dgieats.com. We\'d love to have you on board!' },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    collegeName: '',
    phone: '',
    subject: 'general',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save to Supabase
      const { error } = await supabase.from('contact_messages').insert([{
        name: formData.name,
        email: formData.email,
        college_name: formData.collegeName,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        status: 'unread',
        created_at: new Date().toISOString(),
      }]);

      if (error) {
        console.error('Error submitting form:', error);
        const event = new CustomEvent('toast', {
          detail: { message: 'Failed to send message. Please try again.', type: 'error' },
        });
        window.dispatchEvent(event);
      } else {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          collegeName: '',
          phone: '',
          subject: 'general',
          message: '',
        });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const subjects = [
    { value: 'general', label: '💬 General Inquiry' },
    { value: 'support', label: '🛠️ Technical Support' },
    { value: 'partnership', label: '🤝 Partnership' },
    { value: 'feedback', label: '⭐ Feedback' },
    { value: 'other', label: '📝 Other' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black">
        <div className="absolute inset-0 food-pattern opacity-5"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="absolute inset-0 food-pattern opacity-5"></div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-40 -left-40 w-96 h-96 bg-food-mustard/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.2, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -bottom-40 -right-40 w-96 h-96 bg-food-tomato/20 rounded-full blur-3xl"
          />
        </div>

        {/* Floating emojis */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 right-20 text-5xl opacity-20"
        >💬</motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [5, -5, 5] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 left-20 text-5xl opacity-20"
        >📞</motion.div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-food-mustard to-food-tomato rounded-2xl flex items-center justify-center shadow-glow"
            >
              <MessageSquare className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-heading font-black text-white mb-4">
              Get in{' '}
              <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Have a question, suggestion, or just want to say hi? We'd love to hear from you! 🙌
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-20">
            {contactInfo.map((info, i) => (
              <motion.a
                key={i}
                href={info.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-soft border border-gray-100 dark:border-gray-700 flex items-center gap-4 group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{info.emoji}</span>
                </div>
                <div>
                  <h3 className="font-heading font-bold mb-1">{info.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{info.value}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-soft border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-food-mustard/20 to-food-tomato/20 rounded-xl flex items-center justify-center">
                    <Send className="w-6 h-6 text-food-mustard" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading font-black">Send a Message</h2>
                    <p className="text-sm text-gray-500">We'll get back to you within 24 hours</p>
                  </div>
                </div>

                {/* Success Message */}
                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="mb-6 p-6 bg-food-lettuce/10 border border-food-lettuce/20 rounded-2xl text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-16 h-16 mx-auto mb-4 bg-food-lettuce/20 rounded-full flex items-center justify-center"
                      >
                        <CheckCircle className="w-8 h-8 text-food-lettuce" />
                      </motion.div>
                      <h3 className="text-xl font-heading font-bold text-food-lettuce mb-2">Message Sent! 🎉</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Thanks for reaching out. We'll get back to you soon!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-heading font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Your Name
                      </label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-food-mustard transition-colors" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-food-mustard dark:focus:border-food-mustard focus:ring-4 focus:ring-food-mustard/10 transition-all outline-none font-medium"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-heading font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-food-mustard transition-colors" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-food-mustard dark:focus:border-food-mustard focus:ring-4 focus:ring-food-mustard/10 transition-all outline-none font-medium"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* College */}
                    <div>
                      <label className="block text-sm font-heading font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        College/Institution
                      </label>
                      <div className="relative group">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-food-mustard transition-colors" />
                        <input
                          type="text"
                          name="collegeName"
                          value={formData.collegeName}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-food-mustard dark:focus:border-food-mustard focus:ring-4 focus:ring-food-mustard/10 transition-all outline-none font-medium"
                          placeholder="Your College"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-heading font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Phone (Optional)
                      </label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-food-mustard transition-colors" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-food-mustard dark:focus:border-food-mustard focus:ring-4 focus:ring-food-mustard/10 transition-all outline-none font-medium"
                          placeholder="+91 98765..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-heading font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Subject
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((subject) => (
                        <motion.button
                          key={subject.value}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setFormData((prev) => ({ ...prev, subject: subject.value }))}
                          className={`px-4 py-2 rounded-xl text-sm font-heading font-medium transition-all ${
                            formData.subject === subject.value
                              ? 'bg-gradient-to-r from-food-mustard to-food-tomato text-white shadow-glow'
                              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {subject.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-heading font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-food-mustard dark:focus:border-food-mustard focus:ring-4 focus:ring-food-mustard/10 transition-all outline-none font-medium resize-none"
                      placeholder="Tell us how we can help you..."
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(243, 156, 18, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl font-heading font-bold text-lg bg-gradient-to-r from-food-mustard to-food-tomato text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        ></motion.div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <Send className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* FAQs */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-food-berry/10 text-food-berry text-sm font-heading font-semibold mb-4">
                  <Sparkles className="w-4 h-4" /> Quick Answers
                </span>
                <h2 className="text-3xl font-heading font-black mb-2">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Find quick answers to common questions
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden"
                  >
                    <motion.button
                      whileHover={{ backgroundColor: 'rgba(243, 156, 18, 0.05)' }}
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="w-full p-5 text-left flex items-center justify-between"
                    >
                      <span className="font-heading font-semibold pr-4">{faq.q}</span>
                      <motion.div
                        animate={{ rotate: expandedFaq === i ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-8 h-8 bg-food-mustard/10 rounded-full flex items-center justify-center flex-shrink-0"
                      >
                        <ArrowRight className={`w-4 h-4 text-food-mustard transition-transform ${expandedFaq === i ? 'rotate-90' : ''}`} />
                      </motion.div>
                    </motion.button>
                    <AnimatePresence>
                      {expandedFaq === i && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {/* Response Time Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                viewport={{ once: true }}
                className="mt-8 bg-gradient-to-br from-food-mustard/10 to-food-tomato/10 rounded-2xl p-6 border border-food-mustard/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-food-mustard/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-food-mustard" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold">Response Time</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We typically respond within 24 hours. For urgent issues, call us directly.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-black mb-2">Find Us</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Campus Innovation Hub, Your City
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-soft border border-gray-100 dark:border-gray-700 h-80 flex items-center justify-center"
          >
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-gray-600 dark:text-gray-400">
                Map integration coming soon!
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Campus Innovation Hub, Tech Park Road, Your City - 123456
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
