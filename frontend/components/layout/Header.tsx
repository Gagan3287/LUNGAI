'use client';

import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, Menu, AlertCircle } from 'lucide-react';
import { CURRENT_DOCTOR } from '@/lib/mockData';
import { useTheme } from '@/components/theme/ThemeProvider';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export default function Header({ onToggleMobileMenu }: HeaderProps) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-20 bg-[#080c14]/80 backdrop-blur-xl border-b border-cyan-500/15 sticky top-0 z-30 px-6 flex items-center justify-between gap-4 transition-colors duration-300">
      {/* Left: Welcome & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Welcome back, {CURRENT_DOCTOR.name.split(' ')[1] || 'Doctor'}! 👋
          </h2>
          <p className="text-xs text-slate-400">AI-Powered Chest X-ray Analysis Platform</p>
        </div>
      </div>

      {/* Center/Right: Research Disclaimer Tag & Controls */}
      <div className="flex items-center gap-4">
        {/* Regulatory Scope Disclaimer Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Research Prototype • Not for Clinical Use</span>
        </div>

        {/* Global Search */}
        <div className="relative hidden md:block w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient or report..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
          />
        </div>

        {/* Notifications Button */}
        <button className="relative p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
        </button>

        {/* Theme Toggle (Dark/Light Mode) */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all cursor-pointer"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Dark/Light Theme"
        >
          {isDarkMode ? (
            <Moon className="w-4 h-4 text-cyan-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>
      </div>
    </header>
  );
}
