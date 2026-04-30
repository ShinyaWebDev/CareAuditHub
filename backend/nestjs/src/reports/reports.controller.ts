import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../auth/auth.guard'
import { Roles } from '../auth/roles.decorator'
import type { AuthUser } from '../auth/token'
import { CreateReportDto } from './dto/create-report.dto'
import { ReportsService } from './reports.service'

type RequestWithUser = {
  user: AuthUser
}

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

  @Post()
  @UseGuards(AuthGuard)
  @Roles('Admin', 'ComplianceManager')
  createReport(@Body() body: CreateReportDto, @Req() request: RequestWithUser) {
    return this.reportsService.createReport(body, request.user)
  }

  @Post(':id/validate')
  @UseGuards(AuthGuard)
  @Roles('Admin', 'ComplianceManager')
  validateReport(@Param('id') id: string, @Req() request: RequestWithUser) {
    return this.reportsService.validateReportById(id, request.user)
  }
}
