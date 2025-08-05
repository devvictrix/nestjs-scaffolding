import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestLog } from './request-log.entity';

@Injectable()
export class RequestLogRepository extends Repository<RequestLog> {
  constructor(
    @InjectRepository(RequestLog)
    repository: Repository<RequestLog>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findOneById(id: number) {
    if (id === null || id === undefined) {
      throw new BadRequestException('Invalid ID');
    }

    return await this.findOne({
      where: { id: id },
    });
  }
}
