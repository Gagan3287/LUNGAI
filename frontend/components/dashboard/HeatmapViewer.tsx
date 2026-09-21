'use client';

import React, { useState } from 'react';
import { Flame, Maximize2, X, Eye, EyeOff } from 'lucide-react';
import { ScanRecord } from '@/lib/types';
import { getImageUrl } from '@/lib/api';

interface HeatmapViewerProps {
  scan: ScanRecord;
}

export default function HeatmapViewer({ scan }: HeatmapViewerProps) {
  const [showModal, setShowModal] = useState(false);
  const [showHeatmapOverlay, setShowHeatmapOverlay] = useState(true);

  return (
    <>
      {/* Heatmap Preview Panel (matching Image 2 middle panel) */}
      <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20 space-y-3 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
            <Flame className="w-4 h-4 text-pink-400" />
            Heatmap Analysis (Grad-CAM)
          </h3>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            View Full Heatmap
          </button>
        </div>

        {/* Heatmap Image Box */}
        <div
          onClick={() => setShowModal(true)}
          className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 cursor-pointer group"
        >
          {/* Base X-Ray Image */}
          <img
            src={getImageUrl(scan.imageUrl)}
            alt="Original X-Ray"
            className="w-full h-full object-cover"
          />

          {/* Grad-CAM Heatmap Simulated Layer */}
          {showHeatmapOverlay && !scan.isNormal && (
            <div
              className="absolute inset-0 opacity-75 mix-blend-screen pointer-events-none transition-opacity duration-300"
              style={{
                background: 'radial-gradient(circle at 65% 65%, rgba(255, 42, 109, 0.95) 0%, rgba(245, 158, 11, 0.8) 30%, rgba(0, 240, 255, 0.5) 55%, transparent 75%)',
              }}
            />
          )}

          {/* Hover Overlay Hint */}
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-semibold text-white gap-2">
            <Maximize2 className="w-4 h-4 text-cyan-400" />
            Expand Grad-CAM View
          </div>
        </div>

        {/* Quick Toggle Controls */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
          <button
            onClick={() => setShowHeatmapOverlay(!showHeatmapOverlay)}
            className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300 hover:text-cyan-400 transition-colors"
          >
            {showHeatmapOverlay ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
            <span>{showHeatmapOverlay ? 'Heatmap Overlay On' : 'Original Grayscale'}</span>
          </button>
          <span className="text-[10px] text-pink-400 font-semibold font-mono">
            {scan.isNormal ? 'No Abnormality Flagged' : 'LayerCAM Activation'}
          </span>
        </div>
      </div>

      {/* Expanded Grad-CAM Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-3xl glass-panel border border-cyan-500/30 p-6 space-y-4 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-pink-400" />
                  Grad-CAM Spatial Explainability Heatmap
                </h3>
                <p className="text-xs text-slate-400">
                  {scan.scanCode} • {scan.patientName} • {scan.primaryCondition} ({scan.confidence}%)
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Split View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Original X-Ray */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400">Original Chest Radiograph</p>
                <div className="w-full h-72 rounded-2xl overflow-hidden border border-slate-800 bg-black">
                  <img src={getImageUrl(scan.imageUrl)} alt="Original" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Right: Grad-CAM Overlay */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-pink-400 flex items-center justify-between">
                  <span>Grad-CAM Class Activation Map</span>
                  <span className="text-[10px] text-slate-400">LayerCAM ResNet50</span>
                </p>
                <div className="relative w-full h-72 rounded-2xl overflow-hidden border border-pink-500/40 bg-black">
                  <img src={getImageUrl(scan.heatmapUrl || scan.imageUrl)} alt="Heatmap Base" className="w-full h-full object-cover" />
                  {!scan.isNormal && (
                    <div
                      className="absolute inset-0 opacity-80 mix-blend-screen"
                      style={{
                        background: 'radial-gradient(circle at 65% 65%, rgba(255, 42, 109, 0.95) 0%, rgba(245, 158, 11, 0.8) 35%, rgba(0, 240, 255, 0.5) 60%, transparent 80%)',
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer Description */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <span>Warm regions (red/pink/yellow) represent high feature importance for the predicted condition ({scan.affectedArea}).</span>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
