
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Packages', href: '/packages' },
    { name: 'Places', href: '/places' },
    { name: 'Cabs', href: '/cabs' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'My Bookings', href: '/bookings' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-lg py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex flex-col">
            <span className={`text-2xl font-bold tracking-tight ${isScrolled ? 'text-teal-800' : 'text-white'}`}>
              Mir Baba
            </span>
            <span className={`text-xs tracking-widest uppercase ${isScrolled ? 'text-teal-600' : 'text-gray-200'}`}>
              Tour & Travels
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-medium text-sm hover:text-teal-500 transition-colors ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <Link
              href="/contact"
              className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all transform hover:scale-105 ${
                isScrolled
                  ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md'
                  : 'bg-white text-teal-800 hover:bg-gray-100'
              }`}
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${isScrolled ? 'text-gray-800' : 'text-white'}`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-gray-100"
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-teal-50"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-100 mt-4">
             <div className="flex items-center gap-3 text-gray-600 mb-3 px-3">
                <Phone size={18} className="text-teal-500" />
                <span className="text-sm">+91 9149559393</span>
             </div>
             <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-5 py-3 rounded-lg bg-teal-600 text-white font-semibold shadow-md"
            >
              Book Your Trip
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}
