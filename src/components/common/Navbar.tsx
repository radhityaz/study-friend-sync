
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  CalendarDaysIcon, 
  BookOpenIcon, 
  ClipboardIcon, 
  TimerIcon, 
  Settings2Icon,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { useGuestMode } from '@/hooks/useGuestMode';
import { Button } from '@/components/ui/button';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { toast } from '@/components/ui/use-toast';

export function Navbar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  const { isGuestMode, disableGuestMode } = useGuestMode();
  
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
  
  // Don't show navbar if user is not logged in and not in guest mode
  if (!user && !isGuestMode) return null;
  
  const handleSignOut = async () => {
    if (isGuestMode) {
      disableGuestMode();
      toast({
        title: "Keluar dari mode tamu",
        description: "Anda telah keluar dari mode tamu",
      });
    } else {
      await signOut();
    }
  };
  
  // Burger menu untuk semua ukuran layar
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-full items-center justify-between">
          {/* Menampilkan hanya ikon Beranda di bagian kiri */}
          <Link
            to="/"
            className={cn(
              "flex flex-col items-center justify-center h-full px-4",
              "text-muted-foreground hover:text-foreground transition-colors",
              isActive('/') && "text-primary"
            )}
          >
            <HomeIcon className={cn(
              "h-6 w-6",
              isActive('/') ? "text-primary" : "text-muted-foreground"
            )} />
            <span className={cn(
              "text-xs mt-1",
              isActive('/') ? "text-primary" : "text-primary/80"
            )}>
              Beranda
            </span>
          </Link>
          
          {/* Space filler untuk tengah */}
          <div className="flex-1"></div>
          
          {/* Burger menu untuk semua item */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center h-full px-4 text-muted-foreground hover:text-foreground">
                <Menu className="h-6 w-6" />
                <span className="text-xs mt-1">Menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px]">
              <SheetHeader className="mb-6">
                <SheetTitle>Menu Navigasi</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center p-3 rounded-md",
                        isActive(item.path) 
                          ? "bg-primary/10 text-primary" 
                          : "text-foreground hover:bg-accent"
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  </SheetClose>
                ))}
                
                <div className="h-px bg-border my-4" />
                
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {isGuestMode ? (
                    "Mode Tamu Aktif"
                  ) : (
                    <>Masuk sebagai: {user?.email}</>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  className="mt-2 w-full justify-start"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isGuestMode ? "Keluar dari Mode Tamu" : "Logout"}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
