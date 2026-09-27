import { apiClient } from '../../../shared/lib/apiClient';
import { WasteLogEntry, DonationItem } from '@messmind/shared-types';

export const donationsApi = {
  async logWaste(facilityId: string, textInput: string): Promise<WasteLogEntry> {
    try {
      return await apiClient.post<WasteLogEntry>('/waste/log', { facilityId, textInput });
    } catch {
      // Local graceful fallback if backend is offline
      const match = textInput.match(/^(\d+(?:\.\d+)?)\s*(?:kg|kilos|kilograms)?\s+(.+)$/i);
      const quantityKg = match ? parseFloat(match[1]) : 1.0;
      const itemName = match ? match[2].trim() : textInput.trim();

      const fallbackEntry: WasteLogEntry = {
        id: `waste-${Date.now()}`,
        facilityId,
        date: new Date().toISOString(),
        itemName,
        quantityKg,
        source: 'voice_transcription',
      };

      const localList = JSON.parse(localStorage.getItem(`waste_logs_${facilityId}`) || '[]');
      localList.unshift(fallbackEntry);
      localStorage.setItem(`waste_logs_${facilityId}`, JSON.stringify(localList));

      return fallbackEntry;
    }
  },

  async getRecentWasteLogs(facilityId: string): Promise<WasteLogEntry[]> {
    try {
      return await apiClient.get<WasteLogEntry[]>(`/waste/${facilityId}`);
    } catch {
      return JSON.parse(localStorage.getItem(`waste_logs_${facilityId}`) || '[]');
    }
  },

  async getPresignedUploadUrl(fileName: string, contentType: string = 'image/jpeg') {
    return apiClient.post<{ uploadUrl: string; key: string; publicUrl: string }>('/donations/upload-url', {
      fileName,
      contentType,
    });
  },

  async createDonation(donation: Partial<DonationItem>): Promise<DonationItem> {
    return apiClient.post<DonationItem>('/donations', donation);
  },
};
