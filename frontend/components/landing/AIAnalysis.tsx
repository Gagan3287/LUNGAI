'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldAlert, CheckCircle2, Clock, MapPin, Cpu } from 'lucide-react';

export default function AIAnalysis() {
  return (
    <section id="technology" className="relative w-full py-24 bg-[#07111F] text-slate-100 overflow-hidden select-none border-t border-[#00D9FF]/15">
      {/* Background glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>DEEP LEARNING FEATURE PIPELINE</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#EAF7FF]">
            From Image to Intelligence.
          </h2>

          <p className="font-body text-base text-[#8BA6B8] leading-relaxed">
            Progressive spatial breakdown revealing key radiological regions, AI-assisted classification confidence, affected lobe geometry, and sub-second processing latency.
          </p>
        </div>

        {/* 3-Stage Progressive Pipeline Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stage 1: Spatial Grid Input */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="p-6 rounded-3xl bg-[#0A1628]/80 backdrop-blur-xl border border-[#00D9FF]/20 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#8BA6B8]">
                <span>STAGE 01</span>
                <span className="text-[#00D9FF] font-bold">INPUT MATRIX</span>
              </div>
              <h3 className="font-display font-bold text-xl text-[#EAF7FF]">Spatial Normalization</h3>
              <p className="text-xs text-[#8BA6B8] leading-relaxed">
                Raw chest radiograph (JPG/PNG) is downsampled, intensity-normalized, and reformatted into a 512x512 feature tensor.
              </p>
            </div>

            <div className="h-48 rounded-2xl bg-[#050A14] border border-[#00D9FF]/20 relative overflow-hidden flex items-center justify-center">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'linear-gradient(to right, #00D9FF 1px, transparent 1px), linear-gradient(to bottom, #00D9FF 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              <div className="text-center font-mono text-xs text-[#00D9FF] space-y-1">
                <p className="font-bold">512 × 512 TENSOR</p>
                <p className="text-[10px] text-[#8BA6B8]">Spatial Matrix Normalization</p>
              </div>
            </div>
          </motion.div>

          {/* Stage 2: Feature Activation & CAM */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
            className="p-6 rounded-3xl bg-[#0A1628]/80 backdrop-blur-xl border border-[#00D9FF]/20 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#8BA6B8]">
                <span>STAGE 02</span>
                <span className="text-[#18E0C4] font-bold">LAYER-CAM MAP</span>
              </div>
              <h3 className="font-display font-bold text-xl text-[#EAF7FF]">LayerCAM Activation</h3>
              <p className="text-xs text-[#8BA6B8] leading-relaxed">
                ResNet50 bottleneck layer gradients compute fine-grained spatial heatmaps highlighting key diagnostic attention zones.
              </p>
            </div>

            <div className="h-48 rounded-2xl bg-[#050A14] border border-[#18E0C4]/30 relative overflow-hidden flex items-center justify-center p-4">
              <div
                className="absolute inset-0 opacity-60 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 65% 60%, rgba(255, 63, 164, 0.7) 0%, rgba(24, 224, 196, 0.4) 40%, transparent 70%)',
                }}
              />
              <div className="relative z-10 text-center font-mono text-xs text-[#EAF7FF] space-y-1">
                <p className="font-bold text-[#FF3FA4] text-glow-alert">HIGH ACTIVATION ZONE</p>
                <p className="text-[10px] text-[#18E0C4]">LayerCAM Gradient Weights</p>
              </div>
            </div>
          </motion.div>

          {/* Stage 3: Decision Support Output */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            className="p-6 rounded-3xl bg-[#0A1628]/80 backdrop-blur-xl border border-[#00D9FF]/20 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#8BA6B8]">
                <span>STAGE 03</span>
                <span className="text-[#FF3FA4] font-bold">DECISION SUPPORT</span>
              </div>
              <h3 className="font-display font-bold text-xl text-[#EAF7FF]">AI-Assisted Findings</h3>
              <p className="text-xs text-[#8BA6B8] leading-relaxed">
                Structured decision-support summary detailing probability breakdown, affected lobe, severity classification, and latency.
              </p>
            </div>

            <div className="h-48 rounded-2xl bg-[#050A14] border border-[#FF3FA4]/30 p-4 font-mono text-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[#FF3FA4] font-bold">PNEUMONIA</span>
                <span className="text-[#EAF7FF] font-bold">78.2% CONFIDENCE</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-[#8BA6B8]">
                <div className="flex items-center justify-between">
                  <span>Affected Lobe:</span>
                  <span className="text-[#00D9FF] font-bold">Right Lower Lobe</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Severity Level:</span>
                  <span className="text-[#FF3FA4] font-bold">High</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Analysis Speed:</span>
                  <span className="text-[#18E0C4] font-bold">1.83 Seconds</span>
                </div>
              </div>
              <div className="text-[9px] text-[#8BA6B8] italic pt-1 border-t border-slate-800">
                Potential finding • Research Prototype — Not for Clinical Use
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
