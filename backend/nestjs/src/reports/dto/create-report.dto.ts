import { IsArray, IsDateString, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class CreateReportEvidenceDto {
  @IsString()
  @MinLength(1)
  name!: string

  @IsString()
  @MinLength(1)
  source!: string
}

export class CreateReportDto {
  @IsString()
  @MinLength(1)
  name!: string

  @IsString()
  @MinLength(1)
  reportingPeriod!: string

  @IsString()
  @MinLength(1)
  facility!: string

  @IsDateString()
  dueDate!: string

  @IsString()
  @MinLength(1)
  owner!: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReportEvidenceDto)
  @IsOptional()
  evidenceItems?: CreateReportEvidenceDto[]
}
