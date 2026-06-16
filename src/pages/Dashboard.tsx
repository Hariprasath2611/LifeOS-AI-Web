import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckSquare, Target, Flame, FileText, GraduationCap, 
  Sparkles, Plus, Clock, BrainCircuit, Play, ArrowRight, Award
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { GlassCard } from '../components/GlassCard';
import { useTaskStore } from '../store/taskStore';
import { useGoalStore } from '../store/goalStore';
import { useHabitStore } from '../store/habitStore';
import { useNoteStore } from '../store/noteStore';
import { useLearningStore } from '../store/learningStore';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Stores data
  const { tasks, moveTask } = useTaskStore();
  const { goals, toggleMilestone } = useGoalStore();
  const { habits, toggleHabitDate } = useHabitStore();
  const { notes } = useNoteStore();
  const { skills, pomodoroMinutes, logStudySession } = useLearningStore();

  const [focusText, setFocusText] = useState('Build LifeOS AI Frontend Dashboard');
  const [sessionTime, setSessionTime] = useState(25);
  const [timerRunning, setTimerRunning] = useState(false);

  // Quick stats calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const activeStreaks = habits.reduce((acc, h) => h.streak > acc ? h.streak : acc, 0);

  const averageGoalProgress = goals.length > 0 
    ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)
    : 0;

  // Productivity Score Calculation
  const productivityScore = Math.min(
    100,
    Math.round((taskCompletionRate * 0.4) + (averageGoalProgress * 0.3) + (activeStreaks * 2.5) + (pomodoroMinutes / 6))
  );

  // Mock analytics charts data
  const trendData = [
    { name: 'Mon', score: 65, tasks: 2, study: 45 },
    { name: 'Tue', score: 72, tasks: 3, study: 60 },
    { name: 'Wed', score: 68, tasks: 1, study: 30 },
    { name: 'Thu', score: 78, tasks: 4, study: 75 },
    { name: 'Fri', score: 85, tasks: 5, study: 90 },
    { name: 'Sat', score: 92, tasks: 6, study: 120 },
    { name: 'Sun', score: productivityScore, tasks: completedTasks, study: pomodoroMinutes }
  ];

  const categoryPerformance = [
    { name: 'Work', rate: 85, color: '#00FF88' },
    { name: 'Health', rate: 70, color: '#00C853' },
    { name: 'Learning', rate: 60, color: '#00E676' },
    { name: 'Personal', rate: 90, color: '#FFC107' }
  ];

  const handleTaskCheck = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    moveTask(id, nextStatus);
  };

  const handleHabitCheck = (id: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    toggleHabitDate(id, todayStr);
  };

  const handleQuickLogStudy = () => {
    logStudySession(25);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* GRID 1: Focus Widget, Quick Action and Productivity Index */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Focus Widget */}
        <GlassCard className="relative overflow-hidden flex flex-col justify-between min-h-[200px]">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[#A0A0A0] text-xs">
              <span className="font-semibold uppercase tracking-wider">Today's Main Focus</span>
              <BrainCircuit className="w-4 h-4 text-[#00FF88]" />
            </div>
            <input 
              type="text" 
              value={focusText}
              onChange={(e) => setFocusText(e.target.value)}
              className="text-lg font-bold text-white bg-transparent border-none outline-none focus:ring-1 focus:ring-[#00FF88]/40 rounded px-1 w-full"
            />
          </div>

          <div className="flex items-center justify-between border-t border-[#1E1E1E] pt-4 mt-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#A0A0A0]" />
              <span className="text-sm font-semibold text-white">{sessionTime}m Focus Block</span>
            </div>
            <button 
              onClick={() => setTimerRunning(!timerRunning)}
              className="px-3 py-1 rounded bg-[#00C853] hover:bg-[#00FF88] text-black text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{timerRunning ? 'Pause' : 'Start'}</span>
            </button>
          </div>
        </GlassCard>

        {/* Productivity Score Index */}
        <GlassCard className="flex flex-col justify-between min-h-[200px]">
          <div className="flex items-center justify-between">
            <span className="text-[#A0A0A0] text-xs font-semibold uppercase tracking-wider">Productivity Index</span>
            <Award className="w-4 h-4 text-[#00FF88]" />
          </div>

          <div className="flex items-end justify-between py-2">
            <div className="space-y-1">
              <span className="text-5xl font-extrabold text-neon-gradient">{productivityScore}</span>
              <span className="text-xs text-[#A0A0A0] block">Weighted execution rate</span>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-[#1E1E1E] flex items-center justify-center relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="32" 
                  cy="32" 
                  r="26" 
                  className="stroke-[#1E1E1E] fill-none" 
                  strokeWidth="4" 
                />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="26" 
                  className="stroke-[#00FF88] fill-none" 
                  strokeWidth="4" 
                  strokeDasharray={163.3} 
                  strokeDashoffset={163.3 - (163.3 * productivityScore) / 100}
                />
              </svg>
              <span className="absolute text-[10px] font-bold">Score</span>
            </div>
          </div>

          <p className="text-xs text-[#A0A0A0] border-t border-[#1E1E1E] pt-3">
            💡 AI Coach: {productivityScore > 80 ? 'Excellent energy allocations! You are executing goals rapidly.' : 'Score below optimal. Try completing 1 quick habit to build momentum.'}
          </p>
        </GlassCard>

        {/* AI Suggestions Engine Widget */}
        <GlassCard className="flex flex-col justify-between border-2 border-[#00FF88]/20 bg-[#00FF88]/5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00FF88] animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">AI Recommendation</span>
          </div>
          
          <p className="text-sm text-white leading-relaxed my-3 font-medium">
            "Your weekly habit '10 Minute Meditation' has a 5-day streak. Doing this at 8:00 AM matches your highest subsequent focus block."
          </p>

          <button 
            onClick={() => navigate('/assistant')}
            className="w-full py-2 bg-[#1E1E1E] hover:bg-[#1E1E1E]/80 border border-[#00FF88]/20 text-[#00FF88] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Consult Assistant Coach</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </GlassCard>
      </div>

      {/* GRID 2: Charts (Productivity & Categories) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Productivity trend */}
        <GlassCard className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Productivity Trend</h3>
            <span className="text-xs text-[#A0A0A0]">Last 7 Days</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FF88" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00FF88" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" />
                <XAxis dataKey="name" stroke="#A0A0A0" fontSize={11} />
                <YAxis stroke="#A0A0A0" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111111', borderColor: '#1E1E1E' }} 
                  labelStyle={{ color: '#FFFFFF' }}
                  itemStyle={{ color: '#00FF88' }}
                />
                <Area type="monotone" dataKey="score" stroke="#00FF88" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Category Performance */}
        <GlassCard className="space-y-4">
          <h3 className="text-sm font-bold text-white">Execution by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" />
                <XAxis dataKey="name" stroke="#A0A0A0" fontSize={11} />
                <YAxis stroke="#A0A0A0" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111111', borderColor: '#1E1E1E' }}
                  itemStyle={{ color: '#FFFFFF' }}
                />
                <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                  {categoryPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* GRID 3: Tasks, Habits, Goals Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Today's Tasks */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#00FF88]" />
              <h3 className="text-sm font-bold text-white">Upcoming Tasks</h3>
            </div>
            <button onClick={() => navigate('/tasks')} className="text-xs text-[#00FF88] hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {tasks.filter(t => t.status !== 'completed').slice(0, 3).map((task) => (
              <div 
                key={task.id} 
                className="flex items-start gap-3 p-2.5 rounded-lg bg-black/40 border border-[#1E1E1E] group hover:border-[#00FF88]/20 transition-all"
              >
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  onChange={() => handleTaskCheck(task.id, task.status)}
                  className="mt-1 checkbox-emerald rounded border-[#1E1E1E] text-[#00FF88]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate group-hover:text-[#00FF88] transition-colors">{task.title}</p>
                  <p className="text-[10px] text-[#A0A0A0]">{task.category} • Due {task.dueDate}</p>
                </div>
              </div>
            ))}
            {tasks.filter(t => t.status !== 'completed').length === 0 && (
              <div className="text-center py-6 text-xs text-[#A0A0A0]">No upcoming tasks today!</div>
            )}
          </div>
        </GlassCard>

        {/* Habits Checklist */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#00FF88]" />
              <h3 className="text-sm font-bold text-white">Habits Streaks</h3>
            </div>
            <button onClick={() => navigate('/habits')} className="text-xs text-[#00FF88] hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {habits.slice(0, 3).map((habit) => {
              const todayStr = new Date().toISOString().split('T')[0];
              const isCompletedToday = habit.history.includes(todayStr);
              return (
                <div 
                  key={habit.id} 
                  className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-[#1E1E1E] hover:border-[#00FF88]/20 transition-all"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{habit.name}</p>
                    <p className="text-[10px] text-[#00FF88] font-bold">🔥 {habit.streak} day streak</p>
                  </div>
                  <button
                    onClick={() => handleHabitCheck(habit.id)}
                    className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                      isCompletedToday 
                        ? 'bg-[#00FF88]/10 border border-[#00FF88]/40 text-[#00FF88]' 
                        : 'bg-black border border-[#1E1E1E] text-[#A0A0A0] hover:text-white'
                    }`}
                  >
                    {isCompletedToday ? 'Done' : 'Check'}
                  </button>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Active Goals */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#00FF88]" />
              <h3 className="text-sm font-bold text-white">Goal Progress</h3>
            </div>
            <button onClick={() => navigate('/goals')} className="text-xs text-[#00FF88] hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {goals.slice(0, 2).map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white truncate max-w-[200px]">{goal.title}</span>
                  <span className="text-[#00FF88] font-semibold">{goal.progress}%</span>
                </div>
                <div className="w-full bg-[#1E1E1E] h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-neon-gradient h-full transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-[#A0A0A0]">
                  <span>Milestones: {goal.milestones.filter(m => m.completed).length}/{goal.milestones.length}</span>
                  <span>Target: {goal.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
