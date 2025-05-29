/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EvidenceService } from './evidence.service';
import { CreateEvidenceDto } from './dto/create-evidence.dto';

@Controller('api/evidence')
export class EvidenceController {
  constructor(private readonly evidenceService: EvidenceService) {}

  @Post()
  async create(@Body() createEvidenceDto: CreateEvidenceDto) {
    try {
      console.log('Received evidence data:', createEvidenceDto);

      const result = await this.evidenceService.create(createEvidenceDto);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Evidence creation error:', error);
      throw new HttpException(
        {
          success: false,
          message: `Failed to create evidence: ${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll(
    @Query('articleId') articleId?: string,
    @Query('practiceId') practiceId?: string,
    @Query('claim') claim?: string,
    @Query('result') result?: string,
    @Query('typeOfResearch') typeOfResearch?: string,
    @Query('participantType') participantType?: string,
  ) {
    try {
      let evidence;

      if (articleId) {
        evidence = await this.evidenceService.findByArticle(articleId);
      } else if (
        practiceId ||
        claim ||
        result ||
        typeOfResearch ||
        participantType
      ) {
        evidence = await this.evidenceService.findBySearch({
          practiceId,
          claim,
          result,
          typeOfResearch,
          participantType,
        });
      } else {
        evidence = await this.evidenceService.findAll();
      }

      return {
        success: true,
        data: evidence,
      };
    } catch (error) {
      console.error('Evidence fetch error:', error);
      throw new HttpException(
        {
          success: false,
          message: `Failed to fetch evidence: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
