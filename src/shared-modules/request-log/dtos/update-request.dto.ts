import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateRequestDto {
  @IsNotEmpty()
  @IsString()
  statusCode: number;

  @IsNotEmpty()
  @IsString()
  duration: string;

  @IsOptional()
  @IsString()
  response?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  stack?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
