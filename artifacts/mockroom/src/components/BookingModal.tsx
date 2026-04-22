import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTier?: string;
}

export function BookingModal({ isOpen, onClose, preselectedTier = '' }: BookingModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    company: '',
    tier: preselectedTier || 'Basic'
  });

  useEffect(() => {
    if (preselectedTier) {
      setFormData(prev => ({ ...prev, tier: preselectedTier }));
    }
  }, [preselectedTier]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
    }, 500);
  };

  const resetAndClose = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      company: '',
      tier: preselectedTier || 'Basic'
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-card border border-border p-6 sm:p-8 shadow-2xl rounded-lg overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={resetAndClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <CheckCircle2 className="w-16 h-16 text-primary mb-4" />
                </motion.div>
                <h2 className="text-3xl font-serif text-foreground">Session Claimed</h2>
                <p className="text-muted-foreground text-lg max-w-sm">
                  Thank you — our team will reach out within 24 hours to schedule your session.
                </p>
                <Button 
                  onClick={resetAndClose}
                  className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 px-8 rounded-full"
                >
                  Return to Site
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-serif mb-2">Claim Your Session</h2>
                  <p className="text-muted-foreground">Take the first step toward boardroom confidence.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-muted-foreground">Full Name</Label>
                      <Input 
                        id="name" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="bg-background/50 border-border focus:border-primary mt-1" 
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="text-muted-foreground">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          className="bg-background/50 border-border focus:border-primary mt-1" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-muted-foreground">Phone Number</Label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          required
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                          className="bg-background/50 border-border focus:border-primary mt-1" 
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="role" className="text-muted-foreground">Target Job Role</Label>
                      <Select 
                        value={formData.role} 
                        onValueChange={v => setFormData({...formData, role: v})}
                        required
                      >
                        <SelectTrigger className="bg-background/50 border-border focus:border-primary mt-1">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                          <SelectItem value="Data Analyst">Data Analyst</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="company" className="text-muted-foreground">Dream Company (Optional)</Label>
                      <Input 
                        id="company" 
                        value={formData.company}
                        onChange={e => setFormData({...formData, company: e.target.value})}
                        className="bg-background/50 border-border focus:border-primary mt-1" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="tier" className="text-muted-foreground">Session Type</Label>
                      <Select 
                        value={formData.tier} 
                        onValueChange={v => setFormData({...formData, tier: v})}
                        required
                      >
                        <SelectTrigger className="bg-background/50 border-border focus:border-primary mt-1">
                          <SelectValue placeholder="Select a tier" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="Basic">Basic — ₹249</SelectItem>
                          <SelectItem value="Advanced">Advanced — ₹499</SelectItem>
                          <SelectItem value="Monthly">Monthly Batch — ₹999</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12 text-lg font-medium"
                    >
                      Claim My Session
                    </Button>
                    <p className="text-center text-xs text-muted-foreground mt-4">
                      Our team will reach out within 24 hours to confirm your slot.
                    </p>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
