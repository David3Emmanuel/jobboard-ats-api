import { ApiProperty } from '@nestjs/swagger'
import { ApplicationStatus } from '../entities/application.entity'
import { UserResponseDto } from '../../auth/dto/auth-response.dto'
import { JobResponseDto } from '../../jobs/dto/job-response.dto'

export class ApplicationResponseDto {
  @ApiProperty({ description: 'Application ID' })
  id: number

  @ApiProperty({ description: 'Job ID' })
  jobId: number

  @ApiProperty({ description: 'Path to resume file' })
  resumePath: string

  @ApiProperty({ description: 'Path to cover letter file', required: false })
  coverLetterPath?: string

  @ApiProperty({ description: 'Date when application was submitted' })
  submittedAt: Date

  @ApiProperty({ description: 'Application status', enum: ApplicationStatus })
  status: ApplicationStatus

  @ApiProperty({ description: 'Applicant information', type: UserResponseDto })
  applicant: UserResponseDto

  @ApiProperty({ description: 'Job information', type: JobResponseDto })
  job: JobResponseDto
}

export class ApplicationListResponseDto {
  @ApiProperty({
    description: 'List of applications',
    type: [ApplicationResponseDto],
  })
  applications: ApplicationResponseDto[]
}
