import { apiConfig, isApiConfigured } from '@/config/api'

export class HttpClientError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'HttpClientError'
  }
}

type RequestOptions = {
  timeoutMs?: number
  headers?: HeadersInit
}

async function getAuthHeaders(): Promise<HeadersInit> {
  if (apiConfig.authMode === 'none') return {}

  // Future hook: read Cognito/JWT token from an auth store and inject it here.
  return {}
}

async function request<T>(path: string, init: RequestInit = {}, options: RequestOptions = {}): Promise<T> {
  if (!isApiConfigured) {
    throw new HttpClientError('API base URL is not configured')
  }

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), options.timeoutMs ?? apiConfig.timeoutMs)
  const authHeaders = await getAuthHeaders()

  try {
    const response = await fetch(`${apiConfig.baseUrl}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
        ...init.headers,
      },
    })

    const contentType = response.headers.get('content-type') ?? ''
    const payload = contentType.includes('application/json') ? await response.json() : await response.text()

    if (!response.ok) {
      const message = typeof payload === 'object' && payload && 'error' in payload
        ? String((payload as { error?: { message?: string } }).error?.message ?? response.statusText)
        : response.statusText

      throw new HttpClientError(message, response.status, payload)
    }

    return payload as T
  } catch (error) {
    if (error instanceof HttpClientError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new HttpClientError('Request timed out')
    }

    throw new HttpClientError(error instanceof Error ? error.message : 'Network request failed')
  } finally {
    window.clearTimeout(timeout)
  }
}

export const httpClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { method: 'GET' }, options),
  post: <T, TBody = unknown>(path: string, body?: TBody, options?: RequestOptions) =>
    request<T>(
      path,
      {
        method: 'POST',
        body: body === undefined ? undefined : JSON.stringify(body),
      },
      options,
    ),
}
