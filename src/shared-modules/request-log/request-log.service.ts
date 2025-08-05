import { Injectable } from '@nestjs/common';
import { RequestLogRepository } from './entities/request-log.repository';
import { CreateRequestDto } from './dtos/create-request.dto';
import { UpdateRequestDto } from './dtos/update-request.dto';

@Injectable()
export class RequestLogService {
  constructor(private readonly requestLogRepository: RequestLogRepository) {}

  async create(createRequestDto: CreateRequestDto) {
    const newRequest = this.requestLogRepository.create(createRequestDto);
    const request = await this.requestLogRepository.save(newRequest);

    return request;
  }

  async update(id: number, updateRequestDto: UpdateRequestDto) {
    await this.requestLogRepository.update(id, updateRequestDto);
  }
}
