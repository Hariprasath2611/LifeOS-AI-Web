import React, { useState } from 'react';
import { 
  Flame, Plus, Calendar, Activity, Sparkles, Check, 
  Trash2, X, BarChart2, CheckCircle2 
} from 'lucide-react';
import { useHabitStore, Habit } from '../store/habitStore';
import { GlassCard } from '../components/GlassCard';

export const Habits: React.FC = () => {
  const { habits, addHabit, deleteHabit, toggleHabitDate, getHabitConsistency } = useHabitStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [aiAnalysisOpen, setAiAnalysisOpen] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [category, setCategory] = useState<Habit['category']>('Productive');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addHabit({
      name,
      description,
      frequency,
      category,
    });

    setName('');
    setDescription('');
    setModalOpen(false);
  };

  const handleToggleToday = (habitId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    toggleHabitDate(habitId, todayStr);
  };

  // Generate last 28 days for the mock calendar heatmap
  const getHeatmapDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };

  const heatmapDays = getHeatmapDays();

  const getCategoryColor = (cat: Habit['category']) => {
    switch (cat) {
      case 'Productive': return 'text-[#00FF88]';
      case 'Health': return 'text-[#00C853]';
      case 'Mindset': return 'text-purple-400';
      case 'Finance': return 'text-amber-400';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Title Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Habit & Streak Trackers</h2>
          <p className="text-xs text-[#A0A0A0]">Install regular routines and maintain continuous consistency streaks.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-neon-gradient text-black font-bold px-4 py-2 rounded-xl text-sm transition-all w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Habit</span>
        </button>
      </div>

      {/* AI HABIT SUGGESTIONS & ANALYSIS */}
      {aiAnalysisOpen && (
        <div className="p-5 rounded-2xl border-2 border-[#00FF88]/20 bg-[#00FF88]/5 space-y-3 relative">
          <button 
            onClick={() => setAiAnalysisOpen(false)}
            className="absolute top-4 right-4 text-[#A0A0A0] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00FF88] animate-pulse" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Habit Consistency Audit</h3>
          </div>
          <p className="text-xs text-[#A0A0A0] leading-relaxed max-w-4xl">
            🤖 [Habit Coach]: Your daily code commits habit has achieved a <span className="text-[#00FF88] font-bold">12-day streak</span>! However, your 'Hydrate (3L Water)' has minor drops on Wednesdays. Consider configuring a custom hydration calendar reminder at 2 PM to maintain streak levels.
          </p>
        </div>
      )}

      {/* LIST OF HABITS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {habits.map((habit) => {
          const todayStr = new Date().toISOString().split('T')[0];
          const isCompletedToday = habit.history.includes(todayStr);
          const consistency = getHabitConsistency(habit.id);

          return (
            <GlassCard key={habit.id} className="space-y-6">
              {/* Info & Streak */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${getCategoryColor(habit.category)}`}>
                      {habit.category}
                    </span>
                    <span className="text-[10px] text-[#A0A0A0] bg-[#1E1E1E] px-2 py-0.5 rounded-full font-medium">
                      {habit.frequency}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{habit.name}</h3>
                  <p className="text-xs text-[#A0A0A0] leading-relaxed">{habit.description}</p>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="text-2xl font-extrabold text-white flex items-center gap-1">
                    🔥 {habit.streak}
                  </span>
                  <span className="text-[9px] text-[#A0A0A0] font-bold uppercase">Day Streak</span>
                </div>
              </div>

              {/* Weekly Tracker & Heatmap */}
              <div className="space-y-4 border-t border-[#1E1E1E]/50 pt-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#A0A0A0] font-semibold flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-[#00FF88]" />
                    30-day consistency:
                  </span>
                  <span className="text-[#00FF88] font-bold">{consistency}%</span>
                </div>

                {/* Heatmap Grid */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[#A0A0A0] block font-semibold">Activity Heatmap (Last 4 Weeks)</span>
                  <div className="flex flex-wrap gap-1.5">
                    {heatmapDays.map((date) => {
                      const checked = habit.history.includes(date);
                      return (
                        <div
                          key={date}
                          className={`w-4 h-4 rounded-sm border transition-colors ${
                            checked
                              ? 'bg-[#00FF88] border-[#00FF88] shadow-[0_0_8px_rgba(0,255,136,0.3)]'
                              : 'bg-black border-[#1E1E1E]'
                          }`}
                          title={`Date: ${date} ${checked ? '(Checked)' : '(Unchecked)'}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between border-t border-[#1E1E1E]/40 pt-4 mt-2">
                <button
                  onClick={() => handleToggleToday(habit.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isCompletedToday
                      ? 'bg-[#00FF88]/10 border border-[#00FF88]/40 text-[#00FF88]'
                      : 'bg-neon-gradient text-black hover:shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{isCompletedToday ? 'Completed Today' : 'Mark as Completed'}</span>
                </button>

                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="p-2 border border-[#1E1E1E] text-[#A0A0A0] hover:text-[#FF5252] hover:bg-[#FF5252]/10 rounded-lg transition-colors"
                  title="Delete Habit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* CREATE HABIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#111111] border border-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#1E1E1E] bg-black/40">
              <h3 className="font-bold text-white">Create Habit Tracker</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#A0A0A0] hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#A0A0A0] uppercase">Habit Name</label>
                <input
                  type="text"
                  placeholder="e.g. Read 15 pages / Write morning journal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black border border-[#1E1E1E] rounded-xl px-3.5 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#A0A0A0] uppercase">Description</label>
                <textarea
                  placeholder="What trigger triggers this habit?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black border border-[#1E1E1E] rounded-xl px-3.5 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none transition-colors h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#A0A0A0] uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Habit['category'])}
                    className="w-full bg-black border border-[#1E1E1E] rounded-xl px-3.5 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none"
                  >
                    <option value="Productive">Productive</option>
                    <option value="Health">Health</option>
                    <option value="Mindset">Mindset</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#A0A0A0] uppercase">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as Habit['frequency'])}
                    className="w-full bg-black border border-[#1E1E1E] rounded-xl px-3.5 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#1E1E1E] mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#1E1E1E] hover:border-white transition-colors text-xs font-semibold text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-neon-gradient text-black font-bold text-xs shadow-md transition-all"
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
