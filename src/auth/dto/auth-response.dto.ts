import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '../../users/user.entity'

export class UserResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: number

  @ApiProperty({ description: 'Username' })
  username: string

  @ApiProperty({ description: 'User role', enum: UserRole })
  role: UserRole
}

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  access_token: string

  @ApiProperty({ description: 'User information', type: UserResponseDto })
  user: UserResponseDto
}

export class SignupResponseDto {
  @ApiProperty({ description: 'Success message' })
  message: string
}
