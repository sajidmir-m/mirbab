
import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  const primaryCallNumber = '6005107475';
  const whatsappNumber = '9906646113';
  const email = 'mirbabatourtravels@gmail.com';

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Mir Baba Tour & Travels</h3>
            <p className="text-gray-400 text-sm">
              Your trusted partner for exploring the paradise on earth. We provide customized tour packages, hotel bookings, and transport services in Kashmir.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white text-sm">About Us</Link></li>
              <li><Link href="/packages" className="text-gray-400 hover:text-white text-sm">Tour Packages</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white text-sm">Contact Us</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white text-sm">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>Srinagar, Kashmir, India - 190001</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone size={18} />
                <a href={`tel:+91${primaryCallNumber}`}>Call: +91 {primaryCallNumber}</a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <MessageCircle size={18} />
                <a
                  href={`https://wa.me/91${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Our WhatsApp: +91 {whatsappNumber}
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail size={18} />
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/share/16kmY8pU6w/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={24} />
              </a>
              <a 
                href="https://www.instagram.com/exploring_kashmir____?igsh=cHlyandteW1uNzNm" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={24} />
              </a>
            </div>
            <p className="text-gray-500 text-xs mt-4">
              Join our community for daily Kashmir adventures
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Mir Baba Tour and Travels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
