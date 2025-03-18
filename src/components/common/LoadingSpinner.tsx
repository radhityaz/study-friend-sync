
import React from 'react';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { GlassPanel } from './GlassPanel';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export function LoadingSpinner({
  fullScreen = false,
  size = 'md',
  message,
  className
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  const spinnerContent = (
    <div className={cn(
      "flex items-center justify-center",
      fullScreen ? "min-h-screen" : "p-4",
      className
    )}>
      <div className="relative">
        <Logo size={size} className="opacity-70" withText={false} />
        <div className={cn(
          "absolute top-0 left-0 right-0 bottom-0 rounded-full border-t-2 border-primary animate-spin",
          sizeClasses[size]
        )} />
      </div>
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <GlassPanel variant="panel" intensity="high" className="rounded-full p-2">
          {spinnerContent}
        </GlassPanel>
      </div>
    );
  }
  
  return spinnerContent;
}
