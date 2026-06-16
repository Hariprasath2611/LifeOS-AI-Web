import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, User, Shield, Bell, Sparkles, 
  Share2, Download, CheckCircle2, AlertCircle, Save 
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';
import { useGoalStore } from '../store/goalStore';
import { useHabitStore } from '../store/habitStore';
import { useNoteStore } from '../store/noteStore';
import { useLearningStore } from '../store/learningStore';
import { useAiStore } from '../store/aiStore';
import { GlassCard } from '../components/GlassCard';

type TabType = 'profile' | 'security' | 'notifications' | 'ai_preferences' | 'connected_accounts' | 'data_export';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { user, updateProfile } = useAuthStore() as any; // mock cast

  // Profile Form States
  const [displayName, setDisplayName] = useState(user?.displayName || 'LifeOS Developer');
  const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop');

  // AI Preferences
  const [aiStyle, setAiStyle] = useState('direct');
  const [responseLength, setResponseLength] = useState('concise');

  // Notification states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);

  // Security Form States
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate updating profile in store
    const authStore = useAuthStore.getState();
    if (authStore.user) {
      const updatedUser = {
        ...authStore.user,
        displayName,
        photoURL: avatarUrl,
      };
      localStorage.setItem('lifeos_user', JSON.stringify(updatedUser));
      // Re-initialize to update global state
      authStore.initialize();
      triggerSuccess("Profile details saved successfully.");
    }
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setPassword('');
    setConfirmPassword('');
    triggerSuccess("Security credentials saved successfully.");
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSuccess("AI coaching parameters saved successfully.");
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Compile and Export Data
  const handleExportData = () => {
    const backupData = {
      user: useAuthStore.getState().user,
      tasks: useTaskStore.getState().tasks,
      goals: useGoalStore.getState().goals,
      habits: useHabitStore.getState().habits,
      notes: useNoteStore.getState().notes,
      skills: useLearningStore.getState().skills,
      studySessions: useLearningStore.getState().pomodoroMinutes,
      conversations: useAiStore.getState().conversations,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `LifeOS_AI_Export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerSuccess("Database JSON compiled and download triggered!");
  };

  const tabs: { type: TabType; label: string; icon: React.ReactNode }[] = [
    { type: 'profile', label: 'Profile Settings', icon: <User className="w-4 h-4" /> },
    { type: 'security', label: 'Account Security', icon: <Shield className="w-4 h-4" /> },
    { type: 'notifications', label: 'Notifications Alerts', icon: <Bell className="w-4 h-4" /> },
    { type: 'ai_preferences', label: 'AI Customizations', icon: <Sparkles className="w-4 h-4" /> },
    { type: 'connected_accounts', label: 'Integrations Sync', icon: <Share2 className="w-4 h-4" /> },
    { type: 'data_export', label: 'Database Backup', icon: <Download className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white">System Settings</h2>
        <p className="text-xs text-[#A0A0A0]">Configure profile configurations, notification parameters, and custom AI coach weights.</p>
      </div>

      {/* Success Messages alert */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-[#00E676]/10 border border-[#00E676]/30 flex items-center gap-2.5 text-xs text-[#00E676] animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* LAYOUT CONTAINER */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-[450px]">
        
        {/* TABS SIDEBAR */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.type}
              onClick={() => setActiveTab(tab.type)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold border transition-all text-left ${
                activeTab === tab.type
                  ? 'bg-neon-gradient border-none text-black font-bold shadow-md'
                  : 'bg-black/20 border-transparent text-[#A0A0A0] hover:text-white hover:bg-[#1E1E1E]/40'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB BODY PANE */}
        <GlassCard className="flex-1">
          
          {/* PROFILE PANEL */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <h3 className="text-sm font-bold text-white uppercase border-b border-[#1E1E1E] pb-2">Profile Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#A0A0A0] uppercase">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-black border border-[#1E1E1E] rounded-xl px-4 py-2 text-xs text-white focus:border-[#00FF88] outline-none"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#A0A0A0] uppercase">Avatar Image URL</label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full bg-black border border-[#1E1E1E] rounded-xl px-4 py-2 text-xs text-white focus:border-[#00FF88] outline-none"
                  />
                </div>
              </div>

              {/* Preview Avatar Image */}
              <div className="flex items-center gap-3 pt-2">
                <img src={avatarUrl} alt="Avatar Preview" className="w-12 h-12 rounded-full object-cover border border-[#00FF88]" />
                <span className="text-xs text-[#A0A0A0]">Avatar image preview</span>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-neon-gradient text-black font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile details</span>
              </button>
            </form>
          )}

          {/* SECURITY PANEL */}
          {activeTab === 'security' && (
            <form onSubmit={handleSaveSecurity} className="space-y-6">
              <h3 className="text-sm font-bold text-white uppercase border-b border-[#1E1E1E] pb-2">Update Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#A0A0A0] uppercase">New Password</label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black border border-[#1E1E1E] rounded-xl px-4 py-2 text-xs text-white focus:border-[#00FF88] outline-none"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#A0A0A0] uppercase">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Verify new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-black border border-[#1E1E1E] rounded-xl px-4 py-2 text-xs text-white focus:border-[#00FF88] outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-neon-gradient text-black font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Security Settings</span>
              </button>
            </form>
          )}

          {/* NOTIFICATIONS PANEL */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-white uppercase border-b border-[#1E1E1E] pb-2">System Alerts Toggles</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-[#1E1E1E]">
                  <div>
                    <span className="text-xs font-semibold text-white block">Email Summaries</span>
                    <span className="text-[10px] text-[#A0A0A0]">Receive weekly digest performance summaries.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="checkbox-emerald rounded border-[#1E1E1E]"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-[#1E1E1E]">
                  <div>
                    <span className="text-xs font-semibold text-white block">Push Notifications</span>
                    <span className="text-[10px] text-[#A0A0A0]">Receive desktop browser alert reminders.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushAlerts}
                    onChange={(e) => setPushAlerts(e.target.checked)}
                    className="checkbox-emerald rounded border-[#1E1E1E]"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-[#1E1E1E]">
                  <div>
                    <span className="text-xs font-semibold text-white block">Streaks Alerts</span>
                    <span className="text-[10px] text-[#A0A0A0]">Alert me before daily habit streaks lapse.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={streakReminders}
                    onChange={(e) => setStreakReminders(e.target.checked)}
                    className="checkbox-emerald rounded border-[#1E1E1E]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* AI CUSTOMIZATIONS PANEL */}
          {activeTab === 'ai_preferences' && (
            <form onSubmit={handleSavePreferences} className="space-y-6">
              <h3 className="text-sm font-bold text-white uppercase border-b border-[#1E1E1E] pb-2">AI Coaching Style Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#A0A0A0] uppercase">Coaching Tone/Personality</label>
                  <select
                    value={aiStyle}
                    onChange={(e) => setAiStyle(e.target.value)}
                    className="w-full bg-black border border-[#1E1E1E] rounded-xl px-4 py-2 text-xs text-white focus:border-[#00FF88] outline-none"
                  >
                    <option value="direct">Direct & Objective (Linear)</option>
                    <option value="empathetic">Empathetic & Warm (Coaching)</option>
                    <option value="aggressive">Aggressive & Strict (Hard Goggins style)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#A0A0A0] uppercase">Response Detail Length</label>
                  <select
                    value={responseLength}
                    onChange={(e) => setResponseLength(e.target.value)}
                    className="w-full bg-black border border-[#1E1E1E] rounded-xl px-4 py-2 text-xs text-white focus:border-[#00FF88] outline-none"
                  >
                    <option value="concise">Concise & Bullet Points (Fast)</option>
                    <option value="elaborate">Deep Dive & Analysis summaries</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-neon-gradient text-black font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save preferences</span>
              </button>
            </form>
          )}

          {/* CONNECTED ACCOUNTS */}
          {activeTab === 'connected_accounts' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-white uppercase border-b border-[#1E1E1E] pb-2">Integrations Sync</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-[#1E1E1E]">
                  <span className="text-xs font-semibold text-white">Google Calendar API</span>
                  <span className="text-[10px] bg-[#00FF88]/15 text-[#00FF88] px-2 py-0.5 rounded font-bold">Connected</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-[#1E1E1E]">
                  <span className="text-xs font-semibold text-white">Firebase Authentication</span>
                  <span className="text-[10px] bg-[#00FF88]/15 text-[#00FF88] px-2 py-0.5 rounded font-bold">Active</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-black/40 border border-[#1E1E1E]">
                  <span className="text-xs font-semibold text-white">GitHub Integration</span>
                  <button className="text-[10px] text-[#00FF88] hover:underline font-bold">Connect Account</button>
                </div>
              </div>
            </div>
          )}

          {/* DATA EXPORT PANEL */}
          {activeTab === 'data_export' && (
            <div className="space-y-6">
              <div className="border-b border-[#1E1E1E] pb-2">
                <h3 className="text-sm font-bold text-white uppercase">Data Privacy & Export</h3>
              </div>
              <div className="p-4 rounded-xl bg-[#FFC107]/10 border border-[#FFC107]/20 flex gap-3 text-xs text-[#FFC107] leading-relaxed">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>
                  Export compiles your entire database (user profile parameters, checklists, calendar schedules, habit streaks, markdown notes, roadmap states, and conversation logs) into a single standard JSON backup file. Keep this file secure as it contains sensitive daily tracking profiles.
                </p>
              </div>

              <button
                onClick={handleExportData}
                className="px-5 py-3 rounded-xl bg-neon-gradient text-black font-bold text-xs flex items-center gap-2 shadow-lg hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Compile & Download JSON Backup</span>
              </button>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
