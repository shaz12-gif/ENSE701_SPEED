import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Andrew Koves
 * 20126313
 * SPEED Group 3
 *
 * This is a DTO (Data Transfer Object) for creating an article
 * It defines what data is needed when someone creates a new article
 * It validates the data with Decorators (@) and defines what is required and what is not.
 */
export class CreateArticleDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  authors: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  journal: string;

  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  @Transform(({ value }) => parseInt(value, 10))
  year: number;

  @IsOptional()
  @IsString()
  volume?: string;

  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsString()
  pages?: string;

  @IsOptional()
  @IsString()
  doi?: string;
}
