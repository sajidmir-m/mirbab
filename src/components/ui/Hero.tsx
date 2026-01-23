'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const heroVideos = [
  {
    src: "/videos/hero-bg.mp4",
    poster: "https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=2070&auto=format&fit=crop",
    title: "Kashmir",
    subtitle: "Like Never Before"
  },
  {
    src: "/videos/hero-2.mp4",
    poster: "https://images.unsplash.com/photo-1480497490787-505ec076689f?q=80&w=2069&auto=format&fit=crop",
    title: "Winter",
    subtitle: "Wonderland Awaits"
  }
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroVideos.length);
    }, 8000); // Change video every 8 seconds
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % heroVideos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + heroVideos.length) % heroVideos.length);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Video Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            poster={heroVideos[currentIndex].poster}
            className="w-full h-full object-cover opacity-80"
          >
            <source src={heroVideos[currentIndex].src} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all hidden md:block"
      >
        <ChevronLeft size={32} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all hidden md:block"
      >
        <ChevronRight size={32} />
      </button>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.span
          key={`sub-${currentIndex}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-sky-400 font-medium tracking-[0.2em] text-sm md:text-base uppercase mb-4"
        >
          Welcome to Paradise
        </motion.span>
        
        <motion.h1 
          key={`title-${currentIndex}`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-5xl sm:text-7xl md:text-8xl font-bold text-white mb-6 leading-tight"
        >
          Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">{heroVideos[currentIndex].title}</span>
          <br /> {heroVideos[currentIndex].subtitle}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed font-light"
        >
          Experience the breathtaking landscapes, serene lakes, and snow-capped mountains with Mir Baba Tour and Travels. Your journey to heaven starts here.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <Link 
            href="/packages"
            className="group relative px-8 py-4 bg-sky-600 text-white font-semibold rounded-full overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(56,189,248,0.5)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Packages <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          
          <Link 
            href="/contact"
            className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold rounded-full hover:bg-white/20 transition-all"
          >
            Plan Your Trip
          </Link>
        </motion.div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {heroVideos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentIndex === idx ? 'bg-sky-500 w-8' : 'bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
