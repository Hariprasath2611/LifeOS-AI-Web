import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, MessageSquare, Plus, Trash2, Send, Mic, Paperclip, 
  Sparkles, CheckSquare, Target, Flame, ChevronRight 
} from 'lucide-react';
import { useAiStore, Conversation } from '../store/aiStore';
import { GlassCard } from '../components/GlassCard';

export const AIAssistant: React.FC = () => {
  const { 
    conversations, activeConversationId, typing, 
    createConversation, setActiveConversationId, deleteConversation, sendMessage 
  } = useAiStore();

  const [input, setInput] = useState('');
  const [voiceActive, setVoiceActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConversationId);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConv?.messages, typing]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const textToSend = input;
    setInput('');
    await sendMessage(textToSend);
  };

  const handleNewConversation = () => {
    const titles = ['Daily Routine Review', 'Skill Gap Analysis', 'Life Coach Roadmap', 'Mindset Journaling'];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    createConversation(randomTitle);
  };

  const handleSuggestionClick = (prompt: string) => {
    setInput(prompt);
  };

  const toggleVoiceMock = () => {
    setVoiceActive(!voiceActive);
    if (!voiceActive) {
      setTimeout(() => {
        setInput("Summarize my habit streaks for this week.");
        setVoiceActive(false);
      }, 2000);
    }
  };

  const starterPrompts = [
    { text: "Break down my goal 'Launch SaaS Startup' into milestones", icon: <Target className="w-4 h-4 text-purple-400" /> },
    { text: "Provide suggestions to improve my habit consistency score", icon: <Flame className="w-4 h-4 text-orange-400" /> },
    { text: "Create a personalized learning roadmap for learning vector embeddings", icon: <Bot className="w-4 h-4 text-[#00FF88]" /> }
  ];

  return (
    <div className="h-[calc(100vh-8.5rem)] flex bg-[#111111]/40 border border-[#1E1E1E] rounded-2xl overflow-hidden animate-in fade-in duration-200">
      
      {/* LEFT COLUMN: Conversation List */}
      <div className="hidden md:flex flex-col w-72 border-r border-[#1E1E1E] bg-[#0A0A0A]/40 justify-between">
        <div className="p-4 flex-1 flex flex-col min-h-0 space-y-4">
          <button 
            onClick={handleNewConversation}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neon-gradient hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] text-black text-xs font-bold transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat Session</span>
          </button>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            <span className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider px-2 block mb-2">History</span>
            {conversations.map((c) => {
              const isActive = c.id === activeConversationId;
              return (
                <div 
                  key={c.id} 
                  className={`group flex items-center justify-between p-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    isActive 
                      ? 'bg-[#1E1E1E] text-white border-l-2 border-[#00FF88]' 
                      : 'text-[#A0A0A0] hover:text-white hover:bg-[#1E1E1E]/40'
                  }`}
                  onClick={() => setActiveConversationId(c.id)}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className={`w-3.5 h-3.5 ${isActive ? 'text-[#00FF88]' : 'text-[#A0A0A0]'}`} />
                    <span className="truncate">{c.title}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(c.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-[#FF5252] rounded transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-[#1E1E1E] bg-black/20 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-[#00FF88] uppercase tracking-wider animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Virtual Coach Online</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Chat View */}
      <div className="flex-1 flex flex-col justify-between bg-black/20">
        
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Helper when conversation starts */}
          {activeConv && activeConv.messages.length === 1 && (
            <div className="max-w-2xl mx-auto space-y-6 pt-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/20 flex items-center justify-center mx-auto text-[#00FF88]">
                  <Bot className="w-6 h-6 animate-float" />
                </div>
                <h2 className="text-lg font-bold text-white">How can I help you, Master?</h2>
                <p className="text-xs text-[#A0A0A0]">Select a prompt or ask me to analyze your dashboard tasks, habits and calendar.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {starterPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(prompt.text)}
                    className="p-4 rounded-xl border border-[#1E1E1E] hover:border-[#00FF88]/40 hover:bg-[#1E1E1E]/40 text-left text-xs text-[#A0A0A0] hover:text-white transition-all space-y-2 flex flex-col justify-between h-28"
                  >
                    <div className="p-1 rounded-md bg-black/40 border border-[#1E1E1E] w-fit">
                      {prompt.icon}
                    </div>
                    <span className="leading-relaxed truncate-2-lines">{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actual Chat Logs */}
          <div className="max-w-3xl mx-auto space-y-4">
            {activeConv?.messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Icon */}
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold ${
                      isUser ? 'bg-black/60 border border-[#1E1E1E]' : 'bg-[#00FF88]/15 border border-[#00FF88]/40 text-[#00FF88]'
                    }`}>
                      {isUser ? 'ME' : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Text block */}
                    <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed border ${
                      isUser 
                        ? 'bg-neon-gradient text-black font-semibold border-none shadow-[0_0_15px_rgba(0,255,136,0.15)]' 
                        : 'bg-[#111111]/80 text-white border-[#1E1E1E]'
                    }`}>
                      <p className="whitespace-pre-line">{m.text}</p>
                      <span className={`block text-[9px] mt-1 text-right ${isUser ? 'text-black/60' : 'text-[#A0A0A0]'}`}>
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {typing && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%] items-center">
                  <div className="w-8 h-8 rounded-full shrink-0 bg-[#00FF88]/15 border border-[#00FF88]/40 text-[#00FF88] flex items-center justify-center">
                    <Bot className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl px-4 py-2.5 text-xs text-[#A0A0A0] flex items-center gap-1.5">
                    <span>AI Coach is processing context memories</span>
                    <span className="animate-bounce font-bold text-[#00FF88]">.</span>
                    <span className="animate-bounce delay-150 font-bold text-[#00FF88]">.</span>
                    <span className="animate-bounce delay-300 font-bold text-[#00FF88]">.</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Controls */}
        <div className="border-t border-[#1E1E1E] bg-[#111111]/40 p-4 sticky bottom-0">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            
            {/* Mock Attachment Option */}
            <button 
              className="p-2.5 rounded-xl border border-[#1E1E1E] bg-[#0A0A0A]/40 text-[#A0A0A0] hover:text-white hover:border-[#00FF88]/30 transition-all shrink-0"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Main Input field */}
            <input
              type="text"
              placeholder={voiceActive ? "Listening (speak clearly)..." : "Ask about goals, schedules, roadmaps..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#A0A0A0] focus:border-[#00FF88] focus:outline-none transition-colors"
            />

            {/* Microphone Option */}
            <button 
              onClick={toggleVoiceMock}
              className={`p-2.5 rounded-xl border transition-all shrink-0 ${
                voiceActive 
                  ? 'bg-[#FF5252]/10 border-[#FF5252]/40 text-[#FF5252] animate-pulse' 
                  : 'border-[#1E1E1E] bg-[#0A0A0A]/40 text-[#A0A0A0] hover:text-white hover:border-[#00FF88]/30'
              }`}
              title="Voice Prompt"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Send Option */}
            <button
              onClick={handleSend}
              className="bg-neon-gradient hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] text-black font-bold p-2.5 rounded-xl transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
