import { apiClient } from '../../../shared/lib/apiClient';
import { awsConfig } from '../../../shared/lib/awsConfig';
import { AuctionItem, WebSocketMessage } from '@messmind/shared-types';

const INITIAL_DEMO_ITEMS: AuctionItem[] = [
  {
    id: 'auction-1',
    facilityId: 'campus-dining-1',
    name: 'Paneer Biryani Saffron Batch (50 Portions)',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    currentPrice: 450,
    startPrice: 650,
    quantityLeft: 50,
    batchLabel: 'Kitchen Pass #2',
    drainStartTime: new Date().toISOString(),
    drainIntervalSeconds: 3.5,
    status: 'active',
  },
  {
    id: 'auction-2',
    facilityId: 'campus-dining-1',
    name: 'Dal Makhani Slow-Simmer (30 Portions)',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    currentPrice: 280,
    startPrice: 400,
    quantityLeft: 30,
    batchLabel: 'Kitchen Pass #1',
    drainStartTime: new Date().toISOString(),
    drainIntervalSeconds: 4,
    status: 'active',
  },
  {
    id: 'auction-3',
    facilityId: 'campus-dining-1',
    name: 'Steamed Basmati Rice Bulk Bin',
    imageUrl: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=800&q=80',
    currentPrice: 160,
    startPrice: 250,
    quantityLeft: 18,
    batchLabel: 'Line 4 Overflow',
    drainStartTime: new Date().toISOString(),
    drainIntervalSeconds: 3,
    status: 'active',
  },
];

export const matchingApi = {
  async getAuctionItems(): Promise<AuctionItem[]> {
    try {
      return await apiClient.get<AuctionItem[]>('/auction/items');
    } catch {
      return INITIAL_DEMO_ITEMS;
    }
  },

  async claimItem(itemId: string): Promise<boolean> {
    try {
      await apiClient.post('/auction/claim', { itemId });
      return true;
    } catch {
      // Local simulated claim
      const item = INITIAL_DEMO_ITEMS.find((i) => i.id === itemId);
      if (item) {
        item.quantityLeft = Math.max(0, item.quantityLeft - 1);
      }
      return true;
    }
  },

  subscribeToLiveAuction(onUpdate: (items: AuctionItem[]) => void): () => void {
    let ws: WebSocket | null = null;
    const fallbackInterval: NodeJS.Timeout | null = null;

    try {
      ws = new WebSocket(awsConfig.wsUrl);
      ws.onmessage = (event) => {
        try {
          const msg: WebSocketMessage<AuctionItem[]> = JSON.parse(event.data);
          if (msg.action === 'AUCTION_UPDATE' && Array.isArray(msg.data)) {
            onUpdate(msg.data);
          }
        } catch (err) {
          console.warn('WebSocket message parse error:', err);
        }
      };
      ws.onerror = () => {
        // Fall back to polling / initial data
        onUpdate(INITIAL_DEMO_ITEMS);
      };
    } catch {
      onUpdate(INITIAL_DEMO_ITEMS);
    }

    // Deliver initial state
    onUpdate(INITIAL_DEMO_ITEMS);

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
      }
    };
  },
};
