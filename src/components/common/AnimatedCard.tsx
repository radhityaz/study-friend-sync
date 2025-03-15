
import React from 'react';
import { cn } from '@/lib/utils';
import { GlassPanel } from './GlassPanel';

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation?: 'fade' | 'scale' | 'slide-up' | 'slide-down' | 'none';
  delay?: number;
  duration?: number;
  className?: string;
  variant?: 'default' | 'card' | 'panel' | 'dark';
  intensity?: 'low' | 'medium' | 'high';
}

export function AnimatedCard({
  children,
  animation = 'fade',
  delay = 0,
  duration = 300,
  className,
  variant = 'card',
  intensity = 'medium',
  ...props
}: AnimatedCardProps) {
  
  const [isVisible, setIsVisible] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  const getAnimationClass = () => {
    if (!isVisible) return 'opacity-0';
    switch (animation) {
      case 'fade': return 'animate-fade-in';
      case 'scale': return 'animate-scale-in';
      case 'slide-up': return 'animate-slide-up';
      case 'slide-down': return 'animate-slide-down';
      case 'none': return 'opacity-100';
      default: return 'animate-fade-in';
    }
  };
  
  return (
    <GlassPanel
      variant={variant}
      intensity={intensity}
      className={cn(
        getAnimationClass(),
        `duration-${duration}`,
        className
      )}
      style={{ 
        animationDuration: `${duration}ms`,
        animationFillMode: 'forwards'
      }}
      {...props}
    >
      {children}
    </GlassPanel>
  );
}
