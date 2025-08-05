import { Module } from '@nestjs/common';
import { RequestLogService } from './request-log.service';
import { RequestLogRepository } from './entities/request-log.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestLog } from './entities/request-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequestLog])],
  controllers: [],
  providers: [RequestLogRepository, RequestLogService],
  exports: [RequestLogService],
})
export class RequestLogModule {}
