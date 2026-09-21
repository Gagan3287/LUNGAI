'use client';

import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import LungModel from './LungModel';
import AbnormalityMarker3D from './AbnormalityMarker3D';
import CanvasControls from './CanvasControls';
import { Marker3DPosition } from '@/lib/types';

interface LungSceneProps {
  marker3D?: Marker3DPosition;
  className?: string;
}

export default function LungScene({ marker3D, className = '' }: LungSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const [autoRotate, setAutoRotate] = useState(true);
  const [showRibcage, setShowRibcage] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultMarker: Marker3DPosition = marker3D || {
    x: 0.65,
    y: -0.95,
    z: 0.35,
    label: 'Abnormality Detected',
    regionName: 'Right Lower Lobe (Consolidation)',
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleZoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(1.2);
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(1.2);
      controlsRef.current.update();
    }
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[520px] rounded-2xl bg-gradient-to-b from-[#0b1324] via-[#080d1a] to-[#050811] overflow-hidden border border-cyan-500/20 shadow-2xl ${className}`}
    >
      {/* Background Holographic Glow Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-hologram-glow pointer-events-none" />

      {/* R3F WebGL 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0.05, 5.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Lights */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#00f0ff" />
        <directionalLight position={[-5, -5, -5]} intensity={1.0} color="#3b82f6" />
        <pointLight position={[0, 0, 2]} intensity={2.0} color="#00f0ff" />

        {/* 3D Lung Anatomical Model */}
        <LungModel
          showRibcage={showRibcage}
          showAirways={true}
          showHeatmapLayer={showHeatmap}
          autoRotate={autoRotate}
        />

        {/* Pulsing Abnormality Marker */}
        <AbnormalityMarker3D marker={defaultMarker} visible={true} />

        {/* Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          minDistance={1.8}
          maxDistance={6.0}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Overlay Canvas UI Controls */}
      <CanvasControls
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
        onResetCamera={handleResetCamera}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        showRibcage={showRibcage}
        onToggleRibcage={() => setShowRibcage(!showRibcage)}
        showHeatmap={showHeatmap}
        onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />
    </div>
  );
}
