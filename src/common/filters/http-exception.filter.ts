import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const responseBody =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as { message?: string | string[] })
        : null;

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : Array.isArray(responseBody?.message)
          ? responseBody.message.join(', ')
          : typeof responseBody?.message === 'string'
            ? responseBody.message
            : exception.message;

    response.status(status).json({
      success: false,
      error: {
        statusCode: status,
        message,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
