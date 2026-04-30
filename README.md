# CareAuditHub

CareAuditHub is an aged-care compliance dashboard demo with one Vue frontend and interchangeable backend implementations.

## Project Layout

```text
frontend/
  admin_vue3/                 active frontend
  admin_vue3_hard_coded_data/ reference-only original frontend

backend/
  lambda/                     Serverless/Lambda-style API + Drizzle
  nestjs/                     NestJS API + Drizzle
```

Both backends use the same REST API contract and the same local PostgreSQL database.

## Local Ports

```text
Vue frontend:          http://localhost:3001
Lambda offline API:    http://localhost:3000
NestJS API:            http://localhost:4000
Docker PostgreSQL:     localhost:5432
```

## Start The Local Database

The Docker Compose file lives in `backend` and starts the shared PostgreSQL database used by both backend implementations.

```bash
cd /Users/shinya/Programming/CareAuditHub/backend
docker compose up -d
cd lambda
npm install
npm run db:push
npm run db:seed
```

PostgreSQL connection:

```text
DATABASE_URL=postgres://careaudithub:careaudithub@localhost:5432/careaudithub
```

## Run With Lambda Backend

Terminal 1:

```bash
cd /Users/shinya/Programming/CareAuditHub/backend/lambda
npm run dev
```

Terminal 2:

```bash
cd /Users/shinya/Programming/CareAuditHub/frontend/admin_vue3
npm install
npm run dev:lambda
```

The frontend reads `frontend/admin_vue3/.env.lambda-local` and calls `http://localhost:3000`.

## Run With NestJS Backend

Terminal 1:

```bash
cd /Users/shinya/Programming/CareAuditHub/backend/nestjs
npm install
npm run start:dev
```

Terminal 2:

```bash
cd /Users/shinya/Programming/CareAuditHub/frontend/admin_vue3
npm install
npm run dev:nest
```

The frontend reads `frontend/admin_vue3/.env.nest-local` and calls `http://localhost:4000`.

## Frontend Backend Switching

The active frontend does not know or care whether the backend is Lambda, NestJS, .NET, or another REST implementation. It reads:

```text
VITE_API_BASE_URL
VITE_BACKEND_MODE
VITE_AUTH_MODE
```

from the selected Vite mode file and calls the stable REST API contract through `src/services`.

## API Contract

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

## Demo Database Strategy

For demo and local development, Docker PostgreSQL is the best default because anyone can clone the repo and run it without paid cloud resources.

For deployed demos, Supabase/Neon can be used as a low-cost Postgres target. For production AWS architecture, the Lambda backend can later point to RDS by changing `DATABASE_URL` and AWS networking configuration.
