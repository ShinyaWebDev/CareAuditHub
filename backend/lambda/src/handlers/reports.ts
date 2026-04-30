import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { requireRole } from '../services/authService'
import { getReportById, getReports, validateReportById } from '../services/reportService'
import { errorResponse, jsonResponse } from '../utils/response'
import { parsePathId } from '../utils/validation'

export const listReports: APIGatewayProxyHandlerV2 = async () => {
  try {
    return jsonResponse(await getReports())
  } catch (error) {
    return errorResponse(error)
  }
}

export const getReport: APIGatewayProxyHandlerV2 = async event => {
  try {
    const id = parsePathId(event)
    return jsonResponse(await getReportById(id))
  } catch (error) {
    return errorResponse(error)
  }
}

export const validateReport: APIGatewayProxyHandlerV2 = async event => {
  try {
    await requireRole(event.headers.authorization, ['Admin', 'ComplianceManager'])
    const id = parsePathId(event)
    return jsonResponse(await validateReportById(id))
  } catch (error) {
    return errorResponse(error)
  }
}
