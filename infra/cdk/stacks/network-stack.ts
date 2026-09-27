import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class NetworkStack extends cdk.Stack {
  public readonly corsAllowedOrigins: string[];

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.corsAllowedOrigins = [
      'http://localhost:5173',
      'https://main.d12345abcdef.amplifyapp.com',
    ];

    new cdk.CfnOutput(this, 'CorsAllowedOrigins', {
      value: this.corsAllowedOrigins.join(','),
      description: 'CORS allowed origins for MessMind API',
    });
  }
}
