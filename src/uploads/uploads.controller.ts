import { Controller, Get, Param } from '@nestjs/common'
import { UploadsService } from './uploads.service'
import { ApiTags, ApiResponse } from '@nestjs/swagger'
import { ApiProperty } from '@nestjs/swagger'

class FileResponseDto {
  @ApiProperty({ description: 'File content or download link' })
  file: any
}

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get(':filename')
  @ApiResponse({
    status: 200,
    description: 'Get an uploaded file by filename.',
    type: FileResponseDto,
  })
  getUpload(@Param('filename') filename: string) {
    return this.uploadsService.getUpload(filename)
  }
}
