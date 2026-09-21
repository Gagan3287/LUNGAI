'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  UploadCloud,
  Users,
  History,
  FileText,
  Sparkles,
  Settings,
  Activity,
  Zap,
  ChevronRight,
  X,
} from 'lucide-react';
import { CURRENT_DOCTOR } from '@/lib/mockData';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/workstation', icon: LayoutDashboard },
  { name: 'Scan & Upload', href: '/upload', icon: UploadCloud },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'Analysis History', href: '/history', icon: History },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'AI Insights', href: '/insights', icon: Sparkles },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  /** Whether the mobile drawer is open. Ignored on lg+ (always visible). */
  isOpen: boolean;
  /** Close the mobile drawer. */
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Close drawer whenever the route changes (handles nav-link clicks on mobile)
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {/* ── Mobile backdrop (only rendered while drawer is open on < lg) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/*
        ── Sidebar panel ──
        Desktop (lg+): always fixed on-screen. Ignores isOpen.
        Mobile (<lg): translates off-screen when closed, slides in when isOpen.
      */}
      <aside
        className={`
          w-64 h-screen fixed left-0 top-0 z-40
          bg-[#080c14]/95 backdrop-blur-xl
          border-r border-cyan-500/15
          flex flex-col justify-between p-4 overflow-y-auto select-none
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
        aria-label="Main navigation"
      >
        <div>
          {/* Mobile close button (visible only on small screens) */}
          <div className="lg:hidden flex justify-end mb-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo Header */}
          <Link
            href="/workstation"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-4 mb-6 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-400/50 transition-all duration-300">
              <Activity className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-wider text-white flex items-center gap-1">
                LUNG<span className="text-cyan-400 text-glow-cyan">AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">AI Chest Disease Detection</p>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="space-y-1.5" aria-label="Sidebar navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveGlow"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_12px_#00f0ff]"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive
                        ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]'
                        : 'group-hover:text-cyan-300'
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Upgrade & Doctor Badge */}
        <div className="space-y-4 pt-4 border-t border-slate-800/60">
          {/* Upgrade Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900/80 border border-cyan-500/20 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all" />
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
              <Zap className="w-4 h-4 fill-cyan-400 text-cyan-400" />
              <span>Upgrade to Pro</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight mb-2.5">
              Unlock advanced AI insights &amp; unlimited scans.
            </p>
            <button className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 shadow-md shadow-blue-500/20 flex items-center justify-center gap-1 group-hover:shadow-cyan-500/30">
              Upgrade Now
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Doctor Profile Chip */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
            <img
              src={CURRENT_DOCTOR.avatarUrl}
              alt={CURRENT_DOCTOR.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-cyan-500/40"
            />
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold text-white truncate">{CURRENT_DOCTOR.name}</h4>
              <p className="text-[10px] text-cyan-400 truncate">{CURRENT_DOCTOR.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
