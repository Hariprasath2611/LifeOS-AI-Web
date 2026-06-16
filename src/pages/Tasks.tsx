import React, { useState } from 'react';
import { 
  CheckSquare, Plus, BrainCircuit, List, KanBan, 
  Trash2, Edit, Calendar, AlertTriangle, ArrowRight, X 
} from 'lucide-react';
import { useTaskStore, Task } from '../store/taskStore';
import { GlassCard } from '../components/GlassCard';

export const Tasks: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, aiSuggestions, generateAiSuggestions } = useTaskStore();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [status, setStatus] = useState<Task['status']>('todo');
  const [category, setCategory] = useState('Work');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState<Task['recurringInterval']>('daily');

  const openAddModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setStatus('todo');
    setCategory('Work');
    setDueDate(new Date().toISOString().split('T')[0]);
    setIsRecurring(false);
    setModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setStatus(task.status);
    setCategory(task.category);
    setDueDate(task.dueDate);
    setIsRecurring(task.isRecurring);
    if (task.recurringInterval) setRecurringInterval(task.recurringInterval);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const taskData = {
      title,
      description,
      priority,
      status,
      category,
      dueDate,
      isRecurring,
      ...(isRecurring ? { recurringInterval } : {}),
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setModalOpen(false);
    generateAiSuggestions();
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    generateAiSuggestions();
  };

  const moveTaskStatus = (id: string, nextStatus: Task['status']) => {
    updateTask(id, { status: nextStatus });
    generateAiSuggestions();
  };

  const getPriorityColor = (p: Task['priority']) => {
    switch (p) {
      case 'high': return 'text-[#FF5252] bg-[#FF5252]/10 border-[#FF5252]/30';
      case 'medium': return 'text-[#FFC107] bg-[#FFC107]/10 border-[#FFC107]/30';
      case 'low': return 'text-[#00FF88] bg-[#00FF88]/10 border-[#00FF88]/30';
    }
  };

  const columns: { label: string; status: Task['status'] }[] = [
    { label: 'Todo', status: 'todo' },
    { label: 'In Progress', status: 'in_progress' },
    { label: 'Completed', status: 'completed' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Task Management Workspace</h2>
          <p className="text-xs text-[#A0A0A0]">Plan, prioritize and drag and drop items through your weekly sprint.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Switch View Toggle */}
          <div className="flex rounded-xl bg-black border border-[#1E1E1E] p-1 shrink-0">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-[#1E1E1E] text-[#00FF88]' : 'text-[#A0A0A0] hover:text-white'}`}
              title="Kanban Board"
            >
              <KanBan className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#1E1E1E] text-[#00FF88]' : 'text-[#A0A0A0] hover:text-white'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={openAddModal}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-neon-gradient text-black font-bold px-4 py-2 rounded-xl text-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* AI PRIORITIZATION COMPONENT */}
      <div className="p-5 rounded-2xl border-2 border-[#00FF88]/20 bg-[#00FF88]/5 space-y-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-[#00FF88] animate-pulse" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">AI Prioritization Optimizer</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiSuggestions.map((suggestion, idx) => (
            <div key={idx} className="p-3 bg-black/40 border border-[#1E1E1E] rounded-xl text-xs leading-relaxed text-[#A0A0A0] hover:border-[#00FF88]/30 transition-all flex flex-col justify-between">
              <p className="mb-2">{suggestion}</p>
              <button onClick={() => navigate('/assistant')} className="text-[10px] text-[#00FF88] font-bold hover:underline self-end flex items-center gap-0.5">
                <span>Refine</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* VIEW RENDERERS */}
      {viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.status);
            return (
              <GlassCard key={col.status} className="flex flex-col space-y-4 min-h-[400px]">
                <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{col.label}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-black/40 border border-[#1E1E1E] text-[#A0A0A0]">
                    {colTasks.length}
                  </span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-xl bg-black border border-[#1E1E1E] hover:border-[#00FF88]/30 transition-all space-y-3 group"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-bold text-[#A0A0A0]">{task.category}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      
                      <p className="text-sm font-semibold text-white group-hover:text-[#00FF88] transition-colors">{task.title}</p>
                      
                      {task.description && (
                        <p className="text-xs text-[#A0A0A0] leading-relaxed truncate-2-lines">{task.description}</p>
                      )}

                      <div className="flex items-center justify-between border-t border-[#1E1E1E]/60 pt-3 text-[10px] text-[#A0A0A0]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {task.dueDate}
                        </span>
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditModal(task)} className="p-1 hover:text-[#00FF88] rounded">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(task.id)} className="p-1 hover:text-[#FF5252] rounded">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Status quick mover buttons */}
                      <div className="flex justify-between gap-1 border-t border-[#1E1E1E]/40 pt-2.5">
                        {col.status !== 'todo' && (
                          <button onClick={() => moveTaskStatus(task.id, col.status === 'completed' ? 'in_progress' : 'todo')} className="text-[9px] text-[#A0A0A0] hover:text-white px-2 py-0.5 rounded bg-[#1E1E1E]">
                            ← Move
                          </button>
                        )}
                        {col.status !== 'completed' && (
                          <button onClick={() => moveTaskStatus(task.id, col.status === 'todo' ? 'in_progress' : 'completed')} className="text-[9px] text-[#00FF88] hover:text-[#00FF88]/80 px-2 py-0.5 rounded bg-[#1E1E1E] ml-auto">
                            Move →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div className="text-center py-12 text-xs text-[#A0A0A0]">No tasks in this lane.</div>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <GlassCard className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1E1E1E] text-[#A0A0A0]">
                  <th className="pb-3 font-semibold uppercase tracking-wider">Status</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">Task Title</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">Category</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">Priority</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">Due Date</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E1E1E]">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-[#1E1E1E]/30 transition-colors">
                    <td className="py-3.5">
                      <select
                        value={task.status}
                        onChange={(e) => moveTaskStatus(task.id, e.target.value as Task['status'])}
                        className="bg-black border border-[#1E1E1E] text-xs text-white rounded px-2 py-1 outline-none"
                      >
                        <option value="todo">Todo</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="py-3.5 font-semibold text-white max-w-xs truncate">{task.title}</td>
                    <td className="py-3.5 text-[#A0A0A0]">{task.category}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 border rounded-full text-[10px] font-bold uppercase ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3.5 text-[#A0A0A0]">{task.dueDate}</td>
                    <td className="py-3.5 text-right space-x-2">
                      <button onClick={() => openEditModal(task)} className="p-1 text-[#A0A0A0] hover:text-[#00FF88] inline-block">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(task.id)} className="p-1 text-[#A0A0A0] hover:text-[#FF5252] inline-block">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* CREATE / EDIT TASK MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#111111] border border-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#1E1E1E] bg-black/40">
              <h3 className="font-bold text-white">{editingTask ? 'Edit task settings' : 'Create new task item'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#A0A0A0] hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#A0A0A0] uppercase">Task Title</label>
                <input
                  type="text"
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black border border-[#1E1E1E] rounded-xl px-3.5 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#A0A0A0] uppercase">Description</label>
                <textarea
                  placeholder="Context breakdown"
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
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-black border border-[#1E1E1E] rounded-xl px-3.5 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none"
                  >
                    <option value="Work">Work</option>
                    <option value="Health">Health</option>
                    <option value="Learning">Learning</option>
                    <option value="Personal">Personal</option>
                    <option value="Financial">Financial</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#A0A0A0] uppercase">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-black border border-[#1E1E1E] rounded-xl px-3.5 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#A0A0A0] uppercase">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Task['priority'])}
                    className="w-full bg-black border border-[#1E1E1E] rounded-xl px-3.5 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#A0A0A0] uppercase">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Task['status'])}
                    className="w-full bg-black border border-[#1E1E1E] rounded-xl px-3.5 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none"
                  >
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Recurring Toggle option */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="recur-toggle"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="checkbox-emerald rounded border-[#1E1E1E]"
                />
                <label htmlFor="recur-toggle" className="text-xs font-semibold text-[#A0A0A0] cursor-pointer">
                  Repeat task recursively
                </label>
              </div>

              {isRecurring && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#A0A0A0] uppercase">Repeat Frequency</label>
                  <select
                    value={recurringInterval}
                    onChange={(e) => setRecurringInterval(e.target.value as Task['recurringInterval'])}
                    className="w-full bg-black border border-[#1E1E1E] rounded-xl px-3.5 py-2 text-sm text-white focus:border-[#00FF88] focus:outline-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}

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
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
