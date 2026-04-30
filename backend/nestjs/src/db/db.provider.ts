import { ConfigService } from '@nestjs/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

export const DRIZZLE_DB = Symbol('DRIZZLE_DB')

export type DrizzleDb = ReturnType<typeof createDrizzleClient>

function createDrizzleClient(connectionString: string) {
  const client = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  })

  return drizzle(client, { schema })
}

export const drizzleProvider = {
  provide: DRIZZLE_DB,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const connectionString = config.get<string>(
      'DATABASE_URL',
      'postgres://careaudithub:careaudithub@localhost:5432/careaudithub',
    )

    return createDrizzleClient(connectionString)
  },
}
