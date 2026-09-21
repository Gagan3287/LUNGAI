import { Patient, ScanRecord, DashboardStats } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Prepend backend API URL if the image path is relative (e.g. /uploads/sample.png)
 */
export function getImageUrl(url?: string): string {
  if (!url) return '/scans/chest_xray_normal.svg';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url;
  }
  // Backend uploaded scans are served by FastAPI at /uploads/
  if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${API_BASE_URL}${cleanPath}`;
  }
  // Static frontend public assets (e.g. /scans/...) are served directly by Next.js
  return url.startsWith('/') ? url : `/${url}`;
}

/**
 * Fetch dashboard statistics from GET /api/stats
 */
export async function fetchStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE_URL}/api/stats`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch stats (HTTP ${res.status})`);
  }
  return res.json();
}

/**
 * Fetch patient records from GET /api/patients
 */
export async function fetchPatients(): Promise<Patient[]> {
  const res = await fetch(`${API_BASE_URL}/api/patients`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch patients (HTTP ${res.status})`);
  }
  return res.json();
}

/**
 * Create a new patient record via POST /api/patients
 */
export async function createPatient(patientData: {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  referringDoctor?: string;
  historyNotes?: string;
}): Promise<Patient> {
  const res = await fetch(`${API_BASE_URL}/api/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientData),
  });
  if (!res.ok) {
    throw new Error(`Failed to create patient record (HTTP ${res.status})`);
  }
  return res.json();
}

/**
 * Fetch scan records from GET /api/scans
 */
export async function fetchScans(patientId?: string): Promise<ScanRecord[]> {
  const url = patientId
    ? `${API_BASE_URL}/api/scans?patient_id=${encodeURIComponent(patientId)}`
    : `${API_BASE_URL}/api/scans`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch scans (HTTP ${res.status})`);
  }
  return res.json();
}

/**
 * Fetch single scan record by ID from GET /api/scans/{scan_id}
 */
export async function fetchScanById(scanId: string): Promise<ScanRecord> {
  const res = await fetch(`${API_BASE_URL}/api/scans/${scanId}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch scan detail (HTTP ${res.status})`);
  }
  return res.json();
}

/**
 * Upload X-ray image and run mock inference via POST /api/scans/upload
 */
export async function uploadScan(file: File, patientId?: string): Promise<ScanRecord> {
  const formData = new FormData();
  formData.append('file', file);
  if (patientId) {
    formData.append('patient_id', patientId);
  }

  const res = await fetch(`${API_BASE_URL}/api/scans/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.detail || `Upload failed with status code ${res.status}`;
    throw new Error(message);
  }

  return res.json();
}
