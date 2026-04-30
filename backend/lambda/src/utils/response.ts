import type { APIGatewayProxyResultV2 } from 'aws-lambda'
import { ZodError } from 'zod'
import { HttpError } from './errors'

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.CORS_ORIGIN ?? '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
}

export function jsonResponse(body: unknown, statusCode = 200): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
}

export function noContent(): APIGatewayProxyResultV2 {
  return {
    statusCode: 204,
    headers: corsHeaders,
  }
}

export function errorResponse(error: unknown): APIGatewayProxyResultV2 {
  if (error instanceof HttpError) {
    return jsonResponse(
      {
        error: {
          message: error.message,
          details: error.details,
        },
      },
      error.statusCode,
    )
  }

  if (error instanceof ZodError) {
    return jsonResponse(
      {
        error: {
          message: 'Validation failed',
          details: error.issues,
        },
      },
      400,
    )
  }

  console.error(error)

  return jsonResponse(
    {
      error: {
        message: 'Internal server error',
      },
    },
    500,
  )
}
