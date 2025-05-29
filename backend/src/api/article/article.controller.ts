import { Controller, Post, Body, Get } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async create(@Body() data: any) {
    return this.articleService.create(data);
  }

  @Get()
  async findAll() {
    return this.articleService.findAll();
  }
}
