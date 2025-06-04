import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { Article, ArticleSchema } from './article.schema';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
/**
 * Andrew Koves
 * 20126313
 * SPEED Group 3
 *
 * This is a module
 * Modules group all relevant and related files and functions together
 * This one also imports multer to upload files
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Article.name,
        schema: ArticleSchema,
        collection: process.env.ARTICLES_COLLECTION || 'articles',
      },
    ]),
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit for BibTeX files
      },
    }),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {
  constructor() {
    console.log(
      'ArticleModule initialized with collection:',
      process.env.ARTICLES_COLLECTION || 'articles',
    );
  }
}
