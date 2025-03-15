
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { GlassPanel } from './GlassPanel';
import { Home, Clipboard, Timer, FileText, Calendar, Settings } from 'lucide-react';

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
          'flex flex-col items-center justify-center p-3 rounded-lg transition-smooth',
          'text-muted-foreground hover:text-foreground',
          isActive ? 'text-primary bg-primary/5' : ''
        )
      }
    >
      <div className="relative mb-1">
        {icon}
        {active && (
          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
        )}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </NavLink>
  );
}

export function Navbar() {
  const location = useLocation();
  
  const navItems = [
    { to: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/tasks', icon: <Clipboard size={20} />, label: 'Tasks' },
    { to: '/timer', icon: <Timer size={20} />, label: 'Timer' },
    { to: '/notes', icon: <FileText size={20} />, label: 'Notes' },
    { to: '/calendar', icon: <Calendar size={20} />, label: 'Calendar' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4">
      <GlassPanel 
        intensity="high" 
        variant="panel" 
        className="flex items-center space-x-1 px-1 py-1 rounded-full"
      >
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.to}
          />
        ))}
      </GlassPanel>
    </div>
  );
}
