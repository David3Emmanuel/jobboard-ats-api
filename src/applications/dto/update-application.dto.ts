import { PartialType } from '@nestjs/mapped-types'
import { CreateApplicationDto } from './create-application.dto'

// Inherits Swagger decorators from CreateApplicationDto
export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {}
