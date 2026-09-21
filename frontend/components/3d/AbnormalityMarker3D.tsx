'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Marker3DPosition } from '@/lib/types';
import { AlertCircle } from 'lucide-react';

interface AbnormalityMarker3DProps {
  marker: Marker3DPosition;
  visible?: boolean;
}

export default function AbnormalityMarker3D({ marker, visible = true }: AbnormalityMarker3DProps) {
  const meshRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.5;
      const s = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.15;
      ringRef.current.scale.set(s, s, s);
    }
  });

  if (!visible) return null;

  return (
    <group ref={meshRef} position={[marker.x, marker.y, marker.z]}>
      {/* Core Glowing Abnormality Sphere */}
      <mesh>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshBasicMaterial color="#ff2a6d" transparent opacity={0.85} />
      </mesh>

      {/* Pulsing Outer Aura */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.22, 0.32, 32]} />
        <meshBasicMaterial color="#ff2a6d" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* HTML Callout Annotation Tag */}
      <Html position={[0.3, 0.2, 0]} distanceFactor={6} zIndexRange={[100, 0]}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-pink-500/60 shadow-[0_0_20px_rgba(255,42,109,0.5)] backdrop-blur-md pointer-events-none whitespace-nowrap animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
          <AlertCircle className="w-4 h-4 text-pink-400" />
          <div>
            <p className="text-[11px] font-black text-pink-400 tracking-wide uppercase">{marker.label}</p>
            <p className="text-[10px] font-medium text-slate-300">{marker.regionName}</p>
          </div>
        </div>
      </Html>
    </group>
  );
}
