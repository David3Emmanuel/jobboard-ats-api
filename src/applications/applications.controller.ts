import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
} from '@nestjs/common'
import { ApplicationsService } from './applications.service'
import { UpdateApplicationDto } from './dto/update-application.dto'
import { JwtAuthGuard } from '../common'
import { UserWithoutPassword } from '../users/user.entity'
import { FileFieldsInterceptor } from '@nestjs/platform-express'

@Controller('apply')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post(':jobId')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'resume', maxCount: 1 },
      { name: 'coverLetter', maxCount: 1 },
    ]),
  )
  create(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Request() req: { user: UserWithoutPassword },
    @UploadedFiles()
    files: {
      resume?: Express.Multer.File[]
      coverLetter?: Express.Multer.File[]
    },
  ) {
    return this.applicationsService.create(
      jobId,
      req.user,
      files.resume,
      files.coverLetter,
    )
  }

  @Get()
  findAll(@Request() req: { user: UserWithoutPassword }) {
    return this.applicationsService.findAll(req.user)
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: UserWithoutPassword },
  ) {
    return this.applicationsService.findOne(id, req.user)
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'resume', maxCount: 1 },
      { name: 'coverLetter', maxCount: 1 },
    ]),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @Request() req: { user: UserWithoutPassword },
    @UploadedFiles()
    files: {
      resume?: Express.Multer.File[]
      coverLetter?: Express.Multer.File[]
    },
  ) {
    return this.applicationsService.update(
      id,
      updateApplicationDto,
      req.user,
      files.resume,
      files.coverLetter,
    )
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: UserWithoutPassword },
  ) {
    return this.applicationsService.remove(id, req.user)
  }
}
