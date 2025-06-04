/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * Andrew Koves
 * 20126313
 * SPEED Group 3
 *
 * This is a controller for handling HTTP requests
 */
import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  Query,
  NotFoundException,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ModerateArticleDto } from './dto/moderate-article.dto';
import { handleApiError } from '../../utils/error-handling';
import { ArticleStatus } from './article.schema';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  /**
   * Submit a new article
   * @param createArticleDto Article data
   * @returns The created article
   */
  @Post()
  @UseInterceptors(FileInterceptor('bibFile'))
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFile() bibFile: Express.Multer.File,
    @Body('submissionType') submissionType: string,
  ) {
    try {
      if (bibFile && submissionType === 'bibtex') {
        // BibTeX upload
        const bibContent = bibFile.buffer.toString('utf8');
        return this.articleService.createWithBibTeX(bibContent);
      } else {
        // Regular form submission
        return this.articleService.create(createArticleDto);
      }
    } catch (error) {
      throw new BadRequestException(
        `Failed to create article: ${error.message}`,
      );
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
