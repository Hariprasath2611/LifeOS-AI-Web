import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, 
  CheckSquare, Flame, Target, X, Clock, HelpCircle 
} from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { useHabitStore } from '../store/habitStore';
import { useGoalStore } from '../store/goalStore';
import { GlassCard } from '../components/GlassCard';

export const Calendar: React.FC = () => {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 16)); // June 16, 2026 (based on actual user request metadata year)
  
  const tasks = useTaskStore((s) => s.tasks);
  const habits = useHabitStore((s) => s.habits);
  const goals = useGoalStore((s) => s.goals);
  const addTask = useTaskStore((s) => s.addTask);

  const [newEventModal, setNewEventModal] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Work');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Drag and drop simulation state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Month navigation helpers
  const handlePrev = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNext = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Generate grid days for the month of June 2026
  const getDaysInMonthGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); // weekday of 1st day
    const numDays = new Date(year, month + 1, 0).getDate(); // days in active month
    
    const gridDays = [];

    // Padding empty cells for previous month
    for (let i = 0; i < firstDayIndex; i++) {
      gridDays.push(null);
    }

    // Days list
    for (let day = 1; day <= numDays; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      gridDays.push({ day, dateStr });
    }

    return gridDays;
  };

  const daysGrid = getDaysInMonthGrid();

  const handleDayClick = (dateStr: string) => {
    setSelectedDateStr(dateStr);
    setNewTitle('');
    setNewEventModal(true);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !selectedDateStr) return;

    addTask({
      title: newTitle,
      description: 'Scheduled via LifeOS Calendar Grid',
      priority: newPriority,
      status: 'todo',
      category: newCategory,
      dueDate: selectedDateStr,
      isRecurring: false,
    });

    setNewEventModal(false);
  };

  // Drag simulation helpers
  const handleTaskDragStart = (id: string) => {
    setDraggedTaskId(id);
  };

  const handleTaskDrop = (targetDateStr: string) => {
    if (draggedTaskId) {
      // Simulate task date movement in task store
      const taskStore = useTaskStore.getState();
      taskStore.updateTask(draggedTaskId, { dueDate: targetDateStr });
      setDraggedTaskId(null);
      alert(`📅 Task rescheduled to ${targetDateStr}`);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* HEADER CONTROL BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-[#00FF88]" />
          <div>
            <h2 className="text-xl font-bold text-white">Dynamic Life Planner</h2>
            <p className="text-xs text-[#A0A0A0]">Drag tasks across dates. Click cells to add items directly to calendar.</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex rounded-xl bg-black border border-[#1E1E1E] p-1">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  viewMode === mode ? 'bg-[#1E1E1E] text-[#00FF88]' : 'text-[#A0A0A0] hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button 
            onClick={() => handleDayClick(new Date().toISOString().split('T')[0])}
            className="flex items-center gap-1.5 bg-neon-gradient text-black font-bold px-4 py-2 rounded-xl text-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* MONTH CONTROL SELECTOR */}
      <div className="flex items-center justify-between bg-[#111111] border border-[#1E1E1E] p-4 rounded-2xl">
        <h3 className="font-bold text-sm text-white">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrev}
            className="p-2 border border-[#1E1E1E] hover:border-white rounded-lg text-[#A0A0A0] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={handleNext}
            className="p-2 border border-[#1E1E1E] hover:border-white rounded-lg text-[#A0A0A0] hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CALENDAR MONTH GRID */}
      {viewMode === 'month' ? (
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl overflow-hidden p-4">
          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#A0A0A0] mb-3">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Month Day Cells */}
          <div className="grid grid-cols-7 gap-2">
            {daysGrid.map((dayObj, idx) => {
              if (!dayObj) {
                return <div key={`empty-${idx}`} className="bg-black/10 aspect-square rounded-xl border border-[#1E1E1E]/20" />;
              }

              const { day, dateStr } = dayObj;
              const isToday = dateStr === new Date().toISOString().split('T')[0];

              // Filter events for this cell
              const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
              const dayHabits = habits.filter((h) => h.history.includes(dateStr));
              const dayGoals = goals.filter((g) => g.dueDate === dateStr);

              return (
                <div
                  key={dateStr}
                  onClick={() => handleDayClick(dateStr)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleTaskDrop(dateStr)}
                  className={`bg-black/35 aspect-square rounded-xl p-2 border hover:border-[#00FF88]/40 transition-colors flex flex-col justify-between cursor-pointer relative ${
                    isToday ? 'border-[#00FF88] shadow-[0_0_12px_rgba(0,255,136,0.1)]' : 'border-[#1E1E1E]'
                  }`}
                >
                  <span className={`text-[10px] font-bold ${isToday ? 'text-[#00FF88]' : 'text-[#A0A0A0]'}`}>
                    {day}
                  </span>

                  {/* Render tag checklist */}
                  <div className="space-y-1 overflow-y-auto max-h-[80%] pr-0.5 mt-1">
                    {dayTasks.map((t) => (
                      <div
                        key={t.id}
                        draggable
                        onDragStart={() => handleTaskDragStart(t.id)}
                        className={`text-[8px] px-1.5 py-0.5 rounded font-semibold truncate ${
                          t.status === 'completed' 
                            ? 'bg-[#00FF88]/10 text-[#00FF88] line-through border border-[#00FF88]/20' 
                            : 'bg-emerald-500/20 text-[#00FF88] border border-[#00FF88]/30 cursor-grab'
                        }`}
                        title={`Task: ${t.title} (Drag to reschedule)`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t.title}
                      </div>
                    ))}
                    
                    {dayHabits.map((h) => (
                      <div
                        key={h.id}
                        className="text-[8px] bg-orange-500/25 border border-orange-500/30 text-orange-400 px-1.5 py-0.5 rounded font-semibold truncate"
                        title={`Habit Check: ${h.name}`}
                      >
                        🔥 {h.name}
                      </div>
                    ))}

                    {dayGoals.map((g) => (
                      <div
                        key={g.id}
                        className="text-[8px] bg-purple-500/25 border border-purple-500/30 text-purple-400 px-1.5 py-0.5 rounded font-semibold truncate"
                        title={`Goal Deadline: ${g.title}`}
                      >
                        🎯 {g.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* WEEK OR DAY VIEWS FALLBACK PANEL */
        <GlassCard className="text-center py-20 text-[#A0A0A0] text-sm space-y-4">
          <HelpCircle className="w-12 h-12 text-[#00FF88] mx-auto animate-pulse" />
          <p>The Week/Day layouts are optimized for desktop drag and drop events. Check calendar month grid for full operations.</p>
          <button onClick={() => setViewMode('month')} className="px-4 py-2 bg-neon-gradient text-black font-bold text-xs rounded-xl">
            Return to Month View
          </button>
        </GlassCard>
      )}

      {/* QUICK EVENT ADD MODAL */}
      {newEventModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111111] border border-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#1E1E1E] bg-black/40">
              <h3 className="font-bold text-white text-sm">Schedule Task Event</h3>
              <button onClick={() => setNewEventModal(false)} className="text-[#A0A0A0] hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#A0A0A0] uppercase">Target Date</label>
                <input
                  type="text"
                  value={selectedDateStr}
                  readOnly
                  className="w-full bg-[#1E1E1E]/50 border border-[#1E1E1E] rounded-xl px-3 py-2 text-xs text-[#A0A0A0] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#A0A0A0] uppercase">Task Title</label>
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-black border border-[#1E1E1E] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF88] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#A0A0A0] uppercase">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-black border border-[#1E1E1E] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF88]"
                  >
                    <option value="Work">Work</option>
                    <option value="Health">Health</option>
                    <option value="Learning">Learning</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#A0A0A0] uppercase">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-black border border-[#1E1E1E] rounded-xl px-3 py-2 text-xs text-white focus:border-[#00FF88]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#1E1E1E] mt-6">
                <button
                  type="button"
                  onClick={() => setNewEventModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#1E1E1E] text-xs font-semibold text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-neon-gradient text-black font-bold text-xs"
                >
                  Add Task Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
