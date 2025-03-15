
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PomodoroTimer } from '@/components/timer/PomodoroTimer';
import { useIsMobile } from '@/hooks/use-mobile';

const Timer = () => {
  const isMobile = useIsMobile();
  
  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col space-y-1">
          <div className="inline-flex items-center space-x-2">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
              Focus
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Pomodoro Timer</h1>
        </div>
        
        <PomodoroTimer />
      </div>
    </MainLayout>
  );
};

export default Timer;
