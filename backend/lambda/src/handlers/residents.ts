import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { getResidentById, getResidents } from '../services/residentService'
import { errorResponse, jsonResponse } from '../utils/response'
import { parsePathId } from '../utils/validation'

export const listResidents: APIGatewayProxyHandlerV2 = async () => {
  try {
    return jsonResponse(await getResidents())
  } catch (error) {
    return errorResponse(error)
  }
}

export const getResident: APIGatewayProxyHandlerV2 = async event => {
  try {
    const id = parsePathId(event)
    return jsonResponse(await getResidentById(id))
  } catch (error) {
    return errorResponse(error)
  }
}
