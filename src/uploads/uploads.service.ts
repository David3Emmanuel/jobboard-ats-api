import { Injectable, StreamableFile } from '@nestjs/common'
import * as path from 'path'
import * as fs from 'fs'

@Injectable()
export class UploadsService {
  getUpload(filename: string) {
    const filePath = path.join(__dirname, '..', '..', 'uploads', filename)
    const file = fs.createReadStream(filePath)
    return new StreamableFile(file)
  }
}
