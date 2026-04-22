import React, { useState, lazy, Suspense } from 'react';
import { Router, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';

// Lazy load pages
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const Testimonials = lazy(() => import('./pages/Testimonials').then(m => ({ default: m.Testimonials })));
const NotFound = lazy(() => import('./pages/not-found'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const handleBookSession = (tier: string = '') => {
    const phoneNumber = "919198110414";
    const message = encodeURIComponent(`Hello! I'm interested in booking a ${tier ? tier + ' ' : ''}session with The Mock Room. Can you help me get started?`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/">
            <Home onBookSession={handleBookSession} />
          </Route>
          <Route path="/about">
            <About onBookSession={() => handleBookSession()} />
          </Route>
          <Route path="/services">
            <Services onBookSession={handleBookSession} />
          </Route>
          <Route path="/testimonials">
            <Testimonials onBookSession={() => handleBookSession()} />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Suspense>
      <Toaster />
    </div>
  );
}

export default App;
