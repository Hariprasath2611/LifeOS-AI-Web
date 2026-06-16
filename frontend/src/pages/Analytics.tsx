import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  CheckCircle2, Flame, GraduationCap, 
  Target, TrendingUp, Zap 
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { useTaskStore } from '../store/taskStore';
import { useHabitStore } from '../store/habitStore';
import { useGoalStore } from '../store/goalStore';
import { useLearningStore } from '../store/learningStore';

export const Analytics: React.FC = () => {
  const tasks = useTaskStore((s) => s.tasks);
  const habits = useHabitStore((s) => s.habits);
  const goals = useGoalStore((s) => s.goals);
  const { pomodoroMinutes } = useLearningStore();

  // Tasks statistics calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;

  const taskStatusData = [
    { name: 'Completed', value: completedTasks, color: '#00FF88' },
    { name: 'In Progress', value: inProgressTasks, color: '#00C853' },
    { name: 'Todo', value: todoTasks, color: '#FFC107' }
  ].filter(item => item.value > 0);

  // Goal statistics
  const totalGoals = goals.length;
  const averageGoalProgress = totalGoals > 0 
    ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / totalGoals)
    : 0;

  // Habit statistics
  const habitConsistencyList = habits.map(h => {
    // Consistency as checked days count divided by total history days or mockup 85%
    const checkedCount = h.history.length;
    const consistencyPercentage = Math.min(100, Math.round((checkedCount / 30) * 100));
    return { name: h.name, consistency: consistencyPercentage || 70, streak: h.streak };
  });

  // Productivity Trend over weeks mock data
  const weeklyTrendData = [
    { name: 'Week 1', score: 62, tasks: 12, study: 90 },
    { name: 'Week 2', score: 70, tasks: 16, study: 120 },
    { name: 'Week 3', score: 68, tasks: 14, study: 100 },
    { name: 'Week 4', score: 79, tasks: 22, study: 150 },
    { name: 'Week 5', score: 86, tasks: 28, study: 210 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white">Productivity & Habits Analytics</h2>
        <p className="text-xs text-[#A0A0A0]">Review correlations between habit completion, tasks checked and goal achievements.</p>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <GlassCard className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#00FF88]/10 border border-[#00FF88]/20 text-[#00FF88]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-[#A0A0A0] uppercase font-bold tracking-wider block">Tasks Checked</span>
            <span className="text-2xl font-extrabold text-white">{completedTasks}</span>
            <span className="text-[9px] text-[#A0A0A0] block">out of {totalTasks} total</span>
          </div>
        </GlassCard>

        {/* Metric 2 */}
        <GlassCard className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#00C853]/10 border border-[#00C853]/20 text-[#00C853]">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-[#A0A0A0] uppercase font-bold tracking-wider block">Avg Goal Progress</span>
            <span className="text-2xl font-extrabold text-white">{averageGoalProgress}%</span>
            <span className="text-[9px] text-[#A0A0A0] block">{totalGoals} active targets</span>
          </div>
        </GlassCard>

        {/* Metric 3 */}
        <GlassCard className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-[#A0A0A0] uppercase font-bold tracking-wider block">Habit Habits Consistency</span>
            <span className="text-2xl font-extrabold text-white">82%</span>
            <span className="text-[9px] text-[#A0A0A0] block">{habits.length} habits tracking</span>
          </div>
        </GlassCard>

        {/* Metric 4 */}
        <GlassCard className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-[#A0A0A0] uppercase font-bold tracking-wider block">Learning Time</span>
            <span className="text-2xl font-extrabold text-white">{(pomodoroMinutes / 60).toFixed(1)}h</span>
            <span className="text-[9px] text-[#A0A0A0] block">{pomodoroMinutes} focus minutes</span>
          </div>
        </GlassCard>
      </div>

      {/* CHARTS BLOCK 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly execution stats line chart */}
        <GlassCard className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#00FF88]" />
            <h3 className="text-sm font-bold text-white">Multi-Week Productivity Performance</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" />
                <XAxis dataKey="name" stroke="#A0A0A0" fontSize={11} />
                <YAxis stroke="#A0A0A0" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111111', borderColor: '#1E1E1E' }}
                  labelStyle={{ color: '#FFFFFF' }}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: '#A0A0A0' }} />
                <Line type="monotone" dataKey="score" stroke="#00FF88" strokeWidth={3} name="Productivity Index" />
                <Line type="monotone" dataKey="tasks" stroke="#FFC107" strokeWidth={2} name="Completions Tasks" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Task Share pie chart */}
        <GlassCard className="space-y-4">
          <h3 className="text-sm font-bold text-white">Tasks Allocation Ratio</h3>
          <div className="h-72 flex flex-col justify-between items-center">
            {taskStatusData.length > 0 ? (
              <div className="w-full h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {taskStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111111', borderColor: '#1E1E1E' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-52 flex items-center justify-center text-xs text-[#A0A0A0]">No tasks data.</div>
            )}
            
            {/* Custom Legends */}
            <div className="flex gap-4 text-[10px] font-bold">
              {taskStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#A0A0A0]">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* CHARTS BLOCK 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Habit Consistency bar chart */}
        <GlassCard className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00FF88]" />
            <h3 className="text-sm font-bold text-white">Habit Consistency Scores (%)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={habitConsistencyList} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" />
                <XAxis type="number" domain={[0, 100]} stroke="#A0A0A0" fontSize={11} />
                <YAxis type="category" dataKey="name" stroke="#A0A0A0" fontSize={10} width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#111111', borderColor: '#1E1E1E' }} />
                <Bar dataKey="consistency" fill="#00C853" radius={[0, 4, 4, 0]} barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Learning hours log bar chart */}
        <GlassCard className="space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#00FF88]" />
            <h3 className="text-sm font-bold text-white">Weekly Focus Minutes</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" />
                <XAxis dataKey="name" stroke="#A0A0A0" fontSize={11} />
                <YAxis stroke="#A0A0A0" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#111111', borderColor: '#1E1E1E' }} />
                <Bar dataKey="study" fill="#00FF88" radius={[4, 4, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
