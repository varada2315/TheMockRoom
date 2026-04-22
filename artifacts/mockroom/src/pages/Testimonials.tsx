import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Quote, Star, MapPin } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

interface TestimonialsProps {
  onBookSession: () => void;
}

export function Testimonials({ onBookSession }: TestimonialsProps) {
  return (
    <>
      <Navbar onBookSession={onBookSession} />
      <main className="w-full pt-20">
        {/* TESTIMONIALS */}
        <section className="py-24 md:py-32 overflow-hidden min-h-[70vh]">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-center mb-20"
            >
              <h1 className="font-display text-4xl md:text-6xl text-foreground uppercase tracking-tight mb-6">
                From the Boardroom's Edge
              </h1>
              <div className="h-[1px] w-24 bg-primary mx-auto"></div>
              <p className="mt-6 text-lg text-muted-foreground font-light max-w-2xl mx-auto">
                Stories of transformation from students who faced their fears and claimed their futures.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "I had the technical skills, but during interviews, I would freeze. The Mock Room didn't just give me feedback; they gave me a battle-tested script for my own mind. I landed my first choice.",
                  name: "Rahul Deka",
                  org: "Top-tier Engineering University"
                },
                {
                  quote: "The AI Gap Report was a wake-up call. Seeing data on my filler words and weak structural answers changed how I prep completely. It's the most honest feedback I've ever received.",
                  name: "Priya Sharma",
                  org: "National Research Institute"
                },
                {
                  quote: "The simulation pressure is real. When I sat for my actual corporate interview, it felt easy compared to what the Mock Room panel put me through. The confidence is permanent.",
                  name: "Samuel K.",
                  org: "Global Business School"
                }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="bg-card p-8 border border-border hover:border-primary/30 transition-colors relative"
                >
                  <Quote className="w-10 h-10 text-primary mb-6 opacity-50" />
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground font-light text-lg mb-8 italic leading-relaxed">"{item.quote}"</p>
                  <div>
                    <p className="font-display uppercase tracking-widest text-foreground text-lg">{item.name}</p>
                    <p className="text-sm text-primary">{item.org}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-16 flex justify-center">
              <li className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Operating across India</span>
              </li>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
