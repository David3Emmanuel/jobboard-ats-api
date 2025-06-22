import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateJobDto {
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsString()
  location: string

  @IsNumber()
  minSalary: number

  @IsNumber()
  maxSalary: number

  @IsString()
  jobType: string

  @IsNumber()
  employerId: number
}
