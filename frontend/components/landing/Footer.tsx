'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#050A14] text-slate-100 border-t border-[#00D9FF]/15 py-12 select-none">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00D9FF] to-[#2D8CFF] flex items-center justify-center shadow-md shadow-[#00D9FF]/20">
              <Activity className="w-4 h-4 text-white animate-pulse" />
            </div>
            <span className="font-display font-extrabold text-lg tracking-wider text-white">
              LUNG<span className="text-[#00D9FF]">AI</span>
            </span>
          </Link>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-[#8BA6B8]">
            <Link href="/workstation" className="hover:text-[#EAF7FF] transition-colors">
              Workstation
            </Link>
            <Link href="/upload" className="hover:text-[#EAF7FF] transition-colors">
              Scan &amp; Upload
            </Link>
            <Link href="/patients" className="hover:text-[#EAF7FF] transition-colors">
              Patients
            </Link>
            <Link href="/history" className="hover:text-[#EAF7FF] transition-colors">
              History
            </Link>
            <a href="#technology" className="hover:text-[#EAF7FF] transition-colors">
              Technology
            </a>
            <a href="#research" className="hover:text-[#EAF7FF] transition-colors">
              Research
            </a>
          </div>

          {/* Copyright */}
          <div className="text-xs text-[#8BA6B8] font-mono">
            &copy; 2026 LUNG AI Research Group.
          </div>
        </div>

        {/* Bottom Safety Disclaimer Bar */}
        <div className="pt-6 border-t border-[#00D9FF]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8BA6B8]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-[#FF3FA4] flex-shrink-0" />
            <span>Research Prototype — Not for Clinical Use. Decision-support research tool.</span>
          </div>

          <span className="font-mono text-[10px]">NEXT.JS • FASTAPI • PYTORCH • SQLITE</span>
        </div>
      </div>
    </footer>
  );
}
