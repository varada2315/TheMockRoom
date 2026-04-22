import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, CheckCircle2, ChevronRight, Quote, Star, Users, Briefcase, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

interface HomeProps {
  onBookSession: (tier?: string) => void;
}

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
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
      
      // Easing function
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

export function Home({ onBookSession }: HomeProps) {
  const { scrollY } = useScroll();
  const yHeroBg = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Navbar onBookSession={() => onBookSession()} />
      
      <main className="w-full">
        {/* HERO SECTION */}
        <section id="home" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20">
          <motion.div 
            style={{ y: yHeroBg, opacity: opacityHero }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${import.meta.env.BASE_URL}hero-bg.png)` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/55 to-background"></div>
            <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px] mix-blend-screen"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-secondary/10 rounded-full blur-[100px] mix-blend-screen"></div>
          </motion.div>

          <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center text-center mt-10 md:mt-0">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-4xl mx-auto flex flex-col items-center"
            >
              <motion.div variants={fadeIn} className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium tracking-wide uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                AI-Powered Interview Simulation
              </motion.div>
              
              <motion.h1 variants={fadeIn} className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.1] text-foreground mb-6">
                Why 90% of<br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Graduates Fail.</span>
              </motion.h1>
              
              <motion.h2 variants={fadeIn} className="font-display tracking-wide text-2xl md:text-4xl text-muted-foreground mb-6 uppercase">
                Master the hidden rules of the boardroom.
              </motion.h2>
              
              <motion.p variants={fadeIn} className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 font-light">
                We simulate the interview before the interview. Turn silence into 'Yes.'
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                <Button 
                  size="lg"
                  onClick={() => onBookSession()}
                  className="w-full sm:w-auto h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-lg font-semibold tracking-wide"
                >
                  Book a Session
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={scrollToHowItWorks}
                  className="w-full sm:w-auto h-14 px-8 border-primary/50 text-primary hover:bg-primary/10 rounded-full text-lg font-semibold tracking-wide group"
                >
                  See How It Works
                  <ArrowDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </div>

        </section>

        {/* STATS BAR */}
        <section className="border-y border-border/50 bg-card/30 backdrop-blur-sm relative z-20">
          <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-border/50">
              <div className="flex flex-col items-center justify-center p-4">
                <AnimatedCounter end={500} suffix="+" />
                <span className="text-sm md:text-base text-muted-foreground mt-2 uppercase tracking-wider font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> Paid Users
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4">
                <AnimatedCounter end={80000} prefix="₹" suffix="+" />
                <span className="text-sm md:text-base text-muted-foreground mt-2 uppercase tracking-wider font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Revenue Generated
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4">
                <AnimatedCounter end={20} suffix="+" />
                <span className="text-sm md:text-base text-muted-foreground mt-2 uppercase tracking-wider font-medium flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" /> Job Placements
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4">
                <AnimatedCounter end={60} suffix="-min" />
                <span className="text-sm md:text-base text-muted-foreground mt-2 uppercase tracking-wider font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> High-Fidelity Simulations
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ORIGIN STORY */}
        <section id="about" className="py-24 md:py-32 relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
                className="lg:col-span-5"
              >
                <h2 className="font-display text-5xl md:text-7xl text-foreground uppercase tracking-tight mb-8">
                  Why The Mock Room Exists
                </h2>
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

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-24 md:py-32 bg-card relative overflow-hidden border-y border-border">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="text-center max-w-3xl mx-auto mb-20"
            >
              <h2 className="font-display text-5xl md:text-6xl text-foreground uppercase tracking-tight mb-6">
                The Methodology
              </h2>
              <p className="text-lg text-muted-foreground font-light">
                We don't teach. We simulate. Three steps to replace anxiety with authority.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line for desktop */}
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
                  viewport={{ once: true, margin: "-50px" }}
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
              viewport={{ once: true, margin: "-100px" }}
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

        {/* PRICING */}
        <section id="services" className="py-24 md:py-32 bg-[#050508] relative border-y border-border">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
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
                  viewport={{ once: true, margin: "-50px" }}
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

        {/* TESTIMONIALS */}
        <section id="testimonials" className="py-24 md:py-32 overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="text-center mb-20"
            >
              <h2 className="font-display text-5xl md:text-6xl text-foreground uppercase tracking-tight mb-6">
                From the Boardroom's Edge
              </h2>
              <div className="h-[1px] w-24 bg-primary mx-auto"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "I had the technical skills, but during interviews, I would freeze. The Mock Room didn't just give me feedback; they gave me a battle-tested script for my own mind. I landed my first choice.",
                  name: "Rahul Deka",
                  org: "NIT Silchar"
                },
                {
                  quote: "The AI Gap Report was a wake-up call. Seeing data on my filler words and weak structural answers changed how I prep completely. It's the most honest feedback I've ever received.",
                  name: "Priya Sharma",
                  org: "Tezpur University"
                },
                {
                  quote: "The simulation pressure is real. When I sat for my actual corporate interview, it felt easy compared to what the Mock Room panel put me through. The confidence is permanent.",
                  name: "Samuel K.",
                  org: "Don Bosco Guwahati"
                }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
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
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-24 text-center"
            >
              <h3 className="font-serif text-4xl md:text-5xl text-foreground mb-8">Ready to face the boardroom?</h3>
              <Button 
                size="lg"
                onClick={() => onBookSession()}
                className="h-16 px-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-xl font-display uppercase tracking-widest"
              >
                Claim Your Session
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
