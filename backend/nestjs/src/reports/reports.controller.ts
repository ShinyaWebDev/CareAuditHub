import { Controller, Get, Param, Post } from '@nestjs/common'
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
  validateReport(@Param('id') id: string) {
    return this.reportsService.validateReportById(id)
  }
}
