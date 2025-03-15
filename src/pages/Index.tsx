
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <MainLayout>
      <div className={isMobile ? "scale-[0.98] origin-top" : ""}>
        <Dashboard />
      </div>
    </MainLayout>
  );
};

export default Index;
