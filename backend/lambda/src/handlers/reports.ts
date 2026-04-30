import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { requireRole } from '../services/authService'
import { createReport, createReportSchema, getReportById, getReports, validateReportById } from '../services/reportService'
import { errorResponse, jsonResponse } from '../utils/response'
import { parsePathId } from '../utils/validation'

function parseJsonBody(body: string | undefined) {
  return body ? JSON.parse(body) : {}
}

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

export const createNewReport: APIGatewayProxyHandlerV2 = async event => {
  try {
    const user = await requireRole(event.headers.authorization, ['Admin', 'ComplianceManager'])
    const body = createReportSchema.parse(parseJsonBody(event.body))
    return jsonResponse(await createReport(body, user), 201)
  } catch (error) {
    return errorResponse(error)
  }
}

export const validateReport: APIGatewayProxyHandlerV2 = async event => {
  try {
    const user = await requireRole(event.headers.authorization, ['Admin', 'ComplianceManager'])
    const id = parsePathId(event)
    return jsonResponse(await validateReportById(id, user))
  } catch (error) {
    return errorResponse(error)
  }
}
