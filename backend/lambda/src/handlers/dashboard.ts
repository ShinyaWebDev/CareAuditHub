import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { getDashboardData } from '../services/dashboardService'
import { errorResponse, jsonResponse } from '../utils/response'

export const getDashboard: APIGatewayProxyHandlerV2 = async () => {
  try {
    const dashboard = await getDashboardData()
    return jsonResponse(dashboard)
  } catch (error) {
    return errorResponse(error)
  }
}
