import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { JobType } from '../entities/job.entity'
import { ApiProperty } from '@nestjs/swagger'

export class CreateJobDto {
  @ApiProperty({
    description: 'Job title',
    example: 'Senior Software Engineer',
    type: String,
  })
  @IsString()
  title: string

  @ApiProperty({
    description: 'Job description',
    example: 'We are looking for a senior software engineer...',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({
    description: 'Job location',
    example: 'New York, NY',
    type: String,
  })
  @IsString()
  location: string

  @ApiProperty({
    description: 'Minimum salary for the position',
    example: 80000,
    type: Number,
  })
  @IsNumber()
  minSalary: number

  @ApiProperty({
    description: 'Maximum salary for the position',
    example: 120000,
    type: Number,
  })
  @IsNumber()
  maxSalary: number

  @ApiProperty({
    description: 'Type of job',
    enum: JobType,
    example: JobType.FULL_TIME,
  })
  @IsEnum(JobType)
  jobType: JobType

  @ApiProperty({
    description: 'ID of the employer creating the job',
    example: 1,
    type: Number,
  })
  @IsNumber()
  employerId: number
}
