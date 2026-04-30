import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { requireRole } from '../services/authService'
import { getApiSyncOverview, retryApiSyncConnection } from '../services/apiSyncService'
import { errorResponse, jsonResponse } from '../utils/response'
import { parsePathId } from '../utils/validation'

export const getApiSync: APIGatewayProxyHandlerV2 = async () => {
  try {
    return jsonResponse(await getApiSyncOverview())
  } catch (error) {
    return errorResponse(error)
  }
}

export const retryApiSync: APIGatewayProxyHandlerV2 = async event => {
  try {
    await requireRole(event.headers.authorization, ['Admin'])
    const id = parsePathId(event)
    return jsonResponse(await retryApiSyncConnection(id))
  } catch (error) {
    return errorResponse(error)
  }
}
