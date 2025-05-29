import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleStatus } from './article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { ModerateArticleDto } from './dto/moderate-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const newArticle = new this.articleModel({
      ...createArticleDto,
      status: 'pending',
    });
    return await newArticle.save();
  }

  async findAll(status?: ArticleStatus): Promise<Article[]> {
    const query = status ? { status } : {};
    return this.articleModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    return article;
  }

  async moderate(
    id: string,
    moderateArticleDto: ModerateArticleDto,
  ): Promise<Article> {
    const article = await this.findOne(id);

    if (article.status !== 'pending') {
      throw new Error(`Article with ID ${id} has already been moderated`);
    }

    article.status = moderateArticleDto.status;
    article.moderatorId = moderateArticleDto.moderatorId;
    article.moderationDate = new Date();
    article.moderationNotes = moderateArticleDto.moderationNotes;

    return article.save();
  }

  async findByIds(ids: string[]): Promise<Article[]> {
    return this.articleModel.find({ _id: { $in: ids } }).exec();
  }
}
