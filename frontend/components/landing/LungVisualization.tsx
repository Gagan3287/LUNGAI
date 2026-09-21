'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FloatingAnalysisCard, { FloatingCardData } from './FloatingAnalysisCard';
import { CheckCircle2, ShieldAlert, MapPin, Clock } from 'lucide-react';

const CARDS: FloatingCardData[] = [
  {
    id: 'card-1',
    type: 'status',
    title: 'AI ANALYSIS',
    value: 'COMPLETED',
    subtext: 'ResNet50 + LayerCAM',
    icon: CheckCircle2,
    accentColor: '#18E0C4',
    positionClasses: '-top-4 -left-6',
    delay: 0.4,
  },
  {
    id: 'card-2',
    type: 'finding',
    title: 'POTENTIAL FINDING',
    value: 'PNEUMONIA 78.2%',
    subtext: 'High Confidence Classification',
    icon: ShieldAlert,
    accentColor: '#FF3FA4',
    positionClasses: 'top-20 -right-8',
    delay: 0.6,
  },
  {
    id: 'card-3',
    type: 'region',
    title: 'AFFECTED REGION',
    value: 'RIGHT LOWER LOBE',
    subtext: 'Basilar Infiltrate Zone',
    icon: MapPin,
    accentColor: '#00D9FF',
    positionClasses: 'bottom-24 -left-10',
    delay: 0.8,
  },
  {
    id: 'card-4',
    type: 'speed',
    title: 'PROCESSING TIME',
    value: '1.83 SECONDS',
    subtext: 'Local Inference Complete',
    icon: Clock,
    accentColor: '#2D8CFF',
    positionClasses: '-bottom-2 right-4',
    delay: 1.0,
  },
];

export default function LungVisualization() {
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setParallax({ x: x * 12, y: y * 12 });
  };

  const handleMouseLeave = () => {
    setParallax({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[540px] aspect-square flex items-center justify-center select-none"
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-gradient-radial from-[#00D9FF]/15 via-[#00B8D9]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Floating Cards */}
      {CARDS.map((card) => (
        <FloatingAnalysisCard key={card.id} card={card} />
      ))}

      {/* Main Parallax Wrapper */}
      <motion.div
        animate={{ x: parallax.x, y: parallax.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        className="relative w-full h-full flex items-center justify-center p-4"
      >
        {/* Outer Circular Grid & Target Ring */}
        <div className="absolute inset-4 rounded-full border border-[#00D9FF]/15 flex items-center justify-center">
          <div className="w-[85%] h-[85%] rounded-full border border-dashed border-[#00D9FF]/20" />
        </div>

        {/* Abstract Stylized SVG Lung Silhouette with Contour Lines */}
        <svg
          viewBox="0 0 400 440"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full max-w-[420px] max-h-[440px] relative z-10 drop-shadow-[0_0_25px_rgba(0,217,255,0.25)]"
        >
          <defs>
            {/* Cyan Outline Gradient */}
            <linearGradient id="lungOutlineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#18E0C4" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#2D8CFF" stopOpacity="0.8" />
            </linearGradient>

            {/* Abnormality Highlight Gradient */}
            <radialGradient id="lesionGlow" cx="68%" cy="65%" r="22%">
              <stop offset="0%" stopColor="#FF3FA4" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#FF3FA4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FF3FA4" stopOpacity="0" />
            </radialGradient>

            {/* Scan Line Beam Gradient */}
            <linearGradient id="scanLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="25%" stopColor="#00D9FF" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#00D9FF" stopOpacity="0.95" />
              <stop offset="75%" stopColor="#18E0C4" stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Central Trachea / Bronchial Tree Stem */}
          <path
            d="M 200 40 L 200 150 M 200 110 L 140 160 M 200 110 L 260 160 M 140 160 L 110 210 M 260 160 L 290 210"
            stroke="url(#lungOutlineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="4 2"
            opacity="0.8"
          />

          {/* Right Lung Outer Silhouette */}
          <path
            d="M 190 70 C 140 65, 80 100, 70 180 C 60 250, 75 340, 120 370 C 150 390, 185 365, 190 320 C 195 270, 185 140, 190 70 Z"
            stroke="url(#lungOutlineGrad)"
            strokeWidth="2.5"
            fill="rgba(0, 217, 255, 0.04)"
          />

          {/* Right Lung Internal Anatomical Contour Lines */}
          <path
            d="M 100 140 Q 140 150 180 130 M 80 210 Q 135 225 185 200 M 90 280 Q 140 300 180 270 M 110 330 Q 145 345 175 320"
            stroke="#00D9FF"
            strokeWidth="1.2"
            strokeOpacity="0.4"
            fill="none"
          />

          {/* Left Lung Outer Silhouette */}
          <path
            d="M 210 70 C 260 65, 320 100, 330 180 C 340 250, 325 340, 280 370 C 250 390, 215 365, 210 320 C 205 270, 215 140, 210 70 Z"
            stroke="url(#lungOutlineGrad)"
            strokeWidth="2.5"
            fill="rgba(0, 217, 255, 0.04)"
          />

          {/* Left Lung Internal Anatomical Contour Lines */}
          <path
            d="M 300 140 Q 260 150 220 130 M 320 210 Q 265 225 215 200 M 310 280 Q 260 300 220 270 M 290 330 Q 255 345 225 320"
            stroke="#00D9FF"
            strokeWidth="1.2"
            strokeOpacity="0.4"
            fill="none"
          />

          {/* Abnormality Heatmap Lesion Region (Right Lower Lobe) */}
          <circle cx="270" cy="285" r="45" fill="url(#lesionGlow)" />
          <circle cx="270" cy="285" r="8" fill="#FF3FA4" className="animate-ping" opacity="0.7" />
          <circle cx="270" cy="285" r="4" fill="#FF3FA4" />

          {/* Target Bounding Reticle around Lesion */}
          <rect
            x="240"
            y="255"
            width="60"
            height="60"
            rx="8"
            stroke="#FF3FA4"
            strokeWidth="1.5"
            strokeDasharray="6 3"
            fill="none"
            opacity="0.8"
          />

          {/* Slow Horizontal Scan Line Animation */}
          <g className="animate-scan-sweep">
            <line x1="40" y1="0" x2="360" y2="0" stroke="url(#scanLineGrad)" strokeWidth="3" />
          </g>
        </svg>
      </motion.div>

      {/* Embedded CSS animation for scan line sweep */}
      <style jsx>{`
        @keyframes scanSweep {
          0% {
            transform: translateY(60px);
          }
          50% {
            transform: translateY(370px);
          }
          100% {
            transform: translateY(60px);
          }
        }
        .animate-scan-sweep {
          animation: scanSweep 4.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-scan-sweep {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
