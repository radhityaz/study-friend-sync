
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AnimatedCard } from '@/components/common/AnimatedCard';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-100/30"></div>);
    }
    
    // Mock events data
    const events = [
      { day: 5, title: 'Math Assignment Due', time: '11:59 PM', type: 'deadline' },
      { day: 8, title: 'Physics Study Group', time: '3:00 PM', type: 'meeting' },
      { day: 12, title: 'Programming Exam', time: '10:00 AM', type: 'exam' },
      { day: 15, title: 'Research Project Meeting', time: '2:30 PM', type: 'meeting' },
      { day: 18, title: 'Literature Review Due', time: '11:59 PM', type: 'deadline' },
      { day: 22, title: 'Chemistry Lab', time: '9:00 AM', type: 'lab' },
      { day: 25, title: 'Study Plan Review', time: '4:00 PM', type: 'meeting' },
    ];
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = 
        new Date().getDate() === day && 
        new Date().getMonth() === month && 
        new Date().getFullYear() === year;
      
      const dayEvents = events.filter(event => event.day === day);
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={`h-24 border border-gray-100/30 p-1 transition-colors ${
            isToday ? 'bg-primary/5 border-primary/30' : 'hover:bg-black/5'
          }`}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-medium inline-flex items-center justify-center h-6 w-6 rounded-full ${
              isToday ? 'bg-primary text-white' : ''
            }`}>
              {day}
            </span>
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.map((event, index) => (
              <div 
                key={index}
                className={`text-xs px-1.5 py-0.5 rounded truncate ${
                  event.type === 'deadline' ? 'bg-amber-100 text-amber-800' :
                  event.type === 'exam' ? 'bg-red-100 text-red-800' :
                  event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                  event.type === 'lab' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return days;
  };
  
  const prevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };
  
  const nextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };
  
  const formatMonth = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };
  
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-1">
          <div className="inline-flex items-center space-x-2">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
              Schedule
            </span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
            <div className="flex items-center space-x-2">
              <button 
                onClick={prevMonth}
                className="p-2 rounded-lg glass border border-white/30 text-gray-700 hover:text-gray-900 transition-smooth" 
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium px-2">{formatMonth(currentDate)}</span>
              <button 
                onClick={nextMonth}
                className="p-2 rounded-lg glass border border-white/30 text-gray-700 hover:text-gray-900 transition-smooth" 
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
        
        <AnimatedCard 
          animation="fade" 
          className="overflow-hidden"
        >
          <div className="grid grid-cols-7 gap-0">
            {weekdays.map(day => (
              <div key={day} className="p-2 text-center border-b border-gray-200 font-medium text-sm">
                {day}
              </div>
            ))}
            {renderCalendarDays()}
          </div>
        </AnimatedCard>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedCard 
            animation="slide-up" 
            delay={200}
            className="p-5 flex flex-col space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Upcoming Events</h3>
            </div>
            
            <div className="space-y-3">
              {[
                { title: 'Physics Study Group', time: '3:00 PM', date: 'May 8', location: 'Science Building, Room 302' },
                { title: 'Programming Exam', time: '10:00 AM', date: 'May 12', location: 'Computer Lab' },
                { title: 'Research Project Meeting', time: '2:30 PM', date: 'May 15', location: 'Library, Study Room 5' }
              ].map((event, index) => (
                <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-black/5 transition-smooth">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <CalendarIcon size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{event.title}</h4>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <Clock size={12} className="mr-1" />
                      <span>{event.time}, {event.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCard>
          
          <AnimatedCard 
            animation="slide-up" 
            delay={300}
            className="p-5 flex flex-col space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Schedule Insights</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 text-blue-900 rounded-lg">
                <h4 className="text-sm font-medium">Busy Week Ahead</h4>
                <p className="text-xs mt-1">You have 3 major deadlines and 2 exams next week. Consider adjusting your study schedule.</p>
              </div>
              
              <div className="p-3 bg-green-50 text-green-900 rounded-lg">
                <h4 className="text-sm font-medium">Free Time Opportunity</h4>
                <p className="text-xs mt-1">You have 2-hour gaps between classes on Tuesday and Thursday. Great for focused study sessions.</p>
              </div>
              
              <div className="p-3 bg-purple-50 text-purple-900 rounded-lg">
                <h4 className="text-sm font-medium">Study Group Suggestion</h4>
                <p className="text-xs mt-1">3 of your friends are also studying for the Programming Exam on May 12. Consider organizing a group session.</p>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </MainLayout>
  );
};

export default Calendar;
