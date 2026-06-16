import { create } from 'zustand';

export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly';
  category: 'Health' | 'Mindset' | 'Finance' | 'Productive';
  streak: number;
  history: string[]; // dates checked, e.g. "2026-06-16"
  createdAt: string;
}

interface HabitState {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'history' | 'createdAt'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitDate: (id: string, dateStr: string) => void;
  getHabitConsistency: (id: string) => number; // percentage
}

// Generate last 7 days of dates for initial history mock
const getPastDateStr = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

const initialHabits: Habit[] = [
  {
    id: 'h-1',
    name: '10 Minute Meditation',
    description: 'Calm the mind, focus on breathing and mindfulness practice.',
    frequency: 'daily',
    category: 'Mindset',
    streak: 5,
    history: [getPastDateStr(0), getPastDateStr(1), getPastDateStr(2), getPastDateStr(3), getPastDateStr(4)],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'h-2',
    name: 'Hydrate (3L Water)',
    description: 'Drink water throughout the day to keep brain power and body clean.',
    frequency: 'daily',
    category: 'Health',
    streak: 3,
    history: [getPastDateStr(0), getPastDateStr(1), getPastDateStr(2), getPastDateStr(4)],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'h-3',
    name: 'Write Daily Code Commit',
    description: 'Work on personal projects or open source contributions.',
    frequency: 'daily',
    category: 'Productive',
    streak: 12,
    history: Array.from({ length: 12 }, (_, i) => getPastDateStr(i)),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'h-4',
    name: 'Review Investment Portfolios',
    description: 'Weekly check on assets allocation and expenses tracking.',
    frequency: 'weekly',
    category: 'Finance',
    streak: 2,
    history: [getPastDateStr(1), getPastDateStr(8)],
    createdAt: new Date().toISOString(),
  }
];

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: initialHabits,

  addHabit: (habitData) => set((state) => {
    const newHabit: Habit = {
      ...habitData,
      id: 'h-' + Math.random().toString(36).substr(2, 9),
      streak: 0,
      history: [],
      createdAt: new Date().toISOString(),
    };
    return { habits: [...state.habits, newHabit] };
  }),

  updateHabit: (id, updates) => set((state) => ({
    habits: state.habits.map((habit) => habit.id === id ? { ...habit, ...updates } : habit)
  })),

  deleteHabit: (id) => set((state) => ({
    habits: state.habits.filter((habit) => habit.id !== id)
  })),

  toggleHabitDate: (id, dateStr) => set((state) => ({
    habits: state.habits.map((habit) => {
      if (habit.id !== id) return habit;
      
      const exists = habit.history.includes(dateStr);
      const updatedHistory = exists
        ? habit.history.filter((d) => d !== dateStr)
        : [...habit.history, dateStr];

      // Calculate streak dynamically
      let currentStreak = 0;
      let checkDate = new Date();
      
      // Look backward from today to check streaks
      for (let i = 0; i < 365; i++) {
        const checkStr = checkDate.toISOString().split('T')[0];
        if (updatedHistory.includes(checkStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          // If we miss today, the streak might still be active if yesterday was checked
          if (i === 0) {
            checkDate.setDate(checkDate.getDate() - 1);
            const yesterdayStr = checkDate.toISOString().split('T')[0];
            if (updatedHistory.includes(yesterdayStr)) {
              continue; // keep going, streak is still alive
            }
          }
          break;
        }
      }

      return {
        ...habit,
        history: updatedHistory,
        streak: currentStreak,
      };
    })
  })),

  getHabitConsistency: (id) => {
    const habit = get().habits.find((h) => h.id === id);
    if (!habit) return 0;
    
    // consistency based on active days vs total days in last 30 days
    const totalDaysToCheck = 30;
    let checkedCount = 0;
    
    for (let i = 0; i < totalDaysToCheck; i++) {
      const dateStr = getPastDateStr(i);
      if (habit.history.includes(dateStr)) {
        checkedCount++;
      }
    }
    
    return Math.round((checkedCount / totalDaysToCheck) * 100);
  }
}));
