import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { AuctionItem } from '@messmind/shared-types';

export class AuctionRepository {
  private docClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor(tableName?: string, region?: string) {
    const rawClient = new DynamoDBClient({ region: region || process.env.AWS_REGION || 'us-east-1' });
    this.docClient = DynamoDBDocumentClient.from(rawClient);
    this.tableName = tableName || process.env.DYNAMODB_TABLE_NAME || 'MessMindTable';
  }

  async getActiveAuctionItems(): Promise<AuctionItem[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :status',
      ExpressionAttributeValues: {
        ':status': 'STATUS#ACTIVE',
      },
    });

    const result = await this.docClient.send(command);
    return (result.Items || []) as AuctionItem[];
  }

  async getAuctionItem(itemId: string): Promise<AuctionItem | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        PK: `AUCTION#${itemId}`,
        SK: 'ITEM',
      },
    });

    const result = await this.docClient.send(command);
    return (result.Item as AuctionItem) || null;
  }

  async saveAuctionItem(item: AuctionItem): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        PK: `AUCTION#${item.id}`,
        SK: 'ITEM',
        GSI1PK: `STATUS#${item.status.toUpperCase()}`,
        GSI1SK: item.drainStartTime,
        entityType: 'AuctionItem',
        ...item,
      },
    });
    await this.docClient.send(command);
  }

  async decrementItemQuantity(itemId: string): Promise<number | null> {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: {
        PK: `AUCTION#${itemId}`,
        SK: 'ITEM',
      },
      UpdateExpression: 'SET quantityLeft = quantityLeft - :dec',
      ConditionExpression: 'quantityLeft > :zero',
      ExpressionAttributeValues: {
        ':dec': 1,
        ':zero': 0,
      },
      ReturnValues: 'UPDATED_NEW',
    });

    const result = await this.docClient.send(command);
    return result.Attributes?.quantityLeft ?? null;
  }
}
