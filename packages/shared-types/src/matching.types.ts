export interface AuctionItem {
  id: string;
  facilityId: string;
  name: string;
  imageUrl: string;
  currentPrice: number;
  startPrice: number;
  quantityLeft: number;
  batchLabel: string;
  drainStartTime: string;
  drainIntervalSeconds: number;
  status: 'active' | 'claimed' | 'expired';
}

export type WebSocketMessageType =
  | 'AUCTION_SUBSCRIBE'
  | 'AUCTION_UPDATE'
  | 'ITEM_CLAIMED'
  | 'AUCTION_TICK';

export interface WebSocketMessage<T = unknown> {
  action: WebSocketMessageType;
  data: T;
  timestamp: string;
}
