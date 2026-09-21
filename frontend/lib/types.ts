export type SeverityLevel = 'Low' | 'Moderate' | 'High' | 'Normal';

export interface DiseaseProbability {
  disease: string;
  probability: number; // 0 to 1 or percentage 0-100
  category?: 'primary' | 'secondary' | 'low';
}

export interface Marker3DPosition {
  x: number;
  y: number;
  z: number;
  label: string;
  regionName: string;
}

export interface ScanRecord {
  id: string;
  scanCode: string;
  patientId: string;
  patientName: string;
  scanDate: string;
  imageUrl: string;
  heatmapUrl: string;
  primaryCondition: string;
  confidence: number; // e.g. 87 for 87%
  severity: SeverityLevel;
  affectedArea: string;
  analysisTimeSeconds: number; // e.g. 2.34
  findingsSummary: string;
  diseaseBreakdown: DiseaseProbability[];
  marker3D?: Marker3DPosition;
  isNormal: boolean;
}

export interface Patient {
  id: string;
  patientCode: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  lastScanDate: string;
  referringDoctor: string;
  historyNotes: string;
  status: 'Abnormal' | 'Normal' | 'Under Review';
  totalScans: number;
}

export interface DashboardStats {
  totalScans: number;
  normalScans: number;
  abnormalScans: number;
  avgModelAccuracy: number;
}

export interface DoctorProfile {
  name: string;
  role: string;
  department: string;
  hospital: string;
  avatarUrl: string;
  email: string;
}
