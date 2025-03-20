
import React from 'react';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { GlassPanel } from './GlassPanel';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export function LoadingSpinner({
  fullScreen = false,
  size = 'md',
  message = 'Loading...',
  className
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  const spinnerContent = (
    <div className={cn(
      "flex flex-col items-center justify-center gap-4",
      fullScreen ? "min-h-screen" : "",
      className
    )}>
      <Loader2 className={cn(
        "animate-spin text-primary",
        {
          'w-8 h-8': size === 'sm',
          'w-12 h-12': size === 'md',
          'w-16 h-16': size === 'lg',
        }
      )} />
      
      {message && (
        <div className="text-center text-muted-foreground">
          {message}
        </div>
      )}
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <GlassPanel variant="panel" intensity="high" className="rounded-lg p-8">
          {spinnerContent}
        </GlassPanel>
      </div>
    );
  }
  
  return spinnerContent;
}
