import { Inject, Injectable } from '@nestjs/common'
import { asc, eq } from 'drizzle-orm'
import { DRIZZLE_DB, type DrizzleDb } from '../db/db.provider'
import { residents } from '../db/schema'
import { notFound } from '../common/utils/not-found'

@Injectable()
export class ResidentsService {
  constructor(@Inject(DRIZZLE_DB) private readonly db: DrizzleDb) {}

  async getResidents() {
    const rows = await this.db.select().from(residents).orderBy(asc(residents.residentId))

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

  async getResidentById(id: string) {
    const [resident] = await this.db.select().from(residents).where(eq(residents.residentId, id)).limit(1)

    if (!resident) {
      notFound('Resident', id)
    }

    return resident
  }
}
