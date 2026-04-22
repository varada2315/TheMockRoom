import React from 'react';
import { motion, Variants } from 'framer-motion';
import { CheckCircle2, TrendingUp, Target, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

interface ServicesProps {
  onBookSession: (tier?: string) => void;
}

export function Services({ onBookSession }: ServicesProps) {
  return (
    <>
      <Navbar onBookSession={() => onBookSession()} />
      <main className="w-full pt-20">
        {/* HOW IT WORKS */}
        <section className="py-24 md:py-32 bg-card relative overflow-hidden border-b border-border">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-center max-w-3xl mx-auto mb-20"
            >
              <h1 className="font-display text-4xl md:text-6xl text-foreground uppercase tracking-tight mb-6">
                The Methodology
              </h1>
              <p className="text-base md:text-lg text-muted-foreground font-light">
                We don't teach. We simulate. Three steps to replace anxiety with authority.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-[16.6%] right-[16.6%] h-[1px] bg-border z-0">
                <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent animate-[pulse_3s_ease-in-out_infinite]"></div>
              </div>

              {[
                {
                  step: "01",
                  title: "Simulate",
                  desc: "60-minute real boardroom-style interview sessions that mirror the intensity of top corporate panels."
                },
                {
                  step: "02",
                  title: "Diagnose",
                  desc: "AI-powered 'Gap Report' identifies structural weaknesses in your articulation, body language, and content."
                },
                {
                  step: "03",
                  title: "Place",
                  desc: "Top performers don't just get feedback—they get direct placement opportunities with our partner companies."
                }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2, duration: 0.6 }}
                  className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left bg-background/50 backdrop-blur-sm p-8 rounded-2xl border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="w-24 h-24 rounded-full bg-card border-2 border-primary flex items-center justify-center mb-8 mx-auto md:mx-0 shadow-[0_0_30px_rgba(212,168,67,0.15)]">
                    <span className="font-serif text-3xl text-primary">{item.step}</span>
                  </div>
                  <h3 className="font-display text-3xl uppercase tracking-wider mb-4 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* DIFFERENTIATORS */}
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
            >
              <div>
                <h2 className="font-display text-5xl md:text-6xl text-foreground uppercase tracking-tight mb-4">
                  Not Another Career Course
                </h2>
                <div className="h-[1px] w-24 bg-primary"></div>
              </div>
              <p className="text-lg text-muted-foreground font-light max-w-md">
                We are a hyper-focused intervention. We build the bridge you actually need.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Simulation Over Information", desc: "You don't need another PDF on how to interview. You need reps in the hot seat under real pressure." },
                { title: "Hyper-Localized for Northeast India", desc: "We understand the specific cultural and educational context of graduates from this region." },
                { title: "AI Gap Report Feedback System", desc: "Objective, data-driven analysis of your performance. No vague feedback, only actionable metrics." },
                { title: "Closed-Loop Hiring Ecosystem", desc: "We aren't just prep; we are a pipeline. If you prove you're ready, we connect you directly to hiring managers." }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-card p-8 md:p-10 border border-border group hover:border-primary/50 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  <CheckCircle2 className="w-8 h-8 text-primary mb-6" />
                  <h3 className="font-display text-2xl md:text-3xl uppercase tracking-wider mb-4 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground font-light text-lg">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* LEARNING OUTCOMES */}
        <section className="py-24 md:py-40 bg-muted/20 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <h2 className="font-display text-4xl md:text-6xl text-foreground uppercase tracking-tight mb-6">
                  Guidance That <br /><span className="text-primary italic">Sticks.</span>
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground font-light mb-12 leading-relaxed">
                  We don't just help you land the job. We equip you with the mental frameworks needed to survive and thrive in the corporate jungle.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    { title: "Salary Negotiation", desc: "Learn the art of the 'Final Ask' and how to articulate your value in numbers.", icon: <TrendingUp className="w-5 h-5 text-primary" /> },
                    { title: "Executive Presence", desc: "Master the non-verbal cues that separate leaders from followers in the room.", icon: <Target className="w-5 h-5 text-primary" /> },
                    { title: "Stress Inoculation", desc: "Build a high tolerance for professional pressure and difficult conversations.", icon: <Shield className="w-5 h-5 text-primary" /> },
                    { title: "Logical Structuring", desc: "Organize your thoughts in real-time using the 'Pyramid Principle' of communication.", icon: <Zap className="w-5 h-5 text-primary" /> }
                  ].map((benefit, i) => (
                    <div key={i} className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        {benefit.icon}
                        <h4 className="font-display text-lg uppercase tracking-widest text-foreground font-bold">{benefit.title}</h4>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{benefit.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="relative hidden lg:block"
              >
                <div className="aspect-video bg-card border border-border/50 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                   <div className="flex justify-between items-start relative z-10">
                     <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-primary" />
                     </div>
                     <div className="text-right">
                       <p className="text-xs text-muted-foreground uppercase tracking-widest">Projection</p>
                       <p className="text-2xl font-display text-foreground">Career ROI</p>
                     </div>
                   </div>
                   <div className="flex-grow flex items-center justify-center relative z-10">
                     <div className="text-center">
                       <p className="text-6xl font-serif text-primary mb-2">12x</p>
                       <p className="text-sm text-muted-foreground uppercase tracking-widest">Lifetime Value of guidance</p>
                     </div>
                   </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="py-24 md:py-32 bg-[#050508] relative border-y border-border">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-center max-w-3xl mx-auto mb-20"
            >
              <h2 className="font-display text-5xl md:text-6xl text-foreground uppercase tracking-tight mb-6">
                Choose Your Battlefield
              </h2>
              <p className="text-lg text-muted-foreground font-light">
                Investment in preparation pays the best interest in negotiation.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  id: "Basic",
                  title: "Basic Session",
                  subtitle: "Individual 1-on-1 Prep",
                  price: "249",
                  unit: "per session",
                  features: ["60-Min Mock Interview", "Standard Feedback", "General Industry Focus"]
                },
                {
                  id: "Advanced",
                  title: "Comprehensive",
                  subtitle: "Deep-dive role-specific prep",
                  price: "499",
                  unit: "per session",
                  popular: true,
                  features: ["60-Min Mock Interview", "AI Gap Report", "Role-Specific Focus", "Resume Review"]
                },
                {
                  id: "Monthly",
                  title: "Monthly Batch",
                  subtitle: "Group simulations + Reports",
                  price: "999",
                  unit: "per month",
                  features: ["4 Group Sessions/Mo", "Detailed AI Gap Report", "Peer Learning", "Direct Placement Pool"]
                }
              ].map((tier, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className={`relative flex flex-col p-8 bg-card border transition-all duration-300 hover:-translate-y-2 ${
                    tier.popular ? 'border-primary shadow-[0_0_40px_rgba(212,168,67,0.15)]' : 'border-border hover:border-primary/50'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 text-xs font-bold uppercase tracking-widest">
                      Most Selected
                    </div>
                  )}
                  
                  <div className="mb-8 border-b border-border pb-8 text-center">
                    <h3 className="font-display text-2xl uppercase tracking-wider text-foreground mb-2">{tier.title}</h3>
                    <p className="text-muted-foreground text-sm mb-6">{tier.subtitle}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-2xl text-primary font-medium">₹</span>
                      <span className="font-serif text-6xl text-foreground leading-none">{tier.price}</span>
                    </div>
                    <span className="text-muted-foreground text-sm block mt-2">{tier.unit}</span>
                  </div>
                  
                  <ul className="space-y-4 mb-10 flex-grow">
                    {tier.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-3 text-muted-foreground font-light">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => onBookSession(tier.id)}
                    className={`w-full h-14 rounded-none text-lg font-display uppercase tracking-widest ${
                      tier.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-transparent border border-primary text-primary hover:bg-primary/10'
                    }`}
                  >
                    Book Now
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
