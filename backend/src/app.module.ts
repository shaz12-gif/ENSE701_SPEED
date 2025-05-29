/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './api/upload/upload.module';
import { ArticleModule } from './api/article/article.module';
import { EvidenceModule } from './api/evidence/evidence.module';
import { ModerationModule } from './api/moderation/moderation.module';
import { RatingModule } from './api/rating/rating.module';
import { SearchModule } from './api/search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URI, {
      dbName: process.env.DB_NAME,
    }),
    UploadModule,
    ArticleModule,
    EvidenceModule,
    ModerationModule,
    RatingModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
