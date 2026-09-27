# ADR 0001: DynamoDB Single-Table Design

## Status
Accepted

## Context
The legacy application utilized Firebase Firestore with dispersed collections (`auctionItems`, `kitchens/{id}/dailyRecommendation`, `kitchens/{id}/wasteLog`). To migrate to AWS serverless infrastructure with high performance and low operational latency, a unified datastore is required.

## Decision
We adopt a single-table DynamoDB pattern (`MessMindTable`) using generic partition (`PK`) and sort (`SK`) keys accompanied by two Global Secondary Indexes (`GSI1`, `GSI2`).

### Entity Mapping:
- **User Profile:** `PK=USER#<id>`, `SK=PROFILE`, `GSI1PK=ROLE#<role>`
- **Waste Log:** `PK=KITCHEN#<id>`, `SK=WASTE#<timestamp>`
- **Recommendation:** `PK=KITCHEN#<id>`, `SK=REC#<date>`
- **Surplus Auction:** `PK=AUCTION#<id>`, `SK=ITEM`, `GSI1PK=STATUS#ACTIVE`
- **Active WebSocket Connections:** `PK=WS#CONN#<connectionId>`, `SK=METADATA`

## Consequences
- Single table simplifies provisioning and backup.
- Strict access pattern enforcement is guaranteed through repository layers.
