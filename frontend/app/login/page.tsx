'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Lock, ArrowRight } from 'lucide-react';
import { CURRENT_DOCTOR } from '@/lib/mockData';

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl glass-panel border border-cyan-500/30 shadow-2xl relative overflow-hidden text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 mx-auto">
          <Activity className="w-8 h-8 text-white animate-pulse" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-white tracking-wider">
            LUNG<span className="text-cyan-400">AI</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Intelligent Analysis. Healthier Tomorrow.</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 text-left">
          <img
            src={CURRENT_DOCTOR.avatarUrl}
            alt={CURRENT_DOCTOR.name}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-cyan-400"
          />
          <div>
            <h4 className="text-sm font-semibold text-white">{CURRENT_DOCTOR.name}</h4>
            <p className="text-xs text-cyan-400">{CURRENT_DOCTOR.role}</p>
          </div>
        </div>

        <Link
          href="/"
          className="w-full py-3 px-4 rounded-xl font-bold text-sm text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-400/20 flex items-center justify-center gap-2 group"
        >
          <span>Continue as Dr. Arjun Patel</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        <p className="text-[11px] text-slate-500">
          Prototype Mode: Auth is mocked for single doctor profile.
        </p>
      </div>
    </div>
  );
}
