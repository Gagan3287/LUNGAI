'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Image as ImageIcon, Check } from 'lucide-react';
import { ScanRecord } from '@/lib/types';
import { getImageUrl } from '@/lib/api';

interface ScanGalleryProps {
  scans: ScanRecord[];
  activeScanId: string;
  onSelectScan: (scan: ScanRecord) => void;
}

export default function ScanGallery({ scans, activeScanId, onSelectScan }: ScanGalleryProps) {
  return (
    <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-cyan-400" />
          Scan Gallery
        </h3>
        <Link
          href="/history"
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Horizontal Scrollable Thumbnail Strip (matching Image 2) */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {/* "+ Upload New" Tile */}
        <Link
          href="/upload"
          className="w-24 h-24 rounded-xl border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 flex flex-col items-center justify-center text-cyan-400 transition-all flex-shrink-0 group"
        >
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 group-hover:scale-110 flex items-center justify-center transition-transform mb-1">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-200">Upload New</span>
        </Link>

        {/* Scan Thumbnails */}
        {scans.map((scan) => {
          const isSelected = scan.id === activeScanId;
          return (
            <button
              key={scan.id}
              onClick={() => onSelectScan(scan)}
              className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 group text-left ${
                isSelected
                  ? 'border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)] ring-2 ring-cyan-500/30'
                  : 'border-slate-800 hover:border-slate-600 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Scan Thumbnail Image */}
              <img
                src={getImageUrl(scan.imageUrl)}
                alt={scan.scanCode}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Active Checkmark Badge */}
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-md">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              {/* Scan Date Tag */}
              <div className="absolute bottom-1.5 left-1.5 right-1.5">
                <p className="text-[9px] font-medium text-slate-300 truncate">{scan.scanDate}</p>
                <p className={`text-[9px] font-bold truncate ${scan.isNormal ? 'text-emerald-400' : 'text-pink-400'}`}>
                  {scan.primaryCondition}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
