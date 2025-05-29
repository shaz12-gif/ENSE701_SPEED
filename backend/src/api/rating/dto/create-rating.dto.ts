import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsEnum,
} from 'class-validator';

export class CreateRatingDto {
  @IsNotEmpty()
  @IsString()
  contentId: string;

  @IsOptional()
  @IsEnum(['article', 'evidence'])
  contentType?: string = 'article';

  @IsOptional()
  @IsString()
  userId?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  value: number;
}
