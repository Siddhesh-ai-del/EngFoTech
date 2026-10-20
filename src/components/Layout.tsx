import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, LayoutDashboard, FileText, MessageSquare, Compass, Moon, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  /** Clears the visitor's saved profile and analysis, returning to onboarding. */
  onStartOver: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onStartOver }) => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Roadmap', path: '/roadmap', icon: Compass },
    { name: 'Resume Analyzer', path: '/resume', icon: FileText },
    { name: 'Mock Interview', path: '/interview', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex flex-col">
              <h1 className="text-lg font-black text-dark-blue dark:text-white tracking-tighter leading-none">
                EngFoTech
              </h1>
              <p className="text-[7px] uppercase tracking-[0.2em] text-dark-blue dark:text-white/40 font-black mt-0.5">Engineers Forward</p>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-dark-blue dark:bg-slate-50 text-white dark:text-dark-blue shadow-sm' 
                        : 'text-dark-blue dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-dark-blue dark:hover:text-white'
                    }`}
                  >
                    <Icon size={14} className={isActive ? (isDark ? 'text-dark-blue' : 'text-white') : (isDark ? 'text-slate-400' : 'text-dark-blue')} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
               onClick={() => setIsDark(!isDark)}
               className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-dark-blue dark:text-slate-400 hover:text-dark-blue dark:hover:text-white transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-100 dark:border-slate-800">
              <p className="text-[7px] text-dark-blue/50 dark:text-white/30 font-medium uppercase tracking-widest hidden sm:block">
                Saved in this browser
              </p>
            </div>

            <button
              onClick={onStartOver}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all duration-300"
              title="Start over — clears your saved profile and roadmap"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
