import * as cdk from 'aws-cdk-lib';
import * as amplify from 'aws-cdk-lib/aws-amplify';
import { Construct } from 'constructs';

export class HostingStack extends cdk.Stack {
  public readonly amplifyApp: amplify.CfnApp;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.amplifyApp = new amplify.CfnApp(this, 'MessMindWebHosting', {
      name: 'messmind-web',
      platform: 'WEB',
    });

    new amplify.CfnBranch(this, 'MainBranch', {
      appId: this.amplifyApp.attrAppId,
      branchName: 'main',
      enableAutoBuild: true,
      stage: 'PRODUCTION',
    });

    new cdk.CfnOutput(this, 'AmplifyAppId', {
      value: this.amplifyApp.attrAppId,
    });
    new cdk.CfnOutput(this, 'AmplifyDefaultDomain', {
      value: this.amplifyApp.attrDefaultDomain,
    });
  }
}
