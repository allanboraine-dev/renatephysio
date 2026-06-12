"use client";

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

export function LocationContact() {
  return (
    <section id="contact" className="grid lg:grid-cols-2 gap-8 md:gap-12 bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
      
      {/* Contact Info */}
      <div className="p-8 md:p-12 flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Visit Our Practice</h2>
          <p className="text-slate-600 mb-10">
            Conveniently located in Kimberley, we are ready to assist you on your road to recovery.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-red-50 p-3 rounded-full text-red-700 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Address</h4>
                <p className="text-slate-600">205 Du Toitspan Road<br/>Kimberley, 8301</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-red-50 p-3 rounded-full text-red-700 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Business Hours</h4>
                <p className="text-slate-600">Mon - Fri: 08:00 - 17:00<br/>Sat - Sun: Closed</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-red-50 p-3 rounded-full text-red-700 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Phone</h4>
                <p className="text-slate-600">+27 53 000 0000</p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-10 border-t border-slate-100 flex flex-wrap gap-4">
            <a 
              href="https://wa.me/27530000000" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold hover:bg-[#1ebd58] transition-colors shadow-md"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us
            </a>
            <a 
              href="mailto:info@renatephysio.co.za" 
              className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-full font-bold hover:bg-slate-200 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Email
            </a>
          </div>
        </motion.div>
      </div>

      {/* Map (Placeholder using iframe for standard Google Maps embed) */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="min-h-[400px] h-full w-full bg-slate-200"
      >
        <iframe 
          src="https://maps.google.com/maps?q=205%20Du%20Toitspan%20Road,%20Kimberley&t=&z=15&ie=UTF8&iwloc=&output=embed" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
        />
      </motion.div>

    </section>
  );
}
