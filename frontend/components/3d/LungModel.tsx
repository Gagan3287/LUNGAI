'use client';

/**
 * LungModel.tsx — Bilateral lung lobes + branching airway tree + ribcage
 *
 * Geometry:
 *  - Two mirrored, organic lung-lobe shapes built via ExtrudeGeometry from a
 *    hand-tuned 2D Bezier profile: wide/rounded top (apex near trachea),
 *    bulging lateral edge, concave medial edge, tapered base.
 *  - Each lobe renders as a translucent glass mesh + a larger glowing wireframe
 *    overlay (holographic reference aesthetic).
 *  - Recursive branching airway tree per lobe (trachea → main bronchi →
 *    lobar → segmental branches) as tapered cylinders + glowing node spheres.
 *  - Subtle 5-rib ribcage, controlled via showRibcage prop.
 *
 * Props wired:
 *  - autoRotate:     toggles idle Y-axis ambient rotation via useFrame
 *  - showRibcage:    toggles ribcage mesh group visibility
 *  - showAirways:    toggles airway tree group visibility
 *  - showHeatmapLayer: switches lobe material to pink/amber heatmap palette
 */

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LungModelProps {
  showRibcage?: boolean;
  showAirways?: boolean;
  showHeatmapLayer?: boolean;
  autoRotate?: boolean;
}

// ── 2D Lobe Profile (right side; left is mirrored via scaleX=-1) ──────────────
// Medial (concave) edge near x=0; lateral (bulging) edge toward +x.
// Wide/rounded at apex (y ≈ 1.6), tapers to pointed base (y ≈ -1.9).
function createLungLobeShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0.10, 1.60);                               // apex near trachea
  shape.bezierCurveTo(0.60, 1.75, 1.35, 1.50, 1.55, 0.80); // rounded upper shoulder
  shape.bezierCurveTo(1.70, 0.30, 1.55, -0.40, 1.15, -1.10); // lateral taper
  shape.bezierCurveTo(0.90, -1.60, 0.55, -1.85, 0.25, -1.90); // pointed base
  shape.bezierCurveTo(0.05, -1.60, -0.05, -1.00, 0.02, -0.30); // medial concave edge
  shape.bezierCurveTo(0.05, 0.50, 0.02, 1.10, 0.10, 1.60);     // back to apex
  return shape;
}

function useLobeGeometry(wireframePass = false): THREE.ExtrudeGeometry {
  return useMemo(() => {
    const shape = createLungLobeShape();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.90,
      bevelEnabled: true,
      bevelThickness: 0.15,
      bevelSize: 0.12,
      bevelSegments: wireframePass ? 4 : 6,
      curveSegments: wireframePass ? 16 : 24,
    });
    geo.computeBoundingBox();
    const bbox = geo.boundingBox!;
    const centerY = (bbox.min.y + bbox.max.y) / 2;
    const centerZ = (bbox.min.z + bbox.max.z) / 2;
    geo.translate(0, -centerY, -centerZ);
    return geo;
  }, [wireframePass]);
}

// ── Per-lobe mesh: glass solid + wireframe glow overlay ───────────────────────
interface LungLobeProps {
  side: 'left' | 'right';
  heatmap: boolean;
}

function LungLobe({ side, heatmap }: LungLobeProps) {
  const solidGeo = useLobeGeometry(false);
  const wireGeo  = useLobeGeometry(true);

  const scaleX  = side === 'left' ? -1 : 1;
  const xOffset = side === 'right' ? 0.22 : -0.22;
  const yaw     = side === 'right' ? -0.25 : 0.25;

  // Normal = holographic cyan; Heatmap = warm red/amber per lobe
  const baseColor   = heatmap ? (side === 'right' ? '#ff3a5c' : '#f97316') : '#3fc8ff';
  const emissive    = heatmap ? (side === 'right' ? '#cc1433' : '#c05000') : '#0ea5e9';
  const wireColor   = heatmap ? (side === 'right' ? '#ff8095' : '#fbbf24') : '#7dd3fc';

  return (
    <group position={[xOffset, 0, 0]} rotation={[0, yaw, 0]}>
      {/* Translucent glass/transmission layer */}
      <mesh geometry={solidGeo} scale={[scaleX, 1, 1]}>
        <meshPhysicalMaterial
          color={baseColor}
          emissive={emissive}
          emissiveIntensity={heatmap ? 0.55 : 0.35}
          transparent
          opacity={heatmap ? 0.45 : 0.28}
          roughness={0.15}
          metalness={0}
          transmission={heatmap ? 0.3 : 0.60}
          thickness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Glowing wireframe overlay (slightly enlarged) */}
      <mesh geometry={wireGeo} scale={[scaleX * 1.02, 1.02, 1.02]}>
        <meshBasicMaterial color={wireColor} wireframe transparent opacity={heatmap ? 0.55 : 0.35} />
      </mesh>
    </group>
  );
}

// ── Recursive Bronchial Tree ──────────────────────────────────────────────────
type BranchSegment = { start: THREE.Vector3; end: THREE.Vector3; radius: number };

function growBranches(
  origin: THREE.Vector3,
  direction: THREE.Vector3,
  length: number,
  radius: number,
  depth: number,
  out: BranchSegment[],
  seed: { n: number },
) {
  if (depth <= 0 || length < 0.08) return;
  const end = origin.clone().addScaledVector(direction, length);
  out.push({ start: origin.clone(), end, radius });

  // Deterministic LCG so tree is stable across re-renders
  const rand = () => {
    seed.n = (seed.n * 9301 + 49297) % 233280;
    return seed.n / 233280;
  };

  const splitCount = depth > 3 ? 2 : rand() > 0.5 ? 2 : 1;
  for (let i = 0; i < splitCount; i++) {
    const axis = new THREE.Vector3(rand() - 0.5, rand() - 0.3, rand() - 0.5).normalize();
    const spread = 0.45 + rand() * 0.35;
    const newDir = direction
      .clone()
      .applyAxisAngle(axis, (i === 0 ? 1 : -1) * spread)
      .normalize();
    growBranches(end, newDir, length * 0.72, radius * 0.68, depth - 1, out, seed);
  }
}

function AirwayTree({ side }: { side: 'left' | 'right' }) {
  const segments = useMemo<BranchSegment[]>(() => {
    const result: BranchSegment[] = [];
    const originX = side === 'right' ? 0.22 : -0.22;
    const origin  = new THREE.Vector3(originX, 1.30, 0.10);
    const dir     = new THREE.Vector3(side === 'right' ? 0.30 : -0.30, -1, 0).normalize();
    growBranches(origin, dir, 0.55, 0.035, 5, result, { n: side === 'right' ? 7 : 13 });
    return result;
  }, [side]);

  return (
    <group>
      {segments.map((seg, i) => {
        const dir  = seg.end.clone().sub(seg.start);
        const len  = dir.length();
        const mid  = seg.start.clone().lerp(seg.end, 0.5);
        const quat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir.clone().normalize(),
        );
        return (
          <group key={i}>
            {/* Branch cylinder */}
            <mesh position={mid} quaternion={quat}>
              <cylinderGeometry args={[seg.radius * 1.6, seg.radius * 1.2, len, 8]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#00f0ff"
                emissiveIntensity={1.5}
                transparent
                opacity={0.95}
              />
            </mesh>
            {/* Junction glow node */}
            <mesh position={seg.end}>
              <sphereGeometry args={[seg.radius * 2.0, 10, 10]} />
              <meshBasicMaterial color="#00f0ff" transparent opacity={1.0} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ── Ribcage (5 subtle semi-circular arcs, pushed behind lungs on -Z) ──────────
function Ribcage() {
  const ribs = useMemo(() => {
    const geoms: THREE.TubeGeometry[] = [];
    const ribData = [
      { y: 0.90, w: 1.10, d: 0.50 },
      { y: 0.55, w: 1.25, d: 0.58 },
      { y: 0.18, w: 1.35, d: 0.60 },
      { y: -0.18, w: 1.32, d: 0.56 },
      { y: -0.52, w: 1.18, d: 0.48 },
    ];
    for (const { y, w, d } of ribData) {
      const pts: THREE.Vector3[] = [];
      const segs = 28;
      for (let j = 0; j <= segs; j++) {
        const angle = -Math.PI / 2 + (j / segs) * Math.PI;
        pts.push(new THREE.Vector3(Math.cos(angle) * w, y, Math.sin(angle) * d - 0.45));
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      geoms.push(new THREE.TubeGeometry(curve, 24, 0.018, 5, false));
    }
    return geoms;
  }, []);

  return (
    <group>
      {ribs.map((geom, idx) => (
        <mesh key={idx} geometry={geom}>
          <meshStandardMaterial
            color="#2060c0"
            emissive="#1040a0"
            emissiveIntensity={0.25}
            transparent
            opacity={0.16}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Top-level exported LungModel ──────────────────────────────────────────────
export default function LungModel({
  showRibcage = true,
  showAirways = true,
  showHeatmapLayer = false,
  autoRotate = true,
}: LungModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.15; // gentle idle rotation
    }
  });

  return (
    // scale 0.92 so the taller ExtrudeGeometry lobe fits the 4.0 camera Z
    <group ref={groupRef} scale={0.72}>
      {/* ── Lung Lobes ── */}
      <LungLobe side="right" heatmap={showHeatmapLayer} />
      <LungLobe side="left"  heatmap={showHeatmapLayer} />

      {/* ── Trachea trunk connecting the two lobes at the apex ── */}
      {showAirways && (
        <mesh position={[0, 1.75, 0.10]}>
          <cylinderGeometry args={[0.09, 0.11, 0.50, 12]} />
          <meshBasicMaterial color="#e0f7ff" transparent opacity={0.90} />
        </mesh>
      )}

      {/* ── Bilateral Airway Trees (inside the lobes) ── */}
      {showAirways && (
        <>
          <AirwayTree side="right" />
          <AirwayTree side="left" />
        </>
      )}

      {/* ── Ribcage (subtle background structure) ── */}
      {showRibcage && <Ribcage />}
    </group>
  );
}
