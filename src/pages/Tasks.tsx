
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import TaskList from '@/components/tasks/TaskList';

const Tasks = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Tasks</h1>
        <TaskList />
      </div>
    </MainLayout>
  );
};

export default Tasks;
