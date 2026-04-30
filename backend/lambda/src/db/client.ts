import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString =
  process.env.DATABASE_URL ?? 'postgres://careaudithub:careaudithub@localhost:5432/careaudithub'

export const sql = postgres(connectionString, {
  max: Number(process.env.DB_POOL_SIZE ?? 5),
  idle_timeout: 20,
  connect_timeout: 10,
})

export const db = drizzle(sql, { schema })
