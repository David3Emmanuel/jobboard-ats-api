import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'
import { Job, JobType } from '../entities/job.entity'
import { ApiProperty } from '@nestjs/swagger'

export enum SortField {
  TITLE = 'title',
  LOCATION = 'location',
  MIN_SALARY = 'min-salary',
  MAX_SALARY = 'max-salary',
  JOB_TYPE = 'job-type',
  DATE = 'date',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class ListJobsDto {
  // Filter parameters
  @ApiProperty({ description: 'Type of job', enum: JobType, required: false })
  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType

  @ApiProperty({ description: 'Job title', required: false })
  @IsOptional()
  @IsString()
  title?: string

  @ApiProperty({ description: 'Job location', required: false })
  @IsOptional()
  @IsString()
  location?: string

  @ApiProperty({ description: 'Minimum salary', required: false, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minSalary?: number

  @ApiProperty({ description: 'Maximum salary', required: false, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxSalary?: number

  // Pagination parameters
  @ApiProperty({ description: 'Page number', required: false, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number

  @ApiProperty({
    description: 'Page size limit',
    required: false,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number

  // Sorting parameters
  @ApiProperty({
    description: 'Sort by field',
    enum: SortField,
    required: false,
  })
  @IsOptional()
  @IsEnum(SortField)
  sortBy?: SortField

  @ApiProperty({ description: 'Sort order', enum: SortOrder, required: false })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder
}

export class ListJobsResponse {
  @ApiProperty({ type: [Job] })
  jobs: Job[]
  @ApiProperty({ type: Number })
  totalJobs: number
  @ApiProperty({ type: Number })
  totalPages: number
  @ApiProperty({ type: Number })
  currentPage: number
  @ApiProperty({ type: Boolean })
  hasNextPage: boolean
}
