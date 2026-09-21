'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, AlertTriangle, Sparkles, ChevronDown } from 'lucide-react';
import { DashboardStats } from '@/lib/types';
import { StatCardSkeleton } from '@/components/ui/SkeletonBlock';

interface StatCardsProps {
  stats: DashboardStats;
  /** When true, renders skeleton placeholders instead of real cards. */
  isLoading?: boolean;
}

export default function StatCards({ stats, isLoading = false }: StatCardsProps) {
  const [timeframe, setTimeframe] = useState('This Month');
  const [counts, setCounts] = useState({
    totalScans: 0,
    normalScans: 0,
    abnormalScans: 0,
    accuracy: 0,
  });

  // Animated Count-Up on Mount or stats/timeframe change
  useEffect(() => {
    if (isLoading) return; // Don't run count-up while skeleton is showing

    const duration = 1200; // ms
    const steps = 30;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      setCounts({
        totalScans: Math.round(stats.totalScans * easeProgress),
        normalScans: Math.round(stats.normalScans * easeProgress),
        abnormalScans: Math.round(stats.abnormalScans * easeProgress),
        accuracy: Math.round(stats.avgModelAccuracy * easeProgress),
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [stats, timeframe, isLoading]);

  const cards = [
    {
      id: 'total',
      title: 'Total Scans',
      value: counts.totalScans,
      subtitle: `${timeframe} cohort`,
      icon: Activity,
      color: 'cyan',
      bgGlow: 'from-cyan-500/10 to-blue-600/5',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    },
    {
      id: 'normal',
      title: 'Normal Scans',
      value: counts.normalScans,
      subtitle: stats.totalScans > 0
        ? `${Math.round((stats.normalScans / stats.totalScans) * 100)}% of total`
        : '—',
      icon: ShieldCheck,
      color: 'emerald',
      bgGlow: 'from-emerald-500/10 to-teal-600/5',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    },
    {
      id: 'abnormal',
      title: 'Abnormal Scans',
      value: counts.abnormalScans,
      subtitle: 'Clinical follow-up required',
      icon: AlertTriangle,
      color: 'pink',
      bgGlow: 'from-pink-500/10 to-rose-600/5',
      borderColor: 'border-pink-500/30',
      textColor: 'text-pink-400',
      iconBg: 'bg-pink-500/10 border-pink-500/30 text-pink-400',
    },
    {
      id: 'accuracy',
      title: 'Model Accuracy',
      value: `${counts.accuracy}%`,
      subtitle: 'NIH ChestX-ray14 Benchmark',
      icon: Sparkles,
      color: 'blue',
      bgGlow: 'from-blue-500/10 to-indigo-600/5',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    },
  ];

  return (
    <div className="space-y-3">
      {/* Timeframe Selector Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
          Statistics Overview
        </h3>
        <div className="relative">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            disabled={isLoading}
            className="appearance-none bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:border-cyan-500/50 cursor-pointer hover:border-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <option value="This Month">This Month</option>
            <option value="This Week">This Week</option>
            <option value="All Time">All Time</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Skeleton or real Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <motion.div
                key={`skeleton-card-${idx}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05, ease: 'easeOut' }}
              >
                <StatCardSkeleton />
              </motion.div>
            ))
          : cards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1, ease: 'easeOut' }}
                  className={`p-5 rounded-2xl glass-panel glass-panel-hover border ${card.borderColor} bg-gradient-to-br ${card.bgGlow} relative overflow-hidden flex items-center justify-between group`}
                >
                  <div className="z-10">
                    <p className="text-xs font-medium text-slate-400 mb-1">{card.title}</p>
                    <h3 className={`text-2xl font-black ${card.textColor} tracking-tight font-mono`}>
                      {card.value}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1">{card.subtitle}</p>
                  </div>

                  <div className={`w-12 h-12 rounded-xl border ${card.iconBg} flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </motion.div>
              );
            })}
      </div>
    </div>
  );
}
