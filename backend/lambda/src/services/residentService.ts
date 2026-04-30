import { asc, eq } from 'drizzle-orm'
import { db } from '../db/client'
import { residents } from '../db/schema'
import { notFound } from '../utils/errors'

export async function getResidents() {
  const rows = await db.select().from(residents).orderBy(asc(residents.residentId))

  return {
    residents: rows,
    metrics: {
      residentsInView: rows.length,
      missingDocuments: rows.reduce((total, resident) => total + resident.missingDocuments.length, 0),
      highOrCriticalRisk: rows.filter(resident => ['High', 'Critical'].includes(resident.riskLevel)).length,
      compliantRecords: rows.filter(resident => resident.complianceStatus === 'Compliant').length,
    },
    filters: {
      facilities: Array.from(new Set(rows.map(resident => resident.facility))).sort(),
      riskLevels: ['Critical', 'High', 'Medium', 'Low'],
      complianceStatuses: ['Compliant', 'Review due', 'Documents missing', 'Pending review'],
    },
  }
}

export async function getResidentById(id: string) {
  const [resident] = await db.select().from(residents).where(eq(residents.residentId, id)).limit(1)

  if (!resident) {
    throw notFound('Resident', id)
  }

  return resident
}
