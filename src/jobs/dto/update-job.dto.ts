import { PartialType } from '@nestjs/mapped-types'
import { CreateJobDto } from './create-job.dto'

// Inherits Swagger decorators from CreateJobDto
export class UpdateJobDto extends PartialType(CreateJobDto) {}
