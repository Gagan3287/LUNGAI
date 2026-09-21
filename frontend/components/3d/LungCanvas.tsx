'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Activity } from 'lucide-react';
import { Marker3DPosition } from '@/lib/types';

const LungScene = dynamic(() => import('./LungScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[440px] rounded-2xl bg-[#080d1a] border border-cyan-500/20 flex flex-col items-center justify-center text-cyan-400 p-6">
      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3 animate-pulse">
        <Activity className="w-8 h-8 text-cyan-400" />
      </div>
      <p className="text-xs font-bold text-white tracking-wider">INITIALIZING 3D WEBGL LUNG CANVAS...</p>
      <p className="text-[11px] text-slate-400 mt-1">Loading anatomical shaders & 3D particle system</p>
    </div>
  ),
});

interface LungCanvasProps {
  marker3D?: Marker3DPosition;
  className?: string;
}

export default function LungCanvas({ marker3D, className }: LungCanvasProps) {
  return <LungScene marker3D={marker3D} className={className} />;
}
