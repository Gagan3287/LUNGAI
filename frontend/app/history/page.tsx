'use client';

import React, { useState, useEffect } from 'react';
import { History } from 'lucide-react';
import { MOCK_SCANS } from '@/lib/mockData';
import { ScanRecord } from '@/lib/types';
import { fetchScans } from '@/lib/api';

export default function HistoryPage() {
  const [scans, setScans] = useState<ScanRecord[]>(MOCK_SCANS);

  useEffect(() => {
    async function loadScans() {
      try {
        const data = await fetchScans();
        setScans(data);
      } catch (err) {
        console.warn('Backend unavailable, using mock scans fallback:', err);
      }
    }
    loadScans();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <History className="w-7 h-7 text-cyan-400" />
          Analysis History Logs
        </h1>
        <p className="text-xs text-slate-400 mt-1">Review all completed AI disease classification scans and Grad-CAM outputs.</p>
      </div>

      <div className="rounded-2xl glass-panel overflow-hidden border border-cyan-500/20">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-4 font-semibold">Scan ID</th>
              <th className="p-4 font-semibold">Patient Name</th>
              <th className="p-4 font-semibold">Primary Result</th>
              <th className="p-4 font-semibold">Confidence</th>
              <th className="p-4 font-semibold">Severity</th>
              <th className="p-4 font-semibold">Scan Date</th>
              <th className="p-4 font-semibold text-right">Report</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {scans.map((s) => (
              <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-mono text-cyan-400 font-semibold">{s.scanCode}</td>
                <td className="p-4 font-semibold text-white">{s.patientName}</td>
                <td className="p-4 font-semibold text-slate-200">{s.primaryCondition}</td>
                <td className="p-4 font-bold text-cyan-400">{s.confidence}%</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    s.severity === 'High' ? 'bg-pink-500/20 text-pink-400' :
                    s.severity === 'Moderate' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {s.severity}
                  </span>
                </td>
                <td className="p-4 text-slate-400">{s.scanDate}</td>
                <td className="p-4 text-right">
                  <button className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[11px] transition-colors">
                    View Scan
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
