import { useState, useEffect } from 'react';
import { WasteLogEntry } from '@messmind/shared-types';
import { donationsApi } from '../api/donationsApi';

export const useWasteLogger = (facilityId: string = 'campus-dining-1') => {
  const [logs, setLogs] = useState<WasteLogEntry[]>([]);
  const [isLogging, setIsLogging] = useState(false);

  useEffect(() => {
    donationsApi.getRecentWasteLogs(facilityId).then((initialLogs) => {
      if (initialLogs.length > 0) {
        setLogs(initialLogs);
      }
    });
  }, [facilityId]);

  const logWaste = async (textInput: string): Promise<WasteLogEntry | null> => {
    if (!textInput.trim()) return null;
    setIsLogging(true);
    try {
      const newEntry = await donationsApi.logWaste(facilityId, textInput);
      setLogs((prev) => [newEntry, ...prev]);
      return newEntry;
    } finally {
      setIsLogging(false);
    }
  };

  return { logs, isLogging, logWaste };
};
