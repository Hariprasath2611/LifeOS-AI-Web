import React from 'react';
import { Bell, Flame, CheckCircle, Target, Sparkles, X } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { useHabitStore } from '../store/habitStore';
import { useGoalStore } from '../store/goalStore';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const tasks = useTaskStore((s) => s.tasks);
  const habits = useHabitStore((s) => s.habits);
  const goals = useGoalStore((s) => s.goals);

  if (!isOpen) return null;

  // Generate notifications based on actual state data dynamically
  const notifications = [
    {
      id: 'n-ai-coach',
      type: 'ai',
      title: 'AI Coaching Suggestion',
      message: 'You complete tasks 25% faster when scheduled between 9 AM and 11 AM. Check tasks suggestions.',
      time: 'Just now',
    },
    ...habits.filter(h => h.streak > 4).map(h => ({
      id: `n-habit-${h.id}`,
      type: 'habit',
      title: 'Habit Flame Hot!',
      message: `You are on a ${h.streak}-day streak for "${h.name}". Keep it up today!`,
      time: '1h ago',
    })),
    ...tasks.filter(t => t.status === 'in_progress').map(t => ({
      id: `n-task-${t.id}`,
      type: 'task',
      title: 'Task in Progress',
      message: `Remember to wrap up "${t.title}" scheduled for today.`,
      time: '2h ago',
    })),
    ...goals.filter(g => g.progress > 0 && g.progress < 100).slice(0, 1).map(g => ({
      id: `n-goal-${g.id}`,
      type: 'goal',
      title: 'Goal Milestone Near',
      message: `You have completed ${g.progress}% of your goal "${g.title}". Check your milestones.`,
      time: '4h ago',
    }))
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'ai': return <Sparkles className="w-4 h-4 text-[#00FF88]" />;
      case 'habit': return <Flame className="w-4 h-4 text-orange-500" />;
      case 'task': return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case 'goal': return <Target className="w-4 h-4 text-purple-400" />;
      default: return <Bell className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#111111] border border-[#1E1E1E] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-3 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E1E1E] bg-black/40">
        <div className="flex items-center gap-2 font-semibold text-white">
          <Bell className="w-4 h-4 text-[#00FF88]" />
          <span>Notifications</span>
          <span className="text-xs bg-[#00C853] text-black px-1.5 py-0.5 rounded-full font-bold">
            {notifications.length}
          </span>
        </div>
        <button 
          onClick={onClose}
          className="text-[#A0A0A0] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* List */}
      <div className="max-h-[350px] overflow-y-auto divide-y divide-[#1E1E1E]">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div key={n.id} className="p-4 hover:bg-[#1E1E1E]/50 transition-colors flex gap-3">
              <div className="mt-0.5 p-1.5 rounded-lg bg-black/50 border border-[#1E1E1E] self-start">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-white">{n.title}</span>
                  <span className="text-[10px] text-[#A0A0A0]">{n.time}</span>
                </div>
                <p className="text-xs text-[#A0A0A0] leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-[#A0A0A0] text-sm">
            All caught up! No new alerts.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 text-center border-t border-[#1E1E1E] bg-black/20">
        <button 
          onClick={onClose}
          className="text-xs text-[#00FF88] hover:underline transition-all font-semibold"
        >
          Mark all as read
        </button>
      </div>
    </div>
  );
};
