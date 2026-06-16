import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, CheckSquare, Flame, Target, FileText } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { useHabitStore } from '../store/habitStore';
import { useGoalStore } from '../store/goalStore';
import { useNoteStore } from '../store/noteStore';

interface SearchEverywhereProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchEverywhere: React.FC<SearchEverywhereProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const tasks = useTaskStore((s) => s.tasks);
  const habits = useHabitStore((s) => s.habits);
  const goals = useGoalStore((s) => s.goals);
  const notes = useNoteStore((s) => s.notes);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredTasks = query
    ? tasks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()))
    : tasks.slice(0, 2);

  const filteredHabits = query
    ? habits.filter((h) => h.name.toLowerCase().includes(query.toLowerCase()))
    : habits.slice(0, 2);

  const filteredGoals = query
    ? goals.filter((g) => g.title.toLowerCase().includes(query.toLowerCase()))
    : goals.slice(0, 2);

  const filteredNotes = query
    ? notes.filter((n) => n.title.toLowerCase().includes(query.toLowerCase()) || n.content.toLowerCase().includes(query.toLowerCase()))
    : notes.slice(0, 2);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl bg-[#111111] border border-[#1E1E1E] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 border-b border-[#1E1E1E] py-3">
          <Search className="w-5 h-5 text-[#A0A0A0]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tasks, habits, goals, notes... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-[#A0A0A0] outline-none text-base"
          />
          <button onClick={onClose} className="p-1 rounded hover:bg-[#1E1E1E] text-[#A0A0A0] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[400px] overflow-y-auto p-4 space-y-6">
          {/* Tasks Group */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-2">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Tasks</span>
              </div>
              <div className="space-y-1">
                {filteredTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelect('/tasks')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#1E1E1E] transition-colors flex items-center justify-between text-sm group"
                  >
                    <span className="text-white group-hover:text-[#00FF88] transition-colors">{t.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-black/40 border border-[#1E1E1E] text-[#A0A0A0]">
                      {t.status.replace('_', ' ')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Habits Group */}
          {filteredHabits.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-2">
                <Flame className="w-3.5 h-3.5" />
                <span>Habits</span>
              </div>
              <div className="space-y-1">
                {filteredHabits.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => handleSelect('/habits')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#1E1E1E] transition-colors flex items-center justify-between text-sm group"
                  >
                    <span className="text-white group-hover:text-[#00FF88] transition-colors">{h.name}</span>
                    <span className="text-xs text-[#00FF88] font-semibold flex items-center gap-1">
                      🔥 {h.streak}d streak
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Goals Group */}
          {filteredGoals.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-2">
                <Target className="w-3.5 h-3.5" />
                <span>Goals</span>
              </div>
              <div className="space-y-1">
                {filteredGoals.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handleSelect('/goals')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#1E1E1E] transition-colors flex items-center justify-between text-sm group"
                  >
                    <span className="text-white group-hover:text-[#00FF88] transition-colors">{g.title}</span>
                    <span className="text-xs text-[#00C853] font-medium">{g.progress}% progress</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes Group */}
          {filteredNotes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-2">
                <FileText className="w-3.5 h-3.5" />
                <span>Notes</span>
              </div>
              <div className="space-y-1">
                {filteredNotes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleSelect(`/notes`)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#1E1E1E] transition-colors flex items-center justify-between text-sm group"
                  >
                    <span className="text-white group-hover:text-[#00FF88] transition-colors">{n.title}</span>
                    <span className="text-xs text-[#A0A0A0] truncate max-w-[200px]">{n.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredTasks.length === 0 && filteredHabits.length === 0 && filteredGoals.length === 0 && filteredNotes.length === 0 && (
            <div className="text-center py-8 text-[#A0A0A0] text-sm">
              No results found for "<span className="text-white font-medium">{query}</span>"
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-[#1E1E1E] bg-black/40 flex items-center justify-between text-xs text-[#A0A0A0]">
          <div className="flex items-center gap-3">
            <span>Jump to:</span>
            <span className="cursor-pointer hover:text-white" onClick={() => handleSelect('/dashboard')}>Dashboard</span>
            <span className="cursor-pointer hover:text-white" onClick={() => handleSelect('/assistant')}>AI Assistant</span>
          </div>
          <div>
            Press <kbd className="bg-[#1E1E1E] px-1.5 py-0.5 rounded text-white text-[10px]">ESC</kbd> to close
          </div>
        </div>
      </div>
    </div>
  );
};
