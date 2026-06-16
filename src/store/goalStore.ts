import { create } from 'zustand';

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'Career' | 'Health' | 'Wealth' | 'Personal';
  timeline: 'short_term' | 'long_term';
  progress: number; // calculated based on milestones or manual
  dueDate: string;
  milestones: Milestone[];
  aiActionPlanGenerated: boolean;
}

interface GoalState {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'progress' | 'aiActionPlanGenerated'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  generateAiActionPlan: (goalId: string) => Promise<void>;
}

const initialGoals: Goal[] = [
  {
    id: 'g-1',
    title: 'Run a Half Marathon',
    description: 'Build cardiovascular endurance to comfortably complete a 21.1 km race.',
    category: 'Health',
    timeline: 'short_term',
    progress: 50,
    dueDate: '2026-09-30',
    aiActionPlanGenerated: true,
    milestones: [
      { id: 'm-1-1', title: 'Complete a continuous 5K run', completed: true },
      { id: 'm-1-2', title: 'Complete a continuous 10K run', completed: true },
      { id: 'm-1-3', title: 'Complete a 15K training session', completed: false },
      { id: 'm-1-4', title: 'Perform a full 21K simulated practice run', completed: false }
    ],
  },
  {
    id: 'g-2',
    title: 'Launch SaaS Startup',
    description: 'Design, code, build, market, and deploy an MVP for LifeOS AI to production.',
    category: 'Career',
    timeline: 'long_term',
    progress: 25,
    dueDate: '2026-12-31',
    aiActionPlanGenerated: false,
    milestones: [
      { id: 'm-2-1', title: 'Finish Figma Mockups & Design Tokens', completed: true },
      { id: 'm-2-2', title: 'Build Frontend in React & Zustand', completed: false },
      { id: 'm-2-3', title: 'Deploy Backend Server & Databases', completed: false },
      { id: 'm-2-4', title: 'Onboard 100 beta testers for feedback', completed: false }
    ],
  }
];

export const useGoalStore = create<GoalState>((set) => ({
  goals: initialGoals,

  addGoal: (goalData) => set((state) => {
    const newGoal: Goal = {
      ...goalData,
      id: 'g-' + Math.random().toString(36).substr(2, 9),
      progress: 0,
      aiActionPlanGenerated: false,
    };
    return { goals: [...state.goals, newGoal] };
  }),

  updateGoal: (id, updates) => set((state) => ({
    goals: state.goals.map((goal) => {
      if (goal.id !== id) return goal;
      const merged = { ...goal, ...updates };
      // recalculate progress if milestones were updated
      if (updates.milestones) {
        const completedCount = merged.milestones.filter((m) => m.completed).length;
        merged.progress = merged.milestones.length > 0 
          ? Math.round((completedCount / merged.milestones.length) * 100)
          : 0;
      }
      return merged;
    })
  })),

  deleteGoal: (id) => set((state) => ({
    goals: state.goals.filter((goal) => goal.id !== id)
  })),

  toggleMilestone: (goalId, milestoneId) => set((state) => ({
    goals: state.goals.map((goal) => {
      if (goal.id !== goalId) return goal;
      const updatedMilestones = goal.milestones.map((m) =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      );
      const completedCount = updatedMilestones.filter((m) => m.completed).length;
      const progress = updatedMilestones.length > 0
        ? Math.round((completedCount / updatedMilestones.length) * 100)
        : 0;
      return {
        ...goal,
        milestones: updatedMilestones,
        progress,
      };
    })
  })),

  generateAiActionPlan: async (goalId) => {
    // Simulate AI generation API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    set((state) => ({
      goals: state.goals.map((goal) => {
        if (goal.id !== goalId) return goal;
        
        // Generate rich, context-aware milestones
        const aiMilestones: Milestone[] = [
          { id: 'm-ai-1', title: '🛡️ PHASE 1: Build Core Competencies & Foundations', completed: false },
          { id: 'm-ai-2', title: '⚡ PHASE 2: Create Sprint Checkpoints & Beta Testing', completed: false },
          { id: 'm-ai-3', title: '📈 PHASE 3: Launch Marketing Pipeline & Scaling Strategy', completed: false },
          { id: 'm-ai-4', title: '🌌 PHASE 4: Establish Post-Launch Audit & Feedback Integration', completed: false }
        ];

        return {
          ...goal,
          milestones: [...goal.milestones, ...aiMilestones],
          aiActionPlanGenerated: true,
          progress: Math.round((goal.milestones.filter(m => m.completed).length / (goal.milestones.length + 4)) * 100)
        };
      })
    }));
  }
}));
