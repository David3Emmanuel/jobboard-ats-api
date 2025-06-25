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

@Controller()
@UseGuards(JwtAuthGuard)
export class ApplicationsOtherController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get('jobs/:jobId/applications')
  findApplications(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Request() req: { user: UserWithoutPassword },
  ) {
    return this.applicationsService.findApplications(jobId, req.user)
  }

  @Get('my-applications')
  findMyApplications(@Request() req: { user: UserWithoutPassword }) {
    return this.applicationsService.findMyApplications(req.user)
  }
}
