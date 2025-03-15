
import React from 'react';
import { AnimatedCard } from '../common/AnimatedCard';
import { GlassPanel } from '../common/GlassPanel';
import { 
  Calendar, 
  Check, 
  Clock, 
  Target, 
  TrendingUp,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// For demo purposes, we'll use mock data
const studyData = [
  { name: 'Mon', hours: 2.5 },
  { name: 'Tue', hours: 3.2 },
  { name: 'Wed', hours: 1.8 },
  { name: 'Thu', hours: 4.0 },
  { name: 'Fri', hours: 2.7 },
  { name: 'Sat', hours: 1.5 },
  { name: 'Sun', hours: 0.8 },
];

const pieData = [
  { name: 'Mathematics', value: 35, color: '#3b82f6' },
  { name: 'Physics', value: 25, color: '#10b981' },
  { name: 'Computer Science', value: 30, color: '#f97316' },
  { name: 'Languages', value: 10, color: '#8b5cf6' },
];

const upcomingTasks = [
  { id: 1, title: 'Complete Math Assignment', dueDate: '2024-05-15', priority: 'high' },
  { id: 2, title: 'Physics Lab Report', dueDate: '2024-05-17', priority: 'medium' },
  { id: 3, title: 'Study for CS Exam', dueDate: '2024-05-20', priority: 'high' },
];

export function Dashboard() {
  const [period, setPeriod] = React.useState('week');
  
  const totalStudyHours = studyData.reduce((sum, day) => sum + day.hours, 0);
  const averageHours = totalStudyHours / studyData.length;
  const targetHours = 25; // Weekly target
  const progressPercentage = Math.round((totalStudyHours / targetHours) * 100);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-1">
        <div className="inline-flex items-center space-x-2">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
            Dashboard
          </span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Study Overview</h1>
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="glass text-sm px-3 py-1.5 rounded-lg border-0 ring-0 focus:ring-2 focus:ring-primary/30"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="semester">This Semester</option>
          </select>
        </div>
      </div>
      
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedCard 
          animation="fade" 
          delay={0} 
          className="p-4 flex flex-col"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Total Hours</span>
            <Clock size={18} className="text-blue-500" />
          </div>
          <div className="mt-auto">
            <span className="text-2xl font-bold">{totalStudyHours.toFixed(1)}h</span>
            <div className="text-xs text-muted-foreground mt-1">
              {period === 'week' ? 'This week' : period === 'day' ? 'Today' : period === 'month' ? 'This month' : 'This semester'}
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard 
          animation="fade" 
          delay={100} 
          className="p-4 flex flex-col"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Daily Average</span>
            <TrendingUp size={18} className="text-green-500" />
          </div>
          <div className="mt-auto">
            <span className="text-2xl font-bold">{averageHours.toFixed(1)}h</span>
            <div className="text-xs text-muted-foreground mt-1">
              per day
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard 
          animation="fade" 
          delay={200} 
          className="p-4 flex flex-col"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Target Progress</span>
            <Target size={18} className="text-orange-500" />
          </div>
          <div className="mt-auto">
            <span className="text-2xl font-bold">{progressPercentage}%</span>
            <div className="text-xs text-muted-foreground mt-1">
              {totalStudyHours.toFixed(1)}h / {targetHours}h target
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard 
          animation="fade" 
          delay={300} 
          className="p-4 flex flex-col"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Completed Tasks</span>
            <Check size={18} className="text-purple-500" />
          </div>
          <div className="mt-auto">
            <span className="text-2xl font-bold">12</span>
            <div className="text-xs text-muted-foreground mt-1">
              this week
            </div>
          </div>
        </AnimatedCard>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnimatedCard 
          animation="slide-up" 
          delay={400} 
          className="lg:col-span-2 p-5 flex flex-col space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Study Hours</h3>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={studyData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  width={30}
                  tickFormatter={(value) => `${value}h`}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                  }}
                  formatter={(value) => [`${value} hours`, 'Study Time']}
                />
                <Area 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorHours)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>
        
        <AnimatedCard 
          animation="slide-up" 
          delay={500} 
          className="p-5 flex flex-col space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Subject Distribution</h3>
          </div>
          
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                  }}
                  formatter={(value) => [`${value}%`, 'Portion']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {pieData.map((subject) => (
              <div key={subject.name} className="flex items-center text-xs">
                <div 
                  className="h-3 w-3 rounded-full mr-2" 
                  style={{ backgroundColor: subject.color }}
                />
                <span className="truncate">{subject.name}</span>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>
      
      {/* Upcoming tasks and suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedCard
          animation="slide-up" 
          delay={600}
          className="p-5 flex flex-col space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Upcoming Tasks</h3>
            <span className="text-xs text-primary">View All</span>
          </div>
          
          <div className="space-y-2">
            {upcomingTasks.map((task) => (
              <div 
                key={task.id} 
                className="flex items-center p-2 rounded-lg hover:bg-black/5 transition-smooth"
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  task.priority === 'high' ? 'bg-red-100' : 
                  task.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                } mr-3`}>
                  <AlertCircle 
                    size={16} 
                    className={`${
                      task.priority === 'high' ? 'text-red-500' : 
                      task.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                    }`} 
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium leading-tight">{task.title}</h4>
                  <p className="text-xs text-muted-foreground">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>
        
        <AnimatedCard
          animation="slide-up" 
          delay={700}
          className="p-5 flex flex-col space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Study Suggestions</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center p-2 rounded-lg hover:bg-black/5 transition-smooth">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <BookOpen size={16} className="text-blue-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium leading-tight">Focus on Mathematics</h4>
                <p className="text-xs text-muted-foreground">Based on your upcoming exam schedule</p>
              </div>
            </div>
            
            <div className="flex items-center p-2 rounded-lg hover:bg-black/5 transition-smooth">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <Clock size={16} className="text-green-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium leading-tight">Try a 1-hour Pomodoro session</h4>
                <p className="text-xs text-muted-foreground">Your focus is best in the morning</p>
              </div>
            </div>
            
            <div className="flex items-center p-2 rounded-lg hover:bg-black/5 transition-smooth">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <Calendar size={16} className="text-purple-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium leading-tight">Schedule review for Physics</h4>
                <p className="text-xs text-muted-foreground">Optimal time for review is approaching</p>
              </div>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}
