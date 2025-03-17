
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { GlassPanel } from './GlassPanel';
import { Home, Clipboard, Timer, FileText, Calendar, Settings, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function NavItem({ to, icon, label, active }: NavItemProps) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        cn(
          'flex items-center p-3 rounded-lg transition-smooth',
          'text-muted-foreground hover:text-foreground',
          isActive ? 'text-primary bg-primary/5' : ''
        )
      }
    >
      <div className="relative mr-3">
        {icon}
        {active && (
          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
        )}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
}

export function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut, user } = useAuth();
  
  // Don't show navbar if user is not logged in
  if (!user) return null;
  
  const navItems = [
    { to: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/tasks', icon: <Clipboard size={20} />, label: 'Tasks' },
    { to: '/timer', icon: <Timer size={20} />, label: 'Timer' },
    { to: '/notes', icon: <FileText size={20} />, label: 'Notes' },
    { to: '/calendar', icon: <Calendar size={20} />, label: 'Calendar' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' }
  ];
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleSignOut = () => {
    signOut();
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4">
      <GlassPanel 
        intensity="high" 
        variant="panel" 
        className={cn(
          "flex flex-col px-1 py-1 rounded-3xl backdrop-blur-lg shadow-lg",
          isMenuOpen ? "w-64" : "w-16"
        )}
      >
        <button 
          onClick={toggleMenu} 
          className="p-3 rounded-full self-center text-primary hover:bg-primary/10 transition-smooth"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {isMenuOpen ? (
          <div className="flex flex-col space-y-1 mt-2 px-2">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.to}
              />
            ))}
            
            <button 
              onClick={handleSignOut}
              className="flex items-center p-3 rounded-lg transition-smooth text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <div className="relative mr-3">
                <LogOut size={20} />
              </div>
              <span className="text-sm font-medium">Keluar</span>
            </button>
          </div>
        ) : null}
      </GlassPanel>
    </div>
  );
}
