'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, Sparkles, ShieldAlert, ChevronRight } from 'lucide-react';
import NeuralBackground from './NeuralBackground';
import HeroDataPanel from './HeroDataPanel';

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between overflow-x-clip bg-[#050A14] text-slate-100 select-none">
      {/* Canvas 2D Node/Line Animated Background */}
      <NeuralBackground />

      {/* Top Minimal Navbar */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D9FF] to-[#2D8CFF] flex items-center justify-center shadow-lg shadow-[#00D9FF]/20 group-hover:shadow-[#00D9FF]/40 transition-all duration-300">
            <Activity className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-display font-extrabold text-xl tracking-wider text-white flex items-center gap-1">
              LUNG<span className="text-[#00D9FF] text-glow-cyan">AI</span>
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#8BA6B8]" aria-label="Main Navigation">
          <a href="#product" className="hover:text-[#EAF7FF] transition-colors">Product</a>
          <a href="#technology" className="hover:text-[#EAF7FF] transition-colors">Technology</a>
          <a href="#how-it-works" className="hover:text-[#EAF7FF] transition-colors">How It Works</a>
          <a href="#insights" className="hover:text-[#EAF7FF] transition-colors">Insights</a>
          <a href="#research" className="hover:text-[#EAF7FF] transition-colors">Research</a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden sm:inline-block text-xs font-semibold text-[#8BA6B8] hover:text-white transition-colors px-3 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/workstation"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#00B8D9] hover:from-[#18E0C4] hover:to-[#00D9FF] text-[#050A14] font-bold text-xs transition-all duration-300 shadow-lg shadow-[#00D9FF]/20 flex items-center gap-1.5 cursor-pointer"
          >
            Launch Platform
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Hero Content Area */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 py-12 my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headline & Action */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>AI-POWERED CHEST X-RAY ANALYSIS</span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#EAF7FF] leading-[1.05]">
            See Beyond <br />
            <span className="bg-gradient-to-r from-[#00D9FF] via-[#18E0C4] to-[#2D8CFF] bg-clip-text text-transparent">
              the X-Ray.
            </span>
          </h1>

          {/* Supporting Subtitle */}
          <p className="font-body text-base sm:text-lg text-[#8BA6B8] max-w-2xl leading-relaxed">
            AI-assisted multi-disease classification and 3D anatomical explainability workstation designed for medical imaging workflows and clinical decision-support research.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link
              href="/workstation"
              className="px-7 py-4 rounded-2xl bg-gradient-to-r from-[#00D9FF] via-[#00B8D9] to-[#2D8CFF] hover:from-[#18E0C4] hover:to-[#00D9FF] text-[#050A14] font-bold text-sm transition-all duration-300 shadow-xl shadow-[#00D9FF]/25 flex items-center justify-center gap-2 group cursor-pointer"
            >
              Analyze an X-Ray
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#technology"
              className="px-7 py-4 rounded-2xl bg-[#0A1628]/80 hover:bg-[#0B2233] border border-[#00D9FF]/30 hover:border-[#00D9FF]/60 text-[#EAF7FF] font-semibold text-sm transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2"
            >
              Explore the Technology
              <ChevronRight className="w-4 h-4 text-[#00D9FF]" />
            </a>
          </div>

          {/* Safety & Compliance Trust Banner */}
          <div className="pt-4 flex items-center gap-2 text-xs text-[#8BA6B8]">
            <ShieldAlert className="w-4 h-4 text-[#FF3FA4] flex-shrink-0" />
            <span>
              <strong className="text-[#EAF7FF]">Research Prototype</strong> • AI-assisted analysis • Not for clinical use
            </span>
          </div>
        </motion.div>

        {/* Right Column: AI Telemetry & Analysis Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="lg:col-span-5 flex items-center justify-center"
        >
          <HeroDataPanel />
        </motion.div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="relative z-20 w-full py-6 text-center text-xs text-[#8BA6B8] flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-ping" />
        <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">SCROLL TO EXPLORE ARCHITECTURE</span>
      </div>
    </section>
  );
}
