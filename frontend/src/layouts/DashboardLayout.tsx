import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Bot, CheckSquare, Target, Flame, 
  FileText, GraduationCap, BarChart2, Calendar as CalendarIcon, 
  Settings, LogOut, Menu, Bell, Search, X, User as UserIcon
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { SearchEverywhere } from '../components/SearchEverywhere';
import { NotificationCenter } from '../components/NotificationCenter';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Close menus on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  // Handle Ctrl+K / Cmd+K search shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'AI Assistant', path: '/assistant', icon: <Bot className="w-5 h-5" /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare className="w-5 h-5" /> },
    { name: 'Goals', path: '/goals', icon: <Target className="w-5 h-5" /> },
    { name: 'Habits', path: '/habits', icon: <Flame className="w-5 h-5" /> },
    { name: 'Notes', path: '/notes', icon: <FileText className="w-5 h-5" /> },
    { name: 'Learning Hub', path: '/learning', icon: <GraduationCap className="w-5 h-5" /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart2 className="w-5 h-5" /> },
    { name: 'Calendar', path: '/calendar', icon: <CalendarIcon className="w-5 h-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const getPageTitle = () => {
    const activeItem = menuItems.find(item => item.path === location.pathname);
    return activeItem ? activeItem.name : 'LifeOS AI';
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Search Everywhere Overlay Dialog */}
      <SearchEverywhere isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#1E1E1E] bg-[#111111]/80 backdrop-blur-md sticky top-0 h-screen p-4 justify-between z-20">
        <div>
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 px-3 py-4 mb-6">
            <div className="w-8 h-8 rounded-lg bg-neon-gradient flex items-center justify-center font-bold text-black text-lg shadow-[0_0_15px_rgba(0,255,136,0.3)]">
              L
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              LifeOS <span className="text-neon-gradient">AI</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                    isActive 
                      ? 'bg-neon-gradient text-black font-semibold shadow-[0_0_15px_rgba(0,255,136,0.15)]' 
                      : 'text-[#A0A0A0] hover:text-white hover:bg-[#1E1E1E]/50'
                  }`}
                >
                  <div className={isActive ? 'text-black' : 'text-[#A0A0A0] group-hover:text-[#00FF88] transition-colors'}>
                    {item.icon}
                  </div>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer profile info & Logout */}
        <div className="border-t border-[#1E1E1E] pt-4 space-y-3">
          <div className="flex items-center gap-3 px-3 py-1">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Avatar" 
                className="w-9 h-9 rounded-full object-cover border border-[#00FF88]/40"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#1E1E1E] flex items-center justify-center border border-[#1E1E1E]">
                <UserIcon className="w-4 h-4 text-[#A0A0A0]" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.displayName || 'LifeOS User'}</p>
              <p className="text-[10px] text-[#A0A0A0] truncate">{user?.email || 'user@lifeos.ai'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#FF5252] hover:bg-[#FF5252]/10 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <aside 
            className="w-64 bg-[#111111] border-r border-[#1E1E1E] h-full p-4 flex flex-col justify-between animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Logo / Header */}
              <div className="flex items-center justify-between mb-8">
                <Link to="/dashboard" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-neon-gradient flex items-center justify-center font-bold text-black text-lg">
                    L
                  </div>
                  <span className="font-extrabold text-xl text-white">LifeOS AI</span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="text-[#A0A0A0] hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-neon-gradient text-black font-semibold' 
                          : 'text-[#A0A0A0] hover:text-white hover:bg-[#1E1E1E]/50'
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Footer */}
            <div className="border-t border-[#1E1E1E] pt-4 space-y-3">
              <div className="flex items-center gap-3 px-3">
                <div className="w-9 h-9 rounded-full bg-[#1E1E1E] flex items-center justify-center border border-[#1E1E1E]">
                  <UserIcon className="w-4 h-4 text-[#A0A0A0]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate">{user?.displayName || 'LifeOS User'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#FF5252] hover:bg-[#FF5252]/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* MAIN VIEW WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP NAVBAR */}
        <header className="h-16 border-b border-[#1E1E1E] bg-[#111111]/30 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-[#A0A0A0] hover:text-white p-1 rounded hover:bg-[#1E1E1E]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-white hidden sm:block">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Mock Global Search Bar (opens search dialog) */}
            <button 
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1E1E1E] bg-black/40 text-[#A0A0A0] text-xs hover:border-[#00FF88]/40 transition-colors w-48 lg:w-64"
            >
              <Search className="w-4 h-4 text-[#A0A0A0]" />
              <span className="flex-1 text-left">Search everything...</span>
              <kbd className="bg-[#1E1E1E] px-1 py-0.5 rounded text-[10px] text-white">Ctrl K</kbd>
            </button>
            
            <button 
              onClick={() => setSearchOpen(true)}
              className="md:hidden text-[#A0A0A0] hover:text-white p-2 rounded-lg hover:bg-[#1E1E1E]/50 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications Trigger */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen((prev) => !prev)}
                className="text-[#A0A0A0] hover:text-white p-2 rounded-lg hover:bg-[#1E1E1E]/50 transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#00FF88] rounded-full border border-[#0A0A0A]" />
              </button>
              
              <NotificationCenter isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
            </div>

            {/* Profile trigger linking directly to Settings */}
            <Link 
              to="/settings"
              className="w-8 h-8 rounded-full bg-[#1E1E1E] flex items-center justify-center border border-[#1E1E1E] hover:border-[#00FF88] transition-colors"
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <UserIcon className="w-4 h-4 text-[#A0A0A0]" />
              )}
            </Link>
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
