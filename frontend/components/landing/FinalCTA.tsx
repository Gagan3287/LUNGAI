'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldAlert } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="relative w-full py-28 bg-[#050A14] text-slate-100 overflow-hidden select-none border-t border-[#00D9FF]/15">
      {/* Dramatic Converging Radial Cyan Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-[#00D9FF]/20 via-[#18E0C4]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Network Grid Lines */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#00D9FF 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">
        {/* Eyebrow Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] text-xs font-bold uppercase tracking-widest backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-[#00D9FF]" />
          <span>READY TO EXPERIMENT?</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-[#EAF7FF] leading-[1.08]"
        >
          Accelerate Your Radiological <br />
          <span className="bg-gradient-to-r from-[#00D9FF] via-[#18E0C4] to-[#2D8CFF] bg-clip-text text-transparent">
            Research Today.
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-body text-base sm:text-lg text-[#8BA6B8] max-w-2xl mx-auto leading-relaxed"
        >
          Experience the next generation of AI-assisted chest X-ray decision support, multi-disease classification, and 3D anatomical explainability.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            href="/workstation"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00D9FF] via-[#00B8D9] to-[#2D8CFF] hover:from-[#18E0C4] hover:to-[#00D9FF] text-[#050A14] font-bold text-sm transition-all duration-300 shadow-2xl shadow-[#00D9FF]/30 flex items-center justify-center gap-2 group cursor-pointer"
          >
            Launch LUNG AI
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/workstation"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0A1628]/90 hover:bg-[#0B2233] border border-[#00D9FF]/30 hover:border-[#00D9FF]/60 text-[#EAF7FF] font-semibold text-sm transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2"
          >
            Explore Workstation Demo
          </Link>
        </motion.div>

        {/* Safety Disclaimer Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-6 flex items-center justify-center gap-2 text-xs text-[#8BA6B8]"
        >
          <ShieldAlert className="w-4 h-4 text-[#FF3FA4] flex-shrink-0" />
          <span>
            <strong className="text-[#EAF7FF]">Research Prototype — Not for Clinical Use.</strong> Decision-support research tool.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
