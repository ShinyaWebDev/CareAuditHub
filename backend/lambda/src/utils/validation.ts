import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { z } from 'zod'

export const pathIdSchema = z.object({
  id: z.string().min(1),
})

export function parsePathId(event: APIGatewayProxyEventV2) {
  return pathIdSchema.parse(event.pathParameters ?? {}).id
}

export function parseJsonBody<T>(event: APIGatewayProxyEventV2, schema: z.ZodType<T>): T {
  const rawBody = event.body ? JSON.parse(event.body) : {}
  return schema.parse(rawBody)
}
