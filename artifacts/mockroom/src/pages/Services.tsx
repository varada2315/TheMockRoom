import React from 'react';
import { motion, Variants } from 'framer-motion';
import { CheckCircle2, TrendingUp, Target, Shield, Zap, Mail, MapPin } from 'lucide-react';
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
                  title: "AI Diagnostic",
                  desc: "5-level adaptive assessment tailored to your target company (e.g., Product Engineer at Google or Analyst at TCS).",
                  image: "/stock/ai-viz.png"
                },
                {
                  step: "02",
                  title: "Gap Analysis",
                  desc: "Instant AI report identifying your structural behavioral and technical gaps before the human mentor steps in.",
                  image: "/stock/simulation.png"
                },
                {
                  step: "03",
                  title: "Human Mentorship",
                  desc: "Live intensive sessions led by industry experts who use your AI data to surgically fix your performance.",
                  image: "/stock/mission.png"
                }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2, duration: 0.6 }}
                  className="relative z-10 flex flex-col bg-card/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 transition-all duration-500 overflow-hidden group"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-80"></div>
                    <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20 flex items-center justify-center">
                      <span className="font-display text-lg text-primary">{item.step}</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="font-display text-2xl uppercase tracking-wider mb-4 text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-muted-foreground font-light leading-relaxed text-sm">{item.desc}</p>
                  </div>
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
                { title: "Pan-India Perspective", desc: "We bridge the gap for candidates from all over India, catering to the specific cultural and educational nuances of the national job market." },
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
                    { title: "Strategic Negotiation", desc: "Learn how to articulate your value and handle complex professional conversations.", icon: <TrendingUp className="w-5 h-5 text-primary" /> },
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
      </main>
      <Footer />
    </>
  );
}
