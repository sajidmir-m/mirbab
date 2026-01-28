
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, MessageCircle, Mail } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Image from 'next/image';

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

  // Contact details
  const primaryCallNumber = '6005107475';
  const whatsappNumber = '9906646113';
  const email = 'mirbabatourtravels@gmail.com';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-lg py-3'
          : 'bg-gradient-to-r from-[#3C0D2B] via-[#4E1438] to-[#22071A] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full bg-white/90 overflow-hidden border border-white/30 shadow-sm">
              <Image
                src="/logo.png"
                alt="Mir Baba Tour & Travels"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`text-2xl font-extrabold tracking-tight ${
                  isScrolled ? 'text-[#3C0D2B]' : 'text-white'
                }`}
              >
                Mir Baba
              </span>
              <span
                className={`text-xs tracking-widest uppercase ${
                  isScrolled ? 'text-[#8B1430]' : 'text-rose-200'
                }`}
              >
                Tour & Travels
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-medium text-sm hover:text-[#F3B2C4] transition-colors ${
                  isScrolled ? 'text-gray-800' : 'text-rose-50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Primary Call Number */}
            <a
              href={`tel:${primaryCallNumber}`}
              className={`hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                isScrolled
                  ? 'border-[#8B1430] text-[#8B1430] hover:bg-[#8B1430] hover:text-white'
                  : 'border-rose-100 text-rose-50/90 hover:bg-white/10'
              }`}
            >
              <Phone size={16} />
              <span>Call: +91 {primaryCallNumber}</span>
            </a>

            <Link
              href="/contact"
              className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all transform hover:scale-105 ${
                isScrolled
                  ? 'bg-[#8B1430] text-white hover:bg-[#6E0F25] shadow-md'
                  : 'bg-white text-[#3C0D2B] hover:bg-rose-50 shadow-md'
              }`}
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <a
              href={`tel:${primaryCallNumber}`}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold ${
                isScrolled
                  ? 'bg-[#3C0D2B] text-white'
                  : 'bg-white/10 text-rose-50 border border-white/30'
              }`}
            >
              <Phone size={14} />
              <span>Call</span>
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md border ${
                isScrolled
                  ? 'text-gray-900 border-gray-200 bg-white'
                  : 'text-white border-white/40 bg-white/5'
              }`}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
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
            <div className="space-y-3 px-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Phone size={18} className="text-[#8B1430]" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Priority Call</p>
                  <a href={`tel:${primaryCallNumber}`} className="text-sm font-semibold">
                    +91 {primaryCallNumber}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <MessageCircle size={18} className="text-green-600" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Our WhatsApp</p>
                  <a
                    href={`https://wa.me/91${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold"
                  >
                    +91 {whatsappNumber}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Mail size={18} className="text-[#3C0D2B]" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Email</p>
                  <a href={`mailto:${email}`} className="text-sm font-semibold break-all">
                    {email}
                  </a>
                </div>
              </div>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-5 py-3 rounded-lg bg-[#8B1430] text-white font-semibold shadow-md mt-2"
              >
                Book Your Trip
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}
