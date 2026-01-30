import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Link from 'next/link';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    collegeName: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({
      name: '',
      email: '',
      collegeName: '',
      phone: '',
      subject: '',
      message: '',
    });

    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-primary-900 to-black text-white">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-300">
              Have questions? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
              </div>

              {[
                {
                  icon: Mail,
                  title: 'Email',
                  value: 'support@canteenx.com',
                  href: 'mailto:support@canteenx.com',
                },
                {
                  icon: Phone,
                  title: 'Phone',
                  value: '+91 987 654 3210',
                  href: 'tel:+919876543210',
                },
                {
                  icon: MapPin,
                  title: 'Location',
                  value: 'Campus Innovation Hub, Your City',
                  href: '#',
                },
              ].map((item, i) => (
                <motion.a
                  key={i}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="card p-6 hover:shadow-soft-lg block"
                >
                  <div className="flex gap-4">
                    <item.icon className="w-8 h-8 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold mb-1">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{item.value}</p>
                    </div>
                  </div>
                </motion.a>
              ))}

              {/* Response Time */}
              <div className="card p-6 bg-accent-50 dark:bg-accent-900/30 border border-accent-200 dark:border-accent-800">
                <h3 className="font-bold mb-2">Response Time</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We typically respond to all inquiries within 24 hours.
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="card p-8">
                <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>

                {submitted && (
                  <div className="mb-6 p-4 bg-accent-100 dark:bg-accent-900 text-accent-800 dark:text-accent-100 rounded-xl flex items-center gap-3">
                    <div className="text-2xl">✓</div>
                    <div>
                      <p className="font-semibold">Message Sent Successfully!</p>
                      <p className="text-sm">We'll get back to you soon.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input"
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    {/* College Name */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        College Name
                      </label>
                      <input
                        type="text"
                        name="collegeName"
                        value={formData.collegeName}
                        onChange={handleChange}
                        className="input"
                        placeholder="Your College Name"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input"
                      required
                    >
                      <option value="">Select Subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="demo">Request Demo</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="support">Technical Support</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="input h-32 resize-none"
                      placeholder="Tell us more about your inquiry..."
                      required
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn btn-primary py-3 font-semibold flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>

            <div className="space-y-4">
              {[
                {
                  q: 'How do I get started with CanteenX?',
                  a: 'Simply sign up with your college ID, verify your email, and start browsing the menu!',
                },
                {
                  q: 'Is there a cost to use CanteenX?',
                  a: 'CanteenX is free for students to use. You only pay for the food you order.',
                },
                {
                  q: 'Can I cancel my order?',
                  a: 'Yes, you can cancel orders up to 30 minutes before the scheduled pickup time.',
                },
                {
                  q: 'How do we maintain food quality?',
                  a: 'Our system coordinates with canteen staff to prepare food just before pickup, ensuring freshness.',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="card p-6"
                >
                  <h3 className="font-bold text-lg mb-2">{item.q}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.a}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-6">Still Have Questions?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Check out our documentation or contact our support team
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/signup" className="btn btn-primary">
                Get Started
              </Link>
              <a href="mailto:support@canteenx.com" className="btn btn-secondary">
                Email Support
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
