# CareAuditHub NestJS Backend

This is a NestJS implementation of the same REST API contract exposed by `backend/lambda`.

It lets the Vue frontend switch backend implementations by changing only:

```text
VITE_API_BASE_URL=http://localhost:4000
VITE_BACKEND_MODE=nestjs-local
VITE_AUTH_MODE=none
```

## What NestJS Is Here

NestJS is the local long-running API server version of the CareAuditHub backend. It uses controllers for HTTP routes, services for business logic, Drizzle ORM for database access, and PostgreSQL for persistence.

Request flow:

```text
Vue page
-> API service
-> NestJS controller
-> NestJS service
-> Drizzle
-> PostgreSQL
```

## How It Differs From The Lambda Backend

`backend/lambda` runs as Lambda-style handlers through `serverless-offline`.

`backend/nestjs` runs as one local HTTP server:

```text
http://localhost:4000
```

Both implementations return the same frontend-facing response shapes:

- `GET /dashboard`
- `GET /residents`
- `GET /residents/:id`
- `GET /reports`
- `GET /reports/:id`
- `POST /reports/:id/validate`
- `GET /audit-log`
- `GET /api-sync`
- `POST /api-sync/:id/retry`

## Local Setup

Install dependencies:

```bash
cd /Users/shinya/Programming/CareAuditHub/backend/nestjs
npm install
```

Create a local env file if needed:

```bash
cp .env.example .env
```

Run the API:

```bash
npm run start:dev
```

Build:

```bash
npm run build
```

Type-check:

```bash
npm run type-check
```

## Database

This backend connects to the shared local Docker PostgreSQL database.

Default connection:

```text
postgres://careaudithub:careaudithub@localhost:5432/careaudithub
```

Start the shared database, then seed it from the existing Lambda Drizzle setup:

```bash
cd /Users/shinya/Programming/CareAuditHub/backend
docker compose up -d
cd lambda
npm run db:push
npm run db:seed
```

Then run NestJS:

```bash
cd /Users/shinya/Programming/CareAuditHub/backend/nestjs
npm run start:dev
```

## Local Frontend Pairing

Run the Vue frontend against this NestJS backend with:

```bash
cd /Users/shinya/Programming/CareAuditHub/frontend/admin_vue3
npm run dev:nest
```

Port map:

```text
Vue frontend:          http://localhost:3001
NestJS API:            http://localhost:4000
Docker PostgreSQL:     localhost:5432
```

## Example Endpoints

```text
http://localhost:4000/dashboard
http://localhost:4000/residents
http://localhost:4000/residents/RES-1042
http://localhost:4000/reports
http://localhost:4000/reports/MED-INC-2026-04
http://localhost:4000/audit-log
http://localhost:4000/api-sync
```

Mutation examples:

```bash
curl -X POST http://localhost:4000/reports/MED-INC-2026-04/validate
curl -X POST http://localhost:4000/api-sync/api-2/retry
```

## Frontend Switch

In `frontend/admin_vue3`, use:

```text
VITE_API_BASE_URL=http://localhost:4000
VITE_BACKEND_MODE=nestjs-local
VITE_AUTH_MODE=none
```

No frontend component changes are needed because the Vue app depends only on stable REST contracts.
