/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { ModerationService } from './moderation.service';

@Controller('api/moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Get('queue')
  async getQueue() {
    const articles = await this.moderationService.getQueuedArticles();
    return {
      success: true,
      data: articles,
    };
  }

  @Put(':id/approve')
  async approveArticle(
    @Param('id') id: string,
    @Body() body: { moderatorId: string; notes?: string },
  ) {
    const article = await this.moderationService.approveArticle(
      id,
      body.moderatorId,
      body.notes,
    );
    return {
      success: true,
      data: article,
    };
  }

  @Put(':id/reject')
  async rejectArticle(
    @Param('id') id: string,
    @Body() body: { moderatorId: string; notes?: string },
  ) {
    const article = await this.moderationService.rejectArticle(
      id,
      body.moderatorId,
      body.notes,
    );
    return {
      success: true,
      data: article,
    };
  }
}
