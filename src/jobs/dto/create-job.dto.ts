import { IsDecimal, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateJobDto {
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsString()
  location: string

  @IsDecimal()
  minSalary: number

  @IsDecimal()
  maxSalary: number

  @IsString()
  jobType: string

  @IsNumber()
  employerId: number
}
