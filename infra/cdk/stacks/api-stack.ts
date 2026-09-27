import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayv2_integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

interface ApiStackProps extends cdk.StackProps {
  table: dynamodb.Table;
  bucket: s3.Bucket;
}

export class ApiStack extends cdk.Stack {
  public readonly restApi: apigateway.RestApi;
  public readonly webSocketApi: apigatewayv2.WebSocketApi;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // Common Lambda Environment
    const commonEnv = {
      DYNAMODB_TABLE_NAME: props.table.tableName,
      DONATIONS_BUCKET_NAME: props.bucket.bucketName,
    };

    // 1. REST API Gateway
    this.restApi = new apigateway.RestApi(this, 'MessMindRestApi', {
      restApiName: 'MessMind Service API',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // 2. WebSocket API Gateway for Real-Time Auction Updates
    const wsConnectFn = new lambda.Function(this, 'WsConnectFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handlers/auctionHandlers.wsConnectHandler',
      code: lambda.Code.fromInline('exports.wsConnectHandler = async () => ({ statusCode: 200, body: "OK" });'),
      environment: commonEnv,
    });

    const wsDisconnectFn = new lambda.Function(this, 'WsDisconnectFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handlers/auctionHandlers.wsDisconnectHandler',
      code: lambda.Code.fromInline('exports.wsDisconnectHandler = async () => ({ statusCode: 200, body: "OK" });'),
      environment: commonEnv,
    });

    this.webSocketApi = new apigatewayv2.WebSocketApi(this, 'MessMindWebSocketApi', {
      apiName: 'MessMind Live Matching WebSocket',
      connectRouteOptions: {
        integration: new apigatewayv2_integrations.WebSocketLambdaIntegration('ConnectIntegration', wsConnectFn),
      },
      disconnectRouteOptions: {
        integration: new apigatewayv2_integrations.WebSocketLambdaIntegration('DisconnectIntegration', wsDisconnectFn),
      },
    });

    const wsStage = new apigatewayv2.WebSocketStage(this, 'ProdStage', {
      webSocketApi: this.webSocketApi,
      stageName: 'prod',
      autoDeploy: true,
    });

    props.table.grantReadWriteData(wsConnectFn);
    props.table.grantReadWriteData(wsDisconnectFn);

    new cdk.CfnOutput(this, 'RestApiUrl', { value: this.restApi.url });
    new cdk.CfnOutput(this, 'WebSocketApiUrl', { value: wsStage.url });
  }
}
