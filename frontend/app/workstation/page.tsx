'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StatCards from '@/components/dashboard/StatCards';
import LungCanvas from '@/components/3d/LungCanvas';
import AIAnalysisSummary from '@/components/dashboard/AIAnalysisSummary';
import ScanGallery from '@/components/dashboard/ScanGallery';
import HeatmapViewer from '@/components/dashboard/HeatmapViewer';
import PatientInfoTable from '@/components/dashboard/PatientInfoTable';
import { SkeletonBlock } from '@/components/ui/SkeletonBlock';

import { MOCK_STATS, MOCK_SCANS, MOCK_PATIENTS } from '@/lib/mockData';
import { ScanRecord, Patient, DashboardStats } from '@/lib/types';
import { fetchStats, fetchPatients, fetchScans } from '@/lib/api';

/** Empty initial stats — ensures skeleton shows first, not stale mock counts */
const EMPTY_STATS: DashboardStats = {
  totalScans: 0,
  normalScans: 0,
  abnormalScans: 0,
  avgModelAccuracy: 0,
};

export default function WorkstationDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedScan, setSelectedScan] = useState<ScanRecord | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadDataFromBackend = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [fetchedStats, fetchedPatients, fetchedScans] = await Promise.all([
        fetchStats(),
        fetchPatients(),
        fetchScans(),
      ]);

      setStats(fetchedStats);
      setPatients(fetchedPatients);
      setScans(fetchedScans);
      if (fetchedScans.length > 0) {
        setSelectedScan(fetchedScans[0]);
      }
      setIsBackendConnected(true);
    } catch (err: any) {
      console.warn('Backend API connection failed, using fallback mode:', err);
      // Fall back to mock data so the dashboard is still usable offline
      setStats(MOCK_STATS);
      setPatients(MOCK_PATIENTS);
      setScans(MOCK_SCANS);
      setSelectedScan(MOCK_SCANS[0]);
      setIsBackendConnected(false);
      setErrorMessage(
        err.message || 'Unable to connect to FastAPI backend at http://localhost:8000'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDataFromBackend();
  }, [loadDataFromBackend]);

  const handleSelectPatient = (patientId: string) => {
    const patientScan = scans.find((s) => s.patientId === patientId);
    if (patientScan) {
      setSelectedScan(patientScan);
    }
  };

  const handleAddPatient = (newPatient: Patient) => {
    setPatients((prev) => [newPatient, ...prev]);
    // Refresh the backend list
    loadDataFromBackend();
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Backend Status / Connection Banner — animated in/out */}
      <AnimatePresence>
        {!isBackendConnected && !isLoading && (
          <motion.div
            key="offline-banner"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-amber-300">FastAPI Backend Unavailable</p>
                <p className="text-slate-400 text-[11px]">
                  {errorMessage || 'Make sure the backend is running at http://localhost:8000'} (Showing offline/cached prototype data)
                </p>
              </div>
            </div>
            <button
              onClick={loadDataFromBackend}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer flex-shrink-0 ml-4"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Connection
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner / Phase Notice */}
      <div className="p-6 rounded-2xl glass-panel relative overflow-hidden border border-cyan-500/30">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                Phase 8 — Final Polish
              </span>
              <span className="text-xs text-slate-400">Next.js (Port 8080) • FastAPI (Port 8000) • SQLite</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-wide flex items-center gap-2">
              LungAI Workstation &amp; Multi-Disease Analysis
            </h1>
            <p className="text-xs text-slate-400 max-w-3xl mt-1">
              Live end-to-end connected workstation: 3D rotatable lung viewer, AI findings summary, animated confidence breakdown, scan gallery, Grad-CAM heatmap overlay, patient records, and statistics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-slate-400">System Status</p>
              <p className={`text-xs font-semibold flex items-center gap-1.5 justify-end ${
                isLoading ? 'text-slate-400' : isBackendConnected ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  isLoading ? 'bg-slate-500 animate-pulse' : isBackendConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                }`} />
                {isLoading ? 'Connecting...' : isBackendConnected ? 'FastAPI & SQLite Connected' : 'Offline / Standalone Mode'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Statistics Overview — skeleton while loading */}
      <StatCards stats={stats} isLoading={isLoading} />

      {/* 2. Main Hero Row: 3D Anatomical Lung Viewer + AI Analysis Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (8 Cols): 3D Rotatable Lung Viewer */}
        <div className="lg:col-span-8 h-[520px]">
          {isLoading ? (
            <SkeletonBlock height="h-full" rounded="rounded-2xl" />
          ) : (
            <LungCanvas marker3D={selectedScan?.marker3D} />
          )}
        </div>

        {/* Right (4 Cols): AI Analysis Summary */}
        <div className="lg:col-span-4 h-[520px]">
          {isLoading || !selectedScan ? (
            <div className="p-6 rounded-2xl glass-panel border border-slate-800 h-full space-y-4">
              <SkeletonBlock height="h-4" width="w-36" />
              <SkeletonBlock height="h-24" />
              <div className="grid grid-cols-3 gap-2">
                <SkeletonBlock height="h-14" />
                <SkeletonBlock height="h-14" />
                <SkeletonBlock height="h-14" />
              </div>
              <SkeletonBlock height="h-28" />
            </div>
          ) : (
            <AIAnalysisSummary scan={selectedScan} />
          )}
        </div>
      </div>

      {/* 3. Middle Row: Scan Gallery Strip + Grad-CAM Heatmap Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 Cols): Scan Gallery */}
        <div className="lg:col-span-7">
          {isLoading ? (
            <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
              <SkeletonBlock height="h-4" width="w-28" />
              <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonBlock key={i} height="h-24" width="w-24" rounded="rounded-xl" className="flex-shrink-0" />
                ))}
              </div>
            </div>
          ) : (
            <ScanGallery
              scans={scans}
              activeScanId={selectedScan?.id || ''}
              onSelectScan={(scan) => setSelectedScan(scan)}
            />
          )}
        </div>

        {/* Right (5 Cols): Heatmap Analysis */}
        <div className="lg:col-span-5">
          {isLoading || !selectedScan ? (
            <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
              <SkeletonBlock height="h-4" width="w-40" />
              <SkeletonBlock height="h-36" />
              <SkeletonBlock height="h-3" width="w-32" />
            </div>
          ) : (
            <HeatmapViewer scan={selectedScan} />
          )}
        </div>
      </div>

      {/* 4. Bottom Row: Patient Information Table */}
      <PatientInfoTable
        patients={patients}
        activePatientId={selectedScan?.patientId || ''}
        onSelectPatient={handleSelectPatient}
        onAddPatient={handleAddPatient}
        isLoading={isLoading}
      />
    </div>
  );
}
