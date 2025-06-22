import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { UserWithoutPassword } from 'src/users/user.entity'
import { JwtService } from '@nestjs/jwt'
import { SignupDto } from './dto/signup.dto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.confirmUsernameAndPassword(
      username,
      password,
    )
    return user
  }

  login(user: UserWithoutPassword) {
    const payload = { id: user.id }
    return {
      id: user.id,
      access_token: this.jwtService.sign(payload),
    }
  }

  async signup(signupDto: SignupDto) {
    await this.usersService.create(signupDto)
  }
}
