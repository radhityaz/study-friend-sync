
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { StudyScheduleSetup } from '@/components/study-schedule/StudyScheduleSetup';
import { StudyScheduleView } from '@/components/study-schedule/StudyScheduleView';
import { StudyScheduleSettings } from '@/components/study-schedule/StudyScheduleSettings';
import { BookOpen, Settings, Calendar } from 'lucide-react';

const StudySchedule = () => {
  const [activeTab, setActiveTab] = useState('setup');

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Jadwal Belajar Mandiri</h1>
        <p className="text-muted-foreground mb-6">
          Buat jadwal belajar yang dipersonalisasi berdasarkan kebutuhan dan preferensi Anda
        </p>
        
        <Tabs defaultValue="setup" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="setup" className="flex items-center justify-center">
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Setup Mata Kuliah</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center justify-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Lihat Jadwal</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center justify-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Pengaturan</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup">
            <StudyScheduleSetup />
          </TabsContent>
          
          <TabsContent value="schedule">
            <StudyScheduleView />
          </TabsContent>
          
          <TabsContent value="settings">
            <StudyScheduleSettings />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default StudySchedule;
