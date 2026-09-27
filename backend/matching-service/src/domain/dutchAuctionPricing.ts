import { AuctionItem } from '@messmind/shared-types';

export const MIN_FLOOR_PRICE = 150;
export const PRICE_STEP = 10;

/**
 * Pure domain Dutch auction price tick calculation.
 * Decays price downwards towards a floor based on elapsed intervals.
 */
export const calculateDecayedPrice = (
  startPrice: number,
  drainStartTimeIso: string,
  intervalSeconds: number,
  floorPrice: number = MIN_FLOOR_PRICE
): number => {
  const startTime = new Date(drainStartTimeIso).getTime();
  const now = Date.now();
  const elapsedSec = Math.max(0, (now - startTime) / 1000);

  const ticks = Math.floor(elapsedSec / (intervalSeconds || 3.5));
  const decayed = startPrice - ticks * PRICE_STEP;

  return Math.max(floorPrice, decayed);
};

export const canClaimItem = (item: AuctionItem): boolean => {
  return item.status === 'active' && item.quantityLeft > 0;
};

export const decrementQuantity = (item: AuctionItem): AuctionItem => {
  const nextQuantity = Math.max(0, item.quantityLeft - 1);
  return {
    ...item,
    quantityLeft: nextQuantity,
    status: nextQuantity === 0 ? 'claimed' : 'active',
  };
};
