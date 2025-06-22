import { IsEnum, IsOptional, IsString } from 'class-validator'
import { UserRole } from '../user.entity'

export class CreateUserDto {
  @IsString()
  username: string

  @IsString()
  password: string

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole
}
