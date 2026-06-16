import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Plus, Clock, Play, Pause, RotateCcw, 
  Sparkles, CheckSquare, Trash2, ArrowUpRight, CheckCircle2,
  ListTodo, Loader2, BookOpen
} from 'lucide-react';
import { useLearningStore, Skill, Roadmap } from '../store/learningStore';
import { GlassCard } from '../components/GlassCard';

export const LearningHub: React.FC = () => {
  const { 
    skills, roadmaps, pomodoroMinutes, addSkill, 
    updateSkillProgress, toggleRoadmapStep, logStudySession, generateAiRoadmap 
  } = useLearningStore();

  const [aiRoadmapTopic, setAiRoadmapTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [addSkillOpen, setAddSkillOpen] = useState(false);

  // Skill Form States
  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState('Frontend');
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Expert'>('Beginner');

  // Pomodoro timer states
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes in seconds
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      logStudySession(25);
      setTimeLeft(1500);
      alert("⏱️ Pomodoro block complete! logged 25 minutes to your learning stats.");
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft, logStudySession]);

  const handleStartTimer = () => setTimerRunning(true);
  const handlePauseTimer = () => setTimerRunning(false);
  const handleResetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(1500);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName) return;

    addSkill({
      name: skillName,
      category: skillCategory,
      level: skillLevel,
      progress: 10,
    });

    setSkillName('');
    setAddSkillOpen(false);
  };

  const handleGenerateAiRoadmap = async () => {
    if (!aiRoadmapTopic) return;
    setAiLoading(true);
    await generateAiRoadmap(aiRoadmapTopic);
    setAiLoading(false);
    setAiRoadmapTopic('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white">Learning Hub & Skills Manager</h2>
        <p className="text-xs text-[#A0A0A0]">Plot skill milestones, log study hours, and generate AI study roadmaps.</p>
      </div>

      {/* GRID 1: Skills checklist + Study Session timer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Skills checklist */}
        <GlassCard className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-[#1E1E1E] pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#00FF88]" />
              <h3 className="text-sm font-bold text-white">Skills Matrix</h3>
            </div>
            <button 
              onClick={() => setAddSkillOpen(!addSkillOpen)}
              className="text-xs text-[#00FF88] flex items-center gap-1 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>

          {/* Add skill dropdown form */}
          {addSkillOpen && (
            <form onSubmit={handleCreateSkill} className="p-4 rounded-xl bg-black border border-[#1E1E1E] space-y-3 animate-in slide-in-from-top-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Skill name (e.g. Docker, Rust)"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="bg-black/60 border border-[#1E1E1E] rounded-lg px-3 py-1.5 text-xs text-white placeholder-[#A0A0A0]"
                  required
                />
                <select
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value)}
                  className="bg-black/60 border border-[#1E1E1E] rounded-lg px-3 py-1.5 text-xs text-white"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="DevOps">DevOps</option>
                </select>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value as any)}
                  className="bg-black/60 border border-[#1E1E1E] rounded-lg px-3 py-1.5 text-xs text-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setAddSkillOpen(false)} className="px-3 py-1 rounded bg-[#1E1E1E] text-xs">Cancel</button>
                <button type="submit" className="px-3 py-1 rounded bg-neon-gradient text-black font-bold text-xs">Save</button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.id} className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-white mr-2">{skill.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1E1E1E] text-[#A0A0A0]">{skill.level}</span>
                  </div>
                  <span className="text-[#00FF88] font-semibold">{skill.progress}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skill.progress}
                    onChange={(e) => updateSkillProgress(skill.id, parseInt(e.target.value))}
                    className="flex-1 accent-[#00FF88] bg-[#1E1E1E] h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Pomodoro Timer */}
        <GlassCard className="flex flex-col justify-between items-center text-center space-y-4">
          <div className="w-full flex items-center justify-between border-b border-[#1E1E1E] pb-3 text-left">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00FF88]" />
              <span className="text-sm font-bold text-white">Pomodoro Study Focus</span>
            </div>
            <span className="text-[10px] text-[#A0A0A0] bg-[#1E1E1E] px-2 py-0.5 rounded font-bold">
              Logged: {pomodoroMinutes}m
            </span>
          </div>

          <div className="py-6 space-y-2">
            <span className="text-5xl font-mono font-extrabold text-white tracking-widest block">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#A0A0A0]">
              Stay focused, avoid screen triggers
            </span>
          </div>

          <div className="flex gap-2.5 w-full">
            {timerRunning ? (
              <button 
                onClick={handlePauseTimer}
                className="flex-1 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/15 transition-all flex items-center justify-center gap-1"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </button>
            ) : (
              <button 
                onClick={handleStartTimer}
                className="flex-1 py-2 rounded-xl bg-[#00C853]/15 border border-[#00C853]/40 text-[#00FF88] text-xs font-bold hover:bg-[#00C853]/20 transition-all flex items-center justify-center gap-1"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Start Session</span>
              </button>
            )}

            <button 
              onClick={handleResetTimer}
              className="p-2 border border-[#1E1E1E] hover:border-white text-[#A0A0A0] hover:text-white rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>
      </div>

      {/* GRID 2: Roadmaps & Personalized AI Plan Generation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Roadmaps view */}
        <GlassCard className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-[#1E1E1E] pb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#00FF88]" />
              <h3 className="text-sm font-bold text-white">Your Study Roadmaps</h3>
            </div>
          </div>

          {roadmaps.map((roadmap) => (
            <div key={roadmap.id} className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-[#00FF88]">{roadmap.title}</h4>
                <p className="text-xs text-[#A0A0A0] mt-1">{roadmap.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roadmap.steps.map((step) => (
                  <div 
                    key={step.id} 
                    className="flex items-center gap-2.5 p-2.5 rounded-lg bg-black/40 border border-[#1E1E1E] text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={step.completed}
                      onChange={() => toggleRoadmapStep(roadmap.id, step.id)}
                      className="checkbox-emerald rounded border-[#1E1E1E]"
                    />
                    <span className={step.completed ? 'line-through text-[#A0A0A0]' : 'text-white font-medium'}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Recommended project */}
              <div className="p-4 rounded-xl bg-black border border-[#1E1E1E] space-y-2">
                <span className="text-[9px] uppercase font-bold text-[#00C853] tracking-widest">Recommended Project</span>
                {roadmap.projects.map((proj) => (
                  <div key={proj.id} className="flex justify-between items-start gap-4">
                    <div>
                      <h5 className="text-xs font-bold text-white flex items-center gap-1">
                        {proj.title}
                        <span className="text-[8px] bg-[#1E1E1E] text-[#A0A0A0] px-1 py-0.5 rounded font-normal uppercase">{proj.difficulty}</span>
                      </h5>
                      <p className="text-[10px] text-[#A0A0A0] mt-0.5 leading-relaxed">{proj.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </GlassCard>

        {/* AI Generator Panel */}
        <GlassCard className="flex flex-col justify-between border-2 border-[#00FF88]/20 bg-[#00FF88]/5">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00FF88] animate-pulse" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Skill Roadmap Builder</h3>
            </div>
            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              Input any skill topic (e.g. Rust coding, Vector Databases, Data Engineering) and our AI coach will structure a 4-phase learning plan checklist.
            </p>
          </div>

          <div className="space-y-3 pt-6">
            <input
              type="text"
              placeholder="e.g. Next.js App Router"
              value={aiRoadmapTopic}
              onChange={(e) => setAiRoadmapTopic(e.target.value)}
              className="w-full bg-black border border-[#1E1E1E] rounded-xl px-3 py-2 text-xs text-white placeholder-[#A0A0A0] focus:border-[#00FF88] focus:outline-none transition-colors"
            />
            <button
              onClick={handleGenerateAiRoadmap}
              disabled={aiLoading || !aiRoadmapTopic}
              className="w-full py-2.5 rounded-xl bg-neon-gradient text-black font-bold text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Configuring checkpoints...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Build Skill Roadmap</span>
                </>
              )}
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
