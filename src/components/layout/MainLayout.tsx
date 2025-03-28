
import React, { useEffect } from 'react';
import { Navbar } from '../common/Navbar';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Logo } from '../common/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useGuestMode } from '@/hooks/useGuestMode';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { isGuestMode } = useGuestMode();
  
  // Set cookie for guest mode
  useEffect(() => {
    if (isGuestMode) {
      document.cookie = 'guest-mode=true; path=/; max-age=86400'; // 24 hours
    } else {
      document.cookie = 'guest-mode=false; path=/; max-age=0'; // Delete cookie
    }
  }, [isGuestMode]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="relative max-w-7xl mx-auto">
        <div className="fixed top-0 left-0 w-full h-16 md:h-24 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "min-h-screen pt-6 md:pt-8 pb-20 md:pb-24 px-3 sm:px-4 md:px-6",
              className
            )}
          >
            <div className="mb-6 flex justify-between items-center">
              <Logo size="lg" />
              
              {user ? (
                <div className="text-sm text-muted-foreground">
                  <span>Masuk sebagai: </span>
                  <span className="font-medium">{user.email}</span>
                </div>
              ) : isGuestMode ? (
                <div className="text-sm px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                  Mode Tamu
                </div>
              ) : null}
            </div>
            
            {children}
            
            {/* Credits Footer */}
            <div className="mt-12 pb-4 text-center text-xs text-muted-foreground">
              <p>Dibuat oleh</p>
              <p>Radhitya Guntoro Adhi</p>
              <p>-</p>
              <p>Teknik Industri 2023 ITB</p>
            </div>
          </motion.main>
        </AnimatePresence>
        
        <Navbar />
      </div>
    </div>
  );
}
