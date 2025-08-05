// HttpExceptionFilter is a more specific type of filter which is used to handle exceptions derived from the HttpException class.
// If you're throwing custom errors in your application that extend HttpException, this filter would catch those.
// This filter won't handle other JavaScript exceptions like TypeError or RangeError that are not instances of HttpException.
// Todo: Used at the Controller level.

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
