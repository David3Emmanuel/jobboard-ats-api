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
import { ApiTags, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger'
import { ApplicationResponseDto } from './dto/application-response.dto'
import { ApiProperty } from '@nestjs/swagger'

class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Resume file (PDF, DOC, DOCX)',
    required: false,
  })
  resume?: any

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Cover letter file (PDF, DOC, DOCX)',
    required: false,
  })
  coverLetter?: any
}

@ApiTags('Applications')
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
    description: 'Application files and data',
  })
  @ApiResponse({
    status: 201,
    description: 'Application created successfully.',
    type: ApplicationResponseDto,
  })
  create(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Request() req: { user: UserWithoutPassword },
    @UploadedFiles()
    files?: {
      resume?: Express.Multer.File[]
      coverLetter?: Express.Multer.File[]
    },
  ) {
    return this.applicationsService.create(
      jobId,
      req.user,
      files?.resume,
      files?.coverLetter,
    )
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List all applications for the user.',
    type: [ApplicationResponseDto],
  })
  findAll(@Request() req: { user: UserWithoutPassword }) {
    return this.applicationsService.findAll(req.user)
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get an application by ID.',
    type: ApplicationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Application not found.' })
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
    description: 'Updated application files and data',
  })
  @ApiResponse({
    status: 200,
    description: 'Application updated successfully.',
    type: ApplicationResponseDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @Request() req: { user: UserWithoutPassword },
    @UploadedFiles()
    files?: {
      resume?: Express.Multer.File[]
      coverLetter?: Express.Multer.File[]
    },
  ) {
    return this.applicationsService.update(
      id,
      updateApplicationDto,
      req.user,
      files?.resume,
      files?.coverLetter,
    )
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Application deleted successfully.',
    type: ApplicationResponseDto,
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: UserWithoutPassword },
  ) {
    return this.applicationsService.remove(id, req.user)
  }
}
