'use client';

import React from 'react';
import { Settings, User, Bell, Lock, Server } from 'lucide-react';
import { CURRENT_DOCTOR } from '@/lib/mockData';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-7 h-7 text-cyan-400" />
          Settings & Preferences
        </h1>
        <p className="text-xs text-slate-400 mt-1">Configure profile settings, AI model thresholds, and system preferences.</p>
      </div>

      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <img
            src={CURRENT_DOCTOR.avatarUrl}
            alt={CURRENT_DOCTOR.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-400"
          />
          <div>
            <h3 className="text-base font-bold text-white">{CURRENT_DOCTOR.name}</h3>
            <p className="text-xs text-cyan-400">{CURRENT_DOCTOR.role}</p>
            <p className="text-xs text-slate-400 mt-0.5">{CURRENT_DOCTOR.hospital} • {CURRENT_DOCTOR.email}</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="font-semibold text-white">Backend API Connection</p>
                <p className="text-slate-400">Target URL configured via NEXT_PUBLIC_API_URL</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 font-mono">http://localhost:8000</span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-blue-400" />
              <div>
                <p className="font-semibold text-white">Authentication Mode</p>
                <p className="text-slate-400">Single Mocked Doctor Profile ("Dr. Arjun Patel")</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300">Prototype Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
}
