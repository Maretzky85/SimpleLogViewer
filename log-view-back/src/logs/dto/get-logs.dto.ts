import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LogLevel } from '../types';

export class GetLogsQuery {
  @ApiPropertyOptional({
    description: 'Cursor for pagination (composite cursor)',
    example: '1759166711000_256',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({
    description: 'Max number of logs to return',
    example: 100,
    default: 100,
  })
  @IsOptional({})
  @Type(() => Number)
  @IsInt()
  limit?: number = 100;

  @ApiPropertyOptional({
    description: 'Comma-separated log levels',
    example: 'error,warn',
    enum: LogLevel,
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value;
    return value
      .split(',')
      .filter(Boolean)
      .map((v) => v.trim().toLowerCase());
  })
  @IsArray()
  @IsEnum(LogLevel, { each: true })
  levels?: string[];

  @ApiPropertyOptional({
    description: 'Start timestamp (ms)',
    example: 1759170311000,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  dateFrom?: number;

  @ApiPropertyOptional({
    description: 'End timestamp (ms)',
    example: 1759179999000,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  dateTo?: number;
}
