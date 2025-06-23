import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'
import { Job, JobType } from '../entities/job.entity'

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
  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType

  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  location?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minSalary?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxSalary?: number

  // Pagination parameters
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number

  // Sorting parameters
  @IsOptional()
  @IsEnum(SortField)
  sortBy?: SortField

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder
}

export class ListJobsResponse {
  jobs: Job[]
  totalJobs: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
}
