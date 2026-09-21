'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import { ScanRecord } from '@/lib/types';

interface AIAnalysisSummaryProps {
  scan: ScanRecord;
}

export default function AIAnalysisSummary({ scan }: AIAnalysisSummaryProps) {
  const getSeverityBadge = () => {
    switch (scan.severity) {
      case 'High':
        return 'bg-pink-500/20 text-pink-400 border-pink-500/40 shadow-[0_0_10px_rgba(255,42,109,0.3)]';
      case 'Moderate':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]';
      case 'Low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  // Color map for donut segments matching Image 2 reference palette
  const COLORS = ['#00f0ff', '#ff2a6d', '#f59e0b', '#3b82f6', '#10b981'];

  // Calculate SVG Donut Arcs
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="p-6 rounded-2xl glass-panel border border-cyan-500/20 flex flex-col justify-between space-y-5 h-full"
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          AI Analysis Summary
        </h3>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Completed
        </span>
      </div>

      {/* Primary Condition Highlight Banner */}
      <div className={`p-4 rounded-xl border relative overflow-hidden ${
        scan.isNormal 
          ? 'bg-emerald-500/10 border-emerald-500/30' 
          : 'bg-pink-500/10 border-pink-500/30'
      }`}>
        <div className="flex items-center justify-between mb-1">
          <h4 className={`text-base font-black tracking-wide ${scan.isNormal ? 'text-emerald-400' : 'text-pink-400 text-glow-alert'}`}>
            {scan.primaryCondition}
          </h4>
          <span className="text-sm font-mono font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-800">
            {scan.confidence}%
          </span>
        </div>
        <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
          {scan.findingsSummary}
        </p>

        {/* Confidence Progress Bar */}
        <div className="w-full bg-slate-900/90 h-2 rounded-full mt-3 overflow-hidden border border-slate-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${scan.confidence}%` }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className={`h-full rounded-full ${scan.isNormal ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' : 'bg-gradient-to-r from-pink-500 to-cyan-400'}`}
          />
        </div>
      </div>

      {/* Metadata Badges Grid */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block mb-1">Severity Level</span>
          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border inline-block ${getSeverityBadge()}`}>
            {scan.severity}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block mb-1 flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3 text-cyan-400" />
            Affected Area
          </span>
          <span className="text-[11px] font-bold text-cyan-400 truncate block">
            {scan.affectedArea}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block mb-1 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 text-emerald-400" />
            Analysis Time
          </span>
          <span className="text-[11px] font-bold text-emerald-400 font-mono block">
            {scan.analysisTimeSeconds} sec
          </span>
        </div>
      </div>

      {/* Confidence Breakdown Donut Chart (matching Image 2) */}
      <div className="pt-2 border-t border-slate-800/80">
        <h4 className="text-xs font-bold text-slate-300 mb-3 tracking-wide">
          Confidence Breakdown
        </h4>

        <div className="flex items-center gap-6">
          {/* Animated SVG Donut Chart */}
          <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-800"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Donut segments */}
              {scan.diseaseBreakdown.map((item, idx) => {
                const strokeDasharray = `${(item.probability / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                accumulatedPercent += item.probability;
                const color = COLORS[idx % COLORS.length];

                return (
                  <motion.circle
                    key={item.disease}
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke={color}
                    strokeWidth="12"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    initial={{ strokeDasharray: `0 ${circumference}` }}
                    animate={{ strokeDasharray }}
                    transition={{ duration: 1.0, delay: idx * 0.1, ease: 'easeOut' }}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-lg font-black text-white font-mono">{scan.confidence}%</span>
              <span className="text-[9px] font-medium text-slate-400 uppercase">Primary</span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-1.5 flex-1 text-xs">
            {scan.diseaseBreakdown.map((item, idx) => {
              const color = COLORS[idx % COLORS.length];
              return (
                <div key={item.disease} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-slate-300 font-medium truncate max-w-[90px]">{item.disease}</span>
                  </div>
                  <span className="font-mono font-bold text-white">{item.probability}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
