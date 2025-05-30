/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Body,
  Get,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';

@Controller('api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseInterceptors(FileInterceptor('bibFile'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createArticleDto: any,
  ) {
    try {
      console.log('Received article submission');
      console.log(
        'File:',
        file ? 'Received with name: ' + file.originalname : 'None',
      );
      console.log('Body data:', createArticleDto);

      if (file) {
        // If BibTeX file was provided
        const bibContent = file.buffer.toString('utf-8');
        console.log(
          'BibTeX content preview:',
          bibContent.substring(0, 50) + '...',
        );

        // Try to parse the BibTeX file first to verify it's valid
        try {
          // Print more detailed debugging information
          console.log('File size:', file.size, 'bytes');
          console.log('File MIME type:', file.mimetype);

          // Use the method that doesn't validate required fields
          const result = await this.articleService.createWithBibTeX(
            bibContent,
            createArticleDto,
          );

          return {
            success: true,
            data: result,
            message: 'Article with BibTeX file submitted successfully',
          };
        } catch (bibError) {
          console.error('BibTeX processing error:', bibError);
          throw new BadRequestException({
            message: bibError.message || 'Failed to process BibTeX file',
            details: bibError,
          });
        }
      } else {
        // Standard article creation without file
        const validatedDto = {
          ...createArticleDto,
          year: Number(createArticleDto.year),
        };

        const result = await this.articleService.create(validatedDto);
        return {
          success: true,
          data: result,
          message: 'Article submitted successfully',
        };
      }
    } catch (error) {
      console.error('Error in article controller:', error);
      // Return a more detailed error structure
      throw new BadRequestException({
        message:
          error instanceof Error
            ? error.message
            : 'Failed to process article submission',
        details: error instanceof Error ? error.stack : String(error),
      });
    }
  }

  @Get()
  async findAll(@Query('status') status?: string) {
    try {
      const articles = await this.articleService.findAll(status as any);
      return {
        success: true,
        data: articles,
        message: 'Articles retrieved successfully',
      };
    } catch (error) {
      console.error('Error retrieving articles:', error);
      throw new BadRequestException('Failed to retrieve articles');
    }
  }
}
