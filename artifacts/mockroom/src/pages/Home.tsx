import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { ArrowDown, Users, Briefcase, Clock, TrendingUp, CheckCircle2, Shield, Target, Zap, ArrowRight, Quote, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Link } from 'wouter';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

function AnimatedCounter({ end, suffix = "", prefix = "" }: { end: number, suffix?: string, prefix?: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) return;
    
    let startTime: number;
    const duration = 2000;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, hasAnimated]);

  return (
    <motion.span
      onViewportEnter={() => setHasAnimated(true)}
      className="font-display text-4xl md:text-5xl text-primary"
    >
      {prefix}{count.toLocaleString()}{suffix}
    </motion.span>
  );
}

interface HomeProps {
  onBookSession: (tier?: string) => void;
}

export function Home({ onBookSession }: HomeProps) {
  const { scrollY } = useScroll();
  const yHeroBg = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <>
      <Navbar onBookSession={() => onBookSession()} />
      
      <main className="w-full">
        {/* HERO SECTION */}
        <section id="home" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20">
          <motion.div 
            style={{ y: yHeroBg, opacity: opacityHero }}
            className="absolute inset-0 z-0 overflow-hidden"
          >
            {/* High-performance background: Gradient + Image */}
            <div className="absolute inset-0 bg-[#050508] z-0"></div>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 scale-105"
              style={{ backgroundImage: 'url("/hero-bg.png")' }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/60 to-background z-10"></div>
            
            {/* Subtle Glows (Reduced Animation) */}
            <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[150px] mix-blend-screen opacity-30" />
            <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-secondary/5 rounded-full blur-[120px] mix-blend-screen opacity-30" />
          </motion.div>

          <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center text-center mt-10 md:mt-0">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-5xl mx-auto flex flex-col items-center"
            >
              <motion.div variants={fadeIn} className="mb-8 inline-flex items-center gap-3 px-5 py-2 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-bold tracking-widest uppercase">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
                The Gold Standard of Corporate Readiness
              </motion.div>
              
              <motion.h1 variants={fadeIn} className="font-serif text-4xl md:text-8xl lg:text-9xl leading-[1] md:leading-[0.9] text-foreground mb-6 md:mb-8">
                Master the <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-secondary">Silent Rules.</span>
              </motion.h1>
              
              <motion.h2 variants={fadeIn} className="font-display tracking-[0.2em] text-xl md:text-3xl text-muted-foreground/80 mb-10 uppercase font-light">
                Why 90% of Graduates Fail the Final Boardroom.
              </motion.h2>
              
              <motion.p variants={fadeIn} className="text-lg md:text-2xl text-muted-foreground max-w-3xl mb-14 font-light leading-relaxed">
                We simulate the boardroom pressure before you ever step into it. 
                Our AI-driven feedback bridge the gap between your degree and your dream offer.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-8 w-full sm:w-auto">
                <Button 
                  size="lg"
                  onClick={() => onBookSession()}
                  className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-10 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-lg md:text-xl font-bold tracking-widest shadow-[0_0_40px_rgba(212,168,67,0.3)] transition-all hover:scale-105"
                >
                  Book Your Seat
                </Button>
                <Link href="/services">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-10 border-primary/30 text-primary hover:bg-primary/10 rounded-full text-lg md:text-xl font-bold tracking-widest group backdrop-blur-sm"
                  >
                    Watch a Simulation
                    <ArrowRight className="ml-3 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Floating Mobile CTA */}
        <div className="fixed bottom-6 right-6 z-50 md:hidden">
          <Button 
            onClick={() => onBookSession()}
            className="rounded-full w-14 h-14 shadow-2xl bg-primary text-primary-foreground flex items-center justify-center p-0"
          >
            <Zap className="w-6 h-6" />
          </Button>
        </div>

        {/* TRUST BAR */}
        <section className="py-10 border-y border-border/30 bg-card/10 backdrop-blur-xl relative z-20">
          <div className="container mx-auto px-4 md:px-6">
            <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground/60 mb-8 font-bold">Trusted by graduates from top institutions</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              {['NIT Silchar', 'Tezpur University', 'IIT Guwahati', 'Don Bosco', 'Assam University'].map((name) => (
                <span key={name} className="font-serif text-xl md:text-2xl text-foreground font-semibold italic">{name}</span>
              ))}
            </div>
          </div>
        </section>

        {/* INDUSTRY SPECIALIZATION */}
        <section className="py-24 md:py-40 bg-card/10 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row items-center justify-between mb-20 gap-12">
              <div className="max-w-2xl">
                <h2 className="font-display text-4xl md:text-6xl text-foreground uppercase tracking-tight mb-6">
                  Guidance Tailored to <span className="text-primary italic">Your Path.</span>
                </h2>
                <p className="text-xl text-muted-foreground font-light leading-relaxed">
                  Career guidance isn't one-size-fits-all. We provide specialized high-fidelity simulations across the most competitive industries.
                </p>
              </div>
              <Button 
                size="lg"
                onClick={() => onBookSession()}
                className="h-16 px-10 bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 rounded-full text-lg font-bold tracking-widest uppercase"
              >
                Get a Free Career Audit
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Tech & Product", desc: "System design, algorithmic logic, and product thinking for FAANG+ roles.", icon: <Zap className="w-8 h-8" /> },
                { title: "Finance & IB", desc: "Market analysis, technical valuation, and high-pressure behavioral rounds.", icon: <TrendingUp className="w-8 h-8" /> },
                { title: "Consulting", desc: "Case study mastery, structural problem solving, and executive presence.", icon: <Target className="w-8 h-8" /> },
                { title: "Management", desc: "Situational leadership, stakeholder management, and conflict resolution.", icon: <Shield className="w-8 h-8" /> }
              ].map((industry, i) => (
                <div key={i} className="p-8 bg-card border border-border/50 rounded-2xl hover:border-primary/50 transition-all duration-500 group cursor-default">
                  <div className="w-16 h-16 bg-primary/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    {industry.icon}
                  </div>
                  <h3 className="font-display text-xl uppercase tracking-widest text-foreground mb-4 font-bold">{industry.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm font-light">{industry.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* THE PROCESS */}
        <section className="py-24 md:py-40 relative bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-24">
              <h2 className="font-display text-4xl md:text-6xl text-foreground uppercase tracking-tight mb-6">The 4-Step Evolution</h2>
              <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto italic">From academic theory to corporate dominance.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-1/4 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0"></div>
              
              {[
                { step: "01", title: "Diagnostic", desc: "Initial baseline simulation to identify your raw psychological and technical gaps." },
                { step: "02", title: "Gap Report", desc: "Detailed AI analysis of your articulation, micro-expressions, and logic flow." },
                { step: "03", title: "Recalibration", desc: "Intensive 1-on-1 coaching based on your specific diagnostic data." },
                { step: "04", title: "Final Boardroom", desc: "Live simulation with industry veterans to certify your readiness." }
              ].map((item, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                  <div className="w-20 h-20 rounded-full bg-background border-2 border-primary flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(212,168,67,0.2)] group-hover:scale-110 transition-all duration-500">
                    <span className="font-display text-2xl text-primary">{item.step}</span>
                  </div>
                  <h3 className="font-display text-xl uppercase tracking-widest text-foreground mb-4 font-bold">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CORE PILLARS */}
        <section className="py-24 md:py-40 relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
              {[
                {
                  icon: <Zap className="w-10 h-10 text-primary" />,
                  title: "High-Intensity",
                  subtitle: "Pressure Testing",
                  desc: "We don't do 'practice interviews'. We create high-fidelity simulations that mirror the exact psychological pressure of top-tier corporate panels."
                },
                {
                  icon: <Shield className="w-10 h-10 text-primary" />,
                  title: "AI-Powered",
                  subtitle: "Gap Diagnosis",
                  desc: "Our proprietary Gap Report analyzes 50+ data points in your articulation, micro-expressions, and structural logic to give you objective feedback."
                },
                {
                  icon: <Target className="w-10 h-10 text-primary" />,
                  title: "Closed-Loop",
                  subtitle: "Direct Placement",
                  desc: "Top performers in our simulations are fast-tracked into our hiring ecosystem, getting direct introductions to our corporate partners."
                }
              ].map((pillar, idx) => (
                <motion.div 
                  key={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  className="flex flex-col items-start p-10 bg-card/50 border border-border/50 rounded-3xl hover:border-primary/50 transition-all duration-500 group"
                >
                  <div className="p-4 bg-primary/10 rounded-2xl mb-8 group-hover:scale-110 transition-transform duration-500">
                    {pillar.icon}
                  </div>
                  <h3 className="font-display text-2xl uppercase tracking-tighter text-foreground mb-1">
                    {pillar.title}
                  </h3>
                  <h4 className="font-display text-4xl uppercase tracking-tight text-primary mb-6">
                    {pillar.subtitle}
                  </h4>
                  <p className="text-lg text-muted-foreground font-light leading-relaxed">
                    {pillar.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* REALITY CHECK SECTION */}
        <section className="py-24 md:py-40 bg-card/30 border-y border-border/50 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <h2 className="font-serif text-5xl md:text-7xl text-foreground mb-8 leading-tight">
                  Traditional Prep is<br />
                  <span className="text-primary italic">Obsolete.</span>
                </h2>
                <p className="text-xl text-muted-foreground font-light mb-12 leading-relaxed">
                  Watching YouTube videos or reading PDFs won't save you in the hot seat. 
                  Confidence is a muscle built through exposure, not information.
                </p>
                
                <div className="space-y-6 mb-12">
                  {[
                    "Simulate real boardroom psychological triggers",
                    "Fix stuttering and filler words with data",
                    "Master body language that commands respect",
                    "Direct feedback from industry veterans"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-lg text-foreground font-medium">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                      {item}
                    </div>
                  ))}
                </div>

                {/* Comparison Table (Mobile Optimized) */}
                <div className="bg-card/50 border border-border/50 rounded-2xl overflow-hidden shadow-xl">
                  <div className="grid grid-cols-2 text-center border-b border-border/50 bg-muted/10">
                    <div className="py-4 px-2 font-display text-[10px] md:text-xs tracking-widest uppercase text-muted-foreground border-r border-border/50">Traditional Prep</div>
                    <div className="py-4 px-2 font-display text-[10px] md:text-xs tracking-widest uppercase text-primary font-bold">The Mock Room</div>
                  </div>
                  {[
                    ["Vague Feedback", "Data-Driven Gap Reports"],
                    ["Low Pressure", "High-Fidelity Stress Tests"],
                    ["One-Size-Fits-All", "Targeted Recalibration"],
                    ["General Advice", "Direct Industry Placement"]
                  ].map(([trad, mock], i) => (
                    <div key={i} className="grid grid-cols-2 text-center border-b last:border-0 border-border/50">
                      <div className="py-4 px-2 text-xs md:text-sm text-muted-foreground/60 border-r border-border/50 flex items-center justify-center">{trad}</div>
                      <div className="py-4 px-2 text-xs md:text-sm text-foreground font-medium bg-primary/5 flex items-center justify-center">{mock}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="relative"
              >
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl overflow-hidden border border-border/50 flex items-center justify-center p-12">
                   <div className="text-center">
                     <Quote className="w-20 h-20 text-primary/20 mx-auto mb-8" />
                     <p className="font-serif text-3xl md:text-4xl text-foreground italic leading-snug mb-8">
                       "It's the most honest hour you'll ever spend on your career."
                     </p>
                     <div className="h-[1px] w-12 bg-primary mx-auto mb-6"></div>
                     <p className="font-display tracking-widest uppercase text-sm text-primary">Boardroom Feedback</p>
                   </div>
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 border-r-2 border-b-2 border-primary/30 rounded-br-3xl"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="bg-[#050508] relative z-20">
          <div className="container mx-auto px-4 md:px-6 py-20 md:py-24">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              <div className="flex flex-col items-center justify-center">
                <AnimatedCounter end={500} suffix="+" />
                <span className="text-xs md:text-sm text-muted-foreground mt-3 uppercase tracking-[0.2em] font-bold">
                  Paid Users
                </span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <AnimatedCounter end={80000} prefix="₹" suffix="+" />
                <span className="text-xs md:text-sm text-muted-foreground mt-3 uppercase tracking-[0.2em] font-bold">
                  Revenue Generated
                </span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <AnimatedCounter end={20} suffix="+" />
                <span className="text-xs md:text-sm text-muted-foreground mt-3 uppercase tracking-[0.2em] font-bold">
                  Placements
                </span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <AnimatedCounter end={98} suffix="%" />
                <span className="text-xs md:text-sm text-muted-foreground mt-3 uppercase tracking-[0.2em] font-bold">
                  Success Rate
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS PREVIEW */}
        <section className="py-24 md:py-40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div>
                <h2 className="font-display text-5xl md:text-7xl text-foreground uppercase tracking-tighter mb-4">
                  The Aftermath
                </h2>
                <div className="h-1.5 w-32 bg-primary"></div>
              </div>
              <Link href="/testimonials">
                <Button variant="link" className="text-primary text-xl font-display uppercase tracking-widest p-0 group">
                  View All Stories <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
                {
                  quote: "The AI Gap Report was a wake-up call. Seeing data on my filler words changed how I prep completely.",
                  name: "Priya Sharma",
                  org: "Tezpur University"
                },
                {
                  quote: "I landed my first choice. The Mock Room gave me a battle-tested script for my own mind.",
                  name: "Rahul Deka",
                  org: "NIT Silchar"
                }
              ].map((item, i) => (
                <div key={i} className="bg-card p-12 border border-border/50 relative">
                  <div className="flex gap-1 mb-8">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="font-serif text-2xl text-foreground italic mb-10 leading-relaxed">"{item.quote}"</p>
                  <div>
                    <p className="font-display uppercase tracking-widest text-foreground font-bold">{item.name}</p>
                    <p className="text-sm text-primary">{item.org}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-32 md:py-52 bg-[#050508] relative overflow-hidden border-t border-border/30">
          <div className="absolute inset-0 z-0 opacity-20">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)] blur-[120px]"></div>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="max-w-4xl mx-auto"
            >
              <h2 className="font-serif text-6xl md:text-9xl text-foreground mb-10 leading-[0.9]">
                Own Your<br />
                <span className="text-primary italic">Future.</span>
              </h2>
              <p className="text-xl md:text-3xl text-muted-foreground mb-16 font-light leading-relaxed max-w-2xl mx-auto">
                Stop practicing. Start simulating. Limited sessions available for the May intake.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                <Button 
                  size="lg"
                  onClick={() => onBookSession()}
                  className="h-20 px-16 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-2xl font-bold uppercase tracking-[0.1em] w-full sm:w-auto shadow-[0_20px_50px_rgba(212,168,67,0.4)] transition-all hover:scale-105"
                >
                  Apply Now
                </Button>
                <Link href="/about">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="h-20 px-16 border-primary/50 text-primary hover:bg-primary/10 rounded-full text-2xl font-bold uppercase tracking-[0.1em] w-full sm:w-auto backdrop-blur-sm"
                  >
                    Our Mission
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
