
import React from 'react';
import { AnimatedCard } from '../common/AnimatedCard';
import { Task, TaskItem } from './TaskItem';
import { PlusCircle, Search, BookOpen, GraduationCap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TaskForm } from './TaskForm';
import { useToast } from '@/components/ui/use-toast';

// Mock data with course information
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete Calculus Assignment',
    description: 'Problems 15-30 from Chapter 4',
    dueDate: '2024-05-15',
    priority: 'high',
    category: 'academic',
    completed: false,
    estimatedTime: 120,
    course: 'Calculus II',
    courseType: 'current',
    currentGrade: 'B+',
    expectedGrade: 'A-'
  },
  {
    id: '2',
    title: 'Read Physics Textbook',
    description: 'Chapters 7-8 on Electromagnetism',
    dueDate: '2024-05-16',
    priority: 'medium',
    category: 'academic',
    completed: false,
    estimatedTime: 90,
    course: 'Physics I',
    courseType: 'current',
    currentGrade: 'B',
    expectedGrade: 'A'
  },
  {
    id: '3',
    title: 'Prepare for Programming Exam',
    description: 'Focus on algorithms and data structures',
    dueDate: '2024-05-20',
    priority: 'high',
    category: 'academic',
    completed: false,
    estimatedTime: 180,
    course: 'Data Structures',
    courseType: 'current',
    currentGrade: 'A-',
    expectedGrade: 'A'
  },
  {
    id: '4',
    title: 'Complete Research Project Outline',
    description: 'Define scope, methodology, and timeline',
    dueDate: '2024-05-18',
    priority: 'medium',
    category: 'project',
    completed: true,
    estimatedTime: 60
  },
  {
    id: '5',
    title: 'Finalize Linear Algebra Notes',
    description: 'Organize notes from the whole semester',
    priority: 'medium',
    category: 'academic',
    completed: true,
    dueDate: '2024-04-20',
    course: 'Linear Algebra',
    courseType: 'completed',
    currentGrade: 'A',
    expectedGrade: 'A'
  },
  {
    id: '6',
    title: 'Review Statistics Final Exam',
    description: 'Check all answers and document mistakes',
    priority: 'low',
    category: 'academic',
    completed: true,
    dueDate: '2024-04-10',
    course: 'Statistics',
    courseType: 'completed',
    currentGrade: 'B+',
    expectedGrade: 'B+'
  }
];

interface TaskListProps {
  filter?: 'all' | 'current' | 'completed';
}

export default function TaskList({ filter = 'all' }: TaskListProps) {
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks);
  const [taskFilter, setTaskFilter] = React.useState<'all' | 'pending' | 'completed'>('all');
  const [search, setSearch] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { toast } = useToast();
  
  const handleToggleComplete = (id: string | number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const handleAddTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: String(Date.now()), // Generate a simple id
    };
    
    setTasks([newTask, ...tasks]);
    setDialogOpen(false);
    toast({
      title: "Task created",
      description: "Your new task has been added successfully.",
    });
  };
  
  // Filter tasks based on course type
  const courseFilteredTasks = tasks.filter(task => {
    if (filter === 'current') return task.courseType === 'current';
    if (filter === 'completed') return task.courseType === 'completed';
    return true;
  });
  
  // Further filter based on completion status and search term
  const filteredTasks = courseFilteredTasks
    .filter(task => {
      if (taskFilter === 'pending') return !task.completed;
      if (taskFilter === 'completed') return task.completed;
      return true;
    })
    .filter(task => 
      search ? 
        task.title.toLowerCase().includes(search.toLowerCase()) || 
        (task.description?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        (task.course?.toLowerCase().includes(search.toLowerCase()) ?? false)
      : true
    );
  
  // Get unique courses for the current filter
  const courses = Array.from(new Set(courseFilteredTasks
    .filter(task => task.course)
    .map(task => task.course)
  )).filter(Boolean) as string[];
  
  return (
    <div className="space-y-6">
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full glass border-0 pl-9 py-2 focus:ring-2 focus:ring-primary/30 rounded-lg"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value as 'all' | 'pending' | 'completed')}
            className="glass border-0 py-2 focus:ring-2 focus:ring-primary/30 rounded-lg"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          
          <button 
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-1 text-white bg-primary px-3 py-2 rounded-lg hover:bg-primary/90 transition-smooth"
          >
            <PlusCircle size={16} />
            <span className="text-sm font-medium">New Task</span>
          </button>
        </div>
      </div>
      
      {/* Course summary cards when in course view */}
      {(filter === 'current' || filter === 'completed') && courses.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            {filter === 'current' ? (
              <>
                <BookOpen size={18} className="mr-2 text-blue-600" />
                Current Courses
              </>
            ) : (
              <>
                <GraduationCap size={18} className="mr-2 text-green-600" />
                Completed Courses
              </>
            )}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => {
              const courseTasks = tasks.filter(task => 
                task.course === course && 
                (filter === 'all' || (filter === 'current' && task.courseType === 'current') || 
                (filter === 'completed' && task.courseType === 'completed'))
              );
              
              const courseTask = courseTasks[0]; // Get the first task to extract course info
              
              if (!courseTask) return null;
              
              return (
                <AnimatedCard 
                  key={course} 
                  animation="fade"
                  className="p-4 h-full flex flex-col"
                >
                  <h3 className="font-medium text-lg mb-1">{course}</h3>
                  
                  {courseTask.currentGrade && courseTask.expectedGrade && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm">
                        Grade: <span className="font-medium">{courseTask.currentGrade}</span>
                        {" → "}
                        <span className="font-medium">{courseTask.expectedGrade}</span>
                      </span>
                    </div>
                  )}
                  
                  <div className="text-sm text-muted-foreground">
                    <span className="block">
                      {courseTasks.filter(t => !t.completed).length} pending tasks
                    </span>
                    <span className="block">
                      {courseTasks.filter(t => t.completed).length} completed tasks
                    </span>
                  </div>
                  
                  {filter === 'current' && courseTask.currentGrade && courseTask.expectedGrade && (
                    <div className="mt-3 text-xs">
                      <h4 className="font-medium text-sm mb-1">Study Recommendation</h4>
                      <p className="text-muted-foreground">
                        {courseTask.currentGrade !== courseTask.expectedGrade
                          ? `Focus on this course to improve from ${courseTask.currentGrade} to ${courseTask.expectedGrade}. Schedule regular study sessions.`
                          : "You're on track to meet your target grade."}
                      </p>
                    </div>
                  )}
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Task list */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <AnimatedCard animation="fade" className="p-8 flex flex-col items-center justify-center text-center">
            <div className="text-muted-foreground mb-2">
              {search ? 'No matching tasks found' : 'No tasks available'}
            </div>
            <p className="text-sm text-muted-foreground">
              {search 
                ? 'Try adjusting your search or filters' 
                : 'Click "New Task" to create your first task'}
            </p>
          </AnimatedCard>
        ) : (
          filteredTasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            />
          ))
        )}
      </div>

      {/* Create task dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <TaskForm onSubmit={handleAddTask} onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
