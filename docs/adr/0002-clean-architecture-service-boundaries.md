# ADR 0002: Clean Architecture Service Boundaries

## Status
Accepted

## Context
Firebase code historically bundled database queries, event subscriptions, and business rules directly in React components. This created tight coupling and high blast radius.

## Decision
Each backend service adheres strictly to 3 layers:
1. **`handlers/`**: Lambda triggers only (event parsing, DTO transformation, HTTP status codes). No business calculations.
2. **`domain/`**: Pure business rules and domain logic. **Strictly zero AWS SDK imports**.
3. **`repositories/`**: AWS SDK integrations (DynamoDB DocumentClient, Bedrock, S3, Cognito).

## Consequences
- Domain logic is independently unit-testable without mocking AWS SDK.
- Swapping AWS infrastructure or providers requires zero changes to core domain logic.
