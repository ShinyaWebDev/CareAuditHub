import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../auth/auth.guard'
import { Roles } from '../auth/roles.decorator'
import { ReportsService } from './reports.service'

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  getReports() {
    return this.reportsService.getReports()
  }

  @Get(':id')
  getReport(@Param('id') id: string) {
    return this.reportsService.getReportById(id)
  }

  @Post(':id/validate')
  @UseGuards(AuthGuard)
  @Roles('Admin', 'ComplianceManager')
  validateReport(@Param('id') id: string) {
    return this.reportsService.validateReportById(id)
  }
}
