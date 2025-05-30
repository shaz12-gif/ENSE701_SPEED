/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ModerateArticleDto } from './dto/moderate-article.dto';
import { handleApiError } from '../../utils/error-handling';
import { ArticleStatus } from './article.schema';

@Controller('api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  /**
   * Submit a new article
   * @param createArticleDto Article data
   * @returns The created article
   */
  @Post()
  async create(@Body() createArticleDto: CreateArticleDto): Promise<any> {
    try {
      const article = await this.articleService.create(createArticleDto);
      return {
        success: true,
        message: 'Article submitted successfully',
        data: article,
      };
    } catch (error) {
      throw handleApiError(error, 'ArticleController.create');
    }
  }

  /**
   * Get all articles with optional status filter
   * @param status Optional status filter
   * @returns List of articles
   */
  @Get()
  async findAll(@Query('status') status?: ArticleStatus): Promise<any> {
    try {
      const articles = await this.articleService.findAll(status);
      return {
        success: true,
        data: articles,
      };
    } catch (error) {
      throw handleApiError(error, 'ArticleController.findAll');
    }
  }

  /**
   * Get a specific article by ID
   * @param id Article ID
   * @returns The article if found
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    try {
      const article = await this.articleService.findOne(id);

      if (!article) {
        throw new NotFoundException(`Article with ID ${id} not found`);
      }

      return {
        success: true,
        data: article,
      };
    } catch (error) {
      throw handleApiError(error, 'ArticleController.findOne');
    }
  }

  /**
   * Update an article (for moderation)
   * @param id Article ID
   * @param moderateDto Moderation data
   * @returns The updated article
   */
  @Put(':id/moderate')
  async moderate(
    @Param('id') id: string,
    @Body() moderateDto: ModerateArticleDto,
  ): Promise<any> {
    try {
      const article = await this.articleService.moderate(id, moderateDto);

      return {
        success: true,
        message: `Article ${moderateDto.status} successfully`,
        data: article,
      };
    } catch (error) {
      throw handleApiError(error, 'ArticleController.moderate');
    }
  }
}
