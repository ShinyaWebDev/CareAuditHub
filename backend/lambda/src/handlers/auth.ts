import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { login, requireAuth } from '../services/authService'
import { errorResponse, jsonResponse } from '../utils/response'

function parseJsonBody(body: string | undefined) {
  return body ? JSON.parse(body) : {}
}

export const loginUser: APIGatewayProxyHandlerV2 = async event => {
  try {
    return jsonResponse(await login(parseJsonBody(event.body)))
  } catch (error) {
    return errorResponse(error)
  }
}

export const getCurrentUser: APIGatewayProxyHandlerV2 = async event => {
  try {
    const user = await requireAuth(event.headers.authorization)
    return jsonResponse({ user })
  } catch (error) {
    return errorResponse(error)
  }
}
