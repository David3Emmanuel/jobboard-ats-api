import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { UserWithoutPassword } from 'src/users/user.entity'
import { LocalAuthGuard } from 'src/common/guards'
import { AuthService } from './auth.service'
import { SignupDto } from './dto/signup.dto'
import { ApiTags, ApiResponse, ApiConsumes } from '@nestjs/swagger'
import { LoginResponseDto, SignupResponseDto } from './dto/auth-response.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiConsumes('application/json')
  @ApiResponse({
    status: 201,
    description: 'User logged in successfully.',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  login(@Request() req: { user: UserWithoutPassword }) {
    return this.authService.login(req.user)
  }

  @Post('signup')
  @ApiConsumes('application/json')
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    type: SignupResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async signup(@Body() signupDto: SignupDto) {
    await this.authService.signup(signupDto)
    return { message: 'User created successfully' }
  }
}
