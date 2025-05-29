import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticleService } from '../article/article.service';
import { ModerateArticleDto } from '../article/dto/moderate-article.dto';
import { Moderation } from './moderation.schema';

@Injectable()
export class ModerationService {
  constructor(
    @InjectModel(Moderation.name) private moderationModel: Model<Moderation>,
    private readonly articleService: ArticleService,
  ) {}

  async getQueuedArticles() {
    return this.articleService.findAll('pending');
  }

  async approveArticle(id: string, moderatorId: string, notes?: string) {
    const moderateDto: ModerateArticleDto = {
      status: 'approved',
      moderatorId,
      moderationNotes: notes,
    };

    // Record the moderation action
    await this.moderationModel.create({
      articleId: id,
      moderatorId,
      action: 'approved',
      notes,
    });

    return this.articleService.moderate(id, moderateDto);
  }

  async rejectArticle(id: string, moderatorId: string, notes?: string) {
    const moderateDto: ModerateArticleDto = {
      status: 'rejected',
      moderatorId,
      moderationNotes: notes,
    };

    // Record the moderation action
    await this.moderationModel.create({
      articleId: id,
      moderatorId,
      action: 'rejected',
      notes,
    });

    return this.articleService.moderate(id, moderateDto);
  }
}
