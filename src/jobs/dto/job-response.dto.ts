import { ApiProperty } from '@nestjs/swagger'
import { JobType } from '../entities/job.entity'
import { UserResponseDto } from '../../auth/dto/auth-response.dto'

export class JobResponseDto {
  @ApiProperty({ description: 'Job ID' })
  id: number

  @ApiProperty({ description: 'Date when job was posted' })
  datePosted: Date

  @ApiProperty({ description: 'Job title' })
  title: string

  @ApiProperty({ description: 'Job description', required: false })
  description?: string

  @ApiProperty({ description: 'Job location' })
  location: string

  @ApiProperty({ description: 'Minimum salary' })
  minSalary: number

  @ApiProperty({ description: 'Maximum salary' })
  maxSalary: number

  @ApiProperty({ description: 'Type of job', enum: JobType })
  jobType: JobType

  @ApiProperty({ description: 'Employer information', type: UserResponseDto })
  employer: UserResponseDto
}

export class JobListResponseDto {
  @ApiProperty({ description: 'List of jobs', type: [JobResponseDto] })
  jobs: JobResponseDto[]

  @ApiProperty({ description: 'Total number of jobs' })
  totalJobs: number

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number

  @ApiProperty({ description: 'Current page number' })
  currentPage: number

  @ApiProperty({ description: 'Whether there is a next page' })
  hasNextPage: boolean
}
