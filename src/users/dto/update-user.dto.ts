import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'

// Inherits Swagger decorators from CreateUserDto
export class UpdateUserDto extends PartialType(CreateUserDto) {}
