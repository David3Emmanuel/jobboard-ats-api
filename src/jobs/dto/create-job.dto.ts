import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { JobType } from '../entities/job.entity'

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

  @IsEnum(JobType)
  jobType: JobType

  @IsNumber()
  employerId: number
}
