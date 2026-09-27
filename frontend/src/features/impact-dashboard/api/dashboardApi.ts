import { apiClient } from '../../../shared/lib/apiClient';
import { DashboardData, UnitType } from '@messmind/shared-types';

const mockKitchenData: DashboardData = {
  unitType: 'kitchen',
  unitName: 'Campus Dining Hall #1',
  stats: {
    loggedPrep: {
      value: 240.5,
      suffix: ' kg',
      decimals: 1,
      label: "Today's Logged Prep",
      subtext: 'Shift 2 Target: 230.0 kg',
    },
    varianceRate: {
      value: 4.8,
      suffix: '%',
      decimals: 1,
      label: 'Batch Variance Rate',
      subtext: '↓ 16.2% improvement vs prior week',
    },
    surplusDiverted: {
      value: 18.4,
      suffix: ' kg',
      decimals: 1,
      label: 'Surplus Diverted',
      subtext: 'Routed to Live Flash Auction',
    },
  },
  recommendation: {
    id: 'rec-k1',
    title: 'Trim Morning Rice Batch by 8.5 kg',
    description:
      'Algorithmic forecast predicts a 14% drop in student lunch attendance due to mid-term exam schedule. Curbing steam pan batch #3 prevents surplus.',
    estimatedSavingsKg: 8.5,
    estimatedSavingsCost: 170,
    confidenceScore: 94,
    actionText: 'Accept Batch Adjustment',
  },
  heatmap: [
    { day: 'Mon', intensity: 2, wasteKg: 12.4 },
    { day: 'Tue', intensity: 1, wasteKg: 8.1 },
    { day: 'Wed', intensity: 3, wasteKg: 19.8 },
    { day: 'Thu', intensity: 1, wasteKg: 6.5 },
    { day: 'Fri', intensity: 4, wasteKg: 24.2 },
    { day: 'Sat', intensity: 2, wasteKg: 11.0 },
    { day: 'Sun', intensity: 0, wasteKg: 3.2 },
  ],
  reportCard: {
    score: 88,
    grade: 'A',
    efficiencyRank: 'Top 5% of Monitored Kitchens',
    primaryAlert: 'Zero thermal degradation incidents in 14 days',
  },
};

const mockProcessingUnitData: DashboardData = {
  unitType: 'processing-unit',
  unitName: 'Central Prep & Processing Unit B',
  stats: {
    loggedPrep: {
      value: 1280.0,
      suffix: ' kg',
      decimals: 0,
      label: 'Bulk Processing Output',
      subtext: 'Daily Target: 1,200 kg',
    },
    varianceRate: {
      value: 2.1,
      suffix: '%',
      decimals: 1,
      label: 'Trim & Peel Loss',
      subtext: '↓ 8.4% improvement vs industrial benchmark',
    },
    surplusDiverted: {
      value: 142.0,
      suffix: ' kg',
      decimals: 0,
      label: 'Compost Diverted to Biogas',
      subtext: '100% circular biomass channeling',
    },
  },
  recommendation: {
    id: 'rec-p1',
    title: 'Recalibrate Vegetable Cutter Blade #2',
    description:
      'Vision sensors detected 3.2% higher peel variance on root vegetable batch #4. Blade realignment will recoup ~18kg per 500kg run.',
    estimatedSavingsKg: 18.0,
    estimatedSavingsCost: 360,
    confidenceScore: 98,
    actionText: 'Apply Line Calibration',
  },
  heatmap: [
    { day: 'Mon', intensity: 1, wasteKg: 34.2 },
    { day: 'Tue', intensity: 2, wasteKg: 48.0 },
    { day: 'Wed', intensity: 1, wasteKg: 28.5 },
    { day: 'Thu', intensity: 0, wasteKg: 18.0 },
    { day: 'Fri', intensity: 3, wasteKg: 62.4 },
    { day: 'Sat', intensity: 2, wasteKg: 42.1 },
    { day: 'Sun', intensity: 1, wasteKg: 22.0 },
  ],
  reportCard: {
    score: 94,
    grade: 'A+',
    efficiencyRank: 'Industrial Gold Standard',
    primaryAlert: 'Optimal biomass yield across 8 lines',
  },
};

export const dashboardApi = {
  async fetchDashboardData(unitType: UnitType): Promise<DashboardData> {
    try {
      return await apiClient.get<DashboardData>(`/telemetry/${unitType}`);
    } catch {
      return unitType === 'kitchen' ? mockKitchenData : mockProcessingUnitData;
    }
  },

  async updateRecommendationStatus(
    kitchenId: string,
    status: 'accepted' | 'overridden'
  ): Promise<void> {
    try {
      await apiClient.post(`/telemetry/${kitchenId}/recommendation`, { status });
    } catch {
      console.info(`[DynamoDB Mock] Recommendation ${status} recorded for ${kitchenId}`);
    }
  },
};
