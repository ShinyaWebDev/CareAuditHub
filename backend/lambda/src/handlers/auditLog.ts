import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { getAuditLog } from '../services/auditLogService'
import { errorResponse, jsonResponse } from '../utils/response'

export const listAuditLog: APIGatewayProxyHandlerV2 = async () => {
  try {
    return jsonResponse(await getAuditLog())
  } catch (error) {
    return errorResponse(error)
  }
}
