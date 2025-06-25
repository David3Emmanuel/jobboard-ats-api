import { Controller, Get, Param } from '@nestjs/common'
import { UploadsService } from './uploads.service'

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get(':filename')
  getUpload(@Param('filename') filename: string) {
    return this.uploadsService.getUpload(filename)
  }
}
