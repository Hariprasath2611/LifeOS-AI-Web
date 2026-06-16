import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bot, CheckSquare, Target, Flame, FileText, 
  GraduationCap, BarChart2, Calendar, ShieldCheck, ArrowRight, Play, Sparkles
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'assistant', text: "Hello! I am your LifeOS AI life coach. What area of your life are we optimizing today? (Try clicking a suggestion below!)" }
  ]);
  const [typing, setTyping] = useState(false);

  const handleStartFree = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleSuggestionClick = (topic: string) => {
    sendMessage(topic);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg = { sender: 'user', text };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    let reply = "I can analyze that for you! With LifeOS, we sync tasks, habits, and schedules together for high performance.";
    if (text.includes('productivity') || text.includes('focus')) {
      reply = "⚡ To double focus: I suggest starting a 25-minute Pomodoro block for your high priority tasks. Analytics show your energy peaks in the morning!";
    } else if (text.includes('habit') || text.includes('streak')) {
      reply = "🔥 Streaks create compound habits. If you check off 'Meditation' early, your brain gains momentum for harder challenges later today.";
    } else if (text.includes('goal')) {
      reply = "🎯 Let's break down 'Launch SaaS Startup' into 4 phases: 1. Mockups, 2. Frontend architecture, 3. Database APIs, 4. Launch. Plan generated!";
    }

    setChatMessages((prev) => [...prev, { sender: 'assistant', text: reply }]);
    setTyping(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden selection:bg-[#00FF88] selection:text-black">
      {/* Header / Navbar */}
      <header className="fixed top-0 inset-x-0 h-16 border-b border-[#1E1E1E] bg-[#0A0A0A]/80 backdrop-blur-md z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-neon-gradient flex items-center justify-center font-bold text-black text-lg">
            L
          </div>
          <span className="font-extrabold text-xl tracking-tight">
            LifeOS <span className="text-neon-gradient">AI</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-[#A0A0A0] hover:text-white transition-colors">
            Sign In
          </Link>
          <button 
            onClick={handleStartFree}
            className="bg-neon-gradient hover:shadow-[0_0_20px_rgba(0,255,136,0.5)] text-black px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
          >
            Start Free
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center max-w-5xl mx-auto z-10">
        {/* Glow behind hero */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-[#00FF88]/10 blur-[100px] pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00FF88]/20 bg-[#00FF88]/5 text-xs font-semibold text-[#00FF88] mb-6 animate-pulse-slow">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Productivity Hub</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
          Your AI-Powered <br />
          <span className="text-neon-gradient">Second Brain</span>
        </h1>

        <p className="text-base sm:text-xl text-[#A0A0A0] max-w-2xl mb-10 leading-relaxed">
          Manage tasks, goals, notes, learning, habits and life planning from one intelligent, unified ecosystem. Supercharge your workflow.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20 w-full justify-center">
          <button 
            onClick={handleStartFree}
            className="w-full sm:w-auto bg-neon-gradient text-black font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-[0_0_25px_rgba(0,255,136,0.4)] transition-all flex items-center justify-center gap-2 group"
          >
            <span>Start Operating Free</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <a
            href="#chat-preview"
            className="w-full sm:w-auto bg-[#111111] border border-[#1E1E1E] hover:border-[#00FF88]/50 hover:bg-[#1E1E1E]/50 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-[#00FF88] fill-current" />
            <span>Interactive Demo</span>
          </a>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="py-20 border-t border-[#1E1E1E] bg-black/40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Consolidate Your Entire Toolkit
            </h2>
            <p className="text-[#A0A0A0]">
              Replace five separate subscriptions with one intelligent environment designed for peak execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* feature 1 */}
            <div className="p-6 rounded-2xl bg-[#111111]/60 border border-[#1E1E1E] hover:border-[#00FF88]/30 transition-all space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#00FF88]/10 flex items-center justify-center border border-[#00FF88]/20">
                <Bot className="w-5 h-5 text-[#00FF88]" />
              </div>
              <h3 className="text-lg font-bold">AI Life Coaching</h3>
              <p className="text-sm text-[#A0A0A0] leading-relaxed">
                Receive proactive advice on scheduling, habit consistency, and goal breakdown milestones dynamically.
              </p>
            </div>

            {/* feature 2 */}
            <div className="p-6 rounded-2xl bg-[#111111]/60 border border-[#1E1E1E] hover:border-[#00FF88]/30 transition-all space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#00FF88]/10 flex items-center justify-center border border-[#00FF88]/20">
                <CheckSquare className="w-5 h-5 text-[#00FF88]" />
              </div>
              <h3 className="text-lg font-bold">Kanban Tasks</h3>
              <p className="text-sm text-[#A0A0A0] leading-relaxed">
                Drag, drop, and structure daily pipelines with prioritizations, recurring schedules, and auto-sorting list views.
              </p>
            </div>

            {/* feature 3 */}
            <div className="p-6 rounded-2xl bg-[#111111]/60 border border-[#1E1E1E] hover:border-[#00FF88]/30 transition-all space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#00FF88]/10 flex items-center justify-center border border-[#00FF88]/20">
                <Flame className="w-5 h-5 text-[#00FF88]" />
              </div>
              <h3 className="text-lg font-bold">Habit Streaks</h3>
              <p className="text-sm text-[#A0A0A0] leading-relaxed">
                Build long-term discipline. Monitor weekly calendars, heatmaps, streak boosts, and consistency metrics.
              </p>
            </div>

            {/* feature 4 */}
            <div className="p-6 rounded-2xl bg-[#111111]/60 border border-[#1E1E1E] hover:border-[#00FF88]/30 transition-all space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#00FF88]/10 flex items-center justify-center border border-[#00FF88]/20">
                <Target className="w-5 h-5 text-[#00FF88]" />
              </div>
              <h3 className="text-lg font-bold">Goals & Milestones</h3>
              <p className="text-sm text-[#A0A0A0] leading-relaxed">
                Plan short-term objectives and 5-year visions. Break down action plans with nested milestones and rings.
              </p>
            </div>

            {/* feature 5 */}
            <div className="p-6 rounded-2xl bg-[#111111]/60 border border-[#1E1E1E] hover:border-[#00FF88]/30 transition-all space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#00FF88]/10 flex items-center justify-center border border-[#00FF88]/20">
                <FileText className="w-5 h-5 text-[#00FF88]" />
              </div>
              <h3 className="text-lg font-bold">Smart Markdown Notes</h3>
              <p className="text-sm text-[#A0A0A0] leading-relaxed">
                An elegant workspace editor for knowledge management, notes categorization, and AI summarizing tools.
              </p>
            </div>

            {/* feature 6 */}
            <div className="p-6 rounded-2xl bg-[#111111]/60 border border-[#1E1E1E] hover:border-[#00FF88]/30 transition-all space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#00FF88]/10 flex items-center justify-center border border-[#00FF88]/20">
                <GraduationCap className="w-5 h-5 text-[#00FF88]" />
              </div>
              <h3 className="text-lg font-bold">Learning Roadmaps</h3>
              <p className="text-sm text-[#A0A0A0] leading-relaxed">
                Log study sessions with Pomodoro widgets, map custom skill progress bars, and check projects list.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO (AI SHOWCASE) */}
      <section id="chat-preview" className="py-20 border-t border-[#1E1E1E] px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold mb-3">Interactive AI Preview</h2>
          <p className="text-[#A0A0A0] text-sm">Ask about goals, focus, or streaks below and see the AI in action.</p>
        </div>

        {/* Chat UI Card */}
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[480px]">
          {/* Chat Header */}
          <div className="bg-black/50 border-b border-[#1E1E1E] px-6 py-4 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#00FF88] animate-ping" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">LifeOS Virtual Assistant</p>
              <p className="text-[10px] text-[#A0A0A0]">Online - Context Active</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {chatMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
              >
                <div 
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-neon-gradient text-black font-medium' 
                      : 'bg-[#1E1E1E] text-white border border-white/5'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-[#1E1E1E] text-[#A0A0A0] text-xs rounded-2xl px-4 py-3 flex items-center gap-1">
                  <span>AI Coach is compiling advice</span>
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="px-6 py-2 border-t border-[#1E1E1E]/40 flex flex-wrap gap-2 bg-black/10">
            <button 
              onClick={() => handleSuggestionClick("How can I improve my productivity score?")}
              className="text-xs border border-[#1E1E1E] hover:border-[#00FF88] hover:text-[#00FF88] px-3 py-1.5 rounded-full transition-all text-[#A0A0A0]"
            >
              🚀 Double focus score
            </button>
            <button 
              onClick={() => handleSuggestionClick("Give me a milestone breakdown for my career goals.")}
              className="text-xs border border-[#1E1E1E] hover:border-[#00FF88] hover:text-[#00FF88] px-3 py-1.5 rounded-full transition-all text-[#A0A0A0]"
            >
              🎯 Breakdown career goals
            </button>
            <button 
              onClick={() => handleSuggestionClick("Why are habit streaks important?")}
              className="text-xs border border-[#1E1E1E] hover:border-[#00FF88] hover:text-[#00FF88] px-3 py-1.5 rounded-full transition-all text-[#A0A0A0]"
            >
              🔥 Streak analytics
            </button>
          </div>

          {/* Chat Input */}
          <div className="border-t border-[#1E1E1E] p-4 bg-black/40 flex items-center gap-3">
            <input
              type="text"
              placeholder="Ask the coach anything..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(chatInput)}
              className="flex-1 bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl px-4 py-2 text-sm text-white placeholder-[#A0A0A0] focus:border-[#00FF88] focus:outline-none focus:ring-1 focus:ring-[#00FF88]/40 transition-colors"
            />
            <button
              onClick={() => sendMessage(chatInput)}
              className="bg-[#00C853] hover:bg-[#00FF88] text-black font-bold px-4 py-2 rounded-xl text-sm transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section className="py-20 border-t border-[#1E1E1E] bg-black/40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-[#A0A0A0]">Start free and scale as you unlock more capabilities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="p-8 rounded-2xl bg-[#111111] border border-[#1E1E1E] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2 text-[#A0A0A0]">Starter</h3>
                <p className="text-3xl font-extrabold mb-4">$0 <span className="text-sm font-normal text-[#A0A0A0]">/ month</span></p>
                <ul className="space-y-3 text-sm text-[#A0A0A0] mb-8">
                  <li className="flex items-center gap-2">✓ Kanban Tasks & Lists</li>
                  <li className="flex items-center gap-2">✓ Up to 3 active habits</li>
                  <li className="flex items-center gap-2">✓ Up to 2 milestones goals</li>
                  <li className="flex items-center gap-2">✓ Basic Markdown notes</li>
                </ul>
              </div>
              <button onClick={handleStartFree} className="w-full py-3 rounded-xl border border-[#1E1E1E] hover:border-white transition-colors text-sm font-semibold">
                Start Free
              </button>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-2xl bg-[#111111] border-2 border-[#00FF88] flex flex-col justify-between relative shadow-[0_0_30px_rgba(0,255,136,0.1)]">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-neon-gradient text-black text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Recommended
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Productivity Pro</h3>
                <p className="text-3xl font-extrabold mb-4">$12 <span className="text-sm font-normal text-[#A0A0A0]">/ month</span></p>
                <ul className="space-y-3 text-sm text-[#A0A0A0] mb-8">
                  <li className="flex items-center gap-2 text-white">✓ Unlimited Tasks, Habits, Notes</li>
                  <li className="flex items-center gap-2 text-white">✓ Full AI Assistant Integration</li>
                  <li className="flex items-center gap-2 text-white">✓ Skills Roadmaps & Timelines</li>
                  <li className="flex items-center gap-2 text-white">✓ High-Fidelity Charts & Analytics</li>
                  <li className="flex items-center gap-2 text-white">✓ Keyboard Shortcuts & Syncing</li>
                </ul>
              </div>
              <button onClick={handleStartFree} className="w-full py-3 rounded-xl bg-neon-gradient text-black font-bold text-sm shadow-[0_0_20px_rgba(0,255,136,0.35)] transition-all">
                Get Pro Access
              </button>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-2xl bg-[#111111] border border-[#1E1E1E] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2 text-[#A0A0A0]">Life Team</h3>
                <p className="text-3xl font-extrabold mb-4">$36 <span className="text-sm font-normal text-[#A0A0A0]">/ month</span></p>
                <ul className="space-y-3 text-sm text-[#A0A0A0] mb-8">
                  <li className="flex items-center gap-2">✓ Shared team goals & roadmaps</li>
                  <li className="flex items-center gap-2">✓ Advanced API integrations</li>
                  <li className="flex items-center gap-2">✓ Multi-member workspaces</li>
                  <li className="flex items-center gap-2">✓ Priority support</li>
                </ul>
              </div>
              <button onClick={handleStartFree} className="w-full py-3 rounded-xl border border-[#1E1E1E] hover:border-white transition-colors text-sm font-semibold">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 border-t border-[#1E1E1E] px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-[#111111] border border-[#1E1E1E] space-y-2">
            <h4 className="font-semibold text-white">What is a personal life operating system?</h4>
            <p className="text-sm text-[#A0A0A0]">
              It is an integrated digital ecosystem combining tasks, milestones, habits, notes, and coaching so you do not waste cognitive energy switching between separate siloed apps.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-[#111111] border border-[#1E1E1E] space-y-2">
            <h4 className="font-semibold text-white">How does the AI Coaching model work?</h4>
            <p className="text-sm text-[#A0A0A0]">
              The assistant reviews your checked habits, completed tasks, and learning logs to generate dynamic, contextual suggestions for time blocks, priority delegation, and consistency tracking.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-[#111111] border border-[#1E1E1E] space-y-2">
            <h4 className="font-semibold text-white">Is my data secure and exportable?</h4>
            <p className="text-sm text-[#A0A0A0]">
              Absolutely. All data resides in encrypted cloud layers. You can go to the Settings panel at any time to export a full JSON dump of your entire productivity database.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1E1E1E] bg-[#0A0A0A] py-12 px-4 sm:px-6 lg:px-8 text-center text-xs text-[#A0A0A0]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-neon-gradient flex items-center justify-center font-bold text-black text-xs">L</div>
            <span className="font-bold text-white">LifeOS AI</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support Desk</a>
          </div>
          <p>© 2026 LifeOS AI. Powered by Advanced Agentic Coding.</p>
        </div>
      </footer>
    </div>
  );
};
