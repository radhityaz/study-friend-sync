
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  AlertCircle, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  MoreVertical,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { GlassPanel } from '../common/GlassPanel';
import { motion } from 'framer-motion';

export interface Task {
  id: string | number;
  title: string;
  description?: string;
  dueDate?: string | Date;
  priority: 'low' | 'medium' | 'high';
  category: 'academic' | 'personal' | 'project';
  completed: boolean;
  estimatedTime?: number; // in minutes
  course?: string; // Course name
  courseType?: 'current' | 'completed'; // Course status
  currentGrade?: string; // Current grade
  expectedGrade?: string; // Expected/target grade
}

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string | number) => void;
  className?: string;
  style?: React.CSSProperties; // Added style prop
  animationDelay?: string;
}

export function TaskItem({ task, onToggleComplete, className, style, animationDelay }: TaskItemProps) {
  const formattedDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }) 
    : null;
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-amber-500 bg-amber-50';
      case 'low': return 'text-green-500 bg-green-50';
      default: return 'text-blue-500 bg-blue-50';
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'text-blue-500 bg-blue-50';
      case 'personal': return 'text-purple-500 bg-purple-50';
      case 'project': return 'text-emerald-500 bg-emerald-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getCourseStatusColor = (status?: string) => {
    switch (status) {
      case 'current': return 'text-indigo-500 bg-indigo-50';
      case 'completed': return 'text-teal-500 bg-teal-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: animationDelay ? parseFloat(animationDelay) : 0
      }}
      style={style}
    >
      <GlassPanel
        variant="card"
        className={cn(
          "p-4 transition-all",
          task.completed ? "opacity-70" : "opacity-100",
          className
        )}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggleComplete(task.id)}
            className={cn(
              "mt-0.5 flex-shrink-0 h-5 w-5 rounded-full border transition-colors",
              task.completed 
                ? "bg-primary border-primary/10 text-white" 
                : "border-gray-300 hover:border-primary/50"
            )}
          >
            {task.completed && (
              <CheckCircle2 size={20} className="text-white" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                getPriorityColor(task.priority)
              )}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
              
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                getCategoryColor(task.category)
              )}>
                {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
              </span>

              {task.course && (
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full font-medium",
                  "text-blue-600 bg-blue-50"
                )}>
                  <BookOpen size={10} className="inline mr-1" />
                  {task.course}
                </span>
              )}

              {task.courseType && (
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full font-medium",
                  getCourseStatusColor(task.courseType)
                )}>
                  {task.courseType === 'current' ? 'Current' : 'Completed'}
                </span>
              )}
            </div>
            
            <h3 className={cn(
              "text-base font-medium truncate",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 mt-2">
              {formattedDate && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar size={12} className="mr-1" />
                  <span>{formattedDate}</span>
                </div>
              )}
              
              {task.estimatedTime && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock size={12} className="mr-1" />
                  <span>{task.estimatedTime} min</span>
                </div>
              )}

              {(task.currentGrade || task.expectedGrade) && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <GraduationCap size={12} className="mr-1" />
                  <span>
                    {task.currentGrade && `Current: ${task.currentGrade}`}
                    {task.currentGrade && task.expectedGrade && ' → '}
                    {task.expectedGrade && `Target: ${task.expectedGrade}`}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <button className="p-1 rounded-md hover:bg-black/5 transition-colors">
            <MoreVertical size={16} className="text-muted-foreground" />
          </button>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
