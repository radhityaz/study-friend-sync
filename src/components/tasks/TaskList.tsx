
import React from 'react';
import { AnimatedCard } from '../common/AnimatedCard';
import { Task, TaskItem } from './TaskItem';
import { PlusCircle, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TaskForm } from './TaskForm';
import { useToast } from '@/components/ui/use-toast';

// Mock data
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete Calculus Assignment',
    description: 'Problems 15-30 from Chapter 4',
    dueDate: '2024-05-15',
    priority: 'high',
    category: 'academic',
    completed: false,
    estimatedTime: 120
  },
  {
    id: '2',
    title: 'Read Physics Textbook',
    description: 'Chapters 7-8 on Electromagnetism',
    dueDate: '2024-05-16',
    priority: 'medium',
    category: 'academic',
    completed: false,
    estimatedTime: 90
  },
  {
    id: '3',
    title: 'Prepare for Programming Exam',
    description: 'Focus on algorithms and data structures',
    dueDate: '2024-05-20',
    priority: 'high',
    category: 'academic',
    completed: false,
    estimatedTime: 180
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
    title: 'Schedule Study Group Meeting',
    priority: 'low',
    category: 'personal',
    completed: false,
    dueDate: '2024-05-14'
  }
];

export default function TaskList() {
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks);
  const [filter, setFilter] = React.useState<'all' | 'pending' | 'completed'>('all');
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
  
  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'pending') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    })
    .filter(task => 
      search ? 
        task.title.toLowerCase().includes(search.toLowerCase()) || 
        (task.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
      : true
    );
  
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
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'completed')}
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <TaskForm onSubmit={handleAddTask} onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
