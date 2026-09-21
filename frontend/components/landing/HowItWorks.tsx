'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Cpu, Layers, ArrowRight, ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    title: 'Upload Radiograph',
    description: 'Select or drag-and-drop any standard chest X-ray image (JPG/PNG). The image spatial matrix is automatically validated and normalized.',
    icon: UploadCloud,
    accentColor: '#00D9FF',
    badge: 'Step 1: Input',
  },
  {
    number: '02',
    title: 'AI Feature Extraction',
    description: 'ResNet50 multi-label classifier analyzes radiological features and computes LayerCAM spatial heatmaps in under 2 seconds.',
    icon: Cpu,
    accentColor: '#18E0C4',
    badge: 'Step 2: Inference',
  },
  {
    number: '03',
    title: '3D Mapping & Insights',
    description: 'Review multi-disease probability distributions, rotatable 3D anatomical lobe projections, and structured decision-support findings.',
    icon: Layers,
    accentColor: '#2D8CFF',
    badge: 'Step 3: Decision Support',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative w-full py-24 bg-[#050A14] text-slate-100 overflow-hidden select-none border-t border-[#00D9FF]/15">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] text-xs font-bold uppercase tracking-widest">
            <Cpu className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>WORKFLOW ARCHITECTURE</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#EAF7FF]">
            Upload → Analyze → Understand.
          </h2>

          <p className="font-body text-base text-[#8BA6B8] leading-relaxed">
            A seamless three-step pipeline transforming chest radiograph inputs into actionable spatial explainability and decision-support research insights.
          </p>
        </div>

        {/* 3-Step Horizontal Process Cards Grid with Connecting Beam */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Animated Connecting Scan-Line Line across Desktop Grid */}
          <div className="hidden md:block absolute top-1/2 left-12 right-12 h-0.5 bg-[#00D9FF]/20 -translate-y-6 pointer-events-none z-0">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-[#00D9FF] via-[#18E0C4] to-[#2D8CFF] origin-left shadow-[0_0_12px_#00D9FF]"
            />
          </div>

          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.2, ease: 'easeOut' }}
                className="relative z-10 p-7 rounded-3xl bg-[#0A1628]/80 backdrop-blur-xl border border-[#00D9FF]/20 hover:border-[#00D9FF]/50 transition-all duration-300 space-y-5 group hover:-translate-y-1.5 shadow-xl"
              >
                {/* Step Header Bar */}
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: `${step.accentColor}18`,
                      border: `1px solid ${step.accentColor}40`,
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: step.accentColor }} />
                  </div>

                  <span className="font-display text-2xl font-black text-[#8BA6B8]/40 group-hover:text-[#00D9FF] transition-colors">
                    {step.number}
                  </span>
                </div>

                {/* Badge Tag */}
                <span
                  className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border"
                  style={{
                    backgroundColor: `${step.accentColor}12`,
                    borderColor: `${step.accentColor}30`,
                    color: step.accentColor,
                  }}
                >
                  {step.badge}
                </span>

                {/* Title & Description */}
                <div>
                  <h3 className="font-display font-bold text-xl text-[#EAF7FF] mb-2 group-hover:text-[#00D9FF] transition-colors">
                    {step.title}
                  </h3>
                  <p className="font-body text-xs text-[#8BA6B8] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Step Link Accent */}
                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#00D9FF] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Section Footer Safety Note */}
        <div className="pt-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A1628] border border-[#00D9FF]/20 text-xs text-[#8BA6B8]">
            <ShieldCheck className="w-4 h-4 text-[#18E0C4]" />
            <span>
              <strong className="text-[#EAF7FF]">AI-Assisted Workflow:</strong> Designed for clinical decision-support research. Research Prototype — Not for Clinical Use.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
