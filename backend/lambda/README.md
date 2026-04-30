# CareAuditHub Lambda Backend

Local AWS Lambda-style backend for the CareAuditHub Vue 3 compliance dashboard.

Architecture:

```text
Vue 3 frontend
  -> Serverless Offline HTTP API
  -> TypeScript Lambda handlers
  -> Drizzle ORM
  -> PostgreSQL in Docker
```

## 1. Start PostgreSQL

From `backend/`:

```bash
cd /Users/shinya/Programming/CareAuditHub/backend
docker compose up -d
```

PostgreSQL runs on `localhost:5432` with:

```text
database: careaudithub
user: careaudithub
password: careaudithub
```

Copy `.env.example` if you want a local `.env` file:

```bash
cp .env.example .env
```

## 2. Apply Drizzle Schema

Install dependencies first:

```bash
npm install
```

Then push the schema into the local database:

```bash
npm run db:push
```

This creates:

- `residents`
- `reports`
- `audit_logs`
- `api_sync_connections`
- `api_sync_history`
- `dashboard_metrics`

## 3. Seed Data

```bash
npm run db:seed
```

The seed data mirrors the current frontend mock shapes for dashboard metrics, residents, reports, audit log entries, and API sync connections.

## 4. Run Local Lambda Offline API

```bash
npm run dev
```

Serverless Offline starts the API at:

```text
http://localhost:3000
```

CORS is enabled for the Vue dev server origin in `.env.example`:

```text
http://localhost:3001
```

## Local Frontend Pairing

Run the Vue frontend against this Lambda backend with:

```bash
cd /Users/shinya/Programming/CareAuditHub/frontend/admin_vue3
npm run dev:lambda
```

Port map:

```text
Vue frontend:          http://localhost:3001
Lambda offline API:    http://localhost:3000
Docker PostgreSQL:     localhost:5432
```

## 5. Example Endpoints

```bash
curl http://localhost:3000/dashboard
curl http://localhost:3000/residents
curl http://localhost:3000/residents/RES-1042
curl http://localhost:3000/reports
curl http://localhost:3000/reports/MED-INC-2026-04
curl -X POST http://localhost:3000/reports/MED-INC-2026-04/validate
curl http://localhost:3000/audit-log
curl http://localhost:3000/api-sync
curl -X POST http://localhost:3000/api-sync/api-2/retry
```

## 6. Moving To AWS RDS Later

The backend already reads `DATABASE_URL` from the environment. To move from local Docker PostgreSQL to AWS RDS:

- Create a PostgreSQL RDS instance.
- Store the RDS connection string in AWS Secrets Manager or SSM Parameter Store.
- Inject that value as `DATABASE_URL` for deployed Lambdas.
- Run Drizzle migrations or `drizzle-kit push` against the RDS database from CI/CD or an admin workstation.
- Place Lambdas in the same VPC/subnets/security groups that can reach RDS.
- Keep the handler/service/db split unchanged; only the deployment networking and environment values need to change.

## Project Shape

Handlers are intentionally thin and only translate API Gateway events into service calls. Business logic lives in `src/services`, while table definitions and the database client live in `src/db`.
