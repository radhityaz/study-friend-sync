
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, CalendarDaysIcon, BookOpenIcon, ClipboardIcon, TimerIcon, Settings2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    {
      name: 'Beranda',
      path: '/',
      icon: HomeIcon,
    },
    {
      name: 'Kalender',
      path: '/calendar',
      icon: CalendarDaysIcon,
    },
    {
      name: 'Jadwal Belajar',
      path: '/study-schedule',
      icon: BookOpenIcon,
    },
    {
      name: 'Tugas',
      path: '/tasks',
      icon: ClipboardIcon,
    },
    {
      name: 'Timer',
      path: '/timer',
      icon: TimerIcon,
    },
    {
      name: 'Pengaturan',
      path: '/settings',
      icon: Settings2Icon,
    },
  ];
  
  // Don't show navbar if user is not logged in
  if (!user) return null;
  
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-full items-center justify-between">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full",
                "text-muted-foreground hover:text-foreground transition-colors",
                isActive(item.path) && "text-primary"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 md:h-6 md:w-6",
                isActive(item.path) ? "text-primary" : "text-muted-foreground"
              )} />
              {!isMobile && (
                <span className={cn(
                  "text-xs mt-1",
                  isActive(item.path) ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.name}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
