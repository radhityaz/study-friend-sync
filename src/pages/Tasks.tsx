
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import TaskList from '@/components/tasks/TaskList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedCard } from '@/components/common/AnimatedCard';
import { BookOpen, GraduationCap, Clock } from 'lucide-react';

const Tasks = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Tasks & Courses</h1>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="courses">Current Courses</TabsTrigger>
            <TabsTrigger value="completed">Completed Courses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <TaskList filter="all" />
          </TabsContent>
          
          <TabsContent value="courses">
            <TaskList filter="current" />
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BookOpen className="mr-2" size={20} />
                Study Schedule Recommendations
              </h2>
              <AnimatedCard animation="fade" className="p-5">
                <p className="text-muted-foreground mb-4">
                  Based on your course load and grade targets, here's a recommended study schedule:
                </p>
                
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-700">Daily Study Pattern</h3>
                    <p className="text-sm mt-1">
                      Prioritize courses with larger grade gaps (current vs. target) and higher credit values.
                      Focus on difficult subjects during your peak productivity hours.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-indigo-50 rounded-lg">
                      <h3 className="font-medium text-indigo-700">Study Time Distribution</h3>
                      <p className="text-sm mt-1">
                        For each course, allocate study time proportional to:
                        <br/>- Course difficulty
                        <br/>- Grade improvement needed
                        <br/>- Credit value
                      </p>
                    </div>
                    
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h3 className="font-medium text-purple-700">Weekly Review Schedule</h3>
                      <p className="text-sm mt-1">
                        Schedule regular review sessions for each course.
                        Use spaced repetition for better retention.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Add more courses and set grade targets to receive personalized study recommendations
                  </p>
                </div>
              </AnimatedCard>
            </div>
          </TabsContent>
          
          <TabsContent value="completed">
            <TaskList filter="completed" />
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <GraduationCap className="mr-2" size={20} />
                Academic Progress
              </h2>
              <AnimatedCard animation="fade" className="p-5">
                <p className="text-muted-foreground mb-4">
                  Summary of your completed courses and academic performance:
                </p>
                
                <div className="p-4 bg-green-50 rounded-lg mb-4">
                  <h3 className="font-medium text-green-700">Performance Overview</h3>
                  <p className="text-sm mt-1">
                    Track your completed courses and grades here. Add more completed courses to see a comprehensive analysis.
                  </p>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Add your completed courses to track your academic progress and GPA
                  </p>
                </div>
              </AnimatedCard>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Tasks;
