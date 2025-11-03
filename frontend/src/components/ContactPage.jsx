import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GradientText from './AnimatedText/GradientText';

// --- Animated Background Component (Shooting Stars) ---
const ShootingStarsBackground = () => {
  const numStars = 30; // Number of shooting stars
  const starVariants = {
    initial: (i) => ({
      x: `${Math.random() * 200 - 100}vw`, // Start off-screen horizontally
      y: `${Math.random() * 200 - 100}vh`, // Start off-screen vertically
      opacity: 0,
      scale: 0.5,
      rotate: Math.random() * 360,
    }),
    animate: (i) => ({
      x: `${Math.random() * 200 - 100}vw`,
      y: `${Math.random() * 200 - 100}vh`,
      opacity: [0, 1, 0], // Fade in, then fade out
      scale: [0.5, 1, 0.5],
      rotate: Math.random() * 360,
      transition: {
        duration: Math.random() * 8 + 4, // Random longer duration for smoother trails
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        delay: Math.random() * 10, // Staggered delay for each star
      },
    }),
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {[...Array(numStars)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-blue-500 shadow-md shadow-blue-500/50"
          style={{
            width: Math.random() * 2 + 1, // Random size for stars
            height: Math.random() * 2 + 1,
          }}
          variants={starVariants}
          initial="initial"
          animate="animate"
          custom={i}
        />
      ))}
    </div>
  );
};

// --- Main Contact Page Component ---
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState(''); // 'loading', 'success', 'error', ''

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
      console.log('Form submitted:', formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
    } finally {
      // Clear status after some time
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <section className= " min-h-screen bg-black text-white flex justify-center items-center py-12 relative overflow-hidden">
      {/* Animated Background */}
      <ShootingStarsBackground />
      

      {/* Main Content (relative to bg) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-30 relative z-10 w-full max-w-2xl bg-[#0d0d0d] p-8 rounded-2xl shadow-lg border border-blue-500/20"
      >
        <h2 className="text-3xl font-bold text-blue-400 mb-4 text-center">
          <GradientText
  colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
  animationSpeed={3}
  showBorder={false}
  className="custom-class"
>
  <b>Get in Touch</b>
</GradientText>

        </h2>
        <p className="text-gray-300 text-center mb-8">
          We'd love to hear from you! Fill out the form below or find us on social media.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg
                         border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              required
            />
          </motion.div>

          <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg
                         border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              required
            />
          </motion.div>

          <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg
                         border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              required
            />
          </motion.div>

          <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg
                         border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            ></textarea>
          </motion.div>

          <motion.button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors
                       focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={status === 'loading'}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </motion.button>
        </form>

        <AnimatePresence>
          {status === 'success' && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 text-center text-green-500 font-semibold"
            >
              Message sent successfully!
            </motion.p>
          )}
          {status === 'error' && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 text-center text-red-500 font-semibold"
            >
              Failed to send message. Please try again.
            </motion.p>
          )}
        </AnimatePresence>

        <div className="mt-10 text-center text-gray-400">
          <p className="mb-2">Or connect with us:</p>
          <div className="flex justify-center space-x-4 text-2xl">
            <a href="#" className="hover:text-blue-400 transition-colors">
              <i className="fab fa-twitter"></i> {/* Replace with actual icons or SVGs if not using Font Awesome */}
            </a>
            <a href="#" className="hover:text-yellow-400 transition-colors">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="#" className="hover:text-green-400 transition-colors">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}