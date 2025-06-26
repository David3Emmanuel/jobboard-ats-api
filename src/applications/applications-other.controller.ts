import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/common'
import { ApplicationsService } from './applications.service'
import { UserWithoutPassword } from 'src/users/user.entity'
import { ApiTags, ApiResponse } from '@nestjs/swagger'
import { ApplicationResponseDto } from './dto/application-response.dto'

@ApiTags('Applications')
@Controller()
@UseGuards(JwtAuthGuard)
export class ApplicationsOtherController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get('jobs/:jobId/applications')
  @ApiResponse({
    status: 200,
    description: 'List all applications for a job.',
    type: [ApplicationResponseDto],
  })
  findApplications(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Request() req: { user: UserWithoutPassword },
  ) {
    return this.applicationsService.findApplications(jobId, req.user)
  }

  @Get('my-applications')
  @ApiResponse({
    status: 200,
    description: 'List all applications for the current user.',
    type: [ApplicationResponseDto],
  })
  findMyApplications(@Request() req: { user: UserWithoutPassword }) {
    return this.applicationsService.findMyApplications(req.user)
  }
}
