import { create } from 'zustand';

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

interface AiState {
  conversations: Conversation[];
  activeConversationId: string | null;
  typing: boolean;
  createConversation: (title: string) => string;
  setActiveConversationId: (id: string | null) => void;
  deleteConversation: (id: string) => void;
  sendMessage: (text: string) => Promise<void>;
}

const initialConversations: Conversation[] = [
  {
    id: 'c-1',
    title: 'Goal Mapping Consultation',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    messages: [
      { id: 'm-1', sender: 'assistant', text: "Hello! I am your LifeOS AI coach. I see you want to complete a half marathon. Let me help you break down the milestone checkpoints and recommend a workout intensity. What is your current running distance capacity?", timestamp: new Date(Date.now() - 86400000).toISOString() },
      { id: 'm-2', sender: 'user', text: "I can comfortably run about 5 kilometers without getting extremely exhausted.", timestamp: new Date(Date.now() - 86400000 + 60000).toISOString() },
      { id: 'm-3', sender: 'assistant', text: "Excellent foundation! Running 5K is the perfect starting point. I recommend a 12-week incremental build. We'll increase your weekend long runs by 1.5K each week while focusing on high-nutrition calorie loads.", timestamp: new Date(Date.now() - 86400000 + 120000).toISOString() }
    ]
  },
  {
    id: 'c-2',
    title: 'Daily Productivity Audit',
    createdAt: new Date().toISOString(),
    messages: [
      { id: 'm-4', sender: 'assistant', text: "Welcome back! Today you completed 1 task and maintained your streaks. How would you rate your concentration level during your Cardio session?", timestamp: new Date().toISOString() }
    ]
  }
];

export const useAiStore = create<AiState>((set, get) => ({
  conversations: initialConversations,
  activeConversationId: 'c-1',
  typing: false,

  createConversation: (title) => {
    const newId = 'c-' + Math.random().toString(36).substr(2, 9);
    set((state) => ({
      conversations: [
        {
          id: newId,
          title,
          messages: [
            {
              id: 'm-init',
              sender: 'assistant',
              text: `Hello! I'm here as your AI Coach. How can I help you with your ${title.toLowerCase()} goals today?`,
              timestamp: new Date().toISOString()
            }
          ],
          createdAt: new Date().toISOString()
        },
        ...state.conversations
      ],
      activeConversationId: newId
    }));
    return newId;
  },

  setActiveConversationId: (id) => set({ activeConversationId: id }),

  deleteConversation: (id) => set((state) => {
    const updated = state.conversations.filter((c) => c.id !== id);
    return {
      conversations: updated,
      activeConversationId: state.activeConversationId === id
        ? (updated.length > 0 ? updated[0].id : null)
        : state.activeConversationId
    };
  }),

  sendMessage: async (text) => {
    const activeId = get().activeConversationId;
    if (!activeId) return;

    const userMessage: Message = {
      id: 'm-' + Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    // Add user message immediately
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === activeId ? { ...c, messages: [...c.messages, userMessage] } : c
      ),
      typing: true
    }));

    // Generate Mock AI Response
    await new Promise((resolve) => setTimeout(resolve, 1800));

    let responseText = "That sounds like an excellent strategy! Let me analyze your patterns and update your productivity logs.";
    const textLower = text.toLowerCase();
    
    if (textLower.includes('marathon') || textLower.includes('run')) {
      responseText = "🏃 Cardio pacing is key. I've scheduled your next 8K target for Saturday morning when your weather parameters are optimal. Make sure to hydrate!";
    } else if (textLower.includes('task') || textLower.includes('todo')) {
      responseText = "⚡ I can help optimize your Kanban Board. If tasks are feeling overwhelming, I recommend breaking down the largest item into 3 atomic milestones.";
    } else if (textLower.includes('habit') || textLower.includes('streak')) {
      responseText = "🔥 Consistency triggers dopamine. By checking off habits early, you build psychological momentum. Keep the streak alive!";
    } else if (textLower.includes('study') || textLower.includes('learn')) {
      responseText = "🧠 A focused 25-minute Pomodoro study block is recommended. I've logged a new learning session in your learning hub.";
    }

    const assistantMessage: Message = {
      id: 'm-' + Math.random().toString(36).substr(2, 9),
      sender: 'assistant',
      text: responseText,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === activeId ? { ...c, messages: [...c.messages, assistantMessage] } : c
      ),
      typing: false
    }));
  }
}));
