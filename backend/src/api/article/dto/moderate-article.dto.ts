import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { ArticleStatus } from '../article.schema';

/**
 * DTO for moderating an article
 */
export class ModerateArticleDto {
  @IsNotEmpty()
  @IsEnum(ArticleStatus)
  status: ArticleStatus;

  @IsNotEmpty()
  @IsString()
  moderatorId: string;

  @IsOptional()
  @IsString()
  moderationNotes?: string;
}
