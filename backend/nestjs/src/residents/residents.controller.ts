import { Controller, Get, Param } from '@nestjs/common'
import { ResidentsService } from './residents.service'

@Controller('residents')
export class ResidentsController {
  constructor(private readonly residentsService: ResidentsService) {}

  @Get()
  getResidents() {
    return this.residentsService.getResidents()
  }

  @Get(':id')
  getResident(@Param('id') id: string) {
    return this.residentsService.getResidentById(id)
  }
}
