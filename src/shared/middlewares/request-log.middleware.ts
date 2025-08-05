import {
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CreateRequestDto } from 'src/shared-modules/request-log/dtos/create-request.dto';
import { RequestLogService } from 'src/shared-modules/request-log/request-log.service';
import { filterAndTruncateStringify } from '../helpers/string.helper';

@Injectable()
export class RequestLogMiddleware implements NestMiddleware {
  constructor(private readonly requestLogService: RequestLogService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    req['START_TIME'] = Date.now();

    const createRequestDto = new CreateRequestDto();
    createRequestDto.path = req.path;
    createRequestDto.method = req.method;
    createRequestDto.header = filterAndTruncateStringify(req.headers);
    createRequestDto.query = filterAndTruncateStringify(req.query);
    createRequestDto.body = filterAndTruncateStringify(req.body);
    createRequestDto.ipAddress = req.ip;
    createRequestDto.userAgent = req.headers['user-agent'] || 'unknown';
    createRequestDto.referer = req.headers.referer;

    try {
      const requestLog = await this.requestLogService.create(createRequestDto);
      req['REQUEST_LOG_ID'] = requestLog.id;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create request log: ${error}`,
      );
    }

    next();
  }
}
