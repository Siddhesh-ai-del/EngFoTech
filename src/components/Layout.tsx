import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  RotateCcw,
  LayoutDashboard,
  FileText,
  MessageSquare,
  Compass,
  Moon,
  Sun,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  /** Clears the visitor's saved profile and analysis, returning to onboarding. */
  onStartOver: () => void;
}

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Roadmap', path: '/roadmap', icon: Compass },
  { name: 'Resume Analyzer', path: '/resume', icon: FileText },
  { name: 'Mock Interview', path: '/interview', icon: MessageSquare },
];

/** Follow the OS appearance until the visitor picks a side explicitly. */
function initialIsDark(): boolean {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark') return true;
  if (stored === 'light') return false;
  return typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false;
}

export const Layout: React.FC<LayoutProps> = ({ children, onStartOver }) => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(initialIsDark);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <div className="min-h-screen bg-canvas text-label">
      {/* Functional layer — the app's only glass surface (liquid-glass.md). */}
      <header className="glass-bar sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6 min-w-0">
            <Link to="/" className="flex flex-col leading-none py-1">
              <span className="text-[17px] font-semibold text-label tracking-[-0.02em]">
                EngFoTech
              </span>
              <span className="text-[11px] text-label-2 mt-0.5">Engineers Forward</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-2 px-3 h-9 rounded-[10px] text-[14px] font-medium transition-colors duration-150 ${
                      isActive
                        ? 'text-accent bg-inset'
                        : 'text-label-2 hover:text-label hover:bg-inset/60'
                    }`}
                  >
                    <Icon size={16} strokeWidth={isActive ? 2.25 : 2} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsDark(!isDark)}
              className="btn-icon"
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDark ? 'Light theme' : 'Dark theme'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={onStartOver}
              className="btn-icon hover:text-red-text"
              title="Start over — clears your saved profile and roadmap from this browser"
              aria-label="Start over"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Brief, functional entrance only — motion.md › Aim for brevity. */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
