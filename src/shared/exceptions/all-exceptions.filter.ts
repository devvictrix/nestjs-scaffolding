import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns';

import { EXCEPTION_MESSAGES } from '../utils/messages';
import { RequestLogService } from 'src/shared-modules/request-log/request-log.service';
import { filterAndTruncateStringify } from '../helpers/string.helper';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly configService: ConfigService,
    private readonly requestLogService: RequestLogService,
  ) {}

  private exceptionMessageMap = {
    [HttpStatus.INTERNAL_SERVER_ERROR]: EXCEPTION_MESSAGES.SERVER_ERROR,
    [HttpStatus.NOT_FOUND]: EXCEPTION_MESSAGES.NOT_FOUND,
    [HttpStatus.FORBIDDEN]: EXCEPTION_MESSAGES.FORBIDDEN,
    [HttpStatus.UNAUTHORIZED]: EXCEPTION_MESSAGES.UNAUTHORIZED,
  };

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const isProduction = nodeEnv === 'production';
    const timestamp = new Date();
    let message = this.exceptionMessageMap[status] || exception.message;
    let fieldErrors = [];

    switch (status) {
      case HttpStatus.BAD_REQUEST:
        const responseMessage = exception.getResponse();
        message = exception.message || EXCEPTION_MESSAGES.VALIDATION_ERROR;
        fieldErrors = this.processBadRequest(responseMessage);
        break;
      case HttpStatus.CONFLICT:
        message = exception.message || EXCEPTION_MESSAGES.CONFLICT;
        break;
      default:
        message = isProduction
          ? EXCEPTION_MESSAGES.SERVER_ERROR
          : exception.message || message;
    }

    const newResponse = {
      statusCode: status,
      message,
      fieldErrors,
      timestamp: timestamp.toISOString(),
    };

    await this.logException(request, exception, status, newResponse);

    if (!isProduction) {
      console.error(
        `Error occurred at: ${format(timestamp, 'yyyy-MM-dd HH:mm:ss')}`,
        exception,
      );
    }

    response.status(status).json(newResponse);
  }

  private processBadRequest(responseMessage: any) {
    if (Array.isArray(responseMessage.message)) {
      return responseMessage.message.reduce((acc, msg) => {
        const [fieldName, ...messageParts] = msg.split(' ');
        const message = messageParts.join(' ');
        acc[fieldName] = acc[fieldName] || [];
        acc[fieldName].push(message);
        return acc;
      }, {});
    }
    return [];
  }

  private async logException(
    request: Request,
    exception: any,
    status: number,
    newResponse: any,
  ) {
    const duration = Date.now() - request['START_TIME'];
    const requestLog = {
      statusCode: status,
      duration: duration.toFixed(2),
      response: filterAndTruncateStringify(newResponse),
      message: exception.message,
      stack: exception.stack || null,
      userId: request['currentUser']?.userId,
    };
    if (request['REQUEST_LOG_ID']) {
      await this.requestLogService.update(
        request['REQUEST_LOG_ID'],
        requestLog,
      );
    }
  }
}
