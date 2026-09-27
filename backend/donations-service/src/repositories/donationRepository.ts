import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { DonationItem, WasteLogEntry } from '@messmind/shared-types';

export class DonationRepository {
  private docClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor(tableName?: string, region?: string) {
    const rawClient = new DynamoDBClient({ region: region || process.env.AWS_REGION || 'us-east-1' });
    this.docClient = DynamoDBDocumentClient.from(rawClient);
    this.tableName = tableName || process.env.DYNAMODB_TABLE_NAME || 'MessMindTable';
  }

  async saveWasteLog(log: WasteLogEntry): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        PK: `KITCHEN#${log.facilityId}`,
        SK: `WASTE#${log.date}`,
        GSI1PK: `ITEM#${log.itemName}`,
        GSI1SK: log.date,
        entityType: 'WasteLog',
        ...log,
      },
    });
    await this.docClient.send(command);
  }

  async getRecentWasteLogs(facilityId: string, limit: number = 20): Promise<WasteLogEntry[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
      ExpressionAttributeValues: {
        ':pk': `KITCHEN#${facilityId}`,
        ':skPrefix': 'WASTE#',
      },
      ScanIndexForward: false,
      Limit: limit,
    });

    const result = await this.docClient.send(command);
    return (result.Items || []) as WasteLogEntry[];
  }

  async saveDonation(donation: DonationItem): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        PK: `DONATION#${donation.id}`,
        SK: 'METADATA',
        GSI1PK: `STATUS#${donation.status}`,
        GSI1SK: donation.createdAt,
        entityType: 'Donation',
        ...donation,
      },
    });
    await this.docClient.send(command);
  }
}
