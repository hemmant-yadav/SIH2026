# CDK Infrastructure

## Responsibilities
AWS Cloud Development Kit (TypeScript) stacks defining cloud resources for MessMind:
- `network-stack.ts`: API Gateway HTTP and WebSocket custom domains and CORS.
- `auth-stack.ts`: AWS Cognito User Pool, Client, and Identity Pool.
- `storage-stack.ts`: DynamoDB single-table (`MessMindTable`) and S3 donation photos bucket.
- `api-stack.ts`: REST and WebSocket API Gateways wired to service Lambdas.
- `hosting-stack.ts`: AWS Amplify Hosting for the Vite frontend (`apps/web`).
