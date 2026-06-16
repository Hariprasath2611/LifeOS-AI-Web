import React, { useState } from 'react';
import { 
  Target, Plus, Calendar, Milestone as MilestoneIcon, 
  Sparkles, Trash2, X, Compass, Loader2
} from 'lucide-react';
import { useGoalStore } from '../store/goalStore';
import type { Goal } from '../store/goalStore';
import { GlassCard } from '../components/GlassCard';

export const Goals: React.FC = () => {
  const { goals, addGoal, deleteGoal, toggleMilestone, generateAiActionPlan } = useGoalStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingGoalId, setLoadingGoalId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Goal['category']>('Career');
  const [timeline, setTimeline] = useState<Goal['timeline']>('short_term');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    addGoal({
      title,
      description,
      category,
      timeline,
      dueDate,
      milestones: [],
    });

    setTitle('');
    setDescription('');
    setModalOpen(false);
  };

  const handleGenerateAiMilestones = async (goalId: string) => {
    setLoadingGoalId(goalId);
    try {
      await generateAiActionPlan(goalId);
    } catch (err) {}
    setLoadingGoalId(null);
  };

  const getCategoryColor = (cat: Goal['category']) => {
    switch (cat) {
      case 'Career': return 'text-[#00FF88] bg-[#00FF88]/10 border-[#00FF88]/20';
      case 'Health': return 'text-[#00C853] bg-[#00C853]/10 border-[#00C853]/20';
      case 'Wealth': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Personal': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    }
  };

  const shortTermGoals = goals.filter(g => g.timeline === 'short_term');
  const longTermGoals = goals.filter(g => g.timeline === 'long_term');

  const renderGoalCard = (goal: Goal) => {
    const radius = 22;
    const strokeWidth = 4;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (goal.progress / 100) * circumference;

    return (
      <GlassCard key={goal.id} className="space-y-6">
        {/* Header Title & Ring */}
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded text-[10px] border font-semibold ${getCategoryColor(goal.category)}`}>
                {goal.category}
              </span>
              <span className="text-[10px] text-[#A0A0A0] flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Target: {goal.dueDate}
              </span>
            </div>
            <h3 className="text-base font-bold text-white truncate">{goal.title}</h3>
            <p className="text-xs text-[#A0A0A0] leading-relaxed truncate-2-lines">{goal.description}</p>
          </div>

          {/* SVG Progress Ring */}
          <div className="relative w-12 h-12 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-[#1E1E1E] fill-none"
                strokeWidth={strokeWidth}
              />
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-[#00FF88] fill-none transition-all duration-500"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-white">
              {goal.progress}%
            </span>
          </div>
        </div>

        {/* Milestones checklist */}
        <div className="space-y-2 border-t border-[#1E1E1E]/50 pt-4">
          <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
            <span className="flex items-center gap-1.5">
              <MilestoneIcon className="w-3.5 h-3.5 text-[#00FF88]" />
              <span>Milestones Checklist</span>
            </span>
            <span className="text-[10px] text-[#A0A0A0]">
              {goal.milestones.filter(m => m.completed).length}/{goal.milestones.length}
            </span>
          </div>

          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
            {goal.milestones.map((m) => (
              <div 
                key={m.id}
                className="flex items-start gap-2.5 p-2 rounded bg-black/40 border border-[#1E1E1E]/50 text-xs hover:border-[#00FF88]/10"
              >
                <input
                  type="checkbox"
                  checked={m.completed}
                  onChange={() => toggleMilestone(goal.id, m.id)}
                  className="mt-0.5 checkbox-emerald rounded text-[#00FF88] border-[#1E1E1E]"
                />
                <span className={`leading-relaxed ${m.completed ? 'line-through text-[#A0A0A0]' : 'text-white font-medium'}`}>
                  {m.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Action Plan Actions */}
        <div className="flex justify-between gap-3 border-t border-[#1E1E1E]/40 pt-4 mt-2">
          {!goal.aiActionPlanGenerated ? (
            <button
              onClick={() => handleGenerateAiMilestones(goal.id)}
              disabled={loadingGoalId === goal.id}
              className="flex-1 py-2 rounded-lg bg-[#00FF88]/10 border border-[#00FF88]/40 hover:bg-[#00FF88]/15 text-[#00FF88] text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loadingGoalId === goal.id ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Structuring Phase...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Generate AI Action Plan</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex-1 py-1.5 text-center rounded bg-[#00C853]/15 text-[#00E676] text-[10px] font-bold border border-[#00C853]/30">
              ✓ AI Plan Structured
            </div>
          )}

          <button
            onClick={() => deleteGoal(goal.id)}
            className="p-2 border border-[#1E1E1E] text-[#A0A0A0] hover:text-[#FF5252] hover:bg-[#FF5252]/10 rounded-lg transition-colors shrink-0"
            title="Delete Goal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </GlassCard>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Title Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Goals & Milestones</h2>
          <p className="text-xs text-[#A0A0A0]">Break down key milestones, launch plans, and track your life achievements.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-neon-gradient text-black font-bold px-4 py-2 rounded-xl text-sm transition-all w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Goal</span>
        </button>
      </div>

      {/* SHORT-TERM GOALS (Timeline View) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[#00FF88]">
          <Compass className="w-5 h-5" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Short-Term Milestones (Under 6 Months)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shortTermGoals.map(renderGoalCard)}
          {shortTermGoals.length === 0 && (
            <div className="col-span-full text-center py-12 text-xs text-[#A0A0A0]">No short term goals added yet.</div>
          )}
        </div>
      </div>

      {/* LONG-TERM GOALS */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 text-purple-400">
          <Target className="w-5 h-5" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Long-Term Visions (1 - 5 Years)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {longTermGoals.map(renderGoalCard)}
          {longTermGoals.length === 0 && (
            <div className="col-span-full text-center py-12 text-xs text-[#A0A0A0]">No long term visions added yet.</div>
          )}
        </div>
      </div>

      {/* GOAL ADDITION MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#111111] border border-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#1E1E1E] bg-black/40">
              <h3 className="font-bold text-white">Add Life Goal</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#A0A0A0] hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#A0A0A0] uppercase">Goal Title</label>
                <input
                  type="text"
                  placeholder="e.g. Finish College Degree / Pay off student loan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black border border-[#1E1E1E] rounded-xl px-3.5 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#A0A0A0] uppercase">Description / Purpose</label>
                <textarea
                  placeholder="Why is this goal critical to your life values?"
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
                    onChange={(e) => setCategory(e.target.value as Goal['category'])}
                    className="w-full bg-black border border-[#1E1E1E] rounded-xl px-3.5 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none"
                  >
                    <option value="Career">Career</option>
                    <option value="Health">Health</option>
                    <option value="Wealth">Wealth</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#A0A0A0] uppercase">Target Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-black border border-[#1E1E1E] rounded-xl px-3.5 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#A0A0A0] uppercase">Visions Horizon</label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value as Goal['timeline'])}
                  className="w-full bg-black border border-[#1E1E1E] rounded-xl px-3.5 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none"
                >
                  <option value="short_term">Short Term (Under 6 Months)</option>
                  <option value="long_term">Long Term (1 - 5 Years)</option>
                </select>
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
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
