import { Module } from '@nestjs/common'
import { ApplicationsService } from './applications.service'
import { ApplicationsController } from './applications.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Application } from './entities/application.entity'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import * as path from 'path'
import { ApplicationsOtherController } from './applications-other.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    MulterModule.register({
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]

        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true)
        } else {
          cb(new Error('Only PDF and Word documents are allowed'), false)
        }
      },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9)
          cb(
            null,
            file.fieldname +
              '-' +
              uniqueSuffix +
              path.extname(file.originalname),
          )
        },
      }),
    }),
  ],
  controllers: [ApplicationsController, ApplicationsOtherController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}
