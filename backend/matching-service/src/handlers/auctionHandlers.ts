import { AuctionRepository } from '../repositories/auctionRepository';
import { WebSocketRepository } from '../repositories/webSocketRepository';
import { calculateDecayedPrice, canClaimItem } from '../domain/dutchAuctionPricing';
import { AuctionItem, WebSocketMessage } from '@messmind/shared-types';

const auctionRepo = new AuctionRepository();
const wsRepo = new WebSocketRepository();

export const wsConnectHandler = async (event: any) => {
  const connectionId = event.requestContext?.connectionId;
  if (connectionId) {
    await wsRepo.saveConnection(connectionId);
  }
  return { statusCode: 200, body: 'Connected' };
};

export const wsDisconnectHandler = async (event: any) => {
  const connectionId = event.requestContext?.connectionId;
  if (connectionId) {
    await wsRepo.removeConnection(connectionId);
  }
  return { statusCode: 200, body: 'Disconnected' };
};

export const getAuctionItemsHandler = async () => {
  try {
    const rawItems = await auctionRepo.getActiveAuctionItems();

    // Map each active item with current decayed Dutch auction price
    const enrichedItems: AuctionItem[] = rawItems.map((item) => ({
      ...item,
      currentPrice: calculateDecayedPrice(
        item.startPrice,
        item.drainStartTime,
        item.drainIntervalSeconds
      ),
    }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enrichedItems),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to fetch auction items' }),
    };
  }
};

export const claimAuctionItemHandler = async (event: any) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { itemId } = body;

    if (!itemId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing itemId' }) };
    }

    const item = await auctionRepo.getAuctionItem(itemId);
    if (!item || !canClaimItem(item)) {
      return { statusCode: 409, body: JSON.stringify({ error: 'Item not available to claim' }) };
    }

    const remainingQty = await auctionRepo.decrementItemQuantity(itemId);

    // Broadcast claim update to all connected WebSocket clients
    const broadcastMsg: WebSocketMessage<{ itemId: string; quantityLeft: number }> = {
      action: 'ITEM_CLAIMED',
      data: { itemId, quantityLeft: remainingQty ?? 0 },
      timestamp: new Date().toISOString(),
    };
    await wsRepo.broadcast(broadcastMsg);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, itemId, quantityLeft: remainingQty }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to claim auction item' }),
    };
  }
};
