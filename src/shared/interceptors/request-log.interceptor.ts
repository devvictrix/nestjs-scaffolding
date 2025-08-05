import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestLogService } from 'src/shared-modules/request-log/request-log.service';
import { filterAndTruncateStringify } from '../helpers/string.helper';

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  constructor(private readonly requestLogService: RequestLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - request['START_TIME'];

        this.requestLogService
          .update(request['REQUEST_LOG_ID'], {
            statusCode: response.statusCode,
            response: filterAndTruncateStringify(data),
            duration: duration.toFixed(2),
            userId: request['currentUser']?.userId,
          })
          .catch((error) => {
            throw new InternalServerErrorException(
              `Failed to update request log: ${error}`,
            );
          });
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }
}
