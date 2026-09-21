'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  UploadCloud,
  FileImage,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Flame,
  ArrowRight,
  RefreshCw,
  User,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Patient, ScanRecord } from '@/lib/types';
import { fetchPatients, uploadScan, getImageUrl, createPatient } from '@/lib/api';
import HeatmapViewer from '@/components/dashboard/HeatmapViewer';
import AIAnalysisSummary from '@/components/dashboard/AIAnalysisSummary';
import LungCanvas from '@/components/3d/LungCanvas';

const SCAN_STEPS = [
  'Uploading radiograph & validating spatial matrix...',
  'Preprocessing image & running ResNet50 feature extractor...',
  'Computing LayerCAM spatial activation map & confidence scores...',
  'Logging record to SQLite & generating findings summary...',
];

export default function UploadPage() {
  const router = useRouter();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [newPatientName, setNewPatientName] = useState<string>('');
  const [isLoadingPatients, setIsLoadingPatients] = useState<boolean>(true);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Scanning animation states
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Result state
  const [scanResult, setScanResult] = useState<ScanRecord | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  /** True only when the error came from a scan attempt (not file validation), so retry button shows */
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Patients on Mount
  useEffect(() => {
    async function loadPatients() {
      setIsLoadingPatients(true);
      try {
        const data = await fetchPatients();
        setPatients(data);
        if (data.length > 0) {
          setSelectedPatientId(data[0].id);
        }
      } catch (err) {
        console.warn('Could not load patients list:', err);
      } finally {
        setIsLoadingPatients(false);
      }
    }
    loadPatients();
  }, []);

  // Handle File Selection
  const handleFileSelect = (file: File) => {
    setUploadError(null);

    // Validate format
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png') {
      setUploadError('Invalid file format. Only JPG and PNG images are supported.');
      return;
    }

    // Validate size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
      setUploadError('File size exceeds maximum limit of 20MB.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setScanResult(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Trigger Upload + Simulated Scanning Animation
  const handleStartAnalysis = async () => {
    if (!selectedFile) return;

    setUploadError(null);
    setIsRetrying(false);
    setIsScanning(true);
    setScanProgress(0);
    setCurrentStepIndex(0);

    let patId = selectedPatientId;

    // Handle inline patient creation if requested or if patient list was empty
    if (!patId && newPatientName.trim()) {
      try {
        const newPat = await createPatient({
          name: newPatientName.trim(),
          age: 40,
          gender: 'Male',
        });
        patId = newPat.id;
        setPatients((prev) => [newPat, ...prev]);
        setSelectedPatientId(newPat.id);
      } catch (e: any) {
        setUploadError(`Failed to register patient: ${e.message}`);
        setIsScanning(false);
        return;
      }
    }

    // Minimum display time setup (2.5 seconds = 2500 ms)
    const minAnimationMs = 2500;
    const animationStartTime = Date.now();

    // Start progress bar timer
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - animationStartTime;
      const progressPercent = Math.min(Math.floor((elapsed / minAnimationMs) * 90), 90);
      setScanProgress(progressPercent);

      // Step updates based on percentage
      if (progressPercent > 70) setCurrentStepIndex(3);
      else if (progressPercent > 45) setCurrentStepIndex(2);
      else if (progressPercent > 20) setCurrentStepIndex(1);
      else setCurrentStepIndex(0);
    }, 50);

    try {
      // Execute actual POST /api/scans/upload call
      const uploadPromise = uploadScan(selectedFile, patId || undefined);

      // Ensure minimum display time of 2.5s completes
      const [result] = await Promise.all([
        uploadPromise,
        new Promise((resolve) => setTimeout(resolve, minAnimationMs)),
      ]);

      clearInterval(progressInterval);
      setScanProgress(100);
      setCurrentStepIndex(3);

      setTimeout(() => {
        setIsScanning(false);
        setScanResult(result);
      }, 300);
    } catch (err: any) {
      clearInterval(progressInterval);
      setIsScanning(false);
      setUploadError(err.message || 'Failed to upload and analyze X-ray scan.');
    }
  };

  // Retry wrapper: flags isRetrying so the button shows spinner + is disabled during the attempt
  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await handleStartAnalysis();
    } finally {
      setIsRetrying(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setScanResult(null);
    setUploadError(null);
    setIsRetrying(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Title */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <UploadCloud className="w-7 h-7 text-cyan-400" />
          Scan & Upload Chest X-Ray
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload a chest radiograph (JPG / PNG format) for instant multi-disease classification, Grad-CAM heatmap visualization, and 3D anatomical mapping.
        </p>
      </div>

      {/* Patient Selection & File Upload Card */}
      {!scanResult && (
        <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 space-y-6">
          {/* Patient Selector Row */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              Patient Record Assignment
            </h3>

            {isLoadingPatients ? (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                Loading patient directory...
              </div>
            ) : patients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Select Existing Patient</label>
                  <select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    disabled={isScanning}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.patientCode} — {p.name} ({p.age}y / {p.gender})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Or Enter New Patient Name</label>
                  <input
                    type="text"
                    value={newPatientName}
                    onChange={(e) => {
                      setNewPatientName(e.target.value);
                      if (e.target.value) setSelectedPatientId('');
                    }}
                    placeholder="e.g. Vikram Sharma"
                    disabled={isScanning}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
                <span>No existing patient records found in database. Enter a patient name below:</span>
                <input
                  type="text"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="Patient Name (Required)"
                  className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
            )}
          </div>

          {/* Error Banner — animated + retry CTA for scan failures */}
          <AnimatePresence>
            {uploadError && (
              <motion.div
                key="upload-error"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs"
              >
                <div className="flex items-start gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
                {/* Retry CTA — only shown when there's a selected file to retry with */}
                {selectedFile && (
                  <button
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-300 font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isRetrying ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Retrying...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        Retry Analysis
                      </>
                    )}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Drag & Drop File Box */}
          {!previewUrl ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="p-10 rounded-2xl border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/80 bg-cyan-500/5 hover:bg-cyan-500/10 transition-all text-center flex flex-col items-center justify-center cursor-pointer group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/10">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Drag & drop your X-ray here</h3>
              <p className="text-xs text-slate-400 mb-4">or click to browse files from your computer</p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800">
                <FileImage className="w-3.5 h-3.5 text-cyan-400" />
                <span>Supported formats: JPG, PNG • Maximum size: 20MB</span>
              </div>
            </div>
          ) : (
            /* Selected File Preview & Scanning Progress Display */
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Image Preview Box with Radar Scanner Overlay */}
                <div className="md:col-span-5 relative h-64 rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-950 flex items-center justify-center shadow-xl">
                  <img src={previewUrl} alt="Scan preview" className="w-full h-full object-cover" />

                  {/* Scanning Animation Sweep */}
                  {isScanning && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f0ff] animate-pulse"
                        style={{
                          position: 'absolute',
                          top: `${scanProgress}%`,
                          transition: 'top 0.1s linear',
                        }}
                      />
                      <div className="absolute inset-0 bg-cyan-500/10 backdrop-brightness-110" />
                    </div>
                  )}
                </div>

                {/* File Details & Action Controls */}
                <div className="md:col-span-7 space-y-4">
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white truncate max-w-[200px]">{selectedFile?.name}</span>
                      <span className="text-cyan-400 font-mono">
                        {((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Assigned Patient:{' '}
                      <strong className="text-cyan-300">
                        {patients.find((p) => p.id === selectedPatientId)?.name || newPatientName || 'Default Patient'}
                      </strong>
                    </p>
                  </div>

                  {/* Scanning Animation Status */}
                  {isScanning ? (
                    <div className="space-y-3 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-cyan-300 flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                          Running AI Disease Classification...
                        </span>
                        <span className="font-mono font-bold text-cyan-400">{scanProgress}%</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-150"
                          style={{ width: `${scanProgress}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-slate-300 font-mono italic">
                        &gt; {SCAN_STEPS[currentStepIndex]}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleStartAnalysis}
                        className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        Analyze Chest X-Ray Now
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                      >
                        Change Image
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Privacy Note */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center gap-3 text-xs text-slate-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Data Privacy Note:</strong> Patient scans are stored locally in the backend database repository for research analysis. No data is transmitted externally.
            </span>
          </div>
        </div>
      )}

      {/* Completed Scan Results Display */}
      {scanResult && (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
          {/* Header Banner */}
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-sm text-emerald-300">Analysis Completed & Persisted to SQLite</h3>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Scan Record Code: <strong className="font-mono text-cyan-400">{scanResult.scanCode}</strong> • Patient: <strong>{scanResult.patientName}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Upload Another
              </button>
              <Link
                href="/workstation"
                className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
              >
                Open Workstation
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 3D Anatomical Lung View (8 cols) */}
            <div className="lg:col-span-8 h-[500px]">
              <LungCanvas marker3D={scanResult.marker3D} />
            </div>

            {/* AI Summary Card (4 cols) */}
            <div className="lg:col-span-4 h-[500px]">
              <AIAnalysisSummary scan={scanResult} />
            </div>
          </div>

          {/* Heatmap Viewer Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-12">
              <HeatmapViewer scan={scanResult} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
