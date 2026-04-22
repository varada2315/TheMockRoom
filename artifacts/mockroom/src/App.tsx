import React, { useState } from 'react';
import { Home } from './pages/Home';
import { BookingModal } from './components/BookingModal';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('');

  const openModal = (tier: string = '') => {
    setSelectedTier(tier);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTier('');
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark noise-bg">
      <Home onBookSession={openModal} />
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        preselectedTier={selectedTier} 
      />
      <Toaster />
    </div>
  );
}

export default App;
