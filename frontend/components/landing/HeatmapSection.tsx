'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Eye, Sliders, ShieldAlert, Sparkles } from 'lucide-react';

export default function HeatmapSection() {
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100%

  return (
    <section id="technology" className="relative w-full py-24 bg-[#07111F] text-slate-100 overflow-hidden select-none border-t border-[#00D9FF]/15">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF3FA4]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF3FA4]/10 border border-[#FF3FA4]/30 text-[#FF3FA4] text-xs font-bold uppercase tracking-widest">
            <Flame className="w-3.5 h-3.5 text-[#FF3FA4]" />
            <span>EXPLAINABLE AI (XAI)</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#EAF7FF]">
            Spatial Explainability.
          </h2>

          <p className="font-body text-base text-[#8BA6B8] leading-relaxed">
            Drag the interactive slider below to transform between the original radiograph and the LayerCAM thermal spatial feature activation map.
          </p>
        </div>

        {/* Interactive Horizontal Transformation Comparison Box */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="relative w-full h-[420px] sm:h-[480px] rounded-3xl bg-[#050A14] border border-[#00D9FF]/30 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)] select-none">
            {/* Background Grid Pattern */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(to right, #00D9FF 1px, transparent 1px), linear-gradient(to bottom, #00D9FF 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Base Layer: Original Grayscale Radiograph Representation */}
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <div className="relative w-full h-full max-w-md max-h-80 rounded-2xl border border-slate-800 bg-[#0A1628]/60 flex flex-col items-center justify-center space-y-3">
                <svg viewBox="0 0 200 200" fill="none" className="w-48 h-48 opacity-40">
                  <circle cx="100" cy="100" r="80" stroke="#8BA6B8" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M 60 70 C 40 100, 50 150, 100 160 M 140 70 C 160 100, 150 150, 100 160" stroke="#8BA6B8" strokeWidth="2" />
                </svg>
                <span className="font-mono text-xs text-[#8BA6B8] font-bold">ORIGINAL GRAYSCALE RADIOGRAPH</span>
              </div>
            </div>

            {/* Overlaid Layer: LayerCAM Thermal Heatmap Representation (Clipped by sliderPosition) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <div className="absolute inset-0 w-full h-full min-w-[340px] flex items-center justify-center p-6 text-center bg-[#07111F]">
                <div className="relative w-full h-full max-w-md max-h-80 rounded-2xl border border-[#FF3FA4]/50 bg-[#0A1628] flex flex-col items-center justify-center space-y-3 overflow-hidden">
                  {/* Heatmap Layer Effect */}
                  <div
                    className="absolute inset-0 opacity-80 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at 65% 65%, rgba(255, 63, 164, 0.95) 0%, rgba(245, 158, 11, 0.8) 35%, rgba(0, 240, 255, 0.5) 60%, transparent 80%)',
                    }}
                  />
                  <div className="relative z-10 font-mono text-xs text-[#EAF7FF] font-bold space-y-1">
                    <p className="text-[#FF3FA4] text-glow-alert font-extrabold text-sm">LAYERCAM ACTIVATION OVERLAY</p>
                    <p className="text-[10px] text-[#00D9FF]">Primary Attention: Right Lower Lobe (78.2%)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Vertical Scrub Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-[#00D9FF] cursor-ew-resize z-30 shadow-[0_0_15px_#00D9FF]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#00D9FF] text-[#050A14] flex items-center justify-center shadow-lg shadow-[#00D9FF]/40 font-bold">
                <Sliders className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Slider Controls Range Input */}
          <div className="p-4 rounded-2xl bg-[#0A1628]/80 border border-[#00D9FF]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-[#8BA6B8]">
              <Eye className="w-4 h-4 text-[#00D9FF]" />
              <span>Drag slider to compare spatial explainability:</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-72">
              <span className="text-[10px] text-[#8BA6B8]">Grayscale</span>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="w-full h-1.5 bg-[#050A14] rounded-lg appearance-none cursor-pointer accent-[#00D9FF]"
              />
              <span className="text-[10px] text-[#FF3FA4] font-bold">LayerCAM</span>
            </div>
          </div>

          {/* Safety Disclaimer Banner */}
          <div className="p-4 rounded-2xl bg-[#0A1628] border border-[#00D9FF]/20 text-center text-xs text-[#8BA6B8]">
            <span className="inline-flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#FF3FA4]" />
              <strong className="text-[#EAF7FF]">Research Prototype — Not for Clinical Use.</strong> LayerCAM feature maps highlight model attention regions for decision-support evaluation experiments.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
