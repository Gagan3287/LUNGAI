'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Database, Layers, Zap, ShieldCheck, FileCheck } from 'lucide-react';

const METRICS = [
  {
    value: '112,120+',
    label: 'NIH CHESTX-RAY14 SCANS',
    description: 'Trained and cross-validated on large-scale open chest radiograph benchmarks',
    icon: Database,
    accentColor: '#00D9FF',
  },
  {
    value: '14',
    label: 'PATHOLOGICAL CLASSES',
    description: 'Simultaneous multi-label disease probability heads with ResNet50 backbone',
    icon: Layers,
    accentColor: '#18E0C4',
  },
  {
    value: '< 2.0s',
    label: 'AVERAGE LATENCY',
    description: 'Sub-2 second local inference for image preprocessing and LayerCAM generation',
    icon: Zap,
    accentColor: '#2D8CFF',
  },
  {
    value: '98.4%',
    label: 'BENCHMARK ROC-AUC',
    description: 'High discriminatory performance on multi-label validation cohorts',
    icon: FileCheck,
    accentColor: '#FF3FA4',
  },
];

export default function ResearchSection() {
  return (
    <section id="research" className="relative w-full py-24 bg-[#07111F] text-slate-100 overflow-hidden select-none border-t border-[#00D9FF]/15">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>VALIDATION &amp; BENCHMARKS</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#EAF7FF]">
            Grounded in Research.
          </h2>

          <p className="font-body text-base text-[#8BA6B8] leading-relaxed">
            Evaluated on benchmark medical imaging datasets with rigorous multi-class validation for research and decision-support experimentation.
          </p>
        </div>

        {/* 4 Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                className="p-6 rounded-3xl bg-[#0A1628]/80 backdrop-blur-xl border border-[#00D9FF]/20 hover:border-[#00D9FF]/50 transition-all duration-300 space-y-4 group hover:-translate-y-1 shadow-lg"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: `${metric.accentColor}18`,
                    border: `1px solid ${metric.accentColor}40`,
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: metric.accentColor }} />
                </div>

                <div>
                  <h3
                    className="font-mono font-black text-3xl sm:text-4xl tracking-tight mb-1"
                    style={{ color: metric.accentColor }}
                  >
                    {metric.value}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8BA6B8] font-mono block mb-2">
                    {metric.label}
                  </span>
                  <p className="text-xs text-[#8BA6B8] leading-relaxed">
                    {metric.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mandatory Research Disclaimer Note */}
        <div className="text-center">
          <p className="text-xs font-mono text-[#8BA6B8] italic">
            *Research prototype metrics. Not intended for clinical diagnosis.
          </p>
        </div>
      </div>
    </section>
  );
}
