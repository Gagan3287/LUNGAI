'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LayoutDashboard, ArrowRight, Activity, Flame, ShieldAlert, Sparkles } from 'lucide-react';

export default function DashboardPreview() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setTilt({ x: -y * 6, y: x * 6 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section id="product" className="relative w-full py-24 bg-[#050A14] text-slate-100 overflow-hidden select-none border-t border-[#00D9FF]/15">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] text-xs font-bold uppercase tracking-widest">
            <LayoutDashboard className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>CLINICAL WORKSTATION INTERFACE</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#EAF7FF]">
            Your AI Radiology Workstation.
          </h2>

          <p className="font-body text-base text-[#8BA6B8] leading-relaxed">
            Integrated multi-disease classification, 3D anatomical lobe mapping, and LayerCAM spatial heatmaps in a unified research interface.
          </p>

          <div className="pt-2">
            <Link
              href="/workstation"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#00B8D9] hover:from-[#18E0C4] hover:to-[#00D9FF] text-[#050A14] font-bold text-xs shadow-lg shadow-[#00D9FF]/20 transition-all duration-300 cursor-pointer"
            >
              Launch LUNG AI Workstation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Parallax Tilted Workstation Mockup Box */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="perspective-1000 max-w-5xl mx-auto"
        >
          <motion.div
            animate={{ rotateX: tilt.x, rotateY: tilt.y }}
            transition={{ type: 'spring', stiffness: 120, damping: 15 }}
            className="relative rounded-3xl bg-[#0A1628]/90 border border-[#00D9FF]/30 p-4 sm:p-6 shadow-[0_24px_80px_rgba(0,0,0,0.8)] space-y-4 overflow-hidden"
          >
            {/* Workstation Top Bar */}
            <div className="flex items-center justify-between border-b border-[#00D9FF]/15 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-[11px] font-mono text-[#8BA6B8] ml-2">LUNG AI WORKSTATION v2.4 — RESEARCH MODE</span>
              </div>
              <span className="text-[10px] font-mono text-[#18E0C4] bg-[#18E0C4]/10 px-2.5 py-0.5 rounded-full border border-[#18E0C4]/30">
                FastAPI Connected
              </span>
            </div>

            {/* Mockup Inner Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Left Column (8 cols): Mock 3D Canvas + Stat Cards */}
              <div className="md:col-span-8 space-y-4">
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                  <div className="p-2 rounded-xl bg-[#050A14] border border-[#00D9FF]/20">
                    <span className="text-[#8BA6B8] block">TOTAL SCANS</span>
                    <span className="text-sm font-bold text-[#00D9FF]">1,428</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#050A14] border border-[#18E0C4]/20">
                    <span className="text-[#8BA6B8] block">NORMAL</span>
                    <span className="text-sm font-bold text-[#18E0C4]">892</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#050A14] border border-[#FF3FA4]/20">
                    <span className="text-[#8BA6B8] block">ABNORMAL</span>
                    <span className="text-sm font-bold text-[#FF3FA4]">536</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#050A14] border border-[#2D8CFF]/20">
                    <span className="text-[#8BA6B8] block">ACCURACY</span>
                    <span className="text-sm font-bold text-[#2D8CFF]">94.2%</span>
                  </div>
                </div>

                <div className="h-64 rounded-2xl bg-[#050A14] border border-[#00D9FF]/20 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00D9FF_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="relative z-10 text-center font-mono space-y-2">
                    <Activity className="w-10 h-10 text-[#00D9FF] mx-auto animate-pulse" />
                    <p className="text-xs font-bold text-[#EAF7FF]">3D ANATOMICAL LOBE PROJECTION</p>
                    <p className="text-[10px] text-[#8BA6B8]">Bilateral Lobe Geometry &amp; Pin Coordinates</p>
                  </div>
                </div>
              </div>

              {/* Right Column (4 cols): Mock AI Analysis & Donut */}
              <div className="md:col-span-4 p-4 rounded-2xl bg-[#050A14] border border-[#00D9FF]/20 flex flex-col justify-between space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-[#EAF7FF] flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#FF3FA4]" />
                    AI FINDINGS
                  </span>
                  <span className="text-[9px] text-[#18E0C4]">Completed</span>
                </div>

                <div className="p-3 rounded-xl bg-[#FF3FA4]/10 border border-[#FF3FA4]/30 space-y-1">
                  <span className="text-sm font-black text-[#FF3FA4]">PNEUMONIA 78.2%</span>
                  <p className="text-[10px] text-[#8BA6B8]">Right Lower Lobe • High Severity</p>
                </div>

                <div className="space-y-1.5 text-[10px] text-[#8BA6B8]">
                  <div className="flex justify-between">
                    <span>Atelectasis:</span>
                    <span className="text-[#EAF7FF] font-bold">62.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Effusion:</span>
                    <span className="text-[#EAF7FF] font-bold">35.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Infiltration:</span>
                    <span className="text-[#EAF7FF] font-bold">28.5%</span>
                  </div>
                </div>

                <div className="text-[9px] text-[#8BA6B8] italic pt-2 border-t border-slate-800">
                  Research Prototype — Not for Clinical Use
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
