import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'completed';
  category: string;
  dueDate: string;
  isRecurring: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly';
  createdAt: string;
}

interface TaskState {
  tasks: Task[];
  aiSuggestions: string[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: Task['status']) => void;
  generateAiSuggestions: () => void;
}

const initialTasks: Task[] = [
  {
    id: 't-1',
    title: 'Design LifeOS Dashboard Wireframe',
    description: 'Sketch out the initial UI and navigation flow for the main workspace dashboard.',
    priority: 'high',
    status: 'in_progress',
    category: 'Work',
    dueDate: new Date().toISOString().split('T')[0],
    isRecurring: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-2',
    title: 'Complete 30-min Cardio Session',
    description: 'Morning treadmill run to stay consistent with fitness goals.',
    priority: 'medium',
    status: 'completed',
    category: 'Health',
    dueDate: new Date().toISOString().split('T')[0],
    isRecurring: true,
    recurringInterval: 'daily',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-3',
    title: 'Read Chapter 4 of TypeScript Deep Dive',
    description: 'Learn about advanced type mapping and generic constraints.',
    priority: 'low',
    status: 'todo',
    category: 'Learning',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
    isRecurring: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-4',
    title: 'Review Weekly Financial Budget',
    description: 'Verify card transactions and allocate funds to investment wallets.',
    priority: 'medium',
    status: 'todo',
    category: 'Personal',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // in 2 days
    isRecurring: true,
    recurringInterval: 'weekly',
    createdAt: new Date().toISOString(),
  }
];

const mockAiSuggestions = [
  "⚡ High Workload Alert: You have 3 high-priority tasks due tomorrow. AI recommends delegating or postponing 'Review Weekly Financial Budget' to balance your capacity.",
  "🎯 Focus Boost: Your habit 'Cardio Session' is completed! Start your 'Design LifeOS Dashboard' task right now while your energy level is peak.",
  "📅 Schedule Optimization: Move 'Read Chapter 4 of TypeScript Deep Dive' to your afternoon slot (3 PM - 4 PM) as your analytics show highest learning absorption then."
];

export const useTaskStore = create<TaskState>((set) => ({
  tasks: initialTasks,
  aiSuggestions: mockAiSuggestions,

  addTask: (taskData) => set((state) => {
    const newTask: Task = {
      ...taskData,
      id: 't-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    return { tasks: [...state.tasks, newTask] };
  }),

  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((task) => task.id === id ? { ...task, ...updates } : task)
  })),

  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id)
  })),

  moveTask: (id, newStatus) => set((state) => ({
    tasks: state.tasks.map((task) => task.id === id ? { ...task, status: newStatus } : task)
  })),

  generateAiSuggestions: () => set((state) => {
    const todoCount = state.tasks.filter(t => t.status === 'todo').length;
    const progressCount = state.tasks.filter(t => t.status === 'in_progress').length;
    
    let dynamicSuggestions = [...mockAiSuggestions];
    if (todoCount > 5) {
      dynamicSuggestions.unshift(`⚠️ Overdue Risk: You have ${todoCount} items in Todo. Use 'Quick Prioritize' to auto-schedule standard items.`);
    }
    if (progressCount === 0) {
      dynamicSuggestions.push("💡 Progress Starter: You have no tasks in progress. Select a high priority work item to begin your session.");
    }
    return { aiSuggestions: dynamicSuggestions.slice(0, 3) };
  }),
}));
