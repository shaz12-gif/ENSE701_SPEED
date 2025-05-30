import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly authors: string;

  @IsNotEmpty()
  @IsString()
  readonly journal: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1900)
  @Max(2100)
  readonly year: number;

  @IsOptional()
  @IsString()
  readonly volume?: string;

  @IsOptional()
  @IsString()
  readonly number?: string;

  @IsOptional()
  @IsString()
  readonly pages?: string;

  @IsOptional()
  @IsString()
  readonly doi?: string;

  @IsOptional()
  @IsString()
  readonly bibTeXSource?: string;
}
