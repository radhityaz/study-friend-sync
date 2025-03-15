
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { NoteEditor } from '@/components/notes/NoteEditor';

const Notes = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-1">
          <div className="inline-flex items-center space-x-2">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
              Notes
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Your Notes</h1>
        </div>
        
        <div className="h-[calc(100vh-220px)]">
          <NoteEditor />
        </div>
      </div>
    </MainLayout>
  );
};

export default Notes;
