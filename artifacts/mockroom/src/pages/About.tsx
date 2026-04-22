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
        <section className="py-24 md:py-32 relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
                className="lg:col-span-5"
              >
                <h1 className="font-display text-5xl md:text-7xl text-foreground uppercase tracking-tight mb-8">
                  Why The Mock Room Exists
                </h1>
                <div className="h-[1px] w-24 bg-primary mb-8"></div>
              </motion.div>
              
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
                className="lg:col-span-7 lg:pl-12"
              >
                <div className="relative">
                  <Quote className="absolute -top-6 -left-8 md:-top-10 md:-left-12 w-16 h-16 md:w-24 md:h-24 text-primary/10 -z-10 transform -rotate-12" />
                  
                  <div className="space-y-6 text-lg md:text-xl font-light text-muted-foreground leading-relaxed">
                    <p>
                      I still remember the look in their eyes. Every day, I met them—brilliant students, hard-working graduates, and sharp minds who had spent years chasing a degree, only to be met with a wall of silence. They had the knowledge, they had the heart, but when they walked into a boardroom, the words wouldn't come.
                    </p>
                    <p>
                      It broke me to see life-changing opportunities slip away, not because they weren't smart enough, but because they had never been taught how to speak their truth under pressure.
                    </p>
                    <p className="font-serif text-2xl md:text-3xl text-foreground leading-snug my-8 border-l-4 border-primary pl-6 py-2 italic">
                      I started The Mock Room with a single, emotional conviction: <span className="text-primary font-semibold">Confidence shouldn't be a luxury.</span> I wanted to create a sanctuary where a student could fail, learn, and find their voice without breaking the bank.
                    </p>
                    <p>
                      We exist because no dream should die in the gap between a degree and an offer letter. We are here to turn that silence into a 'Yes.'
                    </p>
                  </div>
                  
                  <div className="mt-12 flex items-center gap-4">
                    <div className="w-12 h-[1px] bg-border"></div>
                    <div>
                      <p className="font-display tracking-widest uppercase text-foreground">Agradip Majumder</p>
                      <p className="text-sm text-primary">Founder, The Mock Room</p>
                    </div>
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
