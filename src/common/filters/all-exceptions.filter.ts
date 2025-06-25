import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Internal server error'
    let error = 'Internal Error'

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const responseBody = exception.getResponse()
      if (typeof responseBody === 'object' && responseBody !== null) {
        const { message: responseMessage, error: responseError } =
          responseBody as {
            message?: string
            error?: string
          }
        if (responseMessage) message = responseMessage
        if (responseError) error = responseError
      } else {
        message = responseBody
      }
    } else if (exception instanceof Error) {
      message = exception.message
      this.logger.error(
        `Request ${request.method} ${
          request.url
        } failed with status ${status} and error: ${
          exception instanceof Error ? exception.stack : message
        }`,
      )
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error,
      message,
    })
  }
}
