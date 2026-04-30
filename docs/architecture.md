# CareAuditHub Architecture

CareAuditHub is an aged-care compliance dashboard demo built as one product with multiple backend implementation styles. The purpose is not to maintain unrelated applications, but to show how the same product contract can be served by different backend architectures.

## Architectural Goal

The frontend depends on a stable REST API contract, not on a specific backend runtime.

```text
Vue 3 frontend
  -> REST API contract
  -> NestJS API or Lambda API
  -> PostgreSQL
```

This keeps the product experience consistent while allowing backend tradeoff comparisons.

## Current Structure

```text
frontend/
  admin_vue3/                 active Vue 3 frontend
  admin_vue3_hard_coded_data/ reference-only original frontend

backend/
  docker-compose.yml          shared local infrastructure
  lambda/                     Serverless/Lambda-style API + Drizzle
  nestjs/                     NestJS API + Drizzle

docs/
  architecture.md             project architecture rationale
```

## Backend Responsibilities

### NestJS

NestJS is the best fit for the main synchronous product API.

It demonstrates:

- Module/controller/service structure
- Dependency injection
- Request validation and error handling
- Auth guards and role-based access control later
- Local development as a long-running API server

Future features that fit naturally here:

- JWT verification
- Cognito-authenticated REST routes
- Stripe checkout/session creation
- Role-based authorization for compliance users

### Lambda

Lambda is the best fit for AWS-native event and async workflows.

It demonstrates:

- Serverless HTTP handlers
- Stripe webhook processing
- SQS consumers
- Scheduled jobs
- Low-ops deployment style

Future features that fit naturally here:

- Stripe webhook handler
- SQS report submission worker
- Background compliance validation
- Scheduled sync checks

## Shared Database

Both current backends use the same local PostgreSQL database.

Local PostgreSQL is defined in:

```text
backend/docker-compose.yml
```

The database is shared infrastructure, so it intentionally lives above `backend/lambda` and `backend/nestjs`.

Current schema and seed logic live in the Lambda backend because that was the first backend implementation. A future cleanup could extract database ownership into:

```text
backend/db/
```

or:

```text
packages/db/
```

That shared package could own:

- Drizzle schema
- Seed data
- Migrations
- Shared domain types

## API Contract

The frontend should be able to switch backend implementations by changing environment configuration only.

Current contract:

```text
GET  /dashboard
GET  /residents
GET  /residents/:id
GET  /reports
GET  /reports/:id
POST /reports/:id/validate
GET  /audit-log
GET  /api-sync
POST /api-sync/:id/retry
```

To prevent backend drift, future work should add:

- OpenAPI documentation
- Contract tests shared by NestJS and Lambda
- Consistent error response shapes
- API versioning if the contract grows

## Auth And Security Direction

The project currently keeps auth simple for local demos. A realistic production path would add Cognito and JWT-based authorization.

Recommended direction:

- Cognito handles user identity
- Frontend stores short-lived tokens safely
- NestJS verifies JWTs for synchronous API routes
- Lambda verifies JWTs for protected serverless routes
- Role-based authorization controls access by facility, user role, and action
- Audit logs record security-sensitive actions

Healthcare compliance concerns should include:

- Least-privilege access
- Tenant or facility isolation
- Immutable audit trails
- Protection of resident data
- Secure handling of API credentials
- Clear data retention policies

## Payments Direction

Stripe can be demonstrated without making payments the core product.

Suggested split:

- NestJS creates checkout sessions or customer portal sessions
- Lambda receives Stripe webhooks
- PostgreSQL stores subscription/payment state
- SQS can decouple webhook receipt from slower downstream processing

This mirrors a common production pattern: synchronous APIs for user actions, event-driven workers for external system callbacks.

## Scalability Direction

The main scalability concerns are not only compute. For this product, the important areas are:

- PostgreSQL connection management
- Tenant/facility isolation
- Pagination and filtering for large audit logs
- Background processing for report validation
- Observability across HTTP requests and async jobs
- API contract stability across multiple backend implementations

Lambda can scale request or event handling quickly, but PostgreSQL still needs pooling and connection limits. NestJS gives more predictable long-running server behavior, but needs conventional deployment and scaling.

## Ownership Principle

Each technology should have a reason to exist.

The intended story is:

```text
NestJS = main product API
Lambda = AWS-native event and async processing
PostgreSQL = shared persistence
Vue = stable frontend consuming a backend-agnostic REST contract
```

If a new service or runtime does not strengthen that story, it should not be added.
