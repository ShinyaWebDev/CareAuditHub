export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

export function notFound(resource: string, id: string) {
  return new HttpError(404, `${resource} not found`, { id })
}
