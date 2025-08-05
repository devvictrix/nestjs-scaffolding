import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsJSON,
  IsIP,
} from 'class-validator';

export class CreateAuditLogDto {
  @IsString()
  tableName: string;

  @IsNumber()
  recordId: number;

  @IsNumber()
  userId: number;

  @IsEnum(['CREATE', 'UPDATE', 'DELETE'])
  action: string;

  @IsOptional()
  @IsJSON()
  oldValue?: any;

  @IsOptional()
  @IsJSON()
  newValue?: any;

  @IsOptional()
  @IsIP()
  ipAddress?: string;
}
