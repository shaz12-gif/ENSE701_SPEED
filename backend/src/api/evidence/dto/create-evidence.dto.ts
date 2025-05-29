import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ResultType, ResearchType, ParticipantType } from '../evidence.schema';

export class CreateEvidenceDto {
  @IsNotEmpty()
  @IsString()
  articleId: string;

  @IsNotEmpty()
  @IsString()
  practiceId: string;

  @IsNotEmpty()
  @IsString()
  claim: string;

  @IsNotEmpty()
  @IsBoolean()
  supportsClaim: boolean;

  @IsOptional()
  @IsEnum(['agree', 'disagree', 'mixed'])
  result?: ResultType;

  @IsOptional()
  @IsEnum(['case study', 'experiment', 'survey', 'literature review', 'other'])
  typeOfResearch?: ResearchType;

  @IsOptional()
  @IsEnum(['students', 'professionals', 'mixed', 'other'])
  participantType?: ParticipantType;

  @IsOptional()
  @IsString()
  analyst?: string;

  @IsOptional()
  @IsString()
  analystComments?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
