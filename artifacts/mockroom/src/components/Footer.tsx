import React from 'react';
import { Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="bg-[#050508] border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 pr-0 md:pr-12">
            <div className="flex items-center gap-3 mb-6">
              <Link href="/">
                <a className="flex items-center gap-3">
                  <img 
                    src={`${import.meta.env.BASE_URL}logo.webp`} 
                    alt="The Mock Room Logo" 
                    className="h-12 w-auto object-contain transition-all duration-500"
                  />
                  <span className="font-serif text-2xl font-semibold tracking-wide text-foreground">
                    The Mock Room
                  </span>
                </a>
              </Link>
            </div>
            <p className="text-muted-foreground text-lg max-w-sm mb-6 font-serif italic">
              "Breaking Traditional Molds, Building Futures"
            </p>
            <p className="text-sm text-muted-foreground/70">
              An AI-powered interview simulation platform dedicated to helping college graduates in Northeast India land their dream corporate jobs.
            </p>
          </div>

          <div>
            <h4 className="font-display tracking-widest text-xl mb-6 text-foreground">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/"><a className="text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wider">Home</a></Link>
              </li>
              <li>
                <Link href="/about"><a className="text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wider">About Us</a></Link>
              </li>
              <li>
                <Link href="/services"><a className="text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wider">Services</a></Link>
              </li>
              <li>
                <Link href="/testimonials"><a className="text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wider">Testimonials</a></Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display tracking-widest text-xl mb-6 text-foreground">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground text-sm">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>Guwahati, Assam<br />Northeast India</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>hello@themockroom.com</span>
              </li>
            </ul>
            
            <div className="mt-8">
              <a 
                href="https://www.linkedin.com/company/the-mock-room/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border hover:border-primary hover:text-primary transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/60">
            &copy; 2025 The Mock Room | Rolecraft Solutions LLP. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted-foreground/60 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-muted-foreground/60 hover:text-primary transition-colors">Terms & Conditions</a>
            <a href="#" className="text-xs text-muted-foreground/60 hover:text-primary transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
