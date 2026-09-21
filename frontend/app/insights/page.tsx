'use client';

import React from 'react';
import { Sparkles, Brain, Cpu, Database } from 'lucide-react';

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-cyan-400" />
          AI Model Insights & Architecture
        </h1>
        <p className="text-xs text-slate-400 mt-1">Deep Learning architecture metrics, multi-label classification specs, and Grad-CAM explainability overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 space-y-3">
          <Brain className="w-8 h-8 text-cyan-400" />
          <h3 className="text-base font-bold text-white">ResNet50 / EfficientNet</h3>
          <p className="text-xs text-slate-400">Transfer learning backbone pretrained on ImageNet and fine-tuned on NIH ChestX-ray14 dataset.</p>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 space-y-3">
          <Cpu className="w-8 h-8 text-blue-400" />
          <h3 className="text-base font-bold text-white">Multi-Label Binary Loss</h3>
          <p className="text-xs text-slate-400">BCEWithLogitsLoss with positive class weighting to handle NIH ChestX-ray14 class imbalance.</p>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 space-y-3">
          <Database className="w-8 h-8 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Grad-CAM Explainability</h3>
          <p className="text-xs text-slate-400">LayerCAM / Grad-CAM visual heatmaps highlighting discriminative spatial regions in the lungs.</p>
        </div>
      </div>
    </div>
  );
}
