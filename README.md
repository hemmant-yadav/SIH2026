# MessMind — Operational Culinary Intelligence & Food Waste Telemetry

A high-performance monorepo platform connecting live kitchen prep telemetry, demand curves, and dynamic surplus redistribution to reclaim margins before food reaches the compost bin.

## Architecture & Technology Stack

- **Frontend (`frontend/`):** React 18 + TypeScript + Vite + Tailwind CSS (feature-based organization).
- **Backend Services (`backend/`):** AWS Serverless (bounded context services following clean/hexagonal architecture):
  - **`auth-service/`:** AWS Cognito User Pools, custom triggers, and role verification.
  - **`donations-service/`:** S3 presigned photo uploads, AWS Bedrock multimodal vision AI inspection, and natural-language voice logging.
  - **`matching-service/`:** DynamoDB Single-Table inventory, Dutch auction price-decay algorithms, and API Gateway WebSocket real-time updates.
  - **`notifications-service/`:** Amazon SNS operational telemetry and surplus dispatch alerting.
- **Shared Types (`packages/shared-types`):** Single source of truth for cross-tier domain interfaces.
- **Infrastructure as Code (`infra/cdk/`):** Modular AWS CDK TypeScript stacks (`auth`, `storage`, `api`, `hosting`, `network`).

## Monorepo Layout

```text
SIH/
├── frontend/                           # Feature-driven React Vite application
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── donations/
│   │   │   ├── matching/
│   │   │   ├── volunteer-routing/
│   │   │   └── impact-dashboard/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── lib/
│   │   │   └── utils/
│   │   ├── app/
│   │   └── styles/
│   └── vite.config.ts
├── backend/                            # Service-driven AWS serverless backends
│   ├── auth-service/
│   ├── donations-service/
│   ├── matching-service/
│   └── notifications-service/
├── packages/
│   └── shared-types/                   # Shared TypeScript contracts
├── infra/
│   └── cdk/                            # AWS CDK TypeScript infrastructure stacks
├── docs/
│   └── adr/                            # Architecture Decision Records
└── .github/
    └── workflows/                      # CI/CD automation pipelines
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Build All Workspaces
```bash
npm run build
```

### 3. Start Frontend Development Server
```bash
npm run dev:frontend
```

### 4. Deploy Infrastructure (CDK)
```bash
npm run --workspace=@messmind/infra-cdk deploy
```
