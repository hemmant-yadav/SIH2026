export interface WasteLogEntry {
  id: string;
  facilityId: string;
  date: string;
  itemName: string;
  quantityKg: number;
  source: 'manual' | 'voice_transcription';
}

export interface FreshnessEvaluation {
  freshnessScore: number; // 0 to 100
  estimatedRemainingShelfLifeHours: number;
  safetyFlag: boolean;
  visualDefectsSummary: string;
  analyzedAt: string;
}

export interface DonationItem {
  id: string;
  facilityId: string;
  name: string;
  quantityKg: number;
  category: string;
  photoS3Key?: string;
  photoUrl?: string;
  freshness?: FreshnessEvaluation;
  status: 'pending' | 'allocated' | 'collected';
  createdAt: string;
}
