/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticleService } from '../article/article.service';
import { ArticleStatus } from '../article/article.schema';
import { Moderation, ModerationDocument } from './moderation.schema';

@Injectable()
export class ModerationService {
  constructor(
    @InjectModel(Moderation.name)
    private moderationModel: Model<ModerationDocument>,
    private readonly articleService: ArticleService,
  ) {}

  /**
   * Get all articles pending moderation
   * @returns Array of pending articles
   */
  async getQueue(): Promise<any[]> {
    return this.articleService.findAll(ArticleStatus.PENDING);
  }

  /**
   * Approve an article
   * @param id Article ID
   * @param moderatorId Moderator ID
   * @param notes Optional approval notes
   * @returns The approved article
   */
  async approveArticle(
    id: string,
    moderatorId: string,
    notes?: string,
  ): Promise<any> {
    try {
      // Create moderation record
      await this.moderationModel.create({
        articleId: id,
        moderatorId,
        action: 'approved',
        notes,
      });

      // Update article status
      return await this.articleService.moderate(id, {
        status: ArticleStatus.APPROVED,
        moderatorId,
        moderationNotes: notes,
      });
    } catch (error) {
      console.error(`Error approving article ${id}:`, error);
      throw error;
    }
  }

  /**
   * Reject an article
   * @param id Article ID
   * @param moderatorId Moderator ID
   * @param notes Rejection notes (required)
   * @returns The rejected article
   */
  async rejectArticle(
    id: string,
    moderatorId: string,
    notes: string,
  ): Promise<any> {
    try {
      if (!notes || !notes.trim()) {
        throw new Error('Rejection reason is required');
      }

      // Create moderation record
      await this.moderationModel.create({
        articleId: id,
        moderatorId,
        action: 'rejected',
        notes,
      });

      // Update article status
      return await this.articleService.moderate(id, {
        status: ArticleStatus.REJECTED,
        moderatorId,
        moderationNotes: notes,
      });
    } catch (error) {
      console.error(`Error rejecting article ${id}:`, error);
      throw error;
    }
  }
}
