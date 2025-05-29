import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export class ModerateArticleDto {
  @IsNotEmpty()
  @IsEnum(['approved', 'rejected'])
  status: 'approved' | 'rejected';

  @IsNotEmpty()
  @IsString()
  moderatorId: string;

  @IsOptional()
  @IsString()
  moderationNotes?: string;
}
