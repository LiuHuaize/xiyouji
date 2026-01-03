
export enum HealthServiceType {
  PHYSICAL = 'PHYSICAL',
  MENTAL = 'MENTAL',
  CHECKUP = 'CHECKUP'
}

export interface Symptom {
  id: string;
  label: string;
  icon: string;
}

export interface HealthMetrics {
  heartRate: number;
  bloodPressureHigh: number;
  bloodPressureLow: number;
  weight: number;
  qiLevel: number; // For Westward theme
}

export interface AIAnalysisResult {
  condition: string;
  cause: string;
  treatment: string;
  tcmAdvice?: string;
}
