"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Activity, Heart, Shield } from 'lucide-react';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-16 lg:pt-32 lg:pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-100/30 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="relative w-48 h-48 md:w-56 md:h-56">
                {/* Logo Placeholder */}
                <Image 
                  src="/logo.png" 
                  alt="Renate Liebenberg Physiotherapists Logo" 
                  fill 
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              Expert care for a <span className="text-blue-900">pain-free</span> active life.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Specialized physiotherapy in Kimberley. Whether recovering from surgery, managing chronic pain, or enhancing sports performance, our team is here to support your journey to optimal health.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#booking" className="inline-flex justify-center items-center gap-2 bg-blue-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                Book Appointment
                <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#contact" className="inline-flex justify-center items-center gap-2 bg-white text-blue-900 border-2 border-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300">
                Contact Us
              </a>
            </div>
            
            {/* Quick Stats/Features */}
            <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-6 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-2"><Activity className="w-5 h-5 text-red-700" /> Sports Injuries</div>
              <div className="flex items-center gap-2"><Heart className="w-5 h-5 text-red-700" /> Post-Op Rehab</div>
              <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-red-700" /> Back & Neck Pain</div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex-1 w-full max-w-lg lg:max-w-none"
          >
            <div className="relative aspect-[4/5] md:aspect-[16/9] lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              {/* Staff Photo Placeholder */}
              <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
                <span className="text-slate-400 font-medium">Loading Staff Photo...</span>
              </div>
              <Image 
                src="/staff.png" 
                alt="Renate Liebenberg and Staff" 
                fill 
                className="object-cover object-top hover:scale-105 transition-transform duration-700"
                priority
              />
              
              {/* Floating Badge */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute bottom-6 left-6 right-6 md:right-auto bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-4"
              >
                <div className="bg-green-100 p-2 rounded-full">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute" />
                  <div className="w-3 h-3 bg-green-500 rounded-full relative" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Accepting New Patients</p>
                  <p className="text-xs text-slate-500">Book online instantly</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
