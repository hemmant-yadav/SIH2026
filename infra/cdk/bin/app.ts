#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../stacks/network-stack';
import { AuthStack } from '../stacks/auth-stack';
import { StorageStack } from '../stacks/storage-stack';
import { ApiStack } from '../stacks/api-stack';
import { HostingStack } from '../stacks/hosting-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
};

const networkStack = new NetworkStack(app, 'MessMindNetworkStack', { env });
const authStack = new AuthStack(app, 'MessMindAuthStack', { env });
const storageStack = new StorageStack(app, 'MessMindStorageStack', { env });

new ApiStack(app, 'MessMindApiStack', {
  env,
  table: storageStack.table,
  bucket: storageStack.donationsBucket,
});

new HostingStack(app, 'MessMindHostingStack', { env });

app.synth();
