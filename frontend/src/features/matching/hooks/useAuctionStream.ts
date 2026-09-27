import { useState, useEffect, useCallback } from 'react';
import { AuctionItem } from '@messmind/shared-types';
import { matchingApi } from '../api/matchingApi';

export const useAuctionStream = () => {
  const [items, setItems] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = matchingApi.subscribeToLiveAuction((fetchedItems) => {
      setItems(fetchedItems);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const claimItem = useCallback(async (itemId: string): Promise<boolean> => {
    const success = await matchingApi.claimItem(itemId);
    if (success) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, quantityLeft: Math.max(0, item.quantityLeft - 1) }
            : item
        )
      );
    }
    return success;
  }, []);

  return { items, loading, claimItem };
};
