'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import { MOCK_SCANS } from '@/lib/mockData';
import { ScanRecord } from '@/lib/types';
import { fetchScans } from '@/lib/api';

export default function ReportsPage() {
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
          <FileText className="w-7 h-7 text-cyan-400" />
          Clinical Reports & Export Center
        </h1>
        <p className="text-xs text-slate-400 mt-1">Generate and download research summary reports for chest X-ray findings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scans.map((scan) => (
          <div key={scan.id} className="p-5 rounded-2xl glass-panel border border-cyan-500/20 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-mono text-cyan-400">{scan.scanCode}</span>
                <span>{scan.scanDate}</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">{scan.patientName}</h3>
              <p className="text-xs text-pink-400 font-semibold mb-2">{scan.primaryCondition} ({scan.confidence}%)</p>
              <p className="text-xs text-slate-400 line-clamp-2">{scan.findingsSummary}</p>
            </div>

            <button className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 font-semibold text-xs transition-all flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download Report (PDF)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
