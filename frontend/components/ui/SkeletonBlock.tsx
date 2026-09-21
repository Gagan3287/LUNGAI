'use client';

import React from 'react';

interface SkeletonBlockProps {
  className?: string;
  /** Height in Tailwind class format, e.g. "h-8", "h-24". Defaults to h-4. */
  height?: string;
  /** Width in Tailwind class format, e.g. "w-full", "w-32". Defaults to w-full. */
  width?: string;
  /** Border radius override. Defaults to rounded-xl. */
  rounded?: string;
}

/**
 * Animated skeleton placeholder respects prefers-reduced-motion:
 * the shimmer pulse is CSS-based, so the MotionConfig wrapper isn't needed here;
 * instead we use `motion-safe:` Tailwind variant implicitly via animation-play-state.
 */
export function SkeletonBlock({
  className = '',
  height = 'h-4',
  width = 'w-full',
  rounded = 'rounded-xl',
}: SkeletonBlockProps) {
  return (
    <div
      className={`${width} ${height} ${rounded} bg-slate-800/70 relative overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Shimmer sweep — respects prefers-reduced-motion via CSS */}
      <span
        className="absolute inset-0 -translate-x-full skeleton-shimmer"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(148,163,184,0.08) 40%, rgba(148,163,184,0.15) 50%, rgba(148,163,184,0.08) 60%, transparent 100%)',
        }}
      />
    </div>
  );
}

/** Pre-composed skeleton for a single StatCard */
export function StatCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between">
      <div className="space-y-2 flex-1 mr-4">
        <SkeletonBlock height="h-3" width="w-24" />
        <SkeletonBlock height="h-7" width="w-16" />
        <SkeletonBlock height="h-2.5" width="w-28" />
      </div>
      <SkeletonBlock height="h-12" width="w-12" rounded="rounded-xl" />
    </div>
  );
}

/** Pre-composed skeleton for a patient table row */
export function PatientRowSkeleton() {
  return (
    <tr className="border-b border-slate-800/60">
      {[32, 40, 24, 24, 32, 48].map((w, i) => (
        <td key={i} className="p-3">
          <SkeletonBlock height="h-3" width={`w-${w}`} />
        </td>
      ))}
    </tr>
  );
}

/** Pre-composed skeleton for scan gallery thumbnails */
export function ScanThumbnailSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonBlock key={i} height="h-24" width="w-24" rounded="rounded-xl" className="flex-shrink-0" />
      ))}
    </>
  );
}
