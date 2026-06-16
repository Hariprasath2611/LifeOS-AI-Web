import { create } from 'zustand';

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
  progress: number;
}

export interface RoadmapStep {
  id: string;
  label: string;
  completed: boolean;
}

export interface ProjectSuggestion {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  steps: RoadmapStep[];
  projects: ProjectSuggestion[];
}

interface LearningState {
  skills: Skill[];
  roadmaps: Roadmap[];
  pomodoroMinutes: number;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkillProgress: (id: string, progress: number) => void;
  toggleRoadmapStep: (roadmapId: string, stepId: string) => void;
  logStudySession: (minutes: number) => void;
  generateAiRoadmap: (topic: string) => Promise<void>;
}

const initialSkills: Skill[] = [
  { id: 's-1', name: 'React Architecture', category: 'Frontend', level: 'Intermediate', progress: 75 },
  { id: 's-2', name: 'TypeScript Constraints', category: 'Frontend', level: 'Beginner', progress: 40 },
  { id: 's-3', name: 'System Design Patterns', category: 'Backend', level: 'Beginner', progress: 20 },
  { id: 's-4', name: 'Neural Networks 101', category: 'AI/ML', level: 'Beginner', progress: 10 }
];

const initialRoadmaps: Roadmap[] = [
  {
    id: 'r-1',
    title: 'Fullstack AI Developer',
    description: 'Master AI modeling API calls, frontend interfaces, vector databases and state orchestration.',
    steps: [
      { id: 'rs-1-1', label: 'Advanced TypeScript Generics', completed: true },
      { id: 'rs-1-2', label: 'Zustand Global State Stores', completed: true },
      { id: 'rs-1-3', label: 'Vector Database (Pinecone/Chroma)', completed: false },
      { id: 'rs-1-4', label: 'Large Language Models Integrations', completed: false }
    ],
    projects: [
      { id: 'rp-1-1', title: 'LifeOS Smart Dashboard', difficulty: 'Medium', description: 'Create a glassmorphic dashboard tracking user schedules.' },
      { id: 'rp-1-2', title: 'Doc Summarizer Chatbot', difficulty: 'Hard', description: 'Upload papers and run vector embeddings query.' }
    ]
  }
];

export const useLearningStore = create<LearningState>((set) => ({
  skills: initialSkills,
  roadmaps: initialRoadmaps,
  pomodoroMinutes: 120, // logged minutes

  addSkill: (skillData) => set((state) => ({
    skills: [...state.skills, { ...skillData, id: 's-' + Math.random().toString(36).substr(2, 9) }]
  })),

  updateSkillProgress: (id, progress) => set((state) => ({
    skills: state.skills.map((s) => s.id === id ? { ...s, progress } : s)
  })),

  toggleRoadmapStep: (roadmapId, stepId) => set((state) => ({
    roadmaps: state.roadmaps.map((r) => {
      if (r.id !== roadmapId) return r;
      return {
        ...r,
        steps: r.steps.map((step) =>
          step.id === stepId ? { ...step, completed: !step.completed } : step
        )
      };
    })
  })),

  logStudySession: (minutes) => set((state) => ({
    pomodoroMinutes: state.pomodoroMinutes + minutes
  })),

  generateAiRoadmap: async (topic) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set((state) => {
      const newRoadmap: Roadmap = {
        id: 'r-' + Math.random().toString(36).substr(2, 9),
        title: `AI Personalized: ${topic}`,
        description: `Custom-tailored learning checklist designed by LifeOS AI to learn ${topic} from scratch.`,
        steps: [
          { id: 'rs-ai-1', label: '📚 Foundations & Core Syntax', completed: false },
          { id: 'rs-ai-2', label: '🛠️ Mid-tier Mini-Projects building', completed: false },
          { id: 'rs-ai-3', label: '⚡ Performance Audits & Styling', completed: false },
          { id: 'rs-ai-4', label: '🚀 Deployment & Cloud Hosting setup', completed: false }
        ],
        projects: [
          { id: 'rp-ai-1', title: `${topic} MVP Application`, difficulty: 'Medium', description: 'A functional app utilizing features learned in Phase 2.' }
        ]
      };
      return {
        roadmaps: [...state.roadmaps, newRoadmap]
      };
    });
  }
}));
