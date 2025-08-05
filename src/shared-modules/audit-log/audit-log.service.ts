import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLog } from './entities/audit-log.entity';

// ! This service is ready to create a row in the AuditLog table in the database.
// ! However, it should be injected into another service where you want to log the operations.
// ! It provides methods to create audit logs for CREATE, UPDATE, and DELETE actions.

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async create(
    tableName: string,
    recordId: number,
    userId: number,
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    oldValue?: any,
    newValue?: any,
    ipAddress?: string,
  ): Promise<void> {
    const newAuditLog = this.auditLogRepository.create({
      tableName,
      recordId,
      userId,
      action,
      oldValue,
      newValue,
      ipAddress,
    });
    await this.auditLogRepository.save(newAuditLog);
  }

  // async create(createAuditLogDto: CreateAuditLogDto) {
  //   const newAuditLog = this.auditLogRepository.create(createAuditLogDto);
  //   await this.auditLogRepository.save(newAuditLog);
  // }
}
