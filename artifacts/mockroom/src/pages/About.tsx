import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

interface AboutProps {
  onBookSession: () => void;
}

export function About({ onBookSession }: AboutProps) {
  return (
    <>
      <Navbar onBookSession={onBookSession} />
      <main className="w-full pt-20">
        {/* ORIGIN STORY */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 -z-10">
            <img src="/stock/hero.png" className="w-full h-full object-cover" alt="" />
          </div>
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
                className="lg:col-span-6 relative"
              >
                <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-border shadow-2xl relative group">
                  <img src="/stock/founder.png" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Founder of The Mock Room" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-8 left-8">
                    <p className="font-display tracking-[0.2em] uppercase text-xs text-primary font-bold mb-2">Our Founder</p>
                    <h3 className="font-display text-2xl uppercase tracking-widest text-white">Agradip Majumder</h3>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 w-32 h-32 border-t-2 border-r-2 border-primary/20 rounded-tr-3xl -z-10"></div>
              </motion.div>
              
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
                className="lg:col-span-6"
              >
                <div className="relative">
                  <h1 className="font-display text-5xl md:text-7xl text-foreground uppercase tracking-tight mb-8">
                    The <span className="text-primary italic">Why.</span>
                  </h1>
                  <Quote className="absolute -top-10 -right-4 w-20 h-20 text-primary/10 -z-10 transform rotate-12" />
                  
                  <div className="space-y-6 text-lg font-light text-muted-foreground leading-relaxed">
                    <p>
                      I still remember the look in their eyes. Every day, I met them—brilliant students, hard-working graduates, and sharp minds who had spent years chasing a degree, only to be met with a wall of silence.
                    </p>
                    <p className="font-serif text-2xl text-foreground leading-snug my-8 border-l-4 border-primary pl-6 py-2 italic bg-primary/5 rounded-r-xl pr-6">
                      I started The Mock Room because <span className="text-primary font-semibold">confidence shouldn't be a luxury.</span> I wanted to create a sanctuary where a student could fail, learn, and find their voice.
                    </p>
                    <p>
                      We exist because no dream should die in the gap between a degree and an offer letter. We are here to turn that silence into a 'Yes.'
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* GUIDANCE PHILOSOPHY */}
        <section className="py-24 md:py-40 bg-muted/20 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-20">
              <h2 className="font-display text-4xl md:text-6xl text-foreground uppercase tracking-tight mb-6">Our Guidance <span className="text-primary italic">Philosophy.</span></h2>
              <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
                We don't just fix interviews; we build careers. Our guidance is rooted in three non-negotiable principles.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: "Radical Empathy", desc: "We understand the anxiety of the boardroom because we've been there. Our mentors listen first, then lead." },
                { title: "Clinical Precision", desc: "We use AI and industry data to pinpoint exact behavioral gaps, removing guesswork from your preparation." },
                { title: "Industry Relevance", desc: "Our simulations evolve as fast as the corporate world does, ensuring you're never preparing for yesterday's job." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  className="p-10 bg-card border border-border/50 rounded-3xl"
                >
                  <h3 className="font-display text-2xl uppercase tracking-widest text-primary mb-6">{item.title}</h3>
                  <p className="text-lg text-muted-foreground font-light leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="py-24 md:py-32 border-t border-border bg-[#050508]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 max-w-5xl mx-auto">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="text-center md:text-right md:border-r border-border md:pr-12 lg:pr-16"
              >
                <h2 className="font-display text-4xl text-foreground uppercase tracking-widest mb-8 text-primary">Mission</h2>
                <p className="font-serif text-2xl md:text-3xl text-muted-foreground leading-snug">
                  "To ensure that no talent goes unnoticed and no dream goes unspoken — giving every student a fearless voice and a fair shot at the boardroom."
                </p>
              </motion.div>
              
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="text-center md:text-left md:pl-12 lg:pl-16"
              >
                <h2 className="font-display text-4xl text-foreground uppercase tracking-widest mb-8 text-secondary">Vision</h2>
                <p className="font-serif text-2xl md:text-3xl text-muted-foreground leading-snug">
                  "To build a world where a student's future is defined by their potential, not their paycheck — making elite career success a birthright, not a privilege."
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
