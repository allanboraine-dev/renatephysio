"use client";

import { motion } from 'framer-motion';
import { Star, Award, Clock, Users } from 'lucide-react';

const stats = [
  { id: 1, name: 'Years Experience', value: '15+', icon: Award },
  { id: 2, name: 'Happy Patients', value: '5,000+', icon: Users },
  { id: 3, name: 'Google Rating', value: '5.0', icon: Star },
  { id: 4, name: 'Quick Booking', value: '24/7', icon: Clock },
];

const testimonials = [
  {
    id: 1,
    content: "Renate and her team are phenomenal. I recovered from my shoulder surgery weeks ahead of schedule. Their personalized care makes all the difference.",
    author: "Michael D.",
    role: "Post-op Patient"
  },
  {
    id: 2,
    content: "As a marathon runner, I've had my share of injuries. The team here always gets me back on the road quickly and safely. Highly recommended!",
    author: "Sarah J.",
    role: "Athlete"
  },
  {
    id: 3,
    content: "Chronic lower back pain plagued me for years. After just a few sessions, I finally have relief. They truly understand how the body works.",
    author: "David T.",
    role: "Long-term Patient"
  }
];

export function TrustSignals() {
  return (
    <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Us?</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          We combine evidence-based treatments with compassionate care to deliver the best outcomes for our patients.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
        {stats.map((stat, index) => (
          <motion.div 
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex flex-col items-center text-center p-4"
          >
            <div className="bg-blue-50 p-4 rounded-2xl mb-4 text-blue-900">
              <stat.icon className="w-8 h-8" />
            </div>
            <dd className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</dd>
            <dt className="text-sm font-medium text-slate-500">{stat.name}</dt>
          </motion.div>
        ))}
      </div>

      <div>
        <h3 className="text-2xl font-bold text-center text-slate-900 mb-10">What Our Patients Say</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="bg-slate-50 p-8 rounded-2xl relative"
            >
              <div className="flex gap-1 text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 italic mb-6">"{testimonial.content}"</p>
              <div>
                <p className="font-bold text-slate-900">{testimonial.author}</p>
                <p className="text-sm text-slate-500">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
