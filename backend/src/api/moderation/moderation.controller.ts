/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { handleApiError } from '../../utils/error-handling';

@Controller('api/moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Get('queue')
  async getQueue(): Promise<any> {
    try {
      const articles = await this.moderationService.getQueue();
      return {
        success: true,
        data: articles,
      };
    } catch (error) {
      throw handleApiError(error, 'ModerationController.getQueue');
    }
  }

  @Put(':id/approve')
  async approveArticle(
    @Param('id') id: string,
    @Body() body: { moderatorId: string; notes?: string },
  ): Promise<any> {
    try {
      const article = await this.moderationService.approveArticle(
        id,
        body.moderatorId,
        body.notes,
      );

      return {
        success: true,
        message: `Article ${id} approved successfully`,
        data: article,
      };
    } catch (error) {
      throw handleApiError(error, 'ModerationController.approveArticle');
    }
  }

  @Put(':id/reject')
  async rejectArticle(
    @Param('id') id: string,
    @Body() body: { moderatorId: string; notes: string },
  ): Promise<any> {
    try {
      // Notes are required for rejection
      if (!body.notes || !body.notes.trim()) {
        return {
          success: false,
          message: 'Rejection reason is required',
        };
      }

      const article = await this.moderationService.rejectArticle(
        id,
        body.moderatorId,
        body.notes,
      );

      return {
        success: true,
        message: `Article ${id} rejected successfully`,
        data: article,
      };
    } catch (error) {
      throw handleApiError(error, 'ModerationController.rejectArticle');
    }
  }
}
