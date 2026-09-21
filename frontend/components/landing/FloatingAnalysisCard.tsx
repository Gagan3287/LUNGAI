'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, CheckCircle2 } from 'lucide-react';

export interface FloatingCardData {
  id: string;
  type: 'status' | 'finding' | 'region' | 'speed';
  title: string;
  value: string;
  subtext?: string;
  icon?: LucideIcon;
  accentColor?: string;
  positionClasses: string;
  delay?: number;
}

export default function FloatingAnalysisCard({ card }: { card: FloatingCardData }) {
  const IconComponent: LucideIcon = card.icon || CheckCircle2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: card.delay || 0, ease: 'easeOut' }}
      className={`absolute ${card.positionClasses} z-20 hidden md:flex items-center gap-3 p-3 px-4 rounded-xl bg-[#0A1628]/85 backdrop-blur-md border border-[#00D9FF]/25 shadow-[0_8px_32px_rgba(0,0,0,0.5)] select-none pointer-events-none group hover:border-[#00D9FF]/50 transition-colors`}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: card.accentColor ? `${card.accentColor}20` : 'rgba(0,217,255,0.15)',
          border: `1px solid ${card.accentColor || '#00D9FF'}40`,
        }}
      >
        <IconComponent
          className="w-4 h-4"
          style={{ color: card.accentColor || '#00D9FF' }}
        />
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#8BA6B8] leading-none mb-1">
          {card.title}
        </p>
        <p className="text-xs font-bold text-[#EAF7FF] font-mono leading-none flex items-center gap-1.5">
          {card.value}
        </p>
        {card.subtext && (
          <p className="text-[9px] text-[#8BA6B8] mt-0.5 leading-none">{card.subtext}</p>
        )}
      </div>
    </motion.div>
  );
}
