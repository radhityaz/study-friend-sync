
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'card' | 'panel' | 'dark';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

const intensityClasses = {
  low: 'backdrop-blur-xs bg-white/30 dark:bg-black/20',
  medium: 'backdrop-blur-md bg-white/60 dark:bg-black/30',
  high: 'backdrop-blur-lg bg-white/80 dark:bg-black/40'
};

const variantClasses = {
  default: 'border border-white/20 dark:border-white/10 shadow-glass-sm',
  card: 'border border-white/30 dark:border-white/10 shadow-glass-sm hover:shadow-glass transition-all',
  panel: 'border border-white/40 dark:border-white/10 shadow-glass',
  dark: 'bg-black/30 backdrop-blur-lg border border-white/10 shadow-glass'
};

export function GlassPanel({
  children,
  variant = 'default',
  intensity = 'medium',
  className,
  ...props
}: GlassPanelProps) {
  return (
    <div 
      className={cn(
        'rounded-lg',
        intensityClasses[intensity],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
