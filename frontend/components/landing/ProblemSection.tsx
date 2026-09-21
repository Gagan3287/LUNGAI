'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Eye, Cpu, Activity, Check } from 'lucide-react';

export default function ProblemSection() {
  return (
    <section id="technology" className="relative w-full py-24 bg-[#07111F] text-slate-100 overflow-hidden select-none border-t border-[#00D9FF]/15">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF3FA4]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Problem Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-6"
          >
            {/* Section Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] text-xs font-bold uppercase tracking-widest">
              <Activity className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>CLINICAL CHALLENGE &amp; DATA INSIGHTS</span>
            </div>

            {/* Section Title */}
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#EAF7FF] leading-[1.1]">
              Every X-Ray Contains <br />
              <span className="bg-gradient-to-r from-[#00D9FF] via-[#18E0C4] to-[#2D8CFF] bg-clip-text text-transparent">
                a Story.
              </span>
            </h2>

            {/* Narrative Paragraphs */}
            <p className="font-body text-base text-[#8BA6B8] leading-relaxed">
              Chest radiographs remain the most frequently requested diagnostic imaging study globally. However, subtle pathological indicators—such as early infiltrate patterns, subtle effusions, or localized opacities—require rapid and reproducible spatial interpretation.
            </p>

            <p className="font-body text-sm text-[#8BA6B8] leading-relaxed">
              LUNG AI provides researchers and clinicians with AI-assisted spatial feature heatmaps and 3D anatomical projections, accelerating image analysis without replacing human expertise.
            </p>

            {/* Feature Highlights List */}
            <div className="space-y-3 pt-2">
              {[
                'Multi-label disease probability distribution across 14 benchmark conditions',
                'LayerCAM spatial activation mapping highlighting spatial regions of interest',
                'Sub-2 second processing latency with local edge compute support',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs text-[#EAF7FF]">
                  <div className="w-5 h-5 rounded-full bg-[#18E0C4]/20 border border-[#18E0C4]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#18E0C4]" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Mandatory Safety Language Banner */}
            <div className="p-4 rounded-2xl bg-[#0A1628] border border-[#FF3FA4]/30 text-xs text-[#8BA6B8] flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-[#FF3FA4] flex-shrink-0" />
              <span>
                <strong className="text-[#EAF7FF]">Research Prototype — Not for Clinical Use.</strong> Decision-support research tool designed to supplement clinical evaluation experiments.
              </span>
            </div>
          </motion.div>

          {/* Right Column: Progressive AI Markers X-Ray Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-6 relative"
          >
            {/* Visual Container Frame */}
            <div className="relative rounded-3xl bg-[#0A1628]/90 border border-[#00D9FF]/30 p-6 shadow-[0_16px_60px_rgba(0,0,0,0.6)] space-y-4 overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-[#00D9FF]/15 pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#00D9FF]" />
                  <span className="text-xs font-bold font-display uppercase tracking-wider text-[#EAF7FF]">
                    PROGRESSIVE AI FEATURE EXTRACTION
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#18E0C4] bg-[#18E0C4]/10 px-2 py-0.5 rounded-full border border-[#18E0C4]/30">
                  INTERACTIVE PREVIEW
                </span>
              </div>

              {/* Radiograph Grid Canvas Display */}
              <div className="relative w-full h-80 rounded-2xl bg-[#050A14] border border-[#00D9FF]/20 flex items-center justify-center overflow-hidden">
                {/* Background Coordinate Grid */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #00D9FF 1px, transparent 1px), linear-gradient(to bottom, #00D9FF 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Abstract Ribcage & Chest Skeleton SVG */}
                <svg viewBox="0 0 300 300" fill="none" className="w-64 h-64 opacity-40">
                  <path d="M 150 20 L 150 280 M 150 60 C 110 50, 70 80, 60 140 C 50 200, 70 260, 150 270 M 150 60 C 190 50, 230 80, 240 140 C 250 200, 230 260, 150 270" stroke="#00D9FF" strokeWidth="2" strokeDasharray="3 3" />
                  <path d="M 80 100 Q 150 120 220 100 M 70 150 Q 150 170 230 150 M 80 200 Q 150 220 220 200" stroke="#18E0C4" strokeWidth="1.5" opacity="0.6" />
                </svg>

                {/* Progressive Marker 1: Spatial Grid Alignment */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="absolute top-12 left-14 px-2.5 py-1 rounded-lg bg-[#00D9FF]/20 border border-[#00D9FF]/50 text-[#00D9FF] text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-lg"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]" />
                  MARKER 01: SPATIAL MATRIX ALIGNED
                </motion.div>

                {/* Progressive Marker 2: ResNet Feature Zone */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="absolute top-28 right-12 px-2.5 py-1 rounded-lg bg-[#18E0C4]/20 border border-[#18E0C4]/50 text-[#18E0C4] text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-lg"
                >
                  <Cpu className="w-3 h-3 text-[#18E0C4]" />
                  MARKER 02: RESNET50 MAP
                </motion.div>

                {/* Progressive Marker 3: LayerCAM Focus Region */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="absolute bottom-12 right-20"
                >
                  {/* Heatmap Pulsing Glow Circle */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-[#FF3FA4]/20 border border-[#FF3FA4]/60 animate-ping absolute" />
                    <div className="w-20 h-20 rounded-full bg-[#FF3FA4]/30 border border-[#FF3FA4]/80 flex flex-col items-center justify-center p-2 text-center shadow-[0_0_20px_#FF3FA4]">
                      <span className="text-[9px] font-mono font-bold text-[#EAF7FF] uppercase">PNEUMONIA</span>
                      <span className="text-xs font-mono font-black text-[#FF3FA4]">78.2%</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Card Footer Bar */}
              <div className="flex items-center justify-between text-[10px] text-[#8BA6B8] font-mono">
                <span>BENCHMARK DATASET: NIH CHESTX-RAY14</span>
                <span>STATUS: AI-ASSISTED DETECTION</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
