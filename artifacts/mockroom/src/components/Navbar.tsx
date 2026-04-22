import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';

interface NavbarProps {
  onBookSession: () => void;
}

export function Navbar({ onBookSession }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Testimonials', href: '/testimonials' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header 
      className="fixed top-0 left-0 w-full z-40 bg-background border-b border-border/50 py-4 shadow-sm"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-3 group">
              <img 
                src={`${import.meta.env.BASE_URL}logo.png`} 
                alt="The Mock Room Logo" 
                className="h-8 md:h-10 w-auto object-contain"
              />
            </a>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href}>
                  <a className={`text-sm font-medium transition-colors uppercase tracking-wider ${
                    location === link.href ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                  }`}>
                    {link.name}
                  </a>
                </Link>
              ))}
            </div>
            <Button 
              onClick={onBookSession}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 font-semibold tracking-wide"
            >
              Book a Session
            </Button>
          </nav>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-foreground p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <motion.div 
        initial={false}
        animate={mobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-card border-b border-border"
      >
        <div className="px-4 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              <a 
                onClick={closeMobileMenu}
                className={`text-left text-lg font-medium transition-colors ${
                  location === link.href ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {link.name}
              </a>
            </Link>
          ))}
          <Button 
            onClick={() => {
              onBookSession();
              closeMobileMenu();
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-full mt-4 font-semibold"
          >
            Book a Session
          </Button>
        </div>
      </motion.div>
    </header>
  );
}
