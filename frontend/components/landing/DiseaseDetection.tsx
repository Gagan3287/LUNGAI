'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

const DISEASES = [
  {
    name: 'Pneumonia',
    confidence: 78.2,
    severity: 'High',
    category: 'Potential Finding',
    description: 'Consolidation pattern detected in lower lung field',
    accentColor: '#FF3FA4',
  },
  {
    name: 'Atelectasis',
    confidence: 62.4,
    severity: 'Moderate',
    category: 'Potential Finding',
    description: 'Partial lobar collapse features detected',
    accentColor: '#F59E0B',
  },
  {
    name: 'Cardiomegaly',
    confidence: 41.0,
    severity: 'Low',
    category: 'Low Probability',
    description: 'Cardiac silhouette ratio within borderline range',
    accentColor: '#3B82F6',
  },
  {
    name: 'Pleural Effusion',
    confidence: 35.8,
    severity: 'Moderate',
    category: 'Potential Finding',
    description: 'Blunting of costophrenic angle features',
    accentColor: '#10B981',
  },
  {
    name: 'Infiltration',
    confidence: 28.5,
    severity: 'Low',
    category: 'Low Probability',
    description: 'Diffuse parenchymal opacification features',
    accentColor: '#00D9FF',
  },
  {
    name: 'Mass',
    confidence: 14.2,
    severity: 'Low',
    category: 'Low Probability',
    description: 'No focal mass opacity >= 3cm detected',
    accentColor: '#18E0C4',
  },
  {
    name: 'Nodule',
    confidence: 12.0,
    severity: 'Low',
    category: 'Low Probability',
    description: 'No circumscribed nodular opacities detected',
    accentColor: '#8BA6B8',
  },
  {
    name: 'Pneumothorax',
    confidence: 4.5,
    severity: 'Low',
    category: 'Unlikely',
    description: 'Visceral pleural line not identified',
    accentColor: '#8BA6B8',
  },
];

export default function DiseaseDetection() {
  return (
    <section id="insights" className="relative w-full py-24 bg-[#050A14] text-slate-100 overflow-hidden select-none border-t border-[#00D9FF]/15">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] text-xs font-bold uppercase tracking-widest">
            <Activity className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>14-DISEASE BENCHMARK CLASSIFICATION</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#EAF7FF]">
            Multi-Disease Classification.
          </h2>

          <p className="font-body text-base text-[#8BA6B8] leading-relaxed">
            Simultaneous multi-label AI-assisted feature extraction across 14 radiological benchmark disease conditions with individual confidence scoring.
          </p>
        </div>

        {/* 8-Disease Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DISEASES.map((disease, idx) => (
            <motion.div
              key={disease.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: 'easeOut' }}
              className="p-5 rounded-2xl bg-[#0A1628]/80 backdrop-blur-xl border border-[#00D9FF]/15 hover:border-[#00D9FF]/40 transition-all duration-300 space-y-4 group hover:-translate-y-1 shadow-lg"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-[#EAF7FF] group-hover:text-[#00D9FF] transition-colors">
                  {disease.name}
                </h3>
                <span className="font-mono text-base font-black" style={{ color: disease.accentColor }}>
                  {disease.confidence}%
                </span>
              </div>

              {/* Confidence Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-[#050A14] overflow-hidden border border-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${disease.confidence}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.0, delay: idx * 0.08 + 0.2, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: disease.accentColor }}
                />
              </div>

              {/* Status & Subtext */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#8BA6B8]">{disease.category}</span>
                  <span className="font-bold" style={{ color: disease.accentColor }}>
                    {disease.severity} Severity
                  </span>
                </div>
                <p className="text-[11px] text-[#8BA6B8] leading-tight">
                  {disease.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Safety Banner */}
        <div className="p-4 rounded-2xl bg-[#0A1628] border border-[#00D9FF]/20 text-center text-xs text-[#8BA6B8]">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00D9FF]" />
            <strong className="text-[#EAF7FF]">AI-assisted multi-disease classification model.</strong> *Research prototype metrics on NIH ChestX-ray14 dataset. Not intended for clinical diagnosis.
          </span>
        </div>
      </div>
    </section>
  );
}
