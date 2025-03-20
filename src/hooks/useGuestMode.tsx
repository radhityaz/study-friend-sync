
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type GuestModeContextType = {
  isGuestMode: boolean;
  enableGuestMode: () => void;
  disableGuestMode: () => void;
};

const GuestModeContext = createContext<GuestModeContextType | undefined>(undefined);

export function GuestModeProvider({ children }: { children: ReactNode }) {
  // Check if guest mode is enabled in localStorage on initial load
  const [isGuestMode, setIsGuestMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem('guest-mode');
      return storedValue === 'true';
    }
    return false;
  });

  // Update localStorage when guest mode changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('guest-mode', isGuestMode ? 'true' : 'false');
    }
  }, [isGuestMode]);

  const enableGuestMode = () => setIsGuestMode(true);
  const disableGuestMode = () => setIsGuestMode(false);

  return (
    <GuestModeContext.Provider value={{ isGuestMode, enableGuestMode, disableGuestMode }}>
      {children}
    </GuestModeContext.Provider>
  );
}

export function useGuestMode() {
  const context = useContext(GuestModeContext);
  if (context === undefined) {
    throw new Error('useGuestMode must be used within a GuestModeProvider');
  }
  return context;
}
