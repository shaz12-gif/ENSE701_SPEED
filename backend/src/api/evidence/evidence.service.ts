/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Evidence } from './evidence.schema';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { ArticleService } from '../article/article.service';

@Injectable()
export class EvidenceService {
  constructor(
    @InjectModel(Evidence.name) private evidenceModel: Model<Evidence>,
    private readonly articleService: ArticleService,
  ) {}

  async create(createEvidenceDto: CreateEvidenceDto): Promise<Evidence> {
    try {
      // Verify article exists and is approved
      const article = await this.articleService.findOne(
        createEvidenceDto.articleId,
      );

      if (article.status !== 'approved') {
        throw new BadRequestException(
          'Evidence can only be added to approved articles',
        );
      }

      // Convert supportsClaim to result if not provided
      if (!createEvidenceDto.result) {
        createEvidenceDto.result = createEvidenceDto.supportsClaim
          ? 'agree'
          : 'disagree';
      }

      // Create and save the evidence
      const newEvidence = new this.evidenceModel(createEvidenceDto);
      return await newEvidence.save();
    } catch (error) {
      console.error('Error in evidence.service.create:', error);
      throw error;
    }
  }

  async findAll(): Promise<Evidence[]> {
    return this.evidenceModel.find().exec();
  }

  async findByArticle(articleId: string): Promise<Evidence[]> {
    return this.evidenceModel.find({ articleId }).exec();
  }

  async findByPractice(practiceId: string): Promise<Evidence[]> {
    return this.evidenceModel.find({ practiceId }).exec();
  }

  async findByClaim(claim: string): Promise<Evidence[]> {
    return this.evidenceModel
      .find({
        claim: { $regex: new RegExp(claim, 'i') },
      })
      .exec();
  }

  async findBySearch(params: {
    practiceId?: string;
    claim?: string;
    result?: string;
    typeOfResearch?: string;
    participantType?: string;
  }): Promise<Evidence[]> {
    const query: any = {};

    if (params.practiceId) query.practiceId = params.practiceId;
    if (params.claim) query.claim = { $regex: new RegExp(params.claim, 'i') };
    if (params.result) query.result = params.result;
    if (params.typeOfResearch) query.typeOfResearch = params.typeOfResearch;
    if (params.participantType) query.participantType = params.participantType;

    return this.evidenceModel.find(query).exec();
  }
}
