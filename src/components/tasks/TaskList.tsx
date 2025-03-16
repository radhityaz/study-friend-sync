import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TaskItem from "./TaskItem";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// Mock data type
interface Task {
  id: string | number;
  text: string;
  completed: boolean;
  category?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
}

const sortOptions = [
  { value: "dueDate", label: "Due Date" },
  { value: "priority", label: "Priority" },
  { value: "category", label: "Category" },
];

const filterOptions = [
  { value: "all", label: "All Tasks" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
];

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Learn React", completed: false, category: "Learning", priority: "high", dueDate: "2024-07-15" },
    { id: 2, text: "Build a todo app", completed: true, category: "Personal", priority: "medium", dueDate: "2024-07-20" },
    { id: 3, text: "Grocery shopping", completed: false, category: "Chores", priority: "low", dueDate: "2024-07-22" },
  ]);
  const [newTask, setNewTask] = useState("");
  const [sortCriteria, setSortCriteria] = useState<string>("");
  const [filterCriteria, setFilterCriteria] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    // Load tasks from local storage on component mount
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    // Save tasks to local storage whenever tasks change
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      const newTaskItem: Task = {
        id: Date.now(),
        text: newTask,
        completed: false,
      };
      setTasks([...tasks, newTaskItem]);
      setNewTask("");
    }
  };

  const handleToggleComplete = (id: string | number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string | number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortCriteria === "dueDate") {
      return (
        new Date(a.dueDate || "2099-12-31").getTime() -
        new Date(b.dueDate || "2099-12-31").getTime()
      );
    }
    if (sortCriteria === "priority") {
      const priorityValues = { high: 3, medium: 2, low: 1 };
      const priorityA = priorityValues[a.priority || "low"] || 0;
      const priorityB = priorityValues[b.priority || "low"] || 0;
      return priorityB - priorityA;
    }
    if (sortCriteria === "category") {
      return (a.category || "").localeCompare(b.category || "");
    }
    return 0;
  });

  const filteredTasks = sortedTasks.filter((task) => {
    if (filterCriteria === "completed") {
      return task.completed;
    }
    if (filterCriteria === "pending") {
      return !task.completed;
    }
    return true;
  }).filter(task => {
    if (categoryFilter === "all") {
      return true;
    }
    return task.category === categoryFilter;
  });

  const filteredAndSortedTasks = filteredTasks;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Task Management</h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Label htmlFor="task-input" className="mb-2 block">
              Add New Task
            </Label>
            <div className="flex gap-2">
              <Input
                id="task-input"
                placeholder="Enter a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddTask}>Add</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="sort" className="mb-2 block">
              Sort By
            </Label>
            <Select value={sortCriteria} onValueChange={setSortCriteria}>
              <SelectTrigger id="sort">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="filter" className="mb-2 block">
              Filter
            </Label>
            <Select value={filterCriteria} onValueChange={setFilterCriteria}>
              <SelectTrigger id="filter">
                <SelectValue placeholder="Filter..." />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category" className="mb-2 block">
              Category
            </Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger id="category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Array.from(new Set(tasks.map((task) => task.category))).map(
                  (category) =>
                    category && (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {filteredAndSortedTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
            >
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                className="w-full"
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredAndSortedTasks.length === 0 && (
          <div className="text-center p-8 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
