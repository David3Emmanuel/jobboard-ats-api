import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
  ForbiddenException,
  Query,
} from '@nestjs/common'
import { JobsService } from './jobs.service'
import { CreateJobDto } from './dto/create-job.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { JwtAuthGuard } from 'src/common/guards'
import { UserRole, UserWithoutPassword } from 'src/users/user.entity'
import { ListJobsDto } from './dto/list-jobs.dto'

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createJobDto: CreateJobDto,
    @Request() req: { user: UserWithoutPassword },
  ) {
    if (req.user.role !== UserRole.EMPLOYER)
      throw new ForbiddenException('Only employers can update jobs')

    return this.jobsService.create(createJobDto)
  }

  @Get()
  async findAll(@Query() listJobsDto: ListJobsDto) {
    return this.jobsService.findAll(listJobsDto)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.jobsService.findOne(+id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Request() req: { user: UserWithoutPassword },
  ) {
    if (req.user.role !== UserRole.EMPLOYER)
      throw new ForbiddenException('Only employers can update jobs')

    return this.jobsService.update(+id, updateJobDto, req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @Request() req: { user: UserWithoutPassword },
  ) {
    if (req.user.role !== UserRole.EMPLOYER)
      throw new ForbiddenException('Only employers can delete jobs')

    return this.jobsService.remove(+id, req.user.id)
  }
}
