import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { WebSocketMessage } from '@messmind/shared-types';

export class WebSocketRepository {
  private apigwClient?: ApiGatewayManagementApiClient;
  private docClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor(endpoint?: string, tableName?: string, region?: string) {
    const rawClient = new DynamoDBClient({ region: region || process.env.AWS_REGION || 'us-east-1' });
    this.docClient = DynamoDBDocumentClient.from(rawClient);
    this.tableName = tableName || process.env.DYNAMODB_TABLE_NAME || 'MessMindTable';

    const wsEndpoint = endpoint || process.env.WEBSOCKET_ENDPOINT;
    if (wsEndpoint) {
      this.apigwClient = new ApiGatewayManagementApiClient({
        endpoint: wsEndpoint,
        region: region || process.env.AWS_REGION || 'us-east-1',
      });
    }
  }

  async saveConnection(connectionId: string): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        PK: `WS#CONN#${connectionId}`,
        SK: 'METADATA',
        connectedAt: new Date().toISOString(),
        entityType: 'WebSocketConnection',
      },
    });
    await this.docClient.send(command);
  }

  async removeConnection(connectionId: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: {
        PK: `WS#CONN#${connectionId}`,
        SK: 'METADATA',
      },
    });
    await this.docClient.send(command);
  }

  async broadcast<T>(message: WebSocketMessage<T>): Promise<void> {
    if (!this.apigwClient) return;

    // Fetch active connections
    const scan = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'begins_with(PK, :prefix)',
      ExpressionAttributeValues: {
        ':prefix': 'WS#CONN#',
      },
    });

    const result = await this.docClient.send(scan);
    const connections = result.Items || [];

    const payload = new TextEncoder().encode(JSON.stringify(message));

    await Promise.all(
      connections.map(async (conn) => {
        const connectionId = (conn.PK as string).replace('WS#CONN#', '');
        try {
          await this.apigwClient!.send(
            new PostToConnectionCommand({
              ConnectionId: connectionId,
              Data: payload,
            })
          );
        } catch (err: any) {
          if (err.statusCode === 410) {
            // Stale connection, delete
            await this.removeConnection(connectionId);
          }
        }
      })
    );
  }
}
