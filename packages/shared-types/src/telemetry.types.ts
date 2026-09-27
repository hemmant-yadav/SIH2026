export type UnitType = 'kitchen' | 'processing-unit';

export interface DashboardMetric {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  subtext: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  estimatedSavingsKg: number;
  estimatedSavingsCost: number;
  confidenceScore: number;
  actionText: string;
  status?: 'pending' | 'accepted' | 'overridden';
}

export interface HeatmapDay {
  day: string;
  intensity: 0 | 1 | 2 | 3 | 4;
  wasteKg: number;
}

export interface ReportCardData {
  score: number;
  grade: string;
  efficiencyRank: string;
  primaryAlert: string;
}

export interface DashboardData {
  unitType: UnitType;
  unitName: string;
  stats: {
    loggedPrep: DashboardMetric;
    varianceRate: DashboardMetric;
    surplusDiverted: DashboardMetric;
  };
  recommendation: Recommendation;
  heatmap: HeatmapDay[];
  reportCard: ReportCardData;
}
