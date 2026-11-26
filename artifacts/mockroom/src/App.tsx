import React, { useState, lazy, Suspense } from 'react';
import { Router, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load pages
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const Testimonials = lazy(() => import('./pages/Testimonials').then(m => ({ default: m.Testimonials })));
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard').then(m => ({ default: m.StudentDashboard })));
const MentorDashboard = lazy(() => import('./pages/mentor/MentorDashboard').then(m => ({ default: m.MentorDashboard })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const NotFound = lazy(() => import('./pages/not-found'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const handleBookSession = (tier: string = '') => {
    const phoneNumber = "917085809332";
    const message = encodeURIComponent(`Hello! I'm interested in booking a ${tier ? tier + ' ' : ''}session with The Mock Room. Can you help me get started?`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ErrorBoundary>
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

          {/* Portal Authentication Routes */}
          <Route path="/login/student">
            <LoginPage role="student" />
          </Route>
          <Route path="/login/mentor">
            <LoginPage role="mentor" />
          </Route>

          {/* Unlisted Super Admin Login & Panel */}
          <Route path="/portal-admin-x7k2/login">
            <LoginPage role="superadmin" />
          </Route>
          <Route path="/portal-admin-x7k2">
            <ProtectedRoute allowedRoles={['superadmin']}>
              <AdminDashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/portal-admin-x7k2/">
            <ProtectedRoute allowedRoles={['superadmin']}>
              <AdminDashboard />
            </ProtectedRoute>
          </Route>

          {/* Authenticated Dashboard Routes */}
          <Route path="/student/dashboard">
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/student/dashboard/">
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/mentor/dashboard">
            <ProtectedRoute allowedRoles={['superadmin', 'mentor']}>
              <MentorDashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/mentor/dashboard/">
            <ProtectedRoute allowedRoles={['superadmin', 'mentor']}>
              <MentorDashboard />
            </ProtectedRoute>
          </Route>

          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Suspense>
      </ErrorBoundary>
      <Toaster />
    </div>
  );
}

export default App;
