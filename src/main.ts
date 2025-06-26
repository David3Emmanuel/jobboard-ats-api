import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters'
import { Logger, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(AppModule)

  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Job Portal API')
    .setDescription('API for the Job Portal')
    .setVersion('1.0')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  const port = process.env.PORT ?? 3001
  await app.listen(port)
  logger.log(`Application is running on port ${port}`)
}

bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error)
  process.exit(1)
})
