import { NotFoundException } from '@nestjs/common'

export function notFound(resource: string, id: string): never {
  throw new NotFoundException({
    error: {
      message: `${resource} not found`,
      details: { id },
    },
  })
}
