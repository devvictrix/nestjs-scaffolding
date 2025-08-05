import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JsonStringToObjectInterceptor implements NestInterceptor {
  constructor(private readonly fields: string[]) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // JSON String to Object parsing
    for (const field of this.fields) {
      try {
        if (typeof request.body[field] === 'string') {
          request.body[field] = JSON.parse(request.body[field]);
        } else if (Array.isArray(request.body[field])) {
          request.body[field] = request.body[field].map((v) => JSON.parse(v));
        }
      } catch (e) {
        throw new BadRequestException(
          `Invalid "${field}" field: must be a valid JSON string`,
        );
      }
    }

    return next.handle();
  }
}
