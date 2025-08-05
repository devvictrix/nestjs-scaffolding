import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRequestDto {
  @IsNotEmpty()
  @IsString()
  path: string;

  @IsNotEmpty()
  @IsString()
  method: string;

  @IsOptional()
  @IsString()
  header?: string;

  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  response?: string;

  @IsString()
  ipAddress: string;

  @IsOptional()
  @IsString()
  referer?: string;

  @IsString()
  userAgent: string;
}
