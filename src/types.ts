export type SiteType = 'tent' | 'rv' | 'cabin';

export interface WeatherTag {
  id: string;
  label: string;
  icon: string;
  riskLevel: 0 | 1 | 2 | 3;
  color: string;
  isStrongWind: boolean;
}

export interface CampSite {
  id: string;
  name: string;
  row: number;
  col: number;
  type: SiteType;
  weatherTagId: string;
}

export interface ReservationDraft {
  id: string;
  siteId: string;
  guestName: string;
  date: string;
  guests: number;
  createdAt: number;
}

export interface WeatherSnapshot {
  siteId: string;
  weatherTagId: string;
  timestamp: number;
  riskLevel: number;
}

export const RISK_LABELS: Record<number, string> = {
  0: '安全',
  1: '注意',
  2: '警告',
  3: '危险',
};

export const RISK_COLORS: Record<number, string> = {
  0: '#27AE60',
  1: '#F1C40F',
  2: '#E67E22',
  3: '#C0392B',
};

export interface OperationError {
  id: string;
  message: string;
  type: 'warning' | 'error' | 'info';
  timestamp: number;
}

export interface CompareCandidate {
  siteId: string;
  addedAt: number;
}
