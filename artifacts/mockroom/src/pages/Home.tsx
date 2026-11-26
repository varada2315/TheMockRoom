import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { ArrowDown, Users, Briefcase, Clock, TrendingUp, CheckCircle2, Shield, Target, Zap, ArrowRight, Quote, Star, MapPin } from 'lucide-react';
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

  const [showAllDomains, setShowAllDomains] = useState(false);

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
              <motion.h1 variants={fadeIn} className="font-serif text-4xl md:text-8xl lg:text-9xl leading-[1] md:leading-[0.9] text-foreground mb-6 md:mb-8">
                Master the <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-secondary">Silent Rules.</span>
              </motion.h1>
              
              <motion.h2 variants={fadeIn} className="font-display tracking-[0.2em] text-lg md:text-2xl text-primary/80 mb-6 uppercase font-bold text-center">
                The Boardroom Simulation for India's Next-Gen Leaders.
              </motion.h2>
              
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
            <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground/60 mb-8 font-bold">Candidates from India's elite institutions</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
              <span className="font-serif text-xl md:text-2xl font-bold tracking-tighter">Assam Engineering College (AEC)</span>
              <span className="font-serif text-xl md:text-2xl font-bold tracking-tighter">Delhi University (DU)</span>
              <span className="font-serif text-xl md:text-2xl font-bold tracking-tighter">NIT Agartala</span>
              <span className="font-serif text-xl md:text-2xl font-bold tracking-tighter">SRM Institute</span>
              <span className="font-serif text-xl md:text-2xl font-bold tracking-tighter">Tezpur University</span>
            </div>
          </div>
        </section>

        {/* OFFICIAL COURSES */}
        <section id="courses" className="py-24 md:py-36 bg-card/20 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-8">
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary block mb-2">Featured Masterclasses</span>
                <h2 className="font-serif text-4xl md:text-6xl text-foreground font-bold tracking-tight mb-4">
                  Our Career Masterclasses
                </h2>
                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                  Industry-leading certification tracks designed for career acceleration. All courses priced at <strong className="text-emerald-600 font-bold">₹9,499</strong> each.
                </p>
              </div>
              <Button 
                size="lg"
                onClick={() => onBookSession()}
                className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold tracking-wider uppercase shadow-lg"
              >
                Enroll via WhatsApp
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { id: "AI - ARTIFICIAL INTELLIGENCE", title: "AI - Artificial Intelligence", desc: "Generative AI, neural networks, PyTorch, LLMs, and real-world AI deployment.", icon: <Zap className="w-5 h-5 text-amber-500" />, image: "/domains/ai.png" },
                { id: "IOT", title: "IoT - Internet of Things", desc: "Embedded microcontrollers, sensor nodes, MQTT protocols, and hardware systems.", icon: <TrendingUp className="w-5 h-5 text-blue-500" />, image: "/domains/iot.png" },
                { id: "WEB DEVELOPMENT", title: "Web Development", desc: "Full stack React.js, Node.js, Express, databases, REST APIs, and hosting.", icon: <Target className="w-5 h-5 text-indigo-500" />, image: "/domains/tech.png" },
                { id: "DIGITAL MARKETING", title: "Digital Marketing", desc: "SEO algorithms, performance advertising, growth hacking, and web analytics.", icon: <Shield className="w-5 h-5 text-emerald-500" />, image: "/domains/finance.png" },
                { id: "VLSI", title: "VLSI Design", desc: "Verilog hardware description, ASIC/FPGA flow, digital circuits, and silicon layout.", icon: <Zap className="w-5 h-5 text-purple-500" />, image: "/domains/vlsi.png" },
                { id: "DATA SCIENCE", title: "Data Science", desc: "Python data stack, probability, predictive modeling, and data storytelling.", icon: <TrendingUp className="w-5 h-5 text-cyan-500" />, image: "/domains/consulting.png" },
                { id: "DATA ANALYTICS", title: "Data Analytics", desc: "SQL querying, PowerBI dashboards, business intelligence, and Excel mastery.", icon: <Target className="w-5 h-5 text-rose-500" />, image: "/domains/management.png" },
                { id: "MACHINE LEARNING", title: "Machine Learning", desc: "Supervised algorithms, Scikit-Learn pipelines, feature selection, and API models.", icon: <Shield className="w-5 h-5 text-amber-500" />, image: "/domains/ai.png" }
              ].map((course, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border/70 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-70"></div>
                    <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-full shadow-md">
                      ₹9,499
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                      <p className="text-muted-foreground text-xs font-light leading-relaxed">{course.desc}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onBookSession(course.title)}
                      className="w-full rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground font-semibold text-xs transition-colors"
                    >
                      Enroll Now — ₹9,499
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* THE PROCESS */}
        <section className="py-24 md:py-40 relative bg-muted/30 overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="max-w-xl"
              >
                <h2 className="font-display text-4xl md:text-6xl text-foreground uppercase tracking-tight mb-6">
                  AI Analysis Coming Soon
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground font-light mb-8 leading-relaxed">
                  Our proprietary AI diagnostics platform is in final training. Soon, you'll be able to simulate technical boardrooms and receive instant, objective analysis of your behavioral patterns, communication structures, and knowledge gaps.
                </p>
                <div className="space-y-4">
                  {[
                    "Micro-expression & body language assessment",
                    "Vocabulary & logical structuring review",
                    "Adaptive complexity adjustment based on response quality"
                  ].map((bullet, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <span className="text-sm text-foreground/80 font-light">{bullet}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative h-[400px] w-full flex items-center justify-center group"
              >
                {/* Stacked Image 1 (Left tilted) */}
                <div className="absolute w-[240px] md:w-[280px] aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-border/30 -rotate-6 -translate-x-12 md:-translate-x-16 opacity-40 group-hover:-rotate-12 group-hover:-translate-x-20 transition-all duration-500 select-none">
                  <img src="/domains/consulting.png" className="w-full h-full object-cover" alt="" />
                </div>

                {/* Stacked Image 2 (Right tilted) */}
                <div className="absolute w-[240px] md:w-[280px] aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-border/30 rotate-6 translate-x-12 md:translate-x-16 opacity-40 group-hover:rotate-12 group-hover:translate-x-20 transition-all duration-500 select-none">
                  <img src="/domains/tech.png" className="w-full h-full object-cover" alt="" />
                </div>

                {/* Center Image (Top) */}
                <div className="absolute w-[280px] md:w-[320px] aspect-square rounded-2xl overflow-hidden shadow-2xl border border-primary/50 z-10 group-hover:scale-105 transition-transform duration-500 bg-card select-none">
                  <img src="/stock/ai-viz.png" className="w-full h-full object-cover" alt="AI Analysis Diagnostics Preview" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="font-display text-xs uppercase tracking-widest text-primary font-bold mb-1">Diagnostic System</p>
                    <h4 className="text-sm font-medium text-white">Interactive Gap Reports</h4>
                  </div>
                </div>
              </motion.div>
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
                className="relative group"
              >
                <div className="aspect-square bg-card rounded-3xl overflow-hidden border border-border/50 relative shadow-2xl">
                  <img 
                    src="/stock/simulation.png" 
                    alt="Mock Interview Simulation" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-80"></div>
                  <div className="absolute bottom-10 left-10 right-10 text-center">
                    <p className="font-display tracking-widest uppercase text-xs text-primary font-bold">The Boardroom Reality</p>
                  </div>
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r-2 border-b-2 border-primary/30 rounded-br-3xl -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="bg-[#050508] relative z-20">
          <div className="container mx-auto px-4 md:px-6 py-20 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col items-center justify-center">
                <AnimatedCounter end={500} suffix="+" />
                <span className="text-xs md:text-sm text-muted-foreground mt-3 uppercase tracking-[0.2em] font-bold">
                  Active Candidates
                </span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <AnimatedCounter end={20} suffix="+" />
                <span className="text-xs md:text-sm text-muted-foreground mt-3 uppercase tracking-[0.2em] font-bold">
                  Corporate Placements
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

        {/* SPECIALIZED COURSES */}
        <section className="py-24 md:py-32 bg-[#050508] relative border-y border-border">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-center max-w-3xl mx-auto mb-20"
            >
              <h2 className="font-display text-5xl md:text-6xl text-white uppercase tracking-tight mb-6">
                Our Specialized Courses
              </h2>
              <p className="text-lg text-white/70 font-light">
                Redefine your potential. Accelerate your career with our masterclasses.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {[
                {
                  id: "AI - ARTIFICIAL INTELLIGENCE",
                  title: "AI - Artificial Intelligence",
                  subtitle: "Neural Nets & Generative AI",
                  price: "9,499",
                  unit: "one-time enrollment",
                  popular: true,
                  features: ["Generative AI & LLMs", "Deep Learning Frameworks", "Neural Networks & NLP", "Industry Capstone Project", "1-on-1 Mentorship & Reviews"]
                },
                {
                  id: "IOT",
                  title: "IOT - Internet of Things",
                  subtitle: "Smart Devices & Sensors",
                  price: "9,499",
                  unit: "one-time enrollment",
                  features: ["Embedded Systems & MCUs", "Sensor Integration", "IoT Protocols (MQTT/HTTP)", "Cloud Platform Sync", "Real-World Deployments"]
                },
                {
                  id: "WEB DEVELOPMENT",
                  title: "Web Development",
                  subtitle: "Full Stack Mastery",
                  price: "9,499",
                  unit: "one-time enrollment",
                  features: ["React.js Modern Frontend", "Node.js & Express Backend", "SQL & NoSQL Databases", "RESTful APIs & Auth", "Deployment & Hosting"]
                },
                {
                  id: "DIGITAL MARKETING",
                  title: "Digital Marketing",
                  subtitle: "Growth & Brand Strategy",
                  price: "9,499",
                  unit: "one-time enrollment",
                  features: ["SEO Optimization", "PPC & Performance Ads", "Social Media Strategy", "Web Analytics & ROI", "Conversion Optimization"]
                },
                {
                  id: "VLSI",
                  title: "VLSI Design",
                  subtitle: "Silicon & Circuit Engineering",
                  price: "9,499",
                  unit: "one-time enrollment",
                  features: ["Verilog / VHDL Coding", "ASIC / FPGA Flow", "Digital Design Basics", "Synthesis & Static Timing", "CMOS Circuits & Layout"]
                },
                {
                  id: "DATA SCIENCE",
                  title: "Data Science",
                  subtitle: "Statistical Modeling & Analytics",
                  price: "9,499",
                  unit: "one-time enrollment",
                  features: ["Python Data Ecosystem", "Probability & Statistics", "Predictive Modeling", "Feature Engineering", "Data Storytelling & Viz"]
                },
                {
                  id: "DATA ANALYTICS",
                  title: "Data Analytics",
                  subtitle: "Business Intelligence",
                  price: "9,499",
                  unit: "one-time enrollment",
                  features: ["SQL Querying & DBs", "Tableau & PowerBI Reports", "Advanced Excel Analytics", "KPI Dashboard Design", "Data-Driven Decisions"]
                },
                {
                  id: "MACHINE LEARNING",
                  title: "Machine Learning",
                  subtitle: "Algorithms & Pipelines",
                  price: "9,499",
                  unit: "one-time enrollment",
                  premium: true,
                  features: ["Supervised & Unsupervised", "Scikit-Learn Pipelines", "Feature Selection & Tuning", "Model Deployment (APIs)", "Deep Learning Basics"]
                }
              ].map((tier, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`relative bg-card p-6 border ${tier.popular ? 'border-primary shadow-[0_0_40px_rgba(212,168,67,0.1)]' : tier.premium ? 'border-secondary shadow-[0_0_40px_rgba(31,107,255,0.05)]' : 'border-border'} flex flex-col transition-all duration-300 hover:-translate-y-2`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
                      Most Popular
                    </div>
                  )}
                  {tier.premium && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-secondary text-white text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
                      Advanced Track
                    </div>
                  )}
                  
                  <div className="mb-6 border-b border-border pb-6 text-center">
                    <h3 className="font-display text-lg uppercase tracking-wider text-foreground mb-2 min-h-[56px] flex items-center justify-center">{tier.title}</h3>
                    <p className="text-muted-foreground text-xs mb-4">{tier.subtitle}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-xl text-primary font-medium">₹</span>
                      <span className="font-serif text-4xl text-foreground leading-none">{tier.price}</span>
                    </div>
                    <span className="text-muted-foreground text-xs block mt-2">{tier.unit}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8 flex-grow">
                    {tier.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-2 text-muted-foreground font-light text-xs">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        {feat}
                      </li>
                    ))}
                    <li className="flex items-start gap-2 text-muted-foreground text-[10px]">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <span>Agartala, Tripura, India</span>
                    </li>
                  </ul>
                  
                  <Button 
                    onClick={() => onBookSession(tier.id)}
                    className={`w-full h-12 rounded-none text-sm font-display uppercase tracking-widest ${
                      tier.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-transparent border border-primary text-primary hover:bg-primary/10'
                    }`}
                  >
                    Enroll Now
                  </Button>
                </motion.div>
              ))}
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
                  quote: "I had the technical skills, but during interviews, I would freeze. The Mock Room didn't just give me feedback; they gave me a battle-tested script for my own mind. I landed my first choice.",
                  name: "Rahul Deka",
                  org: "Assam Engineering College (AEC)"
                },
                {
                  quote: "The AI Gap Report was a wake-up call. Seeing data on my filler words and weak structural answers changed how I prep completely. It's the most honest feedback I've ever received.",
                  name: "Priya Sharma",
                  org: "Tezpur University"
                },
                {
                  quote: "The simulation pressure is real. When I sat for my actual corporate interview, it felt easy compared to what the Mock Room panel put me through. The confidence is permanent.",
                  name: "Samuel K.",
                  org: "NIT Agartala"
                },
                {
                  quote: "The personalized mentorship from the human experts bridged the final mile. I finally understood why I wasn't clearing the final rounds.",
                  name: "Ananya R.",
                  org: "Delhi University (DU)"
                },
                {
                  quote: "The structure provided by the platform is unparalleled. It turns the chaotic interview process into a clean, predictable pipeline.",
                  name: "Vikram S.",
                  org: "SRM Institute"
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
          <div className="absolute inset-0 z-0 opacity-30">
             <img src="/stock/final-cta.png" className="w-full h-full object-cover mix-blend-luminosity" alt="" />
             <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-transparent to-[#050508]"></div>
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
                <span className="text-blue-700">Own Your</span><br />
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
