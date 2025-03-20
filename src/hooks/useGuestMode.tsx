
import React, { createContext, useContext, useState, ReactNode } from 'react';

type GuestModeContextType = {
  isGuestMode: boolean;
  enableGuestMode: () => void;
  disableGuestMode: () => void;
};

const GuestModeContext = createContext<GuestModeContextType | undefined>(undefined);

export function GuestModeProvider({ children }: { children: ReactNode }) {
  const [isGuestMode, setIsGuestMode] = useState(false);

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
