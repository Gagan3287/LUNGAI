'use client';

import React from 'react';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  Flame, 
  Maximize2, 
  Minimize2,
  RefreshCw
} from 'lucide-react';

interface CanvasControlsProps {
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onResetCamera: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  showRibcage: boolean;
  onToggleRibcage: () => void;
  showHeatmap: boolean;
  onToggleHeatmap: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export default function CanvasControls({
  autoRotate,
  onToggleAutoRotate,
  onResetCamera,
  onZoomIn,
  onZoomOut,
  showRibcage,
  onToggleRibcage,
  showHeatmap,
  onToggleHeatmap,
  isFullscreen,
  onToggleFullscreen,
}: CanvasControlsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between select-none z-20">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-black tracking-wider shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            3D
          </span>
          <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
            3D LUNG VISUALIZATION
          </h3>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 backdrop-blur-md">
          <button
            onClick={onResetCamera}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all"
            title="Reset Camera View"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggleRibcage}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
              showRibcage ? 'text-cyan-400 bg-cyan-500/20 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Ribcage Layer"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Viewer"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Left Vertical Tool Dock (matching Image 2) */}
      <div className="flex flex-col gap-2 w-max pointer-events-auto my-auto">
        <div className="flex flex-col gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-cyan-500/20 backdrop-blur-md shadow-xl">
          <button
            onClick={onToggleAutoRotate}
            className={`p-2 rounded-xl flex flex-col items-center gap-0.5 text-[9px] font-semibold transition-all ${
              autoRotate ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
            <span>Rotate</span>
          </button>

          <button
            onClick={onZoomIn}
            className="p-2 rounded-xl flex flex-col items-center gap-0.5 text-[9px] font-semibold text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all"
          >
            <ZoomIn className="w-4 h-4" />
            <span>Zoom In</span>
          </button>

          <button
            onClick={onZoomOut}
            className="p-2 rounded-xl flex flex-col items-center gap-0.5 text-[9px] font-semibold text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all"
          >
            <ZoomOut className="w-4 h-4" />
            <span>Zoom Out</span>
          </button>

          <button
            onClick={onToggleRibcage}
            className={`p-2 rounded-xl flex flex-col items-center gap-0.5 text-[9px] font-semibold transition-all ${
              showRibcage ? 'text-cyan-400 bg-cyan-500/20 border border-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Layers</span>
          </button>

          {/* AI Heatmap Toggle Button (matching Image 2 bottom icon) */}
          <button
            onClick={onToggleHeatmap}
            className={`p-2 rounded-xl flex flex-col items-center gap-0.5 text-[9px] font-bold transition-all mt-1 ${
              showHeatmap
                ? 'bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow-[0_0_15px_rgba(255,42,109,0.5)] border border-pink-400'
                : 'bg-slate-900/90 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400'
            }`}
          >
            <Flame className={`w-4 h-4 ${showHeatmap ? 'animate-bounce' : ''}`} />
            <span>AI Heatmap</span>
          </button>
        </div>
      </div>

      {/* Right Severity Spectrum Bar (matching Image 2 right side) */}
      <div className="absolute right-4 bottom-6 flex flex-col items-center gap-1 pointer-events-auto">
        <span className="text-[9px] font-bold text-slate-400">Low</span>
        <div className="w-2 h-28 rounded-full bg-gradient-to-b from-cyan-400 via-emerald-400 via-amber-400 to-pink-500 shadow-md" />
        <span className="text-[9px] font-bold text-pink-400">High</span>
      </div>
    </div>
  );
}
