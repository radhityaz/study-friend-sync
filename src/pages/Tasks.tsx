
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { useIsMobile } from '@/hooks/use-mobile';

const Tasks = () => {
  const isMobile = useIsMobile();
  
  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col space-y-1">
          <div className="inline-flex items-center space-x-2">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
              Tasks
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Your Tasks</h1>
        </div>
        
        <TaskList />
      </div>
    </MainLayout>
  );
};

export default Tasks;
