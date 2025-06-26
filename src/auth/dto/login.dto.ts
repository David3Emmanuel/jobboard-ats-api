import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({
    description: 'Username for authentication',
    example: 'john_doe',
    type: String,
  })
  @IsString()
  username: string

  @ApiProperty({
    description: 'Password for authentication',
    example: 'password123',
    type: String,
  })
  @IsString()
  password: string
}
