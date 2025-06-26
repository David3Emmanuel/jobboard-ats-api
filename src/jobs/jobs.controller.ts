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
  ParseIntPipe,
} from '@nestjs/common'
import { JobsService } from './jobs.service'
import { CreateJobDto } from './dto/create-job.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { JwtAuthGuard } from 'src/common/guards'
import { UserRole, UserWithoutPassword } from 'src/users/user.entity'
import { ListJobsDto } from './dto/list-jobs.dto'
import { ApiTags, ApiResponse, ApiConsumes } from '@nestjs/swagger'
import { JobResponseDto, JobListResponseDto } from './dto/job-response.dto'

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('application/json')
  @ApiResponse({
    status: 201,
    description: 'Job created successfully.',
    type: JobResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Only employers can update jobs.' })
  async create(
    @Body() createJobDto: CreateJobDto,
    @Request() req: { user: UserWithoutPassword },
  ) {
    if (req.user.role !== UserRole.EMPLOYER)
      throw new ForbiddenException('Only employers can update jobs')

    return this.jobsService.create(createJobDto)
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List all jobs.',
    type: JobListResponseDto,
  })
  async findAll(@Query() listJobsDto: ListJobsDto) {
    return this.jobsService.findAll(listJobsDto)
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get a job by ID.',
    type: JobResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Job not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiConsumes('application/json')
  @ApiResponse({
    status: 200,
    description: 'Job updated successfully.',
    type: JobResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Only employers can update jobs.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJobDto: UpdateJobDto,
    @Request() req: { user: UserWithoutPassword },
  ) {
    if (req.user.role !== UserRole.EMPLOYER)
      throw new ForbiddenException('Only employers can update jobs')

    return this.jobsService.update(id, updateJobDto, req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Job deleted successfully.',
    type: JobResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Only employers can delete jobs.' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: UserWithoutPassword },
  ) {
    if (req.user.role !== UserRole.EMPLOYER)
      throw new ForbiddenException('Only employers can delete jobs')

    return this.jobsService.remove(id, req.user.id)
  }
}
