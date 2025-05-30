import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

/**
 * Data transfer object for creating a new article
 */
export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  authors: string;

  @IsNotEmpty()
  @IsString()
  journal: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1) // Allow current year +1 for pre-prints
  year: number;

  @IsOptional()
  @IsString()
  doi?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  abstract?: string;

  @IsOptional()
  @IsString()
  submittedBy?: string;
}
