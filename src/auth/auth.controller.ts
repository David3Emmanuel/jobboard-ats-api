import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { UserWithoutPassword } from 'src/users/user.entity'
import { LocalAuthGuard } from 'src/common/guards'
import { AuthService } from './auth.service'
import { SignupDto } from './dto/signup.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: { user: UserWithoutPassword }) {
    return this.authService.login(req.user)
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    await this.authService.signup(signupDto)
    return { message: 'User created successfully' }
  }
}
