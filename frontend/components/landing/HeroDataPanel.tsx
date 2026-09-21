'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ShieldAlert,
  MapPin,
  Clock,
  Activity,
  Cpu,
  Sparkles,
} from 'lucide-react';

const CARDS = [
  {
    id: 'card-1',
    title: 'AI ANALYSIS STATUS',
    value: 'COMPLETED',
    subtext: 'ResNet50 + LayerCAM Spatial Matrix',
    icon: CheckCircle2,
    accentColor: '#18E0C4',
    badge: 'Validated',
    delay: 0.2,
  },
  {
    id: 'card-2',
    title: 'POTENTIAL FINDING',
    value: 'PNEUMONIA 78.2%',
    subtext: 'High Confidence Multi-Disease Classifier',
    icon: ShieldAlert,
    accentColor: '#FF3FA4',
    badge: 'Alert Flagged',
    delay: 0.35,
  },
  {
    id: 'card-3',
    title: 'AFFECTED REGION',
    value: 'RIGHT LOWER LOBE',
    subtext: 'Basilar Infiltrate Zone Spatial Mapping',
    icon: MapPin,
    accentColor: '#00D9FF',
    badge: 'Segmented',
    delay: 0.5,
  },
  {
    id: 'card-4',
    title: 'PROCESSING SPEED',
    value: '1.83 SECONDS',
    subtext: 'Local Edge Compute Execution',
    icon: Clock,
    accentColor: '#2D8CFF',
    badge: 'Real-Time',
    delay: 0.65,
  },
];

export default function HeroDataPanel() {
  return (
    <div className="relative w-full max-w-[520px] mx-auto select-none">
      {/* Ambient Radial Background Glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-[#00D9FF]/20 via-[#18E0C4]/10 to-[#FF3FA4]/15 rounded-3xl blur-2xl pointer-events-none opacity-80" />

      {/* Main Glassmorphic Telemetry Console */}
      <div className="relative z-10 rounded-3xl bg-[#0A1628]/85 backdrop-blur-xl border border-[#00D9FF]/30 p-6 sm:p-7 shadow-[0_12px_48px_rgba(0,0,0,0.6)] space-y-5">
        {/* Console Top Header Bar */}
        <div className="flex items-center justify-between border-b border-[#00D9FF]/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/15 border border-[#00D9FF]/30 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-[#00D9FF]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#EAF7FF] tracking-wider uppercase flex items-center gap-2 font-display">
                AI TELEMETRY STREAM
                <Sparkles className="w-3.5 h-3.5 text-[#00D9FF]" />
              </h3>
              <p className="text-[10px] text-[#8BA6B8] font-mono">MODEL: RESNET50-CAM v2.4</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#18E0C4]/10 border border-[#18E0C4]/30 text-[#18E0C4] text-[10px] font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-[#18E0C4] animate-ping" />
            LIVE ANALYSIS
          </div>
        </div>

        {/* Repositioned Telemetry Cards Grid */}
        <div className="space-y-3.5">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: card.delay, ease: 'easeOut' }}
                className="p-4 rounded-2xl bg-[#050A14]/75 border border-[#00D9FF]/15 hover:border-[#00D9FF]/40 transition-all duration-300 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: `${card.accentColor}18`,
                      border: `1px solid ${card.accentColor}40`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: card.accentColor }} />
                  </div>

                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#8BA6B8] block mb-0.5 font-mono">
                      {card.title}
                    </span>
                    <h4 className="text-sm font-bold text-[#EAF7FF] font-mono tracking-tight">
                      {card.value}
                    </h4>
                    <p className="text-[10px] text-[#8BA6B8] mt-0.5">{card.subtext}</p>
                  </div>
                </div>

                <span
                  className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[9px] font-mono font-bold border"
                  style={{
                    backgroundColor: `${card.accentColor}12`,
                    borderColor: `${card.accentColor}30`,
                    color: card.accentColor,
                  }}
                >
                  {card.badge}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Footer System Diagnostics Strip */}
        <div className="pt-2 border-t border-[#00D9FF]/15 flex items-center justify-between text-[10px] text-[#8BA6B8] font-mono">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-[#00D9FF]" />
            SPATIAL CAM MATRIX ACTIVE
          </span>
          <span>LATENCY &lt; 2.0S</span>
        </div>
      </div>
    </div>
  );
}
