import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiTags, ApiResponse, ApiProperty } from '@nestjs/swagger'

class WelcomeMessage {
  @ApiProperty({ description: 'The welcome message' })
  message: string
}

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns a welcome message.',
    type: WelcomeMessage,
  })
  getHello() {
    return this.appService.getHello()
  }
}
